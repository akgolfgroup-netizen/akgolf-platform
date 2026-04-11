# Backlog — Prioritert gjenstående arbeid

Sist oppdatert: 2026-04-11

## P1 — Kritisk (blokkerer produksjonskvalitet)

### 1. Portal: Turneringsplan — kun mock-data
- **Fil:** `app/portal/(dashboard)/turneringsplan/page.tsx`
- **Problem:** Hele siden er hardkodede turneringer fra 2024, ingen auth
- **Handling:** Implementer server-side datahenting, koble til turneringer-tabellen, legg til `requirePortalUser()`

### 2. Booking: Hardkodet slot-telling
- **Fil:** `app/booking/page.tsx` linje 129
- **Problem:** `availableSlotsThisWeek: 8` — alltid 8 uansett
- **Handling:** Hent faktisk tall fra `/api/booking/smart-slots`

### 3. Admin: Analytics — helt mock
- **Fil:** `app/admin/(authed)/analytics/page.tsx`
- **Problem:** Hardkodede KPIer, trender, heatmap, student health
- **Handling:** Implementer aggregering fra bookings, subscriptions, sessions

## P2 — Viktig (funksjonalitet mangler)

### 4. Admin: Meldinger — mock chat
- **Fil:** `app/admin/(authed)/meldinger/`
- **Problem:** Hardkodede samtaler og meldinger (portal-meldinger er reelle)
- **Handling:** Gjenbruk portal-meldingssystemet eller implementer admin-variant

### 5. Admin: Rapporter — mock
- **Fil:** `app/admin/(authed)/rapporter/`
- **Problem:** Mock rapporttyper og schedulerte rapporter
- **Handling:** Implementer rapportgenerering fra eksisterende data

### ~~6. Admin: Focus — mock prosjektstyring~~ FERDIG
- **Losning:** AdminTask Prisma-modell med CRUD, divisjonsfiltrering (Coaching/Junior/GFGK), prioritet, status (Todo/InProgress/Done), dagens bookinger per divisjon

### 7. Portal: Trening/tester — hardkodet stat
- **Fil:** `app/portal/(dashboard)/trening/tester/page.tsx` linje 78
- **Problem:** Viser alltid "0 fullforte tester"
- **Handling:** Hent faktisk fullforingsdata fra brukerens testhistorikk

## P3 — Forbedringer (kode-kvalitet)

### 8. Portal: Apper — mangler actions.ts
- **Fil:** `app/portal/(dashboard)/apper/page.tsx`
- **Problem:** Inline Supabase-queries i stedet for actions.ts
- **Handling:** Migrer til actions.ts for konsistens

### 9. Admin: Fasiliteter sub-sider — mock
- **Filer:** `fasiliteter/ny-aktivitet/`, `fasiliteter/innstillinger/`
- **Problem:** Mock facility list og instructor defaults
- **Handling:** Koble til reelle fasilitetsdata

### 10. Booking: Idempotency key pa refunder
- **Fil:** `lib/portal/booking/refund.ts`
- **Problem:** Ingen idempotency key pa Stripe refund-kall
- **Handling:** Legg til idempotency key for a hindre duplikater

### 11. Admin: Mission Board — delvis mock
- **Fil:** `app/admin/(authed)/mission-board/`
- **Problem:** API-kall er reelle, men visualiseringsdata er mock
- **Handling:** Koble visualisering til faktiske metrics

## Fullfort

### 2026-04-11
- Elever-side med reell data fra Supabase (HCP, A-K kategori, bookinger)
- Refusjon kr->ore konvertering fikset
- Booking race condition, reschedule transaction, idempotent cancel
- Portal redesign med sidebar + dashboard bento grid + fargetoken-migrering
- Admin Focus: AdminTask-modell, CRUD actions, reelle bookinger per divisjon
- Admin Bookinger: reschedule-dialog, Google Calendar-synk ved reschedule/cancel
- Google Calendar eventId lagres pa Booking for oppdatering/sletting
