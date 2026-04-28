import type { ReactNode } from "react";
import { AlertTriangle, TrendingDown, Award, type LucideIcon } from "lucide-react";

type SignalTone = "urgent" | "attention" | "opportunity";

interface SignalCardProps {
  tone: SignalTone;
  corner: string;
  iconName: "alert-triangle" | "trending-down" | "award";
  num: ReactNode;
  numSuffix?: string;
  description: ReactNode;
  actions?: ReactNode;
}

const ICON_MAP: Record<SignalCardProps["iconName"], LucideIcon> = {
  "alert-triangle": AlertTriangle,
  "trending-down": TrendingDown,
  award: Award,
};

const TONE_STYLES: Record<
  SignalTone,
  { border: string; background: string; cornerColor: string; iconColor: string; shadow?: string }
> = {
  urgent: {
    border: "rgba(184,66,51,0.30)",
    background: "rgba(184,66,51,0.10)",
    cornerColor: "#F49283",
    iconColor: "#F49283",
  },
  attention: {
    border: "rgba(196,138,50,0.30)",
    background: "rgba(196,138,50,0.10)",
    cornerColor: "#E8B967",
    iconColor: "#E8B967",
  },
  opportunity: {
    border: "rgba(209,248,67,0.30)",
    background: "rgba(209,248,67,0.16)",
    cornerColor: "#D1F843",
    iconColor: "#D1F843",
    shadow: "0 0 24px rgba(209,248,67,0.20)",
  },
};

export function SignalCard({
  tone,
  corner,
  iconName,
  num,
  numSuffix,
  description,
  actions,
}: SignalCardProps) {
  const styles = TONE_STYLES[tone];
  const Icon = ICON_MAP[iconName];

  return (
    <div
      className="relative overflow-hidden p-[18px]"
      style={{
        background: styles.background,
        border: `1px solid ${styles.border}`,
        borderRadius: 16,
        boxShadow: styles.shadow,
      }}
    >
      <span
        className="absolute top-3.5 right-3.5"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: styles.cornerColor,
        }}
      >
        {corner}
      </span>

      <Icon
        className="w-[22px] h-[22px]"
        strokeWidth={1.8}
        style={{ color: styles.iconColor }}
      />

      <div
        className="mt-6 text-[36px] font-bold"
        style={{
          color: "#FFFFFF",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {num}
        {numSuffix && (
          <small
            className="ml-1 font-medium"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.45)" }}
          >
            {numSuffix}
          </small>
        )}
      </div>

      <div
        className="mt-2.5 text-[13px]"
        style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.45 }}
      >
        {description}
      </div>

      {actions && <div className="mt-3.5 flex gap-2">{actions}</div>}
    </div>
  );
}
