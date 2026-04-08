# Academy Dashboard Prompt for Stitch

## 🎯 Hva du skal generere:
Et Academy Dashboard for AK Golf-spillere med eksisterende komponenter fra repoet.

---

## Prompt til Kimi CLI:

```
Generer Academy dashboard-screen basert på .stitch/DESIGN.md og eksisterende komponenter i repoet.

**Layout (Bento-grid med variasjon):**

### 1. Header Section
- "Hei, [Navn]" (H2, 32px, weight 700)
- Dato: "Mandag 6. april 2026" (grey-500, 14px)
- Velkomstmelding: "Klar for å heve spillet ditt i dag?" (grey-600)

### 2. Quick Stats Row (4 KPI cards i bento 2x2 på mobil, 4-col på desktop)

Kort 1 - Score (Stort kort):
- Label: "SNITT SCORE" (10px, uppercase, grey-400, tracking-wide)
- Value: "72.4" (32px, weight 800, tabular-nums, black)
- Trend: "↗ 2%" (11px, success-text) + "vs forrige uke"
- Sparkline: 7-dagers mini-graf (AreaChart fra recharts)
- Icon: Target (Lucide, grey-500)
- Bakgrunn: white, border #E8E8ED, rounded-[14px]

Kort 2 - Handicap (Stort kort):
- Label: "HANDICAP" (10px, uppercase, grey-400)
- Value: "12.4" (32px, weight 800, tabular-nums)
- Trend: "↘ 0.3" (11px, success-text, grønn = bedre)
- Sparkline: 7-dagers trend
- Icon: Trophy (Lucide)
- Bakgrunn: white, border #E8E8ED, rounded-[14px]

Kort 3 - Streak (Liten kort):
- Label: "STREAK" (10px, uppercase, grey-400)
- Value: "7" (28px, weight 800)
- Subtext: "dager" (grey-500, 13px)
- Icon: Flame (Lucide, #FF9500/orange)
- 14-dagers visualisering: 14 små søyler, aktiv = #2D6A4F, inaktiv = #E8E8ED
- Bakgrunn: #FFFBF5 (cream), border: #F5E6CC, rounded-[16px]

Kort 4 - Siste økt (Liten kort):
- Label: "SISTE ØKT" (10px, uppercase, grey-400)
- Value: "2d" (28px, weight 800)
- Subtext: "siden" (grey-500)
- Mini info: "Putting drill" (grey-600, 12px)
- Icon: Calendar (Lucide)
- Bakgrunn: white, border #E8E8ED, rounded-[14px]

### 3. AI Insight Card (Bredt kort, full width)
- Header: 
  * Icon: Sparkles (Lucide) i #AF52DE (AI-lilla)
  * Badge: "AI-ANBEFALING" (9px, uppercase, #6B21A8)
  * "Ny" badge hvis < 24 timer
- Tittel: "Fokuser på putting denne uken" (16px, weight 600)
- Tekst: "Din putting-statistikk viser at 40% av slagene dine er innen 2 meter. Øv på 3-5 meter putter for å senke scoren."
- "Ukentlig fokus" seksjon:
  * Icon: Lightbulb (amber-500)
  * Label: "UKENTLIG FOKUS" (10px, uppercase, grey-700)
  * Tekst: "3-5 meter putting"
- CTA button: "Se treningsplan" (bg #AF52DE, text white, rounded-full)
- Ekspanderbar: "Se styrker og forbedringspunkter" med ChevronDown/Up
- Bakgrunn: #FAF5FF (AI-light), border #E8E8ED, rounded-2xl

### 4. Upcoming Bookings Section (Medium bredde)
- Header: "Kommende bookinger" (H3, 18px, weight 700)
- "Se alle →" link (høyrejustert)
- 2 booking cards:
  * Card 1:
    - Dato: "Tir 8. apr" (14px, weight 600)
    - Tid: "09:00 - 09:20"
    - Trener: "Anders Kristiansen"
    - Type: "Coaching 20 min"
    - Status badge: "Bekreftet" (success-light bg, success-text)
    - Icon: CalendarCheck
  * Card 2:
    - Dato: "Fre 11. apr"
    - Tid: "14:00 - 14:50"
    - Trener: "Anders Kristiansen"
    - Type: "Flex 50 Solo"
    - Status badge: "Betalt"
- Hver card: white bg, border #E8E8ED, rounded-xl, padding 16px
- Hover: translateY(-2px), shadow-sm

### 5. Training Plan Preview (Bredt kort)
- Header: "Ukens plan" (H3, 18px, weight 700)
- Subheader: "Grunnperiode · Uke 14 / 2026" (grey-500, 12px)
- "Åpne planlegger →" link (høyrejustert)
- 7 dag-kort (Man-Søn) i horizontal scroll på mobil, grid på desktop:
  * Hver dag: 80px bred, rounded-xl
  * Status-farger:
    - Done: bg #EDF5F0, "Fullført" text
    - Today: bg #1D1D1F, text white, "I DAG" badge
    - Rest: bg #F5F5F7, "Hvile" text
    - Upcoming: bg white, border #E8E8ED
  * Dag-navn: 10px uppercase
  * Dato: 12px
  * Øvelser: små tags med fargekoding:
    - Fys: #FF9500 (orange)
    - Tek: #007AFF (blue)
    - Slag: #2D6A4F (green)
    - Spill: #AF52DE (purple)
    - Turn: #1D1D1F (black)
- Fordelings-bar (pyramide):
  * "Fordeling:" label
  * 5 farger med prosenter: FYS 15%, TEK 25%, SLAG 35%, SPILL 20%, TURN 5%
  * Horizontal progress bar med 5 fargede segmenter

### 6. Quick Actions (Bunn)
- 3 knapper i rad:
  * "Logg økt" (primary, black bg, white text, rounded-full)
  * "Book coaching" (brand green bg, white text, rounded-full)
  * "Se statistikk" (secondary, white bg, border, rounded-full)

**Design System (fra .stitch/DESIGN.md):**
- Platform: Web, Desktop-first, responsive
- Palette: 
  - Black #1D1D1F (tekst, knapper)
  - White #FFFFFF (bakgrunn)
  - Grey-100 #F5F5F7, Grey-200 #E8E8ED, Grey-500 #6E6E73
  - Brand Green #2D6A4F (CTA, logo)
  - AI Lavender #AF52DE (AI-innhold)
  - Success #34C759, Warning #FF9500, Error #FF3B30
- Cards: White bg, 1px border #E8E8ED, rounded-[14px] eller rounded-2xl
- Typography: Inter, dramatic sizing (10px → 32px), tight letter-spacing på headings
- Buttons: rounded-full (980px), Inter 600
- Icons: Lucide React (Target, Trophy, Flame, Calendar, Sparkles, Lightbulb, ChevronDown, ArrowRight)
- Spacing: 8px base unit (8, 16, 24, 32px)
- Bento-grid: Varierende kortstørrelser, aldri identisk grid
- Data-driven: Sparklines på alle tall, trends med piler og farger
- Animations: Framer Motion, easeOut, 0.5s duration

**Eksisterende komponenter å matche:**
- KpiStrip: grid grid-cols-2 md:grid-cols-4, portal-card klasse
- AiInsightCard: bg #FAF5FF, Sparkles icon, ekspanderbar
- StreakCard: bg #FFFBF5, 14-dagers søyle-visualisering
- WeeklyPlanCard: 7 kolonner dag-kort, pyramide-fordelings-bar
```

---

## 📋 Eksisterende komponenter i repoet

Jeg fant disse komponentene du allerede har:

| Komponent | Fil | Beskrivelse |
|-----------|-----|-------------|
| **KpiStrip** | `components/portal/dashboard/kpi-strip.tsx` | 4 KPI cards med ikoner og animerte tall |
| **AiInsightCard** | `components/portal/dashboard/ai-insight-card.tsx` | AI-innsikt med Sparkles, ekspanderbar |
| **StreakCard** | `components/portal/dashboard/streak-card.tsx` | Streak med Flame icon, 14-dagers bar |
| **WeeklyPlanCard** | `components/portal/dashboard/weekly-plan-card.tsx` | 7 dag-kort med pyramide-fordeling |
| **Sparkline** | `components/portal/dashboard/sparkline.tsx` | Mini AreaChart for trends |

**Portal card klasse (fra globals.css):**
```css
.portal-card {
  background: var(--portal-card-bg);
  border: 0.5px solid var(--portal-card-border);
  border-radius: 20px;
  padding: 24px;
}
```

---

## 🚀 Hvordan bruke:

1. Åpne terminal i VS Code:
   ```bash
   npm run kimi
   ```

2. I Kimi-terminalen:
   ```
   /project /Users/anderskristiansen/Developer/akgolf/akgolf-platform
   ```

3. Lim inn prompten ovenfor

4. Stitch genererer dashboardet med AK Golf design system!

---

## 📝 Etter generering:

Når Stitch har generert designet, kan du be om:
- "Eksporter som React komponent"
- "Lag dark mode variant"
- "Juster farger til å matche .stitch/DESIGN.md"
- "Gjør kortene mer kompakte på mobil"
