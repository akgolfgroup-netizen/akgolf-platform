"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { cn } from "@/lib/portal/utils/cn";

import { useState } from "react";
import type { WidgetId, WidgetSize } from "@/lib/portal/widgets/registry";
import { getWidgetDef } from "@/lib/portal/widgets/registry";
import { TrendingUp, Trophy, Timer, CalendarDays, Medal, MessageSquare, LayoutGrid, HeartPulse, AlertTriangle, Puzzle, Repeat, type LucideIcon } from "lucide-react";

// ── Lucide icon-map for widgets ──────────────────────────

const WIDGET_ICON_MAP: Record<string, LucideIcon> = {
  "trending-up": TrendingUp,
  trophy: Trophy,
  timer: Timer,
  "calendar-days": CalendarDays,
  medal: Medal,
  "message-square": MessageSquare,
  "layout-grid": LayoutGrid,
  "heart-pulse": HeartPulse,
  "alert-triangle": AlertTriangle,
  puzzle: Puzzle,
  repeat: Repeat,
};

function WidgetIcon({ name, className }: { name: string; className?: string }) {
  const Icon = WIDGET_ICON_MAP[name] ?? LayoutGrid;
  return <Icon className={className} />;
}

// ── Typer ────────────────────────────────────────────────

interface WidgetBaseProps {
  widgetId: WidgetId;
  size?: WidgetSize;
  isEditing?: boolean;
  onRemove?: (id: WidgetId) => void;
  children: React.ReactNode;
  className?: string;
}

// ── Komponent ────────────────────────────────────────────

/**
 * WidgetBase — felles wrapper for alle dashboard-widgets.
 *
 * Brand Guide V2.0: rounded-2xl, border-grey-100, bg-white, shadow-sm.
 * Støtter drag-handle i redigeringsmodus og fjern-knapp.
 */
export function WidgetBase({
  widgetId,
  size = "medium",
  isEditing = false,
  onRemove,
  children,
  className,
}: WidgetBaseProps) {
  const [showActions, setShowActions] = useState(false);
  const def = getWidgetDef(widgetId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-200",
        "hover:border-grey-200 hover:shadow-md",
        size === "large" && "min-h-[320px]",
        size === "medium" && "min-h-[200px]",
        size === "small" && "min-h-[160px]",
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {isEditing && (
            <div
              className="cursor-grab active:cursor-grabbing text-grey-300 hover:text-grey-500"
              data-drag-handle
            >
              <Icon name="drag_indicator" className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-soft">
            <WidgetIcon name={def.icon} className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">{def.title}</h3>
            <p className="text-xs text-muted">{def.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center gap-1 transition-opacity",
            showActions || isEditing ? "opacity-100" : "opacity-0"
          )}
        >
          <button
            className="p-1.5 rounded-md text-grey-400 hover:bg-grey-50 hover:text-text transition-colors"
            title="Innstillinger"
          >
            <Icon name="settings" className="w-3.5 h-3.5" />
          </button>
          {isEditing && onRemove && (
            <button
              onClick={() => onRemove(widgetId)}
              className="p-1.5 rounded-md text-grey-400 hover:bg-error-light hover:text-error transition-colors"
              title="Fjern widget"
            >
              <Icon name="close" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}
