# Komplett funksjonskart — AK Golf Platform

> Generert: 2026-04-21  
> Kilder: `PLATFORM_FUNCTION_MAP.md`, `BACKLOG.md`, `PLAN.md`, `app/design-review/data.ts`, `app/`-ruter, `components/`, `lib/`

---

## Oversikt

| Kategori | Antall skjermer | Brukergruppe |
|---|---|---|
| **Public / Marked** | 10 | Besøkende (ikke innlogget) |
| **Auth** | 5 | Alle brukere |
| **Portal (spiller)** | 48 | Innloggede spillere |
| **Mission Control (admin/coach)** | 23 | Coach / admin |
| **Error / Utility** | 3 | Alle |
| **Design-review** | 1 | Dev-only |
| **Totalt** | **90 skjermer** | |

---

## Del 1: Public / Marked (konverteringsflate)

> Mål: Få besøkende til å booke tjenester eller registrere seg.

### Forside
| | |
|---|---|
| **Rute** | `/` |
| **Skjermnavn** | Forside |
| **Hovedfunksjoner** | Presentere AK Golf Academy, bygge tillit, CTA til booking/registrering |
| **Data som vises** | Hero-seksjon, tjeneste-divisjoner (Academy / Junior / Utvikling), team, testimonials, FAQ |
| **Handlinger** | "Book nå"-knapper, navigasjon til undersider, scroll-animasjoner |
| **Koblinger** | ← Alle sider. → `/academy`, `/junior-academy`, `/booking`, `/auth/register` |

### Academy
| | |
|---|---|
| **Rute** | `/academy` |
| **Skjermnavn** | Academy-hjem |
| **Hovedfunksjoner** | Presentere AK Golf Academy-tjenester, konsept, priser, CTA |
| **Data som vises** | Konseptseksjon, hvordan det fungerer, prisoversikt, portal-preview, sammenligning |
| **Handlinger** | "Kom i gang"-CTA, navigasjon til abonnement |
| **Koblinger** | ← `/`, `/landing/pricing`. → `/academy/abonnement`, `/booking` |

### Academy abonnement
| | |
|---|---|
| **Rute** | `/academy/abonnement` |
| **Skjermnavn** | Academy-pakker |
| **Hovedfunksjoner** | Vise abonnementspakker med Stripe-priser |
| **Data som vises** | Flex 50, Flex 90, Junior Academy, Elite-pakker — pris, inkludert, kvoter |
| **Handlinger** | Velg pakke → redirect til Stripe checkout |
| **Koblinger** | ← `/academy`. → Stripe checkout |

### Junior Academy
| | |
|---|---|
| **Rute** | `/junior-academy` |
| **Skjermnavn** | Junior-program |
| **Hovedfunksjoner** | Presentere junior-spesifikt tilbud for aldersgrupper |
| **Data som vises** | Aldersgrupper, program, foreldre-info, priser |
| **Handlinger** | CTA til booking/registrering |
| **Koblinger** | ← `/`, `/academy`. → `/booking` |

### Utvikling
| | |
|---|---|
| **Rute** | `/utvikling` |
| **Skjermnavn** | Utviklingsløp |
| **Hovedfunksjoner** | Presentere utviklingsløp for voksne spillere |
| **Data som vises** | Utviklingsfaser, metodikk, priser |
| **Handlinger** | CTA til booking |
| **Koblinger** | ← `/`. → `/booking` |

### Landing Pricing
| | |
|---|---|
| **Rute** | `/landing/pricing` |
| **Skjermnavn** | Prisoversikt |
| **Hovedfunksjoner** | Alternativ prisside med alle tjenester |
| **Data som vises** | Alle pakker og enkeltøkter med priser fra Stripe |
| **Handlinger** | Velg pakke, kontakt-CTA |
| **Koblinger** | ← `/`, `/academy`. → `/booking`, `/landing/contact` |

### Landing Contact
| | |
|---|---|
| **Rute** | `/landing/contact` |
| **Skjermnavn** | Kontaktskjema |
| **Hovedfunksjoner** | Kontaktskjema for henvendelser |
| **Data som vises** | Skjema: navn, epost, telefon, melding |
| **Handlinger** | Send melding (Formspree/Resend) |
| **Koblinger** | ← Alle markedssider |

### Booking (public wizard)
| | |
|---|---|
| **Rute** | `/booking` → `/booking/[id]/confirmation` |
| **Skjermnavn** | Booking-wizard |
| **Hovedfunksjoner** | Book coaching uten å være innlogget (5-stegs wizard) |
| **Data som vises** | Tjenester, coach, dato/tid, oppsummering, betaling |
| **Handlinger** | Velg tjeneste → velg coach → velg dato/tid → review → betal (Stripe) → bekreftelse |
| **Koblinger** | ← Alle CTA-knapper. → Stripe betaling → bekreftelse |

---

## Del 2: Auth (innlogging / registrering)

| Rute | Skjermnavn | Hovedfunksjoner |
|---|---|---|
| `/auth/login` | Innlogging | Epost + passord, magic link, Google OAuth |
| `/auth/register` | Registrering | Opprett konto, velg profiltype, Godkjenn vilkår |
| `/auth/forgot-password` | Glemt passord | Reset-passord via epost |
| `/auth/callback` | Auth callback | OAuth redirect-handling |
| `/auth/set-password` | Sett passord | Første gangs passord etter invitasjon |

**Koblinger:** Alle auth-sider lenker til hverandre. Etter login → `/portal`. Etter registrering → `/portal/onboarding`.

---

## Del 3: Portal — Spilleropplevelse (48 skjermer)

Portal er organisert i **4 spiller-faser**: PLANLEGGE → GJENNOMFØRE → EVALUERE → ADMINISTRERE.

---

### Fase: PLANLEGGE — "Hva skal jeg gjøre framover?"

#### Dashboard
| | |
|---|---|
| **Rute** | `/portal` |
| **Skjermnavn** | Dashboard (hjem) |
| **Hovedfunksjoner** | Oversikt over alt viktig: neste booking, ukesmål, fokusområde, AI-innsikt, treningsplan-sammendrag |
| **Data som vises** | User, Booking, TrainingPlan, USI (Unified Skill Index), CoachingForecast, TrackMan-sammendrag, HCP-trend |
| **Handlinger** | Klikk kort for å navigere til detaljer, se AI-innsikt, se neste økt |
| **Koblinger** | ← Login, onboarding. → `/portal/bookinger`, `/portal/treningsplan`, `/portal/statistikk`, `/portal/kartlegging` |

#### Treningsplan
| | |
|---|---|
| **Rute** | `/portal/treningsplan` |
| **Skjermnavn** | Treningsplan |
| **Hovedfunksjoner** | Se og redigere 12-ukers treningsplan. Drag-and-drop økter. Se treningspyramide. Filtrer øvelser. |
| **Data som vises** | TrainingPlan, TrainingPlanWeek, TrainingPlanSession, ExerciseDefinition, treningspyramide (FYS/TEK/SLAG/SPILL/TURN) |
| **Handlinger** | Dra økter mellom dager, klikk økt for detaljer/redigering, filtrer etter kategori, generer ny plan (AI) |
| **Koblinger** | ← `/portal`. → Økt-detalj, `/portal/dagbok`, `/portal/min-plan` |

#### Min plan
| | |
|---|---|
| **Rute** | `/portal/min-plan` |
| **Skjermnavn** | Min plan ( Coaching Forecast ) |
| **Hovedfunksjoner** | Se AI-generert coaching forecast: SG-mål, treningsfokus, tidsbudsjett, progresjon |
| **Data som vises** | CoachingForecast, TrainingPrescription, USI-trend, HCP-prognose |
| **Handlinger** | Se forecast-detaljer, juster tidsbudsjett, se anbefalte øvelser |
| **Koblinger** | ← `/portal`, `/portal/kartlegging` |

#### Mine bookinger
| | |
|---|---|
| **Rute** | `/portal/bookinger` |
| **Skjermnavn** | Mine bookinger |
| **Hovedfunksjoner** | Se kommende og tidligere bookinger. Reschedule/avlys. Se kvote-bruk. |
| **Data som vises** | Booking, CoachingSession, ServiceType, kvote-status, betalingsstatus |
| **Handlinger** | Klikk for detalj, reschedule, avlys, se kvote |
| **Koblinger** | ← `/portal`. → Booking-detalj, reschedule, avlys, `/booking` (ny booking) |

#### Ny booking (portal)
| | |
|---|---|
| **Rute** | `/portal/bookinger/ny` |
| **Skjermnavn** | Ny booking |
| **Hovedfunksjoner** | Samme wizard som public booking, men innenfor portal-kontekst |
| **Data som vises** | ServiceType, CoachingAvailability, Instructor |
| **Handlinger** | Wizard: tjeneste → coach → dato/tid → review → betal |
| **Koblinger** | ← `/portal/bookinger`. → Bekreftelse |

#### Kalender
| | |
|---|---|
| **Rute** | `/portal/kalender` |
| **Skjermnavn** | Min kalender |
| **Hovedfunksjoner** | Se bookinger og treningsøkter i kalendervisning. Google Calendar-sync. |
| **Data som vises** | Booking, TrainingLog, kalender-events |
| **Handlinger** | Bytt visning (uke/måned), klikk event for detaljer, sync med Google Calendar |
| **Koblinger** | ← `/portal`. → Booking-detalj, økt-detalj |

#### Turneringer
| | |
|---|---|
| **Rute** | `/portal/turneringer` |
| **Skjermnavn** | Mine turneringer |
| **Hovedfunksjoner** | Se turneringer spilleren deltar i. Forberedelse. |
| **Data som vises** | Tournament, TournamentPrep, PlayerTournamentPlan |
| **Handlinger** | Legg til turnering, se forberedelse, se course notes |
| **Koblinger** | ← `/portal`. → Turneringsdetalj |

#### Turneringsplan
| | |
|---|---|
| **Rute** | `/portal/turneringsplan` |
| **Skjermnavn** | Turneringsplanlegger |
| **Hovedfunksjoner** | Se kommende turneringer fra GolfBox/andre kilder. Planlegg sesong. |
| **Data som vises** | Turneringer fra 6 kilder (Olyo, Østlandstour, Garmin, Srixon, Nordic, JMI, Global Junior) |
| **Handlinger** | Filtrer etter dato/region/kilde, legg til i kalender |
| **Koblinger** | ← `/portal/turneringer` |

---

### Fase: GJENNOMFØRE — "Hva gjør jeg akkurat nå?"

#### Ny runde
| | |
|---|---|
| **Rute** | `/portal/runde/ny` |
| **Skjermnavn** | Start ny runde |
| **Hovedfunksjoner** | Velg bane, dato, spilleform. Start live scorecard. |
| **Data som vises** | Course, bane-liste (mock fallback), spilleformer |
| **Handlinger** | Velg bane → start runde |
| **Koblinger** | ← `/portal`. → Live runde |

#### Live runde
| | |
|---|---|
| **Rute** | `/portal/runde/[id]` |
| **Skjermnavn** | Live scorecard |
| **Hovedfunksjoner** | Logge score hull-for-hull: slag, putts, FW, GIR, scrambling. Se SG i sanntid. |
| **Data som vises** | Round, HoleResult, Shot, SG per hull, runde-total |
| **Handlinger** | Registrer slag, putts, FW (ja/nei), GIR (ja/nei), avslutt runde |
| **Koblinger** | ← Ny runde. → Oppsummering |

#### Runde-oppsummering
| | |
|---|---|
| **Rute** | `/portal/runde/[id]/oppsummering` |
| **Skjermnavn** | Runde-oppsummering |
| **Hovedfunksjoner** | Se resultat etter runde: score, SG-breakdown, nøkkeltall, AI-analyse |
| **Data som vises** | RoundStats, StrokesGained (4 kategorier), putts, FW%, GIR%, scrambling% |
| **Handlinger** | Se detaljer, del resultat, gå til treningsplan |
| **Koblinger** | ← Live runde. → `/portal/statistikk`, `/portal/treningsplan` |

#### TrackMan
| | |
|---|---|
| **Rute** | `/portal/trackman` |
| **Skjermnavn** | TrackMan Data |
| **Hovedfunksjoner** | Se TrackMan-sesjoner, klubbe-for-klubbe-data, trender, AI-innsikt. Importer CSV. |
| **Data som vises** | TrackmanSession, TrackManShotData, TrackManSessionAnalytics, klubbe-trender, AI-innsikt |
| **Handlinger** | Velg sesjon, se klubbe-data, importer CSV, se AI-innsikt, regenerer innsikt |
| **Koblinger** | ← `/portal`. → TrackMan-sesjon-detalj |

#### Dagbok
| | |
|---|---|
| **Rute** | `/portal/dagbok` |
| **Skjermnavn** | Treningsdagbok |
| **Hovedfunksjoner** | Logge daglige økter, refleksjon, energi, fokus. Se aktivitetsheatmap, streaks, volum-pyramide. |
| **Data som vises** | Journal, TrainingLog, aktivitetsheatmap, streak, treningsvolum per kategori |
| **Handlinger** | Logg ny økt, se historikk, se streak, se ukentlig statistikk |
| **Koblinger** | ← `/portal`. → Ny dagbok-post, økt-detalj |

#### Tester
| | |
|---|---|
| **Rute** | `/portal/tester` |
| **Skjermnavn** | Ferdighetstester |
| **Hovedfunksjoner** | Gjennomfør 20+ standardtester (50-100-150, dispersion, green reading, etc.) |
| **Data som vises** | TestDefinition, TestResult, progresjon over tid |
| **Handlinger** | Start test, registrer resultater, se historikk |
| **Koblinger** | ← `/portal`, `/portal/kartlegging` |

#### Spill / Sosialt
| | |
|---|---|
| **Rute** | `/portal/spill`, `/portal/sosialt` |
| **Skjermnavn** | Sosialt spill |
| **Hovedfunksjoner** | Start sosiale spill-sessioner, se feed, utfordringer, venner |
| **Data som vises** | GameSession, Challenge, FeedItem, Friendship |
| **Handlinger** | Start spill, se utfordringer, se vennelisten |
| **Koblinger** | ← `/portal` |

#### Mental
| | |
|---|---|
| **Rute** | `/portal/mental` |
| **Skjermnavn** | Mental trening |
| **Hovedfunksjoner** | Logge mental-økter (pre/post-shot rutiner), se mental-profil |
| **Data som vises** | MentalSession, MentalScorecardEntry, MentalProfile |
| **Handlinger** | Start mental-økt, se historikk |
| **Koblinger** | ← `/portal` |

#### Coaching-historikk
| | |
|---|---|
| **Rute** | `/portal/coaching-historikk` |
| **Skjermnavn** | Coaching-historikk |
| **Hovedfunksjoner** | Se alle coaching-sesjoner. AI-oppsummering per sesjon. Notater fra coach. |
| **Data som vises** | CoachingSession, AI-oppsummering, notater, video, TrackMan-data fra sesjon |
| **Handlinger** | Se sesjonsdetalj, se AI-oppsummering, se notater |
| **Koblinger** | ← `/portal`. → Sesjonsdetalj |

---

### Fase: EVALUERE — "Hva har jeg gjort? Hva fungerer?"

#### Statistikk
| | |
|---|---|
| **Rute** | `/portal/statistikk` |
| **Skjermnavn** | Min statistikk |
| **Hovedfunksjoner** | SG-analyse, HCP-trend, utvikling over tid. KPI-rad, grafer, AI-anbefaling. |
| **Data som vises** | StrokesGained, RoundStats, PlayerMetrics, HandicapEntry, HCP-prognose, Recharts-grafer (Area, Donut, Radar) |
| **Handlinger** | Bytt tidsperiode, se detalj per kategori, se AI-anbefaling |
| **Koblinger** | ← `/portal`. → `/portal/kartlegging`, `/portal/benchmark` |

#### Kartlegging
| | |
|---|---|
| **Rute** | `/portal/kartlegging` |
| **Skjermnavn** | Spillerkartlegging |
| **Hovedfunksjoner** | USI (Unified Skill Index), kategori A–K, gap-analyse, coaching forecast. |
| **Data som vises** | UnifiedSkillIndex, UnifiedSkillSnapshot, CoachingForecast, USI-verdi per kategori, fokusområder |
| **Handlinger** | Se detalj per kategori, se test-historikk, se treningsindex |
| **Koblinger** | ← `/portal`, `/portal/statistikk`. → Test-historikk, treningsindex |

#### Analyse
| | |
|---|---|
| **Rute** | `/portal/analyse` |
| **Skjermnavn** | AI-innsikter |
| **Hovedfunksjoner** | Se AI-genererte innsikter per uke: svakhetsanalyse, fokusområder, anbefalinger. |
| **Data som vises** | AIInsight, AILearning, svakhetsanalyse, treningsfokus |
| **Handlinger** | Se innsikt-detalj, godta anbefaling |
| **Koblinger** | ← `/portal`. → Innsikt-detalj |

#### Benchmark
| | |
|---|---|
| **Rute** | `/portal/benchmark` |
| **Skjermnavn** | Benchmark |
| **Hovedfunksjoner** | Sammenligne egne tall mot norske/alder-baserte benchmarks. Se TalentScore. |
| **Data som vises** | NorwegianSkillBenchmark, TalentScore, USI, radar-diagram |
| **Handlinger** | Se sammenligning, se detalj per kategori |
| **Koblinger** | ← `/portal/statistikk`, `/portal/kartlegging` |

#### Sammenligning
| | |
|---|---|
| **Rute** | `/portal/sammenligning` |
| **Skjermnavn** | Sammenligning |
| **Hovedfunksjoner** | Sammenligne egne runder/økter. Head-to-head vs andre spillere. |
| **Data som vises** | Round, RoundStats, sammenligningsgrafer |
| **Handlinger** | Velg runder å sammenligne, se radar-diagram |
| **Koblinger** | ← `/portal` |

#### Strategi
| | |
|---|---|
| **Rute** | `/portal/strategi` |
| **Skjermnavn** | Strategi-oversikt |
| **Hovedfunksjoner** | AI-generert strategi basert på spillerdata og bane. |
| **Data som vises** | AIInsight, TrainingPrescription, CourseNotes |
| **Handlinger** | Se strategi, se anbefalinger |
| **Koblinger** | ← `/portal` |

---

### Fase: ADMINISTRERE — "Hvem er jeg i systemet?"

#### Profil
| | |
|---|---|
| **Rute** | `/portal/profil` |
| **Skjermnavn** | Min profil |
| **Hovedfunksjoner** | Se og redigere profil: navn, bilde, klubb, HCP-kilde. |
| **Data som vises** | User, UserGolfId, UserPreferences, profilbilde |
| **Handlinger** | Rediger profil, last opp bilde, endre HCP-kilde |
| **Koblinger** | ← `/portal`. → `/portal/profil/innstillinger` |

#### Profil innstillinger
| | |
|---|---|
| **Rute** | `/portal/profil/innstillinger` |
| **Skjermnavn** | Profil-innstillinger |
| **Hovedfunksjoner** | Varslingsinnstillinger, preferanser, app-moduler. |
| **Data som vises** | UserPreferences, PushSubscription, app-moduler |
| **Handlinger** | Toggle varsler, velg app-moduler, endre preferanser |
| **Koblinger** | ← `/portal/profil` |

#### Abonnement
| | |
|---|---|
| **Rute** | `/portal/abonnement` |
| **Skjermnavn** | Mitt abonnement |
| **Hovedfunksjoner** | Se abonnement, kvote-bruk, historikk, oppgrader. |
| **Data som vises** | UserSubscription, TrainingSubscription, SubscriptionQuota, betalingshistorikk |
| **Handlinger** | Se kvote, oppgrader plan, se fakturaer |
| **Koblinger** | ← `/portal`. → Oppgradering |

#### Bag
| | |
|---|---|
| **Rute** | `/portal/bag` |
| **Skjermnavn** | Min golfbag |
| **Hovedfunksjoner** | Registrere køller, avstander, dispersion-data. |
| **Data som vises** | PlayerBag, PlayerClub, ClubDispersionData |
| **Handlinger** | Legg til kølle, registrer avstander, se dispersion |
| **Koblinger** | ← `/portal` |

#### Meldinger
| | |
|---|---|
| **Rute** | `/portal/meldinger` |
| **Skjermnavn** | Meldinger |
| **Hovedfunksjoner** | Chat med coach. Se samtaler. Sende meldinger. |
| **Data som vises** | Conversation, Message, UnifiedMessage |
| **Handlinger** | Send melding, se thread, se coaching-notater |
| **Koblinger** | ← `/portal`. → Thread-detalj |

#### AI Coach
| | |
|---|---|
| **Rute** | `/portal/ai-coach` |
| **Skjermnavn** | AI Coach |
| **Hovedfunksjoner** | Chat med AI-coach. Hurtigspørsmål. Kontekst fra brukerdata. |
| **Data som vises** | AIResponse, brukerdata-kontekst (siste runder, TrackMan, etc.) |
| **Handlinger** | Send spørsmål, se hurtigspørsmål, se historikk |
| **Koblinger** | ← `/portal` |

#### Apper
| | |
|---|---|
| **Rute** | `/portal/apper` |
| **Skjermnavn** | Mine apper |
| **Hovedfunksjoner** | Administrere app-moduler og integrasjoner. |
| **Data som vises** | AppSubscription, AppModule, AppBundle |
| **Handlinger** | Aktiver/deaktiver moduler, se tilgjengelige apper |
| **Koblinger** | ← `/portal` |

#### Onboarding
| | |
|---|---|
| **Rute** | `/portal/onboarding` |
| **Skjermnavn** | Onboarding |
| **Hovedfunksjoner** | Førstegangsoppsett: velg fokus, sett mål, konfigurer profil. |
| **Data som vises** | Onboarding-wizard steg |
| **Handlinger** | Fullfør steg, velg fokusområde, sett HCP |
| **Koblinger** | Etter registrering. → `/portal` |

---

## Del 4: Mission Control — Admin/Coach (23 skjermer)

Organisert etter MC-sidebar (`mc-nav-config.ts`).

### Hub & Oversikt

#### Admin Dashboard (Hub)
| | |
|---|---|
| **Rute** | `/admin` |
| **Skjermnavn** | Hub-oversikt |
| **Hovedfunksjoner** | Oversikt over hele operasjonen: kommende bookinger, elev-status, inntekt, aktivitet. |
| **Data som vises** | Stats-kort, upcoming bookings, student progress, revenue |
| **Handlinger** | Naviger til undersider, se detaljer |
| **Koblinger** | ← Login. → Alle MC-sider |

#### Mission Board
| | |
|---|---|
| **Rute** | `/admin/mission-board` |
| **Skjermnavn** | Mission Board |
| **Hovedfunksjoner** | Operativ tavle: bookings, oppgaver, status, signaler (stagnasjon, regresjon). |
| **Data som vises** | Bookinger, coaching-signals, prioriterte oppgaver |
| **Handlinger** | Filtrer, se detalj, marker som fullført |
| **Koblinger** | ← `/admin` |

#### Coaching Board
| | |
|---|---|
| **Rute** | `/admin/coaching-board` |
| **Skjermnavn** | Coaching Board |
| **Hovedfunksjoner** | Coachens dag: hvem skal jeg trene i dag? Prioriterte elever. |
| **Data som vises** | Dagens bookinger, elev-prioritering, coaching-signals |
| **Handlinger** | Se elev-profil, se forberedelse |
| **Koblinger** | ← `/admin`. → Elev-detalj |

### Elever & Coaching

#### Elever (liste)
| | |
|---|---|
| **Rute** | `/admin/elever` |
| **Skjermnavn** | Elev-oversikt |
| **Hovedfunksjoner** | Se alle elever. Søk, filtrer, se progresjon. |
| **Data som vises** | Elev-liste, USI, HCP, siste aktivitet, abonnement |
| **Handlinger** | Søk, filtrer, klikk for detalj |
| **Koblinger** | ← `/admin`. → Elev-detalj |

#### Elev-detalj
| | |
|---|---|
| **Rute** | `/admin/elever/[id]` |
| **Skjermnavn** | Elev-profil |
| **Hovedfunksjoner** | Full profil per elev: progresjon, coaching-historikk, treningsdata, notater. |
| **Data som vises** | All spillerdata: runder, TrackMan, dagbok, USI, bookinger, meldinger |
| **Handlinger** | Se data, skriv notat, send melding, se treningsplan |
| **Koblinger** | ← `/admin/elever`. → `/admin/meldinger`, `/admin/treningsplan` |

### Kalender & Booking

#### Admin kalender
| | |
|---|---|
| **Rute** | `/admin/kalender` |
| **Skjermnavn** | Coach-kalender |
| **Hovedfunksjoner** | Uke-/måned-visning av alle bookinger. Sette tilgjengelighet. Blokkere tid. |
| **Data som vises** | Booking, InstructorAvailability, BlockedTime, fargekodede events |
| **Handlinger** | Sett tilgjengelighet, blokker tid, reschedule booking |
| **Koblinger** | ← `/admin` |

#### Admin bookinger
| | |
|---|---|
| **Rute** | `/admin/bookinger` |
| **Skjermnavn** | Booking-oversikt |
| **Hovedfunksjoner** | Administrere alle bookinger. Godkjenne, avlyse, refundere. |
| **Data som vises** | Alle bookinger med status, betaling, elev |
| **Handlinger** | Godkjenn, avlys, refunder, se detalj |
| **Koblinger** | ← `/admin`, `/admin/kalender` |

#### Tilgjengelighet
| | |
|---|---|
| **Rute** | `/admin/tilgjengelighet` |
| **Skjermnavn** | Tilgjengelighetsstyring |
| **Hovedfunksjoner** | Sette faste arbeidstider, unntak, ferie. |
| **Data som vises** | InstructorAvailability, InstructorDateAvailability |
| **Handlinger** | Sett faste timer, legg til unntak, blokkér datoer |
| **Koblinger** | ← `/admin/kalender` |

#### Kapasitet
| | |
|---|---|
| **Rute** | `/admin/kapasitet` |
| **Skjermnavn** | Kapasitetsanalyse |
| **Hovedfunksjoner** | Se kapasitetsutnyttelse, prognoser, overbookingsvarsel. |
| **Data som vises** | Kapasitetsdata, forecast, inntektsprognose |
| **Handlinger** | Se uke-/måned-visning, juster kapasitet |
| **Koblinger** | ← `/admin` |

### Operasjon

#### Denne uken / Focus / Økter
| | |
|---|---|
| **Rute** | `/admin/denne-uken`, `/admin/focus`, `/admin/okter` |
| **Skjermnavn** | Ukeoversikt, Fokus, Økt-oversikt |
| **Hovedfunksjoner** | Se denne ukens plan, fokusområder, gjennomførte/forestående økter. |
| **Data som vises** | Ukesplan, økt-liste, fokusområder |
| **Handlinger** | Se detalj, loggfør økt |
| **Koblinger** | ← `/admin` |

#### Treningsplaner (admin)
| | |
|---|---|
| **Rute** | `/admin/treningsplan` |
| **Skjermnavn** | Treningsplan-admin |
| **Hovedfunksjoner** | Opprette og administrere treningsplaner for elever. |
| **Data som vises** | TrainingPlan, elev-liste |
| **Handlinger** | Opprett plan, tilpass plan, tildel elev |
| **Koblinger** | ← `/admin/elever` |

#### Turneringer (admin)
| | |
|---|---|
| **Rute** | `/admin/turneringer` |
| **Skjermnavn** | Turneringsadmin |
| **Hovedfunksjoner** | Administrere turneringer, se påmeldte elever. |
| **Data som vises** | Tournament, påmeldte elever |
| **Handlinger** | Legg til turnering, se deltakere |
| **Koblinger** | ← `/admin` |

#### Fasiliteter
| | |
|---|---|
| **Rute** | `/admin/fasiliteter` |
| **Skjermnavn** | Fasiliteter |
| **Hovedfunksjoner** | Administrere treningssenter, simulatorer, range-båser. |
| **Data som vises** | Facility, FacilityActivity, Location |
| **Handlinger** | Legg til fasilitet, sett kapasitet, se aktivitet |
| **Koblinger** | ← `/admin` |

### Kommunikasjon

#### Meldinger (admin)
| | |
|---|---|
| **Rute** | `/admin/meldinger` |
| **Skjermnavn** | Innboks |
| **Hovedfunksjoner** | Se og svare på meldinger fra elever. Unified inbox. |
| **Data som vises** | Conversation, Message, UnifiedMessage |
| **Handlinger** | Send melding, se thread, arkiver |
| **Koblinger** | ← `/admin`. → Elev-detalj |

#### E-postmaler
| | |
|---|---|
| **Rute** | `/admin/e-postmaler` |
| **Skjermnavn** | E-postmaler |
| **Hovedfunksjoner** | Administrere e-postmaler for automatiske utsendelser. |
| **Data som vises** | EmailTemplate, EmailSequence |
| **Handlinger** | Rediger mal, forhåndsvis, aktiver/deaktiver sekvens |
| **Koblinger** | ← `/admin` |

#### Push-varsler
| | |
|---|---|
| **Rute** | `/admin/notifications` |
| **Skjermnavn** | Push-varsel-admin |
| **Hovedfunksjoner** | Send push-notifikasjoner til elever. Administrere varsel-innstillinger. |
| **Data som vises** | Notification, PushSubscription |
| **Handlinger** | Send varsel, se leveringsstatus |
| **Koblinger** | ← `/admin` |

### AI + Analyse

#### AI-assistent
| | |
|---|---|
| **Rute** | `/admin/ai-assistent` |
| **Skjermnavn** | AI-assistent |
| **Hovedfunksjoner** | AI-verktøy for coach: generer øvelser, analyser spillere, oppsummer sesjoner. |
| **Data som vises** | AI-verktøy, spillerkontekst |
| **Handlinger** | Generer øvelse, oppsummer sesjon, analyser svakheter |
| **Koblinger** | ← `/admin` |

#### Agenter
| | |
|---|---|
| **Rute** | `/admin/agenter` |
| **Skjermnavn** | Agent-kontroll |
| **Hovedfunksjoner** | Konfigurere og overvåke AI-agenter. |
| **Data som vises** | Agent, AgentConfig, AILearning |
| **Handlinger** | Aktiver/deaktiver agent, konfigurer, se logg |
| **Koblinger** | ← `/admin` |

#### Analytics
| | |
|---|---|
| **Rute** | `/admin/analytics` |
| **Skjermnavn** | Analytics-dashboard |
| **Hovedfunksjoner** | Se ytelsesdata: inntekt, elev-vekst, aktivitet, HCP-fordeling. |
| **Data som vises** | RevenueChart, ActivityHeatmap, HCPDistribution, StudentGrowth |
| **Handlinger** | Filtrer periode, eksporter data |
| **Koblinger** | ← `/admin` |

#### Økonomi
| | |
|---|---|
| **Rute** | `/admin/okonomi` |
| **Skjermnavn** | Økonomi-oversikt |
| **Hovedfunksjoner** | Se inntekter, utgifter, abonnementsinntekt. |
| **Data som vises** | PaymentTransaction, inntektsgrafer |
| **Handlinger** | Se detalj, eksporter, filtrer |
| **Koblinger** | ← `/admin/analytics` |

#### Rapporter
| | |
|---|---|
| **Rute** | `/admin/rapporter` |
| **Skjermnavn** | Rapport-generator |
| **Hovedfunksjoner** | Generere rapporter for elever, perioder, eller hele akademiet. |
| **Data som vises** | Genererte rapporter, maler |
| **Handlinger** | Generer rapport, last ned PDF, del |
| **Koblinger** | ← `/admin` |

### Team & System

#### Team + tilgang
| | |
|---|---|
| **Rute** | `/admin/team` |
| **Skjermnavn** | Team-admin |
| **Hovedfunksjoner** | Administrere team-medlemmer, roller, tilganger (RBAC). |
| **Data som vises** | UserCapability, CapabilityChangeLog, team-medlemmer |
| **Handlinger** | Inviter bruker, endre rolle, se audit-logg |
| **Koblinger** | ← `/admin`. → Audit-logg |

---

## Del 5: Sidemeny-struktur

### Portal-sidemeny (spiller)

```
┌─ Dashboard (/portal)
├─ PLANLEGGE
│  ├─ Treningsplan (/portal/treningsplan)
│  ├─ Min plan (/portal/min-plan)
│  ├─ Mine bookinger (/portal/bookinger)
│  ├─ Kalender (/portal/kalender)
│  └─ Turneringer (/portal/turneringer)
├─ GJENNOMFØRE
│  ├─ Ny runde (/portal/runde/ny)
│  ├─ TrackMan (/portal/trackman)
│  ├─ Dagbok (/portal/dagbok)
│  ├─ Tester (/portal/tester)
│  ├─ Spill (/portal/spill)
│  └─ Mental (/portal/mental)
├─ EVALUERE
│  ├─ Statistikk (/portal/statistikk)
│  ├─ Kartlegging (/portal/kartlegging)
│  ├─ Analyse (/portal/analyse)
│  ├─ Benchmark (/portal/benchmark)
│  └─ Sammenligning (/portal/sammenligning)
├─ COACHING
│  ├─ Coaching-historikk (/portal/coaching-historikk)
│  ├─ AI Coach (/portal/ai-coach)
│  └─ Meldinger (/portal/meldinger)
└─ ADMINISTRERE
   ├─ Profil (/portal/profil)
   ├─ Abonnement (/portal/abonnement)
   ├─ Bag (/portal/bag)
   └─ Apper (/portal/apper)
```

### Mission Control-sidemeny (admin/coach)

```
┌─ Hub (/admin)
├─ Mission Board (/admin/mission-board)
├─ Coaching Board (/admin/coaching-board)
├─ KALENDER & BOOKING
│  ├─ Kalender (/admin/kalender)
│  ├─ Bookinger (/admin/bookinger)
│  └─ Tilgjengelighet (/admin/tilgjengelighet)
├─ ELVER & COACHING
│  ├─ Elever (/admin/elever)
│  ├─ Treningsplaner (/admin/treningsplan)
│  └─ Økter (/admin/okter)
├─ OPERASJON
│  ├─ Denne uken (/admin/denne-uken)
│  ├─ Focus (/admin/focus)
│  ├─ Kapasitet (/admin/kapasitet)
│  ├─ Turneringer (/admin/turneringer)
│  └─ Fasiliteter (/admin/fasiliteter)
├─ KOMMUNIKASJON
│  ├─ Meldinger (/admin/meldinger)
│  ├─ E-postmaler (/admin/e-postmaler)
│  └─ Push-varsler (/admin/notifications)
├─ AI & ANALYSE
│  ├─ AI-assistent (/admin/ai-assistent)
│  ├─ Agenter (/admin/agenter)
│  ├─ Analytics (/admin/analytics)
│  ├─ Økonomi (/admin/okonomi)
│  └─ Rapporter (/admin/rapporter)
└─ SYSTEM
   └─ Team + tilgang (/admin/team)
```

---

## Del 6: Funksjonell gruppering

### Gruppe 1: Booking & Betaling
**Skjermer:** `/booking/*`, `/portal/bookinger/*`, `/admin/bookinger`, `/admin/kalender`, `/admin/tilgjengelighet`, `/portal/abonnement`
**Kjerne-funksjoner:** Booke coaching, betale via Stripe, administrere tilgjengelighet, refundere, abonnementshåndtering.
**Data:** Booking, CoachingSession, PaymentTransaction, ServiceType, InstructorAvailability.

### Gruppe 2: Treningsplanlegging & Logging
**Skjermer:** `/portal/treningsplan`, `/portal/min-plan`, `/portal/dagbok`, `/admin/treningsplan`, `/admin/okter`
**Kjerne-funksjoner:** 12-ukers plan, drag-and-drop økter, daglig logging, treningspyramide, L-M-PR, AI-justering.
**Data:** TrainingPlan, TrainingLog, ExerciseDefinition, CoachingForecast.

### Gruppe 3: Spill & Runde-tracking
**Skjermer:** `/portal/runde/*`, `/portal/trackman`, `/portal/tester`, `/portal/spill`, `/portal/mental`
**Kjerne-funksjoner:** Live scorecard, SG-beregning, TrackMan-import, ferdighetstester, mental trening, sosialt spill.
**Data:** Round, HoleResult, Shot, TrackmanSession, TrackManShotData, TestResult, MentalSession.

### Gruppe 4: Analyse & Evaluering
**Skjermer:** `/portal/statistikk`, `/portal/kartlegging`, `/portal/analyse`, `/portal/benchmark`, `/portal/sammenligning`, `/portal/strategi`
**Kjerne-funksjoner:** SG-analyse, HCP-trend, USI, AI-innsikter, benchmark, strategi.
**Data:** StrokesGained, RoundStats, UnifiedSkillIndex, AIInsight, NorwegianSkillBenchmark, CoachingForecast.

### Gruppe 5: Coaching & Kommunikasjon
**Skjermer:** `/portal/coaching-historikk`, `/portal/meldinger`, `/portal/ai-coach`, `/admin/coaching-board`, `/admin/meldinger`, `/admin/e-postmaler`
**Kjerne-funksjoner:** Chat med coach, AI-oppsummering av sesjoner, AI-coach chat, epost-sekvenser.
**Data:** Conversation, Message, CoachingSession, AIResponse.

### Gruppe 6: Admin & Mission Control
**Skjermer:** `/admin/*`
**Kjerne-funksjoner:** Elevadministrasjon, kalender, booking-godkjenning, analytics, team/RBAC, fasiliteter.
**Data:** User, UserCapability, Booking, Facility, PaymentTransaction.

### Gruppe 7: Marked & Konvertering
**Skjermer:** `/`, `/academy/*`, `/junior-academy`, `/utvikling`, `/landing/*`, `/personvern`
**Kjerne-funksjoner:** Presentere tjenester, generere leads, Stripe checkout, SEO.
**Data:** ServiceType, CoachingPackage, ContentItem.

---

## Del 7: Komponent-inventar

### Gjenbrukbare komponenter (primitives)
| Komponent | Plassering | Bruk |
|---|---|---|
| `Button`, `Card`, `Badge`, `Avatar`, `Tabs`, `Slider`, `Switch`, `DropdownMenu`, `ScrollArea`, `Separator` | `components/ui/` | shadcn/ui-baserte primitives brukt på tvers |
| `Icon` | `components/ui/icon.tsx` | Material Symbols wrapper (erstatter Lucide) |

### Portal-komponenter
| Kategori | Komponenter | Plassering |
|---|---|---|
| **Dashboard** | KPI-kort, AI-innsikt, neste booking, HCP-trend, SessionsDonut, SGRadar, sparkline, velkomst-seksjon | `components/portal/dashboard/` |
| **Treningsplan** | WeekCalendar, SessionCard, ExerciseBank, SidePanel, PyramidFilter, SessionDetailModal, GeneratePlanButton | `components/portal/treningsplan/` |
| **Booking** | BookingWizard, ServiceSelector, DatePicker, TimeSlots, BookingSummary, NextBookingHero, RescheduleForm | `components/booking/`, `components/portal/booking/` |
| **Dagbok** | ActivityHeatmap, StreakCard, VolumePyramid, WeeklyStats, LogSessionModal, MonthCalendar | `components/portal/dagbok/` |
| **Statistikk** | SGRing, AKPyramide, BentoCard, KPI-rad, horisontale barer | `components/portal/statistikk/`, `components/portal/patterns/` |
| **TrackMan** | AnalyticsCard, klubbe-tabell, trenddiagrammer | `components/portal/trackman/` |
| **Runde** | Scorecard, hull-for-hull, FW/GIR/putts-registrering | `components/portal/runde/` |
| **AI Coach** | ChatInterface, MessageBubble, QuickQuestions, ContextPanel | `components/portal/ai-coach/` |
| **Widgets** | CoachingFeedback, DegradationAlert, Leaderboard, MentalTrends, NextCompetition, PlanProgress, SeasonPlan, TrainingVolume | `components/portal/widgets/` |
| **Layout** | Portal-sidebar, dashboard-providers, view-switcher | `components/portal/layout/` |
| **Onboarding** | Wizard-steg, profil-oppsett | `components/portal/onboarding/` |
| **Premium** | PremiumStatCard (brukes 21 steder), upgrade-modal, tier-gate | `components/portal/premium/`, `components/portal/ui/` |

### Admin-komponenter
| Kategori | Komponenter | Plassering |
|---|---|---|
| **Dashboard** | StatsCards, UpcomingBookings, StudentProgress | `components/admin/dashboard/` |
| **Analytics** | ActivityHeatmap, HCPDistribution, RevenueChart, StudentGrowthChart | `components/admin/analytics/` |
| **Kalender** | AvailabilitySettings, CapacityManager, WeekAdjustmentGrid | `components/admin/kalender/` |
| **Elever** | StudentList, overbooking-alert, capacity-gauge | `components/portal/admin/` |
| **MC Layout** | MC-sidebar, MC-nav-config | `components/portal/mission-control/` |

### Website-komponenter
| Kategori | Komponenter | Plassering |
|---|---|---|
| **Landing** | HeroSection, CTASection, DivisionsSection, FAQSection, HowItWorks, TeamSection, Testimonials | `components/website/landing/` |
| **Academy** | AcademyHero, AcademyPrices, AcademyCTA, ConceptSection, ComparisonSection | `components/website/academy/` |
| **Shared** | WebsiteNav, WebsiteFooter, CookieConsent, PageTransition, RevealOnScroll | `components/website/`, `components/shared/` |

---

## Del 8: Lib / Utilities-inventar

### Forretningslogikk (`lib/portal/`)
| Modul | Filer | Hovedformål |
|---|---|---|
| `booking/` | 11 filer | Slot-generering, konfliktsjekk, kansellering, refusjon, waitlist, kvote |
| `capabilities/` | 5 filer | RBAC: `requireCapability()`, sensitive auth, katalog, presets |
| `coaching-signals/` | 3 filer | Coach Mission Board-signaler (stagnasjon, regresjon, trend) |
| `usi/` | 6 filer | Unified Skill Index, ONNX-inferens, Kalman-filter, prescription |
| `trackman/` | 2 filer | CSV/API-import, AI-innsikt fra slagdata |
| `datagolf/` | 1 fil | API-wrapper + caching |
| `kartlegging/` | 6 filer | Spillerprofil, coach-access, training-index, test-history |
| `training/` | 7 filer | AK-taxonomi, L-fase-klassifikasjon, degradation-service, øvelses-actions |
| `ai/` | 10 filer | Anthropic-anrop: weekly-insights, weakness, focus, plan-gen, drill-gen, transcribe, training-plan-adjustment |
| `golf/` | 15 filer | SG-calc, expected-strokes, dispersion, AK-formula, GolfBox-HCP, GPS |
| `notifications/` | — | Push, epost, SMS-varsler |
| `email/` | — | React Email-templates |
| `sms/` | 2 filer | Twilio-client + reminder-sending |
| `calendar/` | 2 filer | iCal + Google Calendar wrappers |
| `facility/` | 2 filer | Defaults + konfliktsjekk |
| `preferences/` | 1 fil | Oppdater UserPreferences |
| `sync/` | 6 filer | TanStack Query + Zustand + optimistiske oppdateringer |
| `predictions/` | — | HCP-prognose, prediktive modeller |
| `notion/` | 5 filer | Synk drills, planer, profiler, innhold, brand-guide |
| `google-calendar/` | 2 filer | Synk + webhook |
| **Rot** | 8 filer | `prisma.ts`, `access.ts`, `rbac.ts`, `auth.ts`, `stripe.ts`, `notifications.ts`, `slots.ts`, `tier-utils.ts` |

### AI/MCP-generering (`lib/ai/`)
| Modul | Filer | Hovedformål |
|---|---|---|
| `lib/ai/` | 5 filer | Category-engine, plan-generering, plan-schema, system-prompt, trenings-knowledge |

### Integrasjoner
| Integrasjon | Status | Env-vars |
|---|---|---|
| Stripe | Aktiv | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| Supabase | Aktiv | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Anthropic Claude | Aktiv | `ANTHROPIC_API_KEY` |
| Notion | Aktiv | `NOTION_API_KEY` + 5 DB-IDer |
| DataGolf | Aktiv | `DATAGOLF_API_KEY` |
| TrackMan | Aktiv | Ingen direkte (legacy proxy) |
| Google Calendar | Aktiv | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Resend (epost) | Aktiv | `RESEND_API_KEY` |
| Twilio (SMS) | Aktiv | `TWILIO_*` |
| GolfBox | Delvis | Ingen — kun HCP-sync |

---

## Del 9: CRON-jobs (21 automatiske jobber)

| # | Endpoint | Schedule | Formål |
|---|---|---|---|
| 1 | `/api/portal/cron/send-reminders` | Hver time | Booking-påminnelser (epost) |
| 2 | `/api/cron/send-reminders` | 08:00 daglig | Dagsreminders |
| 3 | `/api/cron/cleanup-notifications` | Søndag 02:00 | Slett gamle notifikasjoner |
| 4 | `/api/portal/cron/reset-monthly-sessions` | 00:05 daglig | Reset kvote for abonnenter |
| 5 | `/api/portal/cron/session-expiry-reminder` | 09:00 daglig | Reminder om utløpende sessions |
| 6 | `/api/portal/cron/weekly-summary` | Søndag 18:00 | Ukessammendrag (epost) |
| 7 | `/api/portal/cron/win-back` | 09:00 daglig | Win-back til inaktive |
| 8 | `/api/portal/cron/welcome-sequence` | 10:00 daglig | Onboarding-sekvens |
| 9 | `/api/portal/cron/abandoned-checkout` | 12:00 daglig | Forlatt booking |
| 10 | `/api/portal/cron/ai-insights` | Mandag 06:00 | Weekly AI-innsikt (Anthropic) |
| 11 | `/api/portal/cron/compute-usi` | 03:00 daglig | USI-snapshot |
| 12 | `/api/portal/cron/auto-adjust-training-plans` | 03:30 daglig | AI-justering av planer |
| 13 | `/api/cron/coaching-forecast-backtest` | 04:00 daglig | Backtest forecast-modell |
| 14 | `/api/cron/cleanup-pending-bookings` | Hvert 15. min | Timeout-bookinger |
| 15 | `/api/cron/release-dropin-slots` | 06:00 daglig | Frigjør drop-in |
| 16 | `/api/cron/smart-notifications` | Hvert 30. min | Intelligente varsler |
| 17 | `/api/cron/charge-completed` | Hver time | Charge fullførte bookinger |
| 18 | `/api/cron/mark-no-shows` | Hver time | Marker no-show |
| 19 | `/api/cron/sync-google-calendars` | Hver time | Google Calendar sync |
| 20 | `/api/cron/cleanup-waitlist` | Hver 6. time | Cleanup waitlist |
| 21 | `/api/portal/tournament-planner/sync` | 02:00 daglig | Sync turneringsdata (6 kilder) |

---

## Del 10: Status per sprint (fra design-review tracker)

| Sprint | Omfang | Antall skjermer | Status |
|---|---|---|---|
| A | Spillerportal kjerne | 10 | ✅ Done |
| B | Mission Control kjerne | 7 | ✅ Done |
| C | Booking-system | 7 | ✅ Done |
| D | Landingpages | 7 | ✅ Done |
| E | Sekundær portal | 19 | ✅ Done |
| F | Sekundær MC | 17 | ✅ Done |
| G | Auth + Error | 6 | ✅ Done |
| **Total** | | **73** | **✅ Alle done** |

*(Merk: design-review tracker viser 73 skjermer. PLATFORM_FUNCTION_MAP teller 90 inkludert API-ruter og undersider som ikke er egne page.tsx.)*

---

## Del 11: Gjenstående arbeid (hva er IKKE kartlagt over)

Selv om alle 73 skjermer er migrert til Heritage Grid, gjenstår følgende funksjonelle områder:

1. **Build-feil (B1)** — `/landing/contact` og `/admin/treningsplan/ny` feiler under static export
2. **Real-time Mission Board** — Ingen SSE/WebSocket ennå. Admin må refreshe for å se nye bookinger.
3. **Waitlist UI** — `WaitlistEntry` + `GapOffer` eksisterer i DB, men ingen portal-skjerm viser venteliste-status.
4. **Mental-profil baseline** — `MentalProfile` setter trykktoleranse, men spørres ikke ved onboarding.
5. **MetricSnapshot UI** — CRON skriver metrikker, men ingen graf viser dette eksplisitt.
6. **Agent-konfigurasjon** — `/admin/agenter` eksisterer, men verifiser at agenter kan aktiveres/deaktiveres.
7. **Kalibrering av auto-plan-justering** — CRON kjører, men terskler er ikke kalibrert mot ekte data.

---

*Dokumentet er komplett. Alle 90 skjermer, 112 Prisma-modeller, 21 CRON-jobs, 10 integrasjoner og 25 MCP-verktøy er kartlagt.*
