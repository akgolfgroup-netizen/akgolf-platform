# Trening: rask flow + session card

**Dato:** 2026-04-27
**Status:** Designet, klar for implementerings-plan
**Brand:** Brand Guide V2.0 (Notion/Apple lyst og luftig)

---

## Context

Dagens flyt for å opprette en treningsøkt har to friksjons-punkter spillere har klaget på:
1. **For mange felter i økt-modalen** — tittel + tidspunkt + varighet + reps + type + område + fasilitet + notater er overveldende for en hverdagslig økt
2. **Drag-drop én øvelse om gangen** — å fylle en økt med 4-5 øvelser tar lang tid

I tillegg mangler en kjerne-opplevelse: **session card / live workout-modus** — når spilleren faktisk skal trene, åpne økten på telefon, starte timer, følge øvelsene én etter én og logge når ferdig.

Mål: gjøre det 5x kjappere å opprette en økt og gi en tydelig "i bruk"-flyt for selve treningen.

---

## Designmål

- Tre måter å opprette økt på koeksisterer (A/B/C). Bruker velger sin standard.
- Alle flyter fungerer på desktop og mobil
- Holder seg innenfor Brand Guide V2.0 (lyse kort, lime-aksent, Inter Tight)
- "Visuell impact" via subtile animasjoner (lime-glow ved lagring, ease-in transitions)
- Ingen AI-features — venter på skills/agenter

---

## Brukervalg / settings

Ny side eller seksjon i `/portal/profil/innstillinger`:

**Standard ny økt-flow:**
- Quick-Add (default)
- Klassisk modal
- Pakker

Lagres som `User.defaultSessionFlow` (Prisma-enum).

«Ny økt»-CTA-knappen åpner valgt modus. De andre er alltid tilgjengelige via egne triggere — ingen modus skjules.

---

## Komponent A — Quick-Add Bar (kjapp tekstinput)

**Plassering:** Sticky bar mellom topplinje og hovedgrid på `/portal/treningsplan`. Kan minimeres til kun ikon.

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  [⚡] [Skriv: Tee 60min torsdag 14...]      [↵ Send]│
│  ⚪ Fysisk  ⚪ Teknikk  ● Slag  ⚪ Spill  ⚪ Turn  ✕  │
└──────────────────────────────────────────────────────┘
```

**Naturlig språk-parser:**
- "Tee 60min tor 14" → `{ title: "Tee", duration: 60, day: 4, hour: 14 }`
- "Putting 30" → `{ title: "Putting", duration: 30, day: today, hour: nextSlot }`
- "Range 14:30 mandag" → `{ title: "Range", hour: 14, min: 30, day: 1 }`
- Ikke-parsbar tekst beholdes som tittel; alle andre felter får defaults

**Pyramide-pills:** Klikk én = sett type. Default = forrige valgte.

**Send:** Enter eller knapp → økten lagres + lime-glow i 600ms i kalenderen + bar-input nullstilles.

**Mobil:** full bredde, pills under input, sticky over kalenderen.

---

## Komponent B — Pakker (ferdig-bygde øktmaler)

**Plassering:** Ny fane i sidebar (5. fane): «Pakker», ved siden av Øvelser/Maler/Historikk/LIFE.

**Datamodell:**
- `SessionPackage`-modell (ny):
  - `id: String @id`
  - `ownerId: String?` (null = system, brukerId = personlig, instructorId = coachens)
  - `targetUserId: String?` (kun satt for coach-pakker tilegnet en spesifikk elev)
  - `name: String`
  - `iconName: String?`
  - `defaultDurationMinutes: Int`
  - `focusArea: String` (Pyramide-kode)
  - `area: String?` (Treningsområde-kode)
  - `exercisesJson: Json` (liste av `SessionExercise[]` uten id-er, klones ved bruk)
  - `createdAt: DateTime`

**Pakke-omfang per spiller:**
- Globale system-pakker (Range 60, Putting 30, Hjemmetrening 20)
- Egne pakker spilleren har lagret
- Pakker coachen har sendt spesifikt til dem (`targetUserId = me`)

**Pakke-kort:**
```
┌──────────────────────┐
│ 🎯  Range 60         │
│ 60 min · 4 øvelser   │
│ [Slag-badge]         │
└──────────────────────┘
```

**Drop-flyt:**
1. Drag pakke-kort → cellen i kalenderen
2. Server action `applyPackageToCell(packageId, weekId, dayOfWeek, startH, startM)` oppretter:
   - `TrainingPlanSession` med pakkens metadata
   - Alle øvelser fra `exercisesJson` med nye nanoid-er
3. Lime-glow + kaskade-animasjon: pakke-kort folder seg ut til økt-blokk

**«Lag pakke fra denne»:**
- Knapp i `EditSessionModal` (bare hvis økten har øvelser)
- Modal: navn + ikon → `createPackageFromSession(sessionId)`-action lagrer pakke som `ownerId = userId`

**Mobil:**
- Trykk på pakke → mini-velger sheet (dag + tid) → bekreft → økt opprettet

**Coach (admin):**
- Samme pakke-fane i `/admin/treningsplan`
- «Tildel pakke til alle elever»-knapp på pakke-kort (allerede eksisterer på maler)
- «Tildel til [elev]»-modal når man jobber med spesifikk elev

---

## Komponent C — Multi-select øvelser + batch-config

**Plassering:** Toggle-knapp i Øvelser-fanen («Velg flere»).

**Aktivt modus:**
- Hvert øvelseskort får checkbox + drag-handle skjules
- Klikk hvor som helst på kortet = toggle valg
- Floating bottom-bar:
  ```
  ┌─────────────────────────────────────┐
  │  3 øvelser valgt    [Velg økt ▾] │
  └─────────────────────────────────────┘
  ```

**Bekreft:**
- Velg økt fra dropdown (ukens økter, eller «opprett ny»)
- Modal med liste:
  ```
  Drive — [_15_]m  med ball [_50_]  uten [_0_]
  Jern 7 — [_15_]m  med ball [_30_]  uten [_0_]
  Wedge — [_10_]m  med ball [_20_]  uten [_0_]
  ```
- Hver rad: tid + reps med ball + reps uten ball
- Defaults: øvelsens `minDurationMinutes` + 0 reps
- «Bruk samme for alle» (kopierer første rad nedover)
- Bekreft → batch-action `addExercisesToSession(sessionId, exercises[])`

**Mobil:** samme — touch-target er hele kortet, modal har scroll.

---

## Komponent D — Session Card / Live Workout-modus

**Trigger:** Klikk på en planlagt økt (i kalenderen, dashboard eller dagens økt-kort) som er i dag eller fremtidig → «Start økt»-CTA → full-screen workout-modus.

**Plattform:** Mobile-first, men fungerer på desktop også.

**Layout (full-screen sheet):**
```
┌─────────────────────────────────┐
│  ✕                  Tee 60min   │ ← Header (lukk + tittel)
├─────────────────────────────────┤
│                                 │
│      ┌───────────────┐          │
│      │     09:42     │          │ ← Stor countdown
│      │     ── ●      │          │   (mm:ss, pulse-ring)
│      └───────────────┘          │
│                                 │
│   Drive — 50 slag               │ ← Stor aktiv-øvelse
│   Reps med ball: 24/50          │
│                                 │
│   [────────────────░░░░] 60%    │ ← Progress bar
│                                 │
│   ┌──────────────────────┐      │
│   │     ▸ Start         │      │ ← Stor primær-CTA
│   └──────────────────────┘      │
│   [Pause]    [Hopp over]   [✓] │ ← Sekundær-knapper
│                                 │
├─────────────────────────────────┤
│  Resten av økten:               │
│  ✓ Range warm-up      08:34     │
│  ▶ Drive (aktiv)                │
│  ○ Jern 7              15 min   │
│  ○ Wedge               10 min   │
└─────────────────────────────────┘
```

**Funksjonalitet:**
- **Timer:** Per-øvelse countdown fra planlagt varighet. Pip + vibrasjon når den treffer 0. Fortsetter forbi 0 (overtid) i rødt.
- **Start:** Trigger countdown og marker øvelse som «pågår»
- **Pause:** Stopp timer, kan fortsette
- **Hopp over:** Marker som «skipped» med valgfri grunn
- **Ferdig (✓):** Marker som complete + auto-bytt til neste øvelse + reset timer
- **Reps-counter:** Tap på «Reps med ball» → +1 (lett mobil-bruk uten å skrive)
- **Tap på øvelse i listen:** Bytt til den som aktiv (uten å miste fremdrift på andre)
- **Bakgrunn:** Timer kjører selv om appen er minimert (Service Worker / Background Sync)

**Avslutning (alle øvelser ferdig eller hoppet over):**
1. Lime-glow + animert "Ferdig!"-skjerm
2. Modal: rate-økten
   ```
   Hvordan føltes økten?
   ⭐⭐⭐⭐⭐  (1–5)
   [Notater (valgfri)]
   [Avbryt]  [Lagre]
   ```
3. «Lagre» → opprett `TrainingLog` + `TrainingLogExercise`-rader med faktisk tid + reps
4. Tilbake til kalenderen — økten markeres som «✓ ferdig» med grønn badge

**State-håndtering:**
- Aktiv økt lagres i `localStorage` mens den pågår (i tilfelle browser-krasj)
- Ved gjenåpning: «Fortsett økt fra 09:42?» → ja/nei
- Når lagret → fjern fra localStorage

**Database-endringer:**
- `TrainingLog`-modellen finnes allerede med `durationMinutes`, `rating`, `notes`, `exercises`-Json
- Ingen nye felter — bare wire opp lagring fra session card

---

## Visuell stil

Alt holder seg i Brand Guide V2.0:

| Element | Stil |
|---|---|
| Quick-Add Bar bg | Hvit kort, soft drop-shadow, blur ved scroll |
| Pakke-kort | Lyse kort med ikon-bakgrunn i lime soft (#ECFCC0) |
| Multi-select bar | Hvit floating + lime-aksent på primær-CTA |
| Session card timer | Stor Inter Tight 72pt, pulse-ring i primary green |
| Progress bar | Lime-fill på off-white spor |
| Lime-glow | 600ms ease-out på opprettelse + ferdig-økter |
| Animasjoner | 200–300ms ease, ingen fancy fysikk |
| Mobil sheet | Pull-to-dismiss, native-feel |

---

## Implementerings-faser

Stor feature — bør deles opp.

**Fase 1 — Quick-Add Bar (lavest risiko, høyest verdi):**
- Bar-komponent med naturlig språk-parser
- Pyramide-pills med default-fra-forrige
- Wire mot eksisterende `createSessionForWeek()`
- Lime-glow på lagring

**Fase 2 — Session Card / Live Workout:**
- Schema: ingen endringer
- Ny rute `/portal/treningsplan/[sessionId]/start`
- Full-screen sheet komponent
- Timer + Service Worker for bakgrunn
- localStorage state-resume
- Rate-modal + lagring til TrainingLog

**Fase 3 — Pakker:**
- Schema: ny `SessionPackage`-modell + Prisma migrate
- Pakker-fane i sidebar
- Drop-handler i WeekGrid
- «Lag pakke fra denne» i EditSessionModal
- 10 system-pakker som seed (`prisma/seed-session-packages.ts`)

**Fase 4 — Multi-select:**
- Toggle-modus i ExercisesPlaceholder
- Floating bottom-bar
- Batch-modal med per-øvelse-config
- Server-action `addExercisesToSession()` (batch)

**Fase 5 — User-preferanse + integrasjon:**
- Schema: `User.defaultSessionFlow`-enum
- Settings-side
- «Ny økt»-CTA dispatcher til valgt modus
- Test alle tre flyter på mobil + desktop

---

## Database-endringer (oppsummert)

**Nye modeller:**
- `SessionPackage` (id, ownerId?, targetUserId?, name, iconName?, defaultDurationMinutes, focusArea, area?, exercisesJson, createdAt)

**Endrede modeller:**
- `User.defaultSessionFlow` (enum: QUICK_ADD | MODAL | PACKAGES, default QUICK_ADD)

**Migrasjoner:**
- `20260427_add_session_package` (ny tabell)
- `20260427_add_user_default_session_flow` (legg til kolonne på User)

---

## Eksisterende funksjoner som gjenbrukes

- `createSessionForWeek()` — Quick-Add og Pakker bruker den
- `addExerciseToSession()` — kan kalles i batch via Promise.all
- `TrainingLog` + `TrainingLogExercise` — Session Card lagrer hit
- `SessionExercise`-typen — Pakker bruker samme JSON-struktur
- `sendBookingConfirmationSms`-mønster — kan brukes for «Glem ikke økten din»-SMS

---

## Verifikasjon

End-to-end test for hver fase:

**Fase 1 (Quick-Add):**
- Åpne /portal/treningsplan
- Skriv «Tee 60 tor 14» i bar → enter
- Verifiser: ny økt på torsdag kl 14:00 i kalenderen, lime-glow trigger

**Fase 2 (Session Card):**
- Klikk på dagens økt
- Trykk «Start økt» → full-screen åpnes
- Trykk Start → countdown begynner
- Trykk Ferdig → bytter til neste øvelse
- Fullfør alle → rate-modal → lagre → verifiser TrainingLog opprettet

**Fase 3 (Pakker):**
- Bytt til Pakker-fane
- Drag «Range 60»-pakke til en celle
- Verifiser: ny økt med 4 øvelser opprettet
- Åpne EditSessionModal → «Lag pakke fra denne» → ny pakke synlig i fanen

**Fase 4 (Multi-select):**
- Aktiver «Velg flere» i Øvelser-fanen
- Huk av 3 øvelser
- Velg økt fra dropdown → bekreft
- Verifiser: alle 3 lagt til økten

**Fase 5 (Settings):**
- Profil/innstillinger → bytt til «Pakker» som default
- Klikk «Ny økt»-CTA → Pakker-fanen åpnes (ikke quick-add)

---

## Hva som IKKE er i scope

- AI-foreslåtte øvelser (venter på AI-pipeline)
- Sosiale features (dele økt, gruppefilter)
- Mobile push-notifikasjoner ved start (Twilio + SMS finnes, ikke nødvendig nå)
- Apple Watch / Wear OS-integrasjon
- Coach-side full-screen workout-modus (kun spiller)
