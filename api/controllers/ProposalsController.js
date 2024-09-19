import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';
import redisClient from '../utils/redis';

/**
 * proposals controller endpoint
 */
export default class ProposalsController {
  /**
   * postNew - creates a new proposal
   */
  static async postNew(req, res) {
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

    const { price, coverLetter, title, jobId } = req.body;

    if (!price) return res.status(400).json({ error: 'Missing price' });
    if (!coverLetter) return res.status(400).json({ error: 'Missing coverLetter' });
    if (!title) return res.status(400).json({ error: 'Missing title' });
    
    const jobExists = await dbClient.jobsCollection.findOne({
      _id: new ObjectId(jobId)
    });

    if (!jobExists) return res.status(400).json({ error: 'Job does not exist' });

    await dbClient.proposalsCollection.insertOne({
      coverLetter,
      price,
      freelancerId: userId,
      jobId,
      title,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});

    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );
    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    const userProposals = await dbClient.proposalsCollection.find({
      freelancerId: userId
    }).toArray();

    const pendingProposals = userProposals.filter(item => item.status === 'pending');
    const approvedProposals = userProposals.filter(item => item.status === 'approved');

    return res.status(201).json({ pendingProposals, approvedProposals });
  }

  /**
   * getAll - retrieves all proposals belonging to this user
   */
  static async getAll(req, res) {
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

    const usersProposals = await dbClient.proposalsCollection.find({freelancerId: userId}).toArray();

    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});

    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );
    
    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    const approvedProposals = usersProposals.filter(item => item.status === 'approved');
    const pendingProposals = usersProposals.filter(item => item.status === 'pending');

    return res.status(200).json({ pendingProposals, approvedProposals });
  }

  /**
   * deleteJob - delete this job
   */
  static async deleteJob(req, res) {

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

    await dbClient.jobsCollection.deleteOne({_id: new ObjectId(req.params.id)});
    
    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});

    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );
    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    const usersJobs = await dbClient.jobsCollection.find({clientId: userId}).toArray();

    const openJobs = usersJobs.filter(item => item.status === 'open');
    const pendingJobs = usersJobs.filter(item => item.status === 'pending');
    const completedJobs = usersJobs.filter(item => item.status === 'completed');

    return res.status(201).json({ openJobs, pendingJobs, completedJobs });
  }

  /**
   * getAllJobsBySkills - suggests jobs by skills
   */
  static async getAllJobsBySkills(req, res) {
    const accessToken = req.cookies['accessToken'];
    let accessTokenUsername;
    if (accessToken) {
      const secretKey = process.env.SECRETKEY || 'gigagigs';
      const validToken = JWTSecure.verify(accessToken, secretKey);
      if (!validToken) return res.status(401).json({ error: 'Unauthorized'});
      accessTokenUsername = validToken['username'];
      const username = accessTokenUsername;

      //const user = await dbClient.usersCollection.findOne({username});
      //if (!user) return res.status(404).json({ error: 'Not found' });
    }
    const clientId = req.params.userId;
    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(clientId)});
    const skills = user.profile.skills;

    const suggestedJobs = await dbClient.jobsCollection.find({
      skills: { $in: skills },
      clientId: { $ne: clientId }
    }).toArray();
    return res.status(200).json(suggestedJobs);
  }
}
