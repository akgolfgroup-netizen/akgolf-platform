# AK Golf — Art Direction

> Erstatter tidligere versjon. Oppdatert 2026-04-04.
> Dette dokumentet er autoritativt for alle visuelle beslutninger i plattformen.

---

## VISUELL RETNING

**En setning:** Profesjonell autoritet i light mode.

Ikke luxury-fashion. Ikke tech-cockpit. En ekspert som kommuniserer gjennom kvalitet og ro — som en velkledd golfinstruktoer som ikke trenger a overbevise deg, du ser det bare.

**Referanser:**
- Markedsside: The Grind + Blanca Padel (video hero, seksjonsvariasjon, stor typografi)
- Spillerportal: Pulse Tennis + OrbitAI + Sandow (bento-grid, data som design, progress overalt)
- Mission Control: Fitonist Admin + CRM Dashboard (analytics-tunge kort, sparklines, heatmaps)
- Mobil: Fitonist App + 4goal (kompakt, touch-first, bottom nav)

---

## 1. FARGESYSTEM — "Sort. Hvit. En gronn."

Sort, hvit og gra gjoer 95% av jobben. Den ene groennen (#2D6A4F) er brand-signaturen — logoprikk, CTA, nav-aksent.

**Semantiske farger foelger Apple-standard.** Groennen er BRAND, ikke SUCCESS.

### Grunnpalett

| Token | Hex | Bruk |
|-------|-----|------|
| Black | #1D1D1F | Primaertekst, overskrifter, knapper |
| Grey-600 | #48484A | Broedtekst |
| Grey-500 | #6E6E73 | Sekundaertekst |
| Grey-400 | #86868B | Labels, placeholders, muted tekst |
| Grey-300 | #D2D2D7 | Deaktiverte elementer, dividers |
| Grey-200 | #E8E8ED | Borders, separatorer |
| Grey-100 | #F5F5F7 | Sekundaer bakgrunn, hover, cards |
| White | #FFFFFF | Primaer bakgrunn |

### Brand-aksent — AK Green (uendret)

| Token | Hex | Bruk |
|-------|-----|------|
| --color-brand-dark | #1B4332 | Hover pa groennelementer |
| --color-brand | #2D6A4F | Logoprikken. Brand-aksent. CTA "Book coaching". |
| --color-green-bright | #40916C | Eyebrow-tekst, hero-aksent |
| --color-brand-light | #EDF5F0 | Brand-bakgrunn (ikke AI!) |

### Semantiske farger (Apple-standard)

| Token | Hex | Bruk |
|-------|-----|------|
| --color-success | #34C759 | Positive trender, fullfoert, checkmarks |
| --color-success-light | #F0FDF4 | Bakgrunn for positive elementer |
| --color-success-text | #166534 | Tekst pa success-bakgrunn |
| --color-error | #FF3B30 | Negative trender, feil, avlysninger |
| --color-error-light | #FEF2F2 | Bakgrunn for feil |
| --color-error-text | #991B1B | Tekst pa error-bakgrunn |
| --color-warning | #FF9500 | Streak-brudd, paminnelser, frister |
| --color-warning-light | #FFFBEB | Bakgrunn for advarsler |
| --color-warning-text | #92400E | Tekst pa warning-bakgrunn |
| --color-info | #007AFF | Informasjon, lenker |
| --color-coaching | #2563EB | Coaching-bookinger i kalender (KUN i portal) |

### AI-elementer — Lilla (NYTT)

| Token | Hex | Bruk |
|-------|-----|------|
| --color-ai | #AF52DE | AI-ikoner, badges, knapper |
| --color-ai-light | #FAF5FF | Bakgrunn for AI-generert innhold |
| --color-ai-text | #6B21A8 | Tekst pa AI-bakgrunn |

Alt AI-generert bruker:
- Bakgrunn: var(--color-ai-light)
- Sparkle-ikon foran label
- Label: "AI-DREVET" eller "AI-ANBEFALING" i uppercase, var(--color-ai-text)
- Knapp: bg var(--color-ai), text hvit, rounded-[980px]

### Logo-prikk — groenn som default

| Variant | Monogram | Prikk | Kontekst |
|---------|----------|-------|----------|
| Primary | Sort (#1D1D1F) | Groenn (#2D6A4F) | Lys bakgrunn — HOVEDLOGO |
| Inverted | Hvit (#FFFFFF) | Groenn (#40916C) | Moerk bakgrunn (hero, footer) |
| Neutral | Sort (#1D1D1F) | Gra (#D2D2D7) | Diskre (faktura, kontrakt, admin) |

### WCAG kontrast-notat

#34C759 (success groenn) har 3.3:1 kontrast mot hvit — **under AA for tekst**. Regler:
- Bruk #34C759 KUN for ikoner, badges, bakgrunner
- Bruk --color-success-text (#166534) for all tekst pa lys bakgrunn
- Bruk --color-success-light (#F0FDF4) som bakgrunn med --color-success-text for tekst

### ALDRI bruk:
- Bronse/gull (#B07D4F)
- Neon-farger, gradienter, multi-aksent
- Bla som generell aksent — reservert for coaching-bookinger og tekstlenker
- --color-brand/#2D6A4F for SUCCESS-indikatorer — bruk --color-success

---

## 2. LOGO-SYSTEM

AK-monogram i SVG. Default prikk er gra (#D2D2D7).

### I navigasjon:
`[AK-monogram SVG] + "Golf" i Inter 500, farge #86868B`

### I portal sidebar:
`[AK-monogram SVG] + "AK Golf" (bold) / "Academy" (uppercase 9px #86868B)`

### I admin sidebar:
`[AK-monogram SVG med gra prikk] + "AK Golf" (bold) / "Mission Control" (uppercase 9px #86868B)`

---

## 3. TYPOGRAFI

Inter med dramatisk stoerrelsesvariasjon. Letter-spacing strammer jo stoerre teksten er.

| Element | Stoerrelse | Vekt | Letter-spacing |
|---------|-----------|------|----------------|
| Hero Display | 52-72px | 800 | -0.035em |
| Seksjontittel (H2) | 40-48px | 700 | -0.025em |
| Korttittel (H3) | 22-32px | 700 | -0.02em |
| Stat-tall (stor) | 26-64px | 800 | -0.025em, tabular-nums |
| Undertittel | 18-20px | 600 | -0.01em |
| Body | 16px | 400 | 0 |
| Small | 13-14px | 400-500 | 0 |
| Label/Caption | 9-11px | 600-700 | +0.05em, UPPERCASE |

### Regler:
- `font-variant-numeric: tabular-nums` pa ALLE tall (handicap, kroner, prosent, SG)
- `text-wrap: balance` pa alle overskrifter
- Aldri mer enn 3 ulike tekststoerrrelser pa samme visning
- font-feature-settings: 'cv11' 1, 'ss01' 1 (aktiverer Inter-spesifikke alternater)

---

## 4. KOMPOSISJONSREGLER

### Regel 1: Aldri identisk grid
Hver side skal ha MINST to forskjellige kortstoerrrelser. Bruk bento-grid (2fr+1fr, 3fr+2fr) i stedet for flat 3-kolonne grid.

### Regel 2: Seksjonsvariasjon
Markedsside veksler mellom: lys (#FFF) -> moerk (#1D1D1F) -> gra (#F5F5F7) -> fullbredde bilde -> lys.

### Regel 3: Data er design
Aldri vis bare et tall i plain text. Vis med sparkline, trend-indikator, eller progress bar.

### Regel 4: Empty states forteller en historie
Aldri bare ikon + tekst + knapp. Vis preview med mock-data, onboarding-guide, eller kontekstspesifikk tekst.

### Regel 5: AI-elementer har visuell identitet
Alt AI-generert bruker lilla (--color-ai) tokens. Se seksjon 1.

### Regel 6: Bilder pa markedsside, data i portal
- Markedsside: Profesjonelle fotografier er primaert designelement
- Portal/Admin: INGEN fotografier. Kun data, grafer, ikoner og sparklines

### Regel 7: Visuelt hierarki per side
Hver side har noeyaktig 3 nivaer:
1. **Hero-element** (40% av viewport)
2. **Primaert innhold** (grid med variasjon)
3. **Sekundaert innhold** (quick actions, lenker, metadata)

---

## 5. MARKEDSSIDE (akgolf.no)

### Knapper pa markedsside:
- Primaer CTA pa moerk bg: hvit pill (bg-white, text-black)
- Primaer CTA pa lys bg: sort pill (bg-#1D1D1F, text-white)
- CTA "Book coaching": groenn pill (bg var(--color-brand), text-white) — KUN denne knappen
- Sekundaer: ghost/outline (border #E8E8ED, text sort)

---

## 6. SPILLERPORTAL (/portal)

### Stat-cards:
- Hvit bakgrunn, border #E8E8ED, rounded-[14px], padding 16px
- Label: 10px uppercase #86868B, letter-spacing 1px
- Verdi: 26px weight 800, tabular-nums
- Trend: 11px weight 600, var(--color-success) for positiv, var(--color-error) for negativ
- Sparkline: 7 bars, 2px gap, siste bar i var(--color-success), resten i #E8E8ED

### Streak-kort:
- Spesial-bakgrunn: #FFFBF5, border #F5E6CC
- Flamme-ikon (Lucide `Flame`, IKKE emoji)

### Strokes Gained-kort:
- Verdi: var(--color-success) for +, var(--color-error) for -

### AI-anbefaling-kort:
- Bakgrunn: var(--color-ai-light)
- Badge: "AI-ANBEFALING" 9px uppercase var(--color-ai-text)
- Knapp: bg var(--color-ai), text hvit, rounded-[980px]

### Ukens plan:
- Dagens rad: bakgrunn var(--color-success-light)
- Tags: Fullfoert (success-light bg, success-text), I dag (success bg, hvit), Planlagt (#F5F5F7 bg, gra), Coaching (bla #EFF6FF bg, #2563EB tekst)

---

## 7. MISSION CONTROL (/portal/admin)

### Admin-spesifikke farger:
- MC AI: var(--mc-color-ai) = #AF52DE (lilla)
- MC Success: var(--mc-success-bg) / var(--mc-success-text)
- Revenue-bars: naavaerende = var(--color-brand), forrige = #E8E8ED

### Elev-status-badges:
- Risiko: bg var(--color-error-light), tekst var(--color-error) — "Inaktiv"
- Varsel: bg var(--color-warning-light), tekst #B45309 — "Streak brutt"
- OK: bg var(--color-success-light), tekst var(--color-success-text) — "Mal nadd"

---

## 8. MOBIL / PWA

- Bottom nav: Aktiv tab = sort ikon + groenn prikk under (2px)
- Alle stat-tall: maks 22px
- Pull-to-refresh pa dashboard
- Card-padding: 14px
- Touch targets: minimum 44x44px

---

## 9. KNAPPER

| Type | Bakgrunn | Tekst | Bruk |
|------|----------|-------|------|
| Primaer (lys bg) | #1D1D1F | #FFFFFF | Standard handling |
| Primaer (moerk bg) | #FFFFFF | #1D1D1F | Hero, footer |
| CTA "Book" | var(--color-brand) | #FFFFFF | KUN for "Book coaching" |
| AI-action | var(--color-ai) | #FFFFFF | "Generer plan", "AI-anbefaling" |
| Sekundaer | transparent | #1D1D1F | Andre handlinger |

Alle knapper: rounded-[980px] (pill), Inter, weight 600

---

## 10. ANIMASJON (Framer Motion)

- Scroll-reveal: opacity 0->1, y 20->0, stagger 0.08s, duration 0.4-0.7s
- Easing: [0.4, 0, 0.2, 1]
- Respekter `prefers-reduced-motion`
- Aldri `transition-all` — spesifiser properties
- Hover pa kort: translateY(-4px), shadow-lg, 300ms ease

---

## 11. TERMINOLOGI

| Feil | Riktig |
|------|--------|
| Elev | Spiller |
| Kortspill | Naerspill |
| Utslag (som kategori) | Tee Total |
| "Revolusjonerende" | Fjern helt |
| PGA-sertifisert | Aldri nevn |

### SLAG-kategorier:
- Off the Tee / Tee Total (26% SG)
- Approach (17% SG)
- Around the Green / Naerspill (17% SG)
- Putting (40% SG)

---

## 12. ALDRI / ALLTID

### ALDRI:
- Emojier i tekst eller UI (bruk Lucide-ikoner)
- MVA-informasjon pa kundesider
- Trenersertifiseringer
- Bronse/gull (#B07D4F)
- Identisk grid med identiske kort
- Empty states med bare ikon + tekst + knapp
- Stock-bilder, AI-genererte bilder
- transition-all
- Dark mode i portal
- Fargerike gradienter
- #2D6A4F for success — bruk #34C759

### ALLTID:
- Norsk bokmal
- Priser i hele kroner
- "Ingen binding" ved abonnement
- Bento-grid med varierende kortstoerrrelser
- Sparklines og trender pa stat-cards
- Data med kontekst ("12 av 20 oekter" ikke "12")
- tabular-nums pa alle tall
- border-radius 14px pa kort, 980px pa knapper
- Alt-tekster pa alle bilder
- Minimum 44x44px touch targets
- AI-elementer i lilla (--color-ai), aldri groenn
