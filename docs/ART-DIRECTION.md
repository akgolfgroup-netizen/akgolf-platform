# AK Golf — Art Direction

> Erstatter "Design: Apple Light Theme (monokrom, ingen aksent-farger)" i CLAUDE.md.
> Dette dokumentet er autoritativt for alle visuelle beslutninger i plattformen.

---

## VISUELL RETNING

**Én setning:** Profesjonell autoritet i light mode.

Ikke luxury-fashion. Ikke tech-cockpit. En ekspert som kommuniserer gjennom kvalitet og ro — som en velkledd golfinstruktør som ikke trenger å overbevise deg, du ser det bare.

**Referanser:**
- Markedsside: The Grind + Blanca Padel (video hero, seksjonsvariasjon, stor typografi)
- Spillerportal: Pulse Tennis + OrbitAI + Sandow (bento-grid, data som design, progress overalt)
- Mission Control: Fitonist Admin + CRM Dashboard (analytics-tunge kort, sparklines, heatmaps)
- Mobil: Fitonist App + 4goal (kompakt, touch-first, bottom nav)

---

## 1. FARGESYSTEM — «Sort. Hvit. Én grønn.»

Sort, hvit og grå gjør 95% av jobben. Den ene grønne (#2D6A4F) er signaturen. Når du ser grønn, betyr det alltid «noe bra skjer.»

### Grunnpalett

| Token | Hex | Bruk |
|-------|-----|------|
| Black | #1D1D1F | Primærtekst, overskrifter, knapper |
| Grey-600 | #48484A | Brødtekst |
| Grey-500 | #6E6E73 | Sekundærtekst |
| Grey-400 | #86868B | Labels, placeholders, muted tekst |
| Grey-300 | #D2D2D7 | Deaktiverte elementer, dividers |
| Grey-200 | #E8E8ED | Borders, separatorer |
| Grey-100 | #F5F5F7 | Sekundær bakgrunn, hover, cards |
| White | #FFFFFF | Primær bakgrunn |

### Brand-aksent — AK Green

| Token | Hex | Bruk |
|-------|-----|------|
| AK Green Dark | #1B4332 | Hover på grønne elementer |
| AK Green | #2D6A4F | Logoprikken. Primær aksent. |
| AK Green Bright | #40916C | Eyebrow-tekst, hero-aksent |
| AK Green Light | #EDF5F0 | Bakgrunn for positive elementer, AI-kort |

### Grønnen brukes KUN i:
- Logoprikken
- Positive datatrender (handicap ned, SG opp)
- Aktive tilstander (valgt meny-item, streak)
- CTA på mørk bakgrunn
- AI-generert innhold (bakgrunn: #EDF5F0, tekst/ikon: #2D6A4F)

### Semantiske farger

| Token | Hex | Bruk |
|-------|-----|------|
| Error | #D14343 | Negative trender, feil, avlysninger |
| Warning | #E89C30 | Streak-brudd, påminnelser, frister |
| Coaching | #2563EB | Coaching-bookinger i kalender/timeplan (KUN i portal) |

### ALDRI bruk:
- Lilla/purple som AI-signatur — vi bruker grønn
- Bronse/gull (#B07D4F)
- Neon-farger, gradienter, multi-aksent
- Blå som generell aksent — reservert for kalender-bookinger og ren tekst-lenker

---

## 2. LOGO-SYSTEM

AK-monogram i SVG med grønn signalprikk (#2D6A4F).

### Varianter:
| Variant | Monogram | Prikk | Kontekst |
|---------|----------|-------|----------|
| Primary | Sort (#1D1D1F) | Grønn (#2D6A4F) | Lys bakgrunn — HOVEDLOGO |
| Inverted | Hvit (#FFFFFF) | Grønn (#40916C) | Mørk bakgrunn (hero, footer) |
| Neutral | Sort (#1D1D1F) | Grå (#D2D2D7) | Diskré (faktura, kontrakt) |
| Admin | Sort (#1D1D1F) | Grå (#D2D2D7) | Mission Control sidebar |

### I navigasjon:
`[AK-monogram SVG] + «Golf» i Inter 500, farge #86868B`

### I portal sidebar:
`[AK-monogram SVG] + «AK Golf» (bold) / «Academy» (uppercase 9px #86868B)`

### I admin sidebar:
`[AK-monogram SVG med grå prikk] + «AK Golf» (bold) / «Mission Control» (uppercase 9px #86868B)`

---

## 3. TYPOGRAFI

Inter med dramatisk størrelsesvariasjon. Letter-spacing strammer jo større teksten er.

| Element | Størrelse | Vekt | Letter-spacing |
|---------|-----------|------|----------------|
| Hero Display | 52–72px | 800 | -0.035em |
| Seksjontittel (H2) | 40–48px | 700 | -0.025em |
| Korttittel (H3) | 22–32px | 700 | -0.02em |
| Stat-tall (stor) | 26–64px | 800 | -0.025em, tabular-nums |
| Undertittel | 18–20px | 600 | -0.01em |
| Body | 16px | 400 | 0 |
| Small | 13–14px | 400–500 | 0 |
| Label/Caption | 9–11px | 600–700 | +0.05em, UPPERCASE |

### Regler:
- `font-variant-numeric: tabular-nums` på ALLE tall (handicap, kroner, prosent, SG)
- `text-wrap: balance` på alle overskrifter
- Aldri mer enn 3 ulike tekststørrelser på samme visning
- font-feature-settings: 'cv11' 1, 'ss01' 1 (aktiverer Inter-spesifikke alternater)

---

## 4. KOMPOSISJONSREGLER

> Dette er det som manglet. Disse reglene forhindrer «identiske hvite bokser overalt»-problemet.

### Regel 1: Aldri identisk grid
Hver side skal ha MINST to forskjellige kortstørrelser. Bruk bento-grid (2fr+1fr, 3fr+2fr) i stedet for flat 3-kolonne grid. Ett kort skal alltid være visuelt dominerende.

### Regel 2: Seksjonsvariasjon
Markedsside veksler mellom: lys (#FFF) → mørk (#1D1D1F) → grå (#F5F5F7) → fullbredde bilde → lys. Aldri to identiske bakgrunnsseksjoner etter hverandre.

### Regel 3: Data er design
Aldri vis bare et tall i plain text. Vis det som:
- Stat-card med sparkline (siste 7 datapunkter)
- Tall + trend-indikator (↑ 0.3 i grønn eller ↓ i rød)
- Progress bar eller gauge med «X av Y»
- Tall med label under, aldri ved siden av

### Regel 4: Empty states forteller en historie
Aldri bare ikon + tekst + knapp. I stedet:
- Vis en preview av hva siden ser ut med data (skjermbilde eller mock-data)
- Gi en onboarding-guide (3 steg for å komme i gang)
- Vis motiverende tekst som er kontekstspesifikk per side
- Bruk eksempeldata som er realistisk (ikke "Lorem ipsum")

### Regel 5: AI-elementer har visuell identitet
Alt AI-generert bruker:
- Bakgrunn: #EDF5F0 (grønn-light)
- ✦ sparkle-ikon foran label
- Label: «✦ AI-DREVET» eller «✦ AI-ANBEFALING» i uppercase, #2D6A4F
- Knapp: bg #2D6A4F, text hvit, rounded-[980px]
- **ALDRI lilla/purple**

### Regel 6: Bilder på markedsside, data i portal
- Markedsside: Profesjonelle fotografier er primært designelement
- Portal: INGEN fotografier. Kun data, grafer, ikoner og sparklines
- Admin: Samme som portal — data-tungt, ingen bilder

### Regel 7: Visuelt hierarki per side
Hver side har nøyaktig 3 nivåer:
1. **Hero-element** (40% av viewport) — det viktigste innholdet, størst og mest visuelt
2. **Primært innhold** (grid med variasjon) — bruk bento-layout
3. **Sekundært innhold** — quick actions, lenker, metadata

---

## 5. MARKEDSSIDE (akgolf.no)

### Seksjonstruktur

| # | Seksjon | Bakgrunn | Innhold |
|---|---------|----------|---------|
| 1 | Hero | Mørk (bilde/video) | Headline + CTA + coach-bilde |
| 2 | Social Proof Bar | #F5F5F7 | 4 stat-tall med count-up |
| 3 | Metode | #FFFFFF | Tekst venstre + bilde høyre (TrackMan synlig) |
| 4 | Bento Features | #FFFFFF / #F5F5F7 | SG-radar + AI-kort (grønn) + TrackMan-kort (mørkt) |
| 5 | Fullbredde bilde | Bilde | Overhead putting green, parallax |
| 6 | Mørk Stats | #1D1D1F | 3 massive tall med count-up |
| 7 | Coaching-tilbud | #FFFFFF | 3-kort grid med bilder |
| 8 | Testimonial | #F5F5F7 | Stort sitat + portrett |
| 9 | Coach | #FFFFFF | Bilde venstre + tekst høyre |
| 10 | CTA | #1D1D1F + bilde-overlay | Headline + 2 knapper |
| 11 | Footer | #1D1D1F | 4-kolonne grid |

### Mangler som skal legges til (fra samtale-beslutninger):
- **Device mockups** mellom seksjon 7 og 8: iPhone/laptop-frame som viser spillerportalen med reell data. Inspirert av Fitonist/Olymptrade.
- **Partner-bar** i seksjon 2 eller som egen seksjon: Logoer for TrackMan, WANG Toppidrett, Gamle Fredrikstad GK. Subtilt, grå logoer.
- **Interaktiv quiz** som valgfri tilleggsseksjon: «Hva er ditt mål?» → personlig anbefaling (The Grind-inspirert).

### Video i hero (primær, ikke alternativ):
- `<video autoPlay muted loop playsInline>` med poster-bilde som fallback
- Kort (15s loop) av coaching-økt, driving range, TrackMan i aksjon
- Poster: AK-Golf-Academy-18.jpg
- Hvis video ikke finnes ennå: bruk bilde med subtle Ken Burns-effekt (scale 1.0 → 1.05 over 15s)

### Knapper på markedsside:
- Primær CTA på mørk bg: hvit pill (bg-white, text-black)
- Primær CTA på lys bg: sort pill (bg-#1D1D1F, text-white)
- CTA «Book coaching»: grønn pill (bg-#2D6A4F, text-white) — KUN denne knappen
- Sekundær: ghost/outline (border #E8E8ED, text sort)

---

## 6. SPILLERPORTAL (/portal)

### Dashboard-layout (bento-grid)

```
┌──────────────┬──────────────┬──────────────┬─────────┐
│  Handicap    │ Treningsøkter│ Neste coach  │  Streak │
│  12.4        │  18          │  Fre 10:00   │  14 d   │
│  ↓ 0.3      │  ↑ 4 + spark │              │  🔥     │
├──────────────┴──────────────┼──────────────┴─────────┤
│  Strokes Gained (3fr)       │  AI-anbefaling (2fr)   │
│  4x SG-items i 2-kol grid  │  ✦ grønn bakgrunn      │
│  Grønn pos / Rød neg       │  Fokus-anbefaling      │
├─────────────────────────────┴────────────────────────┤
│  Ukens plan (full bredde)                            │
│  Man–Lør med status-tags                             │
├──────────────┬──────────────┬────────────────────────┤
│  Logg runde  │  Logg økt    │  Book coaching         │
│  Quick action│  Quick action│  Quick action           │
└──────────────┴──────────────┴────────────────────────┘
```

### Stat-cards:
- Hvit bakgrunn, border #E8E8ED, rounded-[14px], padding 16px
- Label: 10px uppercase #86868B, letter-spacing 1px
- Verdi: 26px weight 800, tabular-nums
- Trend: 11px weight 600, grønn (#2D6A4F) for positiv, rød (#D14343) for negativ
- Sparkline: 7 bars, 2px gap, siste bar i #2D6A4F, resten i #E8E8ED

### Streak-kort:
- Spesial-bakgrunn: #FFFBF5, border #F5E6CC
- Flamme-ikon (Lucide `Flame`, IKKE emoji)
- Tall stort, «dager streak» som label

### Strokes Gained-kort:
- 2x2 grid med SG-items
- Hver item: bakgrunn #F5F5F7, rounded-8px, flex space-between
- Kategorinavn venstre (12px weight 600 #48484A)
- Verdi høyre (14px weight 700, grønn for +, rød for –)
- Bruk korrekte SLAG-kategorier: Off the Tee, Approach, Around Green, Putting

### AI-anbefaling-kort:
- Bakgrunn: #EDF5F0 (IKKE lilla)
- Border: #D2D2D7
- Badge: «✦ AI-ANBEFALING» 9px uppercase #2D6A4F
- Tekst: 13px #48484A med `<strong>` i sort for nøkkelsetninger
- Knapp: bg #2D6A4F, text hvit, rounded-[980px], 11px weight 600

### Ukens plan:
- Kompakt liste: dag (11px) + aktivitet (13px) + status-tag
- Dagens rad: bakgrunn #EDF5F0, dag i #2D6A4F
- Tags: ✓ Fullført (grønn-light bg, grønn tekst), I dag (grønn bg, hvit tekst), Planlagt (#F5F5F7 bg, grå tekst), Coaching (blå #EFF6FF bg, #2563EB tekst)

### Quick actions:
- 3-kolonne grid, hvit kort, rounded-14px, border
- Ikon i 36px sirkel (bakgrunn #F5F5F7), Lucide-ikon (IKKE emoji)
- Navn 12px weight 600, beskrivelse 10px grå

### Sidebar:
- Hvit bakgrunn, border-right #E8E8ED
- 220px bredde
- Logo øverst: AK-monogram SVG + «AK Golf» / «Academy»
- Meny-items: 13px weight 500 #6E6E73, aktiv: bg #F5F5F7, tekst #1D1D1F weight 600
- Ikon-plassholders: 18x18 rounded-5px, aktiv = sort bg
- Seksjon-labels: 9px uppercase #D2D2D7
- Bruker-kort nederst: avatar (sort sirkel, hvit initialer) + navn + tier i grønn

---

## 7. MISSION CONTROL (/portal/admin)

### Dashboard-layout

```
┌─────────────────────────────────────────────────────┐
│  Header: «Mission Control» + «Uke 14 · April 2026» │
│  [+ Ny booking] sort pill-knapp                     │
├──────────┬──────────┬──────────┬────────────────────┤
│ Bookinger│ Revenue  │ Aktive   │ Oppmøterate        │
│ 12       │ 45 200kr │ 8        │ 94%                │
│ ↑ 3      │ +bars    │ ↑ 2 nye  │ ↑ 2%               │
├──────────┴──────────┼──────────┴────────────────────┤
│ Dagens timeplan     │ Siste aktivitet               │
│ Radliste med type-  │ Fargede prikker per type:     │
│ tags (indiv/gruppe/ │ blå=booking, grønn=data,      │
│ junior/ledig)       │ grønn=betaling                │
├─────────────────────┴───────────────────────────────┤
│ Elever — krever oppmerksomhet                       │
│ Avatar + navn + meta + status-badge                 │
│ (risk=rød, warn=oransje, ok=grønn)                  │
└─────────────────────────────────────────────────────┘
```

### Admin-spesifikke elementer:

**Timeplan:**
- Radliste: tid (40px, tabular-nums, #86868B) + type-tag + navn
- Type-tags: Indiv. (blå #EFF6FF/#2563EB), Gruppe (grønn #EDF5F0/#2D6A4F), Junior (oransje #FFFBEB/#B45309), Ledig (grå #F5F5F7/#86868B)

**Revenue-bars:**
- Mini bar-chart i stat-card, 4 bars
- Nåværende måned: #2D6A4F, forrige: #E8E8ED
- Høyde representerer relativ verdi

**Aktivitetslogg:**
- Fargede prikker (7px) per type: #2563EB (booking), #2D6A4F (data/betaling)
- Tekst: 12px #6E6E73, `<strong>` i sort for navn/beløp
- Tidsstempel: 10px #D2D2D7

**Elev-status-badges:**
- Risiko: bg #FEF2F2, tekst #D14343 — «Inaktiv»
- Varsel: bg #FFFBEB, tekst #B45309 — «Streak brutt»
- OK: bg #EDF5F0, tekst #2D6A4F — «Mål nådd ✓»

### Admin sidebar:
- Samme struktur som portal, men:
  - Logo med GRÅ prikk (neutral variant)
  - Subtekst: «Mission Control» i stedet for «Academy»
  - Meny: Oversikt, Denne uken, Elever, Bookinger, Kalender, Meldinger, Analytics, Økonomi
  - Bruker-tier: «Admin» i sort (ikke grønn)

---

## 8. MOBIL / PWA

### Layout:
- Status bar øverst (9:41, standard iOS)
- Greeting-seksjon: hvit bakgrunn, H3 18px + dato 11px grå
- Stat-kort: 2-kolonne grid, 8px gap, hvit kort med border, rounded-12px
- Dag-kort: kompakt med dagens aktivitet
- AI-kort: #EDF5F0 bakgrunn, kompakt versjon
- Bottom navigation: 5 items (Hjem, Plan, Logg, Stats, Mer)

### Bottom nav:
- Aktiv tab: sort ikon + grønn prikk under (2px)
- Inaktiv: #86868B
- Touch targets: minimum 44x44px

### Mobile-spesifikke regler:
- Alle stat-tall: maks 22px (ikke 26px som desktop)
- Pull-to-refresh på dashboard
- Ingen sidebar — alt via bottom nav
- Card-padding: 14px (ikke 18px)

---

## 9. EMPTY STATES

> Aldri bare ikon + tekst + knapp. Hver empty state er unik.

| Side | Nåværende (FEIL) | Nytt (RIKTIG) |
|------|-------------------|---------------|
| Dashboard | «Velkommen!» + 3 tomme kort | Mock-dashboard med eksempeldata + «Slik ser det ut etter første uke» |
| Treningsplan | Kalender-ikon + «Ingen plan» | 3-stegs onboarding: 1) Book coaching 2) Få plan 3) Følg opp |
| Statistikk | Graf-ikon + «Ingen data» | Eksempel SG-radar med «Logg din første runde for å se dine tall» |
| Dagbok | Bok-ikon + «Tom dagbok» | «Din treningsdagbok starter her» + første logg-skjema inline |
| Coaching-historikk | Klokke-ikon + «Ingen økter» | Neste ledige tid + «Book din første økt» med coach-portrett |

### Regler for empty states:
- Vis alltid en «preview» av hva siden blir med data
- Aldri vis «0» alene — vis «0 av 10 økter» med en tom progress bar
- Onboarding-steg skal være nummererte (1, 2, 3) med tydelig neste-handling
- Bruk kontekstspesifikk tekst — aldri generisk «Ingenting å vise»

---

## 10. BILDESTRATEGI

### Markedsside — profesjonell dokumentarstil:
- Naturlig lys, grunn dybdeskarphet, norsk natur
- Alle bilder fra fotografering på GFGK
- Hero: svart gradient-overlay (40% topp → 70% bunn), tekst i hvitt over
- Alle bilder: border-radius 16px (unntatt fullbredde-seksjoner)
- Aldri bruk filter, fargeoverlays, vignetter eller AI-genererte bilder

### Portal og admin — ingen bilder:
- Kun data, grafer, Lucide-ikoner og sparklines
- Aldri golfbilder i portalen — det distraherer fra dataen

### Bildekategorier:
- **Hero:** Brede coaching-scener med gyllent lys (#18, #19, #31)
- **Coaching i aksjon:** Coach og spiller i samspill (#1, #7, #11, #12, #44)
- **Portretter:** Coach og spiller separat (#9, #10, #32, #37)
- **Detalj/atmosfære:** Close-ups av utstyr (#6, #15, #16, #17, #34)
- **Walking:** To figurer på fairway (#30, #31, #35, #36)

---

## 11. KNAPPER

| Type | Bakgrunn | Tekst | Border | Bruk |
|------|----------|-------|--------|------|
| Primær (lys bg) | #1D1D1F | #FFFFFF | ingen | Standard handling |
| Primær (mørk bg) | #FFFFFF | #1D1D1F | ingen | Hero, footer, mørke seksjoner |
| CTA «Book» | #2D6A4F | #FFFFFF | ingen | KUN for «Book coaching» |
| AI-action | #2D6A4F | #FFFFFF | ingen | «Generer plan», «AI-anbefaling» |
| Sekundær | transparent | #1D1D1F | 1px #E8E8ED | Alle andre handlinger |
| Ghost (mørk bg) | transparent | rgba(255,255,255,0.45) | 1px rgba(255,255,255,0.25) | Sekundær på mørk bg |

- Alle knapper: rounded-[980px] (pill), Inter, weight 600
- Padding: 12px 28px (standard), 8px 20px (liten/nav), 14px 32px (stor/CTA)

---

## 12. ANIMASJON (Framer Motion)

### Scroll-reveal:
```typescript
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
```
- Delay: 0.08s mellom siblings (stagger)
- Duration: 0.4–0.7s
- Easing: [0.4, 0, 0.2, 1]

### Regler:
- Alltid respekter `prefers-reduced-motion`
- Aldri `transition-all` — spesifiser properties
- Count-up på tall ved scroll (useSpring / animate)
- Hover på kort: translateY(-4px), shadow-lg, 300ms ease
- Nav: bg-transparent → bg-white/80 backdrop-blur-xl on scroll

---

## 13. TERMINOLOGI (VIKTIG)

| Feil | Riktig |
|------|--------|
| Elev | Spiller |
| Kortspill | Nærspill |
| Utslag (som kategori) | Tee Total |
| «Revolusjonerende» | Fjern helt |
| PGA-sertifisert | Aldri nevn |

### SLAG-kategorier (korrekte norske/engelske termer):
- Off the Tee / Tee Total (26% SG)
- Approach (17% SG)
- Around the Green / Nærspill (17% SG)
- Putting (40% SG)

---

## 14. ALDRI / ALLTID — KOMPLETT SJEKKLISTE

### ALDRI:
- Emojier i tekst eller UI (bruk Lucide-ikoner)
- MVA-informasjon på kundesider
- Trenersertifiseringer (PGA, TrackMan Certified)
- Lilla/purple for AI — bruk grønn
- Bronse/gull (#B07D4F)
- Identisk grid med identiske kort (varier alltid)
- Empty states med bare ikon + tekst + knapp
- Vise bare «0» uten kontekst
- Stock-bilder, AI-genererte bilder, Unsplash
- transition-all
- Dark mode i portal
- Fargerike gradienter
- Neon-farger eller multi-aksent

### ALLTID:
- Norsk bokmål
- Priser i hele kroner (ikke øre)
- «Ingen binding» ved abonnement
- Bento-grid med varierende kortstørrelser
- Sparklines og trender på stat-cards
- Data med kontekst («12 av 20 økter» ikke «12»)
- tabular-nums på alle tall
- border-radius 14px på kort, 980px på knapper, 16px på bilder
- Alt-tekster på alle bilder
- Minimum 44x44px touch targets

---

## 15. GLOBALS.CSS — OPPDATERINGER

Legg til disse variablene hvis de mangler:

```css
/* ═══ Brand-aksent ═══ */
--color-green: #2D6A4F;
--color-green-dark: #1B4332;
--color-green-bright: #40916C;
--color-green-light: #EDF5F0;

/* ═══ Semantisk ═══ */
--color-error: #D14343;
--color-warning: #E89C30;
--color-coaching: #2563EB;
--color-coaching-light: #EFF6FF;

/* ═══ FJERN DISSE (utdaterte) ═══ */
/* --color-brand: #15803D — FEIL, bruk #2D6A4F */
/* --color-brand-vivid: #22C55E — FEIL, bruk #40916C */
/* --color-ai: #AF52DE — FEIL, AI bruker grønn */
/* --color-ai-light: #FAF5FF — FEIL, bruk #EDF5F0 */
/* --apple-gold-* — aldri definert, fjern */
/* --color-ink-* — ingen dark mode */
```

---

## 16. CLAUDE.md — NY DESIGNLINJE

Erstatt den eksisterende designlinjen med:

```
Design: Se docs/ART-DIRECTION.md for komplett visuell spesifikasjon.
Farger: «Sort. Hvit. Én grønn.» — #1D1D1F base + AK Green #2D6A4F.
Logo: AK-monogram SVG med grønn signalprikk. I nav: SVG + «Golf» Inter 500.
Font: Inter med dramatisk størrelsesvariasjon (11px → 72px).
AI-elementer: Grønn (#2D6A4F / #EDF5F0), ALDRI lilla/purple.
Komposisjon: Bento-grid med varierende kortstørrelser. Aldri identisk grid.
Data: Alltid med sparkline, trend og kontekst. Aldri bare et tall.
Empty states: Aldri generisk ikon+tekst+knapp. Vis preview, onboarding, eksempeldata.
Bilder: Kun på markedsside (profesjonell fotografering). Portal = kun data og ikoner.
```
