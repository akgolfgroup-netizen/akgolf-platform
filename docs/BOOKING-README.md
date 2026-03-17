# AK Golf Booking System

> Komplett bookingsystem for AK Golf Academy med offentlig booking, betaling og portal-administrasjon.

---

## 🚀 Quick Start

```bash
# 1. Kopier miljøvariabler
cp .env.example .env
# Rediger .env med dine verdier

# 2. Kjør setup
chmod +x scripts/setup.sh
./scripts/setup.sh

# 3. Start utvikling
npm run dev
```

---

## 📁 Struktur

```
app/
├── academy/booking/          # Offentlig booking-side
├── booking/                  # Betaling & bekreftelse
│   ├── page.tsx             # Booking wizard
│   └── components/
│       ├── ProgressBar.tsx   # Steg-indikator
│       ├── ServiceSelector.tsx
│       ├── InstructorCard.tsx
│       ├── DateTimePicker.tsx
│       ├── CustomerForm.tsx
│       ├── PaymentStep.tsx
│       └── Confirmation.tsx
├── api/
│   ├── booking/             # Offentlige booking API-er
│   │   ├── create/route.ts
│   │   └── services/route.ts
│   └── portal/
│       ├── cron/send-reminders/  # Timebaserte påminnelser
│       └── webhooks/stripe/      # Stripe betalingswebhook
├── portal/(dashboard)/       # Innlogget portal
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
└── waitlist.ts              # Ventelistefunksjonalitet
```

---

## 🎨 Branding

### Farger
| Farge | Hex | Bruk |
|-------|-----|------|
| Gull | `#B8975C` | Primær accent, knapper, highlights |
| Navy | `#0F2950` | Headere, tekst, kontrast |
| Deep Ink | `#0A1929` | Mørk bakgrunn |

### Komponenter
- **ProgressBar**: Gull gradient med steg-indikatorer
- **ServiceIcon**: Golf-relaterte ikoner per kategori
- **InstructorCard**: Profilbilde, tittel, PGA-badge
- **DateTimePicker**: Elegant kalender med gull-valg
- **Confirmation**: Konfetti-animasjon + sjekkmark

---

## 💳 Betaling

### Stripe Konfigurasjon
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Webhook Events
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### Betalingsflyt
1. Kunde fullfører booking-skjema
2. Stripe PaymentIntent opprettes
3. Kunde betaler i Stripe Elements
4. Webhook mottar suksess
5. Booking bekreftet, e-post sendt

---

## 📧 E-post

### Resend Konfigurasjon
```bash
RESEND_API_KEY=re_live_...
FROM_EMAIL=noreply@akgolf.no
CONTACT_EMAIL=post@akgolf.no
```

### Templates
- `welcome-new-user.tsx` - Ny bruker + booking
- `booking-confirmed.tsx` - Booking bekreftet
- `booking-reminder.tsx` - Påminnelse 24t før
- `booking-cancelled.tsx` - Avbestilling
- `waitlist-available.tsx` - Venteliste plass ledig

---

## ⏰ Cron Jobs

### Påminnelser
- **Hver time**: `/api/portal/cron/send-reminders`
- 24t før: E-post påminnelse
- 1t før: SMS påminnelse (hvis Twilio konfigurert)

### Vercel Konfigurasjon
```json
{
  "crons": [{
    "path": "/api/portal/cron/send-reminders",
    "schedule": "0 * * * *"
  }]
}
```

---

## 👥 Brukerflyter

### Ny Kunde
1. Besøker `/academy/booking`
2. Velger tjeneste → instruktør → tid
3. Fyller inn navn + e-post
4. Betaler med Stripe
5. Mottar:
   - Booking-bekreftelse
   - Velkomst-e-post med midlertidig passord
6. Kan logge inn på portal med e-post + passord

### Eksisterende Kunde
1. Samme prosess som over
2. System gjenkjenner e-post
3. Booking knyttes til eksisterende konto

### Avbestilling
1. Logg inn på `/portal`
2. Gå til "Mine bookinger"
3. Klikk "Avbestill"
4. Refund behandles automatisk ( Stripe )

---

## 🛡️ Sikkerhet

- **Passord**: Hashet med bcrypt (12 salt rounds)
- **Betaling**: Stripe håndterer alle kortdetaljer
- **Webhooks**: Verifisert med secret
- **Cron**: Beskyttet med CRON_SECRET
- **Headers**: Security headers i next.config.ts

---

## 🔧 Feilsøking

### "Failed to send email"
→ Sjekk RESEND_API_KEY og domeneverifisering

### "Stripe webhook failed"
→ Sjekk STRIPE_WEBHOOK_SECRET og URL i Stripe Dashboard

### "Database connection failed"
→ Verifiser DATABASE_URL og IP whitelist

### "Cron job not running"
→ Sjekk at CRON_SECRET er satt og cron er konfigurert i Vercel

---

## 📚 Dokumentasjon

- [Produksjons-sjekkliste](./PRODUCTION-CHECKLIST.md)
- [Test-plan](./BOOKING-TEST-PLAN.md)
- [Branding-guide](./BRANDING-BOOKING.md)

---

## 🤝 Support

| Tjeneste | URL |
|----------|-----|
| Vercel | https://vercel.com/support |
| Stripe | https://support.stripe.com |
| Resend | https://resend.com/support |
| Prisma | https://prisma.io/support |

---

**Versjon:** 1.0  
**Sist oppdatert:** 2026-03-17
