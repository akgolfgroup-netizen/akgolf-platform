# Booking-side Redesign

**Dato:** 2026-04-02
**Status:** Godkjent
**Mockups:** `.superpowers/brainstorm/31643-1775126582/`

## Problem

Nåværende booking-side viser 12+ tjenester flat i et grid. Dette skaper:
- Beslutningsangst (for mange valg)
- Ingen veiledning (kunden må selv finne ut hva som passer)
- Dårlig konvertering (usikre kunder forlater siden)

## Løsning

Kategori-først navigasjon med anbefalt-fremheving og quiz-veileder.

## Booking-flyt

```
┌─────────────────────────────────────────────────────────────┐
│  Steg 1: Velg kategori                                      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  Abonnement  │  │  Individuell │                        │
│  │ Fra 1600/mnd │  │  995-2500 kr │                        │
│  └──────────────┘  └──────────────┘                        │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │    Gruppe    │  │ Banecoaching │                        │
│  │   250-500 kr │  │  500-3000 kr │                        │
│  └──────────────┘  └──────────────┘                        │
│                                                             │
│         [ Usikker? Hjelp meg velge ]                       │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Steg 2: Velg tjeneste                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ★ ANBEFALT: Foundation Test                        │   │
│  │    50 min · Kartlegging · 995 kr                    │   │
│  └─────────────────────────────────────────────────────┘   │
│  Andre alternativer:                                        │
│  ├─ Flex 50 Solo · 50 min · 1 500 kr                       │
│  ├─ Flex 90 Solo · 90 min · 2 500 kr                       │
│  └─ Markus 20 min · 20 min · 300 kr                        │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Steg 3: Velg trener og tid                                 │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│  │ Anders  │ │ Markus  │ │  Alle   │  ← Trener-tabs        │
│  └─────────┘ └─────────┘ └─────────┘                       │
│                                                             │
│  [ ← ]  Uke 15 · 7.–13. apr 2026  [ → ]                    │
│                                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                  │
│  │ Man │ │ Tir │ │ Ons │ │ Tor │ │ Fre │  ← Dag-velger    │
│  │  7  │ │  8  │ │  9  │ │ 10  │ │ 11  │                   │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                  │
│                                                             │
│  ┌───────┐ ┌───────┐ ┌───────┐                            │
│  │ 09:00 │ │ 10:00 │ │ 11:00 │  ← Tids-grid               │
│  └───────┘ └───────┘ └───────┘                            │
└─────────────────────────────────────────────────────────────┘
```

## Kategorier og tjenester

### 1. Abonnement
Månedlig coaching med fast pris og booking-vindu.

| Tjeneste | Pris | Økter | Booking-vindu |
|----------|------|-------|---------------|
| **Performance** (anbefalt) | 1 600 kr/mnd | 2 × 20 min | 7 dager |
| Performance Pro | 2 000 kr/mnd | 4 × 20 min | 14 dager |

### 2. Individuell
Enkeltbetaling, drop-in (48t booking-vindu).

| Tjeneste | Pris | Varighet | Trener |
|----------|------|----------|--------|
| **Foundation Test** (anbefalt for nye) | 995 kr | 50 min | Anders |
| Flex 50 Solo | 1 500 kr | 50 min | Anders |
| Flex 90 Solo | 2 500 kr | 90 min | Anders |
| Markus 20 min | 300 kr | 20 min | Markus |

### 3. Gruppe
Lavere pris per person, sosial setting.

| Tjeneste | Pris | Varighet | Maks |
|----------|------|----------|------|
| **Flex 50 Duo** (anbefalt) | 1 700 kr (850/pers) | 50 min | 2 |
| Flex 90 Duo | 2 800 kr (1400/pers) | 90 min | 2 |
| 9 Hull Social | 250 kr/kveld | ~2 timer | 8 |

### 4. Banecoaching
Coaching på banen med kursmanagement.

| Tjeneste | Pris | Varighet | Trener |
|----------|------|----------|--------|
| **On-Course Par 3** (anbefalt) | 500 kr | 90 min | Markus |
| On-Course 9 | 3 000 kr | 2,5 timer | Anders |

## Veileder ("Hjelp meg velge")

3-spørsmåls quiz som leder til personlig anbefaling.

### Spørsmål 1: Hva er målet ditt?
- 🎯 **kort-sikt**: Bli bedre på kort sikt
- 📈 **langsiktig**: Systematisk utvikling over tid
- 🌱 **nybegynner**: Jeg er helt ny til golf → **AVSLUTT → Foundation Test**
- 🏢 **bedrift**: Bedriftsevent / sosialt → **AVSLUTT → Gruppe-side**

### Spørsmål 2: Hvor ofte vil du trene? (vises kun for kort-sikt/langsiktig)
- **ukentlig**: Ukentlig
- **sporadisk**: Av og til
- **engang**: Én gang

### Spørsmål 3: Alene eller med andre? (vises kun for sporadisk/engang)
- **alene**: Alene
- **duo**: Med én venn
- **gruppe**: Gruppe

### Quiz-resultatmatrise

| Spm 1 | Spm 2 | Spm 3 | Resultat |
|-------|-------|-------|----------|
| nybegynner | - | - | Foundation Test |
| bedrift | - | - | Gruppe-side |
| langsiktig | ukentlig | - | Performance Pro |
| langsiktig | sporadisk | - | Performance |
| langsiktig | engang | - | Foundation Test |
| kort-sikt | ukentlig | - | Performance |
| kort-sikt | sporadisk | alene | Flex 50 Solo |
| kort-sikt | sporadisk | duo | Flex 50 Duo |
| kort-sikt | sporadisk | gruppe | 9 Hull Social |
| kort-sikt | engang | alene | Flex 50 Solo |
| kort-sikt | engang | duo | Flex 50 Duo |
| kort-sikt | engang | gruppe | On-Course Par 3 |

**Logikk:** Noen svar avslutter tidlig (nybegynner, bedrift). Langsiktig + ukentlig trenger ikke spm 3. Spørsmål 3 vises kun når relevant.

## Trenervalg

Tabs over kalenderen: **Anders** | **Markus** | **Alle**

- "Alle" viser alle ledige tider uavhengig av trener
- Valgt trener filtrerer kalenderen
- Noen tjenester er trener-spesifikke (Markus 20 min → kun Markus)

## Teknisk arkitektur

### Nye komponenter
```
app/booking/
├── page.tsx                    # Steg 1: Kategori-velger (refaktorert)
├── [category]/
│   └── page.tsx                # Steg 2: Tjenester i kategori
├── new/
│   └── page.tsx                # Steg 3: Trener + tid (eksisterer, utvides)
├── veileder/
│   └── page.tsx                # Quiz-flyt
└── components/
    ├── CategoryCard.tsx        # Kategori-kort
    ├── ServiceCard.tsx         # Tjeneste-kort (anbefalt vs standard)
    ├── InstructorTabs.tsx      # Trener-filter tabs
    └── QuizWizard.tsx          # Veileder-komponent
```

### Database
Bruker eksisterende felter:
- `ServiceType.category` for gruppering
- `ServiceType.sortOrder` for rekkefølge

**Anbefalt-markering:** Hardkodet i `lib/booking-config.ts` (ikke database) for enkel endring:
```typescript
export const RECOMMENDED_SERVICES: Record<string, string> = {
  INDIVIDUAL: "foundation-test",      // serviceType.id
  GROUP: "flex-50-duo",
  SUBSCRIPTION: "performance",
  PLAYING_LESSON: "on-course-par3",
};
```

### Ruting
| URL | Innhold |
|-----|---------|
| `/booking` | Kategori-velger |
| `/booking/individuell` | Individuelle tjenester |
| `/booking/gruppe` | Gruppetjenester |
| `/booking/abonnement` | Abonnementer |
| `/booking/bane` | Banecoaching |
| `/booking/veileder` | Quiz-flyt |
| `/booking/new?serviceTypeId=X` | Trener + tid (eksisterer) |

## Mobil-tilpasning

Allerede implementert (forrige commit):
- Dag-velger: Horisontalt scroll på mobil
- Tids-grid: 2 kolonner på mobil, 4 på desktop
- Sidebar: Mobile drawer

Nye krav:
- Kategori-grid: 2×2 på mobil, 2×2 på desktop (samme)
- Trener-tabs: Full bredde, scrollbar ved behov

## Suksesskriterier

1. **Redusert beslutningsangst:** Maks 4 valg per steg
2. **Økt konvertering:** Veileder fanger usikre kunder
3. **Raskere booking:** 3 steg til betaling (ned fra 4)
4. **Mobilvennlig:** Fungerer på iPhone SE (320px)

## Utenfor scope

- Bedrift-kategori (lanseres senere)
- Junior-kategori (lanseres senere)
- Nybegynner-pakker (Første Sesong, Vintertrening)
- Abonnement-betaling via Stripe subscriptions (eksisterende flow)
