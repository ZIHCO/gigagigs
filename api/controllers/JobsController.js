import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import JWTSecure from '../utils/jwt';

/**
 * job controller endpoint
 */
export default class JobsController {
  /**
   * postNew - creates a new job
   */
  static async postNew(req, res) {
    const accessToken = req.cookies['accessToken'];
    let accessTokenUsername;
    if (accessToken) {
      const secretKey = process.env.SECRETKEY || 'gigagigs';
      const validToken = JWTSecure.verify(accessToken, secretKey);
      if (!validToken) return res.status(401).json({ error: 'Unauthorized'});
      accessTokenUsername = validToken['username'];
    }

    const username = accessTokenUsername || req.body.username;
    const user = await dbClient.usersCollection.findOne({username});
    if (!user) return res.status(404).json({ error: 'Not found' });
 
    const { title, budget, description, clientId, skills } = req.body;
    const jobExists = await dbClient.jobsCollection.findOne({
      clientId, title, description, skills, budget
    });

    if (jobExists) return res.status(400).json({ error: 'Already exist' });
    if (!title) return res.status(400).json({ error: 'Missing title' });
    if (!description) return res.status(400).json({ error: 'Missing description' });
    if (!budget) return res.status(400).json({ error: 'Missing budget' });

    const newJob = await dbClient.jobsCollection.insertOne({
      description,
      budget,
      clientId,
      freelancerId: null,
      title,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      skills,
    });
    return res.status(201).json({ message: `Job ${title}, created successfully` });
  }

  /**
   * getAll - retrieves all jobs belonging to this user
   */
  static async getAll(req, res) {
    const accessToken = req.cookies['accessToken'];
    let accessTokenUsername;
    if (accessToken) {
      const secretKey = process.env.SECRETKEY || 'gigagigs';
      const validToken = JWTSecure.verify(accessToken, secretKey);
      if (!validToken) return res.status(401).json({ error: 'Unauthorized'});
      accessTokenUsername = validToken['username'];
      const username = accessTokenUsername;

      const user = await dbClient.usersCollection.findOne({username});
      if (!user) return res.status(404).json({ error: 'Not found' });
    }
    const usersJobs = await dbClient.jobsCollection.find({clientId: req.params.userId}).toArray();
    return res.status(200).json(usersJobs);
  }

  /**
   * deleteJob - delete this job
   */
  static async deleteJob(req, res) {
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

    const clientId = await dbClient.jobsCollection.findOne({_id: new ObjectId(req.params.id)}).clientId;
    await dbClient.jobsCollection.deleteOne({_id: new ObjectId(req.params.id)});
    const pipeline = [];
    const status = req.params.status;
    pipeline.push({
      $match: {
        status,
        clientId
      }
    });
    const openJobs = await dbClient.jobsCollection.aggregate(pipeline).toArray();
    return res.status(201).json(openJobs);
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