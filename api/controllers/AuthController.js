import sha256 from 'sha256';
import JWTSecure from '../utils/jwt';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { ObjectId  } from 'mongodb';

/**
 * authentication endpoints
 */
export default class AuthController {
  /**
   * login
   */
  static async postConnect(req, res) {
    const { username, password } = req.body;
    const user = await dbClient.usersCollection.findOne({
      username,
    });

    if (!user) return res.status(404).json({ error: 'User not found!' });
    if (user.password !== sha256(password)) return res.status(400).json({
      error: 'Wrong password'
    });

    const secretKey = process.env.SECRETKEY || 'gigagigs';
    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );

    delete user.password;
    delete user.email;

    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    const pipeline = [];

    if (user.profile.skills) {
      pipeline.push({
        $match: {
          skills: { $in: user.profile.skills },
          clientId: { $ne: user._id.toString() },
          status: 'open'
        }
      });
      pipeline.push({
        $limit: 10,
      });
    }

    const recommendedJobs = await dbClient.jobsCollection
      .aggregate(pipeline)
      .toArray();

    delete user._id;

    return res.status(200).json({currentUser: user, recommendedJobs});
  }

  /**
   * logout
   */
  static async getDisconnect(req, res) {
    const authToken = req.get('Authorization');

    if (!authToken) return res.status(401).json({error: 'Unauthorized'});

    const key = `auth_${authToken.split(' ')[1]}`;
    const userId = await redisClient.get(key);
    if (!userId) return res.status(401).json({error: 'Unauthorized'});

    await redisClient.del(key);

    return res.status(204).json();
  }
}
