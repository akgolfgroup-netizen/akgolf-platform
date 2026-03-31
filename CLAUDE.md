@.claude/rules/gotchas.md
@.claude/rules/prisma-auth.md
@.claude/rules/code-style.md
@.claude/rules/architecture.md

# AK Golf Website & Portal

Premium golfcoaching-plattform for AK Golf Group. Norskspråklig markedsside med undersider (Academy, Junior, Utvikling, Personvern) pluss et komplett portal/dashboard-system for elever og instruktører.

## FØR DU GJØR NOE

1. **Les `.claude/rules/gotchas.md`** — kjente feller som har forårsaket bugs
2. **Kjør `/preflight`** — verifiserer at miljøet er klart
3. **Sjekk enum-verdier** — SubscriptionTier er VISITOR/ACADEMY/STARTER/PRO/ELITE (delt med dashboard)
4. **Markedsside-tekst** — ALLTID i `lib/website-constants.ts`, aldri hardkodet

## Når du oppdager en ny feil

Legg den til i `.claude/rules/gotchas.md` umiddelbart slik at den aldri skjer igjen.

## Spesialiserte agenter

- `/.claude/agents/portal-specialist.md` — for portal/dashboard-arbeid
- `/.claude/agents/website-specialist.md` — for markedsside-arbeid

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
- **Analytics:** Vercel Analytics + Speed Insights + Microsoft Clarity
- **PWA:** manifest.json for installerbar app
- **Animations:** Framer Motion 12.x
- **Charts:** Recharts
- **PDF:** @react-pdf/renderer
- **Fonts:** Manrope (variabel, via `next/font/local` — ManropeVariable.woff2)
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
├── academy/                 # Academy-underside (accent: bronse #B07D4F)
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
│       │   ├── turneringer/ # Turneringsstyring
│       │   └── e-postmaler/ # Admin e-postmal-editor
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
    ├── booking/             # [bookingId], confirm-payment, create, list, reschedule, services, slots
    ├── coaching/            # book, packages, slots (fra akgolf-booking)
    ├── cron/                # release-dropin-slots, reset-monthly-sessions
    └── portal/
        ├── public/          # Åpne endepunkter (slots, instructors, service-types, resources, etc.)
        ├── ai/              # coaching-summary, coaching-transcription, focus, weakness, training-plan
        ├── admin/           # email-templates CRUD
        ├── bookings/        # cancel, create-group, reschedule
        ├── dagbok/          # Treningsdagbok
        ├── calendar/        # iCal-feed, token, google/auth, google/callback
        ├── cron/            # send-reminders
        ├── datagolf/        # DataGolf-integrasjon
        ├── export/          # CSV-eksport
        ├── notifications/   # Notifikasjoner CRUD
        ├── payment-preferences/ # Betalingspreferanser
        ├── subscriptions/   # Stripe-abonnementer
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
├── cron-auth.ts           # Cron-autentisering
├── supabase-admin.ts      # Supabase admin client
├── ai/                    # AI: system-prompt, generate-plan, plan-schema, category-engine
├── api/                   # validation.ts (Zod request validation)
├── pdf/                   # PDF-generering
├── stripe/                # Stripe-produktdefinisjoner
├── supabase/              # Supabase client (browser) + server
└── portal/
    ├── auth.ts            # getPortalUser(), requirePortalUser()
    ├── prisma.ts          # Prisma-klient singleton
    ├── rbac.ts            # Rollebasert tilgangskontroll
    ├── slots.ts           # Tidsluke-generering
    ├── stripe.ts          # Stripe-integrasjon
    ├── invoice.ts         # Fakturagenerering
    ├── notifications.ts   # Notifikasjonshåndtering
    ├── achievements/      # Achievement-definisjoner + sjekk
    ├── ai/                # coaching-summary, coaching-transcription, focus, weakness, training-plan
    ├── booking/           # auto-create-user, cancellation-policy, refund, reschedule, waitlist
    ├── calendar/          # ical.ts, google-calendar.ts (Google Calendar OAuth)
    ├── datagolf/          # DataGolf API-klient
    ├── email/             # Resend + e-postmaler (templates/)
    ├── export/            # csv-stats.ts (statistikk-eksport)
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

- **User** — Rolle: STUDENT, INSTRUCTOR, ADMIN. Tier: VISITOR/ACADEMY/STARTER/PRO/ELITE
- **Instructor** + **InstructorAvailability** — Instruktørprofiler og ukentlig tilgjengelighet
- **ServiceType** — INDIVIDUAL, GROUP, VTG_COURSE, SIMULATOR, PLAYING_LESSON
- **Booking** — Status: PENDING → CONFIRMED → COMPLETED/CANCELLED/NO_SHOW
- **CoachingSession** — Utvidet booking med AI-felter (oppsummering, transcriptionText, notater)
- **CoachingPackage** — Coaching-pakker med billing/booking-type
- **UserSubscription** — Brukerabonnementer på coaching-pakker
- **CoachingAvailability** — Coaching-tilgjengelighet per ukedag
- **PaymentTransaction** — Stripe/faktura, refunderinger
- **TrainingPlan/Week/Session** — AI-genererte periodiserte treningsplaner
- **TrainingLog** — Treningsdagbok
- **RoundStats** — Golfrundestatistikk (Strokes Gained)
- **HandicapEntry** — Handicap-sporing
- **Tournament** + **PlayerTournamentPlan** + **TournamentPrep** — Turneringsplanlegging
- **PeriodizationPeriod** — Treningsperioder
- **AchievementDefinition** + **PlayerAchievement** — Gamification
- **Notification** — In-app notifikasjoner
- **Conversation** + **Message** — In-app meldingssystem
- **SwingVideo** — Videoanalyse med kvote-tracking
- **TrackmanSession** — Trackman CSV-import data

## Authentication

Supabase Auth (ingen NextAuth/Auth.js):

- **Server:** `lib/supabase/server.ts` → `lib/portal/auth.ts` med `requirePortalUser()`
- **Client:** `lib/supabase/client.ts`
- **Flyt:** Supabase-identitet kobles til Prisma User via e-post ved første innlogging
- **Beskyttelse:** Server components kaller `requirePortalUser()` — redirect til login om ikke autentisert
- **RBAC:** `lib/portal/rbac.ts` for rollebasert tilgang
- **Ingen middleware.ts** — auth sjekkes i server components og API-ruter

## Styling & Design System

### Brand Guide 2026 — Apple Light (GJELDENDE)

**Offisiell kilde:** `Google Drive/AK Golf Group/ak-golf-academy/branding/2026/`
- `design-tokens.css` — Offisielle CSS-tokens
- `brand-guide.md` — Komplett brand guide

### Colors — Monokrom (INGEN aksent-farger)

| Token | Hex | Bruk |
|-------|-----|------|
| `--color-black` | `#1D1D1F` | Tekst, logo, primær-knapper |
| `--color-white` | `#FFFFFF` | Bakgrunn |
| `--color-grey-50` | `#FBFBFD` | Lyseste bakgrunn |
| `--color-grey-100` | `#F5F5F7` | Sekundær bakgrunn |
| `--color-grey-200` | `#E8E8ED` | Borders, dividers |
| `--color-grey-300` | `#D2D2D7` | Inactive states |
| `--color-grey-400` | `#86868B` | Muted text |
| `--color-grey-500` | `#6E6E73` | Secondary text |
| `--color-grey-900` | `#1D1D1F` | Primary text |

**Semantisk:** Success `#34C759`, Error `#FF3B30`, Warning `#FF9500`, Info `#007AFF`

**UTDATERT — ALDRI bruk:** `--color-gold`, `#B07D4F` (bronse), `--apple-gold-*`, `--color-ink-*` (dark theme)

### Typography

- **Font:** Inter via `next/font/google` i `app/layout.tsx`
- H1: 3.5-5rem, weight 700, tracking -0.03em
- H2: 2.5rem, weight 700, tracking -0.025em
- Body: 1rem, weight 400
- Alle tokens definert i `globals.css` under `@theme inline`

### Komponenter

- **Knapper:** Pill-form (border-radius: 980px), svart bakgrunn, hvit tekst
- **Cards:** Hvit bg, 1px border `#E8E8ED`, radius 20px, subtil skygge
- **Header:** 48px, glassmorfisme (backdrop-filter: blur)

### Logo

- Kalligrafisk AK-mark SVG i `components/website/AKLogo.tsx`
- Svart på lys bakgrunn, hvit på mørk bakgrunn
- Aldri aksent-farger i lys modus

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
| Analytics | `NEXT_PUBLIC_CLARITY_PROJECT_ID` |
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
