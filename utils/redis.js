const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (err) => {
      console.error(`Redis Error: ${err}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await getAsync(key);
      return value;
    } catch (error) {
      console.error(`Redis GET Error: ${error}`);
      throw error;
    }
  }

  async set(key, value, duration) {
    const setAsync = promisify(this.client.setex).bind(this.client);
    try {
      await setAsync(key, duration, value);
    } catch (error) {
      console.error(`Redis SET Error: ${error}`);
      throw error;
    }
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    try {
      await delAsync(key);
    } catch (error) {
      console.error(`Redis DEL Error: ${error}`);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;

