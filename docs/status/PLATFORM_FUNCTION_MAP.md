# Platform Function Map — AK Golf

**Sist oppdatert:** 2026-04-20
**Formål:** ÉN sannhetskilde for hva appen faktisk gjør — per spiller-fase (PLANLEGGE → GJENNOMFØRE → EVALUERE → ADMINISTRERE), per datamodell, per integrasjon.
**Kilder:** Utforskning av `app/`, `prisma/schema.prisma`, `lib/portal/`, `mcp/`, `scripts/`, `vercel.json` (2026-04-20).

> **Les dette før UI/UX-sprinter i `BACKLOG.md`.** Gap-analysen i seksjon 8 prioriterer hvilke sider som faktisk trenger rewrite før nye features legges til.

---

## 1. Sammendrag

| Kategori | Antall | Fase-fordeling |
|---|---|---|
| Sider (page.tsx) | 98 | 17 marked · 48 portal · 23 admin · 10 auth/error |
| API-endepunkter | 140+ | public, portal, admin, cron, webhooks |
| Prisma-modeller | 112 | ~90 aktive · ~15 moderat · ~7 lav/deprecated |
| `lib/portal/`-moduler | 31 undermapper, ~120 filer |
| Eksterne integrasjoner | 10 | 9 aktiv · 1 delvis (GolfBox) |
| CRON-jobs | 21 | fra `vercel.json` |
| Webhooks | 4 | Stripe, Google Calendar, Notion-sync, Tournament-sync |
| MCP-verktøy | 25 + 4 resources + 4 prompts |
| Scripts | 16 (manuelle) |

**Spillerfase-fordeling (48 portal-sider):**

| Fase | Sider | Andel |
|---|---|---|
| PLANLEGGE | 11 | 23% |
| GJENNOMFØRE | 14 | 29% |
| EVALUERE | 11 | 23% |
| ADMINISTRERE | 12 | 25% |

---

## 2. Spiller-fasematrise (portal, 48 sider)

### 2.1 PLANLEGGE — hvordan forberede en runde/økt/uke

Spilleren skal vite: *"Hva skal jeg gjøre framover, og hvordan forbereder jeg meg?"*

| # | Rute | Funksjon | Viktigste data | Heritage-ref |
|---|---|---|---|---|
| P-1 | `/portal` | Dashboard-hjem: next booking, ukes-mål, fokusområde | User, Booking, TrainingPlan, USI, CoachingForecast | `dashboard_mission_control` |
| P-2 | `/portal/treningsplan` | Ukes-/måneds-plan med øvelser | TrainingPlan, TrainingPlanWeek, TrainingPlanSession | `athlete_training_blueprint` |
| P-3 | `/portal/treningsplan/[id]` | Én plan-detalj | TrainingPlan + relations | (adapt) |
| P-4 | `/portal/bookinger` | Mine kommende og tidligere bookinger | Booking, Instructor | `athlete_my_bookings` |
| P-5 | `/portal/bookinger/ny` | Ny booking (wizard) | ServiceType, CoachingAvailability, Instructor | `booking_coach_selection` |
| P-6 | `/portal/bookinger/[id]` | Booking-detalj | Booking, CoachingSession | `booking_review_confirm` |
| P-7 | `/portal/bookinger/[id]/endre` | Reschedule | Booking, availability | `reschedule_booking` |
| P-8 | `/portal/turneringer` | Turneringer jeg spiller | Tournament, TournamentPrep | `tournament_list` |
| P-9 | `/portal/turneringer/[id]` | Turneringsforberedelse | TournamentPrep, PlayerTournamentPlan, CourseNotes | `tournament_detail` |
| P-10 | `/portal/mal` | Mine mål | Goal, GoalProgress | `analytics_goal_tracking` |
| P-11 | `/portal/kalender` | Min kalender (bookinger + økter) | Booking, TrainingLog | `sessions_calendar_view` |

### 2.2 GJENNOMFØRE — når spilleren er i aktivitet

Spilleren skal vite: *"Hva gjør jeg akkurat nå? Logging skal være rask og tvangsfri."*

| # | Rute | Funksjon | Viktigste data | Heritage-ref |
|---|---|---|---|---|
| G-1 | `/portal/runde/ny` | Start ny runde | Round (create), Course, Hole | `log_practice_diary` (adapt) |
| G-2 | `/portal/runde/[id]` | Live-logging per hull (score, skudd, SG) | Round, HoleResult, Shot | `coach_live_session` |
| G-3 | `/portal/runde/[id]/oppsummering` | Umiddelbart etter runde | Round, RoundStats, StrokesGained | `round_summary` |
| G-4 | `/portal/trackman/ny` | Start TrackMan-økt | TrackmanSession | `coach_live_session` (adapt) |
| G-5 | `/portal/trackman/[id]` | Live TrackMan-økt | TrackmanSession, TrackManShotData | (adapt) |
| G-6 | `/portal/dagbok` | Daglig dagbok (refleksjon, energi, fokus) | Journal, MentalLog | `log_practice_diary` |
| G-7 | `/portal/dagbok/ny` | Ny dagbok-post | Journal | (samme) |
| G-8 | `/portal/mental/ny` | Ny mental-økt (pre/post-shot) | MentalSession, MentalScorecardEntry | `mental_session` |
| G-9 | `/portal/mental/[id]` | Mental-økt-detalj | MentalSession | (adapt) |
| G-10 | `/portal/test/ny` | Fysisk test (20 standardtester) | TestDefinition, TestResult | `testing_physical` |
| G-11 | `/portal/test/[id]` | Test-resultat-detalj | TestResult | (adapt) |
| G-12 | `/portal/games/ny` | Start sosialt spill-session | GameSession, GamePlayer | `social_feed_community` (adapt) |
| G-13 | `/portal/games/[id]` | Live game-session | GameSession | (adapt) |
| G-14 | `/portal/økt/ny` | Ny trening (uten runde) | TrainingLog, TrainingLogExercise | `log_practice_diary` |

### 2.3 EVALUERE — refleksjon, trender, AI-innsikt

Spilleren skal vite: *"Hva har jeg gjort? Hva fungerer? Hva må jeg fikse?"*

| # | Rute | Funksjon | Viktigste data | Heritage-ref |
|---|---|---|---|---|
| E-1 | `/portal/statistikk` | SG-analyse, HCP-trend, utvikling | StrokesGained, RoundStats, PlayerMetrics, HandicapEntry | `analytics_strokes_gained` |
| E-2 | `/portal/statistikk/[segment]` | Per-segment (tee/approach/short/putting) | Shot, SkillMapping | (adapt) |
| E-3 | `/portal/kartlegging` | USI, kategori A-K, gap-analyse | UnifiedSkillIndex, UnifiedSkillSnapshot, CoachingForecast | `coach_player_view` |
| E-4 | `/portal/kartlegging/test-historikk` | Test-progresjon over tid | TestResult | (adapt) |
| E-5 | `/portal/kartlegging/treningsindex` | Treningstimer mot krav | TrainingLog, CategoryRequirement | (adapt) |
| E-6 | `/portal/analyse` | AI-innsikter per uke | AIInsight, AILearning | `analytics_ai_recap` |
| E-7 | `/portal/analyse/[id]` | Innsikt-detalj med handlingsforslag | AIInsight, Recommendation | (adapt) |
| E-8 | `/portal/benchmark` | Sammenligne mot norsk/alder-gruppe | NorwegianSkillBenchmark, TalentScore | `analytics_leaderboard` |
| E-9 | `/portal/sammenligning` | Sammenligne mine runder/økter | Round, RoundStats | (adapt) |
| E-10 | `/portal/strategi` | AI-generert strategi-oversikt | AIInsight, TrainingPrescription | `strategy_overview` |
| E-11 | `/portal/runder` | Historikk av alle runder | Round | `round_history` |

### 2.4 ADMINISTRERE — profil, abonnement, innstillinger

Spilleren skal vite: *"Hvem er jeg i systemet? Hva betaler jeg for? Hvordan får jeg varsler?"*

| # | Rute | Funksjon | Viktigste data | Heritage-ref |
|---|---|---|---|---|
| A-1 | `/portal/profil` | Min profil (navn, bilde, klubb, HCP-kilde) | User, UserGolfId, UserPreferences | `settings_profile` |
| A-2 | `/portal/profil/rediger` | Rediger profil | User | (samme) |
| A-3 | `/portal/abonnement` | Mitt abonnement, kvota, historikk | UserSubscription, TrainingSubscription, SubscriptionQuota | `settings_subscription` |
| A-4 | `/portal/abonnement/oppgrader` | Oppgrader plan | CoachingPackage, AppBundle | `pricing_upgrade` |
| A-5 | `/portal/apper` | Mine app-moduler | AppSubscription, AppModule, AppBundle | (adapt) |
| A-6 | `/portal/varsler` | Innstillinger for push/e-post/SMS | UserPreferences, PushSubscription | `settings_notifications` |
| A-7 | `/portal/bag` | Min golfbag (køller, avstander) | PlayerBag, PlayerClub, ClubDispersionData | `equipment_bag` |
| A-8 | `/portal/meldinger` | Chat med coach | Conversation, Message, UnifiedMessage | `coach_messages` |
| A-9 | `/portal/meldinger/[id]` | Én thread | Message | `inbox_main` |
| A-10 | `/portal/sosialt` | Venner, utfordringer, feed | Friendship, Challenge, FeedItem | `social_feed_community` |
| A-11 | `/portal/sosialt/venner` | Mine venner | Friendship | `friend_list` |
| A-12 | `/portal/betaling` | Betalingskort, fakturaer | PaymentTransaction, CustomerPaymentPreference | `billing_history` |

---

## 3. Coach / Admin-matrise (Mission Control, 23 sider)

Ikke spiller-fase. Grupperes etter MC-sidebar (`components/portal/mission-control/mc-nav-config.ts`):

| Gruppe | Sider | Hovedfunksjoner |
|---|---|---|
| **Hub** | `/admin`, `/admin/meldinger` | Dashboard, unified inbox |
| **Kalender & Booking** | `/admin/bookinger`, `/admin/kalender`, `/admin/tilgjengelighet` | Sessions, ledighet, reschedule |
| **Elever & Coaching** | `/admin/elever`, `/admin/elever/[id]`, `/admin/coaching-board`, `/admin/kartlegging` | Player-oversikt, Mission Board (priority signals), kartlegging |
| **Kommunikasjon** | `/admin/kommunikasjon`, `/admin/meldinger/[id]` | Chat, logs |
| **AI & Agenter** | `/admin/ai`, `/admin/agenter` | AI-oversikt, agent-konfig |
| **Analyse & Økonomi** | `/admin/analyse`, `/admin/finans`, `/admin/abonnement` | Performance, payments, subscriptions |
| **Fasiliteter** | `/admin/anlegg`, `/admin/anlegg/[id]` | Facility, range, simulator, bay |
| **System** | `/admin/team`, `/admin/team/kapabiliteter`, `/admin/innstillinger`, `/admin/audit` | Team, RBAC, audit log |

### Heritage-referanser per MC-område

| Admin-rute | Heritage-ref |
|---|---|
| `/admin` | `mission_control_command_center` |
| `/admin/coaching-board` | `coach_my_day`, `coach_my_players` |
| `/admin/elever` | `admin_player_management` |
| `/admin/elever/[id]` | `coach_player_view` |
| `/admin/team` | `team_setup`, `super_admin_dashboard` |
| `/admin/bookinger` | `sessions_calendar_view` |
| `/admin/meldinger` | `coach_messages`, `inbox_main` |

---

## 4. Marked (public, 17 sider)

Ikke spiller-fase. Konverteringsflate.

| Rute | Funksjon | Heritage-ref |
|---|---|---|
| `/` | Forside | `landing_homepage` (ekskludert — brukerens eget) |
| `/academy` | Academy-hjem | `landing_pricing` adapt |
| `/academy/abonnement` | Pakker | `landing_pricing` |
| `/junior-academy` | Junior-program | `landing_contact` adapt |
| `/utvikling` | Utviklingsløp | (adapt) |
| `/booking` | Public booking-wizard | `booking_coach_selection` |
| `/landing/pricing` | Pakker-side (alternativ) | `landing_pricing` |
| `/landing/contact` | Kontaktskjema | `landing_contact` |
| `/personvern` | Juridisk | `legal_pages` |
| `/auth/login` | Innlogging | `auth_sign_in_updated` |
| `/auth/signup` | Registrering | `auth_register_step_1..3` |
| `/auth/forgot-password` | Glemt passord | `auth_forgot_password_updated` |
| `/auth/callback`, `/auth/set-password`, `/auth/verify` | Auth-flyt | (del av auth-set) |
| `/403`, `/404`, `/500` | Error-sider | `error_*` |

---

## 5. Datamodeller — 112 Prisma-modeller, semantisk gruppert

### 5.1 Bruker & Auth (7)
User · Account · UserCapability · CapabilityChangeLog · UserPreferences · UserGolfId · VerificationToken

### 5.2 Coaching & Tjenester (11)
CoachingPackage · UserSubscription · TrainingSubscription · ServiceType · Instructor · InstructorAvailability · InstructorDateAvailability · InstructorFacilityDefault · AppBundle · AppModule · AppSubscription

### 5.3 Booking (11)
Booking · CoachingSession · BlockedTime · CoachingAvailability · PaymentTransaction · RecurringBooking · SubscriptionQuota · WaitlistEntry · GapOffer · PromoCode · PromoCodeUsage

### 5.4 Trening & Øvelser (7)
TrainingPlan · TrainingPlanWeek · TrainingPlanSession · TrainingLog · TrainingLogExercise · ExerciseDefinition · UserExerciseBank · ShotTypeLPhase

### 5.5 Spill & Turneringer (11)
Round · RoundStats · GameSession · GamePlayer · HoleResult · Shot · Course · Hole · PlayerBag · PlayerClub · Tournament

### 5.6 Turnering & Planning (3)
TournamentPrep · PlayerTournamentPlan · PeriodizationPeriod

### 5.7 TrackMan (6)
TrackmanSession · TrackManShotData · TrackManSessionAnalytics · TrackManImport · PlayerMetrics · MetricSnapshot

### 5.8 Mental (4)
MentalProfile · MentalScorecardEntry · CourseNotes · DegradationTracking

### 5.9 Statistikk & Benchmark (9)
UnifiedSkillIndex (USI) · UnifiedSkillSnapshot · NorwegianSkillBenchmark · TalentScore · HandicapEntry · ClubDispersionData · ScoreEstimate · SkillMapping · DataGolfApproachSkill + DataGolfCache

### 5.10 Treningsprognose & AI (2 + overlapp)
CoachingForecast · TrainingPrescription (+ USI og benchmark-modeller gjenbrukes)

### 5.11 AI & Coach Hub (5)
UnifiedMessage · AIResponse · AILearning · Agent · AgentConfig

### 5.12 Meldinger & Notifikasjoner (6)
Notification · PushSubscription · Message · Conversation · CommunicationLog · (UnifiedMessage — overlap)

### 5.13 Sosialt (3)
Friendship · Challenge · ChallengeParticipant

### 5.14 Fasiliteter (3)
Facility · FacilityActivity · Location

### 5.15 Admin & Tilgang (8)
UserCapability · CapabilityChangeLog · DashboardAccess · PricingRule · AdminTask · Session · CustomerPaymentPreference · Resource

### 5.16 Innhold (2)
ContentItem · EmailTemplate

### 5.17 E-post-sekvens (3)
EmailSequence · EmailSequenceStep · EmailSequenceExec

### 5.18 Integrasjon & Caching (4)
BundleItem · CategoryRequirement · ReferenceCourse · TestDefinition + TestResult

### 5.19 Mål (implisitt via Goal-lignende felt)
Goal · GoalProgress · Milestone (— sjekk schema for korrekte navn)

**Aktivt brukt (>10 refs):** User, Booking, CoachingSession, TrainingPlan, Round, UnifiedSkillIndex, TrackmanSession, Instructor, CoachingPackage
**Lav bruksfrekvens (kandidater for arkivering):** BundleItem, DegradationTracking, AdminTask, ShotTypeLPhase

---

## 6. `lib/portal/` — forretningslogikk

| Modul | Filer | Hovedformål |
|---|---|---|
| `booking/` | 11 | Slot-gen, konfliktsjekk, cancellation, refund, waitlist, quota |
| `capabilities/` | 5 | RBAC: `requireCapability()`, `requireSensitiveAuth()`, catalog, presets |
| `coaching-signals/` | 3 | Coach Mission Board-signaler (stagnasjon, regresjon, trend) |
| `usi/` | 6 | Unified Skill Index, ONNX-inferens, Kalman-filter, prescription |
| `trackman/` | 2 | CSV/API-import, AI-insights fra slagdata |
| `datagolf/` | 1 | API-wrapper + caching |
| `kartlegging/` | 6 | Spillerprofil, coach-access, training-index, test-history |
| `training/` | 3 | L-fase klassifikasjon, degradation-service |
| `ai/` | 9 | Anthropic-anrop: weekly-insights, weakness, focus, plan-gen, drill-gen, audio-transkribering |
| `golf/` | 15 | SG-calc, expected-strokes, dispersion, AK-formula, GolfBox-HCP, GPS |
| `notion/` | 5 | Synk drills, planer, profiler, innhold, brand-guide |
| `google-calendar/` | 2 | Synk + webhook |
| `email/` | — | React Email-templates |
| `sms/` | 2 | Twilio-client + reminder-sending |
| `calendar/` | 2 | iCal + Google wrappers |
| `facility/` | 2 | Defaults + konfliktsjekk |
| `preferences/` | 1 | Oppdater UserPreferences |
| `sync/` | 6 | TanStack Query + Zustand + optimistiske oppdateringer |
| Rot | 8 | `prisma.ts`, `access.ts`, `rbac.ts`, `auth.ts`, `stripe.ts`, `notifications.ts`, `slots.ts`, `tier-utils.ts` |

---

## 7. Integrasjoner, CRON, webhooks, MCP

### 7.1 Eksterne integrasjoner (10)

| Integrasjon | Status | Brukes i | Env-vars |
|---|---|---|---|
| Stripe | AKTIV | `lib/portal/stripe.ts`, booking-flyt, webhooks | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Supabase | AKTIV | `lib/supabase/`, auth, DB | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Anthropic Claude | AKTIV | `lib/portal/ai/*` | `ANTHROPIC_API_KEY` |
| Notion | AKTIV | `lib/portal/notion/*` | `NOTION_API_KEY`, `NOTION_DB_*` (5 databaser) |
| DataGolf | AKTIV | `lib/portal/datagolf/` | `DATAGOLF_API_KEY` |
| TrackMan | AKTIV | `lib/portal/trackman/*` | Ingen direkte (legacy proxy) |
| Google Calendar | AKTIV | `lib/portal/google-calendar/*` | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Resend | AKTIV | `lib/portal/email/` | `RESEND_API_KEY` |
| Twilio | AKTIV | `lib/portal/sms/` | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| GolfBox | DELVIS | `lib/portal/golf/golfbox/handicap.ts` | Ingen — legacy, kun HCP-sync |

### 7.2 CRON-jobs (21 stk, fra `vercel.json`)

| # | Endpoint | Schedule | Formål |
|---|---|---|---|
| 1 | `/api/portal/cron/send-reminders` | `0 * * * *` | Booking-påminnelser (email) |
| 2 | `/api/cron/send-reminders` | `0 8 * * *` | Dagsreminders kl 08 UTC |
| 3 | `/api/cron/cleanup-notifications` | `0 2 * * 0` | Slett gamle notifikasjoner |
| 4 | `/api/portal/cron/reset-monthly-sessions` | `5 0 * * *` | Reset kvota for abonnenter |
| 5 | `/api/portal/cron/session-expiry-reminder` | `0 9 * * *` | Reminder om utløpende sessions |
| 6 | `/api/portal/cron/weekly-summary` | `0 18 * * 0` | Ukessammendrag (email) |
| 7 | `/api/portal/cron/win-back` | `0 9 * * *` | Win-back til inaktive |
| 8 | `/api/portal/cron/welcome-sequence` | `0 10 * * *` | Onboarding |
| 9 | `/api/portal/cron/abandoned-checkout` | `0 12 * * *` | Forlatt booking |
| 10 | `/api/portal/cron/ai-insights` | `0 6 * * 1` | Weekly AI-innsikt (Anthropic) |
| 11 | `/api/portal/cron/compute-usi` | `0 3 * * *` | USI-snapshot for aktive spillere |
| 12 | `/api/portal/cron/auto-adjust-training-plans` | `30 3 * * *` | AI-justering av planer |
| 13 | `/api/cron/coaching-forecast-backtest` | `0 4 * * *` | Backtest forecast-modell |
| 14 | `/api/cron/cleanup-pending-bookings` | `*/15 * * * *` | Timeout-bookinger |
| 15 | `/api/cron/release-dropin-slots` | `0 6 * * *` | Frigjør drop-in |
| 16 | `/api/cron/smart-notifications` | `*/30 * * * *` | Intelligente varsler |
| 17 | `/api/cron/charge-completed` | `0 * * * *` | Charge fullførte bookinger |
| 18 | `/api/cron/mark-no-shows` | `30 * * * *` | Mark no-show |
| 19 | `/api/cron/sync-google-calendars` | `0 * * * *` | Sync Google Calendar |
| 20 | `/api/cron/cleanup-waitlist` | `0 */6 * * *` | Cleanup waitlist |
| 21 | `/api/portal/tournament-planner/sync` | `0 2 * * *` | Sync turneringsdata |

**Ekstra (ikke i vercel.json):** `/api/portal/cron/sync-notion` (kjøres ved behov, ikke scheduled).

### 7.3 Webhooks (4)

| Webhook | Endpoint | Events | Formål |
|---|---|---|---|
| Stripe | `/api/portal/webhooks/stripe` | subscription.*, charge.*, invoice.* | Oppdaterer subscription/quota/notifications |
| Google Calendar | `/api/portal/calendar/google/webhook` | push-notifikasjoner | Trigger re-sync |
| Notion (polling) | `/api/portal/cron/sync-notion` | N/A | Sync drills/planer/innhold |
| Tournament (polling) | `/api/portal/tournament-planner/sync` | N/A | Sync turneringsdata |

### 7.4 MCP-verktøy (25)

**Server:** `mcp-server/` (stdio + HTTP:3100). Drill-, Player-, Session-, TrackMan-, Voice-, Training-, Test-, Breaking-Points-domener.

Verktøy (gruppert):
- **Drill** (7): `ak_drill_create`, `ak_drill_search`, `ak_drill_approve`, `ak_drill_stats`, `ak_drill_suggest`, `ak_drill_import_batch`, `ak_drill_coverage_gaps`
- **Player** (3): `ak_player_create`, `ak_player_get`, `ak_player_list`
- **Session** (2): `ak_session_log`, `ak_session_history`
- **TrackMan** (2): `ak_trackman_log`, `ak_trackman_analyze`
- **Voice** (2): `ak_voice_save`, `ak_voice_search`
- **Training** (3): `ak_training_analyze`, `ak_training_plan_save`, `ak_training_plan_get`
- **Test** (3): `ak_test_log`, `ak_test_compare`, `ak_test_history`
- **Breaking Points** (3): `ak_bp_log`, `ak_bp_history`, `ak_bp_progression`

**Resources (4):** `ak://reference/formula`, `/distributions`, `/hours`, `/invariants`.
**Prompts (4):** `ak_weekly_plan`, `ak_player_assessment`, `ak_build_drill_library`, `ak_session_debrief`.

### 7.5 Scripts (16, alle manuelle)

| Script | Formål |
|---|---|
| `create-coaching-products.ts` | Opprett coaching-pakker i Stripe |
| `create-stripe-products.ts` | AppModule-produkter i Stripe |
| `diagnose-stripe-webhook.ts` | Debug webhook-secret |
| `generate-portal-mockups.ts` | Screenshots av mockups |
| `list-golfbox-schedules.ts` | Debug GolfBox-schedule |
| `pre-deploy-check.ts` | Pre-deploy sjekkliste |
| `reset-password-and-add-availability.ts` | Reset + avail (engangs) |
| `run-tournament-sync-now.ts` | Trigger tournament-sync manuelt |
| `seed-coaching-availability.ts` | Seed i dev |
| `seed-coaching-packages.ts` | Seed i dev |
| `set-user-password.ts` | Set passord |
| `test-trackman-ai.ts` | Integration test |
| `verify-stripe.ts` | Verifiser Stripe-config |
| `backup-before-launch.sh` | DB-backup |
| `migrate-to-heritage.sh` | Design token-migrering (arkivert) |
| `setup.sh` | Initial setup |

---

## 8. Gap-analyse

### 8.1 Modeller uten åpenbar UI (kandidater for audit)

| Modell | Status | Handling |
|---|---|---|
| `DegradationTracking` | Referert sporadisk i training-service | Flagg — vurder å eksponere i `/portal/kartlegging` eller arkiver |
| `ShotTypeLPhase` | Intern config | OK — ingen UI nødvendig |
| `AdminTask` | Ingen MC-side | Flagg — enten bygg UI eller arkiver |
| `BundleItem` | Kun relasjons-tabell | OK |
| `AILearning` | Skrives av AI-cron, ingen UI | Flagg — bør synliggjøres i `/admin/ai` |
| `DashboardAccess` | Ikke sett i kode-søk | Flagg — verifiser om bruk |
| `MetricSnapshot` | CRON skriver, men ingen graf-UI vises | Potensial — bør vises i `/portal/statistikk` |
| `NorwegianSkillBenchmark` | Unik konkurransefordel, vist i `/portal/benchmark` | OK men prioriter UI-polish |
| `TalentScore` | CRON-beregnet | Verifisér at `/portal/kartlegging` viser dette |

### 8.2 Antatt manglende UI / funksjoner (forslag)

- **Mission Board-signaler:** `lib/portal/coaching-signals/compute.ts` beregnes — vis eksplisitt på `/admin/coaching-board`.
- **Forecast CI95:** `CoachingForecast` har 30 felter inkl. konfidensintervall — sjekk om vi viser CI på `/portal/kartlegging`.
- **Agent-konfigurasjon (Agent + AgentConfig):** `/admin/agenter` eksisterer, men verifiser at bruker kan aktivere/deaktivere agenter.
- **Dagbok-streak / konsistens:** `Journal`-data er der, men streak-visualisering mangler på dashboard.
- **Waitlist UI:** `WaitlistEntry` + `GapOffer` — bruker må kunne se venteliste-status.
- **Mental-profil baseline:** `MentalProfile` setter trykktoleranse — spør vi denne ved onboarding?

### 8.3 Funksjoner som kan flyttes mellom faser

| Fra | Til | Side |
|---|---|---|
| ADMINISTRERE | EVALUERE | `/portal/sosialt` (benchmarking mot venner gir innsikt) |
| EVALUERE | PLANLEGGE | `/portal/analyse` bør foreslå neste økt (lukker loopen) |
| GJENNOMFØRE | EVALUERE | `/portal/runde/[id]/oppsummering` vises per nå som GJENNOMFØRE — vurder overgang til EVALUERE etter 24t |

### 8.4 Dead code-kandidater

- **Gamle dashboard-views** (`FocusTodayView`, `DataRichView`, `ProgressStoryView`, `CommandCenterView`) — arkivert i `_archived/pre-heritage-2026-04-19/`
- **CourseHero / GlassPanel / GlassButton / HeroLabel / FloatingTopbar / AIAttribution / SlimIconRail** — brukes fortsatt i statistikk-visning (ikke-Heritage). Rewrite-kandidater.
- **`sync-notion` cron** — finnes, men ikke registrert i `vercel.json`. Enten registrer eller slett.
- **Inter font-import** — hvis noen fil fortsatt importerer, fjern.
- **Lucide-import-rester** — ca. 95 filer har fortsatt `import ... from "lucide-react"` uten JSX-bruk (se `HERITAGE_MIGRATION_STATUS.md`).

---

## 9. Anbefalt Sprint-rekkefølge

Basert på denne kartleggingen — før nye sider bygges, bør rewrites prioriteres i denne rekkefølgen:

| Sprint | Fokus | Sider | Begrunnelse |
|---|---|---|---|
| **A. EVALUERE-kjerne** | `/portal`, `/portal/statistikk`, `/portal/kartlegging` | 3 sider | Dette er daglige touchpoints. Gap mellom data og UI er størst her. |
| **B. PLANLEGGE-kjerne** | `/portal/treningsplan`, `/portal/bookinger/*` | 5 sider | Bruker kommer hit for å handle — konverteringsflate. |
| **C. GJENNOMFØRE-flyt** | `/portal/runde/*`, `/portal/dagbok` | 4 sider | Rask, tvangsfri logging gir mer data inn til EVALUERE. |
| **D. Mission Board** | `/admin`, `/admin/coaching-board`, `/admin/elever/*` | 5 sider | Coach-opplevelsen driver intern effektivitet. |
| **E. Booking-flyt (public + portal)** | `/booking`, `/portal/bookinger/ny` | 6 sider (wizard) | Stripe-konverteringskritisk. |
| **F. Landing + Auth** | `/`, `/academy`, `/auth/*` | 10+ sider | Merkevare-uttrykk før Heritage-launch. |
| **G. Rest** | Alt annet | Batch-rewrites med felleskomponenter. |

**Dette er input til BACKLOG.md sprintstrukturen — bruk dette kartet som rasjonale.**

---

## 10. Verifikasjon av kartet

Test om dette dokumentet holder mål — kan du svare på alle disse uten å åpne kode?

- [x] "Hva ser en spiller dagen før en runde?" → seksjon 2.1 (PLANLEGGE)
- [x] "Hvilke data viser vi under en live-runde?" → seksjon 2.2 G-2
- [x] "Hvor ser spilleren USI-utvikling over tid?" → seksjon 2.3 E-3
- [x] "Hvor oppdateres USI fra TrackMan?" → seksjon 7.2 CRON #11
- [x] "Hvilke Prisma-modeller har ingen UI?" → seksjon 8.1
- [x] "Hva skjer når Stripe sender en webhook?" → seksjon 7.3
- [x] "Hvor mange sider har vi totalt?" → seksjon 1 (98)

**Dokumentet skal oppdateres hver gang:**
- Ny side legges til under `app/`
- Ny Prisma-modell legges til
- Ny CRON registreres i `vercel.json`
- Ny ekstern integrasjon tas i bruk
- Ny MCP-verktøy eksponeres

---

**Neste steg:** Bruk seksjon 9 til å prioritere Sprint A-G i `BACKLOG.md`. Start med Sprint A (EVALUERE-kjerne).
