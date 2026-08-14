import z from 'zod'

const TokenSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
  symbol: z.string().min(1).max(10),
});

export const PoolFrontendDataSchema = z.object({
  address: z.string(),
  name: z.string().min(1),
  tokenX: TokenSchema,
  tokenY: TokenSchema,
  tvl: z.number().nonnegative(),
  currentPrice: z.number().positive(),
  volume24h: z.number().nonnegative(),
  apy: z.number().min(0),
  apr: z.number().min(0),
});

export type PoolFrontendData = z.infer<typeof PoolFrontendDataSchema>