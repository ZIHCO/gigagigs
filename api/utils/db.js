import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

/**
 * create a dbclient
 */
class DBClient {
  /**
   * instantiate the a new dbclient
   */
  constructor() {
    config();
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB || 'gigagigs';

    this.client = new MongoClient(
      `mongodb://${host}:${port}/${database}`, { useUnifiedTopology: true },
    );
    this.clientIsConnected = false;
    this.client.connect()
      .then(() => {
        this.clientIsConnected = true;
      })
      .catch(() => {
        this.clientIsConnected = false;
      });
    this.usersCollection = this.client.db().collection('users');
    this.jobsCollection = this.client.db().collection('jobs');
  }

  /**
   * check for active connection
   */
  isAlive() {
    return this.clientIsConnected;
  }

  /**
   * retrieves the number of users in the database
   * return - Promise<Number>
   */
  nbUsers() {
    return this.usersCollection.countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
