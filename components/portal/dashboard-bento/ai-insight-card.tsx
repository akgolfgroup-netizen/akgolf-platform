// Server Component — AI-anbefalingskort, ingen interaktivitet.
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
      className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-2xl p-5 bg-ai-light border border-ai/15"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="absolute top-0 left-0 h-full w-[3px]"
        style={{ background: "linear-gradient(180deg, var(--color-ai), transparent)" }}
      />
      <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] text-[13px] font-extrabold text-white bg-ai">
          AI
        </div>
        <div>
          <h3 className="m-0 text-sm font-bold text-ink">
            AI Coach · Anbefalinger
          </h3>
          <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ai">
            {updatedLabel}
          </div>
        </div>
      </div>

      {insight ? (
        <>
          <p className="mt-3.5 text-[15px] font-medium leading-[1.55] text-ink">
            {insight.summary}
          </p>
          {insight.recommendations && insight.recommendations.length > 0 ? (
            <ul className="mt-3 space-y-1.5 text-[13px] text-ink-muted">
              {insight.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-ai" />
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
                  className="rounded-md border border-line bg-card px-2 py-0.5 text-[10px] font-medium text-ink-muted font-mono"
                >
                  fokus: {w}
                </span>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-3.5 text-[14px] text-ink-muted">
          AI Coach lager innsikter etter at du har logget noen runder eller
          treningsøkter. Logg din første runde for å starte.
        </p>
      )}
    </div>
  );
}
