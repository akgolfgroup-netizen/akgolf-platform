# Features og regler

## Booking-system

### Brukerhandlinger
- Velge tjenestetype (Performance, Performance Pro, Flex 50, Flex 90)
- Velge dato og tidsluke
- Fylle inn kundeinfo (navn, e-post, telefon, handicap)
- Betale med Stripe (kort, Apple Pay, Google Pay)
- Motta bekreftelse pa e-post
- Avbestille (min. 24 timer for)
- Endre tidspunkt

### Tilstander (BookingStatus)
| Status | Beskrivelse | Overgang |
|--------|-------------|----------|
| PENDING | Opprettet, venter pa betaling | → CONFIRMED, CANCELLED |
| CONFIRMED | Betalt og bekreftet | → COMPLETED, CANCELLED, NO_SHOW |
| COMPLETED | Gjennomfort | Endelig |
| CANCELLED | Avbestilt | Endelig (refund mulig) |
| NO_SHOW | Uteble | Endelig |

### Booking-regler
- Performance: 7 dagers booking-vindu, 2 sessjoner/mnd
- Performance Pro: 14 dagers booking-vindu, 4 sessjoner/mnd
- Flex: 48 timers booking-vindu
- Admin kan overstyre alle regler
- Dobbeltbooking forhindres med 3 lag: validering, lasing, DB-trigger
- Gjester kan booke uten konto (auto-opprett bruker)

### Tom-state
- Ingen ledige tider: "Ingen ledige tider denne uken. Prov neste uke."
- Ingen tjenester: "Ingen tjenester tilgjengelig. Ta kontakt."

### Feilhandtering
- Stripe-feil: Vis feilmelding, la bruker prove igjen
- Dobbeltbooking: "Denne tiden er allerede booket. Velg en annen tid."
- Utlopt sesjon: Redirect til booking-start

---

## Spillerportal

### Brukerhandlinger
- Se dashboard med neste booking og statistikk
- Se og folge treningsplan
- Logge runder (score, GIR, fairway, putting)
- Se handicap-utvikling over tid
- Lese AI-innsikter og anbefalinger
- Laste opp TrackMan-data (CSV/bilde)
- Skrive i treningsdagbok
- Sammenligne seg med peers

### Tilstander
- **Onboarding**: Ny bruker, ikke fullfort profil → redirect til onboarding
- **Aktiv**: Har booking og/eller treningsplan
- **Inaktiv**: Ingen aktivitet siste 30 dager → win-back e-post
- **At Risk**: RetentionStatus.AT_RISK → varsle trener

### Tom-state for portal-sider
| Side | Tom-state |
|------|-----------|
| Dashboard | Vis onboarding-steg, forslag til forste booking |
| Treningsplan | "Din treningsplan genereres etter forste coaching-sesjon" |
| Statistikk | "Logg din forste runde for a se statistikk" |
| Dagbok | "Start din treningsdagbok — logg okter og tanker" |
| Bookinger | "Du har ingen bookinger enna. Book din forste time." |

### Loading-state
- Skeleton-loader (graa bokser) for alle data-tunge sider
- Shimmer-effekt pa kort og tabeller

---

## Mission Control (Admin)

### Brukerhandlinger (trener)
- Se dagens sessjoner og forberede seg
- Skrive coaching-notater etter sesjon
- Se elevinformasjon for neste time
- Handtere booking-endringer og avbestillinger
- Se kapasitet og revenue
- Sende e-post og SMS til elever

### Tilstander for admin-sider
| Side | Tom-state |
|------|-----------|
| Hub | "Ingen sessjoner i dag. Neste sesjon: [dato]" |
| Bookinger | "Ingen bookinger. Opprett en manuelt." |
| Elever | "Ingen registrerte elever enna." |
| Meldinger | "Ingen uleste meldinger." |

### RBAC-regler
```
Hub, Kalender, Fasiliteter    → ADMIN, INSTRUCTOR, INVITED
Bookinger, Elever, Meldinger  → ADMIN, INSTRUCTOR
Agenter, Okonomi, Rapporter   → ADMIN
```

---

## Coaching-pakker og priser

| Pakke | Pris | Sessjoner | Booking-vindu | Kapasitet |
|-------|------|-----------|---------------|-----------|
| Performance | 1 600 kr/mnd | 2x20 min | 7 dager | 24 plasser |
| Performance Pro | 2 000 kr/mnd | 4x20 min | 14 dager | 10 plasser |
| Flex 50 | Fra 1 500 kr | Enkelttime 50 min | 48 timer | Ubegrenset |
| Flex 90 | Fra 1 500 kr | Enkelttime 90 min | 48 timer | Ubegrenset |

Alle inkluderer: TrackMan-analyse, personlig treningsplan, portal-tilgang, ingen binding.

---

## Notifikasjoner (NotificationType)

| Type | Trigger | Kanal |
|------|---------|-------|
| BOOKING_CONFIRMED | Betaling motatt | E-post + SMS |
| BOOKING_REMINDER | 24t for sesjon | SMS |
| BOOKING_CANCELLED | Avbestilling | E-post |
| PLAN_READY | Treningsplan generert | Push |
| COACHING_SUMMARY | Etter sesjon | E-post |
| AI_INSIGHT | Ukentlig (mandager 06:00) | Push |
| ACHIEVEMENT_UNLOCKED | Mal nadd | Push |
| TOURNAMENT_REMINDER | For turnering | Push |
