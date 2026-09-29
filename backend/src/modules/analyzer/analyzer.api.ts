import { prisma } from '../../shared/infrastructure/prisma.js'
import { sendAlertToUser } from '../notifications/queue/alert.queue.js'
import { evaluatePoolActivity } from './analyzer.service.js'
import { ActivityAlert, ActivityStatus } from './analyzer.types.js'

// 1. Форматирование твоей структуры ActivityAlert в текст сообщения
export function formatAlertMessage(alert: ActivityAlert): string {
  let header = ''
  let emoji = ''

  switch (alert.status) {
    case ActivityStatus.ANOMALY:
      header = '🚨 *Anomalous Activity*'
      emoji = '💥'
      break
    case ActivityStatus.GROWING_INTEREST:
      header = '📈 *Growing Interest*'
      emoji = '🚀'
      break
    case ActivityStatus.DROPPING_INTEREST:
      header = '📉 *Declining Interest*'
      emoji = '⚠️'
      break
  }

  const volumeSign = alert.volumeChangePercent >= 0 ? '+' : ''
  const volChangeFormatted = alert.previousVolume > 0 
    ? `${volumeSign}${alert.volumeChangePercent.toFixed(1)}%` 
    : 'N/A'

  const dashboardUrl = `https://solana-liquidity-tracker-wlrg.vercel.app/pools/${alert.poolId}`
  const solscanUrl = `https://solscan.io/account/${alert.poolId}`

  return (
    `${header} ${emoji}\n\n` +
    `📍 *Pool:* \`\` (\`${alert.poolId}\`)\n` +
    `🔥 *Current APY:* *${alert.currentApy.toLocaleString('en-US')}%* (was ${alert.previousApy.toLocaleString('en-US')}%)\n` +
    `🔄 *24h Volume:* *$${alert.currentVolume.toLocaleString('en-US')}* (${volChangeFormatted})\n` +
    `📉 *Prev Volume:* $${alert.previousVolume.toLocaleString('en-US')}\n\n` +
    `📊 [Open Dashboard](${dashboardUrl}) | 🔗 [Solscan](${solscanUrl})`
  )
}

// 2. Джоба по Cron (раз в 4 часа): достает данные, вызывает ТВОЮ evaluatePoolActivity и рассылает
export async function runAnomalyAnalysisJob(intervalHours: number = 4) {
  const pastTargetDate = new Date(Date.now() - intervalHours * 60 * 60 * 1000)
  const windowMarginMs = 30 * 60 * 1000
  const pastMinDate = new Date(pastTargetDate.getTime() - windowMarginMs)
  const pastMaxDate = new Date(pastTargetDate.getTime() + windowMarginMs)
  const cooldownThreshold = new Date(Date.now() - intervalHours * 60 * 60 * 1000)

  // Берем только те пулы, у которых нет активного кулдауна
  const activeSubscriptions = await prisma.subscription.findMany({
    select: { poolAddress: true },
    where: {
      OR: [
        { lastAlertedAt: null },
        { lastAlertedAt: { lte: cooldownThreshold } }
      ]
    },
    distinct: ['poolAddress']
  })

  for (const { poolAddress } of activeSubscriptions) {
    try {
      // Свежий снимок
      const currentSnapshot = await prisma.poolSnapshot.findFirst({
        where: { poolAddress },
        orderBy: { createAt: 'desc' }
      })

      if (!currentSnapshot) continue

      // Снимок 4 часа назад
      const previousSnapshot = await prisma.poolSnapshot.findFirst({
        where: {
          poolAddress,
          createAt: {
            gte: pastMinDate,
            lte: pastMaxDate
          }
        },
        orderBy: { createAt: 'desc' }
      })

      if (!previousSnapshot) continue

      // Вызываем ТВОЮ чистую функцию
      const alert = evaluatePoolActivity(
        {
          apy: currentSnapshot.apy || 0,
          volume: currentSnapshot.vol24h || 0
        },
        {
          apy: previousSnapshot.apy || 0,
          volume: previousSnapshot.vol24h || 0
        },
        poolAddress,
      )

      // Если ни одно условие не сработало — идем к следующему пулу
      if (!alert) continue

      // Находим подписчиков и рассылаем
      const subscriptions = await prisma.subscription.findMany({
        where: { poolAddress },
        include: { user: true }
      })

      const message = formatAlertMessage(alert)

      for (const sub of subscriptions) {
        await sendAlertToUser(Number(sub.user.telegramId), message)

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { lastAlertedAt: new Date() }
        })
      }
    } catch (error) {
      console.error(`Error analyzing pool ${poolAddress}:`, error)
    }
  }
}