# Player Hub Tier-strategi

**Dato:** 2026-03-27
**Prosjekt:** AK Golf Spillerportal
**Status:** Strategi-dokument

---

## Oppsummering

Denne strategien definerer hvordan spillerportalen skal struktureres i tier-nivåer som:
1. Gir gratis verdi som konverterer til nedlastning
2. Driver organisk oppgradering gjennom gamification
3. Maksimerer LTV for seriøse spillere

---

## Eksisterende tier-struktur (Prisma)

```prisma
enum SubscriptionTier {
  VISITOR    // Ikke innlogget / ingen tilgang
  ACADEMY    // Coaching-kunder (automatisk via abonnement)
  STARTER    // Gratis digital-bruker
  PRO        // Betalende digital-bruker
  ELITE      // Premium digital + coaching
}
```

---

## Ny tier-struktur: Spillerportal

| Tier | Pris/mnd | Kjerneproposisjon | Målgruppe |
|------|----------|-------------------|-----------|
| **FREE** (STARTER) | 0 kr | Treningsdagbok med begrensninger + smakebit | Nysgjerrige spillere |
| **PRO** | 299 kr | Full dagbok + statistikk + AI-analyse | Selvstendige trenere |
| **ACADEMY** | Inkludert i coaching | Alt i PRO + coaching-integrasjon | Coaching-kunder |
| **ELITE** | 799 kr | Alt + turneringsverktoy + prioritert support | Seriose konkurranse-spillere |

---

## Detaljert funksjonsmatrise

### FREE (Gratis) - Verdi som konverterer

| Funksjon | FREE | PRO | ACADEMY | ELITE |
|----------|------|-----|---------|-------|
| **Treningsdagbok** | 10 logger/mnd | Ubegrenset | Ubegrenset | Ubegrenset |
| **Handicap-sporing** | 3 registreringer/mnd | Ubegrenset | Ubegrenset | Ubegrenset |
| **Statistikk** | Siste 7 dager | 90 dager | Full historikk | Full historikk |
| **Ovelsesbank** | 10 ovelserr | Alle | Alle + personlige | Alle + personlige |
| **Achievements** | 5 basis | Alle | Alle | Alle + eksklusive |
| **Eksport (CSV/PDF)** | Nei | Ja | Ja | Ja |

### PRO - For den selvstendige spilleren

| Funksjon | FREE | PRO | ACADEMY | ELITE |
|----------|------|-----|---------|-------|
| **AI Svakhetsanalyse** | Nei | Ja | Ja | Ja |
| **Strokes Gained radar** | Nei | Ja | Ja | Ja |
| **Treningsplanlegger** | Nei | Enkel | Full med coach | Full + AI-justering |
| **Sammenligning** | Nei | Anonymisert | Med peers | Full benchmarking |
| **Konsistens-heatmap** | Nei | Ja | Ja | Ja |
| **Plan vs. faktisk** | Nei | Ja | Ja | Ja |

### ACADEMY - Coaching-kunder (automatisk)

| Funksjon | FREE | PRO | ACADEMY | ELITE |
|----------|------|-----|---------|-------|
| **Coaching-notater** | Nei | Nei | Ja | Ja |
| **Videoanalyse** | Nei | Nei | 2/uke | Ubegrenset |
| **Coach-chat** | Nei | Nei | Ja | Prioritert |
| **AI-oppsummering av sesjoner** | Nei | Nei | Ja | Ja |
| **Treningsplan fra coach** | Nei | Nei | Ja | Ja |
| **Booking prioritet** | Nei | Nei | 7-14 dager | Ubegrenset |

### ELITE - Alt for seriose spillere

| Funksjon | FREE | PRO | ACADEMY | ELITE |
|----------|------|-----|---------|-------|
| **Turneringsplanlegger** | Nei | Nei | Enkel | Full med AI |
| **Turneringsprep-sjekklister** | Nei | Nei | Nei | Ja |
| **Periodiseringsverktoy** | Nei | Nei | Enkel | Full |
| **Eksklusivt innhold** | Nei | Nei | Nei | Ja |
| **Prioritert support** | Nei | Nei | Nei | 12t respons |
| **Beta-tilgang** | Nei | Nei | Nei | Ja |

---

## Treningsdagbok-strategi

### Gratis start med begrensninger

```
FREE-bruker far:
- 10 treningslogger per maned
- Kun siste 7 dagers visning
- Ingen eksport
- Ingen AI-analyse
```

**Psykologi:** Nok til a oppleve verdi, ikke nok til a bli fornøyd. Etter 10 logger ser de:

> "Du har brukt 10 av 10 logger denne maneden.
> Oppgrader til PRO for ubegrenset logging og AI-analyse av treningene dine."

### Gamification: Las opp mer

Achievements som driver engasjement og oppgradering:

| Achievement | Krav | Tier | Belonning |
|-------------|------|------|-----------|
| Forste logg | Logg 1 okt | FREE | Badge + 2 ekstra logger |
| Ukentlig rytme | 3 logger pa 7 dager | FREE | Badge |
| Mannedlig dedikasjon | 12 logger pa 30 dager | FREE | Badge + PRO-prov i 7 dager |
| Kvartals-mester | 40 logger pa 90 dager | PRO | Eksklusiv badge |
| Ars-veteran | 150 logger pa 12 mnd | PRO | ELITE-prov i 14 dager |

### Progresjonsvisning som motiverer

```
[====>          ] 4/10 logger denne maneden

"6 logger igjen for du laser opp 'Ukentlig rytme' achievement"
```

---

## Konverteringsstrategi

### 1. Fa folk til a laste ned (kun via akgolf.no)

**Inngangspunkter:**
- **Forsiden:** "Gratis treningsdagbok" CTA under coaching-seksjon
- **Academy-siden:** "Start gratis i spillerportalen" etter priser
- **Alle artikler/innhold:** Embedded CTA til gratis registrering
- **QR pa range:** Fysiske skilt med QR til registrering

**Verdiproposisjon (FREE):**
> "Hold styr pa treningene dine, se utviklingen, og fa smarte tips.
> Gratis. Ingen binding. Oppgrader nar du er klar."

**Sosial proof:**
> "500+ spillere bruker AK Golf-portalen for a trene smartere."

### 2. Konvertere FREE til PRO

**Trigger-punkter:**

| Trigger | Melding | Tidspunkt |
|---------|---------|-----------|
| 10 logger brukt | "Oppgrader for ubegrenset logging" | Nar grensen nas |
| 5 dager pa rad | "Du er pa god vei! PRO gir deg AI-analyse" | Dag 5 |
| Forsok pa eksport | "Eksporter data til PDF med PRO" | Ved klikk |
| Se statistikk >7 dager | "Full historikk krever PRO" | Ved forsok |

**Prøveperiode-strategi:**
- 7-dagers PRO-prov etter "Mannedlig dedikasjon" achievement
- Ingen kredittkort for prov (senk terskel)
- Automatisk tilbakefall til FREE etter prov

**Pris-forankring:**
> "299 kr/mnd = prisen av 2 rangeballer-bokser.
> Men du far AI-analyse, full statistikk og treningsplanlegger."

### 3. Drive til ELITE

**Trigger-punkter:**

| Trigger | Melding | Målgruppe |
|---------|---------|-----------|
| Registrerer turneringer | "Turneringsplanlegger med AI i ELITE" | Aktive konkurransespillere |
| Hoy treningsfrekvens | "Du trener som en elite - oppgrader for elite-verktoy" | 4+ okter/uke |
| Handicap under 10 | "ELITE-verktoy for seriose spillere" | Lavhandicap |

**Eksklusivitet:**
> "Maks 50 ELITE-medlemmer. Fa plass na."

**Annual vs. monthly:**
- ELITE arlig: 6 990 kr (27% rabatt vs. mannedlig)
- Betalende ELITE far: Eksklusiv Discord, kvartalsvis videosamtale med Anders

---

## Teknisk implementering

### Prisma-oppdatering

Eksisterende enum dekker behovet:
```prisma
enum SubscriptionTier {
  VISITOR    // Ikke innlogget
  STARTER    // FREE (ny bruker)
  ACADEMY    // Coaching-kunde
  PRO        // Betalende digital
  ELITE      // Premium
}
```

### Tier-gate komponent

Eksisterende `TierGate` i `/components/portal/ui/tier-gate.tsx` brukes allerede:

```tsx
<TierGate userTier={userTier} required={SubscriptionTier.PRO}>
  <AIWeaknessCard />
</TierGate>
```

### Brukskvote-modell (ny)

```prisma
model UsageQuota {
  id              String   @id @default(cuid())
  userId          String   @unique
  trainingLogs    Int      @default(0)  // Reset månedlig
  handicapEntries Int      @default(0)  // Reset månedlig
  lastResetAt     DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Achievement-definisjon (utvidelse)

```prisma
model AchievementDefinition {
  id              String   @id
  key             String   @unique
  title           String
  description     String
  icon            String   @default("trophy")
  category        String   // "training", "consistency", "milestone"
  threshold       Int      @default(1)
  tierRequired    String   @default("STARTER")
  reward          Json?    // { "extraLogs": 2 } eller { "trialDays": 7, "tier": "PRO" }
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
}
```

---

## Inntektsmodell

### Antatt konvertering

| Metrikk | Verdi |
|---------|-------|
| FREE-brukere (total) | 2 000 |
| FREE til PRO konvertering | 8% |
| PRO til ELITE konvertering | 15% |
| Churn PRO | 5%/mnd |
| Churn ELITE | 2%/mnd |

### Månedlig inntekt (steady state)

| Tier | Brukere | Pris | MRR |
|------|---------|------|-----|
| FREE | 1 800 | 0 kr | 0 kr |
| PRO | 160 | 299 kr | 47 840 kr |
| ELITE | 24 | 799 kr | 19 176 kr |
| **Total** | | | **67 016 kr** |

### ARR-potensial

**Konservativt:** 804 000 kr/år (kun digital)
**Med coaching-integration:** 1.5M+ kr/år (coaching-kunder som oppgraderer til ELITE)

---

## Lanseringsfaser

### Fase 1: Gratis tier (Q2 2026)
- Treningsdagbok med 10-logs grense
- Basis achievements
- Handicap-sporing (3/mnd)
- Enkel statistikk

### Fase 2: PRO-tier (Q2 2026)
- Stripe-integrasjon for PRO
- AI-analyse
- Full statistikk
- Treningsplanlegger

### Fase 3: ELITE-tier (Q3 2026)
- Turneringsverktøy
- Periodisering
- Eksklusivt innhold
- Priority support

### Fase 4: Gamification (Q3 2026)
- Achievement-system utvidet
- Progresjonsvisning
- Prov-perioder via achievements

---

## Konklusjon

Denne tier-strukturen:

1. **Gir verdi gratis** - Treningsdagbok er nyttig nok til a bli brukt, begrenset nok til a drive oppgradering
2. **Naturlig progresjon** - Achievements og bruksgrenser driver organisk konvertering
3. **Klar differensiering** - Hver tier har tydelig merverdi over forrige
4. **Integrert med coaching** - ACADEMY-tier forsterker coaching-produktet
5. **Skalerbar inntekt** - Digitale produkter skalerer uten ekstra coaching-kapasitet

**Neste steg:**
1. Implementer UsageQuota-modell
2. Bygg achievements for treningsdagbok
3. Sett opp Stripe-produkter for PRO og ELITE
4. Lag onboarding-flyt for FREE-brukere
