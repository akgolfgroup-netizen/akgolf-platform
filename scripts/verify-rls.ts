/**
 * scripts/verify-rls.ts
 *
 * Verifiser RLS-policies etter prisma/manual-migrations/2026-05-03_enable_rls.sql
 * er kjørt i prod.
 *
 * Bruk:
 *   npx tsx scripts/verify-rls.ts
 *
 * Krever:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Tre tilstander per tabell:
 *   - BLOCKED (error 42501): RLS aktivt, anon nektes med klar feil — trygt
 *   - EMPTY: Tom data, kan være RLS eller naturlig tomt — verifiser i Dashboard
 *   - LEAK: Anon fikk faktiske rader — RLS er IKKE aktivt eller policy er feil
 */

import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!URL || !ANON) {
  console.error("Mangler NEXT_PUBLIC_SUPABASE_URL eller NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const TABLES = [
  "Round",
  "HoleResult",
  "TrackmanSession",
  "GroupSession",
  "GroupSessionRSVP",
  "GroupMembership",
  "TrainingGroup",
  "EmailTemplate",
] as const;

async function main() {
  const anon = createClient(URL!, ANON!);

  console.log("RLS-verifisering — anon-klient mot 8 tabeller\n");

  for (const t of TABLES) {
    const result = await anon.from(t).select("id").limit(1);
    const status = result.error
      ? `BLOCKED (error ${result.error.code})`
      : result.data?.length === 0
        ? "EMPTY (kan være RLS, kan være naturlig tomt — verifiser i Dashboard)"
        : `LEAK — fikk ${result.data.length} rows`;
    console.log(`${t.padEnd(20)} ${status}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
