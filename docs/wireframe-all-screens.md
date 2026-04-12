# Wireframe-plan: Alle skjermer — AK Golf Platform

Generert: 2026-04-12. Basert på analyse av all kildekode i portal og admin.

---

## Nåværende tilstandsvurdering

### Sider med premium design (referansepunkter)
- **Dashboard** `/portal/(dashboard)/page.tsx` — Bento grid, PremiumCard, animerte charts. MAL-STANDARD.
- **Statistikk** — HeroHeading, GlassCard, PremiumStatCard, SubNavTabs. Delvis premium.
- **Sammenligning** — HeroHeading, GlassCard, TierGate. Delvis premium.
- **Kalender** — HeroHeading, GlassCard. Delvis premium.

### Sider som trenger redesign
- **AI Coach** — Hardkodede hex `#8b5cf6`, `#1c1c16`, `#154212`. Ingen portal-tokens. **P1.**
- **TrackMan** — Delvis ok men hardkodede hex i ikon-farger. **P1.**
- **Treningsplan** — TreningsplanClient eksisterer. Ingen premium. **P1.**
- **Bookinger** — BookingerClient eksisterer. Ukjent visuell grad. **P1.**
- **Bag** — Bruker heritage/quick-action. **P2.**
- **Øvelser** — Hardkodede hex, ingen bento grid. **P2.**
- **Profil** — Mange komponenter, mangler bento grid. **P2.**

### Mission Control — tilstand
- **Hub** — AdminCard, AdminLineChart, AdminDonutChart. Delvis ok. **P1.**
- **Tilgjengelighet** — Full implementasjon, AdminCard/Tabs/DataTable. OK. **P2.**
- **Analytics** — DashboardClient. **P1.**
- **Rapporter** — Kun loading.tsx, ingen page.tsx! Mangler implementasjon. **P2.**

---

## Designprinsipper for alle wireframes

```
PORTAL-CANVAS:    bg-portal-bg (#F5F5F7)
PORTAL-KORT:      bg-white rounded-xl shadow-card border-black/6
PORTAL-TEKST:     text-portal-text primær, text-portal-secondary sekundær
PORTAL-LABELS:    10-11px UPPERCASE tracking-[0.08em] text-portal-muted
PORTAL-TALL:      text-3xl..text-5xl font-extrabold tracking-tight tabular-nums
SHADOW:           shadow-card (2-lag) hvile, shadow-card-hover hover
BORDER:           border-black/6 (rgba, aldri solid hex)
HOVER:            translateY(-1px) duration-300 ease-[var(--ease-apple)]
ACCENT:           Maks 2-3 elementer per skjerm med #D1F843
AI-INNHOLD:       bg-ai-light text-ai-text
GRID:             grid-cols-12 gap-6 desktop, gap-4 tablet, stablet mobil
MC-SIDEBAR:       bg-black, aktiv: bg-white/10 text-accent-cta border-l-4
MC-CANVAS:        bg-grey-50 (grønntonet)
```

---

## SPILLERPORTAL — Wireframes

### P1-01: Treningsplan `/portal/treningsplan/`

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (col-span-12)                                                │
│ TRENINGSPLAN                  Uke 15 · 7.–13. april     [+ Ny plan]│
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ UKEKALENDER-STRIP (col-span-12)                                     │
│ bg-white rounded-xl shadow-card p-5                                 │
│                                                                     │
│  Man      Tir      Ons      [Tor]    Fre      Lør      Søn         │
│   7        8        9       ●10       11       12       13          │
│   •                          •                 •                   │
│  FYS      ---      TEK     SLAG      ---      SPILL    ---         │
│  45min             60min   30min              90min                │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐  ┌──────────────────────────────┐
│ DAGENS ØKT (col-span-8)          │  │ UKESTATUS (col-span-4)       │
│ bg-white rounded-xl shadow-card  │  │ bg-white rounded-xl          │
│                                  │  │                              │
│ SLAG · 30 MIN · I DAG            │  │ FREMGANG                     │
│ (10px uppercase muted)           │  │ 3/5 dager · 3 fullført      │
│                                  │  │ [ring-animasjon]             │
│ Pitch 20–40 meter                │  │                              │
│ 20 min · 30 baller               │  │ PYRAMID-FORDELING            │
│ ───────────────────              │  │ FYS  ████ 2                  │
│ Chip rundt green                 │  │ TEK  ██   1                  │
│ 25 min · 3 posisjoner            │  │ SLAG ████ 2                  │
│                                  │  │                              │
│ [Logg økt]  [Se alle øvelser]    │  │                              │
└──────────────────────────────────┘  └──────────────────────────────┘
```

**Nye komponenter:** `week-strip.tsx`, `session-card-today.tsx`, `week-progress-card.tsx`

---

### P1-02: Bookinger `/portal/bookinger/`

```
┌─────────────────────────────────────────────────────────────────────┐
│ MINE BOOKINGER                               [+ Book ny time]       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ NESTE BOOKING — HERO (col-span-12)                                  │
│ bg-white rounded-2xl shadow-card-hover border-l-4 border-primary p-6│
│                                                                     │
│ Tirsdag 15. april, kl. 10:00 – 10:50  [BEKREFTET badge success]    │
│ Anders Kristiansen · Performance Pro                                │
│ [Endre tidspunkt]  [Avbestill]  [Se detaljer →]                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┐  ┌──────────────────────────────┐
│ KOMMENDE (col-span-8)            │  │ AVBESTILLINGSREGLER (col-4)  │
│ Liste med UpcomingBookingCard    │  │ bg-warning-light border-warn │
│                                  │  │ > 24t: Gratis                │
│                                  │  │ 12-24t: 50% gebyr            │
│                                  │  │ < 12t: Fullt gebyr           │
└──────────────────────────────────┘  └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ HISTORIKK (col-span-12) med chip-tabs [7d] [30d] [90d]              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### P1-03: AI Coach `/portal/ai-coach/`

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ FEATURE 1    │  │ FEATURE 2    │  │ FEATURE 3    │
│ bg-ai-light  │  │ bg-ai-light  │  │ bg-ai-light  │
│ border-ai/15 │  │ border-ai/15 │  │ border-ai/15 │
│ Personlige   │  │ Fremgangs-   │  │ Video-       │
│ tips         │  │ analyse      │  │ analyse      │
└──────────────┘  └──────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ CHAT-CONTAINER (col-span-12)                                        │
│ bg-white rounded-2xl shadow-card h-[calc(100vh-340px)]              │
│                                                                     │
│ [Meldingshistorikk — AI: bg-portal-hover, Bruker: bg-primary]       │
│                                                                     │
│ ┌────────────────────────────────────┐  ┌────────────────┐          │
│ │ Spør AI Coach om noe...            │  │ [Send]         │          │
│ │ bg-portal-hover rounded-xl         │  │ bg-primary     │          │
│ └────────────────────────────────────┘  └────────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

**Token-migrering:** `#8b5cf6` → `text-ai`, `#1c1c16` → `text-portal-text`, `#154212` → `bg-primary`

---

### P2-01: Statistikk `/portal/statistikk/`

```
┌─────────── Header + PeriodSelector [7d] [30d] [90d] [1 år] ────────┐

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ SNITT    │  │ RUNDER   │  │ HCP      │  │ SG TOTAL │
│ 76.4     │  │ 12       │  │ 8.2      │  │ +1.4     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌──────────────────────────────────┐  ┌──────────────────────────────┐
│ STROKES GAINED BARER (col-7)     │  │ TRENINGSVOLUM STACKED (col-5)│
│ Tee +1.2 ▲ | App +0.4 ▲         │  │ [12 uker søylediagram]       │
│ Short -1.8 ▼ | Putt -0.6 ▼      │  │ FYS/TEK/SLAG/SPILL           │
└──────────────────────────────────┘  └──────────────────────────────┘

┌─────── SCORE-TREND SVG linje (col-span-12) ─────────────────────────┐
┌─────── RUNDE-HISTORIKK tabell (col-span-12) ────────────────────────┘
```

---

### P2-02: Profil `/portal/profil/`

```
┌─────────────────────────────────────────────────────────────────────┐
│ PROFIL-HERO — Avatar + Navn + Stats (HCP, Runder, Sesjoner, Streak) │
└─────────────────────────────────────────────────────────────────────┘

┌──────────── col-7 ──────────┐  ┌────── col-5 ──────────────────────┐
│ HandicapChart 12 mnd SVG    │  │ Mine mål + fremdriftsbarer        │
├─────────────────────────────┤  ├────────────────────────────────────┤
│ TourComparison radar        │  │ AI-fokus bg-ai-light              │
└─────────────────────────────┘  └────────────────────────────────────┘

┌─────── Prestasjoner grid 4-kol (col-span-12) ──────────────────────┐
┌─────── Innstillinger (col-span-12) ────────────────────────────────┘
```

---

### P2-03: TrackMan `/portal/trackman/`

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ SESJONER │  │ SLAG TOT │  │ BESTE    │  │ SNITT    │
│ 24       │  │ 1 847    │  │ 268m     │  │ 245m     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌──── CARRY-TREND SVG (col-8) ────┐  ┌── SISTE SESJONER (col-4) ───┐
└─────────────────────────────────┘  └──────────────────────────────┘
┌──── KLUBB-STATISTIKK tabell (col-span-12) ─────────────────────────┘
```

**Token-fix:** `#3b82f6` → `text-info`

---

### P2-04: Bag, Tester, Øvelser, Benchmark, Sammenligning, Kalender, Spill

Se komplett analyse i agentens output. Kort oppsummert:
- **Bag:** Ny `club-list.tsx` + `gap-chart.tsx` med AI-gap-tips
- **Tester:** Eksisterende struktur OK, fikse `rounded-[20px]` → `rounded-xl`
- **Øvelser:** Token-fix + pyramid-filtrering med fargeprikkene
- **Benchmark:** RadarChart + BarChart, BentoCard allerede i bruk
- **Sammenligning:** TierGate, PeerBenchmarkCard, AI-panel
- **Kalender:** Ukekalender + Google Calendar sync
- **Spill:** Challenges med progress-barer + siste baner

---

## MISSION CONTROL — Wireframes

### P1-MC-01: Hub `/admin/`

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ ØKTER    │  │ ELEVER   │  │ VENTENDE │  │ MTD INN- │
│ I DAG: 6 │  │ AKTIVE:48│  │ BOOKING:3│  │ 24 800kr │
└──────────┘  └──────────┘  └──────────┘  └──────────┘

┌─── COACHING-DIV (col-4) ────┐  ┌── JUNIOR-DIV (col-4) ──┐  ┌─ GFGK ─┐
│ border-l-4 border-primary   │  │ border-l-4 border-info  │  │ border  │
│ 48 elever, dagens bookinger │  │ 52 elever, grupper      │  │ -l-4 ai│
└─────────────────────────────┘  └─────────────────────────┘  └────────┘

┌──── INNTEKTSTREND (col-8) ──┐
└─────────────────────────────┘
```

### P1-MC-02: Elever `/admin/elever/`
Søkebar + filter + KPI-strip + AdminDataTable med avatar, tier-badge, status

### P1-MC-03: Elev-detalj `/admin/elever/[id]/`
Profil-kort (col-4) + Tab-nav med Oversikt/Treningsdata/Bookinger/Plan/Meldinger (col-8)

### P1-MC-04: Bookinger `/admin/bookinger/`
Chip-filter + AdminDataTable. Ventende: warning-bakgrunn med Godkjenn/Avvis

### P1-MC-05: Denne uken `/admin/denne-uken/`
4 KPI + 7-dagers kalender med booking-chips per tidsluke

### P1-MC-06: Kalender `/admin/kalender/`
Filter-panel (col-3) med instruktør/tjeneste + Månedvisning (col-9) med fargeprikker

### P2: Analytics, Meldinger, Treningsplaner, Tilgjengelighet, Kapasitet, Økter, Økonomi, Rapporter
Se komplett analyse i agentens output.

---

## Kritiske token-avvik — fiks umiddelbart

| Fil | Problem | Løsning |
|-----|---------|---------|
| `ai-coach-client.tsx` | `#8b5cf6`, `#1c1c16`, `#154212`, `#6b7366` | `text-ai`, `text-portal-text`, `bg-primary`, `text-portal-secondary` |
| `trening/ovelser/page.tsx` | `#A3A3A3`, `text-blue-400`, `text-yellow-400` | `text-portal-secondary`, `text-info`, `text-warning` |
| `trackman-client.tsx` | `#3b82f6` | `text-info` |

---

## Implementasjonsrekkefølge

| Fase | Innhold | Prioritet |
|------|---------|-----------|
| 1 | Treningsplan + Bookinger + AI Coach token-fix | P1 Portal |
| 2 | Hub + Elever + MC Bookinger + Denne uken + Kalender | P1 MC |
| 3 | Statistikk + Profil + TrackMan + Benchmark + Bag + Øvelser | P2 Portal |
| 4 | Analytics + Meldinger + Treningsplaner + Kapasitet + Økter | P2 MC |
| 5 | Rapporter (ny page.tsx) + Sammenligning + Spill + Tester | P3 |

---

## Nye komponenter som trengs

### Spillerportal
| Komponent | Fil | Prio |
|-----------|-----|------|
| WeekStrip | `components/portal/treningsplan/week-strip.tsx` | P1 |
| SessionCardToday | `components/portal/treningsplan/session-card-today.tsx` | P1 |
| WeekProgressCard | `components/portal/treningsplan/week-progress-card.tsx` | P1 |
| ClubList | `components/portal/bag/club-list.tsx` | P2 |
| GapChart | `components/portal/bag/gap-chart.tsx` | P2 |
| SGBars | `components/portal/statistikk/sg-bars.tsx` | P2 |
| ScoreTrendChart | `components/portal/statistikk/score-trend-chart.tsx` | P2 |
