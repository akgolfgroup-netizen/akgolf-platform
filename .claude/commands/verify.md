---
description: "Kjør full verifikasjon: lint, typecheck, test, build"
---

Kjør følgende i sekvens og rapporter resultater:
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run test`
4. `npm run build` (hvis testene gikk grønt)

Hvis noe feiler: analyser feilen, foreslå fix, men IKKE kjør fix uten godkjenning.
