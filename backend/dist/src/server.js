import cron from 'node-cron';
import { app } from './app.js';
import { env } from './config/index.js';
import { runCollector } from './modules/collector/collector.api.js';
import { logger } from './shared/infrastructure/logger.js';
import { prisma } from './shared/infrastructure/prisma.js';
import { redis } from './shared/infrastructure/redis.js';
const server = app.listen(env.PORT, () => {
    logger.info(`Server started successfully on port ${env.PORT}`);
});
let isProcessing = false;
const cronTask = cron.schedule('*/5 * * * *', async () => {
    if (isProcessing) {
        logger.warn('Collector alre ady running, skipping this tick');
        return;
    }
    isProcessing = true;
    try {
        logger.info({ phase: 'collector' }, 'Starting data collection...');
        await runCollector();
        logger.info({ phase: 'collector' }, 'Data collection finished');
    }
    catch (error) {
        logger.error({ err: error, phase: 'collector' }, 'Error during collection');
    }
    finally {
        isProcessing = false;
    }
}, { missedExecutionTolerance: 60000 });
logger.info({ cron: '5min' }, 'Scheduled every 5 minutes');
const gracefulShutdown = async (taskSignal) => {
    logger.info({ signal: taskSignal }, 'Received signal, starting graceful shutdown');
    cronTask.stop();
    logger.info('Cron task stopped');
    server.close(async () => {
        logger.info('HTTP server stopped');
        try {
            await redis.quit();
            logger.info('Redis connection closed');
            await prisma.$disconnect();
            logger.info('Prisma connection closed');
        }
        catch (error) {
            logger.error({ err: error }, 'Error when closing connections');
        }
        finally {
            process.exit(0);
        }
    });
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
