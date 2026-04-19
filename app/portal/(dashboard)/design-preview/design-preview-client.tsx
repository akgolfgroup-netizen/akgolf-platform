"use client";

import { useState } from "react";
import {
  SGRing,
  MonoLabel,
  NightSurface,
  AKPyramide,
  AIAttribution,
  VerticalTimeline,
  type PyramideLevel,
} from "@/components/portal/patterns";

export function DesignPreviewClient() {
  const [activePyramideLevel, setActivePyramideLevel] =
    useState<PyramideLevel | null>("TEK");

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 space-y-16">
      <header className="mb-8">
        <MonoLabel size="xs" uppercase className="text-primary">
          ◆ Design System v3.1
        </MonoLabel>
        <h1 className="text-4xl font-bold tracking-tight text-grey-900 mt-3">
          Pattern Preview
        </h1>
        <p className="text-grey-500 mt-2 max-w-2xl">
          Seks nye v3.1-patterns implementert fra design canvas (
          <code className="font-mono text-xs">AK Golf Portal.html</code>). Brukes som
          byggeklosser for dashboard-views og tematiske skjermer.
        </p>
      </header>

      {/* P-01 SG Ring */}
      <PatternSection id="p-01" code="P-01" title="SG Ring" description="4 konsentriske ringer for Strokes Gained. Brukes i V2 Night Ops, V5 Cockpit, Statistikk.">
        <NightSurface variant="ambient" className="rounded-2xl p-10 flex gap-10 justify-center">
          <SGRing offTee={0.42} approach={0.82} short={-0.31} putt={0.22} size="md" />
          <SGRing offTee={0.2} approach={-0.4} short={1.1} putt={0.3} size="sm" />
        </NightSurface>
      </PatternSection>

      {/* P-02 Mono Label */}
      <PatternSection id="p-02" code="P-02" title="Mono Label" description="JetBrains Mono for tidsstempler, IDer, prosenter, tabellheaders.">
        <div className="bg-white rounded-2xl p-8 shadow-card space-y-4">
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-grey-400">
              Runde-id
            </MonoLabel>
            <MonoLabel size="sm">RND-2026-04-23</MonoLabel>
          </div>
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-grey-400">
              Club speed
            </MonoLabel>
            <MonoLabel size="md" className="text-grey-900 font-semibold">
              142.3 mph
            </MonoLabel>
          </div>
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-grey-400">
              Konsistens
            </MonoLabel>
            <MonoLabel size="lg" className="text-primary font-bold">
              94%
            </MonoLabel>
          </div>
        </div>
      </PatternSection>

      {/* P-03 Night Surface */}
      <PatternSection id="p-03" code="P-03" title="Night Surface" description="Kontekstuell dark mode for data-first-skjermer (TrackMan, Mission Control, V2).">
        <NightSurface variant="ambient" className="rounded-2xl p-10 min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <MonoLabel size="xs" uppercase className="text-accent-cta">
              ◆ Night Ops Active
            </MonoLabel>
            <h3 className="text-2xl font-semibold mt-2">Data-first flate</h3>
            <p className="text-grey-300 mt-2">
              Gradient-bakgrunn + radial accents for å bryte flat svart.
            </p>
          </div>
        </NightSurface>
      </PatternSection>

      {/* P-04 AK-Pyramide */}
      <PatternSection id="p-04" code="P-04" title="AK-Pyramide" description="Horisontal 5-lags bar (FYS/TEK/SLAG/SPILL/TURN). Klikkbar filter i treningsplanlegger.">
        <div className="grid grid-cols-2 gap-6">
          <AKPyramide
            title="AK-Pyramiden · Uke 17"
            active={activePyramideLevel}
            onChange={setActivePyramideLevel}
            data={[
              { level: "FYS", percent: 100, value: "3h" },
              { level: "TEK", percent: 88, value: "2.5h" },
              { level: "SLAG", percent: 74, value: "2h" },
              { level: "SPILL", percent: 45, value: "1.5h" },
              { level: "TURN", percent: 80, value: "4h" },
            ]}
          />
          <AKPyramide
            title="Volum siste 30 dager"
            subtitle="Read-only"
            readOnly
            data={[
              { level: "FYS", percent: 65, value: "8h" },
              { level: "TEK", percent: 92, value: "12h" },
              { level: "SLAG", percent: 88, value: "10h" },
              { level: "SPILL", percent: 35, value: "4h" },
              { level: "TURN", percent: 100, value: "14h" },
            ]}
          />
        </div>
      </PatternSection>

      {/* P-05 AI Attribution */}
      <PatternSection id="p-05" code="P-05" title="AI Attribution" description="Context-chips som viser hvilke datakilder AI brukte.">
        <div className="bg-ai-light/50 rounded-2xl p-6 border border-ai/10">
          <p className="text-[15px] text-grey-900 leading-relaxed mb-4">
            Din approach-spill er 0.82 slag bedre enn peer-gjennomsnittet. Fokuser
            på 100–150m for ytterligere forbedring. Anbefaler 3 økter denne uken.
          </p>
          <AIAttribution
            sources={[
              { type: "runde", id: "r1", label: "Runde 23/4" },
              { type: "trackman", id: "tm1", label: "TM-sesjon 21/4" },
              { type: "coach-notat", id: "cn1", label: "Thomas 20/4" },
              { type: "handicap", id: "h1", label: "HCP 3.4" },
            ]}
          />
        </div>
      </PatternSection>

      {/* P-06 Vertical Timeline */}
      <PatternSection id="p-06" code="P-06" title="Vertical Timeline" description="Vertikal dag-tidslinje med tid + dot + tittel.">
        <div className="bg-white rounded-2xl p-6 shadow-card max-w-lg">
          <MonoLabel size="xs" uppercase className="text-grey-400 block mb-3">
            I dag · 23. april
          </MonoLabel>
          <VerticalTimeline
            items={[
              {
                time: "06:30",
                title: "Mobility 20m",
                meta: "FYS · Hjemme",
                dotColor: "sage",
              },
              {
                time: "10:00",
                title: "Coach Thomas · 1:1",
                meta: "TEK · impact · 60m",
                dotColor: "blue",
                active: true,
              },
              {
                time: "13:30",
                title: "Range · dispersion",
                meta: "SLAG · jern 6-8 · 30m",
                dotColor: "amber",
              },
              {
                time: "18:00",
                title: "9 hull scramble",
                meta: "SPILL · 90m",
                dotColor: "coral",
              },
            ]}
          />
        </div>
      </PatternSection>
    </div>
  );
}

function PatternSection({
  id,
  code,
  title,
  description,
  children,
}: {
  id: string;
  code: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline gap-4 mb-5">
        <MonoLabel size="sm" className="text-accent-cta-text bg-accent-cta px-2 py-0.5 rounded">
          {code}
        </MonoLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-grey-900">
          {title}
        </h2>
        <p className="text-sm text-grey-500 ml-auto max-w-md text-right">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
