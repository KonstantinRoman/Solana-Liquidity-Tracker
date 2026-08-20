import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { usePoolHistory } from '../hooks/usePools'

export const PoolDetailPage: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()
  const { data: history, isLoading, isError, error, refetch } = usePoolHistory(address || '')

  if (!address) {
    return (
      <Box p={6}>
        <Text color="red.500">Invalid pool address parameter</Text>
        <Button mt={4} onClick={() => navigate('/')}>
          Back to Pools
        </Button>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="400px" direction="column" gap={4}>
        <Spinner size="xl" color="teal.500" />
        <Text color="gray.500">Loading historical metrics...</Text>
      </Flex>
    )
  }

  if (isError) {
    return (
      <Box p={6} border="1px solid" borderColor="red.300" borderRadius="md" bg="red.50">
        <Heading size="md" color="red.600" mb={2}>
          Error Loading History
        </Heading>
        <Text color="red.500" mb={4}>
          {error?.message || 'Failed to fetch historical snapshot data for this pool.'}
        </Text>
        <Button colorScheme="red" onClick={() => refetch()}>
          Retry Request
        </Button>
      </Box>
    )
  }

  const formattedHistory = history?.map((point) => ({
    ...point,
    formattedTime: new Date(point.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  })) || []

  const latestSnapshot = history && history.length > 0 ? history[history.length - 1] : null

  return (
    <Box p={6}>
      <Button mb={6} variant="outline" onClick={() => navigate('/')}>
        ← Back to All Pools
      </Button>

      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Box>
          <Heading size="lg" mb={1}>
            Pool Historical Analytics
          </Heading>
          <Text color="gray.500" fontSize="sm">
            Address: {address}
          </Text>
        </Box>
        {latestSnapshot && (
          <Flex gap={4}>
            <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500">Latest TVL</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${latestSnapshot.tvl.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Text>
            </Box>
            <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500">Latest Volume</Text>
              <Text fontWeight="bold" fontSize="lg">
                ${latestSnapshot.volume.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
        <GridItem bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Heading size="sm" mb={4} color="gray.700">
            TVL Dynamics
          </Heading>
          <Box h="300px" w="100%">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedHistory}>
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#319795" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#319795" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="formattedTime" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="tvl"
                  stroke="#319795"
                  fillOpacity={1}
                  fill="url(#tvlGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>

        <GridItem bg="white" p={5} borderRadius="lg" border="1px solid" borderColor="gray.200">
          <Heading size="sm" mb={4} color="gray.700">
            Volume Dynamics
          </Heading>
          <Box h="300px" w="100%">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedHistory}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#805AD5" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#805AD5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="formattedTime" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#805AD5"
                  fillOpacity={1}
                  fill="url(#volGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  )
}