# Button Component for Stitch

## 1. PRIMARY BUTTON

### Normal state:
```
Background: #005840
Text color: #FFFFFF
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Semibold (600)
Border: none
```

### Hover state:
```
Background: #004A36
Transform: scale(1.02)
Shadow: 0 4px 12px rgba(0, 0, 0, 0.06)
```

### Active/Pressed:
```
Transform: scale(0.98)
```

### Disabled:
```
Background: #A5B2AD
Text: #5A6E66
Cursor: not-allowed
```

---

## 2. ACCENT BUTTON (CTA)

### Normal state:
```
Background: #D1F843
Text color: #0A1F18
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Semibold (600)
```

### Hover:
```
Background: #C5EC3A
Transform: scale(1.02)
Shadow: 0 4px 12px rgba(0, 0, 0, 0.06)
```

---

## 3. SECONDARY BUTTON

### Normal:
```
Background: transparent
Text: #005840
Border: 2px solid #005840
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Semibold (600)
```

### Hover:
```
Background: #005840
Text: #FFFFFF
```

---

## 4. GHOST BUTTON

### Normal:
```
Background: transparent
Text: #324D45
Border radius: 12px
Padding: 12px 24px
Font: Inter, 16px, Medium (500)
```

### Hover:
```
Background: #ECF0EF
```

---

# Card Component for Stitch

## DEFAULT CARD
```
Background: #FFFFFF
Border radius: 16px
Padding: 24px
Shadow: 0 4px 12px rgba(0, 0, 0, 0.06)
Border: 1px solid #D5DFDB
```

## ELEVATED CARD
```
Background: #FFFFFF
Border radius: 16px
Padding: 24px
Shadow: 0 12px 40px rgba(0, 0, 0, 0.08)
Border: none
```

## DARK CARD
```
Background: #0A1F18
Text: #FFFFFF
Border radius: 16px
Padding: 24px
Border: none
```

---

# Input Component

## NORMAL
```
Background: #FFFFFF
Border: 1px solid #A5B2AD
Border radius: 12px
Padding: 12px 16px
Font: Inter, 16px, Regular (400)
Text: #324D45
Width: 100%
```

## FOCUS
```
Border: 1px solid #005840
Outline: 2px solid rgba(0, 88, 64, 0.2)
Outline offset: 2px
```

## ERROR
```
Border: 1px solid #B84233
```

---

# Badge Component

## DEFAULT
```
Background: #ECF0EF
Text: #324D45
Padding: 4px 12px
Border radius: 9999px (full)
Font: Inter, 12px, Medium (500)
```

## SUCCESS
```
Background: #E8F5EF
Text: #2A7D5A
```

## ERROR
```
Background: #FCEAE8
Text: #B84233
```

## ACCENT
```
Background: #D1F843
Text: #0A1F18
Font weight: Semibold (600)
```

---

# Quick Copy Values

## Primary Colors
- Main green: `#005840`
- Accent lime: `#D1F843`
- Surface: `#ECF0EF`
- Text: `#324D45`
- Dark: `#0A1F18`

## Border Radius
- Small (buttons): `12px`
- Medium (cards): `16px`
- Large (modals): `24px`
- Full (badges): `9999px`

## Spacing (padding)
- Small: `8px`
- Medium: `12px`
- Large: `24px`
- XLarge: `32px`

## Typography
- Font: `Inter`
- Body: `16px / 400`
- Semibold: `16px / 600`
- Caption: `12px / 500`
- Heading: `24px / 700`

## Shadows
- Small: `0 1px 2px rgba(0, 0, 0, 0.04)`
- Medium: `0 4px 12px rgba(0, 0, 0, 0.06)`
- Large: `0 12px 40px rgba(0, 0, 0, 0.08)`
