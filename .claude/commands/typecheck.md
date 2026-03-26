---
description: Kjør TypeScript-sjekk og vis feil
---

Kjør TypeScript-sjekk for hele prosjektet:

```bash
cd /Users/anderskristiansen/Developer/akgolf/akgolf-website
npx tsc --noEmit
```

Hvis det er feil:
1. List opp alle feil med fil og linjenummer
2. Fiks feilene én etter én
3. Kjør `npx tsc --noEmit` igjen for å verifisere

VIKTIG: Ikke ignorer feil med `// @ts-ignore` med mindre det er en reell bug i en tredjeparts-pakke.
