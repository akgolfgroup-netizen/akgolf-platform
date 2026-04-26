# Claude Design — Komplette prompts for hele AK Golf Platform

**Mål:** Designe ALLE 134 ruter komplett. Ingen kompromisser, ingen kuttet skjerm.
**Budsjett:** $200–300 (Anders bekreftet 2026-04-27).
**Strategi:** 11 økter, batch-organisert per modul, mobile-responsive HTML.

---

## ØKT 0 — Oppdater designsystemet (kritisk, ~$3-5)

**Kjør denne FØR alt annet.** Ellers bygger du på utdaterte tokens.

```
Jeg har låst designsystemet for AK Golf Platform med 17 nye regler (datert 2026-04-27).
Oppdater AK Golf-designsystemet i dette prosjektet.

1. OPPDATER tokens.css med disse eksakte verdier:

   --ak-primary: #005840
   --ak-primary-hover: #00472f
   --ak-primary-deep: #003B2A
   --ak-primary-soft: #E8F0EC
   --ak-accent: #D1F843
   --ak-accent-soft: rgba(209, 248, 67, 0.18)
   --ak-accent-deep: #A6C734
   --ak-surface: #ECF0EF        (cream-bakgrunn — IKKE #F4F6F4)
   --ak-card: #FFFFFF
   --ak-surface-soft: #EDF1EE
   --ak-sidebar: #243029         (subtil grønntone — IKKE #0F1F18)
   --ak-sidebar-hover: #2F4338
   --ak-sidebar-divider: #1F3329
   --ak-sidebar-muted: #A4B1AA
   --ak-ink: #0A1F18              (kun headlines og store KPI-tall)
   --ak-ink-body: #324D45         (default body-tekst — DEMPET, ikke svart)
   --ak-ink-muted: #5C6B62
   --ak-ink-subtle: #8A958E
   --ak-line: #E4EAE6
   --ak-line-soft: #EDF1EE
   --ak-success: #2A7D5A
   --ak-success-soft: #E0EFE7
   --ak-warning: #C48A32
   --ak-warning-soft: #F6ECD9
   --ak-danger: #B84233
   --ak-danger-soft: #F4DAD5

   --ak-dur-fast: 150ms
   --ak-dur: 250ms
   --ak-dur-slow: 400ms
   --ak-ease: cubic-bezier(0.4, 0, 0.2, 1)
   --ak-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)

   --ak-density: 1
   .d-compact { --ak-density: 0.75; --ak-font-base: 13px; }
   .d-comfortable { --ak-density: 1; --ak-font-base: 14px; }
   .d-spacious { --ak-density: 1.2; --ak-font-base: 15px; }

2. TYPOGRAFI: Kun Inter (vekt 400/500/600/700/800) + JetBrains Mono.
   Slett alle Inter Tight og DM Sans. Body: Inter 14px regular.
   Headlines: Inter 700-800, letter-spacing -0.03em (Bento V1-stil).
   KPI-tall: Inter 600-700, tabular-nums, letter-spacing -0.03em.
   Mono-labels: JetBrains Mono CAPS + 0.14em letter-spacing.

3. IKONER: Kun lucide-react. Slett alle Material Symbols.
   Standardstørrelser: 14/16/18/20/24px.

4. LOGO: Bruk faktisk SVG-logo (ak-golf-logo-primary-on-light.svg).
   ALDRI tekst-wordmark "AK Golf Academy" ved siden av logoen.
   Clear-space minst 0.5× logo-høyde rundt. Min-størrelse: 24px digital, 16px mobil.

5. INTERAKSJON:
   :focus-visible { outline: 2px solid var(--ak-accent); outline-offset: 2px; }
   Avatar-fallback: initialer hvit på var(--ak-primary), samme radius som container.
   Empty state: lucide-ikon (24-32px, --ak-g-300) + tittel + setning + handlingsknapp.

6. PLATTFORM: Dette er PWA. Alle skjermer responsive (1440 / 768 / 375).
   Sidebar → bunn-tab-nav under 768px. Touch-targets minst 44×44px.

7. DARK MODE: Kun kontekstuelt på TrackMan, Mission Control, Night Ops.
   Ingen global toggle.

ETTER OPPDATERING: vis sammendrag av endringer + bekreft alle 41 eksisterende
mockups arvet de nye verdiene automatisk via tokens.css.
```

---

## FELLES KONTEKST (lim inn først i hver økt etter ØKT 0)

```
Vi følger AK Golf Brand Guide V2.0 låst 2026-04-27. Bruk tokens fra oppdatert tokens.css.

KJERNE:
- Primary #005840, Accent #D1F843 (sparsomt CTA), Surface #ECF0EF
- Sidebar #243029 (IKKE #0F1F18)
- Body-tekst #324D45 (dempet), headlines #0A1F18
- Inter 400-800 + JetBrains Mono. Aldri Inter Tight, aldri DM Sans.
- Lucide-icons. Aldri Material Symbols.
- Logo SVG, aldri tekst-wordmark.

ESTETIKK:
- Inter 700-800 + letter-spacing -0.03em for fete headlines (Bento V1-stil)
- Mono-labels CAPS + 0.14em letter-spacing
- Dual-shadow på hvite kort
- Glassmorph over foto-hero
- Lime accent SPARSOMT — kun primær CTA per skjerm
- Dark surface kontekstuelt

PWA / RESPONSIVE:
- Hver skjerm = ÉN responsive HTML-fil (desktop 1440 + tablet 768 + mobil 375)
- Sidebar → bunn-tab-nav under 768px
- Touch-targets 44×44px minimum

LEVER: Standalone HTML jeg kan åpne direkte. Ikke bare JSX.
```

---

## ØKT 1 — Markedsside komplett (~$15-20)

```
[FELLES KONTEKST]

Bygg ALLE markedssider for AK Golf Platform som responsive HTML:

1. Forsiden /
   - Hero med banefoto-bakgrunn + glassmorph-panel
   - Inter 700/800 hero-headline med italic-fragment i lime
   - Tre tjenestekort (Academy / Junior / Booking)
   - Social proof (referanser + tall)
   - Footer med logo, lenker, sosiale ikoner

2. Academy /academy
   - Hva er det, hvem for, hvordan virker det
   - Pakker: Performance 1600/mnd, Performance Pro 2000/mnd, Gruppe 900/mnd
   - Søknadsskjema CTA

3. Academy abonnement /academy/abonnement
   - 3-kolonners pris-sammenligning
   - "Vanligst" badge på Performance Pro
   - Trygghet/avbestilling-tekst

4. Academy booking /academy/booking
   - Direkte tjenestekort + "book nå"-CTA per pakke

5. Junior Academy /junior-academy
   - Foreldre-tone, tryggere visuelt
   - Aldersgrupper: 6-9, 10-13, 14-17
   - Programstruktur per uke
   - Søk-CTA

6. Booking landing /booking
   - Velg trener (Anders / Markus / andre)
   - Tjenestekort med pris
   - "Start booking"-CTA → /booking-v2

7. Utvikling /utvikling
   - Produkt-showcase (ikke salgsside)
   - Bilder/video fra portalen
   - Funksjons-liste med ikoner
   - "Prøv gratis 14 dager"-CTA

8. Pricing /landing/pricing
   - Anders-pakker: Performance, Pro, Gruppe
   - Markus-pakker: Express, Express Pro, First Tee, Flex 20
   - Flex-tjenester (engangsbetaling): 20/50/90, Duo, Banecoaching 9 hull
   - Sammenligningstabell

9. Om oss /landing/about
   - Anders' historie, Markus' bakgrunn
   - Team-kort med foto
   - Lokasjoner

10. Kontakt /landing/contact
    - Skjema (navn, e-post, telefon, melding, samtykke)
    - Kart, åpningstider, telefon, e-post

11. Personvern /personvern
    - Standard GDPR-tekst, godt typografisert

12. Maintenance /maintenance
    - "Vi gjør oppgradering"-melding
    - Tilbake-tid hvis kjent

13. Error 403 /403
    - Vennlig "ingen tilgang"-melding
    - Logg-inn-knapp

14. Error 500 /500
    - "Noe gikk galt"-melding
    - Prøv-igjen + kontakt-link

KRAV:
- Hero-tekst krymper fra 72px (desktop) til 32px (mobil)
- Felles WebsiteNav på alle sider (logo + 5 lenker + login-knapp)
- Felles Footer på alle sider

Lever som ÉN canvas-side + 14 standalone responsive HTML.
```

---

## ØKT 2 — Booking-system komplett (~$15-20)

```
[FELLES KONTEKST]

Bygg KOMPLETT booking-flyt med alle states:

7-stegs hovedflyt:
1. Velg tjeneste — kort med pris/varighet/beskrivelse, "vanligst"-badge
2. Velg trener — kort med foto, spesialitet, tilgjengelighet
3. Velg dato — kalender med ledige dager (mono-tall, lime indicators)
4. Velg tid — pills med klokkeslett, varighet vises
5. Dine detaljer — form (navn, e-post, telefon, kommentar, samtykke)
6. Betal — Stripe-elementer, ordreoppsummering, vilkår
7. Bekreftelse — suksess, kalenderfil, Apple/Google Calendar-knapper

Edge-skjermer:
8. Venteliste — når slot er fullt, foreslå venteliste, vis posisjon
9. Booking status oppslag — finn booking via ID + kvittering
10. Endre booking — flytt tid (innenfor regler)
11. Avbestill booking — bekreftelse + advarsel om regler

For spillerportal:
12. Mine bookinger — neste-hero + kommende + tidligere
13. Mine bookinger venteliste — egen liste over ventelisteposisjoner
14. Booking detalj-side — full info om én booking
15. Avbestillingsregler-kort — selvstendig component

KRAV:
- Progress-bar på toppen viser steg 1-7 med lime fill
- Mobile-first siden booking ofte gjøres på telefon
- Touch-targets store (48×48 på mobil)
- Bruk lucide-icons for steg-indikator

Lever som ÉN canvas-side + 15 standalone responsive HTML.
```

---

## ØKT 3 — CoachHQ Del 1: Operasjonelle flater (~$25-30)

```
[FELLES KONTEKST]

Bygg CoachHQ admin-flate med fokus på DAGLIG bruk. Felles shell:
- Sidebar #243029, 56px ikonrail + 200px nav (8 hovedvalg)
- Topbar: dato/tid + søk + bjelle + profilbilde

SKJERMER:

1. Dagens fokus /admin (Mission Control redesign)
   - 3 signaler-kort (kritiske + advarsler)
   - Dagens møter (timeline)
   - KPI-rad (4 nøkkeltall)
   - "Aktiv nå"-pulse på pågående økt

2. Denne uken /admin/denne-uken
   - Ukens oversikt: økter, signaler, leveranser
   - Ukentlig progress-graf

3. Aktive økter / Coaching Board /admin/coaching-board
   - Pipeline-view (Trello-aktig kanban)
   - Kolonner: Forberedelse / Pågår / Etterarbeid / Ferdig
   - Drag-and-drop kort

4. Mission Board /admin/mission-board
   - Mål per elev/team
   - Progress-bars
   - Tildeling-flow

5. Elever (liste) /admin/elever
   - Søkbar tabell: foto, HCP, status, neste økt, signaler
   - Filtre: aktiv/inaktiv, coach, signal-status
   - Eksport-knapp

6. Elever oversikt /admin/elever/oversikt
   - Grid-view med kort per elev
   - Sortering på framgang/risiko

7. Elevprofil /admin/elever/[id]
   - Foto-hero med navn, HCP, klubb
   - Tabs: Oversikt / Golf / Coaching / Mental / Trening / Økonomi / Signaler
   - Hver tab har sitt innhold (kollapsbart)
   - Sidebar med raske handlinger

8. Elevprofil V2 /admin/elever/[id]/v2
   - Alternativ layout: alt på én lang side, ikke tabs
   - 360°-view, alle data samtidig

9. Bookinger admin /admin/bookinger
   - Alle bookinger på tvers (filter: coach/dato/status)
   - Tabell + kalender-toggle
   - Hurtighandlinger: avbestill, omplasser

10. Ny booking /admin/bookinger/ny
    - Admin oppretter booking på vegne av elev

11. Kalender admin /admin/kalender
    - Uke/måned view
    - Fargede blokker per coach
    - Drag-and-drop omplassering
    - Konflikt-deteksjon

12. Økter /admin/okter
    - Liste over alle økter (gjennomførte + planlagte)
    - Notater per økt
    - Filter på elev/coach/dato

13. Focus /admin/focus
    - Dagens 3 viktigste oppgaver per coach
    - Personlig dashboard

14. Godkjenninger /admin/godkjenninger
    - Workflow: ventende godkjenninger
    - Eksempler: refunderinger, avvik, capability-grants
    - Approve/avvis-knapper med begrunnelse

KRAV:
- Mono-labels (JetBrains Mono CAPS) for KPI-headers
- Inter 700, -0.03em letter-spacing for tall
- Subtle pulse-dot på "Aktiv nå"-status
- Glassmorph på topp-banner i Dagens fokus
- Responsive: sidebar → bunn-tab-nav (5 ikoner) på mobil

Lever som ÉN canvas-side + 14 standalone responsive HTML.
```

---

## ØKT 4 — CoachHQ Del 2: Datatungt + Analyse (~$20-25)

```
[FELLES KONTEKST]

Bygg datatunge CoachHQ-flater. Bruk samme shell som ØKT 3.

SKJERMER:

1. Analytics /admin/analytics
   - Plattform-statistikk
   - Aktive brukere, retention, engagement
   - Linje-/bar-grafer + heatmap
   - Filter på tidsrom

2. Rapporter /admin/rapporter
   - Mal-bibliotek (mnd/kvartal/år)
   - Generer ny rapport-flow
   - Eksport PDF/Excel

3. Økonomi /admin/okonomi
   - MRR-dashboard (linjegraf)
   - Faktura-status (sirkel-diagram: betalt/forfalt)
   - Refunderinger
   - Per-elev-margin-tabell
   - Stripe webhook-helse

4. Tilgjengelighet /admin/tilgjengelighet
   - Coach-tilgjengelighet per uke
   - Drag for å lage/slette slots
   - Repeat-pattern (ukentlig/månedlig)

5. Kapasitet /admin/kapasitet
   - Total kapasitet vs. utnyttelse
   - Per-coach utnyttelse
   - Ledig kapasitet kommende 4 uker

6. Grupper /admin/grupper
   - Grupper/klasser oversikt
   - Antall medlemmer, neste samling
   - CRUD

7. Turneringer admin /admin/turneringer
   - Liste over kommende/pågående/ferdig
   - Påmeldte spillere, resultater
   - Lag-ny-turnering-flow

8. Fasiliteter /admin/fasiliteter
   - GFGK-fasilitets-bookingkart (basert på FacilityMap.tsx fra PR #7)
   - Kart-view + kalender-view + liste-view
   - Soner: Driving Range, Performance Studio, Putting Green, Short Game

9. Ny aktivitet /admin/fasiliteter/ny-aktivitet
   - AddActivityModal-flyt som standalone side
   - Velg fasilitet, person, type, dato, tid, varighet

10. Fasilitet-innstillinger /admin/fasiliteter/innstillinger
    - Soner, kapasitet, åpningstider, vedlikeholdstider

11. Treningsplan-styring /admin/treningsplan
    - Liste over alle treningsplaner per elev/gruppe
    - Status: utkast, aktiv, fullført

12. Ny treningsplan /admin/treningsplan/ny
    - Wizard for å bygge plan: mål, periode, fokusområder

13. Treningsplan-maler /admin/treningsplan/maler
    - Mal-bibliotek (begynner, intermediær, elite)
    - Dupliser/tilpass-flow

KRAV:
- Tunge tabeller har sticky header + filter + sortering
- Bruk dark surface på Stripe webhook-helse-kort
- KPI-tall er Inter 600-700 + tabular-nums
- Responsive: tabeller stacker som kort på mobil

Lever som canvas + 13 standalone responsive HTML.
```

---

## ØKT 5 — CoachHQ Del 3: Konfigurasjon + AI + Kommunikasjon (~$15-20)

```
[FELLES KONTEKST]

Bygg admin-flatene for konfigurasjon, AI-styring og kommunikasjon.

SKJERMER:

1. AI-agenter /admin/agenter
   - Liste over agenter (hva gjør hver, status)
   - Kjør-på-demand-knapper
   - Log-historikk per agent

2. AI-assistent config /admin/ai-assistent
   - Prompt-templates
   - Datakilder per AI-funksjon
   - Tone-of-voice innstillinger

3. E-postmaler /admin/e-postmaler
   - Liste + editor (split-view)
   - Variabler ({{name}}, {{date}}) med preview
   - Test-send-knapp

4. Meldinger broadcast /admin/meldinger
   - Send melding til segment (alle / aktive / inaktive / per gruppe)
   - Mal-velger
   - Send-tidspunkt (nå / planlegg)

5. Notifikasjoner config /admin/notifications
   - Push-config: hvilke trigger-typer er aktive
   - Default tider for daglige meldinger

6. Team /admin/team
   - Staff-liste: foto, rolle, kapabiliteter
   - Inviter-flow

7. Team audit /admin/team/audit
   - Audit-log: hvem gjorde hva, når
   - Filter på user/action/date

KRAV:
- Split-view-mønster (liste venstre, editor høyre) for templates
- Audit-log er mono-font for IDer/timestamps

Lever som canvas + 7 standalone responsive HTML.
```

---

## ØKT 6 — PlayerHQ Del 1: Dashboard + profil + plan (~$20-25)

```
[FELLES KONTEKST]

Bygg PlayerHQ-kjernen. Felles spiller-shell:
- Sidebar (LYS, surface #ECF0EF) — IKKE mørk som CoachHQ
- Topbar: hilsen "Hei, [Fornavn]" + dato + bjelle + avatar
- Mobile: bunn-tab-nav med 5 ikoner

SKJERMER:

1. Dashboard hjem /portal
   - Bruk dashboard-v6-hero.html som BASIS, men oppdater til nye tokens
   - Course Hero med foto-bakgrunn + glassmorph bento
   - Greeting + avatar
   - KPI-rad (HCP, SG, streak, plan-fullføring)
   - Neste økt-kort
   - Strokes Gained-bars
   - 12-mnd HCP-graf

2. Min profil /portal/profil
   - Foto-hero med navn, HCP, klubb, alder
   - Stats over tid (HCP-utvikling, total runder)
   - Prestasjoner (badges)
   - Innstillinger-link

3. Min profil innstillinger /portal/profil/innstillinger
   - Personlig info (navn, e-post, telefon)
   - Passord
   - Notifikasjoner
   - Personvern

4. PlayerHQ /portal/playerhq
   - Komplett spillerprofil 360°
   - Bruk student-360-reference.html som inspirasjon
   - 9 seksjoner: Hero, Identity, Golf, Coaching, Training, Mental+Forecast, Tests, Economy, Signals

5. Min plan /portal/min-plan
   - Dagens fokus (1 ting)
   - Ukens fokus (3 ting)
   - Ukentlig SG-trend
   - Neste milepæl
   - AK-pyramide som horisontal bar

6. Treningsplan oversikt /portal/treningsplan
   - Aktiv plan (uker, fokus, progress)
   - Tidligere planer

7. Treningsplan detalj /portal/treningsplan/[id]
   - Uke-for-uke
   - Øvelser per dag
   - Logg gjennomføring

8. Treningsplanlegger /portal/kalender
   - Kalender m/dra-og-slipp
   - Øvelsesbank-sidemeny
   - AK-pyramide-sidemeny (5-lags klikkbar)
   - Ukens fokus-card
   - AI-foreslått-økt-knapp

9. Onboarding /portal/onboarding
   - 5-stegs flyt: skill, mål, utstyr, tid, integrasjoner
   - Lime fremdriftsring
   - AI-snakker-coach

10. Kartlegging /portal/kartlegging
    - Initial assessment (etter onboarding)
    - 50-100-150 test, 9-hull, 3-putt

KRAV:
- Bruk Inter 700-800, -0.03em letter-spacing for KPI-tall
- Lime accent på achievements, streak, ny PR
- AI-attribution-chip på AI-insights (datakilder)
- Empty states for nye spillere
- Responsive: stack alle kort vertikalt under 768px

Lever som canvas + 10 standalone responsive HTML.
```

---

## ØKT 7 — PlayerHQ Del 2: Trening + Analyse + AI (~$20-25)

```
[FELLES KONTEKST]

Bygg avanserte spiller-flater for trening, analyse og AI.

SKJERMER:

1. AI Coach /portal/ai-coach
   - Velkomstskjerm: hurtigspørsmål + "Start chat"

2. AI Coach chat /portal/ai-coach/chat
   - Chat-UI med venstre data-kontekst-panel
   - Bobler viser hvilke datapunkter AI bruker per svar
   - AI-attribution-chip på hver melding

3. Treningsanalyse /portal/analyse
   - Strokes Gained-radar (4 områder)
   - Klubbe-statistikk-tabell
   - Trender over tid (linjegrafer)
   - AI-narrative på topp

4. Statistikk /portal/statistikk
   - SG-fordeling per kategori
   - HCP-utvikling
   - Score-distribution
   - Rounds-table

5. Statistikk ny runde /portal/statistikk/ny-runde
   - Logge ny runde manuelt eller fra TrackMan
   - Pre-shot intent vs. resultat

6. Benchmark /portal/benchmark
   - Du vs peer (samme HCP)
   - Du vs PGA Tour benchmark
   - Du vs ditt beste

7. Sammenligning /portal/sammenligning
   - Velg én eller flere spillere å sammenligne med
   - Side-by-side stats

8. Mental ny /portal/mental/ny
   - Logg pre-runde mental-status
   - Skala-vurderinger (energi, fokus, ro, selvtillit)

9. Mental detalj /portal/mental/[roundId]
   - Vis mental-data for én runde
   - Pre vs. post

10. Mental oversikt /portal/mental
    - Trender over tid
    - Korrelasjon mental ↔ score

11. Dagbok /portal/dagbok
    - GitHub-style heatmap (90 dager)
    - Streak-card
    - AK-pyramide-fordeling av volum

12. Dagbok detalj /portal/dagbok/[id]
    - Én treningsøkt: notater, øvelser, vurdering

13. TrackMan /portal/trackman
    - Klubbe-radar
    - Dispersion-plot (LEVENDE versjon — animert, realistisk green)
    - Carry-waveform
    - Last session summary
    - Dark surface

14. Strategi /portal/strategi
    - Strategibuilder per bane
    - Pre-shot decade-protokoll

15. Tester oversikt /portal/trening/tester
    - Tilgjengelige tester: 50-100-150, 9-hull, 3-putt
    - Historikk

16. Test detalj /portal/trening/tester/[id]
    - Én test: instruksjoner, log, resultat

17. Tester (kapasitet) /portal/tester
    - Fysiske tester (FYS-pyramidenivå)
    - Loggføring

18. Øvelser /portal/trening/ovelser
    - Øvelsesbank med filter
    - Per AK-pyramide-nivå
    - Video/instruksjon per øvelse

19. Bag /portal/bag
    - Mine køller med stats per kølle
    - Klubbe-distanse-dispersion

KRAV:
- TrackMan og Statistikk har dark-surface-varianter
- Shot dispersion er ANIMERT (subtle pulse-in på punkter, ikke statisk)
- Realistisk green-foto som bakgrunn for shot-tracking
- AI-narrative-kort med attribution-chip
- Dataviz: bruk --ak-data-* tokens (sage/coral/blue/lime/amber/violet)

Lever som canvas + 19 standalone responsive HTML.
```

---

## ØKT 8 — PlayerHQ Del 3: Runde + Sosialt + Konkurranse (~$15-20)

```
[FELLES KONTEKST]

Bygg runde-tracking + sosialt + konkurranse-flater.

SKJERMER:

1. Ny runde /portal/runde/ny
   - Velg bane, dato, vær, mål
   - Pre-runde mental-check

2. Runde aktiv /portal/runde/[id]
   - Scorecard
   - Hull-navigator (1-18)
   - Pre-shot decade-panel per hull

3. Runde oppsummering /portal/runde/[id]/oppsummering
   - Total score + SG-estimat
   - Hull-for-hull breakdown
   - AI-narrative
   - Best/worst-shots

4. Runde hero /portal/runde/[id]/hero
   - Visuell oppsummering: foto + tall
   - Delbar (sosial)

5. Coaching-historikk /portal/coaching-historikk
   - Tidsstrøm av coaching-økter
   - Notater per økt
   - Tilbakemeldinger

6. Sosialt feed /portal/sosialt
   - Aktivitetsstrøm (mine venners runder/PRs)
   - Reaksjoner + kommentarer
   - "Del runde"-knapp

7. Venner /portal/sosialt/venner
   - Min venneliste
   - Søk etter venn
   - Venneforespørsler ventende
   - AddFriendDialog som egen side

8. Meldinger /portal/meldinger
   - Innboks: tråder med coach + venner
   - Søk
   - Notifikasjons-prefs

9. Meldinger demo /portal/meldinger/demo
   - Demo-trådvisning for nye brukere

10. Turneringer /portal/turneringer
    - Kommende turneringer (kort med banefoto)
    - Påmelding-status
    - Resultater fra deltatt

11. Turneringsplan /portal/turneringsplan
    - Mine turneringer kommende sesong
    - Mål per turnering
    - Forberedelse-checklist

12. Spill /portal/spill
    - Spillmodus-velger
    - Konkurranse vs venner

13. Spill type /portal/spill/[gameType]
    - Aktiv spillmodus
    - Live leaderboard

14. Apper /portal/apper
    - 3rd party-integrasjoner (TrackMan, Garmin, Apple Health)
    - Connect/disconnect-knapper

15. Abonnement /portal/abonnement
    - Min plan-status
    - Faktureringshistorikk
    - Oppgradering-CTAer
    - UpgradeOptions-component som side

KRAV:
- Sosialt feed har "delt runde"-kort med banefoto
- Turneringer har banefoto-hero per turnering
- Meldinger: chat-bobler m/avatarfallback
- Live-leaderboard har real-time-pulsing indikator

Lever som canvas + 15 standalone responsive HTML.
```

---

## ØKT 9 — Auth + Error + System (~$8-12)

```
[FELLES KONTEKST]

Bygg autentiserings-flyt og system-skjermer.

SKJERMER:

1. Portal login /portal/login
   - Logo + magic link / passord
   - "Glemt passord"-link

2. Admin login /admin/login
   - Samme stil som spiller-login men med "AK Golf CoachHQ"-merket

3. Auth login /auth/login (academy auth-system)
   - Generisk login for academy-flate

4. Auth register /auth/register
   - Konto-oppretting: e-post, passord, navn
   - Bekreft-side

5. Forgot password /auth/forgot-password
   - E-post-input + send-knapp
   - Bekreft-melding

6. Set password /auth/set-password
   - Token fra e-post, sett nytt passord
   - Suksess-state

7. Auth callback /auth/callback
   - Loading-state (mens vi behandler)
   - Sukess-redirect-melding
   - Feil-state hvis token ugyldig

8. Design review /design-review
   - Internal-dev-side, minimal styling

KRAV:
- Logo prominent (større enn vanlig nav)
- Cream surface-bakgrunn
- Fokus på enkelhet og trygghet
- Touch-targets store (mobile-first siden mange logger inn på mobil)

Lever som canvas + 8 standalone responsive HTML.
```

---

## ØKT 10 — PWA + responsive-finish (~$10-15)

```
[FELLES KONTEKST]

Bygg PWA-spesifikke skjermer + responsive-pass på topp 10.

PWA-SKJERMER:
1. "Installer som app"-banner — subtil topp-banner ved 2. besøk på mobil
2. Splash screen — fullskjerm grønn (#005840) m/lime-logo, fade-out
3. Offline-fallback — vennlig "du er offline"-melding + tilgjengelige sider
4. App-ikon — kvadratisk, 512×512px, maskable safe zone
5. Push-permission-prompt — be om push-tillatelse første gang
6. Update-available-banner — "ny versjon tilgjengelig — last på nytt"

RESPONSIVE-PASS:
Sjekk og finjuster mobile-layout (375px) på topp 10:
- Forsiden /
- Spillerportal Dashboard /portal
- CoachHQ Dagens fokus /admin
- Booking steg 1-7
- Mine bookinger /portal/bookinger
- Min profil /portal/profil
- AI Coach chat /portal/ai-coach/chat
- Runde aktiv /portal/runde/[id]
- Treningsplanlegger /portal/kalender
- Login /portal/login

Krav per skjerm:
- 375px iPhone SE-test
- 414px iPhone Pro-test
- 768px iPad-test
- Touch-targets 44×44px minimum
- Sidebar → bunn-tab-nav under 768px
- Hero-tekst krymper passende
- Tabeller stacker som kort

Lever 6 PWA-skjermer + 10 oppdaterte responsive-HTML.
```

---

## Workflow per økt

1. **Åpne Claude Design** → AK Golf-prosjektet
2. **Lim inn FELLES KONTEKST** først (etter ØKT 0)
3. **Lim inn aktuell ØKT-prompt**
4. **Vent på leveranse** — Claude Design lager filer
5. **Eksporter som handoff-bundle**
6. **Send URL til Claude Code** ("Fetch this design file...")
7. **Jeg legger inn under public/design-reference/** og oppdaterer index
8. **Gjenta** for neste økt

---

## Total estimering

| Økt | Innhold | Estimat |
|---|---|---|
| 0 | Designsystem-oppdatering | $3-5 |
| 1 | Markedsside (14 sider) | $15-20 |
| 2 | Booking-system (15 skjermer) | $15-20 |
| 3 | CoachHQ Del 1: Operasjonelt (14) | $25-30 |
| 4 | CoachHQ Del 2: Datatungt (13) | $20-25 |
| 5 | CoachHQ Del 3: Konfig + AI (7) | $15-20 |
| 6 | PlayerHQ Del 1: Dashboard + plan (10) | $20-25 |
| 7 | PlayerHQ Del 2: Trening + analyse (19) | $20-25 |
| 8 | PlayerHQ Del 3: Runde + sosialt (15) | $15-20 |
| 9 | Auth + Error + System (8) | $8-12 |
| 10 | PWA + responsive-finish (16) | $10-15 |
| **Total** | **~131 skjermer** | **$166-217** |

Med iterasjoner og forbedringer: realistisk **$200-280**. Du har rom innenfor $300.
