---
description: Sjekk deploy-status og klargjør for produksjon
---

## Pre-deploy sjekkliste

1. TypeScript-sjekk:
```bash
cd /Users/anderskristiansen/Developer/akgolf/akgolf-website
npx tsc --noEmit
```

2. Lint:
```bash
npm run lint
```

3. Build lokalt:
```bash
npm run build
```

4. Sjekk env-variabler i Vercel:
- DATABASE_URL (Pooler URL)
- SUPABASE_* variabler
- STRIPE_* variabler
- ANTHROPIC_API_KEY
- RESEND_API_KEY
- TWILIO_* variabler

## Deploy

Website deployes automatisk til Vercel ved push til `main`:
- URL: akgolf.no (markedsside) + portal.akgolf.no (portal)
- Team: akgolfgroup-netizens

```bash
git add -A
git commit -m "<melding>"
git push origin main
```

## Etter deploy

1. Test forsiden: https://akgolf.no
2. Test portal-login: https://akgolf.no/portal/login
3. Sjekk Vercel-loggen for feil
