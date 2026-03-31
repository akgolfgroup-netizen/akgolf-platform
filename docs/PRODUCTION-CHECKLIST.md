# Produksjonsklar Sjekkliste

> **Oppdatert:** 2026-03-31
> **Status:** Produksjonsklar

---

## Miljøvariabler (Påkrevd)

### Database
```bash
DATABASE_URL=postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:6543/postgres
```
⚠️ **Viktig:** Bruk Supabase Pooler-URL, ikke direkte tilkobling!

### Stripe (Betaling)
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
⚠️ **Viktig:** Bruk live-nøkler, ikke test-nøkler!

### E-post (Resend)
```bash
RESEND_API_KEY=re_live_...
CONTACT_EMAIL=post@akgolf.no
FROM_EMAIL=noreply@akgolf.no
```
⚠️ **Viktig:** Verifiser akgolf.no-domene i Resend først!

### Autentisering (Supabase)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

### AI (Anthropic)
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### Sikkerhet
```bash
CRON_SECRET=[tilfeldig-streng-minst-32-tegn]
NEXT_PUBLIC_APP_URL=https://akgolf.no
```

---

## Pre-Flight Sjekkliste

### Stripe Konfigurasjon
- [ ] Lag produkter i Stripe Dashboard
- [ ] Aktiver "Automatic tax" for Norge (25% MVA)
- [ ] Konfigurer webhook URL: `https://akgolf.no/api/portal/webhooks/stripe`
- [ ] Velg events: `checkout.session.completed`, `customer.subscription.*`, `invoice.paid`

### Resend Konfigurasjon
- [ ] Opprett konto på resend.com
- [ ] Verifiser domene: `akgolf.no`
- [ ] Legg til SPF/DKIM records i DNS

### Database
- [ ] Kjør `npx prisma migrate deploy` på produksjonsdatabase
- [ ] Verifiser at tabeller er opprettet

### Vercel Konfigurasjon
- [ ] Koble til GitHub repo
- [ ] Legg til alle miljøvariabler
- [ ] Konfigurer domene: `akgolf.no`
- [ ] Konfigurer cron jobs i vercel.json

---

## Deploy Prosedyre

### Steg 1: Verifisering
```bash
# Test bygg lokalt
npm run build

# Sjekk for TypeScript feil
npx tsc --noEmit

# Sjekk for linting feil
npm run lint
```

### Steg 2: Deploy
```bash
# Push til main - Vercel deployer automatisk
git push origin main
```

### Steg 3: Database
```bash
# Kjør migrasjoner (fra lokal maskin med prod DATABASE_URL)
npx prisma migrate deploy
```

---

## Post-Deploy Testing

### Kritisk Funksjonalitet
- [ ] Åpne `https://akgolf.no/portal/login`
- [ ] Logg inn med eksisterende bruker
- [ ] Test ny bruker-registrering (auto-opprettelse)
- [ ] Gå til Dashboard — data vises
- [ ] Gå til Dagbok — treningslogger vises
- [ ] Gå til Statistikk — SG-data vises
- [ ] Gå til Treningsplan — økter vises
- [ ] Test AI fokus-anbefaling på profil

### Booking
- [ ] Åpne `https://akgolf.no/academy/booking`
- [ ] Fullfør booking-flyt
- [ ] Test betaling med Stripe
- [ ] Motta bekreftelse på e-post

### E-post
- [ ] Booking-bekreftelse mottatt
- [ ] Velkomst-e-post for nye brukere
- [ ] Kontaktskjema fungerer

### Webhook
- [ ] Stripe webhook mottar events
- [ ] Betaling markeres som "betalt"

---

## Troubleshooting

### Vanlige Feil

**"Failed to send email"**
→ Sjekk at `RESEND_API_KEY` er satt og at domenet er verifisert

**"Stripe webhook failed"**
→ Sjekk at `STRIPE_WEBHOOK_SECRET` matcher webhook i Stripe Dashboard

**"Database connection failed"**
→ Verifiser at `DATABASE_URL` bruker Pooler-URL

**"AI timeout"**
→ AI-endepunkter har `maxDuration=60`, sjekk Vercel-plan

**"User not found after login"**
→ Auth upsert skal opprette bruker automatisk, sjekk `lib/portal/auth.ts`

---

## Support Kontakter

| Tjeneste | Support URL |
|----------|-------------|
| Vercel | https://vercel.com/support |
| Stripe | https://support.stripe.com |
| Resend | https://resend.com/support |
| Supabase | https://supabase.com/support |
| Anthropic | https://support.anthropic.com |
