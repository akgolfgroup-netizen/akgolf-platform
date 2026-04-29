import type { ReactNode } from "react";
import { MapPin, Zap, AlertCircle, Users, type LucideIcon } from "lucide-react";
import { Pill } from "../Primitives";

const META_ICON: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  zap: Zap,
  "alert-circle": AlertCircle,
  users: Users,
};

export type TimelineRowVariant = "default" | "live" | "next";

export interface TimelineRow {
  time: string;
  duration: string;
  title: string;
  metaIcon: keyof typeof META_ICON;
  meta: string;
  pill: { tone: "default" | "accent" | "success" | "warn"; label: string };
  variant?: TimelineRowVariant;
  pulse?: boolean;
}

const VARIANT_STYLES: Record<
  TimelineRowVariant,
  { border: string; background: string }
> = {
  default: {
    border: "rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.025)",
  },
  live: {
    border: "#D1F843",
    background: "rgba(209,248,67,0.16)",
  },
  next: {
    border: "#6FCBA1",
    background: "rgba(42,125,90,0.16)",
  },
};

export function Timeline({ rows }: { rows: TimelineRow[] }) {
  return (
    <div className="flex flex-col gap-1">
      {rows.map((row, idx) => {
        const variant = row.variant ?? "default";
        const styles = VARIANT_STYLES[variant];
        const Icon = META_ICON[row.metaIcon] ?? MapPin;

        return (
          <div
            key={idx}
            className="grid gap-3.5 py-3"
            style={{
              gridTemplateColumns: "64px 1fr",
              borderBottom:
                idx === rows.length - 1 ? "none" : "1px solid #1a4a3a",
            }}
          >
            <div
              className="pt-0.5 text-right"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.05em",
              }}
            >
              {row.time}
              <span
                className="block mt-0.5"
                style={{
                  fontSize: 9,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                {row.duration}
              </span>
            </div>
            <div
              className="px-3.5 py-2.5"
              style={{
                background: styles.background,
                borderLeft: `2px solid ${styles.border}`,
                borderRadius: "0 10px 10px 0",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: "#FFFFFF" }}
                >
                  {row.pulse && <PulseDot />} {row.title}
                </div>
                <Pill tone={row.pill.tone}>{row.pill.label}</Pill>
              </div>
              <div
                className="flex items-center gap-2 text-[11px]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                <Icon className="w-3 h-3" strokeWidth={1.8} />
                <span>{row.meta}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PulseDot(): ReactNode {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full mr-1.5 align-middle"
      style={{
        background: "#D1F843",
        animation: "akg-pulse 1.6s ease-out infinite",
      }}
    />
  );
}
