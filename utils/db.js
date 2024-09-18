// utils/db.js
import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}`;
    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.dbName = database;

    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.dbName);
      console.log(`Connected to database: ${this.dbName}`);
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  }

  async isAlive() {
    try {
      await this.client.db(this.dbName).command({ ping: 1 });
      return 1;
    } catch (error) {
      return false;
    }
  }

  async nbUsers() {
    try {
      return await this.db.collection('users').countDocuments();
    } catch (error) {
      console.error('Error counting users:', error);
      return 0;
    }
  }

  async nbFiles() {
    try {
      return await this.db.collection('files').countDocuments();
    } catch (error) {
      console.error('Error counting files:', error);
      return 0;
    }
  }
}

// Create and export an instance of DBClient
const dbClient = new DBClient();
export default dbClient;
