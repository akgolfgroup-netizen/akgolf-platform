# AK Golf Platform — Design System v3.0

> **Single Source of Truth for all frontend design.**  
> Når du bygger UI i dette prosjektet, skal denne filen være din eneste design-referanse.  
> Ikke bruk gamle `design-ref/*.html`, `stitch-v2/*.html`, eller utdaterte markdown-filer.

---

## 1. Designfilosofi: "The Curated Laboratory"

Grensesnittet vårt balanserer **heritage warmth** (varme, menneskelige overflater) med **scientific rigor** (presisjon, data-drevet tydelighet).

### 5 ufravikelige prinsipper

1. **Hvit canvas, aldri flat.**  
   Bakgrunn er alltid lys. Kort og innhold "løfter" seg gjennom radius, skygge og bakgrunnsforskjeller — ikke gjennom flate farger.

2. **Bento-grid med bevisst asymmetri.**  
   Informasjon skal kompartmentaliseres i diskrete, vakre beholdere med varierende skala og tetthet. Store, selvsikre negative rom.

3. **Ingen 1px borders for seksjonering.**  
   Grenser skapes gjennom *background shifts* og *tonal transitions*. Hvis en border er absolutt nødvendig, skal den være subtil (`border-grey-200` eller `rgba(0,0,0,0.06)`).

4. **Typografisk kontrast.**  
   Store tall (28–44px+) med små labels (10–12px uppercase) under. Aldri middels alt.

5. **Komponent-first.**  
   En side skal KUN sette sammen godkjente komponenter. Ingen inline-styling. Ingen ad-hoc Tailwind-klasser utenfor komponentdefinisjon.

---

## 2. Farger & Tokens

### Kjernepalett (Brand Guide V2.0)

| Token | Hex | Bruk |
|-------|-----|------|
| `--color-primary` | `#154212` | Primær skoggrønn. Knapper, logo, viktige aksenter. |
| `--color-secondary` / `--color-accent-cta` | `#d2f000` / `#D1F843` | CTA, badges, highlights. Høy energi. |
| `--color-text` | `#1c1c16` | Hovedtekst. Aldri ren svart. |
| `--color-background-beige` / `--color-alabaster` | `#fdf9f0` | Varm landingsside-bakgrunn. |
| `--color-surface` | `#f7f3ea` | Sekundære overflater, insets. |

### Gråskala (grønntonet, brand-avledet)

| Token | Hex | Bruk |
|-------|-----|------|
| `--color-grey-50` | `#F5F8F7` | Subtile bakgrunner, hover. |
| `--color-grey-100` | `#ECF0EF` | Sekundær bakgrunn, dividers. |
| `--color-grey-200` | `#D5DFDB` | Standard border, skeletons. |
| `--color-grey-300` | `#A5B2AD` | Disabled, placeholder, metadata. |
| `--color-grey-400` | `#7A8C85` | Muted tekst. |
| `--color-grey-500` | `#5A6E66` | Sekundær tekst, labels. |
| `--color-grey-600` | `#3D5249` | Body tekst. |
| `--color-grey-700` | `#324D45` | Sterk sekundær tekst. |
| `--color-grey-800` | `#1A3529` | Mørk hover-bg. |
| `--color-grey-900` / `--color-black` | `#0A1F18` | Headlines, dark buttons, sidebar. |

### Semantiske farger

| Token | Hex | Bruk |
|-------|-----|------|
| `--color-success` | `#2A7D5A` | Suksess, positive trender. |
| `--color-success-light` | `#E8F5EF` | Success badge bg. |
| `--color-error` | `#B84233` | Feil, avbestillinger, advarsler. |
| `--color-error-light` | `#FCEAE8` | Error badge bg. |
| `--color-warning` | `#C48A32` | Pending, timeout, obs. |
| `--color-warning-light` | `#FDF4E4` | Warning badge bg. |
| `--color-info` | `#007AFF` | Info, Birdie-blå. |
| `--color-info-light` | `#EFF6FF` | Info badge bg. |
| `--color-ai` | `#AF52DE` | AI-innsikt, premium features. |
| `--color-ai-light` | `#FAF5FF` | AI-kort bg. |

### Portal-spesifikke tokens

| Token | Verdi | Bruk |
|-------|-------|------|
| `--color-portal-bg` | `#F5F5F7` | Dashboard-bakgrunn (ren Apple-grå). |
| `--color-portal-card` | `#FFFFFF` | Kort i portalen. |
| `--color-portal-text` | `#1D1D1F` | Portal-tekst. |
| `--color-portal-border` | `rgba(0,0,0,0.06)` | Subtile portal-grenser. |
| `--shadow-portal-card` | `0 0 0 1px rgba(21,66,18,0.06), 0 1px 2px rgba(21,66,18,0.04), 0 4px 16px rgba(21,66,18,0.06)` | Standard kort-skygge. |
| `--shadow-portal-card-hover` | `0 0 0 1px rgba(21,66,18,0.08), 0 8px 32px rgba(21,66,18,0.12)` | Kort-hover. |

### Admin / Mission Control tokens

| Token | Verdi | Bruk |
|-------|-------|------|
| `--hg-bg` | `#F5F8F7` | Admin-bakgrunn. |
| `--hg-surface` | `#FFFFFF` | Admin-kort. |
| `--hg-text` | `#0A1F18` | Admin-tekst. |
| `--hg-border` | `#D5DFDB` | Admin-border. |

---

## 3. Typografi

### Font
- **Primær:** `Inter` (Google Fonts)
- **Backup:** `system-ui, -apple-system, sans-serif`
- **Mono:** `ui-monospace, SFMono-Regular, Menlo, Consolas`

### Skala

| Token | Størrelse | Vekt | Bruk |
|-------|-----------|------|------|
| **Hero** | `clamp(44px, 7.4vw, 104px)` | 700 | Landing hero |
| **Display** | 48px / 3rem | 600 | Store tall (score, HCP) |
| **H1** | 32px / 2rem | 600 | Sidetitler |
| **H2** | `clamp(32px, 4.4vw, 56px)` | 600 | Seksjonstitler |
| **H3** | 20px / 1.25rem | 600 | Korttitler |
| **H4** | 18px / 1.125rem | 600 | Undertitler |
| **Body** | 16px / 1rem | 400 | Standard tekst |
| **Small** | 14px / 0.875rem | 400 | Hjelpetekst |
| **Tiny** | 12px / 0.75rem | 500 | Labels, tags |
| **Micro** | 10px / 0.625rem | 600 | Uppercase labels, tracking wide |

### Spesielle mønstre

**Eyebrow label:**
```
font-size: 10px
font-weight: 600
uppercase
tracking: 0.22em
color: #5A6E66
```

**KPI tall:**
```
font-size: 44px (eller større)
font-weight: 600
line-height: 1
letter-spacing: -0.02em
color: #0A1F18
tabular-nums
```

---

## 4. Spacing & Radius

### Spacing Scale (4px-base)

| Token | Verdi | Bruk |
|-------|-------|------|
| `space-1` | 4px | Tett spacing |
| `space-2` | 8px | Ikon + tekst |
| `space-3` | 12px | Kort padding (compact) |
| `space-4` | 16px | Standard gap, padding |
| `space-6` | 24px | Seksjoner, card padding |
| `space-8` | 32px | Store seksjoner |
| `space-12` | 48px | Page margins |

### Border Radius

| Token | Verdi | Bruk |
|-------|-------|------|
| `rounded-sm` | 4px | Tags, badges, progress bars |
| `rounded` | 8px | Knapper, inputs, small cards |
| `rounded-lg` | 12px | Kort, panels |
| `rounded-xl` | 16px | Modaler, large cards |
| `rounded-2xl` | 20px | Dashboard mockups, feature cards |
| `rounded-full` | 9999px | Avatars, pills, buttons |

---

## 5. Godkjente UI-komponenter

### Button (`components/ui/button.tsx`)

| Variant | Bruk |
|---------|------|
| `primary` / `accent` | Hoved-CTA. Lime-bg `#D1F843`, mørk tekst. `rounded-full`. |
| `secondary` | Outline. Hvit bg, `border-grey-200`, mørk tekst. |
| `dark` | Mørk bg `#0A1F18`, hvit tekst. Brukes for persistent actions. |
| `destructive` | Rød bg `#EF4444`. Avbestill, slett. |
| `ghost` | Transparent. Subtle hover-bg. |

**Sizes:** `sm` (px-4 py-2), `md` (px-5 py-2.5), `lg` (px-6 py-3)

### Card (`components/ui/card.tsx`)

| Variant | Bruk |
|---------|------|
| `default` | Hvit bg, `border-grey-200`, `rounded-xl`. Standard. |
| `soft` | `bg-grey-50`, subtil. |
| `elevated` | Hvit bg + `shadow-card`. |

**Padding:** `none`, `sm` (p-4), `md` (p-5), `lg` (p-6)  
**Hover:** Sett `hover={true}` for `hover:border-grey-300 hover:-translate-y-px hover:shadow-card-hover`

### Badges/Tags

| Type | Bakgrunn | Tekst | Border |
|------|----------|-------|--------|
| Success | `#E8F5EF` | `#1A4D36` | — |
| Warning | `#FDF4E4` | `#7A5520` | — |
| Error | `#FCEAE8` | `#7A2C22` | — |
| Lime CTA | `#D1F843` | `#0A1F18` | — |
| AI | `#FAF5FF` | `#AF52DE` | `rgba(175,82,222,0.20)` |
| Outline | transparent | `#324D45` | `#D5DFDB` |

### Inputs

- **Bg:** `#FFFFFF` (eller `#0A1F18` for dark)
- **Border:** `1px solid #D5DFDB`
- **Radius:** 8px
- **Padding:** 12px 16px
- **Focus:** Border `#0A1F18` (eller `#D1F843` for dark)
- **Placeholder:** `#A5B2AD`

---

## 6. Godkjente Patterns

### Dashboard-kort (alltid)
```
[Ikon]  [KPI-verdi]
        [Micro-label]
```
- Ikon: 20–24px, i en avrundet bg-boble
- KPI: 28–44px, semibold, `tabular-nums`
- Label: 10px, uppercase, tracking wide, muted

### Navigasjon
- **Pills:** `rounded-full`, mørk bg på aktiv tab, hvit tekst.
- **Sidebar:** Mørk bg `#0A1F18`, lime eller hvit aktiv-indikator.

### Grafer & Charts
- **Line chart:** `#0A1F18` eller `#3B82F6`, gradient-fill under linje.
- **Bar chart:** Bruker `#0A1F18` (user), `#D5DFDB` (average), `#D1F843` (highlight).
- **Gauge / doughnut:** Fullført = `#D1F843` eller `#1A4D36`, gjenværende = `#D5DFDB`.
- **Grid:** `#D5DFDB` (svak). Labels: `#7A8C85`.

---

## 7. Anti-patterns (ALDRI)

❌ **Gradient-bakgrunn på hele siden**  
❌ **Default Bootstrap-grå** (`#6c757d`, `#f8f9fa`)  
❌ **1px solide borders for seksjonering**  
❌ **Tilfeldige `text-[13px]` eller `p-[11px]`** — bruk tokens  
❌ **Generiske AI-ikoner** — kun Lucide, bevisst valgt  
❌ **Hardkodede hex-koder i komponenter** — ALLTID bruk CSS-variabler  
❌ **Komponent-opprettelse under render** — definer komponenter på modulnivå  
❌ **Inline-styling eller ad-hoc Tailwind utenfor komponenter**

---

## 8. Workflow: Fra Referanse til Kode

Når du får en ny design-referanse (Stitch, screenshot, Dribbble):

1. **Ikke be AI generere kode direkte fra bildet.**
2. **Beskriv patternet/prinsippet** i denne filen hvis det er nytt.
3. **Be AI implementere med eksisterende komponenter.**
4. **Review mot `DESIGN_SYSTEM.md`**, ikke mot bildet.

---

## 9. Kvalitets-sjekkliste

For hver ny UI-fil som merges:

- [ ] Kun farger fra `--color-*` tokens
- [ ] Ingen hardkodede hex-koder
- [ ] Konsistent spacing (4px-grid)
- [ ] Konsistent radius (4 / 8 / 12 / 16 / 20 / full)
- [ ] Lucide-ikoner, bevisst valgt
- [ ] Typography følger skalaen
- [ ] Passerer `npm run lint` (0 errors, ≤20 warnings)

---

*Sist oppdatert: 2026-04-15*  
*Forrige versjoner arkivert i `docs/archive/`*
