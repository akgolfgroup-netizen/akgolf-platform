# ADR-002: Alle farger via Tailwind-tokens

**Dato:** 11. april 2026
**Status:** Implementert — 61 filer migrert

## Beslutning

Alle farger i TSX/JSX-filer brukes utelukkende via Tailwind-tokens (`bg-primary`, `text-accent-cta`) eller CSS-variabler (`var(--color-primary)`). Hardkodede hex-verdier er forbudt.

For inline styles og Framer Motion importeres farger fra `@/lib/design-tokens`.

## Kontekst

En audit avdekket 861 hardkodede hex-verdier spredt over kodebasen. Dette forårsaket:

- Inkonsistent design — samme farge brukt med ulike hex-verdier
- Umulig å oppdatere farger sentralt
- Gammel brand-farge (#2D6A4F) levde videre ved siden av ny (#005840)
- Heritage Grid-variabler (`--hg-*`) og Apple Gold-tokens (`--apple-gold-*`) skapte forvirring

Migreringsarbeidet (refactor-commit `1e56071`) konverterte 61 filer fra hex til tokens.

## Regler

- `bg-[#005840]` → `bg-primary`
- `text-[#D1F843]` → `text-accent-cta`
- `bg-green-500` → `bg-primary` eller `bg-success`
- `text-gray-600` → `text-grey-600` (prosjektets grønn-tonede skala)
- Inline styles: `colors.primary.main` fra `@/lib/design-tokens`

Se `.claude/rules/design-system.md` for komplett token-referanse.

## Konsekvenser

- Alle nye komponenter MÅ bruke tokens — PR-er med hardkodet hex avvises
- Fargeendringer gjøres kun i `globals.css` og `design-tokens.ts`
- Generiske Tailwind-farger (`green-500`, `gray-400`, `blue-600`) er forbudt
