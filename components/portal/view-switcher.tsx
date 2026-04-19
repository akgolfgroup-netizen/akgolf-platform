"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/portal/utils/cn";
import { setDefaultView } from "@/lib/portal/preferences/actions";
import {
  type ScreenId,
  type ViewId,
  getScreenViews,
} from "@/lib/portal/views/registry";
import {
  LayoutGrid,
  List,
  BarChart3,
  Columns3,
  Command,
  Target,
  TrendingUp,
  CalendarDays,
  Users,
  Gauge,
  Clock,
  Zap,
  Table2,
  ArrowRightLeft,
  PieChart,
  MapPin,
  Image as ImageIcon,
  Moon,
  BookOpen,
  AlignJustify,
  type LucideIcon,
} from "lucide-react";

// ── Lucide icon-map (string → komponent) ─────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  "layout-grid": LayoutGrid,
  list: List,
  "bar-chart-3": BarChart3,
  "columns-3": Columns3,
  command: Command,
  target: Target,
  "trending-up": TrendingUp,
  "calendar-days": CalendarDays,
  users: Users,
  gauge: Gauge,
  clock: Clock,
  zap: Zap,
  "table-2": Table2,
  "arrow-right-left": ArrowRightLeft,
  "pie-chart": PieChart,
  "map-pin": MapPin,
  image: ImageIcon,
  moon: Moon,
  "book-open": BookOpen,
  "align-justify": AlignJustify,
};

function getIconComponent(iconName: string): LucideIcon {
  return ICON_MAP[iconName] ?? LayoutGrid;
}

// ── Typer ────────────────────────────────────────────────

interface ViewSwitcherProps {
  screenId: ScreenId;
  currentView?: ViewId;
  onViewChange?: (viewId: ViewId) => void;
  className?: string;
  size?: "sm" | "md";
}

// ── Komponent ────────────────────────────────────────────

/**
 * ViewSwitcher — pill-tabs for å bytte mellom views på en skjerm.
 *
 * Modellert etter SubNavTabs, men med ikoner og state-håndtering.
 * Lagrer valgt view i UserPreferences via server action.
 */
export function ViewSwitcher({
  screenId,
  currentView = "opt1",
  onViewChange,
  className,
  size = "md",
}: ViewSwitcherProps) {
  const [activeView, setActiveView] = useState<ViewId>(currentView);
  const [isPending, setIsPending] = useState(false);

  const screenConfig = getScreenViews(screenId);

  const handleViewChange = useCallback(
    async (viewId: ViewId) => {
      if (viewId === activeView || isPending) return;

      setActiveView(viewId);
      setIsPending(true);

      // Lagre preferanse i bakgrunnen
      try {
        const result = await setDefaultView(screenId, viewId);
        if (!result.success) {
          console.warn("[ViewSwitcher] Kunne ikke lagre view-preferanse:", result.error);
        }
      } catch (error) {
        console.error("[ViewSwitcher] Feil ved lagring:", error);
      } finally {
        setIsPending(false);
      }

      onViewChange?.(viewId);
    },
    [activeView, isPending, screenId, onViewChange]
  );

  const pillSizeClasses =
    size === "sm"
      ? "px-3 py-1 text-xs gap-1"
      : "px-4 py-1.5 text-sm gap-1.5";

  return (
    <nav
      className={cn(
        "flex flex-wrap gap-2",
        isPending && "opacity-70 pointer-events-none",
        className
      )}
      aria-label="View-valg"
    >
      {screenConfig.views.map((view) => {
        const isActive = view.id === activeView;
        const Icon = getIconComponent(view.icon);

        return (
          <button
            key={view.id}
            onClick={() => handleViewChange(view.id)}
            className={cn(
              "inline-flex items-center rounded-full font-medium transition-colors",
              pillSizeClasses,
              isActive
                ? "bg-primary text-white"
                : "text-grey-500 hover:bg-grey-50 hover:text-text"
            )}
            aria-pressed={isActive}
            title={view.description ?? view.label}
          >
            <Icon className={cn("shrink-0", size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />
            <span>{view.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
