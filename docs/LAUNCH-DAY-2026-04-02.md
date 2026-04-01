# AK Golf Launch Day — 2. april 2026

## Pre-Launch (Morgen, før 10:00)

### 1. Backup
```bash
cd ~/Developer/akgolf/akgolf-website
./scripts/backup-before-launch.sh
```
- [ ] Backup-fil opprettet i `backups/`

### 2. Database-sync
```bash
npx prisma db push
```
- [ ] "Your database is now in sync"

### 3. Kjør produksjons-seed
```bash
npm run seed:prod
```
- [ ] Anders (ADMIN) opprettet
- [ ] Markus (INSTRUCTOR) opprettet
- [ ] 3 tjenester opprettet (Individual, Group, Playing Lesson)
- [ ] Tilgjengelighet seeded (12 slots totalt)

### 4. Verifiser Stripe
```bash
npm run verify:stripe
```
- [ ] API-tilkobling OK
- [ ] Webhook registrert
- [ ] Priser matcher (1495, 595, 2495 kr)
- [ ] Miljøvariabler satt

---

## System-test (10:00-11:00)

### 5. Test booking-flyt
1. Gå til https://akgolf.no/academy/booking
2. - [ ] Tjenester vises (Individual, Group, Playing Lesson)
3. - [ ] Instruktører vises (Anders, Markus)
4. - [ ] Velg "Individual Coaching" med Anders
5. - [ ] Kalender viser tilgjengelige tider
6. - [ ] Velg en tid og gå til checkout
7. - [ ] Stripe Checkout åpnes

### 6. Test admin-tilgang
1. Logg inn som Anders (anders@akgolf.no)
2. - [ ] Dashboard vises
3. - [ ] Gå til /portal/admin/elever
4. - [ ] Admin-sider er tilgjengelige
5. - [ ] Gå til /portal/admin/kalender
6. - [ ] Kalender viser tilgjengelighet

### 7. Test portal-innlogging
1. - [ ] /portal/login viser innloggingsskjema
2. - [ ] Magic link fungerer
3. - [ ] Passord-innlogging fungerer

---

## RLS-aktivering (Etter godkjent systemtest)

### 8. Aktiver Row Level Security
Kjør i Supabase SQL Editor:
```sql
SET app.rls_enabled = 'true';
```
- [ ] RLS aktivert

### 9. Test RLS
1. - [ ] Bruker A kan IKKE se Bruker B sine bookinger
2. - [ ] Instruktør ser kun sine egne elever
3. - [ ] Admin (Anders) ser alt

**HVIS PROBLEMER:**
```sql
SET app.rls_enabled = 'false';
```

---

## Launch (12:00)

### 10. Go Live
- [ ] Verifiser at akgolf.no er tilgjengelig
- [ ] Del booking-link med første kunder
- [ ] Aktiver eventuell markedsføring

---

## Monitoring (Første 2 timer)

### 11. Overvåk systemer

| Dashboard | URL | Sjekk |
|-----------|-----|-------|
| Vercel | vercel.com/akgolfgroup-netizens-projects | Ingen 500-feil |
| Supabase | supabase.com/dashboard | DB-tilkoblinger < 80% |
| Stripe | dashboard.stripe.com | Webhook-leveranser OK |

### 12. Kjente feilscenarier

| Problem | Løsning |
|---------|---------|
| Booking feiler | Sjekk Stripe webhook i Dashboard |
| Treg lasting | Sjekk Supabase connections |
| 500-feil | Vercel logs → finn feilen |
| RLS blokkerer | `SET app.rls_enabled = 'false';` |

---

## Rollback-plan

### Hvis kritisk feil:
1. **Vercel:** Rollback til forrige deploy (1 klikk i Dashboard)
2. **Database:** Supabase PITR til før feilen
3. **RLS:** Deaktiver med kill-switch

---

## Kontaktinfo

- **Anders:** +47 918 16 456
- **Supabase Support:** support.supabase.com
- **Stripe Support:** support.stripe.com
- **Vercel Support:** vercel.com/help

---

*Generert 2026-04-01 — Klar for launch!*
