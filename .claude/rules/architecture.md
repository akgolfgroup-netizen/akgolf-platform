# Arkitektur — AK Golf Platform

## Tre flater i samme app

1. **Markedsside** (`/`, `/academy`, `/junior-academy`, `/utvikling`, `/booking`, `/kontakt`)
   - Åpen for alle
   - Statisk/SSG der mulig
   - Fokus på konvertering

2. **Spillerportal** (`/portal/*`)
   - Krever innlogging (`requirePortalUser()`)
   - Dashboard for spillere
   - AI-funksjoner, statistikk, treningsplaner

3. **CoachHQ / Admin** (`/admin/*`)
   - Krever ADMIN/INSTRUCTOR (`canAccessMissionControl()`)
   - Coach-flate (Mission Control rebrand 2026-04-25)
   - Topp-nivå rute, ikke under `/portal/`

## Mappe-struktur

```
app/
├── page.tsx                       # Forsiden
├── academy/                       # Academy-underside
├── junior-academy/                # Junior-underside
├── utvikling/                     # Utvikling-underside
├── kontakt/                       # Kontakt
├── booking/                       # Offentlig booking-flyt (legacy)
├── booking-v2/                    # Ny booking-flyt
├── auth/                          # Login, callback, set-password
├── portal/                        # Spillerportal (innlogget)
│   ├── login/                     # Portal-innlogging
│   └── (dashboard)/               # Beskyttet spiller-dashboard
│       ├── page.tsx               # Dashboard-hjem
│       ├── bookinger/             # Mine bookinger
│       ├── treningsplan/          # AI-treningsplaner
│       └── ...
├── admin/                         # CoachHQ (admin/coach-flate)
│   └── (authed)/                  # Beskyttet admin-flate
│       ├── page.tsx               # Hub
│       ├── elever/                # Spillerliste + detaljer
│       ├── mission-board/         # Kanban-tavle
│       ├── bookinger/             # Booking-administrasjon
│       └── ...
└── api/
    ├── portal/                    # Portal/spiller-API
    │   ├── public/                # Åpne (slots, instructors)
    │   ├── ai/                    # AI-endepunkter
    │   └── webhooks/              # Stripe webhook
    └── contact/                   # Kontaktskjema
```

## Komponentstruktur (oppdatert 2026-05-02)

```
components/
├── website/                       # Markedsside (legacy, migreres til website-v2)
├── website-v2/                    # Ny markedsside (Brand Guide V2.0)
├── booking/                       # Booking-wizard (legacy)
├── booking-v2/                    # Ny booking-flow
├── portal/                        # Spillerportal-komponenter
│   ├── booking/                   # Booking-relaterte
│   ├── dashboard/                 # Legacy dashboard v3
│   ├── dashboard-bento/           # Brand Guide V2.0 dashboard (valgt 2026-04-27)
│   ├── statistikk/v2/             # Brand Guide V2.0 statistikk
│   └── ...
└── admin/                         # CoachHQ-komponenter (eneste admin-tre etter 2026-05-02)
    ├── coachhq-dark/              # ENESTE design-variant — Brand Guide V2.0
    │   ├── Primitives.tsx         # Card, Button, Pill, KpiCard, StatCard, Empty, Table, TOKENS
    │   ├── ActivityItem.tsx
    │   ├── avatar.ts
    │   ├── PageHead.tsx
    │   ├── CoachHQDarkShell/Rail/Nav/Topbar.tsx
    │   ├── arbeidsflate/d1/d27/   # Underseksjoner
    │   └── index.ts
    └── coachhq/                   # Sidebar-byggesteiner — IKKE et separat designsystem
        ├── IconRail.tsx
        ├── NameList.tsx
        ├── LiveStatusFooter.tsx   # Internt brukt av NameList
        └── coachhq-nav-config.ts
```

**Konsolidering 2026-05-02 (Tier 3B + 3E):**
- `components/admin/mc-v2/` — slettet (10 filer, migrert til `coachhq-dark/`)
- `components/admin/coachhq/dark-cockpit.tsx` — slettet (migrert til `coachhq-dark/Primitives.tsx`)
- `components/portal/admin/` — slettet, konsolidert inn i `components/admin/` (commit `fd3a6679`, 2026-05-02)
- `components/portal/mission-control/` — kun `mc-layout.tsx` igjen som tynn wrapper rundt `CoachHQSidebar`

## Auth-flyt

```
1. Bruker går til /portal/login eller /admin/login
2. Logger inn via Supabase (magic link eller passord)
3. Callback til /auth/callback
4. requirePortalUser() i server components
5. Oppretter/kobler Prisma User via e-post
6. Admin-flater gates på canAccessMissionControl() / canAccessMCPage()
   eller requireCapability(Capability.X) for sensitive handlinger
```

**Ingen middleware.ts** — auth sjekkes i server components. `proxy.ts` håndterer edge-redirects.

## API-mønstre

### Offentlige portal-API-er
```typescript
// app/api/portal/public/slots/route.ts
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=30, stale-while-revalidate=60",
    },
  });
}
```

### Beskyttede API-er
```typescript
import { requirePortalUser } from "@/lib/portal/auth";

export async function POST(request: Request) {
  const user = await requirePortalUser();
}
```

### Sensitive admin-API-er
```typescript
import { requireCapability, Capability } from "@/lib/portal/capabilities";

export async function POST(request: Request) {
  await requireCapability(Capability.USERS_ASSIGN_CAPABILITIES);
  // Audit-logges automatisk
}
```

## Roller og kapabiliteter

| Rolle | Tilgang |
|-------|---------|
| ADMIN | Alt, inkludert sensitive handlinger |
| INSTRUCTOR | Egne spillere, kalender, mest av CoachHQ |
| INVITED | Begrenset CoachHQ |
| STUDENT | Egen portal, ingen admin-tilgang |

Nye admin-funksjoner gates på `Capability` (se `lib/portal/capabilities/`), ikke kun `UserRole`. Kritiske handlinger krever i tillegg `requireSensitiveAuth()` (passord-bekreftelse siste 15 min).

## Integrasjoner

| Tjeneste | Bruk |
|----------|------|
| Supabase | Auth + database (Postgres) |
| Prisma | ORM mot Supabase Postgres |
| Stripe | Betalinger (abo + engangs), webhooks |
| Anthropic | AI-analyse, coaching-sammendrag, drills |
| Resend | E-post |
| Twilio | SMS |
| Notion | Spillerprofiler, drills, treningsplaner |
| DataGolf | Golfstatistikk |
| Google Calendar | Kalender-sync |
| GolfBox | Medlemmer, handicap, turneringer |
