"use client";

import { useState } from "react";
import {
  SGRing,
  MonoLabel,
  NightSurface,
  AKPyramide,
  VerticalTimeline,
  BentoCard,
  BentoGrid,
  BentoEyebrow,
  type PyramideLevel,
} from "@/components/portal/patterns";

export function DesignPreviewClient() {
  const [activePyramideLevel, setActivePyramideLevel] =
    useState<PyramideLevel | null>("TEK");

  return (
    <div className="mx-auto w-full max-w-[1240px] px-6 py-10 space-y-16">
      <header className="mb-8">
        <MonoLabel size="xs" uppercase className="text-primary">
          Heritage Design System
        </MonoLabel>
        <h1 className="text-4xl font-headline font-semibold tracking-tight text-on-surface mt-3">
          Pattern Preview
        </h1>
        <p className="text-on-surface-variant mt-2 max-w-2xl">
          Heritage-godkjente patterns brukt i AK Golf-portalen. Kun mønstre
          oppført i <code className="font-mono text-xs">.claude/rules/design-system.md</code>{" "}
          vises her.
        </p>
      </header>

      <PatternSection
        code="P-01"
        title="SG Ring"
        description="4 konsentriske ringer for Strokes Gained. Brukes i statistikk-sider."
      >
        <NightSurface variant="ambient" className="rounded-2xl p-10 flex gap-10 justify-center">
          <SGRing offTee={0.42} approach={0.82} short={-0.31} putt={0.22} size="md" />
          <SGRing offTee={0.2} approach={-0.4} short={1.1} putt={0.3} size="sm" />
        </NightSurface>
      </PatternSection>

      <PatternSection
        code="P-02"
        title="Mono Label"
        description="JetBrains Mono for tidsstempler, IDer, prosenter, tabellheaders."
      >
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-card space-y-4">
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant">
              Runde-id
            </MonoLabel>
            <MonoLabel size="sm">RND-2026-04-23</MonoLabel>
          </div>
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant">
              Club speed
            </MonoLabel>
            <MonoLabel size="md" className="text-on-surface font-semibold">
              142.3 mph
            </MonoLabel>
          </div>
          <div className="flex items-center gap-4">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant">
              Konsistens
            </MonoLabel>
            <MonoLabel size="lg" className="text-primary font-bold">
              94%
            </MonoLabel>
          </div>
        </div>
      </PatternSection>

      <PatternSection
        code="P-03"
        title="Night Surface"
        description="Mørk variant for data-first-skjermer (TrackMan, Mission Control)."
      >
        <NightSurface
          variant="ambient"
          className="rounded-2xl p-10 min-h-[200px] flex items-center justify-center"
        >
          <div className="text-center">
            <MonoLabel size="xs" uppercase className="text-secondary-fixed">
              Night Ops Active
            </MonoLabel>
            <h3 className="font-headline text-2xl font-semibold mt-2">
              Data-first flate
            </h3>
            <p className="text-on-surface-variant/60 mt-2">
              Gradient-bakgrunn for å bryte flat svart.
            </p>
          </div>
        </NightSurface>
      </PatternSection>

      <PatternSection
        code="P-04"
        title="AK-Pyramide"
        description="Horisontal 5-lags bar (FYS/TEK/SLAG/SPILL/TURN). Klikkbar i treningsplanlegger."
      >
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

      <PatternSection
        code="P-05"
        title="Vertical Timeline"
        description="Vertikal dag-tidslinje med tid + dot + tittel."
      >
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card max-w-lg">
          <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-3">
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

      <PatternSection
        code="P-06"
        title="Bento Grid"
        description="Glass-bento-kort i grid. Light- og accent-variant."
      >
        <div className="bg-surface-container rounded-2xl p-8">
          <BentoGrid cols={3} gap="md">
            <BentoCard variant="glass" interactive>
              <BentoEyebrow>SG total · 30d</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[44px] font-bold tracking-tight leading-none tabular-nums text-on-surface">
                  +1.42
                </div>
                <MonoLabel size="xs" className="text-on-surface-variant mt-2">
                  vs peer HCP 3
                </MonoLabel>
              </div>
            </BentoCard>
            <BentoCard variant="accent" interactive>
              <BentoEyebrow dotColor="#191e00">Neste booking · 14:30</BentoEyebrow>
              <h3 className="font-headline text-xl font-semibold mt-3 leading-tight">
                Coach Thomas
              </h3>
              <MonoLabel size="xs" className="mt-2">
                60 min · impact drill
              </MonoLabel>
            </BentoCard>
            <BentoCard variant="glass" interactive>
              <BentoEyebrow>Streak</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[44px] font-bold tracking-tight leading-none tabular-nums text-on-surface">
                  41
                  <span className="text-[18px] ml-1 text-on-surface-variant">
                    dager
                  </span>
                </div>
                <MonoLabel size="xs" className="text-on-surface-variant mt-2">
                  PR · 2026
                </MonoLabel>
              </div>
            </BentoCard>
          </BentoGrid>
        </div>
      </PatternSection>
    </div>
  );
}

function PatternSection({
  code,
  title,
  description,
  children,
}: {
  code: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-20">
      <div className="flex items-baseline gap-4 mb-5">
        <MonoLabel
          size="sm"
          className="bg-secondary-fixed px-2 py-0.5 rounded text-on-secondary-fixed"
        >
          {code}
        </MonoLabel>
        <h2 className="font-headline text-2xl font-semibold tracking-tight text-on-surface">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant ml-auto max-w-md text-right">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
