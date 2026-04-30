# User Flows

## Flow 1: Ny kunde booker coaching

```
Markedsside (/) 
  → Klikk "Book coaching"
  → /booking/select-service
    Velg: Performance, Performance Pro, Flex 50, Flex 90
  → /booking/date-time
    Velg uke → velg dag → velg tidsluke
  → /booking/review-confirm
    Fyll inn: navn, e-post, telefon, handicap
    Velg betalingsmetode (kort/Apple Pay/Google Pay)
    Aksepter vilkar
    Klikk "Bekreft og betal"
  → Stripe Checkout (ekstern)
    Betal
  → /booking/[id]/confirmation
    Bekreftelse vist
    E-post sendt til kunde
    SMS sendt til trener
```

**Edge cases:**
- Stripe-feil → vis feilmelding, la bruker prove igjen
- Tiden ble booket av andre → "Tiden er ikke lenger ledig"
- Bruker lukker vindu under betaling → booking forblir PENDING, ryddes etter 30 min

---

## Flow 2: Eksisterende elev logger inn

```
/portal/login
  → Skriv inn e-post + passord (eller magic link)
  → Supabase Auth
  → /auth/callback
  → proxy.ts sjekker session
  → /portal (dashboard)
    Viser: neste booking, handicap, AI-insight, treningsplan-oppdatering
```

**Edge cases:**
- Forste innlogging → redirect til /portal/onboarding
- Utlopt session → redirect til /portal/login
- Feil passord → "Feil e-post eller passord"

---

## Flow 3: Elev bruker dashboard

```
/portal (dashboard)
  Ser: neste booking, statistikk-sammendrag, AI-innsikt

  → Klikk "Treningsplan"
    /portal/treningsplan
    Ser ukesplan med ovelser

  → Klikk "Logg runde"
    /portal/statistikk/ny-runde
    Velg bane → fyll inn score per hull → lagre
    → /portal/statistikk (oppdatert)

  → Klikk "Mine bookinger"
    /portal/bookinger
    Ser kommende og tidligere bookinger
    → Klikk "Endre" → /portal/bookinger/[id]/endre
    → Klikk "Avbestill" → bekreftelsesdialog → avbestilt
```

---

## Flow 4: Trener starter dagen (Mission Control)

```
/portal/login (som INSTRUCTOR/ADMIN)
  → /portal (redirect til dashboard)
  → Klikk "Mission Control" i sidebar
  → /portal/admin (Hub)
    Ser: Dagens sessjoner, elevliste, KPIer, alerts
    Divisjoner: Coaching | Junior | GFGK

  → Klikk pa sesjon
    /portal/admin/elever/[id]
    Ser elevprofil, historikk, notater
    Forbered seg til okten

  → Etter okten
    /portal/admin/okter
    Skriv coaching-notater
    AI genererer oppsummering
    Elev mottar e-post med oppsummering
```

---

## Flow 5: Admin handterer bookinger

```
/portal/admin/bookinger
  Ser alle bookinger (filtrer pa status, dato, trener)

  → "Ny booking" → /portal/admin/bookinger/ny
    Velg elev, tjeneste, tid → opprett

  → Klikk pa booking → se detaljer
    Handlinger: Bekreft, Avbestill, Endre tid, Marker no-show

  → Avbestilling med refund
    Bekreft → Stripe refund → e-post til kunde
```

---

## Flow 6: Elev mottar AI-innsikt

```
Cron-job (mandager 06:00)
  → /api/portal/cron/ai-insights
  → Anthropic Claude analyserer siste ukes data
  → Genererer personlig innsikt per elev
  → Lagrer i User.latestAiInsight
  → Push-notifikasjon: "Ny ukentlig innsikt tilgjengelig"

Elev apner dashboard
  → Ser AI-innsikt-kort med anbefalinger
  → Klikker for mer detalj
```

---

## Flow 7: Varsler og paminnelser

```
24 timer for sesjon:
  Cron → /api/portal/cron/send-reminders
  → SMS til elev: "Husk coaching i morgen kl. 10:00"
  → Push-notifikasjon

1 uke uten aktivitet:
  Cron → smart-notifications
  → E-post: "Vi savner deg pa rangen!"

30 dager inaktiv:
  RetentionStatus → AT_RISK
  → Trener far varsel i Mission Control
```

---

## Flow 8: Profil og innstillinger

```
/portal/profil
  Rediger: navn, bilde, handicap, mal
  Se: abonnementsstatus, betalingshistorikk

  → "Endre abonnement"
    Stripe Customer Portal (ekstern)

  → "Sett mal"
    Modal: velg kategori (Score, Fysisk, Mental, Turnering)
    Sett malverdi og deadline
    → Vises pa dashboard
```
