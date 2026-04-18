# Go-Live Sjekkliste — AK Golf Platform

Sist oppdatert: 2026-04-18
Eier: Anders Kristiansen
Vercel-prosjekt: `prj_1m2Bfcs0S0omd0OfPLMoBRSmf3J9` (akgolf-website)
Domene: `akgolf.no` (region `fra1`)

---

## 0. Kjente blockers (må løses før deploy)

| # | Problem | Fil / omgivelse | Løsning |
|---|---------|-----------------|---------|
| B1 | `npm run build` feiler under static export | `/landing/contact` og `/admin/treningsplan/ny` med "Cannot read properties of null (reading 'useContext')" | Gjør klientsidene server-komponent-wrappet, eller legg til `export const dynamic = "force-dynamic"` i parent layout |
| B2 | 10 lint-errors pre-eksisterende | `components/portal/dagbok/weekly-stats.tsx` (3x), `components/portal/trackman/trackman-analytics-card.tsx`, `components/admin/analytics/revenue-chart.tsx`, `app/portal/(dashboard)/dagbok/page.tsx`, plus `any`-typer | Ikke blokkerende, men bør ryddes |
| B3 | `.env.production` mangler lokalt | Prosjektrot | Ikke nødvendig for Vercel-deploy — alle env-vars settes i Vercel UI |
| B4 | `app/setup-admin/page.tsx` eksponerer admin-setup med hardkodet passord | `app/setup-admin/page.tsx` | Slett siden helt før prod-deploy, eller legg middleware-guard |

---

## 1. Pre-deploy (lokalt, 10 min)

```bash
# Fra ~/Developer/akgolf/akgolf-platform

npm run lint          # Skal vise 0 errors (kun warnings OK foreløpig)
npm run test          # vitest — alle 97+ unit-tester skal passere
npm run build         # MÅ være grønn før deploy. Se blocker B1.
npm run pre-deploy    # Scanner env, konsoll-logg, Stripe-nøkler, build
```

Hvis `npm run build` feiler, STOPP her og fiks B1.

---

## 2. Vercel Environment Variables (30 min)

Gå til Vercel Dashboard → Project `akgolf-website` → Settings → Environment Variables → "Production".
Alle disse må være satt:

### Kritiske (deploy feiler uten)

```
DATABASE_URL=postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_APP_URL=https://akgolf.no
```

### Stripe (live-modus, ikke test)

```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PERFORMANCE=price_...
STRIPE_PRICE_PERFORMANCE_PRO=price_...
STRIPE_PRICE_JUNIOR_ACADEMY=price_...
STRIPE_PRICE_JUNIOR_ELITE=price_...
STRIPE_PRICE_FLEX50=price_...
STRIPE_PRICE_FLEX90=price_...
```

### AI

```
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...        # kun for tale-transkribering (coaching-session skill)
```

### Kommunikasjon

```
RESEND_API_KEY=re_...
FROM_EMAIL="AK Golf <hei@akgolf.no>"
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+47...
```

### Google Calendar (valgfritt, men anbefalt for coach-sync)

```
GOOGLE_CLIENT_ID=...-...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

### Push-notifikasjoner (VAPID)

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:post@akgolf.no
VAPID_CONTACT_EMAIL=mailto:post@akgolf.no
```

### CRON-sikkerhet

```
CRON_SECRET=<langt random-string, f.eks. 64 tegn fra openssl rand -hex 32>
INTEGRATION_SECRET=<random-string>        # for /api/coach/integrations/gmail/sync
TOURNAMENT_SYNC_SECRET=<random-string>    # for /api/portal/tournament-planner/sync
```

### Notion (hvis synk-features brukes)

```
NOTION_API_KEY=ntn_...
NOTION_BRAND_GUIDE_DB_ID=...
NOTION_DB_CONTENT=...
NOTION_DB_PLAYER_PROFILES=...
NOTION_DB_DRILLS=...
NOTION_DB_TRAINING_PLANS=...
```

### DataGolf (valgfritt)

```
DATAGOLF_API_KEY=<api_key eller blank>
```

### Maintenance-modus (for emergency-toggling uten deploy)

```
MAINTENANCE_MODE=false
MAINTENANCE_BYPASS_KEY=<random-string>
# MAINTENANCE_MESSAGE kan settes ved behov
# MAINTENANCE_EXPECTED_DURATION kan settes ved behov
```

### Analytics (valgfritt)

```
NEXT_PUBLIC_CLARITY_PROJECT_ID=<Microsoft Clarity ID>
```

### Redis (valgfritt for health-check)

```
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...
```

### Formspree (valgfritt for kontaktskjema)

```
NEXT_PUBLIC_FORMSPREE_ID=abc123
```

---

## 3. Database-migrering (15 min)

```bash
# Fra ~/Developer/akgolf/akgolf-platform

# Sett produksjons-URL i shell
export DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
export DIRECT_URL="postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:5432/postgres"

# Kjør migrasjoner
npx prisma migrate deploy

# Verifiser at alle 10+ migrasjoner er anvendt
npx prisma migrate status
```

### Row-Level Security (RLS) verifisering

Migrasjon `20260326_enable_rls.sql` aktiverer RLS. Verifiser i Supabase Dashboard → Authentication → Policies:

- `User` tabell: RLS enabled, policy "Own user data" aktiv
- `Booking` tabell: RLS enabled, policy "Own bookings + instructor bookings"
- `TrainingPlan`, `AIResponses`, `PlayerStats`: RLS enabled

Test: Supabase SQL editor, kjør som `authenticated` rolle:
```sql
select id, email from "User" limit 10;  -- Skal kun returnere egen bruker
```

---

## 4. CRON-jobber (10 min)

`vercel.json` har 19 crons. Etter deploy, verifiser at `CRON_SECRET` er satt og cron-ruter svarer 200:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://akgolf.no/api/cron/send-reminders
# Skal returnere 200 med JSON-body (ikke 401)
```

Cron-liste (fra `vercel.json`):

| Route | Schedule | Formål |
|-------|----------|--------|
| `/api/cron/send-reminders` | `0 8 * * *` | 24t-påminnelser |
| `/api/cron/cleanup-notifications` | `0 3 * * *` | Rydde opp notifikasjoner |
| `/api/cron/smart-notifications` | `*/15 * * * *` | Smart-notifikasjoner |
| `/api/cron/charge-completed` | `0 2 * * *` | Charge-ferdig-sjekk |
| `/api/cron/mark-no-shows` | `0 22 * * *` | Merke no-shows |
| `/api/cron/sync-google-calendars` | `*/30 * * * *` | Google Calendar sync |
| `/api/cron/cleanup-waitlist` | `0 4 * * *` | Rydde waitlist |
| `/api/cron/cleanup-pending-bookings` | `0 5 * * *` | Rydde PENDING bookings |
| `/api/cron/release-dropin-slots` | `*/30 * * * *` | Frigi drop-in-slots |
| `/api/cron/coaching-forecast-backtest` | `0 4 * * *` | Backtest av forecasts |
| `/api/cron/sync-cleanup` | `0 1 * * *` | Sync-opprydning |
| `/api/portal/cron/send-reminders` | `0 9 * * *` | Portal-påminnelser |
| `/api/portal/cron/reset-monthly-sessions` | `0 0 1 * *` | Månedlig reset |
| `/api/portal/cron/session-expiry-reminder` | `0 10 * * *` | Sesjon-utløp |
| `/api/portal/cron/weekly-summary` | `0 18 * * 0` | Ukentlig sammendrag |
| `/api/portal/cron/win-back` | `0 10 * * 1` | Win-back kampanje |
| `/api/portal/cron/welcome-sequence` | `0 11 * * *` | Velkomst-sekvens |
| `/api/portal/cron/abandoned-checkout` | `0 14 * * *` | Forlatt checkout |
| `/api/portal/cron/ai-insights` | `0 6 * * *` | Daglige AI-insights |
| `/api/portal/cron/compute-usi` | `0 3 * * *` | USI-beregning |

---

## 5. DNS (5 min)

- Bekreft at `akgolf.no` og `www.akgolf.no` peker til Vercel-nameservers:
  ```
  ns1.vercel-dns.com
  ns2.vercel-dns.com
  ```
- Verifiser SSL-sertifikat er utstedt (Vercel gjør dette automatisk etter DNS-propagering).
- Test: `curl -I https://akgolf.no` skal returnere 200 og `strict-transport-security`-header.

---

## 6. Stripe Webhook (10 min)

1. Gå til Stripe Dashboard → Developers → Webhooks.
2. Bekreft at produksjons-endpointet eksisterer: `https://akgolf.no/api/portal/webhooks/stripe`
3. Subscribed events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Kopier webhook signing secret → sett som `STRIPE_WEBHOOK_SECRET` i Vercel.
5. Send test-event fra Stripe UI og bekreft at det dukker opp i Vercel-logger med status 200.

---

## 7. Monitoring (5 min)

- Vercel Analytics: aktivert automatisk via `@vercel/analytics/react` + `@vercel/speed-insights/next`.
- Health-endpoints:
  ```bash
  curl https://akgolf.no/api/health
  curl https://akgolf.no/api/health/db
  curl https://akgolf.no/api/health/stripe
  curl https://akgolf.no/api/health/booking
  ```
  Alle skal returnere 200 med `status: "healthy"`.

### Oppfølging (ikke blokkerende)

- Legg til Sentry eller PostHog for error tracking (ikke satt opp per 2026-04-18).
- Konfigurer Vercel Log Drains til Datadog/Logtail hvis sentralisert logging ønskes.

---

## 8. Smoke-test i produksjon (10 min)

Etter deploy, besøk og verifiser at alle returnerer 200:

```
https://akgolf.no/                         — Forsiden
https://akgolf.no/academy                  — Academy
https://akgolf.no/junior-academy           — Junior
https://akgolf.no/utvikling                — Utvikling
https://akgolf.no/booking                  — Booking-flyt
https://akgolf.no/portal/login             — Portal-login
https://akgolf.no/auth/login               — Auth-login
https://akgolf.no/api/health               — Helse-sjekk
https://akgolf.no/sitemap.xml              — SEO
https://akgolf.no/robots.txt               — SEO
```

### Full booking-smoketest (manuelt)

1. Gå til `/booking`
2. Velg en tjeneste (f.eks. Flex 50)
3. Velg dato og tid minst 48 timer frem
4. Fyll ut epost + navn (bruk `test+prod@akgolf.no`)
5. Gjennomfør Stripe-betaling med ekte kort (minste beløp)
6. Bekreft at epost-kvittering mottas
7. Logg inn i portal og bekreft at booking vises
8. Refunder via Stripe Dashboard (test: full refund)
9. Bekreft at webhook oppdaterer booking-status til `REFUNDED`

---

## 9. Deploy

```bash
# Opsjon A: Deploy via git (anbefalt)
git push origin main     # Vercel auto-deployer på push

# Opsjon B: Deploy via Vercel CLI
vercel --prod

# Opsjon C: Manuell trigger via Vercel UI
# Dashboard → Deployments → "Redeploy latest"
```

Vent 3-5 min på build. Sjekk Vercel build-log for feil.

---

## 10. Rollback-plan

Hvis noe går galt i produksjon:

1. **Umiddelbar rollback**: Vercel Dashboard → Deployments → Finn forrige grønne deploy → "Promote to Production".
2. **Maintenance-modus**: Sett `MAINTENANCE_MODE=true` i Vercel env → Redeploy. `proxy.ts` vil da vise maintenance-side for alle ruter unntatt de med `MAINTENANCE_BYPASS_KEY` cookie.
3. **Stripe**: Hvis webhook skaper feil, deaktiver webhook-endepunktet midlertidig i Stripe Dashboard.
4. **Database**: Supabase har automatiske daglige backups. Restore via Dashboard → Database → Backups.

---

## 11. Post-launch (første uke)

- [ ] Monitor Vercel-logger daglig (error rate bør være < 0.1%)
- [ ] Sjekk Stripe-refusjoner og failed payments
- [ ] Verifiser at alle CRONs kjører som forventet (se /api/health/cron)
- [ ] Sjekk epost-leveringsrate via Resend Dashboard
- [ ] Sjekk SMS-leveringsrate via Twilio Dashboard (hvis brukt)
- [ ] Samle første brukertilbakemeldinger

---

## 12. Tids-estimat

| Fase | Estimert tid |
|------|--------------|
| 0. Løse blockers (B1 build-feil) | 30-60 min |
| 1. Pre-deploy lokalt | 10 min |
| 2. Vercel env-vars | 30 min |
| 3. Database-migrering + RLS-verifisering | 15 min |
| 4. CRON-verifisering | 10 min |
| 5. DNS | 5 min (vent propagering) |
| 6. Stripe webhook | 10 min |
| 7. Monitoring | 5 min |
| 8. Smoke-test i prod | 15 min |
| 9. Deploy | 5 min |
| **Totalt** | **~2-3 timer** når blockers er løst |
