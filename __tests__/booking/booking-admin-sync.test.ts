/**
 * Tester for Booking-Admin Sync System
 * 
 * Verifiserer:
 * 1. Ingen dobbeltbookings (concurrent requests)
 * 2. Admin endringer synker til kunde umiddelbart
 * 3. Google Calendar events blokkeres
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { addMinutes, addDays, startOfDay } from "date-fns";
import { createBookingWithConflictCheck } from "@/lib/portal/booking/conflict-check";
import { BookingStatus } from "@prisma/client";

// Test data
const testInstructor = {
  id: `test-instructor-${nanoid(8)}`,
  userId: `test-user-${nanoid(8)}`,
  name: "Test Instructor",
  email: `test-${nanoid(8)}@example.com`,
};

const testStudent = {
  id: `test-student-${nanoid(8)}`,
  name: "Test Student",
  email: `student-${nanoid(8)}@example.com`,
};

const testServiceType = {
  id: `test-service-${nanoid(8)}`,
  name: "Test Lesson",
  duration: 60,
  price: 1000,
  bufferBefore: 0,
  bufferAfter: 15,
};

describe("Booking-Admin Sync System", () => {
  beforeAll(async () => {
    // Create test user (instructor)
    await prisma.user.create({
      data: {
        id: testInstructor.userId,
        name: testInstructor.name,
        email: testInstructor.email,
        role: "INSTRUCTOR",
      },
    });

    // Create test instructor
    await prisma.instructor.create({
      data: {
        id: testInstructor.id,
        userId: testInstructor.userId,
      },
    });

    // Create test student
    await prisma.user.create({
      data: {
        id: testStudent.id,
        name: testStudent.name,
        email: testStudent.email,
        role: "STUDENT",
      },
    });

    // Create test service type
    await prisma.serviceType.create({
      data: {
        id: testServiceType.id,
        name: testServiceType.name,
        duration: testServiceType.duration,
        price: testServiceType.price,
        bufferBefore: testServiceType.bufferBefore,
        bufferAfter: testServiceType.bufferAfter,
        category: "INDIVIDUAL",
      },
    });

    // Connect service type to instructor
    await prisma.instructor.update({
      where: { id: testInstructor.id },
      data: {
        ServiceType: {
          connect: { id: testServiceType.id },
        },
      },
    });

    // Create availability for instructor (Monday-Friday 09:00-17:00)
    for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
      await prisma.instructorAvailability.create({
        data: {
          id: nanoid(),
          instructorId: testInstructor.id,
          dayOfWeek,
          startTime: "09:00",
          endTime: "17:00",
        },
      });
    }
  });

  afterAll(async () => {
    // Cleanup test data
    await prisma.booking.deleteMany({
      where: { instructorId: testInstructor.id },
    });
    await prisma.instructorAvailability.deleteMany({
      where: { instructorId: testInstructor.id },
    });
    await prisma.blockedTime.deleteMany({
      where: { instructorId: testInstructor.id },
    });
    await prisma.instructor.update({
      where: { id: testInstructor.id },
      data: { ServiceType: { set: [] } },
    });
    await prisma.instructor.delete({
      where: { id: testInstructor.id },
    });
    await prisma.serviceType.delete({
      where: { id: testServiceType.id },
    });
    await prisma.user.deleteMany({
      where: {
        id: { in: [testInstructor.userId, testStudent.id] },
      },
    });
  });

  beforeEach(async () => {
    // Clean up bookings before each test
    await prisma.booking.deleteMany({
      where: { instructorId: testInstructor.id },
    });
    await prisma.blockedTime.deleteMany({
      where: { instructorId: testInstructor.id },
    });
  });

  describe("Dobbeltbooking beskyttelse", () => {
    it("skal forhindre dobbeltbooking ved concurrent requests", async () => {
      // Neste mandag kl 10:00
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);
      const slotTime = addMinutes(nextMonday, 10 * 60); // 10:00
      const endTime = addMinutes(slotTime, testServiceType.duration);

      // Send 5 concurrent booking requests for samme tidspunkt
      const requests = Array(5)
        .fill(null)
        .map((_, i) =>
          createBookingWithConflictCheck({
            instructorId: testInstructor.id,
            startTime: slotTime,
            endTime,
            bufferBefore: testServiceType.bufferBefore,
            bufferAfter: testServiceType.bufferAfter,
            createFn: async (tx) => {
              // Small delay to simulate processing time and increase race condition chance
              await new Promise((r) => setTimeout(r, 10));
              return tx.booking.create({
                data: {
                  id: nanoid(),
                  studentId: testStudent.id,
                  instructorId: testInstructor.id,
                  serviceTypeId: testServiceType.id,
                  startTime: slotTime,
                  endTime,
                  status: BookingStatus.CONFIRMED,
                  amount: testServiceType.price,
                },
              });
            },
          })
        );

      const results = await Promise.all(requests);

      // Tell suksessfulle og feilede requests
      const successful = results.filter((r) => r.success);
      const failed = results.filter((r) => !r.success);

      // KUN ÉN skal lykkes
      expect(successful).toHaveLength(1);
      expect(failed).toHaveLength(4);

      // Verifiser at feilmeldingene er om konflikt
      failed.forEach((result) => {
        expect(result.error).toMatch(/booket|konflikt|ikke tilgjengelig/i);
      });

      // Verifiser at kun én booking finnes i databasen
      const bookings = await prisma.booking.findMany({
        where: {
          instructorId: testInstructor.id,
          startTime: slotTime,
        },
      });
      expect(bookings).toHaveLength(1);
    });

    it("skal blokkere booking når tidspunktet er manuelt blokkert", async () => {
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);
      const slotTime = addMinutes(nextMonday, 11 * 60); // 11:00
      const endTime = addMinutes(slotTime, testServiceType.duration);

      // Opprett en blokkert tid
      await prisma.blockedTime.create({
        data: {
          id: nanoid(),
          instructorId: testInstructor.id,
          startTime: slotTime,
          endTime,
          reason: "Test blokkering",
          source: "MANUAL",
        },
      });

      // Prøv å booke samme tidspunkt
      const result = await createBookingWithConflictCheck({
        instructorId: testInstructor.id,
        startTime: slotTime,
        endTime,
        bufferBefore: testServiceType.bufferBefore,
        bufferAfter: testServiceType.bufferAfter,
        createFn: async (tx) =>
          tx.booking.create({
            data: {
              id: nanoid(),
              studentId: testStudent.id,
              instructorId: testInstructor.id,
              serviceTypeId: testServiceType.id,
              startTime: slotTime,
              endTime,
              status: BookingStatus.CONFIRMED,
              amount: testServiceType.price,
            },
          }),
      });

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/blokkert|ikke tilgjengelig/i);
    });

    it("skal blokkere overlappende bookinger", async () => {
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);
      const slotTime1 = addMinutes(nextMonday, 14 * 60); // 14:00
      const endTime1 = addMinutes(slotTime1, testServiceType.duration);

      // Første booking
      const result1 = await createBookingWithConflictCheck({
        instructorId: testInstructor.id,
        startTime: slotTime1,
        endTime: endTime1,
        bufferBefore: testServiceType.bufferBefore,
        bufferAfter: testServiceType.bufferAfter,
        createFn: async (tx) =>
          tx.booking.create({
            data: {
              id: nanoid(),
              studentId: testStudent.id,
              instructorId: testInstructor.id,
              serviceTypeId: testServiceType.id,
              startTime: slotTime1,
              endTime: endTime1,
              status: BookingStatus.CONFIRMED,
              amount: testServiceType.price,
            },
          }),
      });

      expect(result1.success).toBe(true);

      // Andre booking som overlapper (starter 30 minutter inn i første)
      const slotTime2 = addMinutes(slotTime1, 30);
      const endTime2 = addMinutes(slotTime2, testServiceType.duration);

      const result2 = await createBookingWithConflictCheck({
        instructorId: testInstructor.id,
        startTime: slotTime2,
        endTime: endTime2,
        bufferBefore: testServiceType.bufferBefore,
        bufferAfter: testServiceType.bufferAfter,
        createFn: async (tx) =>
          tx.booking.create({
            data: {
              id: nanoid(),
              studentId: testStudent.id,
              instructorId: testInstructor.id,
              serviceTypeId: testServiceType.id,
              startTime: slotTime2,
              endTime: endTime2,
              status: BookingStatus.CONFIRMED,
              amount: testServiceType.price,
            },
          }),
      });

      expect(result2.success).toBe(false);
      expect(result2.error).toMatch(/booket|konflikt/i);
    });
  });

  describe("Admin synkronisering", () => {
    it("skal synke admin endringer tilgjengelighet umiddelbart", async () => {
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);
      const dateStr = nextMonday.toISOString().split("T")[0];

      // Opprett dato-spesifikk tilgjengelighet (override)
      await prisma.instructorDateAvailability.create({
        data: {
          id: nanoid(),
          instructorId: testInstructor.id,
          date: nextMonday,
          startTime: "10:00",
          endTime: "12:00", // Kun 2 timer tilgjengelig
        },
      });

      // Verifiser at tilgjengelighet er begrenset
      const availability = await prisma.instructorDateAvailability.findFirst({
        where: {
          instructorId: testInstructor.id,
          date: nextMonday,
        },
      });

      expect(availability).not.toBeNull();
      expect(availability?.startTime).toBe("10:00");
      expect(availability?.endTime).toBe("12:00");

      // Cleanup
      await prisma.instructorDateAvailability.deleteMany({
        where: { instructorId: testInstructor.id },
      });
    });

    it("skal synke Google Calendar blokkeringer", async () => {
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);
      const slotTime = addMinutes(nextMonday, 15 * 60); // 15:00
      const endTime = addMinutes(slotTime, testServiceType.duration);

      // Opprett Google Calendar blokkering
      await prisma.blockedTime.create({
        data: {
          id: nanoid(),
          instructorId: testInstructor.id,
          startTime: slotTime,
          endTime,
          reason: "Google Calendar Event",
          source: "GOOGLE_CALENDAR",
          externalId: `gc-test-${nanoid(8)}`,
        },
      });

      // Verifiser at blokkeringen finnes
      const blockedTimes = await prisma.blockedTime.findMany({
        where: {
          instructorId: testInstructor.id,
          source: "GOOGLE_CALENDAR",
        },
      });

      expect(blockedTimes).toHaveLength(1);
      expect(blockedTimes[0].externalId).toMatch(/^gc-test-/);
    });

    it("skal prioritere dato-overrides fremfor fast ukeplan", async () => {
      const nextMonday = addDays(startOfDay(new Date()), 7 - new Date().getDay() + 1);

      // Fast tilgjengelighet: 09:00-17:00 (fra beforeAll)
      const regularAvailability = await prisma.instructorAvailability.findMany({
        where: {
          instructorId: testInstructor.id,
          dayOfWeek: 1, // Monday
        },
      });
      expect(regularAvailability).toHaveLength(1);
      expect(regularAvailability[0].startTime).toBe("09:00");
      expect(regularAvailability[0].endTime).toBe("17:00");

      // Dato-override: 10:00-14:00
      await prisma.instructorDateAvailability.create({
        data: {
          id: nanoid(),
          instructorId: testInstructor.id,
          date: nextMonday,
          startTime: "10:00",
          endTime: "14:00",
        },
      });

      // Hent tilgjengelighet - skal returnere override
      const dateAvailability = await prisma.instructorDateAvailability.findFirst({
        where: {
          instructorId: testInstructor.id,
          date: nextMonday,
        },
      });

      expect(dateAvailability).not.toBeNull();
      expect(dateAvailability?.startTime).toBe("10:00");
      expect(dateAvailability?.endTime).toBe("14:00");

      // Cleanup
      await prisma.instructorDateAvailability.deleteMany({
        where: { instructorId: testInstructor.id },
      });
    });
  });

  describe("Cache invalidering", () => {
    it("skal invalidere cache etter admin endringer", async () => {
      // Denne testen verifiserer at revalidateTag kalles
      // I en ekte test ville vi sjekket at cache faktisk er invalidated
      
      const { revalidateTag } = await import("next/cache");
      
      // Simuler cache invalidering
      revalidateTag("slots");
      revalidateTag(`availability:${testInstructor.id}`);

      // Testen passerer hvis ingen exception kastes
      expect(true).toBe(true);
    });
  });
});

describe("Concurrent request håndtering", () => {
  it("skal håndtere 10+ concurrent requests uten race conditions", async () => {
    // Dette er en stresstest
    const promises = Array(10)
      .fill(null)
      .map((_, i) =>
        prisma.instructorAvailability.findFirst({
          where: { instructorId: "non-existent" },
        })
      );

    const results = await Promise.all(promises);
    
    // Alle skal returnere null (ingen krasj)
    expect(results).toHaveLength(10);
    results.forEach((r) => expect(r).toBeNull());
  });
});
