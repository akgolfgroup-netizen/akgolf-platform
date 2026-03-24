---
description: Kjør før enhver kodeendring for å unngå feil
---

# Preflight-sjekk

Kjør denne før du starter på en oppgave:

## 1. Les gotchas
```
Les .claude/rules/gotchas.md
```

## 2. Sjekk gjeldende enums
```bash
grep -A 5 "enum SubscriptionTier" prisma/schema.prisma
grep -A 5 "enum UserRole" prisma/schema.prisma
```

## 3. Sjekk auth-mønster
```bash
grep -B 2 -A 5 "requirePortalUser" lib/portal/auth.ts | head -20
```

## 4. Verifiser env
```bash
ls -la .env.local
```

## 5. Sjekk TypeScript-status
```bash
npx tsc --noEmit 2>&1 | head -20
```

## 6. For markedsside-endringer
Sjekk at tekst er i constants:
```bash
grep -l "website-constants" lib/
```

Hvis noen av disse feiler, fiks dem FØR du starter på oppgaven.
