import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Format a number as USD currency
 */
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format a number with commas for display
 */
export const formatNumber = (value: number, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Extract base asset from trading symbol
 * e.g., "BTCRUSDPERP" -> "BTC", "ETHRUSDPERP" -> "ETH", "kBONKRUSDPERP" -> "kBONK"
 */
export const parseSymbol = (symbol: string) => {
  // Remove common suffixes: RUSDPERP, RUSD
  const base = symbol.replace(/RUSDPERP$/, "").replace(/RUSD$/, "");
  return base || symbol;
};
