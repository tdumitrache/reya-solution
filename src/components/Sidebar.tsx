import overviewLogo from "@/assets/logos/overview-logo.svg";

import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
}

const SUB_ITEMS = [
  { label: "Portfolio Overview", href: "#", active: true },
  { label: "Perp History", href: "#", active: false },
  { label: "Fees", href: "#", active: false },
];

export const Sidebar = ({ className, isMobile }: SidebarProps) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-black-700 border-black-400 p-2",
        !isMobile && "border-r",
        className
      )}
    >
      <div className="flex flex-col space-y-2">
        <button
          className={cn(
            "flex items-center w-full gap-4 p-3 border border-black-400 text-sm font-bold text-white-100 bg-black-600 rounded-xl hover:bg-black-100 transition-colors"
          )}
        >
          <img src={overviewLogo} alt="Overview Logo" className="h-4 w-4" />

          <span>Overview</span>
        </button>

        <div className="flex flex-col relative pl-4">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white-950/20" />

          <div className="space-y-1">
            {SUB_ITEMS.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center w-full px-4 py-2 text-sm transition-all border-l-2 relative z-10",
                  item.active
                    ? "text-white-100 font-medium border-white-100"
                    : "text-white-950 hover:text-white-100 border-transparent"
                )}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
