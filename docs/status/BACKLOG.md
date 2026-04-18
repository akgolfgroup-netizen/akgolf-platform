# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-18

## P1 — Kritisk (blokkerer produksjonskvalitet)

- **Build-feil ved static export**: `/landing/contact` og `/admin/treningsplan/ny` feiler med "Cannot read properties of null (reading 'useContext')" under `npm run build`. Blokkerer go-live. Trolig React 19 / Next.js 16 SSG-issue med klient-komponenter. Se `docs/status/GO_LIVE_CHECKLIST.md` B1.

## P2 — Viktig (funksjonalitet mangler)

- **Go-live (#39)**: Vercel-env-vars må settes, `prisma migrate deploy` må kjøres mot prod, DNS må verifiseres. Alt annet er klart. Se `docs/status/GO_LIVE_CHECKLIST.md`.
- **`app/setup-admin/page.tsx`**: Eksponerer admin-opprettelse med hardkodet passord "anders". Må slettes eller guardes før produksjon.

## P3 — Forbedringer (kode-kvalitet)

- **10 ESLint-errors pre-eksisterende** i:
  - `app/portal/(dashboard)/dagbok/page.tsx` (impure function, `any`-typer)
  - `components/portal/dagbok/weekly-stats.tsx` (create components during render x3)
  - `components/portal/trackman/trackman-analytics-card.tsx` (impure function)
  - `components/admin/analytics/revenue-chart.tsx` (prefer-const)
- **86 lint-warnings** (ubrukte imports/vars) — kjør `npx eslint . --fix` hvor mulig.
- **Notion-import (#41)**: Manuell import av `docs/notion-import-master-todo.json` til Notion-database.

## Nye ideer / neste kvartal

- Admin: Real-time Mission Board med WebSocket/SSE (Supabase Realtime — 2-3 t sprint)
- Kalibrering av auto-plan-terskler i `training-plan-adjustment.ts` etter første CRON-kjøringer

### Fullført 2026-04-18
- ~~TrackMan: AI-genererte innsikter fra `TrackManSessionAnalytics`~~ — utvidet med treningsvolum + AK-metodikk-kontekst (f1f1986)
- ~~Statistikk: Prediktiv HCP-trend basert på treningsvolum + runder~~ — Kalman-prognose + CI + regelbasert innsikt (1152b44)
- ~~Dagbok: Automatisk treningsplan-justering basert på logget progresjon~~ — CRON analyserer 14d logg, flytt/forenkle-logikk (9250059)

## Fullfort

### 2026-04-18 (senere)
- **Turneringsplanlegger komplett (#42):** 6 kilder aktive — Olyo Juniortour (customer=877, scheduleId=16139), Østlandstour (customer=895, scheduleId=3863), Garmin Norgescup, Srixon Tour, NM (customer=18), Nordic Golf Tour, JMI Sweden, Global Junior Tour. Sync-route fyllt ut med upsert og error-isolation per kilde (POST + GET for cron). CRON 02:00 daglig. Prisma-migrasjon `isPrivate` + indekser. Spiller-opprettede turneringer private by default, staff kan opprette offentlige. Modal `add-tournament-modal.tsx`. Filtrering i `getTournamentsWithPlans` + `getPlayerTournaments` + public API. Hjelper-script `scripts/list-golfbox-schedules.ts`. Integrasjonstester i `__tests__/tournament-planner/tournament.test.ts`.

### 2026-04-18
- **E2E-dekning booking (#30):** 3 nye Playwright-spec-filer med totalt 28 nye test-cases (e2e/booking-cancel.spec.ts, e2e/portal-booking-auth.spec.ts, e2e/booking-errors.spec.ts). test:e2e-scripts lagt til i package.json.
- **Go-live-sjekkliste:** `docs/status/GO_LIVE_CHECKLIST.md` opprettet med komplett env-vars-liste, CRON-verifisering, DNS, Stripe-webhook, smoke-test, rollback-plan.
- **Notion-import JSON:** `docs/notion-import-master-todo.json` + `docs/notion-import-howto.md` (API- og CSV-import-metoder).
- **Console.log ryddet opp** i 3 klient-filer (live-round-client, treningsplan-v3-client, setup-admin).
- **Kvalitetssikring:** npx tsc --noEmit ren for alle nye spec-filer. pre-deploy-check passerer nå console.log-sjekken.

### 2026-04-15
- **TrackMan analytics:** shot dispersion chart, session analytics card, real carry data
- **Din Golfprofil:** kombinert hero med HCP, runder, trening, TrackMan highlights + innsikter
- **Dagbok ↔ Treningsplan:** progress tracker, forbedret quick-log toast, kalender-interaktivitet
- **Teknisk gjeld:** 15+ TS-feil fikset, døde index-filer slettet, admin mock-sider verifisert reelle
- **Dokumentasjon:** PORTAL_AUDIT.md og ADMIN_AUDIT.md oppdatert — 100% reell data på begge sider

### 2026-04-12
- Portal Apper: inline Supabase-queries flyttet til actions.ts
- Admin Fasiliteter/ny-aktivitet: mock erstattet med reelle fasiliteter + createActivity()
- Admin Fasiliteter/innstillinger: mock erstattet med Prisma (Facility + InstructorFacilityDefault), toggle/slett
- Booking refund: idempotency key pa Stripe refund-kall
- Admin Mission Board: mock-grafer erstattet med reelle Prisma-data (booking-trend, heatmap, sparklines)
- Booking: Slot-telling beregnes fra InstructorAvailability minus bookinger (erstatter hardkodet 8)
- Portal Tester: Fullforte tester og siste test-dato hentes fra TestResult via Prisma
- Booking: Per-uke grense valideres i create/route.ts (checkWeeklyLimit)
- Portal Turneringsplan: mock erstattet med reell Prisma-data fra Tournament + PlayerTournamentPlan
- Portal Bookinger/[id]: ny detaljside med Prisma, BookingStatusBadge, kansellering
- Admin Meldinger: mock fjernet, koblet til Conversation/Message via chat-actions.ts
- Admin Rapporter: CSV-eksport (bookinger, okonomi, elever) med ekte Prisma-data
- Admin Focus: AdminTask-modell med CRUD, kanban, divisjonsfiltrering
- Admin Analytics: mock erstattet med reell aggregering fra bookinger/brukere/betalinger
- Admin Bookinger: reschedule-dialog med Google Calendar-synk

### 2026-04-11
- Elever-side med reell data fra Supabase (HCP, A-K kategori, bookinger)
- Refusjon kr->ore konvertering fikset
- Booking race condition, reschedule transaction, idempotent cancel
- Portal redesign med sidebar + dashboard bento grid + fargetoken-migrering
- Admin Focus: AdminTask-modell, CRUD actions, reelle bookinger per divisjon
- Admin Bookinger: reschedule-dialog, Google Calendar-synk ved reschedule/cancel
- Google Calendar eventId lagres pa Booking for oppdatering/sletting
