import { Badge, HStack, Heading, Text, VStack } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { Loader } from '../components/common/Loader'
import { Layout } from '../components/layout/Layout'
import { PoolChart } from '../components/pools/PoolChart'
import { usePoolHistory, useTopPools } from '../hooks/usePools'

export const PoolDetailPage = () => {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()

  const { data: pools } = useTopPools()
  const { data: history, isLoading, isError } = usePoolHistory(address || '')

  const pool = pools?.find((p) => p.address === address)
  const isDlmm = pool?.binStep !== undefined && pool.binStep > 0

  return (
    <Layout>
      <Button mb={6} onClick={() => navigate('/')} variant="outline">
        ← Назад к списку
      </Button>

      {isLoading && <Loader label="Загрузка истории..." />}
      {isError && (
        <Card color="red.400" textAlign="center">
          Ошибка загрузки графика
        </Card>
      )}

      {!isLoading && (
        <VStack spaceY={6} align="stretch">
          <Card>
            <HStack justify="space-between" align="center" mb={6}>
              <VStack align="start" spaceY={1}>
                <Heading size="xl">{pool?.name || 'Pool Detail'}</Heading>
                <Text color="gray.500" fontSize="xs" fontFamily="mono">
                  {pool?.address}
                </Text>
              </VStack>
              <Badge colorPalette={isDlmm ? 'purple' : 'blue'} size="lg">
                {isDlmm ? `DLMM (${pool.binStep})` : 'Standard'}
              </Badge>
            </HStack>

            <HStack spaceX={8} flexWrap="wrap">
              <VStack align="start">
                <Text color="gray.400" fontSize="sm">Current Price</Text>
                <Text fontSize="xl" fontWeight="bold">
                  ${pool?.currentPrice ? pool.currentPrice.toFixed(4) : '—'}
                </Text>
              </VStack>
              <VStack align="start">
                <Text color="gray.400" fontSize="sm">TVL</Text>
                <Text fontSize="xl" fontWeight="bold">
                  ${pool?.tvl ? pool.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                </Text>
              </VStack>
              <VStack align="start">
                <Text color="gray.400" fontSize="sm">24h Volume</Text>
                <Text fontSize="xl" fontWeight="bold">
                  ${pool?.volume24h ? pool.volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                </Text>
              </VStack>
              <VStack align="start">
                <Text color="gray.400" fontSize="sm">24h Fees</Text>
                <Text fontSize="xl" fontWeight="bold" color="teal.300">
                  ${pool?.fee ? pool.fee.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—'}
                </Text>
              </VStack>
              <VStack align="start">
                <Text color="gray.400" fontSize="sm">APY</Text>
                <Text fontSize="xl" fontWeight="bold" color="green.400">
                  {pool?.apy ? `${pool.apy.toFixed(1)}%` : '—'}
                </Text>
              </VStack>
            </HStack>
          </Card>

          <Heading size="md" color="gray.300">Динамика TVL</Heading>
          <PoolChart data={history || []} />
        </VStack>
      )}
    </Layout>
  )
}