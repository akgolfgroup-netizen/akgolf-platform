/**
 * seed-dev-auth.ts
 *
 * Oppretter Supabase Auth-bruker(e) på dev-prosjektet og kobler dem til
 * eksisterende public.User-rader via supabaseId. Setter også bcrypt-hashet
 * passord i public.User.password slik at NextAuth Credentials-flyt virker.
 *
 * VIKTIG:
 * - Skal KUN kjøres mot dev-prosjekt (kdjvfcjlfmjspjnajqgx). Avbryt hvis
 *   env peker mot prod.
 * - Idempotent: hopper over Supabase-bruker hvis email allerede finnes.
 * - Krever .env.local med SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL.
 *
 * Kjøring:
 *   npx tsx prisma/seed-dev-auth.ts
 */

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

config({ path: ".env.local", override: true, quiet: true });

const DEV_PROJECT_REF = "kdjvfcjlfmjspjnajqgx";
const PROD_PROJECT_REF = "ijuecwcucbwqqvyavqan";

const USERS = [
  {
    email: "anders@akgolf.no",
    password: "Akgolf!Dev2026",
  },
];

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Mangler env-vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  if (supabaseUrl.includes(PROD_PROJECT_REF)) {
    throw new Error(
      `STOPP: NEXT_PUBLIC_SUPABASE_URL peker mot prod (${PROD_PROJECT_REF}). Dette scriptet skal KUN kjøre mot dev (${DEV_PROJECT_REF}).`,
    );
  }
  if (!supabaseUrl.includes(DEV_PROJECT_REF)) {
    throw new Error(
      `STOPP: NEXT_PUBLIC_SUPABASE_URL peker ikke mot forventet dev-prosjekt (${DEV_PROJECT_REF}). Avbryter.`,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  console.log(`🌱 seed-dev-auth mot dev-prosjekt ${DEV_PROJECT_REF}\n`);

  for (const u of USERS) {
    console.log(`👤 ${u.email}`);

    // 1. Sjekk om Supabase Auth-bruker finnes
    const { data: list, error: listError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (listError) {
      console.error("  ❌ Klarte ikke liste auth-brukere:", listError.message);
      continue;
    }
    let authUser = list.users.find((au) => au.email === u.email);

    // 2. Opprett Supabase-bruker hvis ikke finnes
    if (!authUser) {
      const { data: created, error: createError } =
        await supabase.auth.admin.createUser({
          email: u.email,
          password: u.password,
          email_confirm: true,
        });
      if (createError || !created.user) {
        console.error("  ❌ Klarte ikke opprette auth-bruker:", createError?.message);
        continue;
      }
      authUser = created.user;
      console.log(`  ✅ Auth-bruker opprettet (id: ${authUser.id})`);
    } else {
      console.log(`  ⏭️  Auth-bruker finnes fra før (id: ${authUser.id})`);
    }

    // 3. Finn public.User-rad via Supabase REST (service_role bypasser RLS)
    const { data: dbUsers, error: dbError } = await supabase
      .from("User")
      .select("id, supabaseId")
      .eq("email", u.email)
      .limit(1);
    if (dbError) {
      console.error(`  ❌ Klarte ikke hente public.User: ${dbError.message}`);
      continue;
    }
    if (!dbUsers || dbUsers.length === 0) {
      console.warn(
        `  ⚠️  Ingen public.User med email ${u.email}. Kjør seed-simple først.`,
      );
      continue;
    }
    const dbUser = dbUsers[0];

    // 4. Oppdater supabaseId + password
    const passwordHash = await bcrypt.hash(u.password, 12);
    const { error: updateError } = await supabase
      .from("User")
      .update({
        supabaseId: authUser.id,
        password: passwordHash,
      })
      .eq("id", dbUser.id);
    if (updateError) {
      console.error(`  ❌ Klarte ikke oppdatere public.User: ${updateError.message}`);
      continue;
    }
    console.log(
      `  ✅ public.User oppdatert (supabaseId + bcrypt password satt)\n`,
    );
  }

  console.log("Ferdig.");
}

main().catch((err) => {
  console.error("Feil:", err);
  process.exit(1);
});
