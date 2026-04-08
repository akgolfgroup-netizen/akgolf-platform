# Plan: Ekstremt Effektiv Booking (3 klikk)

## Nåværende problem
- For mange tidspunkter å velge mellom (15+ valg)
- Ulogiske intervaller (14:35, 15:10, osv.)
- For mange steg i prosessen

## Mål: 3-klikk booking
1. **Velg pakke** (1 klikk)
2. **Velg dag** (1 klikk) 
3. **Bekreft tid** (1 klikk)

---

## Implementeringsplan

### Steg 1: Forenkle tidsvelger
**Før:** Vise alle 20-min slots (15+ valg)
**Etter:** Vise kun 3-4 anbefalte tidspunkter

```typescript
// Logikk for "Smarte tidspunkter":
- 1 morgen-slot (hvis tilgjengelig): 09:00 eller 10:00
- 2 ettermiddag-slots: 13:00 og 15:00  
- 1 kveld-slot (hvis tilgjengelig): 17:00

// Max 4 valg totalt
```

### Steg 2: Kombiner steg 2+3 (Coach + Tid)
**Før:** Velg coach → Velg dato → Velg tid → Oppsummering
**Etter:** Velg coach+dato+tid i ett steg

**Mockup:**
```
┌─────────────────────────────────────┐
│ Velg tidspunkt med Anders           │
├─────────────────────────────────────┤
│                                     │
│  Tirsdag 15. april                  │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │  13:00 │ │  15:00 │ │  17:00 │  │
│  │  Ledig │ │  Ledig │ │  Opptatt│  │
│  └────────┘ └────────┘ └────────┘  │
│                                     │
│  [ < ]  [ > ]  (dag-navigasjon)     │
│                                     │
└─────────────────────────────────────┘
```

### Steg 3: "Rask Booking" modus
For eksisterende kunder - hopp rett til kalenderen:

```typescript
// Landingsside for eksisterende kunder:
"Hei Anders! Klar for neste økt?"

[Neste tilgjengelige tirsdag 15. april kl 13:00]
[Velg annet tidspunkt]
```

### Steg 4: Smarte defaults
- Pre-velg dag: Nærmeste ledige dag
- Pre-velg tid: Første ledige ettermiddag
- Ett-klikk bekreftelse

---

## Redusert flow (3 steg)

```
┌─────────┐     ┌───────────────────────┐     ┌─────────────┐
│  Pakke  │────▶│  Dato + Tid (kombinert)│────▶│  Betaling   │
│ (1 klikk)│     │  (1 klikk)             │     │ (1 klikk)   │
└─────────┘     └───────────────────────┘     └─────────────┘
```

VS dagens 5 steg:
```
Pakke → Coach → Dato → Tid → Oppsummering → Betaling
```

---

## Teknisk implementering

### 1. API-endepunkt for "smarte slots"
```typescript
// /api/booking/smart-slots
// Returnerer kun 3-4 anbefalte tidspunkter
{
  "date": "2026-04-15",
  "slots": [
    { "time": "13:00", "availability": "available" },
    { "time": "15:00", "availability": "available" },
    { "time": "17:00", "availability": "busy" }
  ],
  "nextAvailableDate": "2026-04-16"
}
```

### 2. Komponent: SmartTimePicker
- Viser kalender med én uke om gangen
- Maks 3-4 tidsknapper per dag
- Swipe/arrow for å bytte uke

### 3. Kombinert Coach-Dato-Tid side
- Fjerne egen "coach-selection" side
- Coach vises som info, ikke valg
- Fokus på å velge DAG først, så TID

---

## Visuell redesign

### Nåværende (kaotisk):
```
[April 2026]      [14:00] [14:35] [15:00]
[kalender]        [15:10] [15:35] [16:00]
                  [17:00] [17:35] [18:10]
```

### Nytt (fokusert):
```
📅 Denne uken (uke 15)

Man 14.    Tir 15.    Ons 16.    Tor 17.    Fre 18.
  ─          ─          ─          ─          ─
(Opptatt)  [13:00]    [13:00]    [13:00]   [10:00]
           [15:00]    [15:00]    [15:00]   [12:00]
           [17:00]    (Opptatt)   [17:00]   ─

← Forrige uke    Neste uke →
```

---

## Fordeler
1. **Raskere booking**: 3 klikk vs 6+ klikk
2. **Mindre valgstress**: 3-4 valg vs 15+ valg
3. **Bedre mobilopplevelse**: Horisontal uke-visning
4. **Mer intuitivt**: Dag først, så tid

---

## Estimat: 2-3 timer implementering
