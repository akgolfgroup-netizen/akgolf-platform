# Stitch til Next.js - Innholdsguide

## Hvordan legge inn riktig tekst og bilder

### 1. Tekst - Kopier fra HTML-filene

All tekst finnes i de originale HTML-filene:
```
/Users/anderskristiansen/Downloads/stitch_heritage_grid_design_system/[skjerm_navn]/code.html
```

**Eksempel - Landing Homepage:**
- Åpne `landing_homepage/code.html`
- Kopier tekst inn i `/app/landing/page.tsx`

### 2. Bilder - To alternativer

#### Alternativ A: Bruk bildene fra Stitch (Google AI-genererte)

Bildene i HTML-filene er på formatet:
```html
<img src="https://lh3.googleusercontent.com/aida-public/AB6AXu..." />
```

**For å bruke dem:**
1. Kopier bilde-URLen fra HTML-filen
2. Lim inn direkte i Next.js-komponenten
3. Bruk `<img>` tag (eksterne URLer) eller last ned til `/public`

**Eksempel:**
```tsx
// I din page.tsx
<img 
  src="https://lh3.googleusercontent.com/aida-public/AB6AXu..." 
  alt="Beskrivelse"
  className="w-full h-full object-cover"
/>
```

#### Alternativ B: Last ned og bruk lokalt (ANBEFALT)

1. **Last ned bilder fra HTML-filene:**
```bash
# Lag mappe for bilder
mkdir -p public/images/landing
mkdir -p public/images/booking
```

2. **Erstatt eksterne URLer med lokale bilder:**
```tsx
// Fra:
<img src="https://lh3.googleusercontent.com/..." />

// Til:
<img src="/images/landing/hero-golfer.jpg" alt="..." />
```

### 3. Material Symbols (Ikoner)

For ikoner bruker vi Google Material Symbols (allerede satt opp i layout.tsx):

```tsx
<span className="material-symbols-outlined">icon_name</span>
```

**Vanlige ikoner:**
- `sports_golf` - Golf-ikon
- `analytics` - Analyse
- `calendar_today` - Kalender
- `person` - Person
- `check_circle` - Sjekkmerke
- `arrow_forward` - Pil
- `star` - Stjerne
- `mail` - E-post
- `call` - Telefon
- `location_on` - Lokasjon

### 4. Eksempel: Oppdatere Landing Homepage med riktig innhold

**Steg 1:** Åpne original HTML
```bash
cat /Users/anderskristiansen/Downloads/stitch_heritage_grid_design_system/landing_homepage/code.html
```

**Steg 2:** Finn hero-bildet
- Let etter `<img` tag i hero-seksjonen
- Kopier `src` URLen

**Steg 3:** Erstatt placeholder i page.tsx

```tsx
// FRA (nåværende placeholder):
<div className="w-full h-full bg-gradient-to-br from-[#2d5a27]/20 to-[#d2f000]/10 flex items-center justify-center">
  <span className="material-symbols-outlined text-[200px] text-[#154212]/10">sports_golf</span>
</div>

// TIL (med ekte bilde):
<img 
  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwZiSVFSsz5Grx..."
  alt="Professional golfer in mid-swing"
  className="w-full h-full object-cover"
/>
```

### 5. Tekstinnhold - Viktige seksjoner

#### Landing Homepage:
- **Hero tittel:** "Elevate Your Game"
- **Hero undertekst:** "Precision-engineered coaching for elite athletes..."
- **CTA knapper:** "Get Started", "Learn More"
- **Features:** "Advanced Analytics", "Pro Coaching", "Smart Scheduling"
- **Testimonial:** "The level of precision AK Sports OS brings..."

#### Landing About:
- **Mission:** "Our mission is to bridge the gap..."
- **Values:** Precision, Heritage, Excellence
- **Stats:** 10+ Years, 2K+ Players, 50K+ Sessions
- **Team:** Sarah Jensen, David Vance, Elena Ruiz, Marcus Thorne
- **Timeline:** 2014 Genesis → 2024 Global Scale

#### Landing Pricing:
- **Starter:** $99/mo - Fundamental plan
- **Pro:** $199/mo - Integrated plan (Most Popular)
- **Elite:** $499/mo - Institutional plan

#### Booking-flow:
1. **Select Service:** Coaching Session, Trackman Analysis, Elite Workshop, Junior Academy
2. **Coach Selection:** Marcus Vane, Elena Richter, David Chen
3. **Date/Time:** Kalender med tilgjengelige tider
4. **Confirm:** Oppsummering med pris ($173.25)

### 6. Rask fiks: Oppdater hero-bilde på landingssiden

Vil du at jeg skal oppdatere alle sidene med riktig tekst og bilder fra HTML-filene?

Eller vil du gjøre det selv ved å:
1. Kopiere bilde-URLer fra HTML-filene
2. Lime inn i de respektive page.tsx-filene
3. Erstatte placeholder-tekst med ekte innhold

### 7. Neste steg

Si ifra hva du foretrekker:
- **A)** Jeg fyller inn alt riktig innhold nå (tar ~15 min)
- **B)** Du gjør det selv med denne guiden
- **C)** Vi fokuserer på kun ett par sider først
