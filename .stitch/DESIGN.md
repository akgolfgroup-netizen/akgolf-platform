# AK Golf Platform — Stitch Design System

**Authoritative design specification for all screen generation in AK Golf Platform (portal + marketing site).**

**Brand Version:** 5.0 FINAL (Master Brand Ecosystem 2026)  
**Generated:** April 6, 2026 | **Updated:** April 6, 2026

---

## BRAND IDENTITY

**Core principle:** Professional authority, light mode. "Sort. Hvit. En grønn." — black, white, warm stone, one green accent.

**Not luxury.** Not tech-complex. A calm expert who doesn't need to convince you — you see it in the quality.

**Logo:** AK monogram in SVG. Default prikk (dot) is gray (#D2D2D7). **Deep Emerald (#00594C)** in hero, inverted white on dark.

**Typography:** Inter (Google Fonts, variable 300-700). Dramatic sizing: 11px → 72px. Letter-spacing tightens with size.

---

## COLOR SYSTEM (FINAL v5.0)

### Primary Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|---|---|
| Deep Emerald | #00594C | --color-primary | Logo prikk, CTA "Book coaching", nav accent, brand color |
| Emerald Light | #E6F3F1 | --color-primary-light | Light backgrounds, hover states |
| Emerald Dark | #004940 | --color-primary-dark | Hover states on primary elements |

### Secondary Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|---|---|
| Sage Grey | #627C75 | --color-secondary | Secondary accents, muted elements |
| Sage Light | #E8EEEC | --color-secondary-light | Secondary backgrounds |

### Tertiary Palette (AI)

| Token | Hex | CSS Variable | Usage |
|-------|-----|---|---|
| Purple | #8E5CE6 | --color-tertiary | AI elements, highlights |
| Purple Light | #F3EEFC | --color-tertiary-light | AI backgrounds |

### Neutral Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|---|---|
| Warm Stone | #EBE7E0 | --color-background | Main page background |
| Pure White | #FFFFFF | --color-surface | Cards, elevated surfaces |
| Neutral Beige | #BEB7B0 | --color-neutral | Neutral accents, subtle elements |
| Pure Black | #000000 | --color-text-primary | Primary text, headings |
| Graphite | #36454F | --color-text-secondary | Secondary text |
| Grey 400 | #86868B | --color-text-muted | Muted text, placeholders |

### Semantic Colors (Apple Standard)

| Token | Hex | CSS Variable | Usage |
|-------|-----|---|---|
| Success | #34C759 | --color-success | Positive trends, checkmarks, completion |
| Success Light | #F0FDF4 | --color-success-light | Success background |
| Error | #FF3B30 | --color-error | Negative trends, cancellation, errors |
| Error Light | #FEF2F2 | --color-error-light | Error background |
| Warning | #FF9500 | --color-warning | Streak broken, reminders, deadlines |
| Warning Light | #FFFBEB | --color-warning-light | Warning background |
| Info | #007AFF | --color-info | Information, links |

### Color Don'ts

- ❌ Bronze/gold (#B07D4F)
- ❌ Yellow (#F5C518)
- ❌ Neon, gradients (unless subtle)
- ❌ Blue as general accent (reserved for links)
- ❌ Dark mode in portal

---

## TYPOGRAPHY

Inter, variable weight 300-700. Dramatic size variation. **Letter-spacing tightens as size increases.**

### Type Scale (v5.0 FINAL)

| Element | Size | Weight | Letter-spacing | Use |
|---------|------|--------|---|---|
| Hero Display | 60px (3.75rem) | 700 | -0.02em | Page hero titles |
| H1 (Section) | 36px (2.25rem) | 700 | -0.025em | Major sections |
| H2 (Card) | 30px (1.875rem) | 700 | -0.01em | Card/modal titles |
| H3 | 24px (1.5rem) | 600 | -0.01em | Sub-sections |
| Body | 16px (1rem) | 400 | 0 | Standard text |
| Small | 14px (0.875rem) | 400 | 0 | Secondary text |
| Label / Caption | 12px (0.75rem) | 600 | +0.12em, UPPERCASE | Labels, badges |
| Stat Number (large) | 26-64px | 800 | -0.025em, tabular-nums | KPIs, metrics |

### Typography Rules

- **`font-variant-numeric: tabular-nums`** on ALL numbers (handicap, score, kroner, %)
- **`text-wrap: balance`** on all headings
- **Max 3 font sizes per screen**
- Never bold body text for emphasis; use slightly larger size instead

---

## SPACING & LAYOUT

### 8pt Grid System

| Token | Value |
|-------|-------|
| --space-1 | 4px |
| --space-2 | 8px |
| --space-3 | 12px |
| --space-4 | 16px |
| --space-5 | 20px |
| --space-6 | 24px |
| --space-8 | 32px |
| --space-10 | 40px |
| --space-12 | 48px |
| --space-16 | 64px |

### Section Spacing (Responsive)

- **Mobile:** 5rem (80px)
- **Tablet:** 6rem (96px)
- **Desktop:** 7rem (112px)
- **Large:** 10rem (160px)

### Container (v5.0)

- **Marketing:** max-width 1120px
- **Portal Main:** max-width 1400px
- **Padding:** 1rem (mobile), 1.5rem (tablet), 2rem (desktop)

### Grid System

**Never use identical grid.** Each page has minimum 2 different card sizes. Use bento layout:
- Option 1: 2fr + 1fr (wide card + smaller card)
- Option 2: 3fr + 2fr (dominant + secondary)
- Option 3: 1fr + 1fr + 1fr + 1fr with 2 spanning 2 columns

**Responsive:**
- Desktop: 3-4 column grid
- Tablet: 2 column
- Mobile: 1 column (except stat rows)

---

## COMPONENT LIBRARY

### Buttons

All buttons: `rounded-full` (border-radius: 980px), Inter 600.

| Type | Background | Text | Border | Usage |
|------|---|---|---|---|
| Primary | #00594C | white | none | Main CTA, "Book coaching" |
| Secondary | #627C75 | white | none | Secondary actions |
| Inverted | white | #000000 | none | Dark backgrounds |
| Outlined | transparent | #000000 | #E8E8ED | Tertiary actions |
| Ghost | transparent | #00594C | none | Text links |

**States:**
- Hover: opacity 0.9, translateY(-2px)
- Active: shadow-md
- Disabled: opacity 0.5

### Cards

Standard card: Pure White (#FFFFFF) background, subtle border, rounded-[16px] to rounded-[24px], padding 16px or 24px.

**Background variants:**
- Pure White (#FFFFFF) for primary cards
- Warm Stone (#EBE7E0) for secondary/alternating sections

**Stat Card (KPI):**
```
┌──────────────────────┐
│ LABEL (10px, uppercase grey)     │
│ 2840 (26px, weight 800, tabular)  │
│ ↑ 12% (11px, success)            │
│ [sparkline: 7 bars]              │
└──────────────────────┘
```

**AI Recommendation Card:**
- Background: #F3EEFC (purple light)
- Badge: "AI-RECOMMENDATION" (9px, uppercase, #8E5CE6)
- Sparkle icon before title

### Form Elements

- Input border: neutral color (1px)
- Focus border: #00594C (2px)
- Label: 14px, 600, Graphite
- Placeholder: grey-400, 14px, 400

### Badges

| Type | Background | Text | Icon |
|------|---|---|---|
| Success | #F0FDF4 | #166534 | ✓ |
| Warning | #FFFBEB | #92400E | ⚠ |
| Error | #FEF2F2 | #991B1B | ✕ |
| Info | #EFF6FF | #1E40AF | ⓘ |
| AI | #F3EEFC | #8E5CE6 | ✨ |

---

## ANIMATION & INTERACTION

All animations: Framer Motion, easing: `[0.4, 0, 0.2, 1]` (cubic-bezier).

### Standard Easing
- **Premium:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Bounce:** `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Scroll Reveal
- Opacity: 0 → 1
- Transform: translateY(20px) → 0
- Duration: 0.4-0.7s
- Stagger: 0.08s between items
- Respect `prefers-reduced-motion`

### Hover States
- `translateY(-2px)`
- Shadow: md or lg
- Duration: 300ms

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## OUTPUT GUIDELINES FOR STITCH GENERATION

When generating screens, follow these rules:

1. **Color Consistency:** Use ONLY the finalized palette above.
2. **Typography:** Use exact sizes and weights from type scale. Max 3 sizes per screen.
3. **Spacing:** 8px base unit (8, 16, 24, 32, 40, 48px).
4. **No AI Slop:** Bento grids with varied sizes, not flat identity grids.
5. **Buttons:** All rounded-full. "Book coaching" = Deep Emerald (#00594C).
6. **Cards:** Pure White + subtle border + rounded-[16px] to rounded-[24px].
7. **Stat Focus:** Every metric with sparkline + trend + context.
8. **Icons:** Lucide only. No emoji.
9. **Responsive:** Desktop-first, scale down cleanly.
10. **Accessibility:** WCAG AA contrast, `prefers-reduced-motion`, semantic HTML.

---

## RESOURCES

- **Brand Guide:** Master Brand Ecosystem v5.0 FINAL
- **Design Tokens:** `globals.css`
- **Stitch Skills:** `.agents/skills/stitch-design/`

---

**Last Updated:** April 6, 2026 (Brand v5.0 FINAL)  
**Version:** 5.0 FINAL  
**Maintainer:** AK Golf Design Team
