# Implementeringsplan: Portal Redesign — FULLFØRT

> **Versjon:** 2.0
> **Oppdatert:** 2026-03-31
> **Status:** ✅ Implementert

---

## Oversikt

Portalen har gjennomgått en komplett redesign med Apple-inspirert monokrom design system. Alle sider er nå operative med ekte backend-data.

---

## Fullført arbeid (2026-03-24 til 2026-03-31)

### Fase 0-1: Foundation + Design System ✅
- Monokrome design tokens implementert i `globals.css`
- Apple-komponenter: `BentoGrid`, `BentoCard`, `StatCard`, `AppleButton`, `AppleBadge`, `AppleCard`
- Loading/error states på alle sider
- Premium sidebar design

### Fase 2: Backend-koblinger ✅
| Side | Status | Datakilde |
|------|--------|-----------|
| Dashboard | ✅ | `getDashboardData()` |
| Dagbok | ✅ | `getTrainingLogs()` |
| Statistikk | ✅ | `getStatsAggregates()`, `getTrainingAreaBreakdown()` |
| Treningsplan | ✅ | `getCurrentWeekSessions()`, `getActivePlan()` |
| Profil | ✅ | `getMyProfile()`, AI-anbefaling |
| Bookinger | ✅ | `getMyBookings()` |

### Fase 3: Sikkerhet ✅
- Auth upsert for nye brukere
- Rate limiting på AI-endepunkter (20/min)
- PATCH whitelist på dagbok-API
- Zod-validering på profil-input
- Stripe tier-mapping korrigert

### Fase 4: Admin-sider ✅
- Denne uken-oversikt
- Booking-liste med filtrering
- Elev-liste med søk
- Kalender med uke/dag-visning
- Tilgjengelighet-styring

---

## Arkitektur

### App Router Struktur
```
app/portal/(dashboard)/
├── page.tsx                 # Dashboard — server component
├── dashboard-client.tsx     # Client component med UI
├── dagbok/
│   ├── page.tsx            # Henter data
│   └── dagbok-client.tsx   # Viser Apple-design
├── statistikk/
│   ├── page.tsx            # Henter aggregates
│   └── statistikk-client.tsx
├── treningsplan/
│   └── page.tsx            # Server component med data
└── profil/
    └── page.tsx            # Henter profil + AI
```

### Design System
```
components/portal/apple/
├── bento-grid.tsx          # 12-kolonne grid
├── bento-card.tsx          # Kort med span
├── stat-card.tsx           # Statistikk-kort
├── apple-button.tsx        # Knapper
├── apple-badge.tsx         # Badges
├── apple-card.tsx          # Generiske kort
└── apple-avatar.tsx        # Avatar
```

### CSS Tokens
```css
/* Monokrom palett */
--color-grey-100: #F8F8FC;
--color-grey-200: #E8E8ED;
--color-grey-300: #D1D1D6;
--color-grey-400: #A1A1A6;
--color-grey-500: #8E8E93;
--color-grey-600: #636366;
--color-grey-700: #48484A;
--color-grey-800: #3A3A3C;
--color-grey-900: #2C2C2E;
--color-grey-950: #1C1C1E;
```

---

## Neste steg (valgfritt)

### Prioritet 1: Innstillinger-side
- `/portal/innstillinger` — varslinger, tilkoblede kontoer

### Prioritet 2: Meldinger
- `/portal/meldinger` — chat med coach

### Prioritet 3: Notifikasjoner
- `/portal/notifikasjoner` — in-app varsler

---

## Tekniske notater

### SubscriptionTier
Website og Dashboard bruker samme enum:
- `VISITOR` (gratis, default)
- `ACADEMY`
- `STARTER`
- `PRO`
- `ELITE`

### Auth-mønster
```typescript
// Server component
const user = await requirePortalUser();

// Ny bruker auto-opprettelse via upsert
user = await prisma.user.upsert({
  where: { email: supabaseUser.email },
  update: { supabaseId: supabaseUser.id },
  create: { ... }
});
```

### AI-endepunkter
Alle AI-ruter har:
- `maxDuration = 60` (for Vercel timeout)
- Rate limiting: 20 requests/minutt per bruker

---

## Referanser

- Wireframes: `/wireframes/` (42 HTML-filer)
- Design System: `/wireframes/apple-design-system.html`
- Komponenter: `/components/portal/apple/`
- CSS: `/app/globals.css`
