import dbClient from '../utils/db';
import redisClient from '../utils/redis';


/**
 * Monitors app connectivity
 */
export default class AppController {
  /**
   * get apps status
   * return - boolean
   */
  static getStatus(req, res) {
    res.status(200).json({
      db: dbClient.isAlive(),
      redis: redisClient.isAlive()
    });
  }

  /**
   * get collections statistics
   * return - number
   */
  static async getStats(req, res) {
    const nbUsers = await dbClient.nbUsers();
    res.status(200).json({ users: nbUsers });
  }
}