const { dbClient } = require('../utils/db');
const { hashSHA1 } = require('../utils/hash');

const UsersController = {
  postNew: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      const userExists = await dbClient.doesUserExist(email);
      if (userExists) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = hashSHA1(password);

      const newUser = {
        email,
        password: hashedPassword,
      };

      const result = await dbClient.createUser(newUser);

      res.status(201).json({ email: result.ops[0].email, id: result.insertedId });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = UsersController;
