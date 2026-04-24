---
description: Generer drill-pakke for et fokusområde og legg til på en elev
---

# Drill-pack-generator

Argumenter: `<fokusområde> [antall] [elev-id]`

- `<fokusområde>`: `putting`, `short_game`, `approach`, eller `tee`
- `[antall]`: 1–5 (default 3)
- `[elev-id]`: valgfri — hvis oppgitt legges drillene automatisk i UserExerciseBank

## Oppgave

1. Kall `POST /api/portal/ai/drill-pack` med:
   ```json
   { "focusAreas": ["$1"], "count": ${2:-3}, "difficulty": "klubb", "studentId": "$3", "persist": true }
   ```
2. Rapporter de genererte drillene (navn, varighet, L-phase, suksesskriterier).
3. Hvis `$3` er satt: bekreft at de er lagt i elevens øvelsesbank.
