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

## 4. Inter-font loading

**Problem:** Google Fonts import kan feile/være treg.

**Løsning:** Bruk lokal font via `next/font/local`:
```typescript
// app/layout.tsx
const inter = localFont({
  src: "./InterVariable.woff2",
  variable: "--font-inter",
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

---

## VIKTIG: Oppdater dokumentasjon ved strukturelle endringer

Når du endrer noe av dette, MÅ du også oppdatere CLAUDE.md og denne filen:
- Prisma enums (SubscriptionTier, UserRole, etc.)
- Nye Prisma-modeller
- Auth-flyt eller RBAC
- API-mønstre

**Regel:** Endre kode + oppdater dokumentasjon = én atomisk operasjon
