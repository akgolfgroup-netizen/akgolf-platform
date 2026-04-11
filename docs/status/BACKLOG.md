# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-12

## P1 — Kritisk (blokkerer produksjonskvalitet)

### 1. Booking: Hardkodet slot-telling
- **Fil:** `app/booking/page.tsx` linje 129
- **Problem:** `availableSlotsThisWeek: 8` — alltid 8 uansett
- **Handling:** Hent faktisk tall fra `/api/booking/smart-slots`

## P2 — Viktig (funksjonalitet mangler)

### 2. Portal: Trening/tester — hardkodet stat
- **Fil:** `app/portal/(dashboard)/trening/tester/page.tsx` linje 78
- **Problem:** Viser alltid "0 fullforte tester"
- **Handling:** Hent faktisk fullforingsdata fra brukerens testhistorikk

## P3 — Forbedringer (kode-kvalitet)

### 3. Portal: Apper — mangler actions.ts
- **Fil:** `app/portal/(dashboard)/apper/page.tsx`
- **Problem:** Inline Supabase-queries i stedet for actions.ts
- **Handling:** Migrer til actions.ts for konsistens

### 4. Admin: Fasiliteter sub-sider — mock
- **Filer:** `fasiliteter/ny-aktivitet/`, `fasiliteter/innstillinger/`
- **Problem:** Mock facility list og instructor defaults
- **Handling:** Koble til reelle fasilitetsdata

### 5. Booking: Idempotency key pa refunder
- **Fil:** `lib/portal/booking/refund.ts`
- **Problem:** Ingen idempotency key pa Stripe refund-kall
- **Handling:** Legg til idempotency key for a hindre duplikater

### 6. Admin: Mission Board — delvis mock
- **Fil:** `app/admin/(authed)/mission-board/`
- **Problem:** API-kall er reelle, men visualiseringsdata er mock
- **Handling:** Koble visualisering til faktiske metrics

## Fullfort

### 2026-04-12
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
