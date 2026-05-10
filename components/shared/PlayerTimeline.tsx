import { cn } from "@/lib/utils";
import {
  Calendar,
  ClipboardList,
  Award,
  FileText,
  Flag,
  Video,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TimelineEntry {
  id: string;
  type: "session" | "test" | "milestone" | "note" | "round" | "video";
  title: string;
  description?: string;
  date: string;
  metadata?: Record<string, unknown>;
}

interface PlayerTimelineProps {
  entries: TimelineEntry[];
  maxEntries?: number;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DOT_COLORS: Record<TimelineEntry["type"], string> = {
  session: "#005840",
  test: "#B8852A",
  milestone: "#D1F843",
  note: "#5E5C57",
  round: "#1A7D56",
  video: "#9C9990",
};

const ICON_MAP: Record<
  TimelineEntry["type"],
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
  session: Calendar,
  test: ClipboardList,
  milestone: Award,
  note: FileText,
  round: Flag,
  video: Video,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "mai",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "des",
  ];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day}. ${month} ${year}`;
}

function sortDescending(a: TimelineEntry, b: TimelineEntry): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlayerTimeline({
  entries,
  maxEntries,
  className,
}: PlayerTimelineProps) {
  const sorted = [...entries].sort(sortDescending);
  const visible = maxEntries ? sorted.slice(0, maxEntries) : sorted;
  const hiddenCount = maxEntries ? Math.max(0, sorted.length - maxEntries) : 0;

  if (sorted.length === 0) {
    return (
      <p
        className={cn("text-sm", className)}
        style={{ color: "#9C9990", fontFamily: "var(--font-inter)" }}
      >
        Ingen hendelser ennå.
      </p>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div
        className="absolute left-[9px] top-[5px] bottom-[5px]"
        style={{ width: 2, backgroundColor: "#EFEDE6" }}
        aria-hidden="true"
      />

      <ul className="relative flex flex-col gap-6" role="list">
        {visible.map((entry) => {
          const Icon = ICON_MAP[entry.type];
          const dotColor = DOT_COLORS[entry.type];

          return (
            <li key={entry.id} className="relative flex gap-3 pl-0">
              {/* Dot */}
              <div
                className="relative z-10 mt-[5px] flex-shrink-0"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: dotColor,
                  marginLeft: "4px",
                }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="flex flex-col gap-0.5 min-w-0">
                {/* Date */}
                <time
                  dateTime={entry.date}
                  className="block"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    fontSize: 10,
                    color: "#9C9990",
                    lineHeight: "14px",
                  }}
                >
                  {formatDate(entry.date)}
                </time>

                {/* Title row with icon */}
                <div className="flex items-center gap-1.5">
                  <Icon
                    width={14}
                    height={14}
                    strokeWidth={1.75}
                    style={{ color: dotColor, flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span
                    className="truncate"
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#0A1F18",
                      lineHeight: "20px",
                    }}
                  >
                    {entry.title}
                  </span>
                </div>

                {/* Description */}
                {entry.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: 13,
                      color: "#5E5C57",
                      lineHeight: "18px",
                      margin: 0,
                    }}
                  >
                    {entry.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* "Show more" link */}
      {hiddenCount > 0 && (
        <p
          className="mt-4 pl-[22px]"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: 13,
            fontWeight: 500,
            color: "#005840",
            cursor: "pointer",
          }}
        >
          Vis {hiddenCount} flere
        </p>
      )}
    </div>
  );
}
