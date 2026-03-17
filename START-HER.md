# AK Golf Booking - Start Her 🚀

> **Kom i gang på 5 minutter**

---

## 🎯 Tre enkle steg

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  1. Kjør setup  │ →  │ 2. Fyll priser  │ →  │ 3. Start server │
│   ./setup.sh    │    │ seed-config.ts  │    │  npm run dev    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Steg 1: Kjør setup (2 min)

```bash
cd /Users/anderskristiansen/Developer/akgolf-website
./setup.sh
```

Dette konfigurerer:
- ✅ Supabase (database)
- ✅ Vipps (betaling)
- ✅ Resend (e-post)
- ✅ Stripe (valgfritt)

**Du trenger:**
- Supabase-konto (gratis)
- Vipps-avtale (søknad tar 1-3 dager)
- Resend-konto (gratis)

---

## Steg 2: Fyll inn priser (2 min)

**Åpne filen:** `prisma/seed-config.ts`

```typescript
// ENDRE KUN DETTE:

export const SERVICES = {
  individual: {
    name: "Individuell coaching",
    price: 99500,  // ← ENDRE (995 kr)
    active: true,  // ← ENDRE (true/false)
    // ...
  },
  // ...
};

export const AVAILABILITY = {
  anders: {
    mon: { start: "09:00", end: "17:00", location: "gfgk" },
    // ← ENDRE tider
  },
};
```

**Kjør seed:**
```bash
npx prisma db seed
```

---

## Steg 3: Start server (1 min)

```bash
npm run dev
```

**Åpne i nettleser:**
- 📍 `http://localhost:3000/booking` - Offentlig booking
- 📍 `http://localhost:3000/portal` - Inlogget portal

---

## 📋 Hva du må fylle inn

| Fil | Hva | Hvorfor |
|-----|-----|---------|
| `prisma/seed-config.ts` | Priser, tjenester, åpningstider | Kundene ser dette |
| `CONFIG.md` | API-nøkler | Systemet kobles til betaling/e-post |

---

## 🔧 Etter oppstart

### Endre priser senere:
```bash
# 1. Rediger prisma/seed-config.ts
# 2. Kjør:
npx prisma db seed
```

### Legge til ny tjeneste:
1. Legg til i `prisma/seed-config.ts` → `SERVICES`
2. Sett `active: true`
3. Kjør `npx prisma db seed`

### Endre åpningstider:
1. Rediger `AVAILABILITY` i `prisma/seed-config.ts`
2. Kjør `npx prisma db seed`

---

## 📁 Viktige filer

| Fil | Beskrivelse |
|-----|-------------|
| `prisma/seed-config.ts` | **DIN FIL** - Priser, tjenester, åpningstider |
| `CONFIG.md` | **DIN FIL** - API-nøkler og kontaktinfo |
| `.env` | Systemet skriver her - ikke rør |
| `setup.sh` | Kjør én gang for oppsett |

---

## 🆘 Feilsøking

### "Port 3000 is in use"
```bash
# Stopp eksisterende server
pkill -f "next dev"
# Prøv igjen
npm run dev
```

### "Database connection failed"
```bash
# Sjekk at Supabase kjører
# Verifiser DATABASE_URL i .env
```

### "Seed feiler"
```bash
# Installer tsx
npm install -g tsx
# Prøv igjen
npx prisma db seed
```

---

## ✅ Sjekkliste før lansering

- [ ] Fylt inn alle priser i `seed-config.ts`
- [ ] Satt korrekte åpningstider
- [ ] Aktivert ønskede tjenester (`active: true`)
- [ ] Konfigurert Vipps (for betaling)
- [ ] Konfigurert Resend (for e-post)
- [ ] Testet bookingflyt
- [ ] Testet betaling (Vipps test)
- [ ] Verifisert e-poster sendes

---

## 📞 Support

- **Teknisk:** Se `CLAUDE.md` i prosjektet
- **Vipps:** https://developer.vippsmobilepay.com
- **Supabase:** https://supabase.com/docs
- **Stripe:** https://stripe.com/docs

---

**Klar til å starte? Kjør: `./setup.sh`** 🚀
