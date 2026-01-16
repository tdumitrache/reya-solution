import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: HH:mm UTC
      const hours = now.getUTCHours().toString().padStart(2, "0");
      const minutes = now.getUTCMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes} UTC`);
    };

    updateTime(); // Initial
    const interval = setInterval(updateTime, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="flex items-center justify-between h-10 px-4 border-t border-black-400 bg-black-700 shrink-0 text-xs text-white-950">
      <div className="flex items-center gap-4">
        <span>{time}</span>
        <Separator orientation="vertical" className="h-3 bg-black-100" />
      </div>

      <div className="flex items-center gap-6">
        <a
          href="#"
          target="_blank"
          className="flex items-center gap-1 hover:text-white-100 transition-colors"
        >
          Docs
          <ArrowUpRight className="w-3 h-3" />
        </a>
        <Separator orientation="vertical" className="h-3 bg-black-100" />
        <a
          href="#"
          target="_blank"
          className="hover:text-white-100 transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
}
