import type {
  MentalGroup,
  ForecastGroup,
} from "@/app/admin/(authed)/elever/[id]/v2/get-student-360";
import { CardShell, MonoLabel } from "./shell";

interface MentalForecastCardProps {
  mental: MentalGroup;
  forecast: ForecastGroup;
}

export function MentalForecastCard({ mental, forecast }: MentalForecastCardProps) {
  const mentalRows = [
    { label: "Trykktoleranse", value: mental.trykktoleranse },
    { label: "Selvtillit", value: mental.selvtillit },
    { label: "Aksept (fra mentale notater)", value: mental.aksept },
    { label: "Fokus / pre-shot rutine", value: mental.fokus },
  ];

  return (
    <CardShell label="Prognose og mentalt" title="Prognose 12 måneder" dark>
      {/* Forecast 3-row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <ForecastBlock
          label="Neste runde"
          value={forecast.nextRoundEstimate?.toFixed(1) ?? "—"}
          ci={
            forecast.nextRoundCi95
              ? `Anslag: ${forecast.nextRoundCi95.low} — ${forecast.nextRoundCi95.high}`
              : null
          }
        />
        <ForecastBlock
          label="HCP 6 mnd"
          value={forecast.hcp6mEstimate?.toFixed(1) ?? "—"}
          ci={
            forecast.hcp6mCi95
              ? `Anslag: ${forecast.hcp6mCi95.low} — ${forecast.hcp6mCi95.high}`
              : null
          }
        />
        <ForecastBlock
          label="Utviklingspotensial"
          value={forecast.utviklingspotensial?.toString() ?? "—"}
          ci={
            forecast.norwegianPercentile !== null
              ? `/100 · topp ${100 - forecast.norwegianPercentile}% i Norge`
              : "/100"
          }
        />
      </div>

      <MonoLabel color="muted">Mental profil</MonoLabel>
      <ul className="space-y-2 text-[13px] mt-2">
        {mentalRows.map((row) => (
          <li key={row.label} className="flex items-center justify-between">
            <span style={{ color: "rgba(255,255,255,0.85)" }}>{row.label}</span>
            <div className="flex items-center gap-2">
              <div
                className="w-32 h-1.5 rounded-full overflow-hidden"
                style={{ background: "var(--color-sidebar-divider)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${row.value ?? 0}%`,
                    background:
                      (row.value ?? 0) >= 70
                        ? "var(--color-accent)"
                        : (row.value ?? 0) >= 50
                        ? "var(--color-accent)"
                        : "var(--color-warning)",
                  }}
                />
              </div>
              <span
                className="w-8 text-right font-mono text-[11px]"
                style={{ color: "var(--color-accent)" }}
              >
                {row.value ?? "—"}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </CardShell>
  );
}

function ForecastBlock({
  label,
  value,
  ci,
}: {
  label: string;
  value: string;
  ci: string | null;
}) {
  return (
    <div
      className="p-3 rounded-lg"
      style={{
        background: "var(--color-sidebar-hover)",
        border: "1px solid var(--color-sidebar-divider)",
      }}
    >
      <div
        className="text-[10px] font-mono uppercase"
        style={{ letterSpacing: "0.12em", color: "var(--color-sidebar-muted)" }}
      >
        {label}
      </div>
      <div
        className="font-semibold text-[18px] mt-1"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--color-accent)",
        }}
      >
        {value}
      </div>
      {ci && (
        <div
          className="text-[10px] font-mono mt-0.5"
          style={{ color: "var(--color-sidebar-muted)" }}
        >
          {ci}
        </div>
      )}
    </div>
  );
}
