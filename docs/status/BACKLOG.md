# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-05-02

---

## P1+ — Trening: rask flow + session card (post-lansering)

**Status:** Designet og spec godkjent. **Ikke i scope for dagens lansering.** Dagens versjon er manuell + standardmaler + «Kopier uke». Utvides etter at platformen er live.

**Spec:** [`docs/superpowers/specs/2026-04-27-trening-fast-flow-design.md`](../superpowers/specs/2026-04-27-trening-fast-flow-design.md)

### Hva som skal bygges (5 faser)

| Fase | Innhold | Effekt |
|---|---|---|
| **1 — Quick-Add Bar** | Sticky bar med natural-language-input («Tee 60min tor 14») + pyramide-pills | Reduserer 30 sek → 5 sek per økt |
| **2 — Session Card / Live Workout** | Full-screen mobil-modus: per-øvelse countdown, start/pause/ferdig, rate-modal ved avslutning, lagrer til TrainingLog | Kjerneopplevelsen «under treningen» |
| **3 — Pakker** | Ny `SessionPackage`-modell + sidebar-fane. Drag pakke = hele økt + alle øvelser opprettes på én gang. System-pakker + brukerens egne + coach-tildelte | 1 drag = full økt klar |
| **4 — Multi-select øvelser** | Toggle i Øvelser-fanen + floating bottom-bar med batch-add til valgt økt | Halvert klikk vs én-og-én drag |
| **5 — User-preferanse** | `User.defaultSessionFlow`-enum (Quick-Add/Modal/Pakker) + settings-side. «Ny økt»-CTA dispatcher til valgt modus | Power-user kan velge sin standard |

### Database-endringer

- Ny modell: `SessionPackage` (id, ownerId?, targetUserId?, name, iconName?, defaultDurationMinutes, focusArea, area?, exercisesJson, createdAt)
- Ny kolonne: `User.defaultSessionFlow` (enum QUICK_ADD | MODAL | PACKAGES)
- 2 nye Prisma-migrasjoner

### Hva som er tilgjengelig allerede (i dag)

- ✅ Standardmal i wizard → hele 1/4/8/12 ukers plan klar
- ✅ Drag mal til spesifikk uke
- ✅ «Kopier uke»-knapp i topplinje
- ✅ Drag øvelse fra sidebar → økt-popover med tid/reps

### Avhengigheter

- Fase 2 (Session Card) krever Service Worker for bakgrunns-timer
- Fase 5 trenger settings-side i `/portal/profil/innstillinger`
- AI-foreslått måned-plan venter på AI-pipeline (skills/agenter) — separat feature

---

> **Les først:** [`PLATFORM_FUNCTION_MAP.md`](./PLATFORM_FUNCTION_MAP.md) — komplett funksjonskartlegging per spiller-fase (PLANLEGGE → GJENNOMFØRE → EVALUERE → ADMINISTRERE), 112 Prisma-modeller, 10 integrasjoner, 21 CRON-jobs, 25 MCP-verktøy og gap-analyse. Sprint-rekkefølgen nedenfor er begrunnet i kartets seksjon 9.

---

## P1 — UI/UX design-arbeid (gjeldende sprint)

Tokens, fonter og sidebar/nav er migrert til Brand Guide V2.0. Nå må hver side få riktig layout, komponent-struktur og innhold-hierarki mot BG V2.0-referansen.

**Referansebibliotek:** `public/design-reference/handoff-2026-04-27/screens/*.html` (godkjente BG V2.0-mockups).
**Design-system:** `.claude/rules/design-system.md` (én sannhet).

### Workflow per side
1. Åpne app-siden + BG V2.0-referanse-skjerm side-om-side
2. Vurder gap (struktur, komponenter, innhold-hierarki)
3. Rewrite eller justér — bruk BG V2.0-tokens 1:1
4. Skjermbilde for godkjenning før neste

---

### 1.1 Landingpages (8 sider)

| # | Side | Rute | BG V2.0-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.1.1 | Forside | `/` | `g1-forsiden.html` | OK (nav ferdig) | Lav |
| 1.1.2 | Academy | `/academy` | `g2-academy.html` | Rewrite | Høy |
| 1.1.3 | Academy abonnement | `/academy/abonnement` | `g6-academy-pricing.html` | Rewrite | Høy |
| 1.1.4 | Junior Academy | `/junior-academy` | `g3-junior-academy.html` | Rewrite | Medium |
| 1.1.5 | Utvikling | `/utvikling` | `g8-utvikling.html` / `g14-utvikling-v2.html` | Rewrite | Lav |
| 1.1.6 | Landing pricing | `/landing/pricing` | `g4-pricing.html` | Rewrite | Høy |
| 1.1.7 | Landing contact | `/kontakt` | `g10-kontakt.html` | ✅ Ferdig 2026-04-29 (`website-v2/contact-*`) | — |
| 1.1.8 | Personvern | `/personvern` | `g11-personvern.html` | Rewrite | Lav |

**Felles grep:** Hero-seksjon med JetBrains Mono eyebrow + stor Inter Tight headline. Bento-grid under. Lime-accent-CTA. "Engineered for precision"-estetikk.

### 1.2 Booking-system (4-5 skjermer i flyt)

| # | Steg | Rute | BG V2.0-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.2.1 | Velg tjeneste | `/booking` eller `/portal/bookinger/ny` | `booking.html` / `g5-booking.html` | Rewrite | Høy |
| 1.2.2 | Velg coach | (steg i wizard) | `booking.html` (steg) | Rewrite | Høy |
| 1.2.3 | Dato + tid | (steg i wizard) | `booking.html` (steg) | Rewrite | Høy |
| 1.2.4 | Review + betal | (steg i wizard) | `booking.html` (steg) | Rewrite | Høy |
| 1.2.5 | Bekreftelse | `/booking/[id]/confirmation` | `booking.html` (sluttsteg) | Rewrite | Høy |
| 1.2.6 | Reschedule | `/portal/bookinger/[id]/endre` | Adapt `booking.html` | Rewrite | Medium |
| 1.2.7 | Avlys | `/booking/[id]/cancel` | Adapt `booking.html` | Rewrite | Medium |

**Felles grep:** Wizard med progress-indikator. Store kort per steg. Lime-CTA for "neste". Summary-sidebar til høyre. Mobilflyt prioritert. Ny `booking-v2/`-flyt er valgt retning (se `.claude/rules/architecture.md`).

### 1.3 Spillerportal (~30 sider)

**Kjerneopplevelse** (høyeste prioritet):

| # | Side | Rute | BG V2.0-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.3.1 | Dashboard | `/portal` | `dashboard-v1-bento.html` | ✅ Ferdig 2026-04-27 (`dashboard-bento/`, aktiv via `?dashboard=bento`) | — |
| 1.3.2 | Statistikk | `/portal/statistikk` | `stats-v2.html` | ✅ Ferdig 2026-04-28 (`statistikk/v2/`, default visning) | — |
| 1.3.3 | Kartlegging | `/portal/kartlegging` | `a8-kartlegging.html` | Juster | Høy |
| 1.3.4 | Dagbok | `/portal/dagbok` | `dagbok.html` | Rewrite | Høy |
| 1.3.5 | Ny runde | `/portal/runde/ny` | `runde-v2.html` | Rewrite | Høy |
| 1.3.6 | Live runde | `/portal/runde/[id]` | `runde.html` | Juster | Medium |
| 1.3.7 | Treningsplan | `/portal/treningsplan` | `a5-treningsplan.html` / `a6-treningsplan-detalj.html` | Rewrite | Høy |
| 1.3.8 | Min plan | `/portal/min-plan` | `a3-min-plan.html` | Rewrite | Medium |
| 1.3.9 | Bookinger | `/portal/bookinger` | `a4-mine-bookinger.html` | Juster | Medium |
| 1.3.10 | Profil | `/portal/profil` | `a1-min-profil.html` | Juster | Medium |

**Sekundær opplevelse** (medium prioritet):

| # | Side | Rute | BG V2.0-ref |
|---|---|---|---|
| 1.3.11 | Kalender | `/portal/kalender` | `a9-kalender.html` |
| 1.3.12 | Meldinger | `/portal/meldinger` | `a12-meldinger.html` |
| 1.3.13 | Sosialt | `/portal/sosialt` | `a22-sosialt.html` |
| 1.3.14 | Turneringer | `/portal/turneringer` | `a19-turneringer.html` |
| 1.3.15 | Analyse | `/portal/analyse` | `stats.html` (variant) |
| 1.3.16 | Benchmark | `/portal/benchmark` | Adapt `stats-v2.html` |
| 1.3.17 | Sammenligning | `/portal/sammenligning` | `a13-sammenligning.html` |
| 1.3.18 | AI-coach | `/portal/ai-coach` | `aicoach.html` |
| 1.3.19 | Coaching-historikk | `/portal/coaching-historikk` | `a21-coaching-historikk.html` |
| 1.3.20 | TrackMan | `/portal/trackman` | Adapt `stats-v2.html` |
| 1.3.21 | Tester | `/portal/tester` | `a15-tester.html` |
| 1.3.22 | Bag | `/portal/bag` | `a20-bag.html` |
| 1.3.23 | Spill | `/portal/spill` | Adapt — ingen direkte match |
| 1.3.24 | Mental | `/portal/mental` | `a16-mental.html` |
| 1.3.25 | Strategi | `/portal/strategi` | `a14-strategi.html` |
| 1.3.26 | Apper | `/portal/apper` | Adapt — ingen direkte match |
| 1.3.27 | Abonnement | `/portal/abonnement` | `a11-abonnement.html` |
| 1.3.28 | Onboarding | `/portal/onboarding` | `a7-onboarding.html` |
| 1.3.29 | Profil innst. | `/portal/profil/innstillinger` | `a2-profil-innstillinger.html` |

### 1.4 CoachHQ — admin-flate (~25 sider)

> CoachHQ er rebranded fra «Mission Control» (2026-04-25). UI-tekst sier CoachHQ; mappe- og rute-navn (`mission-board`, `mc-layout`) beholdes for bakoverkompatibilitet.

**Kjerne** (kritisk):

| # | Side | Rute | BG V2.0-ref | Status | Prioritet |
|---|---|---|---|---|---|
| 1.4.1 | Hub-oversikt | `/admin` | `d27-hub-oversikt.html` | Rewrite (HubClientV2 ferdig på primitiver, layout gjenstår) | Kritisk |
| 1.4.2 | Mission Board | `/admin/mission-board` | `d4-mission-board.html` | Rewrite | Kritisk |
| 1.4.3 | Coaching Board | `/admin/coaching-board` | `d3-coaching-board.html` | Juster | Høy |
| 1.4.4 | Spillere | `/admin/elever` | `d5-spillere.html` / `d6-spillere-grid.html` | Rewrite | Høy |
| 1.4.5 | Spiller-detalj | `/admin/elever/[id]` | `d7-spillerprofil-tabs.html` / `d8-spillerprofil-longpage.html` | Rewrite | Høy |
| 1.4.6 | Team + tilgang | `/admin/team` | `d23-team.html` | Juster | Medium |
| 1.4.7 | Audit-logg | `/admin/team/audit` | Adapt `d23-team.html` | Juster | Lav |
| 1.4.8 | Bookinger | `/admin/bookinger` | `d9-bookinger.html` / `d10-ny-booking.html` | Rewrite | Høy |

**Operasjon** (medium):

| # | Side | Rute | BG V2.0-ref |
|---|---|---|---|
| 1.4.9 | Kalender | `/admin/kalender` | `d11-kalender.html` |
| 1.4.10 | Godkjenninger | `/admin/godkjenninger` | `d14-godkjenninger.html` |
| 1.4.11 | Tilgjengelighet | `/admin/tilgjengelighet` | `d18-tilgjengelighet.html` |
| 1.4.12 | Kapasitet | `/admin/kapasitet` | Adapt `d27-hub-oversikt.html` |
| 1.4.13 | Focus | `/admin/focus` | `d13-focus.html` |
| 1.4.14 | Denne uken | `/admin/denne-uken` | `d2-denne-uken.html` |
| 1.4.15 | Økter | `/admin/okter` | `d12-okter.html` |
| 1.4.16 | Treningsplaner | `/admin/treningsplan` | `d24-treningsplan-bygger.html` |
| 1.4.17 | Turneringer | `/admin/turneringer` | Adapt — ingen direkte match |
| 1.4.18 | Fasiliteter | `/admin/fasiliteter` | `d25-fasiliteter.html` |
| 1.4.19 | Lokasjoner | `/admin/lokasjoner` | `d17-lokasjoner.html` |
| 1.4.20 | Tjenester | `/admin/tjenester` | `d19-tjenester.html` |
| 1.4.21 | Grupper | `/admin/grupper` | `d15-grupper.html` / `d16-gruppe-detalj.html` |

**Kommunikasjon** (lav):

| # | Side | Rute | BG V2.0-ref |
|---|---|---|---|
| 1.4.22 | Meldinger | `/admin/meldinger` | `d22-meldinger.html` |
| 1.4.23 | E-postmaler | `/admin/e-postmaler` | Adapt `d22-meldinger.html` |
| 1.4.24 | Push-varsler | `/admin/notifications` | Adapt `d22-meldinger.html` |

**AI + Analyse**:

| # | Side | Rute | BG V2.0-ref |
|---|---|---|---|
| 1.4.25 | AI-assistent | `/admin/ai-assistent` | `d29-ai-assistent.html` |
| 1.4.26 | Agenter | `/admin/agenter` | `d28-agenter.html` |
| 1.4.27 | Analytics | `/admin/analytics` | `d30-analytics.html` |
| 1.4.28 | Økonomi | `/admin/okonomi` | `d20-okonomi.html` |
| 1.4.29 | Rapporter | `/admin/rapporter` | `d21-rapporter.html` |
| 1.4.30 | Library | `/admin/library` | `d26-library.html` |

---

## Foreslått sprint-rekkefølge

**Sprint A — Spillerportal kjerneopplevelse (2-3 dager):**
- ~~1.3.1 Dashboard~~ ✅ → ~~1.3.2 Statistikk~~ ✅ → 1.3.4 Dagbok → 1.3.5 Ny runde → 1.3.7 Treningsplan

**Sprint B — CoachHQ kjerne (2 dager):**
- 1.4.1 Hub → 1.4.2 Mission Board → 1.4.4/5 Spillere + detalj → 1.4.8 Bookinger

**Sprint C — Booking-system (1-2 dager):**
- 1.2.1-1.2.5 Full flyt

**Sprint D — Landingpages (1-2 dager):**
- 1.1.2-1.1.4 Academy + Junior + Pricing

**Sprint E — Sekundære portal-sider (2-3 dager):**
- 1.3.11-1.3.29 Batch-rewrites gruppert etter likhet

**Sprint F — Sekundære CoachHQ-sider (1-2 dager):**
- 1.4.9-1.4.30 Batch-rewrites

**Totalt:** ~10-14 arbeidsdager for full visuell matching.

---

## P2 — Viktig (funksjonalitet mangler)

- **Go-live (#39)**: Vercel-env-vars må settes, `prisma migrate deploy` må kjøres mot prod, DNS må verifiseres. Alt annet er klart. Se `docs/status/GO_LIVE_CHECKLIST.md`.

### Treningsplan — gjenstående etter PR #13 (Sprint 1 + spillerstyrt fordeling + Sprint 2)

PR #13 (`claude/add-workout-summary-j6qWr`) leverer symmetrisk samtaletråd, spillerstyrt AK-fordeling og Sprint 2 (forslags-modus backend + spiller-godkjenning). Følgende gjenstår:

| # | Oppgave | Sprint | Estimat |
|---|---|---|---|
| TP-1 | Coach-UI: «Foreslå i stedet»-knapp på SessionCard i `app/admin/(authed)/treningsplan/treningsplan-client.tsx` som ruter til `proposeSessionEdit`. Backend er klar. | Sprint 2B | 0,5 dag |
| TP-2 | Utvide `applySessionDiff`/`proposeSessionEdit` med targets utover `session` (week / plan / distribution). Service-laget har feltet, men håndterer kun session i dag. | Sprint 2B | 0,5 dag |
| TP-3 | `PlanChangeLog`-modell (revisjonshistorikk: DIRECT / ACCEPTED_SUGGESTION / AI) + «Historikk»-knapp i `EditSessionModal` som viser siste 5 endringer per økt. | Sprint 3 | 0,5 dag |
| TP-4 | Polish: AK-formel-tagger i diff-rendering, batch-aksept («Godta alle»), debounced varslinger, Playwright-test for direkte + forslags-modus. | Sprint 4 | 0,5 dag |
| TP-5 | `PyramidActuals` — header-bar med planlagt vs. faktisk fordeling (basert på øktenes `focusArea` × `durationMinutes`). | Polish | 0,25 dag |
| TP-6 | Dynamisk `periodType` til AI-kall — fjern hardkodet `"grunnperiode"` i `app/portal/(dashboard)/treningsplan/actions.ts:1379`, bruk aktiv `PeriodizationPeriod`. | Bugfix | 0,1 dag |
| TP-7 | Spesialiserings-mal i `lib/portal/training/standard-templates.ts` (M3/M4-vekt, mangler i dag). | Mangler | 0,25 dag |
| TP-8 | Admin-side `/admin/periodisering/[playerId]` — coach setter opp Grunn-/Spesialiserings-/Turneringsperiode med datoer per spiller. I dag må `PeriodizationPeriod`-rader opprettes direkte i DB. | Ny feature | 1 dag |
| TP-9 | `PeriodizationPeriod.focusAllocation` skal drive AI-promptens pyramide-fordeling (kobles til spillerstyrt fordeling som overstyrer). | Integrasjon | 0,25 dag |

**Anbefalt rekkefølge:** TP-1 (komplett Sprint 2-flyt) → TP-6 (rask bugfix) → TP-3 (revisjonshistorikk) → TP-5 (polish) → TP-7 → TP-9 → TP-2 → TP-8 → TP-4.

## P3 — Forbedringer (kode-kvalitet)

- **Tier 3 ryddeplan** — se `docs/cleanup-plan-2026-05-02.md`. Tier 1, 2, 3B, 3E ferdig 2026-05-02. Tier 3A (`dashboard/` vs `dashboard-bento/`), 3C (`website/` vs `website-v2/`) og 3D (`booking/` vs `booking-v2/`) gjenstår som separate sprint-oppgaver.
- **Lint-warnings (ubrukte vars)** — auto-removal av unused imports gjort. Gjenværende er unused vars som må prefixes med `_` eller slettes manuelt.
- **`--legacy-*`-aliaser i `app/globals.css`** — Heritage-tokens (`#154212`, `#d2f000` etc.) beholdes som aliaser inntil mass-migrering i Sprint 2 av Brand Guide V2.0-migreringen. Eksisterende kode med Heritage-tokens fortsetter å fungere.
- **DM Sans → Inter** — gjenværende DM Sans-bruk i legacy-filer migreres samtidig.
- **Material Symbols → lucide-react** — 95 gjenværende Material Symbols-imports migreres når komponenter rewrites.
- **Notion-import (#41)**: Manuell import av `docs/notion-import-master-todo.json` til Notion-database.

## Fullført 2026-05-02 (samme dag)

- ~~Tier 3B: konsolidert `mc-v2/` + `coachhq/dark-cockpit` + `coachhq-dark/` til ett `coachhq-dark/`-tre~~ — commit `06905d7d`
- ~~Tier 3E: konsolidert `components/portal/admin/` inn i `components/admin/`~~ — commit `fd3a6679`
- ~~Tier 1+2: slettet 27 + 6 døde komponentfiler~~ — commits `06ad922a`, `d490ce9a`
- ~~Architecture.md oppdatert~~ — commit `36ad3fcd`

## Fullført 2026-04-29

- ~~Markedsside Kontakt v2 (BG V2.0 pixel-rebuild)~~ — `website-v2/contact-*`

## Fullført 2026-04-28

- ~~Portal Statistikk V2 (BG V2.0 pixel-rebuild av `stats-v2.html`)~~ — `statistikk/v2/`

## Fullført 2026-04-27

- ~~Portal Dashboard Bento (BG V2.0)~~ — `dashboard-bento/`, valgt design

## Fullført 2026-04-25

- ~~Brand Guide V2.0 rebrand (CoachHQ-tokens, Inter Tight + Inter, lucide-react)~~

## Fullført 2026-04-20 natt

- ~~Heritage-migrering (Steg 6b–7)~~ — DEPRECATED: erstattet av Brand Guide V2.0 i 2026-04-25-rebrand

## Fullført 2026-04-19

- ~~Heritage design-migrering Steg 1-5~~ — DEPRECATED: erstattet av Brand Guide V2.0 i 2026-04-25-rebrand
- ~~P1 Build-feil (React 19 / Next.js 16 SSG useContext)~~
- ~~Lint-warnings reduksjon~~ — 87 → 45

## Fullført 2026-04-18

- ~~Turneringsplanlegger komplett (#42):~~ 6 kilder aktive
- ~~E2E-dekning booking (#30):~~ 3 nye Playwright-spec-filer med 28 test-cases
- ~~Go-live-sjekkliste:~~ `docs/status/GO_LIVE_CHECKLIST.md` opprettet
- ~~TrackMan AI-innsikter~~
- ~~Prediktiv HCP-trend~~
- ~~Auto treningsplan-justering CRON~~

## Nye ideer / neste kvartal

- Admin: Real-time Mission Board med WebSocket/SSE (Supabase Realtime — 2-3 t sprint)
- Kalibrering av auto-plan-terskler i `training-plan-adjustment.ts` etter første CRON-kjøringer
- Stripe-webhook redundancy check (Vercel Cron hver 30 min som backup)
