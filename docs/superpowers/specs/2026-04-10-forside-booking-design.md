# Forside + Booking Redesign — Designspesifikasjon

**Dato:** 2026-04-10
**Omfang:** Forside (/) og booking select-service
**Status:** Godkjent for implementering

---

## Beslutninger tatt i brainstorming

- **Retning:** Hybrid A+C — Split hero med stats + trust bar + bildegalleri
- **Oppdatert:** Fullskjerm levende hero (ikke split) med mus-parallax
- **Farger:** Brand Guide V2.0 (#005840, #D1F843, #ECF0EF, #324D45)
- **Interaktivitet:** Scroll reveals, parallax hero, talltellere, bento hover, bilde-reveals

## Forside — Seksjoner (top til bunn)

### 1. Fullskjerm Hero (100vh)
- **Bilde:** AK-Golf-Academy-20.jpg (coaching pa range, lav vinkel)
- **Effekt:** Slow zoom-animasjon (20s infinite) + mus-parallax (useMotionValue)
- **Overlay:** Gradient bunn + vignette + film-grain
- **Innhold:** Sentrert — badge, tittel, undertekst, 2 knapper (lime CTA + glass)
- **Nav:** Transparent → hvit med blur ved scroll

### 2. Trust Bar
- **Tall:** 142 (spillere), 4.8 (rating), -3.2 (HCP), 2000+ (okter)
- **Effekt:** Talltellere animerer fra 0 nar synlige (motion-number)
- **Layout:** Sentrert rad med border-bottom

### 3. Bento-grid (Tjenester)
- **Layout:** 3-kolonner, 2 rader. Academy = tall (span 2 rader), Junior + Utvikling + Mulligan
- **Bilder:** Academy-30.jpg i Academy-kortet, Academy-25.jpg i Junior
- **Effekt:** Hover = loft + skygge + mus-folgende glow (radial gradient)
- **Scroll:** Fade-in med stagger

### 4. Bildegalleri (3 bilder)
- **Bilder:** instruksjon.jpg, putting.jpg, banecoaching.jpg
- **Effekt:** clip-path wipe fra bunn nar scrollet til, staggered 200ms
- **Layout:** 3-kolonner, avrundede hjorner

### 5. Priser (3 kort)
- **Pakker:** Performance (1600), Performance Pro (2000, featured), Flex (1500+)
- **Effekt:** Scroll reveal + hover loft
- **CTA:** Lime for Pro, ghost for andre

### 6. Portal-preview
- **Layout:** Tekst venstre + mockup/screenshot hoyre i lys boks (#ECF0EF)
- **Chips:** Treningsplaner, Scoring, AI-innsikt, Booking, TrackMan
- **CTA:** Mork knapp "Logg inn"

### 7. CTA (avsluttende)
- **Bakgrunn:** #0A1F18 med pulserende glow-orber
- **CTA:** Lime "Book din forste okt"

## Booking select-service — Oppdatering
- Erstatt V1.0 farger (#154212, #d2f000) med V2.0
- Behold eksisterende funksjonalitet, kun visuell oppdatering

## Teknisk
- Framer Motion for alle animasjoner
- motion-number for talltellere
- IntersectionObserver via useInView() for scroll triggers
- Bilder fra /public/images/academy/ og /public/images/sections/
- Tekst fra lib/website-constants.ts
