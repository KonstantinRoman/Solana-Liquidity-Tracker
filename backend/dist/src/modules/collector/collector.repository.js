import { REDIS_KEYS } from '../../config/redis.key.js';
import { logger } from '../../shared/infrastructure/logger.js';
import { prisma } from '../../shared/infrastructure/prisma.js';
import { filterUnknownAdresses, redis } from '../../shared/infrastructure/redis.js';
import { processingFrontendPoolData, processingPoolData, processingPoolSnapshotData, processingTokenData } from './collector.mapper.js';
export async function saveCollectorData(pools) {
    try {
        const prismaTokens = processingTokenData(pools);
        const prismaPools = processingPoolData(pools);
        const prismaPoolSnapshots = processingPoolSnapshotData(pools);
        const poolFrontendArray = processingFrontendPoolData(pools);
        await saveTokenData(prismaTokens);
        await savePoolData(prismaPools);
        await savePoolSnapshotData(prismaPoolSnapshots);
        await saveFrontendData(poolFrontendArray);
    }
    catch (error) {
        logger.error({ err: error }, 'Save collector data failed');
        throw new Error(`Save pool data into DB error: ${error}`);
    }
}
async function saveTokenData(prismaTokens) {
    if (prismaTokens.length === 0) {
        logger.info('No tokens to process');
        return;
    }
    try {
        const tokenAddresses = prismaTokens.map(token => token.address);
        const missingAddresses = await filterUnknownAdresses(REDIS_KEYS.KNOWN_TOKENS, tokenAddresses);
        if (missingAddresses.length === 0) {
            logger.info('No new token addresses to save (all already known)');
            return;
        }
        const addressSet = new Set(missingAddresses);
        const missingTokens = prismaTokens.filter(token => addressSet.has(token.address));
        const prismaSaveResult = await prisma.token.createMany({
            data: missingTokens,
            skipDuplicates: true
        });
        logger.info({ count: prismaSaveResult.count, entity: 'token' }, 'Successfully saved tokens into Postgres');
        const redisSaveResult = await redis.sadd(REDIS_KEYS.KNOWN_TOKENS, ...missingAddresses);
        logger.info({ addedCount: redisSaveResult, entity: 'token-address' }, 'Successfully saved token addresses into Redis');
    }
    catch (error) {
        logger.error({ err: error, entity: 'token' }, 'Failed to save token data');
        throw new Error(`Save token into DB error: ${error}`);
    }
}
async function savePoolData(prismaPools) {
    if (prismaPools.length === 0) {
        logger.info('No pools to process');
        return;
    }
    try {
        const poolAddresses = prismaPools.map(pool => pool.address);
        const missingAddresses = await filterUnknownAdresses(REDIS_KEYS.KNOWN_POOLS, poolAddresses);
        if (missingAddresses.length === 0) {
            logger.info('No new pool addresses to save (all already known)');
            return;
        }
        const addressSet = new Set(missingAddresses);
        const missingPools = prismaPools.filter(pool => addressSet.has(pool.address));
        const prismaSaveResult = await prisma.pool.createMany({
            data: missingPools,
            skipDuplicates: true
        });
        logger.info({ count: prismaSaveResult.count, entity: 'pool' }, 'Successfully saved pools into Postgres');
        const redisSaveResult = await redis.sadd(REDIS_KEYS.KNOWN_POOLS, ...missingAddresses);
        logger.info({ addedCount: redisSaveResult, entity: 'pool-address' }, 'Successfully saved pool addresses into Redis');
    }
    catch (error) {
        logger.error({ err: error, entity: 'pool' }, 'Failed to save pool data');
        throw new Error(`Save pool into DB error: ${error}`);
    }
}
async function savePoolSnapshotData(prismaPoolSnapshots) {
    if (prismaPoolSnapshots.length === 0) {
        logger.info('No snapshots to process');
        return;
    }
    try {
        const prismaSaveResult = await prisma.poolSnapshot.createMany({
            data: prismaPoolSnapshots,
        });
        logger.info({ count: prismaSaveResult.count, entity: 'pool-snapshot' }, 'Successfully saved pool snapshots into Postgres');
    }
    catch (error) {
        logger.error({ err: error, entity: 'pool-snapshot' }, 'Failed to save pool snapshot data');
        throw new Error(`Save pool snapshots into DB error: ${error}`);
    }
}
async function saveFrontendData(poolFrontendArray) {
    if (poolFrontendArray.length === 0) {
        logger.info('No frontend data to process');
        return;
    }
    try {
        const redisSaveResult = await redis.set(REDIS_KEYS.TOP_POOLS, JSON.stringify(poolFrontendArray));
        logger.info({ count: redisSaveResult, entity: 'pool-frontend-data' }, 'Succesfully saved pool frontend data into Postgress');
    }
    catch (error) {
        logger.error({ err: error, entity: 'pool-frontend-data' }, 'Failed to save pool frontend data');
        throw new Error(`Save pool frontend data into Redis DB error: ${error}`);
    }
}
