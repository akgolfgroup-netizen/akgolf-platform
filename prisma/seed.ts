import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const USER_ID = "f6400a71-361d-4b36-ae51-bb33bdbb9c00"; // anders@akgolf.no

async function main() {
  console.log("Seeding demo data for anders@akgolf.no...\n");

  // 1. Create or upgrade user to ELITE
  await prisma.user.upsert({
    where: { id: USER_ID },
    update: { subscriptionTier: "ELITE", role: "ADMIN" },
    create: {
      id: USER_ID,
      name: "Anders Kristiansen",
      email: "anders@akgolf.no",
      subscriptionTier: "ELITE",
      role: "ADMIN",
    },
  });
  console.log("User created/upgraded to ELITE + ADMIN");

  // 2. Create instructor user + profile
  const instructorUser = await prisma.user.upsert({
    where: { email: "coach@akgolf.no" },
    update: {},
    create: {
      id: "instructor-001",
      name: "Thomas Berg",
      email: "coach@akgolf.no",
      role: "INSTRUCTOR",
      subscriptionTier: "FREE",
    },
  });

  const instructor = await prisma.instructor.upsert({
    where: { userId: instructorUser.id },
    update: {},
    create: {
      id: "instr-001",
      userId: instructorUser.id,
      bio: "PGA-sertifisert trener med 15 års erfaring. Spesialist på juniorutvikling og Trackman-analyse.",
      specialization: "Juniorutvikling, Trackman",
      title: "Head Coach",
    },
  });
  console.log("Instructor created: Thomas Berg");

  // 3. Create location
  const location = await prisma.location.upsert({
    where: { id: "loc-001" },
    update: {},
    create: {
      id: "loc-001",
      name: "AK Golf Academy - Wang",
      address: "Wang UH, Toneheim, 2320 Ridabu",
    },
  });
  console.log("Location created: AK Golf Academy - Wang");

  // 4. Create service types
  const services = [
    {
      id: "svc-individual",
      name: "Individuell coaching",
      description: "1-til-1 coachingtime med Trackman-analyse og videogjennomgang.",
      category: "INDIVIDUAL" as const,
      duration: 60,
      price: 99500, // 995 kr
      maxStudents: 1,
      color: "#B8975C",
      sortOrder: 1,
    },
    {
      id: "svc-playing",
      name: "Playing lesson",
      description: "Coaching ute på banen. 9 hull med fokus på kursmanagement og mental strategi.",
      category: "PLAYING_LESSON" as const,
      duration: 120,
      price: 179500, // 1795 kr
      maxStudents: 1,
      color: "#2E7D32",
      sortOrder: 2,
    },
    {
      id: "svc-group",
      name: "Gruppetrening",
      description: "Trening i gruppe (maks 4). Fokus på kortspill og putting.",
      category: "GROUP" as const,
      duration: 90,
      price: 49500, // 495 kr per person
      maxStudents: 4,
      color: "#1565C0",
      sortOrder: 3,
    },
    {
      id: "svc-simulator",
      name: "Simulator-time",
      description: "Trackman-sesjon i Mulligan Indoor Golf simulator.",
      category: "SIMULATOR" as const,
      duration: 60,
      price: 59500, // 595 kr
      maxStudents: 2,
      color: "#6A1B9A",
      sortOrder: 4,
    },
  ];

  for (const svc of services) {
    await prisma.serviceType.upsert({
      where: { id: svc.id },
      update: {},
      create: svc,
    });
  }

  // Connect instructor to service types
  await prisma.instructor.update({
    where: { id: instructor.id },
    data: {
      serviceTypes: { connect: services.map((s) => ({ id: s.id })) },
    },
  });
  console.log("Service types created and linked to instructor");

  // 5. Create instructor availability (Mon-Fri 08-17)
  for (let day = 1; day <= 5; day++) {
    await prisma.instructorAvailability.upsert({
      where: {
        instructorId_dayOfWeek_startTime: {
          instructorId: instructor.id,
          dayOfWeek: day,
          startTime: "08:00",
        },
      },
      update: {},
      create: {
        instructorId: instructor.id,
        dayOfWeek: day,
        startTime: "08:00",
        endTime: "17:00",
      },
    });
  }
  console.log("Instructor availability set (Mon-Fri 08:00-17:00)");

  // 6. Create bookings (past + upcoming)
  const now = new Date();
  const pastBookings = [
    { daysAgo: 28, svcId: "svc-individual", focus: "Driving og tee-shots" },
    { daysAgo: 21, svcId: "svc-individual", focus: "Innspill 50-100m" },
    { daysAgo: 14, svcId: "svc-playing", focus: "Kursmanagement" },
    { daysAgo: 7, svcId: "svc-individual", focus: "Putting under press" },
  ];

  for (const pb of pastBookings) {
    const start = new Date(now);
    start.setDate(start.getDate() - pb.daysAgo);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    const bookingId = `booking-past-${pb.daysAgo}`;
    await prisma.booking.upsert({
      where: { id: bookingId },
      update: {},
      create: {
        id: bookingId,
        studentId: USER_ID,
        instructorId: instructor.id,
        serviceTypeId: pb.svcId,
        locationId: location.id,
        startTime: start,
        endTime: end,
        status: "COMPLETED",
        paymentMethod: "STRIPE",
        paymentStatus: "PAID",
        amount: 99500,
      },
    });

    // Create coaching session for completed bookings
    await prisma.coachingSession.upsert({
      where: { bookingId },
      update: {},
      create: {
        bookingId,
        studentId: USER_ID,
        instructorId: instructor.id,
        sessionDate: start,
        primaryFocus: pb.focus,
        techniquesCovered: ["Grep", "Alignment", "Tempo"],
        drillsAssigned: ["Gate drill", "Alignment sticks", "Speed ladder"],
        instructorNotes: `God sesjon med fokus på ${pb.focus.toLowerCase()}. Tydelig progresjon fra forrige gang.`,
        homework: "Repeter drill 3x15 min denne uken.",
        progressRating: 4,
        aiSummary: `Spilleren viste solid fremgang innen ${pb.focus.toLowerCase()}. Konsistensen forbedres gradvis. Anbefaler videre fokus på tempo og rutine.`,
        aiKeyPoints: [
          "Forbedret tempo i nedsving",
          "Bedre alignment-rutine",
          "Trenger mer arbeid med avslutning",
        ],
        aiFocusAreas: [pb.focus, "Tempo", "Mental rutine"],
        aiActionItems: [
          "Gate drill 15 min daglig",
          "Alignment sticks ved hver treningsokt",
          "Putte-konkurranse: 10 baller fra 2m",
        ],
        aiGeneratedAt: new Date(),
      },
    });
  }
  console.log("Past bookings + coaching sessions created (4)");

  // Upcoming bookings
  const futureBookings = [
    { daysAhead: 3, svcId: "svc-individual", hour: 14 },
    { daysAhead: 10, svcId: "svc-playing", hour: 9 },
    { daysAhead: 17, svcId: "svc-group", hour: 16 },
  ];

  for (const fb of futureBookings) {
    const start = new Date(now);
    start.setDate(start.getDate() + fb.daysAhead);
    start.setHours(fb.hour, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 60);

    await prisma.booking.upsert({
      where: { id: `booking-future-${fb.daysAhead}` },
      update: {},
      create: {
        id: `booking-future-${fb.daysAhead}`,
        studentId: USER_ID,
        instructorId: instructor.id,
        serviceTypeId: fb.svcId,
        locationId: location.id,
        startTime: start,
        endTime: end,
        status: "CONFIRMED",
        paymentMethod: "STRIPE",
        paymentStatus: "PAID",
        amount: 99500,
      },
    });
  }
  console.log("Future bookings created (3)");

  // 7. Create goals
  const goals = [
    {
      title: "Handicap under 5.0",
      description: "Na HCP 4.9 eller lavere innen sesongslutt",
      category: "SCORE" as const,
      targetValue: 5.0,
      currentValue: 6.2,
      unit: "HCP",
      targetDate: new Date("2026-10-01"),
      status: "ACTIVE" as const,
    },
    {
      title: "Putte-prosent fra 2m: 85%",
      description: "Forbedre putting fra kort hold",
      category: "PROCESS" as const,
      targetValue: 85,
      currentValue: 72,
      unit: "%",
      targetDate: new Date("2026-08-01"),
      status: "ACTIVE" as const,
    },
    {
      title: "Mental pre-shot rutine",
      description: "Gjennomfor komplett pre-shot rutine pa hvert slag i turnering",
      category: "MENTAL" as const,
      targetValue: 100,
      currentValue: 65,
      unit: "%",
      status: "ACTIVE" as const,
    },
    {
      title: "Spring 5K under 25 min",
      description: "Forbedre kondisjon for a holde fokus gjennom 18 hull",
      category: "PHYSICAL" as const,
      targetValue: 25,
      currentValue: 27.5,
      unit: "min",
      targetDate: new Date("2026-06-01"),
      status: "ACTIVE" as const,
    },
    {
      title: "Topp 10 i Srixon Tour",
      description: "Oppna topp 10-plassering i minst en Srixon Tour-runde",
      category: "TOURNAMENT" as const,
      targetValue: 10,
      currentValue: 15,
      unit: "plassering",
      targetDate: new Date("2026-09-30"),
      status: "ACTIVE" as const,
    },
  ];

  for (let i = 0; i < goals.length; i++) {
    await prisma.goal.upsert({
      where: { id: `goal-${i + 1}` },
      update: {},
      create: { id: `goal-${i + 1}`, userId: USER_ID, ...goals[i] },
    });
  }
  console.log("Goals created (5)");

  // 8. Create handicap history (6 months)
  const hcpData = [
    { months: 6, hcp: 8.1 },
    { months: 5, hcp: 7.8 },
    { months: 4, hcp: 7.4 },
    { months: 3, hcp: 7.0 },
    { months: 2, hcp: 6.6 },
    { months: 1, hcp: 6.2 },
  ];

  for (const h of hcpData) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - h.months);
    date.setDate(1);

    await prisma.handicapEntry.upsert({
      where: { id: `hcp-${h.months}` },
      update: {},
      create: {
        id: `hcp-${h.months}`,
        userId: USER_ID,
        date,
        handicapIndex: h.hcp,
        source: "MANUAL",
      },
    });
  }
  console.log("Handicap history created (6 months)");

  // 9. Create round stats (4 recent rounds)
  const rounds = [
    {
      daysAgo: 25,
      course: "Hamar GK",
      score: 78,
      toPar: 6,
      sgTotal: -0.5,
      sgOffTee: 0.3,
      sgApproach: -0.8,
      sgATG: 0.2,
      sgPutt: -0.2,
      fairways: 9,
      gir: 10,
      putts: 32,
      birdies: 2,
      pars: 10,
      bogeys: 5,
      doubles: 1,
    },
    {
      daysAgo: 18,
      course: "Losby GK",
      score: 76,
      toPar: 4,
      sgTotal: 0.3,
      sgOffTee: 0.5,
      sgApproach: 0.1,
      sgATG: -0.1,
      sgPutt: -0.2,
      fairways: 10,
      gir: 12,
      putts: 31,
      birdies: 3,
      pars: 10,
      bogeys: 4,
      doubles: 1,
    },
    {
      daysAgo: 11,
      course: "Hamar GK",
      score: 75,
      toPar: 3,
      sgTotal: 0.8,
      sgOffTee: 0.2,
      sgApproach: 0.4,
      sgATG: 0.3,
      sgPutt: -0.1,
      fairways: 11,
      gir: 13,
      putts: 30,
      birdies: 4,
      pars: 9,
      bogeys: 4,
      doubles: 1,
    },
    {
      daysAgo: 4,
      course: "Hedmark GK",
      score: 74,
      toPar: 2,
      sgTotal: 1.2,
      sgOffTee: 0.4,
      sgApproach: 0.5,
      sgATG: 0.1,
      sgPutt: 0.2,
      fairways: 11,
      gir: 13,
      putts: 29,
      birdies: 4,
      pars: 11,
      bogeys: 3,
      doubles: 0,
    },
  ];

  for (let i = 0; i < rounds.length; i++) {
    const r = rounds[i];
    const date = new Date(now);
    date.setDate(date.getDate() - r.daysAgo);

    await prisma.roundStats.upsert({
      where: { id: `round-${i + 1}` },
      update: {},
      create: {
        id: `round-${i + 1}`,
        userId: USER_ID,
        date,
        courseName: r.course,
        source: "MANUAL",
        totalScore: r.score,
        scoreToPar: r.toPar,
        sgTotal: r.sgTotal,
        sgOffTheTee: r.sgOffTee,
        sgApproach: r.sgApproach,
        sgAroundTheGreen: r.sgATG,
        sgPutting: r.sgPutt,
        fairwaysHit: r.fairways,
        fairwaysTotal: 14,
        gir: r.gir,
        girTotal: 18,
        totalPutts: r.putts,
        birdieCount: r.birdies,
        parCount: r.pars,
        bogeyCount: r.bogeys,
        doublePlusCount: r.doubles,
      },
    });
  }
  console.log("Round stats created (4 rounds)");

  // 10. Create training plan with weeks and sessions
  const planStart = new Date(now);
  planStart.setDate(planStart.getDate() - (planStart.getDay() === 0 ? 6 : planStart.getDay() - 1)); // Start of current week (Monday)

  const planEnd = new Date(planStart);
  planEnd.setDate(planEnd.getDate() + 27); // 4 weeks

  const plan = await prisma.trainingPlan.upsert({
    where: { id: "plan-001" },
    update: {},
    create: {
      id: "plan-001",
      studentId: USER_ID,
      createdById: USER_ID,
      title: "Forberedelse varsesong 2026",
      description: "Fokus pa kortspill og putting for a senke HCP under 5.0 i lopet av sesongen.",
      goals: "HCP under 5.0, 85% putt fra 2m, konsistent pre-shot rutine",
      periodType: "grunnperiode",
      startDate: planStart,
      endDate: planEnd,
      isActive: true,
      aiGenerated: false,
    },
  });

  const weekFocuses = [
    { focus: "Putting og kortspill", volume: "Medium" },
    { focus: "Innspill og bunker", volume: "Hoy" },
    { focus: "Driving og langspill", volume: "Medium" },
    { focus: "Kursmanagement", volume: "Lav (restitusjon)" },
  ];

  for (let w = 0; w < 4; w++) {
    const weekStart = new Date(planStart);
    weekStart.setDate(weekStart.getDate() + w * 7);

    const week = await prisma.trainingPlanWeek.upsert({
      where: { id: `week-${w + 1}` },
      update: {},
      create: {
        id: `week-${w + 1}`,
        planId: plan.id,
        weekNumber: w + 1,
        weekStart,
        focus: weekFocuses[w].focus,
        volumeLabel: weekFocuses[w].volume,
      },
    });

    // Sessions per week
    const sessions = [
      { day: 1, title: "Putting drill", desc: "Gate drill 2m, hastighets-kontroll 6m, 10-balls challenge", dur: 45, area: "Putting" },
      { day: 2, title: "Kortspill", desc: "Pitch 20-50m til targets, bunker-drill, flop shots", dur: 60, area: "Kortspill" },
      { day: 3, title: "Driving range", desc: "Tempo-trening, alignment, shot shaping", dur: 45, area: "Langspill" },
      { day: 4, title: "Hviledag", desc: "Stretching og visualisering", dur: 20, area: "Mental" },
      { day: 5, title: "Simulatortime", desc: "Trackman-analyse, SG-fokusomrader", dur: 60, area: "Analyse" },
      { day: 6, title: "9 hull", desc: "Spilletrening med scoring-fokus og pre-shot rutine", dur: 120, area: "Spill" },
    ];

    for (let s = 0; s < sessions.length; s++) {
      await prisma.trainingPlanSession.upsert({
        where: { id: `session-w${w + 1}-d${sessions[s].day}` },
        update: {},
        create: {
          id: `session-w${w + 1}-d${sessions[s].day}`,
          weekId: week.id,
          dayOfWeek: sessions[s].day,
          title: sessions[s].title,
          description: sessions[s].desc,
          durationMinutes: sessions[s].dur,
          focusArea: sessions[s].area,
          exercises: JSON.stringify([
            { name: sessions[s].title, reps: "3x15", notes: sessions[s].desc },
          ]),
          sortOrder: s,
        },
      });
    }
  }
  console.log("Training plan created (4 weeks, 6 sessions/week)");

  // 11. Create training logs (past week)
  for (let d = 1; d <= 5; d++) {
    const logDate = new Date(now);
    logDate.setDate(logDate.getDate() - (7 - d));

    await prisma.trainingLog.upsert({
      where: { id: `log-${d}` },
      update: {},
      create: {
        id: `log-${d}`,
        userId: USER_ID,
        planSessionId: `session-w1-d${d}`,
        date: logDate,
        durationMinutes: [45, 60, 45, 20, 60][d - 1],
        focusArea: ["Putting", "Kortspill", "Langspill", "Mental", "Analyse"][d - 1],
        notes: "Gjennomfort i henhold til plan.",
        rating: [4, 5, 3, 4, 5][d - 1],
        deviatedFromPlan: false,
      },
    });
  }
  console.log("Training logs created (5)");

  // 12. Create achievement definitions + unlock some
  const achievements = [
    { key: "first_session", title: "Forste trening", description: "Gjennomfort din forste treningsokt", icon: "star", category: "training", threshold: 1, sortOrder: 1 },
    { key: "streak_7", title: "7-dagers streak", description: "Trent 7 dager pa rad", icon: "flame", category: "consistency", threshold: 7, sortOrder: 2 },
    { key: "birdie_machine", title: "Birdie-maskin", description: "5 birdies i en runde", icon: "zap", category: "scoring", threshold: 5, sortOrder: 3 },
    { key: "coaching_5", title: "Coaching-veteran", description: "Gjennomfort 5 coachingtimer", icon: "book-open", category: "coaching", threshold: 5, sortOrder: 4 },
    { key: "sub_80", title: "Under 80", description: "Spilt en runde under 80 slag", icon: "trophy", category: "scoring", threshold: 1, sortOrder: 5 },
    { key: "training_50", title: "50 treningsokter", description: "Logget 50 treningsokter totalt", icon: "target", category: "milestone", threshold: 50, sortOrder: 6 },
    { key: "plan_complete", title: "Plan fullfart", description: "Fullfart en hel treningsplan-uke", icon: "check-circle", category: "training", threshold: 1, sortOrder: 7 },
    { key: "first_tournament", title: "Turneringsdebutant", description: "Deltatt i din forste turnering", icon: "flag", category: "milestone", threshold: 1, sortOrder: 8 },
  ];

  for (const ach of achievements) {
    await prisma.achievementDefinition.upsert({
      where: { key: ach.key },
      update: {},
      create: ach,
    });
  }

  // Unlock some achievements
  const unlockedKeys = ["first_session", "sub_80", "plan_complete", "first_tournament"];
  for (const key of unlockedKeys) {
    const def = await prisma.achievementDefinition.findUnique({ where: { key } });
    if (def) {
      await prisma.playerAchievement.upsert({
        where: {
          userId_achievementDefinitionId: {
            userId: USER_ID,
            achievementDefinitionId: def.id,
          },
        },
        update: {},
        create: {
          userId: USER_ID,
          achievementDefinitionId: def.id,
        },
      });
    }
  }
  console.log("Achievements created (8 definitions, 4 unlocked)");

  // 13. Create tournaments
  const tournaments = [
    {
      id: "tourn-1",
      name: "Srixon Tour - Hamar",
      startDate: new Date("2026-05-15"),
      level: "nasjonal",
      course: "Hamar GK",
      location: "Hamar",
      source: "manual",
    },
    {
      id: "tourn-2",
      name: "Norgescup Junior - Losby",
      startDate: new Date("2026-06-10"),
      level: "nasjonal",
      course: "Losby GK",
      location: "Finstadjordet",
      source: "manual",
    },
    {
      id: "tourn-3",
      name: "Klubbmesterskapet Hamar GK",
      startDate: new Date("2026-08-20"),
      level: "lokal",
      course: "Hamar GK",
      location: "Hamar",
      source: "manual",
    },
  ];

  for (const t of tournaments) {
    await prisma.tournament.upsert({
      where: { id: t.id },
      update: {},
      create: { ...t, createdById: USER_ID },
    });

    await prisma.playerTournamentPlan.upsert({
      where: {
        studentId_tournamentId: { studentId: USER_ID, tournamentId: t.id },
      },
      update: {},
      create: {
        studentId: USER_ID,
        tournamentId: t.id,
        planLevel: t.id === "tourn-1" ? "A" : t.id === "tourn-2" ? "A" : "B",
        goalType: t.id === "tourn-3" ? "prestasjon" : "utvikling",
        isRegistered: t.id !== "tourn-3",
      },
    });
  }
  console.log("Tournaments created (3) with player plans");

  // 14. Create periodization periods
  const periods = [
    { type: "grunnperiode", start: "2026-01-01", end: "2026-03-31", label: "Grunnperiode vinter" },
    { type: "spesialiseringsperiode", start: "2026-04-01", end: "2026-05-31", label: "Spesialisering var" },
    { type: "turneringsperiode", start: "2026-06-01", end: "2026-09-30", label: "Turneringssesong" },
    { type: "grunnperiode", start: "2026-10-01", end: "2026-12-31", label: "Grunnperiode host" },
  ];

  for (let i = 0; i < periods.length; i++) {
    await prisma.periodizationPeriod.upsert({
      where: { id: `period-${i + 1}` },
      update: {},
      create: {
        id: `period-${i + 1}`,
        studentId: USER_ID,
        periodType: periods[i].type,
        startDate: new Date(periods[i].start),
        endDate: new Date(periods[i].end),
        label: periods[i].label,
      },
    });
  }
  console.log("Periodization periods created (4)");

  console.log("\nSeed complete! All demo data ready for anders@akgolf.no");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
