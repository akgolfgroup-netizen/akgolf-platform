/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Booking Validation Unit Tests
 * 
 * Tester all valideringslogikk i booking-systemet.
 * MÅL: 100% coverage på valideringsfunksjoner
 */

import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/portal/prisma";
import {
  validateBooking,
  formatValidationErrors,
  isRetryableError,
  sanitizeValidationInput,
  type ValidationInput,
} from "@/lib/portal/booking/validation";
import { addDays, addHours, subHours } from "date-fns";
import { nanoid } from "nanoid";

// -----------------------------------------------------------------------------
// Test Helpers
// -----------------------------------------------------------------------------

async function createTestInstructor() {
  const userId = nanoid();
  const instructorId = nanoid();
  
  await prisma.user.create({
    data: {
      id: userId,
      email: `test-${userId}@example.com`,
      name: `Test Instructor ${userId.slice(0, 5)}`,
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
      name: `Test Service ${serviceTypeId.slice(0, 5)}`,
      category: "INDIVIDUAL",
      duration: 60,
      price: 1000,
      isActive: true,
      minNoticeHours: 24,
      maxAdvanceDays: 60,
      bufferBefore: 0,
      bufferAfter: 15,
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
      email: `student-${userId}@example.com`,
      name: `Test Student ${userId.slice(0, 5)}`,
      role: "STUDENT",
    },
  });

  return { userId };
}

async function createTestAvailability(
  instructorId: string,
  dayOfWeek: number,
  startTime: string = "09:00",
  endTime: string = "17:00"
) {
  await prisma.instructorAvailability.create({
    data: {
      id: nanoid(),
      instructorId,
      dayOfWeek,
      startTime,
      endTime,
    },
  });
}

async function createTestBooking(
  studentId: string,
  instructorId: string,
  serviceTypeId: string,
  startTime: Date,
  duration: number = 60
) {
  const bookingId = nanoid();
  
  await prisma.booking.create({
    data: {
      id: bookingId,
      studentId,
      instructorId,
      serviceTypeId,
      startTime,
      endTime: new Date(startTime.getTime() + duration * 60000),
      status: "CONFIRMED",
      amount: 1000,
      updatedAt: new Date(),
    },
  });

  return { bookingId };
}

// -----------------------------------------------------------------------------
// Test Suite
// -----------------------------------------------------------------------------

describe("Booking Validation", () => {
  let instructorId: string;
  let serviceTypeId: string;
  let studentId: string;
  let testDate: Date;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
    
    const student = await createTestStudent();
    studentId = student.userId;

    // Sett opp tilgjengelighet for kommende onsdag
    const nextWednesday = new Date();
    nextWednesday.setDate(nextWednesday.getDate() + (3 - nextWednesday.getDay() + 7) % 7);
    if (nextWednesday.getDay() !== 3) {
      nextWednesday.setDate(nextWednesday.getDate() + 7);
    }
    testDate = nextWednesday;
    
    await createTestAvailability(instructorId, 3, "09:00", "17:00");
  });

  beforeEach(async () => {
    // Rydd bookinger før hver test
    await prisma.booking.deleteMany({
      where: {
        studentId: { in: [studentId] },
      },
    });
    
    // Rydd blokkerte tider
    await prisma.blockedTime.deleteMany({
      where: { instructorId: { in: [instructorId, null] } },
    });
  });

  afterAll(async () => {
    // Rydd opp
    await prisma.booking.deleteMany({
      where: { instructorId },
    });
    await prisma.serviceType.deleteMany({
      where: { id: serviceTypeId },
    });
    await prisma.instructorAvailability.deleteMany({
      where: { instructorId },
    });
    await prisma.instructor.deleteMany({
      where: { id: instructorId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [studentId, instructorId.replace(/ins/, "usr")] } },
    });
  });

  // ---------------------------------------------------------------------------
  // Grunnleggende validering
  // ---------------------------------------------------------------------------

  describe("Basic Input Validation", () => {
    it("should reject bookings in the past", async () => {
      const pastTime = subHours(new Date(), 1);

      const result = await validateBooking({
        instructorId,
        startTime: pastTime,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "BOOKING_IN_PAST",
          message: "Tidspunktet må være i fremtiden",
        })
      );
    });

    it("should reject invalid start time", async () => {
      const result = await validateBooking({
        instructorId,
        startTime: new Date("invalid"),
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "INVALID_START_TIME",
          message: "Ugyldig starttidspunkt",
        })
      );
    });

    it("should accept valid future booking", async () => {
      const futureTime = addDays(new Date(), 7);
      futureTime.setHours(14, 0, 0, 0);

      const result = await validateBooking({
        instructorId,
        startTime: futureTime,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  // ---------------------------------------------------------------------------
  // Tidsbegrensninger
  // ---------------------------------------------------------------------------

  describe("Time Constraints", () => {
    it("should reject booking with less than minimum notice", async () => {
      const tooSoon = addHours(new Date(), 2); // Mindre enn 24t varsel

      const result = await validateBooking({
        instructorId,
        startTime: tooSoon,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MIN_NOTICE_VIOLATION",
          message: expect.stringContaining("minst"),
        })
      );
    });

    it("should reject booking beyond max advance days", async () => {
      const tooFar = addDays(new Date(), 70); // Mer enn 60 dager

      const result = await validateBooking({
        instructorId,
        startTime: tooFar,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "MAX_ADVANCE_EXCEEDED",
          message: expect.stringContaining("dager"),
        })
      );
    });

    it("should warn about last-minute booking", async () => {
      const lastMinute = addHours(new Date(), 12); // Mindre enn 24t

      const result = await validateBooking({
        instructorId,
        startTime: lastMinute,
        serviceTypeId,
        studentId,
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "LAST_MINUTE_BOOKING",
        })
      );
    });

    it("should warn about weekend booking", async () => {
      const saturday = new Date();
      saturday.setDate(saturday.getDate() + (6 - saturday.getDay() + 7) % 7);
      saturday.setHours(14, 0, 0, 0);

      const result = await validateBooking({
        instructorId,
        startTime: saturday,
        serviceTypeId,
        studentId,
      });

      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          code: "WEEKEND_BOOKING",
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Instruktør-tilgjengelighet
  // ---------------------------------------------------------------------------

  describe("Instructor Availability", () => {
    it("should reject booking when instructor is not available", async () => {
      // Søndag kl 14 - ingen tilgjengelighet satt opp
      const sunday = new Date();
      sunday.setDate(sunday.getDate() + (0 - sunday.getDay() + 7) % 7);
      sunday.setHours(14, 0, 0, 0);

      const result = await validateBooking({
        instructorId,
        startTime: sunday,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "INSTRUCTOR_UNAVAILABLE",
        })
      );
    });

    it("should reject booking for non-existent instructor", async () => {
      const result = await validateBooking({
        instructorId: "non-existent-id",
        startTime: addDays(new Date(), 7),
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "INSTRUCTOR_NOT_FOUND",
        })
      );
    });

    it("should accept booking during available time", async () => {
      // Onsdag kl 14 - tilgjengelighet satt opp i beforeAll
      const wednesday14 = new Date(testDate);
      wednesday14.setHours(14, 0, 0, 0);

      const result = await validateBooking({
        instructorId,
        startTime: wednesday14,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Konfliktdeteksjon (Dobbeltbooking)
  // ---------------------------------------------------------------------------

  describe("Booking Conflict Detection", () => {
    it("should reject double booking on same time slot", async () => {
      // Opprett første booking
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await createTestBooking(
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        60
      );

      // Prøv å booke samme tid med annen student
      const otherStudent = await createTestStudent();

      const result = await validateBooking({
        instructorId,
        startTime,
        serviceTypeId,
        studentId: otherStudent.userId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "TIME_SLOT_CONFLICT",
          message: expect.stringContaining("nettopp booket"),
        })
      );
    });

    it("should reject overlapping booking", async () => {
      // Opprett booking 14:00-15:00
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await createTestBooking(
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        60
      );

      // Prøv å booke 14:30-15:30 (overlapper)
      const overlappingStart = new Date(startTime);
      overlappingStart.setMinutes(30);

      const otherStudent = await createTestStudent();

      const result = await validateBooking({
        instructorId,
        startTime: overlappingStart,
        serviceTypeId,
        studentId: otherStudent.userId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "TIME_SLOT_CONFLICT",
        })
      );
    });

    it("should reject booking completely inside existing booking", async () => {
      // Opprett lang booking 14:00-16:00
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { duration: 120 },
      });

      await createTestBooking(
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        120
      );

      // Prøv å booke 14:30-15:30 (inne i eksisterende)
      const innerStart = new Date(startTime);
      innerStart.setMinutes(30);

      const otherStudent = await createTestStudent();

      // Reset duration for validering
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { duration: 60 },
      });

      const result = await validateBooking({
        instructorId,
        startTime: innerStart,
        serviceTypeId,
        studentId: otherStudent.userId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "TIME_SLOT_CONFLICT",
        })
      );
    });

    it("should reject booking completely surrounding existing booking", async () => {
      // Opprett booking 14:00-15:00
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await createTestBooking(
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        60
      );

      // Prøv å booke 13:30-15:30 (omslutter eksisterende)
      const outerStart = new Date(startTime);
      outerStart.setMinutes(-30);

      const otherStudent = await createTestStudent();

      // Update service for longer duration
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { duration: 120 },
      });

      const result = await validateBooking({
        instructorId,
        startTime: outerStart,
        serviceTypeId,
        studentId: otherStudent.userId,
      });

      expect(result.valid).toBe(false);
    });

    it("should allow booking after existing booking ends", async () => {
      // Opprett booking 14:00-15:00
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await createTestBooking(
        studentId,
        instructorId,
        serviceTypeId,
        startTime,
        60
      );

      // Prøv å booke 15:00-16:00 (rett etter)
      const afterStart = new Date(startTime);
      afterStart.setHours(15, 0, 0, 0);

      const otherStudent = await createTestStudent();

      const result = await validateBooking({
        instructorId,
        startTime: afterStart,
        serviceTypeId,
        studentId: otherStudent.userId,
      });

      expect(result.valid).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Blokkerte tider
  // ---------------------------------------------------------------------------

  describe("Blocked Time Handling", () => {
    it("should reject booking during blocked time", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      // Blokker tidspunktet
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

      const result = await validateBooking({
        instructorId,
        startTime,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "BLOCKED_TIME_CONFLICT",
        })
      );
    });

    it("should reject booking during global blocked time", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      // Global blokkering (instructorId = null)
      await prisma.blockedTime.create({
        data: {
          id: nanoid(),
          instructorId: null,
          startTime: new Date(startTime.getTime() - 60000),
          endTime: new Date(startTime.getTime() + 3600000),
          reason: "Ferie",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const result = await validateBooking({
        instructorId,
        startTime,
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "BLOCKED_TIME_CONFLICT",
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Tjeneste-validering
  // ---------------------------------------------------------------------------

  describe("Service Type Validation", () => {
    it("should reject inactive service", async () => {
      const inactiveServiceId = nanoid();
      
      await prisma.serviceType.create({
        data: {
          id: inactiveServiceId,
          name: "Inactive Service",
          category: "INDIVIDUAL",
          duration: 60,
          price: 1000,
          isActive: false,
          Instructor: { connect: { id: instructorId } },
        },
      });

      const result = await validateBooking({
        instructorId,
        startTime: addDays(new Date(), 7),
        serviceTypeId: inactiveServiceId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SERVICE_INACTIVE",
        })
      );

      await prisma.serviceType.delete({ where: { id: inactiveServiceId } });
    });

    it("should reject non-existent service", async () => {
      const result = await validateBooking({
        instructorId,
        startTime: addDays(new Date(), 7),
        serviceTypeId: "non-existent",
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "SERVICE_NOT_FOUND",
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Student-kvote
  // ---------------------------------------------------------------------------

  describe("Student Quota", () => {
    it("should reject booking when quota exceeded", async () => {
      // Opprett kvote med 0 ledige sesjoner
      await prisma.subscriptionQuota.create({
        data: {
          id: nanoid(),
          userId: studentId,
          tier: "PERFORMANCE",
          sessionsAllowed: 2,
          sessionsUsed: 2,
          periodStart: new Date(),
          periodEnd: addDays(new Date(), 30),
          bookingWindowDays: 7,
          minutesAllowed: 40,
          minutesUsed: 40,
          updatedAt: new Date(),
        },
      });

      const result = await validateBooking({
        instructorId,
        startTime: addDays(new Date(), 3),
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "QUOTA_EXCEEDED",
        })
      );

      await prisma.subscriptionQuota.deleteMany({ where: { userId: studentId } });
    });

    it("should reject booking outside booking window", async () => {
      // Opprett kvote med 7 dagers booking-vindu
      await prisma.subscriptionQuota.create({
        data: {
          id: nanoid(),
          userId: studentId,
          tier: "PERFORMANCE",
          sessionsAllowed: 4,
          sessionsUsed: 0,
          periodStart: new Date(),
          periodEnd: addDays(new Date(), 30),
          bookingWindowDays: 7,
          minutesAllowed: 40,
          minutesUsed: 0,
          updatedAt: new Date(),
        },
      });

      const result = await validateBooking({
        instructorId,
        startTime: addDays(new Date(), 14), // 14 dager frem - utenfor 7-dagers vindu
        serviceTypeId,
        studentId,
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "BOOKING_WINDOW_EXCEEDED",
        })
      );

      await prisma.subscriptionQuota.deleteMany({ where: { userId: studentId } });
    });
  });

  // ---------------------------------------------------------------------------
  // Duplikat-booking
  // ---------------------------------------------------------------------------

  describe("Duplicate Booking Prevention", () => {
    it("should reject duplicate booking by same user", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      await createTestBooking(studentId, instructorId, serviceTypeId, startTime, 60);

      const result = await validateBooking({
        instructorId,
        startTime,
        serviceTypeId,
        studentId, // Samme student
      });

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          code: "DUPLICATE_BOOKING",
        })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Utility-funksjoner
  // ---------------------------------------------------------------------------

  describe("Utility Functions", () => {
    it("formatValidationErrors should format single error", () => {
      const result = {
        valid: false,
        errors: [{ code: "BOOKING_IN_PAST" as const, message: "Tidspunktet må være i fremtiden" }],
        warnings: [],
      };

      const formatted = formatValidationErrors(result);
      expect(formatted).toBe("Tidspunktet må være i fremtiden");
    });

    it("formatValidationErrors should format multiple errors", () => {
      const result = {
        valid: false,
        errors: [
          { code: "BOOKING_IN_PAST" as const, message: "Feil 1" },
          { code: "QUOTA_EXCEEDED" as const, message: "Feil 2" },
        ],
        warnings: [],
      };

      const formatted = formatValidationErrors(result);
      expect(formatted).toBe("1. Feil 1\n2. Feil 2");
    });

    it("isRetryableError should identify retryable errors", () => {
      expect(isRetryableError("TIME_SLOT_CONFLICT")).toBe(true);
      expect(isRetryableError("LOCK_ACQUISITION_FAILED")).toBe(true);
      expect(isRetryableError("RATE_LIMIT_EXCEEDED")).toBe(true);
      expect(isRetryableError("BOOKING_IN_PAST")).toBe(false);
      expect(isRetryableError("QUOTA_EXCEEDED")).toBe(false);
    });

    it("sanitizeValidationInput should remove PII", () => {
      const input: ValidationInput = {
        instructorId: "ins-123",
        startTime: new Date("2025-01-15T14:00:00Z"),
        serviceTypeId: "svc-456",
        studentId: "stu-789",
        endTime: new Date("2025-01-15T15:00:00Z"),
      };

      const sanitized = sanitizeValidationInput(input);
      
      expect(sanitized).toEqual({
        instructorId: "ins-123",
        serviceTypeId: "svc-456",
        startTime: "2025-01-15T14:00:00.000Z",
        hasStudentId: true,
        hasEndTime: true,
      });
      // @ts-ignore - studentId skal ikke eksistere
      expect(sanitized.studentId).toBeUndefined();
    });
  });
});
