# Lanserings-sjekkliste — AK Golf Portal

**Oppdatert:** 2026-03-31
**Status:** Produksjonsklar

---

## Status per 2026-03-31

### Fullført
- [x] Auth: Automatisk brukeroppretting via `upsert`
- [x] Dagbok: Koblet til `getTrainingLogs()` med ekte data
- [x] Statistikk: Koblet til `getStatsAggregates()` + `getTrainingAreaBreakdown()`
- [x] Treningsplan: Koblet til `getCurrentWeekSessions()`
- [x] AI-endepunkter: `maxDuration=60` + rate limiting
- [x] SubscriptionTier: Synkronisert (`VISITOR` er default)
- [x] Profil AI URL: Fikset til `/api/portal/ai/focus-recommendation`
- [x] Stripe tier-mapping: Riktig mapping for STARTER/PRO
- [x] Apple-inspirert monokrom design implementert
- [x] Loading/error states på alle sider
- [x] Sikkerhet: Rate limiting, PATCH whitelist, Zod validering

---

## Prioritet 1: Kritisk (må verifiseres før lansering)

### 1.1 Miljøvariabler i Vercel
- [ ] `DATABASE_URL` — PostgreSQL via Supabase Pooler
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `CRON_SECRET`

### 1.2 Test betalingsflyt ende-til-ende
- [ ] Flex 50 — book og betal
- [ ] Flex 90 — book og betal
- [ ] Performance — abonnement
- [ ] Performance Pro — abonnement
- [ ] Webhook mottar og oppdaterer status

### 1.3 Verifiser auth-flyt
- [ ] Ny bruker kan logge inn (auto-opprettelse fungerer)
- [ ] Eksisterende bruker kan logge inn
- [ ] Magic link fungerer
- [ ] Passord-innlogging fungerer

---

## Prioritet 2: Viktig (bør testes før lansering)

### 2.1 Google Calendar sync
- [ ] Test OAuth-callback med ekte Google-konto
- [ ] Verifiser at events synkroniseres
- [ ] Feilhåndtering hvis token utløper

### 2.2 E-post
- [ ] Booking-bekreftelse sendes
- [ ] Påminnelse 24t før (cron)
- [ ] Velkomst-e-post for nye brukere

### 2.3 AI-funksjoner
- [ ] Fokus-anbefaling på profil fungerer
- [ ] Svakhetsanalyse fungerer
- [ ] Treningsplan-generering fungerer

---

## Prioritet 3: Kan vente

### 3.1 DataGolf-integrasjon
- [ ] Kun for ELITE-tier

### 3.2 Achievements/Gamification
- [ ] Achievement-sjekk etter hver økt

### 3.3 Øvelsesbank
- [ ] Last opp treningsvideoer

---

## Testing før lansering

### Brukerflyt-tester
- [ ] Ny bruker registrerer seg og får VISITOR-tier
- [ ] Bruker kjøper abonnement
- [ ] Instruktør logger coaching-notater
- [ ] Bruker logger treningsøkt i dagbok
- [ ] Bruker ser statistikk

### Tekniske tester
- [ ] `npm run build` uten feil ✅
- [ ] `npm run lint` uten feil ✅
- [ ] Stripe webhook mottar events
- [ ] E-poster sendes via Resend

---

## Deploy-sjekkliste

- [ ] Alle env-variabler satt i Vercel
- [ ] Database-migrasjoner kjørt
- [ ] Stripe webhook-URL oppdatert til prod
- [ ] Vedlikeholdsmodus deaktivert (`proxy.ts`: `MAINTENANCE_MODE = false`)
- [ ] DNS peker til Vercel

---

## Etter lansering

- [ ] Overvåk Vercel-logger første 24 timer
- [ ] Sjekk Stripe Dashboard for feilede betalinger
- [ ] Sjekk Resend for bounced e-poster
- [ ] Samle tilbakemelding fra første brukere
