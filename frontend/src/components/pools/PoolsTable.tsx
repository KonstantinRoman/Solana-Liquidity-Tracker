import { Badge, HStack, Table, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { Pool } from '../../types/pool.types'

interface PoolTableProps {
  pools: Pool[]
}

const formatApy = (apy?: number) => {
  if (!apy || isNaN(apy) || apy <= 0) return '—'
  if (apy > 1_000_000_000) return '>1B%'
  if (apy > 1_000_000) return `${(apy / 1_000_000).toFixed(1)}M%`
  if (apy > 10_000) return `${(apy / 1_000).toFixed(1)}k%`
  return `${apy.toFixed(1)}%`
}

export const PoolTable = ({ pools }: PoolTableProps) => {
  const navigate = useNavigate()

  return (
    <Table.Root variant="line" interactive size="md">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader width="22%">Pair</Table.ColumnHeader>
          <Table.ColumnHeader width="14%">Type</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" width="16%">TVL</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" width="16%">24h Volume</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" width="16%">24h Fees</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="right" width="16%">APY</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {pools.map((pool) => {
          const isDlmm = pool.binStep !== undefined && pool.binStep > 0

          return (
            <Table.Row
              key={pool.address}
              onClick={() => navigate(`/pools/${pool.address}`)}
              cursor="pointer"
              _hover={{ bg: 'whiteAlpha.50' }}
            >
              <Table.Cell fontWeight="bold" whiteSpace="nowrap">
                <HStack spaceX={1}>
                  <Text color="white">
                    {pool.tokenX?.symbol || '?'}/{pool.tokenY?.symbol || '?'}
                  </Text>
                </HStack>
              </Table.Cell>

              <Table.Cell whiteSpace="nowrap">
                <Badge colorPalette={isDlmm ? 'purple' : 'blue'}>
                  {isDlmm ? `DLMM (${pool.binStep})` : 'Standard'}
                </Badge>
              </Table.Cell>

              <Table.Cell textAlign="right" whiteSpace="nowrap">
                ${pool.tvl ? pool.tvl.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
              </Table.Cell>

              <Table.Cell textAlign="right" whiteSpace="nowrap">
                ${pool.volume24h ? pool.volume24h.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
              </Table.Cell>

              <Table.Cell textAlign="right" color="teal.300" fontWeight="medium" whiteSpace="nowrap">
                ${pool.fee ? pool.fee.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
              </Table.Cell>

              <Table.Cell textAlign="right" color="green.400" fontWeight="bold" whiteSpace="nowrap">
                {formatApy(pool.apy)}
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table.Root>
  )
}