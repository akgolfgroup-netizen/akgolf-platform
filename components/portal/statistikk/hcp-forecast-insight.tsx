"use client";

import { TrendingDown, TrendingUp, Minus, Target } from "lucide-react";
import type { HcpForecastData } from "@/app/portal/(dashboard)/statistikk/actions";

interface HcpForecastInsightProps {
  data: HcpForecastData;
}

function formatDelta(current: number, predicted: number | null): string | null {
  if (predicted == null) return null;
  const delta = predicted - current;
  if (Math.abs(delta) < 0.05) return "uendret";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

export function HcpForecastInsight({ data }: HcpForecastInsightProps) {
  const { currentHcp, predicted30d, predicted90d, trendSlopePerWeek, trainingMinutes30d, trainingSessions30d } = data;

  if (currentHcp == null || predicted30d == null || predicted90d == null) {
    return (
      <div className="space-y-2 rounded-xl bg-grey-50 p-4">
        <p className="text-sm text-grey-500">
          Vi kan ikke lage en HCP-prognose ennå. Logg flere runder eller treningsøkter
          så utvikler AK Golf en personlig prediksjon basert på Kalman-filtrering.
        </p>
      </div>
    );
  }

  const delta30 = formatDelta(currentHcp, predicted30d);
  const delta90 = formatDelta(currentHcp, predicted90d);
  const trainingHours = Math.round((trainingMinutes30d / 60) * 10) / 10;
  const weeklyHours = Math.round(((trainingMinutes30d / 60) / 4.3) * 10) / 10;

  // Bias: predicted lower than current = improving
  const improving = predicted90d < currentHcp - 0.2;
  const stagnating = Math.abs(predicted90d - currentHcp) < 0.2;
  const regressing = predicted90d > currentHcp + 0.2;

  const trendLabel = improving ? "bedring" : regressing ? "negativ trend" : "flat";
  const TrendIcon = improving ? TrendingDown : regressing ? TrendingUp : Minus;
  const trendColor = improving ? "#2A7D5A" : regressing ? "#B84233" : "#7A8C85";

  const lines: string[] = [];

  if (trainingSessions30d > 0) {
    lines.push(
      `Du har logget ${trainingSessions30d} økter (${trainingHours} t, snitt ${weeklyHours} t/uke) siste 30 dager.`
    );
  } else {
    lines.push("Du har ikke logget treningsøkter siste 30 dager.");
  }

  if (improving) {
    const weeklyImprovement = Math.abs(trendSlopePerWeek);
    lines.push(
      `Med dette volumet beregner Kalman-filteret en bedring på ~${weeklyImprovement.toFixed(2)} HCP/uke → prognose ${delta90} på 90 dager.`
    );
  } else if (regressing) {
    lines.push(
      `Prognosen peker mot +${Math.abs(predicted90d - currentHcp).toFixed(1)} HCP på 90 dager. Øk treningsvolumet eller juster fokus for å snu trenden.`
    );
  } else {
    lines.push(
      `Prognosen er flat på 90 dager. For å få bedring anbefaler AK Golf minst 6–8 timers fokusert trening per uke.`
    );
  }

  if (trainingSessions30d === 0 && !regressing) {
    lines.push(
      "Uten logget treningsvolum vektlegger modellen kun runde-data. Logg økter for mer presis prognose."
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">
            Prognose-analyse
          </p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold tabular-nums text-black">
              {currentHcp.toFixed(1)}
            </span>
            <span className="text-xs text-grey-400">nå</span>
            <span className="text-grey-200">→</span>
            <span className="text-xl font-semibold tabular-nums text-primary">
              {predicted90d.toFixed(1)}
            </span>
            <span className="text-xs text-grey-400">90d</span>
          </div>
        </div>
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-grey-200 bg-white px-3 py-1.5"
          style={{ color: trendColor }}
        >
          <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
          <span className="text-[11px] font-bold uppercase tracking-wider">{trendLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-grey-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">
            30 dager
          </p>
          <p className="mt-1 text-base font-bold tabular-nums text-black">
            {predicted30d.toFixed(1)}{" "}
            <span
              className="ml-1 text-xs font-semibold"
              style={{ color: trendColor }}
            >
              {delta30}
            </span>
          </p>
          {data.ci30d && (
            <p className="mt-0.5 text-[10px] text-grey-400 tabular-nums">
              ±{((data.ci30d.upper - data.ci30d.lower) / 2).toFixed(1)}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-grey-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-grey-400">
            90 dager
          </p>
          <p className="mt-1 text-base font-bold tabular-nums text-black">
            {predicted90d.toFixed(1)}{" "}
            <span
              className="ml-1 text-xs font-semibold"
              style={{ color: trendColor }}
            >
              {delta90}
            </span>
          </p>
          {data.ci90d && (
            <p className="mt-0.5 text-[10px] text-grey-400 tabular-nums">
              ±{((data.ci90d.upper - data.ci90d.lower) / 2).toFixed(1)}
            </p>
          )}
        </div>
      </div>

      <ul className="space-y-2 text-[13px] leading-relaxed text-text">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-2">
            <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {stagnating && (
        <p className="rounded-lg border border-warning/20 bg-warning-light px-3 py-2 text-xs text-warning-text">
          Kalman-prognosen beveger seg innenfor modellusikkerheten. Legg inn flere runder og
          økter for å få tydeligere signal.
        </p>
      )}
    </div>
  );
}
