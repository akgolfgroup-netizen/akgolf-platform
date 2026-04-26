# Go-Live Sjekkliste — AK Golf Platform

**Sist oppdatert:** 2026-04-25
**Branch:** `feature/go-live-checklist`
**Eier:** Anders Kristiansen
**Domene:** `akgolf.no`
**Vercel-region:** `fra1`

> **Hvordan lese denne:** Hver seksjon har en tabell med konkrete sjekkpunkter. Status er enten:
> - **JA** — verifisert i kode/repo. Klart å deploye.
> - **NEI** — mangler i kode. Må fikses før deploy.
> - **VERIFISER** — kan ikke verifiseres fra kode (krever tilgang til Vercel/Stripe/Supabase/DNS-leverandør). Du må bekrefte manuelt.

> Erstatter eldre `docs/status/GO_LIVE_CHECKLIST.md` (2026-04-18) som er foreldet — denne er verifisert mot kodebasen 2026-04-25.

---

## Sammendrag — hva mangler for go-live

**Kritiske mangler (blokkerer deploy):**
1. `.env.example` mangler 12 env-variabler som faktisk brukes i kode (se §1.B). Bør oppdateres for at neste utvikler skal vite hva som kreves.
2. Stripe-prisnavn-konflikt: `.env.example` har gamle navn (`STRIPE_PRICE_TRAINING_ABO`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_FLEX50/90`) som ikke matcher kode (`STRIPE_PRICE_PERFORMANCE`, `STRIPE_PRICE_PERFORMANCE_PRO`, `STRIPE_PRICE_FLEX`). Avstem før deploy.
3. RLS-migrasjon (`20260326_enable_rls`) er markert "Kjør i Supabase SQL Editor (ikke via Prisma migrate)". Må kjøres manuelt mot prod-DB.
4. `next.config.ts` har `typescript.ignoreBuildErrors: true` — TS-feil skjules under build. Kjent risiko, dokumentert.

**Operasjonelle (krever ekstern tilgang):**
- Vercel env-vars må settes (se §1).
- Stripe webhook må peke på prod-URL og signing secret må deles (se §4).
- DNS må peke på Vercel (se §7).
- Supabase Auth redirect URLs må inkludere `https://akgolf.no/auth/callback` (se §5).

---

## 1. Environment-variabler

### 1.A — Komplette krav (alle env-vars som brukes i kode)

Kjørt: `grep -rEoh 'process\.env\.[A-Z_]+' --include='*.ts' --include='*.tsx' . | sort -u` mot kodebasen 2026-04-25. Totalt 57 referanser.

#### Kritiske (deploy feiler eller er broken uten)

| Variabel | Brukes til | I `.env.example`? | Status |
|----------|-----------|-------------------|--------|
| `DATABASE_URL` | Prisma runtime (pooler, port 6543) | JA | VERIFISER i Vercel |
| `DIRECT_URL` | Prisma migrate (direkte, port 5432) | **NEI** | Mangler i .env.example. Må settes i Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | JA | VERIFISER i Vercel |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | JA | VERIFISER i Vercel |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin-ops | JA | VERIFISER i Vercel |
| `NEXT_PUBLIC_APP_URL` | Webhook-callbacks, e-postlenker | JA (også hardkodet i `vercel.json` til `https://akgolf.no`) | VERIFISER |
| `STRIPE_SECRET_KEY` | Stripe API | JA | VERIFISER (må være `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Webhook-signering | JA | VERIFISER (må matche prod-endpoint) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe checkout | JA | VERIFISER (må være `pk_live_...`) |
| `ANTHROPIC_API_KEY` | AI-coaching | JA | VERIFISER |
| `RESEND_API_KEY` | Transaksjons-e-post | JA | VERIFISER |
| `FROM_EMAIL` | Avsender | JA | VERIFISER |
| `CRON_SECRET` | Bearer-token til cron-ruter | JA | VERIFISER (kjør `openssl rand -hex 32`) |

#### Stripe pris-IDer (alle 5 må være `price_...` fra Stripe Live)

| Variabel (kode) | I `.env.example` som | Status |
|-----------------|----------------------|--------|
| `STRIPE_PRICE_STARTER` | `STRIPE_PRICE_STARTER` | JA — match |
| `STRIPE_PRICE_PERFORMANCE` | `STRIPE_PRICE_TRAINING_ABO` | **NEI — navnemismatch** |
| `STRIPE_PRICE_PERFORMANCE_PRO` | `STRIPE_PRICE_PRO` | **NEI — navnemismatch** |
| `STRIPE_PRICE_JUNIOR_ACADEMY` | `STRIPE_PRICE_JUNIOR_ACADEMY` | JA — match |
| `STRIPE_PRICE_JUNIOR_ELITE` | `STRIPE_PRICE_JUNIOR_ELITE` | JA — match |
| `STRIPE_PRICE_FLEX` | `STRIPE_PRICE_FLEX50` + `_FLEX90` | **NEI — kode bruker én var, eksempel har to** |

**Handling:** Oppdater `.env.example` til å bruke samme navn som koden. Verifiser med `npm run verify:stripe`.

#### Kommunikasjon (e-post + SMS)

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `CONTACT_EMAIL` | JA | VERIFISER |
| `TWILIO_ACCOUNT_SID` | JA | VERIFISER |
| `TWILIO_AUTH_TOKEN` | JA | VERIFISER |
| `TWILIO_FROM_NUMBER` (kode) vs `TWILIO_PHONE_NUMBER` (.env.example) | **NEI — navnemismatch** | Fiks .env.example |

#### AI / Tale

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `OPENAI_API_KEY` (Whisper for coaching-audio-transkribering) | **NEI** | Mangler i .env.example. Må settes i Vercel |

#### Push-varsler (VAPID)

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | **NEI** | Generer med `web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | **NEI** | Samme |
| `VAPID_SUBJECT` (mailto:) | **NEI** | Sett til `mailto:post@akgolf.no` |
| `VAPID_CONTACT_EMAIL` | **NEI** | Sett til `mailto:post@akgolf.no` |

#### Cron-secrets (utover CRON_SECRET)

| Variabel | I `.env.example`? | Brukes av | Status |
|----------|-------------------|-----------|--------|
| `INTEGRATION_SECRET` | **NEI** | `/api/coach/integrations/gmail/sync` | Sett random-string |
| `TOURNAMENT_SYNC_SECRET` | **NEI** | `/api/portal/tournament-planner/sync` | Sett random-string |

#### Google Calendar / OAuth

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `GOOGLE_CLIENT_ID` | JA | VERIFISER (må ha redirect URI `https://akgolf.no/api/portal/calendar/google/callback`) |
| `GOOGLE_CLIENT_SECRET` | JA | VERIFISER |

#### App-URL-varianter (potensielt overlappende)

Koden bruker fire forskjellige URL-vars:

| Variabel | I `.env.example`? | Brukes til | Anbefaling |
|----------|-------------------|-----------|------------|
| `NEXT_PUBLIC_APP_URL` | JA | Hovedsakelig | Sett til `https://akgolf.no` |
| `NEXT_PUBLIC_BASE_URL` | **NEI** | Spredt bruk | Sett samme som over |
| `NEXT_PUBLIC_PORTAL_URL` | **NEI** | Portal-spesifikke lenker | Sett `https://akgolf.no/portal` eller samme |
| `NEXT_PUBLIC_SITE_URL` | **NEI** | SEO-meta | Sett samme som APP_URL |
| `BASE_URL` | **NEI** | Server-side | Sett samme som APP_URL |

**Handling (P3 etter deploy):** Konsolider til én `NEXT_PUBLIC_APP_URL`-variabel. Krever refactor av kode.

#### Notion (valgfritt, kun for sync-features)

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `NOTION_API_KEY` | JA | VERIFISER (kun hvis Notion-sync aktivert) |
| `NOTION_BRAND_GUIDE_DB_ID` | JA | VERIFISER |
| `NOTION_DB_PLAYER_PROFILES` | JA | VERIFISER |
| `NOTION_DB_DRILLS` | JA | VERIFISER |
| `NOTION_DB_TRAINING_PLANS` | JA | VERIFISER |
| `NOTION_DB_CONTENT` | JA | VERIFISER |

#### DataGolf (valgfritt)

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `DATAGOLF_API_KEY` | JA | Kan være tom — ikke blokkerende |

#### Vedlikeholdsmodus

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `MAINTENANCE_MODE` | JA | Sett `false` ved go-live |
| `MAINTENANCE_BYPASS_KEY` | JA | Sett random-string for emergency-bypass |
| `MAINTENANCE_MESSAGE` | JA | Default OK |
| `MAINTENANCE_EXPECTED_DURATION` | JA | Default OK |

#### Analytics / observability (valgfritt)

| Variabel | I `.env.example`? | Status |
|----------|-------------------|--------|
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | **NEI** | Valgfritt — Microsoft Clarity |
| `NEXT_PUBLIC_FORMSPREE_ID` | **NEI** | Valgfritt — kontaktskjema-fallback |
| `UPSTASH_REDIS_REST_URL` | **NEI** | Valgfritt — for /api/health rate-limit |
| `UPSTASH_REDIS_REST_TOKEN` | **NEI** | Samme |

#### Lokal-only (skal IKKE settes i prod)

| Variabel | Hensikt |
|----------|---------|
| `COWORK_SYNC_PATH` | Skriver coaching-sammendrag til `~/Claude Cowork/...` lokalt |
| `DEMO_BYPASS` | Lokal demo-modus |
| `ADMIN_EMAIL` | Lokal seed/test |
| `TEST_BASE_URL` | Playwright-tester |
| `CI` | CI-detection (settes av Vercel/GitHub) |

### 1.B — Mangler i `.env.example` (12 variabler)

Disse brukes i koden, men er ikke dokumentert i `.env.example`. Oppdater filen før deploy så neste utvikler vet hva som trengs:

```diff
+ DIRECT_URL=postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:5432/postgres
+ OPENAI_API_KEY=sk-...
+ INTEGRATION_SECRET=<random>
+ TOURNAMENT_SYNC_SECRET=<random>
+ NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
+ VAPID_PRIVATE_KEY=...
+ VAPID_SUBJECT=mailto:post@akgolf.no
+ VAPID_CONTACT_EMAIL=mailto:post@akgolf.no
+ NEXT_PUBLIC_BASE_URL=https://akgolf.no
+ NEXT_PUBLIC_PORTAL_URL=https://akgolf.no
+ NEXT_PUBLIC_SITE_URL=https://akgolf.no
+ BASE_URL=https://akgolf.no
```

Pluss fiks navn-mismatcher:
```diff
- STRIPE_PRICE_TRAINING_ABO
+ STRIPE_PRICE_PERFORMANCE
- STRIPE_PRICE_PRO
+ STRIPE_PRICE_PERFORMANCE_PRO
- STRIPE_PRICE_FLEX50
- STRIPE_PRICE_FLEX90
+ STRIPE_PRICE_FLEX
- TWILIO_PHONE_NUMBER
+ TWILIO_FROM_NUMBER
```

---

## 2. Prisma-migrasjoner

| Sjekk | Status | Detaljer |
|-------|--------|----------|
| Antall migrasjoner i repo | **21 stk** (eldste 2025-04-06, nyeste 2026-04-24 `user_calendar_subscription`) | `prisma/migrations/` |
| Migrasjons-mønster støtter pgBouncer | JA | Kjør med `DIRECT_URL` (port 5432), ikke `DATABASE_URL` (port 6543). Se `.claude/rules/gotchas.md` |
| Alle migrasjoner kjørt mot prod-DB | **VERIFISER** | Kjør `npx prisma migrate status` mot prod-URL |
| RLS-migrasjon `20260326_enable_rls` | JA i repo, men **må kjøres separat** | Migrasjonen har kommentar: "Kjør denne i Supabase SQL Editor (ikke via Prisma migrate)" — Prisma bruker service_role som bypasser RLS |

### Kjøre migrasjoner mot prod

```bash
cd ~/Developer/akgolf/akgolf-go-live

# Sett DIRECT_URL (port 5432, ikke pooler)
export DATABASE_URL="$(grep '^DIRECT_URL=' .env.production | cut -d= -f2- | tr -d '\"')"

# Verifiser status først
npx prisma migrate status

# Kjør de manglende
npx prisma migrate deploy
```

### Etter migrate deploy: kjør RLS manuelt

1. Åpne Supabase Dashboard → SQL Editor.
2. Kopier hele innholdet av `prisma/migrations/20260326_enable_rls/migration.sql`.
3. Lim inn og kjør i SQL Editor.
4. Verifiser i Authentication → Policies at RLS er **enabled** på alle 38+ tabeller.

### Manglende migrasjoner / orphan-data?

| Sjekk | Status | Handling |
|-------|--------|----------|
| Eksisterende prod-data har FK til tabeller som ikke finnes lokalt | **VERIFISER** | `npx prisma migrate status` viser drift |
| `prisma/seed-prod.ts` finnes | JA | Kjør `npm run seed:prod` etter migrate-deploy hvis prod er tom |

---

## 3. Vercel-konfigurasjon

### 3.A — `vercel.json` (verifisert i repo)

| Felt | Verdi | Status |
|------|-------|--------|
| `framework` | `nextjs` | JA |
| `regions` | `["fra1"]` (Frankfurt — riktig for EU) | JA |
| `buildCommand` | `prisma generate && next build` | JA — sikrer at Prisma Client er fersk |
| `installCommand` | `npm install` | JA |
| `env.NEXT_PUBLIC_APP_URL` hardkodet | `https://akgolf.no` | JA — gir defaults selv om env-var glipper |
| Cors-headers for `/api/portal/public/*` | JA | Tillater public booking-data |
| Cache-Control på `/api/health` | `no-cache, no-store, must-revalidate` | JA |

### 3.B — `next.config.ts` (verifisert i repo)

| Felt | Status | Kommentar |
|------|--------|-----------|
| `turbopack: { root: import.meta.dirname }` | JA | Krav fra CLAUDE.md |
| `typescript.ignoreBuildErrors: true` | **JA, men risiko** | TS-feil skjules. Build kan deploye broken kode. Bør fjernes når lint er ren |
| Image remote patterns | JA — Google, GitHub, Supabase | Tilstrekkelig |
| Security headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy) | JA | OK |
| HSTS-header | **NEI** — settes av Vercel automatisk på custom domene | OK når DNS er på Vercel |

### 3.C — Domener (krever Vercel-tilgang)

| Sjekk | Status |
|-------|--------|
| `akgolf.no` lagt til som domene i Vercel-prosjekt | **VERIFISER** |
| `www.akgolf.no` lagt til (med redirect til apex) | **VERIFISER** |
| SSL-sertifikat utstedt og aktivt | **VERIFISER** |

### 3.D — Build script i package.json

```json
"build": "prisma generate && next build --experimental-build-mode compile"
```

**Status:** JA. `--experimental-build-mode compile` er workaround for React 19 / Next.js 16 SSG `useContext`-feil (se `docs/status/BACKLOG.md` blocker B1, fikset 2026-04-19 commit `6bbd752`).

### 3.E — Pre-deploy script

```bash
npm run pre-deploy
```

Kjører `scripts/pre-deploy-check.ts` som scanner env, console.log, Stripe-keys og build. **VERIFISER:** Kjør denne lokalt før første deploy.

---

## 4. Stripe Webhook

### 4.A — Webhook-endpoint i kode

| Sjekk | Status |
|-------|--------|
| Endpoint-fil eksisterer | JA — `app/api/portal/webhooks/stripe/route.ts` |
| Signering via `STRIPE_WEBHOOK_SECRET` | JA |
| Try/catch wrap rundt all event-håndtering (returnerer 200 selv ved feil) | JA — dokumentert i `gotchas.md` |
| Idempotens (refund) via `Refund.idempotencyKey` | JA — migrasjon `20260413_add_refund_idempotency` |

### 4.B — Stripe Dashboard-konfig (krever Stripe-tilgang)

| Sjekk | Status |
|-------|--------|
| Endpoint registrert: `https://akgolf.no/api/portal/webhooks/stripe` | **VERIFISER** |
| Signing secret kopiert til Vercel `STRIPE_WEBHOOK_SECRET` | **VERIFISER** |
| Subscribed events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`, `customer.subscription.updated`, `customer.subscription.deleted` | **VERIFISER** |
| Test-event sendt og 200-respons mottatt | **VERIFISER** |
| Stripe Mode = **Live** (ikke Test) | **VERIFISER** |

### 4.C — Diagnose

```bash
# Verifiser Stripe-konfig lokalt
npm run verify:stripe

# Diagnose webhook
STRIPE_SECRET_KEY=sk_live_xxx npx tsx scripts/diagnose-stripe-webhook.ts
```

### 4.D — Health endpoint

`GET https://akgolf.no/api/health/stripe` — verifiserer at Stripe-tilkoblingen fungerer. Resultat vises i Mission Control via `WebhookHealthCard`.

---

## 5. Supabase

### 5.A — Auth (krever Supabase-tilgang)

| Sjekk | Status |
|-------|--------|
| Site URL satt til `https://akgolf.no` | **VERIFISER** (Authentication → URL Configuration → Site URL) |
| Redirect URLs inkluderer `https://akgolf.no/auth/callback` | **VERIFISER** (Authentication → URL Configuration → Redirect URLs) |
| Redirect URLs inkluderer `https://akgolf.no/portal/login` | **VERIFISER** |
| Redirect URLs inkluderer `https://akgolf.no/api/portal/calendar/google/callback` (Google Calendar OAuth) | **VERIFISER** |
| Email-templater (magic link, password reset) tilpasset på norsk | **VERIFISER** |
| SMTP konfigurert (eller default Supabase SMTP brukes) | **VERIFISER** |

### 5.B — RLS Policies

Migrasjonsfil: `prisma/migrations/20260326_enable_rls/migration.sql` (ALTER TABLE … ENABLE ROW LEVEL SECURITY på 38+ tabeller).

| Sjekk | Status |
|-------|--------|
| RLS-migrasjon eksisterer i repo | JA |
| RLS aktivert på alle tabeller i prod | **VERIFISER** (Authentication → Policies eller `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public';`) |
| Policy "Own user data" på `User` | **VERIFISER** |
| Policy "Own bookings + instructor bookings" på `Booking` | **VERIFISER** |
| Policy aktiv på `TrainingPlan`, `AIResponses`, `PlayerStats` | **VERIFISER** |

**Test:** I SQL Editor som `authenticated` rolle:
```sql
select id, email from "User" limit 10;
-- Skal returnere kun innlogget bruker, ikke alle
```

### 5.C — Storage

| Sjekk | Status |
|-------|--------|
| Bucket `coaching-audio` opprettet med RLS (staff kan laste opp, elev ser kun egen) | **VERIFISER** — laget i 2026-04-24 commit (CoachHQ AI-pipeline) |

### 5.D — proxy.ts (auth-redirect, ikke middleware.ts)

Verifisert: `proxy.ts` finnes i repo. Håndterer:
- Vedlikeholdsmodus (med bypass-cookie)
- Supabase auth check via `createServerClient`
- Beskyttede ruter: `/portal`, `/admin`, `/mission-board`

**Status:** JA. Ingen `middleware.ts` (som ville konfliktet).

---

## 6. Cron Jobs

### 6.A — Verifisert mot `vercel.json` (22 cron-paths, alle har route-fil)

| # | Path | Schedule | Route-fil eksisterer? |
|---|------|----------|----------------------|
| 1 | `/api/portal/cron/send-reminders` | `0 * * * *` | JA |
| 2 | `/api/cron/send-reminders` | `0 8 * * *` | JA |
| 3 | `/api/cron/cleanup-notifications` | `0 2 * * 0` | JA |
| 4 | `/api/portal/cron/reset-monthly-sessions` | `5 0 * * *` | JA |
| 5 | `/api/portal/cron/session-expiry-reminder` | `0 9 * * *` | JA |
| 6 | `/api/portal/cron/weekly-summary` | `0 18 * * 0` | JA |
| 7 | `/api/portal/cron/win-back` | `0 9 * * *` | JA |
| 8 | `/api/portal/cron/welcome-sequence` | `0 10 * * *` | JA |
| 9 | `/api/portal/cron/abandoned-checkout` | `0 12 * * *` | JA |
| 10 | `/api/portal/cron/ai-insights` | `0 6 * * 1` | JA |
| 11 | `/api/portal/cron/compute-usi` | `0 3 * * *` | JA |
| 12 | `/api/portal/cron/auto-adjust-training-plans` | `30 3 * * *` | JA |
| 13 | `/api/cron/coaching-forecast-backtest` | `0 4 * * *` | JA |
| 14 | `/api/cron/cleanup-pending-bookings` | `*/15 * * * *` | JA |
| 15 | `/api/cron/release-dropin-slots` | `0 6 * * *` | JA |
| 16 | `/api/cron/smart-notifications` | `*/30 * * * *` | JA |
| 17 | `/api/cron/charge-completed` | `0 * * * *` | JA |
| 18 | `/api/cron/mark-no-shows` | `30 * * * *` | JA |
| 19 | `/api/cron/sync-google-calendars` | `0 * * * *` | JA |
| 20 | `/api/cron/cleanup-waitlist` | `0 */6 * * *` | JA |
| 21 | `/api/portal/tournament-planner/sync` | `0 2 * * *` | JA |
| 22 | `/api/portal/cron/process-coaching-audio` | `*/15 * * * *` | JA |

**Status:** Alle 22 cron-paths matcher en eksisterende `route.ts`-fil. Klart for deploy.

### 6.B — Cron-secrets

| Variabel | Brukes av | Status |
|----------|-----------|--------|
| `CRON_SECRET` | Alle `/api/cron/*` og `/api/portal/cron/*` | **VERIFISER i Vercel** |
| `INTEGRATION_SECRET` | Coach-integrasjoner | **VERIFISER i Vercel** |
| `TOURNAMENT_SYNC_SECRET` | `/api/portal/tournament-planner/sync` | **VERIFISER i Vercel** |

### 6.C — Test cron-rute manuelt etter deploy

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://akgolf.no/api/cron/send-reminders
# Forventet: 200 med JSON-body. Hvis 401 → CRON_SECRET feil i Vercel.
```

---

## 7. DNS

### 7.A — DNS-records (krever DNS-leverandør-tilgang, f.eks. Domeneshop / GoDaddy)

| Record | Verdi | Status |
|--------|-------|--------|
| `akgolf.no` (apex/A-record) | Vercel: `76.76.21.21` ELLER nameservers `ns1.vercel-dns.com` + `ns2.vercel-dns.com` | **VERIFISER** |
| `www.akgolf.no` (CNAME) | `cname.vercel-dns.com` | **VERIFISER** |
| MX-records (e-post) | Bevart fra eksisterende e-post-leverandør (Google Workspace, Resend) | **VERIFISER** at de IKKE slettes ved DNS-bytte |
| TXT-record for SPF (Resend / Google) | `v=spf1 include:_spf.google.com include:resend.com ~all` | **VERIFISER** |
| TXT-record for DKIM (Resend) | Resend dashboard genererer | **VERIFISER** |
| TXT-record for domain verification (Resend) | Resend dashboard | **VERIFISER** |

### 7.B — SSL

Vercel utsteder Let's Encrypt-sertifikat automatisk når DNS peker på Vercel. Kan ta 5-30 min etter DNS-propagering.

```bash
# Verifiser HTTPS + HSTS
curl -I https://akgolf.no
# Forventet: HTTP/2 200, strict-transport-security header
```

### 7.C — Email deliverability

| Sjekk | Status |
|-------|--------|
| Domene `akgolf.no` verifisert i Resend dashboard | **VERIFISER** |
| `noreply@akgolf.no` (FROM_EMAIL) verifisert | **VERIFISER** |
| `post@akgolf.no` (CONTACT_EMAIL) mottar mail | **VERIFISER** |
| Test-mail fra `npm run verify:stripe` (eller manual via Resend) lander i innboks (ikke spam) | **VERIFISER** |

---

## 8. Pre-deploy lokalt

```bash
cd ~/Developer/akgolf/akgolf-go-live

npm run lint           # 0 errors (warnings OK)
npm run test           # alle vitest-tester
npm run build          # MÅ være grønn
npm run pre-deploy     # scripts/pre-deploy-check.ts
npm run verify:stripe  # verifiser Stripe-priser
```

---

## 9. Deploy

| Trinn | Kommando |
|-------|----------|
| Via git (anbefalt) | `git push origin main` (Vercel auto-deployer) |
| Via Vercel CLI | `vercel --prod` |
| Manuell | Vercel UI → Deployments → "Redeploy latest" |

---

## 10. Post-deploy smoke-test

### 10.A — HTTP-statussjekk (kjør etter deploy)

```bash
for url in \
  https://akgolf.no/ \
  https://akgolf.no/academy \
  https://akgolf.no/junior-academy \
  https://akgolf.no/utvikling \
  https://akgolf.no/booking \
  https://akgolf.no/portal/login \
  https://akgolf.no/auth/login \
  https://akgolf.no/api/health \
  https://akgolf.no/api/health/db \
  https://akgolf.no/api/health/stripe \
  https://akgolf.no/api/health/booking \
  https://akgolf.no/sitemap.xml \
  https://akgolf.no/robots.txt; do
  echo -n "$url -> "
  curl -o /dev/null -s -w "%{http_code}\n" "$url"
done
```

Forventet: alle returnerer **200**.

### 10.B — Manuell booking-smoketest

1. Gå til `https://akgolf.no/booking`
2. Velg en Flex-tjeneste
3. Velg dato + tid minst 48t frem
4. Fyll ut e-post `test+prod@akgolf.no` + navn
5. Gjennomfør Stripe-betaling (minste beløp)
6. Bekreft kvitterings-e-post mottas
7. Logg inn i portal → bekreft booking vises
8. Refunder via Stripe Dashboard
9. Bekreft webhook setter booking-status til `REFUNDED`

---

## 11. Rollback-plan

| Scenario | Handling |
|----------|----------|
| Build feiler / kritisk regresjon | Vercel Dashboard → Deployments → forrige grønne → "Promote to Production" |
| Database-korrupsjon | Supabase Dashboard → Database → Backups → Restore (daglig backup) |
| Stripe-webhook feiler i loop | Deaktiver webhook-endpoint i Stripe Dashboard |
| Trenger emergency-vedlikehold | Sett `MAINTENANCE_MODE=true` i Vercel env → Redeploy |

---

## 12. Tids-estimat

| Fase | Estimert tid | Kan parallelliseres |
|------|--------------|---------------------|
| Oppdater `.env.example` med 12 mangler + navn-mismatcher | 15 min | Nei |
| Vercel env-vars (57 stk) | 45 min | Nei |
| `prisma migrate deploy` mot prod | 5 min | Nei |
| Kjøre RLS-migrasjon i SQL Editor | 5 min | Nei |
| DNS-konfig | 5 min + 1-24t propagering | Ja (parallell med env) |
| Stripe webhook-konfig | 10 min | Ja |
| Supabase Auth URL-konfig | 5 min | Ja |
| Pre-deploy lokalt | 10 min | Nei |
| Deploy + smoke-test | 15 min | Nei |
| **Totalt aktiv tid** | **~2 timer** | DNS-propagering kan ta opptil 24t |

---

## 13. Post-launch (første uke)

- [ ] Daglig: sjekk Vercel-logger (error rate < 0.1%)
- [ ] Daglig: sjekk Stripe Dashboard for failed payments / disputes
- [ ] Daglig: verifiser at alle 22 CRONs har kjørt (Vercel Dashboard → Cron)
- [ ] Ukentlig: sjekk Resend deliverability-rate (> 95%)
- [ ] Ukentlig: sjekk Supabase Auth — failed logins, suspisiøse mønstre
- [ ] Vurder Sentry/PostHog for error tracking (ikke satt opp per nå)

---

## 14. Referanser

- Eldre sjekkliste (foreldet): `docs/status/GO_LIVE_CHECKLIST.md` (2026-04-18)
- Backlog: `docs/status/BACKLOG.md`
- Gotchas (Stripe webhook, Prisma migrate): `.claude/rules/gotchas.md`
- Auth: `proxy.ts`, `lib/portal/auth.ts`
- Diagnose: `scripts/diagnose-stripe-webhook.ts`, `scripts/pre-deploy-check.ts`, `scripts/verify-stripe.ts`
