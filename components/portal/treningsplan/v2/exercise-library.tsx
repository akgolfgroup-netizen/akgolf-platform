"use client";

import { useMemo, useState } from "react";
import {
  Brain,
  CircleDot,
  FlagTriangleRight,
  PlayCircle,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

export interface LibraryItem {
  id: string;
  name: string;
  description: string;
  /** UI category — styres via filter-chips */
  category: "putting" | "iron" | "short" | "driver" | "mental";
  /** Vist på badge — kan inkludere "video" osv. */
  badgeText?: string;
  durationLabel: string;
  coachName?: string;
  footerLabel?: string;
  hasVideo?: boolean;
}

const CATEGORY_LABEL: Record<LibraryItem["category"], string> = {
  putting: "Putting",
  iron: "Iron",
  short: "Short game",
  driver: "Driver",
  mental: "Mental",
};

const CATEGORY_STYLE: Record<
  LibraryItem["category"],
  { thumb: string; badge: string; icon: LucideIcon }
> = {
  putting: {
    thumb:
      "bg-[linear-gradient(135deg,rgba(118,193,156,0.18),rgba(13,46,35,0.6))]",
    badge: "bg-[rgba(118,193,156,0.30)] text-[#6FCBA1]",
    icon: CircleDot,
  },
  iron: {
    thumb:
      "bg-[linear-gradient(135deg,rgba(126,158,255,0.20),rgba(13,46,35,0.6))]",
    badge: "bg-[rgba(126,158,255,0.30)] text-[#8AA8FF]",
    icon: PlayCircle,
  },
  short: {
    thumb:
      "bg-[linear-gradient(135deg,rgba(232,185,103,0.20),rgba(13,46,35,0.6))]",
    badge: "bg-[rgba(232,185,103,0.30)] text-[#E8B967]",
    icon: FlagTriangleRight,
  },
  driver: {
    thumb:
      "bg-[linear-gradient(135deg,rgba(244,146,131,0.20),rgba(13,46,35,0.6))]",
    badge: "bg-[rgba(244,146,131,0.30)] text-[#F49283]",
    icon: Zap,
  },
  mental: {
    thumb:
      "bg-[linear-gradient(135deg,rgba(200,150,232,0.20),rgba(13,46,35,0.6))]",
    badge: "bg-[rgba(200,150,232,0.30)] text-[#C896E8]",
    icon: Brain,
  },
};

type FilterKey = "all" | LibraryItem["category"] | "video";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Alle" },
  { key: "putting", label: "Putting" },
  { key: "iron", label: "Iron" },
  { key: "short", label: "Short game" },
  { key: "driver", label: "Driver" },
  { key: "mental", label: "Mental" },
  { key: "video", label: "Med video" },
];

export function ExerciseLibrary({ items }: { items: LibraryItem[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "video") return items.filter((i) => i.hasVideo);
    return items.filter((i) => i.category === filter);
  }, [items, filter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
              filter === f.key
                ? "border-[rgba(209,248,67,0.30)] bg-[rgba(209,248,67,0.12)] text-[var(--akgolf-accent,#D1F843)]"
                : "border-white/10 bg-white/[0.04] text-white/70 hover:text-white",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => {
          const style = CATEGORY_STYLE[item.category];
          const Icon = style.icon;
          return (
            <div
              key={item.id}
              className={cn(
                "overflow-hidden rounded-[14px] border bg-[var(--akgolf-card-dark,#0D2E23)]",
                "border-[var(--akgolf-line-dark,#1a4a3a)] transition",
                "hover:-translate-y-0.5 hover:border-white/20",
              )}
            >
              <div
                className={cn(
                  "relative grid aspect-video place-items-center",
                  style.thumb,
                )}
              >
                <Icon className="h-9 w-9 text-white/60" />
                <span
                  className={cn(
                    "absolute left-2.5 top-2.5 rounded-full px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.1em]",
                    style.badge,
                  )}
                >
                  {item.badgeText ?? CATEGORY_LABEL[item.category]}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] font-semibold text-white">
                  {item.durationLabel}
                </span>
              </div>
              <div className="px-4 pb-4 pt-3.5">
                <div className="mb-1 text-[14px] font-bold tracking-[-0.01em] text-white">
                  {item.name}
                </div>
                <div className="text-[12px] leading-[1.5] text-white/60">
                  {item.description}
                </div>
                <div
                  className={cn(
                    "mt-3 flex items-center justify-between border-t border-dashed pt-3",
                    "border-[var(--akgolf-line-dark,#1a4a3a)]",
                    "font-mono text-[10px] uppercase tracking-[0.06em] text-white/55",
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3" />{" "}
                    {(item.coachName ?? "Coach").toUpperCase()}
                  </span>
                  {item.footerLabel && <span>{item.footerLabel}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
