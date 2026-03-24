# Prisma og Auth-regler — AK Golf Website/Portal

## KRITISK: Supabase ID vs Prisma ID

Supabase Auth bruker `user.id` (UUID). Prisma User bruker `id` (cuid). De er IKKE like.

### ALLTID bruk dette mønsteret for brukeroppslag med auth-ID:

```typescript
// RIKTIG - håndterer begge ID-typer
const user = await prisma.user.findFirst({
  where: {
    OR: [{ supabaseId: userId }, { id: userId }],
  },
});

// FEIL - feiler hvis userId er supabaseId
const user = await prisma.user.findUnique({
  where: { id: userId },
});
```

## KRITISK: SubscriptionTier enum

Website/Portal bruker disse verdiene:
- `FREE` (gratis bruker)
- `PRO`
- `ELITE`

**MERK:** Dashboard bruker andre verdier (VISITOR, ACADEMY, STARTER). ALDRI bland.

## Auth-mønster for Portal

### Server Components:
```typescript
import { requirePortalUser } from "@/lib/portal/auth";

export default async function Page() {
  const user = await requirePortalUser();
  // Redirect til login hvis ikke autentisert
}
```

### Supabase-flyt:
1. Bruker logger inn via Supabase (magic link eller passord)
2. `requirePortalUser()` henter Supabase-session
3. Kobler Supabase-bruker til Prisma User via e-post
4. Oppretter Prisma User automatisk hvis den ikke finnes

## Database URL

Vercel MÅ bruke Supabase Pooler:
```
postgresql://postgres.xxx:PASSWORD@aws-0-eu-north-1.pooler.supabase.com:6543/postgres
```

## Prisma-synkronisering

Website og Dashboard deler database. Etter schema-endring:
```bash
npx prisma generate  # I BEGGE prosjekter
```
