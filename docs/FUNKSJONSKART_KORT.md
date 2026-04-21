# Funksjonskart — AK Golf Platform (Kortversjon)

> Oppdatert: 2026-04-21  
> Full versjon: `FUNKSJONSKART_AKGOLF_PLATFORM.md` (40 KB)

---

## Oversikt

| Kategori | Antall |
|---|---|
| UI-skjermer (page.tsx) | 90 |
| API-endepunkter | 140+ |
| Prisma-modeller | 112 |
| CRON-jobs | 21 |
| Eksterne integrasjoner | 10 |

---

## Sprint-status

| Sprint | Gruppe | Skjermer | Status |
|---|---|---|---|
| **A** | Spillerportal kjerne | 10 | ✅ Done |
| **B** | Mission Control kjerne | 7 | ✅ Done |
| **C** | Booking-system | 7 | ✅ Done |
| **D** | Landingpages | 7 | ✅ Done |
| **E** | Sekundær portal | 19 | ✅ Done |
| **F** | Sekundær MC | 17 | ✅ Done |
| **G** | Auth + Error | 6 | ✅ Done |
| **Totalt** | | **73** | **✅ All done** |

---

## Funksjonelle grupper

| # | Gruppe | Skjermer | Kjerne-funksjon |
|---|---|---|---|
| 1 | **Booking & Betaling** | `/booking/*`, `/portal/bookinger/*`, `/admin/bookinger`, `/admin/kalender` | Booke, betale (Stripe), reschedule, refundere |
| 2 | **Treningsplan & Logging** | `/portal/treningsplan`, `/portal/dagbok`, `/admin/treningsplan` | 12-ukers plan, drag-drop, daglig logging, AI-justering |
| 3 | **Spill & Runde** | `/portal/runde/*`, `/portal/trackman`, `/portal/tester`, `/portal/spill` | Live scorecard, SG, TrackMan, tester, mental |
| 4 | **Analyse & Evaluering** | `/portal/statistikk`, `/portal/kartlegging`, `/portal/analyse`, `/portal/benchmark` | SG-analyse, HCP-trend, USI, AI-innsikter |
| 5 | **Coaching & Kommunikasjon** | `/portal/coaching-historikk`, `/portal/meldinger`, `/portal/ai-coach`, `/admin/meldinger` | Chat, AI-oppsummering, epost-sekvenser |
| 6 | **Admin & Mission Control** | `/admin/*` | Elevadmin, RBAC, analytics, fasiliteter |
| 7 | **Marked & Konvertering** | `/`, `/academy/*`, `/junior-academy`, `/landing/*` | Landingssider, SEO, Stripe checkout |

---

## Kritiske blockere

| # | Problem | Status | Påvirkning |
|---|---|---|---|
| **B1** | `npm run build` feiler på `/landing/contact` og `/admin/treningsplan/ny` (React 19 SSG `useContext`) | 🔴 Åpen | Blokkerer go-live |
| **B4** | `app/setup-admin/page.tsx` eksponerer admin-setup med hardkodet passord | 🔴 Åpen | Sikkerhetsrisiko — må slettes før prod |

---

## Gjenstående arbeid (ikke-blockerende)

- **45 lint-warnings** (ubrukte vars)
- **95 Lucide-import-rester** (ref/prop-bruk, ikke visuelt)
- **900+ `grey-*` aliaser** (fungerer, men forvirrende)
- **Real-time Mission Board** — ingen SSE/WebSocket ennå
- **Waitlist UI** — DB-modell finnes, ingen skjerm
- **Kalibrering av auto-plan-justering** — terskler ikke verifisert mot ekte data

---

## Nøkkel-data-modeller

| Domene | Modeller |
|---|---|
| Bruker & Auth | User, Account, UserPreferences, UserCapability |
| Booking | Booking, CoachingSession, PaymentTransaction, ServiceType |
| Trening | TrainingPlan, TrainingLog, ExerciseDefinition |
| Spill | Round, HoleResult, Shot, Course |
| TrackMan | TrackmanSession, TrackManShotData, TrackManSessionAnalytics |
| Statistikk | UnifiedSkillIndex, StrokesGained, RoundStats, HandicapEntry |
| Coaching | CoachingForecast, TrainingPrescription, CoachingSession |
| AI | AIResponse, AILearning, Agent, AgentConfig |
| Kommunikasjon | Conversation, Message, Notification, PushSubscription |
| Admin | UserCapability, CapabilityChangeLog, DashboardAccess |

---

## Integrasjoner

| Tjeneste | Status | Brukes til |
|---|---|---|
| Stripe | ✅ Aktiv | Betaling, abonnement, refusjon |
| Supabase | ✅ Aktiv | Auth, database, RLS |
| Anthropic Claude | ✅ Aktiv | AI-innsikter, coaching-oppsummering, plan-generering |
| Notion | ✅ Aktiv | Synk drills, planer, profiler |
| DataGolf | ✅ Aktiv | Benchmark-data, expected strokes |
| Google Calendar | ✅ Aktiv | Kalender-sync for coach |
| Resend | ✅ Aktiv | E-postutsendelser |
| Twilio | ✅ Aktiv | SMS-påminnelser |
| TrackMan | ✅ Aktiv | Slagdata-import, AI-analyse |
| GolfBox | ⚠️ Delvis | HCP-sync (legacy) |
