---
name: ak-golf-design
description: Use this skill to generate well-branded interfaces and assets for AK Golf Group, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

Key references in this skill:
- `README.md` — content fundamentals, visual foundations, iconography
- `colors_and_type.css` — drop-in CSS variables + semantic type helpers
- `design-tokens.css` / `design-tokens.json` / `tailwind-theme.js` — original brand tokens
- `assets/logos/` — 7 SVG logo variants + PNG fallbacks
- `ui_kits/spillerportal/` — React component kit for the player portal dashboard (dark + light)

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions (at minimum: which surface — player portal / admin / marketing / merch / print / social / slides), and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Non-negotiables when designing for this brand:
- Norwegian bokmål copy only.
- Inter font (300-800). The logotype itself is a custom serif — never recreate it in Inter.
- Accent lime `#D1F843` is ≤10% of any view. Primary green `#005840` + surface do the structural work.
- Dark mode is the primary expression; light mode is a mirror.
- Cards: 16px radius, 1px border, soft shadow. One "glow" card per view maximum.
- 8pt grid, strictly.
- Emoji are acceptable as compact inline glyphs in data-dense UI; Lucide icons preferred everywhere else.
