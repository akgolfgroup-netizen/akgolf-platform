# AK Golf - Complete Component Library for Stitch

## 🎨 FARGE-REFERANSE

| Navn | HEX | Bruk |
|------|-----|------|
| Primary | `#005840` | Knapper, headings, lenker |
| Accent | `#D1F843` | CTA, highlights, badges |
| Surface | `#ECF0EF` | Bakgrunner |
| Text | `#324D45` | Tekst |
| Muted | `#A5B2AD` | Sekundær tekst |
| Dark | `#0A1F18` | Dark mode, footer |
| Success | `#2A7D5A` | Suksess, positive tall |
| Error | `#B84233` | Feil, validering |
| Warning | `#C48A32` | Advarsler |
| Info | `#007AFF` | Info, lenker |

---

## 1️⃣ BUTTONS

### Primary Button
```
Name: Button/Primary
Background: #005840
Text: #FFFFFF
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Semibold (600)
Border: none
Cursor: pointer
```

**Hover:**
- Background: #004A36
- Transform: scale(1.02)
- Shadow: 0 4px 12px rgba(0,0,0,0.06)

**Active:**
- Transform: scale(0.98)

**Disabled:**
- Background: #A5B2AD
- Text: #5A6E66
- Cursor: not-allowed

### Accent Button (CTA)
```
Name: Button/Accent
Background: #D1F843
Text: #0A1F18
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Semibold (600)
```

### Secondary Button
```
Name: Button/Secondary
Background: transparent
Text: #005840
Border: 2px solid #005840
Border radius: 12px
Padding: 12px 24px
```

**Hover:**
- Background: #005840
- Text: #FFFFFF

### Ghost Button
```
Name: Button/Ghost
Background: transparent
Text: #324D45
Border radius: 12px
Padding: 12px 24px
```

**Hover:**
- Background: #ECF0EF

### Icon Button
```
Name: Button/Icon
Width: 40px
Height: 40px
Background: transparent
Border radius: 12px
Display: flex, center
```

**Hover:**
- Background: #ECF0EF

---

## 2️⃣ CARDS

### Default Card
```
Name: Card/Default
Background: #FFFFFF
Border radius: 16px
Padding: 24px
Shadow: 0 4px 12px rgba(0,0,0,0.06)
Border: 1px solid #D5DFDB
```

### Elevated Card
```
Name: Card/Elevated
Background: #FFFFFF
Border radius: 16px
Padding: 24px
Shadow: 0 12px 40px rgba(0,0,0,0.08)
```

### Dark Card
```
Name: Card/Dark
Background: #0A1F18
Text: #FFFFFF
Border radius: 16px
Padding: 24px
```

### Outlined Card
```
Name: Card/Outlined
Background: transparent
Border: 2px solid #005840
Border radius: 16px
Padding: 24px
```

### Clickable Card
```
Name: Card/Clickable
(Alle verdier fra Default)
Cursor: pointer
Transition: all 200ms
```

**Hover:**
- Transform: translateY(-2px)
- Shadow: 0 12px 40px rgba(0,0,0,0.08)

---

## 3️⃣ INPUTS

### Text Input
```
Name: Input/Text
Background: #FFFFFF
Border: 1px solid #A5B2AD
Border radius: 12px
Padding: 12px 16px
Font: Inter, 16px, Regular (400)
Color: #324D45
Width: 100%
```

**Focus:**
- Border: #005840
- Outline: 2px solid rgba(0,88,64,0.2)

**Error:**
- Border: #B84233

**Disabled:**
- Background: #ECF0EF
- Text: #A5B2AD

### Search Input
```
Name: Input/Search
(Alle verdier fra Text Input)
Padding left: 48px (plass til ikon)
Icon: Search (left, 20px, #A5B2AD)
```

### Textarea
```
Name: Input/Textarea
Background: #FFFFFF
Border: 1px solid #A5B2AD
Border radius: 12px
Padding: 12px 16px
Font: Inter, 16px, Regular
Min height: 100px
Resize: vertical
```

### Select/Dropdown
```
Name: Input/Select
Background: #FFFFFF
Border: 1px solid #A5B2AD
Border radius: 12px
Padding: 12px 40px 12px 16px
Font: Inter, 16px, Regular
Icon: ChevronDown (right, 20px, #5A6E66)
```

---

## 4️⃣ NAVIGATION

### Top Navigation
```
Name: Nav/Top
Background: #FFFFFF
Height: 64px
Padding: 0 24px
Border bottom: 1px solid #D5DFDB
Display: flex, align: center, justify: space-between
```

### Nav Item
```
Name: Nav/Item
Padding: 8px 16px
Font: Inter, 14px, Medium (500)
Color: #5A6E66
Border radius: 8px
```

**Hover:**
- Background: #ECF0EF
- Color: #324D45

**Active:**
- Background: #005840
- Color: #FFFFFF

### Sidebar
```
Name: Nav/Sidebar
Background: #0A1F18
Width: 280px
Height: 100vh
Padding: 24px 16px
```

### Sidebar Item
```
Name: Nav/SidebarItem
Padding: 12px 16px
Font: Inter, 14px, Medium
Color: #A5B2AD
Border radius: 12px
Display: flex, gap: 12px, align: center
```

**Hover:**
- Background: rgba(255,255,255,0.1)
- Color: #FFFFFF

**Active:**
- Background: #005840
- Color: #FFFFFF

### Breadcrumb
```
Name: Nav/Breadcrumb
Display: flex, gap: 8px, align: center
Font: Inter, 14px, Regular
Color: #A5B2AD
```

**Separator:** `/` eller `>`

**Current:** Color: #324D45, Font weight: 500

---

## 5️⃣ BADGES & TAGS

### Default Badge
```
Name: Badge/Default
Background: #ECF0EF
Text: #324D45
Padding: 4px 12px
Border radius: 9999px
Font: Inter, 12px, Medium (500)
```

### Success Badge
```
Name: Badge/Success
Background: #E8F5EF
Text: #2A7D5A
```

### Error Badge
```
Name: Badge/Error
Background: #FCEAE8
Text: #B84233
```

### Warning Badge
```
Name: Badge/Warning
Background: #FDF4E4
Text: #C48A32
```

### Info Badge
```
Name: Badge/Info
Background: #EFF6FF
Text: #007AFF
```

### Accent Badge
```
Name: Badge/Accent
Background: #D1F843
Text: #0A1F18
Font weight: Semibold (600)
```

---

## 6️⃣ AVATAR

### Avatar Small
```
Name: Avatar/Small
Width: 32px
Height: 32px
Border radius: 9999px
Background: #005840
Text: #FFFFFF
Font: Inter, 12px, Semibold
Display: flex, center
```

### Avatar Medium
```
Name: Avatar/Medium
Width: 40px
Height: 40px
Border radius: 9999px
Background: #005840
Text: #FFFFFF
Font: Inter, 14px, Semibold
```

### Avatar Large
```
Name: Avatar/Large
Width: 64px
Height: 64px
Border radius: 9999px
Background: #005840
Text: #FFFFFF
Font: Inter, 20px, Semibold
```

### Avatar with Image
```
Name: Avatar/Image
(Alle verdier fra Medium)
Object fit: cover
```

### Avatar Group
```
Name: Avatar/Group
Display: flex
Gap: -8px (overlap)
```

---

## 7️⃣ TOGGLES & CHECKBOXES

### Toggle Switch
```
Name: Toggle/Switch
Width: 44px
Height: 24px
Background: #A5B2AD
Border radius: 9999px
Position: relative
```

**Knob:**
- Width: 20px
- Height: 20px
- Background: #FFFFFF
- Border radius: 9999px
- Position: absolute, left: 2px, center Y

**Checked:**
- Background: #005840
- Knob: left: 22px

### Checkbox
```
Name: Checkbox/Default
Width: 20px
Height: 20px
Background: #FFFFFF
Border: 2px solid #A5B2AD
Border radius: 4px
```

**Checked:**
- Background: #005840
- Border: #005840
- Icon: Check (white, 14px)

**Indeterminate:**
- Icon: Minus (white, 14px)

### Radio Button
```
Name: Radio/Default
Width: 20px
Height: 20px
Background: #FFFFFF
Border: 2px solid #A5B2AD
Border radius: 9999px
```

**Selected:**
- Border: #005840
- Dot: 8px circle, #005840, center

---

## 8️⃣ TABS

### Tab Container
```
Name: Tabs/Container
Background: #ECF0EF
Border radius: 12px
Padding: 4px
Display: flex, gap: 4px
```

### Tab Item
```
Name: Tabs/Item
Padding: 8px 16px
Font: Inter, 14px, Medium
Color: #5A6E66
Border radius: 8px
```

**Active:**
- Background: #FFFFFF
- Color: #324D45
- Shadow: 0 1px 2px rgba(0,0,0,0.04)

### Tab Underline Variant
```
Name: Tabs/Underline
Border bottom: 2px solid #D5DFDB
```

**Tab Item:**
- Padding: 12px 16px
- Border bottom: 2px solid transparent

**Active:**
- Color: #005840
- Border bottom: #005840

---

## 9️⃣ MODAL/DIALOG

### Modal Overlay
```
Name: Modal/Overlay
Background: rgba(10, 31, 24, 0.6)
Position: fixed
Inset: 0
Z-index: 60
```

### Modal Container
```
Name: Modal/Container
Background: #FFFFFF
Border radius: 24px
Padding: 32px
Max width: 480px
Width: 90%
Shadow: 0 24px 48px rgba(0,0,0,0.2)
```

### Modal Header
```
Name: Modal/Header
Font: Inter, 24px, Bold (700)
Color: #324D45
Margin bottom: 16px
```

### Modal Footer
```
Name: Modal/Footer
Display: flex, gap: 12px, justify: flex-end
Margin top: 24px
Padding top: 16px
Border top: 1px solid #D5DFDB
```

---

## 🔟 ACCORDION

### Accordion Item
```
Name: Accordion/Item
Background: #FFFFFF
Border: 1px solid #D5DFDB
Border radius: 12px
Padding: 16px 20px
```

### Accordion Header
```
Name: Accordion/Header
Display: flex, justify: space-between, align: center
Font: Inter, 16px, Semibold
Color: #324D45
```

**Icon:** ChevronDown (20px, #5A6E66)

**Expanded:** Icon rotate 180deg

### Accordion Content
```
Name: Accordion/Content
Padding top: 16px
Font: Inter, 14px, Regular
Color: #5A6E66
```

---

## 1️⃣1️⃣ TOAST/NOTIFICATION

### Toast Container
```
Name: Toast/Container
Position: fixed
Top: 24px
Right: 24px
Z-index: 90
Display: flex, flex-direction: column, gap: 12px
```

### Toast Success
```
Name: Toast/Success
Background: #E8F5EF
Border: 1px solid #2A7D5A
Border radius: 12px
Padding: 16px 20px
Display: flex, gap: 12px, align: center
Min width: 320px
Shadow: 0 4px 12px rgba(0,0,0,0.08)
```

**Icon:** CheckCircle (20px, #2A7D5A)

### Toast Error
```
Name: Toast/Error
Background: #FCEAE8
Border: 1px solid #B84233
Icon: XCircle (20px, #B84233)
```

### Toast Warning
```
Name: Toast/Warning
Background: #FDF4E4
Border: 1px solid #C48A32
Icon: AlertTriangle (20px, #C48A32)
```

---

## 1️⃣2️⃣ PROGRESS & LOADING

### Progress Bar
```
Name: Progress/Bar
Height: 8px
Background: #ECF0EF
Border radius: 9999px
Overflow: hidden
```

### Progress Fill
```
Name: Progress/Fill
Height: 100%
Background: #005840
Border radius: 9999px
Transition: width 300ms
```

### Progress Steps
```
Name: Progress/Steps
Display: flex, gap: 8px
```

**Step:**
- Width: 32px
- Height: 8px
- Border radius: 4px
- Background: #ECF0EF

**Completed:**
- Background: #005840

**Current:**
- Background: #D1F843

### Spinner
```
Name: Spinner
Width: 24px
Height: 24px
Border: 3px solid #ECF0EF
Border top: 3px solid #005840
Border radius: 9999px
```

**Animation:** Rotate 360deg, 1s, linear, infinite

### Skeleton
```
Name: Skeleton
Background: #ECF0EF
Border radius: 8px
```

**Animation:** Shimmer (gradient sweep)

---

## 1️⃣3️⃣ CALENDAR

### Calendar Container
```
Name: Calendar/Container
Background: #FFFFFF
Border radius: 16px
Padding: 20px
Shadow: 0 4px 12px rgba(0,0,0,0.06)
```

### Calendar Day
```
Name: Calendar/Day
Width: 40px
Height: 40px
Display: flex, center
Font: Inter, 14px, Regular
Color: #324D45
Border radius: 9999px
```

**Hover:**
- Background: #ECF0EF

**Selected:**
- Background: #005840
- Color: #FFFFFF

**Today:**
- Border: 2px solid #005840

**Different month:**
- Color: #A5B2AD

### Calendar Event Dot
```
Name: Calendar/EventDot
Width: 6px
Height: 6px
Border radius: 9999px
Position: absolute, bottom: 4px
```

**Colors:**
- Coaching: #3B82F6
- Training: #D1F843
- Tournament: #F97316

---

## 1️⃣4️⃣ LISTS

### List Container
```
Name: List/Container
Display: flex, flex-direction: column
```

### List Item
```
Name: List/Item
Background: #FFFFFF
Padding: 16px 20px
Border bottom: 1px solid #D5DFDB
Display: flex, gap: 16px, align: center
```

**Hover:**
- Background: #ECF0EF

### List Item with Action
```
Name: List/ItemAction
(Right side: button eller ikon)
```

---

## 1️⃣5️⃣ TOOLTIP

### Tooltip Container
```
Name: Tooltip/Container
Background: #0A1F18
Color: #FFFFFF
Padding: 8px 12px
Border radius: 8px
Font: Inter, 12px, Medium
Max width: 240px
```

### Tooltip Arrow
```
Name: Tooltip/Arrow
Width: 8px
Height: 8px
Background: #0A1F18
Transform: rotate(45deg)
```

---

## 1️⃣6️⃣ DIVIDERS

### Horizontal Divider
```
Name: Divider/Horizontal
Height: 1px
Background: #D5DFDB
Margin: 16px 0
```

### Vertical Divider
```
Name: Divider/Vertical
Width: 1px
Background: #D5DFDB
Margin: 0 16px
```

### Divider with Text
```
Name: Divider/Text
Display: flex, align: center, gap: 16px
```

**Line:** flex: 1, height: 1px, background: #D5DFDB
**Text:** Inter, 12px, Medium, #A5B2AD

---

## 1️⃣7️⃣ CHARTS (Mini)

### Sparkline Container
```
Name: Chart/Sparkline
Height: 40px
Width: 120px
```

### Bar Chart Mini
```
Name: Chart/BarMini
Display: flex, gap: 4px, align: flex-end
Height: 40px
```

**Bar:**
- Width: 8px
- Border radius: 4px 4px 0 0
- Background: #005840

### Donut Chart Mini
```
Name: Chart/DonutMini
Width: 48px
Height: 48px
Border radius: 9999px
Background: conic-gradient(#005840 0% 65%, #ECF0EF 65% 100%)
```

---

## 1️⃣8️⃣ DROPDOWN/MENU

### Dropdown Menu
```
Name: Menu/Dropdown
Background: #FFFFFF
Border: 1px solid #D5DFDB
Border radius: 12px
Padding: 8px
Shadow: 0 12px 40px rgba(0,0,0,0.12)
Min width: 200px
```

### Menu Item
```
Name: Menu/Item
Padding: 10px 16px
Font: Inter, 14px, Regular
Color: #324D45
Border radius: 8px
Display: flex, gap: 12px, align: center
```

**Hover:**
- Background: #ECF0EF

**Active:**
- Background: #005840
- Color: #FFFFFF

### Menu Divider
```
Name: Menu/Divider
Height: 1px
Background: #D5DFDB
Margin: 8px 0
```

---

## 1️⃣9️⃣ STATS/NUMBERS

### Stat Large
```
Name: Stat/Large
Font: Inter, 48px, Bold (700)
Color: #324D45
```

### Stat Medium
```
Name: Stat/Medium
Font: Inter, 36px, Bold (700)
Color: #324D45
```

### Stat with Label
```
Name: Stat/WithLabel
Display: flex, flex-direction: column, gap: 4px
```

**Number:** Inter, 36px, Bold, #324D45
**Label:** Inter, 12px, Medium, #A5B2AD, uppercase, tracking: 0.12em

### Stat with Trend
```
Name: Stat/Trend
Display: flex, align: center, gap: 8px
```

**Trend up:**
- Icon: ArrowUp (16px, #2A7D5A)
- Text: Inter, 14px, Semibold, #2A7D5A

**Trend down:**
- Icon: ArrowDown (16px, #B84233)
- Text: Inter, 14px, Semibold, #B84233

---

## 2️⃣0️⃣ EMPTY STATES

### Empty State Default
```
Name: Empty/Default
Display: flex, flex-direction: column, center
Padding: 48px 24px
Text align: center
```

**Icon:** 48px, #A5B2AD
**Title:** Inter, 18px, Semibold, #324D45
**Description:** Inter, 14px, Regular, #5A6E66
**Action:** Primary Button

---

## 🎯 HURTIG REFERANSE

### Border Radius
- Small: 8px (badges, tags)
- Medium: 12px (buttons, inputs)
- Large: 16px (cards)
- XL: 24px (modals)
- Full: 9999px (avatars, pills)

### Spacing Scale
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Shadows
- sm: 0 1px 2px rgba(0,0,0,0.04)
- md: 0 4px 12px rgba(0,0,0,0.06)
- lg: 0 12px 40px rgba(0,0,0,0.08)

### Z-Index Scale
- 10: dropdown
- 20: sticky
- 50: nav
- 60: overlay
- 70: modal
- 80: popover
- 90: tooltip
