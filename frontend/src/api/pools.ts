import { Pool, PoolHistoryPoint, TopPoolsResponse } from '../types/pool.types'
import { apiClient } from './client'

export const fetchTopPools = async (): Promise<Pool[]> => {
  const response = await apiClient.get<TopPoolsResponse | Pool[]>('/pools/top')
  if (Array.isArray(response.data)) {
    return response.data
  }
  return response.data.pools
}

export const fetchPoolHistory = async (address: string): Promise<PoolHistoryPoint[]> => {
  const response = await apiClient.get<PoolHistoryPoint[]>(`/pools/${address}/history`)
  return response.data
}