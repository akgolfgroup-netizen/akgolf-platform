import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CoachNoteCardProps {
  coachName: string;
  coachInitials: string;
  content: string;
  createdAt: string;
  category?: "general" | "technical" | "mental" | "physical" | "tactical";
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORY_STYLES: Record<
  NonNullable<CoachNoteCardProps["category"]>,
  { bg: string; color: string; label: string }
> = {
  general: { bg: "#EFEDE6", color: "#5E5C57", label: "GENERELT" },
  technical: { bg: "rgba(0,88,64,0.08)", color: "#005840", label: "TEKNISK" },
  mental: { bg: "rgba(209,248,67,0.12)", color: "#0A1F18", label: "MENTALT" },
  physical: { bg: "#FFF0D6", color: "#B8852A", label: "FYSISK" },
  tactical: { bg: "#E5F1EA", color: "#1A7D56", label: "TAKTISK" },
};

// ---------------------------------------------------------------------------
// Component (server component — no "use client")
// ---------------------------------------------------------------------------

export function CoachNoteCard({
  coachName,
  coachInitials,
  content,
  createdAt,
  category,
  className,
}: CoachNoteCardProps) {
  const categoryConfig = category ? CATEGORY_STYLES[category] : null;

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: "20px",
        border: "1px solid #E5E3DD",
        padding: "20px",
      }}
    >
      {/* Top row: avatar + name + date */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: "#005840",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#FFFFFF",
              lineHeight: 1,
            }}
          >
            {coachInitials}
          </span>
        </div>

        {/* Coach name */}
        <span
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "13px",
            fontWeight: 600,
            color: "#0A1F18",
            flex: 1,
          }}
        >
          {coachName}
        </span>

        {/* Date */}
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "10px",
            fontWeight: 400,
            color: "#9C9990",
            flexShrink: 0,
          }}
        >
          {createdAt}
        </span>
      </div>

      {/* Category pill */}
      {categoryConfig && (
        <div>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              padding: "3px 8px",
              borderRadius: "9999px",
              backgroundColor: categoryConfig.bg,
              color: categoryConfig.color,
              lineHeight: "14px",
            }}
          >
            {categoryConfig.label}
          </span>
        </div>
      )}

      {/* Content */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "#0A1F18",
          margin: 0,
        }}
      >
        {content}
      </p>
    </div>
  );
}

export type { CoachNoteCardProps };
