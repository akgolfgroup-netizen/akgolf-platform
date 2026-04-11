# AK Golf Platform

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
| `design-system.md` | Fargetokens, typografi, spacing, knapper, shadows, z-index |
| `ui-patterns.md` | Portal-kort, stat-kort, MC sidebar, markedsside-mønstre |

**Ufravikelig:** Nye feil → legg til i `gotchas.md` umiddelbart.

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
7. Maks 300 linjer per fil — splitt ved behov

## Konvensjoner

- Norsk bokmål for all brukervendt tekst
- Server Actions i `actions.ts` per rute
- Prisma singleton: `import { prisma } from "@/lib/portal/prisma"`
- Prisma-relasjoner: PascalCase (`User`, `CoachingPackage`)
- E-post: React Email i `lib/portal/email/templates/`
- Design: "Sort. Hvit. Én grønn." — se `design-system.md` og `docs/ART-DIRECTION.md`
- Aldri emojier, aldri sertifiseringer, aldri MVA på kundesider

## Commit-konvensjoner

| Prefix | Bruk |
|--------|------|
| `feat` | Ny funksjonalitet |
| `fix` | Feilretting |
| `refactor` | Kodeendring uten ny funksjonalitet |
| `docs` | Dokumentasjon |

Format: `<prefix>: kort beskrivelse` — f.eks. `feat: booking reschedule i Mission Control`
