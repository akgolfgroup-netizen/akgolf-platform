# Dev environment setup — separat Supabase-prosjekt

> **Erstatter** den implisitte planen i `~/.claude/plans/squishy-shimmying-tower.md` (Supabase branching). Branching virker ikke for dette repoet — se diagnose i seksjon 1.

## Status etter foregående sesjon

- ✅ Dev-branch `dev` (project_ref: `icddleugqbqyfsqfuzgs`) er **slettet** kl ~18:42 UTC. Verifisert via `list_branches`: kun `main` igjen. Kostnaden er stoppet.
- ✅ Project-kostnad hentet: **$10/mnd** for nytt Supabase-prosjekt på samme org (Pro plan compute add-on basis).
- ❌ Ingen nytt prosjekt opprettet — venter på Anders' godkjenning av kostnad.

---

## 1. Hvorfor branching ikke virker (root cause)

Repoet har **to parallelle migrations-historikker**:

| System | Antall migrations (registrert) | Filer i mappe |
|---|---|---|
| Prisma (`_prisma_migrations`) | 49 (rader i prod) | 50 (`prisma/migrations/`) |
| Supabase CLI (`supabase_migrations.schema_migrations`) | 7 | 9 (`supabase/migrations/`) |

Supabase' branching-funksjon kopierer **bare** Supabase CLI-historikken. Migrasjon `20260401000000_rls_policies` prøver `ALTER TABLE "User" ENABLE ROW LEVEL SECURITY` på en branch der `User`-tabellen ikke eksisterer (Prisma-historikken finnes ikke). → `relation "User" does not exist`.

**Drift mellom mappe og system** (parkert som P2-funn):
- `supabase/migrations/` har 9 filer, men bare 7 er registrert i prod. Manglende: `20260410_booking_focus_area.sql`, `20260410_payment_transaction_unique_provider_ref.sql`, `20260501_adaptiv_treningsmotor.sql`. Krever separat oppfølging — ikke noe vi løser i denne sesjonen.

---

## 2. Kostnadsverifisering — venter på godkjenning

```ts
get_cost(type="project", organization_id="qwzkwxkvwvsmyksdoybb")
// → { type: "project", recurrence: "monthly", amount: 10 }
```

| | Kostnad |
|---|---|
| Nytt prosjekt | **$10/mnd** |
| Sammenligning: prod | $25/mnd (antar Pro plan basis) |
| Sammenligning: branch 24/7 | ~$9.68/mnd |
| Sammenligning: branch m/pause 8t/dag | ~$2.37/mnd |

**Free tier ikke tilgjengelig** for AK Golf-organisasjonen — den er på Pro plan, så nye prosjekter får $10/mnd add-on. Eneste vei til "gratis" er ny organisasjon med ny account.

**Stop-condition:** ingen `create_project` før Anders eksplisitt godkjenner $10/mnd.

---

## 3. Forventet sekvens (etter godkjenning)

### A. Opprett prosjekt
```ts
confirm_cost({ type: "project", recurrence: "monthly", amount: 10 })
// → confirmation_id

create_project({
  name: "akgolf-dev",
  region: "eu-west-1",                    // samme som prod
  organization_id: "qwzkwxkvwvsmyksdoybb",
  confirm_cost_id: <id>
})
// → project ref: <DEV_REF>, status: COMING_UP
```

### B. Vent på initialisering
- `get_project(<DEV_REF>)` til status = `ACTIVE_HEALTHY` (typisk 2-3 min)
- `get_publishable_keys(<DEV_REF>)` → branchens anon-key + sb_publishable-key
- Anders henter `service_role`-key fra Dashboard (Settings → API) — MCP eksponerer den ikke
- Anders henter DB-passord fra Dashboard (Settings → Database)

### C. Migrasjons-rekkefølge — KRITISK
**Prisma først, Supabase etter.** Reverse rekkefølge er nettopp det som feilet på branchen.

1. **Prisma migrate** (oppretter alle 50 migrasjoner inkl. `User`, `Booking`, etc.)
   ```bash
   DATABASE_URL="<DEV_DIRECT_URL>" npx prisma migrate deploy
   ```
   - **MERK:** Bruk DIRECT_URL (port 5432), ikke pooler. PgBouncer på 6543 støtter ikke prepared statements som migrate trenger (dokumentert i `.claude/rules/gotchas.md`).
   - Kjøres mot dev — `.env`-konfigurasjonen er IKKE rørt, så vi setter `DATABASE_URL` inline.

2. **Supabase CLI-migrations** (legger på RLS, RPCs, etc.)
   - **CLI er IKKE installert** lokalt (`which supabase` = not found).
   - **To valg:**
     - **Valg 1: Installer CLI** — `brew install supabase/tap/supabase`, deretter `supabase link --project-ref <DEV_REF>` + `supabase db push`. Krever Anders manuelt å koble lokalt.
     - **Valg 2: Bruk MCP `apply_migration`** — jeg leser hver av de 9 filene i `supabase/migrations/` og kaller `apply_migration(<DEV_REF>, name, sql)` per fil. Krever ingen lokal setup.
   - **Anbefaling: Valg 2 (MCP).** Raskere, ingen ekstra installasjon, og MCP-en er allerede autorisert. Risiko: drift mellom Supabase' migrations-tabell og våre filer (men det er drift på prod allerede, så det er ikke verre). Hvis Anders vil bruke `supabase db push` i fremtiden bør CLI installeres da.
   - **Rekkefølge på 9 filene:** alfabetisk/numerisk fungerer hvis vi tar dem i denne ordenen:
     ```
     001_training_plans.sql
     002_auth_helpers.sql
     20260401000000_rls_policies.sql              ← skal nå funke (User finnes)
     20260410_atomic_booking_create.sql
     20260410_booking_focus_area.sql              ← drift fra prod, men inkluderes
     20260410_payment_transaction_unique_provider_ref.sql ← drift
     20260425_subscription_quota_rpcs.sql
     20260430_technical_plans.sql
     20260501_adaptiv_treningsmotor.sql           ← drift
     ```
   - **Hvis en feiler:** STOPP, rapporter, ikke prøv igjen.

3. **Verifiser tabellantall**
   ```ts
   list_tables(<DEV_REF>, ["public"])
   // Forventet: 156 tabeller (matcher prod)
   ```

### D. Seed
1. **Markus-data:** parkert per Anders' instruks. Hvis seed feiler pga `seed-config.ts` → STOPP og rapporter.

2. **Kjør Prisma seed**
   ```bash
   DATABASE_URL="<DEV_DIRECT_URL>" npx prisma db seed
   ```
   - Bruker `tsx prisma/seed-simple.ts` → leser `seed-config.ts`
   - Idempotent: `findFirst` + skip
   - Ingen eksterne kall — trygt
   - Forventer: Anders + Markus opprettes som User+Instructor, 6+ ServiceType, 1-2 Location

3. **Lag `prisma/seed-dev-auth.ts`** (ny fil)
   - Bruker dev-prosjektets `SUPABASE_SERVICE_ROLE_KEY` til å kalle `supabase.auth.admin.createUser({ email: "anders@akgolf.no", password: "Akgolf!Dev2026", email_confirm: true })`
   - Henter returned `user.id` (UUID)
   - UPDATE `public.User` SET `supabaseId` = `<uuid>`, `password` = bcrypt("Akgolf!Dev2026") WHERE `email` = "anders@akgolf.no"
   - Samme for `markus@akgolf.no` med samme passord
   - Idempotent: hopper over hvis Supabase-bruker allerede finnes
   - Kjøres: `DATABASE_URL=<DEV_DIRECT_URL> SUPABASE_SERVICE_ROLE_KEY=<DEV_KEY> NEXT_PUBLIC_SUPABASE_URL=<DEV_URL> npx tsx prisma/seed-dev-auth.ts`
   - Legg `seed:dev-auth`-script i `package.json` for senere reuse

### E. Env-konfigurasjon (Anders limer inn verdier)
**Bekreftet samme env-vars som forrige plan:**

`.env.local` skal endres slik:
```diff
- NEXT_PUBLIC_SUPABASE_URL=https://ijuecwcucbwqqvyavqan.supabase.co
+ NEXT_PUBLIC_SUPABASE_URL=https://<DEV_REF>.supabase.co

- NEXT_PUBLIC_SUPABASE_ANON_KEY=<prod>
+ NEXT_PUBLIC_SUPABASE_ANON_KEY=<dev anon-key fra get_publishable_keys>

- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<prod>
+ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<dev sb_publishable-key>

- SUPABASE_ANON_KEY=<prod>
+ SUPABASE_ANON_KEY=<dev anon-key>

- SUPABASE_PUBLISHABLE_KEY=<prod>
+ SUPABASE_PUBLISHABLE_KEY=<dev sb_publishable-key>

- SUPABASE_SERVICE_ROLE_KEY=<prod>
+ SUPABASE_SERVICE_ROLE_KEY=<dev service-role-key fra Dashboard>

+ DATABASE_URL=postgres://postgres.<DEV_REF>:<DEV_PASSWORD>@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
+ DIRECT_URL=postgres://postgres:<DEV_PASSWORD>@db.<DEV_REF>.supabase.co:5432/postgres
```

**`.env` røres IKKE** — fortsetter mot prod for `prisma migrate deploy`-kommandoer.

`POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_DATABASE` i `.env.local` — disse er Vercel-spesifikke, kan ignoreres lokalt eller settes til dev-host hvis noe leser dem (jeg har ikke verifisert hvor disse brukes; flag).

### F. Verifikasjon

```ts
// 1. Tilkobling
mcp__supabase__execute_sql(<DEV_REF>, "SELECT 1")

// 2. Tabellantall matcher prod
list_tables(<DEV_REF>, ["public"], false)
// → 156 tabeller forventet

// 3. Bare seed-data, ingen test-rader
mcp__supabase__execute_sql(<DEV_REF>, "SELECT count(*) FROM \"User\"")
// → 2 (Anders + Markus)

// 4. Prod uberørt
mcp__supabase__execute_sql("ijuecwcucbwqqvyavqan", "SELECT count(*) FROM \"User\"")
// → 147+ (forskjell fra dev = bevis på isolasjon)
```

### G. Smoke-test P0-1
- Drep Anders' eksisterende `next dev` på 3000
- `npm run dev` (med oppdatert `.env.local`)
- Logg inn på `/admin/login` med `anders@akgolf.no` + `Akgolf!Dev2026`
- /admin/elever → forventer **0 spillere** (kun coacher)
- Klikk "Ny spiller" → modal → opprett "Test Spiller" + telefon
- Forventer: success-toast med temp-passord, redirect til ny spillerprofil
- `mcp__supabase__execute_sql(<DEV_REF>, "SELECT name, phone FROM \"User\" WHERE name = 'Test Spiller'")` → bekrefter phone er persistert
- `mcp__supabase__execute_sql("ijuecwcucbwqqvyavqan", "SELECT name FROM \"User\" WHERE name = 'Test Spiller'")` → 0 rader (prod ikke berørt)

---

## 4. Filer som endres

| Fil | Endring | Committet? |
|---|---|---|
| `.env.local` | Bytt 6 SUPABASE-keys + legg til DATABASE_URL/DIRECT_URL | **NEI** (gitignored) |
| `.env.local.backup-pre-dev-project` | Backup før endring | **NEI** (gitignored) |
| `prisma/seed-dev-auth.ts` | NY | **JA** |
| `package.json` | `+ "seed:dev-auth": "tsx prisma/seed-dev-auth.ts"` | **JA** |
| `CLAUDE.md` | Dokumentasjon (se seksjon 7) | **JA** |
| `plans/dev-environment-setup.md` | Denne fila | **JA** |
| `WORKLOG.md` | Notat om dagens funn | **JA** |

**Git-strategi:** ny branch `chore/dev-environment-setup` (per Anders' Q2-svar fra forrige plan). Ikke piggyback på `feat/booking-calendar-out-sync`.

---

## 5. Tilbakefall

| Hvis dette feiler | Gjør dette |
|---|---|
| `create_project` feiler | Stopp, rapporter. Ingen endring i lokal config. |
| Prisma migrate deploy feiler | Sannsynligvis prisma drift-saker (kjent fra WORKLOG). Stopp, rapporter, ikke prøv å fikse drift på dev før vi har avklart prod-konsekvenser. |
| En av Supabase-migrasjonene feiler | Stopp, rapporter, vurder skip. Sannsynligvis 3 drift-saker (booking_focus_area, payment_transaction_unique_provider_ref, adaptiv_treningsmotor) som ikke matcher prod. |
| Seed feiler | Sjekk om det er Markus-navn-issue (parkert) eller noe annet. STOPP og rapporter. |
| seed-dev-auth.ts feiler | Sannsynligvis service-role-key feil. Be Anders verifisere. |
| Innlogging feiler etter seed-auth | Verifiser at supabaseId er satt på User-rad + Supabase Dashboard viser auth-bruker. |

**Avvikling:** `mcp__supabase__delete_project(<DEV_REF>)` — krever evt. egen confirm. Anders må evt. revertere `.env.local` fra backup.

---

## 6. Fire risiko-flagg (ikke fix, dokumenter)

1. **Migration drift mellom mappe og prod:** 9 filer i `supabase/migrations/`, kun 7 i prod. På dev-prosjektet kommer vi til å applye alle 9 (siden vi gjør det manuelt) — så dev får mer enn prod. Kan skape forvirring ved fremtidige sammenligninger. Anders bør ta stilling: skal vi bringe prod up to date, eller fjerne de 3 ekstra fra mappa?

2. **Stripe webhook-endpoint** peker mot `https://akgolf.no/api/portal/webhooks/stripe`. Ved lokal betalingstest mot dev-DB må Anders bruke `stripe listen --forward-to localhost:3000/api/portal/webhooks/stripe`. Krever stripe CLI lokalt. Ute av P0-scope.

3. **Resend + Twilio + Anthropic + Notion** env-vars byttes IKKE — lokal dev sender ekte e-post/SMS hvis flytene trigges. Anders bør bruke egen e-post + telefon, eller midlertidig `unset` Twilio i `.env.local`.

4. **Google Calendar OAuth callback** kan være konfigurert mot `https://akgolf.no/...`. Hvis lokal dev tester Google-knapper, kan callback feile. Verifiser i Google Cloud Console hvis det blir et problem.

---

## 7. Permanent dokumentasjon (forhindre samme felle)

Foreslått tekstblokk for `CLAUDE.md` (under "Tech stack"):

```markdown
## Database og environments — kritisk

| Environment | Hvor `DATABASE_URL` kommer fra | Peker til |
|---|---|---|
| `npm run dev` (lokal Next.js) | `.env.local` (overstyrer .env) | **Dev-prosjekt** (ref: `<DEV_REF>`) |
| `prisma migrate deploy` (CLI) | `.env` | **Prod** (ref: `ijuecwcucbwqqvyavqan`) |
| Vercel (Production + Preview) | Vercel env-vars | **Prod** |

**Aldri** kjør `npm run dev` med `.env.local` som peker til prod. Gjør det og du skriver test-data til prod-DB. Det skjedde 17. april til 3. mai — 131 test-rader i prod.

**Aldri** legg DATABASE_URL/DIRECT_URL med dev-strenger i `.env`. `prisma migrate ...` ville da gå mot dev og prod ville ikke få nye migrations.

**Sjekk hvor du peker:**
\`\`\`bash
node -e "require('dotenv').config({path:'.env.local'}); console.log('DB host:', new URL(process.env.DATABASE_URL).host)"
\`\`\`
Skal vise pooler-host med dev-ref. Hvis prod-ref → STOPP.

**Supabase branching virker ikke for dette repoet** fordi vi har 2 parallelle migrations-systemer (Prisma 49 + Supabase CLI 7). Branching kopierer kun Supabase-historikken og feiler når Supabase-migrations forutsetter Prisma-tabeller. Bruker derfor separat dev-prosjekt i stedet.
```

Plassering: `CLAUDE.md` etter linje 11 ("Tech stack"-seksjon). Tilsvarende kort blokk i `.claude/rules/gotchas.md` under "Database og environments".

---

## 8. Sekvens-checklist (etter godkjenning av $10/mnd)

1. [ ] `confirm_cost` + `create_project(name="akgolf-dev", region="eu-west-1", organization_id="qwzkwxkvwvsmyksdoybb")` — RAPPORTER
2. [ ] Vent på `ACTIVE_HEALTHY` via `get_project` polling — RAPPORTER status
3. [ ] `get_publishable_keys(<DEV_REF>)` — RAPPORTER "keys hentet OK" (ikke verdier)
4. [ ] Anders henter `service_role`-key + DB-passord fra Dashboard
5. [ ] Vis Anders eksakt `.env.local`-diff (uten verdier) — Anders limer manuelt
6. [ ] Anders bekrefter at `.env.local` er oppdatert + backup laget
7. [ ] `DATABASE_URL=<DEV_DIRECT_URL> npx prisma migrate deploy` — RAPPORTER
8. [ ] `apply_migration` for hver av de 9 Supabase-filene — RAPPORTER per fil
9. [ ] `list_tables(<DEV_REF>)` → bekreft 156 tabeller — RAPPORTER
10. [ ] `DATABASE_URL=<DEV_DIRECT_URL> npx prisma db seed` — RAPPORTER
11. [ ] Lag `prisma/seed-dev-auth.ts` + script i `package.json` — RAPPORTER
12. [ ] Kjør `seed:dev-auth` — RAPPORTER
13. [ ] Anders smoke-tester P0-1 i nettleser
14. [ ] Skriv dokumentasjon til `CLAUDE.md`
15. [ ] Commit på `chore/dev-environment-setup`
16. [ ] Klart for fortsatt P0-1-test og videre P0-arbeid

**Per-steg-rapportering** (Anders' regel) — ingen fast-forward.
