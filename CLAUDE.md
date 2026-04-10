@.claude/rules/gotchas.md
@.claude/rules/prisma-auth.md
@.claude/rules/code-style.md
@.claude/rules/architecture.md

# AK Golf Platform

Premium golfcoaching-plattform. Markedsside + spillerportal + admin (Mission Control).

## Regler

1. Les `.claude/rules/gotchas.md` for kjente feller
2. Sjekk `prisma/schema.prisma` for modeller og enums
3. Markedsside-tekst i `lib/website-constants.ts`, aldri hardkodet
4. Nye feil → legg til i `gotchas.md` umiddelbart

## Tech Stack

Next.js 16 (App Router, Turbopack) | React 19 | Tailwind CSS v4 | Prisma + PostgreSQL | Supabase Auth | Stripe | Anthropic Claude | Resend | Twilio | Framer Motion 12 | TypeScript strict

## Kommandoer

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Prod build (prisma generate + build)
npm run lint     # ESLint
```

## Arkitektur

**Markedsside** (`/`, `/academy`, `/junior-academy`, `/utvikling`, `/booking`) — åpen
**Portal** (`/portal/(dashboard)/*`) — krever innlogging via `requirePortalUser()`
**Admin** (`/portal/(dashboard)/admin/*`) — Mission Control, RBAC via `canAccessMissionControl()`
**API** (`/api/*`) — Se `app/api/` for endepunkter. Public: `/api/portal/public/*`

## Auth

Supabase Auth → `requirePortalUser()` i server components. `proxy.ts` for edge-redirects. Ingen middleware.ts.

## Design

"Sort. Hvit. En gronn." — Se `docs/ART-DIRECTION.md` og `code-style.md`.
- Brand: #005840 (kun logo, nav, CTA)
- Font: Inter via next/font/google
- Success: #2A7D5A | Error: #B84233 | AI: #AF52DE
- Aldri emojier, aldri sertifiseringer, aldri MVA på kundesider

## Konvensjoner

- Norsk bokmål for all brukervendt tekst
- Server Actions i `actions.ts` per rute
- Prisma singleton: `import { prisma } from "@/lib/portal/prisma"`
- Prisma-relasjoner: PascalCase (`User`, `CoachingPackage`)
- E-post: React Email i `lib/portal/email/templates/`
- Env-variabler: se `.env.example`
