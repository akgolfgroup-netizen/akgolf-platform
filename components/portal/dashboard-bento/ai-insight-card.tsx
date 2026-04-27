"use client";

import type { AiInsight } from "@/app/portal/(dashboard)/dashboard-types";

interface AiInsightCardProps {
  insight: AiInsight | null;
  updatedLabel?: string;
}

export function AiInsightCard({
  insight,
  updatedLabel = "Oppdatert nylig",
}: AiInsightCardProps) {
  return (
    <div
      className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[22px] p-5"
      style={{
        background: "linear-gradient(135deg, #FAF5FF, #fff 60%)",
        border: "1px solid rgba(175, 82, 222, 0.15)",
        boxShadow:
          "0 0 0 1px rgba(10, 31, 24, 0.05), 0 1px 2px rgba(10, 31, 24, 0.03), 0 6px 20px rgba(10, 31, 24, 0.05)",
      }}
    >
      <div
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{
          background: "linear-gradient(180deg, #AF52DE, transparent)",
        }}
      />
      <div className="flex items-center gap-2.5">
        <div
          className="grid h-8 w-8 place-items-center rounded-[10px] text-[13px] font-extrabold text-white"
          style={{ background: "#AF52DE" }}
        >
          AI
        </div>
        <div>
          <h3 className="m-0 text-sm font-bold text-[var(--ak-g-800,#1A3529)]">
            AI Coach · Anbefalinger
          </h3>
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#AF52DE" }}
          >
            {updatedLabel}
          </div>
        </div>
      </div>

      {insight ? (
        <>
          <p className="mt-3.5 text-[15px] font-medium leading-[1.55] text-[var(--ak-g-800,#1A3529)]">
            {insight.summary}
          </p>
          {insight.recommendations && insight.recommendations.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-[13px] text-[var(--ak-g-700,#324D45)]">
              {insight.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="flex gap-2">
                  <span
                    className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full"
                    style={{ background: "#AF52DE" }}
                  />
                  {rec}
                </li>
              ))}
            </ul>
          ) : null}
          {insight.weaknesses && insight.weaknesses.length > 0 ? (
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {insight.weaknesses.slice(0, 4).map((w, i) => (
                <span
                  key={i}
                  className="rounded-md border bg-white px-2 py-0.5 text-[10px] font-medium text-[var(--ak-g-600,#3D5249)]"
                  style={{
                    borderColor: "var(--ak-border, rgba(10, 31, 24, 0.08))",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  fokus: {w}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-3.5 text-[14px] text-[var(--ak-g-600,#3D5249)]">
          AI Coach lager innsikter etter at du har logget noen runder eller
          treningsøkter. Logg din første runde for å starte.
        </p>
      )}
    </div>
  );
}
