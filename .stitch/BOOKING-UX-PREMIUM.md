# 🎯 Premium Booking Opplevelse

**Mål:** Ekstremt profesjonell, enkel og rask
**Strategi:** "Inline wizard" - brukeren ser fremgang, men mister aldri kontekst

---

## 🎨 Design-prinsipper for premium booking

### 1. **Én side, flere steg** (ikke side-veksling)
```
┌─────────────────────────────────────────────┐
│ Progress: ●───●───○───○                    │  ← Alltid synlig
├─────────────────────────────────────────────┤
│                                             │
│  [STEG 2: Velg tid]                        │  ← Tydelig tittel
│                                             │
│  ┌──────────┬──────────────────────────┐   │
│  │ KALENDER │   Torsdag 8. mai         │   │
│  │          │   ┌────┐ ┌────┐ ┌────┐   │   │
│  │ Mai 2026 │   │10:00│ │11:00│ │12:00│   │   │
│  │          │   └────┘ └────┘ └────┘   │   │
│  │ [Datoer] │                            │   │
│  └──────────┴──────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Coaching Session - 60 minutter       │  │  ← Oppsummering
│  │ Kr 1.250,-                           │  │     alltid synlig
│  └──────────────────────────────────────┘  │
│                                             │
│     [← Forrige]          [Neste →]         │
│                                             │
└─────────────────────────────────────────────┘
```

### 2. **Smarte defaults** (færre valg = raskere)
- Kalender starter på første ledige dag
- Mest populære tid forhåndsvalgt
- Navn/telefon hentes fra profil (hvis logget inn)

### 3. **Micro-copy som veileder**
```
❌ "Velg tidspunkt"
✅ "Vi har ledig torsdag kl. 11:00"

❌ "Fyll ut skjema"
✅ "Bekreft dine detaljer"
```

### 4. **Ingen distraksjoner**
- Ingen header med meny
- Ingen footer
- Kun logo + progress + innhold

---

## 📱 Skjerm-forslag (4 skjermer totalt)

### Skjerm 1: Booking Landing (én side)
```
Hero: "Book din coaching"
  ↓
Seksjon: "Hva trenger du?" (4 kort)
  ↓
Seksjon: "Slik fungerer det" (3 steg)
  ↓
Seksjon: "Coacher" (bilde + navn)
  ↓
CTA: "Finn ledig tid" → Starter wizard
```

### Skjerm 2: Booking Wizard (inline, ikke ny side!)
**Steg 1:** Velg tjeneste (allerede valgt fra landing)
**Steg 2:** Velg dato + tid (kalender inline)
**Steg 3:** Dine detaljer (forhåndsutfylt)
**Steg 4:** Betaling (Stripe embed)
**Steg 5:** Bekreftelse (suksess + legge til kalender)

### Skjerm 3: Personvern (enkel tekstside)

### Skjerm 4: Forside (hovedsiden)

---

## ⚡ Speed-teknikker

| Teknikk | Hvorfor |
|---------|---------|
| **Inline wizard** | Ingen lasting mellom steg (0ms ventetid) |
| **Kalender først** | Viser ledige datoer umiddelbart |
| **Tidslots i grid** | Ett klikk, ikke dropdown |
| **Forhåndsutfylling** | Hentet fra profil/cookie |
| **One-click betaling** | Apple Pay / Vipps / lagret kort |

**Mål:** Fullføre booking på **under 45 sekunder**

---

## ✅ ENDELIG PLAN

| # | Skjerm | Beskrivelse |
|---|--------|-------------|
| 1 | **Hovedside** | Forside + Academy + Junior + B2B (seksjoner) |
| 2 | **Booking Wizard** | Inline, 4 steg: Tjeneste → Tid → Detaljer → Betaling |
| 3 | **Personvern** | Enkel tekstside |
| 4 | **Login** | For eksisterende brukere |

**Total: 4 skjermer** (men booking føles som en premium opplevelse!)

---

## 🚀 Skal jeg starte?

**Generere nå:**
1. **Hovedside** (lang side, alle seksjoner)
2. **Booking Wizard** (inline, smooth, premium)

**Ja?**
