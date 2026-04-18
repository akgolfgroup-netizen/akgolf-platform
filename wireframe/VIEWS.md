# Views per skjerm — AK Golf Platform

> **Formål:** Per skjerm bestemme hvilke av de 5 UX-opsjonene som implementeres som valgbare views + default.
> **Oppdatert:** 2026-04-18
> **Erstatter:** `WINNERS.md` (arkivert som `WINNERS-archive-2026-04-18.md`)

---

## Hovedprinsipp (godkjent av Anders 2026-04-18)

**For alle portal- og MC-skjermer:**
- **Alle 5 views er aktive som default** — spiller/coach kan bytte fritt
- **Default settes i onboarding** — bruker velger personlig preferanse første gang de logger inn
- **Fallback** = Opt 1 hvis bruker ikke har satt preferanse
- **Drag-drop widget-dashboard** (Notion-stil) — widgets er byggeklosser, views er ferdige startmaler

**For markedsside:**
- Én vinner per skjerm (besøkere har ikke konto)

---

## Status-oversikt

| Kategori | Antall | Status |
|----------|--------|--------|
| Markedsside | 6 | ✓ Godkjent (vinner-valg) |
| Portal strategiske | 8 | ✓ Godkjent (alle 5 views aktive, onboarding-basert default) |
| Portal bonus | 21 | ✓ Godkjent (alle 5 views aktive, onboarding-basert default) |
| MC strategiske | 8 | ✓ Godkjent (alle 5 views aktive, onboarding-basert default) |
| MC bonus | 15 | ✓ Godkjent (alle 5 views aktive, onboarding-basert default) |
| **Eksisterende totalt** | **58** | **✓ 58/58 godkjent** |
| Nye (N01-N18) | 18 | Wireframes skal produseres i Fase C3 |
| Nye kandidater (N19-N22) | 4 | Venter avklaring |
| **Totalt (inkl. nye)** | **76-80** | — |

---

## Del 1 — Markedsside (6) — Vinner-valg

| ID | Skjerm | Mappe | Valgt opt | Variant | Status |
|----|--------|-------|-----------|---------|--------|
| M1 | Forside | `1704-markedsside-forside` | 1 — Mercury Flow | Polished | ✓ Godkjent |
| M2 | Pricing | `1704-markedsside-pricing` | 1 — Tier Grid | Polished | ✓ Godkjent |
| M3 | Academy | `1704-markedsside-academy` | 3 — Coach Profile | Polished | ✓ Godkjent |
| M4 | Junior Academy | `1704-markedsside-junior` | 3 — Pyramid Learn | Polished | ✓ Godkjent |
| M5 | Utvikling | `1704-markedsside-utvikling` | 1 — Data First | Polished | ✓ Godkjent |
| M6 | Booking | `1704-markedsside-booking` | 1 — Classic Wizard (primær) + 5 — Quick Book (sekundær for innlogget) | Polished | ✓ Godkjent |

---

## Del 2 — Portal (29) — View-system med alle 5 aktive

Alle skjermer: Aktive views = 1,2,3,4,5 · Default = bruker velger i onboarding (fallback Opt 1)

### Strategiske (8)

| ID | Skjerm | Mappe | Widget-gap |
|----|--------|-------|------------|
| P1 | Dashboard | `1704-portal-dashboard-v2` | Plan-%, Neste konkurranse, Treningstimer per område, Sesongplan |
| P2 | Treningsplanlegger | `1704-portal-planlegger-v2` | Periodisering (lenke til N19), Plan-% |
| P3 | Kalender | `1704-portal-kalender` | Konkurranse-countdown |
| P4 | Runde-tracking (live) | `1704-portal-runde-live` | (ingen identifisert) |
| P5 | Runde-oppsummering | `1704-portal-runde-oppsummering` | AI-insights fra runden |
| P6 | Statistikk | `1704-portal-statistikk` | Pro-benchmark, SG-trend |
| P7 | Mental | `1704-portal-mental` | Mental trends (lenke til N16/N22) |
| P8 | Onboarding | `1704-portal-onboarding` | View-default picker |

### Bonus (21)

| ID | Skjerm | Mappe | Widget-gap |
|----|--------|-------|------------|
| PB01 | AI-coach | `1704-portal-ai-coach` | Historikk-kontekst |
| PB02 | Analyse | `1704-portal-analyse` | TrackMan-insights-feed |
| PB03 | Apper | `1704-portal-apper` | Module add-ons (lenke til N20) |
| PB04 | Abonnement | `1704-portal-abonnement` | Module add-ons |
| PB05 | Bag | `1704-portal-bag` | Utstyrsinventar (lenke til N14) |
| PB06 | Benchmark | `1704-portal-benchmark` | Leaderboard (lenke til N08) |
| PB07 | Bookinger | `1704-portal-bookinger` | Neste konkurranse |
| PB08 | Coaching-historikk | `1704-portal-coaching-historikk` | Feedback-meldinger (lenke til N04) |
| PB09 | Dagbok | `1704-portal-dagbok` | Treningstimer per område (lenke til N06) |
| PB10 | Meldinger | `1704-portal-meldinger` | Coaching-feedback-kategori |
| PB11 | Øvelser | `1704-portal-ovelser` | Min bank (lenke til N11) |
| PB12 | Profil | `1704-portal-profil` | View-default picker |
| PB13 | Sammenligning | `1704-portal-sammenligning` | Leaderboard-integrasjon |
| PB14 | Sosialt | `1704-portal-sosialt` | Leaderboards (lenke til N08) |
| PB15 | Spill | `1704-portal-spill` | Turneringsintegrasjon (N18) |
| PB16 | Strategi | `1704-portal-strategi` | Konkurransestrategi-link |
| PB17 | Tester DECADE | `1704-portal-tester-decade` | Trend over tid |
| PB18 | TrackMan | `1704-portal-trackman` | AI-insights-integrasjon |
| PB19 | TrackMan-tester | `1704-portal-trackman-tester` | Protokoll-sammenligning |
| PB20 | Turneringer | `1704-portal-turneringer` | GolfBox-feltliste (lenke til N18) |
| PB21 | Turneringsplan | `1704-portal-turneringsplan` | Sesongplan (lenke til N07) |

---

## Del 3 — Mission Control (23) — View-system med alle 5 aktive

Alle skjermer: Aktive views = 1,2,3,4,5 · Default = bruker velger i onboarding (fallback Opt 1)

### Strategiske (8)

| ID | Skjerm | Mappe | Widget-gap |
|----|--------|-------|------------|
| A1 | Dashboard | `1704-mc-dashboard` | Coaching-forecast, nedgangsvarsler (lenke til N17) |
| A2 | Kalender | `1704-mc-kalender` | Kapasitet-heatmap |
| A3 | Bookinger | `1704-mc-bookinger` | (ingen identifisert) |
| A4 | Elever | `1704-mc-elever` | Nedgangsvarsler (lenke til N17) |
| A5 | Elev-detalj | `1704-mc-elev-detalj` | Mental trends (lenke til N16) |
| A6 | Rapporter | `1704-mc-rapporter` | Periode-sammenligning |
| A7 | Fasiliteter | `1704-mc-fasiliteter` | (ingen identifisert) |
| A8 | Tilgjengelighet | `1704-mc-tilgjengelighet` | Google Calendar-sync-status |

### Bonus (15)

| ID | Skjerm | Mappe | Widget-gap |
|----|--------|-------|------------|
| AB01 | Agenter | `1704-mc-agenter` | Logg-drilldown |
| AB02 | AI-assistent | `1704-mc-ai-assistent` | Data-query-history |
| AB03 | Analytics | `1704-mc-analytics` | Kohort-analyse |
| AB04 | Denne uken | `1704-mc-denne-uken` | (ingen identifisert) |
| AB05 | E-postmaler | `1704-mc-epostmaler` | Kampanje-manager (lenke til N10) |
| AB06 | Focus | `1704-mc-focus` | Admin-task-board (lenke til N12) |
| AB07 | Godkjenninger | `1704-mc-godkjenninger` | Foreldregodkjenninger |
| AB08 | Kapasitet | `1704-mc-kapasitet` | Periodisering (lenke til N19) |
| AB09 | Meldinger | `1704-mc-meldinger` | Coaching-feedback-mal (N04) |
| AB10 | Mission board | `1704-mc-mission-board` | Task-liste (lenke til N12) |
| AB11 | Notifikasjoner | `1704-mc-notifications` | Kategori-filter |
| AB12 | Økonomi | `1704-mc-okonomi` | Promo/offer (lenke til N15) |
| AB13 | Økter | `1704-mc-okter` | Post-økt-feedback (lenke til N04) |
| AB14 | Treningsplan | `1704-mc-treningsplan` | Periodisering (lenke til N19) |
| AB15 | Turneringer | `1704-mc-turneringer` | GolfBox-integrasjon (N18) |

---

## Del 4 — Nye skjermer (N01-N22)

### P0 — Kritisk (5 skjermer, N01-N05)

| ID | Skjerm | Rute | Funksjon |
|----|--------|------|----------|
| N01 | Utvikling-progresjon | `/portal/utvikling-progress` | % per NGF-område (Teknikk, Fysikk, Slag, Spill, Turnering) |
| N02 | Konkurranseforberedelse | `/portal/konkurranse-prep` | Turnering-prep unified hub: plan + checklist |
| N03 | Onboarding magic-link | `/onboarding/[token]` | E-post deep-link → profil-oppsett |
| N04 | Coaching-meldinger | `/portal/coaching-feedback` | Strukturert feedback etter økt |
| N05 | Foreldre-dashboard | `/portal/forelder` | Forelder ser barns progresjon, bookinger |

### P1 — Viktig (7 skjermer, N06-N12)

| ID | Skjerm | Rute | Funksjon |
|----|--------|------|----------|
| N06 | Treningstimer per område | `/portal/trening-volum` | Repetisjons-tracker per NGF-område |
| N07 | Sesongplan | `/portal/sesongplan` | 12-måneders periodiseringsvisning |
| N08 | Leaderboards | `/portal/rangering` | Rangering blant AK-elever, klubb, nasjonalt |
| N09 | Ferdig-turnering-resultater | `/portal/turneringer/resultater` | GolfBox-etter-turnering-oppsummering |
| N10 | Email-campaign-manager | `/portal/admin/kampanjer` | EmailSequence CRUD + analytics |
| N11 | Exercise-bank-builder | `/portal/ovelser/min-bank` | UserExerciseBank |
| N12 | Admin task-board | `/portal/admin/oppgaver` | AdminTask |

### P2 — Nyttig (6 skjermer, N13-N18)

| ID | Skjerm | Rute | Funksjon |
|----|--------|------|----------|
| N13 | Skadehistorikk/helse | `/portal/helse` | Journal + restriksjoner |
| N14 | Utstyrsinventar | `/portal/bag/administrer` | Club-distance-spec, inventory |
| N15 | Promo/offer-manager | `/portal/admin/tilbud` | PromoCode + PricingRule CRUD |
| N16 | Mental trends | `/portal/mental/trender` | MentalProfile over tid |
| N17 | Skill-degradation-alert | `/portal/admin/varsler-nedgang` | DegradationTracking |
| N18 | Golfbox-turnering-integrasjon | `/portal/turneringer/[id]/pameldte` | Feltliste + brackets |

### Kandidater — Fra coverage-analyse (4 skjermer, N19-N22)

Venter avklaring om disse skal med i scope:

| ID | Skjerm | Rute | Funksjon | Data |
|----|--------|------|----------|------|
| N19 | Periodisering | `/portal/admin/periodisering` | Trenings-fase-rammeverk for coaches | TrainingPhase, PeriodizationPeriod |
| N20 | Module Add-ons | `/portal/abonnement/moduler` | Extra-moduler man kan legge til abonnement | AppModule, AppBundle, AppSubscription |
| N21 | Content Studio | `/portal/admin/innhold` | CMS for artikler, videoer, guides | ContentItem |
| N22 | Mental Performance Profile | `/portal/mental/profil` | Utvidet mental AI-profil | MentalProfile + AI |

---

## Del 5 — Drag-drop widget-dashboard (teknisk spec)

**Beslutning:** Dashboards (P1, A1) skal være drag-drop modulære. Views = ferdige startmaler.

**Arkitektur:**
- **Bibliotek:** `react-grid-layout` eller `dnd-kit`
- **Widget-registry:** `lib/portal/widgets/registry.ts` — hver widget har id, size, data-source, component
- **Layout-lagring:** Prisma-modell `UserDashboardLayout` (userId, screen, widgets[], gridLayout)
- **Startmaler:** 5 views per dashboard = 5 forhåndsdefinerte layouts. Bruker kan redigere.

**Widgets å bygge (fra widget-gap-kolonnene over):**

| Widget | Prioritet | Data-kilde | Brukes på |
|--------|-----------|------------|-----------|
| PlanProgressWidget | P0 | TrainingPlan + TrainingLog | P1, PB09, N01 |
| NextCompetitionWidget | P0 | Tournament + TournamentPrep | P1, P3, N02 |
| TrainingVolumeWidget | P0 | TrainingLog aggregert | P1, PB09, N01, N06 |
| SeasonPlanWidget | P1 | TrainingPlan måned-horisont | P1, P2, N07 |
| LeaderboardWidget | P1 | User + Round aggregert | P1, PB06, PB13, PB14, N08 |
| CoachingFeedbackWidget | P1 | Message fra instruktør | P1, PB01, PB08, PB10, N04 |
| MentalTrendsWidget | P1 | MentalProfile over tid | P7, A5, N16, N22 |
| DegradationAlertWidget | P2 | DegradationTracking | A1, A4, N17 |
| ModuleAddonsWidget | P2 | AppModule | PB03, PB04, N20 |
| PeriodiseringWidget | P2 | TrainingPhase | P2, AB08, AB14, N19 |

---

## Del 6 — Onboarding view-default-picker

Nytt onboarding-steg som kreves:

**Steg i P8 Onboarding:**
1. Velkomst
2. Handicap + mål
3. Klubb
4. **Velg dashboard-stil (view-default):** vis 5 små thumbnails av Athletic Grid / Focus Today / Data Rich / Progress Story / Command Center. Bruker klikker favoritt → lagres som default.
5. Full onboarding

Samme logikk kan kjøres på andre skjermer ved første besøk (kan utsettes til bruker selv går til "Innstillinger").

---

## Del 7 — Implementasjonssekvens

```
[Fase C2 ✓ FERDIG] — Alle 58 godkjent for view-system
       │
       ▼
[Fase C3] ─── Lag N01-N18 wireframes (+ N19-N22 hvis godkjent)
       │
       ▼
[Fase C4] ─── View-system tech: view-switcher, UserPreferences, registry
       │
       ▼
[Fase C5] ─── Widget-bibliotek: 10 widgets + drag-drop + UserDashboardLayout
       │
       ▼
[Fase D] ───── Design-specs per skjerm × view + widget-styling
```

---

## Historikk

- **2026-04-18:** VIEWS.md opprettet. M1-M6 overført fra WINNERS.md. Alle portal/MC-skjermer godkjent for view-system med alle 5 aktive + onboarding-basert default.
- **2026-04-18:** Coverage-analyse ferdig (`FUNCTION_COVERAGE.md`). 4 nye kandidater foreslått (N19-N22).
