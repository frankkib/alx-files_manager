const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${dbHost}:${dbPort}`;
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.error(`MongoDB Connection Error: ${error}`);
      });
  }
   async  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    if (!this.isAlive()) {
      throw new Error('Database connection is not alive.');
    }
    const db = this.client.db(process.env.DB_DATABASE);
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    return userCount;
  }

  async nbFiles() {
    if (!this.isAlive()) {
      throw new Error('Database connection is not alive.');
    }
    const db = this.client.db(process.env.DB_DATABASE);
    const filesCollection = db.collection('files');
    const fileCount = await filesCollection.countDocuments();
    return fileCount;
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient;
