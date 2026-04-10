# Booking Redesign — Designspesifikasjon

**Dato:** 2026-04-10
**Omfang:** Komplett redesign av `/booking`-flyten
**Status:** Godkjent for implementering

---

## Beslutninger

- **Arkitektur:** Single-page med sliding drawers fra bunn (bottom sheet)
- **Mønster:** Vipps/Apple Pay-inspirert — drawer glir opp, backdrop-blur bak
- **Målgruppe:** Primært eksisterende spillere (effektivitet), sekundært nye (trygghet)
- **Farger:** Brand Guide V2.0 (#005840, #D1F843, #ECF0EF, #324D45)
- **Animasjoner:** Framer Motion AnimatePresence + spring-animasjoner
- **Ikoner:** Lucide — aldri emojier

## Flyt (6 steg, 1 side)

### Steg 0: Velg trener (sidenivå)

- **URL:** `/booking`
- **Layout:** Ren og minimal — ingen hero, rett på innhold
- **Nav:** Enkel topbar med "Tilbake" + "AK Golf Book"
- **Step-indikator:** 5 små dots øverst som viser progresjon
- **Trener-kort:** 2 kort side om side (1 kolonne på mobil)
  - Bilde fyller kortet (aspect-ratio 3:4)
  - Gradient overlay på bunn med navn, rolle, badge
  - Anders Kristiansen — Head Coach — "Performance · Flex"
  - Markus R. Pedersen — Assistant Coach — "Express · Flex"
- **Interaksjon:** Klikk → kortet utvides, tjenester avslører seg under med animasjon
- **Hover:** translateY(-4px) + box-shadow + lime border

### Steg 1: Velg tjeneste (under trener-kort)

- Vises under valgt trener-kort med expand-animasjon
- **Kun tjenester med ledige tider** — aldri vis utilgjengelige
- Hver tjeneste som rad-kort med:
  - Venstre: Navn, beskrivelse (varighet + type)
  - Høyre: Pris, periode (kr/mnd eller kr), "X ledige denne uken"
- **Aktiv state:** Bakgrunn #005840, hvit tekst, lime pris
- **Klikk** → åpner dato/tid-drawer

### Steg 2: Velg dato (drawer)

- **Type:** Sliding drawer fra bunn med drag-handle
- **Backdrop:** rgba(10,31,24,0.4) med backdrop-filter: blur(4px)
- **Tittel:** "Velg dato og tid" + tjenestenavn
- **Dato-chips:** Horisontal scroll med kun ledige datoer
  - Hver chip: Dagsnavn (Man/Tir/...), dagnummer, måned
  - Selected: #005840 bakgrunn, hvit tekst, lime måned
  - Touch-vennlige: min-width 72px, padding 10px 16px
  - Swipeable — -webkit-overflow-scrolling: touch

### Steg 3: Velg tid (i samme drawer)

- Tids-chips animeres inn under valgt dato
- Chips i flex-wrap layout
- Selected: #D1F843 bakgrunn, #005840 tekst
- Tider hentes fra smart-slots API (kun ledige)
- **CTA:** "Bekreft tid →" knapp nederst i drawer

### Steg 4: Bekreft booking (drawer)

Ny drawer som erstatter dato/tid-drawer.

**Oppsummering (mørk boks #005840):**
- Trener, tjeneste, dato, tid, sted
- Total pris i lime (#D1F843), stor font
- Periode-indikator (kr/mnd for abo, kr for enkelt)

**Fokusområde (valgfritt, multi-select chips):**
- Langt spill (Flag-ikon)
- Innspill (Target-ikon)
- Nærspill (CircleDot-ikon)
- Putting (Circle-ikon)
- Fritekst-felt: "Beskriv utfordringen din (valgfritt)"

**Brukerinfo (form-grid 2 kolonner):**
- Navn* — autofylt for innloggede
- E-post* — autofylt for innloggede
- Telefon — autofylt for innloggede
- Handicap — valgfritt
- Prefilled-felt har dempet bakgrunn (#f0f4f3)

**Vilkår:**
- Checkbox med dynamisk tekst:
  - Abo: "...beløpet på X kr/mnd trekkes automatisk..."
  - Enkelt: "...godtar vilkårene..."
  - Abonnent: "...inkludert i mitt abonnement..."

**CTA:** "Gå til betaling →" (lime knapp)

### Steg 5: Betal (drawer)

**Betalingsmetoder (valgbare kort):**
1. Kortbetaling — Visa / Mastercard (Lucide CreditCard-ikon)
2. Apple Pay — Apple-logo SVG, svart bakgrunn
3. Google Pay — Google G SVG, hvit bakgrunn

Alle via Stripe Payment Element. Apple Pay/Google Pay vises kun når nettleseren støtter det.

**Trust-badges (3-grid):**
- Lock-ikon: "SSL-kryptert"
- Calendar-ikon: "Avbestill 24t før"
- Mail-ikon: "Bekreftelse på e-post"

**CTA:** "Betal X kr →" (lime knapp)

### Bekreftelsesvisning (i drawer)

- Checkmark i lime sirkel (#D1F843)
- "Bookingen er bekreftet!"
- "Du mottar en bekreftelse på e-post"
- Oppsummering i grå boks (trener, tjeneste, dato, tid, sted)
- To knapper: "Tilbake til forsiden" (mørk) + "Mine bookinger" (lime)

## Komponent-arkitektur

```
app/booking/
├── page.tsx                    # Single-page booking (server → client)
├── components/
│   ├── TrainerCard.tsx         # Profilkort med expand-tjenester
│   ├── ServiceList.tsx         # Tjeneste-rader under trener
│   ├── BookingDrawer.tsx       # Base drawer (AnimatePresence + spring)
│   ├── DateTimeDrawer.tsx      # Dato-chips + tid-chips
│   ├── ConfirmDrawer.tsx       # Oppsummering + fokus + brukerinfo
│   ├── PaymentDrawer.tsx       # Betalingsmetoder + trust badges
│   ├── SuccessDrawer.tsx       # Bekreftelse
│   ├── DateChip.tsx            # Enkelt dato-chip
│   ├── TimeChip.tsx            # Enkelt tid-chip
│   ├── FocusAreaChips.tsx      # Fokusområde multi-select
│   └── StepIndicator.tsx       # 5 dots progresjon
```

## Teknisk

- **Framer Motion:** AnimatePresence for drawer mount/unmount, motion.div med spring-config for slide-up
- **Drawer-animasjon:** initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }}
- **Backdrop:** motion.div med opacity 0→1, onClick lukker drawer
- **Dato-chips:** Horisontalt scrollbart med overflow-x: auto, scroll-snap-type: x mandatory
- **API-kall:** Eksisterende endepunkter:
  - GET `/api/portal/public/service-types` — hent tjenester med instruktører
  - GET `/api/booking/smart-slots` — hent ledige tider per uke
  - POST `/api/booking/create` — opprett booking
- **Tilgjengelighetsfilter:** Filtrer bort tjenester som ikke har noen ledige slots de neste 14 dagene
- **Betaling:** Stripe Payment Element (håndterer kort + Apple Pay + Google Pay)
- **State:** React useState for steg-progresjon, valgt trener/tjeneste/dato/tid
- **Bilder:** Trener-bilder fra `/public/images/academy/` (AK-Golf-Academy-20.jpg, 25.jpg)

## Desktop-tilpasning

- Drawere: max-width 720px, sentrert
- Trener-kort: 2 kolonner side om side
- Tjeneste-rader: 1 kolonne under kortet
- Ellers identisk opplevelse — drawer fra bunn også på desktop

## Hva som fjernes

- `/booking/select-service/page.tsx` — erstattes av single-page
- `/booking/date-time/page.tsx` — erstattes av DateTimeDrawer
- `/booking/review-confirm/page.tsx` — erstattes av ConfirmDrawer
- `BookingNavSidebar.tsx` — erstattes av StepIndicator dots
- `BookingProgress.tsx` — erstattes av StepIndicator dots
- Vipps-betaling — kun Stripe (kort + Apple Pay + Google Pay)
