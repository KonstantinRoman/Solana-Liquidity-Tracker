import { Context } from 'grammy'
import { prisma } from '../../../shared/infrastructure/prisma.js'
import { buildUntrackKeyboard, mainMenuKeyboard } from './keyboard.js'

export async function handleStart(ctx: Context) {
  const telegramId = BigInt(ctx.from?.id || 0)
  if (!telegramId) return

  await prisma.user.upsert({
    where: { telegramId },
    update: {},
    create: { telegramId }
  })

  await ctx.reply(
    '👋 *Hello! I am a bot for tracking Meteora DEX liquidity anomalies.*\n\n' +
    'I monitor pool liquidity in real time and notify you of sudden TVL changes.\n\n' +
    'Select an option below or run a command directly:',
    {
      parse_mode: 'Markdown',
      reply_markup: mainMenuKeyboard
    }
  )
}

export async function handleTrack(ctx: Context) {
  const telegramId = BigInt(ctx.from?.id || 0)
  const poolAddress = ctx.match?.toString().trim()

  if (!poolAddress) {
    return ctx.reply(
      '⚠️ *Please specify a pool address!*\n\nFormat: `/track <POOL_ADDRESS>`\nExample: `/track 7Ytt...`',
      { parse_mode: 'Markdown' }
    )
  }

  const user = await prisma.user.findUnique({ where: { telegramId } })
  if (!user) {
    return ctx.reply('Please run /start first.')
  }

  await prisma.subscription.upsert({
    where: {
      userId_poolAddress: {
        userId: user.id,
        poolAddress
      }
    },
    update: {},
    create: {
      userId: user.id,
      poolAddress
    }
  })

  await ctx.reply(
    `✅ *Successfully subscribed!*\n\n📍 *Pool:* \`${poolAddress}\`\n🔔 Alerts trigger on TVL change > 5%`,
    {
      parse_mode: 'Markdown',
      reply_markup: buildUntrackKeyboard(poolAddress)
    }
  )
}

export async function handleUntrack(ctx: Context) {
  const telegramId = BigInt(ctx.from?.id || 0)
  const poolAddress = ctx.match?.toString().trim()

  if (!poolAddress) {
    return ctx.reply('⚠️ Please specify a pool address to untrack!\nExample: `/untrack 7Ytt...`', { parse_mode: 'Markdown' })
  }

  const user = await prisma.user.findUnique({ where: { telegramId } })
  if (!user) return

  await prisma.subscription.deleteMany({
    where: {
      userId: user.id,
      poolAddress
    }
  })

  await ctx.reply(`❌ Untracked pool:\n\`${poolAddress}\``, { parse_mode: 'Markdown' })
}

export async function handleList(ctx: Context) {
  const telegramId = BigInt(ctx.from?.id || 0)

  const user = await prisma.user.findUnique({
    where: { telegramId },
    include: { subscriptions: true }
  })

  if (!user || user.subscriptions.length === 0) {
    return ctx.reply('📂 You have no active subscriptions.\nTo add one: `/track <address>`', { parse_mode: 'Markdown' })
  }

  let text = '📋 *Your Active Subscriptions:*\n\n'
  user.subscriptions.forEach((sub, index) => {
    text += `${index + 1}. \`${sub.poolAddress}\` (Threshold: ${sub.tvlThresholdPercent}%)\n`
  })

  await ctx.reply(text, { parse_mode: 'Markdown' })
}

export async function handleCallbackQuery(ctx: Context) {
  const data = ctx.callbackQuery?.data
  if (!data) return

  await ctx.answerCallbackQuery()

  if (data === 'list_subscriptions') {
    return handleList(ctx)
  }

  if (data === 'show_help' || data === 'how_to_track') {
    return ctx.reply(
      '💡 *How to use this bot:*\n\n' +
      '1️⃣ Find a pool on Meteora DEX and copy its address.\n' +
      '2️⃣ Send `/track <ADDRESS>`.\n' +
      '3️⃣ The bot will alert you whenever TVL changes by 5% or more!\n\n' +
      '• `/list` — view your tracked pools\n' +
      '• `/untrack <ADDRESS>` — stop tracking a pool',
      { parse_mode: 'Markdown' }
    )
  }

  if (data.startsWith('untrack_')) {
    const poolAddress = data.replace('untrack_', '')
    ctx.match = poolAddress
    return handleUntrack(ctx)
  }
}