import { Calendar, Dumbbell, Flag, MessageSquare, Wallet } from "lucide-react";
import type { ReactElement } from "react";
import { COLORS, Panel, PanelHead, Pill } from "./primitives";
import type { ActivityRow, UpcomingItem } from "./types";

const ICONS: Record<ActivityRow["kind"], ReactElement> = {
  session: <Dumbbell className="h-3.5 w-3.5" />,
  round: <Flag className="h-3.5 w-3.5" />,
  note: <MessageSquare className="h-3.5 w-3.5" />,
  payment: <Wallet className="h-3.5 w-3.5" />,
};

const ICON_BG: Record<ActivityRow["kind"], { bg: string; color: string }> = {
  session: { bg: "rgba(209,248,67,0.16)", color: COLORS.accent },
  round: { bg: "rgba(0,122,255,0.18)", color: COLORS.info },
  note: { bg: "rgba(175,82,222,0.18)", color: COLORS.violet },
  payment: { bg: "rgba(42,125,90,0.22)", color: COLORS.success },
};

export function ActivityList({ rows }: { rows: ActivityRow[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((row, idx) => (
        <div
          key={`${row.date}-${idx}`}
          className="grid items-center gap-[14px] py-[12px]"
          style={{
            gridTemplateColumns: "80px 32px 1fr auto",
            borderBottom:
              idx === rows.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <span
            className="font-mono text-[11px] tracking-[0.06em]"
            style={{ color: COLORS.textSubtle }}
          >
            {row.date}
          </span>
          <span
            className="grid h-[28px] w-[28px] place-items-center rounded-[7px]"
            style={{
              background: ICON_BG[row.kind].bg,
              color: ICON_BG[row.kind].color,
            }}
          >
            {ICONS[row.kind]}
          </span>
          <div>
            <div
              className="text-[13px] font-medium"
              style={{ color: COLORS.textPrimary }}
            >
              {row.title}
            </div>
            <div
              className="mt-[2px] font-mono text-[11px] tracking-[0.04em]"
              style={{ color: COLORS.textSubtle }}
            >
              {row.meta}
            </div>
          </div>
          {row.tag ? (
            <Pill
              tone={
                row.tag.tone === "accent"
                  ? "accent"
                  : row.tag.tone === "success"
                    ? "success"
                    : "neutral"
              }
            >
              {row.tag.label}
            </Pill>
          ) : (
            <span style={{ color: COLORS.textSubtle, fontSize: 11 }}>−</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ActivityPanel({ rows, sub }: { rows: ActivityRow[]; sub: string }) {
  return (
    <Panel>
      <PanelHead
        title="Siste aktivitet"
        sub={sub}
        right={<Pill>Se alt →</Pill>}
      />
      <ActivityList rows={rows} />
    </Panel>
  );
}

export function UpcomingPanel({ items }: { items: UpcomingItem[] }) {
  return (
    <Panel>
      <PanelHead title="Neste opp" sub="planlagt" />
      <div className="flex flex-col gap-[10px]">
        {items.map((item, idx) => (
          <div
            key={`${item.date}-${idx}`}
            className="flex items-center gap-[10px] rounded-[8px] px-[12px] py-[10px]"
            style={{
              background: item.highlight
                ? "rgba(209,248,67,0.10)"
                : "rgba(255,255,255,0.025)",
              borderLeft: `3px solid ${item.highlight ? COLORS.accent : "rgba(255,255,255,0.15)"}`,
            }}
          >
            {item.highlight ? (
              <Calendar
                className="h-3.5 w-3.5"
                style={{ color: COLORS.accent }}
              />
            ) : (
              <Flag
                className="h-3.5 w-3.5"
                style={{ color: COLORS.textMuted }}
              />
            )}
            <div className="flex-1">
              <div
                className="text-[12px] font-semibold"
                style={{ color: "#fff" }}
              >
                {item.date}
              </div>
              <div
                className="font-mono text-[11px] tracking-[0.04em]"
                style={{ color: COLORS.textSubtle }}
              >
                {item.meta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
