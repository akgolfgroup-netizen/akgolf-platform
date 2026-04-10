/**
 * Implementerer booking-system for 7 kjernetjenester:
 * 
 * Abonnement (2):
 * - Performance Pro: 2 000 kr/mnd, 4×20 min, 14 dager booking, Anders
 * - Performance: 1 600 kr/mnd, 2×20 min, 7 dager booking, Anders
 * 
 * Drop-in/Flex (5):
 * - Flex 50: 1 500 kr, 50 min, 48t vindu, Anders
 * - Flex 50 Duo: 1 700 kr (850×2), 50 min, 48t vindu, Anders
 * - Flex 90: 2 500 kr, 90 min, 48t vindu, Anders
 * - Flex 90 Duo: 2 800 kr (1 400×2), 90 min, 48t vindu, Anders
 * - Flex 20: 300 kr, 20 min, 12t vindu, Markus
 * 
 * Kjør: npx tsx prisma/seed-booking-implementation.ts
 */

import "dotenv/config";
import { prisma } from "../lib/portal/prisma";
import { randomUUID } from "crypto";

async function main() {
  console.log("🔧 Implementerer booking-system for 7 kjernetjenester...\n");

  // ============================================================
  // 1. FINN ELLER OPPRETT INSTRUKTØRER
  // ============================================================
  console.log("👥 Sjekker instruktører...");

  // Anders Kristiansen
  let anders = await prisma.instructor.findFirst({
    where: {
      User: {
        email: "anders@akgolf.no",
      },
    },
    include: { User: true },
  });

  if (!anders) {
    console.log("  ➕ Oppretter Anders Kristiansen...");
    const andersUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: "anders@akgolf.no",
        name: "Anders Kristiansen",
        phone: "+47 909 67 995",
        role: "INSTRUCTOR",
        updatedAt: new Date(),
      },
    });
    anders = await prisma.instructor.create({
      data: {
        id: randomUUID(),
        userId: andersUser.id,
        title: "Hovedcoach & CEO",
        bio: "Grunnlegger av AK Sports OS. PGA Tour, DP World Tour erfaring. TrackMan og DECADE sertifisert.",
        specialization: "Teknisk coaching, TrackMan, banemanagement",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: { User: true },
    });
  } else {
    console.log("  ✓ Anders Kristiansen funnet");
  }

  // Markus
  let markus = await prisma.instructor.findFirst({
    where: {
      User: {
        email: "markus@akgolf.no",
      },
    },
    include: { User: true },
  });

  if (!markus) {
    console.log("  ➕ Oppretter Markus...");
    const markusUser = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: "markus@akgolf.no",
        name: "Markus Hatlelid",
        phone: "+47 905 86 097",
        role: "INSTRUCTOR",
        updatedAt: new Date(),
      },
    });
    markus = await prisma.instructor.create({
      data: {
        id: randomUUID(),
        userId: markusUser.id,
        title: "Assistentcoach",
        bio: "College-golf fra USA. Spesialisert på gruppetrening og nybegynneropplæring.",
        specialization: "Gruppetrening, korthull, nybegynnere",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: { User: true },
    });
  } else {
    console.log("  ✓ Markus funnet");
  }

  // ============================================================
  // 2. FINN ELLER OPPRETT LOKASJON (GFGK)
  // ============================================================
  console.log("\n📍 Sjekker lokasjon...");

  let gfgk = await prisma.location.findFirst({
    where: {
      name: {
        contains: "Gamle Fredrikstad",
        mode: "insensitive",
      },
    },
  });

  if (!gfgk) {
    console.log("  ➕ Oppretter GFGK...");
    gfgk = await prisma.location.create({
      data: {
        id: randomUUID(),
        name: "Gamle Fredrikstad Golfklubb",
        address: "Golfbaneveien 1, 1605 Fredrikstad",
        updatedAt: new Date(),
      },
    });
  } else {
    console.log("  ✓ GFGK funnet");
  }

  // ============================================================
  // 3. KOBLE INSTRUKTØRER TIL TJENESTER
  // ============================================================
  console.log("\n🔗 Kobler instruktører til tjenester...");

  // Abonnement (Performance Pro & Performance) -> Anders
  const abonnementServices = ["Performance Pro", "Performance"];
  for (const serviceName of abonnementServices) {
    const service = await prisma.serviceType.findFirst({
      where: { name: serviceName },
    });

    if (service) {
      // Sjekk om kobling finnes
      const existingLink = await prisma.instructor.findFirst({
        where: {
          id: anders.id,
          ServiceType: {
            some: { id: service.id },
          },
        },
      });

      if (!existingLink) {
        await prisma.instructor.update({
          where: { id: anders.id },
          data: {
            ServiceType: {
              connect: { id: service.id },
            },
          },
        });
        console.log(`  ✓ ${serviceName} → Anders`);
      } else {
        console.log(`  ⏩ ${serviceName} allerede koblet til Anders`);
      }
    }
  }

  // Flex tjenester -> Anders
  const flexServices = ["Flex 50", "Flex 50 Duo", "Flex 90", "Flex 90 Duo"];
  for (const serviceName of flexServices) {
    const service = await prisma.serviceType.findFirst({
      where: { name: serviceName },
    });

    if (service) {
      const existingLink = await prisma.instructor.findFirst({
        where: {
          id: anders.id,
          ServiceType: {
            some: { id: service.id },
          },
        },
      });

      if (!existingLink) {
        await prisma.instructor.update({
          where: { id: anders.id },
          data: {
            ServiceType: {
              connect: { id: service.id },
            },
          },
        });
        console.log(`  ✓ ${serviceName} → Anders`);
      } else {
        console.log(`  ⏩ ${serviceName} allerede koblet til Anders`);
      }
    }
  }

  // Flex 20 -> Markus
  const markusService = await prisma.serviceType.findFirst({
    where: { name: "Flex 20" },
  });

  if (markusService) {
    const existingLink = await prisma.instructor.findFirst({
      where: {
        id: markus.id,
        ServiceType: {
          some: { id: markusService.id },
        },
      },
    });

    if (!existingLink) {
      await prisma.instructor.update({
        where: { id: markus.id },
        data: {
          ServiceType: {
            connect: { id: markusService.id },
          },
        },
      });
      console.log(`  ✓ Flex 20 → Markus`);
    } else {
      console.log(`  ⏩ Flex 20 allerede koblet til Markus`);
    }
  }

  // ============================================================
  // 4. SETT OPP TILGJENGELIGHET (Anders - GFGK 2026)
  // ============================================================
  console.log("\n📅 Setter opp tilgjengelighet for Anders (GFGK)...");

  const andersAvailability = [
    { dayOfWeek: 1, startTime: "12:00", endTime: "14:00" }, // Mandag (før pause)
    { dayOfWeek: 1, startTime: "15:00", endTime: "20:00" }, // Mandag (etter pause)
    { dayOfWeek: 2, startTime: "13:00", endTime: "14:00" }, // Tirsdag
    { dayOfWeek: 2, startTime: "15:00", endTime: "20:00" },
    { dayOfWeek: 3, startTime: "12:00", endTime: "14:00" }, // Onsdag
    { dayOfWeek: 3, startTime: "15:00", endTime: "16:00" },
    { dayOfWeek: 4, startTime: "13:00", endTime: "14:00" }, // Torsdag
    { dayOfWeek: 4, startTime: "15:00", endTime: "20:00" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "14:00" }, // Fredag
  ];

  for (const avail of andersAvailability) {
    const existing = await prisma.instructorAvailability.findFirst({
      where: {
        instructorId: anders.id,
        dayOfWeek: avail.dayOfWeek,
        startTime: avail.startTime,
      },
    });

    if (!existing) {
      await prisma.instructorAvailability.create({
        data: {
          id: randomUUID(),
          instructorId: anders.id,
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
        },
      });
      console.log(`  ✓ Dag ${avail.dayOfWeek}: ${avail.startTime}-${avail.endTime}`);
    }
  }

  // ============================================================
  // 5. SETT OPP TILGJENGELIGHET (Markus - Fleksibel)
  // ============================================================
  console.log("\n📅 Setter opp tilgjengelighet for Markus...");

  const markusAvailability = [
    { dayOfWeek: 1, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 2, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 3, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 4, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "18:00" },
    { dayOfWeek: 6, startTime: "09:00", endTime: "16:00" }, // Lørdag
  ];

  for (const avail of markusAvailability) {
    const existing = await prisma.instructorAvailability.findFirst({
      where: {
        instructorId: markus.id,
        dayOfWeek: avail.dayOfWeek,
        startTime: avail.startTime,
      },
    });

    if (!existing) {
      await prisma.instructorAvailability.create({
        data: {
          id: randomUUID(),
          instructorId: markus.id,
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
        },
      });
      console.log(`  ✓ Dag ${avail.dayOfWeek}: ${avail.startTime}-${avail.endTime}`);
    }
  }

  // ============================================================
  // 6. OPPRETT COACHING AVAILABILITY (for 20-min abonnement)
  // ============================================================
  console.log("\n⏱️  Setter opp CoachingAvailability (20-min slots)...");

  const coachingSlots = [
    { dayOfWeek: 1, startTime: "12:00", endTime: "12:20" },
    { dayOfWeek: 1, startTime: "12:30", endTime: "12:50" },
    { dayOfWeek: 1, startTime: "15:00", endTime: "15:20" },
    { dayOfWeek: 1, startTime: "15:30", endTime: "15:50" },
    { dayOfWeek: 2, startTime: "13:00", endTime: "13:20" },
    { dayOfWeek: 2, startTime: "13:30", endTime: "13:50" },
    { dayOfWeek: 2, startTime: "15:00", endTime: "15:20" },
    { dayOfWeek: 2, startTime: "15:30", endTime: "15:50" },
    { dayOfWeek: 3, startTime: "12:00", endTime: "12:20" },
    { dayOfWeek: 3, startTime: "12:30", endTime: "12:50" },
    { dayOfWeek: 4, startTime: "13:00", endTime: "13:20" },
    { dayOfWeek: 4, startTime: "13:30", endTime: "13:50" },
    { dayOfWeek: 4, startTime: "15:00", endTime: "15:20" },
    { dayOfWeek: 4, startTime: "15:30", endTime: "15:50" },
    { dayOfWeek: 5, startTime: "10:00", endTime: "10:20" },
    { dayOfWeek: 5, startTime: "10:30", endTime: "10:50" },
  ];

  for (const slot of coachingSlots) {
    const existing = await prisma.coachingAvailability.findFirst({
      where: {
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
      },
    });

    if (!existing) {
      await prisma.coachingAvailability.create({
        data: {
          id: randomUUID(),
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          updatedAt: new Date(),
        },
      });
    }
  }
  console.log(`  ✓ ${coachingSlots.length} coaching slots opprettet`);

  // ============================================================
  // 7. OPPSUMMERING
  // ============================================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ IMPLEMENTERING FULLFØRT");
  console.log("=".repeat(60));
  console.log("\n📊 Oppsummering:");
  console.log(`  Instruktører: ${(await prisma.instructor.count())} stk`);
  console.log(`  Lokasjoner: ${(await prisma.location.count())} stk`);
  console.log(`  Tjenester: ${(await prisma.serviceType.count({ where: { isActive: true } }))} aktive`);
  console.log(`  Coaching-pakker: ${(await prisma.coachingPackage.count())} stk`);
  console.log(`  Tilgjengelighet (Anders): ${(await prisma.instructorAvailability.count({ where: { instructorId: anders.id } }))} slots`);
  console.log(`  Tilgjengelighet (Markus): ${(await prisma.instructorAvailability.count({ where: { instructorId: markus.id } }))} slots`);
  console.log("\n🎯 Klar for booking!");
  console.log("   Abonnement: Performance Pro, Performance");
  console.log("   Drop-in: Flex 50/90 Solo/Duo, Flex 20");
  console.log("\n" + "=".repeat(60));
}

main()
  .catch((e) => {
    console.error("❌ Feil:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
