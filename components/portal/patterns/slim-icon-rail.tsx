"use client";

/**
 * SlimIconRail — Pattern P-10 (v3.1 Course Hero v4)
 *
 * 68px slim ikon-rail for Course Hero-skjermer.
 * Alternativ til standard 220px sidebar.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-rail)
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface SlimIconRailItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string | number;
  /** Hvis satt, matches kun denne eksakte pathen. Ellers startsWith. */
  exactMatch?: boolean;
}

interface SlimIconRailProps {
  logo?: ReactNode;
  items: SlimIconRailItem[];
  footer?: ReactNode;
  className?: string;
}

export function SlimIconRail({
  logo,
  items,
  footer,
  className,
}: SlimIconRailProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col items-center gap-1 py-4 z-10",
        "bg-[rgba(10,20,15,0.55)] backdrop-blur-[22px] backdrop-saturate-[130%]",
        "border-r border-white/[0.08]",
        "w-[68px] min-h-screen",
        className
      )}
    >
      {logo && <div className="mb-3.5">{logo}</div>}

      <nav className="flex flex-col gap-1 w-full items-center flex-1">
        {items.map((item) => {
          const isActive = item.exactMatch
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative w-10 h-10 rounded-xl grid place-items-center",
                "transition-all duration-200",
                isActive
                  ? "bg-accent-cta text-[#0A1F18]"
                  : "text-white/55 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 1.75} />
              {item.badge !== undefined && item.badge !== 0 && (
                <span
                  className={cn(
                    "absolute top-1.5 right-1.5 min-w-[14px] h-[14px] rounded-full",
                    "text-[8px] font-extrabold grid place-items-center px-0.5",
                    "border-2 border-[#0a0f0c]",
                    isActive
                      ? "bg-[#0A1F18] text-accent-cta border-accent-cta"
                      : "bg-accent-cta text-[#0A1F18]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {footer && <div className="mt-auto">{footer}</div>}
    </aside>
  );
}

/**
 * SlimIconRailLogo — AK Golf-logo tilpasset 40x40 rail-slot.
 */
export function SlimIconRailLogo() {
  return (
    <div className="w-10 h-10 rounded-xl bg-white grid place-items-center overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
      <span className="font-extrabold text-[13px] tracking-tight text-[#0A1F18]">
        AK
      </span>
    </div>
  );
}

/**
 * SlimIconRailAvatar — sirkulær avatar med initialer.
 */
export function SlimIconRailAvatar({ initials }: { initials: string }) {
  return (
    <div className="w-9 h-9 rounded-full grid place-items-center font-bold text-xs text-accent-cta border-2 border-white/10 bg-gradient-to-br from-primary to-[#0A1F18]">
      {initials}
    </div>
  );
}
