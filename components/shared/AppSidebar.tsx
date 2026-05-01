"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/portal/utils/cn";

export interface SidebarNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  matchPaths?: string[];
}

interface AppSidebarProps {
  items: SidebarNavItem[];
  header: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  variant?: "portal" | "admin";
}

export function AppSidebar({ items, header, footer, className, variant = "portal" }: AppSidebarProps) {
  const pathname = usePathname();

  const isActive = (item: SidebarNavItem) => {
    if (item.href === "/portal" && pathname === "/portal") return true;
    if (item.href !== "/portal" && pathname.startsWith(item.href)) return true;
    return item.matchPaths?.some((p) => pathname.startsWith(p)) ?? false;
  };

  const baseStyles = variant === "portal"
    ? "bg-[#2d5a27] text-[#fdf9f0]"
    : "bg-[#0F1F18] text-white";

  return (
    <aside className={cn("h-screen w-64 fixed left-0 top-0 flex flex-col py-6 gap-y-4 z-40", baseStyles, className)}>
      {header}

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                active
                  ? variant === "portal"
                    ? "bg-[#d2f000] text-[#154212]"
                    : "bg-[#D1F843] text-[#0A1F18]"
                  : variant === "portal"
                    ? "text-[#fdf9f0]/70 hover:bg-[#154212]/80 hover:text-surface"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer && <div className="mt-auto px-4">{footer}</div>}
    </aside>
  );
}
