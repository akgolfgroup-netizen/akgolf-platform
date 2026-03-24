# Arkitektur — AK Golf Website/Portal

## To deler i samme app

1. **Markedsside** (`/`, `/academy`, `/junior`, `/utvikling`)
   - Åpen for alle
   - Statisk/SSG der mulig
   - Fokus på konvertering

2. **Portal** (`/portal/*`)
   - Krever innlogging
   - Dashboard for elever og instruktører
   - AI-funksjoner, statistikk, treningsplaner

## Mappe-struktur

```
app/
├── page.tsx              # Forsiden
├── academy/              # Academy-underside
├── junior/               # Junior-underside
├── utvikling/            # Utvikling-underside
├── booking/              # Offentlig booking-flyt
├── auth/                 # Login, callback, set-password
├── portal/               # ALT portal-relatert
│   ├── login/            # Portal-innlogging
│   └── (dashboard)/      # Beskyttet dashboard
│       ├── page.tsx      # Dashboard-hjem
│       ├── admin/        # Admin-sider
│       ├── bookinger/    # Mine bookinger
│       ├── treningsplan/ # AI-treningsplaner
│       └── ...
└── api/
    ├── portal/           # Portal API-er
    │   ├── public/       # Åpne (slots, instructors)
    │   ├── ai/           # AI-endepunkter
    │   └── webhooks/     # Stripe webhook
    └── contact/          # Kontaktskjema
```

## Auth-flyt

```
1. Bruker går til /portal/login
2. Logger inn via Supabase (magic link eller passord)
3. Callback til /auth/callback
4. requirePortalUser() i server components
5. Oppretter/kobler Prisma User via e-post
```

**Ingen middleware.ts** — auth sjekkes i server components.

## API-mønstre

### Offentlige portal-API-er
```typescript
// app/api/portal/public/slots/route.ts
export async function GET() {
  // Åpent med caching
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
  // user er garantert autentisert
}
```

## Roller (Portal)

| Rolle | Tilgang |
|-------|---------|
| ADMIN | Alt |
| INSTRUCTOR | Egne elever, kalender, admin-sider |
| STUDENT | Egne bookinger, treningsplan, statistikk |

## Integrasjoner

| Tjeneste | Bruk |
|----------|------|
| Supabase | Auth |
| Prisma | Database |
| Stripe | Betalinger |
| Anthropic | AI-analyse |
| Resend | E-post |
| Twilio | SMS |
| Notion | Spillerprofiler |
| DataGolf | Golfstatistikk |
