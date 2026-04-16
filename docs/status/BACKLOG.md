# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-15

## P1 — Kritisk (blokkerer produksjonskvalitet)

*Ingen åpne P1-punkter.*

## P2 — Viktig (funksjonalitet mangler)

*Ingen åpne P2-punkter.*

## P3 — Forbedringer (kode-kvalitet)

*Ingen åpne P3-punkter.*

## Nye ideer / neste kvartal

- TrackMan: AI-genererte innsikter fra `TrackManSessionAnalytics`
- Statistikk: Prediktiv HCP-trend basert på treningsvolum + runder
- Dagbok: Automatisk treningsplan-justering basert på logget progresjon
- Admin: Real-time Mission Board med WebSocket/SSE

## Fullfort

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
