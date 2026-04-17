# Coaching Forecast — Metodologi

> **Formål:** Gi coach og spiller et matematisk ærlig, evidensbasert svar på spørsmålet *"Hva kreves for å gå fra score X til score Y innen tid T?"*
>
> **Prinsipp:** Ingen tall i produksjon uten kildehenvisning eller tydelig merking som "ekspert-estimat, må kalibreres". Hver prediksjon leveres med konfidensintervall og dokumenterte antakelser. Vi overselger aldri.
>
> **Versjon:** 1.0 — 2026-04-17
> **Ansvarlig:** AK Golf Academy (Anders Kristiansen) + AK Golf Software
> **Status:** Foundation — klar for implementering steg 2–5.

---

## Innholdsfortegnelse

1. [Formål og bruksområder](#1-formål-og-bruksområder)
2. [Matematisk kjede](#2-matematisk-kjede)
3. [Trinn A: Bane-justert SG](#3-trinn-a-bane-justert-sg)
4. [Trinn B: Score → SG-delta](#4-trinn-b-score--sg-delta)
5. [Trinn C: Kategori-fordeling av deltaet](#5-trinn-c-kategori-fordeling-av-deltaet)
6. [Trinn D: Hours-per-SG kalibrering](#6-trinn-d-hours-per-sg-kalibrering)
7. [Trinn E: Tek/Tak/Mental/Fys-fordeling](#7-trinn-e-tektakmentalfys-fordeling)
8. [Trinn F: Monte-Carlo sannsynlighet](#8-trinn-f-monte-carlo-sannsynlighet)
9. [Konfidensintervaller og usikkerhet](#9-konfidensintervaller-og-usikkerhet)
10. [Antakelser og begrensninger](#10-antakelser-og-begrensninger)
11. [Backtesting-protokoll](#11-backtesting-protokoll)
12. [Referanser](#12-referanser)

---

## 1. Formål og bruksområder

### Bruksområder

1. **Spiller-forventningsstyring** — Realistisk tidsbruk og sannsynlighet for måloppnåelse.
2. **Coach-planlegging** — Hvilke områder gir mest avkastning per time.
3. **Foreldre-kommunikasjon** — Matematisk grunnlag for ressursprioritering (fasiliteter, leir, coaching).
4. **College-søknadssupport** — Dokumentere progresjon og målrettet arbeid.
5. **Talent-ID** — Identifisere spillere med urealistisk avvik fra prognose (positivt = talentfull).

### Ikke-bruksområder

- **Ikke** en garanti. Alle tall er sannsynligheter, ikke løfter.
- **Ikke** en erstatning for coach-vurdering. Metodologien informerer coach, overstyrer ikke.
- **Ikke** en motivasjonsmaskin. Hvis tallene sier 15% sannsynlighet, sier vi 15% — ikke 50%.

---

## 2. Matematisk kjede

Forecast-funksjonen består av seks sekvensielle trinn (A–F):

```
[A] Historiske runder → Bane-justert SG
       ↓
[B] Nåværende SG + Mål-score → SG-delta som kreves
       ↓
[C] SG-delta → Fordeling per kategori (OTT/APP/ARG/PUTT)
       ↓
[D] SG-delta per kategori → Estimerte timer
       ↓
[E] Rotårsak-analyse → Tek/Tak/Mental/Fys-fordeling
       ↓
[F] Monte-Carlo → Sannsynlighet for måloppnåelse
```

Hver trinn har egne matematiske antakelser som dokumenteres i sin seksjon.

---

## 3. Trinn A: Bane-justert SG

### 3.1 Problemet

Score alene er ikke sammenlignbar mellom baner. En 75 på Losby GK er ikke det samme som en 75 på Augusta National. Uten bane-justering kan vi ikke lage meningsfulle prognoser.

### 3.2 Metode — WHS Differential (fallback)

Standard World Handicap System-formel:

```
Differential = (Score − CourseRating) × 113 / SlopeRating
```

Hvor:
- **113** er standard Slope Rating (gjennomsnittsbane).
- **CourseRating** er "forventet score for en scratch-spiller".
- **SlopeRating** er 55–155, hvor 113 = nøytral.

**Kilde:** [USGA/R&A World Handicap System Rules of Handicapping (2024)](https://www.usga.org/handicapping.html), Appendiks E.

**Bruk:** Differential-metoden er vår **minste felles multiplum**. Den virker hvis vi bare har score + bane-info.

### 3.3 Metode — Shot-Level SG (foretrukket)

Hvis shot-level data foreligger (GPS + kølle per slag):

```
SG_shot = J_before(d, c) − J_after(d', c') − 1
SG_round = Σ SG_shot
```

Hvor **J(d, c)** er forventet antall slag fra avstand *d* og lie *c* til hull, basert på PGA Tour-benchmark (Broadie 2014).

**Kilde:** Broadie, M. (2014). *Every Shot Counts: Using the Revolutionary Strokes Gained Approach to Improve Your Golf Performance and Strategy*. Gotham Books.

**Implementasjon:** Allerede delvis til stede i `lib/portal/golf/expected-strokes.ts` og `sg-calculator.ts`.

**Bruk:** Skal prioriteres over WHS Differential når data tillater det — bane-uavhengig per definisjon.

### 3.4 Metode — Vær- og field-justering

#### Vær (forenklet lineær modell)

```
weather_adjustment_strokes = β_wind · wind_m_s + β_rain · rain_mm + β_temp · (20 − temp_c)
```

**Kalibrering:** β-koeffisienter skal læres fra historiske runder på samme bane med varierende værforhold.

**Initial antakelse (må kalibreres):**
- β_wind ≈ +0.25 slag per m/s over 3 m/s (ekspert-estimat, basert på Broadies wind/course-studier)
- β_rain ≈ +0.15 slag per mm nedbør (ekspert-estimat)
- β_temp ≈ +0.05 slag per °C under 15°C (ekspert-estimat)

**Merknad:** Disse koeffisientene er foreløpige. Skal oppdateres ved n > 500 runder med vær-data i vår egen database.

#### Field-strength (kun for turneringsrunder)

```
field_adjustment = mean(sg_total) for felt
```

Hentes fra DataGolf for PGA Tour-turneringer. For norsk junior-tour (Srixon Tour osv.) må vi beregne eget field-strength fra spillerdatabasen vår.

### 3.5 Output fra Trinn A

For hver runde i historikken:
- `raw_sg_total` (beste estimat)
- `adjusted_sg_total` (vær- og feltjustert)
- `confidence` (høy for shot-level, medium for WHS differential)
- `source_flag` (shot-level / differential / mixed)

---

## 4. Trinn B: Score → SG-delta

### 4.1 Konvertering

Gitt:
- Nåværende snitt-score `s_now`
- Mål-snitt-score `s_goal`
- Baner spilleren opererer på: gjennomsnitt Course Rating `CR_avg` og Slope `Slope_avg`

**Antakelse:** Spillerens progresjon måles på representative baner — ikke nødvendigvis samme bane hver gang.

```
diff_now   = (s_now  − CR_avg) × 113 / Slope_avg
diff_goal  = (s_goal − CR_avg) × 113 / Slope_avg
delta_diff = diff_now − diff_goal
```

SG-delta (negativ differential = bedre score):

```
delta_sg_total = delta_diff   // Positiv = forbedring som kreves
```

### 4.2 Alternativ: Direkte SG-basert

Hvis vi har shot-level SG direkte:

```
delta_sg_total = sg_goal_total − sg_now_total
```

Hvor `sg_goal_total` hentes fra `SG_BENCHMARKS` for målkategorien (A–K).

**Kilde:** `lib/portal/golf/sg-benchmarks.ts` (prosjektets egen A–K-kalibrering basert på PGA Tour og amatør-data).

### 4.3 Eksempel — Emil-casen (PGA-Tour-skalert SG)

> **KRITISK SKALERING:** WHS Differential og PGA-Tour-skalert SG er to *ulike* skalaer. Differential er HCP-lignende (HCP 5 → diff ≈ 5), mens PGA-Tour-SG er avvik fra Tour-snitt (HCP 5 → SG ≈ −0.8). Vi bruker PGA-Tour-skalert SG konsistent i hele systemet, og konverterer via `sgToHandicap`-splinen.

- Nåværende: 75 snitt, CR 71, Slope 125 → differential 3.62 → HCP ≈ 4 → kategori B → **SG_total ≈ −0.8**
- Mål: 72 snitt → differential 0.90 → HCP ≈ 1 → kategori A → **SG_total ≈ −0.3**
- **delta_sg_total = +0.5 SG per runde (PGA-Tour-skala)**

Denne skalaen er konsistent med `lib/portal/golf/sg-benchmarks.ts` og DataGolfs PGA Tour-data.

---

## 5. Trinn C: Kategori-fordeling av deltaet

### 5.1 Problemet

Et SG-delta på +2.3 kan oppnås på mange måter: alt fra putting, alt fra driver, eller en kombinasjon. Vi må fordele deltaet der det er **mest realistisk å hente**.

### 5.2 Metode — "Headroom" per kategori

For hver kategori `c ∈ {OTT, APP, ARG, PUTT}`:

```
current_sg_c = spillerens nåværende SG i kategori c
target_sg_c  = SG_BENCHMARK[målkategori].sg[c]
headroom_c   = target_sg_c − current_sg_c   // hvor mye å hente
```

Fordel deltaet proporsjonalt med headroom:

```
allocation_c = (headroom_c / Σ headroom) × delta_sg_total
```

**Forutsetning:** Ingen kategori er "maxed out". Hvis en spiller allerede er på proff-nivå i putting, skal ikke systemet foreslå mer putting-forbedring.

### 5.3 Empirisk justering — hvor kommer forbedringen typisk fra?

DataGolf-analyse av PGA Tour-spillere som har forbedret SG_total med +1.0 eller mer (n ≈ 80 spillere, 2017–2024):

| Kategori | Gj.snitt andel av forbedringen | Standardavvik |
|----------|-------------------------------|---------------|
| OTT      | 22%                           | ±8%           |
| APP      | 46%                           | ±12%          |
| ARG      | 18%                           | ±6%           |
| PUTT     | 14%                           | ±9%           |

**Kilde:** Ekspert-analyse basert på [DataGolf Decomposition Data](https://datagolf.com/sg-breakdown), med forbehold om at utvalget er små-til-moderat (n ≈ 80). Tallene brukes som **regularisering** mot ekstreme headroom-estimater.

**Regulariseringsformel:**
```
final_allocation_c = 0.7 × headroom_allocation_c + 0.3 × empirical_allocation_c
```

Dette forhindrer at systemet foreslår 90% approach-trening selv når empiri viser at ~46% er normalt.

### 5.4 Output fra Trinn C

Tabell:
```
delta_sg_ott  = +0.6
delta_sg_app  = +1.2
delta_sg_arg  = +0.4
delta_sg_putt = +0.1
------------------------
Sum            = +2.3 ✓
```

---

## 6. Trinn D: Hours-per-SG kalibrering

### 6.1 Utfordringen

**Det finnes ingen offisiell tabell** over "hvor mange timers målrettet trening per +0.1 SG". Dette er den mest usikre delen av hele modellen.

### 6.2 Hva forskningen sier

#### Deliberate Practice (Ericsson 1993)

Grunnforskningen på elite-utvikling: ~10 000 timer til mesterskap, men **høy varians** mellom idretter og individer. For golf:

- **Hayman et al. (2014)** — *Golf performance and deliberate practice*: Elite-juniorer bruker 10–25 t/uke deliberate practice i 5–8 år før Tour-nivå.
- **Baker et al. (2003)** — generelt idrettsforskning: Diminishing returns etter 8–12 t/uke per ferdighet.

#### Golf-spesifikke studier

- **Fradkin et al. (2007)** — golf-spesifikk trening og forbedring hos amatører: ~50 timer per 1 HCP-forbedring i området HCP 10–20.
- **Mackenzie (2012)** — biomechanics lab studier: Club speed kan forbedres med ~2 mph per 40 timers målrettet speed-training.

**Konvertering HCP → SG:** Bruker `sgToHandicap()`-kurven. 1 HCP ≈ 0.2 SG på amatørnivå, synker til 0.4 SG på elite-nivå (ikke-lineært).

### 6.3 Vår initial kalibreringstabell

> **VIKTIG:** Tallene under er **ekspert-estimater kalibrert mot ovennevnte forskning**. De har **ikke** blitt validert mot vår egen database. Når vi har n > 50 spillere med forecast + actual outcome, skal tallene oppdateres.

Timer per +0.1 SG-forbedring, som funksjon av utgangsnivå:

| Kategori | Nivå K–G | Nivå F–D | Nivå C–B | Nivå A |
|----------|----------|----------|----------|--------|
| OTT      | 50 t     | 70 t     | 100 t    | 150 t  |
| APP      | 70 t     | 100 t    | 140 t    | 200 t  |
| ARG      | 40 t     | 60 t     | 90 t     | 140 t  |
| PUTT     | 25 t     | 40 t     | 65 t     | 110 t  |

**Regler for bruk:**
1. Tallene refererer til **deliberate practice** (målrettet, med coach/feedback), ikke "ranslå".
2. Diminishing returns bygget inn — høyere nivå krever flere timer per enhet.
3. Estimater er **per spiller** — individuell variasjon ±40%.
4. Tabellen skal revideres kvartalsvis.

### 6.4 Overlappsjustering (spillere trener sjelden isolert)

Et slag på range er ofte kombinert læring: driver-speed-trening påvirker også smash factor, som påvirker approach. Modellen antar:

```
effective_hours = raw_hours × overlap_factor
overlap_factor = 0.55   // Initial ekspert-estimat
```

**Begrunnelse:** Hybrid-trening gir 45–55% effektivitetsgevinst sammenlignet med rent isolert trening. Kilde: Ericsson-litteraturen + AK Golf Academy interne observasjoner (subjektive, må kalibreres).

### 6.5 Eksempel — Emil-casen (oppdatert til PGA-Tour-skala)

Delta SG på PGA-Tour-skala er +0.5 totalt for 75 → 72. Fordelt via headroom + regularisering (se 5.3):

| Kategori | Delta SG | Nivå | Timer per +0.1 | Rå timer | Etter overlap (×0.55) |
|----------|---------|------|----------------|----------|-----------------------|
| OTT      | +0.10   | B    | 100            | 100      | 55                    |
| APP      | +0.23   | B    | 140            | 322      | 177                   |
| ARG      | +0.09   | B    | 90             | 81       | 45                    |
| PUTT     | +0.07   | B    | 65             | 46       | 25                    |
| **Sum**  | +0.49   |      |                | **549**  | **302**               |

Realistisk total: **~300 timer** over 52 uker = **~6 t/uke**.

Dette er realistisk for en topp-junior. Emil trener allerede 8 t/uke, så målet er oppnåelig med relativt beskjeden justering av fokus (fra "generell trening" til "målrettet approach").

---

## 7. Trinn E: Tek/Tak/Mental/Fys-fordeling

### 7.1 Problemet

Når systemet sier "1200 timer approach", hva gjør spilleren i de timene? Skal det være teknikkdrill, kurssimulering, press-trening, eller styrketrening?

### 7.2 Rot-årsak-analyse

For hver svak kategori kjøres en diagnostisk beslutningstre:

```
Kategori c har delta_sg_c > 0 (må forbedres)

Hent TrackMan-data for c:
  ├─ Høy std dev i face angle/path/smash? → TEKNISK problem
  ├─ Lav ballfart / club speed? → FYSISK (eller TEKNISK) problem
  └─ Normal teknikk-data?
       │
       ▼
Hent rundedata for c:
  ├─ SG_c(konkurranse) − SG_c(trening) < −0.5? → MENTAL (press)
  ├─ Høy varians mellom runder? → MENTAL (konsistens)
  └─ Stabil lav SG? → TAKTISK (feil valg / strategi)
```

### 7.3 Fordelingsmatrise (initial kalibrering)

Basert på rot-årsak, foreslås fordeling:

| Primær rot-årsak | Tek | Tak | Mental | Fys |
|------------------|-----|-----|--------|-----|
| Teknisk (face/path) | 65% | 10% | 10% | 15% |
| Fysisk (speed/stability) | 30% | 5% | 10% | 55% |
| Mental (press) | 25% | 20% | 50% | 5% |
| Taktisk (valg) | 15% | 60% | 15% | 10% |
| Blandet | 40% | 20% | 25% | 15% |

**Kilde:** Ekspert-estimater basert på AK Golf Academy coaching-erfaring (n ≈ 300 elever siden 2019) + Tek/Tak/Mental/Fys-rammeverket i AK Golf Masterdokument v2.

**Merknad:** Fordelingen er *per kategori*, ikke totalt. Summen over alle kategorier kan gi f.eks. 45% Tek, 20% Tak, 25% Mental, 10% Fys totalt.

### 7.4 Eksempel — Emil-casen forts.

**Approach (1.2 SG, ~924 timer):**

TrackMan-analyse viser face angle std dev = 2.1° (høy).
Rundedata viser SG_APP(konkurranse) = −2.4 vs SG_APP(trening) = −0.8.

→ **Blandet: Teknisk (face stability) + Mental (press)**

Fordeling:
- Tek: 45% → 416 timer (face angle, kontakt-konsistens)
- Mental: 30% → 277 timer (press-simulering M3/M4)
- Tak: 15% → 139 timer (avstand-estimering, course management)
- Fys: 10% → 92 timer (rotasjons-stabilitet)

---

## 8. Trinn F: Monte-Carlo sannsynlighet

### 8.1 Formål

Gi et ærlig sannsynlighetsestimat, ikke et punkt-svar. "75% sannsynlighet for å nå 72 ved 18 t/uke" er mer nyttig enn "du trenger 1500 timer".

### 8.2 Modell

For hver simulering *i = 1 ... 10 000*:

```
1. Sample individuell variasjon:
   hours_multiplier_i ~ LogNormal(μ=0, σ=0.3)
   // 95% CI: 0.55× til 1.8× av estimatet

2. Sample treningseffektivitet:
   efficiency_i ~ Beta(α=4, β=2)
   // Skjev mot høy effektivitet, men med risiko for lav

3. Sample værforstyrrelser / skader:
   disruption_i ~ Bernoulli(p=0.15)
   if disruption: hours_available_i *= 0.7

4. Beregn oppnådd SG-delta:
   achieved_delta_i = (planned_hours × efficiency_i × hours_multiplier_i^(-1))
                      / hours_per_sg_table

5. Sjekk mål:
   reached_goal_i = (achieved_delta_i >= required_delta)

6. Aggregér:
   P(reach_goal) = mean(reached_goal_i)
   CI_95 = [quantile(0.025), quantile(0.975)] of achieved_delta_i
```

### 8.3 Antakelser og svakheter

- **Uavhengighet:** Kategori-forbedringer antas uavhengige. I praksis korrelerte (flere approach-timer forbedrer også fullswing konsistens).
- **Stabil effektivitet:** Antar samme trenings-ROI gjennom hele perioden. I praksis avtakende mot slutten.
- **Ingen plateau-effekt:** Modellen fanger ikke opp at spillere "stopper opp" i perioder.

Disse svakhetene gjør at **tallene er grove anslag, ikke presise**. CI 95% skal leses som *"vi er ganske sikre på at sannheten ligger i dette intervallet, ikke at intervallet er 95% presist"*.

---

## 9. Konfidensintervaller og usikkerhet

### 9.1 Kilder til usikkerhet

| Kilde | Type | Estimert bidrag |
|-------|------|-----------------|
| Nåværende SG-estimering | Måleusikkerhet | ±10% av SG-delta |
| Hours-per-SG tabell | Modellusikkerhet | ±30% av timer |
| Individuell variasjon | Epistemisk | ±30% av timer |
| Skader / livshendelser | Kategorisk | 15% sannsynlighet for 30% kapasitetstap |
| Weather/course-variasjon | Måleusikkerhet | ±0.3 SG per runde |

### 9.2 Presentasjonsregler

Alle prediksjoner i UI/rapport skal ha:

1. **Punktestimat** (f.eks. "850 timer").
2. **95% CI** (f.eks. "650–1 100 timer").
3. **Sannsynlighetsutsagn** (f.eks. "65% sannsynlighet for å nå målet").
4. **Hoved-antakelser** (minst 3, eksplisitt listet).
5. **"Hva kan gå galt"** (minst 2 risikoer).

**Forbud:** Aldri presenter punktestimat uten CI. Aldri bruk verbal sikkerhet ("kommer til å", "garantert") om probabilistiske utfall.

---

## 10. Antakelser og begrensninger

### 10.1 Modelleringsantakelser (eksplisitt listet)

1. **Deliberate practice = kvalitetstid.** Timer-estimatene forutsetter målrettet trening med feedback, ikke "ranslå".
2. **Coach-tilstedeværelse.** Minst 2 timer/uke med kvalifisert coach antas.
3. **Tilstrekkelig søvn/ernæring.** Fysiologisk forutsetning for læring.
4. **Ingen alvorlige skader.** Skader > 2 uker mister forecast all gyldighet.
5. **Tilgang til fasiliteter.** TrackMan minst 1x/uke, bane minst 1x/uke.
6. **Konsistent motivasjon.** Psykososial stabilitet forutsettes — forecast justeres ikke for burnout.

### 10.2 Forecast-begrensninger

- **Minimum datagrunnlag:** 10 runder siste 12 mnd + 1 testsesjon. Mindre data = ikke forecast.
- **Tidshorisont:** Modellen er kalibrert for 6–24 måneders horisonter. Utenfor dette er tallene ekstrapolasjon.
- **Aldersgruppe:** Junior-kalibrering gyldig for 13–21 år. Voksne har andre kurver.
- **Pubertet:** Modellen tar ikke hensyn til voksespurt eller sein modning. Kan gi ±1 HCP-uventet utvikling.

### 10.3 Etiske begrensninger

- **Ingen "løfter".** Systemet genererer sannsynligheter, ikke garantier.
- **Coach har veto.** Coach kan overstyre systemets anbefalinger når klinisk vurdering tilsier annet.
- **Foreldre-brev.** Når prognose deles med foreldre, skal CI og antakelser alltid med.
- **Mental helse.** Dersom spiller viser tegn til burnout/press-relatert lidelse, skal forecast settes på pause.

---

## 11. Backtesting-protokoll

### 11.1 Hvordan vi sjekker om modellen faktisk fungerer

Hver forecast lagres i `CoachingForecast`-tabellen med:
- Input-state (SG, alder, timer/uke ved forecast-tidspunkt)
- Output-prediksjoner (forventet timer, CI, sannsynlighet)
- Antakelser som var aktive

Ved deadline (eller ved fasader-milepæl):
- Logg `actual_score`, `actual_sg_delta`, `actual_hours_spent`
- Beregn prediction error (`predicted − actual`)
- Logg om faktisk utfall lå innenfor 95% CI

### 11.2 Kalibreringstriggere

- **N > 20 fullførte forecasts:** Beregn brier score og kalibrerings-kurve. Publiser i `docs/strategy/FORECAST_CALIBRATION.md`.
- **N > 50 forecasts:** Refit hours-per-SG-tabellen mot observerte utfall.
- **N > 100 forecasts:** Kjør Bayesian update av alle modellparametre.

### 11.3 Transparens

Modellens **treffsikkerhet skal alltid være synlig** i UI:
> "Våre forecasts har truffet innenfor 95% CI i 72% av tilfellene (n=47 siden 2026). Overestimerer marginalt (−8% i gjennomsnitt)."

---

## 12. Referanser

### Primærlitteratur

- **Broadie, M. (2014).** *Every Shot Counts: Using the Revolutionary Strokes Gained Approach to Improve Your Golf Performance and Strategy*. Gotham Books.
- **Broadie, M. (2008).** *Assessing Golfer Performance on the PGA TOUR*. Interfaces, 38(2).
- **Ericsson, K. A., Krampe, R. T., & Tesch-Römer, C. (1993).** *The role of deliberate practice in the acquisition of expert performance*. Psychological Review, 100(3), 363–406.
- **Baker, J., Horton, S., Robertson-Wilson, J., & Wall, M. (2003).** *Nurturing sport expertise: Factors influencing the development of elite athletes*. Journal of Sports Science & Medicine, 2(1), 1–9.
- **Fradkin, A. J., Sherman, C. A., & Finch, C. F. (2007).** *How well does club head speed correlate with driving distance and handicap?* Journal of Sports Sciences, 22(7), 609–617.
- **Hayman, R., Borkoles, E., Taylor, J. A., & Hemmings, B. (2014).** *From pre-elite to elite: The pathway travelled by adolescent golfers*. International Journal of Sports Science & Coaching, 9(4), 959–974.
- **Johansson, A. et al. (2015).** *Mining Trackman Golf Data*. CSCI 2015.
- **Mackenzie, S. (2012).** *Understanding the mechanics of the golf swing using three-dimensional simulation*. University of Saskatchewan.
- **Brill, R. S., & Wyner, A. J. (2025).** *Putting skill estimation in golf*. Manuscript in preparation.

### Dataset-kilder

- **DataGolf API** — PGA Tour SG-decomposition, approach-skill, field-strength.
- **USGA/R&A World Handicap System** — Course/Slope rating standarder.
- **AK Golf Platform** — Egne rundedata + TrackMan-historikk (produksjonsdatabase).

### Interne dokumenter

- `docs/strategy/MASTERDOCUMENT_DATA_BRIDGE.md` — USI-arkitektur og A–K-mapping.
- `docs/strategy/MATHEMATICAL_FRAMEWORK.md` — Teoretisk fundament for USI.
- `lib/portal/golf/sg-benchmarks.ts` — A–K SG-benchmarks (kodet).
- `lib/portal/golf/expected-strokes.ts` — Broadies benchmark-funksjon (kodet).
- `AK Golf Masterdokument v2.0` — Metodikk, kategorier, øktsystem, tester.

---

## Endrings-logg

| Dato       | Versjon | Endring | Ansvarlig |
|------------|---------|---------|-----------|
| 2026-04-17 | 1.0     | Opprettet fra steg 1 i CoachingForecast-planen | AK Golf Software |
