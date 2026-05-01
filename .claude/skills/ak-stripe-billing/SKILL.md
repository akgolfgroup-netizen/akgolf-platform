---
name: ak-stripe-billing
description: Stripe-billing og abonnementshåndtering for AK Golf Platform. Håndterer subscription plans, checkout, webhooks, og fakturering. Brukes når brukeren spør om Stripe, abonnement, betaling, faktura, priser, eller Vipps.
---

# AK Stripe Billing

Denne skillen håndterer betaling og abonnement for AK Golf Platform.

## Abonnementsplaner

| Plan | Måned | År | Features |
|------|-------|-----|----------|
| Basic | 299kr | 2990kr | Treningsplan, dagbok, statistikk, kalender |
| Pro | 599kr | 5990kr | + Videoanalyse, coach-agent, TrackMan |
| Elite | 999kr | 9990kr | + Ukentlig coach-samtale, utstyr, turnering |

## Viktige filer

- `lib/stripe/subscriptions.ts` — Sentral subscription service
- `lib/stripe/products.ts` — Produkt-definisjoner
- `app/api/portal/stripe/webhook/route.ts` — Webhook-håndtering

## Webhook-events som håndteres

- `customer.subscription.created` — Nytt abonnement
- `customer.subscription.updated` — Endring i abonnement
- `customer.subscription.deleted` — Kansellering
- `invoice.payment_failed` — Betalingsfeil

## Vipps

Vipps-integrasjon er planlagt men ikke implementert. Stripe støtter Vipps via Payment Methods.
