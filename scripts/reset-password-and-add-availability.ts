/**
 * Reset password and add availability for Anders
 * Run: npx tsx scripts/reset-password-and-add-availability.ts
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

async function main() {
  console.log("🔧 Resetter passord og legger til tilgjengelighet...\n");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Mangler Supabase URL eller Service Role Key");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const email = "anders@akgolf.no";
  const newPassword = "anders";

  // 1. Hent auth user
  console.log("1️⃣ Finner auth bruker...");
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error("❌ Auth error:", authError.message);
    process.exit(1);
  }

  const authUser = authUsers.users.find(u => u.email === email);
  
  if (!authUser) {
    console.error("❌ Auth bruker ikke funnet for:", email);
    process.exit(1);
  }

  console.log(`   ✅ Fant auth user: ${authUser.id}`);

  // 2. Oppdater passord
  console.log("\n2️⃣ Oppdaterer passord...");
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    authUser.id,
    { password: newPassword }
  );

  if (updateError) {
    console.error("❌ Kunne ikke oppdatere passord:", updateError.message);
  } else {
    console.log(`   ✅ Passord oppdatert til: ${newPassword}`);
  }

  // 3. Hent instruktør ID
  console.log("\n3️⃣ Finner instruktør...");
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .single();

  if (userError || !userData) {
    console.error("❌ User ikke funnet:", userError?.message);
    process.exit(1);
  }

  const { data: instructorData, error: instructorError } = await supabase
    .from("Instructor")
    .select("id")
    .eq("userId", userData.id)
    .single();

  if (instructorError || !instructorData) {
    console.error("❌ Instruktør ikke funnet");
    process.exit(1);
  }

  console.log(`   ✅ Instruktør ID: ${instructorData.id}`);

  // 4. Legg til InstructorAvailability (ukeplan)
  console.log("\n4️⃣ Legger til ukeplan-tilgjengelighet...");
  
  // Morgendagens ukedag (0=søndag, 1=mandag, etc.)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayOfWeek = tomorrow.getDay(); // 0-6
  
  const timeSlots = [
    { start: "09:00", end: "09:50" },
    { start: "10:00", end: "10:50" },
    { start: "11:00", end: "11:50" },
    { start: "13:00", end: "13:50" },
    { start: "14:00", end: "14:50" },
    { start: "15:00", end: "15:50" },
  ];

  for (const slot of timeSlots) {
    const { error: availError } = await supabase
      .from("InstructorAvailability")
      .upsert({
        id: `${instructorData.id}_${dayOfWeek}_${slot.start.replace(":", "")}`,
        instructorId: instructorData.id,
        dayOfWeek: dayOfWeek,
        startTime: slot.start,
        endTime: slot.end,
      }, {
        onConflict: "id",
      });

    if (availError) {
      console.log(`   ⚠️  ${slot.start} - ${availError.message}`);
    } else {
      console.log(`   ✅ ${slot.start} - ${slot.end}`);
    }
  }

  // 5. Sjekk og fjern evt BlockedTime for morgendagen
  console.log("\n5️⃣ Sjekker for blokkerte tider...");
  const tomorrowStart = new Date(tomorrow);
  tomorrowStart.setHours(0, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrow);
  tomorrowEnd.setHours(23, 59, 59, 999);

  const { data: blockedTimes, error: blockedError } = await supabase
    .from("BlockedTime")
    .select("id, startTime, endTime, reason")
    .eq("instructorId", instructorData.id)
    .gte("startTime", tomorrowStart.toISOString())
    .lte("startTime", tomorrowEnd.toISOString());

  if (blockedError) {
    console.log(`   ⚠️  Kunne ikke hente blokkerte tider: ${blockedError.message}`);
  } else if (blockedTimes && blockedTimes.length > 0) {
    console.log(`   📋 Fant ${blockedTimes.length} blokkerte tider`);
    for (const bt of blockedTimes) {
      console.log(`      - ${new Date(bt.startTime).toLocaleTimeString("no-NO")}: ${bt.reason || "Ingen grunn"}`);
    }
    console.log("   💡 Slett disse manuelt i admin hvis de ikke skal være der");
  } else {
    console.log("   ✅ Ingen blokkerte tider funnet");
  }

  console.log("\n✨ Ferdig!");
  console.log("\n📋 Login info:");
  console.log(`   E-post: ${email}`);
  console.log(`   Passord: ${newPassword}`);
  console.log(`\n📅 Tilgjengelighet lagt til for ${tomorrow.toLocaleDateString("no-NO")}`);
  console.log("\n🔗 Gå til: /portal/login");
}

main().catch(console.error);
