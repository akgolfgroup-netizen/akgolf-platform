"use client";

import { cn } from "@/lib/utils";
import { Video, MessageCircle, ClipboardList, TestTube2 } from "lucide-react";
import type { FC, SVGProps } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface QueueItem {
  id: string;
  title: string;
  playerName: string;
  type: "video" | "feedback" | "plan_review" | "test_result";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  slaMinutes?: number;
  elapsedMinutes?: number;
}

interface PriorityQueueListProps {
  items: QueueItem[];
  onItemClick?: (item: QueueItem) => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRIORITY_ORDER: Record<QueueItem["priority"], number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const PRIORITY_COLOR: Record<QueueItem["priority"], string> = {
  critical: "#A32D2D",
  high: "#D1F843",
  medium: "#B8852A",
  low: "#9C9990",
};

const TYPE_ICON: Record<QueueItem["type"], FC<SVGProps<SVGSVGElement>>> = {
  video: Video,
  feedback: MessageCircle,
  plan_review: ClipboardList,
  test_result: TestTube2,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sortItems(items: QueueItem[]): QueueItem[] {
  return [...items].sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return (b.elapsedMinutes ?? 0) - (a.elapsedMinutes ?? 0);
  });
}

function formatSla(sla?: number, elapsed?: number): string | null {
  if (elapsed === undefined) return null;
  if (sla !== undefined) {
    const remaining = sla - elapsed;
    if (remaining <= 0) return `+${Math.abs(remaining)}m`;
    return `${remaining}m`;
  }
  return `${elapsed}m`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PriorityQueueList({
  items,
  onItemClick,
  className,
}: PriorityQueueListProps) {
  const sorted = sortItems(items);

  if (sorted.length === 0) {
    return (
      <div
        className={cn("flex items-center justify-center py-12", className)}
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
          color: "#9C9990",
        }}
      >
        Ingen oppgaver i køen
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {sorted.map((item) => {
        const Icon = TYPE_ICON[item.type];
        const stripeColor = PRIORITY_COLOR[item.priority];
        const slaText = formatSla(item.slaMinutes, item.elapsedMinutes);
        const isOverSla =
          item.slaMinutes !== undefined &&
          item.elapsedMinutes !== undefined &&
          item.elapsedMinutes > item.slaMinutes;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick?.(item)}
            className="flex items-center gap-3 text-left"
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #EFEDE6",
              background: "transparent",
              border: "none",
              borderBlockEnd: "1px solid #EFEDE6",
              cursor: onItemClick ? "pointer" : "default",
              width: "100%",
              transition: "background-color 120ms ease-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(0,88,64,0.04)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Priority stripe */}
            <span
              style={{
                width: 4,
                alignSelf: "stretch",
                borderRadius: 2,
                backgroundColor: stripeColor,
                flexShrink: 0,
              }}
            />

            {/* Type icon */}
            <Icon
              width={16}
              height={16}
              strokeWidth={1.75}
              style={{ color: "#5E5C57", flexShrink: 0 }}
              aria-hidden="true"
            />

            {/* Text content */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#0A1F18",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.title}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "12px",
                  color: "#5E5C57",
                }}
              >
                {item.playerName}
              </span>
            </div>

            {/* SLA clock */}
            {slaText && (
              <span
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  fontSize: "11px",
                  fontWeight: 500,
                  color: isOverSla ? "#A32D2D" : "#9C9990",
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {slaText}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { QueueItem, PriorityQueueListProps };
