"use client";

import { useState } from "react";
import { CalendarPlus, MessageCircle, History, Target } from "lucide-react";
import type { ForecastPlanSession } from "@/lib/ai/forecast-plan-allocator";
import { GenerateWeekModal } from "@/app/portal/(dashboard)/min-plan/components/generate-week-modal";
import { PlanHero } from "./plan-hero";
import { CoachStrip } from "./coach-strip";
import { GoalTier } from "./goal-tier";
import { MilestoneCard } from "./milestone-card";
import { FocusCard } from "./focus-card";
import { SectionHeading } from "./dark-card";
import { MinPlanEmptyState } from "./empty-state";
import { buildWeekFromForecast } from "./build-week-from-forecast";
import {
  CATEGORY_ICON,
  CATEGORY_LABELS,
  CATEGORY_TONE,
  formatDeadline,
  round1,
  type ForecastDataV2,
} from "./forecast-types";

interface MinPlanV2ClientProps {
  forecast: ForecastDataV2 | null;
  userName: string | null;
}

export function MinPlanV2Client({ forecast, userName }: MinPlanV2ClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [proposedSessions, setProposedSessions] = useState<
    ForecastPlanSession[]
  >([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function openModal() {
    if (!forecast) return;
    setProposedSessions(buildWeekFromForecast(forecast));
    setModalOpen(true);
    setSuccessMessage(null);
  }

  function handleSuccess(count: number) {
    setSuccessMessage(`${count} økter lagt til din treningsplan`);
    setTimeout(() => setSuccessMessage(null), 4000);
  }

  if (!forecast) {
    return <MinPlanEmptyState userName={userName} />;
  }

  const probPct = Math.round(forecast.probabilityOfSuccess * 100);
  const cats = Object.keys(forecast.deltaAllocationJson).filter((k) =>
    ["OTT", "APP", "ARG", "PUTT"].includes(k),
  );
  const sortedCats = [
    forecast.primaryFocusCategory,
    ...cats.filter((c) => c !== forecast.primaryFocusCategory),
  ];

  const monthsTotal = 12;
  const monthsElapsed = Math.max(
    1,
    Math.min(
      monthsTotal,
      Math.round(((100 - probPct) / 100) * monthsTotal) || 4,
    ),
  );
  const monthPercent = Math.round((monthsElapsed / monthsTotal) * 100);

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] space-y-5 pb-12">
        <div>
          <div
            className="font-mono text-[11px] font-semibold uppercase"
            style={{ color: "#D1F843", letterSpacing: "0.16em" }}
          >
            Spill · Min plan
          </div>
        </div>

        <PlanHero
          headline="Bli"
          highlight={`single-handicap innen ${formatDeadline(forecast.deadline)}.`}
          lede="Eid sammen med coachen din. Re-evalueres månedlig. Drives av tre fokusområder med målbar Strokes Gained-effekt."
          monthLabel={`Måned ${monthsElapsed} av ${monthsTotal}`}
          monthPercent={monthPercent}
          hcpNow={round1(forecast.currentScoreAvg)}
          hcpTarget={round1(forecast.targetScoreAvg)}
          nextMilestone={`HCP ${round1((forecast.currentScoreAvg + forecast.targetScoreAvg) / 2)}`}
        />

        {successMessage && (
          <div
            className="rounded-xl border px-4 py-3 text-sm font-medium"
            style={{
              background: "rgba(42,125,90,0.18)",
              borderColor: "rgba(42,125,90,0.35)",
              color: "#6FCBA1",
            }}
          >
            {successMessage}
          </div>
        )}

        <CoachStrip
          initials="AK"
          name="Anders Kristiansen"
          planLabel={`Sannsynlighet ${probPct}%`}
        />

        <SectionHeading title="Mål-hierarki" sub="ÅR · KVARTAL · MÅNED" />
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
          <GoalTier
            label="ÅRSMÅL"
            title={`Score ${round1(forecast.targetScoreAvg)} — kategori ${forecast.targetCategory}`}
            metaLeft={{
              label: "SG-mål",
              value: `+${round1(forecast.requiredSgDelta)}`,
            }}
            metaRight={`${cats.length} kategorier`}
            percent={monthPercent}
            rightLabel={`Måned ${monthsElapsed}/${monthsTotal}`}
            highlighted
          />
          <GoalTier
            label="KVARTAL"
            title="Jevnere putt + skarpere innspill"
            metaLeft={{ label: "Mål-runder", value: "5" }}
            metaRight="2 spilt"
            percent={48}
            rightLabel="Uke 2/12"
          />
          <GoalTier
            label="MÅNED"
            title={`${Math.round(forecast.estimatedHoursPerWeek * 4)} timer trening`}
            metaLeft={{ label: "Aktuell", value: `${probPct}%` }}
            metaRight="5 økter loggført"
            percent={62}
            rightLabel="5/8 økter"
          />
        </div>

        <SectionHeading title="Milestones" sub="Q1 · Q2 · Q3 · Q4" />
        <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          <MilestoneCard
            quarter="Q1 · JAN–MAR"
            title="Bygg fundament"
            target="Baseline"
            description="Datagrunnlag · 12 økter loggført"
            state="done"
          />
          <MilestoneCard
            quarter="Q2 · APR–JUN"
            title="Putting + innspill"
            target={`HCP ${round1(forecast.currentScoreAvg - 0.5)}`}
            description="3-fot >88% · spredning ned 25%"
            state="now"
          />
          <MilestoneCard
            quarter="Q3 · JUL–SEP"
            title="Driver + scoring"
            target={`HCP ${round1(forecast.currentScoreAvg - 1.5)}`}
            description="Klubbmesterskap · 5 turneringer"
            state="upcoming"
          />
          <MilestoneCard
            quarter="Q4 · OKT–DES"
            title="Mental + indoor"
            target={`HCP ${round1(forecast.targetScoreAvg)}`}
            description="Indoor-volum · neste års plan"
            state="upcoming"
          />
        </div>

        <SectionHeading title="Fokusområder" sub="DRIVES AV STROKES GAINED" />
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {sortedCats.slice(0, 4).map((cat, idx) => {
            const delta = forecast.deltaAllocationJson[cat] ?? 0;
            const tone = CATEGORY_TONE[cat] ?? "iron";
            const Icon = CATEGORY_ICON[cat] ?? Target;
            const priority =
              idx === 0
                ? "Prioritet 1"
                : idx === 1
                  ? "Prioritet 2"
                  : idx === 2
                    ? "Prioritet 3"
                    : "Vedlikehold";
            const rootCause = forecast.rootCauseJson[cat] ?? "blandet";
            const hours = forecast.hoursPerCategoryJson[cat]?.hours ?? 0;
            const sessionsPerWeek = Math.max(
              1,
              Math.round((hours / forecast.estimatedTotalHours) * 6),
            );
            return (
              <FocusCard
                key={cat}
                tone={tone}
                priority={priority}
                name={CATEGORY_LABELS[cat] ?? cat}
                sgValue={`+${round1(delta)}`}
                description={`Hovedårsak: ${rootCause}. ${Math.round(hours)} timer estimert for å nå målet i denne kategorien.`}
                nextSession="Neste økt · Planlegg uken"
                frequency={`${sessionsPerWeek} økter / uke`}
                Icon={Icon}
              />
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition active:scale-[0.98]"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <CalendarPlus className="h-4 w-4" />
            Planlegg uken
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10"
          >
            <MessageCircle className="h-4 w-4" />
            Spør coachen om planen
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5"
          >
            <History className="h-4 w-4" />
            Tidligere planer
          </button>
        </div>
      </div>

      <GenerateWeekModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessions={proposedSessions}
        onSuccess={handleSuccess}
      />
    </>
  );
}
