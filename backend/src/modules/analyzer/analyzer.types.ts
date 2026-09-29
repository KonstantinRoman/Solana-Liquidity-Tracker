export enum ActivityStatus {
  ANOMALY = 'ANOMALY',
  GROWING_INTEREST = 'GROWING_INTEREST',
  DROPPING_INTEREST = 'DROPPING_INTEREST',
}

export interface ActivityAlert {
  poolId: string;
  status: ActivityStatus;
  currentApy: number;
  previousApy: number;
  currentVolume: number;
  previousVolume: number;
  volumeChangePercent: number;
}