import { REDIS_KEYS } from '../../config/redis.key.js'
import { Prisma } from '../../generated/prisma/client.js'
import { prisma } from '../../shared/infrastructure/prisma.js'
import { filterUnknownAdresses, redis } from '../../shared/infrastructure/redis.js'
import { MeteoraPool } from '../../types/meteora.shema.js'
import { processingPoolData, processingPoolSnapshotData, processingTokenData } from './collector.mapper.js'

export async function saveCollectorData(pools: MeteoraPool[]) {
  try {
    const prismaTokens = processingTokenData(pools)
    const prismaPools = processingPoolData(pools)
    const prismaPoolSnapshots = processingPoolSnapshotData(pools)

    await saveTokenData(prismaTokens)
    await savePoolData(prismaPools)
    await savePoolSnapshotData(prismaPoolSnapshots)
  } catch (error) {
    throw new Error(`Save pool data into DB error: ${error}`)
  }
}

async function saveTokenData(prismaTokens: Prisma.TokenCreateManyInput[]) {
  if (prismaTokens.length === 0) {
    console.log('No tokens to process')
    return
  }

  try {
    const tokenAddresses = prismaTokens.map(token => token.address)
    const missingAddresses = await filterUnknownAdresses(REDIS_KEYS.KNOWN_TOKENS, tokenAddresses)

    if (missingAddresses.length === 0) return

    const addressSet = new Set(missingAddresses)
    const missingTokens = prismaTokens.filter(token => addressSet.has(token.address))

    const prismaSaveResult = await prisma.token.createMany({
      data: missingTokens,
      skipDuplicates: true
    })
    console.log(`Successfully saved tokens into Postgres: ${prismaSaveResult.count}`)

    const redisSaveResult = await redis.sadd(REDIS_KEYS.KNOWN_TOKENS, ...missingAddresses)
    console.log(`Successfully saved token addresses into Redis: ${redisSaveResult}`)
  } catch (error) {
    throw new Error(`Save token into DB error: ${error}`)
  }
}

async function savePoolData(prismaPools: Prisma.PoolCreateManyInput[]) {
  if (prismaPools.length === 0) {
    console.log('No pools to process')
    return
  }

  try {
    const poolAddresses = prismaPools.map(pool => pool.address)
    const missingAddresses = await filterUnknownAdresses(REDIS_KEYS.KNOWN_POOLS, poolAddresses)

    if (missingAddresses.length === 0) {
      console.log('No pool addresses to save')
      return
    }

    const addressSet = new Set(missingAddresses)
    const missingPools = prismaPools.filter(pool => addressSet.has(pool.address))

    const prismaSaveResult = await prisma.pool.createMany({
      data: missingPools,
      skipDuplicates: true
    })
    console.log(`Successfully saved pools into Postgres: ${prismaSaveResult.count}`)

    const redisSaveResult = await redis.sadd(REDIS_KEYS.KNOWN_POOLS, ...missingAddresses)
    console.log(`Successfully saved pool addresses into Redis: ${redisSaveResult}`)
  } catch (error) {
    throw new Error(`Save pool into DB error: ${error}`)
  }
}

async function savePoolSnapshotData(prismaPoolSnapshots: Prisma.PoolSnapshotCreateManyInput[]) {
  if (prismaPoolSnapshots.length === 0) {
    console.log('No snapshots to process')
    return
  }

  try {
    const prismaSaveResult = await prisma.poolSnapshot.createMany({
      data: prismaPoolSnapshots
    })
    console.log(`Successfully saved pool snapshots into Postgres: ${prismaSaveResult.count}`)
  } catch (error) {
    throw new Error(`Save pool snapshots into DB error: ${error}`)
  }
}