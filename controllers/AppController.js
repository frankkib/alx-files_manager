const { redisClient } = require('../utils/redis');
const { dbClient } = require('../utils/db');

class AppController {
    static async getStatus(req, res) {
        const redisStatus = await redisClient.isAlive();
        const dbStatus = await dbClient.isAlive();

        if (redisStatus && dbStatus) {
            res.status(200).json({ redis: true, db: true });
        } else {
            res.status(500).json({ redis: redisStatus, db: dbStatus });
        }
    }

    static async getStats(req, res) {
        const usersCount = await dbClient.nbUsers();
        const filesCount = await dbClient.nbFiles();

        if (usersCount >= 0 && filesCount >= 0) {
            res.status(200).json({ users: usersCount, files: filesCount });
        } else {
            res.status(500).json({ error: 'Error retrieving stats' });
        }
    }
}

module.exports = AppController;

