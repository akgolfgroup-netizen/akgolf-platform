# Homiva Dashboard Design Specification
> Basert på Jack L. / RonDesignLab - Real Estate Dashboard
> https://dribbble.com/shots/25606416-Homiva-Real-Estate-Dashboard

---

## 🎨 Fargepalett

### Primære Farger
| Farge | Hex | Bruk |
|-------|-----|------|
| **Canvas/Bakgrunn** | `#FAFAF9` | Hovedbakgrunn (varm hvit) |
| **Kort** | `#FFFFFF` | Kortbakgrunn |
| **Primær Tekst** | `#1B1A1A` | Overskrifter, viktig tekst |
| **Sekundær Tekst** | `#62605F` | Body tekst |
| **Muted Tekst** | `#999B9C` | Hjelpetekst, labels |

### Accent Farger
| Farge | Hex | Bruk |
|-------|-----|------|
| **Coral/Orange** | `#A83F26` | Primær CTA, grafer, highlights |
| **Korall Lys** | `#E85D3F` | Sekundær accents, hover states |
| **Gull/Beige** | `#D1C2AE` | Subtile highlights, borders |
| **Grønn Positiv** | `#869466` | Suksess, positive trender |
| **Rød Negativ** | `#9E695F` | Advarsler, negative trender |

### Bakgrunnsfarger
| Farge | Hex | Bruk |
|-------|-----|------|
| **Light Warm** | `#FAFAF9` | Hovedcanvas |
| **Off-White** | `#F5F5F4` | Sekundære bakgrunner |
| **Subtile Cards** | `#FFFFFF` | Kort med skygge |

---

## 📐 Layout & Spacing

### Grid System
- **Container**: Max-width 1400px, sentrert
- **Spacing Scale**: 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- **Kort Gap**: 24px mellom kort
- **Padding**: 24px-32px inni kort

### Sidebar (Venstre)
- **Bredde**: 80px (collapsed) / 280px (expanded)
- **Bakgrunn**: Transparent/white over canvas
- **Ikoner**: 24px, stroke 1.5px
- **Aktiv state**: Fylt ikon + label

### Top Navigation
- **Høyde**: 80px
- **Elementer**: Søk (sentrert), notifikasjoner, profil (høyre)
- **Stil**: Floating pill/bar med blur backdrop

---

## 🧩 Komponenter

### 1. Hovedkort (Hero Card)
```tsx
// Featured content card med bilde
<div className="
  relative rounded-[32px] 
  bg-white 
  shadow-[0_8px_32px_rgba(0,0,0,0.08)]
  overflow-hidden
">
  {/* Bilde med gradient overlay */}
  <div className="relative h-[400px]">
    <Image />
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  </div>
  
  {/* Innhold */}
  <div className="absolute bottom-0 left-0 p-8">
    <h2 className="text-4xl font-light text-white tracking-tight">
      Whispering Pines
    </h2>
    <p className="text-lg text-white/80">at Dawn</p>
  </div>
</div>
```

**Spesifikasjon:**
- Border-radius: 32px
- Skygge: `0 8px 32px rgba(0,0,0,0.08)`
- Bilde med soft gradient overlay
- Tekst i bunn, hvit med lett vekt

---

### 2. Stat Cards (KPI Cards)
```tsx
<div className="
  rounded-[24px] 
  bg-white 
  p-6 
  shadow-[0_4px_20px_rgba(0,0,0,0.06)]
">
  {/* Header med label */}
  <div className="flex items-center gap-2 mb-4">
    <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center">
      <Icon className="w-4 h-4 text-coral" />
    </div>
    <div>
      <p className="text-sm text-muted">Offers Made</p>
      <p className="text-xs text-muted/60">Current month</p>
    </div>
  </div>
  
  {/* Stort tall */}
  <p className="text-5xl font-light text-primary tracking-tight">
    $83,962.62
  </p>
  
  {/* Trend pill */}
  <div className="mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green/10">
    <ArrowUp className="w-3 h-3 text-green" />
    <span className="text-sm font-medium text-green">4.63%</span>
  </div>
</div>
```

**Spesifikasjon:**
- Border-radius: 24px
- Padding: 24px
- Skygge: `0 4px 20px rgba(0,0,0,0.06)`
- Stort tall: 48px, font-weight 300 (light)
- Trend pill: rounded-full, grønn/orange bakgrunn

---

### 3. Mini Stat Cards (Bottom Row)
```tsx
<div className="
  rounded-[20px] 
  bg-white/80 
  backdrop-blur-xl
  p-5 
  border border-white/20
  shadow-[0_4px_16px_rgba(0,0,0,0.04)]
">
  <p className="text-xs text-muted mb-1">Pending Offers</p>
  <div className="flex items-end justify-between">
    <p className="text-2xl font-medium text-primary">+245</p>
    <IconBadge />
  </div>
</div>
```

**Spesifikasjon:**
- Border-radius: 20px
- Glassmorfisme: `bg-white/80 backdrop-blur-xl`
- Border: 1px solid white/20
- Kompakt layout

---

### 4. Graf-kort (Chart Card)
```tsx
<div className="
  rounded-[28px] 
  bg-white 
  p-6 
  shadow-[0_4px_24px_rgba(0,0,0,0.06)]
">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-sm font-medium text-primary">Lead Source</p>
      <p className="text-xs text-muted">Current week</p>
    </div>
    <div className="text-right">
      <p className="text-3xl font-light text-primary">2,628</p>
    </div>
  </div>
  
  {/* Graf */}
  <div className="h-[160px] relative">
    {/* Linjediagram med coral gradient */}
    <svg>
      <defs>
        <linearGradient id="coralGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A83F26" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#A83F26" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Path med stroke og fill */}
    </svg>
  </div>
  
  {/* Avatar liste */}
  <div className="mt-4 flex items-center gap-3">
    <AvatarGroup />
    <div className="flex-1">
      <p className="text-sm font-medium text-primary">Kathryn Murphy</p>
      <p className="text-xs text-muted">Offers submitted grew from 19% to 35%</p>
    </div>
    <div className="text-right">
      <p className="text-xs text-coral">915 LDS</p>
      <p className="text-xs text-coral">35%</p>
    </div>
  </div>
</div>
```

**Spesifikasjon:**
- Border-radius: 28px
- Graf: Linje med gradient fill (coral til transparent)
- Dot-markers på grafen
- Avatar-grupper med overlapp

---

### 5. Navigation Pills (Top)
```tsx
<div className="
  flex items-center gap-2 
  p-1.5 
  rounded-full 
  bg-white/60 
  backdrop-blur-xl
  border border-white/30
  shadow-[0_2px_12px_rgba(0,0,0,0.04)]
">
  <button className="
    px-5 py-2.5 
    rounded-full 
    bg-[#1B1A1A] 
    text-white 
    text-sm font-medium
  ">
    Dashboard
  </button>
  <button className="
    px-5 py-2.5 
    rounded-full 
    text-[#62605F] 
    text-sm font-medium
    hover:text-[#1B1A1A]
  ">
    Calendar
  </button>
  <button className="
    px-5 py-2.5 
    rounded-full 
    text-[#62605F] 
    text-sm font-medium
    hover:text-[#1B1A1A]
  ">
    Chat
  </button>
</div>
```

**Spesifikasjon:**
- Container: rounded-full, glassmorfisme
- Aktiv: Sort bakgrunn (#1B1A1A), hvit tekst
- Inaktiv: Transparent, grå tekst
- Padding: 5px 20px

---

### 6. Circular Progress / Gauge
```tsx
<div className="relative w-[200px] h-[200px]">
  {/* Bakgrunns-sirkel */}
  <svg className="transform -rotate-90">
    <circle
      cx="100" cy="100" r="90"
      fill="none"
      stroke="#F0F0F0"
      strokeWidth="12"
    />
    {/* Progress sirkel */}
    <circle
      cx="100" cy="100" r="90"
      fill="none"
      stroke="#A83F26"
      strokeWidth="12"
      strokeLinecap="round"
      strokeDasharray={`${progress * 5.65} 565`}
      className="transition-all duration-1000"
    />
  </svg>
  
  {/* Midt-innhold */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <p className="text-4xl font-light text-primary">878</p>
      <p className="text-xs text-muted">Offer Made</p>
      <p className="text-xs text-muted/60">Current week</p>
    </div>
  </div>
</div>
```

**Spesifikasjon:**
- Størrelse: 200x200px
- Stroke: 12px
- Color: Coral (#A83F26)
- Tekst i midten, stor og lett vekt

---

### 7. Avatar Groups
```tsx
<div className="flex -space-x-3">
  <img 
    className="w-10 h-10 rounded-full border-2 border-white object-cover"
    src="avatar1.jpg" 
  />
  <img 
    className="w-10 h-10 rounded-full border-2 border-white object-cover"
    src="avatar2.jpg" 
  />
  <img 
    className="w-10 h-10 rounded-full border-2 border-white object-cover"
    src="avatar3.jpg" 
  />
  <div className="
    w-10 h-10 
    rounded-full 
    border-2 border-white 
    bg-coral 
    flex items-center justify-center
    text-white text-xs font-medium
  ">
    +2
  </div>
</div>
```

**Spesifikasjon:**
- Størrelse: 40x40px
- Border: 2px solid white
- Overlapp: -space-x-3 (negativ margin)
- +N badge: Coral bakgrunn, hvit tekst

---

## 📊 Grafer & Charts

### Linjediagram
- **Stroke**: 2-3px, coral farge
- **Fill**: Gradient (coral 30% → transparent)
- **Dots**: 8-10px sirkler, hvit fill, coral stroke
- **Grid**: Lys grå, 0.5px, dot-dash pattern

### Bue/Gauge Chart
- **Stroke**: 12px
- **Color**: Coral (#A83F26)
- **Background**: Lys grå (#F0F0F0)
- **Cap**: Round

---

## 🔤 Typografi

### Font
- **Primary**: Inter (eller lignende sans-serif)
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold)

### Skala
| Element | Størrelse | Vekt | Letter-spacing |
|---------|-----------|------|----------------|
| **Hero tittel** | 48-64px | 300 | -0.02em |
| **H1** | 36px | 500 | -0.01em |
| **H2** | 24px | 500 | -0.01em |
| **Store tall** | 48px | 300 | -0.02em |
| **Body** | 16px | 400 | 0 |
| **Small** | 14px | 400 | 0 |
| **Micro** | 12px | 500 | 0.05em |

---

## ✨ Effekter & Animations

### Shadows (Layered)
```css
/* Card shadow */
box-shadow: 
  0 1px 2px rgba(0,0,0,0.02),
  0 4px 8px rgba(0,0,0,0.03),
  0 8px 24px rgba(0,0,0,0.06);

/* Elevated shadow */
box-shadow: 
  0 4px 12px rgba(0,0,0,0.04),
  0 16px 48px rgba(0,0,0,0.08);
```

### Glassmorfisme
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

### Hover States
- **Kort**: `translateY(-2px)` + skygge øker
- **Knapper**: `opacity: 0.9` eller farge endring
- **Links**: Underline animasjon

---

## 🎯 Tailwind Config (utdrag)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary
        canvas: '#FAFAF9',
        card: '#FFFFFF',
        
        // Text
        'text-primary': '#1B1A1A',
        'text-secondary': '#62605F',
        'text-muted': '#999B9C',
        
        // Accents
        coral: {
          DEFAULT: '#A83F26',
          light: '#E85D3F',
          dark: '#8B351F',
        },
        gold: '#D1C2AE',
        mint: '#869466',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.08)',
        'elevated': '0 16px 48px rgba(0,0,0,0.08)',
      },
      fontSize: {
        'display': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '300' }],
        'stat': ['48px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '300' }],
      }
    }
  }
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Endringer |
|------------|-------|-----------|
| **Desktop** | 1400px+ | Full layout, sidebar alltid synlig |
| **Laptop** | 1200px | Sidebar kan kollapse, mindre gaps |
| **Tablet** | 768px | Sidebar skjult, 2-kolonne grid |
| **Mobile** | < 768px | 1-kolonne, stakket layout |

---

## 🔗 Komponent-mapping til AK Golf

| Homiva | AK Golf Portal |
|--------|----------------|
| Eiendomskort | Turneringskort / Spillerkort |
| Lead Source | Treningsaktivitet / Statistikk |
| Offers Made | Bookinger / Coaching-timer |
| Avatar-grupper | Spillere i turnering / Lag |
| Circular gauge | Handicap / DECADE score |

---

## 🚀 Implementasjonsrekkefølge

1. **Farger & Tokens** → Oppdater globals.css
2. **PremiumCard** → Oppdatere med nye skygger og radius
3. **Stat Cards** → Nye KPI-kort med ikoner og trends
4. **Hero Card** → Stort kort med bilde overlay
5. **Charts** → Implementere med coral farger
6. **Navigation** → Pill-style tabs
7. **Avatar Groups** → Overlappende avatars
8. **Animations** → Hover effekter og transitions
