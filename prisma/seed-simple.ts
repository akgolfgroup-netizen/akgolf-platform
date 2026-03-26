// =============================================================================
// AK Golf Booking - Enkel Seed (bruker seed-config.ts)
// =============================================================================
// IKKE ENDRE DENNE FILEN!
// Endre kun: prisma/seed-config.ts
// Deretter kjør: npx prisma db seed
// =============================================================================

import { PrismaClient } from "@prisma/client";
import { COACHES, SERVICES, LOCATIONS, AVAILABILITY, PACKAGES } from "./seed-config";

const prisma = new PrismaClient();

const dayMap: Record<string, number> = {
  mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 0,
};

async function main() {
  console.log("🌱 Seeder database fra seed-config.ts...\n");

  // 1. OPPRETT TRENERE (som brukere + instruktører)
  const instructorMap: Record<string, string> = {};

  for (const [key, coach] of Object.entries(COACHES)) {
    // Sjekk om bruker finnes
    let user = await prisma.user.findUnique({ where: { email: coach.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: coach.email,
          name: coach.name,
          role: key === "anders" ? "ADMIN" : "INSTRUCTOR",
          subscriptionTier: "VISITOR",
        },
      });
      console.log(`✅ Bruker opprettet: ${coach.name}`);
    }

    // Sjekk om instruktør-profil finnes
    let instructor = await prisma.instructor.findFirst({
      where: { userId: user.id },
    });

    if (!instructor) {
      instructor = await prisma.instructor.create({
        data: {
          userId: user.id,
          title: coach.title,
          bio: coach.bio,
          specialization: "",
        },
      });
      console.log(`✅ Instruktør-profil opprettet: ${coach.name}`);
    }

    instructorMap[key] = instructor.id;
  }

  // 2. OPPRETT LOKASJONER
  const locationMap: Record<string, string> = {};

  for (const [key, loc] of Object.entries(LOCATIONS)) {
    let location = await prisma.location.findFirst({
      where: { name: loc.name },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          name: loc.name,
          address: loc.address,
        },
      });
      console.log(`✅ Lokasjon opprettet: ${loc.name}`);
    }

    locationMap[key] = location.id;
  }

  // 3. OPPRETT TJENESTER
  const serviceMap: Record<string, string> = {};
  let sortOrder = 1;

  for (const [key, svc] of Object.entries(SERVICES)) {
    if (!svc.active) {
      console.log(`⏭️  Hoppet over (ikke aktiv): ${svc.name}`);
      continue;
    }

    const instructorId = instructorMap[svc.coachId as keyof typeof COACHES];

    let serviceType = await prisma.serviceType.findFirst({
      where: { name: svc.name },
    });

    if (!serviceType) {
      serviceType = await prisma.serviceType.create({
        data: {
          name: svc.name,
          description: svc.description,
          duration: svc.duration,
          price: svc.price,
          maxStudents: svc.maxStudents,
          color: svc.color,
          sortOrder: sortOrder++,
          category: "INDIVIDUAL",
        },
      });
      console.log(`✅ Tjeneste opprettet: ${svc.name} (${svc.price / 100} kr)`);
    } else {
      // Oppdater pris hvis endret
      await prisma.serviceType.update({
        where: { id: serviceType.id },
        data: { price: svc.price },
      });
      console.log(`🔄 Pris oppdatert: ${svc.name} (${svc.price / 100} kr)`);
    }

    serviceMap[key] = serviceType.id;

    // Koble til instruktør
    await prisma.instructor.update({
      where: { id: instructorId },
      data: {
        serviceTypes: { connect: { id: serviceType.id } },
      },
    });
  }

  // 4. OPPRETT ÅPNINGSTIDER
  for (const [coachKey, schedule] of Object.entries(AVAILABILITY)) {
    const instructorId = instructorMap[coachKey];

    // Slett eksisterende tilgjengelighet
    await prisma.instructorAvailability.deleteMany({
      where: { instructorId },
    });

    for (const [dayKey, timeBlocks] of Object.entries(schedule)) {
      if (!timeBlocks) continue; // Stengt denne dagen

      // Støtt både enkelt-objekt (gammel) og array (ny) struktur
      const blocks = Array.isArray(timeBlocks) ? timeBlocks : [timeBlocks];

      for (const time of blocks) {
        await prisma.instructorAvailability.create({
          data: {
            instructorId,
            dayOfWeek: dayMap[dayKey],
            startTime: time.start,
            endTime: time.end,
          },
        });
      }
    }

    console.log(`✅ Åpningstider satt for: ${COACHES[coachKey as keyof typeof COACHES].name}`);
  }

  // 5. ABBONNEMENTSPAKKER (lagres i .env eller separat tabell)
  // Merk: Pakkene vises kun i markedsføring inntil videre

  console.log("\n📊 Oppsummering:");
  console.log(`   Trenere: ${Object.keys(COACHES).length}`);
  console.log(`   Lokasjoner: ${Object.keys(LOCATIONS).length}`);
  console.log(`   Aktive tjenester: ${Object.values(SERVICES).filter((s) => s.active).length}`);
  console.log(`   Pakker definert: ${Object.keys(PACKAGES).length}`);

  console.log("\n✅ Seeding fullført!");
  console.log("\n💡 Neste steg:");
  console.log("   1. Start dev-server: npm run dev");
  console.log("   2. Åpne: http://localhost:3000/booking");
  console.log("   3. Endre priser/tjenester i: prisma/seed-config.ts");
  console.log("   4. Kjør på nytt: npx prisma db seed");
}

main()
  .catch((e) => {
    console.error("❌ Feil under seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
