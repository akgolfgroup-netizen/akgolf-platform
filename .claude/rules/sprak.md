# Språk og terminologi — AK Golf HQ

> **ENESTE SANNHETSKILDE** for hvordan vi skriver i UI, e-poster, varsler og dokumentasjon.
> Når du skriver brukervendt tekst — sjekk denne filen først.

**Prinsipp:** Anders er CEO, ikke programmerer eller statistiker. UI-tekst skal være **klar nok til at en aktiv golfer** (uten teknisk bakgrunn) skjønner det med én gang. Fagsjargong fra programmering, statistikk, regnskap eller engelsk skal oversettes til enkelt norsk bokmål — bortsett fra etablerte golf-faguttrykk som golfere allerede kjenner.

---

## ⚠ TERMINOLOGI-LÅS (2026-04-27)

**Spiller, aldri elev.**

Brukervendt tekst i AK Golf HQ skal alltid bruke **spiller** — aldri "elev" eller "student". Dette gjelder UI, e-poster, varsler, dokumenter, mockups og markedsmateriell.

| Forbudt | Bruk i stedet |
|---|---|
| Elev | Spiller |
| Elever | Spillere |
| Min elevliste | Spillere (sidebar) / Mine spillere |
| Elevprofil | Spillerprofil |
| Elev-data | Spiller-data |
| Student | Spiller |

Begrunnelse: AK Golf har spillere som vi coacher — ikke elever. Spiller er det riktige ordet for relasjon mellom coach og utøver i golf.

**Unntak:** Tekniske felt i kode (DB-relasjoner, variabler) kan beholde "user" eller liknende. Det er kun **brukervendt tekst** som er låst.

---

## 1. UNNTAKENE — disse beholdes på engelsk / som fagord

Disse er etablerte i golfverdenen eller AK Golfs interne språk og **skal ikke oversettes**:

| Term | Begrunnelse |
|---|---|
| **Strokes Gained** (kan forkortes **SG**) | Etablert globalt golf-fagord — alle ambisiøse golfere kjenner det |
| **HCP** (Handicap) | Standard internasjonalt |
| **TrackMan** | Produktnavn |
| **DataGolf** | Produktnavn |
| **PGA Tour** | Egennavn |
| **DECADE** | Etablert protokoll-navn |
| **Driver / Wedge / Iron / Putt** | Standardiserte køllenavn |
| **Tee / Approach / Around the green / Putting** (4 SG-områder) | Fagstandard |
| **Birdie / Bogey / Eagle / Par** | Fagstandard |
| **Fairway / Green / Bunker / Rough** | Fagstandard |

**Forkortelser i SG-fordeling som beholdes:** DR, APP, ARG, PT (Driver, Approach, Around the green, Putting). Skal alltid stå med tooltip eller fullt navn første gang per side.

---

## 2. SJARGONG som SKAL oversettes til enkelt norsk

### Statistikk og data

| Sjargong / engelsk | Bruk dette i UI | Hvor |
|---|---|---|
| `USI` (Unified Skill Index) | **Ferdighetsnivå** (skala A–K, der A er høyest) | Spillerprofil, dashboard |
| `CI95` / Confidence Interval | **Sikkerhet 95 %** eller bare fjern tallet og skriv "anslag" | Forecast |
| `Talent score 87` | **Utviklingspotensial: 87 av 100** | Forecast |
| `Forecast` | **Prognose** eller **Anslag** | Mental + Forecast-kort |
| `Benchmark` | **Sammenligning** | DataGolf-kort |
| `Snapshot` | **Øyeblikksbilde** eller bare **Status** | MetricSnapshot |

### Trening og drills

| Sjargong | Bruk dette | Hvor |
|---|---|---|
| `Drill` | **Øvelse** | Treningskort |
| `L1 / L2 / L3 / L4 / L5` | **Steg 1–5** (eller **Vanskelighetsgrad 1–5**) | Aktive øvelser |
| `Streak 12 dager` | **12 dager på rad** eller **12-dagers serie** | KPI-kort |

### Økonomi

| Sjargong | Bruk dette | Hvor |
|---|---|---|
| `MRR` (Monthly Recurring Revenue) | **Fast inntekt per måned** | Økonomi-KPI |
| `LTV` (Lifetime Value) | **Forventet inntekt over tid** | Per-elev-økonomi |
| `Churn-risiko` | **Risiko for å slutte** | Per-elev-økonomi |
| `Margin` | **Fortjeneste** eller **Margin** (greit nok) | Per-elev-økonomi |
| `NPS` (Net Promoter Score) | **Anbefaling-score (av 100)** eller **Kundetilfredshet** | KPI |
| `Dunning` | **Påminnelse om betaling** | Agenter |
| `Refund` | **Tilbakebetaling** | Stripe-flyt |

### Coaching-signaler og status

| Sjargong | Bruk dette | Hvor |
|---|---|---|
| `Recent improvement` | **Eleven er i framgang** | Mission Board, Signaler |
| `Degradation flagged` / `DegradationTracking` | **Eleven taper terreng** eller **Tilbakegang oppdaget** | Mission Board, Signaler |
| `Stagnation flagged` | **Eleven står stille** | Mission Board |
| `No-show` | **Møtte ikke opp** | Booking-status |
| `Pending` | **Venter** | Booking-status |
| `Confirmed` | **Bekreftet** | Booking-status |

### AI

| Sjargong | Bruk dette | Hvor |
|---|---|---|
| `AI Coach` | **AI-Trener** eller **AI-Coach** (begge OK) | Insights, panel |
| `AI insights` | **AI-innsikt** | Diverse |
| `Generate / Generere` | **Lag** eller **Generer** | Knapper ("Lag drill" / "Generer plan") |
| `Prompt` | **Forespørsel** (intern), **Spør AI** (knapp) | Chat |

### UI-elementer og navigasjon

| Sjargong | Bruk dette | Hvor |
|---|---|---|
| `Workspace` | **AK Golf** (bare brand-navnet) eller **Arbeidsplass** | Sidebar header |
| `Live` / `Live nå` | **Aktiv nå** | Status-pill |
| `Pulse` / `pulserende dot` | (visuell, ingen tekst) | — |
| `Pipeline` | **Aktive økter** eller **Flyt** | Coaching Board |
| `Topbar` | **Toppmeny** (hvis trengs i tekst) | — |
| `Sidebar` | **Sidemeny** (hvis trengs i tekst) | — |
| `Toggle` | **Vis / Skjul** eller **Slå på / av** | Knapper |
| `Filter` | **Filter** (greit nok) eller **Sortér** | — |
| `Search` | **Søk** | Inputs |

### Spillerprofil-seksjoner (Sprint 1 mockup)

| Engelsk i mockup | Bruk dette | Hvor |
|---|---|---|
| `Hero` | (visuell, ingen tekst) | — |
| `Identity` | **Kontaktinfo** | Profil |
| `Golf` | **Golf-statistikk** | Profil |
| `Coaching` | **Coaching-historikk** | Profil |
| `Training` | **Trening** | Profil |
| `Mental + Forecast` | **Mental og prognose** | Profil |
| `Tests` | **Tester** | Profil |
| `Economy` | **Økonomi** | Profil |
| `Signals` | **Signaler** eller **Varsler** | Profil |

### Sidebar-navigasjon (CoachHQ)

Bestemt 2026-04-26:

| Engelsk i dag | Bruk dette | Hvor |
|---|---|---|
| `Mission Board` | **Dagens fokus** | Sidebar nav (item 1) |
| `Coaching Board` | **Aktive økter** | Sidebar nav (item 3) |
| `Elever` | (allerede norsk) | OK |
| `Bookinger` | (allerede norsk) | OK |
| `Analyse` | (allerede norsk) | OK |
| `Økonomi` | (allerede norsk) | OK |
| `Fasiliteter` | (allerede norsk) | OK |
| `Innstillinger` | (allerede norsk) | OK |

---

## 3. SKRIVE-PRINSIPPER

### Tone
- **Direkte.** Ikke "Det kan være fornuftig å vurdere..." → "Test 5° venstre i grip-rotasjon."
- **Konkret.** Ikke "noen økter" → "2 økter".
- **Personlig.** "Du", ikke "brukeren".
- **Aldri amerikansk overdrivelse** ("Awesome!", "Crushing it!"). Norsk bokmål er rolig og presis.

### Tall
- **Kroner uten "kr" når plass er knapp:** "184 500" (med valutasymbol kun i topplinjer eller tooltips).
- **Mellomrom mellom tusen:** "184 500", ikke "184500" eller "184,500".
- **Komma som desimalskille:** "12,4", ikke "12.4". (Unntak: HCP og SG i internasjonal kontekst — der brukes punktum.)
- **Prosent uten mellomrom:** "82%", ikke "82 %".

### Tid
- **Norsk dato-format:** "25. apr 2026" eller "25.04.26", ikke "Apr 25, 2026".
- **Klokkeslett:** "16:00", ikke "4:00 PM".
- **Ukedager forkortet:** Man / Tir / Ons / Tor / Fre / Lør / Søn.

### Knapper
- **Verb først:** "Start dagens økt", ikke "Dagens økt — start".
- **Konkret resultat:** "Lag øvelse", ikke "Generer".
- **Maks 3 ord** der det går.

### Empty states
- **Ikke "Ingen data"** — skriv hva brukeren kan gjøre: "Ingen øvelser planlagt — start med en mal eller bygg fra bunnen av."

---

## 4. FORBUDTE ORD I UI

Disse skal ALDRI dukke opp i tekst som vises til brukeren:

- **Mission Control** (deprecated — bruk CoachHQ / CoachingHQ etter rebrand)
- **Heritage** (intern designterm, ikke brukerord)
- **Cron** / **CRON** (sett "automatisk hvert 15. min" i stedet)
- **Webhook** (sett "automatisk varsel" eller bare beskriv funksjonen)
- **Database** / **DB** (sett "lagret" eller fjern helt)
- **Endpoint** / **API** (intern term — bruk "tjeneste" hvis nødvendig)
- **Bug / debug** (sett "feil" eller "rette opp")
- **Feature** (sett "funksjon")
- **Render** (sett "vis" eller fjern)
- **Component** (sett "kort", "blokk" eller fjern)

---

## 5. NÅR DU SKRIVER NYE TEKSTER

1. Sjekk om termen finnes i tabellen over.
2. Hvis ja: bruk den foreslåtte versjonen.
3. Hvis nei og det er en ny term: legg den til i denne filen + foreslå versjon til Anders.
4. Tester du teksten på en aktiv golfer som ikke jobber med data eller programmering — forstår de det?

---

## 6. BESLUTTET (2026-04-26)

| # | Spørsmål | Beslutning |
|---|---|---|
| 1 | Navn på admin-flaten | **CoachHQ** (ikke CoachingHQ) |
| 2 | Sidebar nav | **Dagens fokus** (var Mission Board) |
| 3 | Sidebar nav | **Aktive økter** (var Coaching Board) |
| 4 | Drill-vanskelighetsgrad | **Steg 1–5** |
| 5 | AI-rådgiver navn | **AI Coach** |

---

## 7. AUTHORITATIVE FILES

- Denne filen — eneste sannhetskilde
- `lib/website-constants.ts` — markedssidens UI-tekster (skal følge denne ordboken)
- `lib/portal/email/templates/` — e-post-tekster (skal følge denne ordboken)
- `lib/portal/notifications/triggers.ts` — varseltekster (skal følge denne ordboken)
