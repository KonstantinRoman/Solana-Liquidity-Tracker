import { ActivityAlert, ActivityStatus } from './analyzer.types.js'

export function evaluatePoolActivity(
  current: { apy: number; volume: number },
  previous: { apy: number; volume: number },
  poolId: string,
): ActivityAlert | null {
  const isVolumeUp = current.volume > previous.volume;
  const isVolumeDown = current.volume < previous.volume;
  
  const volumeChangePercent = previous.volume > 0 
    ? ((current.volume - previous.volume) / previous.volume) * 100 
    : 0;

  // 1. Аномальная активность (приоритетная проверка)
  if (current.apy > 1000) {
    return {
      poolId,
      status: ActivityStatus.ANOMALY,
      currentApy: current.apy,
      previousApy: previous.apy,
      currentVolume: current.volume,
      previousVolume: previous.volume,
      volumeChangePercent,
    };
  }

  // 2. Возросший интерес: Объемы растут AND 250 < APY <= 1000
  if (isVolumeUp && current.apy > 250 && current.apy <= 1000) {
    return {
      poolId,
      status: ActivityStatus.GROWING_INTEREST,
      currentApy: current.apy,
      previousApy: previous.apy,
      currentVolume: current.volume,
      previousVolume: previous.volume,
      volumeChangePercent,
    };
  }

  // 3. Падающий интерес: Объемы падают AND APY < 100
  if (isVolumeDown && current.apy < 100) {
    return {
      poolId,
      status: ActivityStatus.DROPPING_INTEREST,
      currentApy: current.apy,
      previousApy: previous.apy,
      currentVolume: current.volume,
      previousVolume: previous.volume,
      volumeChangePercent,
    };
  }

  return null;
}