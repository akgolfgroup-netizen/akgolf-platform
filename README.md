# AK Golf Platform

Premium golfcoaching-plattform for AK Golf Group. Norskspråklig markedsside med komplett portal/dashboard-system for elever og instruktører.

## Tech Stack

- **Next.js 16** (App Router, Turbopack) + TypeScript
- **React 19** + Framer Motion 12
- **Tailwind CSS v4** (inline theme tokens)
- **Font:** Inter (Google Fonts)
- **Database:** PostgreSQL + Prisma ORM
- **AI:** Anthropic Claude (coaching-analyse, treningsplaner)
- **Payments:** Stripe + Vipps
- **Auth:** Supabase Auth
- **Email:** Resend
- **Linting:** ESLint 9 + eslint-config-next

## Kom i gang

```bash
npm install
cp .env.example .env.local
# Fyll inn miljøvariabler i .env.local
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev       # Utviklingsserver (Turbopack)
npm run build     # Produksjonsbygg
npm run lint      # ESLint
npm run seed      # Seed database (prisma/seed-config.ts)
npm run kimi      # Start Kimi Code CLI (AI-assistert kodegenerering)
npm run kimi:login # Start Kimi + login
```

### Kimi Code CLI

**Kimi** er AI-assistert kodegenerering for terminal. Bruk det til å:
- Generere React-komponenter
- Skrive API-ruter
- Analysere og debugge kode
- Effektivisere utvikling

```bash
npm run kimi
```

Se `.kimi/KIMI_SETUP.md` og `.kimi/AKGOLF_INSTRUCTIONS.md` for detaljer.

## Prosjektstruktur

```
app/
  page.tsx               # Forside
  academy/               # Coaching-side
  junior-academy/        # Junior Academy
  utvikling/             # B2B for klubber
  booking/               # Offentlig booking
  portal/                # Spillerportal (innlogget)
  api/                   # API-ruter
components/
  website/               # Markedsside-komponenter
  portal/                # Portal-komponenter
  ui/                    # UI bibliotek
lib/
  website-constants.ts   # Tekst, priser, kontaktinfo
  design-tokens.ts       # Design tokens
  portal/                # Portal-utils (auth, prisma, etc.)
prisma/
  schema.prisma          # Database-skjema
  seed-config.ts         # Seed-konfigurasjon
```

## Design System

Se `docs/ART-DIRECTION.md` for komplett design-spesifikasjon.

### Farger (Brand Guide 2026)
- **Black:** `#1D1D1F` (tekst, knapper)
- **White:** `#FFFFFF` (bakgrunn)
- **Grey:** `#F5F5F7`, `#E8E8ED`, `#6E6E73` (overflater, tekst)
- **Brand Green:** `#005840` (logo, CTA)
- **Success:** `#2A7D5A` | **Error:** `#B84233` | **AI:** `#AF52DE`

### Typografi
- **Font:** Inter (variable, 300-700)
- **Headings:** Weight 700, tight letter-spacing
- **Body:** Weight 400, 16px

## Dokumentasjon

| Fil | Beskrivelse |
|-----|-------------|
| `CLAUDE.md` | Hoveddokumentasjon for utviklere |
| `docs/ART-DIRECTION.md` | Visuell retning, farger, komponenter |
| `docs/DESIGN-SYSTEM-CLAUDE.md` | Tekniske design-tokens |
| `docs/claude-project-instructions.md` | Prosjektkontekst |
| `.claude/rules/gotchas.md` | Kjente feller |

## Oppsett

1. Kjør `./setup.sh` for initial oppsett
2. Rediger `prisma/seed-config.ts` med dine priser
3. Kjør `npx prisma db seed`
4. Fyll inn `.env.local` med API-nøkler

Se `.env.example` for påkrevde miljøvariabler.

## Lisens

Private — AK Golf Group AS.
