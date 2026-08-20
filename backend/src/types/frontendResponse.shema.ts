import z from 'zod'

const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/

const TokenSchema = z.object({
  address: z.string().regex(SOLANA_ADDRESS_REGEX, 'Invalid Solana token address'),
  symbol: z.string().min(1).max(10),
})

export const PoolFrontendDataSchema = z.object({
  address: z.string().regex(SOLANA_ADDRESS_REGEX, 'Invalid Solana pool address'),
  name: z.string().min(1),
  tokenX: TokenSchema,
  tokenY: TokenSchema,
  tvl: z.number().nonnegative(),
  currentPrice: z.number().positive(),
  volume24h: z.number().nonnegative(),
  apy: z.number().min(0),
  apr: z.number().min(0),
  bin_step: z.number().min(0)
})

export type PoolFrontendData = z.infer<typeof PoolFrontendDataSchema>