# Apple-Quality Wireframes til Produksjonskode

> **Spec for konvertering av Apple-kvalitet wireframes til produksjonsklare React/Tailwind-komponenter**

## Oversikt

Konvertere 35+ Apple-kvalitet HTML wireframes til produksjonsklare Next.js-komponenter med:
- Tailwind CSS v4 styling
- Framer Motion animasjoner
- Shadcn/ui base-komponenter
- TypeScript strict mode

## Design System Tokens

Fra `apple-design-system.html` til Tailwind config:

### Spacing (8pt grid)
```css
--space-1: 4px   → 1
--space-2: 8px   → 2
--space-3: 12px  → 3
--space-4: 16px  → 4
--space-5: 20px  → 5
--space-6: 24px  → 6
--space-8: 32px  → 8
--space-10: 40px → 10
--space-12: 48px → 12
```

### Colors (Apple-inspired)
```css
/* Grayscale */
--gray-50: #FAFAFA
--gray-100: #F5F5F7
--gray-200: #E8E8ED
--gray-500: #8E8E93
--gray-900: #2C2C2E
--gray-950: #1D1D1F

/* Brand Gold */
--gold-50: #FDF8F0
--gold-500: #B8975C
--gold-600: #9A7B47

/* Semantic */
--success: #34C759
--warning: #FF9500
--error: #FF3B30
--info: #007AFF
```

### Elevation
```css
--shadow-sm: 0 2px 8px rgba(0,0,0,0.04)
--shadow-md: 0 4px 16px rgba(0,0,0,0.06)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.08)
--shadow-gold: 0 4px 24px rgba(184, 151, 92, 0.2)
```

### Radius
```css
--radius-sm: 8px   → rounded-lg
--radius-md: 12px  → rounded-xl
--radius-lg: 16px  → rounded-2xl
--radius-xl: 20px  → rounded-[20px]
--radius-2xl: 24px → rounded-3xl
```

## Komponenter å lage

### Base Layout
- `PortalLayout` - Sidebar + main content grid
- `PortalSidebar` - Mørk sidebar med navigasjon
- `PortalHeader` - Topbar med brukerinfo og actions
- `BentoGrid` - 12-kolonne grid for dashboard
- `BentoCard` - Kort med header, body, actions

### Dashboard Widgets
- `StatCard` - KPI-kort med trend
- `NextSessionCard` - Neste coaching-time
- `WeatherCard` - Golfvær med detaljer
- `WeekCalendar` - 7-dagers oversikt
- `ChecklistCard` - Daglig sjekkliste
- `InsightsCard` - AI-innsikt
- `QuickLinksCard` - Hurtiglenker

### Shared
- `AppleButton` - Primary/secondary buttons
- `AppleBadge` - Status badges
- `AppleAvatar` - Brukeravatar med gradient
- `AppleCard` - Base card component
- `AppleInput` - Form input
- `AppleSelect` - Dropdown select

### Page Components
- `BookingList` - Liste over bookinger
- `TrainingLog` - Treningsdagbok
- `ProfileCard` - Brukerprofil
- `StatsChart` - Statistikk med charts
- `AdminTable` - Tabell med sortering/filtrering

## Filstruktur

```
components/
├── portal/
│   ├── layout/
│   │   ├── portal-layout.tsx
│   │   ├── portal-sidebar.tsx
│   │   └── portal-header.tsx
│   ├── dashboard/
│   │   ├── bento-grid.tsx
│   │   ├── bento-card.tsx
│   │   ├── stat-card.tsx
│   │   ├── next-session-card.tsx
│   │   ├── weather-card.tsx
│   │   ├── week-calendar.tsx
│   │   ├── checklist-card.tsx
│   │   ├── insights-card.tsx
│   │   └── quick-links-card.tsx
│   └── shared/
│       ├── apple-button.tsx
│       ├── apple-badge.tsx
│       ├── apple-avatar.tsx
│       ├── apple-card.tsx
│       └── apple-input.tsx
└── ui/
    └── (shadcn base components)

app/
├── globals.css          # Apple design tokens
└── portal/
    └── (dashboard)/
        ├── layout.tsx   # Portal layout
        └── page.tsx     # Dashboard med widgets
```

## Implementeringsrekkefølge

### Fase 1: Design Tokens (globals.css)
1. Legg til Apple-spacing tokens
2. Legg til Apple-fargeskala
3. Legg til Apple-shadows
4. Legg til Apple-radius

### Fase 2: Base Layout
1. PortalLayout med grid
2. PortalSidebar med nav
3. PortalHeader med bruker

### Fase 3: Dashboard Widgets
1. BentoGrid og BentoCard
2. StatCard
3. NextSessionCard
4. WeatherCard
5. WeekCalendar
6. ChecklistCard
7. InsightsCard
8. QuickLinksCard

### Fase 4: Undersider
1. Bookinger-side
2. Dagbok-side
3. Profil-side
4. Treningsplan-side
5. Statistikk-side

### Fase 5: Admin-sider
1. Admin dashboard
2. Elever-liste
3. Booking-håndtering
4. Tilgjengelighet

## Testing
- Visuell sammenligning med wireframes
- Responsiv testing (desktop, tablet, mobil)
- Animasjons-performance
- Accessibility (WCAG 2.1 AA)

## Wireframe-mapping

| Wireframe | Produksjonsfil |
|-----------|----------------|
| apple-portal-dashboard.html | app/portal/(dashboard)/page.tsx |
| apple-portal-bookinger.html | app/portal/(dashboard)/bookinger/page.tsx |
| apple-portal-dagbok.html | app/portal/(dashboard)/dagbok/page.tsx |
| apple-portal-profil.html | app/portal/(dashboard)/profil/page.tsx |
| apple-portal-treningsplan.html | app/portal/(dashboard)/treningsplan/page.tsx |
| apple-portal-statistikk.html | app/portal/(dashboard)/statistikk/page.tsx |
| apple-admin-dashboard.html | app/portal/(dashboard)/admin/denne-uken/page.tsx |
| apple-admin-elever.html | app/portal/(dashboard)/admin/elever/page.tsx |
| apple-admin-bookinger.html | app/portal/(dashboard)/admin/bookinger/page.tsx |
