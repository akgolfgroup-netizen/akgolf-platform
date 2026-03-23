# AK Golf Website & Portal

Premium golfcoaching-plattform for AK Golf Group. Norskspråklig markedsside med undersider (Academy, Junior, Utvikling, Personvern) pluss et komplett portal/dashboard-system for elever og instruktører.

## Tech Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **React:** 19.2.3
- **Styling:** Tailwind CSS v4 (inline theme tokens i `globals.css`)
- **Database:** PostgreSQL via Prisma ORM (`@prisma/adapter-pg`)
- **Auth:** Supabase Auth (OAuth + email/password, ingen NextAuth)
- **Payments:** Stripe (checkout, webhooks, refunds)
- **AI:** Anthropic Claude (`@anthropic-ai/sdk`) — coaching-analyse, treningsplaner, svakhetsanalyse
- **Email:** Resend med React Email-maler
- **SMS:** Twilio (booking-påminnelser)
- **Content:** Notion API (spillerprofiler, innhold)
- **Golf data:** DataGolf API
- **Animations:** Framer Motion 12.x
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer
- **Fonts:** Inter (variabel, via `next/font/local` — InterVariable.woff2)
- **TypeScript:** strict
- **Linting:** ESLint 9 + eslint-config-next

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build (runs prisma generate first)
npm run lint     # ESLint
npm run seed     # Seed database (tsx prisma/seed-simple.ts)
```

## Architecture

### App Router Structure

```
app/
├── globals.css              # Design tokens, base styles, CSS-komponenter
├── layout.tsx               # Root layout, fonts, metadata, JSON-LD
├── page.tsx                 # Forsiden (hero, stats, metode, grunnlegger, testimonials, CTA)
├── icon.tsx                 # Dynamisk favicon (K-mark SVG)
├── not-found.tsx            # Custom 404
├── global-error.tsx         # Global error boundary
├── sitemap.ts / robots.ts   # SEO (MetadataRoute)
│
├── academy/                 # Academy-underside (accent: navy #0F2950)
│   ├── page.tsx / layout.tsx
│   └── booking/page.tsx     # Academy booking
├── junior/                  # Junior-underside (accent: blue #3B82F6)
├── utvikling/               # Utvikling-underside (accent: green #22C55E + purple #8B5CF6)
├── personvern/              # Personvernerklæring
│
├── auth/                    # Autentisering (Supabase)
│   ├── login/page.tsx
│   ├── callback/route.ts    # OAuth callback
│   └── set-password/page.tsx
│
├── booking/                 # Offentlig bookingflyt
│   ├── page.tsx             # Velg tjeneste/instruktør
│   ├── new/page.tsx         # Ny booking (flerstegs skjema)
│   ├── [id]/pay/            # Stripe-betaling
│   ├── [id]/confirmation/   # Bekreftelse
│   ├── components/          # Booking-spesifikke komponenter
│   └── types.ts
│
├── portal/                  # Portal/dashboard (beskyttet)
│   ├── login/page.tsx       # Portal-innlogging
│   ├── layout.tsx           # Portal root layout
│   └── (dashboard)/         # Route group med sidebar
│       ├── page.tsx         # Dashboard-hjem
│       ├── layout.tsx       # Dashboard layout med sidebar
│       ├── admin/           # Admin-seksjon
│       │   ├── denne-uken/  # Ukesoversikt
│       │   ├── bookinger/   # Booking-håndtering (+ny)
│       │   ├── elever/      # Elevliste + [id]-detaljer
│       │   ├── kalender/    # Kalenderstyring
│       │   ├── tilgjengelighet/ # Tilgjengelighetsstyring
│       │   └── turneringer/ # Turneringsstyring
│       ├── analyse/         # Statistikk & AI-analyse
│       ├── bookinger/       # Elevens bookinger (+ny, [id]/endre)
│       ├── coaching-historikk/ # Coaching-historikk
│       ├── dagbok/          # Treningsdagbok
│       ├── kalender/        # Kalender/timeplan
│       ├── profil/          # Profil & mål
│       ├── sammenligning/   # Sammenligning med peers
│       ├── statistikk/      # Strokes Gained-statistikk
│       ├── treningsplan/    # AI-genererte treningsplaner
│       └── turneringsplan/  # Turneringsplanlegging
│
└── api/                     # API-ruter
    ├── auth/logout/         # Utlogging
    ├── contact/             # Kontaktskjema → Resend
    ├── booking/             # create, services, reschedule
    └── portal/
        ├── public/          # Åpne endepunkter (slots, instructors, service-types, etc.)
        ├── ai/              # AI-endepunkter (coaching-summary, focus, weakness, training-plan)
        ├── bookings/cancel/ # Kansellering
        ├── dagbok/          # Treningsdagbok
        ├── calendar/        # iCal-feed + token
        ├── cron/            # Planlagte påminnelser
        ├── datagolf/        # DataGolf-integrasjon
        ├── tournament-planner/ # Turneringsplanlegging CRUD
        └── webhooks/stripe/ # Stripe webhook
```

### Source Structure

```
components/
├── website/               # Markedsside-komponenter (27 stk)
│   ├── AKLogo.tsx         # Kalligrafisk K-mark SVG
│   ├── WebsiteNav.tsx     # Navigasjon
│   ├── WebsiteFooter.tsx  # Footer
│   ├── ApplicationForm.tsx # Søknadsskjema (defaultProgram-prop)
│   ├── RevealOnScroll.tsx # Scroll-animasjon
│   └── ...                # CTASection, FAQAccordion, PricingCard, etc.
├── portal/                # Portal-komponenter
│   ├── admin/             # Admin: booking-list, calendar, availability, student-list
│   ├── analyse/           # Handicap-chart, AI-weakness-card, heatmap
│   ├── booking/           # Cancel, reschedule
│   ├── bookinger/         # Booking-card, booking-list
│   ├── coaching-historikk/ # AI-summary, session-card
│   ├── dagbok/            # Training-log-card, log-session-sheet
│   ├── dashboard/         # Dashboard-cards
│   ├── kalender/          # Calendar views, event-chip, periodization-band
│   ├── layout/            # Sidebar, topbar
│   ├── profil/            # Profile-card, goal-modal, achievement-grid, focus-recommendation
│   ├── sammenligning/     # Radar-chart, peer-summary, comparison-selector
│   ├── statistikk/        # SG-radar, round-input, stats-overview
│   ├── treningsplan/      # AI-generate-button, week-view
│   ├── ui/                # Fancy UI: 3d-card, shimmer-button, magic-card, tier-gate
│   └── providers.tsx      # React context providers
├── motion/                # Framer Motion wrappers: FadeIn, StaggerContainer, SlideUp, ScaleOnHover
└── ui/                    # Base UI: badge, button, card, input, section

hooks/
├── useAnimatedCounter.ts
├── useMediaQuery.ts
└── useScrollPosition.ts

lib/
├── website-constants.ts   # Alt markedsside-tekstinnhold, priser, FAQ, kontaktinfo
├── design-tokens.ts       # Design system tokens
├── utils.ts               # Generelle utilities
├── notion.ts              # Notion API-integrasjon
├── ai/                    # AI: system-prompt, generate-plan, plan-schema, category-engine
├── pdf/                   # PDF-generering
├── stripe/                # Stripe-produktdefinisjoner
├── supabase/              # Supabase client (browser) + server
└── portal/
    ├── auth.ts            # getPortalUser(), requirePortalUser()
    ├── prisma.ts          # Prisma-klient singleton
    ├── rbac.ts            # Rollebasert tilgangskontroll
    ├── slots.ts           # Tidsluke-generering
    ├── stripe.ts          # Stripe-integrasjon
    ├── achievements/      # Achievement-definisjoner + sjekk
    ├── ai/                # AI: coaching-summary, focus-recommendation, weakness-analysis, training-plan
    ├── booking/           # auto-create-user, cancellation-policy, refund, reschedule, waitlist
    ├── calendar/          # iCal-feed
    ├── datagolf/          # DataGolf API-klient
    ├── email/             # Resend + e-postmaler (booking-confirmed, reminder, welcome, etc.)
    ├── golf/              # expected-strokes, skill-levels, sg-benchmarks, training-areas
    ├── notion/            # Notion-klient, player-profiles
    ├── sms/               # Twilio SMS-påminnelser
    └── utils/             # cn.ts (classname merger)

modules/
└── tournament-planner/    # Turneringsplanleggingsmodul

prisma/
├── schema.prisma          # 26+ modeller (User, Booking, CoachingSession, RoundStats, etc.)
├── migrations/            # Database-migrasjoner
├── seed.ts                # Demo-data seed
├── seed-simple.ts         # Enkel seed
└── seed-config.ts         # Seed-konfigurasjon

content/
└── sportsplan/            # Sportsplan-innhold
```

## Database (Prisma)

PostgreSQL via Prisma med `@prisma/adapter-pg`. Nøkkelmodeller:

- **User** — Rolle: STUDENT, INSTRUCTOR, ADMIN. Tier: FREE, PRO, ELITE
- **Instructor** + **InstructorAvailability** — Instruktørprofiler og ukentlig tilgjengelighet
- **ServiceType** — INDIVIDUAL, GROUP, VTG_COURSE, SIMULATOR, PLAYING_LESSON
- **Booking** — Status: PENDING → CONFIRMED → COMPLETED/CANCELLED/NO_SHOW
- **CoachingSession** — Utvidet booking med AI-felter (oppsummering, notater)
- **PaymentTransaction** — Stripe/Vipps/faktura, refunderinger
- **TrainingPlan/Week/Session** — AI-genererte periodiserte treningsplaner
- **TrainingLog** — Treningsdagbok
- **RoundStats** — Golfrundestatistikk (Strokes Gained)
- **HandicapEntry** — Handicap-sporing
- **Tournament** + **PlayerTournamentPlan** + **TournamentPrep** — Turneringsplanlegging
- **PeriodizationPeriod** — Treningsperioder
- **AchievementDefinition** + **PlayerAchievement** — Gamification

## Authentication

Supabase Auth (ingen NextAuth/Auth.js):

- **Server:** `lib/supabase/server.ts` → `lib/portal/auth.ts` med `requirePortalUser()`
- **Client:** `lib/supabase/client.ts`
- **Flyt:** Supabase-identitet kobles til Prisma User via e-post ved første innlogging
- **Beskyttelse:** Server components kaller `requirePortalUser()` — redirect til login om ikke autentisert
- **RBAC:** `lib/portal/rbac.ts` for rollebasert tilgang
- **Ingen middleware.ts** — auth sjekkes i server components og API-ruter

## Styling & Design System

### Colors (Brand System v3.2)

- **Ink-skala:** Kald blågrå fra `#FAFBFC` (05) til `#0A1929` (100/deep ink)
- **Navy:** `#0F2950` (primær), `#0A1929` (dark/deep ink)
- **Gull:** `#B8975C` (primær accent), `#D4C4A8` (light), `#8B7243` (dark)
- **Sub-brand:** Academy=navy `#0F2950`, Junior=blue `#3B82F6`, Software=purple `#8B5CF6`, Utvikling=green `#22C55E`
- **Overflater:** Snow `#FAFBFC`, Cloud `#F0F2F5`
- **Semantisk:** Success `#22C55E`, Error `#EF4444`, Warning `#F59E0B`, Info `#3B82F6`

### Typography

- **Font:** Inter (variabel, 300–700) via `next/font/local` i `layout.tsx`
- Headings: `font-display` (= Inter), weight 700, tracking -0.02em
- Body: `font-sans` (= Inter)
- Alle font-variabler definert som CSS custom properties i `globals.css`

### Logo

- Kalligrafisk K-mark SVG i `components/website/AKLogo.tsx`
- Nav: midnight, Footer: gull

## Environment Variables

Se `.env.example` for komplett liste. Nøkkelvariabler:

| Tjeneste | Variabler |
|----------|-----------|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Database | `DATABASE_URL` (PostgreSQL) |
| Stripe | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_*` |
| AI | `ANTHROPIC_API_KEY` |
| Email | `RESEND_API_KEY`, `CONTACT_EMAIL`, `FROM_EMAIL` |
| SMS | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` |
| Notion | `NOTION_API_KEY`, `NOTION_BRAND_GUIDE_DB_ID` |
| DataGolf | `DATAGOLF_API_KEY` |
| Google OAuth | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Cron | `CRON_SECRET` |
| App | `NEXT_PUBLIC_APP_URL` |

## API Patterns

- **Public portal-API-er:** `/api/portal/public/*` — Åpne med CORS-headers og caching (`s-maxage=30, stale-while-revalidate=60`)
- **Beskyttede API-er:** Bruker Supabase auth + `requirePortalUser()` eller rollesjekk
- **Webhook:** `/api/portal/webhooks/stripe` — Stripe event-håndtering
- **Cron:** `/api/portal/cron/send-reminders` — Beskyttet med `CRON_SECRET`
- **AI-endepunkter:** `/api/portal/ai/*` — Bruker Anthropic Claude for coaching-analyse
- **Feilhåndtering:** `NextResponse.json()` med HTTP-statuskoder
- **Server Actions:** Brukes i portal-sider (`actions.ts` filer i hver rute-mappe)

## Conventions

- **Language:** All bruker-synlig tekst er på norsk (med noen engelske brand-uttrykk)
- **Content:** Markedsside-tekstinnhold i `lib/website-constants.ts`, ikke hardkodet i komponenter
- **CSS custom properties:** Definert i `@theme inline` i `globals.css`. Spacing-variabler (`--spacing-section`, `--spacing-section-lg`) i `@layer base` for å unngå Tailwind v4-navnekollisjon
- **Sub-brand aksenter:** Undersider bruker sin egen accentfarge via CSS-klasser og prop-verdier
- **Skjema:** `ApplicationForm` støtter `defaultProgram`-prop for forhåndsvalg basert på underside
- **Animasjoner:** `RevealOnScroll` (Framer Motion) + betinget loading-animasjon (kun første besøk via `sessionStorage`). Motion-wrappers i `components/motion/`
- **Portal-komponenter:** Organisert etter feature-mappe i `components/portal/`
- **Server Actions:** Portal-ruter bruker `actions.ts`-filer med `"use server"` for mutasjoner
- **Auth-guard:** Portal-sider bruker `requirePortalUser()` i server components
- **Prisma-klient:** Singleton i `lib/portal/prisma.ts`
- **E-postmaler:** React Email-komponenter i `lib/portal/email/templates/`
- **UI-base:** `components/ui/` for shadcn-lignende base-komponenter, `components/portal/ui/` for fancy portal-effekter
- **Redirect:** `next.config.ts` redirecter `/booking` → `/academy/booking`
