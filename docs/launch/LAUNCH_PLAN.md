# Launch Plan — akgolf-platform

**Opprettet:** 2026-04-11
**Målsetting:** Få plattformen produksjonsklar på 4-5 dager via parallell agent-basert arbeid.

**IKKE-scope (håndteres av annen terminal):**
- Visuell design av alle sider (layout, spacing, polish)
- Brand Guide V2.0 visuell implementasjon
- Komponent-redesign / UX-forbedringer
- Stitch/Magic design-prototyper

**Scope denne terminalen (TEKNISK TRACK):**
- Manglende sider (backend + minimal markup — design kommer etterpa)
- Kode-gjeld (gammel farge-tokens, emoji, udefinerte vars)
- QA og testing av kritiske flows
- Sikkerhet og ytelse
- Launch prep og deploy

---

## Overordnet struktur — 5 parallelle agent teams

```
┌──────────────────────────────────────────────────────────────┐
│  TEKNISK TRACK (denne terminalen)                            │
│                                                              │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │  TEAM 1    │ │  TEAM 2    │ │  TEAM 3    │               │
│  │  Missing   │ │  Code      │ │  Test &    │               │
│  │  Pages     │ │  Hygiene   │ │  QA        │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│                                                              │
│  ┌────────────┐ ┌────────────┐                              │
│  │  TEAM 4    │ │  TEAM 5    │                              │
│  │  Security  │ │  Launch    │                              │
│  │  & Perf    │ │  Prep      │                              │
│  └────────────┘ └────────────┘                              │
└──────────────────────────────────────────────────────────────┘
                      │
                      ▼
               Merge til main
                      │
                      ▼
┌──────────────────────────────────────────────────────────────┐
│  DESIGN TRACK (annen terminal)                               │
│  Visuell polish — pagebygger med Stitch + Magic              │
└──────────────────────────────────────────────────────────────┘
```

**Koordinering:**
- Ulike filer per team → ingen merge-konflikter
- Branch-strategi: `launch/team-1-missing-pages`, `launch/team-2-hygiene`, etc.
- Daily check-in via `/dev-status` skill
- Design-track merger kun CSS/layout, teknisk-track merger logikk/ruter

---

## TEAM 1: Missing Pages

**Lead agent:** `dev-tech-lead`
**Branch:** `launch/team-1-missing-pages`
**Estimert tid:** 1-2 dager
**Scope:** Bygg manglende sider med full funksjonalitet. Bruk Brand Guide V2.0-farger direkte, men minimal polish — design-terminal finpusser visuelt etterpå.

### 1.1 `/auth/register` — Ny bruker-registrering

**Sub-agent:** `general-purpose`
**Filer:**
- `app/auth/register/page.tsx` (ny)
- `app/auth/register/actions.ts` (ny)
- `lib/portal/auth.ts` (utvide hvis nødvendig)

**Krav:**
- E-post + passord-felt
- Validering (Zod schema)
- Supabase signup via `supabase.auth.signUp()`
- E-post verifikasjon (bekreftelses-e-post via Resend)
- Redirect til `/auth/callback` ved suksess
- Error handling (duplikat e-post, svakt passord)
- Rate limit via `checkRateLimit()`

**Schema:**
```ts
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  phone: z.string().optional(),
  acceptTerms: z.literal(true),
});
```

**Deliverables:**
- Fungerende signup-flow
- E-post sendes ved suksess
- Ny User opprettes automatisk via auth-hook

### 1.2 `/auth/forgot-password` — Glemt passord

**Sub-agent:** `general-purpose`
**Filer:**
- `app/auth/forgot-password/page.tsx` (ny)
- `app/auth/forgot-password/actions.ts` (ny)

**Krav:**
- E-post-felt
- Server action kaller `supabase.auth.resetPasswordForEmail()`
- Redirect-URL: `/auth/set-password` (finnes allerede)
- Generic success-melding (ikke røpe om e-post finnes)
- Rate limit

**Deliverables:**
- Reset-lenke sendes
- `set-password` flow fungerer ende-til-ende

### 1.3 `/portal/(dashboard)/admin/page.tsx` — Admin Hub

**Sub-agent:** `dev-tech-lead`
**Filer:**
- `app/portal/(dashboard)/admin/page.tsx` (eksisterer men må verifiseres)
- Eventuelt nytt innhold

**Krav:**
- KPI-kort: antall bookinger i dag, nye elever denne uken, inntekt denne måneden, ikke-leste meldinger
- Dagens sesjoner-liste (via Prisma-query)
- Raske lenker til alle admin-seksjoner
- Aktivitet-feed
- Krever `canAccessMissionControl()` for tilgang

**Data-queries:**
```ts
- Booking count where date === today AND status === CONFIRMED
- User count where createdAt > 7 days ago
- PaymentTransaction sum where month === currentMonth
- Notification count where isRead === false
```

### 1.4 Admin mission-board

**Sub-agent:** `Explore` først — bestem om siden skal lanseres
**Beslutning:** Hvis ikke kritisk → merk som "kommer senere" med placeholder, fjern fra nav hvis mulig

---

## TEAM 2: Code Hygiene

**Lead agent:** `dev-tech-lead`
**Branch:** `launch/team-2-hygiene`
**Estimert tid:** 1-2 dager
**Scope:** Fjerne teknisk gjeld. Fokus på kode-nivå, ikke visuell design.

### 2.1 Global farge-migrasjon (code level)

**Sub-agent:** `general-purpose` med søk-og-erstatt-mandat

**Mapping (kun tekniske erstatninger — visuell tuning skjer i design-terminal):**
| Gammel | Ny | Bruk |
|--------|-----|------|
| `#1D1D1F` | `#0A1F18` | Mørkeste svart |
| `#F5F5F7` | `#ECF0EF` | Lys bakgrunn |
| `#E8E8ED` | `#D5DFDB` | Border |
| `#86868B` | `#7A8C85` | Grey-400 |
| `#6E6E73` | `#5A6E66` | Grey-500 |
| `#2D6A4F` | `#005840` | Brand primary |

**Regler:**
- Bare kode-filer: `*.tsx`, `*.ts`, `*.css`
- Ikke rør `design-ref/`, `.next/`, `node_modules/`
- Verify med `grep -r "#1D1D1F\|#F5F5F7\|#2D6A4F"` etter
- Test build etter migrasjon

### 2.2 Fjern emojier fra UI

**Sub-agent:** `general-purpose`

**Søk:** Unicode-emojier i tekstinnhold
```bash
grep -rP "[\x{1F300}-\x{1F9FF}]" app/ components/ lib/website-constants.ts --include='*.tsx' --include='*.ts'
```

**Hovedlokasjon:** `app/junior-academy/page.tsx` har 🌱☀️🍂❄️ (sesongsymboler)

**Erstatning:**
- Bruk Lucide-ikoner (`Leaf`, `Sun`, `Wind`, `Snowflake`)
- Eller rene tekstlabels

### 2.3 Rydd udefinerte CSS-variabler

**Sub-agent:** `general-purpose`

**Fjern:**
- `--ink-*` (aldri definert)
- `--gold-*` (droppet)
- `--hg-*` (Heritage Grid, droppet)
- `--apple-gold-*` (droppet)

**Verify:**
```bash
grep -r "var(--ink\|var(--gold\|var(--hg\|var(--apple-gold" app/ components/ --include='*.tsx' --include='*.ts' --include='*.css'
```

### 2.4 TypeScript og lint

**Sub-agent:** `test-runner`
- `npx tsc --noEmit` — fiks kritiske feil (ikke pre-eksisterende som er i annet arbeid)
- `npm run lint` — fiks advarsler der det er raskt
- Ikke introduser nye `any`-typer

---

## TEAM 3: Test & QA

**Lead agent:** `test-runner`
**Branch:** `launch/team-3-qa`
**Estimert tid:** 1 dag
**Scope:** Verifisere at alle kritiske flows fungerer ende-til-ende.

### 3.1 E2E — Booking-flyt

**Sub-agent:** `test-runner`
**Scenario (manuell + test-script):**
1. Naviger til `/booking`
2. Velg Performance Pro
3. Velg tid 3 dager frem
4. Fyll inn gjest-info (navn, e-post, telefon)
5. Klikk "Bekreft og betal"
6. Sjekk at booking opprettes i DB med status `PENDING`
7. Betal via Stripe Checkout (bruk test-kort `4242 4242 4242 4242`)
8. Verifiser webhook mottatt (`/api/portal/webhooks/stripe`)
9. Sjekk at status → `CONFIRMED`
10. Sjekk at bekreftelses-e-post sendes
11. Sjekk at confirmation-siden viser riktig

**Leveranse:** Sjekkliste med pass/fail per steg

### 3.2 E2E — Auth

**Scenarios:**
1. Login med passord — redirect til `/portal`
2. Login med magic link — e-post mottas, klikk-gjennom, redirect
3. Register ny bruker — e-post verifikasjon
4. Forgot password — reset-e-post mottatt, passord endret
5. Logout

### 3.3 E2E — Admin booking

1. Login som ADMIN
2. Naviger til `/portal/admin/bookinger`
3. Endre tid på eksisterende booking
4. Avbestill booking → verify refund
5. Marker som no-show
6. Se at statistikk oppdateres

### 3.4 API health-check

**Sub-agent:** `test-runner`

```bash
# Public
curl http://localhost:3000/api/portal/public/service-types
curl http://localhost:3000/api/portal/public/slots
curl http://localhost:3000/api/portal/public/instructors

# Protected (expect 401/403 uten auth)
curl http://localhost:3000/api/portal/bookings/live
curl http://localhost:3000/api/portal/notifications
```

### 3.5 Database-integritet

**Sub-agent:** `supabase-expert`
- Sjekk at alle FK-constraints holder
- Finn orphan-records
- Verify indexes på kritiske queries (booking.startTime, user.email, etc.)
- Sjekk at cron-jobs ikke har kjort feil

---

## TEAM 4: Security & Performance

**Lead agent:** `dev-tech-lead`
**Branch:** `launch/team-4-security`
**Estimert tid:** 1 dag
**Scope:** Sikkerhet + ytelse før lansering.

### 4.1 API-sikkerhet audit

**Sub-agent:** `code-reviewer`

**Sjekkliste:**
- [ ] Alle `/api/portal/*` krever `getPortalUser()` eller `requirePortalUser()`
- [ ] Admin-only endepunkter sjekker `isStaff()` eller `isAdmin()`
- [ ] Rate limit på ALLE offentlige endepunkter
- [ ] Ingen brukerinput reflekteres i feilmeldinger uten escape
- [ ] CSRF-beskyttelse på server actions
- [ ] Secrets ikke logget (grep for `console.log` med env-vars)

### 4.2 Env-variabel audit

**Sub-agent:** `general-purpose`

**Sjekk:**
- `.env.example` er komplett og oppdatert
- Vercel har alle nødvendige vars satt i Production environment
- Ingen hardkodede secrets i kode (grep for API keys, tokens)
- Supabase service role key ikke brukt i client components

### 4.3 Performance audit

**Sub-agent:** `test-runner`

**Kjør:**
```bash
# Build
npm run build

# Bundle size
npx next build --profile

# Lighthouse (via Chrome DevTools MCP)
# - Forside: mål FCP < 1.5s, LCP < 2.5s, CLS < 0.1
# - Booking: mål fastest meaningful paint < 2s
# - Portal dashboard: mål < 3s (har mer data)
```

### 4.4 Accessibility scan

**Sub-agent:** `test-runner`

**Sjekk:**
- Tastatur-navigasjon fungerer pa alle sider
- Focus-states synlige
- Alt-text pa alle bilder
- ARIA-labels pa ikon-knapper
- Kontrast 4.5:1 minimum

---

## TEAM 5: Launch Prep

**Lead agent:** `dev-tech-lead`
**Branch:** `main` (final merge)
**Estimert tid:** 0.5 dag
**Scope:** Alt som må være klart for go-live.

### 5.1 Cleanup working tree

**Sub-agent:** `general-purpose`

**Håndter 46+ ucommittede filer:**
- Gjennomgå hver fil
- Kategoriser: keep, discard, needs-work
- Commit relaterte endringer i logiske grupper
- Stash eller discard søppel

### 5.2 Dokumentasjon

- `README.md` oppdatert med deploy-instruksjoner
- `.env.example` komplett og dokumentert
- `docs/launch/LAUNCH_CHECKLIST.md` (denne filen)

### 5.3 Feature flags og maintenance mode

**Sjekk:**
- `NEXT_PUBLIC_MAINTENANCE_MODE=false` i Production
- `MAINTENANCE_BYPASS_KEY` satt
- Alle feature flags gjennomgått og satt riktig

### 5.4 Cron-jobs verifisert

**Sjekk `vercel.json`:**
- `/api/portal/cron/ai-insights` — mandager 06:00 UTC
- `/api/portal/cron/weekly-summary` — søndager 18:00 UTC
- `/api/portal/cron/send-reminders` — hver time
- `/api/portal/cron/sync-notion` — hver time (NY)

### 5.5 Error-sider

**Verify:**
- `app/not-found.tsx` — custom 404
- `app/global-error.tsx` — 500-side
- `app/error.tsx` — client-side feil

### 5.6 Metadata / SEO

**Sjekk alle sider:**
- `<title>` satt
- `<meta description>` satt
- Open Graph-tags pa markedssider
- `robots.txt` og `sitemap.ts` oppdatert

### 5.7 Final build + staging deploy

```bash
# Local
npm run build
npm run start

# Deploy til preview branch pa Vercel
vercel --prod=false

# Test preview URL grundig
# Hvis alt OK → merge til main → auto-deploy Production
```

---

## Timeline (samlet)

```
Dag 1 (mandag)
├─ 08:00  Team 1 starter (missing pages)
├─ 08:00  Team 2 starter (code hygiene)
├─ 16:00  Team 1 + 2 progress review
└─ 18:00  Commit + push til respektive branches

Dag 2 (tirsdag)
├─ 08:00  Team 1 fullfort, Team 3 starter (QA)
├─ 08:00  Team 2 fullfort, Team 4 starter (security)
├─ 14:00  Merge Team 1 + 2 til main
└─ 18:00  Design-track henter fra main

Dag 3 (onsdag)
├─ 08:00  Team 3 + 4 fullfort
├─ 10:00  Merge Team 3 + 4 til main
├─ 13:00  Team 5 starter (launch prep)
└─ 18:00  Staging deploy + test

Dag 4 (torsdag)
├─ 08:00  Buffer-dag for fiks etter staging-test
├─ 14:00  Koordinering med design-track
└─ 18:00  Final build + siste QA

Dag 5 (fredag)
├─ 09:00  Go-live check
├─ 10:00  Deploy til Production
├─ 11:00  Smoke-test Production
└─ 12:00  Lansert
```

---

## Koordinering med design-track

**Regler for ingen merge-konflikter:**

| Team | Filer vi kan endre | Filer design-track har |
|------|--------------------|------------------------|
| Team 1 | Nye sider i `app/auth/*`, admin-logikk | - |
| Team 2 | Logikk-filer, CSS-variabel-definisjoner | Visual styling per komponent |
| Team 3 | `__tests__/`, `e2e/` | - |
| Team 4 | `lib/portal/rate-limit.ts`, auth | - |
| Team 5 | `docs/`, `vercel.json`, `.env.example` | - |

**Avtalt konvensjon:**
- Design-track jobber på `design/*` branches
- Teknisk-track jobber på `launch/*` branches
- Merge til main skjer i avtalt rekkefølge (teknisk først, deretter design)
- Ved tvist: teknisk har prioritet pa logikk, design har prioritet pa visuell stil

---

## Risiko-register

| Risiko | Sannsynlighet | Impact | Mitigering |
|--------|---------------|--------|------------|
| Design-track endrer filer vi trenger | Medium | Høy | Branch-strategi + daglig sync |
| Stripe webhook feiler i produksjon | Lav | Kritisk | Grundig test i staging |
| Supabase rate limit ved stor trafikk | Lav | Høy | Rate limit på våre API-ruter |
| Build-feil ved merge | Medium | Medium | Kjør build før hver merge |
| Ucommittede filer med skjulte endringer | Høy | Medium | Team 5 prioriterer cleanup |

---

## Success criteria

**Plattformen er lansering-klar nar:**

- [ ] Alle 4 manglende sider finnes og fungerer
- [ ] Ingen `#1D1D1F`, `#F5F5F7`, `#2D6A4F` i kode (unntatt design-ref)
- [ ] Ingen emojier i UI-filer
- [ ] Ingen `--ink-*`, `--gold-*`, `--hg-*` variabler
- [ ] TypeScript bygger uten nye feil
- [ ] E2E booking-flyt passerer (opprett → betal → bekreft)
- [ ] Auth-flows passerer (login, register, reset)
- [ ] Admin booking-håndtering fungerer
- [ ] Alle API-ruter har auth + rate limit
- [ ] Lighthouse-score: Performance > 80, Accessibility > 90
- [ ] Staging deploy gronn
- [ ] Design-track er fornoyd med teknisk base
- [ ] README og docs oppdatert

---

## Neste steg

1. Bekreft plan med bruker
2. Opprett teams via `TeamCreate`
3. Spawn sub-agenter per team
4. Start parallell utforelse
5. Daily check-ins
