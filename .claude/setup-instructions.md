# Claude Code Setup Guide - AK Golf Booking

Denne guiden viser hvordan du bruker Claude Code med MCP-tilgang til å sette opp booking-systemet.

## Kjøre setup-scriptet

```bash
# Naviger til prosjektet
cd /Users/anderskristiansen/Developer/akgolf-website

# Kjør interaktivt setup
./setup-booking.sh
```

## Alternativ: Manuel steg-for-steg med MCP

### Steg 1: Supabase (via MCP)

**Bruker:** "Claude, bruk Supabase MCP til å:
1. Liste mine eksisterende prosjekter, eller
2. Hjelpe meg med å opprette et nytt prosjekt"

**Claude vil:**
- Hente prosjektlister hvis du har MCP-tilkoblet
- Eller guide deg gjennom manuell oppsett

**Verdier å hente:**
- `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public)
- `SUPABASE_SERVICE_ROLE_KEY` (service_role)

### Steg 2: Stripe (via MCP)

**Bruker:** "Claude, bruk Stripe MCP til å:
1. Vise test API-keys
2. Liste produkter og priser"

**Claude vil:**
- Hente API-nøkler fra test-mode
- Liste eksisterende produkter
- Eller hjelpe deg med å opprette nye

**Verdier å hente:**
- `STRIPE_SECRET_KEY` (sk_test_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_test_...)
- `STRIPE_PRICE_BASIS`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PREMIUM`

### Steg 3: Resend (via MCP)

**Bruker:** "Claude, bruk Resend MCP til å:
1. Vise API-keys
2. Liste verifiserte domener"

**Verdier å hente:**
- `RESEND_API_KEY` (re_...)

### Steg 4: Database-migrasjoner

**Bruker:** "Claude, kjør Prisma migrasjoner"

**Claude vil:**
```bash
npx prisma migrate dev
npx prisma generate
```

## Etter setup: Test

**Bruker:** "Claude, start dev-server og test booking-systemet"

**Claude vil:**
```bash
npm run dev
# Åpner http://localhost:3000/booking
```

## Hurtigkommandoer

```bash
# Full oppsett (interaktiv)
./setup-booking.sh

# Kun migrasjoner
npx prisma migrate dev

# Kun Prisma client
npx prisma generate

# Start dev
npm run dev

# Åpne Prisma Studio
npx prisma studio
```

## Miljø-variabler sjekkliste

### Essensielle (booking fungerer uten disse):
```
✅ NEXT_PUBLIC_SUPABASE_URL=
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY=
✅ SUPABASE_SERVICE_ROLE_KEY=
✅ DATABASE_URL=
```

### For betaling i booking (velg Vipps ELLER Stripe):
```
# Vipps (anbefalt for Norge):
⬜ VIPPS_CLIENT_ID=
⬜ VIPPS_CLIENT_SECRET=
⬜ VIPPS_SUBSCRIPTION_KEY=
⬜ VIPPS_MERCHANT_SERIAL_NUMBER=

# Stripe (alternativ / internasjonalt):
✅ STRIPE_SECRET_KEY=
✅ STRIPE_WEBHOOK_SECRET=
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AI Treningsplaner (valgfritt - trening):
⬜ STRIPE_PRICE_BASIS=         # AI Treningsplan Basis - 199 kr
⬜ STRIPE_PRICE_STANDARD=      # AI Treningsplan Standard - 699 kr/sesong  
⬜ STRIPE_PRICE_PREMIUM=       # AI Treningsplan Premium - 1999 kr/år

# Coaching-tjenester (valgfritt - Stripe alternativ til Vipps):
⬜ STRIPE_PRICE_COACH_INDIVIDUAL=   # Individuell coaching - 995 kr
⬜ STRIPE_PRICE_COACH_PLAYING=      # Playing lesson - 1795 kr
⬜ STRIPE_PRICE_COACH_GROUP=        # Gruppetrening - 495 kr
⬜ STRIPE_PRICE_COACH_SIMULATOR=    # Simulator-time - 595 kr
```

### Andre tjenester:
```
✅ RESEND_API_KEY=
✅ CONTACT_EMAIL=post@akgolf.no
✅ FROM_EMAIL=noreply@akgolf.no
⬜ ANTHROPIC_API_KEY=          (valgfritt)
⬜ TWILIO_ACCOUNT_SID=         (valgfritt)
⬜ TWILIO_AUTH_TOKEN=          (valgfritt)
⬜ TWILIO_PHONE_NUMBER=        (valgfritt)
⬜ NOTION_API_KEY=             (valgfritt)
⬜ NOTION_BRAND_GUIDE_DB_ID=   (valgfritt)
⬜ GOOGLE_CLIENT_ID=           (valgfritt)
⬜ GOOGLE_CLIENT_SECRET=       (valgfritt)
```
