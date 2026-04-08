# Booking System Validation & Testing

**MÅL: 100% pålitelighet - ingen dobbeltbookings**

Dette dokumentet beskriver booking-systemets validerings- og test-infrastruktur.

## Arkitektur

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│              (app/api/booking/create)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Validation Layer                            │
│           (lib/portal/booking/validation.ts)                 │
│                                                              │
│  • Input validering                                          │
│  • Tidsbegrensninger (minNotice, maxAdvance)                 │
│  • Instruktør-tilgjengelighet                                │
│  • Konfliktsjekk (dobbeltbooking)                            │
│  • Kvote-sjekk (abonnement)                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Locking Layer                               │
│           (lib/portal/booking/conflict-check.ts)             │
│                                                              │
│  • Pessimistic locking (BookingLock)                         │
│  • Race condition beskyttelse                                │
│  • Cleanup av utløpte låser                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Database Layer                              │
│                  (Prisma + PostgreSQL)                       │
│                                                              │
│  • Triggers: prevent_double_booking_insert/update            │
│  • Triggers: prevent_blocked_time_booking                    │
│  • Constraints: @@unique([instructorId, startTime, endTime]) │
│  • Serializable transactions                                 │
└─────────────────────────────────────────────────────────────┘
```

## Filer

### 1. Database (Prisma)

**`prisma/schema.prisma`**
```prisma
model BookingLock {
  id            String   @id
  instructorId  String
  startTime     DateTime
  endTime       DateTime
  lockedBy      String   // Session/user ID
  lockedAt      DateTime @default(now())
  expiresAt     DateTime // 5 minutter fra nå
  
  @@unique([instructorId, startTime, endTime])
  @@index([expiresAt])
}
```

**`prisma/migrations/20250406_booking_validation/migration.sql`**
- Trigger: `prevent_double_booking_insert`
- Trigger: `prevent_double_booking_update`
- Trigger: `prevent_blocked_time_booking`
- View: `booking_conflicts_view` (for monitorering)

### 2. Validering

**`lib/portal/booking/validation.ts`**
- `validateBooking()` - Hovedvalideringsfunksjon
- `formatValidationErrors()` - Formater feil til brukervennlig tekst
- `isRetryableError()` - Sjekk om feil kan retry-es

**`lib/portal/booking/conflict-check.ts`**
- `checkCompleteConflict()` - Komplett konfliktsjekk
- `acquireBookingLock()` - Skaff pessimistisk lås
- `releaseBookingLock()` - Frigjør lås
- `detectExistingDoubleBookings()` - Finn eksisterende konflikter

### 3. Tester

**`__tests__/booking/validation.test.ts`**
- Unit-tester for all valideringslogikk
- Tester for dobbeltbooking-deteksjon
- Tester for tidsbegrensninger
- **Coverage-mål: 100%**

**`__tests__/booking/api.test.ts`**
- Integrasjonstester for API
- Concurrent booking tester (race conditions)
- 5 parallelle requests tester

### 4. Health Check

**`app/api/health/booking/route.ts`**
- Sjekker database-tilkobling
- Sjekker for dobbeltbookings
- Sjekker BookingLock-status
- Metrics: totalBookings, activeBookings, pendingLocks

## Bruk

### Basis validering

```typescript
import { validateBooking } from "@/lib/portal/booking";

const result = await validateBooking({
  instructorId: "ins_123",
  startTime: new Date("2025-04-15T14:00:00Z"),
  serviceTypeId: "svc_456",
  studentId: "stu_789", // Optional
});

if (!result.valid) {
  console.error(result.errors);
  return;
}
```

### Med pessimistisk låsing

```typescript
import { acquireBookingLock, releaseBookingLock } from "@/lib/portal/booking";

// 1. Skaff lås
const lockResult = await acquireBookingLock(
  instructorId,
  startTime,
  endTime,
  sessionId // Brukerens session ID
);

if (!lockResult.success) {
  return { error: lockResult.error };
}

// 2. Forleng hvis betaling tar tid
await extendBookingLock(lockResult.lockId!, 5);

try {
  // 3. Opprett booking
  const booking = await prisma.booking.create({...});
  
  // 4. Behandle betaling
  await processPayment(booking);
  
} finally {
  // 5. ALLTID frigjør lås
  await releaseBookingLock(lockResult.lockId!);
}
```

### Health Check

```bash
# Sjekk systemhelse
curl https://akgolf.no/api/health/booking

# Respons:
{
  "status": "healthy",
  "timestamp": "2025-04-06T12:00:00Z",
  "checks": {
    "database": { "status": "pass", "responseTimeMs": 15 },
    "doubleBookings": { "status": "pass", "message": "Ingen dobbeltbookings funnet" },
    "locks": { "status": "pass", "activeLocks": 2, "expiredLocks": 0 }
  },
  "metrics": {
    "totalBookings": 1523,
    "activeBookings": 127,
    "pendingLocks": 2,
    "doubleBookingsDetected": 0
  }
}
```

### Admin-operasjoner

```bash
# Rydd opp utløpte låser
curl -X POST https://akgolf.no/api/health/booking \
  -H "Content-Type: application/json" \
  -d '{"action": "cleanup-locks"}'

# Sjekk for konflikter
curl -X POST https://akgolf.no/api/health/booking \
  -H "Content-Type: application/json" \
  -d '{"action": "check-conflicts"}'
```

## Feilhåndtering

### Retry-able feil

Disse feilene kan brukeren prøve på nytt:
- `TIME_SLOT_CONFLICT` - Noen andre booket akkurat
- `LOCK_ACQUISITION_FAILED` - Midlertidig lås-konflikt
- `RATE_LIMIT_EXCEEDED` - For mange forsøk

### Ikke-retry-able feil

Disse feilene vil alltid feile:
- `BOOKING_IN_PAST` - Tidspunktet har vært
- `QUOTA_EXCEEDED` - Ingen ledige sesjoner
- `MIN_NOTICE_VIOLATION` - For sent varsel

## Race Condition Beskyttelse

Systemet har 3 lag med beskyttelse:

1. **Application Layer** (Validation)
   - Sjekker konflikter før database-operasjon
   - Rask feedback til brukeren

2. **Locking Layer** (BookingLock)
   - Pessimistisk låsing under booking-prosess
   - Forhindrer parallelle bookings av samme slot

3. **Database Layer** (Triggers)
   - PostgreSQL triggers sjekker konflikter
   - Serializable transactions
   - Ultimate garanti mot dobbeltbookings

## Konfigurasjon

```typescript
// Lock duration (minutter)
const LOCK_DURATION_MINUTES = 5;

// Cleanup interval (millisekunder)
const LOCK_CLEANUP_INTERVAL_MS = 60000;

// Start cleanup ved app-boot
import { startLockCleanup } from "@/lib/portal/booking";
startLockCleanup();
```

## Metrics & Logging

### Logger

```typescript
logger.info("[booking/validation] Booking validated", {...});
logger.info("[booking/lock] Lock acquired", { lockId, instructorId });
logger.error("[booking/lock] Lock acquisition failed", { error });
logger.error("[health/booking] Double bookings detected!", { count, conflicts });
```

### Metrics (til Vercel Analytics)

- `booking_attempts_total`
- `booking_success_total`
- `booking_failures_total`
- `double_booking_prevented_total`
- `validation_errors_total`

## Testing

### Kjør tester

```bash
# Alle tester
npm test

# Kun booking-tester
npm test __tests__/booking

# Med coverage
npm test -- --coverage
```

### Test-scenarioer

| Scenario | Forventet resultat |
|----------|-------------------|
| To parallelle requests samme slot | Én 200, én 409 |
| 5 parallelle requests samme slot | Én 200, fire 409 |
| Overlappende tidspunkt | Konflikt detektert |
| Blokkert tid | Konflikt detektert |
| Utløpt lås | Ryddet opp ved neste cleanup |

## Sikkerhet

- **SQL Injection**: Beskyttet via Prisma parameter binding
- **Race Conditions**: Beskyttet via 3-lags arkitektur
- **Dobbeltbookings**: Forhindret av database triggers
- **PII**: Sanitert i logger via `sanitizeValidationInput()`

## Vedlikehold

### Daglig
- Sjekk `/api/health/booking`
- Sjekk logs for errors

### Ukentlig
- Kjør `check-conflicts` admin action
- Verifiser at cleanup fungerer

### Ved deploy
- Kjør migrasjoner: `npx prisma migrate deploy`
- Verifiser triggers er på plass
- Kjør integration-tester
