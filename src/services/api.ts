import type { PositionType, PriceType } from "@/types/api";

const API_BASE_URL = "https://api.reya.xyz/v2";

/**
 * Fetch all open positions for a given wallet address
 */
export const fetchWalletPositions = async (
  address: string
): Promise<PositionType[]> => {
  const response = await fetch(`${API_BASE_URL}/wallet/${address}/positions`);

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid wallet address format");
    }
    if (response.status === 500) {
      throw new Error("Server error. Please try again later.");
    }
    throw new Error(`Failed to fetch positions: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch current prices for all trading symbols
 */
export const fetchAllPrices = async (): Promise<PriceType[]> => {
  const response = await fetch(`${API_BASE_URL}/prices`);

  if (!response.ok) {
    if (response.status === 500) {
      throw new Error("Server error. Please try again later.");
    }
    throw new Error(`Failed to fetch prices: ${response.statusText}`);
  }

  return response.json();
};
