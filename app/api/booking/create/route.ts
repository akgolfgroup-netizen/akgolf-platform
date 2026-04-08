/**
 * Booking Creation API
 * 
 * POST /api/booking/create
 * 
 * Oppretter en ny booking med:
 * - Atomic transaction med pessimistic locking via BookingLock
 * - Konfliktsjekk mot eksisterende bookinger og blokkerte tider
 * - Sanntidsoppdatering av cache og SSE
 * - Støtte for både innloggede og nye brukere
 */

import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { addMinutes } from "date-fns";
import { BookingStatus, PaymentMethod, PaymentStatus, Prisma } from "@prisma/client";
import { autoCreateUser } from "@/lib/portal/booking/auto-create-user";
import { sendWelcomeEmail } from "@/lib/portal/email/send-welcome-email";
import { checkUserQuota, checkBookingWindow, consumeSession } from "@/lib/portal/booking/subscription-quota";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { revalidatePath } from "next/cache";
import { emitBookingEvent } from "@/lib/portal/sync/server";

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Pessimistic locking: Opprett en lås for tidspunktet
async function acquireBookingLock(
  tx: Prisma.TransactionClient,
  instructorId: string,
  startTime: Date,
  endTime: Date,
  lockedBy: string
): Promise<boolean> {
  try {
    // Slett utløpte låser først
    await tx.bookingLock.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });

    // Prøv å opprette lås
    await tx.bookingLock.create({
      data: {
        id: nanoid(),
        instructorId,
        startTime,
        endTime,
        lockedBy,
        expiresAt: addMinutes(new Date(), 5), // 5 minutter lås
      },
    });
    return true;
  } catch {
    // Lås eksisterer allerede
    return false;
  }
}

// Frigjør lås
async function releaseBookingLock(
  tx: Prisma.TransactionClient,
  instructorId: string,
  startTime: Date,
  endTime: Date
): Promise<void> {
  await tx.bookingLock.deleteMany({
    where: {
      instructorId,
      startTime,
      endTime,
    },
  });
}

export async function POST(req: NextRequest) {
  const requestStart = Date.now();
  const requestId = nanoid(8);

  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(
    `booking:create:${clientIp}`,
    RATE_LIMITS.BOOKING_CREATE
  );

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Vent litt før du prøver igjen." },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.ceil((rateLimit.resetAt - Date.now()) / 1000)
          ),
          "X-RateLimit-Limit": String(RATE_LIMITS.BOOKING_CREATE.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  }

  // Support both authenticated and unauthenticated booking
  const user = await getPortalUser();

  let body: {
    serviceTypeId?: string;
    instructorId?: string;
    startTime?: string;
    paymentMethod?: string;
    email?: string;
    name?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { serviceTypeId, instructorId, startTime, paymentMethod, email, name } =
    body;

  if (!serviceTypeId || !instructorId || !startTime || !paymentMethod) {
    return NextResponse.json(
      { error: "Mangler felt: serviceTypeId, instructorId, startTime, paymentMethod" },
      { status: 400 }
    );
  }

  // Determine user: authenticated session OR auto-create from email+name
  let studentId: string;
  let isNewUser = false;
  let tempPassword: string | undefined;

  if (user?.id) {
    studentId = user.id;
  } else if (email && name) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Ugyldig e-postadresse" },
        { status: 400 }
      );
    }

    try {
      const result = await autoCreateUser(
        email.toLowerCase().trim(),
        name.trim()
      );
      studentId = result.userId;
      isNewUser = result.isNewUser;
      tempPassword = result.tempPassword;
    } catch (error) {
      logger.error("[booking/create] Auto-create user failed:", error);
      return NextResponse.json(
        { error: "Kunne ikke opprette brukerkonto" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Ikke innlogget. Oppgi e-post og navn for å booke." },
      { status: 401 }
    );
  }

  if (paymentMethod !== "STRIPE") {
    return NextResponse.json(
      { error: "Kun kortbetaling (Stripe) er tilgjengelig" },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  if (isNaN(start.getTime())) {
    return NextResponse.json(
      { error: "Ugyldig startTime" },
      { status: 400 }
    );
  }

  if (start <= new Date()) {
    return NextResponse.json(
      { error: "Starttidspunkt må være i fremtiden" },
      { status: 400 }
    );
  }

  const dateStr = start.toISOString().split("T")[0];
  const lockId = `req-${requestId}`;

  try {
    // Hent serviceType og sjekk at instructor tilbyr den (én spørring)
    const [serviceType, instructorWithService] = await Promise.all([
      prisma.serviceType.findUnique({
        where: { id: serviceTypeId },
        select: {
          duration: true,
          price: true,
          name: true,
          vatRate: true,
          isActive: true,
          allowStripe: true,
          allowVipps: true,
          minNoticeHours: true,
          maxAdvanceDays: true,
          bufferBefore: true,
          bufferAfter: true,
        },
      }),
      prisma.instructor.findFirst({
        where: {
          id: instructorId,
          ServiceType: { some: { id: serviceTypeId } },
        },
        select: {
          id: true,
          User: { select: { name: true, email: true } },
        },
      }),
    ]);

    if (!serviceType) {
      throw new ValidationError("Tjeneste ikke funnet");
    }

    if (!serviceType.isActive) {
      throw new ValidationError("Tjenesten er ikke aktiv");
    }

    if (!instructorWithService) {
      throw new ValidationError(
        "Instruktør ikke funnet eller tilbyr ikke denne tjenesten"
      );
    }

    // Valider varslingstid og bestillingshorisont
    const minNoticeMs = serviceType.minNoticeHours * 60 * 60 * 1000;
    if (start.getTime() - Date.now() < minNoticeMs) {
      throw new ValidationError(
        `Bestilling krever minst ${serviceType.minNoticeHours} timers varsel`
      );
    }

    const maxAdvanceMs = serviceType.maxAdvanceDays * 24 * 60 * 60 * 1000;
    if (start.getTime() - Date.now() > maxAdvanceMs) {
      throw new ValidationError(
        `Kan ikke bestille mer enn ${serviceType.maxAdvanceDays} dager frem i tid`
      );
    }

    // Valider at tjenesten støtter Stripe-betaling
    if (!serviceType.allowStripe) {
      throw new ValidationError("Betaling er ikke tilgjengelig for denne tjenesten");
    }

    const end = addMinutes(start, serviceType.duration);

    // Buffer-vinduer for konfliktsjekk (lagret endTime inkluderer IKKE buffer)
    const conflictStart = addMinutes(start, -serviceType.bufferBefore);
    const conflictEnd = addMinutes(end, serviceType.bufferAfter);

    // price er lagret i kroner, vatRate er i prosent (f.eks. 25)
    const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);

    // Check subscription quota for authenticated premium users
    if (studentId) {
      const quotaUser = await prisma.user.findUnique({
        where: { id: studentId },
        select: { subscriptionTier: true },
      });

      if (quotaUser && quotaUser.subscriptionTier !== "VISITOR") {
        const quota = await checkUserQuota(studentId);
        if (!quota.hasQuota) {
          throw new ValidationError(quota.reason || "Ingen kvote tilgjengelig");
        }

        const windowCheck = await checkBookingWindow(studentId, start);
        if (!windowCheck.canBook) {
          throw new ValidationError(
            windowCheck.reason || "Kan ikke booke i dette tidsvinduet"
          );
        }
      }
    }

    // Sjekk for duplikat-booking (samme bruker, samme tid)
    const existingUserBooking = await prisma.booking.findFirst({
      where: {
        studentId,
        instructorId,
        startTime: start,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
    });

    if (existingUserBooking) {
      throw new ConflictError("Du har allerede en booking på dette tidspunktet");
    }

    // Atomisk konfliktsjekk + opprettelse via serializable transaksjon med pessimistic locking
    const booking = await prisma.$transaction(
      async (tx) => {
        // 1. Prøv å skaffe lås (pessimistic locking)
        const lockAcquired = await acquireBookingLock(
          tx,
          instructorId,
          start,
          end,
          lockId
        );

        if (!lockAcquired) {
          throw new ConflictError(
            "Tidspunktet er under behandling av noen andre. Prøv igjen om et øyeblikk."
          );
        }

        try {
          // 2. Sjekk for booking-konflikt
          const bookingConflict = await tx.booking.findFirst({
            where: {
              instructorId,
              status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
              AND: [
                { startTime: { lt: conflictEnd } },
                { endTime: { gt: conflictStart } },
              ],
            },
          });

          if (bookingConflict) {
            throw new ConflictError("Tidspunktet ble nettopp booket av noen andre");
          }

          // 3. Sjekk for blokkerte tider
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
            throw new ConflictError("Tidspunktet er ikke lenger tilgjengelig");
          }

          // 4. Opprett booking
          const newBooking = await tx.booking.create({
            data: {
              id: nanoid(),
              studentId,
              instructorId,
              serviceTypeId,
              startTime: start,
              endTime: end,
              status: BookingStatus.PENDING,
              paymentMethod: PaymentMethod.STRIPE,
              paymentStatus: PaymentStatus.PENDING,
              amount: serviceType.price,
              vatAmount,
              updatedAt: new Date(),
            },
          });

          return newBooking;
        } finally {
          // Frigjør lås etter opprettelse (uavhengig av resultat)
          await releaseBookingLock(tx, instructorId, start, end);
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5000,
        timeout: 10000,
      }
    );

    // Decrement quota for premium users (non-blocking)
    if (studentId) {
      const quotaUser = await prisma.user.findUnique({
        where: { id: studentId },
        select: { subscriptionTier: true },
      });

      if (quotaUser && quotaUser.subscriptionTier !== "VISITOR") {
        consumeSession(studentId).catch((err) =>
          logger.error("[booking/create] consumeSession failed:", err)
        );
      }
    }

    // Send welcome email for new users (non-blocking)
    if (isNewUser && tempPassword) {
      sendWelcomeEmail({
        name: name!,
        email: email!,
        tempPassword,
        serviceName: serviceType.name,
        instructorName: instructorWithService.User.name ?? "Instruktør",
        startTime: start,
        duration: serviceType.duration,
        amount: serviceType.price,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err) =>
        logger.error("[booking/create] Welcome email failed:", err)
      );
    }

    // Revalidate cache og broadcast oppdatering (non-blocking)
    Promise.all([
      // Revalidate paths (triggers fresh data fetch)
      revalidatePath("/portal/booking"),
      revalidatePath("/portal/admin/tilgjengelighet"),
      revalidatePath("/api/portal/public/slots"),
      
      // Invalidate cache via POST to slots API
      fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/portal/public/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructorId, date: dateStr }),
      }).catch(() => {
        // Silent fail - cache will expire naturally
      }),
      
      // Broadcast SSE event for real-time updates
      emitBookingEvent(
        "BOOKING_CREATED",
        {
          id: booking.id,
          studentId,
          instructorId,
          startTime: start,
          endTime: end,
          status: BookingStatus.PENDING,
        },
        studentId,
        "PORTAL"
      ),
    ]).catch((err) => {
      logger.error("[booking/create] Cache/SSE update failed:", err);
    });

    logger.info(
      `[booking/create] [${requestId}] Created booking ${booking.id} for instructor ${instructorId} at ${start.toISOString()} (${Date.now() - requestStart}ms)`
    );

    // Opprett Stripe Payment Intent
    let paymentIntent: Awaited<ReturnType<typeof stripe.paymentIntents.create>>;

    try {
      // price er lagret i kroner — Stripe krever øre, så gang med 100
      paymentIntent = await stripe.paymentIntents.create({
        amount: serviceType.price * 100,
        currency: "nok",
        metadata: { bookingId: booking.id },
        automatic_payment_methods: { enabled: true },
      });
    } catch (stripeError) {
      // Rydd opp booking ved Stripe-feil
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
      });

      logger.error("[booking/create] Stripe error:", stripeError);
      throw new Error("Kunne ikke opprette betaling");
    }

    if (!paymentIntent.client_secret) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.CANCELLED },
      });
      throw new Error("Kunne ikke opprette betaling");
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentId: paymentIntent.id },
    });

    return NextResponse.json({
      bookingId: booking.id,
      clientSecret: paymentIntent.client_secret,
      isNewUser,
    });
  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    logger.error("[booking/create] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
