# Kjente gotchas — AK Golf Website/Portal

Oppdateres når nye feil oppdages. **Les denne før du skriver kode.**

## 1. Turbopack CSS-feil

**Problem:** Turbopack finner ikke CSS-filer uten `root` config.

**Løsning:** `next.config.ts` MÅ ha:
```typescript
const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
};
```

## 2. SubscriptionTier — NÅ SYNKRONISERT

**Status:** Website og Dashboard bruker NÅ samme enum: `VISITOR, ACADEMY, STARTER, PRO, ELITE`

**Historikk:** Tidligere brukte website `FREE` mens dashboard brukte `VISITOR`. Dette er fikset 2026-03-24.

**Viktig:** Default-verdi er `VISITOR` (gratis bruker). Sjekk alltid `prisma/schema.prisma` ved tvil.

## 3. Supabase ID vs Prisma ID

**Problem:** Auth gir UUID, Prisma bruker cuid.

**Løsning:** Bruk `OR: [{ supabaseId }, { id }]` for brukeroppslag.

## 4. Font-fil må være ekte woff2

**Problem:** Korrupt font-fil (f.eks. HTML i stedet for woff2) gir kryptisk Turbopack-feil: `Can't resolve 'next/font/local/target.css'`

**Løsning:** Sjekk font-filen med `file app/fonts/ManropeVariable.woff2` — skal vise "Web Open Font Format", ikke "HTML document".

```typescript
// app/layout.tsx
const manrope = localFont({
  src: "./fonts/ManropeVariable.woff2",
  variable: "--font-manrope",
});
```

## 5. Booking-side (OPPDATERT 2026-04-01)

**Status:** `/booking` er nå en egen landingsside med tjenester og instruktører. Redirect til `/academy/booking` er **fjernet**.

**Løsning:** `app/booking/page.tsx` er en server component som henter ServiceTypes og Instructors fra Prisma. `/academy/booking` er en separat booking-side for Academy-pakker.

## 6. Portal auth uten middleware

**Problem:** Ingen `middleware.ts` for auth-sjekk.

**Løsning:** Hver server component i `/portal/(dashboard)` MÅ kalle:
```typescript
const user = await requirePortalUser();
```

## 7. E-postmaler

**Problem:** Resend krever React Email-komponenter.

**Løsning:** Maler i `lib/portal/email/templates/`. Bruk `render()` fra `@react-email/components`.

## 8. Prisma singleton

**Problem:** Flere Prisma-instanser i dev.

**Løsning:** Bruk singleton fra `lib/portal/prisma.ts`:
```typescript
import { prisma } from "@/lib/portal/prisma";
```

## 9. AI-endepunkter timeout

**Problem:** Anthropic kan ta lang tid.

**Løsning:** Streaming eller økt timeout i route config:
```typescript
export const maxDuration = 60; // sekunder
```

## 10. Seed-scripts må laste .env

**Problem:** Scripts i `prisma/` får "Database does not exist" fordi env-variabler ikke lastes automatisk.

**Løsning:** Start alle seed-scripts med:
```typescript
import "dotenv/config";
import { prisma } from "../lib/portal/prisma";
```

## 11. Delt database — synkroniser begge prosjekter

**Problem:** akgolf-website og akgolf-dashboard deler samme PostgreSQL-database.

**Løsning:** Etter schema-endring:
1. `npx prisma generate` i BEGGE prosjekter
2. Sjekk at enums og modeller matcher
3. Bruk `npx prisma db push` kun fra ETT prosjekt (unngå konflikter)

## 12. Port-mismatch ved kopiering av kode

**Problem:** Kode kopiert fra andre prosjekter kan ha feil port i fallback-URL.

**Løsning:** ALLTID sjekk at fallback-porter matcher prosjektet:
- akgolf-website: localhost:3000
- akgolf-dashboard: localhost:3001

```typescript
// RIKTIG for website:
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// FEIL — dette er dashboard-porten:
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3001";
```

## 13. Video storage — bruk BigInt

**Problem:** `videoStorageLimit` (2 GB = 2147483648 bytes) overskrider PostgreSQL INT-grensen (~2.1 milliarder).

**Løsning:** Bruk `BigInt` for byte-felter:
```prisma
videoStorageUsed  BigInt @default(0)
videoStorageLimit BigInt @default(2147483648)
fileSize          BigInt
```

## 14. Konsolidert kodebase (2026-03-26)

**Status:** akgolf-website er nå master for all funksjonalitet. Spillerportal og akgolf-booking er arkivert.

**Nye modeller (alle i schema.prisma):** CoachingPackage, UserSubscription, CoachingAvailability, CommunicationLog, Notification, AppModule, AppBundle, BundleItem, AppSubscription, SubscriptionQuota, DashboardAccess, ContentItem, Conversation, Message, ExerciseDefinition, SwingVideo, TrackmanSession, UserExerciseBank

**Nye enums:** BillingType, CoachingBookingType, SubscriptionStatus, CommunicationType, NotificationType, CoachingSubscriptionTier, DashboardRole, ContentStatus, ContentType

**Nye API-er:** `/api/coaching/*`, `/api/cron/*`, `/api/portal/admin/email-templates`, `/api/portal/notifications`, `/api/portal/subscriptions/*`

**Viktig:** Prisma-relasjoner bruker stor forbokstav (f.eks. `User`, ikke `user`). Sjekk alltid mot schema ved select/where.

## 15. Priser er lagret i KRONER (ikke øre)

**Problem:** Prisene i databasen (ServiceType.price, PaymentTransaction.amount) er lagret i **kroner**. ALDRI del på 100 ved visning. Seed-config.ts bruker kroner (995 = 995 kr, 3000 = 3000 kr).

**Løsning:**
```typescript
// VISNING — pris er allerede i kroner, vis direkte
const priceNok = service.price;
`kr ${price.toLocaleString("nb-NO")}` // → "kr 995"

// STRIPE — forventer øre, GANG med 100
stripe.paymentIntents.create({ amount: service.price * 100 });

// MVA — vatRate er i prosent (25), beregning gir kroner
const vatAmount = Math.round((price * vatRate) / 100);
```

**MERK:** Gammel seed.ts (ubrukt) har priser i øre. Bruk kun seed-config.ts.

**Fikset 2026-03-26:** 9 filer rettet — fjernet feilaktig `/100` i visning, lagt til `* 100` for Stripe.

## 16. Aldri lag separat globals.css for portal

**Problem:** Portal hadde egen `app/portal/globals.css` som importerte Tailwind dobbelt, overskrev font (Inter i stedet for Manrope), og kolliderte med rot-CSS-ens `--portal-*` variabler.

**Løsning:** Én enkelt `app/globals.css` for hele appen. Portal-tokens (`--portal-*`), shadcn-variabler, bento-grid og alle utilities ligger i root CSS. Portal-layout importerer IKKE egen CSS.

**Regel:** Aldri lag `globals.css` i undermapper. Alt portal-spesifikt CSS legges i `app/globals.css` under seksjonen "Portal Dark Theme Tokens".

## 17. Next.js 16: proxy.ts, ikke middleware.ts

**Problem:** Next.js 16 krever `proxy.ts` i stedet for `middleware.ts`. Hvis begge eksisterer, krasjer appen ved oppstart.

**Løsning:** Bruk kun `proxy.ts` i prosjektrot. Slett `middleware.ts` hvis den finnes.

**Regel:** All edge-logikk (auth, redirects, maintenance mode) går i `proxy.ts`.

## 18. Nye beskyttede ruter MÅ legges til i proxy.ts

**Problem:** Når du lager nye beskyttede ruter (f.eks. `/coach`), holder det IKKE å bare bruke `requirePortalUser()` i layout. Brukeren vil se en feilside før redirect skjer.

**Løsning:** ALLTID legg til auth-sjekk i `proxy.ts` for nye beskyttede ruter:
```typescript
// Portal admin requires authentication
if (request.nextUrl.pathname.startsWith("/portal/admin")) {
  if (!user) {
    return NextResponse.redirect(new URL("/portal/login", request.url));
  }
}
```

**Regel:** `requirePortalUser()` i layout er backup. `proxy.ts` er primær auth-guard.

## 19. API-ruter MÅ ha autentisering og rate limiting

**Problem:** Offentlige API-ruter uten autentisering kan lekke data eller tillate abuse.

**Løsning:**
- ALLE API-ruter som returnerer eller modifiserer brukerdata MÅ kalle `getPortalUser()` eller `requirePortalUser()`
- ALLE offentlige endepunkter MÅ ha rate limiting via `checkRateLimit()`
- ALDRI reflekter brukerinput direkte i feilmeldinger uten escaping

```typescript
// Eksempel på sikker API-rute
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { getPortalUser } from "@/lib/portal/auth";

export async function GET(req: NextRequest) {
  // 1. Rate limiting først
  const rateLimit = checkRateLimit(`endpoint:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  // 2. Auth-sjekk
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  // 3. Escape brukerinput i feilmeldinger
  const safeInput = userInput.replace(/[<>&"']/g, "");
}
```

**Fikset 2026-03-29:** 6 filer — booking-API-er, waitlist, XSS i feilmelding.

## 20. Utdaterte design tokens — ALDRI bruk

**Problem:** Kodebasen hadde 61+ referanser til `--apple-gold-*` tokens som ikke eksisterte i CSS, pluss `--color-gold: #B07D4F` (bronse) og `--color-ink-*` (dark theme).

**Status:** Fikset 2026-03-30/31 — alle 150+ filer migrert til offisielle Brand Guide 2026 tokens.

**Løsning:** Bruk KUN offisielle tokens fra `design-tokens.css`:
```css
/* RIKTIG — Offisielle 2026 tokens */
--color-black: #1D1D1F;
--color-grey-100: #F5F5F7;
--color-grey-200: #E8E8ED;
--color-grey-500: #6E6E73;

/* FEIL — Utdaterte tokens som ALDRI skal brukes */
--color-gold: #B07D4F;        /* Bronse — fjernet */
--apple-gold-*;               /* Aldri definert — fjernet */
--color-ink-*;                /* Dark theme — fjernet */
#112240, #0A1929, #1E3A5F;   /* Navy dark — fjernet */
```

**Kilde:** `Google Drive/AK Golf Group/ak-golf-academy/branding/2026/design-tokens.css`

## 21. Alltid pull main før ny branch

**Problem:** Når en PR squash-merges, oppdateres `origin/main` men lokal `main` henger etter. Nye brancher fra lokal main mangler da siste endringer.

**Løsning:** Kjør alltid dette mellom PRer:
```bash
git checkout main && git pull origin main --rebase
git checkout -b feat/ny-branch
```

**Regel:** Aldri lag ny branch uten å oppdatere main først.

## 22. Aldri vis trenersertifiseringer

**Problem:** "PGA Professional", "TrackMan Certified", "TPI Certified", "X års erfaring" osv. skal ALDRI vises på nettsiden.

**Løsning:** Sertifiseringer er fjernet fra:
- `lib/website-constants.ts` (TEAM, FOUNDER, CREDENTIALS)
- `app/page.tsx` (trust strip)
- `components/website/CredentialsStrip.tsx` (slettet)

**Regel:** Aldri legg til sertifiseringer eller credentials på noen sider. Fokus er på metodikk og resultater, ikke titler.

## 23. Coach Hub er fjernet (2026-04-02)

**Status:** Coach Hub (`/coach/`) er konsolidert inn i Portal Admin (`/portal/admin/`).

**Nye admin-sider:**
- `/admin/meldinger` — Unified inbox
- `/admin/ai-assistent` — AI Coach
- `/admin/okter` — Coaching-økter
- `/admin/godkjenninger` — Booking-godkjenninger

**Regel:** All instruktør-funksjonalitet ligger i Portal Admin. Ikke opprett separate dashboards.

## 24. ALDRI bruk emojier (2026-04-02)

**Problem:** Emojier gir uprofesjonelt inntrykk og er inkonsistent pa tvers av plattformer.

**Losning:** Bruk SVG-ikoner fra Lucide eller egendefinerte ikoner i stedet.

```typescript
// FEIL
<div>📊 TrackMan-analyse</div>

// RIKTIG
import { BarChart3 } from "lucide-react";
<div><BarChart3 className="h-5 w-5" /> TrackMan-analyse</div>
```

**Regel:** Soek gjennom kode for emoji-tegn for publisering. Erstatt med Lucide-ikoner.

## 25. Ikke nevn MVA pa landingssider

**Problem:** MVA-informasjon er irrelevant for kunder og skaper forvirring.

**Losning:** Fjern all MVA-tekst fra kundevendte sider:
- "MVA-fritatt"
- "eks. mva"
- "inkl. mva"

**Regel:** Priser vises som rene tall uten MVA-referanse. Intern MVA-haandtering skjer i backend.

## 26. Tjeneste-struktur (2026-04-02)

**3 hovedsider:**
1. **Coaching** (`/coaching`) — Voksne amatorer + bedrift
2. **Junior Academy** (`/junior`) — Barn/ungdom + foreldre
3. **Utvikling** (`/utvikling`) — B2B for klubber

**Eksplisitt utelatt (lanseres senere):**
- Digital coaching (Pro, Pro+Coaching, Elite, Junior Digital)
- Junior Prospect
- NGF/WANG samarbeid

**Bedriftstrening** (After Work, Bedriftsgolf) ligger under Coaching, ikke egen seksjon.

## 27. Coaching-pakker — gjeldende priser

| Pakke | Pris | Okter | Booking-vindu |
|-------|------|-------|---------------|
| Performance | 1 600 kr/mnd | 2 x 20 min | 7 dager |
| Performance Pro | 2 000 kr/mnd | 4 x 20 min | 14 dager |

**Inkludert i begge:**
- TrackMan-analyse hver okt
- Personlig treningsplan
- Full tilgang til spillerportal
- Ingen binding

**Kilde:** `docs/coaching-pakker.md` for komplett oversikt.

## 28. Booking tids-grid må være responsiv (2026-04-02)

**Problem:** `grid-cols-4` og `grid-cols-7` er uleselig på mobil.

**Løsning:** Bruk alltid responsive breakpoints:
- Tider: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4`
- Dager: `flex overflow-x-auto` eller `grid-cols-4 sm:grid-cols-7`
- Sidebar: Vis som slide-in drawer på mobil, sticky på desktop

**Filer:**
- `app/booking/components/DateTimePicker.tsx` — responsiv dag/tid-velger
- `app/booking/components/BookingSidebar.tsx` — mobile drawer

**Regel:** Aldri bruk faste grid-kolonner uten responsive breakpoints i booking-flyt.

## 29. Prisma-relasjoner bruker PascalCase (2026-04-02)

**Problem:** Kode bruker lowercase (`user`, `package`, `module`) men Prisma genererer PascalCase (`User`, `CoachingPackage`, `AppModule`).

**Løsning:** ALLTID bruk PascalCase i include/select:
```typescript
// FEIL
include: { user: true, package: true }
sub.user.email
sub.package.sessionsPerMonth

// RIKTIG
include: { User: true, CoachingPackage: true }
sub.User.email
sub.CoachingPackage.sessionsPerMonth
```

**Vanlige mappinger:**
| Lowercase | PascalCase |
|-----------|------------|
| user | User |
| package | CoachingPackage |
| module | AppModule |
| bundle | AppBundle |
| items | BundleItem |
| instructor | Instructor |

**Regel:** Sjekk alltid `prisma/schema.prisma` for korrekt relasjonsnavn.

## 30. Prisma create krever id og updatedAt (2026-04-02)

**Problem:** Mange modeller har `id` og `updatedAt` som required uten default, så create feiler uten disse.

**Løsning:** Legg alltid til `id: nanoid()` og `updatedAt: new Date()` i create-kall:
```typescript
import { nanoid } from "nanoid";

// FEIL
await prisma.notification.create({
  data: { userId, type, title, message }
});

// RIKTIG
await prisma.notification.create({
  data: {
    id: nanoid(),
    updatedAt: new Date(),
    userId, type, title, message
  }
});
```

**Modeller som krever dette:** Notification, CommunicationLog, AppSubscription, SubscriptionQuota, PushSubscription, CoachingPackage, CoachingAvailability, AppModule, AppBundle, BundleItem

**Unntak:** Modeller med `@default(cuid())` eller `@default(now())` trenger ikke dette.

## 31. Client components kan ikke motta funksjoner som props (2026-04-02)

**Problem:** React Server Components kan ikke sende funksjoner (inkludert React components som Lucide icons) til client components.

**Feilmelding:** `Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server".`

**Løsning:** Send primitive verdier og la client component velge riktig komponent:
```typescript
// FEIL — lib/config.ts
import { User, Calendar } from "lucide-react";
export const ITEMS = [
  { name: "Bruker", icon: User },  // Funksjon!
];

// RIKTIG — lib/config.ts
export type IconName = "user" | "calendar";
export const ITEMS = [
  { name: "Bruker", iconName: "user" as IconName },
];

// Client component
const ICON_MAP = { user: User, calendar: Calendar };
const Icon = ICON_MAP[item.iconName];
```

## 32. Server-only imports i client components (2026-04-02)

**Problem:** Client component importerer fra en fil som bruker Prisma/Node.js-moduler, og build feiler med `Can't resolve 'tls'` eller `Can't resolve 'dns'`.

**Løsning:** Splitt til to filer:
1. `*-types.ts` — Kun typer og konstanter (client-safe)
2. `*-service.ts` — Database-logikk (server-only)

```typescript
// lib/training/l-phase-types.ts (client-safe)
export const L_PHASES = ["KROPP", "ARM", "KØLLE"] as const;
export type LPhase = (typeof L_PHASES)[number];

// lib/training/l-phase-service.ts (server-only)
import { prisma } from "@/lib/portal/prisma";
export { L_PHASES, type LPhase } from "./l-phase-types";
// ... database functions

// Client component
import { L_PHASES } from "@/lib/training/l-phase-types";  // OK!
```

**Regel:** Client components skal ALDRI importere filer som inneholder `import { prisma }`.

## 33. Coach Hub-modeller (2026-04-02)

**Nye Prisma-modeller for unified inbox og AI-læring:**

| Modell | Beskrivelse |
|--------|-------------|
| UnifiedMessage | Meldinger fra alle kanaler (EMAIL, SMS, INSTAGRAM, etc.) |
| AIResponse | AI-genererte svar på meldinger |
| AILearning | AI-læringsmønstre basert på brukerinteraksjoner |

**Nye User-felter:**
- `portalMonthlyLogCount` — Antall loggede økter denne måneden
- `portalMonthlyAiCount` — Antall AI-kall denne måneden
- `portalUsageResetDate` — Dato for reset av månedlige tellere

**Nye User-relasjoner:**
- `AssignedMessages` — Meldinger tildelt brukeren
- `ApprovedResponses` — AI-svar godkjent av brukeren
- `AILearning` — Brukerens AI-læringsdata

---

## VIKTIG: Oppdater dokumentasjon ved strukturelle endringer

Når du endrer noe av dette, MÅ du også oppdatere CLAUDE.md og denne filen:
- Prisma enums (SubscriptionTier, UserRole, etc.)
- Nye Prisma-modeller
- Auth-flyt eller RBAC
- API-mønstre

**Regel:** Endre kode + oppdater dokumentasjon = én atomisk operasjon
