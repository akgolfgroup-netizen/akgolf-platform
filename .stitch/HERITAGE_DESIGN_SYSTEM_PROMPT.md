# Heritage Grid Design System — Complete Stitch Prompt
## AK Sports OS Master Design Specification

**Version:** 3.0 FINAL | **Date:** April 2026
**Brand Concept:** "Heritage meets Precision" — Luxury Sports Technology
**UI Philosophy:** Bento-grid system, dark mode default, clinical data precision

---

## 1. BRAND DNA

### Core Philosophy
AK Sports OS represents the fusion of traditional sporting heritage with cutting-edge technology. The visual language communicates:
- **Authority:** Deep, rich greens signal established expertise
- **Innovation:** Electric lime accents show technological advancement  
- **Precision:** Clean grids and exact spacing demonstrate clinical accuracy
- **Luxury:** Restrained palette with premium finishes

### Three Pillars (Visual Distinction)
Each module has subtle color coding while maintaining Heritage Grid cohesion:
- **Academy:** Heritage Green (#2D5A27) + Electric Lime (#DFFF00)
- **Wang Hub:** Heritage Green + Cyan Blue (#00D4FF)
- **Facility OS:** Heritage Green + Warm Amber (#F5A623)

---

## 2. COLOR SYSTEM

### Primary Palette (Heritage Greens)
```
Heritage Deep:    #1A3520 (Deepest backgrounds)
Heritage Base:    #2D5A27 (Primary brand color)
Heritage Light:   #3D7A37 (Hover states, accents)
Heritage Muted:   rgba(45, 90, 39, 0.12) (Subtle backgrounds)
```

### Accent Colors
```
Electric Lime:    #DFFF00 (Primary CTAs, highlights)
Lime Dark:        #B8D400 (Lime hover)
Lime Muted:       rgba(223, 255, 0, 0.12) (Lime backgrounds)

Wang Cyan:        #00D4FF (Wang Hub module)
Amber:            #F5A623 (Facility module)
```

### Neutral Palette (Dark Mode)
```
Pure Black:       #0A0D0A (Deepest background)
Ink:              #1A1D1A (Card backgrounds)
Graphite:         #2A2D2A (Elevated surfaces)
Charcoal:         #3A3D3A (Input fields, secondary cards)
Warm Grey:        #8A8680 (Secondary text, muted)
Cream:            #F5F1E8 (Primary text on dark)
```

### Semantic Colors
```
Success:          #00C853 (Green - positive trends)
Success Muted:    rgba(0, 200, 83, 0.2)
Warning:          #FFB800 (Amber - cautions)
Warning Muted:    rgba(255, 184, 0, 0.2)
Error:            #FF3D71 (Red - critical)
Error Muted:      rgba(255, 61, 113, 0.2)
Info:             #00D4FF (Blue - information)
```

### Gradients
```
Heritage Glow:    linear-gradient(135deg, #2D5A27 0%, #1A3520 100%)
Lime Burst:       linear-gradient(135deg, #DFFF00 0%, #B8D400 100%)
Card Surface:     linear-gradient(180deg, #3A3D3A 0%, #2A2D2A 100%)
Dark Depth:       linear-gradient(180deg, #2A2D2A 0%, #1A1D1A 100%)
```

---

## 3. TYPOGRAPHY

### Font Stack
```
Headlines:  "Playfair Display", Georgia, serif (Heritage, authoritative)
Body:       "Inter", -apple-system, sans-serif (Technical, precise)
Mono:       "JetBrains Mono", "Fira Code", monospace (Data, code)
```

### Type Scale
```
Hero:        72-120px / Playfair / 700 / -0.04em / 1.1 line-height
H1:          48-72px / Playfair / 600 / -0.03em / 1.15
H2:          36-48px / Playfair / 600 / -0.02em / 1.2
H3:          24-32px / Playfair / 600 / -0.01em / 1.25
H4:          20-24px / Inter / 600 / 0 / 1.3
H5:          18px / Inter / 600 / 0 / 1.4
Body Large:  18px / Inter / 400 / 0 / 1.6
Body:        16px / Inter / 400 / 0 / 1.5
Body Small:  14px / Inter / 400 / 0 / 1.5
Caption:     12px / Inter / 500 / +0.05em / 1.4 (uppercase for labels)
Micro:       11px / Inter / 500 / +0.1em / 1.4 (tracking labels)
```

### Typography Rules
- **Numbers:** Always use tabular-nums for data (handicap, scores, currency)
- **Headlines:** Tight tracking (-0.02em to -0.04em), never bold body text
- **Contrast:** Minimum 4.5:1 for body, 3:1 for large text (WCAG AA)

---

## 4. LAYOUT SYSTEM

### Bento Grid Foundation
```
Container Max-Width: 1400px
Grid: 12-column
Gap: 16px (small) / 24px (large)
Padding: 24px (mobile) / 48px (desktop)
```

### Grid Patterns
```
HERO:        12 columns × 2 rows (featured card spans 8 cols + 4 cols side)
STATS:       4 equal columns (3 cols each)
FEATURES:    3 columns (4 cols each)
DASHBOARD:   12 columns (mix of 3, 4, 6, 8, 9 col spans)
CARD GRID:   2-3 columns with varied heights (never uniform)
```

### Spacing Scale (8pt Base)
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
```

### Section Spacing
```
Small:   64px
Medium:  96px
Large:   128px
Hero:    160px
```

---

## 5. COMPONENT SPECIFICATIONS

### Buttons

**Primary Button (Lime)**
```
Background:    #DFFF00
Text:          #0A0D0A (Pure Black)
Border:        none
Border Radius: 8px
Padding:       12px 24px
Font:          Inter 600 16px
Shadow:        0 0 20px rgba(223, 255, 0, 0.4)
Hover:         Background #B8D400, scale(1.02), shadow 0 0 30px rgba(223, 255, 0, 0.5)
Transition:    all 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Secondary Button (Outline)**
```
Background:    transparent
Text:          #DFFF00
Border:        1px solid #DFFF00
Border Radius: 8px
Padding:       12px 24px
Hover:         Background rgba(223, 255, 0, 0.12), glow effect
```

**Heritage Button (Green)**
```
Background:    #2D5A27
Text:          #F5F1E8
Border:        none
Border Radius: 8px
Hover:         Background #3D7A37, shadow 0 0 20px rgba(45, 90, 39, 0.4)
```

### Cards

**Standard Card**
```
Background:    linear-gradient(180deg, #3A3D3A 0%, #2A2D2A 100%)
Border:        1px solid rgba(255, 255, 255, 0.06)
Border Radius: 16px
Padding:       24px
Shadow:        0 1px 3px rgba(0, 0, 0, 0.3)
Hover:         Border-color rgba(223, 255, 0, 0.2), translateY(-4px), shadow increase
Transition:    all 400ms cubic-bezier(0.4, 0, 0.2, 1)
```

**Featured Card (Lime Accent)**
```
Background:    linear-gradient(135deg, #2D5A2720 0%, #1A1D1A 100%)
Border:        1px solid rgba(223, 255, 0, 0.3)
Border Radius: 20px
Padding:       32px
Shadow:        0 0 60px rgba(223, 255, 0, 0.1)
```

**Stat Card (Data Display)**
```
Background:    #3A3D3A
Border:        1px solid rgba(255, 255, 255, 0.06)
Border Radius: 12px
Padding:       20px
Number Font:   Playfair Display, 48px, #DFFF00
Label Font:    Inter 12px uppercase, #8A8680
```

### Input Fields
```
Background:    #1A1D1A
Border:        1px solid rgba(255, 255, 255, 0.1)
Border Radius: 8px
Padding:       12px 16px
Text Color:    #F5F1E8
Placeholder:   #8A8680
Focus Border:  #DFFF00
Focus Shadow:  0 0 0 3px rgba(223, 255, 0, 0.15)
```

### Badges
```
Lime Badge:
  Background: rgba(223, 255, 0, 0.15)
  Text: #DFFF00
  Border Radius: 9999px
  Padding: 4px 12px
  Font: 12px semibold

Heritage Badge:
  Background: rgba(45, 90, 39, 0.3)
  Text: #3D7A37
  Border Radius: 9999px
```

---

## 6. ANIMATIONS & EFFECTS

### Standard Transitions
```
Fast:    150ms cubic-bezier(0.4, 0, 0.2, 1)
Normal:  300ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:    500ms cubic-bezier(0.4, 0, 0.2, 1)
Heritage: 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

### Glow Effects
```
Lime Glow:     0 0 20px rgba(223, 255, 0, 0.3)
Lime Glow Strong: 0 0 40px rgba(223, 255, 0, 0.4)
Heritage Glow: 0 0 30px rgba(45, 90, 39, 0.4)
```

### Hover States
```
Cards:         translateY(-4px), shadow increase, border glow
Buttons:       scale(1.02), shadow glow
Nav Items:     x-translate(4px), background highlight
Stats:         Number count-up animation
```

### Scroll Animations
```
Fade In Up:    opacity 0→1, translateY 30px→0, duration 700ms
Stagger:       100ms delay between items
Parallax:      Subtle 0.5x speed background elements
```

---

## 7. SCREEN-SPECIFIC GUIDELINES

### Landing Page Structure
```
1. HERO (100vh):
   - Dark background with gradient mesh
   - Large Playfair headline (72px+)
   - Lime accent word in gradient
   - Two CTAs (Primary + Secondary)
   - 4-column stat row below fold

2. 20-MIN COACHING SECTION:
   - 2-column layout (text left, pricing card right)
   - Pricing card: Lime accent, glow effect
   - Feature list with checkmarks
   - "2000 kr/mnd" prominently displayed

3. THREE PILLARS (Bento Grid):
   - 3 cards in row
   - Each with module color indicator
   - Icon + Title + Description + Feature tags

4. VALUE PROPOSITION:
   - 72M NOK valuation visualization
   - Comparison table (Old vs New model)

5. ROADMAP:
   - 3 Q-cards (Q2, Q3, Q4 2026)
   - Current quarter highlighted with lime

6. CTA SECTION:
   - Heritage gradient background
   - Centered content
   - Strong glow effects

7. FOOTER:
   - 4-column layout
   - Logo + Crown icon
   - Lime accent links
```

### Dashboard Structure
```
HEADER:
  - Height: 72px
  - Background: rgba(10, 13, 10, 0.8) + blur
  - Logo left, date right, lime badge for "20-min modus"

SIDEBAR:
  - Width: 280px (expanded) / 80px (collapsed)
  - Background: #1A1D1A
  - Module sections with color indicators
  - Active item: Lime background tint + left border

MAIN CONTENT AREA:
  - Background: #0A0D0A
  - Bento grid cards
  - Stat cards at top
  - Charts: Lime/cyan data lines on dark grid
```

### Cards Common Patterns
```
STAT CARD:
  ┌─────────────────────────────┐
  │ [Icon]                [Trend]│
  │                             │
  │ 132                         │
  │ DATABASE-MODELLER            │
  └─────────────────────────────┘

FEATURE CARD:
  ┌─────────────────────────────┐
  │ [Icon Box]                  │
  │ Module Name                 │
  │ Title                       │
  │ Description text...         │
  │ [tag] [tag] [tag]           │
  └─────────────────────────────┘

PRICING CARD:
  ┌─────────────────────────────┐
  │ [POPULÆR badge]             │
  │ Title                       │
  │                             │
  │ 2 000 kr                    │
  │ /mnd                        │
  │                             │
  │ [4×20 min highlight box]    │
  │                             │
  │ ✓ Feature 1                 │
  │ ✓ Feature 2                 │
  │                             │
  │ [Button]                    │
  └─────────────────────────────┘
```

---

## 8. DATA VISUALIZATION

### Chart Colors
```
Primary:       #DFFF00 (Lime)
Secondary:     #00D4FF (Cyan)
Tertiary:      #F5A623 (Amber)
Quaternary:    #2D5A27 (Heritage)
Grid Lines:    rgba(255, 255, 255, 0.06)
Text:          #8A8680
```

### Graph Styles
```
Line Charts:   2px stroke, lime, with gradient fill below
Bar Charts:    Rounded tops (4px), heritage green with lime accent
Pie Charts:    Heritage palette with lime highlight slice
Sparklines:    Lime, no axis, subtle gradient
```

### Data Tables
```
Header:        #3A3D3A background, #F5F1E8 text, uppercase 12px
Row:           #2A2D2A alternating with transparent
Border:        1px solid rgba(255, 255, 255, 0.06)
Hover:         rgba(223, 255, 0, 0.05)
Selected:      rgba(223, 255, 0, 0.1)
```

---

## 9. DOS AND DON'TS

### ✅ DO
- Use dark backgrounds (#0A0D0A, #1A1D1A)
- Use lime (#DFFF00) sparingly for maximum impact (CTAs, key numbers)
- Maintain generous whitespace (breathable luxury feel)
- Use Playfair for headlines only, Inter for everything else
- Apply consistent 8pt spacing
- Use glow effects on important interactive elements
- Keep borders subtle (rgba white 0.06-0.1)

### ❌ DON'T
- Use bright white backgrounds (breaks heritage aesthetic)
- Use lime for large surface areas (too intense)
- Mix more than 3 font sizes per screen
- Use default browser focus styles (always custom lime outline)
- Make all cards same size (bento = varied proportions)
- Use harsh shadows (keep them soft and colored)
- Forget tabular-nums for data display

---

## 10. BATCH GENERATION TEMPLATES

When generating multiple screens, use this format:

```
"Generate these 5 screens for AK Sports OS using Heritage Grid Design System:

1. DASHBOARD - Main overview with bento grid, stats row, recent activity
2. TRACKMAN - Data vault with shot charts, analytics, trends
3. COACHING - 20-min session scheduler, booking flow
4. ANALYTICS - Strokes gained visualization, benchmarks
5. SETTINGS - Profile, preferences, billing

Reference: Full Heritage Grid spec above.
Theme: Dark mode, lime accents, Playfair+Inter fonts, bento layout."
```

---

## 11. QUALITY CHECKLIST

Before approving any generated screen, verify:

- [ ] Background is #0A0D0A or #1A1D1A (not pure white)
- [ ] Headlines use Playfair Display
- [ ] CTAs use #DFFF00 lime with glow
- [ ] Cards have subtle borders (rgba white 0.06)
- [ ] Spacing follows 8pt grid
- [ ] Bento layout (varied card sizes)
- [ ] Heritage Green + Lime color scheme only
- [ ] No neon or bright unrelated colors
- [ ] Data numbers use tabular-nums
- [ ] Consistent border-radius (8px buttons, 16px cards)

---

**END OF DESIGN SYSTEM SPECIFICATION**

Use this document as the single source of truth for all AK Sports OS design generation in Stitch. Copy relevant sections into prompts as needed.
