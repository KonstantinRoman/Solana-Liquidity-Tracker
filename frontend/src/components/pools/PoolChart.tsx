import { Box } from '@chakra-ui/react'
import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface PoolChartProps {
  data: any[]
}

// Красивое форматирование оси Y ($20.1M, $500k, $10)
const formatYAxis = (val: number) => {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`
  return `$${val}`
}

export const PoolChart = ({ data }: PoolChartProps) => {
  const formattedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return []

    return data
      .map((item) => {
       
        const rawDate = item?.createAt ?? item?.createdAt ?? item?.timestamp

        if (!rawDate) return null

        const normalizedStr = String(rawDate).trim().replace(' ', 'T')
        const dateObj = new Date(normalizedStr)

        if (isNaN(dateObj.getTime())) return null

        return {
          ...item,
          tvl: Number(item?.tvl || 0),
          timestampNum: dateObj.getTime(),
          // Форматируем для оси X: "27.08, 16:20"
          dateStr: dateObj.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.timestampNum - b.timestampNum) 
  }, [data])

  if (!formattedData.length) {
    return (
      <Box p={6} textAlign="center" color="gray.400" border="1px dashed" borderColor="gray.700" borderRadius="md">
        История TVL пока отсутствует
      </Box>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#319795" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#319795" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />

        <XAxis
          dataKey="dateStr"
          stroke="#718096"
          fontSize={11}
          tickLine={false}
          minTickGap={30}
        />

        <YAxis
          stroke="#718096"
          fontSize={12}
          tickLine={false}
          domain={['auto', 'auto']}
          tickFormatter={formatYAxis}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            borderColor: '#2D3748',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(val: any) => [
            `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            'TVL',
          ]}
          labelFormatter={(label: any) => `Время: ${label}`}
        />

        <Area
          type="monotone"
          dataKey="tvl"
          stroke="#319795"
          strokeWidth={2}
          fill="url(#tvlGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}