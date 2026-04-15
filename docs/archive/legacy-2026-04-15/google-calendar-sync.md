# Google Calendar Sync

Automatisk synkronisering av Google Calendar events til AK Golf booking-systemet. Sikrer at kunder ikke kan booke tider når Anders har møter i sin personlige kalender.

## Hvordan det fungerer

1. **OAuth2-tilkobling**: Anders autoriserer AK Golf til å lese sin Google Calendar
2. **Automatisk synkronisering**: Events synkroniseres hver time via Vercel Cron
3. **Sanntidsoppdateringer**: Webhooks gir umiddelbar synkronisering ved endringer
4. **BlockedTime**: Importerte events blokkerer bookinger automatisk

## Komponenter

### Database

- **`GoogleCalendarSync`**: Lagrer OAuth-tokens og synkroniseringsinnstillinger
- **`BlockedTime`**: Utvidet med `source`, `externalId` for å spore importerte events

### API Routes

| Route | Metode | Beskrivelse |
|-------|--------|-------------|
| `/api/portal/calendar/google/auth` | GET | Start OAuth2-flyt |
| `/api/portal/calendar/google/callback` | GET | Motta OAuth2-callback |
| `/api/portal/calendar/google/sync` | GET | Hent status og events |
| `/api/portal/calendar/google/sync` | POST | Manuell synkronisering |
| `/api/portal/calendar/google/sync` | DELETE | Koble fra kalender |
| `/api/portal/calendar/google/webhook` | POST | Motta push-notifikasjoner |
| `/api/cron/sync-google-calendars` | GET | Automatisk synk (cron) |

### Biblioteker

- `lib/portal/google-calendar/sync.ts`: Hovedsynkronisering
- `lib/portal/google-calendar/webhook.ts`: Webhook-håndtering
- `hooks/useGoogleCalendarSync.ts`: React hook
- `components/GoogleCalendarSyncPanel.tsx`: Admin UI-komponent

## Oppsett

### 1. Google Cloud Console

1. Gå til [Google Cloud Console](https://console.cloud.google.com/)
2. Velg prosjektet for AK Golf
3. Aktiver **Google Calendar API**
4. Gå til **Credentials** → **OAuth 2.0 Client IDs**
5. Rediger eksisterende client eller opprett ny
6. Legg til autorisert redirect URI:
   ```
   https://akgolf.no/api/portal/calendar/google/callback
   ```
7. Sørg for at følgende scopes er aktivert:
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/calendar.readonly`

### 2. Miljøvariabler

Legg til i `.env`:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_APP_URL=https://akgolf.no
```

### 3. Database-migrasjon

```bash
npx prisma migrate dev --name add_google_calendar_sync
```

### 4. Cron-job (allerede konfigurert)

I `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-google-calendars",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Bruk i Admin

### Koble til Google Calendar

```tsx
// I admin/settings eller tilsvarende side
import { GoogleCalendarSyncPanel } from "@/components/GoogleCalendarSyncPanel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1>Innstillinger</h1>
      <GoogleCalendarSyncPanel />
    </div>
  );
}
```

### Egen tilpasning med hook

```tsx
import { useGoogleCalendarSync } from "@/hooks/useGoogleCalendarSync";

function CustomCalendarSettings() {
  const { status, isLoading, syncNow, disconnect } = useGoogleCalendarSync();

  if (isLoading) return <Spinner />;

  if (!status) {
    return <a href="/api/portal/calendar/google/auth">Koble til</a>;
  }

  return (
    <div>
      <p>Sist synkronisert: {status.lastSyncAt}</p>
      <button onClick={syncNow}>Synkroniser</button>
      <button onClick={disconnect}>Koble fra</button>
    </div>
  );
}
```

## Filtrering av events

Følgende events synkroniseres **ikke**:

- **Avlyste events** (`status: "cancelled"`)
- **Transparente events** (`transparency: "transparent"`, markert som "ledig")
- **Private events** (`visibility: "private"`)

## Recurring events

Gjentakende events ekspanderes automatisk av Google Calendar API (med `singleEvents: true`). Hver instans får sin egen `BlockedTime`-rad.

## Feilsøking

### Sjekk synkroniseringsstatus

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://akgolf.no/api/cron/sync-google-calendars
```

### Manuelle kommandoer

```typescript
// I utviklingsmiljø
import { syncGoogleCalendar } from "@/lib/portal/google-calendar/sync";

// Synkroniser spesifikk instruktør
await syncGoogleCalendar("instructor_id");

// Synkroniser alle
await syncAllGoogleCalendars();
```

### Vanlige problemer

| Problem | Løsning |
|---------|---------|
| "Token refresh failed" | Sjekk at `GOOGLE_CLIENT_SECRET` er korrekt |
| Ingen events synkroniseres | Sjekk at kalenderen ikke er privat |
| Webhook fungerer ikke | Verifiser at URL er offentlig tilgjengelig |

## Sikkerhet

- **OAuth2 State**: CSRF-beskyttelse med HMAC-signering
- **Token-refresh**: Automatisk refresh før utløp
- **Cron-auth**: Krever `CRON_SECRET` for batch-synk
- **Scope-minimalisering**: Kun lesetilgang til kalender

## Vedlikehold

### Opprydding av gamle events

Gamle `BlockedTime`-rader fra Google Calendar kan ryddes opp:

```sql
-- Slett events eldre enn 90 dager
DELETE FROM "BlockedTime"
WHERE source = 'GOOGLE_CALENDAR'
  AND "endTime" < NOW() - INTERVAL '90 days';
```

### Token-revokering

Hvis en bruker vil trekke tilbake tilgang:

1. Brukeren fjerner tilgang i [Google Account](https://myaccount.google.com/permissions)
2. Systemet vil automatisk feile ved neste sync
3. Admin kan koble fra i dashboardet

## Testing

```bash
# Lokal testing av OAuth-flyt
npm run dev
# Gå til http://localhost:3000/api/portal/calendar/google/auth

# Merk: localhost må være autorisert i Google Cloud Console
```
