# Prisma Production Readiness — Design Spec

**Dato:** 2026-03-31
**Lansering:** Torsdag 2. april 2026 (hard launch)
**Scope:** Full produksjonsklarhet for akgolf-website

---

## Oversikt

Komplett gjennomgang og klargjøring av Prisma-database for produksjonslansering. Fersk database uten eksisterende data — gir fleksibilitet til å bruke `db push` uten migrasjonsrisiko.

### Nøkkeltall

| Metrikk | Verdi |
|---------|-------|
| Prisma-modeller | 55 |
| Enums | 25 |
| Filer som bruker Prisma | 57 |
| Instruktører | 2 (Anders, Markus) |
| Dager til lansering | 2 |

---

## Seksjon 1: Database-synkronisering

### Mål
Sikre at Prisma-skjema og produksjonsdatabase er 100% synkronisert.

### Oppgaver

| # | Oppgave | Metode |
|---|---------|--------|
| 1.1 | Valider skjema | `prisma validate` |
| 1.2 | Sjekk diff mot database | `prisma db pull` → sammenlign |
| 1.3 | Push skjema til prod | `prisma db push` |
| 1.4 | Generer klient | `prisma generate` |
| 1.5 | Verifiser alle 55 modeller eksisterer | SQL-query mot information_schema |

### Suksesskriterier
- Ingen feil fra `prisma validate`
- Ingen drift mellom skjema og database
- Prisma Client generert uten advarsler

---

## Seksjon 2: Seed-data for produksjon

### Mål
Klargjøre all nødvendig grunndata for at plattformen er operativ.

### Data som må seedes

| Prioritet | Modell | Data |
|-----------|--------|------|
| **P0** | `User` | Anders (ADMIN/INSTRUCTOR), Markus (INSTRUCTOR) |
| **P0** | `Instructor` | Profiler for Anders og Markus med bio, bilde, spesialiteter |
| **P0** | `ServiceType` | Individual (60min), Group (90min), Playing Lesson (120min) |
| **P0** | `InstructorAvailability` | Ukentlig tilgjengelighet for begge |
| **P1** | `Location` | Gamle Fredrikstad GK |
| **P1** | `CoachingPackage` | Pakker/abonnementer |
| **P2** | `AchievementDefinition` | Gamification-badges |

### Seed-strategi

Ny fil `prisma/seed-prod.ts` for produksjonsdata, separat fra testdata.

### Prisstruktur

| Tjeneste | Pris | Varighet | MVA |
|----------|------|----------|-----|
| Individual Coaching | 1.495 kr | 60 min | 25% |
| Group Coaching | 595 kr/person | 90 min | 25% |
| Playing Lesson | 2.495 kr | 120 min | 25% |

**Merk:** Priser lagres i kroner (ikke øre). Stripe mottar `pris * 100`.

### Suksesskriterier
- Begge instruktører kan logge inn
- Alle tjenester vises i booking-flyten
- Tilgjengelighet vises i kalenderen

---

## Seksjon 3: Indekser og ytelse

### Mål
Sikre raske spørringer for booking-flyten og admin-dashboardet.

### Eksisterende indekser

```prisma
model Booking {
  @@index([instructorId])
  @@index([startTime])
  @@index([status])
  @@index([studentId])
}
```

### Nye indekser

| Modell | Indeks | Begrunnelse |
|--------|--------|-------------|
| `CoachingSession` | `[studentId, sessionDate]` | Coaching-historikk per elev |
| `HandicapEntry` | `[userId, recordedAt]` | Handicap-utvikling sortering |
| `PaymentTransaction` | `[bookingId, status]` | Betalingsoppslag |
| `Notification` | `[userId, read, createdAt]` | Uleste notifikasjoner |
| `InstructorAvailability` | `[instructorId, dayOfWeek]` | Slot-generering |

### Suksesskriterier
- Booking-søk < 100ms
- Kalender-lasting < 200ms
- Ingen full table scans på kritiske spørringer

---

## Seksjon 4: RLS-regler (Row Level Security)

### Mål
Sikre at brukere kun kan se og endre egne data i Supabase.

### Strategi
Gradvis aktivering med kill-switch. Kan deaktiveres med én SQL-kommando hvis problemer.

### RLS-policyer

| Tabell | Policy | Regel |
|--------|--------|-------|
| `User` | Les egen | `auth.uid() = supabase_id` |
| `Booking` | Les egen | `student_id = current_user_id()` |
| `Booking` | Les som instruktør | `instructor_id IN (SELECT id FROM instructor WHERE user_id = current_user_id())` |
| `CoachingSession` | Les egen | `student_id = current_user_id() OR instructor_id = ...` |
| `HandicapEntry` | Les egen | `user_id = current_user_id()` |
| `Notification` | Les egen | `user_id = current_user_id()` |

### Unntak (ingen RLS)

| Tabell | Begrunnelse |
|--------|-------------|
| `ServiceType` | Offentlig data |
| `Instructor` | Offentlig profil |
| `Location` | Offentlig data |
| `InstructorAvailability` | Nødvendig for slot-visning |

### Aktiveringsplan

1. **Dag 1:** Implementer alle policyer (DISABLED)
2. **Dag 2:** Aktiver på staging, test grundig
3. **Dag 3:** Aktiver i prod ETTER full systemtest

### Suksesskriterier
- Bruker A kan ikke se Bruker B sine bookinger
- Instruktør ser kun sine egne elever
- Admin ser alt
- Ingen blokkerte legitime operasjoner

---

## Seksjon 5: Stripe-integrasjon verifisering

### Mål
Sikre at betalingsflyten fungerer ende-til-ende i produksjon.

### Sjekkliste

| # | Oppgave |
|---|---------|
| 5.1 | Stripe-produkter eksisterer i Dashboard |
| 5.2 | Webhook-endpoint aktiv (`/api/portal/webhooks/stripe`) |
| 5.3 | Webhook-signatur verifiseres (`STRIPE_WEBHOOK_SECRET`) |
| 5.4 | Priser matcher database (ServiceType.price × 100 = Stripe øre) |
| 5.5 | Refund-flyt fungerer |

### Kritiske miljøvariabler

| Variabel | Beskrivelse |
|----------|-------------|
| `STRIPE_SECRET_KEY` | API-nøkkel for Stripe |
| `STRIPE_WEBHOOK_SECRET` | Webhook-signatur |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Klient-nøkkel |

### Webhook-events

| Event | Handling |
|-------|----------|
| `payment_intent.succeeded` | Booking → CONFIRMED |
| `payment_intent.payment_failed` | Logg feil, notifiser |
| `charge.refunded` | PaymentTransaction → REFUNDED |

### Test-scenarioer

1. Ny kunde → Booking → Stripe Checkout → Webhook → CONFIRMED
2. Kunde kansellerer → Refund → PaymentTransaction oppdatert
3. Stripe-feil → Bruker ser feilmelding, booking forblir PENDING

### Suksesskriterier
- Komplett booking-betaling på < 30 sekunder
- Webhook prosesserer innen 5 sekunder
- Ingen tapte betalinger

---

## Seksjon 6: Backup og monitoring

### Mål
Sikre at data er trygt og at vi oppdager problemer før kundene gjør det.

### Backup-strategi

| Type | Frekvens | Retensjon | Metode |
|------|----------|-----------|--------|
| Automatisk | Daglig | 7 dager | Supabase innebygd |
| Før lansering | Én gang | Permanent | Manuell `pg_dump` |
| Point-in-time | Kontinuerlig | 7 dager | Supabase PITR |

### Monitoring

| Verktøy | Overvåker |
|---------|-----------|
| Vercel Analytics | Sidevisninger, Web Vitals |
| Vercel Logs | API-feil, Edge-funksjoner |
| Supabase Dashboard | Database-ytelse, tilkoblinger |
| Stripe Dashboard | Betalinger, webhook-feil |

### Alerts

| Trigger | Handling |
|---------|----------|
| API-feil > 5/min | E-post |
| Database-tilkoblinger > 80% | E-post |
| Webhook-feil | Stripe Dashboard |
| Deploy feilet | Vercel-notifikasjon |

### Rollback-plan

1. **Vercel:** Rollback til forrige deploy (1 klikk)
2. **Database:** Supabase PITR til før feilen
3. **Stripe:** Pause webhook, håndter manuelt

### Suksesskriterier
- Backup verifisert før lansering
- Alle dashboards tilgjengelige
- Rollback testet på staging

---

## Tidsplan

| Dag | Dato | Fokus |
|-----|------|-------|
| **1** | 31. mars | Database-synk, Seed-data, Indekser |
| **2** | 1. april | RLS-regler, Stripe-verifisering, Testing |
| **3** | 2. april | Backup, Monitoring, Siste verifikasjon, **LAUNCH** |

---

## Avhengigheter

- Supabase-prosjekt med DATABASE_URL
- Stripe-konto med produkter
- Vercel-deploy med miljøvariabler
- Tilgang til Anders og Markus sine e-poster for brukeropprettelse

---

## Risiko og mitigering

| Risiko | Sannsynlighet | Konsekvens | Mitigering |
|--------|---------------|------------|------------|
| Database-synk feiler | Lav | Høy | Fersk database, ingen datatap |
| RLS blokkerer legitim tilgang | Medium | Medium | Kill-switch, gradvis aktivering |
| Stripe-webhook feiler | Lav | Høy | Manuell overvåking, logging |
| Ytelsesproblem ved launch | Lav | Medium | Indekser, caching, monitoring |

---

*Generert med Claude Code — 2026-03-31*
