import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	DATABASE_URL: z.string().startsWith('postgresql://'),
	REDIS_URL: z.string().default('redis://localhost:6379'),
	PORT: z.number().default(3000),
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	
})

export type EnvConfig = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)