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
  clearPrices: () => void;
}

export type StoreStateType = WalletSliceType &
  PositionsSliceType &
  PricesSliceType;

// WebSocket Types

export type WebSocketConnectionStatusType =
  | "connecting"
  | "connected"
  | "disconnected";

export interface WebSocketPingMessageType {
  type: "ping";
  timestamp: number;
}

export interface WebSocketPongMessageType {
  type: "pong";
  timestamp: number;
}

export interface WebSocketSubscribeMessageType {
  type: "subscribe";
  channel: string;
  id?: string;
}

export interface WebSocketSubscribedMessageType {
  type: "subscribed";
  channel: string;
  contents?: PriceType[];
}

export interface WebSocketChannelDataMessageType {
  type: "channel_data";
  timestamp: number;
  channel: string;
  data: PriceType[];
}

export interface WebSocketErrorMessageType {
  type: "error";
  message: string;
  channel?: string;
}

export type WebSocketIncomingMessageType =
  | WebSocketPingMessageType
  | WebSocketSubscribedMessageType
  | WebSocketChannelDataMessageType
  | WebSocketErrorMessageType;
