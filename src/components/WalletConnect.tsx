import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store";

export const WalletConnect = () => {
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const setWalletAddress = useWalletStore((state) => state.setWalletAddress);
  const isDesktop = window.innerWidth >= 768;

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

  const TriggerButton = (
    <Button
      variant="outline"
      className={cn(
        "rounded-x cursor-pointer border-black-400 bg-black-600 text-white-100 hover:bg-black-400 hover:text-white-100 text-xs font-bold transition-all duration-200"
      )}
    >
      {walletAddress ? formatAddress(walletAddress) : "Connect Wallet"}
    </Button>
  );

  const FormContent = (
    <div className="flex flex-col space-y-4 py-4">
      <div className="space-y-2">
        <Input
          id="wallet-address"
          placeholder="0x..."
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            "bg-black-900 border-black-400 text-white-100 placeholder:text-white-950 focus-visible:ring-1 focus-visible:ring-primary-300 focus-visible:border-primary-300 transition-all",
            error &&
              "border-error-400 focus-visible:ring-error-400 focus-visible:border-error-400"
          )}
        />
        {error && <p className="text-xs text-error-400">{error}</p>}
      </div>
    </div>
  );

  const FooterContent = (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(false)}
        className="text-white-950 cursor-pointer bg-black-400 hover:text-white-100 hover:bg-black-100"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={handleSave}
        className="bg-primary-300 text-black-700 font-medium cursor-pointer hover:bg-primary-300/90 transition-colors"
      >
        Save
      </Button>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-md bg-black-700 border-black-400 text-white-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Connect Wallet
            </DialogTitle>
            <DialogDescription className="text-white-950">
              Enter your Ethereum wallet address to track your portfolio.
            </DialogDescription>
          </DialogHeader>
          {FormContent}
          <DialogFooter className="sm:justify-end gap-2">
            {FooterContent}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{TriggerButton}</SheetTrigger>
      <SheetContent
        side="bottom"
        className="bg-black-700 border-t border-black-400 text-white-100 px-6 pb-8"
      >
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="text-xl font-bold text-white-100">
            Connect Wallet
          </SheetTitle>
          <SheetDescription className="text-white-950">
            Enter your Ethereum wallet address to track your portfolio.
          </SheetDescription>
        </SheetHeader>
        {FormContent}
        <SheetFooter className="flex-col gap-3 sm:flex-row sm:justify-end">
          {FooterContent}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
