export type PoolType = 'DLMM' | 'Dynamic';

export interface Pool {
  address: string
  name: string
  mintA: string
  mintB: string
  type: PoolType
  tvl: number
  volume24h: number
  binStep?: number
  baseFee: number
}

export interface PoolHistoryPoint {
  timestamp: number
  tvl: number
  volume: number
}

export interface TopPoolsResponse {
  pools: Pool[]
  totalCount: number
}