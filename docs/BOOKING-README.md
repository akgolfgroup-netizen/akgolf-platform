# AK Golf Booking System

> **Oppdatert:** 2026-03-31
> **Status:** Produksjonsklar

---

## Quick Start

```bash
# 1. Sett miljøvariabler
cp .env.example .env
# Rediger .env med dine verdier

# 2. Installer avhengigheter
npm install

# 3. Generer Prisma-klient
npx prisma generate

# 4. Start utvikling
npm run dev
```

---

## Struktur

```
app/
├── academy/booking/          # Offentlig booking-landingsside
├── booking/                  # Booking wizard
│   ├── page.tsx             # Tjeneste-/instruktør-valg
│   ├── new/page.tsx         # Flerstegs skjema
│   ├── [id]/pay/            # Stripe-betaling
│   └── [id]/confirmation/   # Bekreftelse
├── api/
│   ├── booking/             # Offentlige booking API-er
│   │   ├── create/route.ts
│   │   ├── services/route.ts
│   │   └── slots/route.ts
│   └── portal/
│       ├── cron/send-reminders/  # Påminnelser
│       └── webhooks/stripe/      # Betalings-webhook
├── portal/(dashboard)/
│   ├── bookinger/           # Elev: se/endre bookinger
│   └── admin/bookinger/     # Admin: alle bookinger

components/portal/booking/
├── booking-card.tsx
├── booking-list.tsx
└── cancel-booking-button.tsx

lib/portal/booking/
├── auto-create-user.ts      # Automatisk brukeropprettelse
├── cancellation-policy.ts   # Avbestillingsregler
├── refund.ts                # Stripe refund
├── reschedule.ts            # Endre booking
└── waitlist.ts              # Venteliste
```

---

## Design System

### Apple-inspirert Monokrom
Booking-sidene bruker det nye monokrome design systemet med:
- Nøytral grå-palett (`--color-grey-*`)
- Subtile skygger og gradienter
- Apple-komponenter: `AppleCard`, `AppleButton`, `AppleBadge`

### Komponenter
- **ProgressBar**: Steg-indikator
- **ServiceSelector**: Tjenestekort med ikoner
- **InstructorCard**: Profilkort med PGA-badge
- **DateTimePicker**: Kalender med tilgjengelighet
- **Confirmation**: Bekreftelse med ikon

---

## Betaling

### Stripe Konfigurasjon
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook Events
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `invoice.paid`

### Betalingsflyt
1. Kunde velger tjeneste/tid
2. Stripe Checkout Session opprettes
3. Kunde betaler
4. Webhook mottar suksess
5. Booking bekreftet, e-post sendt

---

## E-post

### Resend Konfigurasjon
```bash
RESEND_API_KEY=re_live_...
FROM_EMAIL=noreply@akgolf.no
```

### Templates (lib/portal/email/templates/)
- `booking-confirmation.tsx` — Booking bekreftet
- `booking-reminder.tsx` — Påminnelse 24t før
- `booking-cancelled.tsx` — Avbestilling
- `welcome-new-user.tsx` — Velkomst

---

## Cron Jobs

### Påminnelser
- **Hver time**: `/api/portal/cron/send-reminders`
- 24t før: E-post påminnelse
- 1t før: SMS (hvis Twilio konfigurert)

### Vercel Konfigurasjon (vercel.json)
```json
{
  "crons": [{
    "path": "/api/portal/cron/send-reminders",
    "schedule": "0 * * * *"
  }]
}
```

---

## Brukerflyter

### Ny Kunde
1. Besøker `/academy/booking`
2. Velger tjeneste → instruktør → tid
3. Fyller inn kontaktinfo
4. Betaler med Stripe
5. Mottar bekreftelse + velkomst-e-post
6. Bruker opprettes automatisk med `VISITOR`-tier

### Eksisterende Kunde
1. Samme flyt
2. System gjenkjenner e-post
3. Booking knyttes til eksisterende konto

### Avbestilling
1. Logg inn på `/portal`
2. Gå til "Mine bookinger"
3. Klikk "Avbestill"
4. Refund behandles via Stripe

---

## Sikkerhet

- **Rate limiting**: 10 bookinger/min per IP
- **Validering**: Zod-skjema på alle inputs
- **Webhooks**: Verifisert med Stripe-signatur
- **Cron**: Beskyttet med `CRON_SECRET`

---

## Feilsøking

### "Failed to send email"
→ Sjekk `RESEND_API_KEY` og domeneverifisering

### "Stripe webhook failed"
→ Sjekk `STRIPE_WEBHOOK_SECRET` og URL i Stripe Dashboard

### "No available slots"
→ Sjekk instruktør-tilgjengelighet i admin

### "User not created"
→ Auth upsert skal opprette automatisk, sjekk `lib/portal/auth.ts`

---

## Dokumentasjon

- [Produksjons-sjekkliste](./PRODUCTION-CHECKLIST.md)
- [Test-plan](./BOOKING-TEST-PLAN.md)
- [Lanserings-sjekkliste](./LAUNCH-CHECKLIST.md)
