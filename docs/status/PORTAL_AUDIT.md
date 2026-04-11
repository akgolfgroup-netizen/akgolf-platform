# Spillerportal — Audit 2026-04-12

## Sammendrag

- **24 sider** + login-side
- **22/24 bruker reelle data** (Supabase/Prisma)
- **0 sider har kun mock-data**
- **15/24 har server/client-split** (actions.ts + *-client.tsx)

## Status per side

| Side | Data | Client-split | Status |
|------|------|--------------|--------|
| Login | Supabase Auth | Ja (hele siden) | OK |
| Dashboard | Reell | Ja | OK |
| Abonnement | Reell (actions.ts) | Ja | OK |
| AI-Coach | Reell (streaming API) | Ja | OK |
| Analyse | Reell (4 server actions) | Nei | OK |
| Apper | Reell (inline Supabase) | Ja | Mangler actions.ts |
| Bag | Reell (actions.ts) | Ja | OK |
| Benchmark | Reell (actions.ts) | Ja | OK |
| Bookinger | Reell (2 parallelle actions) | Ja | OK |
| Bookinger/[id] | Reell (Prisma) | Ja | OK — ny |
| Bookinger/[id]/endre | Reell (Supabase) | Ja | OK |
| Coaching-historikk | Reell (actions.ts) | Nei | OK |
| Dagbok | Reell (actions.ts) | Ja | OK |
| Kalender | Reell (actions.ts) | Nei | OK |
| Meldinger | Reell (actions.ts) | Ja | OK |
| Onboarding | Reell (actions.ts) | Ja | OK |
| Profil | Reell (6 parallelle actions) | Nei | OK |
| Runde | Reell (actions.ts) | Ja | OK |
| Sammenligning | Reell (actions.ts) | Nei (TierGate) | OK |
| Sosialt | Reell (3 parallelle actions) | Ja | OK |
| Spill | Reell (3 parallelle actions) | Ja | OK |
| Statistikk | Reell (5 actions + periode) | Ja | OK |
| Tester | Reell (2 actions) | Ja | OK |
| TrackMan | Reell (actions.ts) | Ja | OK |
| Trening/ovelser | Reell (inline Supabase) | Nei | OK |
| Trening/tester | Reell (inline Supabase) | Nei | Hardkodet "0 fullforte" |
| Treningsplan | Reell (2 actions) | Nei | OK |
| Turneringer | Reell (3 actions + tour API) | Ja | OK |
| ~~Turneringsplan~~ | ~~MOCK~~ Reell (actions.ts) | Ja | OK |

## Fullfort 2026-04-12

### Turneringsplan — reell data (commit 9b53be7)
- Mock erstattet med `actions.ts`: `getPlayerTournaments()` fra Tournament + PlayerTournamentPlan
- Server component med `requirePortalUser()`

### Bookinger/[id] — ny detaljside (commit d509d75)
- `page.tsx`: Server component med Prisma-query inkl. ServiceType, Instructor, Location
- `booking-detail-client.tsx`: Viser dato, tid, instruktor, sted, status, betaling
- Handlinger: Endre tidspunkt (lenke til /endre), Avbestill med bekreftelsessteg
- Gjenbruker `BookingStatusBadge` og `cancelBooking()` fra eksisterende kode

## Gjenstående funn

### 1. Trening/tester — hardkodet stat
- Linje 78: viser alltid "0 fullforte tester" uavhengig av brukerdata
- **Handling:** Hent faktisk fullforingsdata fra brukerens testhistorikk

### 2. Apper — mangler actions.ts
- Direkte Supabase-queries i page.tsx i stedet for via actions.ts
- Bryter med arkitekturmonsteret brukt i alle andre sider
- **Handling:** Migrer queries til actions.ts for konsistens

## Arkitekturmonster

### Standard monster (15 sider)
```
page.tsx         — Server component, henter data via actions.ts
actions.ts       — "use server", Supabase/Prisma-queries
*-client.tsx     — Client component, mottar serialiserte props
```

### Server-only (9 sider)
Server-rendret uten interaktivitet utover standard HTML.

### Streaming (1 side)
AI-Coach: Direkte client-rendering med streaming API-kall.

## Tier-gates

Disse sidene begrenser innhold basert pa abonnementsniva:
- **Analyse:** TrackMan-data kun for PRO+
- **Sammenligning:** Hele siden krever PRO+
- **Profil:** Mal-funksjon krever PRO/ELITE/BUSINESS
