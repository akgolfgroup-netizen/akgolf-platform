# Jack L./RonDesignLab Design System — Adopsjonsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adoptere Jack L./RonDesignLab sitt designspråk (Dribbble: jack-web-design) for spillerportal og Mission Control, mappet til AK Golf sin branding.

**Architecture:** Oppdater design-tokens, globals.css og komponent-patterns slik at alle portal-sider automatisk arver det nye designet. Deretter oppdater sidebar, topbar, kort-system og data-visualisering steg for steg. Eksisterende portal-tokens (`--color-portal-*`) beholdes som fundament — vi beriker dem med nye shadows, gradients og motion-patterns.

**Tech Stack:** Tailwind CSS v4 (inline tokens i globals.css), Framer Motion 12, Recharts, Lucide React, Inter font

---

## Designreferanse — Jack L./RonDesignLab

### Fargemapping: Jack → AK Golf

| Jack L. token | Jack verdi | AK Golf token | AK Golf verdi | Bruk |
|---------------|-----------|---------------|---------------|------|
| Near-black bg | #141311 | `--color-black` | #0A1F18 | MC sidebar, dark sections |
| Grey text | #9E9E9F | `--color-portal-secondary` | #6E6E73 | Sekundær tekst |
| Lime accent | #BDC94B | `--color-accent-cta` | #D1F843 | CTA, aktive elementer, chart-highlights |
| Light lime | #DFE1A3 | `--color-accent-cta-light` | rgba(209,248,67,0.12) | Accent-glow badges |
| Warm grey bg | #D4D3D3 | `--color-portal-bg` | #F5F5F7 | Canvas-bakgrunn |
| Card white | #FFFFFF | `--color-portal-card` | #FFFFFF | Kort-bakgrunn |

### Designmønstre å adoptere

1. **Pill filter-tabs** — Rounded pill-tabs med aktiv state som fylt bakgrunn (Kettler: "All / Beginner / 30-45 min")
2. **Circular progress** — Ring-progress med lime accent for KPI-er (Kettler: 04:38 timer)
3. **Greeting header** — "Hei Anders, her er..." med personlig velkomst (Lightspeed)
4. **Gauge meters** — Halvsirkulære gauges for score/handicap (Salesforce)
5. **Bento card grid** — Variable kortstørrelser med avrundede hjørner og layered shadows
6. **Profile-centric layout** — Stor profilseksjon med inline-stats (Realty Hub)
7. **Live feed** — Real-time aktivitetsfeed på dashboardet
8. **Summary cards med fargegradienter** — Subtile bakgrunnsgradienter per kategori (Realty Hub)
9. **Dark sidebar med aktiv lime-stripe** — Sort sidebar med #D1F843 aktiv-indikator

---

## Task 1: Oppdater design-tokens i globals.css

**Files:**
- Modify: `app/globals.css` — Legg til nye Jack-inspirerte tokens
- Modify: `lib/design-tokens.ts` — Eksporter nye tokens til JS

- [ ] **Step 1: Legg til nye shadow-tokens i globals.css**

Finn `@theme inline` seksjonen i `app/globals.css` og legg til:

```css
/* Jack L. Premium Shadows */
--shadow-jack-card: 0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.02);
--shadow-jack-card-hover: 0 0 0 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.04);
--shadow-jack-elevated: 0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06);
--shadow-jack-glow-accent: 0 0 0 1px rgba(209,248,67,0.15), 0 4px 16px rgba(209,248,67,0.08);
--shadow-jack-glow-green: 0 0 0 1px rgba(0,88,64,0.1), 0 4px 16px rgba(0,88,64,0.06);
--shadow-jack-inset-accent: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 40px rgba(209,248,67,0.04);
```

- [ ] **Step 2: Legg til nye border-radius tokens**

```css
/* Jack L. Border Radius */
--radius-jack-sm: 10px;
--radius-jack-md: 14px;
--radius-jack-lg: 20px;
--radius-jack-xl: 24px;
--radius-jack-pill: 980px;
```

- [ ] **Step 3: Legg til nye motion-tokens**

```css
/* Jack L. Motion */
--ease-jack: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--ease-jack-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--duration-jack-fast: 200ms;
--duration-jack-normal: 350ms;
--duration-jack-slow: 600ms;
```

- [ ] **Step 4: Legg til pill-tab tokens**

```css
/* Jack L. Pill Tabs */
--pill-tab-bg: #F0F0F2;
--pill-tab-active-bg: var(--color-primary);
--pill-tab-active-text: #FFFFFF;
--pill-tab-inactive-text: var(--color-portal-muted);
--pill-tab-radius: 8px;
--pill-tab-padding: 3px;
```

- [ ] **Step 5: Oppdater design-tokens.ts med nye verdier**

Legg til i `lib/design-tokens.ts`:

```typescript
export const jackShadows = {
  card: 'var(--shadow-jack-card)',
  cardHover: 'var(--shadow-jack-card-hover)',
  elevated: 'var(--shadow-jack-elevated)',
  glowAccent: 'var(--shadow-jack-glow-accent)',
  glowGreen: 'var(--shadow-jack-glow-green)',
  insetAccent: 'var(--shadow-jack-inset-accent)',
} as const;

export const jackRadius = {
  sm: 'var(--radius-jack-sm)',
  md: 'var(--radius-jack-md)',
  lg: 'var(--radius-jack-lg)',
  xl: 'var(--radius-jack-xl)',
  pill: 'var(--radius-jack-pill)',
} as const;
```

- [ ] **Step 6: Verifiser at build fortsatt er grønt**

Run: `cd ~/Developer/akgolf/akgolf-platform && npm run build 2>&1 | tail -5`
Expected: Build successful

- [ ] **Step 7: Commit**

```bash
git add app/globals.css lib/design-tokens.ts
git commit -m "feat: legg til Jack L./RonDesignLab design-tokens"
```

---

## Task 2: Lag JackCard base-komponent

**Files:**
- Create: `components/portal/ui/jack-card.tsx`
- Create: `components/portal/ui/jack-pill-tabs.tsx`

- [ ] **Step 1: Opprett JackCard komponent**

```tsx
// components/portal/ui/jack-card.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";
import { type ReactNode } from "react";

interface JackCardProps {
  children: ReactNode;
  className?: string;
  glow?: "none" | "accent" | "green" | "ai";
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

const glowStyles = {
  none: "",
  accent: "shadow-[var(--shadow-jack-glow-accent)]",
  green: "shadow-[var(--shadow-jack-glow-green)]",
  ai: "shadow-[inset_0_0_30px_rgba(175,82,222,0.06),var(--shadow-jack-card)]",
} as const;

const paddingStyles = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function JackCard({
  children,
  className,
  glow = "none",
  hover = true,
  padding = "md",
}: JackCardProps) {
  return (
    <div
      className={cn(
        "relative bg-portal-card rounded-[var(--radius-jack-lg)] border border-portal-border",
        "shadow-[var(--shadow-jack-card)]",
        glowStyles[glow],
        paddingStyles[padding],
        hover && [
          "transition-all duration-[var(--duration-jack-normal)] ease-[var(--ease-jack)]",
          "hover:shadow-[var(--shadow-jack-card-hover)]",
          "hover:-translate-y-px",
          "hover:border-black/8",
        ],
        "before:absolute before:inset-0 before:rounded-[inherit]",
        "before:bg-gradient-to-b before:from-transparent before:to-black/[0.01]",
        "before:pointer-events-none",
        className
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Opprett JackPillTabs komponent**

```tsx
// components/portal/ui/jack-pill-tabs.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";

interface Tab {
  id: string;
  label: string;
}

interface JackPillTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function JackPillTabs({ tabs, activeTab, onTabChange, className }: JackPillTabsProps) {
  return (
    <div className={cn("flex gap-1.5 rounded-[var(--radius-jack-sm)] bg-portal-hover p-[3px]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-[7px] px-4 py-[7px] text-[13px] font-medium transition-all duration-200",
            activeTab === tab.id
              ? "bg-primary text-white shadow-[0_2px_8px_rgba(0,88,64,0.3)]"
              : "text-portal-muted hover:bg-portal-hover hover:text-portal-secondary"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verifiser at komponentene kompilerer**

Run: `cd ~/Developer/akgolf/akgolf-platform && npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add components/portal/ui/jack-card.tsx components/portal/ui/jack-pill-tabs.tsx
git commit -m "feat: JackCard og JackPillTabs base-komponenter"
```

---

## Task 3: Lag JackStatCard og JackGauge komponenter

**Files:**
- Create: `components/portal/ui/jack-stat-card.tsx`
- Create: `components/portal/ui/jack-gauge.tsx`
- Create: `components/portal/ui/jack-ring-progress.tsx`

- [ ] **Step 1: Opprett JackStatCard**

```tsx
// components/portal/ui/jack-stat-card.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";
import { JackCard } from "./jack-card";
import type { LucideIcon } from "lucide-react";

interface JackStatCardProps {
  label: string;
  value: string | number;
  change?: { value: string; positive: boolean };
  icon?: LucideIcon;
  glow?: "none" | "accent" | "green" | "ai";
  className?: string;
}

export function JackStatCard({ label, value, change, icon: Icon, glow = "none", className }: JackStatCardProps) {
  return (
    <JackCard glow={glow} padding="lg" className={cn("text-center", className)}>
      {Icon && (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-jack-md)] bg-portal-hover">
          <Icon size={22} className="text-primary" />
        </div>
      )}
      <p className="text-4xl font-extrabold tracking-tight text-portal-text tabular-nums">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
        {label}
      </p>
      {change && (
        <p className={cn(
          "mt-2 text-xs font-medium",
          change.positive ? "text-success" : "text-error"
        )}>
          {change.positive ? "+" : ""}{change.value}
        </p>
      )}
    </JackCard>
  );
}
```

- [ ] **Step 2: Opprett JackRingProgress**

```tsx
// components/portal/ui/jack-ring-progress.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";

interface JackRingProgressProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: "accent" | "primary" | "success" | "ai";
  className?: string;
}

const colorMap = {
  accent: "stroke-accent-cta",
  primary: "stroke-primary",
  success: "stroke-success",
  ai: "stroke-ai",
} as const;

export function JackRingProgress({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  color = "accent",
  className,
}: JackRingProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={colorMap[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-portal-text tabular-nums">
            {label}
          </span>
          {sublabel && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-portal-muted">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Opprett JackGauge (halvsirkulær)**

```tsx
// components/portal/ui/jack-gauge.tsx
"use client";

import { cn } from "@/lib/portal/utils/cn";

interface JackGaugeProps {
  value: number; // 0–100
  label: string;
  sublabel?: string;
  size?: number;
  className?: string;
}

export function JackGauge({ value, label, sublabel, size = 160, className }: JackGaugeProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const halfCircumference = Math.PI * radius;
  const offset = halfCircumference - (value / 100) * halfCircumference;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          className="stroke-accent-cta"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={halfCircumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <p className="text-2xl font-bold tracking-tight text-portal-text tabular-nums">{label}</p>
        {sublabel && (
          <p className="text-[10px] font-medium uppercase tracking-wider text-portal-muted">{sublabel}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verifiser TypeScript**

Run: `npx tsc --noEmit 2>&1 | tail -10`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add components/portal/ui/jack-stat-card.tsx components/portal/ui/jack-ring-progress.tsx components/portal/ui/jack-gauge.tsx
git commit -m "feat: JackStatCard, JackRingProgress og JackGauge komponenter"
```

---

## Task 4: Oppdater Portal Sidebar til Jack-design

**Files:**
- Modify: `components/portal/layout/sidebar.tsx`

- [ ] **Step 1: Les nåværende sidebar**

Run: `cat components/portal/layout/sidebar.tsx | head -80`

- [ ] **Step 2: Oppdater sidebar med Jack L. dark sidebar mønster**

Nøkkelendringer:
- Bakgrunn: `bg-black` (#0A1F18) med subtil gradient
- Aktiv nav-item: lime stripe venstre (`border-l-2 border-accent-cta`) + `bg-white/8` + `text-accent-cta`
- Inaktiv: `text-white/50 hover:text-white/80 hover:bg-white/5`
- Logo øverst: AK mark i hvitt
- Avrundede hjørner på nav-items: `rounded-[var(--radius-jack-sm)]`
- Padding: `px-3 py-2`
- Font: `text-[13px] font-medium`
- Bredde: `w-[220px]` (beholdes)
- Separator: `border-t border-white/8` mellom seksjoner

- [ ] **Step 3: Test visuelt i dev-server**

Run: `npm run dev` → gå til `http://localhost:3000/portal`

- [ ] **Step 4: Commit**

```bash
git add components/portal/layout/sidebar.tsx
git commit -m "feat: portal sidebar med Jack L. dark design"
```

---

## Task 5: Oppdater Dashboard til Jack-layout

**Files:**
- Modify: `app/portal/(dashboard)/page.tsx`
- Modify: `app/portal/(dashboard)/dashboard-client.tsx`
- Modify: `components/portal/dashboard/stat-card.tsx`

- [ ] **Step 1: Les nåværende dashboard-klient**

Run: `head -100 app/portal/(dashboard)/dashboard-client.tsx`

- [ ] **Step 2: Erstatt stat-kort med JackStatCard**

Importer og bruk JackStatCard i stedet for nåværende StatCard. Mapp eksisterende data:
- Handicap → `JackStatCard` med `glow="green"`
- Runder → `JackStatCard`
- Treningsøkter → `JackStatCard` med `glow="accent"`

- [ ] **Step 3: Legg til JackRingProgress for ukentlig mål**

Erstatt eller suppler WeekRingsGrid med JackRingProgress for primær-KPI (f.eks. treningsgrad denne uken).

- [ ] **Step 4: Legg til greeting header (Lightspeed-stil)**

```tsx
<div className="mb-8">
  <h1 className="text-2xl font-bold tracking-tight text-portal-text">
    Hei {user.name?.split(" ")[0]}, her er ukens oversikt
  </h1>
  <p className="mt-1 text-sm text-portal-secondary">
    {new Date().toLocaleDateString("nb-NO", { weekday: "long", day: "numeric", month: "long" })}
  </p>
</div>
```

- [ ] **Step 5: Oppdater grid til Jack bento-layout**

```tsx
<div className="grid grid-cols-12 gap-5">
  {/* Stor velkomst-kort: col-span-8 */}
  {/* Ring progress: col-span-4 */}
  {/* Stat-kort rad: 4x col-span-3 */}
  {/* Neste booking: col-span-6 */}
  {/* AI-innsikt: col-span-6 */}
  {/* Aktivitetsfeed: col-span-12 */}
</div>
```

- [ ] **Step 6: Test visuelt**

Run: `npm run dev` → verifiser dashboard på localhost:3000/portal

- [ ] **Step 7: Commit**

```bash
git add app/portal/(dashboard)/page.tsx app/portal/(dashboard)/dashboard-client.tsx components/portal/dashboard/stat-card.tsx
git commit -m "feat: dashboard med Jack L. bento grid og stat-kort"
```

---

## Task 6: Mission Control sidebar og topbar

**Files:**
- Modify: `components/portal/layout/sidebar.tsx` — MC-modus
- Modify: `app/portal/(dashboard)/admin/layout.tsx` — Admin layout

- [ ] **Step 1: MC sidebar med divisjonsfarger**

MC bruker samme dark sidebar som portal, men med divisjonskategorier:
- Coaching-seksjon: `border-l-2 border-[--mc-color-coaching]` (#005840)
- Junior-seksjon: `border-l-2 border-[--mc-color-junior]` (#007AFF)
- AI-seksjon: `border-l-2 border-[--mc-color-ai]` (#AF52DE)

- [ ] **Step 2: MC topbar med Jack pill-tabs**

Erstatt eksisterende tab-navigasjon med `JackPillTabs`:
```tsx
<JackPillTabs
  tabs={[
    { id: "oversikt", label: "Oversikt" },
    { id: "bookinger", label: "Bookinger" },
    { id: "elever", label: "Elever" },
    { id: "kalender", label: "Kalender" },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

- [ ] **Step 3: Commit**

```bash
git add components/portal/layout/sidebar.tsx app/portal/(dashboard)/admin/layout.tsx
git commit -m "feat: Mission Control med Jack L. sidebar og pill-tabs"
```

---

## Task 7: Oppdater komponentbibliotek-dokumentasjon

**Files:**
- Modify: `docs/component-library.md`
- Modify: `.claude/rules/premium-design-patterns.md`

- [ ] **Step 1: Legg til nye Jack-komponenter i docs/component-library.md**

```markdown
## Portal Jack L. Design System
| Komponent | Fil | Bruk |
|---|---|---|
| JackCard | components/portal/ui/jack-card.tsx | Base-kort med layered shadow og inner gradient |
| JackPillTabs | components/portal/ui/jack-pill-tabs.tsx | Filter-pills med aktiv state |
| JackStatCard | components/portal/ui/jack-stat-card.tsx | KPI-kort med glow og stort tall |
| JackRingProgress | components/portal/ui/jack-ring-progress.tsx | Sirkulær progress-ring |
| JackGauge | components/portal/ui/jack-gauge.tsx | Halvsirkulær gauge-meter |
```

- [ ] **Step 2: Oppdater premium-design-patterns.md med Jack-referanse**

Legg til i toppen:
```markdown
## Designreferanse: Jack L. / RonDesignLab (Dribbble: jack-web-design)
Primær visuell inspirasjon for portal og Mission Control.
Nøkkelmønstre: Pill-tabs, ring progress, bento grid, dark sidebar med lime accent, layered card shadows.
```

- [ ] **Step 3: Commit**

```bash
git add docs/component-library.md .claude/rules/premium-design-patterns.md
git commit -m "docs: Jack L. design system dokumentasjon"
```

---

## Utrullingsplan per side (etter base-komponenter)

Når Task 1-7 er ferdig, rulles Jack-designet ut side for side. Prioritet:

| Prioritet | Side | Nøkkelkomponenter |
|-----------|------|-------------------|
| 1 | Dashboard | JackStatCard, JackRingProgress, greeting header, bento grid |
| 2 | Statistikk | JackGauge (handicap), JackCard (SG-bars) |
| 3 | Treningsplan | JackPillTabs (ukedager), JackCard (øvelser) |
| 4 | Bookinger | JackCard (booking-kort), JackPillTabs (filter) |
| 5 | Profil | JackRingProgress (mål), JackStatCard (stats) |
| 6 | MC Dashboard | JackStatCard, JackGauge, divisjonsfarger |
| 7 | MC Bookinger | JackPillTabs, JackCard |
| 8 | MC Elever | JackCard (profilkort), JackRingProgress |
| 9 | Dagbok | JackCard (logg-kort), JackPillTabs |
| 10 | Runde | JackRingProgress (live score), JackCard |

**OBS:** Den andre terminalen jobber allerede med wireframe/premium design for mange av disse sidene. Denne planen fokuserer på **komponent-fundamentet** — de faktiske Jack-komponentene som sidene skal bygges med. Sidene som allerede er under arbeid vil automatisk få nytt design når de tar i bruk disse komponentene.
