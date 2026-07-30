import 'dotenv'
import { z } from 'zod'

export const envShema = z.object({
	DATBASE_URL: z.string().url(),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(['development', 'production'])
})

export type EnvConfig = z.infer<typeof envShema>
