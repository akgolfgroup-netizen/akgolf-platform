# Designbeslutning 2026 — AK Golf Platform

**Status:** ÅPEN — venter på Anders' låsing
**Skrevet:** 2026-04-27
**Mål:** Velge ETT designsystem som låses for hele plattformen. Etter låsing flyttes alt annet til `_ARKIV/` og legacy-tokens fjernes fra koden.

---

## Bakgrunn

Plattformen har vært gjennom tre designretninger:

1. **Tidlig branding** (før 2026-04) — `#2D6A4F`, blandet typografi. Helt forlatt.
2. **Heritage Grid M3** (2026-04-19 → 2026-04-25) — `#154212` skogsgrønn + `#d2f000` lime, DM Sans, Material Symbols. Deprecated.
3. **Brand Guide V2.0** (2026-04-25 → i dag) — `#005840` skogsgrønn + `#D1F843` lime, Inter Tight + Inter + JetBrains Mono, lucide-react. Gjeldende.

Situasjonen i dag:
- `app/globals.css` har Brand V2.0 + `--legacy-*` aliaser for Heritage
- `app/layout.tsx` laster fortsatt DM Sans (legacy) og Material Symbols-CDN
- 3 godkjente HTML-mockups under `public/design-reference/` (V2.0)
- 35+ Stitch Heritage-mockups under `design-ref/stitch/heritage/` (legacy)
- 88 arkiverte docs under `docs/archive-2026-04-21/` og `docs/archive-2026-04-24/`

---

## Tre alternativer

### A — Brand Guide V2.0 (status quo, Anbefalt)

| Aspekt | Verdi |
|---|---|
| Primary | `#005840` skogsgrønn |
| Primary hover | `#00472f` |
| Accent / CTA | `#D1F843` high-energy lime |
| Surface | `#F4F6F4` varm cream |
| Card | `#FFFFFF` |
| Sidebar (mørk) | `#0F1F18` |
| Tekst (ink) | `#0A1F18` |
| Headlines | Inter Tight (display) |
| Body / UI | Inter |
| Tall / mono | JetBrains Mono |
| Ikoner | lucide-react |

**Visuelt uttrykk:** Cream-toned, premium, varm. Skogsgrønn dybde + lime som energi-accent. Inter Tight gir dramatic typography (Job Match-inspirasjon). Mørk sidebar gir kontrast (Cosmo-inspirasjon).

**Inspirasjoner:** Do.app, Flux, Celoxis, Job Match, Cosmo (referert i `.claude/rules/design-system.md`).

**Mockups:** `public/design-reference/playerhq-reference.html`, `coachhq-reference.html`, `student-360-reference.html`.

**Fordeler:**
- Allerede implementert i `app/globals.css`, `lib/design-tokens.ts`, alle nye komponenter
- 3 godkjente referanse-mockups eksisterer
- Brand Guide-dokumentet er ferdig (`.claude/rules/design-system.md`)
- `lucide-react` er allerede installert

**Ulemper:**
- Krever rydding av legacy-rester (DM Sans, Material Symbols, `--legacy-*`)
- Migrering av Heritage-bruk i eldre komponenter

**Migrasjons-kost:** Lav-medium — script-basert finn/erstatt + verifisering

---

### B — Heritage Grid M3 (rollback)

| Aspekt | Verdi |
|---|---|
| Primary | `#154212` Heritage-grønn |
| Accent | `#d2f000` Heritage-lime |
| Surface | `#fdf9f0` alabaster |
| Tekst | `#1c1c16` brun-sort |
| MC-sidebar | `#022c22` emerald-950 |
| Headlines / body | DM Sans |
| Tall / mono | JetBrains Mono |
| Ikoner | Material Symbols Outlined |

**Visuelt uttrykk:** Material 3, mørkere skogsgrønn, alabaster-bakgrunn. Mer "klassisk M3" enn Brand V2.0. Mer monolitisk look.

**Mockups:** 35+ Stitch-skjermer under `design-ref/stitch/heritage/`.

**Fordeler:**
- Mockup-bibliotek er stort (35+ skjermer)
- Material 3-konvensjoner er kjente

**Ulemper:**
- Allerede deprecated 2026-04-25 — vil bety rollback
- Aktiv kode er allerede migrert vekk fra Heritage-tokens
- Material Symbols krever ekstern CDN
- DM Sans er erstattet av Inter Tight + Inter

**Migrasjons-kost:** Høy — krever full reversering av rebrandet

---

### C — Justert Brand V2.0

Brand V2.0 som base, men med Anders' eventuelle justeringer på:

- Palette (f.eks. mørkere/lysere primary, annen accent)
- Typografi (annen display-font enn Inter Tight, annen body)
- Radius / shadows (mer eller mindre myk)
- Sidebar-fargen
- Surface-tone (mer/mindre cream)

**Hvordan velge dette:**
1. Anders skriver konkrete justeringer i seksjonen "Anders' justeringer" nederst
2. Dupliser én mockup fra `public/design-reference/` med justerte tokens for visuell sammenligning
3. Lås beslutningen først etter visuell verifikasjon

**Migrasjons-kost:** Avhenger av justeringene. Små farge-/font-bytter er lav kost; større layout-endringer er høy kost.

---

## Sammenligningstabell

|  | A — Brand V2.0 | B — Heritage M3 | C — Justert V2.0 |
|---|---|---|---|
| Primary | `#005840` | `#154212` | TBD |
| Accent | `#D1F843` | `#d2f000` | TBD |
| Surface | `#F4F6F4` | `#fdf9f0` | TBD |
| Display font | Inter Tight | DM Sans | TBD |
| Body font | Inter | DM Sans | TBD |
| Ikoner | lucide-react | Material Symbols | TBD |
| Mockups | 3 godkjente HTML | 35+ Stitch | TBD |
| Kode-status | Implementert | Deprecated | Krever endring |
| Migrasjons-kost | Lav-medium | Høy | Variabel |
| Ark.-effekt | Ryddig | Splittet | Avhenger |

---

## Anders' justeringer (fyll inn hvis C velges)

> _Skriv konkrete endringer her hvis du velger C. La være tom hvis du velger A eller B._

- Palette: …
- Typografi: …
- Radius/shadows: …
- Annet: …

---

## Beslutning

**Valgt retning:** _____________________________________ (A / B / C)

**Begrunnelse:**

> _Skriv 1–3 setninger om hvorfor._

**Låst dato:** ____________

**Signert av Anders:** ____________

---

## Neste steg etter låsing

1. Skriv `docs/decisions/003_final_design_2026.md` med valg + dato + begrunnelse
2. Hvis A → kjør Fase 2 (ARKIV) og Fase 3 (legacy-migrering) som beskrevet i `~/.claude/plans/vi-skal-ha-lage-ancient-raven.md`
3. Hvis B → snu migreringen (urealistisk, men mulig)
4. Hvis C → oppdater `app/globals.css` + `lib/design-tokens.ts` + `app/layout.tsx` til justerte verdier, deretter Fase 2 + Fase 3
