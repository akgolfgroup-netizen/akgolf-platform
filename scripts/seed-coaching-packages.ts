import "dotenv/config";
import { prisma } from "../lib/portal/prisma";

const COACHING_PACKAGES = [
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
    description: "2 × 20 min individuell coaching/mnd med selvbooking 7 dager frem. Full spillerportal med treningsplan, øvelsesbank og progresjonslogging.",
    features: [
      "2 × 20 min individuell coaching/mnd",
      "Selvbooking 7 dager frem",
      "TrackMan-data logget i profilen",
      "Full spillerportal med treningsplan",
      "Øvelsesbank med HD-video",
      "Treningsdagbok og statistikk",
      "AI-analyse og benchmarking",
    ],
    sortOrder: 2,
  },
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
    description: "4 × 20 min individuell coaching/mnd med prioritert booking 14 dager frem. Full spillerportal. For deg som vil utvikle deg raskt.",
    features: [
      "4 × 20 min individuell coaching/mnd",
      "Selvbooking 14 dager frem",
      "Prioritert booking foran Performance",
      "Maks 2 bookinger per uke",
      "TrackMan-data logget i profilen",
      "Full spillerportal med treningsplan",
      "Coaching-notater etter hver sesjon",
    ],
    sortOrder: 1,
  },
  {
    name: "Junior Academy",
    slug: "junior-academy",
    priceNok: 2500,
    billingType: "RECURRING" as const,
    bookingType: "SELF_BOOK" as const,
    sessionsPerMonth: null, // Gruppetrening, ikke individuelt
    sessionDurationMin: 60,
    bookingWindowDays: 7,
    maxBookingsPerWeek: null,
    maxPlayersPerSlot: 8,
    description: "Strukturert gruppetrening for juniorer med nivåtilpasset program. Konkurranseveiledning, periodisering og foreldresamarbeid.",
    features: [
      "Nivåtilpasset gruppetrening",
      "Konkurranseveiledning",
      "Periodisering",
      "Foreldresamarbeid",
      "Spillerportal med treningsplan",
    ],
    sortOrder: 3,
  },
  {
    name: "Junior Elite",
    slug: "junior-elite",
    priceNok: 2500,
    billingType: "RECURRING" as const,
    bookingType: "FIXED" as const,
    sessionsPerMonth: 8,
    sessionDurationMin: 20,
    bookingWindowDays: 14,
    maxBookingsPerWeek: 2,
    description: "8 × 20 min individuell coaching/mnd (2/uke) med faste tider tirsdag og torsdag. TrackMan-analyse og full spillerportal. Maks 5 plasser.",
    features: [
      "8 × 20 min individuell coaching/mnd (2/uke)",
      "Faste tider tirsdag og torsdag",
      "TrackMan-analyse integrert i hver sesjon",
      "Full tilgang til spillerportalen",
      "Personlig treningsplan oppdatert etter hver sesjon",
      "Progresjonslogging synlig for junior og foreldre",
      "Øvelsesbank med video tilpasset juniorens nivå",
      "Turneringskalender og sesongplanlegging",
    ],
    sortOrder: 4,
  },
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
    description: "50 minutter coaching — ingen binding. Book ledige tider 48 timer i forveien. Du får coaching-notater i appen etterpå.",
    features: [
      "1 × 50 min individuell coaching",
      "TrackMan tilgjengelig i sesjonen",
      "Coaching-notater i appen etter sesjonen",
    ],
    sortOrder: 5,
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
    description: "90 minutter dypdykk med full TrackMan-analyse — ingen binding. Book ledige tider 48 timer i forveien.",
    features: [
      "1 × 90 min individuell coaching",
      "Full TrackMan-analyse med gjennomgang",
      "Coaching-notater i appen etter sesjonen",
    ],
    sortOrder: 6,
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
        data: pkg,
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
