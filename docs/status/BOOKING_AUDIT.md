# Booking-system — Audit 2026-04-11

## Sammendrag

- Produksjonsklar med caveats
- Fullstendig Stripe-integrering (checkout, refund, webhook)
- Race conditions mitigert via database constraints
- Subscription quota-system fungerer

## Arkitektur

### Offentlig booking-flyt (`/booking/`)

```
BookingClient (state machine, 5 steg)
  -> DateTimeDrawer (smart-slots API)
  -> ConfirmDrawer (fokusomrader, brukerinfo)
  -> PaymentDrawer (Stripe Checkout redirect)
  -> SuccessDrawer (bekreftelse)
```

- **Orchestrator:** `booking-client.tsx` — React state machine
- **Data:** Server-side fetch av trainers fra Supabase (reelle data)
- **Gjest-flyt:** `getOrCreateUser()` oppretter bruker med UUID

### API-endepunkter

| Endepunkt | Metode | Funksjon | Status |
|-----------|--------|----------|--------|
| `/api/booking/create` | POST | Opprett booking + Stripe | OK |
| `/api/booking/confirm-payment` | POST | Sjekk betalingsstatus | OK |
| `/api/booking/slots` | GET | List ledige tider (30s cache) | OK |
| `/api/booking/smart-slots` | GET | Ukes-oversikt for DateTimeDrawer | OK |
| `/api/booking/route.ts` | - | SLETTET (erstattet av create) | - |

### Betalingsflyt

**Gjest/Flex:**
```
1. POST /api/booking/create -> booking PENDING
2. Stripe Checkout redirect -> bruker betaler
3. checkout.session.completed webhook -> lagrer paymentIntentId
4. payment_intent.succeeded webhook -> booking CONFIRMED
```

**Abonnement (kvote):**
```
1. POST /api/booking/create -> booking CONFIRMED direkte
2. Kvote konsumeres atomisk via RPC increment_sessions_used()
3. E-post sendes umiddelbart
```

### Kansellering og refusjon

- 24-timers policy: full refusjon >24t, ingen <24t
- `processRefund()` konverterer kroner -> ore for Stripe
- Kvote frigis ved full refusjon
- Idempotent: allerede kansellert -> returnerer 200 OK

### Portal booking (`/portal/(dashboard)/bookinger/`)

- Server actions: `getUpcomingBookings()`, `getPastBookings()`
- `cancelBooking()` med full orkestrering (10 steg)
- E-post og waitlist-notifikasjon er non-blocking (.catch())

## Lib-moduler (`lib/portal/booking/`)

| Modul | Funksjon | Status |
|-------|----------|--------|
| validation.ts | Pre-insert validering (450+ linjer) | OK |
| subscription-quota.ts | Kvotesjekk, konsumering, frigiving | OK |
| conflict-check.ts | Dobbeltbooking-sjekk | OK |
| refund.ts | Stripe refund-prosessering | OK |
| cancellation-policy.ts | 24t policy-evaluering | OK |
| cache.ts | Next.js cache (30s TTL) | OK |
| reschedule.ts | Transaction-basert ombooking | OK |
| waitlist.ts | Placeholder/stub | Ikke implementert |
| auto-create-user.ts | Gjest-bruker-oppretting | OK |

## Kjente problemer

### P1: Hardkodet slot-telling

- **Fil:** `app/booking/page.tsx` linje 129
- **Problem:** `availableSlotsThisWeek: 8` er hardkodet
- **Konsekvens:** UI viser alltid "8 ledige tider" uavhengig av faktisk tilgjengelighet
- **Handling:** Hent fra `/api/booking/smart-slots`

### P2: Manglende idempotency key pa refunder

- `processRefund()` kalles uten idempotency key
- Risiko: Webhook-retry kan gi duplikat refusjon
- Mitigering: Stripe har innebygd deduplisering (24t vindu)
- **Handling:** Legg til idempotency key

### P3: Subscription quota fallback-race

- Hvis RPC feiler, fallback gjor `+ 1` uten eksklusiv las
- Risiko: To samtidige requests kan begge inkrementere
- **Handling:** Lav risiko, kun relevant hvis RPC er nede

## Nylige fikser (siste commits)

- `45e8c9c` — Refusjon kr->ore konvertering + portal booking redirect
- `460db78` — Race condition fix, reschedule transaction, idempotent cancel
- `d2eb492` — `.trim()` pa Stripe env-vars
- `a89b0fb` — Service role client for gjest-flyt (RLS bypass)
- `73c3f40` — 5 kritiske feil rettet i komplett booking-flyt

## Stripe webhook-handtering

| Event | Handling |
|-------|---------|
| `payment_intent.succeeded` | Booking -> CONFIRMED |
| `payment_intent.payment_failed` | Booking -> FAILED |
| `charge.refunded` | Booking -> REFUNDED/PARTIALLY_REFUNDED |
| `checkout.session.completed` | Lagrer PI pa booking |
| `invoice.paid` | Reset subscription quota |
| `invoice.payment_failed` | Varsler bruker |
| `customer.subscription.*` | Oppretter/oppdaterer/sletter kvote |
