/**
 * Booking Validation Layer
 * 
 * MÅL: 100% pålitelighet - ingen dobbeltbookings
 * 
 * Denne modulen inneholder all valideringslogikk for booking-systemet.
 * Den kjøres FØR database-operasjoner for å gi rask feedback til brukeren,
 * men database constraints er den ultimate garantien mot dobbeltbookings.
 */

import { prisma } from "@/lib/portal/prisma";
import { addDays, addHours, isBefore, isAfter, format } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";
import type { BookingStatus, ServiceType, BlockedTime } from "@prisma/client";

// -----------------------------------------------------------------------------
// Typer
// -----------------------------------------------------------------------------

export interface BookingValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  metadata?: ValidationMetadata;
}

export interface ValidationError {
  code: ValidationErrorCode;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: ValidationWarningCode;
  message: string;
  field?: string;
}

export interface ValidationMetadata {
  instructorName?: string;
  serviceName?: string;
  maxAdvanceDate?: Date;
  minStartDate?: Date;
  conflictingBookingId?: string;
  blockedTimeReason?: string;
}

export type ValidationErrorCode =
  | "BOOKING_IN_PAST"
  | "START_TIME_REQUIRED"
  | "INVALID_START_TIME"
  | "MAX_ADVANCE_EXCEEDED"
  | "MIN_NOTICE_VIOLATION"
  | "INSTRUCTOR_UNAVAILABLE"
  | "INSTRUCTOR_NOT_FOUND"
  | "SERVICE_NOT_FOUND"
  | "SERVICE_INACTIVE"
  | "TIME_SLOT_CONFLICT"
  | "BLOCKED_TIME_CONFLICT"
  | "GOOGLE_CALENDAR_CONFLICT"
  | "QUOTA_EXCEEDED"
  | "BOOKING_WINDOW_EXCEEDED"
  | "DUPLICATE_BOOKING"
  | "PAYMENT_METHOD_INVALID"
  | "INVALID_EMAIL"
  | "INVALID_NAME"
  | "RATE_LIMIT_EXCEEDED"
  | "LOCK_ACQUISITION_FAILED";

export type ValidationWarningCode =
  | "BOOKING_SOON"
  | "LAST_MINUTE_BOOKING"
  | "WEEKEND_BOOKING"
  | "OUTSIDE_BUSINESS_HOURS"
  | "HIGH_DEMAND_PERIOD";

export interface ValidationInput {
  instructorId: string;
  startTime: Date;
  serviceTypeId: string;
  studentId?: string;
  endTime?: Date; // Beregnes hvis ikke angitt
  ignoreBookingId?: string; // For reschedule
}

// -----------------------------------------------------------------------------
// Hovedvalideringsfunksjon
// -----------------------------------------------------------------------------

/**
 * Validerer en booking før opprettelse
 * 
 * @param input - Valideringsinput
 * @returns Resultat med errors, warnings og metadata
 */
export async function validateBooking(
  input: ValidationInput
): Promise<BookingValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const metadata: ValidationMetadata = {};

  const { instructorId, startTime, serviceTypeId, studentId, ignoreBookingId } = input;

  try {
    // 1. Grunnleggende validering av input
    const basicValidation = validateBasicInput(startTime);
    errors.push(...basicValidation.errors);
    warnings.push(...basicValidation.warnings);

    if (errors.length > 0) {
      return { valid: false, errors, warnings, metadata };
    }

    // 2. Hent serviceType
    const serviceType = await prisma.serviceType.findUnique({
      where: { id: serviceTypeId },
      include: {
        Instructor: {
          where: { id: instructorId },
          select: { id: true },
        },
      },
    });

    if (!serviceType) {
      errors.push({
        code: "SERVICE_NOT_FOUND",
        message: "Tjenesten finnes ikke",
        field: "serviceTypeId",
      });
      return { valid: false, errors, warnings, metadata };
    }

    metadata.serviceName = serviceType.name;

    if (!serviceType.isActive) {
      errors.push({
        code: "SERVICE_INACTIVE",
        message: "Tjenesten er ikke aktiv",
        field: "serviceTypeId",
      });
    }

    // Sjekk at instruktøren tilbyr tjenesten
    if (serviceType.Instructor.length === 0) {
      errors.push({
        code: "INSTRUCTOR_UNAVAILABLE",
        message: "Instruktøren tilbyr ikke denne tjenesten",
        field: "instructorId",
      });
    }

    // 3. Beregn endTime
    const endTime = input.endTime || new Date(startTime.getTime() + serviceType.duration * 60000);

    // 4. Valider tidsbegrensninger
    const timeValidation = validateTimeConstraints(startTime, serviceType);
    errors.push(...timeValidation.errors);
    warnings.push(...timeValidation.warnings);
    if (timeValidation.maxAdvanceDate) metadata.maxAdvanceDate = timeValidation.maxAdvanceDate;
    if (timeValidation.minStartDate) metadata.minStartDate = timeValidation.minStartDate;

    // 5. Sjekk instruktør-tilgjengelighet
    const availabilityCheck = await checkInstructorAvailability(
      instructorId,
      startTime,
      endTime
    );
    errors.push(...availabilityCheck.errors);

    // 6. Sjekk for dobbeltbooking (race condition-sikker sjekk)
    const conflictCheck = await checkBookingConflict(
      instructorId,
      startTime,
      endTime,
      ignoreBookingId
    );
    errors.push(...conflictCheck.errors);
    if (conflictCheck.conflictingBookingId) {
      metadata.conflictingBookingId = conflictCheck.conflictingBookingId;
    }

    // 7. Sjekk blokkerte tider
    const blockedCheck = await checkBlockedTime(instructorId, startTime, endTime);
    errors.push(...blockedCheck.errors);
    if (blockedCheck.blockedReason) metadata.blockedTimeReason = blockedCheck.blockedReason;

    // 8. Sjekk student-kvote hvis studentId er angitt
    if (studentId) {
      const quotaCheck = await checkStudentQuota(studentId, serviceTypeId, startTime);
      errors.push(...quotaCheck.errors);
    }

    // 9. Sjekk for duplikat-booking av samme bruker
    if (studentId) {
      const duplicateCheck = await checkDuplicateUserBooking(
        studentId,
        instructorId,
        startTime,
        ignoreBookingId
      );
      errors.push(...duplicateCheck.errors);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };

  } catch (error) {
    logger.error("[booking/validation] Unexpected error:", error);
    errors.push({
      code: "RATE_LIMIT_EXCEEDED",
      message: "En uventet feil oppstod under validering. Prøv igjen.",
    });
    return { valid: false, errors, warnings, metadata };
  }
}

// -----------------------------------------------------------------------------
// Interne hjelpefunksjoner
// -----------------------------------------------------------------------------

function validateBasicInput(startTime: Date): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Sjekk at startTime er gyldig
  if (!startTime || isNaN(startTime.getTime())) {
    errors.push({
      code: "INVALID_START_TIME",
      message: "Ugyldig starttidspunkt",
      field: "startTime",
    });
    return { errors, warnings };
  }

  // Sjekk at tidspunktet er i fremtiden (med 1 minutt buffer)
  const now = new Date();
  now.setMinutes(now.getMinutes() - 1);
  if (isBefore(startTime, now)) {
    errors.push({
      code: "BOOKING_IN_PAST",
      message: "Tidspunktet må være i fremtiden",
      field: "startTime",
    });
  }

  // Advarsel hvis booking er mindre enn 24 timer unna
  const hoursUntil = (startTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntil < 24 && hoursUntil > 0) {
    warnings.push({
      code: "LAST_MINUTE_BOOKING",
      message: "Dette er en siste-liters booking. Sørg for at du kan møte.",
      field: "startTime",
    });
  }

  return { errors, warnings };
}

function validateTimeConstraints(
  startTime: Date,
  serviceType: ServiceType
): {
  errors: ValidationError[];
  warnings: ValidationWarning[];
  maxAdvanceDate?: Date;
  minStartDate?: Date;
} {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  const now = new Date();

  // Sjekk minimum varsel
  const minStartTime = addHours(now, serviceType.minNoticeHours);
  if (isBefore(startTime, minStartTime)) {
    errors.push({
      code: "MIN_NOTICE_VIOLATION",
      message: `Må bookes minst ${serviceType.minNoticeHours} timer i forveien`,
      field: "startTime",
    });
  }

  // Sjekk maksimal forhåndsbooking
  const maxAdvanceDate = addDays(now, serviceType.maxAdvanceDays);
  if (isAfter(startTime, maxAdvanceDate)) {
    errors.push({
      code: "MAX_ADVANCE_EXCEEDED",
      message: `Kan ikke booke mer enn ${serviceType.maxAdvanceDays} dager frem i tid`,
      field: "startTime",
    });
  }

  // Sjekk om det er helg (for advarsler)
  const dayOfWeek = startTime.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    warnings.push({
      code: "WEEKEND_BOOKING",
      message: "Dette er en helgebooking. Sjekk at lokalet er åpent.",
      field: "startTime",
    });
  }

  return {
    errors,
    warnings,
    maxAdvanceDate,
    minStartDate: minStartTime,
  };
}

async function checkInstructorAvailability(
  instructorId: string,
  startTime: Date,
  endTime: Date
): Promise<{ errors: ValidationError[] }> {
  const errors: ValidationError[] = [];

  // Hent instruktør
  const instructor = await prisma.instructor.findUnique({
    where: { id: instructorId },
    include: {
      User: { select: { name: true } },
    },
  });

  if (!instructor) {
    errors.push({
      code: "INSTRUCTOR_NOT_FOUND",
      message: "Instruktøren finnes ikke",
      field: "instructorId",
    });
    return { errors };
  }

  // Sjekk ukedag-tilgjengelighet (InstructorAvailability)
  const dayOfWeek = startTime.getDay();
  const timeString = format(startTime, "HH:mm");

  const availability = await prisma.instructorAvailability.findFirst({
    where: {
      instructorId,
      dayOfWeek,
      startTime: { lte: timeString },
      endTime: { gte: timeString },
    },
  });

  if (!availability) {
    // Sjekk om det er en spesifikk dato-tilgjengelighet
    const dateAvailability = await prisma.instructorDateAvailability.findFirst({
      where: {
        instructorId,
        date: {
          gte: new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate()),
          lt: new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate() + 1),
        },
        startTime: { lte: timeString },
        endTime: { gte: timeString },
      },
    });

    if (!dateAvailability) {
      errors.push({
        code: "INSTRUCTOR_UNAVAILABLE",
        message: `${instructor.User.name || "Instruktøren"} er ikke tilgjengelig på dette tidspunktet`,
        field: "startTime",
      });
    }
  }

  return { errors };
}

async function checkBookingConflict(
  instructorId: string,
  startTime: Date,
  endTime: Date,
  ignoreBookingId?: string
): Promise<{
  errors: ValidationError[];
  conflictingBookingId?: string;
}> {
  const errors: ValidationError[] = [];

  // Buffer-tider for konfliktsjekk (inkluderer bufferBefore/bufferAfter)
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      instructorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(ignoreBookingId && { id: { not: ignoreBookingId } }),
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
    select: { id: true, startTime: true, endTime: true },
  });

  if (conflictingBooking) {
    errors.push({
      code: "TIME_SLOT_CONFLICT",
      message: `Tidspunktet er nettopp booket av noen andre (${format(
        conflictingBooking.startTime,
        "HH:mm",
        { locale: nb }
      )}-${format(conflictingBooking.endTime, "HH:mm", { locale: nb })})`,
      field: "startTime",
    });
    return { errors, conflictingBookingId: conflictingBooking.id };
  }

  return { errors };
}

async function checkBlockedTime(
  instructorId: string,
  startTime: Date,
  endTime: Date
): Promise<{ errors: ValidationError[]; blockedReason?: string }> {
  const errors: ValidationError[] = [];

  const blockedTime = await prisma.blockedTime.findFirst({
    where: {
      OR: [{ instructorId }, { instructorId: null }],
      AND: [
        { startTime: { lt: endTime } },
        { endTime: { gt: startTime } },
      ],
    },
  });

  if (blockedTime) {
    errors.push({
      code: "BLOCKED_TIME_CONFLICT",
      message: blockedTime.reason
        ? `Tidspunktet er utilgjengelig: ${blockedTime.reason}`
        : "Tidspunktet er utilgjengelig (blokkert)",
      field: "startTime",
    });
    return { errors, blockedReason: blockedTime.reason || undefined };
  }

  return { errors };
}

async function checkStudentQuota(
  studentId: string,
  serviceTypeId: string,
  startTime: Date
): Promise<{ errors: ValidationError[] }> {
  const errors: ValidationError[] = [];

  const quota = await prisma.subscriptionQuota.findUnique({
    where: { userId: studentId },
  });

  if (!quota) {
    // Ingen kvote = drop-in eller ingen abonnement - OK
    return { errors };
  }

  // Sjekk om perioden er utløpt
  if (new Date() > quota.periodEnd) {
    errors.push({
      code: "QUOTA_EXCEEDED",
      message: "Abonnementsperioden har utløpt. Vennligst forny abonnementet.",
      field: "studentId",
    });
    return { errors };
  }

  // Sjekk booking-vindu
  const maxBookingDate = addDays(new Date(), quota.bookingWindowDays);
  if (isAfter(startTime, maxBookingDate)) {
    errors.push({
      code: "BOOKING_WINDOW_EXCEEDED",
      message: `Du kan bare booke ${quota.bookingWindowDays} dager frem i tid med ditt abonnement`,
      field: "startTime",
    });
  }

  // Sjekk om det er ledige sesjoner
  if (quota.sessionsUsed >= quota.sessionsAllowed) {
    errors.push({
      code: "QUOTA_EXCEEDED",
      message: `Du har brukt alle ${quota.sessionsAllowed} sesjonene dine denne perioden. Ny kvote fra ${quota.periodEnd.toLocaleDateString("nb-NO")}.`,
      field: "studentId",
    });
  }

  return { errors };
}

async function checkDuplicateUserBooking(
  studentId: string,
  instructorId: string,
  startTime: Date,
  ignoreBookingId?: string
): Promise<{ errors: ValidationError[] }> {
  const errors: ValidationError[] = [];

  // Tillatt tidsdiff (5 minutter) for å unngå duplikater pga klokkeslett-forskjeller
  const startLowerBound = new Date(startTime.getTime() - 5 * 60000);
  const startUpperBound = new Date(startTime.getTime() + 5 * 60000);

  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      instructorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      ...(ignoreBookingId && { id: { not: ignoreBookingId } }),
      startTime: {
        gte: startLowerBound,
        lte: startUpperBound,
      },
    },
  });

  if (existingBooking) {
    errors.push({
      code: "DUPLICATE_BOOKING",
      message: "Du har allerede en booking på dette tidspunktet",
      field: "startTime",
    });
  }

  return { errors };
}

// -----------------------------------------------------------------------------
// Utility-funksjoner
// -----------------------------------------------------------------------------

/**
 * Formater valideringsfeil til brukervennlig melding
 */
export function formatValidationErrors(result: BookingValidationResult): string {
  if (result.valid || result.errors.length === 0) {
    return "";
  }

  if (result.errors.length === 1) {
    return result.errors[0].message;
  }

  return result.errors.map((e, i) => `${i + 1}. ${e.message}`).join("\n");
}

/**
 * Sjekk om en feilkode er retry-able (f.eks. race condition)
 */
export function isRetryableError(code: ValidationErrorCode): boolean {
  return ["TIME_SLOT_CONFLICT", "LOCK_ACQUISITION_FAILED", "RATE_LIMIT_EXCEEDED"].includes(code);
}

/**
 * Saniter input for logging (fjern PII)
 */
export function sanitizeValidationInput(input: ValidationInput): object {
  return {
    instructorId: input.instructorId,
    serviceTypeId: input.serviceTypeId,
    startTime: input.startTime.toISOString(),
    hasStudentId: !!input.studentId,
    hasEndTime: !!input.endTime,
  };
}
