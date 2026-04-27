"use client";

import { useState, useEffect } from "react";

import { MentalShell } from "@/components/portal/mental/v2/mental-shell";
import { MentalPageHeader } from "@/components/portal/mental/v2/mental-page-header";
import { IzofHero } from "@/components/portal/mental/v2/izof-hero";
import { RoutineCard } from "@/components/portal/mental/v2/routine-card";
import { DrillCard } from "@/components/portal/mental/v2/drill-card";
import { MoodWeek } from "@/components/portal/mental/v2/mood-week";
import { MentalTabs } from "@/components/portal/mental/v2/mental-tabs";
import { MentalEmptyRounds } from "@/components/portal/mental/v2/mental-empty-rounds";
import {
  TrendsChart,
  type TrendPoint,
} from "@/components/portal/mental/v2/trends-chart";

const NORWEGIAN_DAYS = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

function buildEmptyMoodWeek() {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return {
      day: NORWEGIAN_DAYS[d.getDay()],
      num: d.getDate(),
      score: null as number | null,
      isToday: i === 6,
    };
  });
  return days;
}

export default function MentalPage() {
  const [tab, setTab] = useState<"runder" | "trends">("runder");
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/portal/ai/mental/trends");
        if (cancelled) return;
        if (res.ok) {
          const trends = await res.json();
          const focus = trends.focus ?? [];
          const confidence = trends.confidence ?? [];
          const commitment = trends.commitment ?? [];
          const acceptance = trends.acceptance ?? [];

          const dates = Array.from(
            new Set([
              ...focus.map((d: { date: string }) => d.date.slice(0, 10)),
              ...confidence.map((d: { date: string }) => d.date.slice(0, 10)),
            ]),
          ).sort();

          const data: TrendPoint[] = dates.map((date) => {
            const f = focus.find(
              (d: { date: string; value: number }) =>
                d.date.slice(0, 10) === date,
            );
            const c = confidence.find(
              (d: { date: string; value: number }) =>
                d.date.slice(0, 10) === date,
            );
            const com = commitment.find(
              (d: { date: string; value: number }) =>
                d.date.slice(0, 10) === date,
            );
            const a = acceptance.find(
              (d: { date: string; value: number }) =>
                d.date.slice(0, 10) === date,
            );
            return {
              date: new Date(date).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
              }),
              focus: f?.value ?? 0,
              confidence: c?.value ?? 0,
              commitment: com ? Math.round(com.value * 10) : 0,
              acceptance: a ? Math.round(a.value * 10) : 0,
            };
          });

          setTrendData(data);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const focusAvg =
    trendData.length > 0
      ? trendData.reduce((s, p) => s + p.focus, 0) / trendData.length
      : 0;
  const confidenceAvg =
    trendData.length > 0
      ? trendData.reduce((s, p) => s + p.confidence, 0) / trendData.length
      : 0;

  const moodDays = buildEmptyMoodWeek();

  return (
    <MentalShell>
      <MentalPageHeader />

      <IzofHero
        focusAvg={focusAvg}
        confidenceAvg={confidenceAvg}
        totalRounds={trendData.length}
      />

      <RoutineCard />

      <MentalTabs value={tab} onChange={setTab} />

      {tab === "runder" ? (
        <MentalEmptyRounds />
      ) : (
        <TrendsChart data={trendData} loading={loading} />
      )}

      <div className="grid gap-4.5 mt-6" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <DrillCard />
        <div
          className="rounded-2xl"
          style={{
            background: "#0F2E23",
            border: "1px solid rgba(255,255,255,0.06)",
            padding: "22px 24px",
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 15,
              color: "#fff",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              marginBottom: 12,
            }}
          >
            Privat journal · 28d
          </h4>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
            Journalen er privat. Treneren din ser kun det du eksplisitt deler.
            Når du logger en runde under «Ny runde» kan du legge til tanker som
            havner her.
          </p>
        </div>
      </div>

      <div
        className="flex justify-between items-end mt-7 mb-3.5"
      >
        <h3
          style={{
            margin: 0,
            fontSize: 18,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Mental score · denne uken
        </h3>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
          }}
        >
          Logg dagens state via «Ny runde»
        </div>
      </div>
      <MoodWeek days={moodDays} />
    </MentalShell>
  );
}
