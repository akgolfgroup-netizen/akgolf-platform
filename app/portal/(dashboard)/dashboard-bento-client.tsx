"use client";

import type { DashboardV3Props } from "./dashboard-types";
import { HeroCard } from "@/components/portal/dashboard-bento/hero-card";
import { NextSessionCard } from "@/components/portal/dashboard-bento/next-session-card";
import { KpiCard } from "@/components/portal/dashboard-bento/kpi-card";
import { SgCard } from "@/components/portal/dashboard-bento/sg-card";
import { TrendCard } from "@/components/portal/dashboard-bento/trend-card";
import { AiInsightCard } from "@/components/portal/dashboard-bento/ai-insight-card";
import { StreakCard } from "@/components/portal/dashboard-bento/streak-card";
import { ShortcutsRow } from "@/components/portal/dashboard-bento/shortcuts-row";

const MONTHS = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

function isoWeek(d: Date) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function formatBookingWhen(when: string | Date): string {
  const d = typeof when === "string" ? new Date(when) : when;
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();
  const time = d.toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (sameDay) return `I dag · ${time}`;
  if (isTomorrow) return `I morgen · ${time}`;
  const day = d.toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "2-digit",
    month: "short",
  });
  return `${day} · ${time}`;
}

export function DashboardBentoClient(props: DashboardV3Props) {
  const {
    userName,
    stats,
    handicap,
    handicapHistory,
    nextBooking,
    coachInsight,
    aiInsight,
    socialData,
    sgSummary,
    trainingIndex,
  } = props;

  const now = new Date();
  const weekLabel = `Uke ${isoWeek(now)}`;
  const monthLabel = MONTHS[now.getMonth()] ?? "denne måneden";
  const firstName = userName?.split(" ")[0] ?? "der";

  const sgDelta = sgSummary.total;
  const heroHeadline =
    sgDelta !== null && Math.abs(sgDelta) >= 0.5
      ? sgDelta > 0
        ? `Du er`
        : `Du ligger`
      : `Velkommen tilbake, ${firstName}.`;
  const heroHighlight =
    sgDelta !== null && Math.abs(sgDelta) >= 0.5
      ? `${Math.abs(sgDelta).toFixed(1)} slag ${sgDelta > 0 ? "bedre" : "bak"} målkurven for ${monthLabel}.`
      : undefined;

  const subline =
    coachInsight?.primaryFocus
      ? `Fokus denne uken: ${coachInsight.primaryFocus}.`
      : trainingIndex
        ? `Planoppfyllelse: ${trainingIndex.planAdherencePct}%. Hold tempoet.`
        : null;

  const handicapValue =
    handicap.current !== null ? handicap.current.toFixed(1) : "—";
  const handicapTrend = handicap.trend;
  const handicapTrendText =
    handicapTrend !== null
      ? `${Math.abs(handicapTrend).toFixed(1)}`
      : undefined;

  const planPct = trainingIndex?.planAdherencePct ?? null;

  const heroStats = [
    {
      label: "Handicap",
      value: handicapValue,
      unit: handicapTrendText
        ? `${handicapTrend! < 0 ? "▼" : "▲"} ${handicapTrendText}`
        : undefined,
    },
    {
      label: "SG Total",
      value: sgDelta !== null ? (sgDelta >= 0 ? `+${sgDelta.toFixed(1)}` : sgDelta.toFixed(1)) : "—",
      unit: `siste ${sgSummary.roundCount || 0}r`,
    },
    {
      label: "Streak",
      value: String(socialData?.streak ?? 0),
      unit: "dager",
    },
    {
      label: "Plan",
      value: planPct !== null ? `${planPct}%` : "—",
      unit: planPct !== null ? "fullført" : undefined,
    },
  ];

  const sessionWhen = nextBooking ? formatBookingWhen(nextBooking.startTime) : null;
  const focusValue = coachInsight?.primaryFocus ?? null;

  return (
    <div className="min-h-screen bg-[var(--ak-bg,#F5F5F7)] p-4 lg:p-7">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-4 lg:gap-5">
        <HeroCard
          weekLabel={weekLabel}
          statusLabel={planPct !== null && planPct >= 80 ? "I rute" : "Hold fokus"}
          headline={heroHeadline}
          highlight={heroHighlight}
          subline={subline}
          stats={heroStats}
        />

        <NextSessionCard
          when={sessionWhen}
          instructorName={nextBooking?.instructorName ?? null}
          serviceName={nextBooking?.serviceName ?? null}
          duration={nextBooking?.duration ?? null}
          focusLabel={focusValue ? "Fokus" : null}
          focusValue={focusValue}
          bookingId={nextBooking?.id}
        />

        <KpiCard
          label="Handicap"
          value={handicapValue}
          changeText={handicapTrendText}
          changeDirection={
            handicapTrend === null
              ? undefined
              : handicapTrend < 0
                ? "down"
                : handicapTrend > 0
                  ? "up"
                  : "flat"
          }
          changeIsGood={handicapTrend !== null ? handicapTrend < 0 : undefined}
          contextLabel="siste 30d"
          sparkline={
            handicapHistory.length > 0
              ? { points: handicapHistory, type: "line" }
              : undefined
          }
        />

        <KpiCard
          label="Runder · 30d"
          value={String(stats.roundsCount)}
          contextLabel="totalt registrert"
        />

        <KpiCard
          label="Treningsøkter"
          value={String(stats.sessionsCount)}
          contextLabel="totalt"
        />

        <KpiCard
          label="SG Approach"
          value={
            sgSummary.approach !== null
              ? sgSummary.approach >= 0
                ? `+${sgSummary.approach.toFixed(2)}`
                : sgSummary.approach.toFixed(2)
              : "—"
          }
          contextLabel={`${sgSummary.roundCount || 0} runder`}
          accent
        />

        <SgCard summary={sgSummary} />

        <TrendCard
          current={handicap.current}
          trend={handicap.trend}
          history={handicapHistory}
        />

        <AiInsightCard insight={aiInsight} />

        <StreakCard
          currentDays={socialData?.streak ?? 0}
          personalBest={null}
        />

        <ShortcutsRow />
      </div>
    </div>
  );
}
