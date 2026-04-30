# Content Model

## Booking

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| userId | string | Referanse til bruker |
| instructorId | string | Referanse til instruktor |
| serviceTypeId | string | Referanse til tjenestetype |
| startTime | DateTime | Starttidspunkt |
| endTime | DateTime | Sluttidspunkt |
| status | BookingStatus | PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW |
| paymentStatus | PaymentStatus | PENDING, PAID, REFUNDED, FAILED |
| paymentMethod | PaymentMethod | STRIPE, VIPPS, INVOICE, NONE |
| stripePaymentId | string? | Stripe Payment Intent ID |
| totalAmount | Float | Belop i kroner |
| notes | string? | Kundenotater |
| guestName | string? | Navn for gjest uten konto |
| guestEmail | string? | E-post for gjest |
| guestPhone | string? | Telefon for gjest |

**Statusverdier:** PENDING → CONFIRMED → COMPLETED (happy path)

---

## ServiceType (Tjeneste)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| name | string | Navn (f.eks. "Performance Pro") |
| description | string | Beskrivelse |
| category | ServiceCategory | INDIVIDUAL, GROUP, SIMULATOR, etc. |
| durationMinutes | Int | Varighet |
| price | Float | Pris i kroner |
| maxParticipants | Int | Maks deltakere |
| isActive | Boolean | Aktiv/inaktiv |
| sortOrder | Int | Sortering |

---

## User (Spiller)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| supabaseId | string? | Supabase Auth UUID |
| email | string | E-post |
| name | string? | Fullt navn |
| phone | string? | Telefon |
| image | string? | Profilbilde URL |
| role | UserRole | ADMIN, INSTRUCTOR, STUDENT, INVITED |
| subscriptionTier | SubscriptionTier | VISITOR → ELITE |
| handicap | Float? | Golfhandicap |
| latestAiInsight | string? | Siste AI-innsikt |
| portalMonthlyLogCount | Int | Logger denne maneden |
| portalMonthlyAiCount | Int | AI-kall denne maneden |

---

## CoachingSession

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| bookingId | string | Kobling til booking |
| summary | string? | AI-generert oppsummering |
| transcriptionText | string? | Transkribert lydopptak |
| coachNotes | string? | Trenerens notater |
| focusAreas | string[] | Fokusomrader |
| drills | string[] | Ovelser gjennomfort |

---

## TrainingPlan

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| userId | string | Referanse til bruker |
| title | string | Tittel |
| startDate | DateTime | Startdato |
| endDate | DateTime | Sluttdato |
| isActive | Boolean | Aktiv plan |

Inneholder: TrainingWeek → TrainingSession (ukentlige ovelser)

---

## RoundStats (Rundestatistikk)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | cuid | Unik ID |
| userId | string | Referanse til bruker |
| date | DateTime | Rundedato |
| courseName | string | Banenavn |
| score | Int | Totalscore |
| putts | Int? | Antall putts |
| fairwaysHit | Int? | Fairways truffet |
| greensInRegulation | Int? | GIR |
| penalties | Int? | Straffeslag |

---

## Goal (Mal)

| Felt | Type | Beskrivelse |
|------|------|-------------|
| category | GoalCategory | SCORE, PHYSICAL, MENTAL, TOURNAMENT, PROCESS |
| status | GoalStatus | ACTIVE, COMPLETED, PAUSED |
| targetValue | Float | Malverdi |
| currentValue | Float | Navarende verdi |
| deadline | DateTime? | Frist |

---

## Notification

| Felt | Type | Beskrivelse |
|------|------|-------------|
| id | nanoid | Unik ID |
| userId | string | Mottaker |
| type | NotificationType | BOOKING_CONFIRMED, AI_INSIGHT, etc. |
| title | string | Tittel |
| message | string | Innhold |
| isRead | Boolean | Lest/ulest |
| actionUrl | string? | Lenke til handling |

---

## Filtre og sortering

| Side | Filtre | Standard sortering |
|------|--------|-------------------|
| Bookinger | Status, dato, trener | Dato (nyeste forst) |
| Elever | Abonnement, status, retention | Navn (A-Z) |
| Statistikk | Periode, bane | Dato (nyeste forst) |
| Meldinger | Kanal, status, tildelt | Dato (nyeste forst) |

## Tomme verdier og defaults

| Felt | Default |
|------|---------|
| UserRole | STUDENT |
| SubscriptionTier | VISITOR |
| BookingStatus | PENDING |
| handicap | null (vises som "Ikke oppgitt") |
| image | Initialer-avatar generert fra navn |
| portalMonthlyLogCount | 0 (reset 1. hver maned) |
