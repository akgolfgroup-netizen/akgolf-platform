---
description: Generer utkast til neste coaching-økt for en elev
---

# Planlegg neste coaching-økt

Argumenter: `<elev-navn-eller-id> [minutter]`

## Oppgave

1. Slå opp `$1` mot `/api/portal/admin/students?q=$1` for å finne studentId.
2. Kall `POST /api/portal/ai/next-session` med `{ studentId, durationMinutes: $2 ?? 60 }`.
3. Vis:
   - Primært fokusområde (med begrunnelse)
   - Komplett økt-plan (warmup / hoveddrills / cooldown / nøkkelpunkter)
   - Trener-notater
   - AI-Attribution (kildeteller)
4. Spør om coach vil lagre som utkast (knyttet til neste `Booking`).
