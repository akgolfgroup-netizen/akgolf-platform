# Lanserings-sjekkliste — AK Golf Portal

**Opprettet:** 2026-03-27
**Mål:** Gjøre portalen produksjonsklar

---

## Prioritet 1: Kritisk (må fikses før lansering)

### 1.1 Fjern demo-data fallbacks
- [ ] `app/portal/(dashboard)/dagbok/page.tsx` — Fjern `demoLogs`, vis tom-tilstand
- [ ] `app/portal/(dashboard)/treningsplan/[sessionId]/page.tsx` — Fjern demo-typer
- [ ] `app/portal/(dashboard)/statistikk/page.tsx` — Fjern hardkodede SG-verdier

### 1.2 Fiks TODOs i treningsplan
- [ ] `treningsplan/[sessionId]/session-view-client.tsx` — Implementer "Save to database"
- [ ] `treningsplan/[sessionId]/session-view-client.tsx` — Implementer "Add exercise to session"

### 1.3 Statistikk: Runde-input
- [ ] Lag `/portal/statistikk/ny-runde` side
- [ ] Skjema: Bane, dato, score, GIR, FIR, putter
- [ ] Lagre til `RoundStats`-modellen
- [ ] Oppdater SG-beregninger automatisk

### 1.4 Test betalingsflyt ende-til-ende
- [ ] Flex 50 — book og betal
- [ ] Flex 90 — book og betal
- [ ] Performance — abonnement
- [ ] Performance Pro — abonnement
- [ ] Webhook mottar og oppdaterer status

---

## Prioritet 2: Viktig (bør fikses før lansering)

### 2.1 Google Calendar sync
- [ ] Test OAuth-callback med ekte Google-konto
- [ ] Verifiser at events synkroniseres
- [ ] Feilhåndtering hvis token utløper

### 2.2 Coaching-notater
- [ ] Test at notater lagres og vises i spillerens historikk
- [ ] Test AI-oppsummering genereres etter sesjon

### 2.3 Tom-tilstander (empty states)
- [ ] Dagbok: "Ingen treningslogger ennå. Logg din første økt!"
- [ ] Statistikk: "Ingen runder registrert. Legg til din første runde."
- [ ] Treningsplan: "Ingen treningsplan generert ennå."
- [ ] Coaching-historikk: "Ingen coaching-økter ennå."

### 2.4 E-post-maler
- [ ] Booking-bekreftelse — test at den sendes
- [ ] Påminnelse 24t — test cron
- [ ] Sesjons-utløp — test cron

---

## Prioritet 3: Kan vente (nice-to-have)

### 3.1 DataGolf-integrasjon
- [ ] Lag UI for å søke opp spillere
- [ ] Vis SG-sammenligning med tour-spillere
- [ ] Kun for ELITE-tier

### 3.2 Sammenligning med peers
- [ ] Trenger flere brukere med data
- [ ] Anonymiser data

### 3.3 Øvelsesbank
- [ ] Last opp treningsvideoer
- [ ] Kategoriser etter tema/nivå
- [ ] Koble til treningsplaner

### 3.4 Achievements/Gamification
- [ ] Definer achievement-kriterier
- [ ] Implementer sjekk etter hver økt
- [ ] Vis badges på profil

---

## Testing før lansering

### Brukerflyt-tester
- [ ] Ny bruker registrerer seg
- [ ] Bruker kjøper Flex 50
- [ ] Bruker oppgraderer til Performance
- [ ] Instruktør logger coaching-notater
- [ ] Bruker ser notater i sin historikk
- [ ] Bruker logger treningsøkt i dagbok
- [ ] Bruker registrerer runde i statistikk

### Tekniske tester
- [ ] `npm run build` uten feil
- [ ] `npm run lint` uten feil
- [ ] Alle cron-jobber kjører (send-reminders, reset-sessions, expiry-reminder)
- [ ] Stripe webhook mottar events
- [ ] E-poster sendes via Resend
- [ ] SMS sendes via Twilio (hvis konfigurert)

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
