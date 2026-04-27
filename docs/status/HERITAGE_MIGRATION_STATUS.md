# Heritage Grid Design-migrering — Sluttstatus

**Oppdatert:** 2026-04-19 kveld/natt (autonom nattsesjon)

## Sammendrag

Appen er migrert fra 3 parallelle design-systemer (`--hg-*`, `--color-portal-*`, `--color-primary v1`) til **Heritage Grid Material 3 Expressive** — 1 sannhetskilde basert på 195 Stitch-skjermer som bruker valgte som referanse.

## Kommitet arbeid

| Steg | Commit | Beskrivelse |
|---|---|---|
| 0 | `8218251` | Pre-heritage checkpoint |
| 1 | `98679e6` | Heritage tokens + DM Sans + Material Symbols |
| 3 | `d5e1a89` | Bulk-rename 45 filer (portal-*, --hg-*) |
| 4 | `3bdb5d2` | Lucide → Material Symbols (275 filer) |
| 6a | `59ee65d` | Portal-sidebar 1:1 Heritage (#2d5a27 bg) |
| 6b | `8606d02` | MC-sidebar 1:1 Heritage (#022c22 bg) |
| 6c | `f677cf8` | Fjern ViewSwitcher-tabs fra dashboard |
| 6d | `b223ac1` | Landing-nav Heritage-stil |
| 7 | `c99d734` | Opprydding + ny design-system.md |
| - | `785f304` | Fix: restaurere patterns som fortsatt brukes |

## Nåværende tilstand

### Verifisert OK (smoke-test 14 ruter):
- Alle ruter returnerer 200 (public) eller 307 (auth-redirect)
- Ingen 500-feil
- Type-check: 12 pre-eksisterende feil, 0 nye
- Dev-server kjører uten build-errors

### Visuelt migrert:
- Tokens (40+ Material 3-farger, radius, shadows)
- Fonter (DM Sans + JetBrains Mono + Material Symbols)
- Portal-sidebar (mørk grønn, lime-aktiv)
- MC-sidebar (emerald-950, lime-aktiv, AK Golf header)
- Landing-nav (uppercase, lime-accent)
- Dashboard (én layout, ingen view-tabs)
- Alle `bg-portal-*`, `text-portal-*`, `--hg-*` erstattet

### Gjenværende arbeid (ikke kritisk):

**Bør vurderes av bruker:**
1. **Empty-states:** Heritage har rike varianter (`utility_empty_data_state`) med bento-grid, icon-hero, knapper. Vår er enkel. Lav prioritet.
2. **Statistikk-siden:** Bruker fortsatt `statistikk-course-hero-view.tsx` med `CourseHero/GlassPanel/GlassButton` patterns. Fungerer visuelt OK men er ikke 1:1 Heritage `analytics_strokes_gained`. Medium prioritet.
3. **Booking-flow:** `/portal/bookinger/ny/book-coaching-form.tsx` — ikke verifisert mot Heritage `booking_coach_selection` / `booking_date_time`. Medium prioritet.
4. **Sub-nav tabs:** Portal har `SubNavTabs` (Oversikt/Kartlegging/Runder/Trening) på statistikk og kartlegging. Fungerer, men Heritage bruker andre mønstre. Lav prioritet.
5. **Meldinger-layout:** `/portal/meldinger` og `/admin/meldinger` — ikke verifisert mot Heritage `coach_messages`/`inbox_main`. Medium prioritet.

**Teknisk gjeld som kan rydde:**
- 95 filer har fortsatt `import ... from "lucide-react"` for ref/prop-bruk (ikke JSX). Disse Lucide-imports brukes ikke visuelt lenger fordi `components/shared/icons.tsx` er Material-Symbols-wrapped, men filene er fortsatt avhengige. Senere steg: fjerne disse imports og referansene.
- `grey-*`-skalaen (900+ forekomster) er alias-mappet i `globals.css` til Heritage surface-container/outline-variants. Fungerer visuelt, men "grey-50 = surface-container-low" er forvirrende for nye utviklere. Vurdér Steg 2 bulk-rename for klarhet.
- `bg-primary-alt`, `bg-accent-cta` aliaser finnes fortsatt i `globals.css` for bakoverkompatibilitet. Kan fjernes når ingen filer refererer dem.

## Arkiver

**Slettet fra aktiv kode:**
- `app/portal/(dashboard)/dashboard-views/`: FocusTodayView, DataRichView, ProgressStoryView, CommandCenterView (erstattet av default AthleticGridView)

**Beholdt i aktiv kode (fortsatt brukt):**
- `components/portal/patterns/`: SGRing, AKPyramide, BentoCard, CourseHero, GlassPanel, GlassButton, HeroLabel, SlimIconRail, FloatingTopbar, AIAttribution, MonoLabel, NightSurface, VerticalTimeline
- `components/portal/premium/`: PremiumStatCard (brukt 21 steder)

**Ikke arkivert** (av hensyn til Steg 7-feil):
- Patterns som CourseHero/GlassPanel ble restaurert etter at de ga build-feil. Disse er fortsatt "ikke 100% Heritage" men fungerer.

## Heritage som ÉN sannhet

**Gjeldende docs:**
- `.claude/rules/design-system.md` — 188 linjer, full spec
- `.claude/rules/gotchas.md` — Heritage-regler lagt til

**Arkivert/droppet:**
- `docs/DESIGN_SYSTEM.md`, `docs/design-system-v3.1.md`, `docs/stitch-*.md` — droppet
- Alle "Heritage Grid v1" / "Portal theme" / "V3.1 Design Canvas" — erstattet av Heritage Grid v2 (Material 3)

## Referanse-system

For hver ny komponent:

1. **Finn Heritage-skjerm i tabellen** i `.claude/rules/design-system.md`
2. **Les `code.html`** fra `design-ref/stitch/heritage/<mappe>/`
3. **Kopier Tailwind-klasser 1:1** — ikke tolk
4. **Sammenlign med `screen.png`** før commit
5. **Bruk `<Icon name="material_name" />`** for alle ikoner
6. **DM Sans overalt** — via `next/font/google`

## Neste stegs (om morgenen)

Avhengig av hva bruker ser:

1. **Hvis fornøyd visuelt:** hoppe til å legge til manglende sider (spillerprofil-detaljer, treningsøkt-flyt, etc.)
2. **Hvis visuelle gap:** identifisere spesifikke sider + rewrite mot Heritage-referanse (f.eks. `/portal/statistikk` → `analytics_strokes_gained`)
3. **Hvis kritiske bugs:** revert siste commit(er) og diskutere tilnærming

Alle commits er atomiske — kan reverts individuelt.
