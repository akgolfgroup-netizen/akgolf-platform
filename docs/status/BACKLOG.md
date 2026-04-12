# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-12

## P1 — Kritisk (blokkerer produksjonskvalitet)

### ~~1. Booking: Hardkodet slot-telling~~ FERDIG
- **Losning:** Beregner reelle ledige slots fra InstructorAvailability (gjenvarende ukedager) minus eksisterende bookinger, per instruktor og tjeneste-varighet

## P2 — Viktig (funksjonalitet mangler)

### ~~2. Portal: Trening/tester — hardkodet stat~~ FERDIG
- **Losning:** Prisma-query mot TestResult for innlogget bruker: `count()` for fullforte tester, `findFirst()` for siste test-dato

## P3 — Forbedringer (kode-kvalitet)

### ~~3. Portal: Apper — mangler actions.ts~~ FERDIG
- **Losning:** Ny `actions.ts` med `getApperPageData()` — alle 5 Supabase-queries flyttet fra page.tsx

### ~~4. Admin: Fasiliteter sub-sider — mock~~ FERDIG
- **Losning:** ny-aktivitet: server+client split, kaller `createActivity()` med reelle fasiliteter. innstillinger: server+client split, reelle Facility + InstructorFacilityDefault fra Prisma, toggle aktiv/slett

### ~~5. Booking: Idempotency key pa refunder~~ FERDIG
- **Losning:** `idempotencyKey: refund_${paymentIntentId}_${amount}` pa `stripe.refunds.create()`

### ~~6. Admin: Mission Board — delvis mock~~ FERDIG
- **Losning:** Ny `actions.ts` med `getMissionBoardCharts()` — booking-trend (30d), tjeneste-fordeling, heatmap, sparklines og manedlig mal fra Prisma

## Fullfort

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
