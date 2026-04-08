# Teknisk spesifikasjon: [Screen-navn]

> **Basert på design:** [Lenke til DESIGN.md]  
> **Status:** [Klar til utvikling / Under utvikling / Ferdig]  
> **Utvikler:** [Navn]

---

## 🏗️ Arkitektur

### Filstruktur
```
app/portal/(dashboard)/
├── page.tsx                    # Hovedside
├── layout.tsx                  # Layout (hvis spesifikk)
└── _components/
    ├── [feature]-card.tsx      # Hovedkomponenter
    ├── [feature]-list.tsx
    └── [feature]-chart.tsx

components/portal/
├── ui/                         # Delte UI-komponenter
│   ├── stat-card.tsx
│   ├── progress-ring.tsx
│   └── ai-insight-card.tsx
└── hooks/
    └── use[feature].ts

lib/
└── utils/
    └── [feature]-utils.ts
```

---

## 📦 Komponent-API

### [Komponent-navn]

```typescript
interface [ComponentName]Props {
  // Required props
  
  // Optional props
  
  // Event handlers
  
  // Variant props
}
```

**Eksempel bruk:**
```tsx
<[ComponentName] 
  
/>
```

---

## 🔌 Data-flyt

### Props Drilling
```
Page 
  └── ComponentA
        └── ComponentB
              └── ComponentC
```

### State Management
- **Lokal state:** [useState for...]
- **Server state:** [React Query / SWR for...]
- **Global state:** [Zustand / Context for...]

### Data fetching
```typescript
// Hook for å hente data
function use[Feature]Data() {
  return useQuery({
    queryKey: ['feature'],
    queryFn: fetchFeatureData,
  });
}
```

---

## 🎨 Tailwind-klasser

### Hovedcontainer
```tsx
<div className="
  min-h-screen
  bg-[var(--color-grey-100)]
  p-4
  md:p-6
  lg:p-8
">
```

### Card
```tsx
<div className="
  bg-white
  border
  border-[var(--color-grey-200)]
  rounded-[20px]
  p-6
  shadow-[var(--shadow-card)]
  hover:shadow-[var(--shadow-card-hover)]
  transition-shadow
  duration-300
">
```

### Button Primary
```tsx
<button className="
  bg-[var(--color-grey-900)]
  text-white
  rounded-full
  px-6
  py-3
  font-semibold
  hover:bg-[var(--color-grey-900)]/90
  transition-colors
  focus:ring-2
  focus:ring-[var(--color-grey-900)]/20
  focus:ring-offset-2
">
```

---

## 🔄 Tilstander (States)

### Loading
- Skeleton screens
- Spinner på knapper
- Gradual content reveal

### Error
- Error boundary
- Fallback UI
- Retry-mulighet

### Empty
- Illustrasjon
- Hjelpetekst
- CTA til handling

### Success
- Toast/notification
- Visual feedback
- State reset

---

## 🧪 Testing

### Enhetstester
```typescript
describe('[Component]', () => {
  it('renders correctly', () => {});
  it('handles user interaction', () => {});
  it('shows loading state', () => {});
  it('shows error state', () => {});
});
```

### Integrasjonstester
- [ ] Data fetching
- [ ] Form submission
- [ ] Navigation

### Visuell testing
- [ ] Sammenlign med design
- [ ] Responsive breakpoints
- [ ] Dark mode (hvis aktuelt)

---

## ⚡ Performance

### Optimaliseringer
- [ ] React.memo for statiske komponenter
- [ ] useMemo for tunge beregninger
- [ ] useCallback for event handlers
- [ ] Dynamic imports for heavy components
- [ ] Image optimization

### Metrikker
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse score: > 90

---

## 🔒 Sikkerhet

- [ ] Input validation
- [ ] XSS beskyttelse
- [ ] CSRF tokens (hvis forms)
- [ ] Rate limiting

---

## 📝 Implementerings-sjekkliste

### Før koding
- [ ] DESIGN.md er oppdatert
- [ ] Alle assets er klare
- [ ] API-endepunkter er dokumentert

### Under koding
- [ ] Følger TypeScript strict mode
- [ ] Bruker eksisterende komponenter der mulig
- [ ] Tester på flere skjermstørrelser

### Før PR
- [ ] Koden bygger uten feil
- [ ] Alle tester passerer
- [ ] Linting er OK
- [ ] Design er verifisert mot DESIGN.md

### PR beskrivelse
```markdown
## Hva
Implementerer [feature] basert på design i .stitch/approved/[folder]/

## Screenshot
[ Bilde av implementasjon ]

## Sjekkliste
- [ ] Følger DESIGN.md
- [ ] Responsive
- [ ] Tilgjengelig
- [ ] Testet
```

---

**Opprettet:** [YYYY-MM-DD]  
**Sist oppdatert:** [YYYY-MM-DD]
