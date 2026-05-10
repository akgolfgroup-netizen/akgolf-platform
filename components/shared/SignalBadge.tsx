import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Zap, XCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SignalBadgeProps {
  severity: "info" | "warning" | "urgent" | "critical";
  label: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SEVERITY_CONFIG: Record<
  SignalBadgeProps["severity"],
  {
    color: string;
    bg: string;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  }
> = {
  info: {
    color: "#005840",
    bg: "rgba(0,88,64,0.08)",
    Icon: AlertCircle,
  },
  warning: {
    color: "#B8852A",
    bg: "#FFF0D6",
    Icon: AlertTriangle,
  },
  urgent: {
    color: "#0A1F18",
    bg: "rgba(209,248,67,0.12)",
    Icon: Zap,
  },
  critical: {
    color: "#A32D2D",
    bg: "#FAE3E3",
    Icon: XCircle,
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SignalBadge({ severity, label, className }: SignalBadgeProps) {
  const { color, bg, Icon } = SEVERITY_CONFIG[severity];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        className,
      )}
      style={{
        backgroundColor: bg,
        color,
        borderRadius: 12,
        fontFamily: "var(--font-inter)",
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "16px",
        whiteSpace: "nowrap",
      }}
    >
      <Icon
        width={14}
        height={14}
        strokeWidth={1.75}
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}
