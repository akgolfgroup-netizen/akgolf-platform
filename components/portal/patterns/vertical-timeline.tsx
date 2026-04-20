/**
 * VerticalTimeline — Pattern P-06 (v3.1)
 *
 * Vertikal dag-tidslinje med tid-prefix + dot-divider + tittel.
 * Erstatter "hva skjer i dag"-lister med rolig rytme.
 *
 * Brukt i dashboard V3 Editorial, Booking-flaten, Dagbok streak-milepæler.
 *
 * Kilde: /tmp/ak-golf-design/screens/dashboard-v3-editorial.html
 */

import { cn } from "@/lib/utils";
import { MonoLabel } from "./mono-label";
import type { ReactNode } from "react";

export type TimelineDotColor = "lime" | "sage" | "coral" | "blue" | "amber" | "muted";

export interface TimelineItem {
  id?: string;
  time: string; // e.g. "08:30" or "Tirsdag"
  title: string;
  meta?: string;
  dotColor?: TimelineDotColor;
  active?: boolean;
  href?: string;
  rightSlot?: ReactNode;
}

interface VerticalTimelineProps {
  items: TimelineItem[];
  className?: string;
  compact?: boolean;
}

const DOT_COLOR_MAP: Record<TimelineDotColor, string> = {
  lime: "bg-secondary-fixed",
  sage: "bg-[#2A7D5A]",
  coral: "bg-[#E85D4E]",
  blue: "bg-[#007AFF]",
  amber: "bg-[#E8A94A]",
  muted: "bg-outline-variant",
};

export function VerticalTimeline({ items, className, compact = false }: VerticalTimelineProps) {
  return (
    <ol className={cn("relative", className)}>
      {/* Vertical line */}
      <span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[42px] w-px bg-surface-container"
      />

      {items.map((item, i) => {
        const dotClass = DOT_COLOR_MAP[item.dotColor ?? "muted"];
        const isLast = i === items.length - 1;
        const content = (
          <>
            <MonoLabel
              size="xs"
              className="w-[34px] shrink-0 text-on-surface-variant pt-0.5 text-right"
            >
              {item.time}
            </MonoLabel>

            <div className="relative flex-shrink-0">
              <span
                className={cn(
                  "block w-2 h-2 rounded-full ring-2 ring-white",
                  dotClass,
                  item.active && "ring-offset-2 ring-offset-white shadow-[0_0_12px_currentColor]"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className={cn("text-[13px] font-semibold text-on-surface", item.active && "text-primary")}>
                {item.title}
              </div>
              {item.meta && (
                <div className="text-[11px] text-on-surface-variant/80 mt-0.5">{item.meta}</div>
              )}
            </div>

            {item.rightSlot && <div className="shrink-0">{item.rightSlot}</div>}
          </>
        );

        const baseClasses = cn(
          "relative flex items-start gap-3",
          compact ? "py-2" : "py-3",
          !isLast && "mb-0"
        );

        if (item.href) {
          return (
            <li key={item.id ?? i} className="relative">
              <a href={item.href} className={cn(baseClasses, "hover:bg-surface rounded-lg -mx-2 px-2")}>
                {content}
              </a>
            </li>
          );
        }

        return (
          <li key={item.id ?? i} className={baseClasses}>
            {content}
          </li>
        );
      })}
    </ol>
  );
}
