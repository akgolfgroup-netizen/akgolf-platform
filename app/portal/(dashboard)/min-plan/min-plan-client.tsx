"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { Map, Compass } from "lucide-react";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { AdminProgressRing } from "@/components/portal/coach-hq/ui";

import { MonoLabel } from "@/components/portal/patterns";
import { generateWeekFromForecast } from "@/lib/ai/forecast-plan-allocator";
import type { ForecastPlanSession } from "@/lib/ai/forecast-plan-allocator";
import { GenerateWeekModal } from "./components/generate-week-modal";
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

interface ForecastData {
  id: string;
  generatedAt: string;
  currentScoreAvg: number;
  currentSgTotal: number;
  currentSgOtt: number | null;
  currentSgApp: number | null;
  currentSgArg: number | null;
  currentSgPutt: number | null;
  currentCategory: string;
  targetScoreAvg: number;
  targetCategory: string;
  deadline: string;
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

interface MinPlanClientProps {
  forecast: ForecastData | null;
  userName: string | null;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
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

function formatDeadline(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("no-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function MinPlanClient({ forecast, userName }: MinPlanClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [proposedSessions, setProposedSessions] = useState<ForecastPlanSession[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openModal() {
    if (!forecast) return;
    const sessions = generateWeekFromForecast(
      {
        modelVersion: forecast.modelVersion,
        generatedAt: new Date(forecast.generatedAt),
        currentState: {
          scoreAvg: forecast.currentScoreAvg,
          sgTotal: forecast.currentSgTotal,
          sgOtt: forecast.currentSgOtt,
          sgApp: forecast.currentSgApp,
          sgArg: forecast.currentSgArg,
          sgPutt: forecast.currentSgPutt,
          category: forecast.currentCategory,
          sampleSize: 0,
          confidence: "medium",
        },
        target: {
          scoreAvg: forecast.targetScoreAvg,
          category: forecast.targetCategory,
          deadlineWeeks: 0,
          requiredSgDelta: forecast.requiredSgDelta,
        },
        allocations: Object.entries(forecast.deltaAllocationJson).map(([category, deltaSg]) => ({
          category: category as "OTT" | "APP" | "ARG" | "PUTT",
          deltaSg,
          share: deltaSg / (forecast.requiredSgDelta || 1),
          estimatedHours: forecast.hoursPerCategoryJson[category]?.hours ?? 0,
          ci95Low: forecast.hoursPerCategoryJson[category]?.ci95Low ?? 0,
          ci95High: forecast.hoursPerCategoryJson[category]?.ci95High ?? 0,
          rootCause: (forecast.rootCauseJson[category] ?? "blandet") as "teknisk" | "fysisk" | "mental" | "taktisk" | "blandet",
          techTactMentalPhys: forecast.techTactMentalPhysJson[category] ?? { tek: 0.25, tak: 0.25, mental: 0.25, fys: 0.25 },
        })),
        primaryFocusCategory: forecast.primaryFocusCategory as "OTT" | "APP" | "ARG" | "PUTT",
        estimatedTotalHours: forecast.estimatedTotalHours,
        estimatedHoursCi95Low: forecast.estimatedHoursCi95Low,
        estimatedHoursCi95High: forecast.estimatedHoursCi95High,
        requiredHoursPerWeek: forecast.estimatedHoursPerWeek,
        probabilityOfSuccess: forecast.probabilityOfSuccess,
        confidenceInterval95: forecast.confidenceInterval95,
        monteCarloRuns: forecast.monteCarloRuns,
        rootCauseSummary: forecast.rootCauseJson,
        assumptions: forecast.assumptionsJson,
        recommendations: forecast.recommendationsJson,
      }
    );
    setProposedSessions(sessions);
    setModalOpen(true);
    setSuccessMessage(null);
  }

  function handleSuccess(count: number) {
    setSuccessMessage(`${count} økter lagt til din treningsplan`);
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  if (!forecast) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-[1200px] space-y-5 pb-12 pt-2"
      >
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold text-on-surface">Min plan</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Hei{userName ? `, ${userName}` : ""} — din coach har ikke laget en forecast ennå.
          </p>
        </motion.div>
        <motion.div
          variants={item}
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-10 text-center"
        >
          <Compass className="w-10 h-10 text-on-surface-variant/60 mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
            Når din coach genererer en forecast, vil du se dine mål, estimert tidsbruk og
            sannsynlighet for å nå dem her.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const probPct = Math.round(forecast.probabilityOfSuccess * 100);
  const probColor =
    probPct >= 70 ? "text-success-text" : probPct >= 40 ? "text-warning-text" : "text-error-text";
  const probBadge =
    probPct >= 70 ? "success" : probPct >= 40 ? "warning" : "error";
  const probLabel =
    probPct >= 70 ? "Realistisk" : probPct >= 40 ? "Krevende, men mulig" : "Vanskelig — snakk med coach";

  const cats = Object.keys(forecast.deltaAllocationJson).filter((k) =>
    ["OTT", "APP", "ARG", "PUTT"].includes(k),
  );

  return (
    <>
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-[1200px] space-y-5 pb-12 pt-2"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-on-surface">Min plan</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Din coaching-forecast — oppdatert {new Date(forecast.generatedAt).toLocaleDateString("no-NO")}
        </p>
      </motion.div>

      {successMessage && (
        <motion.div
          variants={item}
          className="bg-success-container border border-success/30 rounded-xl p-4 flex items-center gap-3"
        >
          <Icon name="check_circle" className="w-5 h-5 text-success" />
          <p className="text-sm font-medium text-success-text">{successMessage}</p>
        </motion.div>
      )}

      {/* Hvor er du nå → Hvor vil du */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-primary" />
            <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Hvor er du nå?</MonoLabel>
          </div>
          <p className="text-3xl font-bold text-on-surface tabular-nums">
            {round1(forecast.currentScoreAvg)}
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            SG {round1(forecast.currentSgTotal)} · Kategori {forecast.currentCategory}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="my_location" className="w-4 h-4 text-primary" />
            <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Hvor vil du?</MonoLabel>
          </div>
          <p className="text-3xl font-bold text-on-surface tabular-nums">
            {round1(forecast.targetScoreAvg)}
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Innen {formatDeadline(forecast.deadline)} · Kat {forecast.targetCategory}
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="trending_up" className="w-4 h-4 text-primary" />
            <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">Hva kreves?</MonoLabel>
          </div>
          <p className="text-3xl font-bold text-on-surface tabular-nums">
            +{round1(forecast.requiredSgDelta)}
          </p>
          <p className="text-sm text-on-surface-variant mt-0.5">
            SG-forbedring · {round1(forecast.estimatedHoursPerWeek)} t/uke
          </p>
        </div>
      </motion.div>

      {/* Generer ukeplan-knapp */}
      <motion.div variants={item}>
        <Button
          onClick={openModal}
          className="w-full sm:w-auto"
          size="lg"
        >
          <Icon name="auto_fix_high" className="w-4 h-4 mr-2" />
          Generer ukeplan fra forecast
        </Button>
      </motion.div>

      {/* Sannsynlighet — ærlig og tydelig */}
      <motion.div
        variants={item}
        className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6"
      >
        <AdminProgressRing
          value={probPct}
          max={100}
          size={120}
          strokeWidth={8}
          valueSuffix="%"
          label="sannsynlighet"
        />
        <div className="text-center sm:text-left">
          <p className={`text-4xl font-bold tabular-nums ${probColor}`}>{probPct}%</p>
          <p className="text-sm text-on-surface-variant mt-1">
            sannsynlighet for å nå målet
          </p>
          <Badge variant={probBadge as never} className="mt-2">
            {probLabel}
          </Badge>
          {probPct < 50 && (
            <p className="text-xs text-error-text mt-2 max-w-sm">
              Sannsynligheten er under 50 %. Det betyr ikke at målet er umulig, men at det krever
              mer tid eller en justert plan. Snakk med din coach.
            </p>
          )}
        </div>
      </motion.div>

      {/* Timer + CI */}
      <motion.div variants={item} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="schedule" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Estimert tidsbruk</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4">
          <p className="text-3xl font-bold text-on-surface tabular-nums">
            {Math.round(forecast.estimatedTotalHours)}
            <span className="text-lg font-medium text-on-surface-variant ml-1">timer totalt</span>
          </p>
          <p className="text-sm text-on-surface-variant pb-1">
            95% CI: {Math.round(forecast.estimatedHoursCi95Low)}–{Math.round(forecast.estimatedHoursCi95High)} timer
          </p>
        </div>
      </motion.div>

      {/* Kategori-fordeling */}
      <motion.div variants={item} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Icon name="trending_up" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Fordeling per kategori</p>
        </div>

        {cats.map((cat) => {
          const hours = forecast.hoursPerCategoryJson[cat]?.hours ?? 0;
          const delta = forecast.deltaAllocationJson[cat] ?? 0;
          const ttmp = forecast.techTactMentalPhysJson[cat] ?? {
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
            </div>
          );
        })}
      </motion.div>

      {/* Anbefalinger */}
      <motion.div variants={item} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="psychology" className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-on-surface">Coach sine anbefalinger</p>
        </div>
        <ul className="space-y-2">
          {forecast.recommendationsJson.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text">
              <Icon name="fitness_center" className="w-4 h-4 text-on-surface-variant/60 mt-0.5 shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Usikkerhet */}
      <motion.div variants={item} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
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
      </motion.div>

      {/* Antakelser — alltid synlig */}
      <motion.div variants={item} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="warning" className="w-4 h-4 text-warning" />
          <p className="text-sm font-semibold text-on-surface">Viktige antakelser</p>
        </div>
        <ul className="space-y-2">
          {forecast.assumptionsJson.map((ass, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text">
              <span className="text-on-surface-variant/60 mt-0.5 shrink-0">·</span>
              {ass}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>

    <GenerateWeekModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      sessions={proposedSessions}
      onSuccess={handleSuccess}
    />
    </>
  );
}
