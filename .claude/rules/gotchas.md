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

## 5. Booking-redirect

**Problem:** `/booking` skal gå til `/academy/booking`.

**Løsning:** Redirect konfigurert i `next.config.ts`. Ikke lag egen `/booking/page.tsx`.

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
// Coach Hub requires authentication
if (request.nextUrl.pathname.startsWith("/coach")) {
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

---

## VIKTIG: Oppdater dokumentasjon ved strukturelle endringer

Når du endrer noe av dette, MÅ du også oppdatere CLAUDE.md og denne filen:
- Prisma enums (SubscriptionTier, UserRole, etc.)
- Nye Prisma-modeller
- Auth-flyt eller RBAC
- API-mønstre

**Regel:** Endre kode + oppdater dokumentasjon = én atomisk operasjon
