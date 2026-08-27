import { Prisma } from '../../generated/prisma/client.js'
import { PoolFrontendData } from '../../types/frontendResponse.shema.js'
import { MeteoraPool } from '../../types/meteora.shema.js'

export function processingTokenData(pools: MeteoraPool[]): Prisma.TokenCreateManyInput[] {
  const tokenArray = pools.flatMap(p => [p.token_x, p.token_y])

  const uniqueTokens = Array.from(
    new Map(tokenArray.map(token => [token.address, token])).values()
  )

  const prismaTokenArray: Prisma.TokenCreateManyInput[] = []

  for (const token of uniqueTokens) {
    prismaTokenArray.push({
      address: token.address,
      symbol: token.symbol,
      name: token.name,
      decimals: token.decimals,
      isVerified: token.is_verified
    })
  }

  return prismaTokenArray
}

export function processingPoolData(pools: MeteoraPool[]): Prisma.PoolCreateManyInput[] {
  const prismaPoolArray: Prisma.PoolCreateManyInput[] = []

  for (const pool of pools) {
    prismaPoolArray.push({
      address: pool.address,
      name: pool.name,
      isBlacklisted: pool.is_blacklisted,
      config: pool.pool_config,
    	tokenXAddress: pool.token_x.address,
      tokenYAddress: pool.token_y.address
    })
  }

  return prismaPoolArray
}

export function processingPoolSnapshotData(pools: MeteoraPool[]): Prisma.PoolSnapshotCreateManyInput[] {
  const prismaPoolSnapshotArray: Prisma.PoolSnapshotCreateManyInput[] = []

  for (const pool of pools) {
    prismaPoolSnapshotArray.push({
      poolAddress: pool.address,
      tvl: pool.tvl,
      currentPrice: Number(pool.current_price),
      apr: pool.apr,
      apy: pool.apy,

      tokenXAmount: pool.token_x_amount,
      tokenYAmount: pool.token_y_amount,

      vol30m: pool.volume['30m'],
      vol1h: pool.volume['1h'],
      vol24h: pool.volume['24h'],

      feels30m: pool.fees['30m'],
      feels1h: pool.fees['1h'],
      feels24h: pool.fees['24h'],

      feeTvl24h: pool.fee_tvl_ratio['24h'],

      rawMetrics: pool as unknown as Prisma.InputJsonValue
    })
  }
  
  return prismaPoolSnapshotArray
}
export function processingFrontendPoolData(pools: MeteoraPool[]): PoolFrontendData[] {
    const poolFrontendArray: PoolFrontendData[] = [] 
    for(const pool of pools){
      poolFrontendArray.push({
        address: pool.address,
        name: pool.name,
        tokenX: {
          address: pool.token_x.address,
          symbol: pool.token_x.symbol
        },
        tokenY: {
          address: pool.token_y.address,
          symbol: pool.token_y.symbol
        },
        tvl: pool.tvl,
        currentPrice: Number(pool.current_price),
        volume24h: pool.volume['24h'],
        apy: pool.apy,
        apr: pool.apr,
        bin_step: pool.pool_config.bin_step,
        fee: pool.fees['24h']
      })   
    }

  return poolFrontendArray
}
