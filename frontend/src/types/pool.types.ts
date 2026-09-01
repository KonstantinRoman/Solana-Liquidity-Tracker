
export type PoolType = 'DLMM' | 'Dynamic';

export interface Pool {
  address: string
  name: string
  mintA: string
  mintB: string
  tokenX: {
    address: string
    symbol: string
  }
  tokenY: {
    address: string
    symbol: string
  }
  type: PoolType
  tvl: number
  currentPrice: number
  volume24h: number
  apy: number,
  apr: number
  binStep?: number
  fee: number
}

export interface PoolHistoryPoint {
  timestamp: number
  tvl: number
  volume: number
}

export interface TopPoolsResponse {
  result: Pool[]
}

export interface PoolHistoryResponse {
  history: PoolHistoryPoint[]
}