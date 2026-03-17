# Produksjons-deployment sjekkliste

## Miljøvariabler i Vercel

Gå til https://vercel.com/dashboard → Velg prosjekt → Settings → Environment Variables

### Påkrevde variabler

| Variabel | Verdi | Miljø |
|----------|-------|-------|
| `RESEND_API_KEY` | `re_9XTKNMhJ_PgoTtTRj7x7884gaiAg5d4PC` | Production |
| `CONTACT_EMAIL` | `post@akgolf.no` | Production |
| `FROM_EMAIL` | `noreply@akgolf.no` | Production |

### Andre viktige variabler

```bash
# Database (påkrevd)
DATABASE_URL=postgresql://...

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe (for betaling)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Vipps (for norske betalinger)
VIPPS_CLIENT_ID=...
VIPPS_CLIENT_SECRET=...
VIPPS_SUBSCRIPTION_KEY=...
VIPPS_MERCHANT_SERIAL_NUMBER=...
VIPPS_IS_TEST=false
```

## Test etter deploy

1. **Kontaktskjema**: Send test via /academy → verifiser at post@akgolf.no mottar e-post
2. **Nyhetsbrev**: Meld på i footer → verifiser at e-post sendes
3. **Booking**: Fullfør en booking → verifiser bekreftelses-e-post

## Viktig: Resend domene-verifisering

Før e-post sendes fra produksjon:

1. Gå til https://resend.com/domains
2. Legg til domene: `akgolf.no`
3. Følg DNS-instruksjonene (TXT + CNAME records hos domeneleverandør)
4. Vent på verifisering (kan ta opptil 24 timer)

Uten domene-verifisering vil e-post sannsynligvis havne i spam.

## Sjekk deploy-status

```bash
# Siste commit
vercel --version

# Deploy manuelt
vercel --prod
```
