/**
 * Seed-script: Migrer DRILL_LIBRARY → ExerciseDefinition (Prisma).
 *
 * Kjøres med: npx tsx scripts/seed-exercise-definitions.ts
 *
 * Idempotent — hopper over rader som allerede finnes (basert på id).
 * Mapper gamle ak-formula-typer til nye ak-taxonomy-verdier.
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL eller DATABASE_URL må være satt");
}

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ── Data fra DRILL_LIBRARY (lib/portal/golf/exercise-types.ts) ──
// Mapper gamle area/lPhase-koder til ak-taxonomy.ts-format.

const exercises = [
  {
    id: "gate-drill-putting",
    name: "Gate Drill - Putting",
    description: "Sett opp tees som porter for å trene linje",
    instructions:
      "Plasser to tees som en port litt bredere enn ballen. Putt gjennom porten 10 ganger.",
    pyramid: "TEK",
    area: "PUTT3-5",
    lPhase: "L-KØLLE",
    equipment: ["Putter", "3 baller", "4 tees"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    tags: ["putting", "linje", "teknikk"],
  },
  {
    id: "clock-drill",
    name: "Klokke-drill",
    description: "Putts fra alle retninger rundt hullet",
    instructions:
      "Plasser baller i en sirkel rundt hullet. Start på 3 fot, treff alle før du går til 6 fot.",
    pyramid: "SLAG",
    area: "PUTT3-5",
    lPhase: "L-BALL",
    equipment: ["Putter", "8 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 20,
    difficulty: 3,
    tags: ["putting", "break", "press"],
  },
  {
    id: "ladder-drill",
    name: "Stige-drill",
    description: "Progressiv avstandskontroll",
    instructions:
      "Putt til 10, 20, 30, 40 fot. Mål: Stopp ballen innenfor 3 fot fra hvert mål.",
    pyramid: "SLAG",
    area: "PUTT25-40",
    lPhase: "L-BALL",
    equipment: ["Putter", "4 baller", "4 tees som markører"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    tags: ["putting", "fartskontroll", "avstander"],
  },
  {
    id: "up-and-down-challenge",
    name: "Up-and-down Challenge",
    description: "10 forskjellige posisjoner rundt green",
    instructions:
      "Spill 10 baller fra forskjellige posisjoner. Mål: 6/10 opp og ned.",
    pyramid: "SPILL",
    area: "CHIP",
    lPhase: "L-AUTO",
    equipment: ["Wedges", "Putter", "10 baller"],
    minDurationMinutes: 15,
    maxDurationMinutes: 25,
    difficulty: 3,
    tags: ["nærspill", "spill", "scoring"],
  },
  {
    id: "distance-control-pitching",
    name: "Avstandskontroll - Pitching",
    description: "Treff spesifikke avstander med pitch",
    instructions:
      "Sett opp mål på 30, 40, 50 meter. Treff 3 av 5 på hver avstand.",
    pyramid: "SLAG",
    area: "PITCH",
    lPhase: "L-BALL",
    equipment: ["Wedge", "15 baller", "Avstands-markører"],
    minDurationMinutes: 15,
    maxDurationMinutes: 20,
    difficulty: 3,
    tags: ["nærspill", "avstandskontroll", "pitching"],
  },
  {
    id: "bunker-basics",
    name: "Bunker - Grunnleggende",
    description: "Fokus på å ta sand først",
    instructions:
      "Tegn en linje i sanden. Treff sanden FØR linjen. 10 slag med fokus på inngang.",
    pyramid: "TEK",
    area: "BUNKER",
    lPhase: "L-KROPP",
    equipment: ["Sand wedge", "10 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    tags: ["bunker", "teknikk", "sand"],
  },
  {
    id: "alignment-station",
    name: "Alignment Station",
    description: "Sikter-drill med stikker",
    instructions:
      "Legg ned to stikker for føtter og mållinje. Fokus på square setup.",
    pyramid: "TEK",
    area: "INN150",
    lPhase: "L-KROPP",
    equipment: ["Jern", "10 baller", "2 alignment sticks"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    tags: ["teknikk", "sikting", "setup"],
  },
  {
    id: "tempo-drill",
    name: "Tempo Drill 3-1",
    description: "Svingtempo med telling",
    instructions:
      "Tell 1-2-3 på baksving, pause, 1 på nedsving. Fokus på jevn rytme.",
    pyramid: "TEK",
    area: "TEE",
    lPhase: "L-ARM",
    equipment: ["Driver", "10 baller"],
    minDurationMinutes: 10,
    maxDurationMinutes: 15,
    difficulty: 2,
    tags: ["teknikk", "tempo", "rytme", "driver"],
  },
  {
    id: "stock-shot-7iron",
    name: "Stock Shot - 7-jern",
    description: "Bygg konsistent standardslag",
    instructions:
      "Slå 20 baller med 7-jern. Fokus på samme ballflukt hver gang. Mål: 15/20 i målområdet.",
    pyramid: "SLAG",
    area: "INN150",
    lPhase: "L-BALL",
    equipment: ["7-jern", "20 baller"],
    minDurationMinutes: 15,
    maxDurationMinutes: 20,
    difficulty: 2,
    tags: ["slag", "konsistens", "jern"],
  },
];

async function main() {
  let created = 0;
  let skipped = 0;

  for (const ex of exercises) {
    const existing = await prisma.exerciseDefinition.findUnique({
      where: { id: ex.id },
    });

    if (existing) {
      skipped++;
      console.log(`  SKIP (finnes): ${ex.name}`);
      continue;
    }

    await prisma.exerciseDefinition.create({
      data: {
        id: ex.id,
        name: ex.name,
        description: ex.description,
        instructions: ex.instructions,
        pyramid: ex.pyramid,
        area: ex.area,
        lPhase: ex.lPhase,
        equipment: ex.equipment,
        minDurationMinutes: ex.minDurationMinutes,
        maxDurationMinutes: ex.maxDurationMinutes,
        difficulty: ex.difficulty,
        isPublic: true,
        isSystemDrill: true,
        tags: ex.tags,
        updatedAt: new Date(),
      },
    });

    created++;
    console.log(`  CREATE: ${ex.name} (${ex.pyramid} / ${ex.area} / ${ex.lPhase})`);
  }

  console.log(`\n✅ Ferdig: ${created} opprettet, ${skipped} hoppet over.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
