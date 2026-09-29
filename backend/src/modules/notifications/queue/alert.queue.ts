import { Queue } from 'bullmq'
import { redis } from '../../../shared/infrastructure/redis.js'

export const alertQueue = new Queue('telegram-alerts', {
	connection: redis
})

export async function sendAlertToUser(chatId: number, message: string){
	await alertQueue.add('send-message', {chatId, message}, {
		attempts: 3,
		backoff: {type: 'exponential', delay: 1000}
	})
}