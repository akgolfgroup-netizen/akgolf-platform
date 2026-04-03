import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { stripe } from "@/lib/portal/stripe";
import { addMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import {
  BookingStatus,
  PaymentMethod,
  PaymentStatus,
  BillingType,
  SubscriptionStatus,
} from "@prisma/client";

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`coaching:${clientIp}`, RATE_LIMITS.COACHING_BOOK);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forsøk. Prøv igjen senere." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  const user = await getPortalUser();

  let body: {
    packageSlug?: string;
    slotTime?: string; // ISO string
    slotsCount?: number; // number of consecutive 20-min slots
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { packageSlug, slotTime } = body;

  if (!packageSlug || !slotTime) {
    return NextResponse.json(
      { error: "Mangler felt: packageSlug, slotTime" },
      { status: 400 }
    );
  }

  if (!user?.id) {
    return NextResponse.json(
      { error: "Du ma vaere innlogget for a booke coaching" },
      { status: 401 }
    );
  }

  const start = new Date(slotTime);
  if (isNaN(start.getTime())) {
    return NextResponse.json({ error: "Ugyldig slotTime" }, { status: 400 });
  }

  if (start <= new Date()) {
    return NextResponse.json(
      { error: "Tidspunktet ma vaere i fremtiden" },
      { status: 400 }
    );
  }

  try {
    // Fetch coaching package
    const coachingPackage = await prisma.coachingPackage.findUnique({
      where: { slug: packageSlug },
    });

    if (!coachingPackage || !coachingPackage.isActive) {
      return NextResponse.json(
        { error: "Pakke ikke funnet eller ikke aktiv" },
        { status: 404 }
      );
    }

    // Calculate end time based on slots required
    const totalDurationMin =
      coachingPackage.slotsRequired * coachingPackage.sessionDurationMin +
      (coachingPackage.slotsRequired - 1) * 5; // 5 min between slots
    const end = addMinutes(start, totalDurationMin);

    // Check user subscription for recurring packages
    let subscription = null;

    if (coachingPackage.billingType === BillingType.RECURRING) {
      subscription = await prisma.userSubscription.findFirst({
        where: {
          userId: user.id,
          packageId: coachingPackage.id,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      if (!subscription) {
        return NextResponse.json(
          {
            error:
              "Du har ikke et aktivt abonnement for denne pakken. Kontakt oss for a komme i gang.",
          },
          { status: 403 }
        );
      }

      // Check sessions used this month
      if (
        coachingPackage.sessionsPerMonth &&
        subscription.sessionsUsedThisMonth >= coachingPackage.sessionsPerMonth
      ) {
        return NextResponse.json(
          {
            error: `Du har brukt alle ${coachingPackage.sessionsPerMonth} sesjoner denne maneden.`,
          },
          { status: 403 }
        );
      }

      // Check max bookings per week
      if (coachingPackage.maxBookingsPerWeek) {
        const weekStart = startOfWeek(start, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(start, { weekStartsOn: 1 });

        const bookingsThisWeek = await prisma.booking.count({
          where: {
            studentId: user.id,
            startTime: { gte: weekStart, lte: weekEnd },
            status: {
              in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
          },
        });

        if (bookingsThisWeek >= coachingPackage.maxBookingsPerWeek) {
          return NextResponse.json(
            {
              error: `Maks ${coachingPackage.maxBookingsPerWeek} bookinger per uke for denne pakken.`,
            },
            { status: 403 }
          );
        }
      }
    }

    // Get the primary instructor (Anders)
    const instructor = await prisma.instructor.findFirst({
      where: {
        User: { role: "ADMIN" },
      },
      select: { id: true },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Ingen instruktor tilgjengelig" },
        { status: 500 }
      );
    }

    // Get a service type to link (use INDIVIDUAL category)
    const serviceType = await prisma.serviceType.findFirst({
      where: {
        category: "INDIVIDUAL",
        isActive: true,
      },
      select: { id: true },
    });

    if (!serviceType) {
      return NextResponse.json(
        { error: "Ingen tjenestetype funnet" },
        { status: 500 }
      );
    }

    // Atomisk: sjekk konflikt og opprett booking
    const booking = await prisma.$transaction(
      async (tx) => {
        // Check for conflicts in the time window
        const conflict = await tx.booking.findFirst({
          where: {
            instructorId: instructor.id,
            status: {
              in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
            AND: [
              { startTime: { lt: end } },
              { endTime: { gt: start } },
            ],
          },
        });

        if (conflict) {
          throw new ConflictError("Tidspunktet er ikke lenger ledig");
        }

        // Create the booking
        const newBooking = await tx.booking.create({
          data: {
            id: randomUUID(),
            studentId: user.id,
            instructorId: instructor.id,
            serviceTypeId: serviceType.id,
            startTime: start,
            endTime: end,
            updatedAt: new Date(),
            status:
              coachingPackage.billingType === BillingType.RECURRING
                ? BookingStatus.CONFIRMED
                : BookingStatus.PENDING,
            paymentMethod:
              coachingPackage.billingType === BillingType.RECURRING
                ? PaymentMethod.NONE
                : PaymentMethod.STRIPE,
            paymentStatus:
              coachingPackage.billingType === BillingType.RECURRING
                ? PaymentStatus.PAID
                : PaymentStatus.PENDING,
            amount:
              coachingPackage.billingType === BillingType.ONE_TIME
                ? coachingPackage.priceNok * 100 // Convert NOK to ore
                : 0,
            vatAmount: 0,
          },
        });

        // For subscription users: increment sessions used
        if (subscription) {
          await tx.userSubscription.update({
            where: { id: subscription.id },
            data: {
              sessionsUsedThisMonth: { increment: 1 },
            },
          });
        }

        return newBooking;
      },
      { isolationLevel: "Serializable" }
    );

    // For one-time (Flex) packages: create Stripe Checkout Session
    if (coachingPackage.billingType === BillingType.ONE_TIME) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://book.akgolf.no";

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "nok",
              product_data: {
                name: coachingPackage.name,
                description: `Coaching-time ${coachingPackage.slotsRequired * coachingPackage.sessionDurationMin} min`,
              },
              unit_amount: coachingPackage.priceNok * 100, // NOK to ore
            },
            quantity: 1,
          },
        ],
        metadata: {
          bookingId: booking.id,
          packageSlug: coachingPackage.slug,
        },
        success_url: `${baseUrl}/coaching/bekreftelse?bookingId=${booking.id}`,
        cancel_url: `${baseUrl}/coaching?cancelled=true`,
      });

      // Store Stripe session ID
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripePaymentId: checkoutSession.id },
      });

      return NextResponse.json({
        bookingId: booking.id,
        checkoutUrl: checkoutSession.url,
        type: "checkout",
      });
    }

    // For subscription users: booking confirmed directly
    // Get session count info for response
    const _monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());

    const sessionsThisMonth = subscription
      ? subscription.sessionsUsedThisMonth + 1
      : 0;

    return NextResponse.json({
      bookingId: booking.id,
      type: "confirmed",
      sessionsUsed: sessionsThisMonth,
      sessionsTotal: coachingPackage.sessionsPerMonth,
    });
  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    logger.error("[coaching/book] Error:", error);
    return NextResponse.json({ error: "Intern feil" }, { status: 500 });
  }
}
