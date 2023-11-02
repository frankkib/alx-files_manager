const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { password, email } = req.body;

    const db = dbClient.client.db(process.env.DB_DATABASE);
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exists' });
    }

    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const newUser = {
      email,
      password: hashedPassword,
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      id: result.insertedId,
      email: newUser.email,
    });

    // Return the response to indicate function completion
    return res;
  }
}

module.exports = UsersController;
