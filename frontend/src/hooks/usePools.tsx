import { useQuery } from '@tanstack/react-query'
import { fetchPoolHistory, fetchTopPools } from '../api/pools.ts'
import { Pool, PoolHistoryPoint } from '../types/pool.types'

export const useTopPools = () => {
  return useQuery<Pool[], Error>({
    queryKey: ['pools', 'top'],
    queryFn: fetchTopPools,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: false, 
  });
};

export const usePoolHistory = (address: string) => {
  return useQuery<PoolHistoryPoint[], Error>({
    queryKey: ['pools', address, 'history'],
    queryFn: () => fetchPoolHistory(address),
    enabled: Boolean(address),
    staleTime: 1000 * 60,
  });
};