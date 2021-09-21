import * as redis from 'redis'
import { promisify } from 'util';

export const client = redis.createClient(
    {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST,
    }
);


export const getAsync = promisify(client.get).bind(client);
export const keysAsync = promisify(client.keys).bind(client);
