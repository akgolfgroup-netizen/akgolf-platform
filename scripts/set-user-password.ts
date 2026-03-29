import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const email = "anders@akgolf.no";
const newPassword = "anders";

async function setPassword() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY");
    console.log("Kjør: vercel env pull .env --environment=production");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Finn brukeren
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Feil ved henting av brukere:", listError.message);
    process.exit(1);
  }

  const user = users.users.find((u) => u.email === email);

  if (!user) {
    console.error(`Bruker ${email} finnes ikke. Oppretter ny...`);

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: newPassword,
      email_confirm: true,
    });

    if (createError) {
      console.error("Feil ved opprettelse:", createError.message);
      process.exit(1);
    }

    console.log(`Bruker opprettet: ${newUser.user.id}`);
    return;
  }

  console.log(`Fant bruker: ${user.id}`);

  // Oppdater passord
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword,
  });

  if (updateError) {
    console.error("Feil ved passordoppdatering:", updateError.message);
    process.exit(1);
  }

  console.log(`Passord oppdatert for ${email}`);
  console.log("Logg inn med:");
  console.log(`  E-post: ${email}`);
  console.log(`  Passord: ${newPassword}`);
}

setPassword();
