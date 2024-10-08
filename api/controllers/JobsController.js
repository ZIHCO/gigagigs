import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';
import redisClient from '../utils/redis';

/**
 * job controller endpoint
 */
export default class JobsController {
  /**
   * postNew - creates a new job
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

    const { title, budget, description, skills } = req.body;

    if (!title) return res.status(400).json({ error: 'Missing title' });
    if (!description) return res.status(400).json({ error: 'Missing description' });
    if (!budget) return res.status(400).json({ error: 'Missing budget' });
    if (!skills) return res.status(400).json({error: 'Missing skills'});
    
    const jobExists = await dbClient.jobsCollection.findOne({
      clientId: userId, title, description, skills, budget
    });

    if (jobExists) return res.status(400).json({ error: 'Already exist' });

    await dbClient.jobsCollection.insertOne({
      description,
      budget,
      clientId: userId,
      freelancerId: null,
      title,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      skills,
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

    const usersJobs = await dbClient.jobsCollection.find({
      clientId: new ObjectId(userId)
    }).toArray();

    const openJobs = usersJobs.filter(item => item.status === 'open');
    const pendingJobs = usersJobs.filter(item => item.status === 'pending');
    const completedJobs = usersJobs.filter(item => item.status === 'completed');

    return res.status(201).json({ openJobs, pendingJobs, completedJobs });
  }

  /**
   * getAll - retrieves all jobs belonging to this user
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


    const usersJobs = await dbClient.jobsCollection.find({clientId: userId}).toArray();

    const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});

    const token = JWTSecure.sign({
      username: user.username,
    }, secretKey, {expiresIn: '15m'});

    await redisClient.set(
      `auth_${token}`, user._id.toString(), (60 * 15),
    );
    res.set('Authorization', `Bearer ${token}`);
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');

    const openJobs = usersJobs.filter(item => item.status === 'open');
    const pendingJobs = usersJobs.filter(item => item.status === 'pending');
    const completedJobs = usersJobs.filter(item => item.status === 'completed');

    return res.status(200).json({ openJobs, pendingJobs, completedJobs });
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
   * searchJobs - queries jobs by skill
   */
  static async searchJobs(req, res) {
    const authToken = req.get('Authorization');
    if (authToken) {
      const key = `auth_${authToken.split(' ')[1]}`;
      const userId = await redisClient.get(key);
      if (userId) {
        const secretKey = process.env.SECRETKEY || 'gigagigs';
        const accessToken = authToken.split(' ')[1];
        const validToken = JWTSecure.verify(accessToken, secretKey);
        if (validToken) {
          await redisClient.del(key);
    
          const user = await dbClient.usersCollection.findOne({_id: new ObjectId(userId)});  
    
          const token = JWTSecure.sign({
            username: user.username,
          }, secretKey, {expiresIn: '15m'});
      
          await redisClient.set(
            `auth_${token}`, user._id.toString(), (60 * 15),
          );
          res.set('Authorization', `Bearer ${token}`);
          res.setHeader('Access-Control-Expose-Headers', 'Authorization');
        }
      }
    }

    const pipeline = [];
    const limit = parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page, 10) || 1;
    const skip = (page - 1) * limit;
    const {skill} = req.query;
    const skillArray = [skill];

    pipeline.push({
      $match: {
        skills: { $in: skillArray },
        status: 'open'
      }
    });
    pipeline.push({
      $limit: limit,
    });
    pipeline.push({
      $skip: skip,
    })

    const queryResult = await dbClient.jobsCollection
      .aggregate(pipeline)
      .toArray();
      
    res.status(200).json(queryResult);
  }
}