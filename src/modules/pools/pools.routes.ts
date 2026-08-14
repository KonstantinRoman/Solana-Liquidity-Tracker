import { Router } from 'express'
import { REDIS_KEYS } from '../../config/redis.key.js'
import { logger } from '../../shared/infrastructure/logger.js'
import { prisma } from '../../shared/infrastructure/prisma.js'
import { redis } from '../../shared/infrastructure/redis.js'
import { PoolFrontendDataSchema } from '../../types/frontendResponse.shema.js'

const router = Router()

router.get('/api/pools/top', async (req, res) => {
  try {

    const limitParam = req.query.limit as string | undefined
    const limit = limitParam ? parseInt(limitParam, 10) : 20

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'limit must be a positive integer' })
    }

    const cache = await redis.get(REDIS_KEYS.TOP_POOLS)
    if (cache === null) {
      logger.warn('Cache miss for TOP_POOLS')
      return res.status(503).json({ error: 'Data not ready yet, try again later' })
    }

    const parseResult = PoolFrontendDataSchema.array().safeParse(JSON.parse(cache))
    if (!parseResult.success) {
      logger.error({ error: parseResult.error }, 'Cache data validation failed')
      return res.status(500).json({ error: 'Internal data format error' })
    }

    const result = parseResult.data.slice(0, limit)
    return res.json({ result })

  } catch (error) {
		if(error instanceof SyntaxError){
			return res.status(400).json({ error: 'Invalid JSON format' })
		}
    logger.error({ err: error }, 'Unexpected error in /api/pools/top')
    return res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/pools/:address/history', async (req, res) => {
  try {

    const address = req.params.address;
    if (typeof address !== 'string' || address.length < 10) {
      return res.status(400).json({ error: 'Invalid address format' });
    }

    const dayParam = req.query.day as string | null;
    const day = dayParam ? parseInt(dayParam, 10) : 7;
    if (isNaN(day) || day < 1 || day > 30) {
      return res.status(400).json({
        error: 'day must be a positive integer between 1 and 30',
      });
    }

    const sevenDaysAgo = new Date(Date.now() - day * 24 * 60 * 60 * 1000);

    const history = await prisma.poolSnapshot.findMany({
      where: {
        poolAddress: address,
        createAt: { gte: sevenDaysAgo },
      },
      select: {
        createAt: true,
        tvl: true,
        currentPrice: true,
        volume24h: true,
        apy: true,
        apr: true,
      },
      orderBy: {
        createAt: 'asc',
      },
    });

    return res.json({ history })
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: 'Invalid JSON format' })
    }
    logger.error({ err: error }, 'Unexpected error in /api/pools/:address/history')
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router