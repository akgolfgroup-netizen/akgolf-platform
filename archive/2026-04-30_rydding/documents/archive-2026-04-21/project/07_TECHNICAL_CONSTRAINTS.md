# Tekniske begrensninger

## Tech Stack

| Lag | Teknologi |
|-----|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Database | PostgreSQL via Prisma ORM |
| Auth | Supabase Auth (e-post/passord + OAuth) |
| Betaling | Stripe (Checkout, webhooks, refunds) |
| AI | Anthropic Claude (coaching-analyse) |
| E-post | Resend + React Email |
| SMS | Twilio |
| Animasjoner | Framer Motion 12 |
| Analytics | Vercel Analytics + Microsoft Clarity |
| Deploy | Vercel |

## Plattform
- **Web** (responsiv, mobile-first)
- **PWA** via manifest.json (installerbar, men ikke native app)
- Ingen native iOS/Android-app

## Komponentbibliotek
- `components/ui/` — shadcn/ui base (button, card, input, badge)
- `components/portal/apple/` — AppleButton, AppleCard, AppleBadge, BentoCard, StatCard
- `components/portal/mission-control/ui/` — MC-spesifikke komponenter
- `components/motion/` — Framer Motion wrappers (FadeIn, SlideUp, StaggerContainer)

## Auth-begrensninger
- Supabase Auth (ikke NextAuth) — session-basert, ikke JWT
- `proxy.ts` for edge-redirects (ikke middleware.ts — Next.js 16 krav)
- Ingen rolle-basert tilgang pa edge — RBAC sjekkes i server components
- Auto-opprett bruker ved forste innlogging (koble Supabase → Prisma via e-post)

## Database-begrensninger
- Prisma ORM med `@prisma/adapter-pg` (ikke standard Prisma Client)
- Relasjoner bruker PascalCase (`User`, `CoachingPackage`)
- Mange modeller krever manuell `id: nanoid()` og `updatedAt: new Date()`
- BigInt for byte-felter (videoStorageLimit)
- Priser lagret i kroner (ikke ore)

## Backend / API
- Server Components for data-henting (ingen REST for sidevisning)
- Server Actions (`actions.ts`) for mutasjoner
- API Routes kun for: webhooks, cron, ekstern integrasjon, public data
- `maxDuration = 60` for AI-endepunkter (Anthropic kan vaere treg)
- Rate limiting pa alle offentlige endepunkter

## Datakilder
| Kilde | Bruk |
|-------|------|
| PostgreSQL (Supabase) | All forretningsdata |
| Stripe | Betalinger, abonnementer |
| Anthropic Claude | AI-analyse, treningsplaner |
| GolfBox | Handicap-data (ekstern API) |
| DataGolf | PGA Tour benchmarks |
| Google Calendar | Kalender-synk (OAuth) |
| TrackMan | CSV/bilde-import (manuell) |

## Hva som er dyrt eller vanskelig

| Feature | Kostnad/Kompleksitet | Grunn |
|---------|---------------------|-------|
| AI-analyse | Hoy API-kostnad | Anthropic Claude per kall |
| Video-analyse | Kompleks | Krever lagring, prosessering |
| Sanntids-chat | Kompleks | Krever WebSocket/SSE |
| Native app | Svart dyrt | Dobbel kodebase |
| Multi-tenant | Arkitektur-endring | Database-isolasjon, billing |
| Vipps-integrasjon | Middels | Norsk-spesifikk API, sertifisering |

## Begrensninger for design
- Ingen dark mode (kun lys)
- Kun Inter font (ingen sekundaerfont)
- Lucide icons (ingen egendefinerte ikonsett)
- Ingen bilder i portal (kun data og ikoner)
- Bilder kun pa markedsside (profesjonell fotografering)
- Server Components kan ikke sende funksjoner til Client Components (ikon-map-pattern)
- Client Components kan ikke importere Prisma/Node.js-moduler
