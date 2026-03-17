# Booking System Test Plan

> Ende-til-ende testing av AK Golf booking-flyten

---

## Test Senerier

### 1. Offentlig Booking (Ny Kunde)

| Steg | Handling | Forventet Resultat |
|------|----------|-------------------|
| 1 | Gå til `/academy/booking` | Booking-wizard laster |
| 2 | Velg tjeneste | Progress bar oppdateres til steg 2 |
| 3 | Velg instruktør | Profilkort vises, progress til steg 3 |
| 4 | Velg dato | Kalender viser ledige dager |
| 5 | Velg tid | Tidsslot valgt |
| 6 | Fyll inn navn/e-post | Skjema valideres |
| 7 | Fullfør betaling | Stripe-modal åpnes |
| 8 | Bekreft betaling | Booking opprettes, bekreftelse vises |
| 9 | Sjekk e-post | Velkomst-e-post mottatt |

### 2. Eksisterende Kunde Booking

| Steg | Handling | Forventet Resultat |
|------|----------|-------------------|
| 1 | Gå til `/academy/booking` | Booking-wizard laster |
| 2 | Bruk eksisterende e-post | Kobles til eksisterende konto |
| 3 | Fullfør booking | Booking knyttes til eksisterende bruker |

### 3. Avbestilling

| Steg | Handling | Forventet Resultat |
|------|----------|-------------------|
| 1 | Logg inn på portal | Dashboard vises |
| 2 | Gå til "Mine bookinger" | Liste over bookinger vises |
| 3 | Klikk "Avbestill" | Modal med avbestillingsregler vises |
| 4 | Bekreft avbestilling | Booking markert som avlyst, refund behandlet |

### 4. Admin Funksjoner

| Steg | Handling | Forventet Resultat |
|------|----------|-------------------|
| 1 | Logg inn som admin | Admin-dashboard vises |
| 2 | Gå til "Bookinger" | Alle bookinger listes |
| 3 | Opprett ny booking | Booking opprettes for kunde |
| 4 | Endre booking | Booking oppdatert |

---

## Automatiserte Tester

```bash
# Kjør TypeScript sjekk
npm run type-check

# Kjør lint
npm run lint

# Bygg for produksjon
npm run build
```

## Manuell Test Sjekkliste

- [ ] Progress bar viser gull gradient
- [ ] Service-ikoner vises korrekt
- [ ] Instruktør-profilkort med bilde/bio
- [ ] Kalender med gull-valg av dato
- [ ] Tidsslot-knapper med hover-effekter
- [ ] Bekreftelse-side med konfetti-animasjon
- [ ] E-post bekreftelse sendt (hvis Resend konfigurert)
- [ ] Stripe betaling fungerer
- [ ] Avbestilling fungerer

---

## Kjente Begrensninger

1. **E-post**: Krever RESEND_API_KEY for å sende bekreftelser
2. **SMS**: Krever Twilio-oppsett for påminnelser
3. **Cron**: Krever Vercel Cron eller lignende for påminnelser
4. **Bilder**: Instruktør-profilbilder må lastes opp

---

## Miljøvariabler for Testing

```bash
# Minimum for testing
DATABASE_URL=postgresql://...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```
