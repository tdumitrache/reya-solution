import { create } from "zustand";
import type {
  WalletSliceType,
  PositionsSliceType,
  PricesSliceType,
  PriceType,
} from "@/types/api";
import { fetchWalletPositions, fetchAllPrices } from "@/services/api";

// Wallet Store
export const useWalletStore = create<WalletSliceType>((set) => ({
  walletAddress: null,
  setWalletAddress: (address: string | null) => {
    set({ walletAddress: address });
  },
}));

// Prices Store
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
      // Silently fail for prices - positions will use avgEntryPrice as fallback
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
}));

// Positions Store
export const usePositionsStore = create<PositionsSliceType>((set) => ({
  positions: [],
  isLoadingPositions: false,
  positionsError: null,
  fetchPositions: async (address: string) => {
    set({ isLoadingPositions: true, positionsError: null });
    try {
      const positions = await fetchWalletPositions(address);
      set({ positions, isLoadingPositions: false });
      // Fetch prices after positions are loaded
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
  clearPositions: () => {
    set({ positions: [], positionsError: null });
  },
}));
