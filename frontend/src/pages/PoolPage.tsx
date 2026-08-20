import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Spinner,
  Table,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTopPools } from '../hooks/usePools'
import { Pool } from '../types/pool.types'

export const PoolsPage: React.FC = () => {
  const { data: pools, isLoading, isError, error, refetch } = useTopPools()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px" direction="column" gap={4}>
        <Spinner size="xl" color="teal.500" />
        <Text color="gray.500">Loading Meteora liquidity pools...</Text>
      </Flex>
    )
  }

  if (isError) {
    return (
      <Box p={6} border="1px solid" borderColor="red.300" borderRadius="md" bg="red.50">
        <Heading size="md" color="red.600" mb={2}>
          Error Loading Data
        </Heading>
        <Text color="red.500" mb={4}>
          {error?.message || 'Failed to fetch pools from the server'}
        </Text>
        <Button colorScheme="red" onClick={() => refetch()}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg" mb={1}>
            Meteora Liquidity Pools
          </Heading>
          <Text color="gray.600" fontSize="sm">
            Real-time tracking for DLMM and Dynamic pools
          </Text>
        </Box>
        <Badge colorScheme="green" p={2} borderRadius="md">
          Total Pools: {pools?.length || 0}
        </Badge>
      </Flex>

      <Box overflowX="auto" border="1px solid" borderColor="gray.200" borderRadius="lg">
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row bg="gray.50">
              <Table.ColumnHeader>Pool Name</Table.ColumnHeader>
              <Table.ColumnHeader>Type</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">TVL ($)</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">24h Volume ($)</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="right">Base Fee (%)</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Action</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {pools && pools.length > 0 ? (
              pools.map((pool: Pool) => (
                <Table.Row
                  key={pool.address}
                  _hover={{ bg: 'gray.50' }}
                  transition="background 0.2s"
                >
                  <Table.Cell fontWeight="bold">{pool.name}</Table.Cell>
                  <Table.Cell>
                    <Badge colorScheme={pool.type === 'DLMM' ? 'purple' : 'blue'}>
                      {pool.type}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    ${pool.tvl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </Table.Cell>
                  <Table.Cell textAlign="right">
                    ${pool.volume24h.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </Table.Cell>
                  <Table.Cell textAlign="right">{pool.baseFee}%</Table.Cell>
                  <Table.Cell textAlign="center">
                    <Button
                      size="sm"
                      colorScheme="teal"
                      variant="outline"
                      onClick={() => navigate(`/pools/${pool.address}`)}
                    >
                      Analytics
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign="center" py={8}>
                  <Text color="gray.500">No pools found</Text>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  )
}