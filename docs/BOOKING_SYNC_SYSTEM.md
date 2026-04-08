# Booking Sync System

Et robust system for sanntidssynkronisering av tilgjengelige tider mellom admin (Mission Control) og kunde-booking.

## Oversikt

Dette systemet sikrer at:
1. Admin kan endre tilgjengelighet uten risiko for dobbeltbookinger
2. Kunder alltid ser oppdaterte, tilgjengelige tider
3. Ingen dobbeltbookinger kan skje (database-garantier + atomic transactions)
4. Endringer logges for audit
5. Sanntidsoppdateringer pushes til aktive brukere

## Arkitektur

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ADMIN (Mission Control)                        │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ POST /api/portal/admin/availability
                                   │ (oppdater tilgjengelighet)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Database (PostgreSQL)                               │
│  ┌─────────────────────────┐    ┌──────────────────────────────────────┐   │
│  │ InstructorAvailability  │    │ AvailabilityChangeLog (audit)        │   │
│  │ - isActive              │    │ - changeType: CREATED/UPDATED/etc    │   │
│  │ - validFrom/validUntil  │    │ - oldValue/newValue (JSON)           │   │
│  │ - createdAt/updatedAt   │    │ - changedBy (user ID)                │   │
│  └─────────────────────────┘    └──────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   Next.js Cache │    │   SSE (Server-Sent   │    │   Public Slots API   │
│   (30s TTL)     │    │   Events)            │    │   GET /api/public/   │
│                 │    │   /bookings/live     │    │   slots              │
│  - invalidate   │    │                      │    │                      │
│    on change    │    │  - push updates to   │    │  - cached 30s        │
│                 │    │    active clients    │    │  - atomic checks     │
└─────────────────┘    └──────────────────────┘    └──────────────────────┘
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CUSTOMER (Booking UI)                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Database-endringer

### InstructorAvailability (utvidet)

```sql
ALTER TABLE "InstructorAvailability" 
ADD COLUMN "isActive" BOOLEAN DEFAULT true,
ADD COLUMN "validFrom" TIMESTAMP DEFAULT now(),
ADD COLUMN "validUntil" TIMESTAMP,
ADD COLUMN "createdAt" TIMESTAMP DEFAULT now(),
ADD COLUMN "updatedAt" TIMESTAMP;

CREATE INDEX ON "InstructorAvailability"(instructorId, isActive);
CREATE INDEX ON "InstructorAvailability"(validFrom, validUntil);
```

### AvailabilityChangeLog (ny)

```sql
CREATE TABLE "AvailabilityChangeLog" (
    id TEXT PRIMARY KEY,
    availabilityId TEXT NOT NULL REFERENCES "InstructorAvailability"(id),
    instructorId TEXT NOT NULL,
    changedBy TEXT NOT NULL,
    changeType "AvailabilityChangeType" NOT NULL,
    oldValue JSONB,
    newValue JSONB,
    changeReason TEXT,
    createdAt TIMESTAMP DEFAULT now()
);

CREATE INDEX ON "AvailabilityChangeLog"(instructorId);
CREATE INDEX ON "AvailabilityChangeLog"(createdAt);
```

## API-endepunkter

### Admin API

#### GET /api/portal/admin/availability?instructorId=xxx
Henter tilgjengelighet og recent changes for en instruktør.

#### POST /api/portal/admin/availability
Oppretter eller oppdaterer tilgjengelighet med audit logging.

**Request:**
```json
{
  "instructorId": "string",
  "dayOfWeek": 0-6,
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "isActive": true,
  "validFrom": "2024-01-01T00:00:00Z",
  "validUntil": null
}
```

#### DELETE /api/portal/admin/availability
Deaktiverer (soft-delete) tilgjengelighet.

### Public API

#### GET /api/portal/public/slots?instructorId=xxx&serviceTypeId=xxx&date=YYYY-MM-DD
Henter tilgjengelige slots med 30s cache.

**Headers:**
- `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`
- `X-Cache: HIT/MISS`

### Booking API

#### POST /api/booking/create
Oppretter booking med atomic transaction og pessimistic locking.

**Konfliktsjekk:**
1. Sjekk for eksisterende bookinger (PENDING/CONFIRMED)
2. Sjekk for blokkerte tider
3. Inkluder buffer-tider i konfliktvinduet
4. Serializable isolation level

### SSE API

#### GET /api/portal/bookings/live?instructorId=xxx&date=YYYY-MM-DD
Server-Sent Events for sanntidsoppdateringer.

**Events:**
- `connected` - Initial connection
- `heartbeat` - Keep-alive (30s)
- `SLOTS_UPDATED` - Tilgjengelighet endret
- `BOOKING_CREATED` - Ny booking opprettet
- `timeout` - Connection timeout (5min)

## Konfliktsjekk

```typescript
// Atomic booking creation
const booking = await prisma.$transaction(async (tx) => {
  // 1. Sjekk konflikt (lås raden)
  const conflict = await tx.booking.findFirst({
    where: { /* ... */ },
  });
  
  if (conflict) throw new Error("Tidspunktet ble nettopp booket");
  
  // 2. Sjekk blokkerte tider
  const blocked = await tx.blockedTime.findFirst({
    where: { /* ... */ },
  });
  
  if (blocked) throw new Error("Tidspunktet er ikke tilgjengelig");
  
  // 3. Opprett booking
  return tx.booking.create({ /* ... */ });
}, {
  isolationLevel: "Serializable",
  maxWait: 5000,
  timeout: 10000,
});
```

## Caching

### Slot-caching
- **TTL:** 30 sekunder
- **Revalidate:** Stale-while-revalidate 60 sekunder
- **Invalidation:** Ved admin-endringer eller nye bookinger

### Cache-invalidering
```typescript
// Etter admin-endring
await invalidateSlotsCache(instructorId, date);

// Etter ny booking
await Promise.all([
  invalidateSlotsCache(instructorId, date),
  invalidateBookingsCache(instructorId),
]);
```

## Audit Logging

Alle endringer i tilgjengelighet logges:

```typescript
await tx.availabilityChangeLog.create({
  data: {
    availabilityId: availability.id,
    instructorId: data.instructorId,
    changedBy: user.id,
    changeType: "UPDATED", // CREATED | UPDATED | DEACTIVATED | REACTIVATED | DELETED
    oldValue: { dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
    newValue: { dayOfWeek: 1, startTime: "10:00", endTime: "16:00" },
  },
});
```

## Rate Limiting

- **Slots API:** 100 requests/minutt per IP
- **Booking Create:** 10 requests/minutt per IP
- **Admin API:** 60 requests/minutt per IP

## Feilhåndtering

| Status | Årsak | Handling |
|--------|-------|----------|
| 409 | Konflikt (dobbelbooking) | Vis feilmelding, refresh slots |
| 429 | Rate limit | Vent og prøv igjen |
| 503 | Service unavailable | Retry med backoff |
| 400 | Ugyldig input | Validering frontend |

## Bruk av SSE fra klient

```typescript
const eventSource = new EventSource(
  `/api/portal/bookings/live?instructorId=${instructorId}&date=${date}`
);

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'SLOTS_UPDATED':
      // Refetch slots
      fetchSlots();
      break;
    case 'BOOKING_CREATED':
      // Oppdater UI
      removeSlot(data.startTime);
      break;
  }
};

eventSource.onerror = () => {
  // Reconnect etter 5 sekunder
  setTimeout(connectSSE, 5000);
};
```

## Sikkerhet

1. **Row Level Security:** Aktivert på alle tabeller
2. **Admin-tilgang:** Sjekkes i alle admin-endepunkter
3. **Rate limiting:** Beskyttelse mot brute-force
4. **Atomic transactions:** Ingen race conditions
5. **Audit logging:** Sporbarhet for alle endringer

## Ytelse

- **Cache hit ratio:** Forventet >90% for slots
- **Responstid:** <100ms for cached slots
- **Database:** Indekser på alle søkekriterier
- **SSE:** Maks 5 minutter connection tid

## Deploy

1. Kjør migrasjon:
   ```bash
   npx prisma migrate deploy
   ```

2. Verifiser indekser:
   ```sql
   \di "InstructorAvailability"*
   ```

3. Test API-endepunkter

4. Monitor cache hit ratio

## Troubleshooting

### Dobbeltbookinger fortsatt mulig?
- Sjekk at `isolationLevel: "Serializable"` brukes
- Verifiser at buffer-tider inkluderes i konfliktsjekk

### Cache ikke invalidert?
- Sjekk at `invalidateSlotsCache` kalles etter endringer
- Verifiser cache headers i respons

### SSE ikke fungerer?
- Sjekk at nginx buffering er disabled (`X-Accel-Buffering: no`)
- Verifiser at proxy ikke buffer SSE
