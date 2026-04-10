# Referanser og eksempler

## Design-inspirasjon

### Liker dette
| Referanse | Hva | Hvorfor |
|-----------|-----|---------|
| **Apple.com** | Minimalisme, spacing, typografi | Ren, premium folelse uten stoy |
| **Linear.app** | Dashboard-design, sidebar, dark-on-light | Profesjonelt verktoy-design |
| **Stripe Dashboard** | Datapresentasjon, kort, tabeller | Tydelig hierarki, god bruk av hvitrom |
| **Notion** | Bento-grid, varierende kortstorrelser | Fleksibel layout som ikke er kjedelig |
| **Vercel Dashboard** | Deployment-status, minimal UI | Ingen unodvendig pynt |

### Misliker dette
| Referanse | Hva | Hvorfor |
|-----------|-----|---------|
| **Generisk SaaS** | Blaa gradienter, stock-bilder, "hero with laptop" | AI-slop, ser ut som alle andre |
| **Bootstrap-design** | Flat, identisk grid, ingen personlighet | Kjedelig og upersonlig |
| **Dashboard med for mye farge** | 10+ farger, ikoner overalt | Rotete, vanskelig a fokusere |
| **Dark mode-forst** | Morke bakgrunner som primaer | Ikke premium-folelse for golf |
| **Emoji-tunge UI** | Emojier som ikoner og dekorasjon | Uprofesjonelt |

## Konkurrenter / Sammenlignbare

| Produkt | Hva de gjor | Hva vi gjor bedre |
|---------|-------------|-------------------|
| **CoachNow** | Video-analyse, kommunikasjon | Norsk, integrert booking, TrackMan |
| **Golfbox** | Handicap, turneringer | Coaching-fokus, AI, treningsplaner |
| **Acuity Scheduling** | Booking | Golf-spesifikk, integrert med coaching |
| **TrainHeroic** | Treningsprogrammer | Golf-spesifikk, not general fitness |

## Smakspreferanser (fra prosjekteier)

### Visuelt
- "Sort. Hvit. En gronn." — Ekstremt minimalt fargebruk
- Premium-folelse uten a vaere "luksus" (ikke gull/bronse)
- Data skal alltid ha kontekst (trend, sparkline, ikke bare et tall)
- Bento-grid med variasjon — aldri identisk 4-kolonne grid
- Knapper er pill-form, ikke firkantede

### Tonalitet
- Profesjonell men varm — som en kompetent trener, ikke en bedrift
- Norsk bokmaal, naturlig sprak
- Aldri vis sertifiseringer eller titler — fokus pa metode og resultater
- Aldri "velkommen tilbake" uten data — vis noe nyttig umiddelbart

### Hva prosjekteier eksplisitt har avvist
- Emojier i UI
- MVA-informasjon pa kundesider
- Trenersertifiseringer (PGA, TrackMan, TPI)
- Dark mode (kun light mode)
- Gamle Apple-farger (#34C759, #FF3B30, #FF9500, #1D1D1F, #2D6A4F)
- Generiske gradienter
- Standard shadcn uten tilpasning
- Bronse/gull-farger (`#B07D4F`)
- `--apple-gold-*` tokens
- Heritage Grid neon-lime design (droppet april 2026)

## Design-retning: Brand Guide V2.0 (april 2026)

Etter evaluering av flere design-systemer ble Brand Guide V2.0 vedtatt som endelig branding:

- **Brand Guide V2.0** er eneste design-system for alle flater
- Heritage Grid er droppet helt
- Apple Light 2026 er erstattet av Brand Guide V2.0
- Primary: #005840 | Accent/CTA: #D1F843 | Surface: #ECF0EF | Text: #324D45
- Semantikk: Success #2A7D5A | Warning #C48A32 | Danger #B84233
- Mission Control bruker Brand Guide V2.0 med `--mc-` prefiks for divisjonsfarger
- Alle sider (landing, portal, booking, mission board) bruker samme branding
