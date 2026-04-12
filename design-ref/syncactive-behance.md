# SyncActive — Behance UX/UI Design Reference

Kilde: behance.net/gallery/213498497/SyncActive-UXUI-Design
Designer: Anna Bize
Verktoy: Adobe XD

## Oversikt

Fitness/helse-dashboard med smartwatch-integrasjon. Dark mode primaert.
Relevant for AK Golf Portal: dashboard-layout, dataviz, brukerprofilkort, aktivitetsstatistikk.

## Fargepalett

| Rolle | Farge | Bruk |
|-------|-------|------|
| Bakgrunn | #0A0A0C (naer svart) | Hovedbakgrunn |
| Kort-bg | #161619 | Kort og paneler |
| Accent primaer | Orange (#E8763A-liknende) | CTA, aktive elementer, grafer |
| Accent sekundaer | Lime/gronn (#B2F746-liknende) | Sekundaere indikatorer, donut |
| Tekst primaer | #F5F5F7 | Overskrifter, tall |
| Tekst sekundaer | #98989D | Undertekst, labels |
| Tekst muted | #56565A | Placeholder, inaktive |

## Design-moenstre

### Dashboard layout
- Bento grid med ulike kort-stoerrelser
- Sidebar med ikon-navigasjon (smal, 60-80px)
- Topbar med segment-tabs (Home, Activities, Health Stats, Training Planning)
- Hero-profilbilde integrert i dashboardet (stort, bildekort med overlay)

### Kort-hierarki
- Aktivitetskort (orange accent): stabler stolpediagram + KPI-tall
- Helsekort (gronn ring): sirkulaer progress med sentrert tall
- Statistikk-kort: sparklines med gradient-fill under
- Bildekort: fullbleed foto med gradient-overlay og tekst oppaa

### Typografi
- Velkomsthilsen: "Hello, Anna" — stor, lett vekt
- KPI-tall: 3986 (steg), 35 (minutter) — ekstra stor, bold, monospace-foelelse
- Labels: uppercase, 10-11px, wide tracking, muted farge
- Seksjonstitler: "PROBLEMS / SOLUTIONS" — uppercase, medium vekt

### Dataviz
- Stolpediagram: vertikale barer med rounded top, varierende hoyde
- Donut chart: tykk ring (8-10px stroke) med sentrert verdital
- Sparkline: tynn linje med gradient-fill under, endepunkt markert
- Calorie Analysis: stacked area chart med fargekoding

### Interaksjonsmonstre
- Kort med hover-glow (subtil border-lysing)
- Segment-tabs med rounded pill-form
- Chip-filtrering (All, Heart, Steps, etc.)
- Smartwatch-companion: forenklet visning av samme data

### User Persona-kort
- Stort profilbilde (venstre kolonne)
- Sitat med uthevet tekst ("I need tools that are intuitive")
- Brukerdetaljer: Navn, Alder, Lokasjon
- Behovs-donut: Personalization 40%, Quality Materials 30%, Easy Interface 30%
- Preferanse-barer: Functionality, Design, Price (horisontale barer)

## Relevans for AK Golf Portal

Direkte overfoerbare moenstre:
1. **Dashboard-layout**: Bento grid med hero-kort + metrikkbokser + bildekort
2. **Aktivitetsgrafer**: Stolpediagram for treningsoekter (daglig visning)
3. **Progress-ring**: Sirkulaer visning av treningsmaal
4. **Profilkort**: Stort bilde + overlagte stats (brukt i v3-prototypen)
5. **Segment-tabs**: Chip-navigasjon mellom treningskategorier

IKKE overfoerbart (vi bruker light mode):
- Dark mode farger (oversett til vaart grey-system)
- Orange accent (vi bruker #D1F843 lime)
- Svart bakgrunn (vi bruker #ECF0EF surface)
