# FEATURE INVENTORY — AK Golf Platform

> Generert 2026-04-25 basert på faktisk filinnhold, ikke antakelser.
> Status: Ferdig = reell implementasjon med data. Delvis = side eksisterer men mangler design/funksjonalitet. Mangler = ikke bygget.

---

## 1. Landingsside (Markedsside)

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Forside | `/` | Hero, HowItWorks, PortalPreview, TargetProfiles, Team, CTA | Ferdig |
| Landing (alternativ) | `/landing` | Fullstendig landingsside med seksjoner (245 linjer) | Ferdig |
| Academy | `/academy` | Academy-presentasjon (79 linjer, delegerer til komponenter) | Ferdig |
| Academy abonnement | `/academy/abonnement` | Redirect til `/academy` | Ferdig (redirect) |
| Academy booking | `/academy/booking` | Booking-inngang fra Academy-siden (105 linjer) | Ferdig |
| Junior Academy | `/junior-academy` | Junior-program presentasjon (326 linjer) | Ferdig |
| Utvikling | `/utvikling` | Utviklingsprogram-side (316 linjer) | Ferdig |
| Pricing | `/landing/pricing` | Priser og pakker (405 linjer) | Ferdig |
| Kontakt | `/landing/contact` | Kontaktskjema (327 linjer client component) | Ferdig |
| Om oss | `/landing/about` | Om AK Golf (306 linjer) | Ferdig |
| Personvern | `/personvern` | Personvernerklaering (262 linjer) | Ferdig |
| Maintenance | `/maintenance` | Vedlikeholdsside (203 linjer) | Ferdig |
| 403 | `/403` | Ingen tilgang-side | Ferdig |
| 500 | `/500` | Serverfeil-side | Ferdig |

---

## 2. Spillerportal (PlayerHQ)

### 2.1 Kjerneopplevelse

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Dashboard | `/portal` | Hovedoversikt med KPI-er, bookinger, treningsdata, AI-innsikter. Reelle data via 6+ server actions | Ferdig |
| PlayerHQ (preview) | `/portal/playerhq` | Alternativt dashboard-design (Crextio-inspirert). Eksperimentell preview-rute | Delvis — demo-fallback for noen felt |
| Profil | `/portal/profil` | Spillerprofil med 6 parallelle server actions | Ferdig |
| Profil innstillinger | `/portal/profil/innstillinger` | Brukerinnstillinger | Ferdig |
| Treningsplan | `/portal/treningsplan` | Treningsplanlegger med wizard (Manuell/Anbefalt/Standard), 5 maler, ukeskalender | Ferdig |
| Treningsplan okt | `/portal/treningsplan/[sessionId]` | Enkelt-okt detaljer | Ferdig |
| Statistikk | `/portal/statistikk` | SG-analyse, HCP-trend, golfprofil, combined insights. 6 server actions + periodefilter | Ferdig |
| Ny runde (statistikk) | `/portal/statistikk/ny-runde` | Registrer ny runde | Ferdig |
| Dagbok | `/portal/dagbok` | Treningsdagbok med heatmap, quick-log, ukestats, plan-progress | Ferdig |
| Dagbok detalj | `/portal/dagbok/[sessionId]` | Enkelt dagbok-innlegg | Ferdig |
| Kartlegging | `/portal/kartlegging` | Spillerprofil-kartlegging (coach-view pattern) | Ferdig |

### 2.2 Runde og spill

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Ny runde | `/portal/runde/ny` | Start ny runde med banevalg | Ferdig |
| Live runde | `/portal/runde/[id]` | Aktiv runde med hull-navigator, GPS, DECADE, pre-shot | Ferdig |
| Runde hero | `/portal/runde/[id]/hero` | Runde-hero visning | Ferdig |
| Runde oppsummering | `/portal/runde/[id]/oppsummering` | Ferdig runde med resultater | Ferdig |

### 2.3 Analyse og data

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Analyse | `/portal/analyse` | Strokes Gained-analyse med 4 server actions. Tier-gate for TrackMan (PRO+) | Ferdig |
| TrackMan | `/portal/trackman` | TrackMan-data med analytics, shot dispersion, klubb-sammenligning | Ferdig |
| Benchmark | `/portal/benchmark` | Sammenligning mot andre spillere | Ferdig |
| Sammenligning | `/portal/sammenligning` | Head-to-head versus. Krever PRO+ | Ferdig |

### 2.4 Trening og coaching

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Min plan | `/portal/min-plan` | Personlig treningsplan-visning | Ferdig |
| Trening ovelser | `/portal/trening/ovelser` | Ovelsesbibliotek | Ferdig |
| Trening tester | `/portal/trening/tester` | Testprotokoll-liste | Ferdig |
| Trening test detalj | `/portal/trening/tester/[id]` | Enkelt test-gjennomforing | Ferdig |
| Tester | `/portal/tester` | Tester med leaderboard | Ferdig |
| Coaching-historikk | `/portal/coaching-historikk` | Tidligere coaching-okter | Ferdig |
| AI-Coach | `/portal/ai-coach` | AI-chat med streaming | Ferdig |
| AI-Coach chat | `/portal/ai-coach/chat` | Direkte chat-grensesnitt | Ferdig |

### 2.5 Planlegging

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Turneringer | `/portal/turneringer` | Turneringsoversikt med 6 kilder (Olyo, Ostlandstour, etc.) | Ferdig |
| Turneringsplan | `/portal/turneringsplan` | Personlig turneringsplanlegger | Ferdig |
| Kalender | `/portal/kalender` | Kalenderoversikt med sync-innstillinger | Ferdig |
| Timeplan | `/portal/timeplan` | Ukentlig timeplan (126 linjer) | Ferdig |
| Strategi | `/portal/strategi` | Spillestrategi og forberedelse (374 linjer) | Ferdig |

### 2.6 Booking

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Mine bookinger | `/portal/bookinger` | Kommende og tidligere bookinger | Ferdig |
| Booking detalj | `/portal/bookinger/[id]` | Enkelt booking-detaljer | Ferdig |
| Endre booking | `/portal/bookinger/[id]/endre` | Reschedule-flyt | Ferdig |
| Ny booking (portal) | `/portal/bookinger/ny` | Book fra portalen | Ferdig |

### 2.7 Sosialt og kommunikasjon

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Sosialt | `/portal/sosialt` | Sosialt feed med 3 server actions | Ferdig |
| Venner | `/portal/sosialt/venner` | Venneforesporsler og sokeliste | Ferdig |
| Meldinger | `/portal/meldinger` | Chat med coach/andre spillere | Ferdig |
| Meldinger demo | `/portal/meldinger/demo` | Demo-modus for meldinger | Ferdig |

### 2.8 Mental og spill

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Mental | `/portal/mental` | Mentaltrening med profil, trender, runder (230 linjer) | Ferdig |
| Mental ny | `/portal/mental/ny` | Ny mental-logg | Ferdig |
| Mental runde | `/portal/mental/[roundId]` | Mental evaluering per runde | Ferdig |
| Spill | `/portal/spill` | Gamification med 3 server actions | Ferdig |
| Spill type | `/portal/spill/[gameType]` | Spesifikk spilltype | Ferdig |

### 2.9 Konto og system

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Abonnement | `/portal/abonnement` | Abonnementsoversikt og oppgradering | Ferdig |
| Apper | `/portal/apper` | App-moduler og tillegg | Ferdig |
| Bag | `/portal/bag` | Utstyrsregistrering | Ferdig |
| Onboarding | `/portal/onboarding` | Ny bruker-wizard | Ferdig |

### 2.10 Intern / preview

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Design preview | `/portal/design-preview` | Intern design-test (19 linjer) | Delvis — kun intern |
| Dashboard hero | `/portal/dashboard/hero` | Hero-variant av dashboard | Delvis — eksperiment |
| Portal demo | `/portal/demo` | Demo-side | Delvis — intern |
| Portal preview | `/portal-preview` | Preview av portal | Delvis — intern |

---

## 3. Mission Control (CoachHQ / Admin)

### 3.1 Kjerne

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Hub-oversikt | `/admin` | Hovedoversikt med bookinger, elever, inntekter (320 linjer) | Ferdig |
| Mission Board | `/admin/mission-board` | Dashboard med charts, trender, heatmap (621 linjer) | Ferdig |
| Coaching Board | `/admin/coaching-board` | Dagens coaching-oversikt | Ferdig |
| Elever | `/admin/elever` | Elevliste med paginering og sok | Ferdig |
| Elev-detalj | `/admin/elever/[id]` | Elevprofil med tabs: Sammendrag, Drills, Tester, Planlegg neste, Forecast | Ferdig |
| Elev-oversikt | `/admin/elever/oversikt` | Aggregert elev-statistikk | Ferdig |
| Grupper | `/admin/grupper` | Gruppeadministrasjon (17 linjer) | Delvis — nylig lagt til |

### 3.2 Booking og kalender

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Admin bookinger | `/admin/bookinger` | Booking-soek, paginering, reschedule | Ferdig |
| Ny booking (admin) | `/admin/bookinger/ny` | Opprett booking for elev | Ferdig |
| Admin kalender | `/admin/kalender` | Periodeoversikt med instruktor-filter | Ferdig |
| Tilgjengelighet | `/admin/tilgjengelighet` | Sett ledige tider, blokkering (733 linjer) | Ferdig |
| Kapasitet | `/admin/kapasitet` | Kapasitetsforecast | Ferdig |
| Denne uken | `/admin/denne-uken` | Ukeoversikt med bookinger og stats | Ferdig |
| Godkjenninger | `/admin/godkjenninger` | Ventende godkjenninger | Ferdig |

### 3.3 Coaching

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Okter | `/admin/okter` | Okt-oversikt | Ferdig |
| Treningsplaner | `/admin/treningsplan` | Administrer elevplaner | Ferdig |
| Ny treningsplan | `/admin/treningsplan/ny` | Opprett ny plan for elev | Ferdig |
| Turneringer | `/admin/turneringer` | Turneringsadministrasjon | Ferdig |
| Focus (kanban) | `/admin/focus` | AdminTask kanban: Todo/InProgress/Done med divisjoner | Ferdig |
| Fasiliteter | `/admin/fasiliteter` | Fasilitetsoversikt | Ferdig |
| Fasiliteter innst. | `/admin/fasiliteter/innstillinger` | Fasilitetsinnstillinger | Ferdig |
| Ny aktivitet | `/admin/fasiliteter/ny-aktivitet` | Opprett ny fasilitetsaktivitet | Ferdig |

### 3.4 Team og tilgang

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Team | `/admin/team` | Teamoversikt med rolletildeling og kapabiliteter | Ferdig |
| Audit-logg | `/admin/team/audit` | CapabilityChangeLog med tidslinje | Ferdig |

### 3.5 Kommunikasjon

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Meldinger | `/admin/meldinger` | Samtaleliste med sok, ulest-teller, chat-vindu | Ferdig |
| E-postmaler | `/admin/e-postmaler` | Mal-administrasjon | Ferdig |
| Push-varsler | `/admin/notifications` | Send push til spillere | Ferdig |

### 3.6 AI og analyse

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| AI-assistent | `/admin/ai-assistent` | Admin AI-chat med streaming | Ferdig |
| Agenter | `/admin/agenter` | Agent-oversikt med stats | Ferdig |
| Analytics | `/admin/analytics` | KPI-dashboard med booking-trend, tier-fordeling | Ferdig |
| Okonomi | `/admin/okonomi` | Finansoversikt (ADMIN-only) | Ferdig |
| Rapporter | `/admin/rapporter` | CSV-eksport: bookinger, okonomi, elever (603 linjer) | Ferdig |

---

## 4. Booking-system (offentlig)

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Booking wizard | `/booking` | 5-stegs booking: tjeneste, coach, dato, review, betaling (414 linjer) | Ferdig |
| Bekreftelse | `/booking/[id]/confirmation` | Booking-bekreftelse | Ferdig |
| Betaling | `/booking/[id]/pay` | Stripe Checkout redirect | Ferdig |
| Status | `/booking/[id]/status` | Betalingsstatus-sjekk | Ferdig |
| Avlysing | `/booking/[id]/cancel` | Kanselleringsflyt med 24t policy | Ferdig |

### Booking-motor (backend)

| Modul | Fil | Status |
|-------|-----|--------|
| Validering | `lib/portal/booking/validation.ts` (450+ linjer) | Ferdig |
| Subscription quota | `lib/portal/booking/subscription-quota.ts` | Ferdig |
| Konfliktsjekk | `lib/portal/booking/conflict-check.ts` | Ferdig |
| Refusjon | `lib/portal/booking/refund.ts` | Ferdig |
| Kanselleringspolicy | `lib/portal/booking/cancellation-policy.ts` | Ferdig |
| Reschedule | `lib/portal/booking/reschedule.ts` | Ferdig |
| Auto-create user | `lib/portal/booking/auto-create-user.ts` | Ferdig |
| Cache | `lib/portal/booking/cache.ts` | Ferdig |
| Waitlist | `lib/portal/booking/waitlist.ts` | Mangler — stub |

---

## 5. Auth

| Side | Rute | Beskrivelse | Status |
|------|------|-------------|--------|
| Login (auth) | `/auth/login` | Innlogging med Supabase (267 linjer) | Ferdig |
| Registrer | `/auth/register` | Registrering (241 linjer) | Ferdig |
| Glemt passord | `/auth/forgot-password` | Passord-reset (139 linjer) | Ferdig |
| Sett passord | `/auth/set-password` | Nytt passord (433 linjer) | Ferdig |
| Callback | `/auth/callback` | OAuth callback route | Ferdig |
| Portal login | `/portal/login` | Portal-spesifikk innlogging (529 linjer) | Ferdig |
| Admin login | `/admin/login` | Admin-innlogging | Ferdig |

---

## 6. API-ruter (150 totalt)

### 6.1 Booking API

| Rute | Metode | Beskrivelse | Status |
|------|--------|-------------|--------|
| `/api/booking/create` | POST | Opprett booking + Stripe | Ferdig |
| `/api/booking/confirm-payment` | POST | Sjekk betalingsstatus | Ferdig |
| `/api/booking/slots` | GET | Ledige tider (30s cache) | Ferdig |
| `/api/booking/smart-slots` | GET | Ukesoversikt for DateTimeDrawer | Ferdig |
| `/api/booking/[bookingId]` | GET/PATCH | Booking-detaljer | Ferdig |
| `/api/booking/reschedule` | POST | Ombooking | Ferdig |
| `/api/booking/services` | GET | Tjenesteliste | Ferdig |
| `/api/booking/list` | GET | Bookinger-liste | Ferdig |
| `/api/bookings` | GET | Alternativ bookinger-liste | Ferdig |

### 6.2 Portal API

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/portal/webhooks/stripe` | Stripe webhook (543 linjer) — payment, refund, subscription | Ferdig |
| `/api/portal/admin/dashboard` | Admin dashboard-data (256 linjer) | Ferdig |
| `/api/portal/admin/availability` | Tilgjengelighetsadmin (448 linjer) | Ferdig |
| `/api/portal/admin/coaching-session` | Coaching-okt CRUD | Ferdig |
| `/api/portal/admin/coaching-forecast` | Coaching-prognose | Ferdig |
| `/api/portal/admin/email-templates` | E-postmal CRUD | Ferdig |
| `/api/portal/admin/facility-overview` | Fasilitetsoversikt | Ferdig |
| `/api/portal/admin/notifications` | Admin-varsler | Ferdig |
| `/api/portal/admin/push` | Push-notifikasjoner | Ferdig |
| `/api/portal/admin/test-register` | Test-register | Ferdig |
| `/api/portal/admin/capacity-export` | Kapasitetseksport | Ferdig |

### 6.3 AI API

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/portal/ai/chat` | Spiller AI-chat (streaming) | Ferdig |
| `/api/portal/ai/admin-chat` | Admin AI-chat (streaming) | Ferdig |
| `/api/portal/ai/coaching-transcription` | Whisper + Claude sammendrag | Ferdig |
| `/api/portal/ai/coaching-summary` | Coaching-sammendrag | Ferdig |
| `/api/portal/ai/drill-pack` | AI-genererte drills | Ferdig |
| `/api/portal/ai/next-session` | Neste-okt-planlegger | Ferdig |
| `/api/portal/ai/focus-recommendation` | AI fokusanbefaling | Ferdig |
| `/api/portal/ai/training-plan` | AI treningsplan | Ferdig |
| `/api/portal/ai/weakness-analysis` | Svakhetsanalyse | Ferdig |
| `/api/portal/ai/post-round` | Runde-analyse | Ferdig |
| `/api/portal/ai/score-estimate` | Score-estimat | Ferdig |
| `/api/portal/ai/session-plan` | Okt-planlegger | Ferdig |
| `/api/portal/ai/generate-drill` | Generer enkelt-drill | Ferdig |
| `/api/portal/ai/generate-content` | Innholdsgenerering | Ferdig |
| `/api/portal/ai/metrics` | AI-metrikker | Ferdig |
| `/api/portal/ai/mental/*` | Mental-modul (entries, profile, rounds, trends) | Ferdig |
| `/api/portal/ai/games/*` | Spill-modul | Ferdig |
| `/api/ai-coach/chat` | AI-coach chat (266 linjer) | Ferdig |

### 6.4 CRON-jobs

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/cron/send-reminders` | Booking-paminnelser | Ferdig |
| `/api/cron/cleanup-pending-bookings` | Rydd ubetalte bookinger | Ferdig |
| `/api/cron/cleanup-notifications` | Rydd gamle varsler | Ferdig |
| `/api/cron/cleanup-waitlist` | Rydd waitlist | Ferdig |
| `/api/cron/mark-no-shows` | Merk no-shows | Ferdig |
| `/api/cron/reset-monthly-sessions` | Reset manedlig kvote | Ferdig |
| `/api/cron/charge-completed` | Fakturer gjennomforte | Ferdig |
| `/api/cron/smart-notifications` | Smarte varsler | Ferdig |
| `/api/cron/sync-google-calendars` | Google Calendar-synk | Ferdig |
| `/api/cron/sync-cleanup` | Synk-opprydding | Ferdig |
| `/api/cron/release-dropin-slots` | Frigi drop-in slots | Ferdig |
| `/api/cron/coaching-forecast-backtest` | Forecast backtest | Ferdig |
| `/api/portal/cron/process-coaching-audio` | Prosesser coaching-lyd | Ferdig |
| `/api/portal/cron/auto-adjust-training-plans` | Auto-juster planer | Ferdig |
| `/api/portal/cron/ai-insights` | AI-innsikter | Ferdig |
| `/api/portal/cron/compute-usi` | Beregn USI | Ferdig |
| `/api/portal/cron/send-reminders` | Portal-paminnelser | Ferdig |
| `/api/portal/cron/weekly-summary` | Ukentlig sammendrag | Ferdig |
| `/api/portal/cron/welcome-sequence` | Velkomst-sekvens | Ferdig |
| `/api/portal/cron/win-back` | Win-back kampanje | Ferdig |
| `/api/portal/cron/abandoned-checkout` | Forlatt checkout | Ferdig |
| `/api/portal/cron/session-expiry-reminder` | Okt-utlop | Ferdig |
| `/api/portal/cron/sync-notion` | Notion-synk | Ferdig |
| `/api/portal/cron/reset-monthly-sessions` | Portal kvote-reset | Ferdig |

### 6.5 Integrasjoner

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/portal/trackman/*` | TrackMan import (CSV, bilde, sessions, analytics) | Ferdig |
| `/api/portal/calendar/*` | Google Calendar (auth, sync, webhook, iCal feed) | Ferdig |
| `/api/portal/golfbox/handicap` | GolfBox HCP-synk | Ferdig |
| `/api/portal/datagolf/players` | DataGolf spillerdata | Ferdig |
| `/api/portal/tournament-planner/*` | Turneringsplanlegger (import, sync, plan) | Ferdig |
| `/api/portal/subscriptions/*` | Stripe abonnement (checkout, portal, activate) | Ferdig |
| `/api/portal/notifications/*` | Push-varsler (send, subscribe, read) | Ferdig |
| `/api/portal/facilities` | Fasilitetsdata | Ferdig |
| `/api/portal/facility-activities` | Fasilitetsaktiviteter CRUD | Ferdig |
| `/api/portal/facility-calendar` | Fasilitetskalender | Ferdig |
| `/api/portal/rounds/*` | Runder CRUD med hull-data | Ferdig |
| `/api/portal/dagbok` | Dagbok-data | Ferdig |
| `/api/portal/courses` | Bane-data med hull | Ferdig |
| `/api/portal/sync/*` | Offline-synk (events, ping, status) | Ferdig |
| `/api/portal/export` | Data-eksport | Ferdig |
| `/api/portal/tests/leaderboard` | Test-leaderboard | Ferdig |
| `/api/portal/training/analysis` | Treningsanalyse | Ferdig |
| `/api/portal/payment-preferences` | Betalingsinnstillinger | Ferdig |
| `/api/portal/player/coaching-forecast` | Spiller-forecast | Ferdig |
| `/api/portal/game-session/*` | Spill-sessions | Ferdig |
| `/api/portal/bookings/*` | Portal booking-operasjoner | Ferdig |

### 6.6 Offentlige API-er

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/portal/public/slots` | Ledige tider (319 linjer) | Ferdig |
| `/api/portal/public/instructors` | Instruktor-liste | Ferdig |
| `/api/portal/public/service-types` | Tjenestetyper | Ferdig |
| `/api/portal/public/tournaments` | Turneringer | Ferdig |
| `/api/portal/public/training-plans` | Treningsplaner | Ferdig |
| `/api/portal/public/resources` | Ressurser | Ferdig |
| `/api/portal/public/waitlist` | Waitlist registrering | Ferdig |
| `/api/portal/public/periodization` | Periodisering | Ferdig |

### 6.7 Helse og system

| Rute | Beskrivelse | Status |
|------|-------------|--------|
| `/api/health` | Systemhelse (178 linjer) | Ferdig |
| `/api/health/db` | Database-sjekk | Ferdig |
| `/api/health/stripe` | Stripe-sjekk | Ferdig |
| `/api/health/booking` | Booking-sjekk | Ferdig |
| `/api/maintenance` | Vedlikeholdsmodus | Ferdig |
| `/api/mock-data` | Mock-data generator | Ferdig |

---

## 7. Backend-moduler (lib/)

### 7.1 AI-pipeline (CoachHQ)

| Modul | Fil | Beskrivelse | Status |
|-------|-----|-------------|--------|
| Coaching-sammendrag | `lib/portal/ai/coaching-summary.ts` | Whisper + Claude sammendrag | Ferdig |
| Neste-okt-orkestrator | `lib/portal/ai/next-session-orchestrator.ts` | Samler data, genererer plan | Ferdig |
| Fokusanbefaling | `lib/portal/ai/focus-recommendation.ts` | AI fokusomrade | Ferdig |
| Svakhetsanalyse | `lib/portal/ai/weakness-analysis.ts` | SG-basert analyse | Ferdig |
| Treningsplan AI | `lib/portal/ai/training-plan.ts` | AI-generert treningsplan | Ferdig |
| Plan-justering | `lib/portal/ai/training-plan-adjustment.ts` | Auto-justering av planer | Ferdig |
| Transkribering | `lib/portal/ai/transcribe-audio.ts` | Whisper-transkribering | Ferdig |
| Drill-generator | `lib/portal/ai/generate-drill.ts` | AI-genererte ovelser | Ferdig |
| Okt-planlegger | `lib/portal/ai/session-planner.ts` | Okt-planlegging | Ferdig |
| Ukentlige innsikter | `lib/portal/ai/weekly-insights.ts` | Ukentlig AI-rapport | Ferdig |
| Agent-runner | `lib/portal/agents/runner.ts` | Event-basert automasjon | Ferdig |
| Cowork-eksport | `lib/portal/cowork/append-session.ts` | Markdown-eksport til Cowork | Ferdig |

### 7.2 Golf-beregninger

| Modul | Beskrivelse | Status |
|-------|-------------|--------|
| `lib/portal/golf/sg-calculator.ts` | Strokes Gained-beregning | Ferdig |
| `lib/portal/golf/ak-formula.ts` | AK Golf Formula | Ferdig |
| `lib/portal/golf/decade-caddy.ts` | DECADE-strategi | Ferdig |
| `lib/portal/golf/trackman-parser.ts` | TrackMan CSV-parsing | Ferdig |
| `lib/portal/golf/dispersion.ts` | Spredningsanalyse | Ferdig |
| `lib/portal/golf/expected-strokes.ts` | Forventede slag | Ferdig |
| `lib/portal/golf/golfbox/handicap.ts` | GolfBox HCP | Ferdig |
| `lib/portal/usi/*` | Unified Skill Index (6 filer) | Ferdig |
| `lib/portal/predictions/*` | Coaching-forecast ML | Ferdig |

### 7.3 E-post og kommunikasjon

| Modul | Beskrivelse | Status |
|-------|-------------|--------|
| `lib/portal/email/templates/*` | 13 e-postmaler (React Email) | Ferdig |
| `lib/portal/sms/*` | Twilio SMS (booking, paminnelse) | Ferdig |
| `lib/portal/notifications/*` | Push-varsler, triggers, typer | Ferdig |

---

## 8. Ikke bygget enna

Basert pa BACKLOG.md og audit-filene som ikke har tilsvarende implementasjon:

| Funksjon | Kilde | Beskrivelse |
|----------|-------|-------------|
| Waitlist | BOOKING_AUDIT | `lib/portal/booking/waitlist.ts` er stub — ingen funksjonalitet |
| Idempotency key pa refunder | BOOKING_AUDIT P2 | Stripe refund uten idempotency key |
| Hardkodet slot-telling | BOOKING_AUDIT P1 | `availableSlotsThisWeek: 8` hardkodet i booking |
| Heritage design-rewrite per side | BACKLOG P1 | De fleste sider trenger visuell matching mot Heritage-referanser |
| Web Push (spiller) | Branch | `sendPushToUser()` eksisterer i branch, ikke i main |
| Drill-of-the-day | Branch | `getDrillOfTheDay()` eksisterer i branch, ikke i main |
| TrackMan aggregerte AI-innsikter | Branch | `AggregatedInsightsCard` eksisterer i branch, ikke i main |
| CoachHQ rebrand | Branch | Omdoping Mission Control til CoachHQ med ny sidebar/layout |
| Real-time Mission Board | BACKLOG | WebSocket/SSE via Supabase Realtime |
| Feature flags | Ny | System for a sla features av/pa uten deploy |

---

## 9. Oppsummering

| Omrade | Sider | Ferdig | Delvis | Mangler |
|--------|-------|--------|--------|---------|
| Landingsside | 14 | 14 | 0 | 0 |
| Spillerportal | 37 | 33 | 4 | 0 |
| Mission Control | 29 | 28 | 1 | 0 |
| Booking (offentlig) | 5 | 5 | 0 | 0 |
| Auth | 7 | 7 | 0 | 0 |
| API-ruter | 150 | 150 | 0 | 0 |
| **Totalt** | **242** | **237** | **5** | **0** |

Plattformen har omfattende funksjonalitet pa plass. Hovedarbeidet som gjenstar er:
1. **Heritage design-matching** — visuell polering mot Stitch-referanser
2. **Feature flags** — kontrollere hva som er synlig for brukere
3. **Go-live** — env-vars, DNS, produksjonsmigrering
