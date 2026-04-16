# Wireframe-analyse: Spillerportal + Mission Control

## Systemkapasitet

| Omraade | Modeller | API-endepunkter | Server Actions |
|---------|----------|-----------------|----------------|
| Bruker & Auth | 5 | 3 | 7 (profil) |
| Booking & Scheduling | 12 | 18 | 3 |
| Trening & Prestasjon | 22 | 12 | 30+ |
| AI & Kommunikasjon | 8 | 11 | 4 |
| Betaling | 10 | 5 | 2 |
| Turneringer & Spill | 7 | 8 | 11 |
| **Totalt** | **85 modeller** | **116 ruter** | **150+ funksjoner** |

---

## Del 1: Spillerportalen — 4-fase syklus

### Syklusen: PLANLEGGE → GJENNOMFOERE → SPILLE → EVALUERE

```
                ┌─────────────┐
                │  OVERSIKT   │ ← Entrypoint
                │  Dashboard  │
                └──────┬──────┘
                       │
   ┌───────────┬───────┴───────┬───────────┐
   ▼           ▼               ▼           ▼
┌────────┐ ┌────────┐   ┌──────────┐ ┌──────────┐
│PLANLEGG│ │  TREN  │   │  SPILL   │ │ ANALYSER │
│        │ │        │   │          │ │          │
│Aarsplan│ │Start   │   │Registrer │ │Statistikk│
│Periodi-│ │  okt   │   │  runde   │ │SG/Bench- │
│ sering │ │Ovelser │   │Turnering │ │  mark    │
│Standard│ │Tester  │   │Game      │ │TrackMan  │
│  okter │ │Logg    │   │  session │ │AI Coach  │
│Trenings│ │Coach-  │   │Bag       │ │  (tab)   │
│  plan  │ │feedback│   │          │ │Video-    │
│Booking │ │        │   │          │ │ analyse  │
│Kalender│ │        │   │          │ │          │
└────────┘ └────────┘   └──────────┘ └──────────┘
   │           │               │           │
   └───────────┴───────────────┴───────────┘
                       │
                Tilbake til PLANLEGGE
                 med ny innsikt
```

### Sidebar-navigasjon (5 items)

| # | Nav | Ikon | Fase | Samler |
|---|-----|------|------|--------|
| 1 | Oversikt | LayoutDashboard | Entrypoint | Dashboard, profil, achievements |
| 2 | Planlegg | ClipboardList | PLANLEGGE | Aarsplan, periodisering, standard okter, treningsplan, ovelser, booking, kalender, maal |
| 3 | Tren | Target | GJENNOMFOERE | Start okt, ovelser, tester, logg resultater, coach-feedback |
| 4 | Spill | Flag | SPILLE | Registrer runde, turneringer, game sessions, bag |
| 5 | Analyser | TrendingUp | EVALUERE | Statistikk, SG, benchmark, trackman, sammenligning, AI Coach (sub-tab), videoanalyse |

---

### Sidemapping med data og funksjoner

#### 0. OVERSIKT (Dashboard) — Allerede bygd

**Formaal:** Gi spilleren 5-sekunders forstaelse av "Hvor staar jeg? Hva er neste steg?"

**Data tilgjengelig:**
- Handicap + trend (HandicapEntry)
- Runder spilt + snittscorer (RoundStats)
- Treningsokter denne uken (TrainingLog)
- Neste booking (Booking)
- SG breakdown (RoundStats.sg*)
- AI-innsikt (AIResponse / cron weekly)
- Coach-feedback (CoachingSession.aiSummary)
- Achievements (PlayerAchievement)
- TrackMan siste okt (TrackmanSession)

**Naturlig flyt UT:**
- "Hva skal jeg trene?" → Treningsplan
- "Book en okt" → Booking
- "Logg trening" → Dagbok
- "Registrer runde" → Ny runde
- "Se statistikk" → Analyser

---

#### 1. PLANLEGGE — Treningsplan

**Formaal:** "Hva skal jeg gjore denne uken og hvorfor?"

**Data tilgjengelig:**
- TrainingPlan (aktiv plan med uker og okter)
- TrainingPlanWeek (fokus per uke, volum)
- TrainingPlanSession (dag-for-dag med ovelser)
- ExerciseDefinition (ovelsebibliotek)
- PeriodizationPeriod (sesongfase)
- CoachingSession.drillsAssigned (coaches anbefalinger)
- Goal (spillerens maal)

**Wireframe-konsept:**
```
┌─────────────────────────────────────────────────────┐
│ TRENINGSPLAN                          Uke 15 av 52  │
├─────────────────────────────────────────────────────┤
│                                                     │
│ [< Forrige uke]  Man  Tir  Ons  Tor  Fre  [Neste >]│
│                   ●    ●    ○    ●    ○    ← pill   │
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ MANDAG 7. APRIL                      45 min     │ │
│ │ ─────────────────────────────────────────────── │ │
│ │ TEK Putting — Under 3m                          │ │
│ │   ● Gate drill         3x10  [L:KOLLE] [M:LUKT]│ │
│ │   ● Clock drill        2x8   [L:BALL]  [M:LUKT]│ │
│ │                                                 │ │
│ │ SLAG Short game — Chip & pitch                  │ │
│ │   ● Bump & run         3x5   [L:ARM]   [M:BANE]│ │
│ │                                                 │ │
│ │ [Start okt →]                    [Marker ferdig]│ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ ┌─── UKENS FOKUS ───────────────────────────────┐   │
│ │ Primaert: Putting under 3m (coach-anbefaling) │   │
│ │ Sekundaert: Approach 100-140m                 │   │
│ │ Sesongfase: FORBEREDELSE                      │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ ┌─── COACHING ──────────────────────────────────┐   │
│ │ Neste okt: Fre 11. apr kl. 14:30             │   │
│ │ [Book ny okt]    [Se ukens tilgjengelighet]   │   │
│ └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Noekkelfunksjoner:**
- Ukesvelger med dag-pills
- Per-dag: ovelser med L-M-PR parametre
- "Start okt" trigger som aapner dagbok-logg
- Sesongfase-indikator (periodisering)
- Coaching-booking integrert i kontekst

---

#### 2. GJENNOMFOERE — Tren (Dagbok)

**Formaal:** "Logg det jeg akkurat gjorde, faa umiddelbar feedback"

**Data tilgjengelig:**
- TrainingLog (okt-metadata)
- TrainingLogExercise (per-ovelse med actual vs planned)
- TrainingPlanSession (planlagt okt aa sammenligne mot)
- ExerciseDefinition (ovelse-detaljer)
- CoachingSession (coach-feedback paa ovelser)

**Wireframe-konsept:**
```
┌─────────────────────────────────────────────────────┐
│ TRENINGSDAGBOK                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ AKTIV OKT ─────────────────── 23 min igaar ──┐  │
│ │                                                │  │
│ │ Gate drill         Planlagt: 3x10  Faktisk: __ │  │
│ │ [●●●●●●○○○○]  Treffrate: ___%                 │  │
│ │                                                │  │
│ │ Clock drill        Planlagt: 2x8   Faktisk: __ │  │
│ │ [●●●●●○○○]    Treffrate: ___%                  │  │
│ │                                                │  │
│ │ Rating: ★★★★☆     Notater: [_______________]   │  │
│ │                                                │  │
│ │ [Lagre okt]                                    │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ HISTORIKK ────────────────────────────────────┐  │
│ │ [Kalender] [Liste]                    Filter ▼ │  │
│ │                                                │  │
│ │ I dag        Putting-drill       45 min  ★★★★  │  │
│ │ I gaar       Short game          30 min  ★★★   │  │
│ │ Ons 9. apr   Coaching m/ Anders  20 min  ★★★★★ │  │
│ │ Man 7. apr   Long game           60 min  ★★★   │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ STATISTIKK DENNE UKEN ───────────────────────┐  │
│ │ Okter: 4/5    Timer: 2.5t    Planfolging: 80%  │  │
│ │ [Progress-bar med streak-indikator]            │  │
│ └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Noekkelfunksjoner:**
- Live logging med plan-sammenligning
- Treffrate-input per ovelse
- Kalender vs liste-visning for historikk
- Ukesstatistikk med planfolging-prosent

---

#### 3. GJENNOMFOERE — Spill (Runde)

**Formaal:** "Registrer runden min hull for hull, faa umiddelbar analyse"

**Data tilgjengelig:**
- Round (runde-metadata, vaer, bane)
- HoleResult (score, putts, FW, GIR per hull)
- Shot (enkelt-slag med SG-beregning)
- Course + Hole (bane-data, par, lengde, HCP)
- GameSession (multiplayer, joinCode)

**Wireframe-konsept — Live scoring:**
```
┌─────────────────────────────────────────────────────┐
│ HULL 7 / 18        Par 4  |  382m  |  HCP 3        │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ SCORE ────────────────────────────────────────┐  │
│ │                                                │  │
│ │        [-]   4   [+]        ← store knapper    │  │
│ │                                                │  │
│ │  Putts: [-] 2 [+]                              │  │
│ │                                                │  │
│ │  [FW ✓]  [GIR ✓]  [U&D ○]  [Sand ○]           │  │
│ │                                                │  │
│ │  [Penalty ○]                                   │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ DECADE STRATEGI ──────────────────────────────┐  │
│ │ Maal: Bogey (5)  |  Sikte: Midt paa fairway    │  │
│ │ [Fulgte strategi ✓]  [Avvik ○]                 │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ STATUS ───────────────────────────────────────┐  │
│ │  Totalt: +3  |  Thru 6  |  FW: 4/5  |  GIR: 3│  │
│ │  [●●●●●●○○○○○○○○○○○○]  ← hull-progress       │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│  [← Forrige hull]              [Neste hull →]       │
└─────────────────────────────────────────────────────┘
```

**Wireframe-konsept — Rundeoppsummering:**
```
┌─────────────────────────────────────────────────────┐
│ RUNDEOPPSUMMERING           Fredrikstad GK          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌──────────────────────────────────────────────┐    │
│ │          78                                  │    │
│ │        +6 (par 72)         Score ring SVG    │    │
│ │                                              │    │
│ │  🟢2 Birdie  ⚪7 Par  🟡6 Bogey  🔴3 Dbl+  │    │
│ └──────────────────────────────────────────────┘    │
│                                                     │
│ ┌─ STROKES GAINED ───────────────────────────────┐  │
│ │ Tee to green   +1.8  ████████████░░  Styrke    │  │
│ │ Approach        +0.4  ████░░░░░░░░░  OK        │  │
│ │ Kort spill      -1.2  ██████████░░░  Svakhet   │  │
│ │ Putting         -0.6  ████████░░░░░  Svakhet   │  │
│ │                                                │  │
│ │ Totalt: +0.4  ← over scratch                  │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ DECADE ANALYSE ───────────────────────────────┐  │
│ │ Strategifolging: 72%   Score: 68/100           │  │
│ │ Beste beslutning: Hull 12 (layup i stedet for  │  │
│ │                   aa gaa paa flagget)           │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ AI ANALYSE ───────────────────────────────────┐  │
│ │ "Kort spill koster deg 1.2 slag per runde.     │  │
│ │  Fokuser paa chip fra 20-40m med 60-grader.    │  │
│ │  Anbefalt drill: Ladder drill 3x10."           │  │
│ │                                                │  │
│ │ [Legg til i treningsplan →]                    │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ [Del med coach]  [Ny runde]  [Se statistikk →]      │
└─────────────────────────────────────────────────────┘
```

**Noekkelfunksjon:** "Legg til i treningsplan" — AI-analyse kobler DIREKTE tilbake til PLANLEGGE.

---

#### 4. EVALUERE — Analyser (Statistikk)

**Formaal:** "Vis meg trender over tid. Blir jeg bedre?"

**Data tilgjengelig:**
- RoundStats (komplett SG, scoring, putting, approach, driving)
- HandicapEntry (handicap-historikk)
- TrainingLog (treningsvolum over tid)
- DegradationTracking (teknisk regresjon)
- TestResult (fitness/ferdighetstester)
- DataGolfCache (sammenligning med proffene)
- TrackmanSession (club data, hastigheter)

**Wireframe-konsept:**
```
┌─────────────────────────────────────────────────────┐
│ ANALYSE                    [7d] [30d] [90d] [1aar] │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ HANDICAP ────── ┐  ┌─ SCORING ────────────────┐ │
│ │       12.4       │  │ Snitt: 82.3   Best: 74   │ │
│ │   ▼ -1.2 (30d)   │  │ [Trend-chart 6 mnd]      │ │
│ │ [Sparkline chart] │  │                          │ │
│ └──────────────────┘  └──────────────────────────┘ │
│                                                     │
│ ┌─ STROKES GAINED RADAR ────────────────────────┐  │
│ │                                                │  │
│ │         Tee +1.2                               │  │
│ │        /        \                              │  │
│ │  Putt -0.6 ── App +0.4                        │  │
│ │        \        /                              │  │
│ │       Short -1.8                               │  │
│ │                                                │  │
│ │ vs Tour avg ---- vs Ditt snitt ────            │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ TRENINGSVOLUM ────────────────────────────────┐  │
│ │ [Stacked bar: Putting / Short / Long / Spill]  │  │
│ │ Uke 10  Uke 11  Uke 12  Uke 13  Uke 14  Uke 15│  │
│ │                                                │  │
│ │ Korrelasjon: Mer putting-trening = lavere HCP  │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ DYPERE ANALYSE ───────────────────────────────┐  │
│ │                                                │  │
│ │ [Driving]  [Approach]  [Kort spill]  [Putting] │  │
│ │                                                │  │
│ │ Approach (valgt):                              │  │
│ │   100-120m: 8.2m prox  (tour: 6.1m) → -2.1m   │  │
│ │   120-150m: 11.4m prox (tour: 8.3m) → -3.1m   │  │
│ │   150-180m: 14.8m prox (tour: 10.2m)→ -4.6m   │  │
│ │                                                │  │
│ │ TREND: Forbedring paa 100-120m, men 150+ er    │  │
│ │        stagnert. Fokus: 7-jern presisjon.      │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ [Sammenlign med pros →]  [Del med coach →]          │
└─────────────────────────────────────────────────────┘
```

---

#### 5. EVALUERE — AI Coach

**Formaal:** "Forklar hva dataene betyr og hva jeg bor gjore annerledes"

**Data tilgjengelig:**
- All spillerdata (runder, trening, coaching, trackman)
- AILearning (laerte monstre fra spilleren)
- CoachingSession (coach-notater og AI-oppsummeringer)
- Goal (spillerens maal)

**Wireframe-konsept:**
```
┌─────────────────────────────────────────────────────┐
│ AI COACH                                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌─ UKENS INNSIKT ────────────────────────────────┐  │
│ │ Basert paa 3 okter og 1 runde denne uken:      │  │
│ │                                                │  │
│ │ STYRKER                                        │  │
│ │ ● Driving: +1.2 SG, 68% fairway               │  │
│ │ ● Putting under 3m: 92% hole-rate              │  │
│ │                                                │  │
│ │ FORBEDRE                                       │  │
│ │ ● Approach 120-150m: 11.4m proximity           │  │
│ │ ● 3-putts: 3 denne uken (maal: 0)             │  │
│ │                                                │  │
│ │ ANBEFALING                                     │  │
│ │ "Prioriter approach-trening med 7- og 8-jern.  │  │
│ │  Din treffrate paa greens faller med avstand.   │  │
│ │  15 min targetpraksis daglig vil gi effekt."    │  │
│ │                                                │  │
│ │ [Legg til i treningsplan]  [Del med coach]     │  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ ┌─ CHAT ─────────────────────────────────────────┐  │
│ │                                                │  │
│ │ Du: "Hvorfor mister jeg slag paa approach?"    │  │
│ │                                                │  │
│ │ AI: "Dataene viser at din proximity til hull   │  │
│ │      oker fra 8m til 15m naar avstanden gaar   │  │
│ │      over 130m. Dette tyder paa..."            │  │
│ │                                                │  │
│ │ [Skriv melding...                         Send]│  │
│ └────────────────────────────────────────────────┘  │
│                                                     │
│ HURTIGSPORSMAL:                                     │
│ [Hva bor jeg trene?]  [Analyser siste runde]        │
│ [Forbered til turnering]  [Lag treningsplan]         │
└─────────────────────────────────────────────────────┘
```

---

## Del 2: Mission Control — Instruktoorens syklus

### Instruktoorens syklus: FORBEREDE → GJENNOMFOERE → FOLGE OPP

```
         ┌──────────────┐
         │  HUB         │ ← Entrypoint, dagens status
         │  Dashboard   │
         └──────┬───────┘
                │
   ┌────────────┼────────────┐
   ▼            ▼            ▼
┌────────┐ ┌────────────┐ ┌──────────┐
│FORBERED│ │GJENNOMFOER │ │FOELG OPP │
│        │ │            │ │          │
│Kalender│ │Bookinger   │ │Elever    │
│Tilgjeng│ │Okter       │ │Rapporter │
│Kapasit.│ │Meldinger   │ │Analytics │
│        │ │            │ │Okonomi   │
│Trenings│ │AI-assistent│ │          │
│planer  │ │            │ │          │
└────────┘ └────────────┘ └──────────┘
```

### Mission Control sidekart

| Side | Formaal | Noekkeldata | Noekkelhandling |
|------|---------|-------------|-----------------|
| Hub | "Hva skjer i dag?" | Dagens bookinger, alerts, KPI-er | Rask oversikt |
| Mission Board | Oppgavestyring | AdminTask (Todo/InProgress/Done) | Dra-og-slipp kanban |
| Denne uken | Ukeplanlegging | Ukens bookinger, kapasitet | Se ledig tid |
| Kalender | Maanedsvisning | Alle bookinger, fargekodede | Klikk for detaljer |
| Bookinger | Soek og administrer | Booking-liste med filtre | Opprett, endre, avbestill |
| Godkjenninger | Ventende handlinger | Pending bookinger og aktiviteter | Godkjenn/avslaa |
| Tilgjengelighet | Sett arbeidstider | InstructorAvailability | Legg til/endre tider |
| Kapasitet | Belegg-analyse | Slot-utnyttelse per dag/uke | Identifiser gap |
| Elever | Studentliste | Alle elever med HCP, okter | Se profil, kontakt |
| Elever/[id] | Elevdetalj | Coaching-historikk, plan, maal | Lag plan, send melding |
| Okter | Coaching-notater | CoachingSession med AI-oppsummering | Skriv notater, generer AI |
| Treningsplaner | Lag/endre planer | TrainingPlan per elev | Opprett, rediger, tilordne |
| Meldinger | Kommunikasjon | Conversations, UnifiedMessage | Send meldinger |
| AI-assistent | Spor systemet | Naturlig spraak-sporing | "Hvem har ikke booket?" |
| Analytics | Forretningsdata | Bookinger, inntekt, retention | Periodefilter |
| Okonomi | Okonomidata | PaymentTransaction, inntekt | Eksporter |
| Rapporter | Generer rapporter | Alle data aggregert | CSV-eksport |
| Fasiliteter | Baneoversikt | Facility, FacilityActivity | Legg til aktiviteter |

---

## Del 3: Dataflyt mellom syklusene

### Spillerens data naerer instruktoorens beslutninger

```
SPILLER logger runde (78, SG putting -0.6)
    │
    ▼
MISSION CONTROL ser:
  "Anders har negativ SG putting siste 3 runder"
    │
    ▼
INSTRUKTOER oppretter treningsplan:
  "Fokus: Putting under 3m, 3 okter denne uken"
    │
    ▼
SPILLER ser planen i portalen
    │
    ▼
SPILLER logger okt (gate drill 8/10 treff)
    │
    ▼
AI COACH analyserer:
  "Putting forbedret 12%. Flytt fokus til approach."
    │
    ▼
Tilbake til PLANLEGGE
```

### Kritiske koblinger for wireframing

| Fra | Til | Trigger | Data som flyter |
|-----|-----|---------|-----------------|
| Rundeoppsummering | AI Coach | "Analyser runden" | Round + HoleResults + SG |
| AI Coach | Treningsplan | "Legg til i plan" | Anbefalt ovelse + fokus |
| Treningsplan | Dagbok | "Start okt" | TrainingPlanSession → TrainingLog |
| Dagbok | Statistikk | Automatisk | TrainingLog aggregeres |
| MC Elever | MC Treningsplan | "Lag plan" | StudentId + maal |
| MC Okter | Spiller Dashboard | Etter okt | CoachingSession.aiSummary |
| Spiller Booking | MC Kalender | Automatisk | Booking synkroniseres |

---

## Del 4: Anbefalinger for wireframing

### 1. Spillerportalen — Prioritert rekkefølge

| # | Side | Prioritet | Begrunnelse |
|---|------|-----------|-------------|
| 1 | Dashboard (Oversikt) | Ferdig | Bygd og polert |
| 2 | Treningsplan | P1 | PLANLEGGE-fase, daglig bruk |
| 3 | Dagbok (Tren) | P1 | GJENNOMFOERE-fase, daglig bruk |
| 4 | Runde (Spill) | P1 | GJENNOMFOERE-fase, ukentlig bruk |
| 5 | Statistikk (Analyser) | P1 | EVALUERE-fase, ukentlig bruk |
| 6 | AI Coach | P2 | EVALUERE-fase, ukentlig bruk |
| 7 | Booking | P2 | Allerede bygd (BookingWizard) |
| 8 | Profil | P3 | Sjelden endret |

### 2. Mission Control — Prioritert rekkefølge

| # | Side | Prioritet | Begrunnelse |
|---|------|-----------|-------------|
| 1 | Hub (Dashboard) | P1 | Foerste ting instruktoeren ser |
| 2 | Kalender + Bookinger | P1 | Daglig arbeidsverktoy |
| 3 | Elever + Elevdetalj | P1 | Kjernen i coaching |
| 4 | Okter (Coaching notes) | P1 | Etter hver okt |
| 5 | Treningsplaner | P2 | Ukentlig planlegging |
| 6 | Analytics + Rapporter | P2 | Maanedlig review |
| 7 | Meldinger | P2 | Ad-hoc kommunikasjon |
| 8 | AI-assistent | P3 | Supportverktoy |

### 3. Designprinsipper for wireframing

1. **Kontekstuell navigasjon** — Hver side viser NESTE naturlige handling
2. **Data foelger bruker** — AI-analyse paa rundeoppsummering → "Legg til i plan"
3. **Null tomme tilstander** — Ny bruker ser demo-data med forklaring
4. **Progressiv avsloering** — Enkel foerstevisning, dypere data paa klikk
5. **Moerke CTA-kort** — Handlinger som driver syklusen videre
6. **AI som bindeledd** — AI Coach kobler EVALUERE tilbake til PLANLEGGE
