import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Ensure the database connection is established
    if (!dbClient.isAlive()) {
      return res.status(500).json({ error: 'Database connection not established' });
    }

    // Ensure dbClient.db is defined
    if (!dbClient.db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);

    const newUser = {
      email,
      password: hashedPassword,
    };
    const result = await dbClient.db.collection('users').insertOne(newUser);
    return res.status(201).json({ id: result.insertedId, email });
  }
}

export default UsersController;
