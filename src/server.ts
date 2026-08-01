import { app } from './app.js'
import { env } from './config/index.js'
import { prisma } from './shared/infrastructure/prisma.js'
import { redis } from './shared/infrastructure/redis.js'

const server = app.listen(env.PORT, () => {
	console.log('Server started succesfully')
})

const gracefulShutdown = (taskSignal: string) => {
	console.log(`\nSignal recivied ${taskSignal} `)
	server.close(async () => {
		console.log('HTTP server stopped')
		try {
			await redis.quit()
			console.log('Redis connection closed')

			await prisma.$disconnect()
			console.log('Prisma connection closed')
		} catch (error) {
			console.error('Error when closing connections:',error)
		}
		finally{
			process.exit(0)
		}
	})
}

process.on('SIGINT',() => gracefulShutdown('SIGINT'))
process.on('SIGTERM',() => gracefulShutdown('SIGTERM'))