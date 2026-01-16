import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Position {
  id: string;
  market: string;
  leverage?: string;
  isLong: boolean;
  size: string;
  positionValue: string;
  markPrice: string;
}

const POSITIONS: Position[] = [
  {
    id: "1",
    market: "ETH",
    isLong: false,
    size: "1.30",
    positionValue: "$30.01",
    markPrice: "1,450.03",
  },
  {
    id: "2",
    market: "BTC",
    isLong: true,
    size: "123.30",
    positionValue: "$134,307,430.01",
    markPrice: "45,450.03",
  },
  {
    id: "3",
    market: "SOL",
    isLong: false,
    size: "135.30",
    positionValue: "$107,430.01",
    markPrice: "445,450.03",
  },
  {
    id: "4",
    market: "ETH",
    isLong: true,
    size: "1.30",
    positionValue: "$30.01",
    markPrice: "1,450.03",
  },
  {
    id: "5",
    market: "kSHIB",
    isLong: true,
    size: "1,283.30",
    positionValue: "$30.01",
    markPrice: "45,450.03",
  },
  {
    id: "6",
    market: "PYTH 5x",
    isLong: false,
    size: "1345.30",
    positionValue: "$0.01",
    markPrice: "445,450.03",
  },
  {
    id: "7",
    market: "ETH 15x",
    isLong: false,
    size: "1.30",
    positionValue: "$670.01",
    markPrice: "1,450.03",
  },
];

const TABLE_HEADERS = ["Market", "Size", "Position Value", "Mark Price"];

export const PositionsTable = () => {
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
        <TableBody>
          {POSITIONS.map((position) => (
            <TableRow key={position.id} className="border-none">
              <TableCell
                className={cn(
                  "font-medium text-xs",
                  position.isLong ? "text-primary-300" : "text-error-400"
                )}
              >
                {position.market}
              </TableCell>
              <TableCell className="text-white-100 text-xs">
                {position.size}
              </TableCell>
              <TableCell className="text-white-100 text-xs">
                {position.positionValue}
              </TableCell>
              <TableCell className="text-white-100 text-xs text-right">
                {position.markPrice}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
