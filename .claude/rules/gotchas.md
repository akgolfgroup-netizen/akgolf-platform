# Gotchas — AK Golf Platform

**Les denne før du skriver kode.** Se `prisma-auth.md` for Prisma/auth-regler.

## Turbopack
`next.config.ts` MÅ ha `turbopack: { root: import.meta.dirname }`.

## Auth
- Bruk `proxy.ts` (ikke middleware.ts) for auth-redirects. Nye beskyttede ruter MÅ legges til der.
- `requirePortalUser()` i server components er backup, ikke primær guard.
- API-ruter MÅ ha `getPortalUser()` + `checkRateLimit()`. Aldri reflekter brukerinput i feilmeldinger.

## Font
Inter Tight (headlines) + Inter (body) + JetBrains Mono (tall) via `next/font/google`. Ikke lokal font-fil. DM Sans er legacy og fjernes i Sprint 2.

## Priser
- Database lagrer **kroner** (ikke øre). Vis direkte, aldri del på 100.
- Stripe forventer øre: `service.price * 100`.
- Aldri vis MVA på kundevendte sider.

## CSS / Design — Brand Guide V2.0 (eneste gjeldende, etter rebrand 2026-04-25)
- Én `app/globals.css` for hele appen. Aldri lag globals.css i undermapper.
- Designfasit: `public/design-reference/*.html` — kopier Tailwind-tokens 1:1.
- **Primary:** `#005840` (--color-primary). **Accent/CTA:** `#D1F843` (--color-accent).
- **Surface:** `#F4F6F4` (--color-surface). **Card:** `#FFFFFF` (--color-card).
- **Sidebar:** `#0F1F18` (--color-sidebar) — admin og dark contrast cards.
- **Tekst:** `#0A1F18` (--color-ink), muted `#5C6B62`, subtle `#8A958E`.
- **Status:** success `#2A7D5A`, warning `#C48A32`, danger `#B84233`.
- **Border:** `--color-line` (#E4EAE6), soft `--color-line-soft` (#EDF1EE).
- **Fonts:** Inter Tight + Inter + JetBrains Mono. Aldri DM Sans i ny kode.
- **Ikoner:** `lucide-react`. Aldri Material Symbols i ny kode. Aldri emojier.
- **Heritage-tokens er LEGACY** — beholdes som `--legacy-*` aliaser i globals.css. Mass-migrering i Sprint 2.
- Se `.claude/rules/design-system.md` for full token-liste.

## Komponenter
- Lucide icons kan ikke sendes som props fra Server → Client Components. Bruk `iconName` string + ICON_MAP.
- Client components skal aldri importere filer med `import { prisma }`. Splitt til `*-types.ts` + `*-service.ts`.
- TS enum includes(): Bruk `const arr: EnumType[] = [...]` eller helper-funksjon.

## Innhold
- Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet.
- Aldri vis trenersertifiseringer (PGA, TrackMan, TPI, etc.).
- Anders-pakker: Performance 1200 kr/mnd (2x20min, abo), Performance Pro 2200 kr/mnd (4x20min, abo), Flex 20 600 kr, Flex 50 Solo 1500 kr / Duo 1700 kr, Flex 90 Solo 2500 kr / Duo 2800 kr, On-Course 9 3000 kr, On-Course Par 3 500 kr (alle Flex/On-Course = engang). **Priser sannhetskilde: Stripe (oppdatert 2026-04-27).**
- Markus-pakker: Flex 20 Markus 300 kr (engang), First Tee 1295 kr (kurs).
- Flex = enkeltbetaling uten binding. Flex-priser er hoyere per okt enn abonnement (motivasjon for abo).
- Express/Express Pro fjernet 2026-04-27 (Markus). Gruppe (Anders) ikke lenger aktiv.
- Portal: Abo-pakker = lopende. Gruppe/Express/First Tee = 3 mnd. Flex/Bane = 1 mnd fra oktdato.

## Booking-vinduer
- Performance / Performance Pro: 4 uker (28 dager) i forveien
- Flex-tjenester: 3 uker (21 dager) i forveien
- Konfigurert i `lib/portal/booking/subscription-quota.ts` (getSessionLimits) og `maxAdvanceDays` på ServiceType i databasen.

## CoachHQ (admin-flate, omdøpt fra Mission Control 2026-04-25)
- Rute: `/admin/` (under `(authed)`-gruppe). RBAC via `canAccessMissionControl()` og `canAccessMCPage()` (funksjonsnavn beholdes for bakoverkompatibilitet).
- Roller: ADMIN (alt), INSTRUCTOR (coaching), INVITED (begrenset).
- All instruktør-funksjonalitet i CoachHQ. Ikke opprett separate dashboards.
- Komponenter: `components/admin/CoachHQSidebar.tsx` (ny). Gammel `components/portal/mission-control/mc-sidebar.tsx` er legacy — slettes i Sprint 2.
- Synlig UI-tekst sier "CoachHQ", men filnavn / mappenavn / DB-felter beholder "mission-control" / "MC" inntil videre.

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
- `defaultsForRole()` i `lib/portal/capabilities/check.ts` gir rolle-baserte defaults; eksisterende `canAccessMCPage()` er bakoverkompatibel midlertidig.

## Heritage Grid (LEGACY — DEPRECATED 2026-04-25)

Heritage Grid (M3) var gjeldende fra 2026-04-19 til 2026-04-25. Erstattet av Brand Guide V2.0 i CoachHQ-rebrand.

**Heritage-tokens som er DEPRECATED og merket `--legacy-*` i `app/globals.css`:**
- `#154212` (Heritage primary) → bruk `#005840`
- `#d2f000` (Heritage accent) → bruk `#D1F843`
- `#fdf9f0` (Heritage surface) → bruk `#F4F6F4`
- `#1c1c16` (Heritage on-surface) → bruk `#0A1F18`
- `bg-emerald-950` / `#022c22` (MC-sidebar) → bruk `bg-sidebar` (#0F1F18)
- DM Sans → bruk Inter / Inter Tight
- Material Symbols → bruk lucide-react

**Eksisterende kode** som bruker Heritage-tokens fortsetter å fungere via `--legacy-*`-aliaser. Mass-migrering planlagt i Sprint 2 (script-basert + manuell touch-up).

**ALDRI bruk Heritage-tokens i ny kode.** Se `.claude/rules/design-system.md` for gjeldende tokens.

**Stitch-referanseskjermer** under `design-ref/stitch/heritage/` er nå historisk referanse — ikke bruk dem som kildebilde for ny kode. Bruk `public/design-reference/*.html` i stedet.

## Oppdater dokumentasjon ved strukturelle endringer
Endre kode + oppdater docs = én atomisk operasjon.
