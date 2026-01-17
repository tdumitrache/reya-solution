import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatNumber, parseSymbol } from "@/lib/utils";
import { useWalletStore, usePositionsStore, usePricesStore } from "@/store";
import type { PositionType } from "@/types/api";
import { Loader2 } from "lucide-react";

const TABLE_HEADERS = ["Market", "Size", "Position Value", "Mark Price"];

interface PositionRowPropsType {
  position: PositionType;
}

const PositionRow = ({ position }: PositionRowPropsType) => {
  const isLong = position.side === "B";
  const baseAsset = parseSymbol(position.symbol);
  const qty = parseFloat(position.qty);
  const priceData = usePricesStore((state) =>
    state.prices.find((p) => p.symbol === position.symbol)
  );

  // Use oracle price from WebSocket if available, otherwise fall back to avgEntryPrice
  const markPrice = priceData
    ? parseFloat(priceData.oraclePrice)
    : parseFloat(position.avgEntryPrice);

  const positionValue = qty * markPrice;

  return (
    <TableRow className="border-none">
      <TableCell
        className={cn("font-medium text-xs", {
          "text-primary-300": isLong,
          "text-error-400": !isLong,
        })}
      >
        {baseAsset}
      </TableCell>
      <TableCell className="text-white-100 text-xs">
        {formatNumber(qty)}
      </TableCell>
      <TableCell className="text-white-100 text-xs">
        {formatCurrency(positionValue)}
      </TableCell>
      <TableCell className="text-white-100 text-xs text-right">
        {formatNumber(markPrice)}
      </TableCell>
    </TableRow>
  );
};

const EmptyState = () => (
  <TableRow className="border-none">
    <TableCell colSpan={4} className="text-center text-white-950 py-8">
      Connect a wallet to view positions
    </TableCell>
  </TableRow>
);

const NoPositionsState = () => (
  <TableRow className="border-none">
    <TableCell colSpan={4} className="text-center text-white-950 py-8">
      No open positions found
    </TableCell>
  </TableRow>
);

const LoadingState = () => (
  <TableRow className="border-none">
    <TableCell colSpan={4} className="text-center py-8">
      <div className="flex items-center justify-center gap-2 text-white-950">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading positions...
      </div>
    </TableCell>
  </TableRow>
);

const ErrorState = ({ error }: { error: string }) => (
  <TableRow className="border-none">
    <TableCell colSpan={4} className="text-center text-error-400 py-8">
      {error}
    </TableCell>
  </TableRow>
);

export const PositionsTable = () => {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const positions = usePositionsStore((state) => state.positions);
  const isLoading = usePositionsStore((state) => state.isLoadingPositions);
  const error = usePositionsStore((state) => state.positionsError);

  const renderTableContent = () => {
    if (!walletAddress) {
      return <EmptyState />;
    }

    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    if (positions.length === 0) {
      return <NoPositionsState />;
    }

    return positions.map((position) => (
      <PositionRow
        key={`${position.accountId}-${position.symbol}`}
        position={position}
      />
    ));
  };

  return (
    <div className="flex flex-col gap-4 w-full px-2 py-3 border-b border-black-400">
      <h2 className="font-bold text-white-100">Positions</h2>
      <Table>
        <TableHeader className="border-none">
          <TableRow className="border-none">
            {TABLE_HEADERS.map((header, index) => (
              <TableHead
                className={cn("text-white-950 text-xs h-10", {
                  "text-right": index === TABLE_HEADERS.length - 1,
                })}
                key={header}
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{renderTableContent()}</TableBody>
      </Table>
    </div>
  );
};
