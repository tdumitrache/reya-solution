import type {
  PriceType,
  WebSocketIncomingMessageType,
  WebSocketPongMessageType,
  WebSocketSubscribeMessageType,
} from "@/types/api";
import { usePositionsStore, usePricesStore, useWalletStore } from "@/store";

const WS_URL = "wss://ws.reya.xyz";
const PRICES_CHANNEL = "/v2/prices";
const POSITIONS_CHANNEL = (address: string) => `/v2/wallet/${address}/positions`;
const RECONNECT_DELAY_MS = 3000;
const PRICE_THRESHOLD_BIPS = 1; // 1 bip = 0.01%

export const hasPriceDeviatedEnough = (
  oldPrice: number,
  newPrice: number,
  thresholdBips: number = PRICE_THRESHOLD_BIPS
): boolean => {
  if (oldPrice === 0) return true;
  const changeInBips = Math.abs((newPrice - oldPrice) / oldPrice) * 10000;
  return changeInBips >= thresholdBips;
};

interface PriceWebSocketOptionsType {
  onStatusChange?: (
    status: "connecting" | "connected" | "disconnected"
  ) => void;
}

export const createPriceWebSocket = (
  options: PriceWebSocketOptionsType = {}
) => {
  let ws: WebSocket | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let isManualClose = false;

  const address = useWalletStore.getState().walletAddress

  const connect = () => {
    const isReady =
      ws?.readyState === WebSocket.OPEN ||
      ws?.readyState === WebSocket.CONNECTING;

    if (isReady) return;

    isManualClose = false;
    options.onStatusChange?.("connecting");

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      options.onStatusChange?.("connected");

      const subscribeMessage: WebSocketSubscribeMessageType = {
        type: "subscribe",
        channel: PRICES_CHANNEL,
      };

      const positionsSubscribeMessage: WebSocketSubscribeMessageType = {
        type: "subscribe",
        channel: POSITIONS_CHANNEL(address ?? ""),
      };


      ws?.send(JSON.stringify(subscribeMessage));
      ws?.send(JSON.stringify(positionsSubscribeMessage));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as WebSocketIncomingMessageType;
      handleMessage(message);
    };

    ws.onclose = () => {
      options.onStatusChange?.("disconnected");
      ws = null;

      if (!isManualClose) {
        reconnectTimeout = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };

    ws.onerror = () => {
      if (!isManualClose) {
        console.error("WebSocket connection error");
      }
    };
  };

  const handleMessage = (message: WebSocketIncomingMessageType) => {
const addressLowerCase = address?.toLowerCase();

    switch (message.type) {
      case "ping": {
        const pongMessage: WebSocketPongMessageType = {
          type: "pong",
          timestamp: Date.now(),
        };
        ws?.send(JSON.stringify(pongMessage));
        break;
      }

      case "subscribed":
        if (message.contents && message.contents.length > 0) {
          usePricesStore.getState().setPrices(message.contents);
        }
        break;

      case "channel_data":
        if (message.channel === PRICES_CHANNEL) {
          handlePriceUpdates(message.data);
        }

        if (message.channel === POSITIONS_CHANNEL(addressLowerCase ?? "")) {
          console.log("message.data", message.data);
          usePositionsStore.getState().setPositions(message.data);
        }
        break;

      case "error":
        console.error("WebSocket error message:", message.message);
        break;
    }
  };

  const handlePriceUpdates = (newPrices: PriceType[]) => {
    const store = usePricesStore.getState();
    const currentPrices = store.prices;

    for (const newPrice of newPrices) {
      const existingPrice = currentPrices.find(
        (p) => p.symbol === newPrice.symbol
      );

      if (!existingPrice) {
        store.setPrice(newPrice);
        continue;
      }

      const oldOraclePrice = parseFloat(existingPrice.oraclePrice);
      const newOraclePrice = parseFloat(newPrice.oraclePrice);

      if (hasPriceDeviatedEnough(oldOraclePrice, newOraclePrice)) {
        store.setPrice(newPrice);
      }
    }
  };

  const disconnect = () => {
    isManualClose = true;

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }

    if (ws) {
      ws.onclose = null;
      ws.onerror = null;
      ws.onmessage = null;
      ws.onopen = null;

      const isOpen =
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING;

      if (isOpen) {
        ws.close();
      }
      ws = null;
    }

    options.onStatusChange?.("disconnected");
  };

  return {
    connect,
    disconnect,
  };
};
