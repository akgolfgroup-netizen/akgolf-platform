// prisma/seed-prod.ts
import "dotenv/config";
import { UserRole, ServiceCategory } from "@prisma/client";
import { randomUUID } from "crypto";
import { prisma } from "../lib/portal/prisma";

// DayOfWeek is stored as Int in the schema (0=Sun, 1=Mon, ..., 6=Sat)
// Placeholder type used until Task 5 implements seedAvailability
type InstructorMap = Record<string, { id: string; userId: string }>;
type UserMap = Record<string, { id: string; email: string; role: UserRole }>;
type ServiceTypeRecord = { id: string; name: string };

async function seedUsers(): Promise<UserMap> {
  console.log("  Creating users...");

  const anders = await prisma.user.upsert({
    where: { email: "anders@akgolf.no" },
    update: {},
    create: {
      id: randomUUID(),
      email: "anders@akgolf.no",
      name: "Anders Kristiansen",
      phone: "+47 918 16 456",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  const markus = await prisma.user.upsert({
    where: { email: "markus@akgolf.no" },
    update: {},
    create: {
      id: randomUUID(),
      email: "markus@akgolf.no",
      name: "Markus Hatlelid",
      role: UserRole.INSTRUCTOR,
      emailVerified: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`    ✓ Anders (${anders.id})`);
  console.log(`    ✓ Markus (${markus.id})`);

  return {
    anders: { id: anders.id, email: anders.email ?? "", role: anders.role },
    markus: { id: markus.id, email: markus.email ?? "", role: markus.role },
  };
}

async function seedInstructors(users: UserMap): Promise<InstructorMap> {
  console.log("  Creating instructors...");

  const andersInstructor = await prisma.instructor.upsert({
    where: { userId: users.anders.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: users.anders.id,
      bio: "PGA-sertifisert trener med fokus på helhetlig spillerutvikling. Spesialist på The Foundation Method — en strukturert tilnærming til golf som bygger solide ferdigheter fra bunnen.",
      specialization: "The Foundation Method, Putting, Short Game, Course Management | PGA Class A, TPI Certified | 15 år erfaring",
      updatedAt: new Date(),
    },
  });

  const markusInstructor = await prisma.instructor.upsert({
    where: { userId: users.markus.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: users.markus.id,
      bio: "Spesialist på juniorutvikling og breddearbeid. Ansvarlig for GFGK juniorprogram og treningsgrupper.",
      specialization: "Junior Development, Group Training, Beginner Coaching | NGF Trener 2 | 5 år erfaring",
      updatedAt: new Date(),
    },
  });

  console.log(`    ✓ Anders Instructor (${andersInstructor.id})`);
  console.log(`    ✓ Markus Instructor (${markusInstructor.id})`);

  return {
    anders: { id: andersInstructor.id, userId: andersInstructor.userId },
    markus: { id: markusInstructor.id, userId: markusInstructor.userId },
  };
}

async function seedLocation(): Promise<{ id: string; name: string }> {
  console.log("  Creating location...");

  const location = await prisma.location.upsert({
    where: { id: "gfgk-main" },
    update: {},
    create: {
      id: "gfgk-main",
      name: "Gamle Fredrikstad Golfklubb",
      address: "Golfveien 1, 1605 Fredrikstad",
      updatedAt: new Date(),
    },
  });

  console.log(`    ✓ ${location.name}`);
  return { id: location.id, name: location.name };
}

async function seedServiceTypes(instructors: InstructorMap): Promise<ServiceTypeRecord[]> {
  console.log("  Creating service types...");

  // Priser i KRONER (Stripe mottar pris * 100)
  const services = [
    {
      id: randomUUID(),
      name: "Individual Coaching",
      description: "60 minutters én-til-én coaching med videoanalyse og personlig utviklingsplan.",
      category: ServiceCategory.INDIVIDUAL,
      duration: 60,
      price: 1495,
      vatRate: 25,
      maxStudents: 1,
      isActive: true,
      isPublic: true,
      allowStripe: true,
      allowVipps: false,
    },
    {
      id: randomUUID(),
      name: "Group Coaching",
      description: "90 minutters gruppetrening for 2-4 spillere. Fokus på teknikk og spill.",
      category: ServiceCategory.GROUP,
      duration: 90,
      price: 595,
      vatRate: 25,
      maxStudents: 4,
      isActive: true,
      isPublic: true,
      allowStripe: true,
      allowVipps: false,
    },
    {
      id: randomUUID(),
      name: "Playing Lesson",
      description: "120 minutters coaching på banen. Lær kursmanagement og taktikk i praksis.",
      category: ServiceCategory.PLAYING_LESSON,
      duration: 120,
      price: 2495,
      vatRate: 25,
      maxStudents: 2,
      isActive: true,
      isPublic: true,
      allowStripe: true,
      allowVipps: false,
    },
  ];

  const created: ServiceTypeRecord[] = [];
  for (const service of services) {
    const s = await prisma.serviceType.upsert({
      where: { id: service.id },
      update: {},
      create: {
        ...service,
        updatedAt: new Date(),
        Instructor: { connect: { id: instructors.anders.id } },
      },
    });
    created.push({ id: s.id, name: s.name });
    console.log(`    ✓ ${s.name} (${s.price} kr)`);
  }

  return created;
}

async function seedAvailability(instructors: InstructorMap): Promise<void> {
  console.log("  Creating availability...");

  // DayOfWeek: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat

  // Anders: Mon-Fri, pause 14:00-15:00
  const andersSlots = [
    // Mandag (1)
    { dayOfWeek: 1, startTime: "12:00", endTime: "14:00" },
    { dayOfWeek: 1, startTime: "15:00", endTime: "20:00" },
    // Tirsdag (2)
    { dayOfWeek: 2, startTime: "13:00", endTime: "14:00" },
    { dayOfWeek: 2, startTime: "15:00", endTime: "20:00" },
    // Onsdag (3)
    { dayOfWeek: 3, startTime: "12:00", endTime: "14:00" },
    { dayOfWeek: 3, startTime: "15:00", endTime: "16:00" },
    // Torsdag (4)
    { dayOfWeek: 4, startTime: "12:00", endTime: "14:00" },
    { dayOfWeek: 4, startTime: "15:00", endTime: "20:00" },
    // Fredag (5)
    { dayOfWeek: 5, startTime: "12:00", endTime: "14:00" },
    { dayOfWeek: 5, startTime: "15:00", endTime: "18:00" },
  ];

  for (const slot of andersSlots) {
    await prisma.instructorAvailability.upsert({
      where: {
        instructorId_dayOfWeek_startTime: {
          instructorId: instructors.anders.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        instructorId: instructors.anders.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
  }
  console.log(`    ✓ Anders: ${andersSlots.length} slots`);

  // Markus: Onsdag ettermiddag, Lørdag formiddag
  const markusSlots = [
    { dayOfWeek: 3, startTime: "16:00", endTime: "19:00" }, // Onsdag
    { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" }, // Lørdag
  ];

  for (const slot of markusSlots) {
    await prisma.instructorAvailability.upsert({
      where: {
        instructorId_dayOfWeek_startTime: {
          instructorId: instructors.markus.id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
        },
      },
      update: {},
      create: {
        id: randomUUID(),
        instructorId: instructors.markus.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    });
  }
  console.log(`    ✓ Markus: ${markusSlots.length} slots`);
}

async function main() {
  console.log("🌱 Starting production seed...");

  // Step 1: Create users
  const users = await seedUsers();

  // Step 2: Create instructors
  const instructors = await seedInstructors(users);

  // Step 3: Create location
  const location = await seedLocation();

  // Step 4: Create service types
  const serviceTypes = await seedServiceTypes(instructors);

  // Step 5: Create availability
  await seedAvailability(instructors);

  console.log("✅ Production seed complete!");
  console.log(`   Users: ${Object.keys(users).length}`);
  console.log(`   Instructors: ${Object.keys(instructors).length}`);
  console.log(`   Location: ${location.name}`);
  console.log(`   Service Types: ${serviceTypes.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
