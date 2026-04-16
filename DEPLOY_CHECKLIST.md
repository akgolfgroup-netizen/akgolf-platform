# 🚀 Produksjonsdeploy Sjekkliste - AK Golf Platform

## Pre-deploy Sjekker (Kjør: `npm run pre-deploy`)

### 1. Miljøvariabler ✅
- [ ] `.env.production` eksisterer med riktige verdier
- [ ] `NEXT_PUBLIC_APP_URL=https://akgolf.no`
- [ ] `DATABASE_URL` og `DIRECT_URL` er satt
- [ ] `STRIPE_SECRET_KEY` er **live key** (`sk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` er satt
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` er **live key** (`pk_live_`)
- [ ] Supabase-credentials er satt
- [ ] `RESEND_API_KEY` er satt
- [ ] `UPSTASH_REDIS_REST_URL` og `TOKEN` er satt (optional)
- [ ] `CRON_SECRET` er satt (streng)

### 2. Bygg & Kodekvalitet ✅
- [ ] `npm run build` fullført uten feil
- [ ] `npm run lint` ingen kritiske feil
- [ ] `npm test` alle tester passerer
- [ ] `npm run smoke:test` alle smoke-tester passerer

### 3. SEO & Metadata ✅
- [ ] `app/layout.tsx` har oppdatert metadata
- [ ] `app/sitemap.ts` genererer korrekt sitemap
- [ ] `app/robots.ts` blokkerer portal og API
- [ ] `lib/seo/json-ld.ts` har structured data helpers
- [ ] OG-bilde (`/og-image.png`) eksisterer (1200x630)
- [ ] Favicon (`/favicon.svg`) eksisterer
- [ ] `manifest.json` er konfigurert

### 4. Health Checks ✅
- [ ] `/api/health` returnerer 200 + "healthy"
- [ ] `/api/health/db` database-tilkobling OK
- [ ] `/api/health/stripe` Stripe-konfigurasjon OK
- [ ] Health checks har `Cache-Control: no-cache`

### 5. Sikkerhet ✅
- [ ] Ingen `console.log` i klient-kode (kun server/API)
- [ ] API routes har auth-sjekk der nødvendig
- [ ] Cron-endepunkter krever `CRON_SECRET`
- [ ] Stripe webhook secret er konfigurert
- [ ] CORS er konfigurert i `vercel.json`

### 6. Vercel Konfigurasjon ✅
- [ ] `vercel.json` har riktig buildCommand
- [ ] `vercel.json` har riktig framework
- [ ] `vercel.json` crons er konfigurert
- [ ] `vercel.json` headers er satt
- [ ] Region er satt (`fra1` for Europa)

---

## Deploy-prosess

### Steg 1: Verifiser lokalt
```bash
npm run pre-deploy
```

### Steg 2: Kjør smoke-tester
```bash
npm run smoke:test
```

### Steg 3: Deploy til Vercel
```bash
vercel --prod
```

### Steg 4: Verifiser produksjon
- [ ] https://akgolf.no laster
- [ ] `/api/health` returnerer healthy
- [ ] Booking-flow fungerer
- [ ] Login fungerer
- [ ] Stripe checkout fungerer (test med testkort)
- [ ] Sitemap: https://akgolf.no/sitemap.xml
- [ ] Robots: https://akgolf.no/robots.txt

---

## Etter Deploy

### Verifikasjon
1. **Sjekk logs**: Vercel Dashboard → Logs
2. **Sjekk Analytics**: Vercel Dashboard → Analytics
3. **Sjekk Speed Insights**: Vercel Dashboard → Speed Insights
4. **Sjekk Stripe Dashboard**: Ingen errors i webhook logs

### Google Search Console
1. Legg til side i Google Search Console
2. Submit sitemap: `https://akgolf.no/sitemap.xml`
3. Verifiser at robots.txt ikke blokkerer viktige sider

---

## Filstruktur Opprettet/Endret

### Nye filer:
```
.env.production                          # Miljøvariabel-template
vercel.json                              # Oppdatert Vercel config
app/api/health/route.ts                  # Hoved health check
app/api/health/db/route.ts               # Database health check  
app/api/health/stripe/route.ts           # Stripe health check
lib/seo/json-ld.ts                       # SEO helpers
app/sitemap.ts                           # Oppdatert sitemap
app/robots.ts                            # Oppdatert robots.txt
app/landing/layout.tsx                   # Oppdatert med SEO
app/layout.tsx                           # Oppdatert med SEO
scripts/pre-deploy-check.ts              # Pre-deploy script
tests/smoke/critical-paths.test.ts       # Smoke tests
DEPLOY_CHECKLIST.md                      # Denne filen
```

### Oppdaterte scripts i package.json:
```json
{
  "pre-deploy": "tsx scripts/pre-deploy-check.ts",
  "smoke:test": "vitest run tests/smoke/"
}
```

---

## Viktige Endepunkter

| Endpoint | Beskrivelse |
|----------|-------------|
| `/api/health` | Hoved health check |
| `/api/health/db` | Database health check |
| `/api/health/stripe` | Stripe health check |
| `/sitemap.xml` | SEO sitemap |
| `/robots.txt` | Robots regler |

---

## Kontakt ved Problemer

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support

---

Siste oppdatering: 2025-01-16
