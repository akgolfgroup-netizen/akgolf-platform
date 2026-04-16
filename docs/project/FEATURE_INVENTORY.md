# AK Golf Platform — Komplett Feature Inventory

> Sist oppdatert: 2026-04-15  
> Dekker alle brukervendte funksjoner i `akgolf-platform` per denne datoen.

---

## 1. LANDINGSIDE (Marketing / Publikasjonssider)

### 1.1 Forside & Navigasjon
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Forside v1 | Hero, 5-stegs flyt, portal-preview (iPhone-mockup), målgruppekort, team, FAQ | `/` |
| Forside v2 | Alternativ landing med statistikk-kort, treningsabonnement-seksjon, om oss, CTA | `/landing` |
| Om oss | Historie, team (Anders + Markus), lokasjoner (GFGK, Miklagard), metode | `/landing/about` |
| Kontakt | Kontaktinfo-kort, lokasjoner med feature-tags, kontaktskjema (lokal state/demo), mailto-lenker | `/landing/contact` |
| Priser | Abonnement (Performance/Pro), Onboarding, Drop-in (Flex 50/90), Banecoaching | `/landing/pricing` |

### 1.2 Academy & Junior
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Academy landing | Hero, konsept, how-it-works, portal-preview, priser (mest Flex aktiv), sammenligning, FAQ | `/academy` |
| Junior Academy | Hero, programinfo (3 500 kr/mnd), GFGK treningsgrupper etter alder, WANG Toppidrett-samarbeid | `/junior-academy` |

### 1.3 Utvikling & Teknologi
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Utvikling | Tjenester i bento-grid (sportslig plan, spillerportal, QR-skilt), referanser, CTA | `/utvikling` |

### 1.4 Fellestrekk Landingsider
- **Navigasjon**: `WebsiteNav` (transparent → hvit ved scroll) på alle sider unntatt `landing/*` som bruker `Navbar variant="light"`
- **Footer**: `WebsiteFooter` (svart) på academy/junior/utvikling + rot-side. `Footer variant="light"` på `landing/about`, `landing/contact`, `landing/pricing`
- **Booking-CTA**: `/booking` er dominerende konvertering på tvers av ALLE sider
- **SEO**: JSON-LD BreadcrumbList på academy, junior-academy, utvikling. FAQPage på academy og junior-academy layouts
- **Eksterne lenker**: WANG Toppidrett (`wang.no`), GFGK Junior (`gfrg.no`), sosiale medier (Instagram, Facebook, LinkedIn)

---

## 2. BOOKING-SYSTEMET

### 2.1 Offentlig Booking (v1 & v2)
| Funksjon | Beskrivelse | Rute / Fil |
|----------|-------------|------------|
| Offentlig booking v1 | Hero, velg lokasjon (GFGK), se trenere, book via **embedded Acuity Scheduling iframe** | `/booking` |
| Offentlig booking v2 (wizard) | Velg trener → tjeneste → dato/tid → kontaktinfo → betaling → suksess | `/booking` (`booking-client.tsx`) |
| Betaling | Stripe Payment Intent for pending bookings | `/booking/[id]/pay` |
| Bekreftelse | Booking-detaljer, upsell-kort, CTA til portal | `/booking/[id]/confirmation` |
| Status / Avbestilling | Se tidslinje, betalingsstatus, avbestillingsregler, print/del, endre tid (kun innlogget) | `/booking/[id]/status` |
| Cancel-side | Enkel "Booking avbrutt" for Stripe-cancel | `/booking/[id]/cancel` |

### 2.2 Academy Booking
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Academy booking | `BookingWizard mode="public"` — e-postbekreftelse, automatisk profilopprettelse | `/academy/booking` |

### 2.3 Booking-API & Logikk
| Endpoint / Modul | Beskrivelse |
|------------------|-------------|
| `POST /api/booking/create` | Oppretter booking, håndterer gjestebrukere, validering, abonnementskvote, konfliktsjekk, Stripe checkout, Google Calendar sync |
| `POST /api/booking/confirm-payment` | Sjekker betalingsstatus etter Stripe (polles fra UI hvert 2. sek) |
| `GET /api/booking/services` | Aktive offentlige tjenester med instruktører |
| `GET /api/booking/slots` | Tilgjengelige slots for gitt dato/tjeneste/instruktør |
| `GET /api/booking/smart-slots` | Anbefalte tidspunkter for en hel uke |
| `POST /api/booking/reschedule` | Endrer tid på booking (krever login) |
| `POST /api/coaching/book` | Booker coaching-pakke (RECURRING / ONE_TIME) |
| `lib/portal/booking/validation.ts` | 9-punkts validering: input, serviceType, tidsbegrensninger, instruktør-tilgjengelighet, dobbeltbooking, blokkerte tider, kvote, duplikat, advarsler |
| `lib/portal/booking/subscription-quota.ts` | Kvote-sjekk, ukentlig limit, consume/release session, reset ved fornyelse |
| `lib/portal/booking/reschedule.ts` | Atomisk reschedule med Prisma Serializable, Google Calendar-update, notifikasjoner |
| `lib/portal/booking/cancellation-policy.ts` | >24t = 100% refusjon, 2–24t = 50%, <2t = 0% |
| `lib/portal/booking/refund.ts` | Stripe refund med idempotency key, manuell faktura |
| `lib/portal/booking/waitlist.ts` | Venteliste med 24-timers utløpsfrist, auto-notifikasjon ved ledig plass |
| `lib/portal/booking/cache.ts` | Cached slot-generering, cache invalidation, SSE realtime cache |
| `lib/portal/booking/auto-create-user.ts` | Finn/opprett STUDENT-bruker ved gjestebooking, genererer temp-passord, oppretter Notion player profile |

### 2.4 Portal-Booking (Innlogget bruker)
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Mine bookinger | Kommende + tidligere, neste booking som hero-kort, avbestillingsregler | `/portal/bookinger` |
| Ny booking (portal) | `PortalBookingWizard` — forhåndsutfylt info, hopper over details-steg | `/portal/bookinger/ny` |
| Endre booking | Reschedule egen booking | `/portal/bookinger/[id]/endre` |
| Avbestille | Med refusjon, e-post, ventelistenotifikasjon, Google Calendar-sletting | Portal API |
| Gruppebooking | Opprett gruppebooking med deltakere, kapasitetssjekk, pessimistisk lås | `POST /api/portal/bookings/create-group` |
| Live slots | SSE-endepunkt for sanntids oppdateringer | `GET /api/portal/bookings/live` |

### 2.5 Tjenester som kan bookes
1. Individuell coaching (`ServiceType`)
2. Gruppebooking (maxStudents > 1)
3. Coaching-pakker (`CoachingPackage`):
   - RECURRING: Performance, Performance Pro, Start
   - ONE_TIME: Flex-pakker
4. Banecoaching / Foundation Test (kategorisert i `services-2026`)

### 2.6 Betalingsmetoder
- **Stripe (kort)** — hovedmetode for drop-in og Flex-pakker
- **Vipps** — definert i skjema, ikke aktivt i alle flyter
- **NONE** — abonnementsbrukere (kvote-basert)
- **Faktura** — manuell håndtering

---

## 3. SPILLERPORTAL (Player Portal)

### 3.1 Oversikt / Dashboard (`/portal`)
| Funksjon | Beskrivelse |
|----------|-------------|
| Profil-header | Navn, bilde, HCP, antall runder/økter, abonnementstier (Gratis/Academy/Starter/Pro/Elite) |
| Neste booking | Fremhevet kort med coach, tjeneste, tid |
| Ukens treningsplan | Visuell ukekalender med treningsaktivitet og coaching |
| Treningsstatistikk | HCP, runder, økter med animerte tall |
| Coach-insight + AI-insight | Oppsummeringer fra coach og AI |
| Snarveier | Logg trening, Registrer runde, Book coaching, AI Coach |

### 3.2 Profil (`/portal/profil`, `/portal/profil/innstillinger`)
- Profilbilde, navn, e-post, rolle, abonnementstier
- Nøkkeltall: Handicap, økter siste 30d, coaching totalt, streak
- Rediger profil, endre passord, logg ut
- Abonnementskort med status

### 3.3 Bookinger (`/portal/bookinger`, `/portal/bookinger/ny`, `/portal/bookinger/[id]`)
- Liste over kommende og tidligere bookinger
- Fremhevet "neste booking" som hero-kort
- Ny booking-wizard, endre tid, avbestille

### 3.4 Coaching-historikk (`/portal/coaching-historikk`)
- Alle gjennomførte coachingsesjoner
- AI-genererte oppsummeringer per sesjon (staff kan generere nye)

### 3.5 Statistikk (`/portal/statistikk`, `/portal/statistikk/ny-runde`)
- Periodevelger: 30d, 90d, Sesong, 1 år
- KPI-kort: Snitt score, Handicap, Runder, SG Total
- Strokes Gained horisontale barer (Tee Total, Approach, Short Game, Putting)
- Treningsvolum stolpediagram
- Score-trend sparkline-graf
- AI-anbefaling basert på svakeste SG-kategori
- Registrer ny runde

### 3.6 TrackMan (`/portal/trackman`)
- Antall sesjoner, slag totalt, beste carry, snitt carry
- Ballfart-trend (driver) linjediagram
- Sesjoner per klubb stolpediagram
- Klubb-statistikk tabell
- **Last opp CSV** — importer TrackMan CSV
- **Last opp skjermbilde** — AI/OCR leser TrackMan-skjermbilde

### 3.7 Dagbok / Treningslogg (`/portal/dagbok`, `/portal/dagbok/[sessionId]`)
- Streak, økter totalt, timer totalt, snitt vurdering
- Filter per fokusområde
- Listevisning eller kalendervisning
- Logg ny økt, gjenta siste økt, rediger logg

### 3.8 Treningsplan (`/portal/treningsplan`, `/portal/treningsplan/[sessionId]`)
- Ukeplan med 7-dagers selector
- Dagens økt med øvelser, varighet, fokusområde
- Marker økt som fullført, start økt
- Kalender-visning med drag-and-drop (TrainingPlannerV2)
- **Generer AI-plan** — komplett AI-treningsplan
- Manuell plan — opprett/rediger økter

### 3.9 Tester / DECADE Tester (`/portal/tester`, `/portal/trening/tester`)
- DECADE Tester: fullførte tester, total score, tilgjengelige tester, beste test
- **Leaderboard** per test med periode-filter
- Medaljer for topp 3
- 100+ standardiserte TrackMan-tester gruppert i kategorier

### 3.10 Mental Scorecard (`/portal/mental`, `/portal/mental/ny`, `/portal/mental/[roundId]`)
- Runder-tab med mental scorecard per runde
- Trends-tab: linjediagram over fokus, selvtillit, engasjement, aksept
- Ny mental scorecard: per hull med plan, target, fokus, selvtillit, visualisering, rutine, resultat, processcore, følelse, akseptert, tvil

### 3.11 Runde / Scorecard (`/portal/runde/ny`, `/portal/runde/[id]`, `/portal/runde/[id]/oppsummering`)
- Søk og velg bane, tee-farge, vær
- **Live runde**: hull-for-hull registrering med DECADE strategi-panel
- **DECADE strategi**: anbefalt klubb, aimpoint, målsone, fareområder
- **Pre-shot rutine**: steg-for-steg guide
- Oppsummering: total score, score-fordeling, fairway %, GIR %, putts, Strokes Gained breakdown, DECADE Score
- GPS-avstand

### 3.12 Spill-modul (`/portal/spill`, `/portal/spill/[gameType]`)
- Tre spillkategorier: Nærspill, Putting, Press
- Start spilløkt, logg slag (avstand, resultat, notater, pressnivå PR1-PR5)
- Avslutt økt: poengsum og statistikk

### 3.13 Sosialt (`/portal/sosialt`)
- Venner: liste med online/offline status, handicap, siste aktivitet
- Toppliste: handicap-leaderboard blant venner
- Innkommende venneforespørsler
- Legg til venn, godta/avslå forespørsler

### 3.14 Sammenligning / Peer-analyse (`/portal/sammenligning`)
- Spillerkategori basert på handicap og SG
- Sammenligning med peers på samme nivå
- Radar-chart og statistiske sammenligninger
- **Tilgang**: Krever PRO abonnement

### 3.15 Benchmarking (`/portal/benchmark`)
- PGA Tour-persentil per SG-kategori
- A-K ferdighetsnivå
- Proff-sammenligning: søk etter PGA Tour-spiller, radar-chart
- Forbedringspotensial: estimert HCP-effekt
- Innspill per avstand
- **Integrasjon**: DataGolf API

### 3.16 Kalender (`/portal/kalender`)
- Ukekalender
- Google Calendar Sync-innstillinger
- Koble til Google Calendar, administrere synkronisering

### 3.17 Meldinger (`/portal/meldinger`)
- Direktemeldinger med treneren
- Samtaleliste, send/lese meldinger

### 3.18 Analyse (`/portal/analyse`)
- GIR, Fairways, Putts/runde, Scrambling med trender
- Handicap-trend graf
- Strokes Gained breakdown
- TrackMan-data (kun Pro)

### 3.19 AI Coach (`/portal/ai-coach`, `/portal/ai-coach/chat`)
- Dashboard: KPI-kort (driver speed, konsistensscore, mental trend, DECADE score)
- Dagens innsikt, hurtighandlinger
- **Chat med AI Coach**: streaming chat med **Claude Sonnet 4.5**
- Quick questions: "Hva bør jeg trene?", "Analyser siste 5 runder", etc.
- System prompt med spillerens runder, treningslogger, treningsplan, TrackMan, turneringer

### 3.20 Apper / Marketplace (`/portal/apper`)
- Abonnementsplaner: Performance, Performance Pro, Gruppe
- Pakker (bundles) og enkeltapper
- Aktive abonnementer, prøveperiode-info
- Velg abonnement (måned/år), aktiver gratis moduler, administrer i Stripe

### 3.21 Bag / Klubber (`/portal/bag`)
- Visuell bag med alle klubber
- Valgt klubb: detaljer (carry, total, slag, loft, merke, modell)
- Avstandsoversikt, gap-analyse
- Legg til/fjern klubb fra standardliste

### 3.22 Abonnement (`/portal/abonnement`)
- Nåværende plan og pris
- Økter denne perioden (brukt/gjenstående) med progress bar
- Kommende bookinger, utløpsdato, bookingsvindu
- Oppgrader abonnement, administrer i Stripe, avbryt abonnement

### 3.23 Turneringer (`/portal/turneringer`)
- Mine turneringer — planlagte med mål, prioritet, påmeldingsstatus
- Alle turneringer — filtrerbar liste/kalender
- Pro Tour — PGA Tour og DP World Tour schedule (DataGolf)
- Meld deg på, sett måltype (prestasjon/læring/opplevelse), sett prioritet (A/B/C), legg til notater

### 3.24 Turneringsplan (`/portal/turneringsplan`)
- Sesong 2026 oversikt
- Tabs: Kommende / Påmeldt / Resultater
- Turneringsliste med dato, sted, nivå, serie, hull, mål, notater

### 3.25 Strategi (`/portal/strategi`)
- Bane-velger, hull-for-hull navigasjon (1-18)
- Hull-info: par, lengde, handicap-indeks
- DECADE Strategi: anbefalt klubb, aimpoint, målsone, fareområder
- Pre-shot rutine — 4 steg
- Dispersion-visualisering

### 3.26 Onboarding (`/portal/onboarding`)
- Wizard for nye brukere
- Målsettinger, treningsfrekvens

### 3.27 Portal API-er (utvalg)
| Gruppe | Endepunkter |
|--------|-------------|
| AI | `chat`, `training-plan`, `weakness-analysis`, `coaching-summary`, `coaching-transcription`, `focus-recommendation`, `generate-content`, `generate-drill`, `session-plan`, `post-round`, `score-estimate`, `metrics`, `mental/*`, `games/*` |
| TrackMan | `upload-csv`, `upload-image`, `sessions`, `sessions/[id]/shots`, `sessions/[id]/analytics` |
| Bookinger | `create-group`, `cancel`, `reschedule`, `live` |
| Kalender | `google/auth`, `google/callback`, `google/sync`, `google/webhook`, `token`, `feed/[token]` |
| Subscriptions | `checkout`, `portal`, `activate-free` |
| Turneringer | `create`, `import`, `import/confirm`, `sync`, `plan` |
| Diverse | `courses`, `facilities`, `public/*`, `sync/*`, `export`, `dagbok`, `rounds`, `tests/leaderboard`, `game-session`, `golfbox/handicap`, `notifications`, `payment-preferences`, `webhooks/stripe` |

### 3.28 Portal-navigasjon (Sidebar)
1. **Oversikt** → `/portal`
2. **Planlegg** → `/portal/treningsplan` (inkl. `/portal/bookinger`, `/portal/kalender`)
3. **Tren** → `/portal/dagbok` (inkl. `/portal/trening`, `/portal/tester`)
4. **Spill** → `/portal/runde` (inkl. `/portal/turneringer`, `/portal/spill`, `/portal/turneringsplan`, `/portal/bag`)
5. **Analyser** → `/portal/statistikk` (inkl. `/portal/analyse`, `/portal/benchmark`, `/portal/trackman`, `/portal/sammenligning`, `/portal/ai-coach`, `/portal/coaching-historikk`)

---

## 4. MISSION BOARD / ADMIN

### 4.1 Hub & Oversikt
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Oversikt (Hub) | KPI-kort (økter i dag, aktive elever, ventende bookinger, omsetning MTD) med sparklines. Kapasitetsutnyttelse gauge. Elevfordeling per tier (donut). Handicap-trend (30 dager). Dagens timeplan. Snarveier. Divisjoner. Påminnelser. | `/admin` |
| Mission Board | Visuelt task-board / kanban for operasjonell oppfølging | `/admin/mission-board` |
| Denne uken | Ukeoversikt med sessjoner, forberedelser, action items | `/admin/denne-uken` |
| Focus | Task-management med create-task-dialog, prioriteter | `/admin/focus` |

### 4.2 Kalender & Bookinger
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Kalender | Måned/uke/dag-visning. Booking-hendelser per dag. Instruktør-filter. Aktivitet-heatmap (ukedag × klokkeslett). Detalj-drawer per booking. Merk som ikke møtt. Legg til admin-notat. Blokker tid (ny hendelse). | `/admin/kalender` |
| Bookinger | Dag/liste-visning. Søk etter elev/tjeneste. Status-filter (Bekreftet/Venter/Avbestilt). Stats: i dag, bekreftet, venter, omsetning i dag. Bulk actions: send påminnelse, avbestill valgte. Eksporter CSV. Booking detail drawer med session plan panel. | `/admin/bookinger` |
| Ny booking | Manuell opprettelse av booking for elev | `/admin/bookinger/ny` |
| Godkjenninger | Godkjenningskø for bookinger/hendelser | `/admin/godkjenninger` |
| Tilgjengelighet | Administrer instruktør-tilgjengelighet og blokkerte tider | `/admin/tilgjengelighet` |
| Kapasitet | Kapasitetsoversikt, tabs, uke-justering | `/admin/kapasitet` |

### 4.3 Elever & Coaching
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Elever | DataTable med filtre (status, medlemskap). Stats: totalt, aktive, nye denne måneden, trenger oppfølging. Bulk actions: send e-post, eksporter valgte. Hurtigvisning-drawer. | `/admin/elever` |
| Elevprofil | Full profil med handicap-trend, treningsvolum bar-chart, aktivitetstimeline, mål (progress rings), treningsdata-tabs. Send melding. | `/admin/elever/[id]` |
| Coaching-notater | Oversikt over coaching-økter og notater | `/admin/okter` |
| Treningsplaner | Administrer elev-treningsplaner. Ny plan-wizard med drill-picker. | `/admin/treningsplan` |
| Turneringer | Administrer turneringer. Add tournament form. Tournament admin list. | `/admin/turneringer` |

### 4.4 Kommunikasjon
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Meldinger | Chat-grensesnitt for kommunikasjon med elever. Samtaleliste. | `/admin/meldinger` |
| E-postmaler | Administrer e-postmaler | `/admin/e-postmaler` |
| Push-varsler | Notification manager for push-notifikasjoner | `/admin/notifications` |

### 4.5 AI & Agenter
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| AI-assistent | Chat-grensesnitt for admin-AI | `/admin/ai-assistent` |
| Agenter | Oversikt over AI-agenter og deres oppgaver | `/admin/agenter` |

### 4.6 Analyse & Økonomi
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Analytics | Dashboard med statistikker og grafer for virksomheten | `/admin/analytics` |
| Økonomi | Omsetningsoversikt: år totalt, månedlig trend (area chart + sammenligning i fjor), donut-chart per tjeneste, måloppnåelse gauge, ubetalte transaksjoner-tabell, refusjoner-tabell. Date range picker. Sparklines. | `/admin/okonomi` |
| Rapporter | Rapportgenerator og oversikt | `/admin/rapporter` |

### 4.7 Fasiliteter
| Funksjon | Beskrivelse | Rute |
|----------|-------------|------|
| Fasiliteter | Oversikt over anlegg. Status (aktiv/vedlikehold/inaktiv). Dagsplan per fasilitet. Booking counts. | `/admin/fasiliteter` |
| Innstillinger | Konfigurasjon av fasiliteter | `/admin/fasiliteter/innstillinger` |
| Ny aktivitet | Opprett ny aktivitet/hendelse på fasilitet | `/admin/fasiliteter/ny-aktivitet` |

### 4.8 Admin-navigasjon (MC_NAV_CONFIG)
**Hub**
- Oversikt (`/admin`)
- Mission Board (`/admin/mission-board`)
- Denne uken (`/admin/denne-uken`)
- Focus (`/admin/focus`)

**Kalender & Bookinger**
- Kalender, Bookinger, Godkjenninger, Tilgjengelighet, Kapasitet

**Elever & Coaching**
- Elever, Coaching-notater, Treningsplaner, Turneringer

**Kommunikasjon**
- Meldinger, E-postmaler, Push-varsler

**AI & Agenter**
- AI-assistent, Agenter

**Analyse & Økonomi**
- Analytics, Økonomi, Rapporter

**Fasiliteter**
- Fasiliteter

### 4.9 RBAC-regler (Admin)
| Ressurs | Tillatte roller |
|---------|-----------------|
| Hub, Kalender, Fasiliteter | ADMIN, INSTRUCTOR, INVITED |
| Bookinger, Elever, Meldinger | ADMIN, INSTRUCTOR |
| Agenter, Økonomi, Rapporter | ADMIN |

---

## 5. INTEGRASJONER (På tvers av plattformen)

| Integrasjon | Bruksområde |
|-------------|-------------|
| **Supabase** | Auth, database, realtime, storage |
| **Stripe** | Betaling, checkout, abonnement, customer portal, webhook |
| **Anthropic (Claude / Sonnet 4.5)** | AI Coach chat, coaching-oppsummeringer, treningsplan-generering, innholdsgenerering |
| **TrackMan** | CSV-import, bilde-OCR, swingdata, sesjonsanalyse |
| **Google Calendar** | Kalendersynkronisering (auth, callback, sync, webhook, iCal-feed) |
| **DataGolf** | Pro Tour schedules, proffstatistikk, benchmarking, sammenligning |
| **GolfBox** | Handicap-integrasjon |
| **Notion** | Auto-opprettelse av player profile ved gjestebooking |
| **Acuity Scheduling** | Legacy booking iframe på `/booking` (v1) |
| **Vipps** | Definert som betalingsmetode, ikke fullt implementert |

---

## 6. CRON-JOBS & AUTOMATISERING (Bak kulissene)

Basert på dokumentasjon i `03_FEATURES_AND_RULES.md` og kodebase:

| Jobb | Formål |
|------|--------|
| Booking reminders | SMS/e-post 24t før sesjon |
| No-show handler | Auto-markere som NO_SHOW etter cutoff |
| Waitlist cleanup | Fjerne utløpte ventelisteposisjoner |
| Google Calendar sync | Synkronisere bookinger til/fra Google Calendar |
| AI insights | Generere ukentlig AI-innsikt (mandager 06:00) |
| Win-back sequences | E-post/SMS-sekvenser for inaktive brukere |
| Subscription quota reset | Nullstille månedlig kvote ved fornyelse |
| Health checks | `/api/health/booking` — sjekker DB, dobbeltbookings, låser |

---

*Dokumentet er generert fra grundig kartlegging av hele `akgolf-platform`-kodebasen og representerer den mest komplette oversikten over alle brukervendte funksjoner per april 2026.*
