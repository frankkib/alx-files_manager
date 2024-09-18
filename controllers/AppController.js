import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    const isRedisAlive = await redisClient.isAlive();
    const isDBAlive = await dbClient.isAlive();

    if (isRedisAlive && isDBAlive) {
      res.status(200).json({ redis: true, db: true });
    } else {
      res.status(500).json({ redis: isRedisAlive, db: isDBAlive });
    }
  }

  static async getStats(req, res) {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    if (usersCount !== -1 && filesCount !== -1) {
      res.status(200).json({ users: usersCount, files: filesCount });
    } else {
      res.status(500).json({ users: 'Error', files: 'Error' });
    }
  }
}

export default AppController;
