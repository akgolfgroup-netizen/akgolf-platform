import "dotenv/config";
import { prisma } from "../lib/portal/prisma";
import { ServiceCategory } from "@prisma/client";

/**
 * Oppdaterer ServiceType-tabellen med produkter fra AK Golf Academy 2026 konsept.
 *
 * Oppdatert: 2026-03-26
 *
 * Produkter:
 * - AK Start (onboarding): 3 000 kr, 3×20 min over 3 uker + 30d portal
 * - Foundation Test: 995 kr, 50 min intro (refunderbar ved abo-kjøp)
 * - Flex 50 Solo: 1 500 kr, 50 min
 * - Flex 50 Duo: 850 kr/pers (1 700 kr total), 50 min
 * - Flex 90 Solo: 2 500 kr, 90 min
 * - Flex 90 Duo: 1 400 kr/pers (2 800 kr total), 90 min
 * - On-Course 9: 3 000 kr/spiller, 9 hull (~2.5 timer) — Anders
 * - On-Course Par 3: 500 kr/spiller — Markus
 * - Markus 20 min: 300 kr, 20 min
 *
 * Booking-vindu: Drop-in/Flex har 48t vindu (minNoticeHours: 48)
 * Abonnement (Performance Pro/Performance) håndteres av Stripe.
 */

const NEW_SERVICE_TYPES = [
  // ─── Onboarding ───
  {
    name: "Start",
    description:
      "Din inngangsport til strukturert coaching. 3 × 20-minutters økter over 3 uker + 30 dagers tilgang til spillerportalen. Kartlegging, spillerprofilbygging og personlig utviklingsplan.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20, // Per økt
    price: 3000,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 1,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 60,
  },
  {
    name: "Foundation Test",
    description:
      "50 minutters introduksjonstime for nye spillere. Full kartlegging av spillet ditt og anbefaling om veien videre. Refunderbar ved kjøp av abonnement innen 14 dager.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 50,
    price: 995,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 2,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 30,
  },
  // ─── Drop-in / Flex (48t booking-vindu) ───
  {
    name: "Flex 50 Solo",
    description:
      "50 minutters intensiv coaching én-til-én. Full gjennomgang av et fokusområde med videoanalyse og øvelser.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 50,
    price: 1500,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 10,
    vatRate: 0,
    minNoticeHours: 48, // Drop-in: 48t vindu
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 50 Duo",
    description:
      "50 minutters coaching for to spillere. Del på opplevelsen og kostnaden. 850 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 50,
    price: 1700, // Totalpris: 850 × 2
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 11,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 90 Solo",
    description:
      "90 minutters dybdecoaching én-til-én. Tid til å jobbe grundig med flere områder, inkludert on-range praksis.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 90,
    price: 2500,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 12,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  {
    name: "Flex 90 Duo",
    description:
      "90 minutters dybdecoaching for to spillere. 1 400 kr per person.",
    category: ServiceCategory.GROUP,
    duration: 90,
    price: 2800, // Totalpris: 1400 × 2
    maxStudents: 2,
    isActive: true,
    isPublic: true,
    sortOrder: 13,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 14,
  },
  // ─── Banecoaching ───
  {
    name: "On-Course 9",
    description:
      "Banecoaching over 9 hull med Anders. Live kursmanagement med DECADE-prinsipper. Strategisk gjennomgang basert på spredningsdata. Maks 2 spillere.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 150, // ~2.5 timer
    price: 3000,
    maxStudents: 2, // Maks 2 spillere
    isActive: true,
    isPublic: true,
    sortOrder: 20,
    vatRate: 0,
    minNoticeHours: 48,
    maxAdvanceDays: 30,
  },
  {
    name: "On-Course Par 3",
    description:
      "9 hull på korthullsbanen med Markus. Grunnleggende banemanagement for nybegynnere. Score logges i appen. Grupper à 4 spillere.",
    category: ServiceCategory.PLAYING_LESSON,
    duration: 90, // ~90 min
    price: 500,
    maxStudents: 4,
    isActive: true,
    isPublic: true,
    sortOrder: 21,
    vatRate: 0,
    minNoticeHours: 24,
    maxAdvanceDays: 14,
  },
  // ─── Markus individuell ───
  {
    name: "Markus 20 min",
    description:
      "Kort treningsøkt med Markus Hatlelid. Perfekt for raske justeringer eller oppfølging mellom hovedøktene.",
    category: ServiceCategory.INDIVIDUAL,
    duration: 20,
    price: 300,
    maxStudents: 1,
    isActive: true,
    isPublic: true,
    sortOrder: 30,
    vatRate: 0,
    minNoticeHours: 12,
    maxAdvanceDays: 30,
  },
  // ─── Gruppekonsepter (krever lengre planleggingstid) ───
  {
    name: "Gameday",
    description:
      "Full dag på banen med coaching, banemanagement og konkurranse. Inkluderer Trackman-analyse, lunsj og premiering. Maks 12 deltakere.",
    category: ServiceCategory.GROUP,
    duration: 240, // 3-5 timer
    price: 2500, // Per person
    maxStudents: 12,
    isActive: true,
    isPublic: true,
    sortOrder: 40,
    vatRate: 0,
    minNoticeHours: 168, // 7 dager
    maxAdvanceDays: 90,
  },
  {
    name: "Første Sesong",
    description:
      "8-ukers program for nybegynnere. 90 min coaching hver uke, grunnleggende teknikk, kortspill, etikette og baneintro. Maks 12 deltakere per kull.",
    category: ServiceCategory.VTG_COURSE,
    duration: 90, // Per økt
    price: 4500, // Totalpris for hele kurset
    maxStudents: 12,
    isActive: true,
    isPublic: true,
    sortOrder: 41,
    vatRate: 0,
    minNoticeHours: 336, // 14 dager
    maxAdvanceDays: 120,
  },
  {
    name: "AK 9",
    description:
      "Ukentlig sosial golfrunde med coaching-elementer. 9 hull på Par 3-banen med Markus. Lavterskel og hyggelig. Maks 16 deltakere.",
    category: ServiceCategory.GROUP,
    duration: 120,
    price: 250, // Per kveld
    maxStudents: 16,
    isActive: true,
    isPublic: true,
    sortOrder: 42,
    vatRate: 0,
    minNoticeHours: 48, // 2 dager
    maxAdvanceDays: 30,
  },
  {
    name: "After Work",
    description:
      "3 timers golfopplevelse etter jobb. Driving range, kortspill og avslappet sosialt samvær. Perfekt for kollegaer eller vennegrupper. Maks 24 deltakere.",
    category: ServiceCategory.GROUP,
    duration: 180,
    price: 500, // Per person
    maxStudents: 24,
    isActive: true,
    isPublic: true,
    sortOrder: 43,
    vatRate: 0,
    minNoticeHours: 168, // 7 dager
    maxAdvanceDays: 60,
  },
  {
    name: "Bedriftsgolf",
    description:
      "Premium bedriftsevent med coaching, konkurranse og servering. Tilpasset opplegg for firmaet ditt. Maks 16 deltakere.",
    category: ServiceCategory.GROUP,
    duration: 180,
    price: 2500, // Per person
    maxStudents: 16,
    isActive: true,
    isPublic: true,
    sortOrder: 44,
    vatRate: 0,
    minNoticeHours: 336, // 14 dager
    maxAdvanceDays: 90,
  },
  {
    name: "Vintertrening",
    description:
      "6-ukers vinterprogram på innendørs simulator. 90 min coaching per uke med Trackman-analyse og øvelser. Maks 8 deltakere.",
    category: ServiceCategory.SIMULATOR,
    duration: 90, // Per økt
    price: 3500, // Totalpris for hele kurset
    maxStudents: 8,
    isActive: true,
    isPublic: true,
    sortOrder: 45,
    vatRate: 0,
    minNoticeHours: 336, // 14 dager
    maxAdvanceDays: 90,
  },
  // ─── Junior Academy ───
  {
    name: "Junior Academy",
    description:
      "Månedsbasert treningsprogram for juniorer (13-18 år) som satser. Ukentlig coaching, konkurranseforberedelse og treningsplan. 12 mnd binding.",
    category: ServiceCategory.GROUP,
    duration: 90, // Per økt
    price: 2500, // Per måned
    maxStudents: 12,
    isActive: true,
    isPublic: true,
    sortOrder: 50,
    vatRate: 0,
    minNoticeHours: 0, // Abonnement
    maxAdvanceDays: 0,
  },
  {
    name: "Junior Prospect",
    description:
      "Utviklingsprogram for yngre juniorer (10-14 år). Fokus på teknikk, motorikk og glede ved golf. Ukentlig trening i grupper. 12 mnd binding.",
    category: ServiceCategory.GROUP,
    duration: 60, // Per økt
    price: 2000, // Per måned
    maxStudents: 16,
    isActive: true,
    isPublic: true,
    sortOrder: 51,
    vatRate: 0,
    minNoticeHours: 0,
    maxAdvanceDays: 0,
  },
  {
    name: "Junior Camp",
    description:
      "Intensiv golfcamp for juniorer i ferier. 4 dager med coaching, spill og konkurranser. Inkluderer lunsj og premier.",
    category: ServiceCategory.GROUP,
    duration: 300, // Per dag (5 timer)
    price: 4500, // Totalpris
    maxStudents: 20,
    isActive: true,
    isPublic: true,
    sortOrder: 52,
    vatRate: 0,
    minNoticeHours: 168, // 7 dager
    maxAdvanceDays: 90,
  },
];

async function main() {
  console.log("🔄 Oppdaterer ServiceType-tabellen...\n");

  // Deaktiver gamle tjenester
  const deactivated = await prisma.serviceType.updateMany({
    where: {
      isActive: true,
      name: {
        notIn: NEW_SERVICE_TYPES.map((s) => s.name),
      },
    },
    data: {
      isActive: false,
      isPublic: false,
    },
  });
  console.log(`⏸️  Deaktiverte ${deactivated.count} gamle tjenester`);

  // Opprett eller oppdater nye tjenester
  for (const service of NEW_SERVICE_TYPES) {
    const existing = await prisma.serviceType.findFirst({
      where: { name: service.name },
    });

    if (existing) {
      await prisma.serviceType.update({
        where: { id: existing.id },
        data: service,
      });
      console.log(`✏️  Oppdatert: ${service.name} → ${service.price} kr`);
    } else {
      await prisma.serviceType.create({
        data: service,
      });
      console.log(`➕ Opprettet: ${service.name} → ${service.price} kr`);
    }
  }

  // Vis oppsummering
  const activeServices = await prisma.serviceType.findMany({
    where: { isActive: true, isPublic: true },
    orderBy: { sortOrder: "asc" },
    select: { name: true, price: true, duration: true, category: true },
  });

  console.log("\n📋 Aktive tjenester i booking-systemet:");
  console.log("─".repeat(60));
  for (const s of activeServices) {
    console.log(
      `  ${s.name.padEnd(25)} ${String(s.price).padStart(5)} kr  ${String(s.duration).padStart(3)} min  ${s.category}`
    );
  }
  console.log("─".repeat(60));
  console.log(`✅ Totalt ${activeServices.length} aktive tjenester\n`);
}

main()
  .catch((e) => {
    console.error("❌ Feil:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
