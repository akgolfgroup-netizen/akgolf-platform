/**
 * FloatingTopbar — Pattern P-12 (v3.1 Course Hero v4)
 *
 * Flytende topbar over CourseHero — holder crumbs, segmented, og actions
 * side-ved-side med pointer-events-none på wrapperen slik at fotoet forblir klikkbart.
 *
 * Kilde: /tmp/ak-golf-design/screens/_course-hero.css (.ch-topbar)
 */

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface FloatingTopbarProps extends HTMLAttributes<HTMLDivElement> {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
}

export function FloatingTopbar({
  left,
  center,
  right,
  className,
  ...props
}: FloatingTopbarProps) {
  return (
    <div
      className={cn(
        "absolute top-5 left-6 right-6 z-20 pointer-events-none",
        "flex items-center justify-between gap-4",
        className
      )}
      {...props}
    >
      {/* Alle barn re-enabler pointer events */}
      <div className="pointer-events-auto flex items-center gap-3">{left}</div>
      {center && (
        <div className="pointer-events-auto flex-1 flex items-center justify-center">
          {center}
        </div>
      )}
      <div className="pointer-events-auto flex items-center gap-2">{right}</div>
    </div>
  );
}

/**
 * FloatingCrumbs — glass-pill med brødsmule-navigasjon.
 */
interface FloatingCrumbsProps extends HTMLAttributes<HTMLDivElement> {
  items: {
    label: string;
    active?: boolean;
    meta?: string;
  }[];
}

export function FloatingCrumbs({
  items,
  className,
  ...props
}: FloatingCrumbsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full",
        "bg-[rgba(12,22,17,0.62)] backdrop-blur-[22px] backdrop-saturate-[130%]",
        "border border-white/[0.14] text-white/88 text-xs",
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2.5">
          {i > 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
          <span className={item.active ? "font-semibold text-white" : ""}>
            {item.label}
          </span>
          {item.meta && (
            <span className="text-white/55 text-[11px]">{item.meta}</span>
          )}
        </span>
      ))}
    </div>
  );
}

/**
 * FloatingSegmented — glass-segmented control for view-switching.
 */
interface FloatingSegmentedProps<T extends string> {
  items: { id: T; label: string }[];
  activeId: T;
  onChange: (id: T) => void;
  variant?: "dark" | "light";
  className?: string;
}

export function FloatingSegmented<T extends string>({
  items,
  activeId,
  onChange,
  variant = "dark",
  className,
}: FloatingSegmentedProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex p-1 rounded-full gap-0.5 border",
        "backdrop-blur-[22px] backdrop-saturate-[130%]",
        variant === "dark"
          ? "bg-[rgba(12,22,17,0.62)] border-white/[0.14]"
          : "bg-[rgba(248,250,246,0.78)] border-[rgba(10,31,24,0.08)]",
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200",
              isActive
                ? "bg-[#0A1F18] text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]"
                : variant === "dark"
                  ? "text-white/60 hover:text-white"
                  : "text-grey-500 hover:text-grey-900"
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
