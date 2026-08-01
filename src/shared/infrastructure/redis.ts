import { Redis } from 'ioredis'
import { env } from '../../config/index.js'

export const redis = new Redis(env.REDIS_URL,{
	maxRetriesPerRequest: null,
	enableReadyCheck: false,
})

redis.on('connect', () => {
	console.log('Redis: connection estabilish')
})

redis.on('error', (err) =>{
	console.error('Redis: Connection error', err.message)
})
