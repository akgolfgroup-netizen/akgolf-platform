/**
 * Seed: Default DECADE strategy for all existing holes
 * Kjor: npx tsx prisma/seed-course-strategy.ts
 */
import "dotenv/config";
import { prisma } from "../lib/portal/prisma";

function generateStrategy(hole: { par: number; lengthMeter: number; handicap: number | null }) {
  const recommendedClub =
    hole.lengthMeter > 400
      ? "Driver"
      : hole.lengthMeter > 300
      ? "3W"
      : hole.lengthMeter > 200
      ? "7I"
      : "Wedge";
  const aimPoint = (hole.handicap ?? 9) <= 5 ? "Sikkert senter fairway" : "Midt fairway";
  const targetZone =
    hole.par === 5
      ? "Green i 2 / opp-ned"
      : hole.par === 3
      ? "Midt green"
      : "Fairway -> green";
  const dangerAreas = (hole.handicap ?? 9) <= 5 ? ["Bunkere", "Rough"] : ["Venstre rough"];

  return {
    recommendedClub,
    aimPoint,
    targetZone,
    dangerAreas,
  };
}

async function seedStrategy() {
  console.log("Seeding default DECADE strategy for all holes...");

  const courses = await prisma.course.findMany({
    include: { Hole: true },
  });

  let updated = 0;
  for (const course of courses) {
    for (const hole of course.Hole) {
      const strategy = generateStrategy(hole);
      await prisma.hole.update({
        where: { id: hole.id },
        data: { strategy },
      });
      updated++;
    }
    console.log(`  ✓ ${course.name} (${course.Hole.length} hull)`);
  }

  console.log(`\nFerdig! ${updated} hull oppdatert med strategi.`);
}

seedStrategy()
  .catch((e) => {
    console.error("Feil ved seeding av strategi:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
