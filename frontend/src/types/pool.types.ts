export type Token = {
  address: string;
  symbol: string;
}

export type PoolFrontendData = {
  address: string;
  name: string;
  tokenX: Token;
  tokenY: Token;
  tvl: number;
  currentPrice: number;
  volume24h: number;
  apy: number;
  apr: number;
}