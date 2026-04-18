# Kimi-brief: Fullfør turneringsplanlegger-kilder

> **Til Kimi**: Les denne filen først. All kontekst er her — ingen behov for ekstra research.

## Status i dag (2026-04-18, commit `0ffaee9`)

Turneringsplanleggeren er ferdig for:
- GolfBox (5 schedules): Garmin NC, Srixon Tour, NM, **Østlandstour** (c=895, s=3863), **Olyo Juniortour** (c=877, s=16139)
- Nordic Golf Tour (32 turneringer)
- Manuell (spiller-opprettede, private)

Sync-endepunkt `/api/portal/tournament-planner/sync` er orkestrert, CRON 02:00 UTC daglig kjører den. Prod-DB har 70 turneringer importert.

## Oppgaver som gjenstår

### P1. Fiks Global Junior Tour (Cheerio-bug)

**Fil:** `modules/tournament-planner/sources/global-junior-tour.ts`

Feil ved sync: `$ is not defined`. `$` må være returnverdien fra `cheerio.load(html)`. Les filen, finn stedene der `$` brukes uten at `cheerio.load` er kalt først. Mest sannsynlig mangler `const $ = cheerio.load(html)` øverst i funksjonen.

**Akseptansekriterium:** `npx tsx scripts/run-tournament-sync-now.ts 2026` skal vise `[global_junior_tour] fant N turneringer` hvor N > 0.

### P2. Fiks JMI Sweden (404)

**Fil:** `modules/tournament-planner/sources/jmi-sweden.ts`

Nettsidestruktur har endret seg siden sist. Sjekk `https://www.jmi-sweden.se/` manuelt i browseren og finn hvor turneringskalenderen ligger nå. Oppdater URL og eventuelt Cheerio-selectorer.

**Akseptansekriterium:** Samme script skal vise `[jmi_sweden] fant N turneringer` hvor N > 0 (eller rapporter om JMI Sweden ikke lenger har offentlig kalender).

### P3. Legg til de 5 andre NGF-junior-regionene i GolfBox

**Fil:** `modules/tournament-planner/sources/golfbox.ts`

`DEFAULT_SCHEDULES`-arrayet har per i dag:
```typescript
{ customerId: 877, scheduleId: 16139, level: "regional" }, // Olyo Juniortour (Viken Vest)
```

Legg til de andre 5 junior-regionene. Hver region har EGEN customerId, men scheduleId må identifiseres per region.

**Framgangsmåte:**
```bash
# Kjør for hver av disse customerIds og noter scheduleId + navn:
npx tsx scripts/list-golfbox-schedules.ts 873 2026  # Region Midt
npx tsx scripts/list-golfbox-schedules.ts 874 2026  # Region Vestland
npx tsx scripts/list-golfbox-schedules.ts 875 2026  # Region Rogaland
npx tsx scripts/list-golfbox-schedules.ts 876 2026  # Region Sør
npx tsx scripts/list-golfbox-schedules.ts 878 2026  # Region Øst
```

Legg hver scheduleId inn i `DEFAULT_SCHEDULES` og i `GOLFBOX_CATEGORIES` i `modules/tournament-planner/golfbox.ts`. Bruk `level: "regional"` for alle.

Hvis en region har FLERE relevante schedules (f.eks. junior + senior), legg til alle.

**Akseptansekriterium:** Etter sync skal `SELECT series, COUNT(*) FROM "Tournament" GROUP BY series` vise rader for alle 6 junior-regionene.

## Test-kommando (brukes for alle 3)

```bash
# Kjør lokal sync mot prod-DB (trenger DIRECT_URL i .env)
npx tsx scripts/run-tournament-sync-now.ts 2026

# Verifiser i DB
node -e "require('dotenv').config(); const {Client}=require('pg'); (async()=>{const c=new Client({connectionString:process.env.DIRECT_URL});await c.connect();const r=await c.query('SELECT series,COUNT(*) as count FROM \"Tournament\" GROUP BY series ORDER BY count DESC');console.table(r.rows);await c.end();})();"
```

## Commit-konvensjon

```
fix: global junior tour cheerio-initiering
fix: jmi sweden URL-endring (eller: doc: jmi sweden deprecated)
feat: 5 NGF-junior-regioner i golfbox-source (Midt/Vestland/Rogaland/Sør/Øst)
```

**IKKE pushe autonomt** — la Anders godkjenne med `git push origin main`.

## Kritiske filer (read-only-referanser)

- `modules/tournament-planner/sources/golfbox.ts` — endres for P3
- `modules/tournament-planner/sources/global-junior-tour.ts` — endres for P1
- `modules/tournament-planner/sources/jmi-sweden.ts` — endres for P2
- `modules/tournament-planner/golfbox.ts` — oppdater `GOLFBOX_CATEGORIES` for P3
- `scripts/list-golfbox-schedules.ts` — hjelper (allerede klar)
- `scripts/run-tournament-sync-now.ts` — hjelper (allerede klar)
- `docs/MASTER_TODO_2026.csv` — oppdater #42-notat når ferdig
- `WORKLOG.md` — legg til ny entry

## Ikke gjør

- Ikke endre `sync/route.ts` (fungerer bra)
- Ikke endre Prisma-schema eller migrasjoner
- Ikke endre UI (`add-tournament-modal.tsx`, `turneringsplan-client.tsx`)
- Ikke kjør `prisma migrate deploy` mot prod (pooler-advisory-lock fungerer ikke — bruk pg direkte hvis absolutt nødvendig, men dette bør ikke være nødvendig for disse tre oppgavene)

## Tids-estimat

- P1 (Global Junior Tour): 30 min
- P2 (JMI Sweden): 45 min (avhenger av ny URL)
- P3 (5 junior-regioner): 1 t (mye repetisjon, lett arbeid)

**Totalt: ~2 t**
