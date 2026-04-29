import { COLORS, Pill, SubHeader } from "./primitives";
import type { CoachNote, KpiBlock } from "./types";

/**
 * Coaching-kort for d8 long page. Inkluderer KPIer for økter, snitt-lengde,
 * cancel-rate, deretter en aktiv plan-progress og siste coach-notater.
 */
export function CoachingCardLong({
  kpis,
  weekProgress,
  notes,
}: {
  kpis: KpiBlock[];
  weekProgress: { current: number; total: number; description: string };
  notes: CoachNote[];
}) {
  return (
    <div>
      <div className="mb-[16px] grid grid-cols-3 gap-[12px]">
        {kpis.map((k) => (
          <CoachStat key={k.label} kpi={k} />
        ))}
      </div>
      <SubHeader first>Aktiv plan: Performance Q2</SubHeader>
      <div
        className="rounded-[10px] p-[14px]"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: `1px solid ${COLORS.line}`,
        }}
      >
        <div className="mb-[10px] flex items-center justify-between">
          <strong className="text-[13px]" style={{ color: "#fff" }}>
            Performance Q2 — april–juni
          </strong>
          <Pill tone="accent">
            Uke {weekProgress.current} av {weekProgress.total}
          </Pill>
        </div>
        <div className="mb-[6px] flex gap-[6px]">
          {Array.from({ length: weekProgress.total }).map((_, i) => (
            <div
              key={i}
              className="h-[6px] flex-1 rounded-[3px]"
              style={{
                background:
                  i < weekProgress.current
                    ? COLORS.accent
                    : "rgba(255,255,255,0.10)",
              }}
            />
          ))}
        </div>
        <div className="text-[12px] leading-[1.5]" style={{ color: COLORS.textMuted }}>
          {weekProgress.description}
        </div>
      </div>
      <SubHeader>Siste coach-notater</SubHeader>
      <div className="flex flex-col gap-[8px]">
        {notes.map((note, idx) => (
          <div
            key={`${note.date}-${idx}`}
            className="rounded-[6px] px-[14px] py-[12px]"
            style={{
              background: "rgba(175,82,222,0.10)",
              borderLeft: `3px solid ${COLORS.violet}`,
            }}
          >
            <div
              className="mb-[4px] font-mono text-[11px]"
              style={{ color: COLORS.textSubtle }}
            >
              {note.date} · {note.coach.toUpperCase()}
            </div>
            <div className="text-[12px] leading-[1.5]" style={{ color: "rgba(255,255,255,0.8)" }}>
              {note.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachStat({ kpi }: { kpi: KpiBlock }) {
  const trendColor =
    kpi.trend === "up"
      ? COLORS.success
      : kpi.trend === "down"
        ? COLORS.danger
        : COLORS.textSubtle;
  return (
    <div
      className="rounded-[10px] px-[14px] py-[12px]"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-[0.14em]"
        style={{ color: COLORS.textTertiary }}
      >
        {kpi.label}
      </div>
      <div
        className="mt-[4px] text-[20px] font-bold tabular-nums tracking-[-0.02em]"
        style={{ color: COLORS.textPrimary }}
      >
        {kpi.value}
        {kpi.subText ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: COLORS.textSubtle }}
          >
            {kpi.subText}
          </small>
        ) : null}
        {kpi.trendLabel ? (
          <small
            className="ml-[4px] text-[10px] font-medium"
            style={{ color: trendColor }}
          >
            {kpi.trendLabel}
          </small>
        ) : null}
      </div>
    </div>
  );
}
