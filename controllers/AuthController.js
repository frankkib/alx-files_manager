import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic')) {
      console.log('Missing or invalid Authorization header');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const encodedCredentials = authHeader.split(' ')[1];
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('ascii');
    const [email, password] = decodedCredentials.split(':');
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const hashedPassword = sha1(password);
    console.log(`Email: ${email}, Hashed Password: ${hashedPassword}`);
    const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      console.log('User not found or incorrect password');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = uuidv4();
    const tokenKey = `auth_${token}`;
    await redisClient.set(tokenKey, user._id.toString(), 60 * 60 * 24);
    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const tokenKey = `auth_${token}`;
    const userId = await redisClient.get(tokenKey);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisClient.del(tokenKey);
    return res.status(204).end();
  }
}

export default AuthController;
