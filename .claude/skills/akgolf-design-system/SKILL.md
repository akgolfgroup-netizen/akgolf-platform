---
name: akgolf-design-system
description: Designsystem-ekspert for AK Golf Platform. Bruk ALLTID denne skillen når Anders spør om farger, fonter, komponenter, layout, ikoner, spacing, eller visuell stil for akgolf-platform. Trigger også ved fraser som "hvordan skal X se ut", "hvilken farge", "vis meg et design", "lag en mockup", "design-review", "er dette konsistent", "oppdater designet", "hvordan matcher dette designsystemet", eller når Anders laster opp skjermbilder for design-feedback. Kombinerer AK Golf designsystem med VibeUI-mønstre for å produsere produksjonsklar kode eller konkrete designbeslutninger.
---

# AK Golf Design System v3 (April 2026)

## Farger
Primary: #005840 | Accent: #D1F843 | Surface: #F5F7F5 | Card: #FFFFFF
Border: #DDE8E2 | Text: #1A2E27 | Text mid: #4A6358 | Muted: #8BA89D
Dark sidebar: #0A1F18 | Success: #2A7D5A | Warning: #C48A32 | Danger: #B84233

## Font
Inter (variable 300–700) via next/font/google. Ingen andre fonter.

## Ikoner
Lucide React. Material Symbols er FORBUDT.

## Border-radius
Knapper/input: 8px | Kort: 12px | Modal: 16px | Pills: 20px

## Komponentstil
- Lys bakgrunn overalt (#F5F7F5 / #FFFFFF)
- Eneste unntak: CoachHQ-sidebar (#0A1F18)
- Aldri mørk bakgrunn på hovedinnhold

## FORBUDT
Heritage-tokens: #022c22, #154212, #d2f000
Material Symbols, emerald-* Tailwind-klasser

## VibeUI-mønstre
Henvis til https://vibeui.online/ for layout-mønstre.
Landingsside: Split hero, Bento grid, Free vs Pro split
Portal: Sidebar + main, Metric cards + chart
Admin: Three-pane layout, Kanban board
