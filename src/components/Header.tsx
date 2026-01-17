import { Menu } from "lucide-react";
import { WalletConnect } from "./WalletConnect";
import { Sidebar } from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import reyaLogo from "@/assets/logos/reya-logo.svg";

export const Header = () => {
  return (
    <header className="flex items-center justify-between h-16 px-2 py-3 border-b border-black-400 bg-black-700 shrink-0">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white-100 hover:bg-black-100"
              >
                <Menu className="w-5 h-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 bg-black-700 border-r border-black-400 w-64"
            >
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center h-16 px-4 border-b border-black-400">
                <img src={reyaLogo} alt="Reya Logo" className="h-8 w-8" />
              </div>
              <Sidebar isMobile />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center sm:border-r sm:border-black-400 sm:pr-4">
            <img src={reyaLogo} alt="Reya Logo" className="h-8 w-8" />
          </div>
          <h1 className="text-sm font-medium text-white-950">Portfolio</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <WalletConnect />
      </div>
    </header>
  );
};
