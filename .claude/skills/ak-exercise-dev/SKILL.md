---
name: ak-exercise-dev
description: Øvelse-utvikling for AK Golf Platform. Håndterer drill-oppretting, AK-formel-tagging, SG-analyse, og benchmark-data. Brukes når brukeren spør om øvelser, driller, treningsøvelser, AK-formel, L-M-PR, eller øvelsesbank.
---

# AK Exercise Development

Denne skillen håndterer utvikling og vedlikehold av golføvelser med AK-metodikken.

## AK-formel (L-M-PR)

Hver øvelse tagges med:
- **L-fase**: L-KROPP → L-ARM → L-KØLLE → L-BALL → L-AUTO
- **Miljø**: M0 (tørrtrening) → M5 (turnering)
- **Press**: PR1 (ingen press) → PR5 (turneringspress)

## Pyramide-koder

- **FYS**: Fysisk trening
- **TEK**: Teknikk/full sving
- **SLAG**: Slagspill/approach
- **SPILL**: Nærspill/putting
- **TURN**: Turneringsforberedelse

## CS-targets

ClubSpeed-nivåer (prosent av maks):
- CS50: 50% (teknikk-focus)
- CS60-70: Moderat (øvelse)
- CS80-90: Høy (test)
- CS95-100: Maks (turnering)

## Viktige filer

- `lib/portal/training/ak-taxonomy.ts` — Alle koder og definisjoner
- `lib/portal/training/session-exercise-types.ts` — Øvelses-format
- `mcp-server/src/tools/exercise-development.ts` — MCP tools
- `prisma/schema.prisma` — ExerciseDefinition-modell

## MCP Tools

- `ak_exercise_create` — Opprett øvelse med AK-tagging
- `ak_exercise_analyze` — Analyser basert på SG-data
- `ak_exercise_benchmark` — Hent HCP-benchmark
