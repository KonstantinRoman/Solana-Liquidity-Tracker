import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '../../config/index.js'
import { PrismaClient } from '../../generated/prisma/client.js'


const databaseUrl = env.DATABASE_URL

if(!databaseUrl){
	throw new Error('Database URL was not recived')
}

const adapter = new PrismaPg({
	connectionString: databaseUrl
})

export const prisma = new PrismaClient({
	adapter
})


