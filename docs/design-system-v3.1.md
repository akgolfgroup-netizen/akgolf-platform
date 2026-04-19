# AK Golf Design System v3.1 — Pattern Library

Design-oppgradering 2026-04. Bygger på Brand Guide V2.0 ("Sort. Hvit. Én grønn.") med 6 nye gjenbrukbare patterns for data-rike skjermer.

**Designkilde:** `/tmp/ak-golf-design/AK Golf Portal.html` (pakket ut fra `~/Downloads/AK Golf.zip`).
**Preview:** `/portal/design-preview` (staff-only).
**Komponenter:** `components/portal/patterns/`.

---

## Nye tokens (i `app/globals.css` og `lib/design-tokens.ts`)

### Data-viz utvidelser
```css
--color-data-amber: #E8A94A;
--color-data-violet: #AF52DE;
```

### Grey mellomnivå
```css
--color-grey-150: #E1E8E5;
```

### Density-tokens (for tetthets-tweaks)
```css
--ak-density: 1;
--ak-pad: calc(20px * var(--ak-density));
--ak-pad-sm: calc(12px * var(--ak-density));
--ak-gap: calc(20px * var(--ak-density));
```

### Font
`--font-mono` peker nå på JetBrains Mono:
```css
--font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
```

Lastet i `app/layout.tsx` via `next/font/google`.

---

## Patterns

### P-01 · SG Ring

4 konsentriske ringer for Strokes Gained: Off-tee (sage), Approach (lime), Short game (coral), Putt (blue). Midtstilt total-verdi.

**Bruk:** Dashboard V2 Night Ops, V5 Cockpit, Statistikk begge views, Analyse hero.

```tsx
import { SGRing } from "@/components/portal/patterns";

<SGRing offTee={0.42} approach={0.82} short={-0.31} putt={0.22} size="md" />
```

**Props:**
- `offTee`, `approach`, `short`, `putt`: number (forventet spenn -2 til +2)
- `size`: `"sm" | "md" | "lg"` (140/180/240px)
- `showLegend`: bool (default true)

---

### P-02 · Mono Label

JetBrains Mono for metadata: tidsstempler, IDer, prosenter, tabellheaders. Gir lab-følelse uten å stjele fokus fra Inter.

**Bruk:** Alle data-rike skjermer. Tidsstempler, IDer, prosenter.

```tsx
import { MonoLabel } from "@/components/portal/patterns";

<MonoLabel size="xs" uppercase>RUNDE-ID</MonoLabel>
<MonoLabel size="md">142.3 mph</MonoLabel>
<MonoLabel size="lg" className="text-primary font-bold">94%</MonoLabel>
```

**Props:** `size: "xs" | "sm" | "md" | "lg"`, `uppercase?: bool`, `tabular?: bool` (default true).

---

### P-03 · Night Surface

Kontekstuell dark mode (IKKE global) for data-first-skjermer.

**Bruk:** TrackMan, Mission Control, dashboard V2 Night Ops.

```tsx
import { NightSurface } from "@/components/portal/patterns";

<NightSurface variant="ambient" className="rounded-2xl p-10">
  {/* dark-context content */}
</NightSurface>
```

**Props:** `variant: "default" | "ambient"` (ambient legger til radial gradients).

Hook `useIsNightSurface()` tilgjengelig for barn som må vite konteksten.

---

### P-04 · AK-Pyramide

Horisontal 5-lags bar: FYS / TEK / SLAG / SPILL / TURN. Klikkbar for filter, eller read-only for volum-fordeling.

**Bruk:** Treningsplanlegger sidepanel (klikkbar), Dagbok volum-kort (read-only).

```tsx
import { AKPyramide } from "@/components/portal/patterns";

const [active, setActive] = useState<PyramideLevel | null>("TEK");

<AKPyramide
  title="AK-Pyramiden · Uke 17"
  active={active}
  onChange={setActive}
  data={[
    { level: "FYS", percent: 100, value: "3h" },
    { level: "TEK", percent: 88, value: "2.5h" },
    { level: "SLAG", percent: 74, value: "2h" },
    { level: "SPILL", percent: 45, value: "1.5h" },
    { level: "TURN", percent: 80, value: "4h" },
  ]}
/>

{/* Read-only */}
<AKPyramide readOnly data={[...]} title="Volum 30d" />
```

**Farge-mapping:**
- FYS → sage (`--color-data-sage`)
- TEK → blue (`--color-data-blue`)
- SLAG → amber (`--color-data-amber`)
- SPILL → violet (`--color-data-violet`)
- TURN → coral (`--color-data-coral`)

---

### P-05 · AI Attribution

Context-chips i AI-svar som viser hvilke datakilder AI brukte. Bygger tillit hos elite-brukere.

**Bruk:** AI Coach-meldinger, Statistikk AI-narrativ, Analyse-innsikter.

```tsx
import { AIAttribution } from "@/components/portal/patterns";

<AIAttribution
  sources={[
    { type: "runde", id: "r1", label: "Runde 23/4", href: "/portal/runde/r1" },
    { type: "trackman", id: "tm1", label: "TM-sesjon 21/4" },
    { type: "coach-notat", id: "cn1", label: "Thomas 20/4" },
    { type: "handicap", id: "h1", label: "HCP 3.4" },
  ]}
/>
```

**Source types:** `runde`, `trackman`, `coach-notat`, `booking`, `treningslogg`, `handicap` (Lucide-ikoner auto-mappet).

---

### P-06 · Vertical Timeline

Vertikal dag-tidslinje med tid-prefix + dot-divider + tittel. Erstatter "hva skjer i dag"-lister med rolig rytme.

**Bruk:** Dashboard V3 Editorial, Booking day-view, Dagbok streak-milepæler.

```tsx
import { VerticalTimeline } from "@/components/portal/patterns";

<VerticalTimeline
  items={[
    {
      time: "06:30",
      title: "Mobility 20m",
      meta: "FYS · Hjemme",
      dotColor: "sage",
    },
    {
      time: "10:00",
      title: "Coach Thomas · 1:1",
      meta: "TEK · impact · 60m",
      dotColor: "blue",
      active: true,
      href: "/portal/bookinger/abc",
    },
  ]}
/>
```

**Dot colors:** `lime`, `sage`, `coral`, `blue`, `amber`, `muted` (default).

**Props:** `compact: bool` for tettere vertical-spacing.

---

## Designprinsipper v3.1

1. **Sparsomt accent:** Lime (`#D1F843`) kun på 2-3 elementer per skjerm. Aldri som full bakgrunn.
2. **Kontekstuell dark:** `NightSurface` kun der data-first gir verdi — ikke global.
3. **Mono som metadata-aksent:** `MonoLabel` for alle tall, tidsstempler, IDer — ikke brødtekst.
4. **Klikkbar pyramide:** AK-Pyramiden er hovedmetafor for treningsinnhold — må være aktivt brukbar.
5. **AI-tillit:** Alle AI-genererte svar skal ha `AIAttribution` med relevante datakilder.
6. **Rolig tidslinje:** `VerticalTimeline` foretrekkes over punktliste for tidsbasert innhold.

---

## Neste steg

- **Fase 2:** Rull ut patterns til 6 skjermer (Treningsplanlegger, Statistikk, Analyse, Dagbok, Booking, Turneringsplanlegger). Se `~/.claude/plans/lag-en-plan-for-unified-unicorn.md`.
- **Fremtidig:** Dashboard-redesign (5 views V1-V5) bygger på disse patternene.
