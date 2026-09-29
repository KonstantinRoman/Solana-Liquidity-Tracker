import { initBot } from './bot/bot.js'
import { initAlertWorker } from './queue/alert.worker.js'

export async function bootstrap() {

  initAlertWorker()

  await initBot()

  console.log('🚀 Сервис успешно запущен!')
}

