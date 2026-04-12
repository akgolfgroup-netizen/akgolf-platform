# Wireframe & Design Masterplan — AK Golf Platform

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Designe og implementere alle gjenstående portal- og admin-sider med premium visuell kvalitet, basert på inspirasjonskildene og det etablerte designsystemet.

**Architecture:** Bento grid-layout med Apple-inspirert light mode for portalen, mørk sidebar for Mission Control. Alle sider følger 4-fase syklusen (Planlegg → Tren → Spill → Analyser). Hver side bygges som server component + actions.ts + client component.

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, Framer Motion 12, Prisma, shadcn/ui, Lucide icons, Recharts for grafer.

---

## Inspirasjonskilde-analyse

### Hva vi tar fra hver kilde

| Kilde | Hva vi adopterer | Hva vi IKKE adopterer |
|-------|-------------------|-----------------------|
| **SyncActive (Behance)** | Bento grid-layout, varierende kortstørrelser, stor typografi på KPI-tall, aktivitets-stolpediagram, streak-badges, ring-charts for progresjon | Dark mode, orange aksent, lifestyle-bilder i dashboard |
| **SyncActive Light Mode** | Grønntonet bakgrunn, soft shadows, glass-nav, myk fargepalett, grønn aksent på aktivitetsbarer | Stor personfoto i dashboard, device mockups |
| **Stitch v1-v3 (egne prototyper)** | Sidebar-navigasjon, spillerprofil-kort med bilde, TrackMan-waveform, handicap-sparkline, AI-innsikt med SG-pills, neste coaching-kort | Mørk sidebar med grønn bakgrunn (erstattet av sort) |
| **Ron/Dribbble** | Glass-effekt overlays, frosted panels over bilder, clean data-presentasjon | 3D-elementer, isometrisk perspektiv |
| **SyncActive Mobil** | Statistikk-skjermer med ukesvelger (M-T-W-T-F-S-S), stacked bar charts, scrollbare widgets | Watch-integrasjon, helse-metrikker |
| **Alabaster Precision (DESIGN.md)** | "No-Line Rule" (tonal shifts i stedet for borders), editorial typografi, Bento Card med 24-32px padding, JetBrains Mono for data | Alabaster bakgrunn (#fdf9f0) — portalen bruker Apple-grå |

### Visuell DNA — 5 kjennetegn

1. **Store tall, liten kontekst** — KPI-verdier i 28-44px, labels i 10-11px uppercase
2. **Layered shadows** — Aldri flat, alltid minst 2-lags shadow + inner gradient
3. **Bento asymmetri** — 12-kolonne grid med varierende kort-størrelser (4/6/8/12 col-span)
4. **Sparsom aksent** — 90% nøytral flate, maks 2-3 lime-aksent (#D1F843) per skjerm
5. **Kontekstuell navigasjon** — Hver side viser neste naturlige handling som CTA

---

## Overordnet sidestruktur

### Spillerportalen — 5 hovedseksjoner

```
Sidebar (smal, hvit, ikoner + tekst)
├── Oversikt      → Dashboard (FERDIG)
├── Planlegg      → Treningsplan, Booking, Kalender
├── Tren          → Start økt, Dagbok, Øvelser
├── Spill         → Ny runde, Turneringer, Bag
└── Analyser      → Statistikk, AI Coach, TrackMan, Sammenligning
```

### Mission Control — 3 faser

```
Sidebar (mørk, bg-black)
├── Hub            → Dashboard (delvis bygd)
├── FORBERED       → Kalender, Tilgjengelighet, Kapasitet, Treningsplaner
├── GJENNOMFØR     → Bookinger, Økter, Meldinger, AI-assistent
└── FØLG OPP       → Elever, Analytics, Økonomi, Rapporter
```

---

## Fase 1: Portal — PLANLEGGE (Treningsplan-redesign)

### Task 1: Treningsplan — Ukesvelger-komponent

**Files:**
- Create: `components/portal/training/week-day-selector.tsx`
- Test: Visuell test i nettleser

Denne komponenten er kjernen i treningsplan-siden. Inspirert av SyncActive sin dag-for-dag velger med aktivitetsprikker.

- [ ] **Step 1: Opprett week-day-selector.tsx**

```tsx
"use client";

import { cn } from "@/lib/utils";

interface DayData {
  date: Date;
  hasActivity: boolean;
  isToday: boolean;
}

interface WeekDaySelectorProps {
  days: DayData[];
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

const DAY_NAMES = ["Ma", "Ti", "On", "To", "Fr", "Lø", "Sø"];

export function WeekDaySelector({ days, selectedDate, onSelect }: WeekDaySelectorProps) {
  return (
    <div className="flex gap-2">
      {days.map((day, i) => {
        const isSelected = day.date.toDateString() === selectedDate.toDateString();
        return (
          <button
            key={i}
            onClick={() => onSelect(day.date)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-300",
              "ease-[var(--ease-apple)]",
              isSelected
                ? "bg-portal-text text-white shadow-card"
                : "bg-transparent text-portal-secondary hover:bg-portal-hover"
            )}
          >
            <span className="text-[10px] font-medium uppercase tracking-[0.08em] opacity-60">
              {DAY_NAMES[i]}
            </span>
            <span className="text-base font-semibold tabular-nums">
              {day.date.getDate()}
            </span>
            {day.hasActivity && (
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  isSelected ? "bg-accent-cta" : "bg-success"
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verifiser visuelt at den matcher wireframe-mønsteret**

Kjør `npm run dev`, naviger til treningsplan, sjekk at dag-pills vises med prikker.

- [ ] **Step 3: Commit**

```bash
git add components/portal/training/week-day-selector.tsx
git commit -m "feat: ukesvelger-komponent for treningsplan"
```

---

### Task 2: Treningsplan — Daglig øktvisning

**Files:**
- Create: `components/portal/training/daily-session-card.tsx`
- Create: `components/portal/training/exercise-row.tsx`

- [ ] **Step 1: Opprett exercise-row.tsx**

```tsx
import { cn } from "@/lib/utils";
import { Dumbbell } from "lucide-react";

interface ExerciseRowProps {
  name: string;
  category: string;
  sets: string;
  duration?: number;
  completed?: boolean;
}

export function ExerciseRow({ name, category, sets, duration, completed }: ExerciseRowProps) {
  return (
    <div className="flex items-start gap-4 border-b border-black/4 py-4 last:border-0">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          completed ? "bg-success/10 text-success" : "bg-portal-hover text-portal-secondary"
        )}
      >
        <Dumbbell className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-portal-text">{name}</p>
        <p className="text-xs text-portal-muted">{category} — {sets}</p>
      </div>
      {duration && (
        <span className="text-xs text-portal-muted tabular-nums">{duration} min</span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Opprett daily-session-card.tsx**

```tsx
"use client";

import { ExerciseRow } from "./exercise-row";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2 } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  category: string;
  sets: string;
  duration?: number;
  completed?: boolean;
}

interface DailySessionCardProps {
  dayLabel: string;
  totalMinutes: number;
  focusArea: string;
  exercises: Exercise[];
  onStartSession?: () => void;
  onMarkComplete?: () => void;
}

export function DailySessionCard({
  dayLabel,
  totalMinutes,
  focusArea,
  exercises,
  onStartSession,
  onMarkComplete,
}: DailySessionCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
            {dayLabel}
          </p>
          <p className="text-xs text-portal-secondary">{focusArea}</p>
        </div>
        <span className="rounded-full bg-portal-hover px-3 py-1 text-xs font-medium text-portal-secondary tabular-nums">
          {totalMinutes} min
        </span>
      </div>

      <div className="mb-4">
        {exercises.map((ex) => (
          <ExerciseRow key={ex.id} {...ex} />
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onStartSession}
          className="flex-1 bg-primary text-white hover:bg-primary-alt"
        >
          <Play className="mr-2 h-4 w-4" />
          Start økt
        </Button>
        <Button
          onClick={onMarkComplete}
          variant="outline"
          className="border-portal-border text-portal-secondary hover:bg-portal-hover"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Ferdig
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/portal/training/daily-session-card.tsx components/portal/training/exercise-row.tsx
git commit -m "feat: daglig økt-kort og øvelsesrad for treningsplan"
```

---

### Task 3: Treningsplan — Fokus & coaching-seksjon

**Files:**
- Create: `components/portal/training/week-focus-card.tsx`
- Create: `components/portal/training/coaching-integration-card.tsx`

- [ ] **Step 1: Opprett week-focus-card.tsx**

```tsx
import { Target, TrendingUp, Calendar } from "lucide-react";

interface WeekFocusCardProps {
  primaryFocus: string;
  secondaryFocus: string;
  seasonPhase: string;
  coachNote?: string;
}

export function WeekFocusCard({ primaryFocus, secondaryFocus, seasonPhase, coachNote }: WeekFocusCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        Ukens fokus
      </p>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-portal-text">{primaryFocus}</p>
            <p className="text-[11px] text-portal-muted">Primært fokus</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-portal-hover text-portal-secondary">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-portal-text">{secondaryFocus}</p>
            <p className="text-[11px] text-portal-muted">Sekundært fokus</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-cta/12 text-primary">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-portal-text">{seasonPhase}</p>
            <p className="text-[11px] text-portal-muted">Sesongfase</p>
          </div>
        </div>
      </div>

      {coachNote && (
        <div className="mt-4 rounded-lg bg-portal-hover p-3">
          <p className="text-xs italic text-portal-secondary">"{coachNote}"</p>
          <p className="mt-1 text-[10px] text-portal-muted">— Coach Anders</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Opprett coaching-integration-card.tsx**

```tsx
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CoachingIntegrationCardProps {
  nextSessionDate?: string;
  nextSessionTime?: string;
  instructorName?: string;
}

export function CoachingIntegrationCard({ nextSessionDate, nextSessionTime, instructorName }: CoachingIntegrationCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        Coaching
      </p>

      {nextSessionDate ? (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-portal-secondary" />
            <p className="text-sm font-semibold text-portal-text">
              {nextSessionDate}, kl. {nextSessionTime}
            </p>
          </div>
          {instructorName && (
            <p className="ml-6 text-xs text-portal-muted">med {instructorName}</p>
          )}
        </div>
      ) : (
        <p className="mb-4 text-sm text-portal-secondary">Ingen planlagt økt</p>
      )}

      <div className="flex gap-2">
        <Button asChild size="sm" className="flex-1 bg-primary text-white hover:bg-primary-alt">
          <Link href="/portal/bookinger">
            <Calendar className="mr-2 h-3.5 w-3.5" />
            Book ny økt
          </Link>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/portal/training/week-focus-card.tsx components/portal/training/coaching-integration-card.tsx
git commit -m "feat: ukefokus og coaching-kort for treningsplan"
```

---

### Task 4: Treningsplan — Sideredesign med bento grid

**Files:**
- Modify: `app/portal/(dashboard)/treningsplan/page.tsx`
- Modify: `app/portal/(dashboard)/treningsplan/actions.ts` (hvis eksisterer)

- [ ] **Step 1: Les nåværende treningsplan-side**

Les `app/portal/(dashboard)/treningsplan/page.tsx` og forstå eksisterende data-henting.

- [ ] **Step 2: Redesign page.tsx med bento grid-layout**

Layout-struktur (12-kolonne grid):
```
┌─────────────── col-span-12 ──────────────────┐
│ Header: "Treningsplan" + Uke X av 52         │
├───────────── col-span-8 ─┬── col-span-4 ─────┤
│ WeekDaySelector          │ WeekFocusCard      │
│ DailySessionCard         │ CoachingCard       │
│                          │                    │
└──────────────────────────┴────────────────────┘
```

- [ ] **Step 3: Implementer layout med nye komponenter**

Integrer `WeekDaySelector`, `DailySessionCard`, `WeekFocusCard` og `CoachingIntegrationCard` i et responsivt bento grid med `grid-cols-12 gap-4`.

- [ ] **Step 4: Verifiser visuelt**

Kjør `npm run dev`, naviger til `/portal/treningsplan`. Sjekk:
- Ukesvelger viser 7 dager med aktivitetsprikker
- Daglig økt-kort viser øvelser fra planen
- Fokus-kort viser ukens fokusområde
- Coaching-kort viser neste planlagte økt
- Responsivt: col-span-12 på mobil, col-span-8/4 på desktop

- [ ] **Step 5: Kjør typesjekk**

```bash
cd ~/Developer/akgolf/akgolf-platform && npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add app/portal/\(dashboard\)/treningsplan/
git commit -m "feat: treningsplan redesign med bento grid og nye komponenter"
```

---

## Fase 2: Portal — GJENNOMFØRE (Dagbok/Tren)

### Task 5: Treningsdagbok — Aktiv økt-logging

**Files:**
- Create: `components/portal/training/active-session-logger.tsx`
- Create: `components/portal/training/exercise-log-row.tsx`

- [ ] **Step 1: Opprett exercise-log-row.tsx**

Inputrad for logging av faktisk utført trening vs planlagt. Viser:
- Øvelsesnavn + planlagt (3x10)
- Input for faktisk utført
- Treffrate-slider/input (0-100%)
- Vurdering (1-5 stjerner som dots)

```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ExerciseLogRowProps {
  exerciseName: string;
  plannedSets: string;
  onUpdate: (data: { actualSets: string; hitRate: number; rating: number }) => void;
}

export function ExerciseLogRow({ exerciseName, plannedSets, onUpdate }: ExerciseLogRowProps) {
  const [actualSets, setActualSets] = useState(plannedSets);
  const [hitRate, setHitRate] = useState(0);
  const [rating, setRating] = useState(0);

  return (
    <div className="border-b border-black/4 py-4 last:border-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-portal-text">{exerciseName}</p>
        <span className="text-[10px] text-portal-muted">Planlagt: {plannedSets}</span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div className="flex-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-portal-muted">
            Faktisk
          </label>
          <input
            type="text"
            value={actualSets}
            onChange={(e) => {
              setActualSets(e.target.value);
              onUpdate({ actualSets: e.target.value, hitRate, rating });
            }}
            className="mt-1 w-full rounded-lg border border-portal-border bg-portal-hover px-3 py-1.5 text-sm text-portal-text"
          />
        </div>

        <div className="flex-1">
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-portal-muted">
            Treffrate
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={hitRate}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHitRate(val);
                onUpdate({ actualSets, hitRate: val, rating });
              }}
              className="flex-1"
            />
            <span className="text-xs font-semibold text-portal-text tabular-nums">{hitRate}%</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-portal-muted">
            Vurdering
          </label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  setRating(star);
                  onUpdate({ actualSets, hitRate, rating: star });
                }}
                className={cn(
                  "h-3 w-3 rounded-full transition-colors",
                  star <= rating ? "bg-accent-cta" : "bg-portal-hover"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Opprett active-session-logger.tsx**

Container-komponent som viser øktens øvelser med logging-input, total tid og lagre-knapp.

- [ ] **Step 3: Commit**

```bash
git add components/portal/training/active-session-logger.tsx components/portal/training/exercise-log-row.tsx
git commit -m "feat: aktiv økt-logging med treffrate og vurdering"
```

---

### Task 6: Treningsdagbok — Historikk med kalender/liste-toggle

**Files:**
- Create: `components/portal/training/session-history.tsx`
- Create: `components/portal/training/session-history-item.tsx`

- [ ] **Step 1: Opprett session-history-item.tsx**

Kompakt historikkrad som viser: dato, økttype, varighet, vurdering (dots).

- [ ] **Step 2: Opprett session-history.tsx**

Toggle mellom kalendervisning og listevisning. Kalender viser prikker på dager med aktivitet. Liste viser kronologisk med filtrering.

- [ ] **Step 3: Commit**

```bash
git add components/portal/training/session-history.tsx components/portal/training/session-history-item.tsx
git commit -m "feat: treninghistorikk med kalender og listevisning"
```

---

### Task 7: Dagbok-side — Sammenstilling

**Files:**
- Modify: `app/portal/(dashboard)/dagbok/page.tsx`

- [ ] **Step 1: Les nåværende dagbok-side**

- [ ] **Step 2: Redesign med bento grid**

Layout:
```
┌───────── col-span-8 ───────┬── col-span-4 ──┐
│ Aktiv økt-logger           │ Ukesstatistikk │
│ (eller "Start ny økt" CTA) │ Økter: 4/5     │
│                            │ Timer: 2.5t    │
│                            │ Planfølging    │
├────────────────────────────┴────────────────┤
│ Historikk (col-span-12)                     │
│ [Kalender] [Liste]              Filter ▼    │
└─────────────────────────────────────────────┘
```

- [ ] **Step 3: Implementer og verifiser**

- [ ] **Step 4: Commit**

```bash
git add app/portal/\(dashboard\)/dagbok/
git commit -m "feat: dagbok redesign med aktiv økt-logger og historikk"
```

---

## Fase 3: Portal — SPILLE (Runde-registrering)

### Task 8: Runde — Hull-for-hull scoring

**Files:**
- Create: `components/portal/round/hole-scorer.tsx`
- Create: `components/portal/round/score-counter.tsx`
- Create: `components/portal/round/stat-toggles.tsx`

- [ ] **Step 1: Opprett score-counter.tsx**

Store [-] og [+] knapper rundt score-tall. Tilsvarende for putts. Mobilvennlig med store touch-targets (min 48x48px).

```tsx
"use client";

interface ScoreCounterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function ScoreCounter({ label, value, onChange, min = 1, max = 12 }: ScoreCounterProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-portal-hover text-xl font-semibold text-portal-text transition-colors hover:bg-portal-border"
        >
          -
        </button>
        <span className="min-w-[3rem] text-center text-4xl font-extrabold tabular-nums tracking-tight text-portal-text">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-portal-hover text-xl font-semibold text-portal-text transition-colors hover:bg-portal-border"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Opprett stat-toggles.tsx**

Toggle-knapper for FW (fairway hit), GIR (green in regulation), Up & Down, Sand Save, Penalty. Pill-form med check/unchecked state.

- [ ] **Step 3: Opprett hole-scorer.tsx**

Sammenstiller: hull-info header (Hull X/18, Par, Lengde, HCP), ScoreCounter for score og putts, StatToggles, navigasjon mellom hull, løpende totalstatus.

- [ ] **Step 4: Commit**

```bash
git add components/portal/round/
git commit -m "feat: hull-for-hull scoring med counter og stat-toggles"
```

---

### Task 9: Runde — Oppsummeringskort

**Files:**
- Create: `components/portal/round/round-summary.tsx`
- Create: `components/portal/round/score-ring.tsx`
- Create: `components/portal/round/sg-breakdown.tsx`

- [ ] **Step 1: Opprett score-ring.tsx**

SVG sirkeldiagram som viser total score med fargekodede segmenter (birdie=grønn, par=grå, bogey=gul, double+=rød). Inspirert av SyncActive ring-charts.

- [ ] **Step 2: Opprett sg-breakdown.tsx**

Strokes Gained horisontale barer: Tee, Approach, Short game, Putting. Positive=grønn, negative=rød. Eksakt som wireframe-mønsteret i ui-patterns.md.

- [ ] **Step 3: Opprett round-summary.tsx**

Bento grid sammenstilling:
```
┌── col-span-6 ───┬── col-span-6 ──┐
│ ScoreRing        │ SG Breakdown   │
│ 78 (+6)          │ barer          │
│ distribusjon     │                │
├── col-span-12 ───────────────────┤
│ AI-analyse med "Legg til i plan" │
├── col-span-4 ─┬─ col-span-4 ─┬──┤
│ Del med coach  │ Ny runde     │  │
└────────────────┴──────────────┴──┘
```

- [ ] **Step 4: Commit**

```bash
git add components/portal/round/
git commit -m "feat: rundeoppsummering med score-ring, SG-breakdown og AI-analyse"
```

---

### Task 10: Runde-side — Redesign

**Files:**
- Modify: `app/portal/(dashboard)/runde/page.tsx`

- [ ] **Step 1: Les nåværende runde-side**

- [ ] **Step 2: Redesign med hull-scorer og oppsummering**

To states:
1. **Aktiv runde** — HoleScorer fullskjerm med hull-navigasjon
2. **Oppsummering** — RoundSummary med AI-analyse etter siste hull
3. **Ingen aktiv runde** — "Start ny runde" CTA med bane-velger

- [ ] **Step 3: Verifiser og commit**

```bash
git add app/portal/\(dashboard\)/runde/
git commit -m "feat: runde-side med hull-scoring og oppsummering"
```

---

## Fase 4: Portal — EVALUERE (Statistikk & AI Coach)

### Task 11: Statistikk — Periode-velger og KPI-rad

**Files:**
- Create: `components/portal/stats/period-selector.tsx`
- Create: `components/portal/stats/kpi-row.tsx`

- [ ] **Step 1: Opprett period-selector.tsx**

Chip-tabs: [7d] [30d] [90d] [1 år]. Bruker portal chip-tab mønsteret fra premium-design-patterns.md:

```tsx
"use client";

import { cn } from "@/lib/utils";

const PERIODS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "1 år", value: 365 },
] as const;

interface PeriodSelectorProps {
  selected: number;
  onChange: (days: number) => void;
}

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1.5 rounded-[10px] bg-portal-hover p-[3px]">
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={cn(
            "rounded-[7px] px-4 py-[7px] text-[13px] font-medium transition-all duration-200",
            selected === p.value
              ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,88,64,0.3)]"
              : "text-portal-muted hover:bg-portal-hover hover:text-portal-secondary"
          )}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Opprett kpi-row.tsx**

4-kolonne grid med stat-kort: Handicap (med sparkline), Snitt score, Runder spilt, Beste runde. Følger stat-kort mønsteret fra premium-design-patterns.md (inset glow, store tall, micro-labels).

- [ ] **Step 3: Commit**

```bash
git add components/portal/stats/
git commit -m "feat: periodevelger og KPI-rad for statistikk"
```

---

### Task 12: Statistikk — SG Radar og treningsvolum

**Files:**
- Create: `components/portal/stats/sg-radar-chart.tsx`
- Create: `components/portal/stats/training-volume-chart.tsx`

- [ ] **Step 1: Opprett sg-radar-chart.tsx**

SVG radar-diagram med 4 akser (Tee, Approach, Short, Putting). Viser spillerens verdier vs tour-snitt med to overlappende polygoner. Bruker `--color-primary` for spiller, `--color-portal-border` for tour.

- [ ] **Step 2: Opprett training-volume-chart.tsx**

Stacked bar chart inspirert av SyncActive: ukentlig treningsvolum fordelt på kategorier (Putting, Short game, Long game, Spill). Bruker Recharts med egne fargetokens.

- [ ] **Step 3: Commit**

```bash
git add components/portal/stats/
git commit -m "feat: SG radar-chart og treningsvolum for statistikk"
```

---

### Task 13: Statistikk-side — Redesign med bento grid

**Files:**
- Modify: `app/portal/(dashboard)/statistikk/page.tsx`

- [ ] **Step 1: Redesign med dette layout:**

```
┌────────────── col-span-12 ──────────────────┐
│ Header + PeriodSelector                      │
├─ col-span-3 ─┬─ col-span-3 ─┬─ col-span-3 ─┤
│ HCP 12.4     │ Snitt 82.3   │ Runder 24    │ col-span-3: Beste 74
├─ col-span-6 ─┴─ col-span-6 ─┴──────────────┤
│ SG Radar     │ Treningsvolum (stacked bar) │
├─ col-span-12 ───────────────────────────────┤
│ Dypere analyse — tabs: Driving/Approach/... │
│ Avstandsbasert proximity-tabell             │
└─────────────────────────────────────────────┘
```

- [ ] **Step 2: Verifiser og commit**

```bash
git add app/portal/\(dashboard\)/statistikk/
git commit -m "feat: statistikk redesign med SG radar og treningsvolum"
```

---

### Task 14: AI Coach — Redesign

**Files:**
- Modify: `app/portal/(dashboard)/ai-coach/page.tsx`

- [ ] **Step 1: Les nåværende AI Coach-side**

- [ ] **Step 2: Redesign med to-panel layout**

```
┌─ col-span-5 ────────────┬── col-span-7 ─────┐
│ UKENS INNSIKT           │ CHAT              │
│ Styrker (grønn)         │ Meldingshistorikk │
│ Forbedre (rød)          │                   │
│ Anbefaling (AI-lilla)   │ [Skriv melding]   │
│ [Legg til i plan] CTA   │                   │
├──────────────────────────┴───────────────────┤
│ Hurtigspørsmål-pills (col-span-12)          │
│ [Hva bør jeg trene?] [Analyser siste runde] │
└─────────────────────────────────────────────┘
```

AI-innsikt panelet bruker `bg-ai-light` med lilla glow-linje øverst (AI-kort mønster fra premium-design-patterns.md).

- [ ] **Step 3: Verifiser og commit**

```bash
git add app/portal/\(dashboard\)/ai-coach/
git commit -m "feat: AI Coach redesign med ukeinnsikt og hurtigspørsmål"
```

---

## Fase 5: Mission Control — Hub & Elever

### Task 15: MC Hub — KPI-dashboard

**Files:**
- Modify: `app/portal/(dashboard)/admin/page.tsx`

- [ ] **Step 1: Redesign hub med:**

```
┌─ col-span-8 ───────────────┬── col-span-4 ──┐
│ Dagens bookinger           │ KPI-rutenett   │
│ Tidslinje 08:00-18:00      │ Elever: 42     │
│ Med elevnavn per slot      │ Bookinger: 8   │
│                            │ Inntekt: 45k   │
│                            │ Kapasitet: 72% │
├─ col-span-6 ──┬── col-span-6 ───────────────┤
│ Alerts        │ Ukens oppsummering          │
│ Avbestillinger│ Trending: booking-trend     │
│ Ventende      │ sparkline                   │
└───────────────┴─────────────────────────────┘
```

- [ ] **Step 2: Verifiser og commit**

---

### Task 16: MC Elever — Detaljside

**Files:**
- Modify: `app/portal/(dashboard)/admin/elever/[id]/page.tsx`

- [ ] **Step 1: Redesign elevdetalj med:**

```
┌─ col-span-4 ────┬── col-span-8 ─────────────┐
│ Spillerprofil   │ Tabs: Historikk | Plan |   │
│ Bilde + HCP     │       Statistikk | Mål     │
│ Kategori        │                             │
│ Kontaktinfo     │ [Innhold basert på tab]    │
│ [Send melding]  │                             │
│ [Lag plan]      │                             │
└─────────────────┴─────────────────────────────┘
```

- [ ] **Step 2: Verifiser og commit**

---

## Fase 6: Polering & Konsistens

### Task 17: Sidebar-navigasjon — 5-item redesign

**Files:**
- Modify: `components/portal/layout/sidebar.tsx`

- [ ] **Step 1: Oppdater sidebar til 5-item struktur**

```
Oversikt    (LayoutDashboard)
Planlegg    (ClipboardList)    → Treningsplan, Booking, Kalender
Tren        (Target)          → Dagbok, Øvelser, Tester
Spill       (Flag)            → Runde, Turneringer, Bag
Analyser    (TrendingUp)      → Statistikk, AI Coach, TrackMan
```

Hver hovedkategori ekspanderer til undersider ved klikk. Aktiv tilstand bruker `bg-portal-hover` med `border-l-2 border-primary`.

- [ ] **Step 2: Verifiser og commit**

---

### Task 18: Komponentbibliotek-oppdatering

**Files:**
- Modify: `docs/component-library.md`

- [ ] **Step 1: Legg til alle nye komponenter:**

```
## Portal Training-komponenter
| WeekDaySelector | components/portal/training/week-day-selector.tsx | Dag-velger med aktivitetsprikker |
| DailySessionCard | components/portal/training/daily-session-card.tsx | Daglig økt med øvelsesliste |
| ExerciseRow | components/portal/training/exercise-row.tsx | Enkelt-øvelse i treningsplan |
| WeekFocusCard | components/portal/training/week-focus-card.tsx | Ukens fokusområde |
| CoachingIntegrationCard | components/portal/training/coaching-integration-card.tsx | Neste coaching-booking |
| ActiveSessionLogger | components/portal/training/active-session-logger.tsx | Live økt-logging |
| ExerciseLogRow | components/portal/training/exercise-log-row.tsx | Input-rad for logging |
| SessionHistory | components/portal/training/session-history.tsx | Kalender/liste-historikk |

## Portal Runde-komponenter
| HoleScorer | components/portal/round/hole-scorer.tsx | Hull-for-hull scoring |
| ScoreCounter | components/portal/round/score-counter.tsx | +/- score-knapper |
| StatToggles | components/portal/round/stat-toggles.tsx | FW/GIR/UD toggles |
| RoundSummary | components/portal/round/round-summary.tsx | Rundeoppsummering |
| ScoreRing | components/portal/round/score-ring.tsx | SVG score-distribusjon |
| SGBreakdown | components/portal/round/sg-breakdown.tsx | SG horisontale barer |

## Portal Statistikk-komponenter
| PeriodSelector | components/portal/stats/period-selector.tsx | 7d/30d/90d/1år tabs |
| KPIRow | components/portal/stats/kpi-row.tsx | 4-kolonne nøkkeltall |
| SGRadarChart | components/portal/stats/sg-radar-chart.tsx | SG radar-diagram |
| TrainingVolumeChart | components/portal/stats/training-volume-chart.tsx | Stacked bar ukentlig |
```

- [ ] **Step 2: Commit**

```bash
git add docs/component-library.md
git commit -m "docs: oppdater komponentbibliotek med nye wireframe-komponenter"
```

---

### Task 19: Statusdokumenter-oppdatering

**Files:**
- Modify: `docs/status/PORTAL_AUDIT.md`
- Modify: `docs/status/BACKLOG.md`

- [ ] **Step 1: Oppdater PORTAL_AUDIT.md med redesign-status per side**

- [ ] **Step 2: Oppdater BACKLOG.md med eventuelle gjenstående P2/P3-oppgaver**

- [ ] **Step 3: Commit**

```bash
git add docs/status/
git commit -m "docs: oppdater audit og backlog etter wireframe-implementering"
```

---

## Prioritert rekkefølge

| Fase | Tasks | Estimat | Avhengigheter |
|------|-------|---------|---------------|
| 1. Treningsplan | Task 1-4 | Kort | Ingen |
| 2. Dagbok/Tren | Task 5-7 | Kort | Fase 1 (deler komponenter) |
| 3. Runde/Spill | Task 8-10 | Medium | Ingen |
| 4. Statistikk & AI | Task 11-14 | Medium | Ingen |
| 5. Mission Control | Task 15-16 | Kort | Ingen |
| 6. Polering | Task 17-19 | Kort | Alle faser |

Fase 1-4 kan kjøres i parallell (uavhengige sider). Fase 5 kan kjøres parallelt med Fase 1-4. Fase 6 kjøres til slutt.

---

## Designregler-sjekkliste (bruk per komponent)

- [ ] Shadow er layered (minst 2 verdier)?
- [ ] Border bruker rgba (`border-black/6`), ikke solid hex?
- [ ] Typografi har minst 3 kontrastnivåer (micro-label, tittel, verdital)?
- [ ] Hover er subtil (`-translate-y-px`, aldri mer)?
- [ ] Accent (`#D1F843`) brukes på maks 2-3 elementer per skjerm?
- [ ] Padding følger rhythm (`p-5` for kort, `gap-4` mellom)?
- [ ] Transitions bruker `--ease-apple` (300ms)?
- [ ] Labels er 10-11px uppercase tracking-wide?
- [ ] Tall bruker `tabular-nums` og tight tracking?
- [ ] Portal-farger (`portal-*`), IKKE markedsside-farger?
