# Gotchas — AK Golf Platform

**Les denne før du skriver kode.** Se `prisma-auth.md` for Prisma/auth-regler.

## Turbopack
`next.config.ts` MÅ ha `turbopack: { root: import.meta.dirname }`.

## Auth
- Bruk `proxy.ts` (ikke middleware.ts) for auth-redirects. Nye beskyttede ruter MÅ legges til der.
- `requirePortalUser()` i server components er backup, ikke primær guard.
- API-ruter MÅ ha `getPortalUser()` + `checkRateLimit()`. Aldri reflekter brukerinput i feilmeldinger.

## Font
Inter via `next/font/google`. Ikke lokal font-fil.

## Priser
- Database lagrer **kroner** (ikke øre). Vis direkte, aldri del på 100.
- Stripe forventer øre: `service.price * 100`.
- Aldri vis MVA på kundevendte sider.

## CSS / Design — Brand Guide V2.0
- Én `app/globals.css` for hele appen. Aldri lag globals.css i undermapper.
- Bruk kun offisielle tokens. Aldri `--color-gold`, `--apple-gold-*`, `--color-ink-*`.
- Grey-skala: `--color-grey-100` (#ECF0EF) til `--color-grey-900` (#0A1F18). Grønn-tonet, ikke nøytral.
- Primary: #005840 (--color-primary). Accent/CTA: #D1F843 (--color-accent-cta). Aldri bruk gamle #2D6A4F.
- Success: `--color-success` (#2A7D5A). Error: `--color-error` (#B84233). Warning: `--color-warning` (#C48A32). AI: `--color-ai` (#AF52DE).
- Heritage Grid er DROPPET. Aldri bruk `--hg-*` variabler. Aldri dark mode.
- Aldri bruk emojier. Bruk Lucide-ikoner.

## Komponenter
- Lucide icons kan ikke sendes som props fra Server → Client Components. Bruk `iconName` string + ICON_MAP.
- Client components skal aldri importere filer med `import { prisma }`. Splitt til `*-types.ts` + `*-service.ts`.
- TS enum includes(): Bruk `const arr: EnumType[] = [...]` eller helper-funksjon.

## Innhold
- Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet.
- Aldri vis trenersertifiseringer (PGA, TrackMan, TPI, etc.).
- Anders-pakker: Performance 1600 kr/mnd (2x20min), Performance Pro 2000 kr/mnd (4x20min), Gruppe 900 kr/mnd (2x60min).
- Markus-pakker: Express 550 kr/mnd (2x20min), Express Pro 1000 kr/mnd (4x20min), First Tee 1295 kr (kurs), Flex 20 450 kr (20 min enkeltokt).
- Flex = enkeltbetaling uten binding. Flex 20/50/90 + Duo-varianter + Banecoaching 9 hull. Flex-priser er hoyere per okt enn abonnement (motivasjon for abo).
- Portal: Abo-pakker = lopende. Gruppe/Express/First Tee = 3 mnd. Flex/Bane = 1 mnd fra oktdato.

## Booking-vinduer
- Performance / Performance Pro: 4 uker (28 dager) i forveien
- Flex-tjenester: 3 uker (21 dager) i forveien
- Konfigurert i `lib/portal/booking/subscription-quota.ts` (getSessionLimits) og `maxAdvanceDays` på ServiceType i databasen.

## CoachHQ
- Admin: `/portal/admin/` med RBAC via `canAccessCoachHQ()` og `canAccessCoachHQPage()`.
- Roller: ADMIN (alt), INSTRUCTOR (coaching), INVITED (begrenset).
- All instruktør-funksjonalitet i Portal Admin. Ikke opprett separate dashboards.

## Git
- ALDRI bruk `git add -A` eller `git add .` for commit. Bruk `git add <spesifikke filer>` for å unngå utilsiktet inkludering av slettinger eller endringer.

## Stripe Webhooks

### Webhook secret mismatch (mest vanlig)
Stripe sender webhook events til `https://akgolf.no/api/portal/webhooks/stripe`.
Hvis secreten i Vercel (`STRIPE_WEBHOOK_SECRET`) ikke matcher den i Stripe Dashboard,
returnerer endpointet 400 og Stripe markerer endpointet som "failing".

**Løsning:**
1. Gå til [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Finn endpoint `https://akgolf.no/api/portal/webhooks/stripe`
3. Klikk "Reveal" under "Signing secret"
4. Kopier `whsec_...`-verdien
5. Oppdater `STRIPE_WEBHOOK_SECRET` i Vercel Dashboard
6. Deploy på nytt

### Error handling
Webhook-koden (`app/api/portal/webhooks/stripe/route.ts`) wrapper nå ALL event-håndtering
i `try/catch` for å aldri returnere 500 til Stripe. Ved feil:
- Logger event.type + event.id + feilmelding
- Returnerer fortsatt 200 (for å unngå retry-loops)
- Feil må følges opp manuelt via logger / Vercel Dashboard

### Diagnose-script
```bash
STRIPE_SECRET_KEY=sk_live_xxx npx tsx scripts/diagnose-stripe-webhook.ts
```

### Health check
Systemhelse vises i CoachHQ dashboard via `WebhookHealthCard`.
API-endepunkt: `GET /api/health/stripe`

## Prisma migrate mot Supabase
- `DATABASE_URL` peker til pooler (port 6543) — dette **fungerer ikke** for `prisma migrate` pga. PgBouncer og prepared statements. Feilmelding: `ERROR: prepared statement "s1" already exists`.
- Bruk alltid `DIRECT_URL` (port 5432) ved migrasjoner:
  ```bash
  DATABASE_URL="$(grep '^DIRECT_URL=' .env | cut -d= -f2- | tr -d '"')" npx prisma migrate deploy
  ```
- Ved utvikling: foretrekk manuelt opprettet SQL-migrasjon + `prisma migrate deploy` fremfor `migrate dev` for å unngå interaktive prompts.

## Kapabiliteter og tilgangsstyring (2026-04-19)
- Nye admin-funksjoner skal gates på kapabilitet fra `@/lib/portal/capabilities`, ikke bare `UserRole`.
- Bruk `requireCapability(Capability.X)` i server actions og API.
- Kritiske endringer (USERS_ASSIGN_CAPABILITIES, USERS_ASSIGN_ROLE, USERS_DEACTIVATE, FINANCE_REFUND, SYSTEM_SETTINGS, SYSTEM_RUN_CRON) må i tillegg kalle `requireSensitiveAuth()` — krever passord-bekreftelse siste 15 min.
- Alle grant/revoke av kapabiliteter audit-logges automatisk i `CapabilityChangeLog` via team-actions. Ikke lag egne queries som omgår dette.
- `defaultsForRole()` i `lib/portal/capabilities/check.ts` gir rolle-baserte defaults; eksisterende `canAccessCoachHQPage()` er bakoverkompatibel midlertidig.

## Heritage Grid design-migrering (2026-04-19)

**Kildebilde:** `design-ref/stitch/heritage/` (195 Stitch-skjermer godkjent av bruker). Alle nye komponenter skal kopiere Tailwind-klasser 1:1 fra relevant `code.html`.

- **Font:** DM Sans (body/heading), JetBrains Mono (numerisk). Aldri Inter.
- **Ikoner:** Material Symbols Outlined via `<Icon name="..." />` fra `components/ui/icon.tsx`. Aldri Lucide.
- **Primary:** `#154212` (skogsgrønn, varm). `--color-primary`.
- **Accent:** `#d2f000` (olivengul lime). `--color-secondary-fixed`.
- **Surface:** `#fdf9f0` (kremhvit). `--color-surface`.
- **Tekst:** `#1c1c16` (brun-sort). `--color-on-surface`.
- **MC-sidebar:** `bg-[#022c22]` (emerald-950, veldig mørk grønn).
- **Portal-sidebar:** `#2d5a27` (primary-container, mellommørk grønn).

**Forbudte tokens:** `bg-portal-*`, `--hg-*`, `shadow-portal-*`, `Inter` font, `Lucide` ikoner. Alle migrert via `scripts/migrate-to-heritage.sh` + `scripts/migrate-lucide-to-material.js`.

**Arkivert:** `_archived/pre-heritage-2026-04-19/` inneholder gamle patterns (CourseHero, GlassPanel, osv.) og dashboard-views (FocusToday, DataRich, etc.).

**Én kilde til sannhet:** `.claude/rules/design-system.md`. Alle andre design-docs (DESIGN_SYSTEM.md, design-system-v3.1.md, stitch-*.md) er droppet.

## Oppdater dokumentasjon ved strukturelle endringer
Endre kode + oppdater docs = én atomisk operasjon.
