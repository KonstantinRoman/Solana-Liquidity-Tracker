import { z } from 'zod'

const cumulativeMetricsSchema = z.object({
  fees: z.number(), 
  volume: z.number(),
})

const feesAndVolumeSchema = z.object({
  '12h': z.number(), 
  '1h': z.number(),
  '24h': z.number(),
  '2h': z.number(),
  '30m': z.number(),
  '4h': z.number(),
})

const poolConfigSchema = z.object({
  base_fee_pct: z.number(),
  bin_step: z.number(),
  collect_fee_mode: z.number(), 
  max_fee_pct: z.number(),
  protocol_fee_pct: z.number(),
})

const tokenSchema = z.object({
  address: z.string(),
  decimals: z.number(),
  freeze_authority_disabled: z.boolean().default(true),
  holders: z.number(),
  is_verified: z.boolean().default(true),
  market_cap: z.number(),
  name: z.string(),
  price: z.number(),
  symbol: z.string(),
  total_supply: z.number(), 
})

const poolDataSchema = z.object({
  address: z.string(),
  apr: z.number(),
  apy: z.number(),
  created_at: z.number(),
  cumulative_metrics: cumulativeMetricsSchema,
  current_price: z.union([z.number(), z.string()]), 
  dynamic_fee_pct: z.number(),
  farm_apr: z.number(),
  farm_apy: z.number(),
  fee_tvl_ratio: feesAndVolumeSchema,
  fees: feesAndVolumeSchema,
  has_farm: z.boolean().default(true),
  is_blacklisted: z.boolean().default(true),
  name: z.string(),
  pool_config: poolConfigSchema,
  protocol_fees: feesAndVolumeSchema,
  reserve_x: z.string(),
  reserve_y: z.string(),
  reward_mint_x: z.string(),
  reward_mint_y: z.string(),
  tags: z.array(z.string()),
  token_x: tokenSchema,
  token_x_amount: z.number(),
  token_y: tokenSchema,
  token_y_amount: z.number(),
  tvl: z.number(),
  volume: feesAndVolumeSchema,
  launchpad: z.string().nullable().optional(),
})

export const apiMeteoraResponseSchema = z.object({
  current_page: z.number().default(1),
  data: z.array(poolDataSchema), 
  page_size: z.number(),
  pages: z.number(),
  total: z.number(),
})

export type MeteoraPool = z.infer<typeof poolDataSchema>

export type ApiMeteoraResponse = z.infer<typeof apiMeteoraResponseSchema>