# Visuell Designreferanse — AK Golf Platform

## 100% Visuell Referanse: Jack L. (RonDesignLab)

**Dribbble-profil:** https://dribbble.com/jack-web-design

### Relevante shots

| Shot | Type | Relevans |
|------|------|----------|
| [Homiva Dashboard](https://dribbble.com/shots/25606416-Homiva-Real-Estate-Dashboard) | Web dashboard | Portal + Mission Control |
| [Kettler Sport App](https://dribbble.com/shots/25571529-Kettler-Sport-Mobile-App) | Mobil app | Portal mobil, live runde |
| [Salesforce CRM](https://dribbble.com/shots/25536982-Salesforce-CRM-Sales-Management-Dashboard) | CRM dashboard | Mission Control |

### Fitme Landing Page (Taras Migulko / Emote)

**Dribbble:** https://dribbble.com/shots/25674639-Fitme-home-landing-page

Brukes som referanse for landingsside-design (forside, academy, utvikling).

---

## Designprinsipper fra Jack L.

### Dashboard / Portal

1. **Canvas:** Hvit med subtile grå bakgrunner (#F5F5F7). Ingen farget canvas.
2. **Kort:** Store radius (16-20px), nesten ingen border, subtile shadows. Aldri flat.
3. **KPI-tall:** Store (28-44px), bold, med liten label (10-11px uppercase) under.
4. **Grafer:**
   - Halvbue/gauge charts med gradient-fill (fra accent til transparent)
   - Linjediagrammer med fargede prikker på datapunkter
   - Aldri flate stolpediagrammer — bruk gradient eller glow
5. **Navigasjon:** Pill-tabs (rounded-full), mørk bakgrunn på aktiv tab.
6. **Avatarer:** Overlappende avatar-grupper med +N indikator.
7. **Accentfarge:** Korall/rødt for varslinger, lime/gul-grønn for positive metrics.
8. **Whitespace:** Generøst — 40-60% av flaten er tom. Innholdet puster.
9. **Bilder:** Store, realistiske bilder integrert i dashboardet (ikke som ikoner).
10. **Device mockups:** Realistiske iPad/iPhone-mockups for kontekst.

### Mobil App (Kettler)

1. **Glassmorfisme:** Halvtransparente paneler over foto-bakgrunn.
2. **Progress-ringer:** Sirkulære fremgangsindikatorer med lime accent.
3. **Chip-tabs:** Rounded pills med mørk/lys toggle (Beginner, 30-45 min).
4. **Timer/tall:** Veldig store tall (48-60px) i sentrum av skjermen.
5. **Kontroller:** Avrundede knapper med tydelig hierarki (primær = fylt, sekundær = outline).
6. **Foto som bakgrunn:** Trenings-/aktivitetsbilder med subtle overlay.

### Felles

- Aldri dekorativt — alt har funksjon
- Typografisk kontrast: stor variasjon mellom label (10px) og verdi (36px+)
- Shadows er layered (2+ nivåer), aldri en enkel drop-shadow
- Borders bruker rgba (border-black/6), ikke solid hex
- Transitions: subtile, 300ms, ease-apple
- Hover: translateY(-1px), aldri mer

---

## Mapping til AK Golf tokens

| Jack L. mønster | Vår implementering |
|-----------------|-------------------|
| Hvit canvas | `bg-portal-bg` (#F5F5F7) |
| Grå bakgrunn | `bg-portal-hover` (#F0F0F2) |
| Mørk tekst | `text-portal-text` (#1D1D1F) |
| Sekundær tekst | `text-portal-secondary` (#6E6E73) |
| Lime accent (Kettler) | `bg-accent-cta` (#D1F843) |
| Korall/rødt accent | `bg-error` (#B84233) — brukes sparsomt |
| Gauge gradient | Fra `--color-primary` til transparent |
| Pill-tabs | `rounded-full bg-primary text-white` (aktiv) |
| Kort | `PremiumCard` med `rounded-xl shadow-card` |
| Store KPI-tall | `text-4xl font-extrabold tabular-nums tracking-tight` |
| Micro-labels | `text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted` |

---

## Bruk denne filen

Alle som jobber med portal- eller MC-redesign skal:
1. Se Jack L. sine shots for visuell referanse
2. Følge designprinsippene over
3. Mappe til AK Golf tokens som beskrevet
4. Aldri bruke generiske Tailwind-farger eller raw hex
