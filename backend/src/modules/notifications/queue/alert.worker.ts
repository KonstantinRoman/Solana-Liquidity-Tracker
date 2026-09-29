import { Worker } from 'bullmq'
import { redis } from '../../../shared/infrastructure/redis.js'
import { bot } from '../bot/bot.js'

export function initAlertWorker() {
	const worker = new Worker(
		'telegram-alerts',
		async (job) => {
			const {chatId, message} = job.data
			await bot.api.sendMessage(chatId, message,  {parse_mode: 'Markdown'})
		},
		{
			connection: redis,
			limiter: {max: 20, duration: 1000}
		}
	)

	worker.on('failed', (job, err) => {
		console.error(`Ошибка отправки уведомления #${job?.id}:`, err)
	})
}
