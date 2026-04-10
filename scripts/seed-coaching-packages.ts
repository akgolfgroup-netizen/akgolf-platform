import "dotenv/config";
import { nanoid } from "nanoid";
import { prisma } from "../lib/portal/prisma";

const COACHING_PACKAGES = [
  // ─── Anders — Abonnement (løpende portaltilgang) ───
  {
    name: "Performance Pro",
    slug: "performance-pro",
    priceNok: 2000,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: 4,
    sessionDurationMin: 20,
    bookingWindowDays: 14,
    maxBookingsPerWeek: 2,
    portalAccessDays: null, // Løpende
    description: "4 × 20 min individuell coaching/mnd med Anders. Prioritert booking 14 dager frem. Full spillerportal.",
    features: [
      "4 × 20 min individuell coaching/mnd",
      "Selvbooking 14 dager frem",
      "Prioritert booking",
      "TrackMan-analyse hver okt",
      "Personlig treningsplan",
      "Full spillerportal",
      "Ingen binding",
    ],
    sortOrder: 1,
  },
  {
    name: "Performance",
    slug: "performance",
    priceNok: 1600,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: 2,
    sessionDurationMin: 20,
    bookingWindowDays: 7,
    maxBookingsPerWeek: 1,
    portalAccessDays: null, // Løpende
    description: "2 × 20 min individuell coaching/mnd med Anders. Selvbooking 7 dager frem. Full spillerportal.",
    features: [
      "2 × 20 min individuell coaching/mnd",
      "Selvbooking 7 dager frem",
      "TrackMan-analyse hver okt",
      "Personlig treningsplan",
      "Full spillerportal",
      "Ingen binding",
    ],
    sortOrder: 2,
  },
  {
    name: "Gruppe",
    slug: "gruppe",
    priceNok: 900,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: 2,
    sessionDurationMin: 60,
    bookingWindowDays: 14,
    maxBookingsPerWeek: 1,
    maxPlayersPerSlot: 5,
    portalAccessDays: 90, // 3 mnd fra oppstart
    description: "2 × 60 min gruppecoaching/mnd med Anders. Maks 5 deltakere per okt. 3 mnd portaltilgang fra oppstart.",
    features: [
      "2 × 60 min gruppecoaching/mnd",
      "Maks 5 deltakere per okt",
      "TrackMan-analyse",
      "3 mnd spillerportal fra oppstart",
      "Ingen binding",
    ],
    sortOrder: 3,
  },

  // ─── Markus — Abonnement (3 mnd portaltilgang) ───
  {
    name: "Express",
    slug: "express",
    priceNok: 550,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: 2,
    sessionDurationMin: 20,
    bookingWindowDays: 7,
    maxBookingsPerWeek: 1,
    portalAccessDays: 90, // 3 mnd fra oppstart
    description: "2 × 20 min coaching/mnd med Markus. Korte, effektive okter. 3 mnd portaltilgang fra oppstart.",
    features: [
      "2 × 20 min coaching/mnd",
      "Selvbooking 7 dager frem",
      "3 mnd spillerportal fra oppstart",
      "Ingen binding",
    ],
    sortOrder: 4,
  },
  {
    name: "Express Pro",
    slug: "express-pro",
    priceNok: 1000,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: 4,
    sessionDurationMin: 20,
    bookingWindowDays: 14,
    maxBookingsPerWeek: 2,
    portalAccessDays: 90, // 3 mnd fra oppstart
    description: "4 × 20 min coaching/mnd med Markus. Raskere progresjon. 3 mnd portaltilgang fra oppstart.",
    features: [
      "4 × 20 min coaching/mnd",
      "Selvbooking 14 dager frem",
      "Maks 2 bookinger per uke",
      "3 mnd spillerportal fra oppstart",
      "Ingen binding",
    ],
    sortOrder: 5,
  },

  // ─── Markus — Kurs (engangskjøp, 3 mnd portaltilgang) ───
  {
    name: "First Tee",
    slug: "first-tee",
    priceNok: 1295,
    billingType: "ONE_TIME" as const,
    bookingType: "FIXED" as const,
    sessionsPerMonth: null,
    sessionDurationMin: 60,
    bookingWindowDays: null,
    maxBookingsPerWeek: null,
    maxPlayersPerSlot: 8,
    portalAccessDays: 90, // 3 mnd fra oppstart
    description: "Nybegynnerkurs med Markus. 3 × 60 min gruppetrening + 1 × banespill Par 3. 3 mnd portaltilgang.",
    features: [
      "3 × 60 min gruppetrening",
      "1 × banespill Par 3 (korthullsbanen)",
      "Maks 8 deltakere",
      "3 mnd spillerportal fra oppstart",
    ],
    sortOrder: 6,
  },

  // ─── Flex — drop-in (1 mnd portaltilgang) ───
  {
    name: "Flex 50",
    slug: "flex-50",
    priceNok: 1500,
    billingType: "ONE_TIME" as const,
    bookingType: "DROP_IN" as const,
    sessionsPerMonth: null,
    sessionDurationMin: 50,
    bookingWindowDays: null,
    bookingWindowHours: 48,
    maxBookingsPerWeek: null,
    portalAccessDays: 30, // 1 mnd fra øktdato
    description: "50 min coaching med Anders. Ingen binding. 1 mnd portaltilgang inkludert.",
    features: [
      "1 × 50 min individuell coaching",
      "TrackMan-analyse",
      "1 mnd spillerportal fra oktdato",
    ],
    sortOrder: 10,
  },
  {
    name: "Flex 90",
    slug: "flex-90",
    priceNok: 2500,
    billingType: "ONE_TIME" as const,
    bookingType: "DROP_IN" as const,
    sessionsPerMonth: null,
    sessionDurationMin: 90,
    bookingWindowDays: null,
    bookingWindowHours: 48,
    maxBookingsPerWeek: null,
    portalAccessDays: 30, // 1 mnd fra øktdato
    description: "90 min dybdecoaching med Anders. Ingen binding. 1 mnd portaltilgang inkludert.",
    features: [
      "1 × 90 min individuell coaching",
      "Full TrackMan-analyse",
      "1 mnd spillerportal fra oktdato",
    ],
    sortOrder: 11,
  },
  {
    name: "Flex 20",
    slug: "flex-20",
    priceNok: 300,
    billingType: "ONE_TIME" as const,
    bookingType: "DROP_IN" as const,
    sessionsPerMonth: null,
    sessionDurationMin: 20,
    bookingWindowDays: null,
    bookingWindowHours: 48,
    maxBookingsPerWeek: null,
    portalAccessDays: 30, // 1 mnd fra øktdato
    description: "20 min kort okt med Markus. Ingen binding. 1 mnd portaltilgang inkludert.",
    features: [
      "1 × 20 min coaching",
      "1 mnd spillerportal fra oktdato",
    ],
    sortOrder: 12,
  },
];

async function main() {
  console.log("Seeding coaching packages...\n");

  for (const pkg of COACHING_PACKAGES) {
    const existing = await prisma.coachingPackage.findUnique({
      where: { slug: pkg.slug },
    });

    if (existing) {
      // Oppdater eksisterende
      await prisma.coachingPackage.update({
        where: { slug: pkg.slug },
        data: pkg,
      });
      console.log(`  ✅ Oppdatert: ${pkg.name}`);
    } else {
      // Opprett ny
      await prisma.coachingPackage.create({
        data: {
          id: nanoid(),
          updatedAt: new Date(),
          ...pkg,
        },
      });
      console.log(`  ✅ Opprettet: ${pkg.name}`);
    }
  }

  // Deaktiver gamle pakker som ikke lenger brukes
  const activeSlugs = COACHING_PACKAGES.map((p) => p.slug);
  const deactivated = await prisma.coachingPackage.updateMany({
    where: {
      slug: { notIn: activeSlugs },
      isActive: true,
    },
    data: { isActive: false },
  });

  if (deactivated.count > 0) {
    console.log(`\n  ⚠️  Deaktivert ${deactivated.count} gamle pakker`);
  }

  console.log("\nFerdig!");
}

main()
  .catch((e) => {
    console.error("Feil:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
