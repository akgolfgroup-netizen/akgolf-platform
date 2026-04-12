# Brief: Treningsplanlegger & Treningsanalyse — UX Design

Bruk denne briefen i Claude.ai chat for å designe UI/UX før implementering.

---

## Prosjekt

AK Golf Academy — spillerportal for golfcoaching. Norsk bokmål. Apple-inspirert light mode.

## Mål

Design en Notion Calendar-lignende treningsplanlegger med drag & drop, og en treningsanalyse-side.

---

## DEL 1: TRENINGSPLANLEGGER

### Konsept
En visuell ukesplanlegger der spilleren ser sin treningsplan i kalenderformat. Høyre sidemeny med øvelser, standard økter og treningsområder som kan dras inn i kalenderen.

### Layout-ide
```
┌─────────────────────────────────────────────┬──────────────────────┐
│ KALENDER-GRID (hoved)                       │ SIDEMENY (fast)      │
│                                             │                      │
│ ← Uke 15 →   7.–13. april 2026             │ STANDARD ØKTER       │
│                                             │ ┌──────────────────┐ │
│  Man  │  Tir  │  Ons  │  Tor  │  Fre  │ Lør │ │ Putting-drill    │ │
│ ──────┼───────┼───────┼───────┼───────┼─────│ │ 20 min · TEK     │ │
│       │       │       │       │       │     │ ├──────────────────┤ │
│ [Økt] │       │ [Økt] │       │ [Økt] │     │ │ Short game       │ │
│ FYS   │       │ TEK   │       │ SLAG  │     │ │ 30 min · SLAG    │ │
│ 45min │       │ 60min │       │ 30min │     │ ├──────────────────┤ │
│       │       │       │       │       │     │ │ Driving range    │ │
│       │       │       │       │       │     │ │ 45 min · SLAG    │ │
│       │       │       │       │       │     │ └──────────────────┘ │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ FAVORITT ØVELSER     │
│       │       │       │       │       │     │ ┌──────────────────┐ │
│       │       │       │       │       │     │ │ Gate drill       │ │
│       │       │       │       │       │     │ │ Clock drill      │ │
│       │       │       │       │       │     │ │ Ladder drill     │ │
│       │       │       │       │       │     │ └──────────────────┘ │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ TRENINGSPYRAMIDEN    │
│       │       │       │       │       │     │ [TURN ▅]             │
│       │       │       │       │       │     │ [SPILL ████]         │
│       │       │       │       │       │     │ [SLAG ██████]        │
│       │       │       │       │       │     │ [TEK ████████]       │
│       │       │       │       │       │     │ [FYS ██████████]     │
│       │       │       │       │       │     │                      │
│       │       │       │       │       │     │ HURTIGFILTER         │
│       │       │       │       │       │     │ [Putting] [Chip]     │
│       │       │       │       │       │     │ [Driver] [Jern]      │
│       │       │       │       │       │     │ [Fitness] [Mental]   │
└─────────────────────────────────────────────┴──────────────────────┘
```

### Funksjoner som finnes (backend er 100% operativt)

#### Treningsplan-CRUD
| Funksjon | Hva den gjør |
|----------|-------------|
| `createManualPlan()` | Oppretter plan med uker og økter |
| `getActivePlan()` | Henter aktiv plan |
| `getCurrentWeekSessions()` | Henter denne ukens økter |
| `addExerciseToSession()` | Legger til øvelse i en økt |
| `toggleSessionComplete()` | Markerer økt fullført/ikke fullført |
| `saveSessionProgress()` | Lagrer fremdrift per øvelse (reps, score, rating) |

#### Dagbok/Logging
| Funksjon | Hva den gjør |
|----------|-------------|
| `logSession()` | Logger en treningsøkt |
| `logSessionWithExercises()` | Logger økt med øvelsesdetaljer |
| `updateTrainingLog()` | Oppdaterer logg |
| `deleteTrainingLog()` | Sletter logg |
| `getTrainingLogs()` | Henter logger for en måned |
| `getSessionWithExercises()` | Henter økt med alle øvelser |
| `repeatLastSession()` | Gjenta siste økt (hurtig-logg) |
| `addCoachFeedback()` | Coach legger til feedback |

### Datamodeller

**TrainingPlan** — plan med tittel, mål, start/slutt-dato, periodetype
**TrainingPlanWeek** — uke i planen med fokus og volumlabel
**TrainingPlanSession** — daglig økt med øvelser (JSON), varighet, fokusområde
**TrainingLog** — logget gjennomføring med rating, notater, avvik
**TrainingLogExercise** — per-øvelse: planlagt vs faktisk reps/sets, score, L-fase

### Treningspyramiden (AK Golf)
5 nivåer fra bunn til topp:
1. **FYS** — Fysisk trening (styrke, mobilitet, kondisjon)
2. **TEK** — Teknikk (svinganalyse, video, impact)
3. **SLAG** — Slagtrening (putting, chipping, driving, jern)
4. **SPILL** — Spill (9/18 hull, scramble, match)
5. **TURN** — Turnering (konkurranser, kvalik, ranking)

### L-M-PR parametre per øvelse
- **L-fase** (Læringsfase): KOLLE, ARM, BALL, MÅL
- **M** (Miljø/Environment): LUKT, BANE, PRESS
- **PR** (Prestasjonsregistrering): Score, treffrate, avstand

### Drag & drop krav
- Dra standard økt fra sidemeny → kalender-dag
- Dra favorittøvelse → eksisterende økt (legger til)
- Dra økt mellom dager (flytte)
- Klikke pyramide-nivå → filtrerer øvelser i sidemeny
- Klikke økt i kalender → åpner detaljer/redigering

### Visninger
- Ukevisning (standard) — 7 kolonner
- Månedsvisning — kompakt oversikt med prikker
- Dagvisning — fokusert på én dag med full detalj

---

## DEL 2: TRENINGSANALYSE

### Konsept
Spillerens prestasjonsoversikt. Viser trender, identifiserer styrker/svakheter, og kobler tilbake til treningsplanen.

### Funksjoner (backend er 100% operativt)

#### Statistikk
| Funksjon | Hva den gjør |
|----------|-------------|
| `getFilteredRoundStats()` | Runde-data for periode (30d/90d/sesong/1år) |
| `getFilteredAggregates()` | Gjennomsnitt: score, SG, driving, FW%, GIR%, trend |
| `getWeeklyTrainingVolume()` | Ukentlig treningsvolum (økter, minutter) |
| `getFilteredBreakdown()` | Fordeling per fokusområde (FYS/TEK/SLAG etc.) |
| `addRoundStats()` | Manuell registrering av runde |
| `getLatestHandicap()` | Siste HCP |

#### Analyse
| Funksjon | Hva den gjør |
|----------|-------------|
| `getHandicapEntries()` | HCP-historikk (12 mnd) |
| `getAnalyseStats()` | GIR%, FW%, Putts/runde, Scrambling% med trend |
| `getStrokesGainedData()` | SG fordelt på Tee/Approach/Short/Putting |
| `getPlanVsActual()` | Planlagt vs gjennomført treningsvolum |
| `getConsistencyData()` | Aktivitetsheatmap (84 dager) |
| `getTrackManStats()` | TrackMan: klubbfart, carry, smash, launch, spin |

### Datamodeller

**RoundStats** — per runde: score, SG (4 komponenter), driving, FW, GIR, putts, eagle/birdie/par/bogey-telling
**HandicapEntry** — HCP-historikk med kilde (MANUAL/GOLFBOX)

### Strokes Gained kategorier
- **Tee Total** (Off the Tee) — utslagskvalitet
- **Approach** — innspill til green
- **Short Game** (Around the Green) — kort spill, chipping
- **Putting** — på green

### Ønskede visualiseringer
1. **KPI-rad** — Snitt score, HCP, Runder, SG Total (med trend-pil)
2. **SG-barer** — Horisontale barer per kategori (positiv=grønn, negativ=rød)
3. **Score-trend** — SVG sparkline over tid
4. **Treningsvolum** — Stacked bar per uke (FYS/TEK/SLAG/SPILL/TURN)
5. **Plan vs faktisk** — Planlagte vs gjennomførte økter
6. **Konsistens-heatmap** — GitHub-stil aktivitetsrutenett
7. **HCP-utvikling** — Linjediagram 12 måneder
8. **Radar-diagram** — SG på 4 akser vs tour-snitt

---

## DESIGNSPRÅK

- Apple-inspirert light mode
- Bakgrunn: lys grå (#F5F5F7)
- Kort: hvite med layered shadows
- Aksent: lime-grønn (#D1F843) på CTA-er, maks 2-3 per skjerm
- Primary: mørk grønn (#005840)
- Labels: 10-11px UPPERCASE med bred tracking
- Tall: store (28-44px), tabular-nums, tight tracking
- Knapper: rounded-[20px] pill-form
- Animasjoner: subtile, 300ms ease
- Aldri: emojier, dark mode, gradient på kort
- Norsk bokmål for all tekst
