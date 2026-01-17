import { useEffect, useRef, useState } from "react";
import type { WebSocketConnectionStatusType } from "@/types/api";
import { createPriceWebSocket } from "@/services/websocket";

interface UsePriceWebSocketOptionsType {
  enabled?: boolean;
}

export const usePriceWebSocket = ({
  enabled = true,
}: UsePriceWebSocketOptionsType = {}) => {
  const [status, setStatus] =
    useState<WebSocketConnectionStatusType>("disconnected");
  const wsRef = useRef<ReturnType<typeof createPriceWebSocket> | null>(null);

  useEffect(() => {
    if (!enabled) {
      wsRef.current?.disconnect();
      wsRef.current = null;
      return;
    }

    wsRef.current = createPriceWebSocket({
      onStatusChange: setStatus,
    });

    wsRef.current.connect();

    return () => {
      wsRef.current?.disconnect();
      wsRef.current = null;
    };
  }, [enabled]);

  return { status };
};
