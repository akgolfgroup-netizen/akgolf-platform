# Coach-funksjoner — masterplan

> **Status:** Beslutninger fastsatt 2026-04-27. Bygges i Fase A→H før booking-v2 cutover.
> Når alle åtte faser er ferdig, kjøres en samlet røykprøve, så cutover.

## Beslutninger (fastsatt med Anders)

| # | Spørsmål | Beslutning |
|---|---|---|
| 1 | Wizard-rekkefølge | **Lokasjon → Trener → Tjeneste → Tid → Detaljer → Betal → Bekreftelse** |
| 2 | Recurring i Stripe-katalog | Kun Performance + Performance Pro (resten = engang) |
| 3 | Manuell booking, eksisterende kunde | Stripe off-session-trekk (`chargeOffSession` finnes alt) |
| 4 | Manuell booking, ny kunde | Send Stripe Payment Link via SMS + e-post |
| 5 | Gruppe-RSVP-granularitet | Per trening (ikke permanent opt-out) |
| 6 | Faste grupper å seede | WANG Toppidrett Fredrikstad, GFGK, Mini, Basis, Utvikling, Elite |
| 7 | Hvem oppretter grupper | Admin + coach (begge roller) |
| 8 | Repetisjon-mønster (gruppe-økter) | Avansert (RRULE/RFC 5545 — Apple/Google Calendar-stil) |
| 9 | Multi-location per coach | Hver coach kan ha flere lokasjoner; tjenester konfigureres per coach×lokasjon |
| 10 | Lokasjons-tjenester for kunde | Kunden velger lokasjon FØRST i bookingen |

## Fase-rekkefølge (avhengighet-sortert)

```
A: Coach-tilgjengelighet UI                                    6–10t
B: Multiple Location per coach + per tjeneste                  6–10t
C: Coaching-tjeneste-bygger + Stripe-katalog                  12–16t
D: Wizard-ombygging — Lokasjon-først                           4–6t
E: Manuell booking på spiller                                  6–10t
F: Gruppe-booking + RRULE                                     12–20t
G: Gruppe-treningsplan                                         8–12t
H: Auto-sync gruppeplan → spiller + per-trening RSVP           6–10t
                                                  Totalt:    60–94t
```

## Test-strategi (etter Fase H)

1. Coach-røykprøve i CoachHQ:
   - Sett tilgjengelighet for nye uker (Fase A)
   - Legg til ny lokasjon + koble tjenester (Fase B)
   - Lag ny coaching-tjeneste med Stripe-pris (Fase C)
   - Lag manuell booking på en spiller med lagret kort, og en uten (Fase E)
   - Opprett gruppe + RRULE-serie (Fase F)
   - Lag gruppe-treningsplan + se sync til spillere (Fase G+H)
   - Spiller sier "nei takk" til én trening — sjekk at den forsvinner kun fra spilleren

2. Booking-v2 ende-til-ende-røykprøve (4 brukerklasser fra `BOOKING_V2_CUTOVER.md`)

3. Cutover når alt er grønt

## Schema-status (sett 2026-04-27)

✅ **Finnes:**
- `Booking`, `RecurringBooking` (med `recurrenceRule String?`)
- `Instructor`, `InstructorAvailability`, `InstructorDateAvailability`
- `Location`, `InstructorFacilityDefault`
- `ServiceType`
- `TrainingPlan`, `TrainingPlanSession`, `TrainingPlanWeek`, `TrainingPlanTemplate`
- `TrainingGroup` (tom — må seedes med 6 grupper)
- `GroupMembership`, `GroupParticipant`

❌ **Mangler:**
- `stripePriceId` (+ `stripeProductId`) på `ServiceType`
- `InstructorLocation` join-tabell (Instructor × Location, M:N)
- `InstructorLocationService` join-tabell (Instructor × Location × ServiceType — hvilke tjenester en coach tilbyr på hver lokasjon)
- `GroupSessionRSVP`-modell (per-trening opt-out)
- Felt på `Booking`: `groupSessionId?` (kobler en spiller-booking til en gruppe-økt for sync-formål)

## Avhengigheter mellom Fase A–H

```
A → D, E, F (alle som booker trenger fungerende tilgjengelighet)
B → C, D (lokasjon må være på plass før tjenester og wizard)
C → D, E (Stripe-pris må finnes før wizard og manuell booking trekker)
D → E (wizard-flyt brukes også når coach lager manuell booking?)
E → (ingen)
F → G (gruppe må finnes før gruppe-treningsplan)
G → H (treningsplan må finnes før sync)
```

## Kjente risikoer / åpne spørsmål

- **Wizard-omarbeid (Fase D):** Påvirker eksisterende `/booking-v2`-sider. Må gjenbygges, men logikk i `lib/booking-v2/*.ts` (services, draft, quota-gate, create-booking) gjenbrukes.
- **RRULE i Fase F:** Behov for et RRULE-bibliotek (`rrule` på npm) eller egen implementasjon. RFC 5545 er ikke trivielt.
- **Stripe-katalog (Fase C):** Krever Stripe-API-call ved tjeneste-create. Må ha rollback hvis Stripe-kall feiler etter DB-record.
- **Gruppe-sync (Fase H):** Når gruppe-økt endres (RRULE-unntak), må sync til spillerens treningsplan refleksere endringen.

## Referanser

- Eksisterende booking-v2-cutover-sjekkliste: `docs/status/BOOKING_V2_CUTOVER.md`
- Schema: `prisma/schema.prisma`
- Booking-v2 kjernelogikk: `lib/booking-v2/*.ts`
