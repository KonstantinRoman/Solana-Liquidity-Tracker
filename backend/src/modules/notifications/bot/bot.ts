import { Bot } from 'grammy'
import {
	handleCallbackQuery,
	handleList,
	handleStart,
	handleTrack,
	handleUntrack
} from './handles.js'

const token = process.env.TELEGRAM_BOT_TOKEN
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN не задан в переменных окружения!')
}

export const bot = new Bot(token)

// Регистрируем текстовые команды
bot.command('start', handleStart)
bot.command('track', handleTrack)
bot.command('untrack', handleUntrack)
bot.command('list', handleList)

// Регистрируем обработку нажатий на Inline-кнопки
bot.on('callback_query:data', handleCallbackQuery)

// Глобальный перехватчик ошибок, чтобы бот не падал при сбоях
bot.catch((err) => {
  console.error(`❌ Ошибка в работе бота (${err.ctx.update.update_id}):`, err.error)
})

/**
 * Запуск бота в режиме Long Polling
 */
export async function initBot() {
  // start() запускает фоновый процесс получения обновлений от Telegram
  bot.start({
    onStart: (info) => console.log(`🤖 Бот @${info.username} успешно запущен!`)
  })
}