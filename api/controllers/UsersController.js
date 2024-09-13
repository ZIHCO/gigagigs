import dbClient from '../utils/db';
import sha256 from 'sha256';
import redisClient from '../utils/redis';
import JWTSecure from '../utils/jwt';
import { ObjectId } from 'mongodb';

/**
 * users controller endpoint
 */
export default class UsersController {
  /**
   * postNew - creates a new user in database
   */
  static async postNew(req, res) {
    const { email, password, username } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!username) return res.status(400).json({ error: 'Missing username' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const usernameExist = await dbClient.usersCollection.findOne({ username });
    if (usernameExist) return res.status(400).json({ error: 'Username already exist!' });

    const  emailExist = await dbClient.usersCollection.findOne({ email });
    if (emailExist) return res.status(400).json({ error: 'Email already exist!' });

    const profile = {
      name: '',
      headline: '',
      skills: [],
      rating: 0,
      pfp: null
    };

    await dbClient.usersCollection.insertOne({
      email, password: sha256(password), username, profile,
      createdAt: new Date(), updatedAt: new Date()
    });
    return res.status(201).json({ message: `${username} has been created. Login to continue.` });
  }

  /**
   * putPfp - updates the users profile picture
   */
  static async putPfp(req, res) {
    const authToken = req.get('Authorization');

    if (!authToken) return res.status(401).json({error: 'Unauthorized'});

    const key = `auth_${authToken.split(' ')[1]}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    const secretKey = process.env.SECRETKEY || 'gigagigs';
    const accessToken = authToken.split(' ')[1];
    const validToken = JWTSecure.verify(accessToken, secretKey);
    if (!validToken) return res.status(401).json({ error: 'Unauthorized'});

    await redisClient.del(key);

    const { file } = req;

    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});
    if (!user) return res.status(401).json({error: 'Unauthorized'});
  
    const profile = user['profile'];

    const filePath = file.path;
    const fileURL = `${req.protocol}://${req.get('host')}/${filePath}`;
    
    Object.assign(profile, {pfp: fileURL});

    await dbClient.usersCollection.updateOne(
      {_id: new ObjectId(userId)}, {
        $set: {profile: profile, updatedAt: new Date()
        },
      });

    const updatedUser = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});
    delete updatedUser.password;
    delete user.email;

    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );
    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    delete user._id;

    return res.status(200).json({...updatedUser});
  }
}
