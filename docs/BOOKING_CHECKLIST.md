# Booking System - Verifiseringssjekkliste

> Sjekkliste for manuell testing og verifisering av booking-systemet i staging-miljø.
> Brukes før deploy til produksjon.

## Pre-test Setup

- [ ] Staging-miljø er tilgjengelig (`https://staging.akgolf.no`)
- [ ] Stripe Test-mode er aktivert
- [ ] Test-kort er tilgjengelige (se Stripe docs)
- [ ] Test-brukere er opprettet (gjest, registrert, admin)
- [ ] E-post-fangst (mailtrap/etc.) er konfigurert

---

## 1. Gjeste-booking Flyt

### 1.1 Tjeneste-valg
- [ ] Åpne booking-siden uten å være logget inn
- [ ] Verifiser at alle aktive tjenester vises
- [ ] Verifiser at inaktive tjenester SKJULES
- [ ] Velg en tjeneste og gå til neste steg
- [ ] Verifiser at valgt tjeneste er markert

### 1.2 Dato/Tid-valg
- [ ] Kalender vises korrekt
- [ ] Tidligere datoer er disabled
- [ ] Datoer utenfor `maxAdvanceDays` er disabled
- [ ] Datoer innenfor `minNoticeHours` er disabled
- [ ] Velg en tilgjengelig dato
- [ ] Tilgjengelige tidslots lastes
- [ ] Opptatte tidslots markeres/er ikke klikkbare
- [ ] Velg en tidslot og gå til neste steg

### 1.3 Bruker-registrering
- [ ] Skjema for gjeste-info vises
- [ ] Validering på e-post (format)
- [ ] Validering på navn (påkrevd)
- [ ] Validering på telefon (format)
- [ ] Eksisterende e-post gjenkjennes (gjenbruker bruker)
- [ ] Ny e-post oppretter ny bruker automatisk

### 1.4 Betaling (Stripe Test)
- [ ] Betalingsside lastes med Stripe Elements
- [ ] Pris vises korrekt (inkl. MVA)
- [ ] Test med kort: `4242 4242 4242 4242` (skal fungere)
- [ ] Test med kort: `4000 0000 0000 0002` (skal feile)
- [ ] Test med kort: `4000 0000 0000 3220` (3D Secure)
- [ ] Ved feil: feilmelding vises, kan prøve på nytt
- [ ] Ved suksess: redirect til bekreftelsesside

### 1.5 Bekreftelse
- [ ] Bekreftelsesside viser booking-detaljer
- [ ] Booking-ID vises
- [ ] QR-kode genereres (hvis aktuelt)
- [ ] "Legg til i kalender"-link fungerer
- [ ] E-postbekreftelse mottatt (sjekk mailtrap)

### 1.6 Database-verifisering
```sql
-- Verifiser at booking ble opprettet
SELECT * FROM "Booking" 
WHERE "guestEmail" = 'din-test-epost@example.com' 
ORDER BY "createdAt" DESC LIMIT 1;

-- Forventet: status='CONFIRMED', paymentStatus='PAID', stripePaymentId IS NOT NULL
```

---

## 2. Registrert Bruker Booking

### 2.1 Login-flyt
- [ ] Logg inn med eksisterende bruker
- [ ] Verifiser at brukerens data pre-fylles
- [ ] Hopp over registreringssteg

### 2.2 Booking med eksisterende bruker
- [ ] Fullfør booking som innlogget bruker
- [ ] Verifiser at `studentId` kobles til eksisterende User
- [ ] Ingen duplikat-bruker opprettes

### 2.3 Mine Bookinger
- [ ] "Mine Bookinger" viser kommende bookinger
- [ ] Historikk viser tidligere bookinger
- [ ] Detaljvisning fungerer

---

## 3. Abonnement-booking

### 3.1 Aktivt abonnement
- [ ] Bruker med aktivt abonnement kan booke uten betaling
- [ ] Kvote trekkes fra `SubscriptionQuota`
- [ ] PaymentMethod = 'NONE'
- [ ] PaymentStatus = 'PAID' (dekket av abonnement)

### 3.2 Kvote-håndtering
- [ ] Verifiser at `sessionsUsed` øker
- [ ] Verifiser at `minutesUsed` øker (hvis aktuelt)
- [ ] Blokker booking når kvote er oppbrukt
- [ ] Vis riktig feilmelding ved tom kvote

### 3.3 Database-verifisering
```sql
-- Sjekk kvote-oppdatering
SELECT * FROM "SubscriptionQuota" 
WHERE "userId" = 'din-test-bruker-id';

-- Forventet: sessionsUsed økt, minutesUsed økt
```

---

## 4. Avbestilling og Refund

### 4.1 Avbestilling > 24t før (Full refund)
- [ ] Opprett booking med betaling
- [ ] Klikk avbestill > 24t før start
- [ ] Verifiser: 100% refund policy vises
- [ ] Bekreft avbestilling
- [ ] Stripe refund initieres
- [ ] E-post om avbestilling mottas

**Database-verifisering:**
```sql
SELECT "status", "paymentStatus", "stripeRefundId", "cancelledAt" 
FROM "Booking" WHERE id = 'booking-id';
-- Forventet: status='CANCELLED', paymentStatus='REFUNDED', stripeRefundId IS NOT NULL
```

### 4.2 Avbestilling 12-24t før (50% refund)
- [ ] Opprett booking med betaling
- [ ] Vent til 12-24t før start (eller manipuler tid)
- [ ] Klikk avbestilling
- [ ] Verifiser: 50% refund policy vises
- [ ] Bekreft avbestilling
- [ ] Delvis refund behandles

### 4.3 Avbestilling < 12t før (Ingen refund)
- [ ] Opprett booking med betaling
- [ ] Vent til < 12t før start (eller manipuler tid)
- [ ] Klikk avbestilling
- [ ] Verifiser: "Ingen refund" policy vises
- [ ] Avbestilling tillates, men ingen refund

### 4.4 No-show scenario
- [ ] Booking passeres uten avbestilling
- [ ] System markerer som no-show (hvis automatisk)
- [ ] Ingen refund behandles
- [ ] Trener kan registrere fravær

---

## 5. Refund Idempotency (OPPGAVE #29)

### 5.1 Duplikat refund fra vår side
- [ ] Opprett booking med betaling
- [ ] Initier refund via avbestilling
- [ ] Forsøk å refundere SAMME booking på nytt (via admin)
- [ ] Verifiser: Kun én refund utføres i Stripe
- [ ] Verifiser: `alreadyProcessed` flagg returneres

### 5.2 Duplikat webhook fra Stripe
- [ ] Opprett booking og fullfør betaling
- [ ] Initier refund i Stripe Dashboard (test)
- [ ] Webhook `charge.refunded` mottas
- [ ] Booking oppdateres til `REFUNDED`
- [ ] Simuler duplikat webhook (send samme event på nytt)
- [ ] Verifiser: HTTP 200 returneres umiddelbart
- [ ] Verifiser: Ingen endring i database (idempotency)

### 5.3 Race condition
- [ ] Opprett booking med betaling
- [ ] Simuler samtidig refund fra to kilder
- [ ] Verifiser: Kun én refund går gjennom
- [ ] Verifiser: `refundIdempotencyKey` lagres
- [ ] Verifiser: `stripeRefundId` lagres

**Stripe Dashboard verifisering:**
```
Gå til: https://dashboard.stripe.com/test/payments
Verifiser: Kun én refund per charge
```

---

## 6. Webhook-håndtering

### 6.1 payment_intent.succeeded
- [ ] Opprett booking (status=PENDING)
- [ ] Fullfør betaling i Stripe
- [ ] Verifiser webhook mottas
- [ ] Booking oppdateres til CONFIRMED
- [ ] PaymentTransaction opprettes
- [ ] Bekreftelses-e-post sendes

### 6.2 payment_intent.payment_failed
- [ ] Opprett booking
- [ ] Bruk feil-kort (`4000 0000 0000 0002`)
- [ ] Verifiser webhook mottas
- [ ] Booking oppdateres til FAILED

### 6.3 charge.refunded
- [ ] Opprett og betal booking
- [ ] Refund i Stripe Dashboard
- [ ] Verifiser webhook mottas
- [ ] Booking oppdateres til REFUNDED/PARTIALLY_REFUNDED
- [ ] PaymentTransaction oppdateres med `refundedAt`

### 6.4 checkout.session.completed
- [ ] Opprett gjeste-booking
- [ ] Fullfør betaling
- [ ] Verifiser webhook mottas
- [ ] `stripePaymentId` lagres på booking

### 6.5 Subscription webhooks
- [ ] customer.subscription.created
- [ ] customer.subscription.updated
- [ ] customer.subscription.deleted
- [ ] invoice.paid
- [ ] invoice.payment_failed

---

## 7. Admin-funksjonalitet

### 7.1 Admin: Avbestilling
- [ ] Logg inn som admin
- [ ] Finn booking i admin-panelet
- [ ] Klikk avbestill
- [ ] Velg full/partial refund
- [ ] Verifiser at refund utføres

### 7.2 Admin: Bulk avbestilling
- [ ] Velg flere bookinger
- [ ] Klikk bulk avbestill
- [ ] Verifiser at alle bookinger avbestilles
- [ ] Verifiser at refunds behandles korrekt

### 7.3 Admin: Ombestilling
- [ ] Finn booking
- [ ] Endre tidspunkt
- [ ] Verifiser at ny booking opprettes
- [ ] Verifiser at gammel booking kanselleres

---

## 8. Edge Cases

### 8.1 Nettverksfeil under betaling
- [ ] Start betaling
- [ ] Kutt nettverk (dev tools)
- [ ] Verifiser feilhåndtering
- [ ] Gjenopprett nettverk
- [ ] Verifiser at betaling kan prøves på nytt

### 8.2 Timeout under betaling
- [ ] Start betaling
- [ ] Simuler timeout
- [ ] Verifiser at booking-status håndteres

### 8.3 Dobbelt-klikk på "Betal"
- [ ] Klikk betal flere ganger raskt
- [ ] Verifiser at kun én betaling går gjennom
- [ ] Verifiser at kun én booking opprettes

### 8.4 Concurrent booking
- [ ] To brukere forsøker å booke samme slot samtidig
- [ ] Én skal lykkes, én skal feile
- [ ] Verifiser race condition-håndtering

### 8.5 Invalid payment method
- [ ] Forsøk å bruke INVOICE der ikke tillatt
- [ ] Forsøk å bruke VIPPS (hvis ikke konfigurert)
- [ ] Verifiser feilmelding

---

## 9. E-post-varsler

### 9.1 Booking bekreftelse
- [ ] Mottas ved ny booking
- [ ] Inneholder riktige detaljer
- [ ] Kalender-invite vedlagt

### 9.2 Avbestilling
- [ ] Mottas ved avbestilling
- [ ] Inneholder refund-info (hvis aktuelt)

### 9.3 Påminnelse
- [ ] 24t-påminnelse sendes
- [ ] SMS-påminnelse sendes (hvis konfigurert)

---

## 10. Mobil-responsivitet

### 10.1 Booking-flow på mobil
- [ ] Test på iPhone (Safari)
- [ ] Test på Android (Chrome)
- [ ] Verifiser at alle steg er brukbare
- [ ] Verifiser at Stripe Elements fungerer

---

## Test Resultat Oppsummering

| Test-kategori | Status | Kommentar |
|---------------|--------|-----------|
| Gjeste-booking | ⬜ | |
| Registrert bruker | ⬜ | |
| Abonnement | ⬜ | |
| Avbestilling >24t | ⬜ | |
| Avbestilling 12-24t | ⬜ | |
| Avbestilling <12t | ⬜ | |
| Refund idempotency | ⬜ | |
| Webhooks | ⬜ | |
| Admin-funksjoner | ⬜ | |
| Edge cases | ⬜ | |
| E-post | ⬜ | |
| Mobil | ⬜ | |

**Testet av:** _________________  
**Dato:** _________________  
**Godkjent for prod:** ⬜ Ja / ⬜ Nei

---

## Stripe Test-kort

| Kortnummer | Scenario |
|------------|----------|
| `4242 4242 4242 4242` | Suksess |
| `4000 0000 0000 0002` | Kort avvist |
| `4000 0000 0000 3220` | 3D Secure suksess |
| `4000 0000 0000 3231` | 3D Secure krever autentisering |
| `4000 0000 0000 9995` | Insufficient funds |

---

## Nyttige SQL-spørringer

```sql
-- Siste bookinger
SELECT * FROM "Booking" 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- Bookinger med refund
SELECT * FROM "Booking" 
WHERE "stripeRefundId" IS NOT NULL;

-- Betalingstransaksjoner
SELECT * FROM "PaymentTransaction" 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- Webhook events (hvis logget)
-- Sjekk logger i Vercel/Logtail
```
