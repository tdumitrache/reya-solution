import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  WalletSliceType,
  PositionsSliceType,
  PricesSliceType,
  PriceType,
  PositionType,
} from "@/types/api";
import { fetchWalletPositions, fetchAllPrices } from "@/services/api";

const WALLET_STORAGE_KEY = "reya-wallet";

export const useWalletStore = create<WalletSliceType>()(
  persist(
    (set) => ({
      walletAddress: null,
      setWalletAddress: (address: string | null) => {
        set({ walletAddress: address });
      },
    }),
    {
      name: WALLET_STORAGE_KEY,
    }
  )
);

export const usePricesStore = create<PricesSliceType>((set, get) => ({
  prices: [],
  isLoadingPrices: false,
  fetchPrices: async () => {
    set({ isLoadingPrices: true });
    try {
      const prices = await fetchAllPrices();
      get().setPrices(prices);
      set({ isLoadingPrices: false });
    } catch (error) {
      console.error("Failed to fetch prices:", error);
      set({ isLoadingPrices: false });
    }
  },
  setPrices: (prices: PriceType[]) => {
    set({ prices });
  },
  setPrice: (price: PriceType) => {
    set((state) => {
      const existingIndex = state.prices.findIndex(
        (p) => p.symbol === price.symbol
      );

      if (existingIndex === -1) return { prices: [...state.prices, price] };

      const updatedPrices = [...state.prices];
      updatedPrices[existingIndex] = price;
      return { prices: updatedPrices };
    });
  },
  clearPrices: () => {
    set({ prices: [] });
  },
}));

export const usePositionsStore = create<PositionsSliceType>((set, get) => ({
  positions: [],
  isLoadingPositions: false,
  positionsError: null,
  fetchPositions: async (address: string) => {
    set({ isLoadingPositions: true, positionsError: null });
    try {
      const positions = await fetchWalletPositions(address);
      set({ positions, isLoadingPositions: false });
      usePricesStore.getState().fetchPrices();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch positions";
      set({
        positionsError: message,
        isLoadingPositions: false,
        positions: [],
      });
    }
  },
  setPositions: (positions: PositionType[]) => {
    const currentPositions = get().positions;
    const positionsMap = new Map(
      currentPositions.map((p) => [p.symbol, p])
    );

    for (const position of positions) {
      if (position.qty === "0") {
        positionsMap.delete(position.symbol);
      } else {
        positionsMap.set(position.symbol, position);
      }
    }

    set({ positions: Array.from(positionsMap.values()) });
  },
  clearPositions: () => {
    set({ positions: [], positionsError: null });
  },
}));
