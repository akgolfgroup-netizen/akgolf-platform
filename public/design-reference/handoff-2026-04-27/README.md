# Handoff: AK Golf Group — Helhetlig digital plattform

## Overview

AK Golf Group er en norsk golf-academy som trenger en helhetlig digital plattform. Denne handoff-pakken inneholder **80+ skjermer** som dekker tre produkt-moduler og en grafisk merkevare-eksperiens designet for å løfte hele kundereisen — fra første besøk på markedssiden, gjennom onboarding, til daglig bruk for spillere og coacher.

Plattformen består av:

| Modul | Skjermer | Brukere | Tilstand |
|-------|----------|---------|----------|
| **Modul A — PlayerHQ** | 22 | Spillere (junior + voksne) | Mørk modus (V2 Cockpit) |
| **Modul D — CoachHQ** | 30 | Coacher, akademi-ledere | Mørk modus (V2 Cockpit) |
| **Modul G — Public Web** | 17 | Markedsbesøkende, foreldre | Lys modus (cream + lime) |
| **Mobile** | 9 (3 sett) | Begge HQ + booking | iOS-frame, både lys og mørk |

I tillegg inneholder bunten dashboard-utforskningene (V1–V5 + E1–E3 + V6 hero) som ble brukt til å sette retning på hovedformatet.

## About the Design Files

**Filene i denne pakken er design-referanser laget i HTML.** De er prototyper som viser tiltenkt utseende og oppførsel — **ikke produksjonskode** som skal kopieres direkte.

Oppgaven er å **gjenskape disse HTML-designene i målkodebasens etablerte miljø** (React, Vue, SwiftUI osv.) ved å bruke kodebasens egne komponenter, mønstre og bibliotek. Hvis det ikke finnes en kodebase ennå, velg det rammeverket som passer best — vi anbefaler **Next.js + Tailwind + shadcn/ui** som standard, ettersom token-systemet er CSS-variabler som mapper rett inn i den stacken.

Selve HTML-filene bruker:
- **Inter** (UI), **JetBrains Mono** (data/labels), **Fraunces** (italic display-aksent)
- **Lucide** ikoner via CDN
- Inline `<style>` per skjerm + delte CSS-filer per modul (`screens/_coachhq.css`, `_playerhq.css`, `_website.css`, `_mobile.css`)
- Felles design-tokens i `tokens.css`

## Fidelity

**Hi-fi (pixel-presise mockups).** Alle skjermer har endelige farger, typografi, spacing, ikoner og mikro-interaksjoner. Layout, hierarki, komponent-anatomi og kopi (norsk) er ferdig. Utvikleren bør gjenskape UIet pixel-presist ved å bruke kodebasens eksisterende komponentbibliotek.

Plassholdere som kan/bør byttes ved implementering:
- **Foto-placeholders** på markedssiden (G1–G15) — markert med stiplet ramme + "FOTO"-label. Vent på shoot.
- **Dummy-data** på alle dashboards — tabular tall, navn, datoer er illustrative.
- **Coach-avatarer** er CSS-gradienter; bytt mot ekte foto.

## Design System

### Tokens (i `tokens.css`)

```css
/* Brand */
--akgolf-primary:  #005840;   /* dyp grønn — knapper, headere, primær */
--akgolf-accent:   #D1F843;   /* lime — CTA, fokus, glow */
--akgolf-ink:      #0A1F18;   /* hovedtekst, mørk surface */
--akgolf-surface:  #ECF0EF;   /* lys side-bakgrunn */
--akgolf-dark-bg:  #102B1E;   /* mørk side-bakgrunn (HQ-er) */
--akgolf-card-light: #FFFFFF;
--akgolf-card-dark:  #0D2E23;
--akgolf-text:     #324D45;   /* sekundærtekst lys */
--akgolf-muted:    #A5B2AD;   /* tertiær / disabled */
--akgolf-success:  #2A7D5A;
--akgolf-warning:  #C48A32;
--akgolf-danger:   #B84233;

/* Linjer / borders */
--akgolf-line-dark:  #1a4a3a;
--akgolf-line-light: #e0e8e5;

/* Glow (max 1 per view) */
--akgolf-glow-border: 1.5px solid rgba(209, 248, 67, 0.25);
--akgolf-glow-shadow: 0 0 24px rgba(209, 248, 67, 0.10);
```

### Skygger og radier

```css
--ak-shadow-sm: 0 1px 2px rgba(10,31,24,0.04);
--ak-shadow:    0 0 0 1px rgba(10,31,24,0.05), 0 1px 2px rgba(10,31,24,0.03), 0 6px 20px rgba(10,31,24,0.05);
--ak-shadow-lg: 0 20px 50px rgba(10,31,24,0.14);

--ak-r-card: 16px;   /* standard kort */
--ak-r-xl:   22px;   /* hero */
--ak-r-full: 9999px; /* pills, runde knapper */
```

### 8-pt grid

`8 / 16 / 24 / 32 / 40 / 48 / 64` (`--ak-s-1 … --ak-s-8`)

### Typografi

- **Inter** 14px base, vekter 300/400/500/600/700/800.
- **JetBrains Mono** 9–11px for tabular tall, eyebrows og labels (uppercase + 0.10–0.16em letter-spacing).
- **Fraunces italic** 500-vekt for "soft display"-aksenter (hero-overskrifter med ord som *"endelig."* / *"i form."*).

Eksempel hero-pattern:
```
"Du er <em>i form.</em>"  →  Inter 800 + Fraunces italic 500 m/ accent-farge
```

### Iconography

Lucide-icons gjennom hele plattformen. Alle inline-bruks-eksempler bruker `<i data-lucide="check"></i>` + `lucide.createIcons()`. Når du implementerer i React, bytt til `lucide-react`.

### Norske datoer / tall

- Datoer: "tir 30. apr" / "30. april 2026"
- Tall: tabular-nums for stats (`font-variant-numeric: tabular-nums`)
- Valuta: "1 200 kr" (mellomrom som tusentalls-skille)
- Tid: 24-timers (`15:00`)

## Modul A — PlayerHQ (Spiller)

**Bruker:** Erik Kvist, 17 år, HCP 8.1, går mot HCP 5 før sommer-cup.
**Tone:** Personlig, direkte, motiverende — ikke fagspråk.

### Layout

- Sidebar venstre 240px (collapsed 72px) — mørk, lime aktiv-pille.
- Topbar 56px med søk + avatar + notifikasjon.
- Innholdet er mørkt (`--akgolf-dark-bg`), kort på `--akgolf-card-dark` med 16r og lime-tone borders der det er fokus-elementer.

### Skjermer

| ID | Navn | Formål |
|----|------|--------|
| A1 | Min profil | Identitet, HCP, mål, sosial bio |
| A2 | Innstillinger | Konto, varsler, integrasjoner |
| A3 | Min plan | Nordstjerne (kvartal-mål) + uke + dagens fokus |
| A4 | Mine bookinger | Liste m/ status, action-meny |
| A5 | Treningsplan oversikt | 12-ukers plan visualisert |
| A6 | Treningsplan detalj | Drill-by-drill m/ video-vedlegg |
| A7 | Onboarding | 5-stegs første-gangs |
| A8 | Kartlegging | 3 fysiske + tekniske tester |
| A9 | Treningsplanlegger | Kalender m/ drag-drop økter |
| A10 | PlayerHQ 360° | All-in-one dashboard |
| A11 | Abonnement | Plan-administrasjon |
| A12 | Meldinger | Chat m/ coach + video-vedlegg |
| A13 | Sammenligning | Du vs. peer-snitt |
| A14 | Strategi | Bane-kart + per-hull-plan |
| A15 | Tester | TPI mobilitet, fysiske, tekniske |
| A16 | Mental | Loggføring, mood, refleksjoner |
| A17 | Talent | Talent-pipeline (junior) |
| A18 | Trening | Logg, streak, 41-dagers heatmap |
| A19 | Turneringer | Påmelding, resultater |
| A20 | Bag | Utstyr, gap-test, fitting |
| A21 | Coaching-historikk | Tidslinje med Erik |
| A22 | Sosialt | Lag, leaderboard |

## Modul D — CoachHQ (Coach / Akademi)

**Bruker:** Anders Solheim (PGA Master) + Markus (akademi-leder), bruker den hele dagen.
**Tone:** Operasjonelt, datatett, tolerere mer kompleksitet enn PlayerHQ.

### Layout

- Sidebar venstre 240px med 5 hovedseksjoner + agent-snarvei nederst
- Topbar 56px med global søk + Copilot-knapp + avatar
- Mørk modus, kommandopalett (`Cmd+K`) som primær navigasjon

### Skjermer (gruppert)

**Operasjon (D1, D13, D2, D3, D4, D14)** — Dagens fokus, focus 3, ukeplan, kanban, mission board, godkjenninger-inbox.

**Personer (D5–D8)** — Spillere (liste/grid), profil tabs, profil long-page.

**Plan (D11, D9, D10, D12)** — Kalender, bookinger admin, ny booking, økter.

**Grupper & lokasjoner (D15–D17, D25)** — Grupper, gruppe-detalj, lokasjoner, fasiliteter.

**Tjenester / økonomi / rapporter (D18–D21, D30)** — Tilgjengelighet, tjenester, økonomi, rapporter, analytics.

**Kommunikasjon & team (D22–D24, D26, D27)** — Coach-meldinger, team, plan-bygger, library, hub-oversikt.

**AI & agenter (D28–D29)** — 8 agenter (Booking, Refusjon, Velkomst, Mål-tracker, Plateau, Faktura, Video, Foreldre) + Copilot-chat.

## Modul G — Public Web

**Brukere:** Foreldre som ser etter junior-tilbud, voksne hobby-spillere, talenter som vurderer akademi.
**Tone:** Varm, profesjonell, troverdig — minimalt salgs-språk.

### Layout

- Topp-nav 80px (transparent over hero, solid på scroll)
- Cream surface (`#FAFAF7`), hvite kort, lime-aksent
- Foto-placeholders med stiplet ramme — vent på fotoshoot

### Sider

| ID | Navn |
|----|------|
| G1 | Forsiden — hero + tjenester + bevis |
| G2 | Academy (voksne) |
| G3 | Junior Academy (6–17 år) |
| G4 | Priser samlet |
| G5 | Booking landing |
| G6 | Academy abonnement |
| G7 | Academy booking flow |
| G8 | Utvikling — PlayerHQ showcase |
| G9 | Om oss |
| G10 | Kontakt |
| G11 | Personvern |
| G12 | Maintenance |
| G13 | Feilside (404 / 403 / 500) |
| G14 | Utvikling — alt / metode-detalj |
| G15 | Foreldreinfo (junior) |

## Mobile

3 sett iOS-frame skjermer (390×844, notch + home-indicator):

- **PlayerHQ** (3): Hjem · Plan · Coach-chat med video-vedlegg
- **CoachHQ** (3): I dag · Spillere · Godkjenninger m/ AI-utkast
- **Booking** (3): Tjeneste · Kalender + tidsslots · Bekreftet

## Interactions & Behavior

### Globale mønstre

- **Sidebar collapse**: 240 ↔ 72px, smooth transition 200ms ease-out.
- **Cmd+K**: Åpne kommando-palett (CoachHQ).
- **Topbar søk**: Fuzzy søk på spillere / økter / lokasjoner.
- **Notifikasjoner**: Drop-down fra topbar bell.
- **Hover på kort**: Skygge fra `--ak-shadow` → `--ak-shadow-hover`, 150ms.

### Spesifikke flows

- **Booking (mobile)**: 3 steg, sticky CTA bunn, progress bar 33/66/100%.
- **Onboarding (A7)**: 5 steg, neste-knapp disabled til steg er fylt.
- **Godkjenning (D14)**: Hver rad har "Godkjenn" + "Avslå m/ melding"; AI-utkast vises som forslag.
- **AI-assistent (D29)**: Stream-respons, sitater til kilder (spiller-data, bookinger).
- **Agenter (D28)**: 8 agenter på/av-toggle, tørrkjør-modus før produksjon.

### Animasjoner

- Page transitions: 200ms ease-out cross-fade
- Modal: 250ms ease-out scale + fade
- Toast: 200ms ease-out slide-from-bottom + 4s display + 200ms fade-out
- Streak ring: SVG `stroke-dashoffset` animation, 800ms ease-out

### Responsivt

Per skjerm er minimums-bredde notert i kommentar. PlayerHQ + CoachHQ er bygget for **1440px desktop** (skalerer ned til 1280). Mobile har egne dedikerte skjermer.

## State Management

Plattformen krever:

### PlayerHQ
- `user` — profil, HCP, mål
- `schedule` — bookinger, økter, kommende events
- `plan` — kvartal-mål, uke-plan, dagens fokus
- `stats` — runder, SG-data, streaks
- `messages` — coach-tråd
- `gear` — bag, fitting-historikk

### CoachHQ
- `students` — alle spillere, status, follow-up flags
- `schedule` — egen og andre coachers kalender
- `approvals` — kø av godkjenninger
- `agents` — 8 agenter status, queues, drafts
- `copilot` — chat-historikk, kontekst-sitater

### Public Web
- Stort sett statisk + booking-form state.

## Files

### Per modul-canvas (åpne i nettleser)
- `module-A.html` — PlayerHQ canvas (drag-/zoom-bar, alle 22 skjermer)
- `module-D.html` — CoachHQ canvas (30 skjermer)
- `module-G.html` — Public Web canvas (17 sider)
- `AK Golf Portal.html` — Original utforsknings-portal (V1–V5 + E1–E3)

### Felles
- `tokens.css` — Single source of truth, `--akgolf-*` variabler
- `design-canvas.jsx` — Canvas-komponent (kan ignoreres ved implementasjon)

### Per-modul CSS (delte stiler)
- `screens/_coachhq.css` — Sidebar, topbar, kommando-pill
- `screens/_playerhq.css` — Lignende, lys variant
- `screens/_website.css` — Public web nav, hero, footer
- `screens/_mobile.css` — iOS-frame, status-bar, tab-bar
- `screens/_shared.css` — Tabular-num utility, eyebrow, akg-card
- `screens/_course-hero.css` — Bane-foto hero (E3)
- `screens/_reference-remix.css` — Bento-mønstre

### Skjermer
Alle skjerm-filer ligger i `screens/` og er navngitt som `{modul}{n}-{slug}.html`.

## Implementasjons-anbefalinger

1. **Start med tokens.css** → konverter til CSS variables i `globals.css` (eller Tailwind config med `extend.colors`).
2. **Bygg primitiver først**: Card, Button, Input, Select, Sidebar, TopBar, Avatar, Badge, Pill.
3. **Modul-by-modul rollout**: Public Web (G) er enklest å starte med (statisk), så PlayerHQ-skall (A1+A3+A10), så CoachHQ-skall (D1+D13+D14).
4. **Lucide**: `npm i lucide-react` — alle ikon-navn er allerede ferdige.
5. **Fonts**: Self-host Inter, JetBrains Mono, Fraunces (eller bruk `next/font`).
6. **Norsk lokalisering**: Alle strings i designet er endelig norsk kopi — kan brukes 1:1.
