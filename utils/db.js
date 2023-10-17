const { MongoClient } = require('mongodb');

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        this.url = `mongodb://${host}:${port}`;
    }

    async isAlive() {
        try {
            const client = new MongoClient(this.url, { useUnifiedTopology: true });
            await client.connect();
            await client.close();
            return true;
        } catch (error) {
            return false;
        }
    }

    async nbUsers() {
        try {
            const client = new MongoClient(this.url, { useUnifiedTopology: true });
            await client.connect();
            const collection = client.db().collection('users');
            const count = await collection.countDocuments();
            await client.close();
            return count;
        } catch (error) {
            return -1;
        }
    }

    async nbFiles() {
        try {
            const client = new MongoClient(this.url, { useUnifiedTopology: true });
            await client.connect();
            const collection = client.db().collection('files');
            const count = await collection.countDocuments();
            await client.close();
            return count;
        } catch (error) {
            return -1;
        }
    }
}

const dbClient = new DBClient();

module.exports = { dbClient };

