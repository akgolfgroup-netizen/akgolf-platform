# 🚀 Quick Start: Wireframing

> **Kom i gang med wireframing på 5 minutter**

---

## 🎯 Jeg vil lage en ny wireframe

### 1. Finn siden i planen
```bash
# Sjekk WIREFRAMING-PLAN.md for sidenummer
# Sjekk PROGRESS.md for status
```

### 2. Opprett mappe i workbench
```bash
# Format: {side-navn}-{YYYY-MM-DD}
mkdir .stitch/workbench/dashboard-2026-04-06
```

### 3. Lag iterasjoner i Stitch
- Generer flere varianter
- Lagre screenshots i `iterations/`
- Dokumenter tanker i `notes.md`

### 4. Flytt til review når klar
```bash
mkdir .stitch/review/dashboard-final
cp .stitch/templates/DESIGN.md .stitch/review/dashboard-final/
# Fyll ut DESIGN.md
# Legg til beste screenshot
```

### 5. Godkjenn og flytt til approved
```bash
# Etter godkjenning:
mkdir .stitch/approved/dashboard
cp .stitch/review/dashboard-final/* .stitch/approved/dashboard/
cp .stitch/templates/SPEC.md .stitch/approved/dashboard/
# Fyll ut SPEC.md
```

---

## 📋 Sjekklister

### Før jeg starter
- [ ] Siden finnes i WIREFRAMING-PLAN.md
- [ ] Status er ⬜ (ikke påbegynt)
- [ ] Jeg har lest DESIGN.md (design system)

### Mens jeg designer
- [ ] Jeg følger fargepalett fra design system
- [ ] Jeg bruker riktig typografi
- [ ] Jeg tenker på responsive design
- [ ] Jeg vurderer tilgjengelighet

### Før review
- [ ] DESIGN.md er fylt ut
- [ ] Screenshot er tatt
- [ ] Notater om valg er dokumentert

### Før godkjenning
- [ ] Design matcher design system
- [ ] Alle interaksjoner er dokumentert
- [ ] Responsive varianter er vurdert

### Før koding
- [ ] SPEC.md er fylt ut
- [ ] Komponent-API er definert
- [ ] Data-flyt er dokumentert

---

## 🔗 Viktige filer

| Fil | Hva | Når å bruke |
|-----|-----|-------------|
| `WORKFLOW.md` | Full prosess | Når du er usikker på flyten |
| `WIREFRAMING-PLAN.md` | Alle sider | Finne hva som skal designes |
| `PROGRESS.md` | Status | Oppdatere fremdrift |
| `DESIGN.md` (i templates/) | Mal | Kopiere til review/approved |
| `SPEC.md` (i templates/) | Mal | Kopiere til approved |

---

## 🆘 Vanlige spørsmål

**Q: Kan jeg redigere en wireframe i approved?**  
A: Nei. Flytt til review, gjør endringer, få ny godkjenning.

**Q: Hva hvil jeg vil prøve 3 forskjellige ideer?**  
A: Lag alle i workbench/iterations/, velg én til review.

**Q: Må jeg fylle ut hele DESIGN.md?**  
A: Ja, før godkjenning. I workbench er det valgfritt.

**Q: Hvem godkjenner design?**  
A: Produkteier dokumenteres i DECISIONS.md.

---

## 🎨 Design system på 1-2-3

### Farger
```css
Background: #F5F5F7
Surface:    #FFFFFF
Border:     #E8E8ED
Text:       #1D1D1F
Secondary:  #6E6E73
Success:    #34C759
Error:      #FF3B30
```

### Typografi
```css
Font: Inter
Hero: 56px, weight 700
H1:   40px, weight 700
H2:   32px, weight 600
Body: 16px, weight 400
```

### Spacing
```css
Base: 8px
Card gap: 24px
Card padding: 24px
Border radius: 20px (cards), 980px (buttons)
```

---

**Tips:** Hold det enkelt. Perfeksjon kommer gjennom iterasjon, ikke én stor design-fase.
