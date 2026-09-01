import { useMemo, useState } from 'react'
import { Card } from '../components/common/Card'
import { Loader } from '../components/common/Loader'
import { Layout } from '../components/layout/Layout'
import { PoolTable } from '../components/pools/PoolsTable'
import { SearchBar } from '../components/pools/SearchBar'
import { useTopPools } from '../hooks/usePools'

export const PoolPage = () => {
  const { data: pools, isLoading, isError } = useTopPools()
  const [search, setSearch] = useState('')

  const filteredPools = useMemo(() => {
    if (!pools) return []
    const q = search.trim().toLowerCase()

    return pools.filter((pool) => {
      if (!pool.name || pool.tvl === undefined) return false
      if (!q) return true

      const matchName = pool.name.toLowerCase().includes(q)
      const matchX = pool.tokenX?.symbol?.toLowerCase().includes(q)
      const matchY = pool.tokenY?.symbol?.toLowerCase().includes(q)
      const matchAddr = pool.address?.toLowerCase() === q

      return matchName || matchX || matchY || matchAddr
    })
  }, [pools, search])

  return (
    <Layout>
      <SearchBar value={search} onChange={setSearch} />
      
      {isLoading && <Loader label="Загрузка списка пулов..." />}
      {isError && (
        <Card color="red.400" textAlign="center">
          Не удалось загрузить данные пулов
        </Card>
      )}
      {!isLoading && !isError && (
        <Card p={0} overflow="hidden">
          <PoolTable pools={filteredPools} />
        </Card>
      )}
    </Layout>
  )
}