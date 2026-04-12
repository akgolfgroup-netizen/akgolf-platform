# Premium Design Patterns — AK Golf Portal

Oversetter monstere fra portal-dashboard-v3.html, SyncActive Behance, MagicUI, Aceternity og shadcn til VART designsystem (light mode, Brand Guide V2.0 tokens).

## Filosofi

Premium = disiplin, ikke dekorasjon. Tre prinsipper:
1. **Subtilitet over volum** — 90% noytral flate, 10% accent
2. **Lag over flathet** — shadows, borders og inner gradients skaper dybde
3. **Typografisk kontrast** — stor variasjon i storrelse/vekt innenfor samme kort

---

## 0. KRITISK: Portal vs Markedsside farger

Portalen bruker NOEYTRALE Apple-graa farger (`--color-portal-*`), IKKE groenntonede brand-farger.
Markedssiden beholder groenntonet palett (`--color-grey-*`).

| Bruk | Portal-token | Verdi | Markedsside-token | Verdi |
|------|-------------|-------|-------------------|-------|
| Bakgrunn | `portal-bg` | #F5F5F7 | `surface` | #ECF0EF |
| Tekst primaer | `portal-text` | #1D1D1F | `black` | #0A1F18 |
| Tekst sekundaer | `portal-secondary` | #6E6E73 | `grey-400` | #7A8C85 |
| Tekst muted | `portal-muted` | #AEAEB2 | `muted` | #A5B2AD |
| Kort-bg | `portal-card` | #FFFFFF | `white` | #FFFFFF |
| Border | `portal-border` | rgba(0,0,0,0.06) | `grey-200` | #D5DFDB |
| Hover-bg | `portal-hover` | #F0F0F2 | `grey-50` | #F5F8F7 |

### Tailwind-bruk i portal:
```tsx
// RIKTIG — portal
<div className="bg-portal-bg text-portal-text">
<span className="text-portal-secondary">
<div className="border-portal-border">

// FEIL — dette er markedsside-farger
<div className="bg-surface text-black">
```

### Chip-tabs (filter-pills i portal)

```tsx
<div className="flex gap-1.5 rounded-[10px] bg-portal-hover p-[3px]">
  <button className="rounded-[7px] bg-primary px-4 py-[7px] text-[13px] font-medium text-white shadow-[0_2px_8px_rgba(0,88,64,0.3)]">
    Aktiv
  </button>
  <button className="rounded-[7px] px-4 py-[7px] text-[13px] font-medium text-portal-muted hover:bg-portal-hover hover:text-portal-secondary">
    Inaktiv
  </button>
</div>
```

### Inset glow er STANDARD paa stat-kort

Alle stat-kort i portalen SKAL ha inset glow. Ikke flat shadow.
- Groenn glow: `shadow-portal-glow-green` — for golf-metrikker
- Lilla glow: `shadow-portal-glow-ai` — for AI-kort
- Standard: `shadow-portal-card` — for noytrale kort

---

## 1. Shadows — Layered Card System

Aldri bruk en enkel shadow. Premium kort har MINST to lag.

### Kort-nivaaer

| Niva | Token | Verdi | Bruk |
|------|-------|-------|------|
| Hvile | `shadow-card` | `0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02)` | Default kort |
| Hover | `shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04)` | Hover-tilstand |
| Elevated | `shadow-card-hover-deep` | `0 20px 60px rgba(0,0,0,0.08)` | Modaler, dropdowns |
| Glow green | Custom | `inset 0 0 30px rgba(0,88,64,0.06), shadow-card` | Fremhevet stat-kort |
| Glow AI | Custom | `inset 0 0 30px rgba(175,82,222,0.06), shadow-card` | AI-innhold |

### Inner gradient (v3-teknikk)

Alle kort far en usynlig gradient som gir dybde:
```css
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.01) 100%);
  pointer-events: none;
}
```

I Tailwind: bruk `before:absolute before:inset-0 before:rounded-[inherit] before:bg-gradient-to-b before:from-transparent before:to-black/[0.01] before:pointer-events-none`.

---

## 2. Borders — rgba, aldri solid

Premium bruker aldri `border-grey-200` direkte. Bruk rgba for subtilitet.

| Tilstand | Verdi | Tailwind |
|----------|-------|----------|
| Default | `rgba(0,0,0,0.06)` | `border-black/6` |
| Subtle | `rgba(0,0,0,0.04)` | `border-black/4` |
| Hover | `rgba(0,0,0,0.08)` | `border-black/8` |
| Active/Focus | `rgba(0,88,64,0.25)` | `border-primary/25` |
| AI | `rgba(175,82,222,0.15)` | `border-ai/15` |

### 1px outline-teknikk (v3 card-glow)

For premium kort, kombiner outline + shadow:
```
box-shadow: 0 0 0 1px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.02);
```

Dette gir en "ring" rundt kortet uten a bruke `border` (som tar plass).

---

## 3. Typografisk hierarki innenfor kort

V3-prototypen bruker FIRE nivaer innenfor ett kort:

| Niva | Storrelse | Vekt | Farge | Spacing | Bruk |
|------|-----------|------|-------|---------|------|
| Micro-label | 10-11px | 600-700 | `text-muted` | `tracking-[0.08em] uppercase` | Kategori, status |
| Korttittel | 14px | 600 | `text-grey-900` | `tracking-[-0.01em]` | Kortnavn |
| Verdital | 28-44px | 800 | `text-primary` eller accent | `tracking-[-0.04em]` | KPI-tall |
| Konteksttekst | 11-12px | 400-500 | `text-grey-400` | Normal | Endring, subtekst |

### Tailwind-oversettelse

```tsx
{/* Micro-label */}
<span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
  Siste 7 dager
</span>

{/* Verdital */}
<span className="text-4xl font-extrabold tracking-tight text-primary tabular-nums">
  74
</span>

{/* Kontekst */}
<span className="text-xs text-grey-400">
  -1.4 fra forrige
</span>
```

---

## 4. Whitespace-rhythm

V3 bruker en konsekvent spacing-skala:

| Mellom | Verdi | Tailwind |
|--------|-------|----------|
| Seksjoner (top-row -> grid) | 16px | `mb-4` |
| Kort i grid | 16px | `gap-4` |
| Kort-header -> innhold | 16px | `mb-4` |
| Interne grupper | 8-12px | `gap-2` til `gap-3` |
| Label -> verdi | 4-6px | `mt-1` til `mt-1.5` |
| Kort-padding | 20px | `p-5` |

### Seksjon-rhythm (markedsside)

| Mellom | Verdi | Tailwind |
|--------|-------|----------|
| Seksjoner | 120px (7.5rem) | `py-[var(--spacing-section)]` |
| Store seksjoner | 160px (10rem) | `py-[var(--spacing-section-lg)]` |
| Tittel -> undertekst | 16-24px | `mb-4` til `mb-6` |
| Undertekst -> innhold | 32-48px | `mb-8` til `mb-12` |

---

## 5. Hover-transforms og transitions

### Easing-kurver (globals.css)

| Navn | Verdi | Bruk |
|------|-------|------|
| `--ease-apple` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard hover |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce (progresjonsbarer, meny-aapning) |
| `--ease-out-expo` | `cubic-bezier(0, 0.55, 0.45, 1)` | Rask inn, myk ut |

### Kort-hover (v3-monster)

```tsx
<div className="
  transition-all duration-300 ease-[var(--ease-apple)]
  hover:border-black/8
  hover:-translate-y-px
  hover:shadow-card-hover
">
```

- `translateY(-1px)` — aldri mer. Premium er subtilt.
- `duration-300` for kort, `duration-500` for sider.
- Aldri `scale()` pa kort. Bare `translateY`.

### Bilde-hover (v3 visual-card)

```tsx
<div className="overflow-hidden rounded-2xl">
  <img className="transition-transform duration-[600ms] ease-[var(--ease-apple)] group-hover:scale-[1.03]" />
</div>
```

### Knapp-hover

```tsx
{/* Primary */}
<button className="hover:opacity-85 hover:scale-[1.02] active:scale-[0.98] active:opacity-75 transition-all duration-300">

{/* Ghost */}
<button className="hover:bg-black/3 transition-colors duration-200">
```

---

## 6. Accent-farge (#D1F843) — Bruksregler

Accent-lime brukes SPARSOMT. Maxregel: maks 2-3 elementer per skjerm.

### NAR accent SKAL brukes

| Element | Eksempel |
|---------|----------|
| Primaer CTA-knapp | "Book time", "Kom i gang" |
| Aktiv nav-tab (sidebar) | Aktivt menyvalg i Mission Control |
| Fremhevet badge | "Ny personlig rekord", "Aktiv uke" |
| Stolpediagram-topp | Beste dag i treningsdiagram |
| Donut-segment | Primaer treningskategori |

### NAR accent IKKE skal brukes

| Element | Bruk i stedet |
|---------|---------------|
| Overskrifter | `text-grey-900` |
| Ikoner generelt | `text-primary` (#005840) |
| Borders | `border-black/6` |
| Bakgrunner | `bg-grey-50` eller `bg-white` |
| Sekundaere knapper | `border-grey-200` + `text-grey-500` |
| Lenker | `text-primary` |

### Accent som glow (v3-teknikk)

Aldri bruk accent som flat bakgrunn. Bruk som glow/gradient:
```css
/* Badge */
background: rgba(209, 248, 67, 0.12);
color: var(--color-primary);
border: 1px solid rgba(209, 248, 67, 0.25);

/* Tailwind */
bg-accent/12 text-primary border border-accent/25
```

---

## 7. Kort-anatomier

### Stat-kort (premium)

```
+-----------------------------------+
| [icon-ring 48x48]                 |
|                                   |
|          74                       |  <- text-4xl font-extrabold
|      Beste runde                  |  <- text-[11px] uppercase tracking-wide text-muted
|    Ny personlig rekord            |  <- text-xs badge med accent-glow
+-----------------------------------+
```

Padding: `p-6`. Centert. `inset shadow glow`.

### Metrisk boks (v3 metric-box)

```
+------------------+
| Fairway %        |  <- text-[11px] text-muted
| 68%              |  <- text-lg font-bold
+------------------+
```

Padding: `px-3.5 py-3`. `bg-black/[0.02]`. `border border-black/6 rounded-[10px]`.
Hover: `bg-black/[0.04] border-black/8`.

### AI-kort

```
| [purple glow line across top]     |
| [ai-icon 30x30] AI-innsikt       |
|                                   |
| Din putting har forbedret seg     |
| 12% denne uken. Fokuser naa      |
| paa approach fra 100m.            |
+-----------------------------------+
```

Glow-linje: `absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-ai to-transparent`.

---

## 8. Glass-panel (navigation)

V3 bruker glass-effekt pa topnav:

```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(24px) saturate(1.4);
border-bottom: 1px solid rgba(0, 0, 0, 0.06);
```

Tailwind:
```
bg-white/85 backdrop-blur-xl backdrop-saturate-[1.4] border-b border-black/6
```

Sticky: `sticky top-0 z-nav`.

---

## 9. Bento Grid (fra v2 + MagicUI)

```css
display: grid;
grid-template-columns: repeat(12, 1fr);
grid-auto-rows: minmax(160px, auto);
gap: 1.5rem;
```

Kort-storelser:
- Smalt: `col-span-4`
- Medium: `col-span-6`
- Bredt: `col-span-8`
- Full: `col-span-12`
- Hoyt: `row-span-2`

---

## 10. Diagram og dataviz

### Linjediagram (SVG)

- Linje: `stroke="var(--color-primary)"`, `stroke-width="2"`, `stroke-linecap="round"`
- Gradient under: `from primary/30 to primary/0` (vertikal)
- Endepunkt: Fylt sirkel i accent (`#D1F843`) r=3
- Grid-linjer: `rgba(0,0,0,0.04)` horisontal

### Stolpediagram

- Bredde: `flex-1` per stolpe, `gap-[5px]`
- Aktiv: `linear-gradient(180deg, primary-alt, primary)` med glow `shadow-[0_0_10px_rgba(0,88,64,0.15)]`
- Inaktiv: `bg-primary opacity-40`
- Tomme dager: `bg-black/5 h-1`
- Labels: `text-[10px] text-muted`

### Fremdriftsbarer

- Track: `h-[5px] bg-black/5 rounded-full`
- Fill: `h-full rounded-full` med glow-blur pa enden:
  ```css
  .fill::after {
    content: '';
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 20px;
    background: inherit;
    filter: blur(6px);
    opacity: 0.5;
  }
  ```
- Animasjon: `transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)`

---

## 11. Body-tekstur (v3)

Subtil radial gradient pa body for a bryte flat bakgrunn:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,88,64,0.03) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 20%, rgba(175,82,222,0.015) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}
```

Bruk KUN i portal, aldri pa markedssiden.

---

## Oppsummering: Premium-sjekkliste

Sjekk hvert kort/komponent mot denne listen:

- [ ] Shadow er layered (minst 2 verdier)?
- [ ] Border bruker rgba, ikke solid hex?
- [ ] Inner gradient (::before) for dybde?
- [ ] Typografi har minst 3 kontrastnivaer?
- [ ] Hover er subtil (translateY -1px, aldri mer)?
- [ ] Accent brukes pa maks 2-3 elementer per skjerm?
- [ ] Padding folger rhythm (p-5 for kort, gap-4 mellom)?
- [ ] Transitions bruker --ease-apple (300ms)?
- [ ] Labels er 10-11px uppercase tracking-wide?
- [ ] Tall bruker tabular-nums og tight tracking?
