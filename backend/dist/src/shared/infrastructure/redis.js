import { Redis } from 'ioredis';
import { env } from '../../config/index.js';
import { logger } from './logger.js';
export const redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});
export async function filterUnknownAdresses(key, addresses) {
    try {
        if (addresses.length === 0) {
            console.log('No addresses to process');
            return [];
        }
        const pipeline = redis.pipeline();
        addresses.forEach(add => pipeline.sismember(key, add));
        const result = (await pipeline.exec());
        const missingAddresses = addresses.filter((_, index) => result[index][1] === 0);
        return missingAddresses;
    }
    catch (error) {
        throw new Error(`Connection or database error: ${error}`);
    }
}
redis.on('connect', () => {
    logger.info('Redis: connection estabilish');
});
redis.on('error', (err) => {
    logger.info({ error: err }, 'Redis: Connection error');
});
