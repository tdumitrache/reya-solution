import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWalletStore, usePositionsStore } from "@/store";

export const WalletConnect = () => {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const setWalletAddress = useWalletStore((state) => state.setWalletAddress);
  const fetchPositions = usePositionsStore((state) => state.fetchPositions);
  const clearPositions = usePositionsStore((state) => state.clearPositions);

  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isValidEthAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleSave = () => {
    if (!inputValue) {
      setError("Address is required");
      return;
    }
    if (!isValidEthAddress(inputValue)) {
      setError("Invalid Ethereum address format");
      return;
    }
    setWalletAddress(inputValue);
    // Auto-fetch positions when wallet address is set
    if (inputValue) {
      fetchPositions(inputValue);
    } else {
      clearPositions();
    }
    setError(null);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError(null);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && walletAddress) {
      setInputValue(walletAddress);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-xl border-white-950 bg-black-600 text-white-950 hover:bg-black-100 p-2 cursor-pointer hover:text-white-100 text-xs font-bold"
          )}
        >
          {walletAddress ? formatAddress(walletAddress) : "Connect Wallet"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-black-700 border-black-100 text-white-100 duration-300">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="wallet-address"
              placeholder="0x..."
              value={inputValue}
              onChange={handleInputChange}
              className={cn(
                "bg-black-100 border-black-100 text-white-100 placeholder:text-white-950 focus-visible:ring-0",
                error && "border-error-400 focus-visible:ring-error-400"
              )}
            />
            {error && <p className="text-xs text-error-400">{error}</p>}
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-white-950 cursor-pointer bg-black-400 hover:text-white-100 hover:bg-black-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSave}
            className="bg-primary-300 text-black-700 font-medium cursor-pointer hover:bg-primary-300/90 transition-colors"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
