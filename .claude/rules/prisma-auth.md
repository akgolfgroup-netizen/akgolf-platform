# Prisma og Auth-regler — AK Golf HQ

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

Website og Dashboard bruker NÅ SAMME verdier (synkronisert 2026-03-24):
- `VISITOR` (gratis bruker, default)
- `ACADEMY`
- `STARTER`
- `PRO`
- `ELITE`

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

## KRITISK: Prisma-relasjoner bruker PascalCase

Prisma genererer relasjoner med PascalCase-navn. Bruk ALLTID disse i include/select:

```typescript
// FEIL
include: { user: true, package: true }

// RIKTIG
include: { User: true, CoachingPackage: true }
```

### Vanlige relasjonsnavn

| Feil (lowercase) | Riktig (PascalCase) |
|------------------|---------------------|
| user | User |
| package | CoachingPackage |
| module | AppModule |
| bundle | AppBundle |
| items | BundleItem |
| instructor | Instructor |
| aiResponse | AIResponses |

## KRITISK: Create krever id og updatedAt

Mange modeller har ikke autoincrement på `id` eller `@updatedAt`. Legg alltid til:

```typescript
import { nanoid } from "nanoid";

await prisma.notification.create({
  data: {
    id: nanoid(),
    updatedAt: new Date(),
    // ... andre felter
  }
});
```

**Modeller som krever dette:** Notification, CommunicationLog, AppSubscription, SubscriptionQuota, PushSubscription, CoachingPackage, CoachingAvailability, AppModule, AppBundle, BundleItem
