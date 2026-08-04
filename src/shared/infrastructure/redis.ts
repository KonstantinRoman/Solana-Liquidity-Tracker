import { Redis } from 'ioredis'
import { env } from '../../config/index.js'

export const redis = new Redis(env.REDIS_URL,{
	maxRetriesPerRequest: null,
	enableReadyCheck: false,
})

export async function filterUnknownAdresses(key: string, addresses: string[]): Promise<string[]> {
	try {
		if(addresses.length === 0){
			console.log('No addresses to process')
			return []
		}

		const pipeline = redis.pipeline()

		addresses.forEach(add => pipeline.sismember(key,add))

		const result = (await pipeline.exec()) as Array<[Error | null,number]>

		const missingAddresses = addresses.filter((_, index) => result[index][1] === 0)

		return missingAddresses
	} catch (error) {
		throw new Error(`Connection or database error: ${error}`)
	}
}

redis.on('connect', () => {
	console.log('Redis: connection estabilish')
})

redis.on('error', (err) =>{
	console.error('Redis: Connection error', err.message)
})
