---
description: Prosesser lydopptak fra coaching-økt — transkriber, generer sammendrag, lagre til utkast
---

# Etter-økt-pipeline

Argumenter: `<bookingId-eller-sessionId> <path-til-lydfil.m4a> [path-til-trackman-bilde.jpg]`

## Oppgave

1. Verifiser at `$1` er en gyldig booking- eller CoachingSession-id.
2. Les `$2` som lydfil.
3. Valgfritt: `$3` som TrackMan-bilde.
4. Kall `POST /api/portal/ai/coaching-transcription` med multipart-form:
   - `audio` = `$2`
   - `sessionId` eller `bookingId` = `$1`
   - Hvis `$3`: kall først `POST /api/portal/trackman/upload-image` med `preview: true` og send `trackmanContext` videre.
5. Rapporter:
   - Transkripsjons-lengde
   - AI-sammendrag (prosa + keyPoints/focusAreas/actionItems)
   - Lenke til `/admin/elever/<studentId>?tab=sammendrag&session=<id>`

Bruk fetch med session-cookie fra eksisterende Supabase-session (antatt innlogget).
