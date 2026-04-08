# Real-time Sync System

Datasynkronisering mellom Spillerportal og Mission Control.

## Arkitektur

```
┌─────────────────┐     SSE      ┌─────────────────┐
│   Spillerportal │ ◄──────────► │   Sync Server   │
│   (Elev-view)   │              │   (API Routes)  │
└─────────────────┘              └────────┬────────┘
       ▲                                  │
       │                                  │ Database
       │                                  ▼
       │                         ┌─────────────────┐
       │                         │   SyncEvent     │
       │                         │   AuditLog      │
       │                         └─────────────────┘
       │                                  ▲
       │                                  │
       │                                  │
┌─────────────────┐              ┌───────┴────────┐
│  Mission Control│ ◄──────────► │   Sync Server  │
│   (Admin-view)  │     SSE      │   (API Routes) │
└─────────────────┘              └────────────────┘
```

## Komponenter

### 1. Server-Side Events (SSE)

SSE endpoint: `/api/portal/sync/events`

- Etveiskommunikasjon: Server → Client
- Auto-reconnect med exponential backoff
- Heartbeat hvert 30. sekund

### 2. Optimistic Updates

For umiddelbar UI-respons (< 100ms):

```typescript
import { optimisticUpdate, addBookingOptimistically } from '@/lib/portal/sync';

const result = await optimisticUpdate({
  queryClient,
  queryKey: queryKeys.bookings.byStudent(studentId),
  updateFn: (old) => addBookingOptimistically(old, newBooking),
  mutationFn: () => createBookingAPI(newBooking),
});
```

### 3. Query Keys

Sentraliserte query keys for konsistent cache-invalidasjon:

```typescript
import { queryKeys } from '@/lib/portal/sync';

// Invalidere alle bookings
queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });

// Invalidere spesifikk elev
queryClient.invalidateQueries({ queryKey: queryKeys.bookings.byStudent(id) });
```

### 4. Sync Events

Automatisk håndtering av events:

```typescript
useSync({
  userId: user.id,
  userRole: user.role,
  onEvent: (event) => console.log('Event:', event),
});
```

## Bruk

### Setup i Layout

```tsx
// app/portal/(dashboard)/layout.tsx
import { SyncProvider } from '@/components/portal/sync';

export default function DashboardLayout({ children, user }) {
  return (
    <SyncProvider userId={user.id} userRole={user.role}>
      {children}
    </SyncProvider>
  );
}
```

### Emit Events fra API Routes

```typescript
// app/api/booking/create/route.ts
import { emitBookingEvent, logAuditEvent } from '@/lib/portal/sync';

export async function POST(req: Request) {
  const booking = await prisma.booking.create({ data });
  
  // Send sync event
  await emitBookingEvent('BOOKING_CREATED', booking, userId, 'PORTAL');
  
  // Log audit
  await logAuditEvent({
    tableName: 'Booking',
    recordId: booking.id,
    action: 'CREATE',
    after: booking,
    userId,
    sourceSystem: 'PORTAL',
  });
  
  return Response.json(booking);
}
```

### Data Fetching med TanStack Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, optimisticUpdate } from '@/lib/portal/sync';

// Query
const { data: bookings } = useQuery({
  queryKey: queryKeys.bookings.byStudent(userId),
  queryFn: () => fetchBookings(userId),
});

// Mutation med optimistic update
const mutation = useMutation({
  mutationFn: createBooking,
  onMutate: async (newBooking) => {
    await queryClient.cancelQueries({ 
      queryKey: queryKeys.bookings.byStudent(userId) 
    });
    
    const previous = queryClient.getQueryData(
      queryKeys.bookings.byStudent(userId)
    );
    
    queryClient.setQueryData(
      queryKeys.bookings.byStudent(userId),
      (old) => [...old, newBooking]
    );
    
    return { previous };
  },
  onError: (err, newBooking, context) => {
    queryClient.setQueryData(
      queryKeys.bookings.byStudent(userId),
      context.previous
    );
  },
});
```

## Event Typer

| Event | Beskrivelse | Targets |
|-------|-------------|---------|
| `BOOKING_CREATED` | Ny booking opprettet | Student, Instruktør |
| `BOOKING_UPDATED` | Booking endret | Student, Instruktør |
| `BOOKING_CANCELLED` | Booking kansellert | Student, Instruktør |
| `BOOKING_RESCHEDULED` | Booking flyttet | Student, Instruktør |
| `AVAILABILITY_CHANGED` | Tilgjengelighet endret | Instruktør |
| `COACHING_NOTES_ADDED` | Coaching-notater lagt til | Student |
| `NOTIFICATION_CREATED` | Ny notifikasjon | Mottaker |

## Databasemodeller

### SyncEvent

```prisma
model SyncEvent {
  id            String          @id @default(cuid())
  type          SyncEventType
  payload       Json
  targetUserIds String[]
  targetRoles   String[]
  sourceUserId  String?
  sourceSystem  String
  status        SyncEventStatus @default(PENDING)
  deliveredTo   String[]
  failedFor     String[]
  createdAt     DateTime        @default(now())
  expiresAt     DateTime
  dedupKey      String?         @unique
}
```

### SyncAuditLog

```prisma
model SyncAuditLog {
  id            String    @id @default(cuid())
  tableName     String
  recordId      String
  action        String
  before        Json?
  after         Json?
  changedFields String[]
  userId        String?
  sourceSystem  String
  correlationId String?
  createdAt     DateTime  @default(now())
}
```

## Performance

- **Max forsinkelse**: 2 sekunder (event polling)
- **Optimistic updates**: < 100ms
- **Heartbeat**: 30 sekunder
- **Cache TTL**: 5 minutter
- **Event TTL**: 1 time (automatisk cleanup)

## Cron Jobs

Legg til i `vercel.json` eller cron service:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-cleanup",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

```typescript
// app/api/cron/sync-cleanup/route.ts
import { cleanupExpiredEvents, cleanupStaleConnections } from '@/lib/portal/sync';

export async function GET() {
  const [eventsCleaned, connectionsCleaned] = await Promise.all([
    cleanupExpiredEvents(),
    cleanupStaleConnections(),
  ]);
  
  return Response.json({ eventsCleaned, connectionsCleaned });
}
```

## Testing

```typescript
// Test optimistic update
import { addBookingOptimistically } from '@/lib/portal/sync/optimistic';

test('adds booking optimistically', () => {
  const existing = [{ id: '1', startTime: '2024-01-01T10:00:00Z' }];
  const newBooking = { id: '2', startTime: '2024-01-01T09:00:00Z' };
  
  const result = addBookingOptimistically(existing, newBooking);
  
  expect(result).toHaveLength(2);
  expect(result[0].id).toBe('2'); // Sortert først
});
```

## Troubleshooting

### Connection Issues

1. Sjekk at `userId` og `role` er satt
2. Sjekk nettverkstab
3. Se i console for reconnect attempts

### Missing Events

1. Sjekk at event ble created i databasen
2. Verifiser `targetUserIds` inkluderer riktig bruker
3. Sjekk at event ikke er expired

### Cache Not Updating

1. Verifiser query key matcher
2. Sjekk at invalidation skjer etter mutation
3. Bruk React Query Devtools

## Roadmap

- [ ] Redis pub/sub for bedre skalerbarhet
- [ ] WebSocket støtte for toveis kommunikasjon
- [ ] Conflict resolution for offline-first
- [ ] Delta sync for store datasett
