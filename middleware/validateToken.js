import redisClient from '../utils/redis';

const validateToken = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const tokenKey = `auth_${token}`;
  const userId = await redisClient.get(tokenKey);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.userId = userId;
  return next();
};

export default validateToken;
