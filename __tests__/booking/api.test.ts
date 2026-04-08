/**
 * Booking API Integration Tests
 * 
 * Tester API-endepunktene for booking-systemet.
 * Inkluderer:
 * - Concurrent booking tester (race conditions)
 * - End-to-end flyt
 * - Feilhåndtering
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { addDays, addHours, formatISO } from "date-fns";

// -----------------------------------------------------------------------------
// Test Helpers
// -----------------------------------------------------------------------------

async function createTestInstructor() {
  const userId = nanoid();
  const instructorId = nanoid();
  
  await prisma.user.create({
    data: {
      id: userId,
      email: `api-test-${userId}@example.com`,
      name: `API Test Instructor`,
      role: "INSTRUCTOR",
      updatedAt: new Date(),
    },
  });

  await prisma.instructor.create({
    data: {
      id: instructorId,
      userId,
      updatedAt: new Date(),
    },
  });

  return { userId, instructorId };
}

async function createTestService(instructorId: string) {
  const serviceTypeId = nanoid();
  
  await prisma.serviceType.create({
    data: {
      id: serviceTypeId,
      name: `API Test Service`,
      category: "INDIVIDUAL",
      duration: 60,
      price: 1000,
      isActive: true,
      minNoticeHours: 0, // For testing
      maxAdvanceDays: 365,
      bufferBefore: 0,
      bufferAfter: 0,
      updatedAt: new Date(),
      Instructor: { connect: { id: instructorId } },
    },
  });

  return { serviceTypeId };
}

async function createTestStudent() {
  const userId = nanoid();
  
  await prisma.user.create({
    data: {
      id: userId,
      email: `api-student-${userId}@example.com`,
      name: `API Test Student`,
      role: "STUDENT",
      updatedAt: new Date(),
    },
  });

  return { userId };
}

async function createTestBooking(
  studentId: string,
  instructorId: string,
  serviceTypeId: string,
  startTime: Date,
  status: "PENDING" | "CONFIRMED" = "CONFIRMED"
) {
  const bookingId = nanoid();
  
  await prisma.booking.create({
    data: {
      id: bookingId,
      studentId,
      instructorId,
      serviceTypeId,
      startTime,
      endTime: new Date(startTime.getTime() + 60 * 60000),
      status,
      amount: 1000,
      updatedAt: new Date(),
    },
  });

  return { bookingId };
}

// Mock API handler (siden vi tester uten Next.js runtime)
async function mockCreateBookingAPI(body: {
  serviceTypeId: string;
  instructorId: string;
  startTime: string;
  paymentMethod: string;
  email?: string;
  name?: string;
}) {
  const { serviceTypeId, instructorId, startTime, paymentMethod, email, name } = body;

  // Basic validering
  if (!serviceTypeId || !instructorId || !startTime || !paymentMethod) {
    return { status: 400, body: { error: "Mangler påkrevde felter" } };
  }

  if (paymentMethod !== "STRIPE") {
    return { status: 400, body: { error: "Kun kortbetaling er tilgjengelig" } };
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return { status: 400, body: { error: "Ugyldig startTime" } };
  }

  // Hent serviceType
  const serviceType = await prisma.serviceType.findUnique({
    where: { id: serviceTypeId },
    select: {
      duration: true,
      price: true,
      name: true,
      vatRate: true,
      isActive: true,
      allowStripe: true,
      minNoticeHours: true,
      maxAdvanceDays: true,
      bufferBefore: true,
      bufferAfter: true,
    },
  });

  if (!serviceType) {
    return { status: 400, body: { error: "Tjeneste ikke funnet" } };
  }

  if (!serviceType.isActive) {
    return { status: 400, body: { error: "Tjenesten er ikke aktiv" } };
  }

  // Sjekk varslingstid
  const minNoticeMs = serviceType.minNoticeHours * 60 * 60 * 1000;
  if (start.getTime() - Date.now() < minNoticeMs) {
    return { 
      status: 400, 
      body: { error: `Bestilling krever minst ${serviceType.minNoticeHours} timers varsel` } 
    };
  }

  // Beregn tider
  const end = new Date(start.getTime() + serviceType.duration * 60000);
  const conflictStart = new Date(start.getTime() - serviceType.bufferBefore * 60000);
  const conflictEnd = new Date(end.getTime() + serviceType.bufferAfter * 60000);

  // Atomisk konfliktsjekk + opprettelse
  try {
    const booking = await prisma.$transaction(
      async (tx) => {
        // Sjekk booking-konflikt
        const bookingConflict = await tx.booking.findFirst({
          where: {
            instructorId,
            status: { in: ["PENDING", "CONFIRMED"] },
            AND: [
              { startTime: { lt: conflictEnd } },
              { endTime: { gt: conflictStart } },
            ],
          },
        });

        if (bookingConflict) {
          throw new Error("CONFLICT: Tidspunktet er ikke lenger ledig");
        }

        // Sjekk blokkert tid
        const blockedConflict = await tx.blockedTime.findFirst({
          where: {
            OR: [{ instructorId }, { instructorId: null }],
            AND: [
              { startTime: { lt: conflictEnd } },
              { endTime: { gt: conflictStart } },
            ],
          },
        });

        if (blockedConflict) {
          throw new Error("CONFLICT: Tidspunktet er blokkert");
        }

        // Opprett bruker hvis email+name er angitt
        let studentId = email ? await getOrCreateUser(email, name || "Gjest") : nanoid();

        // Opprett booking
        return tx.booking.create({
          data: {
            id: nanoid(),
            studentId,
            instructorId,
            serviceTypeId,
            startTime: start,
            endTime: end,
            status: "PENDING",
            paymentMethod: "STRIPE",
            paymentStatus: "PENDING",
            amount: serviceType.price,
            vatAmount: Math.round((serviceType.price * serviceType.vatRate) / 100),
            updatedAt: new Date(),
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    return {
      status: 200,
      body: {
        bookingId: booking.id,
        clientSecret: "pi_mock_secret",
        isNewUser: !!email,
      },
    };

  } catch (error) {
    if (error instanceof Error && error.message.startsWith("CONFLICT:")) {
      return { status: 409, body: { error: error.message.replace("CONFLICT: ", "") } };
    }
    throw error;
  }
}

async function getOrCreateUser(email: string, name: string): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) return existing.id;

  const newUser = await prisma.user.create({
    data: {
      id: nanoid(),
      email,
      name,
      role: "STUDENT",
      updatedAt: new Date(),
    },
  });

  return newUser.id;
}

// -----------------------------------------------------------------------------
// Test Suite
// -----------------------------------------------------------------------------

describe("Booking API Integration", () => {
  let instructorId: string;
  let serviceTypeId: string;
  let studentId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
    
    const student = await createTestStudent();
    studentId = student.userId;

    // Sett opp tilgjengelighet
    await prisma.instructorAvailability.create({
      data: {
        id: nanoid(),
        instructorId,
        dayOfWeek: new Date().getDay(),
        startTime: "09:00",
        endTime: "17:00",
      },
    });
  });

  beforeEach(async () => {
    // Rydd bookinger før hver test
    await prisma.booking.deleteMany({
      where: { instructorId },
    });
    await prisma.blockedTime.deleteMany({
      where: { instructorId },
    });
  });

  afterAll(async () => {
    // Rydd opp
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructorAvailability.deleteMany({ where: { instructorId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "api-test" } },
    });
  });

  // ---------------------------------------------------------------------------
  // Basisk funksjonalitet
  // ---------------------------------------------------------------------------

  describe("Basic Booking Creation", () => {
    it("should create booking successfully", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime.toISOString(),
        paymentMethod: "STRIPE",
      });

      expect(response.status).toBe(200);
      expect(response.body.bookingId).toBeDefined();
      expect(response.body.clientSecret).toBeDefined();
    });

    it("should reject missing required fields", async () => {
      const response = await mockCreateBookingAPI({
        serviceTypeId: "",
        instructorId: "",
        startTime: "",
        paymentMethod: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Mangler");
    });

    it("should reject invalid payment method", async () => {
      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: addDays(new Date(), 7).toISOString(),
        paymentMethod: "CASH",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("kortbetaling");
    });

    it("should reject invalid start time", async () => {
      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: "not-a-date",
        paymentMethod: "STRIPE",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("Ugyldig");
    });

    it("should reject inactive service", async () => {
      const inactiveServiceId = nanoid();
      await prisma.serviceType.create({
        data: {
          id: inactiveServiceId,
          name: "Inactive",
          category: "INDIVIDUAL",
          duration: 60,
          price: 1000,
          isActive: false,
          minNoticeHours: 0,
          maxAdvanceDays: 365,
          updatedAt: new Date(),
          Instructor: { connect: { id: instructorId } },
        },
      });

      const response = await mockCreateBookingAPI({
        serviceTypeId: inactiveServiceId,
        instructorId,
        startTime: addDays(new Date(), 7).toISOString(),
        paymentMethod: "STRIPE",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("ikke aktiv");

      await prisma.serviceType.delete({ where: { id: inactiveServiceId } });
    });
  });

  // ---------------------------------------------------------------------------
  // Concurrent Booking Prevention (Race Condition Tests)
  // ---------------------------------------------------------------------------

  describe("Concurrent Double Booking Prevention", () => {
    it("should prevent concurrent double bookings - one succeeds, one fails", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      // Send to parallelle requests samtidig
      const [res1, res2] = await Promise.all([
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime.toISOString(),
          paymentMethod: "STRIPE",
        }),
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime.toISOString(),
          paymentMethod: "STRIPE",
        }),
      ]);

      const statuses = [res1.status, res2.status];

      // Én skal lykkes (200), én skal feile (409)
      expect(statuses).toContain(200);
      expect(statuses).toContain(409);

      // Verifiser at bare én booking ble opprettet
      const bookings = await prisma.booking.findMany({
        where: {
          instructorId,
          startTime: { lte: new Date(startTime.getTime() + 1000) },
          startTime: { gte: new Date(startTime.getTime() - 1000) },
        },
      });

      expect(bookings.length).toBe(1);
    });

    it("should prevent concurrent double bookings with slightly different times", async () => {
      const startTime1 = addDays(new Date(), 7);
      startTime1.setHours(14, 0, 0, 0);

      const startTime2 = new Date(startTime1);
      startTime2.setMinutes(30); // Overlapping (14:00-15:00 vs 14:30-15:30)

      // Opprett en service med 60 min varighet
      const [res1, res2] = await Promise.all([
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime1.toISOString(),
          paymentMethod: "STRIPE",
        }),
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime2.toISOString(),
          paymentMethod: "STRIPE",
        }),
      ]);

      const statuses = [res1.status, res2.status];

      // Én skal lykkes, én skal feile pga overlapp
      expect(statuses).toContain(200);
      expect(statuses).toContain(409);
    });

    it("should handle multiple concurrent requests to same slot", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(16, 0, 0, 0);

      // Send 5 parallelle requests
      const requests = Array(5).fill(null).map(() =>
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime.toISOString(),
          paymentMethod: "STRIPE",
        })
      );

      const responses = await Promise.all(requests);

      // Tell suksesser og feil
      const successes = responses.filter(r => r.status === 200).length;
      const conflicts = responses.filter(r => r.status === 409).length;

      // Kun én skal lykkes
      expect(successes).toBe(1);
      expect(conflicts).toBe(4);
    });

    it("should allow concurrent bookings to different time slots", async () => {
      const startTime1 = addDays(new Date(), 7);
      startTime1.setHours(10, 0, 0, 0);

      const startTime2 = addDays(new Date(), 7);
      startTime2.setHours(12, 0, 0, 0);

      // Disse overlapper ikke
      const [res1, res2] = await Promise.all([
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime1.toISOString(),
          paymentMethod: "STRIPE",
        }),
        mockCreateBookingAPI({
          serviceTypeId,
          instructorId,
          startTime: startTime2.toISOString(),
          paymentMethod: "STRIPE",
        }),
      ]);

      // Begge skal lykkes
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);

      // Verifiser at begge ble opprettet
      const bookings = await prisma.booking.findMany({
        where: {
          instructorId,
          startTime: {
            gte: new Date(startTime1.getFullYear(), startTime1.getMonth(), startTime1.getDate()),
            lt: new Date(startTime1.getFullYear(), startTime1.getMonth(), startTime1.getDate() + 1),
          },
        },
      });

      expect(bookings.length).toBe(2);
    });

    it("should prevent booking during blocked time even in race condition", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(11, 0, 0, 0);

      // Opprett blokkert tid
      await prisma.blockedTime.create({
        data: {
          id: nanoid(),
          instructorId,
          startTime: new Date(startTime.getTime() - 60000),
          endTime: new Date(startTime.getTime() + 3600000),
          reason: "Møte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime.toISOString(),
        paymentMethod: "STRIPE",
      });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("blokkert");
    });
  });

  // ---------------------------------------------------------------------------
  // Buffer-tider
  // ---------------------------------------------------------------------------

  describe("Buffer Time Handling", () => {
    it("should respect buffer before and after", async () => {
      // Oppdater service med buffer
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: {
          bufferBefore: 15,
          bufferAfter: 15,
        },
      });

      const startTime1 = addDays(new Date(), 7);
      startTime1.setHours(14, 0, 0, 0);

      // Opprett første booking
      await createTestBooking(studentId, instructorId, serviceTypeId, startTime1);

      // Prøv å booke 15:00 (slutter 15:15 med buffer, så 15:00 er OK med 15min etter-buffer)
      // Faktisk: booking 14:00-15:00, buffer 15:00-15:15
      // Ny booking 15:15-16:15 er OK, men 15:00-16:00 overlapper med buffer
      const startTime2 = new Date(startTime1);
      startTime2.setHours(15, 0, 0, 0); // 15:00 - overlapper med buffer

      const resEarly = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime2.toISOString(),
        paymentMethod: "STRIPE",
      });

      expect(resEarly.status).toBe(409);

      // Prøv 15:15 - skal fungere
      const startTime3 = new Date(startTime1);
      startTime3.setHours(15, 15, 0, 0);

      const resLate = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime3.toISOString(),
        paymentMethod: "STRIPE",
      });

      expect(resLate.status).toBe(200);

      // Reset buffer
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { bufferBefore: 0, bufferAfter: 0 },
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Auto-create user
  // ---------------------------------------------------------------------------

  describe("Auto User Creation", () => {
    it("should auto-create user for new email", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);
      const uniqueEmail = `new-user-${nanoid()}@example.com`;

      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime.toISOString(),
        paymentMethod: "STRIPE",
        email: uniqueEmail,
        name: "New Test User",
      });

      expect(response.status).toBe(200);
      expect(response.body.isNewUser).toBe(true);

      // Verifiser at brukeren ble opprettet
      const user = await prisma.user.findUnique({
        where: { email: uniqueEmail },
      });

      expect(user).toBeDefined();
      expect(user?.name).toBe("New Test User");

      // Rydd
      await prisma.user.delete({ where: { email: uniqueEmail } });
    });

    it("should reuse existing user for known email", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      const existingStudent = await createTestStudent();

      const response = await mockCreateBookingAPI({
        serviceTypeId,
        instructorId,
        startTime: startTime.toISOString(),
        paymentMethod: "STRIPE",
        email: `api-student-${existingStudent.userId}@example.com`,
        name: "Some Name",
      });

      expect(response.status).toBe(200);
      expect(response.body.isNewUser).toBe(false);
    });
  });
});

// -----------------------------------------------------------------------------
// Database Consistency Tests
// -----------------------------------------------------------------------------

describe("Database Consistency", () => {
  it("should maintain referential integrity", async () => {
    const instructor = await createTestInstructor();
    const service = await createTestService(instructor.instructorId);
    const student = await createTestStudent();

    const startTime = addDays(new Date(), 7);
    
    // Opprett booking via transaksjon
    const booking = await prisma.$transaction(async (tx) => {
      return tx.booking.create({
        data: {
          id: nanoid(),
          studentId: student.userId,
          instructorId: instructor.instructorId,
          serviceTypeId: service.serviceTypeId,
          startTime,
          endTime: addHours(startTime, 1),
          status: "CONFIRMED",
          amount: 1000,
          updatedAt: new Date(),
        },
      });
    });

    // Verifiser at alle relasjoner fungerer
    const bookingWithRelations = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        Instructor: { include: { User: true } },
        ServiceType: true,
        User: true,
      },
    });

    expect(bookingWithRelations).toBeDefined();
    expect(bookingWithRelations?.Instructor).toBeDefined();
    expect(bookingWithRelations?.ServiceType).toBeDefined();
    expect(bookingWithRelations?.User).toBeDefined();

    // Rydd
    await prisma.booking.delete({ where: { id: booking.id } });
    await prisma.serviceType.delete({ where: { id: service.serviceTypeId } });
    await prisma.instructor.delete({ where: { id: instructor.instructorId } });
    await prisma.user.deleteMany({
      where: { id: { in: [instructor.userId, student.userId] } },
    });
  });
});
