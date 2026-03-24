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

## 2. SubscriptionTier mismatch med Dashboard

**Problem:** Website bruker `FREE`, Dashboard bruker `VISITOR`.

**Løsning:**
- Website: FREE, PRO, ELITE
- Dashboard: VISITOR, ACADEMY, STARTER, PRO, ELITE
- ALDRI bland — sjekk `prisma/schema.prisma`

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
