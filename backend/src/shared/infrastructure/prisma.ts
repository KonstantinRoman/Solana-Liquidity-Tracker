import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { PrismaClient } from '../../generated/prisma/client.js'

const databaseUrl = process.env.DATABASE_URL

if(!databaseUrl){
	throw new Error('Database URL was not recived')
}

const adapter = new PrismaPg({
	connectionString: databaseUrl
})

export const prisma = new PrismaClient({
	adapter
})


