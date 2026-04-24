# AK Golf Platform

## Parallell-arbeidsregler (Cherny-style)

> **VIKTIG:** Denne Claude-økten kjører i EN git worktree. Aldri les/skriv filer utenfor `$PWD`.

### Worktree-isolasjon
- Jeg ser KUN filer i gjeldende worktree (`$PWD`)
- Jeg skriver ALDRI til andre worktrees (f.eks. `../akgolf-platform-*`)
- `node_modules` er lokal per worktree — ikke slett eller endre den

### Før hver oppgave
1. Les `WORKLOG.md` for kontekst
2. Sjekk `git status` — skal være rent
3. Hvis oppgaven er kompleks (>10 filer): be om Plan Mode først

### Etter hver oppgave
1. Kjør `npm run lint` og `npm run test` (hvis relevant)
2. Kjør `git diff --stat` — bekreft at kun forventede filer er endret
3. Commit: `feat/fix/refactor: beskrivelse`
4. Oppdater `WORKLOG.md` med hva som ble gjort

### Når jeg er usikker
- Stopp og spør, ikke gjett
- Aldri endre eksisterende API-kontrakter uten eksplisitt tillatelse
- Aldri slett `.env`-filer eller `prisma/migrations/`


> 🚀 **START HER:** Les alltid `WORKLOG.md` først for å se hva som ble jobbet med sist. Deretter les `.claude/rules/design-system.md` hvis oppgaven involverer UI.

Premium golfcoaching-plattform med markedsside, spillerportal og admin (Mission Control).

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript strict |
| Styling | Tailwind CSS v4, Framer Motion 12 |
| Database | Prisma + PostgreSQL (Supabase) |
| Auth | Supabase Auth |
| Betaling | Stripe |
| AI | Anthropic Claude |
| E-post/SMS | Resend, Twilio |

## Kommandoer

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Prod build (prisma generate + build)
npm run lint     # ESLint
```

## Arkitektur

| Område | Ruter | Tilgang |
|--------|-------|---------|
| Markedsside | `/`, `/academy`, `/junior-academy`, `/utvikling`, `/booking` | Åpen |
| Portal | `/portal/(dashboard)/*` | `requirePortalUser()` |
| Admin | `/portal/(dashboard)/admin/*` | `canAccessMissionControl()` |
| API | `/api/*` | Public: `/api/portal/public/*` |

Auth: Supabase → `requirePortalUser()` i server components. `proxy.ts` for edge-redirects. Ingen middleware.ts.

## Regler

All detaljert regelinformasjon ligger i `.claude/rules/`:

| Fil | Innhold |
|-----|---------|
| `gotchas.md` | Kjente feller — Turbopack, auth, priser, CSS, komponenter |
| `prisma-auth.md` | Supabase ID vs Prisma ID, enum-verdier, create-regler |
| `code-style.md` | TypeScript, komponent-organisering, styling, animasjoner |
| `architecture.md` | Mappestruktur, auth-flyt, API-mønstre, roller, integrasjoner |
| `design-system.md` | **ENESTE gjeldende design-system** — Heritage M3-tokens, DM Sans, Material Symbols, kildebilder |
| `component-library.md` | Eksisterende komponenter — sjekk før du lager nye |

**Ufravikelig:** Nye feil → legg til i `gotchas.md` umiddelbart.

> ⚠️ **VIKTIG:** Alle tidligere design-docs (`docs/DESIGN_SYSTEM.md`, `docs/design-system-v3.1.md`, `docs/DESIGN_REDIGN_PLAN_2026.md`, `docs/BRANDING-BOOKING.md`, `.claude/rules/ui-patterns.md`, `.claude/rules/premium-design-patterns.md`) er **arkivert** under `docs/archive-2026-04-24/` og `docs/archive-2026-04-21/`. Bruk KUN `.claude/rules/design-system.md` (Heritage).

## Prosjektstatus

Se `docs/status/` for oppdatert status:

| Fil | Innhold |
|-----|---------|
| `BACKLOG.md` | Prioritert arbeidsliste (P1/P2/P3) |
| `PORTAL_AUDIT.md` | Spillerportal — status per side |
| `ADMIN_AUDIT.md` | Mission Control — status per side |
| `BOOKING_AUDIT.md` | Booking-system og Stripe-integrering |

## Arbeidsflyt

1. Les `docs/status/BACKLOG.md` før du starter en oppgave
2. Sjekk `docs/component-library.md` før du bygger nye komponenter
3. Sjekk `prisma/schema.prisma` for modeller og enums
4. Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet
5. Oppdater `docs/component-library.md` etter nye komponenter
6. Oppdater `docs/status/` etter ferdig arbeid
7. Ved arbeid med USI/DataGolf/TrackMan/treningsplanlegging: konsulter `docs/strategy/MASTERDOCUMENT_DATA_BRIDGE.md`
8. Maks 300 linjer per fil — splitt ved behov

## Konvensjoner

- Norsk bokmål for all brukervendt tekst
- Server Actions i `actions.ts` per rute
- Prisma singleton: `import { prisma } from "@/lib/portal/prisma"`
- Prisma-relasjoner: PascalCase (`User`, `CoachingPackage`)
- E-post: React Email i `lib/portal/email/templates/`
- Design: Heritage M3 — se `.claude/rules/design-system.md`
- Aldri emojier, aldri sertifiseringer, aldri MVA på kundesider

## Commit-konvensjoner

| Prefix | Bruk |
|--------|------|
| `feat` | Ny funksjonalitet |
| `fix` | Feilretting |
| `refactor` | Kodeendring uten ny funksjonalitet |
| `docs` | Dokumentasjon |

Format: `<prefix>: kort beskrivelse` — f.eks. `feat: booking reschedule i Mission Control`

## Fortsett der du slapp

Siste arbeidslogg finnes i **`WORKLOG.md`** i rot-mappen. Les alltid denne først ved oppstart.

### Viktige filområder per modul

| Modul | Mapper / filer |
|-------|----------------|
| **Landingsside** | `app/landing/`, `app/page.tsx`, `components/website/` |
| **Booking** | `app/booking/`, `components/booking/`, `lib/booking-config.ts` |
| **Spillerportal** | `app/portal/(dashboard)/`, `components/portal/` |
| **Mission Control (admin)** | `app/admin/`, `components/portal/mission-control/`, `components/portal/admin/` |
| **API** | `app/api/`, `lib/portal/` |
| **Design-system** | `.claude/rules/design-system.md`, `app/globals.css`, `lib/design-tokens.ts` |
| **Database** | `prisma/schema.prisma` |

### Hurtigkommando for å finne siste arbeid
```bash
git log --oneline -10          # Siste commits
cat WORKLOG.md                  # Siste arbeidslogg
```
