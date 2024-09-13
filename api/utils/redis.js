import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', () => {
      this.clientIsConnected = false;
    });

    this.client.on('connect', () => {
      this.clientIsConnected = true;
    });

    // Initialize the connection
    this.client.connect().catch((error) => {
      if (error) {
        this.clientIsConnected = false;
      }
    });
  }

  isAlive() {
    return this.clientIsConnected;
  }

  async get(key) {
    try {
      const result = await this.client.get(key);
      return result;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key, value, timer) {
    try {
      await this.client.setEx(key, timer, value);
    } catch (error) {
      console.error('Redis SETEX error:', error);
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis DEL error:', error);
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
