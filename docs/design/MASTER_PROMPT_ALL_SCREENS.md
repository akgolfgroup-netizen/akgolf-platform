# Claude Design — Master-prompt for ALLE skjermer

**Strategi:** Én stor selvstendig prompt du limer inn i Claude Design. Den jobber gjennom alle skjermer i timene fremover uten å spørre deg underveis.

**Prosjekt i Claude Design:** Bruk samme prosjekt som AK Golf Group Design System (eller opprett et nytt prosjekt og importér tokens.css fra det første).

---

## LIM INN HELE PROMPTEN UNDER

```
Bygg ALLE skjermer for AK Golf Platform basert på AK Golf Group Design System
(versjon 2.0, låst 2026-04-27). Du jobber selvstendig — ikke spør underveis,
bruk standardvalg fra brand guide ved tvil. Ferdigstill alle skjermer som
standalone responsive HTML.

═══════════════════════════════════════════════
DESIGN-SYSTEM (alle skjermer skal følge dette)
═══════════════════════════════════════════════

FARGER:
- Primary: #005840 (skogsgrønn)
- Accent: #D1F843 (lime — maks 10% av view, kun CTA/aktiv/highlight)
- Surface: #ECF0EF (cream-bakgrunn light mode)
- Card light: #FFFFFF
- Dark BG: #0A1F18 (PRIMÆR — alle skjermer dark-first)
- Card dark: #0D2E23
- Card dark hover: #133A2D
- Text body: #324D45 (light) / #B8D4CC (dark)
- Text headlines/KPI: #0A1F18 (light) / #FFFFFF (dark)
- Muted: #A5B2AD
- Success: #2A7D5A · Warning: #C48A32 · Danger: #B84233
- Border: 1px #1a4a3a (dark) / #e0e8e5 (light)

DISTRIBUSJON: 60% primary+surface · 30% text+muted · 10% accent (maks)

TYPOGRAFI:
- Inter 300-800 (kun denne fonten)
- JetBrains Mono for tall, KPI, mono-labels
- Headlines: Inter 700-800 + letter-spacing -0.03em
- KPI: Inter 600-700 + tabular-nums + letter-spacing -0.03em
- Mono-labels: JetBrains Mono CAPS + 0.14em letter-spacing
- ALDRI Inter Tight, ALDRI DM Sans

LAYOUT:
- 8pt grid strikt
- Sidebar: 48px ikon-rail (på CoachHQ + Spillerportal)
- Top nav: 58px
- Max content: 1400px desktop
- Cards: 16px radius + 1px border + soft shadow
- Glow én per view max: border 1.5px rgba(209,248,67,0.25) + box-shadow 0 0 24px rgba(209,248,67,0.10)

IKONER:
- Lucide via CDN: https://unpkg.com/lucide@latest
- 2px stroke, round line-cap, round joins
- 14/16/18/20/24px standardstørrelser
- ALDRI emoji. ALDRI Material Symbols.

AFFORDANCE-GLYPHS (godkjente Unicode-symboler):
▾ → ↗ ⋯ ✕ ● • (kun disse, kun som affordances, ikke dekorative)

PWA + RESPONSIVE:
- Hver skjerm = ÉN responsive HTML-fil
- Desktop 1440px, tablet 768px, mobil 375px (iPhone 15 Pro 390px)
- Sidebar → bunn-tab-nav under 768px
- Touch-targets 44×44px minimum

NORSK BOKMÅL:
- All tekst på bokmål
- Du-form, rolig skandinavisk tone
- Golf-flytenhet antas (HCP, GIR, spredning, opp-ned)
- Ingen utropstegn i UI, ingen "amazing"/"crush it"
- Tall: komma-desimal (8,5), mellomrom-tusen (1 376), space før enhet (270 slag)
- Datoer: "Onsdag, 9. april" / klokke "16:00"

LOGO:
- Bruk SVG fra assets/logos/ak-golf-logo-primary-on-dark.svg
- ALDRI tekst-wordmark "AK Golf Academy" ved siden av
- Clear-space 0.5× logo-høyde

DATA-VIZ:
- Paret bar charts: muted lime + solid lime, 10px bred, 3px topp-radius
- Signal bars (TrackMan-stil): 3px bred, 1.5px radius
- Sirkulære progress-ringer: 5-6px stroke, runde caps
- HCP gradient bar: green → yellow → red med hvit dot
- Heatmaps: GitHub-stil, 4-stops alfa-skala av accent

═══════════════════════════════════════════════
LEVERANSEPLAN — 9 MODULER
═══════════════════════════════════════════════

For hver modul:
- Lever ÉN canvas-side som linker alle skjermene
- Lever hver skjerm som SEPARAT standalone HTML
- Alle responsive (desktop + mobil i samme fil med media-queries)
- Norsk bokmål, dark-first

═══════════════════════════════════════════════
MODUL 1 — MARKEDSSIDE (15 skjermer)
═══════════════════════════════════════════════

Light-mode er OK her (markedsside er åpen for alle, ikke "app").

01. Forsiden (/) — hero med banefoto + glassmorph-panel, Inter 700/800 hero-headline
    italic-fragment i lime, tre tjenestekort (Academy / Junior / Booking),
    social proof, CTA "Bli medlem"
02. Academy (/academy) — hva, hvem, hvordan, pakker (Performance 1600/mnd,
    Performance Pro 2000/mnd, Gruppe 900/mnd), søknad-CTA
03. Academy abonnement (/academy/abonnement) — 3-kolonners pris,
    "Vanligst" badge på Pro
04. Academy booking (/academy/booking) — direkte tjenestekort + book-CTA
05. Junior Academy (/junior-academy) — foreldre-tone, aldersgrupper
    (6-9, 10-13, 14-17), programstruktur, søk-CTA
06. Booking landing (/booking) — velg trener (Anders/Markus), tjenestekort
07. Utvikling (/utvikling) — produkt-showcase, bilder fra portalen,
    funksjons-liste, "Prøv gratis"-CTA
08. Pricing (/landing/pricing) — Anders-pakker, Markus-pakker,
    Flex-tjenester (20/50/90, Duo, Banecoaching 9 hull),
    sammenligningstabell
09. Om oss (/landing/about) — Anders' historie, Markus' bakgrunn, team-kort
10. Kontakt (/landing/contact) — skjema (navn, e-post, telefon, melding,
    samtykke), kart, åpningstider
11. Personvern (/personvern) — GDPR-tekst, godt typografisert
12. Maintenance (/maintenance) — "vi gjør oppgradering"
13. Error 403 (/403) — "ingen tilgang", logg-inn-knapp
14. Error 500 (/500) — "noe gikk galt", prøv-igjen + kontakt
15. Felles WebsiteNav (logo + 5 lenker + login) + Footer (logo, lenker,
    sosiale lucide-ikoner)

═══════════════════════════════════════════════
MODUL 2 — BOOKING-SYSTEM (15 skjermer)
═══════════════════════════════════════════════

Light-mode primært (kunde-flate, ikke app).

7-stegs hovedflyt med progress-bar:
01. Velg tjeneste — kort med pris/varighet, "vanligst"-badge
02. Velg trener — kort med foto, spesialitet, tilgjengelighet
03. Velg dato — kalender, mono-tall, lime-indicators på ledige dager
04. Velg tid — pills, varighet vises
05. Dine detaljer — form (navn, e-post, telefon, kommentar, samtykke)
06. Betal — Stripe-elementer, ordreoppsummering, vilkår
07. Bekreftelse — suksess, kalenderfil, Apple/Google Calendar-knapper

Edge-skjermer:
08. Venteliste — slot fullt, foreslå venteliste, vis posisjon
09. Booking status oppslag — finn booking via ID
10. Endre booking — flytt tid (innenfor regler)
11. Avbestill booking — bekreftelse + advarsel om regler

Spillerportal-kontekst (dark-mode):
12. Mine bookinger — neste-hero + kommende + tidligere
13. Mine bookinger venteliste — egen liste
14. Booking detalj-side — full info
15. Avbestillingsregler-kort — selvstendig component

═══════════════════════════════════════════════
MODUL 3 — COACHHQ DEL 1: OPERASJONELT (14 skjermer)
═══════════════════════════════════════════════

Dark-mode primær. Felles shell: sidebar 48px ikonrail + 200px nav-liste,
top-bar 58px (dato/tid + søk + bjelle + profilbilde).

01. Dagens fokus (/admin) — 3 signaler-kort, dagens møter timeline,
    KPI-rad (4 nøkkeltall), "Aktiv nå"-pulse på pågående økt
02. Denne uken (/admin/denne-uken) — ukens oversikt, progress-graf
03. Coaching Board (/admin/coaching-board) — Trello-aktig kanban
    (Forberedelse / Pågår / Etterarbeid / Ferdig), drag-drop
04. Mission Board (/admin/mission-board) — mål per elev/team,
    progress-bars, tildeling-flow
05. Elever liste (/admin/elever) — søkbar tabell: foto, HCP, status,
    neste økt, signaler, filtre, eksport
06. Elever oversikt (/admin/elever/oversikt) — grid-view med kort,
    sortering på framgang/risiko
07. Elevprofil (/admin/elever/[id]) — foto-hero, navn, HCP, klubb;
    tabs: Oversikt/Golf/Coaching/Mental/Trening/Økonomi/Signaler
08. Elevprofil V2 (/admin/elever/[id]/v2) — alt på én lang side, ikke tabs
09. Bookinger admin (/admin/bookinger) — alle på tvers, filter, hurtighandlinger
10. Ny booking (/admin/bookinger/ny) — admin oppretter på vegne av elev
11. Kalender (/admin/kalender) — uke/måned, fargede blokker per coach,
    drag-drop, konflikt-deteksjon
12. Økter (/admin/okter) — liste, notater, filter
13. Focus (/admin/focus) — dagens 3 viktigste oppgaver per coach
14. Godkjenninger (/admin/godkjenninger) — workflow ventende
    (refunderinger, avvik, capability-grants)

═══════════════════════════════════════════════
MODUL 4 — COACHHQ DEL 2: DATATUNGT + ANALYSE (13 skjermer)
═══════════════════════════════════════════════

Dark-mode primær.

01. Analytics (/admin/analytics) — plattform-statistikk, retention,
    engagement, linje/bar-grafer + heatmap
02. Rapporter (/admin/rapporter) — mal-bibliotek (mnd/kvartal/år),
    generer ny, eksport PDF/Excel
03. Økonomi (/admin/okonomi) — MRR-dashboard, faktura-status,
    refunderinger, per-elev-margin, Stripe webhook-helse
04. Tilgjengelighet (/admin/tilgjengelighet) — coach-tilgjengelighet
    per uke, drag for slots, repeat-pattern
05. Kapasitet (/admin/kapasitet) — total vs utnyttelse, per-coach,
    ledig kommende 4 uker
06. Grupper (/admin/grupper) — grupper/klasser, antall, neste samling, CRUD
07. Turneringer admin (/admin/turneringer) — kommende/pågående/ferdig,
    påmeldte, resultater, lag-ny-flow
08. Fasiliteter (/admin/fasiliteter) — GFGK fasilitets-bookingkart,
    kart/kalender/liste, soner (Driving Range, Performance Studio,
    Putting Green, Short Game)
09. Ny aktivitet (/admin/fasiliteter/ny-aktivitet) — velg fasilitet,
    person, type, dato, tid, varighet
10. Fasilitet-innstillinger (/admin/fasiliteter/innstillinger) — soner,
    kapasitet, åpningstider
11. Treningsplan-styring (/admin/treningsplan) — alle planer, status
12. Ny treningsplan (/admin/treningsplan/ny) — wizard: mål, periode,
    fokusområder
13. Treningsplan-maler (/admin/treningsplan/maler) — mal-bibliotek

═══════════════════════════════════════════════
MODUL 5 — COACHHQ DEL 3: KONFIG + AI + KOMMUNIKASJON (7 skjermer)
═══════════════════════════════════════════════

Dark-mode primær.

01. AI-agenter (/admin/agenter) — liste, kjør-på-demand, log-historikk
02. AI-assistent config (/admin/ai-assistent) — prompt-templates,
    datakilder per AI-funksjon, tone-of-voice
03. E-postmaler (/admin/e-postmaler) — split-view (liste + editor),
    variabler med preview, test-send
04. Meldinger broadcast (/admin/meldinger) — segment-velger, mal,
    send-tidspunkt
05. Notifikasjoner config (/admin/notifications) — push-config,
    default tider
06. Team (/admin/team) — staff-liste, foto, rolle, kapabiliteter, inviter
07. Team audit (/admin/team/audit) — audit-log, filter

═══════════════════════════════════════════════
MODUL 6 — PLAYERHQ DEL 1: DASHBOARD + PROFIL + PLAN (10 skjermer)
═══════════════════════════════════════════════

Dark-mode PRIMÆR (PWA-app, "premium-feel"). Felles shell: dark sidebar
+ topbar med "Hei, [Fornavn]" + dato + bjelle + avatar.
Mobile: bunn-tab-nav med 5 ikoner (lucide: home, calendar, target, bar-chart-3, user).

01. Dashboard hjem (/portal) — Course Hero med foto-bakgrunn +
    glassmorph bento, KPI-rad (HCP, SG, streak, plan-fullføring),
    neste økt-kort, SG-bars, 12-mnd HCP-graf
02. Min profil (/portal/profil) — foto-hero, HCP, klubb, alder,
    stats over tid, prestasjoner (badges), innstillinger-link
03. Min profil innstillinger (/portal/profil/innstillinger) —
    personlig, passord, notifikasjoner, personvern
04. PlayerHQ (/portal/playerhq) — komplett 360°-profil: 9 seksjoner
    (Hero, Identity, Golf, Coaching, Training, Mental+Forecast,
    Tests, Economy, Signals)
05. Min plan (/portal/min-plan) — dagens fokus (1 ting),
    ukens fokus (3 ting), SG-trend, neste milepæl,
    AK-pyramide horisontal (5-lags klikkbar)
06. Treningsplan oversikt (/portal/treningsplan) — aktiv plan
    (uker, fokus, progress) + tidligere planer
07. Treningsplan detalj (/portal/treningsplan/[id]) — uke-for-uke,
    øvelser per dag, logg gjennomføring
08. Treningsplanlegger (/portal/kalender) — kalender drag-drop,
    øvelsesbank-sidemeny, AK-pyramide-sidemeny, ukens fokus,
    AI-foreslått-økt-knapp
09. Onboarding (/portal/onboarding) — 5-stegs flyt: skill, mål,
    utstyr, tid, integrasjoner, lime fremdriftsring
10. Kartlegging (/portal/kartlegging) — initial assessment etter
    onboarding (50-100-150, 9-hull, 3-putt)

═══════════════════════════════════════════════
MODUL 7 — PLAYERHQ DEL 2: TRENING + ANALYSE + AI (19 skjermer)
═══════════════════════════════════════════════

Dark-mode primær.

01. AI Coach (/portal/ai-coach) — velkomst, hurtigspørsmål, "Start chat"
02. AI Coach chat (/portal/ai-coach/chat) — chat med data-kontekst-panel,
    AI-attribution-chip på hver melding
03. Treningsanalyse (/portal/analyse) — SG-radar (4 områder),
    klubbe-statistikk-tabell, trender, AI-narrative
04. Statistikk (/portal/statistikk) — SG-fordeling, HCP-utvikling,
    score-distribution, rounds-table
05. Statistikk ny runde (/portal/statistikk/ny-runde) — logg manuelt
    eller fra TrackMan, pre-shot intent vs resultat
06. Benchmark (/portal/benchmark) — du vs peer, vs PGA Tour, vs ditt beste
07. Sammenligning (/portal/sammenligning) — velg 1-N spillere,
    side-by-side stats
08. Mental ny (/portal/mental/ny) — pre-runde mental,
    skala-vurderinger (energi, fokus, ro, selvtillit)
09. Mental detalj (/portal/mental/[roundId]) — mental for én runde,
    pre vs post
10. Mental oversikt (/portal/mental) — trender, korrelasjon mental↔score
11. Dagbok (/portal/dagbok) — GitHub-style heatmap (90 dager),
    streak-card, AK-pyramide-fordeling
12. Dagbok detalj (/portal/dagbok/[id]) — én økt: notater, øvelser
13. TrackMan (/portal/trackman) — klubbe-radar, dispersion-plot
    (LEVENDE: animert pulse-in, realistisk green-foto),
    carry-waveform, last session, dark surface
14. Strategi (/portal/strategi) — strategibuilder per bane,
    pre-shot decade-protokoll
15. Tester oversikt (/portal/trening/tester) — 50-100-150,
    9-hull, 3-putt, historikk
16. Test detalj (/portal/trening/tester/[id]) — instruksjoner, log, resultat
17. Tester (kapasitet) (/portal/tester) — fysiske tester FYS-pyramide
18. Øvelser (/portal/trening/ovelser) — øvelsesbank med filter,
    per AK-pyramide-nivå, video/instruksjon
19. Bag (/portal/bag) — mine køller, stats per kølle, dispersion

═══════════════════════════════════════════════
MODUL 8 — PLAYERHQ DEL 3: RUNDE + SOSIALT + KONKURRANSE (15 skjermer)
═══════════════════════════════════════════════

Dark-mode primær.

01. Ny runde (/portal/runde/ny) — bane, dato, vær, mål, pre-runde mental
02. Runde aktiv (/portal/runde/[id]) — scorecard, hull-navigator (1-18),
    pre-shot decade-panel
03. Runde oppsummering (/portal/runde/[id]/oppsummering) — total + SG,
    hull-for-hull, AI-narrative, best/worst-shots
04. Runde hero (/portal/runde/[id]/hero) — visuell oppsummering,
    foto + tall, delbar
05. Coaching-historikk (/portal/coaching-historikk) — tidsstrøm
    av økter, notater, tilbakemeldinger
06. Sosialt feed (/portal/sosialt) — venners runder/PRs,
    reaksjoner + kommentarer, "Del runde"-knapp
07. Venner (/portal/sosialt/venner) — venneliste, søk, forespørsler,
    AddFriendDialog som side
08. Meldinger (/portal/meldinger) — innboks, tråder med coach + venner,
    søk, prefs
09. Meldinger demo (/portal/meldinger/demo) — demo-trådvisning
10. Turneringer (/portal/turneringer) — kort med banefoto,
    påmelding-status, resultater
11. Turneringsplan (/portal/turneringsplan) — kommende sesong,
    mål per turnering, forberedelse-checklist
12. Spill (/portal/spill) — spillmodus-velger, konkurranse vs venner
13. Spill type (/portal/spill/[gameType]) — aktiv spillmodus,
    live leaderboard
14. Apper (/portal/apper) — 3rd party (TrackMan, Garmin, Apple Health),
    connect/disconnect
15. Abonnement (/portal/abonnement) — plan-status, faktureringshistorikk,
    oppgradering-CTAer

═══════════════════════════════════════════════
MODUL 9 — AUTH + ERROR + PWA (14 skjermer)
═══════════════════════════════════════════════

Light-mode for auth (kunde-vennlig). Dark for PWA-app-skjermer.

Auth (light):
01. Portal login (/portal/login) — logo prominent, magic link / passord,
    "Glemt passord"-link
02. Admin login (/admin/login) — samme stil, "AK Golf CoachHQ"-merket
03. Auth login (/auth/login) — generisk for academy
04. Auth register (/auth/register) — e-post, passord, navn, bekreft-side
05. Forgot password (/auth/forgot-password) — e-post-input, send, bekreft
06. Set password (/auth/set-password) — token fra e-post,
    nytt passord, suksess
07. Auth callback (/auth/callback) — loading, success, error states
08. Design review (/design-review) — minimal styling

PWA:
09. "Installer som app"-banner — subtil topp-banner ved 2. besøk på mobil
10. Splash screen — fullskjerm grønn (#005840) + lime-logo, fade-out
11. Offline-fallback — "du er offline", tilgjengelige sider
12. App-ikon — kvadratisk 512×512px, maskable
13. Push-permission-prompt — be om push-tillatelse
14. Update-available-banner — "ny versjon tilgjengelig — last på nytt"

═══════════════════════════════════════════════
LEVERANSE
═══════════════════════════════════════════════

Total: ~122 skjermer fordelt på 9 moduler.

For hver modul:
- En index/canvas-side som viser alle skjermene i moduletn (med iframes)
- Hver skjerm som SEPARAT responsive HTML (desktop+tablet+mobil)
- Bruk shared tokens.css/colors_and_type.css fra design-systemet
- Bruk lucide-ikoner via CDN
- Eksporter ALT som ÉN handoff-bundle når ferdig (eller én bundle per modul)

VED TVIL: bruk standardvalg fra ak-design-system. Ikke spør, ikke vent.
Lever når ferdig.

START NÅ.
```

---

## Etter at Claude Design er ferdig

Send meg URL-en til hver bundle (én eller flere).
Jeg pakker ut, legger inn i `public/design-reference/screens/`, oppdaterer
index.html, verifiserer 0 emojier, og er klar til å starte
Fase C.1 (token-import) og deretter Sprint 1 (implementering).

---

## Estimert kost

~$150-250 for alle 122 skjermer (sannsynligvis fordelt over flere
økter siden Claude Design har kontekst-grenser per økt). Innenfor
ditt $200-300 budsjett.

---

## Hva Claude Code (jeg) gjør i mellomtiden

Mens du venter på Claude Design:
- Forberede Fase C.1 (token-import-plan)
- Lage codemod-script for Fase C.5 (legacy-rensing)
- Klargjøre worktree-oppsett for Sprint 1

Si fra hva du vil at jeg skal gjøre — eller la meg være rolig
til neste bundle ankommer.
