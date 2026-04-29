import {
  TrendingDown,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  UserPlus,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import type { HubActivityItem } from "@/app/admin/(authed)/hub/hub-actions";

interface ActivityPanelProps {
  items: HubActivityItem[];
}

const ICON_MAP: Record<HubActivityItem["icon"], LucideIcon> = {
  "trending-down": TrendingDown,
  "alert-circle": AlertCircle,
  "check-circle": CheckCircle,
  "rotate-ccw": RotateCcw,
  "user-plus": UserPlus,
  "dollar-sign": DollarSign,
};

const TONE_STYLES: Record<
  HubActivityItem["tone"],
  { bg: string; color: string }
> = {
  green: { bg: "rgba(42,125,90,0.30)", color: "#6FCBA1" },
  amber: { bg: "rgba(232,185,103,0.20)", color: "#E8B967" },
  purple: { bg: "rgba(175,82,222,0.18)", color: "#C99CF3" },
  neutral: { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)" },
};

/**
 * Aktivitet siste 24 timer — feed med ikon + body + tidsstempel.
 * Match d27-mockup. Reelle data kobles via AgentLog/Booking-events.
 */
export function ActivityPanel({ items }: ActivityPanelProps) {
  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
      }}
    >
      <h3
        className="text-[15px] font-bold mb-3.5 flex items-center justify-between"
        style={{ color: "#FFFFFF" }}
      >
        <span>Aktivitet · siste 24 timer</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.5)",
            fontWeight: 700,
          }}
        >
          SE ALLE
        </span>
      </h3>

      <div>
        {items.map((item, index) => {
          const Icon = ICON_MAP[item.icon];
          const tone = TONE_STYLES[item.tone];
          return (
            <div
              key={item.id}
              className="grid items-center gap-3 py-2.5"
              style={{
                gridTemplateColumns: "28px 1fr auto",
                borderTop:
                  index === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="w-7 h-7 rounded-md grid place-items-center"
                style={{ background: tone.bg }}
              >
                <Icon className="w-[13px] h-[13px]" style={{ color: tone.color }} />
              </div>
              <div
                className="text-[13px] leading-[1.45]"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                {item.bodyHighlight ? (
                  <strong style={{ color: "#FFFFFF", fontWeight: 700 }}>
                    {item.bodyHighlight}
                  </strong>
                ) : null}
                {item.body}
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.06em",
                }}
              >
                {item.when}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
