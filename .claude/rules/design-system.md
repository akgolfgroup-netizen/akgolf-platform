# Design System — AK Golf Platform (Heritage Grid)

> **ÉN SANN KILDE** (etter Heritage-migrering 2026-04-19).
> Alle andre design-docs er arkivert.

**Gullstandard:** `design-ref/stitch/heritage/` — 195 komplette Stitch-skjermer (godkjent av bruker via review-verktøy).

## KILDEBILDER (Heritage)

Hver komponent/side i appen har en referanse-skjerm:

| App-rute | Heritage `code.html` + `screen.png` |
|---|---|
| Portal sidebar | `dashboard_mission_control/` |
| MC sidebar | `admin_player_management/` |
| Dashboard (portal) | `dashboard_mission_control/` |
| `/portal/statistikk` | `analytics_strokes_gained/` |
| `/portal/kartlegging` | `coach_player_view/` |
| `/admin/coaching-board` | `coach_my_day/` |
| `/admin/elever` | `admin_player_management/` |
| `/admin/team` | `team_setup/`, `super_admin_dashboard/` |
| `/portal/bookinger` | `booking_coach_selection/`, `booking_date_time/` |
| `/portal/profil` | `settings_profile/` |
| `/portal/meldinger` | `coach_messages/`, `inbox_main/` |
| Auth | `auth_sign_in_updated/`, `auth_register_step_*/` |
| Landing | `landing_contact/`, `landing_pricing/` |
| Error | `error_403_access_denied/`, `error_404_not_found/`, `error_500_server_error/` |
| Empty/loading | `utility_empty_data_state/`, `utility_loading_state/` |

**Før du bygger:** Les `code.html` fra riktig mappe og kopier Tailwind-klasser 1:1.

## TYPOGRAFI

- **DM Sans** — all brødtekst og overskrifter (`font-body`, `font-headline`)
- **JetBrains Mono** — tall, kode, monospace-referanser (`font-mono`)
- **Material Symbols Outlined** — alle ikoner. Bruk via `<Icon name="..." />` fra `components/ui/icon.tsx`.

**Aldri:** Inter, Lucide.

## FARGER (Material 3 Expressive)

### Primary (skogsgrønn)
- `--color-primary: #154212` — hovedprimærfarge, CTA, tekst på kremhvit
- `--color-primary-container: #2d5a27` — portal-sidebar bg, mørke flater
- `--color-on-primary: #ffffff` — tekst på primary
- `--color-on-primary-container: #9dd090` — lyse accenter på primary-container

### Secondary (lime)
- `--color-secondary-fixed: #d2f000` — accent-lime for CTA, aktive items, badges
- `--color-on-secondary-fixed: #191e00` — tekst på lime
- `--color-secondary: #576500` — tonet lime for subtile elementer

### Surface (kremhvit)
- `--color-surface: #fdf9f0` — hovedbakgrunn (varm kremhvit)
- `--color-surface-container-lowest: #ffffff` — hvite kort
- `--color-surface-container-low: #f7f3ea`
- `--color-surface-container: #f1eee5`
- `--color-surface-container-high: #ece8df`
- `--color-surface-container-highest: #e6e2d9`
- `--color-surface-variant: #e6e2d9` — subtile bakgrunner
- `--color-on-surface: #1c1c16` — primærtekst (brun-sort)
- `--color-on-surface-variant: #42493e` — sekundærtekst

### Admin MC (mørkere variant)
- `emerald-950` / `#022c22` — MC-sidebar bg
- `emerald-900/50` — hover-bg i MC-sidebar
- `emerald-100/70` — inaktiv tekst i MC-sidebar
- `lime-400` / `#d2f000` — aktive nav-items

### Outline
- `--color-outline: #72796e` — primærborder
- `--color-outline-variant: #c2c9bb` — subtil border

### Error
- `--color-error: #ba1a1a`
- `--color-error-container: #ffdad6`

## RADIUS

- `rounded-lg` (8px) — knapper, små elementer
- `rounded-xl` (12px) — standard kort, inputs
- `rounded-2xl` (16px) — featured kort
- `rounded-3xl` (24px) — hero, store kort
- `rounded-full` — pills, avatars

## SHADOWS

- `shadow-card: 0 4px 16px rgba(45,90,39,0.06)` — subtile kort
- `shadow-card-hover: 0 8px 24px rgba(45,90,39,0.08)` — kort hover
- `shadow-accent-glow: 0 0 15px rgba(210,240,0,0.2)` — lime-glow for achievements

## PATTERNS (eksporterte fra `@/components/portal/patterns`)

- `SGRing` — 4-konsentriske ringer for Strokes Gained
- `AKPyramide` — 5-lags treningsfordeling (FYS/TEK/SLAG/SPILL/TURN)
- `MonoLabel` — uppercase mono-label (Heritage-mønster)
- `NightSurface` — mørk bakgrunnsvariant for data-kort
- `BentoCard` — glass-bento-kort (light + dark variant)
- `VerticalTimeline` — dag-tidslinje med tid-prefix

**Arkivert** (i `_archived/pre-heritage-2026-04-19/patterns/`):
- CourseHero, GlassPanel, GlassButton, SlimIconRail, HeroLabel, FloatingTopbar, AIAttribution

## KOMPONENTER (`components/portal/premium`)

- `PremiumStatCard` — stat-kort med spotlight-effekt og animert tall

## IKON-WRAPPER

```tsx
import { Icon } from "@/components/ui/icon";

<Icon name="dashboard" size={20} />
<Icon name="check_circle" filled className="text-primary" />
```

Full Material Symbol-navnliste: https://fonts.google.com/icons

## NAVN SOM FORBUDTE (ikke bruk)

- `Inter`, `Lucide React` — erstattet med DM Sans, Material Symbols
- `--hg-*` — droppet (var Heritage Grid v1, nå v2 via `--color-*`)
- `--color-portal-*` — droppet, bruk `--color-surface`, `--color-on-surface` direkte
- `shadow-portal-*` — droppet, bruk `shadow-card`, `shadow-accent-glow`
- Fairway Estate / AK Sports OS-navn i UI — det er bare Heritage-referansenavn, vi bruker AK Golf

## NÅR DU SKRIVER NY KOMPONENT

1. **Finn Heritage-referanse** i `design-ref/stitch/heritage/<mappe>/code.html`
2. **Kopier Tailwind-klasser 1:1** — ikke tolk, ikke forenkle
3. **Test mot `screen.png`** før commit
4. **Bruk eksisterende patterns** der mulig (SGRing, AKPyramide, BentoCard, MonoLabel)
5. **Alltid DM Sans + Material Symbols** — aldri Inter/Lucide

## AUTHORITATIVE FILES

- `app/globals.css` — Heritage Material 3-tokens (linje 400-540)
- `app/layout.tsx` — DM Sans + JetBrains Mono via `next/font/google`, Material Symbols CSS-link
- `components/ui/icon.tsx` — Material Symbol-wrapper
- `components/shared/icons.tsx` — bakoverkompatibel Lucide-wrapper (returnerer Material Symbols internt)
