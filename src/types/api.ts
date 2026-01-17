// API Response Types

/**
 * Position from Reya API - GET /wallet/{address}/positions
 */
export interface PositionType {
  exchangeId: number;
  symbol: string;
  accountId: number;
  qty: string;
  side: "B" | "A"; // B = Buy/Long, A = Ask/Short
  avgEntryPrice: string;
  avgEntryFundingValue: string;
  lastTradeSequenceNumber: number;
}

/**
 * Price data from API /v2/prices or WebSocket /v2/prices channel
 */
export interface PriceType {
  symbol: string;
  oraclePrice: string;
  poolPrice?: string;
  updatedAt: number;
}

// Store State Types

export interface WalletSliceType {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
}

export interface PositionsSliceType {
  positions: PositionType[];
  isLoadingPositions: boolean;
  positionsError: string | null;
  fetchPositions: (address: string) => Promise<void>;
  clearPositions: () => void;
}

export interface PricesSliceType {
  prices: PriceType[];
  isLoadingPrices: boolean;
  fetchPrices: () => Promise<void>;
  setPrices: (prices: PriceType[]) => void;
  setPrice: (price: PriceType) => void;
}

export type StoreStateType = WalletSliceType &
  PositionsSliceType &
  PricesSliceType;
