# Forbedringsforslag: B2B-segmentering og Testimonials

## 1. B2B-segmentering på /utvikling

### Nåværende situasjon
`/utvikling` blander to helt ulike produkter:
- **Software** (lilla): Digitale verktøy for trenere og klubber
- **Klubbtrening** (grønn): Rådgiving og sportsplaner for klubber

### Problem
- Ulike målgrupper med ulike behov
- En CTA ("Book en samtale") som ikke skiller mellom produkttypene
- Ingen tydelig segmentering av kjøpsprosessen

### Forslag A: Behold én side, men tydeliggjør segmentering

#### Visuelle endringer:
```tsx
// Forbedret CTA-seksjon med to tydelige valg
<section className="w-section-lg bg-surface-warm">
  <div className="w-container">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Software CTA */}
      <div className="w-card border-t-[3px] border-t-software">
        <SectionLabel>AK Golf Software</SectionLabel>
        <h3 className="w-heading-md mt-2 mb-4">Digitale verktøy</h3>
        <p className="text-ink-50 mb-6">Prøv vår programvare med en gratis demo.</p>
        <Link href="#apply-software" className="w-btn w-btn-software">
          Bestill demo
        </Link>
      </div>
      
      {/* Klubb CTA */}
      <div className="w-card border-t-[3px] border-t-utvikling">
        <SectionLabel>Klubbtrening</SectionLabel>
        <h3 className="w-heading-md mt-2 mb-4">Rådgiving</h3>
        <p className="text-ink-50 mb-6">Book et uforpliktende møte.</p>
        <Link href="#apply-klubb" className="w-btn w-btn-utvikling">
          Book møte
        </Link>
      </div>
    </div>
  </div>
</section>
```

#### Skjema-endringer:
- **To separate skjemaer** eller **ett skjema med type-velger**
- Software: Fokus på antall brukere, eksisterende systemer
- Klubb: Fokus på klubbstørrelse, mål, tidslinje

### Forslag B: Splitt i to separate sider

| Side | URL | Fokus | Målgruppe |
|------|-----|-------|-----------|
| Software | `/software` | Digitale verktøy, QR-skilt, IUP-plattform | Trenere, klubbledere |
| Klubbtrening | `/klubb` | Sportsplaner, rådgiving, organisasjonsutvikling | Daglig ledere, sportslig ledere |

#### Fordeler:
- SEO: Mer spesifikk innhold per side
- Konvertering: Tydeligere budskap per målgruppe
- Tracking: Enklere å måle hvilken tjeneste som konverterer best

#### Ulemper:
- Krever mer vedlikehold
- Må oppdatere navigasjon og redirects

### Anbefaling
**Start med Forslag A** (behold én side, forbedre segmentering). Dette er:
- Raskere å implementere
- Gir umiddelbar forbedring
- Kan måle effekten før eventuell splitting

---

## 2. Testimonials — Gjøre dem mer troverdige

### Nåværende situasjon
```ts
TESTIMONIALS = [
  { name: "Thomas R.", role: "Medlem siden 2022" },
  { name: "Maria L.", role: "Academy-elev" },
  { name: "Erik og Lise S.", role: "Juniorforeldre" },
  { name: "Knut A.", role: "Daglig leder, Bogstad GK" },
]
```

### Problemer
1. **Anonyme**: Kun fornavn + initial
2. **Ingen bilder**: Vanskelig å relatere seg til
3. **Ingen verifisering**: Kan oppfattes som fabrikkerte

### Forbedringsplan

#### Fase 1: Strukturerte endringer (raskt)
```ts
// Utvidet testimonial-struktur
export const TESTIMONIALS = [
  {
    quote: "...",
    name: "Thomas R.",
    fullName: "Thomas Rasmussen", // Skjult til tillatelse innhentes
    role: "Medlem siden 2022",
    club: "Oslo Golfklubb", // Klubbtilhørighet
    photo: "/images/testimonials/thomas-r.jpg", // Når tilgjengelig
    program: "academy-utvikling", // For kontekst
    featured: true,
  },
]
```

#### Fase 2: Innhente tillatelser
```
E-postmal til eksisterende kunder:

"Hei [Navn],

Vi jobber med å forbedre nettsiden vår og vil gjerne vise frem 
noen av våre fornøyde kunder. 

Vi tenkte å bruke din tilbakemelding:
"[Quote]"

Med din tillatelse vil vi gjerne:
- [ ] Bruke ditt fulle navn
- [ ] Vise klubbtilhørighet
- [ ] Legge til et portrettbilde

Du kan trekke tilbake samtykket når som helst.

Mvh,
Anders"
```

#### Fase 3: Video-testimonials
- Spør 2-3 kunder om de vil delta i kort video-intervju
- 30-60 sekunder, filmet på mobil
- Spørsmål: "Hva er det beste med AK Golf?", "Hva har du oppnådd?"

### Prioritering
1. **Høyest**: Innhente tillatelser for fullt navn + klubb
2. **Medium**: Legge til klubbtilhørighet i eksisterende testimonials
3. **Lavere**: Video-testimonials (krever mer planlegging)

---

## 3. Oppsummering: Hva bør gjøres først?

### Denne uken (raskt):
1. ✅ Resend-oppsett (ferdig dokumentert)
2. 🔄 Legg til klubbtilhørighet i testimonials
3. 🔄 Send e-post til kunder om tillatelse

### Neste måned:
1. 🔄 Implementer forbedret B2B-segmentering (Forslag A)
2. 🔄 Legg til bilder i testimonials når tillatelse er innhentet
3. 🔄 Vurder splitting av /utvikling basert på data

### Måles med:
- Konverteringsrate på kontaktskjema
- Tidsbruk på /utvikling-side
- Bounce rate på landing pages
