import { Router } from 'express';
import { REDIS_KEYS } from '../../config/redis.key.js';
import { prisma } from '../../shared/infrastructure/prisma.js';
import { redis } from '../../shared/infrastructure/redis.js';
const router = Router();
router.get('api/pools/top?limit=10', async (req, res) => {
    try {
        const limitParam = req.query.limit;
        const limit = limitParam ? parseInt(limitParam, 10) : undefined;
        if (limit !== undefined && (isNaN(limit) || limit < 1)) {
            return res.status(400).json({ error: 'limit must be a non-negative integner' });
        }
        const cache = await redis.get(REDIS_KEYS.TOP_POOLS);
        if (cache) {
            const result = JSON.parse(cache);
            return res.json({ result });
        }
        const pools = await prisma.pool.findMany({
            take: limit,
            orderBy: { snapshots, : ., }
        });
        redis.set(REDIS_KEYS.TOP_POOLS, JSON.stringify(pools), 'EX', 300);
    }
    catch (error) {
        res.status(400).json({ error: 'Failed to fech pools' });
    }
});
export default router;
