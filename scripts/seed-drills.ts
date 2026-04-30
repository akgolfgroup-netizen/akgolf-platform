/**
 * Seed-script for standard golf-driller.
 * Kjør: npx tsx scripts/seed-drills.ts
 */

import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });

const DEFAULT_DRILLS = [
  { name: "3-putt avoidance", description: "Putt 10 baller fra 1.5m. Mål: maks 1 miss.", category: "PUTTING", difficulty: 1, recommended_reps: 10, recommended_sets: 3, tags: ["putting", "kort", "presisjon"] },
  { name: "Ladder drill", description: "Putt fra 1m, 2m, 3m, 4m, 5m. Mål: 2 putts eller færre per distanse.", category: "PUTTING", difficulty: 2, recommended_reps: 5, recommended_sets: 3, tags: ["putting", "avstand", "rutine"] },
  { name: "Clock drill", description: "Plasser 6 baller rundt hullet som på en klokke (1.5m). Putt alle inn.", category: "PUTTING", difficulty: 3, recommended_reps: 6, recommended_sets: 3, tags: ["putting", "presisjon", "trykk"] },
  { name: "Chipping circle", description: "Chip 10 baller inn i en 2m sirkel fra 10m avstand.", category: "CHIP_PITCH_10_50", difficulty: 2, recommended_reps: 10, recommended_sets: 2, tags: ["chip", "landingssone", "kontroll"] },
  { name: "Up-and-down challenge", description: "5 forskjellige ligginger rundt green. Mål: 3/5 up-and-down.", category: "CHIP_PITCH_10_50", difficulty: 3, recommended_reps: 5, recommended_sets: 2, tags: ["chip", "pitch", "scrambling"] },
  { name: "Bunker splash", description: "10 bunkerslag til pin. Mål: 7/10 på green.", category: "BUNKER", difficulty: 2, recommended_reps: 10, recommended_sets: 2, tags: ["bunker", "sand", "kontakt"] },
  { name: "Bunker distanse-kontroll", description: "3 forskjellige avstander (5m, 10m, 15m). 5 baller hver.", category: "BUNKER", difficulty: 3, recommended_reps: 5, recommended_sets: 3, tags: ["bunker", "avstand", "variasjon"] },
  { name: "50-100m target practice", description: "10 slag til green fra 50-100m. Track proximity.", category: "APPROACH_50_100", difficulty: 2, recommended_reps: 10, recommended_sets: 2, tags: ["approach", "wedge", "nøyaktighet"] },
  { name: "100-150m dispersion", description: "20 slag til samme target. Mål: <10m dispersion.", category: "APPROACH_100_150", difficulty: 3, recommended_reps: 20, recommended_sets: 1, tags: ["approach", "jern", "dispersion"] },
  { name: "150-200m carry challenge", description: "10 slag. Mål: 7/10 carry over vann/slette.", category: "APPROACH_150_200", difficulty: 3, recommended_reps: 10, recommended_sets: 2, tags: ["approach", "langt-jern", "hybrid"] },
  { name: "Fairway finder", description: "10 drivere. Mål: 7/10 i fairway.", category: "TEE_OFF_THE_TEE", difficulty: 2, recommended_reps: 10, recommended_sets: 2, tags: ["driver", "fairway", "nøyaktighet"] },
  { name: "Shape drill", description: "5 draw, 5 fade. Mål: 6/10 treffer ønsket shape.", category: "TEE_OFF_THE_TEE", difficulty: 4, recommended_reps: 10, recommended_sets: 2, tags: ["driver", "shape", "kontroll"] },
  { name: "Pre-shot rutine", description: "Gjennomfør full pre-shot rutine på alle slag i 9 hull.", category: "MENTAL_GAME", difficulty: 2, recommended_reps: 9, recommended_sets: 1, tags: ["mental", "rutine", "fokus"] },
  { name: "Rotasjons-styrke", description: "Medisinball-roteringer og core-øvelser. 3x12 reps.", category: "PHYSICAL", difficulty: 2, recommended_reps: 12, recommended_sets: 3, tags: ["fysisk", "core", "rotasjon"] },
];

async function seed() {
  const client = await pool.connect();
  try {
    // Sjekk om det finnes en admin
    const adminRes = await client.query('SELECT id FROM "User" WHERE role = \'ADMIN\' LIMIT 1');
    if (adminRes.rows.length === 0) {
      console.log("❌ Ingen ADMIN-bruker funnet.");
      process.exit(1);
    }
    const adminId = adminRes.rows[0].id;

    // Sjekk eksisterende driller
    const countRes = await client.query('SELECT COUNT(*) FROM "Drill"');
    const existingCount = parseInt(countRes.rows[0].count, 10);
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} driller finnes allerede. Hopper over seed.`);
      return;
    }

    for (const drill of DEFAULT_DRILLS) {
      await client.query(
        `INSERT INTO "Drill" (id, name, description, category, difficulty, "recommendedReps", "recommendedSets", "mediaUrls", tags, "isActive", "createdBy", "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, true, $9, NOW())`,
        [drill.name, drill.description, drill.category, drill.difficulty, drill.recommended_reps, drill.recommended_sets, [], drill.tags, adminId]
      );
    }

    console.log(`✅ ${DEFAULT_DRILLS.length} driller seedet.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((e) => {
  console.error("❌ Seed feilet:", e.message);
  process.exit(1);
});
