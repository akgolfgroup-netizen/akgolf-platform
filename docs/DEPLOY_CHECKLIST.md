# Produksjons-deployment sjekkliste

> **Oppdatert:** 2026-04-01

---

## Miljøvariabler i Vercel

Gå til https://vercel.com/dashboard → Velg prosjekt → Settings → Environment Variables

### Påkrevde variabler

| Variabel | Beskrivelse | Miljø |
|----------|-------------|-------|
| `DATABASE_URL` | PostgreSQL via Supabase Pooler | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase prosjekt-URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role | Production |
| `STRIPE_SECRET_KEY` | Stripe secret key (live) | Production |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | All |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Production |
| `ANTHROPIC_API_KEY` | Claude API key | Production |
| `RESEND_API_KEY` | Resend API key | Production |
| `FROM_EMAIL` | `noreply@akgolf.no` | Production |
| `CONTACT_EMAIL` | `post@akgolf.no` | Production |
| `CRON_SECRET` | Tilfeldig streng (32+ tegn) | Production |
| `NEXT_PUBLIC_APP_URL` | `https://akgolf.no` | Production |

### Valgfrie variabler

```bash
# Twilio (SMS)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...

# Google Calendar
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Analytics
NEXT_PUBLIC_CLARITY_PROJECT_ID=...
```

---

## Pre-deploy sjekk

```bash
# 1. Verifiser at alt er committed
git status

# 2. Test bygg lokalt
npm run build

# 3. Kjør linting
npm run lint

# 4. Push til main (trigger Vercel deploy)
git push origin main
```

---

## Etter deploy

### 1. Verifiser funksjonalitet
- [ ] Forsiden laster
- [ ] Portal login fungerer
- [ ] Ny bruker opprettes automatisk
- [ ] Dashboard viser data
- [ ] Booking-flyt fungerer

### 2. Test e-post
- [ ] Send test via kontaktskjema
- [ ] Verifiser at e-post mottas

### 3. Test betaling
- [ ] Fullfør en test-booking
- [ ] Verifiser webhook mottar event
- [ ] Verifiser e-post sendes

---

## Viktig: Resend domene-verifisering

Før e-post sendes fra produksjon:

1. Gå til https://resend.com/domains
2. Legg til domene: `akgolf.no`
3. Følg DNS-instruksjonene (TXT + CNAME records)
4. Vent på verifisering (kan ta opptil 24 timer)

---

## Database-migrasjoner

```bash
# Kjør fra lokal maskin med prod DATABASE_URL
npx prisma migrate deploy
```

---

## Cron jobs

Verifiser at `vercel.json` inneholder:
```json
{
  "crons": [
    {
      "path": "/api/portal/cron/send-reminders",
      "schedule": "0 * * * *"
    }
  ]
}
```

---

## Rollback

Hvis noe går galt:

1. Gå til Vercel Dashboard
2. Velg prosjektet
3. Gå til Deployments
4. Finn forrige fungerende deployment
5. Klikk "..." → "Promote to Production"
