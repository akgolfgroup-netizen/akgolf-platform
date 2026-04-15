import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { randomUUID } from "crypto";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { stripe } from "@/lib/portal/stripe";
import { addMinutes, startOfWeek, endOfWeek } from "date-fns";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";

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

  const supabase = await createServerSupabase();

  try {
    // Fetch coaching package
    const { data: coachingPackage, error: packageError } = await supabase
      .from("CoachingPackage")
      .select("*")
      .eq("slug", packageSlug)
      .single();

    if (packageError || !coachingPackage || !coachingPackage.isActive) {
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

    if (coachingPackage.billingType === "RECURRING") {
      const { data: sub, error: subError } = await supabase
        .from("UserSubscription")
        .select("*")
        .eq("userId", user.id)
        .eq("packageId", coachingPackage.id)
        .eq("status", "ACTIVE")
        .single();

      if (subError || !sub) {
        return NextResponse.json(
          {
            error:
              "Du har ikke et aktivt abonnement for denne pakken. Kontakt oss for a komme i gang.",
          },
          { status: 403 }
        );
      }

      subscription = sub;

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

        const { count: bookingsThisWeek, error: weekError } = await supabase
          .from("Booking")
          .select("*", { count: "exact", head: true })
          .eq("studentId", user.id)
          .gte("startTime", weekStart.toISOString())
          .lte("startTime", weekEnd.toISOString())
          .in("status", ["PENDING", "CONFIRMED"]);

        if (!weekError && bookingsThisWeek && bookingsThisWeek >= coachingPackage.maxBookingsPerWeek) {
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
    const { data: instructor, error: instructorError } = await supabase
      .from("Instructor")
      .select("id, User!inner(role)")
      .eq("User.role", "ADMIN")
      .limit(1)
      .single();

    if (instructorError || !instructor) {
      return NextResponse.json(
        { error: "Ingen instruktor tilgjengelig" },
        { status: 500 }
      );
    }

    // Get a service type to link (use INDIVIDUAL category)
    const { data: serviceType, error: serviceTypeError } = await supabase
      .from("ServiceType")
      .select("id")
      .eq("category", "INDIVIDUAL")
      .eq("isActive", true)
      .limit(1)
      .single();

    if (serviceTypeError || !serviceType) {
      return NextResponse.json(
        { error: "Ingen tjenestetype funnet" },
        { status: 500 }
      );
    }

    // Check for conflicts in the time window
    const { data: conflict, error: conflictError } = await supabase
      .from("Booking")
      .select("id")
      .eq("instructorId", instructor.id)
      .in("status", ["PENDING", "CONFIRMED"])
      .lt("startTime", end.toISOString())
      .gt("endTime", start.toISOString())
      .limit(1)
      .single();

    if (conflictError && conflictError.code !== "PGRST116") {
      throw conflictError;
    }

    if (conflict) {
      throw new ConflictError("Tidspunktet er ikke lenger ledig");
    }

    // Check for blocked times
    const { data: blocked, error: blockedError } = await supabase
      .from("BlockedTime")
      .select("id")
      .or(`instructorId.eq.${instructor.id},instructorId.is.null`)
      .lt("startTime", end.toISOString())
      .gt("endTime", start.toISOString())
      .limit(1)
      .single();

    if (blockedError && blockedError.code !== "PGRST116") {
      throw blockedError;
    }

    if (blocked) {
      throw new ConflictError("Tidspunktet er ikke tilgjengelig");
    }

    // Create the booking
    const now = new Date().toISOString();
    const bookingId = randomUUID();

    const isRecurring = coachingPackage.billingType === "RECURRING";

    const { data: newBooking, error: createError } = await supabase
      .from("Booking")
      .insert({
        id: bookingId,
        studentId: user.id,
        instructorId: instructor.id,
        serviceTypeId: serviceType.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        updatedAt: now,
        status: isRecurring ? "CONFIRMED" : "PENDING",
        paymentMethod: isRecurring ? "NONE" : "STRIPE",
        paymentStatus: isRecurring ? "PAID" : "PENDING",
        amount: isRecurring ? 0 : coachingPackage.priceNok * 100, // Convert NOK to ore
        vatAmount: 0,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // For subscription users: increment sessions used
    if (subscription) {
      const { error: updateError } = await supabase
        .from("UserSubscription")
        .update({
          sessionsUsedThisMonth: subscription.sessionsUsedThisMonth + 1,
          updatedAt: now,
        })
        .eq("id", subscription.id);

      if (updateError) {
        logger.error("[coaching/book] Failed to update subscription:", updateError);
      }
    }

    // Invalider cache og broadcast oppdatering
    const dateStr = start.toISOString().split("T")[0];
    
    await Promise.all([
      invalidateSlotsCache(instructor.id, dateStr),
      invalidateBookingsCache(instructor.id),
      broadcastUpdate(instructor.id, dateStr, "BOOKING_CREATED", {
        bookingId: newBooking.id,
        startTime: start.toISOString(),
      }),
    ]);

    // For one-time (Flex) packages: create Stripe Checkout Session
    if (coachingPackage.billingType === "ONE_TIME") {
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
          bookingId: newBooking.id,
          packageSlug: coachingPackage.slug,
        },
        success_url: `${baseUrl}/coaching/bekreftelse?bookingId=${newBooking.id}`,
        cancel_url: `${baseUrl}/coaching?cancelled=true`,
      });

      // Store Stripe session ID
      await supabase
        .from("Booking")
        .update({ stripePaymentId: checkoutSession.id })
        .eq("id", newBooking.id);

      return NextResponse.json({
        bookingId: newBooking.id,
        checkoutUrl: checkoutSession.url,
        type: "checkout",
      });
    }

    // For subscription users: booking confirmed directly
    // Get session count info for response
    const sessionsThisMonth = subscription
      ? subscription.sessionsUsedThisMonth + 1
      : 0;

    return NextResponse.json({
      bookingId: newBooking.id,
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
