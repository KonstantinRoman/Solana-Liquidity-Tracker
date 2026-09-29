import { InlineKeyboard } from 'grammy'

export const mainMenuKeyboard = new InlineKeyboard()
  .text('📋 My Subscriptions', 'list_subscriptions')
  .text('ℹ️ Help', 'show_help')
  .row()
  .text('➕ How to Track', 'how_to_track')

export function buildUntrackKeyboard(poolAddress: string) {
  return new InlineKeyboard().text('❌ Untrack', `untrack_${poolAddress}`)
}