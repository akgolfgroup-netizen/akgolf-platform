import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Zap, XCircle, X } from "lucide-react";
import type { FC, SVGProps } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AlertCardProps {
  title: string;
  description: string;
  severity: "info" | "warning" | "urgent" | "critical";
  actionLabel?: string;
  onAction?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_CONFIG: Record<
  AlertCardProps["severity"],
  {
    stripe: string;
    bg: string;
    color: string;
    Icon: FC<SVGProps<SVGSVGElement>>;
  }
> = {
  info: {
    stripe: "#005840",
    bg: "rgba(0,88,64,0.04)",
    color: "#005840",
    Icon: AlertCircle,
  },
  warning: {
    stripe: "#B8852A",
    bg: "#FFF0D6",
    color: "#B8852A",
    Icon: AlertTriangle,
  },
  urgent: {
    stripe: "#D1F843",
    bg: "rgba(209,248,67,0.08)",
    color: "#0A1F18",
    Icon: Zap,
  },
  critical: {
    stripe: "#A32D2D",
    bg: "#FAE3E3",
    color: "#A32D2D",
    Icon: XCircle,
  },
};

// ---------------------------------------------------------------------------
// Component (server component — no "use client")
// ---------------------------------------------------------------------------

export function AlertCard({
  title,
  description,
  severity,
  actionLabel,
  onAction,
  dismissible = false,
  onDismiss,
  className,
}: AlertCardProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <div
      className={cn("relative flex", className)}
      style={{
        borderRadius: 12,
        backgroundColor: config.bg,
        overflow: "hidden",
      }}
    >
      {/* Left stripe */}
      <div
        style={{
          width: 4,
          backgroundColor: config.stripe,
          flexShrink: 0,
        }}
      />

      {/* Content */}
      <div className="flex gap-3 p-4 flex-1 min-w-0">
        {/* Icon */}
        <config.Icon
          width={20}
          height={20}
          strokeWidth={1.75}
          style={{ color: config.color, flexShrink: 0, marginTop: 1 }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Title */}
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "14px",
              fontWeight: 600,
              color: "#0A1F18",
              lineHeight: 1.3,
            }}
          >
            {title}
          </span>

          {/* Description */}
          <span
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "13px",
              fontWeight: 400,
              color: "#5E5C57",
              lineHeight: 1.5,
            }}
          >
            {description}
          </span>

          {/* Action button */}
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "13px",
                fontWeight: 600,
                color: config.color,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                marginTop: 4,
                textAlign: "left",
                width: "fit-content",
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Dismiss button */}
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#9C9990",
          }}
          aria-label="Lukk varsel"
        >
          <X size={16} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

export type { AlertCardProps };
