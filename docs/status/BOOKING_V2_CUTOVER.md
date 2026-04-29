# Booking V2 — Cutover-sjekkliste

> **Status:** Booking V2 er ferdig utviklet (steg 1–9 levert). Steg 10 = staged rollout.
> Dette dokumentet er sjekklisten Anders + dev-team følger før prod-cutover.

## Pre-deploy

### Env-vars (Vercel)

| Variabel | Verdi | Begrunnelse |
|---|---|---|
| `BOOKING_DRAFT_SECRET` | ≥16 tegn random string | HMAC-signering av draft-cookie. Hard-fail i prod uten. Generer: `openssl rand -hex 32` |
| `BOOKING_V2_ENABLED` | `false` (initialt) | Global flag av — kun bypass-cookie aktiverer v2 |
| `STRIPE_SECRET_KEY` | ekte `sk_live_...` | Engangs-Stripe-Checkout (Flex/Bane/Kurs) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` fra Stripe Dashboard | Bekrefter `payment_intent.succeeded` → CONFIRMED + e-post + SMS |
| `RESEND_API_KEY` | `re_...` | E-post-bekreftelse |
| `TWILIO_*` | ekte verdier | SMS-varsel til instruktør |

### Verifisering før deploy

```bash
# 1. Type-check + lint
npm run lint && npx tsc --noEmit

# 2. Bygg lokalt for å fange Turbopack-feil
npm run build

# 3. Verifiser at booking-v2-ruter rendres
# Lokal preview: /booking-v2 → /velg-tjeneste → /tid → /dine-detaljer → /betal
```

## Anders-tilgang i prod (uten å skru på global flag)

Anders setter bypass-cookien én gang ved å åpne lenken:

```
https://akgolf.no/booking?bookingv2=1
```

Cookien `ak_bookingv2=true` lever 30 dager. Alle senere besøk på `/booking`
redirecter automatisk til `/booking-v2` for samme browser.

**Slå av igjen:** `https://akgolf.no/booking?bookingv2=0` (sletter cookien).

## Røykprøve (Vercel preview før prod)

Test alle fire klasser av brukere på preview-URL:

| Bruker | Flow | Forventet resultat |
|---|---|---|
| **Innlogget abo (Performance Pro 4/4 brukt)** | `/booking?bookingv2=1` → velg Performance | Redirect til `/booking-v2/kvota` med ekte `sessionsUsed/Allowed/periodEnd` |
| **Innlogget abo (Performance Pro 2/4 brukt)** | Velg Performance + tid + detaljer + betal | `Booking CONFIRMED` + `consumeSession` + e-post + SMS til Anders. Ingen Stripe |
| **Ny gjest (ingen konto)** | Velg Flex 50 Solo + tid + detaljer + betal | `findOrCreateUserByEmail` lager User. Stripe Checkout `mode=payment`. Webhook → CONFIRMED + e-post + SMS |
| **Innlogget uten abo, vil booke Performance** | Velg Performance + tid + detaljer + betal | Error `subscription-required` med melding "Performance krever et aktivt abonnement" |

### Manuelle sjekkpunkter

- [ ] Booking-record i `Booking`-tabellen (`status`, `paymentStatus` riktig)
- [ ] `SubscriptionQuota.sessionsUsed` økt med 1 for abo-flyt
- [ ] Stripe Dashboard → PaymentIntent koblet til `bookingId` i metadata
- [ ] Resend Dashboard → confirmation-mail sendt til kunde
- [ ] Twilio Dashboard → SMS sendt til instruktør (kun hvis trener har `phone` lagret)
- [ ] `/booking-v2/bekreftelse?bookingId=...` viser ekte data + ICS-fil med Europe/Oslo VTIMEZONE
- [ ] `__bv2_draft`-cookien er ryddet (HttpOnly, kan sjekkes via Network → Set-Cookie)

## Cutover-trinn

1. **Vercel preview-deploy** — verifiser røykprøvene over
2. **Anders kjører bypass-cookie i prod** — én test-booking via `https://akgolf.no/booking?bookingv2=1`
3. **Hvis alt OK i 24 t:** `BOOKING_V2_ENABLED=true` i Vercel prod-env
4. **Etter cutover:** alle nye besøk på `/booking` redirecter til `/booking-v2`. Eksisterende dypbookmark-URLer (`/booking/[id]/cancel`, `/booking/[id]/status`) fortsetter å virke (de er ikke dekket av redirect-regelen)

## Rollback-plan

- **Hard rollback:** `BOOKING_V2_ENABLED=false` + redeploy. Eksisterende `/booking-v2/*`-ruter beholdes; bare auto-redirect fra `/booking` slås av.
- **Soft rollback per bruker:** brukere som har bypass-cookie kan slettes ved å åpne `/booking?bookingv2=0`.
- **Datamigrering ikke nødvendig:** v2 bruker samme `Booking`-tabell som v1. Ingen schema-konflikt.

## Kjent gap (egen ticket etter cutover)

- **Stripe subscription-mode** for nytt Performance-abo via booking-flyten. Krever `stripePriceId` på `ServiceType` eller egen Stripe-katalog-mapping. Inntil videre: brukere må starte abo via eksisterende `/api/portal/subscriptions/checkout` først, deretter booke i v2.
- **Velg-tjeneste/velg-trener-sider bruker fortsatt slug-fallback** fra `components/booking-v2/copy.ts`. Wizard fungerer fordi `serviceTypeId`/`instructorId` (DB-cuid) videreføres som ekstra URL-params. Full DB-fundering kommer i egen runde.
