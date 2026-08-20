import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().startsWith('postgresql://'),
	REDIS_URL: z.string().default('redis://localhost:6379'),
	METEORA_URL: z.string().startsWith('https://dlmm.datapi.meteora.ag/pools'),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	METEORA_CRON_INTERVAL: z.string().default("*/5 * * * *"),
	LOG_LEVEL: z.string().default('info'),
	TELEGRAM_BOT_TOKEN: z.string(),
})

export type EnvConfig = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)