/**
 * Seed-script for coaching-pakker og tilgjengelighet.
 *
 * Oppdatert: 2026-03-26 — AK Golf Academy 2026 konsept
 *
 * Pakker:
 * - AK Performance: 1 600 kr/mnd, 2×20 min, 7 dager booking, maks 1/uke
 * - AK Performance Pro: 2 000 kr/mnd, 4×20 min, 14 dager booking, maks 2/uke
 *
 * Anders' timeplan (GFGK hovedlokasjon):
 * - Mandag: 12:00–20:00 (annenhver)
 * - Tirsdag: 13:00–20:00 (fast)
 * - Onsdag: 12:00–16:00 (GFGK fra 16:00)
 * - Torsdag: 13:00–20:00 (fast)
 * - Fredag: 10:00–14:00 (annenhver Miklagard 13:00–19:00)
 * - Pause: 14:00–15:00 hver dag (henting)
 *
 * Kjør med: npx tsx prisma/seed-coaching.ts
 */
import "dotenv/config";
import { nanoid } from "nanoid";
import { prisma } from "../lib/portal/prisma";
import { BillingType, CoachingBookingType } from "@prisma/client";

async function main() {
  console.log("🌱 Seeder coaching-data (AK Golf Academy 2026)...\n");

  // ============================================================
  // 1. Slett gamle feilaktige pakker
  // ============================================================
  const deletedPackages = await prisma.coachingPackage.deleteMany({
    where: {
      slug: { in: ["flex", "starter", "pro", "elite"] },
    },
  });
  if (deletedPackages.count > 0) {
    console.log(`🗑️  Slettet ${deletedPackages.count} gamle pakker (Flex, Starter, Pro, Elite)`);
  }

  // ============================================================
  // 2. Coaching-pakker (AK Golf Academy 2026)
  // ============================================================
  const packages = [
    {
      name: "Performance",
      slug: "performance",
      priceNok: 1600,
      billingType: BillingType.RECURRING,
      bookingType: CoachingBookingType.SELF_BOOK,
      sessionsPerMonth: 2,
      sessionDurationMin: 20,
      bookingWindowDays: 7,
      maxBookingsPerWeek: 1,
      slotsRequired: 1,
      description: "2 × 20 min individuell per måned. Selvbooking 7 dager frem.",
      features: [
        "2 økter/mnd",
        "20 min/økt",
        "7 dagers booking",
        "Full spillerportal",
        "Videoanalyse",
        "Treningsplan",
      ],
      sortOrder: 1,
    },
    {
      name: "Performance Pro",
      slug: "performance-pro",
      priceNok: 2000,
      billingType: BillingType.RECURRING,
      bookingType: CoachingBookingType.SELF_BOOK,
      sessionsPerMonth: 4,
      sessionDurationMin: 20,
      bookingWindowDays: 14,
      maxBookingsPerWeek: 2,
      slotsRequired: 1,
      description: "4 × 20 min individuell per måned. Prioritert booking 14 dager frem.",
      features: [
        "4 økter/mnd",
        "20 min/økt",
        "14 dagers booking",
        "Prioritert tilgang",
        "Ubegrenset videoanalyse",
        "Personlig treningsplan",
        "Direkte kontakt med coach",
      ],
      sortOrder: 2,
    },
  ];

  for (const pkg of packages) {
    const existing = await prisma.coachingPackage.findUnique({
      where: { slug: pkg.slug },
    });

    if (existing) {
      console.log(`  ⏩ ${pkg.name} finnes allerede, oppdaterer...`);
      await prisma.coachingPackage.update({
        where: { slug: pkg.slug },
        data: pkg,
      });
    } else {
      console.log(`  ✅ Oppretter ${pkg.name} (${pkg.priceNok} kr/mnd)`);
      await prisma.coachingPackage.create({
        data: {
          id: nanoid(),
          updatedAt: new Date(),
          ...pkg,
        },
      });
    }
  }

  console.log(`\n📦 ${packages.length} coaching-pakker seedet.\n`);

  // ============================================================
  // 3. Coaching-tilgjengelighet (Anders' reelle timeplan)
  // ============================================================

  // Slett eksisterende for å unngå duplikater
  const deleted = await prisma.coachingAvailability.deleteMany({});
  console.log(`🗑️  Slettet ${deleted.count} eksisterende slots.\n`);

  // Generer 20-min slots med 5-min pause (25 min mellom hver start)
  const slots: { dayOfWeek: number; startTime: string; endTime: string }[] = [];

  /**
   * Anders' timeplan per dag:
   * - Mandag (1): 12:00–14:00, 15:00–20:00 (pause 14:00–15:00)
   * - Tirsdag (2): 13:00–14:00, 15:00–20:00 (pause 14:00–15:00)
   * - Onsdag (3): 12:00–14:00, 15:00–16:00 (GFGK juniortrening fra 16:00)
   * - Torsdag (4): 13:00–14:00, 15:00–20:00 (pause 14:00–15:00)
   * - Fredag (5): 10:00–14:00 (GFGK), pause (ingen fast ettermiddag)
   * - Lørdag (6): Varierende basert på turnus — ikke seeded, håndteres manuelt
   */

  const schedule: Record<number, { start: number; end: number }[]> = {
    1: [
      // Mandag
      { start: 12, end: 14 }, // 12:00–14:00
      { start: 15, end: 20 }, // 15:00–20:00
    ],
    2: [
      // Tirsdag
      { start: 13, end: 14 }, // 13:00–14:00
      { start: 15, end: 20 }, // 15:00–20:00
    ],
    3: [
      // Onsdag
      { start: 12, end: 14 }, // 12:00–14:00
      { start: 15, end: 16 }, // 15:00–16:00 (GFGK juniortrening fra 16:00)
    ],
    4: [
      // Torsdag
      { start: 13, end: 14 }, // 13:00–14:00
      { start: 15, end: 20 }, // 15:00–20:00
    ],
    5: [
      // Fredag
      { start: 10, end: 14 }, // 10:00–14:00
    ],
  };

  // Generer slots for hver dag
  for (const [dayStr, blocks] of Object.entries(schedule)) {
    const day = parseInt(dayStr);
    for (const block of blocks) {
      let hour = block.start;
      let minute = 0;

      while (hour < block.end || (hour === block.end && minute === 0)) {
        // Stopp hvis neste slot ville gå over blokken
        if (hour === block.end) break;

        const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;

        // Slutt 20 min senere
        let endHour = hour;
        let endMinute = minute + 20;
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }

        // Sjekk at slutten ikke går over blokken
        if (endHour > block.end || (endHour === block.end && endMinute > 0)) {
          break;
        }

        const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;

        slots.push({ dayOfWeek: day, startTime, endTime });

        // Neste slot starter 25 min senere (20 min + 5 min pause)
        minute += 25;
        if (minute >= 60) {
          hour += 1;
          minute -= 60;
        }
      }
    }
  }

  // Opprett alle slots
  await prisma.coachingAvailability.createMany({
    data: slots.map((slot) => ({
      id: nanoid(),
      updatedAt: new Date(),
      ...slot,
      isActive: true,
      reservedFor: null,
    })),
  });

  // Tell slots per dag
  const slotsPerDay: Record<number, number> = {};
  for (const slot of slots) {
    slotsPerDay[slot.dayOfWeek] = (slotsPerDay[slot.dayOfWeek] || 0) + 1;
  }

  const dayNames = ["", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

  console.log(`📅 ${slots.length} tilgjengelighets-slots opprettet:`);
  for (const [day, count] of Object.entries(slotsPerDay)) {
    const dayNum = parseInt(day);
    const blocks = schedule[dayNum];
    const timeRanges = blocks.map((b) => `${b.start}:00–${b.end}:00`).join(", ");
    console.log(`   - ${dayNames[dayNum]}: ${count} slots (${timeRanges})`);
  }

  console.log("\n⚠️  Merk: Pause 14:00–15:00 (henting) er eksludert fra alle dager.");
  console.log("⚠️  Merk: Lørdag håndteres manuelt (varierer med turnus).");
  console.log("⚠️  Merk: Miklagard-fredager (annenhver) legges til manuelt.\n");

  console.log("✅ Seeding fullført!");
}

main()
  .catch((e) => {
    console.error("❌ Feil under seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
