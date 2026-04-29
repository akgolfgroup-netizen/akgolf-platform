# Innholdsbibliotek (LibraryItem)

Godkjenningsdrevet bibliotek av drills, øvelser, tester, aktiviteter og
konkurranseforberedelse. Auto-koblet til treningsplanleggeren via taksonomi
(speiler `lib/portal/training/ak-taxonomy.ts`).

## Datamodell

`LibraryItem` (Prisma) — ett bord, fem typer:

- `DRILL` · `EXERCISE` · `TEST` · `ACTIVITY` · `COMPETITION_PREP`
- Status: `DRAFT` → `APPROVED` / `REJECTED` / `ARCHIVED`
- Kilde: `AK_METHODOLOGY` · `WEB_INSPIRED` · `MANUAL`

## Kjede

```
Admin /admin/library                       (CoachHQ-sidebar → Innholdsbibliotek)
  │
  ├─ "Lag nye"  → POST /api/admin/library/generate
  │                  → lib/portal/library/generator.ts (Claude)
  │                  → Postgres (status=DRAFT, source=AK_METHODOLOGY)
  │
  ├─ Liste/filter (status, type, område, søk)
  │
  └─ Detail /admin/library/[id]
       ├─ PATCH  (rediger felt)
       ├─ approve (status=APPROVED)
       └─ reject  (status=REJECTED, valgfri begrunnelse)
```

## Capabilities

- `LIBRARY_VIEW` — se og redigere (alle staff + manuell tilgjengelig coach-standard)
- `LIBRARY_GENERATE` — kalle AI-generator (kun ADMIN by default)
- `LIBRARY_APPROVE` — godkjenne/avvise/arkivere (kun ADMIN by default)

ADMIN får alle nye capabilities automatisk via `Object.values(Capability)` i
`presets.ts`. Coach-standard har fått `LIBRARY_VIEW` så de kan bla i biblioteket.

## Treningsplanlegger-integrasjon

`lib/portal/library/queries.ts` eksporterer:

```ts
findApprovedForPlanner({ type, area, playerLevel, minDuration, maxDuration, limit })
incrementUsage(ids: string[])
```

Disse er klar til å brukes fra eksisterende treningsplan-genererings-kode i
`lib/portal/ai/training-plan.ts` og `lib/portal/training/exercise-actions.ts`.

**Når planleggeren bygger en plan:**

1. Hent kandidater: `findApprovedForPlanner({ type: 'DRILL', area: 'PUTT3-5', playerLevel: 'D' })`
2. AI/algoritme velger N items
3. Når planen lagres: `incrementUsage(valgteIds)` for å spore bruk

Migrering fra eksisterende `ExerciseDefinition`-bruk er ikke i scope nå —
treningsplanleggeren kan i overgangen lese fra begge.

## Generator-prompt

`lib/portal/library/prompts.ts` bygger system + user prompt fra:

- `PYRAMIDE` (FYS/TEK/SLAG/SPILL/TURN)
- `TRENINGSOMRADER` (TEE, INN200…, CHIP, PUTT0-3…)
- L-faser
- Spillerkategorier A–K

System-prompten er den autoritative AK-konteksten — alle generationer er
groundet i `ak-taxonomy.ts`. JSON-skjema i user-prompten sikrer struktur.

## Web-kilder (fase 4 — ikke i scope)

`source = WEB_INSPIRED` + `sourceUrl` er klar i datamodellen. Generator må
utvides med Firecrawl/WebSearch + curated kildeliste i fremtiden, etter
juridisk avklaring (copyright på øvelses-tekster fra PGA, Golf Digest osv).

## Kimi (KimiClaw)

Kimi kjører kun lokalt via CLI. Når Anders får et godt forslag fra Kimi:
trykk **Lag nye** → opprett manuelt (eller bruk admin-UI til å lime inn
felt). Setter automatisk `source=MANUAL`, `generatedBy='manual'`.

## Filer

- `prisma/schema.prisma` — model `LibraryItem` + 3 enums + Capability-utvidelse
- `prisma/migrations/20260427_add_library_items/migration.sql`
- `lib/portal/library/types.ts` — labels, konstanter
- `lib/portal/library/prompts.ts` — system + user prompt-bygging
- `lib/portal/library/generator.ts` — Claude-kall + JSON-parsing + Postgres-lagring
- `lib/portal/library/queries.ts` — list/get/findApprovedForPlanner/incrementUsage
- `app/api/admin/library/generate/route.ts` — `LIBRARY_GENERATE` + rate-limit (10/t)
- `app/api/admin/library/route.ts` — manuell create
- `app/api/admin/library/[id]/route.ts` — PATCH (rediger), DELETE (arkiver)
- `app/api/admin/library/[id]/approve/route.ts`
- `app/api/admin/library/[id]/reject/route.ts`
- `app/admin/(authed)/library/page.tsx` — server-side liste m/ filter
- `app/admin/(authed)/library/library-client.tsx` — interaktiv liste + tabs
- `app/admin/(authed)/library/generator-panel.tsx` — "Lag nye"-skjema
- `app/admin/(authed)/library/[id]/page.tsx` — detail-side
- `app/admin/(authed)/library/[id]/library-detail.tsx` — rediger/godkjenn/avvis
- `components/admin/coachhq/coachhq-nav-config.ts` — navigation-utvidelse
