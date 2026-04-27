# Claude Design — Prompt for resterende skjermer

**Bruk i:** AK Golf Portal-prosjektet (det med tokens.css v2.0).

**Forutsetninger som er på plass:**
- V2 Cockpit-språk valgt for PlayerHQ + CoachHQ
- Tokens v2.0 (`--akgolf-*`, `#102B1E` dark-bg)
- Inter 300-800, Lucide-only, ingen emoji
- 60/30/10 distribusjon
- Eksisterende basis-skjermer: V6 Hero, V2 Cockpit, runde-v2, stats-v2, plan, aicoach, missioncontrol, onboarding, booking

---

## LIM INN HELE PROMPTEN UNDER

```
Bygg de gjenstående skjermene for AK Golf Platform. Bruk samme tokens
og regler som de eksisterende screens/-filene (V2 Cockpit-språk for
PlayerHQ + CoachHQ, light-mode for markedsside + booking + auth).

Du jobber selvstendig — ikke spør, bruk standardvalg fra AK Golf Group
Design System v2.0. Lever modul for modul som handoff-bundle.

═══════════════════════════════════════════════
GLOBAL STIL (alle skjermer)
═══════════════════════════════════════════════
- --akgolf-dark-bg: #102B1E (bg) · --akgolf-card-dark: #0D2E23 (kort)
- --akgolf-card-dark-hover: #143A2D
- Primary #005840 · Accent #D1F843 (10% maks)
- Inter 300-800 + JetBrains Mono for tall/labels
- Headlines: Inter 700-800 + letter-spacing -0.03em
- Mono-labels: JetBrains Mono CAPS + 0.14em
- Cards: 16px radius + 1px border + soft shadow
- Glow én per view: border 1.5px rgba(209,248,67,0.25) +
  box-shadow 0 0 24px rgba(209,248,67,0.10)
- Sidebar 48px ikon-rail · top nav 58px · max content 1400px
- Lucide-icons via CDN (https://unpkg.com/lucide@latest), 2px stroke
- INGEN emoji. INGEN Material Symbols. INGEN ⌘-symbol → bruk "Cmd"
- Logo: SVG, aldri tekst-wordmark "AK Golf Academy" ved siden
- Norsk bokmål, du-form, golf-flytenhet antas
- Responsive: alle skjermer fungerer på desktop 1440 + tablet 768
  + mobil 390 (sidebar → bunn-tab-nav under 768)

═══════════════════════════════════════════════
MODUL A — PLAYERHQ KJERNE (V2 Cockpit, dark)
Lever som ÉN bundle: module-A-playerhq-core
═══════════════════════════════════════════════

Felles spiller-shell: dark sidebar 48px + nav-liste 200px,
top-bar med "Hei, Erik" + dato + bjelle + avatar.
Mobile bunn-tab-nav (lucide: home, calendar, target, bar-chart-3, user).

A1. Min profil (/portal/profil) — foto-hero, navn, HCP, klubb, alder,
    stats over tid (HCP-utvikling, total runder), prestasjoner (badges),
    innstillinger-link
A2. Profil-innstillinger (/portal/profil/innstillinger) — personlig info,
    passord, notifikasjoner, personvern, slett konto
A3. PlayerHQ 360° (/portal/playerhq) — alt på én lang side,
    9 seksjoner: Hero, Identity, Golf-stats, Coaching-historikk,
    Trening, Mental+Forecast, Tester, Økonomi, Signaler
A4. Min plan (/portal/min-plan) — dagens fokus (1 ting),
    ukens fokus (3 ting), SG-trend siste 4 uker, neste milepæl,
    AK-pyramide horisontal 5-lags (FYS/TEK/SLAG/SPILL/TURN, klikkbar)
A5. Treningsplan oversikt (/portal/treningsplan) — aktiv plan
    (uker, fokus, progress) + tidligere planer
A6. Treningsplan detalj (/portal/treningsplan/[id]) — uke-for-uke,
    øvelser per dag, logg gjennomføring
A7. Treningsplanlegger kalender (/portal/kalender) — kalender drag-drop,
    øvelsesbank-sidemeny, AK-pyramide-sidemeny, ukens fokus,
    AI-foreslått-økt-knapp
A8. Onboarding (/portal/onboarding) — 5-stegs flyt: skill, mål, utstyr,
    tid, integrasjoner, lime fremdriftsring
A9. Kartlegging (/portal/kartlegging) — initial assessment etter onboarding
    (50-100-150, 9-hull, 3-putt)
A10. Mine bookinger (/portal/bookinger) — neste-hero + kommende + tidligere

═══════════════════════════════════════════════
MODUL B — PLAYERHQ AVANSERT (V2 Cockpit, dark)
Lever som module-B-playerhq-advanced
═══════════════════════════════════════════════

B1. AI Coach chat (/portal/ai-coach/chat) — chat med data-kontekst-panel
    venstre, AI-attribution-chip på hver melding
B2. Treningsanalyse (/portal/analyse) — SG-radar (4 områder),
    klubbe-statistikk-tabell, trender, AI-narrative
B3. Statistikk (/portal/statistikk) — SG-fordeling, HCP-utvikling,
    score-distribution, rounds-table
B4. Statistikk ny runde (/portal/statistikk/ny-runde)
B5. Benchmark (/portal/benchmark) — du vs peer, vs PGA Tour, vs ditt beste
B6. Sammenligning (/portal/sammenligning) — velg N spillere, side-by-side
B7. Mental ny (/portal/mental/ny) — pre-runde mental, skala-vurderinger
    (energi, fokus, ro, selvtillit)
B8. Mental detalj (/portal/mental/[roundId])
B9. Mental oversikt (/portal/mental) — trender, korrelasjon mental↔score
B10. Dagbok (/portal/dagbok) — GitHub-style heatmap (90 dager),
     streak-card, AK-pyramide-fordeling
B11. Dagbok detalj (/portal/dagbok/[id])
B12. Strategi (/portal/strategi) — strategibuilder per bane, decade-protokoll
B13. Tester oversikt (/portal/trening/tester) — 50-100-150, 9-hull, 3-putt
B14. Test detalj (/portal/trening/tester/[id])
B15. Tester kapasitet (/portal/tester) — fysiske tester
B16. Øvelser (/portal/trening/ovelser) — øvelsesbank med filter
B17. Bag (/portal/bag) — mine køller, stats per kølle, dispersion

═══════════════════════════════════════════════
MODUL C — PLAYERHQ RUNDE + SOSIALT (V2 Cockpit, dark)
Lever som module-C-playerhq-runde-social
═══════════════════════════════════════════════

C1. Ny runde (/portal/runde/ny) — bane, dato, vær, mål, pre-runde mental
C2. Runde aktiv (/portal/runde/[id]) — basis: bruk eksisterende runde-v2.html,
    bare rens og oppdater
C3. Runde oppsummering (/portal/runde/[id]/oppsummering) — total + SG,
    hull-for-hull, AI-narrative, best/worst-shots
C4. Runde hero (/portal/runde/[id]/hero) — visuell oppsummering, delbar
C5. Coaching-historikk (/portal/coaching-historikk) — tidsstrøm av økter
C6. Sosialt feed (/portal/sosialt) — venners runder/PRs, "Del runde"
C7. Venner (/portal/sosialt/venner) — venneliste, søk, forespørsler
C8. Meldinger inbox (/portal/meldinger) — innboks, tråder coach + venner
C9. Turneringer (/portal/turneringer) — kort med banefoto, påmelding
C10. Turneringsplan (/portal/turneringsplan) — sesong, mål, forberedelse
C11. Spill (/portal/spill) — spillmodus-velger
C12. Spill type (/portal/spill/[gameType]) — aktiv modus, leaderboard
C13. Apper (/portal/apper) — 3rd party (TrackMan, Garmin, Apple Health)
C14. Abonnement (/portal/abonnement) — plan-status, faktura, oppgradering

═══════════════════════════════════════════════
MODUL D — COACHHQ OPERASJONELT (V2 Cockpit, dark)
Lever som module-D-coachhq-operations
═══════════════════════════════════════════════

Felles shell: sidebar 48px ikon-rail (8 hovedvalg) + 200px nav-liste,
top-bar dato/tid + søk + bjelle + profilbilde.
Eksisterende missioncontrol.html er basis — utvid til 14 skjermer.

D1. Dagens fokus (/admin) — basis: missioncontrol.html oppdatert.
    3 signaler-kort, dagens møter timeline, KPI-rad,
    "Aktiv nå"-pulse på pågående økt
D2. Denne uken (/admin/denne-uken)
D3. Coaching Board (/admin/coaching-board) — Trello-aktig kanban:
    Forberedelse / Pågår / Etterarbeid / Ferdig, drag-drop
D4. Mission Board (/admin/mission-board) — mål per elev/team
D5. Elever liste (/admin/elever) — søkbar tabell, filter, eksport
D6. Elever oversikt (/admin/elever/oversikt) — grid-view, sortering
D7. Elevprofil tabs (/admin/elever/[id]) — foto-hero,
    tabs: Oversikt/Golf/Coaching/Mental/Trening/Økonomi/Signaler
D8. Elevprofil V2 (/admin/elever/[id]/v2) — alt på én lang side
D9. Bookinger admin (/admin/bookinger) — alle på tvers, filter
D10. Ny booking admin (/admin/bookinger/ny)
D11. Kalender admin (/admin/kalender) — uke/måned, fargede blokker per coach
D12. Økter (/admin/okter) — alle gjennomførte + planlagte
D13. Focus (/admin/focus) — dagens 3 viktigste oppgaver per coach
D14. Godkjenninger (/admin/godkjenninger) — workflow ventende

═══════════════════════════════════════════════
MODUL E — COACHHQ DATA + ANALYSE (V2 Cockpit, dark)
Lever som module-E-coachhq-data
═══════════════════════════════════════════════

E1. Analytics (/admin/analytics) — plattform-statistikk, retention,
    engagement, linje/bar-grafer + heatmap
E2. Rapporter (/admin/rapporter) — mal-bibliotek, generer ny, eksport
E3. Økonomi (/admin/okonomi) — MRR-dashboard, faktura-status,
    refunderinger, per-elev-margin, Stripe webhook-helse
E4. Tilgjengelighet (/admin/tilgjengelighet) — coach-slots, repeat-pattern
E5. Kapasitet (/admin/kapasitet) — total vs utnyttelse, per-coach
E6. Grupper (/admin/grupper) — grupper/klasser, CRUD
E7. Turneringer admin (/admin/turneringer)
E8. Fasiliteter (/admin/fasiliteter) — kart/kalender/liste, soner
    (Driving Range, Performance Studio, Putting Green, Short Game)
E9. Ny aktivitet (/admin/fasiliteter/ny-aktivitet)
E10. Fasilitet-innstillinger (/admin/fasiliteter/innstillinger)
E11. Treningsplan-styring (/admin/treningsplan)
E12. Ny treningsplan (/admin/treningsplan/ny) — wizard
E13. Treningsplan-maler (/admin/treningsplan/maler)

═══════════════════════════════════════════════
MODUL F — COACHHQ KONFIG + AI (V2 Cockpit, dark)
Lever som module-F-coachhq-config
═══════════════════════════════════════════════

F1. AI-agenter (/admin/agenter) — liste, kjør-på-demand, log-historikk
F2. AI-assistent (/admin/ai-assistent) — prompt-templates, datakilder
F3. E-postmaler (/admin/e-postmaler) — split-view (liste + editor),
    variabler med preview, test-send
F4. Meldinger broadcast (/admin/meldinger)
F5. Notifikasjoner config (/admin/notifications)
F6. Team (/admin/team) — staff-liste, foto, rolle, kapabiliteter, inviter
F7. Team audit (/admin/team/audit) — audit-log, filter

═══════════════════════════════════════════════
MODUL G — MARKEDSSIDE (light-mode)
Lever som module-G-markedsside
═══════════════════════════════════════════════

Light-mode (åpen for alle, ikke "app").
Hero-stil som "AK Golf Landing.html"-bundlen — Anders synes den var fet:
foto-hero med glassmorph, store italic-headlines, sparsom lime.

G1. Forsiden (/) — hero med banefoto + glassmorph,
    Inter 700/800 italic-aksent, tre tjenestekort
    (Academy / Junior / Booking), social proof, CTA "Bli medlem"
G2. Academy (/academy) — pakker (Performance 1600/mnd, Pro 2000/mnd,
    Gruppe 900/mnd), søknad-CTA
G3. Academy abonnement (/academy/abonnement) — 3-kolonners pris,
    "Vanligst" badge på Pro
G4. Academy booking (/academy/booking)
G5. Junior Academy (/junior-academy) — foreldre-tone, aldersgrupper
    (6-9, 10-13, 14-17), programstruktur
G6. Booking landing (/booking) — velg trener (Anders/Markus)
G7. Utvikling (/utvikling) — produkt-showcase, bilder, "Prøv gratis"
G8. Pricing (/landing/pricing) — Anders + Markus + Flex-tjenester
    (20/50/90, Duo, Banecoaching 9 hull)
G9. Om oss (/landing/about)
G10. Kontakt (/landing/contact) — skjema, kart, åpningstider
G11. Personvern (/personvern) — GDPR-tekst
G12. Maintenance (/maintenance)
G13. Error 403 (/403)
G14. Error 500 (/500)
G15. Felles WebsiteNav (logo + 5 lenker + login) + Footer

═══════════════════════════════════════════════
MODUL H — BOOKING-SYSTEM (light-mode)
Lever som module-H-booking
═══════════════════════════════════════════════

Light-mode primært (kunde-flate).

H1. Velg tjeneste — kort med pris/varighet, "vanligst"-badge
H2. Velg trener — kort med foto, spesialitet, tilgjengelighet
H3. Velg dato — kalender, mono-tall, lime-indicators på ledige dager
H4. Velg tid — pills, varighet vises
H5. Dine detaljer — form (navn, e-post, telefon, kommentar, samtykke)
H6. Betal — Stripe-elementer, ordreoppsummering, vilkår
H7. Bekreftelse — suksess, kalenderfil, Apple/Google-knapper
H8. Venteliste — slot fullt, foreslå venteliste, vis posisjon
H9. Booking status oppslag — finn booking via ID
H10. Endre booking — flytt tid (innenfor regler)
H11. Avbestill booking — bekreftelse + advarsel
H12. Booking detalj-side — full info om én booking
H13. Avbestillingsregler-kort — selvstendig component
H14. Mine bookinger venteliste — egen liste over posisjoner
H15. Progress-bar component — på toppen av steg 1-7

═══════════════════════════════════════════════
MODUL I — AUTH + PWA (mix)
Lever som module-I-auth-pwa
═══════════════════════════════════════════════

Auth (light):
I1. Portal login (/portal/login) — logo prominent, magic link / passord
I2. Admin login (/admin/login) — "AK Golf CoachHQ"-merket
I3. Auth login (/auth/login) — generisk for academy
I4. Auth register (/auth/register) — e-post, passord, navn
I5. Forgot password (/auth/forgot-password)
I6. Set password (/auth/set-password) — token, nytt passord
I7. Auth callback (/auth/callback) — loading/success/error states

PWA (dark):
I8. Installer-banner — subtil topp ved 2. besøk på mobil
I9. Splash screen — fullskjerm grønn (#005840) + lime-logo
I10. Offline-fallback — "du er offline" + tilgjengelige sider
I11. App-ikon spec — kvadratisk 512×512px, maskable
I12. Push-permission-prompt
I13. Update-available-banner

═══════════════════════════════════════════════
LEVERANSE
═══════════════════════════════════════════════

For hver modul:
- Lever som ÉN handoff-bundle med navn module-X-name (eller del i 2-3
  hvis modulen er stor)
- Hver skjerm = ÉN responsive standalone HTML-fil
- En canvas per modul som linker alle skjermene via iframes
- Alle skjermer responsive (desktop 1440 + tablet 768 + mobil 390)
- Tokens fra eksisterende tokens.css (ikke endre brand)
- Lucide via CDN
- Norsk bokmål

PRIORITERING (jobb i denne rekkefølge):
1. Modul D (CoachHQ Operasjonelt) — Anders bruker dette daglig
2. Modul A (PlayerHQ Kjerne) — spillerne ser dette hver uke
3. Modul G (Markedsside) — første kontakt for nye kunder
4. Modul H (Booking) — konvertering
5. Modul B (PlayerHQ Avansert)
6. Modul E (CoachHQ Data)
7. Modul C (PlayerHQ Runde + Sosialt)
8. Modul F (CoachHQ Konfig)
9. Modul I (Auth + PWA)

VED TVIL: bruk standardvalg fra ak-design-system. Ikke spør, ikke vent.
Lever bundle per modul, eksporter URL etter hver er ferdig.

START med Modul D (CoachHQ Operasjonelt, 14 skjermer).
```

---

## Etter hver bundle ankommer

Send meg URL-en. Jeg pakker ut, oppdaterer index.html, sjekker emoji,
og du gir grønt lys for neste modul.

**Modul D ferdig først → da har du komplett CoachHQ for daglig bruk.**

---

## Estimert kost

| Modul | Antall skjermer | Estimat |
|---|---|---|
| D — CoachHQ Operasjonelt | 14 | $20-30 |
| A — PlayerHQ Kjerne | 10 | $15-22 |
| G — Markedsside | 15 | $20-28 |
| H — Booking | 15 | $15-22 |
| B — PlayerHQ Avansert | 17 | $20-28 |
| E — CoachHQ Data | 13 | $18-25 |
| C — PlayerHQ Runde+Sosialt | 14 | $15-22 |
| F — CoachHQ Konfig | 7 | $8-12 |
| I — Auth + PWA | 13 | $10-15 |
| **Total** | **118 skjermer** | **$141-204** |

Innenfor $300-budsjett.

---

## Det vi har fra før (skal ikke re-bygges)

- V6 Course Hero (dashboard-v6-hero.html) — Anders' favoritt
- V2 Night Ops (dashboard-v2-night.html) — alternativ
- E2 Academy (dashboard-e2-academy.html) — alternativ
- runde.html / runde-v2.html — Anders bruker den nye
- stats.html / stats-v2.html
- plan.html
- aicoach.html — chat-versjon trengs for Modul B
- missioncontrol.html — basis for Modul D D1
- onboarding.html — basis for Modul A A8
- booking.html — basis for Modul H
- mobile-runde, mobile-dashboard, mobile-aicoach
