import { Pool, PoolHistoryPoint, PoolHistoryResponse, TopPoolsResponse } from '../types/pool.types'
import { apiClient } from './client'

export const fetchTopPools = async (): Promise<Pool[]> => {
  const response = await apiClient.get<TopPoolsResponse>('/pools/top')
  console.log('DATA FROM BACKEND:', response.data)
  return response.data.result
}

export const fetchPoolHistory = async (address: string): Promise<PoolHistoryPoint[]> => {
  const response = await apiClient.get<PoolHistoryResponse>(`/pools/${address}/history`)
  return response.data.history
}