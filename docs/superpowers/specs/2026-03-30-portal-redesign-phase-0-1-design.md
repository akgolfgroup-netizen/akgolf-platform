# Portal Redesign — Fase 0 + 1

**Dato:** 2026-03-30
**Scope:** Design tokens fundament + Dashboard + Profil redesign

---

## Fase 0: Design Tokens Fundament

### Problem

Kodebasen har 3 konkurrerende token-sett:
1. **Utdaterte** `--color-ink-*` (dark theme) — brukes i 9+ portal-sider og hele Coach Hub
2. **Udefinerte** `--apple-gold-*` — 61 referanser til tokens som ikke eksisterer
3. **Delvis korrekte** `--apple-gray-*` og `--portal-*` — nære, men ikke identiske med offisielle tokens

### Løsning

Erstatt alt med offisielle tokens fra `design-tokens.css` (Brand Guide 2026).

### Endringer i `app/globals.css`

1. **Fjern** alle `--apple-gold-*` definisjoner (eksisterer ikke, men referanser må fikses)
2. **Fjern** `--color-ink-*` skalaen (dark theme)
3. **Erstatt** `--color-gold: #B07D4F` med `--color-black: #1D1D1F`
4. **Legg til** offisielle tokens fra `design-tokens.css`:
   ```css
   /* Offisielle 2026 tokens */
   --color-black: #1D1D1F;
   --color-white: #FFFFFF;
   --color-grey-50: #FBFBFD;
   --color-grey-100: #F5F5F7;
   --color-grey-200: #E8E8ED;
   --color-grey-300: #D2D2D7;
   --color-grey-400: #86868B;
   --color-grey-500: #6E6E73;
   --color-grey-600: #515154;
   --color-grey-700: #3A3A3C;
   --color-grey-800: #2C2C2E;
   --color-grey-900: #1D1D1F;

   /* Semantiske aliases */
   --color-bg-primary: var(--color-white);
   --color-bg-secondary: var(--color-grey-100);
   --color-bg-card: var(--color-white);
   --color-text-primary: var(--color-grey-900);
   --color-text-secondary: var(--color-grey-500);
   --color-text-muted: var(--color-grey-400);
   --color-border: var(--color-grey-200);

   /* Semantisk */
   --color-success: #34C759;
   --color-error: #FF3B30;
   --color-warning: #FF9500;
   --color-info: #007AFF;

   /* Shadows */
   --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);
   --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
   --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.1);

   /* Radii */
   --radius-sm: 8px;
   --radius-md: 12px;
   --radius-lg: 18px;
   --radius-xl: 20px;
   --radius-full: 980px;

   /* Transitions */
   --transition-fast: 0.2s ease;
   --transition-base: 0.3s ease;
   --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
   ```
5. **Oppdater** `--portal-*` aliases til å peke på offisielle tokens
6. **Behold** `--apple-gray-*` som aliases til `--color-grey-*` for bakoverkompatibilitet (midlertidig)

### Migrer Apple-komponenter (`components/portal/apple/`)

Alle 7 komponenter (AppleCard, AppleButton, AppleBadge, AppleAvatar, BentoCard, BentoGrid, StatCard) skal:
- Erstatte `--apple-gold-*` med `--color-black` / `--color-grey-*`
- Erstatte `--shadow-glow-gold` med `--shadow-md`
- Bruke pill-form buttons (border-radius: 980px) per brand guide
- Cards: 20px radius, 1px border #E8E8ED

### Migrer Coach Hub (`components/coach/`)

Alle 7 coach-komponenter bruker `--color-ink-*` (dark theme). Migreres til offisielle tokens med lys bakgrunn. Coach Hub får SAMME design som resten av portalen — ingen separat dark theme.

### Font-endring

Brand guide spesifiserer Inter. Nåværende kode bruker Manrope.

**Beslutning:** Bytt til Inter i `app/layout.tsx`:
```typescript
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
```

Fjern ManropeVariable.woff2.

**NB:** Markedsside og portal deler `app/layout.tsx`. Fonten endres for hele appen til Inter, i tråd med Brand Guide 2026. ManropeVariable.woff2 fjernes fra `app/fonts/`.

---

## Fase 1: Dashboard Redesign

### Nåværende tilstand

`app/portal/(dashboard)/page.tsx` (445 linjer) — "use client" med all data hardkodet som mock-objekter.

### Ny arkitektur

**Server component** som henter ekte data → sender til client component for interaktivitet.

```
app/portal/(dashboard)/
├── page.tsx              # Server component (datahenting)
├── dashboard-client.tsx  # Client component (UI + interaktivitet)
└── loading.tsx           # Skeleton for denne ruten
```

### Datahenting (page.tsx)

```typescript
const user = await requirePortalUser();

// Parallell datahenting
const [handicapEntries, nextBooking, recentActivity, coachInsight, stats] = await Promise.all([
  getHandicapEntries(user.id),      // Siste 10 handicap-entries
  getNextBooking(user.id),          // Neste bekreftede booking
  getRecentActivity(user.id),       // Siste 10 aktiviteter (bookinger + treningslogg + runder)
  getCoachInsight(user.id),         // AI-generert fokusanbefaling (cachet)
  getDashboardStats(user.id),       // Aggregerte tall
]);
```

### Dashboard Layout — Hybrid C

Tre seksjoner vertikalt:

**1. Stat-rad (4 kort)**
| Kort | Data | Empty state |
|------|------|-------------|
| HCP | Siste HandicapEntry.handicapIndex | "—" |
| Trend | Diff mellom siste og forrige | "—" |
| Økter | Count Booking WHERE status=COMPLETED, siste 30d | "0" |
| Runder | Count RoundStats, siste 30d | "0" |

**2. Neste økt + Quick actions (2-kolonne)**

Venstre: Neste bekreftede booking (instruktør, tid, tjeneste). Eller empty state: "Ingen kommende økter" + CTA "Book time".

Høyre: 2 knapper stacked:
- "Logg trening" → `/portal/dagbok`
- "Ny runde" → `/portal/statistikk/ny-runde`

**3. Coach-innsikt (full bredde)**

Lys bakgrunn (#F5F5F7), svart tekst. Viser AI-generert fokusanbefaling fra CoachingSession eller fallback.

Empty state: "Gjennomfør din første coaching-økt for å få personlige anbefalinger."

### Progressiv visning

| Nivå | Kriterier | Visning |
|------|-----------|---------|
| **Tomt** | Ingen data | Onboarding-melding: "Velkommen! Her er 3 ting du kan gjøre for å komme i gang." |
| **Begynner** | 1-3 bookinger | Stats viser det som finnes, coach-innsikt skjult |
| **Aktivt** | 4+ bookinger + handicap | Full visning med trend og coach-innsikt |

### Loading state (`loading.tsx`)

Skeleton med:
- 4 stat-kort (pulserende grå bokser)
- 1 stor boks for neste økt
- 1 boks for coach-innsikt

---

## Fase 1: Profil Redesign

### Nåværende tilstand

`app/portal/(dashboard)/profil/page.tsx` (702 linjer) — allerede operativ med ekte data, men bruker utdaterte tokens og er en enorm "use client"-fil.

### Endringer

1. **Token-migrering:** Erstatt alle `--apple-gold-*` og `--color-ink-*` med offisielle tokens
2. **Splitt filen:** 702 linjer er for mye. Splitt til:
   ```
   profil/
   ├── page.tsx              # Server component (henter all data)
   ├── profil-client.tsx     # Client wrapper
   ├── components/
   │   ├── profile-header.tsx    # Avatar + navn + tier
   │   ├── stats-overview.tsx    # HCP, økter, turneringer
   │   ├── goals-section.tsx     # Mål med CRUD
   │   └── achievements-section.tsx  # Achievements grid
   └── loading.tsx
   ```
3. **Design:** Monokrom Apple Light — svart tekst på hvit bakgrunn, grå borders
4. **Achievements:** Svart ikoner i stedet for fargekodet (monokrom)

---

## Komponenter som påvirkes

### Oppdateres i Fase 0
| Komponent | Endring |
|-----------|---------|
| `components/portal/apple/apple-button.tsx` | Fjern gold-referanser, pill-form (980px) |
| `components/portal/apple/apple-badge.tsx` | Fjern gold-variant, bruk monokrome farger |
| `components/portal/apple/apple-card.tsx` | 20px radius, 1px #E8E8ED border |
| `components/portal/apple/apple-avatar.tsx` | Fjern gold gradient, bruk grey-200 bg |
| `components/portal/apple/bento-card.tsx` | Fjern gradient variant, monokrom |
| `components/portal/apple/bento-grid.tsx` | Ingen endring (layout-only) |
| `components/portal/apple/stat-card.tsx` | Fjern gradient value, svart tekst |
| `components/portal/layout/sidebar.tsx` | Migrer fra --color-ink-* til offisielle tokens, lys bakgrunn |
| `components/portal/layout/mobile-header.tsx` | Migrer tokens |
| `components/coach/layout/CoachSidebar.tsx` | Migrer til lys bakgrunn |
| `components/coach/layout/CoachTopbar.tsx` | Migrer til lys bakgrunn |
| `components/coach/dashboard/StatsCard.tsx` | Migrer tokens |
| `components/coach/dashboard/RecentMessages.tsx` | Migrer tokens |

### Nye komponenter i Fase 1
| Komponent | Formål |
|-----------|--------|
| `components/portal/dashboard/dashboard-client.tsx` | Ny dashboard-klient |
| `app/portal/(dashboard)/loading.tsx` | Oppgradert skeleton |
| `app/portal/(dashboard)/profil/loading.tsx` | Profil skeleton |

---

## Filer som endres

### Fase 0 (tokens)
- `app/globals.css` — Hovedendring: nye tokens, fjern utdaterte
- `app/layout.tsx` — Font fra Manrope til Inter
- 7 Apple-komponenter i `components/portal/apple/`
- 2 layout-komponenter i `components/portal/layout/`
- 5 coach-komponenter i `components/coach/`
- 9 portal-sider med utdaterte tokens (analyse, coaching-historikk, sammenligning, statistikk/ny-runde, turneringsplan, admin/e-postmaler, admin/kapasitet, kalender, dagbok)

### Fase 1 (Dashboard + Profil)
- `app/portal/(dashboard)/page.tsx` — Full omskriving
- `app/portal/(dashboard)/dashboard-client.tsx` — Ny fil
- `app/portal/(dashboard)/loading.tsx` — Oppgradert
- `app/portal/(dashboard)/profil/page.tsx` — Splitt og migrering
- Nye profil sub-komponenter

---

## Testing

- `npm run build` skal passere uten TypeScript-feil
- Alle portal-sider skal laste uten console errors
- Ingen referanser til `--apple-gold-*` eller `--color-ink-*` i portal/coach-kode
- Dashboard viser ekte data for innlogget bruker
- Empty states vises korrekt for ny bruker uten data
