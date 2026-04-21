# AK Golf Platform — Ordliste / Glossary

> Versjon: 1.0  
> Formål: Standardisere begreper på tvers av UI, kode, database og dokumentasjon.  
> Prinsipp: Norsk i brukergrensesnittet, engelsk i kode (konsekvent).

---

## 1. Brukeren

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Portal / marked / spiller-side | **Spiller** | `user` (autentisering), `player` (golf-domene) | "Spiller" er det dominerende begrepet i portalen og på markedssider. |
| Admin / Mission Control | **Elev** | `student` (booking, coaching-relasjoner) | I MC-kontekst er "elev" standard for coaching-relasjonen coach↔spiller. |
| Teknisk / auth | — | `user` | Prisma `User`-modell og NextAuth bruker `user`. Ikke vis til sluttbruker. |
| Betaling / booking-flyt | **Kunde** | `customer` (Stripe) | Brukes kun i betalings- og booking-kontekst der brukeren er kjøper. |
| Abonnement / tier | **Medlem** | `member` | Brukes i abonnementskontekst ("Medlem siden …"). |
| Gratisnivå / uinnlogget | **Besøkende** | `visitor` | `SubscriptionTier.VISITOR`. |

**Inkonsistenser å rydde opp i:**
- "bruker" blandes inn i noen UI-tekster (portal error-meldinger). → Erstatt med "spiller".
- `studentId` i Prisma `Booking`-modellen brukes om spilleren. → Behold i kode, men vis alltid "elev" / "spiller" i UI.
- "player" brukes i noen AI-prompts på norsk (`spiller`, `spilleren`). → OK i prompts, men ikke i UI-kode.

---

## 2. Coachen

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Marked / website / portal | **Trener** | `coach` (AI, logikk) | "Trener" er hovedstandard i all norsk brukertekst. |
| Booking-wizard / admin-tabeller | **Instruktør** | `instructor` (Prisma, booking) | Formell term i booking-systemet. Behold Prisma-modellen `Instructor`. |
| AI-funksjon | **AI Coach** | `aiCoach` | Brandet funksjonsnavn. Behold engelsk i kode. |
| Admin / rolle | **Admin** | `admin` | DashboardRole.ADMIN, UserRole.ADMIN. |
| MC / team | **Team** | `team` | "Team og tilgang" i MC. |

**Inkonsistenser å rydde opp i:**
- "Coach" vises i noen UI-tekster (`app/portal/login/page.tsx`: "Direkte kontakt med din trener" — OK, men `components/portal/coaching-historikk/session-card.tsx` viser "Coach: {name}"). → Endre til "Trener".
- "instruktør" vs "trener" veksler i booking-wizard. → Standardiser på "trener" i all portal-/booking-UI.

---

## 3. Booking / Time

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Overordnet handling / system | **Booking** | `booking` | "Book en time", "Dine bookinger". |
| Enkelt avtale / møte | **Time** | `booking` (dataobjekt) | "Neste time", "Ledige tider". |
| Gjennomført coaching / trening | **Økt** | `session` (CoachingSession) | "Coaching-økt", "treningsøkt". |
| TrackMan-spesifikk | **Sesjon** | `session` (TrackmanSession) | "TrackMan-sesjon". |
| Kalender-tidsrom | **Tidspunkt** | `slot` / `timeSlot` | "Velg tidspunkt". |

**Inkonsistenser å rydde opp i:**
- "booking" brukes både om verbet ("book time") og substantivet ("dine bookinger"). → OK, men unngå "booking" som synonym for selve timen i brukerens kalender.
- "økt" brukes både om booket coaching og selvstendig trening. → OK med kontekst: "coaching-økt" vs "treningsøkt".
- "sesjon" brukes inkonsekvent (noen ganger som synonym for økt). → Reserver "sesjon" for TrackMan-spesifikke data.

---

## 4. Trening

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Overordnet aktivitet | **Trening** | `training` | "Din trening", "treningsplan". |
| Enkelt treningspass | **Økt** | `session` (treningsplan), `log` (dagbok) | "Logg økt", "treningsøkt". |
| 12-ukers program | **Treningsplan** | `trainingPlan` | "Generer treningsplan". |
| Enkelt øvelse (generell) | **Øvelse** | `exercise` | "Øvelsesbank". |
| Golf-spesifikk øvelse | **Drill** | `drill` | Kun i golf-kontekst. |
| Treningsdagbok | **Dagbok** | `trainingLog` / `trainingDiary` | "Treningsdagbok". |
| Ukentlig plan | **Ukeplan** | `weekPlan` | Del av treningsplan. |

**Inkonsistenser å rydde opp i:**
- "session" brukes på engelsk i noen UI-tekster (`profile/page.tsx`: "Sessions"). → Oversett til "Økter".
- "workout" finnes ikke i UI, men unngå å introdusere det. → Bruk "økt".
- "plan" brukes polysem — både om treningsplan og abonnementsplan. → Bruk alltid "treningsplan" (fullt) eller "abonnement" (aldrig bare "plan" for abo).

---

## 5. Abonnement

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Månedlig coaching-abonnement | **Abonnement** | `subscription` | "Ditt abonnement", "treningsabonnement". |
| Abonnementsnivå / tier | **Nivå** | `tier` | "Gratis-nivå", "Pro-nivå". |
| Coaching-pakke (enkelttimer) | **Pakke** | `package` / `coachingPackage` | "Coaching-pakke". |
| Medlemskap (generelt) | **Medlemskap** | `membership` | "Medlem siden …". |

**Inkonsistenser å rydde opp i:**
- "plan" brukes om både treningsplan OG abonnement i noen UI-tekster. → Kritisk: skille tydelig. "Abonnement" for månedlig abo, "treningsplan" for 12-ukers plan.
- "pakke" brukes også om merkevare-tjenester. → OK med prefiks: "coaching-pakke", "merkevare-pakke".
- Engelske tier-navn vises i UI: VISITOR, ACADEMY, STARTER, PRO, ELITE. → OK som brandede navn, men vis med norsk label: "Gratis", "Academy", "Starter", "Pro", "Elite".

---

## 6. Statistikk

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Overordnet | **Statistikk** | `stats` | "Din statistikk". |
| Strokes Gained (brandet) | **Strokes Gained** | `strokesGained` / `sg` | Aldri oversett. Brandet konsept. |
| AI-generert tolkning | **Analyse** | `analysis` | "AI-analyse", "svakhetsanalyse". |
| Rå / tekniske verdier | **Data** | `data` | "TrackMan-data". Bruk sparsomt i UI. |
| Beregnet måling | **Metrikk** | `metric` | "Nøkkelmetrikker". Teknisk, unngå i UI. |
| Handicap | **Handicap** / **HCP** | `handicap` | "Handicap" i tekst, "HCP" i kompakte labels. |
| Score (runde-total) | **Score** | `score` / `totalScore` | "Total score". |
| Utvikling over tid | **Trend** | `trend` | "Score-trend". |

**Inkonsistenser å rydde opp i:**
- "data" brukes for ofte i UI der "statistikk" eller "analyse" er mer brukervennlig. → "Se din statistikk" ikke "Se dine data".
- "tall" brukes i noen komponenter (`premium-stat-card`). → Endre til "statistikk" eller "nøkkeltall".
- "stats" (engelsk) i noen prop-navn som lekker til UI. → Oversett.

---

## 7. Runde

| Kontekst | Standard (UI) | Standard (kode) | Kommentar |
|----------|--------------|-----------------|-----------|
| Golf-runde (overordnet) | **Runde** | `round` | "Ny runde", "runde-historikk". |
| Hull-for-hull registrering | **Scorecard** | `scorecard` | Kun for mental scorecard og hull-registrering. |
| Golfbane | **Bane** | `course` | "Søk etter bane". |
| Hull | **Hull** | `hole` | "Hull 1", "par 4". |
| Slag | **Slag** | `shot` | "Antall slag". |
| Live-registrering | **Live runde** | `liveRound` | "Start live runde". |

**Inkonsistenser å rydde opp i:**
- "round" brukes på engelsk i noen filnavn og komponenter. → Behold i kode, oversett UI.
- "scorecard" brukes kun om mental scorecard i dag. → OK, men unngå å introdusere det for generell runde.

---

## Prinsipper for fremtidig bruk

1. **Norsk i UI, engelsk i kode.** Unntak: brandede navn (Strokes Gained, AI Coach, TrackMan).
2. **Ett konsept = ett navn.** "Økt" betyr alltid én gjennomført trenings-/coaching-enhet. "Time" betyr alltid én booket avtale.
3. **Unngå polysemi.** "Plan" skal ikke brukes alene — alltid "treningsplan" eller "abonnement".
4. **Kode følger eksisterende Prisma-navn.** `Instructor`, `Booking`, `User`, `Round` endres ikke (for kompatibilitet).
5. **Admin-tekster skiller coach og spiller.** "Elev" i MC, "spiller" i portal.

---

## Hurtigreferanse: mapping tabell

| Konsept | UI (norsk) | Kode (engelsk) | Prisma / DB |
|---------|-----------|----------------|-------------|
| Bruker (generell) | Spiller | `user` | `User` |
| Bruker (coaching-relasjon) | Elev | `student` | `Booking.studentId` |
| Trener | Trener | `coach` / `instructor` | `Instructor` |
| Admin | Admin | `admin` | `UserRole.ADMIN` |
| Booking (system) | Booking | `booking` | `Booking` |
| Enkelt avtale | Time | `booking` | `Booking` |
| Gjennomført coaching | Økt | `session` | `CoachingSession` |
| TrackMan-økt | Sesjon | `session` | `TrackmanSession` |
| Trening (overordnet) | Trening | `training` | — |
| Treningspass | Økt | `session` / `log` | `TrainingLog` |
| Treningsprogram | Treningsplan | `trainingPlan` | `TrainingPlan` |
| Øvelse | Øvelse | `exercise` | `ExerciseDefinition` |
| Golf-øvelse | Drill | `drill` | — |
| Månedlig abo | Abonnement | `subscription` | `AppSubscription` |
| Abo-nivå | Nivå | `tier` | `SubscriptionTier` |
| Coaching-pakke | Pakke | `package` | `CoachingPackage` |
| Statistikk | Statistikk | `stats` | `RoundStats` |
| Strokes Gained | Strokes Gained | `strokesGained` | `sgTotal` etc. |
| Analyse | Analyse | `analysis` | — |
| Runde | Runde | `round` | `Round` |
| Bane | Bane | `course` | `Course` |
| Hull | Hull | `hole` | `Hole` |
| Slag | Slag | `shot` | `Shot` |
