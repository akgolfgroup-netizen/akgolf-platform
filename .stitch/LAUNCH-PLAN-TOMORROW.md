# 🚀 LANSEERING I MORGEN KL. 15:00

**MÅL:** Funksjonell landingside + booking til lansering
**STRATEGI:** Slå sammen skjermer, bruke seksjoner i stedet for egne sider
**ESTIMERT:** 8-10 skjermer totalt (ikke 81!)

---

## 📦 SLÅ SAMMEN: Fra 81 til 8 skjermer

### 🔴 KJERNESKJERMER (Må genereres i kveld)

| # | Skjerm | Inneholder | Status |
|---|--------|------------|--------|
| **1** | **Forside** | Hero + Academy + Junior + B2B (seksjoner) | 🔄 Generere |
| **2** | **Booking Kategori** | Alle tjenester i tabs/grid | 🔄 Generere |
| **3** | **Booking Tid** | Kalender + tidsvelger + skjemadetaljer | 🔄 Generere |
| **4** | **Booking Betaling** | Oppsummering + betaling | 🔄 Generere |
| **5** | **Bekreftelse** | Kvittering + neste steg | 🔄 Generere |
| **6** | **Personvern** | Legal tekst (enkel) | 🔄 Generere |

### 🟡 PORTAL (Kan vente til etter lansering)

| # | Skjerm | Inneholder | Status |
|---|--------|------------|--------|
| **7** | **Login** | Enkel auth | 🔄 Generere |
| **8** | **Min Side (mobil)** | Dashboard + treningsplan + statistikk (tabs) | ⏸️ Etter lansering |

---

## 🔧 SLÅ SAMMEN: Hvordan?

### I stedet for 4 landingsider → 1 lang side

**FORSIDE med seksjoner:**
```
┌─────────────────────────────────────┐
│ HERO: "Book coaching" CTA           │
├─────────────────────────────────────┤
│ SEKSJON 1: Academy (voksen)         │
│ - Priser, pakker, CTA               │
├─────────────────────────────────────┤
│ SEKSJON 2: Junior Academy           │
│ - Aldersgrupper, trygghet, CTA      │
├─────────────────────────────────────┤
│ SEKSJON 3: B2B / Utvikling          │
│ - Bedrifter, teambuilding, CTA      │
├─────────────────────────────────────┤
│ SEKSJON 4: Om / Trust               │
│ - Testimonials, kontakt             │
├─────────────────────────────────────┤
│ FOOTER                              │
└─────────────────────────────────────┘
```

**Fordeler:**
- Én skjerm i stedet for 4
- Scroll-flyt (bruker elsker det)
- Enklere å generere
- Bedre for SEO

---

### I stedet for 7 booking-skjermer → 3-4

**BOOKING FLOW (sammenslått):**

**Skjerm 1: Kategori**
- Grid med tjenester
- Klikk = velg + gå videre

**Skjerm 2: Tid + Detaljer** (SLÅTT SAMMEN)
```
┌──────────────────────────────────────┐
│ [KALENDER]  │  Velg tid:            │
│             │  ○ 10:00  ○ 11:00     │
│ [Mai 2026]  │  ○ 12:00  ○ 13:00     │
│             │                       │
│ [Datoer]    │  Dine detaljer:       │
│             │  Navn: [________]     │
│             │  Tlf:  [________]     │
│             │                       │
│             │  [Gå til betaling]    │
└──────────────────────────────────────┘
```

**Skjerm 3: Betaling + Bekreftelse** (SLÅTT SAMMEN)
- Betalingsinfo på toppen
- Etter betaling: bekreftelse vises i samme skjerm

---

## ⚡ HASTIG PLAN (Timeline)

### I KVELD (4-6 timer)
**Time 1-2:** Generere 3 skjermer
- Forside (lang med seksjoner)
- Booking Kategori
- Booking Tid+Detaljer

**Time 3-4:** Generere 2 skjermer
- Booking Betaling+Bekreftelse
- Personvern

**Time 5-6:** Review + justering
- Se over i Stitch
- Notere endringer

### I MORGEN (før 15:00)
**Time 1-2:** Eksportere HTML-kode
**Time 3-4:** Implementere i kodebase (deg/utvikler)
**Time 5:** Testing + justering
**Kl. 15:00:** Lansering 🎉

---

## 🎯 HVA VI SLØYFER (men kan legge til senere)

| Sløyfet | Hvorfor | Kommer senere? |
|---------|---------|----------------|
| Portal / Min Side | Ikke kritisk for lansering | ✅ Ja, uke 2 |
| Admin Dashboard | Internt verktøy | ✅ Ja, uke 2 |
| AI Coach | Nice-to-have | ✅ Ja, måned 2 |
| Trackman | Integrasjon | ✅ Ja, måned 2 |
| Sosialt / Venner | Ikke kritisk | ✅ Ja, måned 3 |
| Alle undersider (FAQ, Om oss) | På forsiden | ✅ Ja, etterhvert |

---

## ✅ START NÅ: 3 første skjermer

### Skjerm 1: Forside (1 lang side med seksjoner)
```
Prompt: "Create a long-scrolling landing page for AK Golf Academy 
with 4 sections: Hero, Adult Academy, Junior Academy, B2B Corporate.
Each section has its own headline, features, pricing, and CTA.
Mobile-first design."
```

### Skjerm 2: Booking Kategori (velg tjeneste)
```
Prompt: "Create a service selection page with 4 cards: 
Coaching Session, Trackman Analysis, Club Fitting, Simulator.
Each card shows icon, title, description, from-price.
Click selects and proceeds."
```

### Skjerm 3: Booking Tid + Detaljer (sammenslått)
```
Prompt: "Create a booking form with calendar widget (left), 
time slots (center), and user details form (right).
All in one view, no steps."
```

---

## ❓ BESLUTNING NÅ:

**Skal jeg starte generering av disse 3 skjermene?**

1. **Forside** (lang med seksjoner)
2. **Booking Kategori** 
3. **Booking Tid+Detaljer** (sammenslått)

**Ja / Nei / Juster først?**

---

**Notat:** Etter disse 3 kan vi vurdere om vi trenger mer, eller om vi skal fokusere på å få dem perfekte før lansering.
