# Produksjonsklar Sjekkliste

> Siste sjekk før lansering av AK Golf booking-system

---

## 🔐 Miljøvariabler (Påkrevd)

### Database
```bash
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

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

### Sikkerhet
```bash
CRON_SECRET=[tilfeldig-streng-minst-32-tegn]
NEXT_PUBLIC_APP_URL=https://akgolf.no
```

---

## 📋 Pre-Flight Sjekkliste

### Stripe Konfigurasjon
- [ ] Lag produkt i Stripe Dashboard
- [ ] Aktiver "Automatic tax" for Norge (25% MVA)
- [ ] Konfigurer webhook URL: `https://akgolf.no/api/portal/webhooks/stripe`
- [ ] Velg events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] Test betaling medStripe test-kort: `4242 4242 4242 4242`

### Resend Konfigurasjon
- [ ] Opprett konto på resend.com
- [ ] Verifiser domene: `akgolf.no`
- [ ] Opprett API key med "Sending" tillatelser
- [ ] Test e-postutsendelse
- [ ] Legg til SPF/DKIM records i DNS

### Database
- [ ] Kjør `prisma migrate deploy` på produksjonsdatabase
- [ ] Kjør `prisma db seed` (hvis seed data trengs)
- [ ] Verifiser at tabeller er opprettet

### Vercel Konfigurasjon
- [ ] Koble til GitHub repo
- [ ] Legg til alle miljøvariabler
- [ ] Aktiver "Production Branch Protection"
- [ ] Konfigurer domene: `akgolf.no`
- [ ] Aktiver "Automatic Deploys"

---

## 🚀 Deploy Prosedyre

### Steg 1: Forberedelse
```bash
# 1. Oppdater .env med produksjonsverdier
# 2. Verifiser at alt er committed
git status

# 3. Push til main
git push origin main
```

### Steg 2: Database
```bash
# Kjør migrasjoner
npx prisma migrate deploy

# (Valgfritt) Seed med initial data
npx prisma db seed
```

### Steg 3: Verifikasjon
```bash
# Test bygg lokalt
npm run build

# Sjekk for TypeScript feil
npx tsc --noEmit

# Sjekk for linting feil
npm run lint
```

### Steg 4: Produksjon
```bash
# Vercel vil automatisk deploye ved push til main
# Eller deploy manuelt:
vercel --prod
```

---

## ✅ Post-Deploy Testing

### Kritisk Funksjonalitet
- [ ] Åpne `https://akgolf.no/academy/booking`
- [ ] Velg tjeneste → Progress bar oppdateres
- [ ] Velg instruktør → Profilkort vises
- [ ] Velg dato/tid → Kalender fungerer
- [ ] Fullfør test-betaling med Stripe
- [ ] Motta bekreftelse på e-post
- [ ] Logg inn på portal → Se booking
- [ ] Test avbestilling

### E-post
- [ ] Booking-bekreftelse mottatt
- [ ] Velkomst-e-post for nye brukere
- [ ] Kontaktskjema fungerer

### Webhook
- [ ] Stripe webhook mottar events
- [ ] Betaling markeres som "betalt"
- [ ] Bruker mottar e-post ved betaling

### Cron
- [ ] Påminnelser sendes 24t før (sjekk logs)
- [ ] SMS-påminnelser 1t før (hvis Twilio)

---

## 🆘 Troubleshooting

### Vanlige Feil

**"Failed to send email"**
→ Sjekk at `RESEND_API_KEY` er satt og at domenet er verifisert

**"Stripe webhook failed"**
→ Sjekk at `STRIPE_WEBHOOK_SECRET` matcher webhook i Stripe Dashboard

**"Database connection failed"**
→ Verifiser at `DATABASE_URL` er korrekt og at IP er whitelisted

**"Cron job not running"**
→ Sjekk at `CRON_SECRET` er satt og at cron er konfigurert i Vercel

---

## 📞 Support Kontakter

| Tjeneste | Support URL |
|----------|-------------|
| Vercel | https://vercel.com/support |
| Stripe | https://support.stripe.com |
| Resend | https://resend.com/support |
| Supabase | https://supabase.com/support |

---

**Sist oppdatert:** 2026-03-17
**Versjon:** 1.0
