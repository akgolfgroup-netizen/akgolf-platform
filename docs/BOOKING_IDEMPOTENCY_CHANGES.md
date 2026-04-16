# Booking Idempotency - Endringslogg

> Dokumentasjon av endringer gjort i forbindelse med OPPGAVE #29 og #30
> Dato: 2026-04-13

## Endrede filer

### 1. Database (prisma/schema.prisma)
**Endring:** Lagt til to nye kolonner i `Booking`-tabellen:

```prisma
stripeRefundId        String?  // Stripe refund ID (re_xxx)
refundIdempotencyKey  String?  // Idempotency key for refund-operasjonen
```

**Migrasjon:** `prisma/migrations/20260413_add_refund_idempotency/migration.sql`

---

### 2. Refund-logikk (lib/portal/booking/refund.ts)
**Endringer:**
- Ny signatur på `processRefund()` - nå med objekt-parameter som inkluderer `bookingId`
- Idempotency-sjekk før refund-kall:
  - Sjekker om `stripeRefundId` allerede finnes
  - Sjekker om `paymentStatus` allerede er REFUNDED
  - Henter eksisterende refund fra Stripe hvis funnet
- Genererer idempotency-key: `refund-{bookingId}-{timestamp}`
- Lagrer key før Stripe API-kall
- Lagrer `stripeRefundId` etter vellykket refund
- Håndterer Stripe-feil:
  - `charge_already_refunded` → returnerer `alreadyProcessed: true`
  - Idempotency-konflikter → prøver å finne eksisterende refund
- Ny funksjon `getRefundStatus()` for å sjekke refund-status

**Ny signatur:**
```typescript
interface RefundOptions {
  bookingId: string;
  paymentMethod: PaymentMethod;
  providerPaymentId: string | null;
  totalAmount: number;
  refundPercent: number;
}

interface RefundResult {
  success: boolean;
  refundedAmount: number;
  providerRefundId?: string;
  error?: string;
  alreadyProcessed?: boolean;  // Nytt felt
}
```

---

### 3. Cancel API (app/api/portal/bookings/cancel/route.ts)
**Endring:** Oppdatert kall til `processRefund()` til ny signatur:

```typescript
// Før:
refundResult = await processRefund(
  booking.paymentMethod,
  booking.stripePaymentId,
  booking.amount,
  cancellation.refundPercent
);

// Etter:
refundResult = await processRefund({
  bookingId,
  paymentMethod: booking.paymentMethod,
  providerPaymentId: booking.stripePaymentId,
  totalAmount: booking.amount,
  refundPercent: cancellation.refundPercent,
});
```

---

### 4. Admin Actions (app/admin/(authed)/bookinger/actions.ts)
**Endring:** Oppdatert kall til `processRefund()` til ny signatur (samme som over)

---

### 5. Portal Actions (app/portal/(dashboard)/bookinger/actions.ts)
**Endring:** Oppdatert kall til `processRefund()` til ny signatur (samme som over)

---

### 6. Stripe Webhook (app/api/portal/webhooks/stripe/route.ts)
**Endring:** Oppdatert `charge.refunded` event-håndtering:

- Lagt til idempotency-sjekk på starten:
  ```typescript
  // Hvis booking allerede er refundert, returner 200 umiddelbart
  if (booking.paymentStatus === "REFUNDED" || 
      booking.paymentStatus === "PARTIALLY_REFUNDED") {
    return NextResponse.json({ received: true, skipped: true }, { status: 200 });
  }
  ```

- Lagrer `stripeRefundId` fra webhook hvis tilgjengelig:
  ```typescript
  const refundId = charge.refunds?.data[0]?.id;
  if (refundId && !booking.stripeRefundId) {
    updateData.stripeRefundId = refundId;
  }
  ```

---

### 7. Tester (__tests__/booking/booking-flow.test.ts)
**Ny fil** med følgende test-suiter:

1. **Guest Booking Flow**
   - Service selection
   - Date/time selection
   - User registration
   - Payment flow

2. **Subscription Booking Flow**
   - NONE payment method
   - Quota tracking

3. **Refund and Cancellation Flow**
   - Cancellation policy (>24t, 12-24t, <12t)
   - Refund idempotency
   - Status updates

4. **Webhook Handling**
   - payment_intent.succeeded
   - charge.refunded (med idempotency)
   - Duplicate handling

5. **Edge Cases**
   - No-show scenario
   - INVOICE payment method
   - Missing stripePaymentId

---

### 8. Sjekkliste (docs/BOOKING_CHECKLIST.md)
**Ny fil** med manuell verifiseringssjekkliste:

- Gjeste-booking flyt
- Registrert bruker booking
- Abonnement-booking
- Avbestilling og refund (>24t, 12-24t, <12t)
- Refund idempotency
- Webhook-håndtering
- Admin-funksjonalitet
- Edge cases
- E-post-varsler
- Mobil-responsivitet

---

## Sammendrag

### Sikkerhet
- Refunds kan kun utføres én gang per booking
- Duplikate webhooks returnerer 200 uten å gjøre endringer
- Race conditions håndteres via idempotency keys

### Database-endringer
```sql
ALTER TABLE "Booking" ADD COLUMN "stripeRefundId" TEXT;
ALTER TABLE "Booking" ADD COLUMN "refundIdempotencyKey" TEXT;
CREATE INDEX "Booking_stripeRefundId_idx" ON "Booking"("stripeRefundId");
CREATE INDEX "Booking_refundIdempotencyKey_idx" ON "Booking"("refundIdempotencyKey");
```

### Neste steg for deploy
1. Kjør migrasjon: `npx prisma migrate dev`
2. Generer Prisma client: `npx prisma generate`
3. Kjør tester: `npm test`
4. Gjennomfør manuell verifisering (se BOOKING_CHECKLIST.md)
5. Deploy til staging
6. Verifiser med Stripe test-mode
7. Deploy til produksjon

### Tester å kjøre før deploy
```bash
npm test -- __tests__/booking/booking-flow.test.ts
npm test -- __tests__/booking/api.test.ts
```
