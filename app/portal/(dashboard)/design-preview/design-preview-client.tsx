"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import {
  SGRing,
  MonoLabel,
  NightSurface,
  AKPyramide,
  AIAttribution,
  VerticalTimeline,
  CourseHero,
  GlassPanel,
  GlassPanelRow,
  GlassButton,
  HeroLabel,
  HeroLabelSeparator,
  FloatingCrumbs,
  FloatingSegmented,
  BentoCard,
  BentoGrid,
  BentoEyebrow,
  type PyramideLevel,
} from "@/components/portal/patterns";


export function DesignPreviewClient() {
  const [activePyramideLevel, setActivePyramideLevel] =
    useState<PyramideLevel | null>("TEK");
  const [activeSegment, setActiveSegment] = useState<"today" | "week" | "all">(
    "today"
  );

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-10 space-y-16">
      <header className="mb-8">
        <MonoLabel size="xs" uppercase className="text-primary">
          ◆ Design System v3.1
        </MonoLabel>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface mt-3">
          Pattern Preview
        </h1>
        <p className="text-on-surface-variant/80 mt-2 max-w-2xl">
          Seks nye v3.1-patterns implementert fra design canvas (
          <code className="font-mono text-xs">PlayersHQ.html</code>). Brukes som
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

      {/* P-03 Night Surface */}
      <PatternSection id="p-03" code="P-03" title="Night Surface" description="Kontekstuell dark mode for data-first-skjermer (TrackMan, Mission Control, V2).">
        <NightSurface variant="ambient" className="rounded-2xl p-10 min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <MonoLabel size="xs" uppercase className="text-secondary-fixed">
              ◆ Night Ops Active
            </MonoLabel>
            <h3 className="text-2xl font-semibold mt-2">Data-first flate</h3>
            <p className="text-on-surface-variant/60 mt-2">
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
          <p className="text-[15px] text-on-surface leading-relaxed mb-4">
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

      {/* P-07 Course Hero */}
      <PatternSection
        id="p-07"
        code="P-07"
        title="Course Hero"
        description="Foto-bakgrunn + dark canvas + gradient overlay for hero-skjermer."
      >
        <CourseHero
          bgImage="/images/course-hero/hero-golf-divot.jpg"
          bgAlt="Golf divot close-up"
          overlay="dashboard"
          className="h-[500px]"
        >
          <div className="absolute top-6 left-6 right-6 z-20 flex items-start justify-between">
            <HeroLabel>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
              <strong className="text-surface font-semibold">Miklagard GK</strong>
              <HeroLabelSeparator />
              <span>23. april · uke 17</span>
            </HeroLabel>
            <FloatingSegmented
              items={[
                { id: "today", label: "I dag" },
                { id: "week", label: "Uke" },
                { id: "all", label: "Alle" },
              ]}
              activeId={activeSegment}
              onChange={setActiveSegment}
            />
          </div>
          <div className="absolute bottom-8 left-8 right-8">
            <BentoEyebrow>
              Neste booking · 14:30
            </BentoEyebrow>
            <h2 className="text-[48px] font-bold tracking-tight mt-3 leading-none">
              Coach Thomas
              <br />
              <span className="text-secondary-fixed">· impact drill</span>
            </h2>
          </div>
        </CourseHero>
      </PatternSection>

      {/* P-08 Glass Panel */}
      <PatternSection
        id="p-08"
        code="P-08"
        title="Glass Panel"
        description="Glassmorph-panel med dark/light varianter for floating overlay-innhold."
      >
        <div className="grid grid-cols-2 gap-6">
          <NightSurface variant="ambient" className="rounded-2xl p-8">
            <GlassPanel variant="dark" padding="none">
              <div className="p-5 border-b border-white/10">
                <BentoEyebrow>Shot tracking</BentoEyebrow>
                <h3 className="text-2xl font-bold mt-2 leading-tight">
                  Hull 8 · Par 4
                </h3>
              </div>
              <GlassPanelRow label="Fairway" value="Hit" unit="←" />
              <GlassPanelRow label="GIR" value="Yes" />
              <GlassPanelRow label="Distance to pin" value="12" unit="m" />
              <GlassPanelRow label="SG this hole" value="+0.42" last />
            </GlassPanel>
          </NightSurface>
          <div className="bg-surface-container rounded-2xl p-8 flex items-center justify-center">
            <GlassPanel variant="light" padding="none" className="w-full">
              <div className="p-5 border-b border-[rgba(10,31,24,0.06)]">
                <MonoLabel size="xs" uppercase className="text-on-surface-variant">
                  Light-variant
                </MonoLabel>
                <h3 className="text-2xl font-bold mt-2 leading-tight">
                  Samme struktur, lys flate
                </h3>
              </div>
              <GlassPanelRow variant="light" label="Klubbspeed" value="142" unit="mph" />
              <GlassPanelRow variant="light" label="Carry" value="245" unit="m" />
              <GlassPanelRow variant="light" label="Smash factor" value="1.48" last />
            </GlassPanel>
          </div>
        </div>
      </PatternSection>

      {/* P-09 Glass Button */}
      <PatternSection
        id="p-09"
        code="P-09"
        title="Glass Button"
        description="Pill-knapper med glass / lime / amber / dark varianter."
      >
        <NightSurface variant="ambient" className="rounded-2xl p-10">
          <div className="flex flex-wrap items-center gap-3">
            <GlassButton variant="glass" icon={<Icon name="play_arrow" className="w-3.5 h-3.5" />}>
              Start runde
            </GlassButton>
            <GlassButton variant="lime" icon={<Icon name="bolt" className="w-3.5 h-3.5" />}>
              Live tracking
            </GlassButton>
            <GlassButton variant="amber">Tee-time</GlassButton>
            <GlassButton variant="dark">Pause</GlassButton>
            <GlassButton variant="glass" size="icon" icon={<Icon name="my_location" className="w-4 h-4" />} />
            <GlassButton variant="lime" size="sm">
              Kompakt
            </GlassButton>
          </div>
        </NightSurface>
      </PatternSection>

      {/* P-11 Hero Label */}
      <PatternSection
        id="p-11"
        code="P-11"
        title="Hero Label"
        description="Flytende glass-pill med kontekst: kurs-navn, dato, meta."
      >
        <NightSurface variant="ambient" className="rounded-2xl p-10 flex flex-wrap gap-3">
          <HeroLabel>
            <Icon name="location_on" className="w-3 h-3" />
            <strong className="text-surface font-semibold">Miklagard GK</strong>
            <HeroLabelSeparator />
            <span className="text-surface/55">Hull 8 · 342m</span>
          </HeroLabel>
          <HeroLabel>
            <Icon name="calendar_today" className="w-3 h-3" />
            <strong className="text-surface font-semibold">23. april 2026</strong>
            <HeroLabelSeparator />
            <span className="text-surface/55">Uke 17</span>
          </HeroLabel>
          <HeroLabel variant="lime">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A1F18]" />
            <strong>Live</strong>
          </HeroLabel>
        </NightSurface>
      </PatternSection>

      {/* P-12 Floating Crumbs */}
      <PatternSection
        id="p-12"
        code="P-12"
        title="Floating Crumbs"
        description="Glass-brødsmule for navigasjon i Course Hero-topbar."
      >
        <NightSurface variant="ambient" className="rounded-2xl p-10">
          <FloatingCrumbs
            items={[
              { label: "Portal" },
              { label: "Runde" },
              { label: "Hull 8", active: true, meta: "Par 4" },
            ]}
          />
        </NightSurface>
      </PatternSection>

      {/* P-13 Bento Grid */}
      <PatternSection
        id="p-13"
        code="P-13"
        title="Bento Grid"
        description="Glass-bento-kort i grid. Accent-variant bruker lime-bakgrunn."
      >
        <NightSurface variant="ambient" className="rounded-2xl p-8">
          <BentoGrid cols={3} gap="md">
            <BentoCard variant="glass" interactive>
              <BentoEyebrow>SG total · 30d</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[44px] font-bold tracking-tight leading-none tabular-nums">
                  +1.42
                </div>
                <MonoLabel size="xs" className="text-surface/55 mt-2">
                  vs peer HCP 3
                </MonoLabel>
              </div>
            </BentoCard>
            <BentoCard variant="accent" interactive>
              <BentoEyebrow dotColor="#0A1F18">Neste booking · 14:30</BentoEyebrow>
              <h3 className="text-xl font-bold mt-3 leading-tight">
                Coach Thomas
              </h3>
              <MonoLabel size="xs" className="mt-2 text-[#0A1F18]/55">
                60 min · impact drill
              </MonoLabel>
            </BentoCard>
            <BentoCard variant="glass" interactive>
              <BentoEyebrow>Streak</BentoEyebrow>
              <div className="mt-3">
                <div className="text-[44px] font-bold tracking-tight leading-none tabular-nums">
                  41<span className="text-[18px] ml-1 text-secondary-fixed">dager</span>
                </div>
                <MonoLabel size="xs" className="text-surface/55 mt-2">
                  PR · 2026
                </MonoLabel>
              </div>
            </BentoCard>
          </BentoGrid>
        </NightSurface>
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
        <MonoLabel size="sm" className="text-secondary-fixed-text bg-secondary-fixed px-2 py-0.5 rounded">
          {code}
        </MonoLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-on-surface">
          {title}
        </h2>
        <p className="text-sm text-on-surface-variant/80 ml-auto max-w-md text-right">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
