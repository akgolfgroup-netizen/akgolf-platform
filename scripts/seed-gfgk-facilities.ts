#!/usr/bin/env tsx
/**
 * Seed GFGK Facilities
 *
 * Oppretter/oppdaterer 10 fasiliteter på Gamle Fredrikstad Golfklubb (GFGK)
 * og setter Anders sin default-fasilitet til Performance Studio.
 *
 * Idempotent — trygt å kjøre flere ganger.
 *
 * Bruk: npx tsx scripts/seed-gfgk-facilities.ts
 */

import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

const createId = () => nanoid();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const GFGK_LOCATION_NAME = "Gamle Fredrikstad Golfklubb";
const GFGK_LOCATION_ADDRESS = "Torsnesveien, Fredrikstad";

const FACILITIES = [
  { slug: "performance-studio", name: "Performance Studio", description: "Innendørs Trackman-studio", capacity: 1, sortOrder: 10 },
  { slug: "driving-range-1", name: "Driving Range 1. etasje", description: "Utslagsmatte 1. etasje", capacity: 10, sortOrder: 20 },
  { slug: "driving-range-2", name: "Driving Range 2. etasje", description: "Utslagsmatte 2. etasje", capacity: 10, sortOrder: 30 },
  { slug: "naerspillsomrade", name: "Nærspillsområde", description: "Chipping og pitching", capacity: 6, sortOrder: 40 },
  { slug: "puttinggreen", name: "Puttinggreen", description: "Hovedputting green", capacity: 8, sortOrder: 50 },
  { slug: "9-hullsbanen", name: "9-hullsbanen", description: "Ordinær 9-hullsrunde", capacity: 20, sortOrder: 60 },
  { slug: "9-hullsbanen-trening", name: "9-hullsbanen - Treningsområde", description: "Trening på banen", capacity: 12, sortOrder: 70 },
  { slug: "uteomrade-klubbhus", name: "Uteområde ved klubbhuset", description: "Samlingsområde ute", capacity: null, sortOrder: 80 },
  { slug: "klubbrommet", name: "Klubbrommet", description: "Sosialt rom i klubbhuset", capacity: 30, sortOrder: 90 },
  { slug: "juniorrommet", name: "Juniorrommet", description: "Dedikert rom for juniorer", capacity: 15, sortOrder: 100 },
];

async function upsertLocation(): Promise<string> {
  const { data: existing } = await supabase
    .from("Location")
    .select("id")
    .eq("name", GFGK_LOCATION_NAME)
    .maybeSingle();

  if (existing) {
    console.log(`  Location '${GFGK_LOCATION_NAME}' eksisterer (${existing.id})`);
    return existing.id;
  }

  const id = createId();
  const { error } = await supabase.from("Location").insert({
    id,
    name: GFGK_LOCATION_NAME,
    address: GFGK_LOCATION_ADDRESS,
    updatedAt: new Date().toISOString(),
  });
  if (error) throw error;
  console.log(`  Opprettet Location '${GFGK_LOCATION_NAME}' (${id})`);
  return id;
}

async function upsertFacility(
  locationId: string,
  f: (typeof FACILITIES)[number]
): Promise<string> {
  const { data: existing } = await supabase
    .from("Facility")
    .select("id")
    .eq("slug", f.slug)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("Facility")
      .update({
        locationId,
        name: f.name,
        description: f.description,
        capacity: f.capacity,
        sortOrder: f.sortOrder,
        isActive: true,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", existing.id);
    console.log(`  [upd] ${f.name}`);
    return existing.id;
  }

  const id = createId();
  const { error } = await supabase.from("Facility").insert({
    id,
    locationId,
    slug: f.slug,
    name: f.name,
    description: f.description,
    capacity: f.capacity,
    sortOrder: f.sortOrder,
    isActive: true,
    updatedAt: new Date().toISOString(),
  });
  if (error) throw error;
  console.log(`  [new] ${f.name}`);
  return id;
}

async function setAndersDefault(performanceStudioId: string) {
  const { data: user } = await supabase
    .from("User")
    .select("id, name")
    .or("email.eq.anders@akgolf.no,email.eq.akgolfgroup@gmail.com")
    .maybeSingle();

  if (!user) {
    console.log("  [skip] Anders-bruker ikke funnet (sjekk email)");
    return;
  }

  const { data: instructor } = await supabase
    .from("Instructor")
    .select("id")
    .eq("userId", user.id)
    .maybeSingle();

  if (!instructor) {
    console.log(`  [skip] Ingen Instructor-rad for ${user.name}`);
    return;
  }

  const { data: existing } = await supabase
    .from("InstructorFacilityDefault")
    .select("id")
    .eq("instructorId", instructor.id)
    .eq("facilityId", performanceStudioId)
    .is("serviceTypeId", null)
    .maybeSingle();

  if (existing) {
    console.log(`  Default allerede satt for ${user.name} -> Performance Studio`);
    return;
  }

  const { error } = await supabase.from("InstructorFacilityDefault").insert({
    id: createId(),
    instructorId: instructor.id,
    facilityId: performanceStudioId,
    serviceTypeId: null,
    priority: 0,
  });
  if (error) throw error;
  console.log(`  Default satt for ${user.name} -> Performance Studio`);
}

async function main() {
  console.log("\nSeeder GFGK-fasiliteter\n=======================\n");

  console.log("1. Location");
  const locationId = await upsertLocation();

  console.log("\n2. Fasiliteter");
  const facilityIds: Record<string, string> = {};
  for (const f of FACILITIES) {
    facilityIds[f.slug] = await upsertFacility(locationId, f);
  }

  console.log("\n3. Anders -> Performance Studio");
  await setAndersDefault(facilityIds["performance-studio"]);

  console.log("\nFerdig.\n");
}

main().catch((err) => {
  console.error("Feilet:", err);
  process.exit(1);
});
