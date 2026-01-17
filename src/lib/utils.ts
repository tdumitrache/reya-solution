import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PositionType, PriceType } from "@/types/api";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, decimals = 2) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const parseSymbol = (symbol: string) => {
  // Remove common suffixes: RUSDPERP, RUSD
  const base = symbol.replace(/RUSDPERP$/, "").replace(/RUSD$/, "");
  return base || symbol;
};

export const sortPositionsByValue = (
  positions: PositionType[],
  prices: PriceType[]
): PositionType[] => {
  return [...positions].sort((a, b) => {
    const priceA = prices.find((p) => p.symbol === a.symbol);
    const priceB = prices.find((p) => p.symbol === b.symbol);

    const markPriceA = priceA
      ? parseFloat(priceA.oraclePrice)
      : parseFloat(a.avgEntryPrice);
    const markPriceB = priceB
      ? parseFloat(priceB.oraclePrice)
      : parseFloat(b.avgEntryPrice);

    const valueA = parseFloat(a.qty) * markPriceA;
    const valueB = parseFloat(b.qty) * markPriceB;

    return valueB - valueA;
  });
};
