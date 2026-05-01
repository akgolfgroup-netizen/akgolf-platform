# Funksjons-oversikt — AK Golf Platform

**Dato:** 2026-05-01
**Mal:** En enkel beskrivelse av alt som finnes i prosjektet, slik at Anders kan se hva platformen kan og hvor.

## Stor-tall

- **156** sider/ruter (app/page.tsx-filer)
- **770** komponenter (components/*.tsx)
- **255** forretningslogikk-filer (lib/*.ts)
- **199** API-endepunkter
- **135** Prisma-modeller (databasetabeller)
- **15** automatiske agenter
- **23** cron-jobber

---

# 1. MARKEDSSIDEN (offentlig — uten innlogging)

## 1.1 Forsiden (`/`)
Hovedlandingsside med hero, "How it works", spiller-profiler, team, CTA. To versjoner via cookie/query: V2 (default, Brand Guide V2.0) og V1 (legacy, fortsatt operativ).

## 1.2 Academy (`/academy`)
Markedsside for AK Golf Academy — voksne treningsabonnement. Hero, AK-metoden (5 nivaer), coach-presentasjon, FAQ, CTA.

## 1.3 Junior Academy (`/junior-academy`)
Markedsside for juniorer 6–17 ar. Tre aldersgrupper: Mini (6–9), Basis/Utvikling (10–13), Elite (14–17). Hero, aldersgrupper, foreldre-info, sesong, coach, FAQ.

## 1.4 Pricing (`/pricing`, `/landing/pricing`)
Pris-landingsside. Tre Performance-pakker (Markus / Anders / Pro), drop-in-tjenester, add-ons (banecoaching, korthullsbane), bedrift-band, FAQ, CTA.

## 1.5 Kontakt (`/kontakt`)
Hero, 4 quick-tiles (e-post, Anders telefon, Markus telefon, Instagram), skjema, lokasjons-kort for Gamle Fredrikstad GK, FAQ.

## 1.6 Booking (`/booking`, `/booking-v2`)
Booking-flyt — velg tjeneste, velg dato/tid, kundedetaljer, betal med Stripe. V2 er pixel-rebuilt etter Brand Guide V2.0.

## 1.7 Vedlikeholds-side (`/maintenance`)
Vises nar `MAINTENANCE_MODE=true`. Inneholder Acuity-CTAer (Anders + Markus + alle ledige tider). Bypass via `?bypass=<key>`.

## 1.8 Andre offentlige sider
- `/landing` — alternativ landingsside med flere seksjoner
- `/landing/about`, `/landing/contact` — under-sider
- `/403`, `/500`, error.tsx — feilhandtering

---

# 2. SPILLERPORTAL (PlayerHQ — innloggede spillere)

Tilgang etter login via `/portal/login`. RBAC: `requirePortalUser()`.

## 2.1 Dashboard (`/portal`)
Hovedoversikt med Bento-grid: Hero (greeting + 4 stats), neste okt, KPI (Handicap, Runder 30d, SG Total, Streak), SG-fordeling (Tee/Approach/Around-green/Putting), trend-graf, AI-innsikt, streak-card, hurtighandlinger.

## 2.2 Statistikk (`/portal/statistikk`)
Pixel-rebuilt mot Brand Guide V2.0 mockups. Hero benchmark, 4 KPI-rad, fokus-callout, SG-fordeling, HCP-trend (12 mnd), peer-sammenligning, AK-pyramide A–K, runde-tabell. Periode-velger (30d/90d/sesong/1y).

## 2.3 Bookinger (`/portal/bookinger`)
Mine bookinger — kommende, neste, tidligere. Avbestillingsregler, waitlist-administrasjon. Detaljside per booking med reschedule + cancel.

## 2.4 Booking ny (`/portal/bookinger/ny`)
Booking-wizard fra portalen (samme som offentlig, men forhandsfylt med spillerens info).

## 2.5 Treningsplan (`/portal/treningsplan`)
12-ukers AI-generert treningsplan. Uke-oversikt (`/uke`), per-okt-detalj (`[sessionId]`), foreslag fra coach. V2-versjon under bygging (`/v2`).

## 2.6 Min plan (`/portal/min-plan`)
Forenklet visning av aktiv plan med utforing per dag.

## 2.7 Dagbok / Trening (`/portal/dagbok`, `/portal/trening`)
Logg fullforte okter (varighet, fokus, intensitet). Tilkoblet TrainingLog-modellen.

## 2.8 Runde (`/portal/runde`)
Live shot-logging pa banen (UpGame Pro-stil). Start runde, log slag-for-slag (kolle, lie, distanse, fra-til), real-time SG-beregning. Pause/resume via RoundLiveState. Mapbox-baneguide bygget av Kimi (i pagaende arbeid).

## 2.9 Tester (`/portal/tester`, `/portal/kartlegging`)
Spilleren kan utfore 20 fastsatte AK-tester (TrackMan/Short-Game/Putting/Physical/Mental). Inputs valideres, beregnes mot kategori-krav (A–K). Resultat-side med pass/fail + trend.

## 2.10 TrackMan (`/portal/trackman`)
Visualisering av TrackMan-data — spredning per kolle, snitt-tall, trend over tid. Charts dynamic-loaded for perf. V2 under bygging.

## 2.11 Bag (`/portal/bag`)
Spillerens 14 koller med distanser. ClubInBag-tabell — loft, shaft, snitt-carry, total.

## 2.12 Mental (`/portal/mental`)
Mental-profil + scorecard-entries — fokus, selvtillit, press-toleranse, aksept. Trend over tid.

## 2.13 Strategi (`/portal/strategi`)
DECADE-protokollen — beslutningsstotte, pre-shot rutiner, course management.

## 2.14 Analyse / Benchmark / Sammenligning
- `/portal/analyse` — AI-analyse av spill og trening
- `/portal/benchmark` — sammenligning mot peer-pool og PGA Tour (DataGolf-data)
- `/portal/sammenligning` — peer-radar, A–K-pyramide

## 2.15 AI-coach (`/portal/ai-coach`)
Chat med AI-trener. Bruker Anthropic Claude. Spor om sving, plan, motivasjon.

## 2.16 Coaching-historikk (`/portal/coaching-historikk`)
Liste over alle coaching-okter med trener — notater, video, oppfolging.

## 2.17 Kalender / Timeplan (`/portal/kalender`, `/portal/timeplan`)
Egen kalender med okter, bookinger, treningsplan-events. Eksport til Google/Apple.

## 2.18 Meldinger (`/portal/meldinger`)
Chat med trener og foreldre. UnifiedMessage-modellen.

## 2.19 Sosialt (`/portal/sosialt`)
Venner-system. Friend-requests, leaderboards mot venner.

## 2.20 Turneringer / Turneringsplan (`/portal/turneringer`, `/portal/turneringsplan`)
Kommende turneringer med forberedelse-kort, prep-okter, malsetting per turnering.

## 2.21 Profil (`/portal/profil`)
Profil-innstillinger, handicap-historikk, mal, achievements.

## 2.22 Foreldre (`/portal/foreldre`)
Foreldre-portal for juniorer — se barnet sin progresjon, godkjenne bookinger.

## 2.23 Talent (`/portal/talent`)
Talent-tracking for elitespiller. WAGR-rangering, college-soknader.

## 2.24 Apper / Abonnement (`/portal/apper`, `/portal/abonnement`)
- Apper: oversikt over moduler (Mental, TrackMan, Talent osv.) med abo-status
- Abonnement: Stripe-administrasjon, oppgrader/nedgrader

## 2.25 Onboarding (`/portal/onboarding`)
Forste-gang-flyt for nye spillere. Spor om HCP, mal, hjemmebane.

## 2.26 Spill / PlayerHQ (`/portal/spill`, `/portal/playerhq`)
Spill-modus med leaderboards og challenges.

---

# 3. CoachHQ (admin — for trenere/staff)

Tilgang via `/admin/login`. RBAC: `canAccessMissionControl()`.

## 3.1 Hub-oversikt (`/admin` eller `/admin/hub`)
Hub-dashboard — greeting, 4 hub-stats (aktive spillere, ukens okter, belegg, MTD-inntekt), 8 modul-kort med dynamiske badges, aktivitet-feed siste 24t, hurtig-handlinger.

## 3.2 Dagens fokus (`/admin`-startside)
3 signaler (urgent / attention / opportunity), 5 KPI-strip, dagens timeline, oppgaver, hurtigvalg. Real data fra DegradationTracking + PaymentTransaction.

## 3.3 Coaching board (`/admin/coaching-board`)
Kanban-style oversikt over aktive okter — status, fokus, neste-steg per spiller.

## 3.4 Mission Board (`/admin/mission-board`)
Oppdrag og mal per spiller — strategiske initiativer.

## 3.5 Spillere (`/admin/elever`)
3-panel arbeidsflate: spillerliste til venstre (gruppert i I dag/Denne uken/Oppfolging), 4 KPI-rad pa toppen, full Spillerprofil 360 i hovedfeltet nar elev valgt via `?id=`. EleverClientV2 er den siste versjonen.

## 3.6 Spillerprofil 360 (`/admin/elever/[id]/v2`)
9 datagrupper per spiller: Identitet, Golf, Coaching, Trening, Mental + Forecast, Tester, Okonomi, Signaler. Hentes via `getStudent360()`.

## 3.7 Tester per spiller (`/admin/elever/[id]/tester`)
Coach-tracking av 20 fastsatte tester. Status (utfort/skyldig/forfalt) per test, gruppert per kategori.

## 3.8 Bookinger (`/admin/bookinger`)
Liste over alle bookinger. Filtrer pa status, dato, instructor, lokasjon. Detaljside med reschedule/cancel.

## 3.9 Kalender / Tilgjengelighet / Kapasitet
- `/admin/kalender` — uke-/maneds-visning av alle okter
- `/admin/tilgjengelighet` — sett opp ukentlig tilgjengelighet
- `/admin/kapasitet` — utilization-charts per dag/uke
- `/admin/denne-uken` — fokusert visning av kommende uke

## 3.10 Tjenester (`/admin/tjenester`)
ServiceType-administrasjon — pris, varighet, max-kapasitet, hvilken kolle/omrade. Sync mot Stripe.

## 3.11 Okter (`/admin/okter`)
Oversikt over coaching-sesjoner. Notater, video, AI-sammendrag, godkjenning.

## 3.12 Grupper / Team (`/admin/grupper`, `/admin/team`)
TrainingGroup-administrasjon (gruppetreninger, juniorer). Team-medlemmer (coaches) med roller og kapabiliteter.

## 3.13 Library (`/admin/library`)
Ovelses-bibliotek — alle godkjente drills med video, beskrivelse, pyramide-kategori, l-fase, etc.

## 3.14 Lokasjoner / Fasiliteter (`/admin/lokasjoner`, `/admin/fasiliteter`)
Anlegg-administrasjon — Driving Range, Performance Studio, Putting Green, Short Game Area. Booking-kart med kapasitets-fargekoding.

## 3.15 Baner (`/admin/baner`)
Course-administrasjon — Hole-data (par, lengde, GPS), strategy-overlay, geojson.

## 3.16 Rapporter (`/admin/rapporter`)
Eksport-rapporter — coach-effekt 12mnd, snitt-HCP-utvikling, manedlig PDF for styret.

## 3.17 Okonomi (`/admin/okonomi`)
Stripe-MRR, AppSubscription-aggregat, Booking-inntekt. Forfalte fakturaer, refusjoner.

## 3.18 Godkjenninger (`/admin/godkjenninger`)
Pending bookinger, refusjoner, plan-endringer som krever coachens godkjenning.

## 3.19 Notifications / Push-varsler (`/admin/notifications`, `/admin/push-varsler`)
Push-varsel-templates, manuell sending til en spiller eller en kohort.

## 3.20 E-postmaler (`/admin/e-postmaler`)
EmailTemplate-administrasjon — velkomst, faktura, paminnelse, avsluttning.

## 3.21 AI-assistent (`/admin/ai-assistent`)
Coach kan spor AI om hvilke spillere som trenger oppfolging, lage planer, generere ovelser.

## 3.22 Agenter (`/admin/agenter`)
Logger fra alle 15 agenter — kjore-status, varighet, output, feilmeldinger.

## 3.23 Analytics (`/admin/analytics`)
Dashboard med KPI-er over tid. Coach-effekt, NPS, MRR-trend.

## 3.24 Treningsplan (`/admin/treningsplan`)
Coach-versjon av treningsplan-bygger. Drag-drop, mal-bibliotek, pyramidedistribusjon.

## 3.25 Turneringer (`/admin/turneringer`)
Tournament-administrasjon. PlayerTournamentPlan + TournamentPrep — forberedelse per spiller.

## 3.26 Talent (`/admin/talent`)
TalentPlayer-administrasjon. TalentScore, TournamentResult, college-tracking.

## 3.27 Meldinger (`/admin/meldinger`)
Meldinger-administrasjon. Coach kan sende kringkast til kohorter.

## 3.28 Teknisk plan (`/admin/teknisk-plan`)
Teknisk roadmap, IT-status, integrasjon-helse.

## 3.29 Focus (`/admin/focus`)
Fokus-modus for coachen — vise kun det som krever handling i dag.

---

# 4. AUTOMATISKE AGENTER (15 stk)

Kjorer enten via cron eller ved hendelser. Logger til AgentLog.

| Agent | Trigger | Hva |
|---|---|---|
| **birthday** | Cron (daglig 08:00) | Sender bursdagshilsen til spillere |
| **booking-confirm** | Hendelse | Sender bekreftelses-e-post nar booking opprettes |
| **cancellation** | Hendelse | Beregner refund + gjennomforer Stripe-refund/credit-note |
| **coach-payout** | Cron (manedlig) | Kalkulerer manedlig payout til trenere |
| **degradation-flag** | Hendelse | Flagger spillere som taper terreng pa metric-snapshots |
| **dunning** | Cron (daglig 10:00) | Sender betalings-paminnelser for forfalte fakturaer |
| **no-show** | Cron (hver 15 min) | Markerer bookinger som NO_SHOW etter 15 min uten check-in |
| **onboarding** | Hendelse | Sender velkomst-sekvens til nye spillere |
| **payment-collect** | Hendelse | Trekker fra kort eller sender faktura for fullforte Flex-okter |
| **sponsor-report** | Cron (manedlig) | Genererer sponsor-rapport per Sponsor + SponsorPlayerRelation |
| **test-retest-reminder** | Cron (daglig 06:00) | Pusher Notification for tester forfalt for retest (>56d) |
| **winback** | Cron (daglig 09:30) | Sender vinn-tilbake-melding til inaktive 21+ dager |
| **park** | Hendelse | "Parkerer" en spiller midlertidig |

Plus: `runner.ts` (sentral dispatcher) + `log.ts` (logger til AgentLog) + `types.ts` (AGENT_REGISTRY).

---

# 5. CRON-JOBBER (23 stk)

Vercel Cron — registrert i `vercel.json`.

| Cron | Schedule | Hva |
|---|---|---|
| send-reminders | Hver time | Sender okt-paminnelser |
| reset-monthly-sessions | Daglig 00:05 | Resetter SubscriptionQuota for ny maned |
| reconcile-stripe-bookings | Hver 30 min | Synker PENDING-bookinger mot Stripe |
| session-expiry-reminder | Daglig 09:00 | Varsler spillere om utlopende okter |
| weekly-summary | Sondag 18:00 | Ukerapport til alle |
| win-back / agents-winback | Daglig 09-09:30 | Inaktive-paminnelse |
| welcome-sequence | Daglig 10:00 | Velkomst-e-post sekvens |
| abandoned-checkout | Daglig 12:00 | Pamniner ufullfortede checkout-er |
| ai-insights | Manedlig | Personlige AI-innsikter |
| compute-usi | Daglig 03:00 | Beregner UnifiedSkillIndex per spiller |
| auto-adjust-training-plans | Daglig 03:30 | Justerer treningsplaner basert pa progresjon |
| process-coaching-audio | Hver 15 min | Transkriberer + sammendrag av coaching-opptak |
| training-reminders | Morgen + kveld | Treningspaminnelser |
| agents-no-show | Hver 15 min | No-show-marker |
| agents-dunning | Daglig 10:00 | Dunning-paminnelser |
| agents-birthday | Daglig 08:00 | Bursdagshilsener |
| agents-sponsor-report | Manedlig 1. dag | Sponsor-rapport |
| datagolf-sync | Daglig 04:00 | Henter PGA Tour benchmark-data |
| calendar-webhook-renew | Hver 6 time | Fornyer Google Calendar webhooks |
| agents-test-retest-reminder | Daglig 06:00 | Test-retest-paminnelser |
| sync-notion | Periodisk | Sync mot Notion (CRM) |
| monthly-payout | Manedlig | Payout-kalkulator |

---

# 6. INTEGRASJONER (eksterne tjenester)

| Integrasjon | Bruk | Filer |
|---|---|---|
| **Stripe** | Betaling, abonnement, faktura, refusjon | `lib/portal/stripe/` + webhook |
| **Supabase** | Auth, database, realtime | `@supabase/ssr`, `@supabase/supabase-js` |
| **Anthropic Claude** | AI-coach, treningsplan, tekstgenerering, Vision | `@anthropic-ai/sdk` |
| **DataGolf** | PGA Tour benchmark-data (snitt-SG, distance, etc.) | `lib/portal/datagolf/` |
| **Google Calendar** | Sync av instruktor-tilgjengelighet | `lib/portal/google-calendar/` |
| **Acuity** | Booking-fallback ved vedlikehold | `app/maintenance/page.tsx` |
| **Resend** | Transaksjonelle e-poster | `lib/portal/email/` |
| **Twilio** | SMS-paminnelser | `lib/portal/sms/` |
| **Notion** | CRM-sync (spillerprofiler) | `lib/portal/notion/` |
| **Mapbox** | Bane-kart, GPS shot-tracking (under bygging av Kimi) | `components/portal/round/` |
| **Vercel Blob** | Filopplasting (video, bilder) | `@vercel/blob` |

---

# 7. DATABASEMODELLEN — 135 modeller gruppert

### Brukere & autentisering (12)
User, Account, Session, VerificationToken, UserGolfId, UserPreferences, UserCalendarSubscription, UserExerciseBank, UserSubscription, UserCapability, CapabilityChangeLog, ParentChildRelation

### Spiller-data (15)
HandicapEntry, RoundStats, Round, Hole, HoleResult, Shot, ShotTypeLPhase, ScoreEstimate, PlayerBag, PlayerClub, ClubInBag, PlayerGoals, Goal, PlayerMetrics, MetricSnapshot

### TrackMan (5)
TrackmanSession, TrackManShotData, TrackManImport, TrackManSessionAnalytics, ClubDispersionData

### Trening (12)
TrainingPlan, TrainingPlanWeek, TrainingPlanSession, TrainingLog, TrainingLogExercise, TrainingPlanTemplate, TrainingPrescription, TrainingSubscription, TrainingGroup, ExerciseDefinition, LibraryItem, PlanSuggestion

### Coaching (10)
CoachingSession, CoachingPackage, CoachingAvailability, CoachingForecast, CoachPlayerRelation, Instructor, InstructorAvailability, InstructorDateAvailability, InstructorLocation, InstructorLocationService, InstructorFacilityDefault

### Booking (10)
Booking, BookingV2WaitlistSignup, RecurringBooking, WaitlistEntry, ServiceType, BlockedTime, GapOffer, PromoCode, PromoCodeUsage, PricingRule

### Tester (5)
TestDefinition, TestResult, CategoryRequirement, NorwegianSkillBenchmark, SkillMapping

### USI / Forecast (4)
UnifiedSkillIndex, UnifiedSkillSnapshot, CoachingForecast, DataGolfApproachSkill

### Mental & Forecast (3)
MentalProfile, MentalScorecardEntry, DegradationTracking

### Turneringer (5)
Tournament, TournamentPrep, PlayerTournamentPlan, TalentPlayer, TalentTournamentResult

### Talent (3)
TalentPlayer, TalentScore, TalentPlayerStats

### Periodisering (3)
PeriodizationPeriod, DismissedAdjustment, ReferenceCourse

### Course (3)
Course, CourseNotes, ReferenceCourse

### Live runde (3)
RoundLiveState, GameSession, GamePlayer

### Apper / Abonnement (5)
AppModule, AppBundle, BundleItem, AppSubscription, SubscriptionQuota

### Okonomi (4)
PaymentTransaction, CustomerPaymentPreference, Resource, Sponsor + SponsorPlayerRelation

### Sosialt / Achievement (5)
Friendship, Challenge, ChallengeParticipant, AchievementDefinition, PlayerAchievement

### Gruppe-okter (4)
GroupMembership, GroupParticipant, GroupSession, GroupSessionOccurrence, GroupSessionRSVP

### Meldinger / Notifikasjoner (5)
Message, UnifiedMessage, Conversation, Notification, PushSubscription

### AI / Agenter (5)
AIResponse, AILearning, Agent, AgentConfig, AgentLog

### Innhold / E-post (4)
ContentItem, EmailTemplate, EmailSequence, EmailSequenceStep, EmailSequenceExec

### Anlegg (3)
Facility, FacilityActivity, FacilityBooking

### Annet (4)
DataGolfCache, AdminTask, Location, DashboardAccess, SwingVideo, CommunicationLog

---

# 8. ARKITEKTUR-KART

```
┌─────────────────────────────────────────────────────────────┐
│  MARKEDSSIDE         │  SPILLERPORTAL       │  CoachHQ      │
│  /                   │  /portal/*           │  /admin/*     │
│  Apent for alle      │  requirePortalUser() │  isStaff()    │
└─────────────────────────────────────────────────────────────┘
                            │
                  ┌─────────▼──────────┐
                  │  proxy.ts          │  ← edge-redirects, maintenance
                  │  (ikke middleware) │
                  └─────────┬──────────┘
                            │
                  ┌─────────▼──────────┐
                  │  Server Actions    │  ← actions.ts per rute
                  │  + API Routes      │
                  └─────────┬──────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Prisma  │         │ Cron +  │         │  Eksterne│
   │ (135    │         │ Agenter │         │ tjenester │
   │ modeller│         │ (15+23) │         │(Stripe/  │
   │)        │         │         │         │ Anthropic│
   └─────────┘         └─────────┘         └─────────┘
        │                                        │
        ▼                                        │
   ┌─────────┐                                  │
   │Supabase │  ← Postgres + Auth + Storage    │
   │Postgres │                                  │
   └─────────┘                                  │
                                                 ▼
                                          DataGolf, Google Cal,
                                          Acuity, Mapbox, Notion,
                                          Resend, Twilio, Stripe
```

---

# 9. HVA ER UNIKT MED AK GOLF-PLATTFORMEN?

1. **AK-pyramiden (A–K)** — 11 ferdighetsnivaer basert pa snittscore, ikke handicap. Brukes overalt for benchmarking.
2. **PYRAMIDE-koder (FYS/TEK/SLAG/SPILL/TURN)** — alle treningsokter klassifiseres her. Enkel filtrering pa fokusomrade.
3. **L-faser (L1–L5)** — fra grunnform til turnering. Treningsprogresjonen folger disse.
4. **Strokes Gained-pipeline** — egen beregning pa norsk peer-pool + PGA Tour-benchmark via DataGolf.
5. **Foundation Method** — proprietaer coaching-metodikk dokumentert i hele appen.
6. **Live coaching-loop** — coach kan se spillerens TrackMan/runde-data live i CoachHQ mens spilleren trener.
7. **Adaptiv treningsmotor (under bygging)** — regelmotor + AI-margin-justering for personlig allokering.
8. **15 automatiske agenter** — kjorer i bakgrunnen og handterer alt fra no-show til retention.
9. **3-panel coach-arbeidsflate** — spillerliste alltid synlig, profil 360 i hovedfeltet, KPI pa toppen.
10. **20 fastsatte golftester** — standardisert testbatteri for objektiv ferdighetsmaling.

---

# 10. NESTE STORE BYGGE-OPPGAVER (under arbeid)

| Feature | Hvem | Status |
|---|---|---|
| **Adaptiv treningsmotor** (regelmotor + AI) | Kimi/Claude | Masterplan ferdig 2026-05-01 |
| **Mapbox baneguide** (GPS shot-tracking) | Kimi | Components delvis bygget |
| **TrackMan-upload via Vision** | Kimi | Spec klar |
| **Treningsanalyse-modul** (filter pa 6 dim.) | Kimi | Spec klar |
| **Sprint 6.3 sekundaere sider** (12-15 stk V2) | Claude | I ko |
| **Sprint 7 utvidede tester** (Vitest + Playwright) | Claude | I ko |

---

**Filsti for dette dokumentet:** `docs/funksjons-oversikt-2026-05-01.md`
