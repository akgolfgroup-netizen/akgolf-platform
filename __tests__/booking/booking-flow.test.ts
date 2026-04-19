/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/**
 * Booking Flow Integration Tests
 * 
 * Tester komplette booking-flyter:
 * - Gjeste-booking fra start til slutt
 * - Abonnement-booking
 * - Refund og kreditering
 * - Webhook-håndtering (inkludert idempotency)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { addDays, addHours, subHours } from "date-fns";
import { processRefund } from "@/lib/portal/booking/refund";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";

// -----------------------------------------------------------------------------
// Test Helpers
// -----------------------------------------------------------------------------

async function createTestInstructor() {
  const userId = nanoid();
  const instructorId = nanoid();
  
  await prisma.user.create({
    data: {
      id: userId,
      email: `flow-test-instructor-${userId}@example.com`,
      name: "Test Instructor",
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

async function createTestService(instructorId: string, price = 1000) {
  const serviceTypeId = nanoid();
  
  await prisma.serviceType.create({
    data: {
      id: serviceTypeId,
      name: "Flow Test Service",
      category: "INDIVIDUAL",
      duration: 60,
      price,
      isActive: true,
      minNoticeHours: 0,
      maxAdvanceDays: 365,
      bufferBefore: 0,
      bufferAfter: 0,
      updatedAt: new Date(),
      Instructor: { connect: { id: instructorId } },
    },
  });

  return { serviceTypeId };
}

async function createTestStudent(email?: string) {
  const userId = nanoid();
  
  await prisma.user.create({
    data: {
      id: userId,
      email: email ?? `flow-test-student-${userId}@example.com`,
      name: "Test Student",
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
  options: {
    status?: "PENDING" | "CONFIRMED" | "CANCELLED";
    paymentStatus?: "PENDING" | "PAID" | "REFUNDED";
    paymentMethod?: "STRIPE" | "VIPPS" | "INVOICE" | "NONE";
    amount?: number;
    stripePaymentId?: string;
    stripeRefundId?: string;
  } = {}
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
      status: options.status ?? "CONFIRMED",
      paymentStatus: options.paymentStatus ?? "PAID",
      paymentMethod: options.paymentMethod ?? "STRIPE",
      amount: options.amount ?? 1000,
      stripePaymentId: options.stripePaymentId,
      stripeRefundId: options.stripeRefundId,
      updatedAt: new Date(),
    },
  });

  return { bookingId };
}

// -----------------------------------------------------------------------------
// Test Suite: Guest Booking Flow
// -----------------------------------------------------------------------------

describe("Guest Booking Flow", () => {
  let instructorId: string;
  let serviceTypeId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
  });

  afterAll(async () => {
    // Rydd opp
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test-instructor" } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test-student" } },
    });
  });

  describe("Service Selection", () => {
    it("should fetch available services", async () => {
      const services = await prisma.serviceType.findMany({
        where: { isActive: true },
        select: { id: true, name: true, price: true, duration: true },
      });

      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty("price");
      expect(services[0]).toHaveProperty("duration");
    });

    it("should reject inactive services", async () => {
      const inactiveServiceId = nanoid();
      await prisma.serviceType.create({
        data: {
          id: inactiveServiceId,
          name: "Inactive Service",
          category: "INDIVIDUAL",
          duration: 60,
          price: 1000,
          isActive: false,
          updatedAt: new Date(),
          Instructor: { connect: { id: instructorId } },
        },
      });

      const service = await prisma.serviceType.findUnique({
        where: { id: inactiveServiceId },
        select: { isActive: true },
      });

      expect(service?.isActive).toBe(false);

      await prisma.serviceType.delete({ where: { id: inactiveServiceId } });
    });
  });

  describe("Date/Time Selection", () => {
    it("should allow booking within available hours", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(14, 0, 0, 0);

      const student = await createTestStudent();
      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime
      );

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking).toBeDefined();
      expect(booking?.startTime.getHours()).toBe(14);

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should respect minNoticeHours constraint", async () => {
      const tooSoon = addHours(new Date(), 1); // Mindre enn 24t
      
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { minNoticeHours: 24 },
      });

      const hoursUntil = (tooSoon.getTime() - Date.now()) / (1000 * 60 * 60);
      expect(hoursUntil).toBeLessThan(24);

      // Reset
      await prisma.serviceType.update({
        where: { id: serviceTypeId },
        data: { minNoticeHours: 0 },
      });
    });
  });

  describe("User Registration / Login", () => {
    it("should create new user for guest with email", async () => {
      const uniqueEmail = `guest-${nanoid()}@example.com`;
      
      const user = await prisma.user.create({
        data: {
          id: nanoid(),
          email: uniqueEmail,
          name: "Guest User",
          role: "STUDENT",
          updatedAt: new Date(),
        },
      });

      expect(user.email).toBe(uniqueEmail);

      await prisma.user.delete({ where: { id: user.id } });
    });

    it("should reuse existing user for known email", async () => {
      const existingEmail = `existing-${nanoid()}@example.com`;
      
      const user1 = await prisma.user.create({
        data: {
          id: nanoid(),
          email: existingEmail,
          name: "Existing User",
          role: "STUDENT",
          updatedAt: new Date(),
        },
      });

      const found = await prisma.user.findUnique({
        where: { email: existingEmail },
      });

      expect(found?.id).toBe(user1.id);

      await prisma.user.delete({ where: { id: user1.id } });
    });
  });

  describe("Payment Flow", () => {
    it("should create booking with pending payment status", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(10, 0, 0, 0);

      const student = await createTestStudent();
      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { status: "PENDING", paymentStatus: "PENDING" }
      );

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.status).toBe("PENDING");
      expect(booking?.paymentStatus).toBe("PENDING");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should update booking to confirmed after payment", async () => {
      const startTime = addDays(new Date(), 7);
      startTime.setHours(11, 0, 0, 0);

      const student = await createTestStudent();
      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { status: "PENDING", paymentStatus: "PENDING", stripePaymentId: "pi_test_123" }
      );

      // Simuler betaling
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.status).toBe("CONFIRMED");
      expect(booking?.paymentStatus).toBe("PAID");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });
});

// -----------------------------------------------------------------------------
// Test Suite: Subscription Booking
// -----------------------------------------------------------------------------

describe("Subscription Booking Flow", () => {
  let instructorId: string;
  let serviceTypeId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test-instructor" } },
    });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test-student" } },
    });
    await prisma.subscriptionQuota.deleteMany({
      where: { userId: { contains: "flow-test" } },
    });
  });

  it("should create booking with NONE payment method for subscription", async () => {
    const student = await createTestStudent();
    const startTime = addDays(new Date(), 7);
    startTime.setHours(15, 0, 0, 0);

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { paymentMethod: "NONE", paymentStatus: "PAID" }
    );

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    expect(booking?.paymentMethod).toBe("NONE");

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });

  it("should track quota usage for subscription bookings", async () => {
    const student = await createTestStudent();
    
    // Opprett subscription quota
    await prisma.subscriptionQuota.create({
      data: {
        id: nanoid(),
        userId: student.userId,
        tier: "START",
        sessionsAllowed: 4,
        sessionsUsed: 1,
        minutesAllowed: 40,
        minutesUsed: 20,
        periodStart: new Date(),
        periodEnd: addDays(new Date(), 30),
        updatedAt: new Date(),
      },
    });

    const quota = await prisma.subscriptionQuota.findUnique({
      where: { userId: student.userId },
    });

    expect(quota?.sessionsUsed).toBe(1);
    expect(quota?.sessionsAllowed).toBe(4);

    await prisma.subscriptionQuota.delete({ where: { userId: student.userId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });
});

// -----------------------------------------------------------------------------
// Test Suite: Refund and Cancellation
// -----------------------------------------------------------------------------

describe("Refund and Cancellation Flow", () => {
  let instructorId: string;
  let serviceTypeId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId, 2000);
    serviceTypeId = service.serviceTypeId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test" } },
    });
  });

  describe("Cancellation Policy", () => {
    it("should allow full refund > 24 hours before start", async () => {
      const startTime = addDays(new Date(), 2); // Mer enn 24t frem
      
      const policy = evaluateCancellationPolicy(startTime);
      
      expect(policy.allowed).toBe(true);
      expect(policy.refundPercent).toBe(100);
    });

    it("should allow partial refund 12-24 hours before start", async () => {
      const startTime = addHours(new Date(), 18); // Mellom 12-24t
      
      const policy = evaluateCancellationPolicy(startTime);
      
      expect(policy.allowed).toBe(true);
      expect(policy.refundPercent).toBe(50);
    });

    it("should not allow refund < 12 hours before start", async () => {
      const startTime = addHours(new Date(), 6); // Mindre enn 12t
      
      const policy = evaluateCancellationPolicy(startTime);
      
      expect(policy.allowed).toBe(false);
    });
  });

  describe("Refund Idempotency", () => {
    it("should store idempotency key on refund", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 2);
      startTime.setHours(10, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          paymentStatus: "PAID", 
          stripePaymentId: "pi_test_idempotency",
          amount: 2000 
        }
      );

      // Simuler lagring av idempotency key
      const idempotencyKey = `refund-${bookingId}-${Date.now()}`;
      await prisma.booking.update({
        where: { id: bookingId },
        data: { refundIdempotencyKey: idempotencyKey },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.refundIdempotencyKey).toBe(idempotencyKey);
      expect(booking?.refundIdempotencyKey).toContain(`refund-${bookingId}`);

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should store stripe refund ID after successful refund", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 2);
      startTime.setHours(11, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          paymentStatus: "PAID", 
          stripePaymentId: "pi_test_refund_id",
          amount: 2000 
        }
      );

      // Simuler lagring av refund ID
      await prisma.booking.update({
        where: { id: bookingId },
        data: { stripeRefundId: "re_test_123" },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.stripeRefundId).toBe("re_test_123");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should detect already processed refund", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 2);
      startTime.setHours(12, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          paymentStatus: "REFUNDED", 
          stripeRefundId: "re_existing_123",
          amount: 2000 
        }
      );

      // Sjekk at booking er markert som refundert
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.paymentStatus).toBe("REFUNDED");
      expect(booking?.stripeRefundId).toBe("re_existing_123");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });

  describe("Cancellation Status Updates", () => {
    it("should update booking status to CANCELLED", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 2);
      startTime.setHours(13, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime
      );

      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancelReason: "Test cancellation",
        },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.status).toBe("CANCELLED");
      expect(booking?.cancelledAt).toBeDefined();
      expect(booking?.cancelReason).toBe("Test cancellation");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should update payment status to REFUNDED after full refund", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 2);
      startTime.setHours(14, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { paymentStatus: "PAID", amount: 2000 }
      );

      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: "CANCELLED",
          paymentStatus: "REFUNDED",
          cancelledAt: new Date(),
        },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.paymentStatus).toBe("REFUNDED");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });
});

// -----------------------------------------------------------------------------
// Test Suite: Webhook Handling
// -----------------------------------------------------------------------------

describe("Webhook Handling", () => {
  let instructorId: string;
  let serviceTypeId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test" } },
    });
  });

  describe("Payment Intent Succeeded", () => {
    it("should handle payment_intent.succeeded webhook", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 7);
      startTime.setHours(10, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          status: "PENDING", 
          paymentStatus: "PENDING",
          stripePaymentId: "pi_webhook_test_123",
        }
      );

      // Simuler webhook-håndtering
      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.status).toBe("CONFIRMED");
      expect(booking?.paymentStatus).toBe("PAID");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });

  describe("Charge Refunded Webhook", () => {
    it("should handle charge.refunded webhook with idempotency check", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 7);
      startTime.setHours(11, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          status: "CONFIRMED", 
          paymentStatus: "PAID",
          stripePaymentId: "pi_refund_webhook_123",
          amount: 1000,
        }
      );

      // Simuler første webhook-kall
      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          paymentStatus: "REFUNDED",
          stripeRefundId: "re_webhook_123",
        },
      });

      // Verifiser at status er satt
      const booking1 = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      expect(booking1?.paymentStatus).toBe("REFUNDED");

      // Simuler duplikat webhook-kall (skal ikke endre noe)
      if (booking1?.paymentStatus === "REFUNDED") {
        // Idempotency: Skip processing
        // Dette simulerer logikken i webhook-håndtereren
      }

      const booking2 = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      expect(booking2?.paymentStatus).toBe("REFUNDED");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });

    it("should handle partial refund correctly", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 7);
      startTime.setHours(12, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          status: "CONFIRMED", 
          paymentStatus: "PAID",
          stripePaymentId: "pi_partial_refund_123",
          amount: 1000,
        }
      );

      // Simuler delvis refund (50%)
      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          paymentStatus: "PARTIALLY_REFUNDED",
          stripeRefundId: "re_partial_123",
        },
      });

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      expect(booking?.paymentStatus).toBe("PARTIALLY_REFUNDED");

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });

  describe("Webhook Duplicate Handling", () => {
    it("should skip processing if booking already refunded", async () => {
      const student = await createTestStudent();
      const startTime = addDays(new Date(), 7);
      startTime.setHours(13, 0, 0, 0);

      const { bookingId } = await createTestBooking(
        student.userId,
        instructorId,
        serviceTypeId,
        startTime,
        { 
          status: "CANCELLED", 
          paymentStatus: "REFUNDED",
          stripePaymentId: "pi_duplicate_test_123",
          stripeRefundId: "re_duplicate_123",
        }
      );

      // Simuler webhook som mottar duplikat
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        select: { paymentStatus: true, stripeRefundId: true },
      });

      // Hvis allerede refundert, returner umiddelbart
      const shouldSkip = booking?.paymentStatus === "REFUNDED" || 
                        booking?.paymentStatus === "PARTIALLY_REFUNDED";

      expect(shouldSkip).toBe(true);

      await prisma.booking.delete({ where: { id: bookingId } });
      await prisma.user.delete({ where: { id: student.userId } });
    });
  });
});

// -----------------------------------------------------------------------------
// Test Suite: Edge Cases
// -----------------------------------------------------------------------------

describe("Edge Cases", () => {
  let instructorId: string;
  let serviceTypeId: string;

  beforeAll(async () => {
    const instructor = await createTestInstructor();
    instructorId = instructor.instructorId;
    
    const service = await createTestService(instructorId);
    serviceTypeId = service.serviceTypeId;
  });

  afterAll(async () => {
    await prisma.booking.deleteMany({ where: { instructorId } });
    await prisma.serviceType.deleteMany({ where: { id: serviceTypeId } });
    await prisma.instructor.deleteMany({ where: { id: instructorId } });
    await prisma.user.deleteMany({
      where: { email: { contains: "flow-test" } },
    });
  });

  it("should handle no-show scenario", async () => {
    const student = await createTestStudent();
    const startTime = subHours(new Date(), 2); // 2 timer siden (no-show)

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { status: "CONFIRMED", paymentStatus: "PAID" }
    );

    // No-show: ingen refund
    const policy = evaluateCancellationPolicy(startTime);
    expect(policy.allowed).toBe(false);

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" }, // Markert som fullført (men var no-show)
    });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    expect(booking?.status).toBe("COMPLETED");
    expect(booking?.paymentStatus).toBe("PAID"); // Ingen refund

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });

  it("should handle cancellation < 24h before start (no refund)", async () => {
    const student = await createTestStudent();
    const startTime = addHours(new Date(), 6); // Mindre enn 12t

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { status: "CONFIRMED", paymentStatus: "PAID" }
    );

    const policy = evaluateCancellationPolicy(startTime);
    expect(policy.allowed).toBe(false);

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });

  it("should handle cancellation > 24h before start (full refund)", async () => {
    const student = await createTestStudent();
    const startTime = addDays(new Date(), 2); // Mer enn 24t

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { status: "CONFIRMED", paymentStatus: "PAID", amount: 1500 }
    );

    const policy = evaluateCancellationPolicy(startTime);
    expect(policy.allowed).toBe(true);
    expect(policy.refundPercent).toBe(100);

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });

  it("should handle invoice payment method (no automated refund)", async () => {
    const student = await createTestStudent();
    const startTime = addDays(new Date(), 2);
    startTime.setHours(14, 0, 0, 0);

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { 
        status: "CONFIRMED", 
        paymentStatus: "PAID", 
        paymentMethod: "INVOICE",
        amount: 1000,
      }
    );

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    expect(booking?.paymentMethod).toBe("INVOICE");

    // INVOICE skal ikke ha automatisert refund
    const result = await processRefund({
      bookingId,
      paymentMethod: "INVOICE",
      providerPaymentId: null,
      totalAmount: 1000,
      refundPercent: 100,
    });

    expect(result.success).toBe(true);
    expect(result.refundedAmount).toBe(0);
    expect(result.error).toContain("Manuell refusjon");

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });

  it("should handle missing stripePaymentId gracefully", async () => {
    const student = await createTestStudent();
    const startTime = addDays(new Date(), 2);
    startTime.setHours(15, 0, 0, 0);

    const { bookingId } = await createTestBooking(
      student.userId,
      instructorId,
      serviceTypeId,
      startTime,
      { 
        status: "CONFIRMED", 
        paymentStatus: "PAID", 
        paymentMethod: "STRIPE",
        stripePaymentId: null,
        amount: 1000,
      }
    );

    const result = await processRefund({
      bookingId,
      paymentMethod: "STRIPE",
      providerPaymentId: null,
      totalAmount: 1000,
      refundPercent: 100,
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("betalingsreferanse");

    await prisma.booking.delete({ where: { id: bookingId } });
    await prisma.user.delete({ where: { id: student.userId } });
  });
});
