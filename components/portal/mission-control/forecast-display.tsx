"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { Badge } from "@/components/ui";
import { AdminProgressRing } from "@/components/portal/mission-control/ui";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface CategoryHours {
  hours: number;
  ci95Low: number;
  ci95High: number;
}

interface TechTactMentalPhys {
  tek: number;
  tak: number;
  mental: number;
  fys: number;
}

export interface ForecastDisplayData {
  id: string;
  generatedAt: Date | string;
  currentScoreAvg: number;
  currentSgTotal: number;
  currentSgOtt: number | null;
  currentSgApp: number | null;
  currentSgArg: number | null;
  currentSgPutt: number | null;
  currentCategory: string;
  targetScoreAvg: number;
  targetCategory: string;
  deadline: Date | string;
  requiredSgDelta: number;
  deltaAllocationJson: Record<string, number>;
  estimatedTotalHours: number;
  estimatedHoursCi95Low: number;
  estimatedHoursCi95High: number;
  estimatedHoursPerWeek: number;
  hoursPerCategoryJson: Record<string, CategoryHours>;
  techTactMentalPhysJson: Record<string, TechTactMentalPhys>;
  probabilityOfSuccess: number;
  confidenceInterval95: [number, number];
  primaryFocusCategory: string;
  rootCauseJson: Record<string, string>;
  recommendationsJson: string[];
  assumptionsJson: string[];
  modelVersion: string;
  monteCarloRuns: number;
  withinCi95?: boolean | null;
  predictionErrorSg?: number | null;
}

interface ForecastDisplayProps {
  forecast: ForecastDisplayData;
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CATEGORY_LABELS: Record<string, string> = {
  OTT: "Tee",
  APP: "Approach",
  ARG: "Kort spill",
  PUTT: "Putting",
};

const CATEGORY_COLORS: Record<string, string> = {
  OTT: "#005840",
  APP: "#2A7D5A",
  ARG: "#C48A32",
  PUTT: "#007AFF",
};

const TTMP_COLORS: Record<string, string> = {
  tek: "#005840",
  tak: "#2A7D5A",
  mental: "#AF52DE",
  fys: "#007AFF",
};

const TTMP_LABELS: Record<string, string> = {
  tek: "Teknikk",
  tak: "Taktikk",
  mental: "Mental",
  fys: "Fysisk",
};

function round1(n: number): string {
  return n.toFixed(1);
}

function formatDate(d: Date | string): string {
  return format(new Date(d), "d. MMM yyyy", { locale: nb });
}

export function ForecastDisplay({ forecast }: ForecastDisplayProps) {
  const probPct = Math.round(forecast.probabilityOfSuccess * 100);
  const probColor =
    probPct >= 70 ? "text-success-text" : probPct >= 40 ? "text-warning-text" : "text-error-text";
  const probBadge =
    probPct >= 70 ? "success" : probPct >= 40 ? "warning" : "error";

  const cats = Object.keys(forecast.deltaAllocationJson).filter((k) =>
    ["OTT", "APP", "ARG", "PUTT"].includes(k),
  );

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      {/* Header: nåværende → mål */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
            <Icon name="my_location" className="w-5 h-5 text-primary" />
            Forecast
          </h3>
          <span className="text-xs text-on-surface-variant">
            {formatDate(forecast.generatedAt)} · {forecast.modelVersion}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-surface border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant mb-1">Nåværende</p>
            <p className="text-2xl font-bold text-on-surface tabular-nums">
              {round1(forecast.currentScoreAvg)}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              SG {round1(forecast.currentSgTotal)} · Kat {forecast.currentCategory}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant mb-1">Mål</p>
            <p className="text-2xl font-bold text-on-surface tabular-nums">
              {round1(forecast.targetScoreAvg)}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Deadline: {formatDate(forecast.deadline)} · Kat {forecast.targetCategory}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-surface border border-outline-variant/20">
            <p className="text-xs text-on-surface-variant mb-1">Delta SG</p>
            <p className="text-2xl font-bold text-on-surface tabular-nums">
              +{round1(forecast.requiredSgDelta)}
            </p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Primærfokus: {CATEGORY_LABELS[forecast.primaryFocusCategory] ?? forecast.primaryFocusCategory}
            </p>
          </div>
        </div>
      </div>

      {/* Sannsynlighet + timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex items-center gap-5">
          <AdminProgressRing
            value={probPct}
            max={100}
            size={100}
            strokeWidth={8}
            valueSuffix="%"
            label="sannsynlighet"
          />
          <div>
            <p className={`text-3xl font-bold tabular-nums ${probColor}`}>{probPct}%</p>
            <p className="text-sm text-on-surface-variant mt-0.5">sannsynlighet for måloppnåelse</p>
            <Badge variant={probBadge as never} className="mt-2">
              {probPct >= 70 ? "Realistisk" : probPct >= 40 ? "Krevende" : "Vanskelig"}
            </Badge>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="schedule" className="w-4 h-4 text-primary" />
            <p className="text-sm font-semibold text-on-surface">Estimert tidsbruk</p>
          </div>
          <p className="text-3xl font-bold text-on-surface tabular-nums">
            {Math.round(forecast.estimatedTotalHours)}
            <span className="text-lg font-medium text-on-surface-variant ml-1">timer</span>
          </p>
          <p className="text-sm text-on-surface-variant mt-1">
            95% CI: {Math.round(forecast.estimatedHoursCi95Low)}–{Math.round(forecast.estimatedHoursCi95High)} timer
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {round1(forecast.estimatedHoursPerWeek)} t/uke frem til deadline
          </p>
        </div>
      </div>

      {/* Kategori-fordeling med Tek/Tak/Mental/Fys */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="trending_up" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Fordeling per kategori</p>
        </div>

        {cats.map((cat) => {
          const hours = (forecast.hoursPerCategoryJson[cat] as CategoryHours | undefined)?.hours ?? 0;
          const delta = forecast.deltaAllocationJson[cat] ?? 0;
          const ttmp = (forecast.techTactMentalPhysJson[cat] as TechTactMentalPhys | undefined) ?? {
            tek: 0.25,
            tak: 0.25,
            mental: 0.25,
            fys: 0.25,
          };
          const rootCause = forecast.rootCauseJson[cat] ?? "blandet";

          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                  />
                  <span className="text-sm font-medium text-on-surface">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    +{round1(delta)} SG · {Math.round(hours)} t
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant capitalize">{rootCause}</span>
              </div>

              {/* Tek/Tak/Mental/Fys stablet bar */}
              <div className="h-3 w-full rounded-full overflow-hidden flex">
                {(["tek", "tak", "mental", "fys"] as const).map((key) => (
                  <div
                    key={key}
                    className="h-full"
                    style={{
                      width: `${(ttmp[key] ?? 0) * 100}%`,
                      backgroundColor: TTMP_COLORS[key],
                    }}
                    title={`${TTMP_LABELS[key]}: ${Math.round((ttmp[key] ?? 0) * 100)}%`}
                  />
                ))}
              </div>
              <div className="flex gap-3 text-[10px] text-on-surface-variant">
                {(["tek", "tak", "mental", "fys"] as const).map((key) => (
                  <span key={key} className="flex items-center gap-1">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: TTMP_COLORS[key] }}
                    />
                    {TTMP_LABELS[key]} {Math.round((ttmp[key] ?? 0) * 100)}%
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Anbefalinger */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="gps_fixed" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Anbefalinger</p>
        </div>
        <ul className="space-y-2">
          {forecast.recommendationsJson.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text">
              <Icon name="check"Circle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Antakelser */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="psychology" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Antakelser</p>
        </div>
        <ul className="space-y-2">
          {forecast.assumptionsJson.map((ass, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text">
              {ass.startsWith("ADVARSEL") ? (
                <Icon name="warning" className="w-4 h-4 text-warning mt-0.5 shrink-0" />
              ) : (
                <Icon name="fitness_center" className="w-4 h-4 text-on-surface-variant/60 mt-0.5 shrink-0" />
              )}
              {ass}
            </li>
          ))}
        </ul>
      </div>

      {/* Monte-Carlo CI */}
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Usikkerhet</p>
        </div>
        <p className="text-sm text-text">
          95% konfidensintervall for oppnådd SG-delta: [{" "}
          <span className="font-mono tabular-nums">{round1(forecast.confidenceInterval95[0])}</span>
          {" "}–{" "}
          <span className="font-mono tabular-nums">{round1(forecast.confidenceInterval95[1])}</span>
          {" "}]. Basert på {forecast.monteCarloRuns.toLocaleString("no-NO")} simuleringer.
        </p>
      </div>
    </motion.div>
  );
}
