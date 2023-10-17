const redis = require('redis');

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        this.client.on('error', (error) => {
            console.error('Redis Error', error);
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (error, value) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(value);
                }
            });
        });
    }

    async set(key, value, durationInSeconds) {
        return new Promise((resolve, reject) => {
            this.client.setex(key, durationInSeconds, value, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve('OK');
                }
            });
        });
    }

    async del(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, (error, count) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(count);
                }
            });
        });
    }
}

const redisClient = new RedisClient();

module.exports = { redisClient };

