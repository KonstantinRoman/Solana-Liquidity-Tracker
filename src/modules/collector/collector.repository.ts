import { Prisma } from '../../generated/prisma/client.js'
import { prisma } from '../../shared/infrastructure/prisma.js'
import { redis } from '../../shared/infrastructure/redis.js'
import { MeteoraPool } from '../../types/meteora.shema.js'

function saveCoolectorData(pools: MeteoraPool[]){
	
}

async function saveTokenData(prismaTokens: Prisma.TokenCreateManyInput[]){
	try {
		const pipeline = redis.pipeline()

		prismaTokens.forEach(token => pipeline.sismember('known:tokens', token.address))

		const results = (await pipeline.exec()) as Array<[Error | null,number]>

		const missingTokens = prismaTokens.filter((token, index) => results[index][1] === 0)

		if(missingTokens.length === 0){
			console.log('All tokens are already known')
			return
		}

		const newAddresses = missingTokens.map(token => token.address)
		try {
			const prismaSaveResult = await prisma.token.createMany({
				data: missingTokens,
				skipDuplicates: true
			})

			console.log(`Succesfull save tokens into Postgress: ${prismaSaveResult.count}`)

			const redisSaveResult = await redis.sadd('known:tokens', ...newAddresses)

			console.log(`Succesfull save token addresses into Redis: ${redisSaveResult} `)
		} catch (error) {
			throw new Error(`Save token into db error: ${error}`)
		}

	} catch (error) {
		
	}
	
}

function savePoolData(prismaPools: Prisma.PoolCreateManyInput){

}

function savePoolSnapshotData(prismaPoolSnapshots: Prisma.PoolCreateManyInput[]){
	
}