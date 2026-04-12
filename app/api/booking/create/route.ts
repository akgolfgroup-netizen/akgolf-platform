import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { randomUUID } from "crypto";
import { getPortalUser } from "@/lib/portal/auth";
import { verifyCsrf } from "@/lib/portal/csrf";
import { stripe } from "@/lib/portal/stripe";
import { validateBooking } from "@/lib/portal/booking/validation";
import { checkUserQuota, consumeSession, checkWeeklyLimit } from "@/lib/portal/booking/subscription-quota";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { syncBookingToCalendar } from "@/lib/portal/calendar/google-calendar";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

/**
 * Get or create a user for booking.
 * If user is logged in, return existing user.
 * If not logged in, create or find user by email (guest booking).
 */
async function getOrCreateUser(
  email: string,
  name?: string,
  phone?: string
): Promise<{ id: string; email: string; name: string | null; stripeCustomerId: string | null } | null> {
  // First check if user is logged in
  const loggedInUser = await getPortalUser();
  if (loggedInUser?.id) {
    return {
      id: loggedInUser.id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      stripeCustomerId: loggedInUser.stripeCustomerId,
    };
  }

  // Not logged in - find or create user by email
  if (!email) {
    return null;
  }

  const serviceSupabase = createClient(supabaseUrl, supabaseKey);

  // Try to find existing user by email
  const { data: existingUser, error: findError } = await serviceSupabase
    .from("User")
    .select("id, email, name, stripeCustomerId")
    .eq("email", email.toLowerCase().trim())
    .single();

  if (existingUser) {
    // Update name/phone if provided and different
    if ((name && name !== existingUser.name) || phone) {
      await serviceSupabase
        .from("User")
        .update({
          ...(name && { name }),
          ...(phone && { phone }),
          updatedAt: new Date().toISOString(),
        })
        .eq("id", existingUser.id);
    }
    return existingUser;
  }

  // Create new user (guest)
  const newUserId = randomUUID();
  const { data: newUser, error: createError } = await serviceSupabase
    .from("User")
    .insert({
      id: newUserId,
      email: email.toLowerCase().trim(),
      name: name || email.split("@")[0],
      phone: phone || null,
      role: "STUDENT",
      isActive: true,
      subscriptionTier: "VISITOR",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .select("id, email, name, stripeCustomerId")
    .single();

  if (createError || !newUser) {
    console.error("[getOrCreateUser] Failed to create user:", createError);
    return null;
  }

  return newUser;
}

export async function POST(req: NextRequest) {
  // CSRF-beskyttelse: avvis requests fra ukjente origins
  if (!verifyCsrf(req)) {
    return NextResponse.json(
      { error: "Ugyldig forespørsel" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      serviceTypeId,
      instructorId,
      startTime,
      paymentMethod = "STRIPE",
      email,
      name,
      phone,
      focusArea,
      playerNotes,
    } = body;

    // Validate required fields
    if (!serviceTypeId || !instructorId || !startTime) {
      return NextResponse.json(
        { error: "Mangler påkrevde felter" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "E-post er påkrevd" },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "Ugyldig tidspunkt" }, { status: 400 });
    }

    if (start <= new Date()) {
      return NextResponse.json(
        { error: "Tidspunktet må være i fremtiden" },
        { status: 400 }
      );
    }

    // Use service role client — booking/user creation bypasses RLS for guest flow
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create user
    const user = await getOrCreateUser(email, name, phone);
    if (!user?.id) {
      return NextResponse.json(
        { error: "Kunne ikke opprette bruker" },
        { status: 500 }
      );
    }

    // Get service type details
    const { data: serviceType, error: serviceError } = await supabase
      .from("ServiceType")
      .select("*")
      .eq("id", serviceTypeId)
      .single();

    if (serviceError || !serviceType) {
      return NextResponse.json({ error: "Tjeneste ikke funnet" }, { status: 404 });
    }

    // Validate booking
    const validation = await validateBooking({
      serviceTypeId,
      instructorId,
      startTime: start,
      studentId: user.id,
      isAdmin: false,
    });

    if (!validation.valid) {
      const errorMessage = validation.errors?.map(e => e.message).join(", ") || "Ugyldig booking";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    // Check subscription quota for logged-in users
    // If user has active quota and service price is 0 (subscription-covered), consume a session
    const quotaCheck = await checkUserQuota(user.id);
    const isSubscriptionBooking = quotaCheck.hasQuota && serviceType.price === 0;

    if (isSubscriptionBooking) {
      // Sjekk per-uke grense
      const weeklyError = await checkWeeklyLimit(user.id, quotaCheck.tier);
      if (weeklyError) {
        return NextResponse.json({ error: weeklyError }, { status: 400 });
      }

      const consumed = await consumeSession(user.id);
      if (!consumed) {
        return NextResponse.json(
          { error: "Kunne ikke reservere sesjon fra kvoten din. Prøv igjen." },
          { status: 400 }
        );
      }
    }

    // If no subscription and service costs money, Stripe payment is required
    if (!isSubscriptionBooking && serviceType.price > 0 && paymentMethod !== "STRIPE") {
      return NextResponse.json(
        { error: "Betaling kreves for denne tjenesten" },
        { status: 400 }
      );
    }

    const end = new Date(start.getTime() + (serviceType?.duration || 50) * 60000);

    // Check for conflicts in the time window
    const { data: conflict, error: conflictError } = await supabase
      .from("Booking")
      .select("id")
      .eq("instructorId", instructorId)
      .in("status", ["PENDING", "CONFIRMED"])
      .lt("startTime", end.toISOString())
      .gt("endTime", start.toISOString())
      .limit(1)
      .single();

    if (conflictError && conflictError.code !== "PGRST116") {
      throw conflictError;
    }

    if (conflict) {
      throw new ConflictError("Tidspunktet er ikke lenger tilgjengelig");
    }

    // Check for blocked times
    const { data: blocked, error: blockedError } = await supabase
      .from("BlockedTime")
      .select("id")
      .or(`instructorId.eq.${instructorId},instructorId.is.null`)
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

    // Determine if this is a guest booking (not logged in)
    const portalUser = await getPortalUser();
    const isGuest = !portalUser?.id;

    const { data: booking, error: createError } = await supabase
      .from("Booking")
      .insert({
        id: bookingId,
        studentId: user.id,
        instructorId,
        serviceTypeId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        updatedAt: now,
        status: isSubscriptionBooking ? "CONFIRMED" : "PENDING",
        paymentMethod: isSubscriptionBooking ? "NONE" : paymentMethod,
        paymentStatus: isSubscriptionBooking ? "PAID" : (paymentMethod === "STRIPE" ? "PENDING" : "PAID"),
        amount: isSubscriptionBooking ? 0 : (serviceType?.price || 0),
        vatAmount: 0,
        focusArea: focusArea || null,
        playerNotes: playerNotes ? String(playerNotes).slice(0, 500) : null,
        guestEmail: isGuest ? email.toLowerCase().trim() : null,
        guestName: isGuest ? (name || null) : null,
        guestPhone: isGuest ? (phone || null) : null,
      })
      .select(`
        *,
        ServiceType:serviceTypeId(*),
        Instructor:instructorId(
          userId,
          User:userId(name, email, phone)
        )
      `)
      .single();

    if (createError) {
      throw createError;
    }

    // Invalidate cache and broadcast
    const dateStr = start.toISOString().split("T")[0];
    await Promise.all([
      invalidateSlotsCache(instructorId, dateStr),
      invalidateBookingsCache(instructorId),
      broadcastUpdate(instructorId, dateStr, "BOOKING_CREATED", {
        bookingId: booking.id,
        startTime: start.toISOString(),
      }),
    ]);

    // For subscription bookings (no Stripe), send confirmation email immediately
    // Stripe bookings get their email from the webhook after payment
    if (isSubscriptionBooking) {
      const instructorUser = booking.Instructor?.User as { name: string | null; email: string | null; phone: string | null } | null;
      sendBookingConfirmation({
        bookingId: booking.id,
        studentName: user.name ?? name ?? "Kunde",
        studentEmail: user.email ?? email,
        instructorName: instructorUser?.name ?? "Instruktør",
        instructorEmail: instructorUser?.email ?? "",
        serviceName: booking.ServiceType?.name ?? "Coaching",
        startTime: start,
        duration: serviceType?.duration ?? 50,
        amount: 0,
        vatAmount: 0,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) => logger.error("[create] Subscription email failed:", err));
    }

    // Create Stripe checkout if needed
    let redirectUrl: string;
    
    if (paymentMethod === "STRIPE" && booking.amount > 0) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://book.akgolf.no";
      
      // Get or create Stripe customer
      let customerId: string | undefined;
      
      if (user.stripeCustomerId) {
        customerId = user.stripeCustomerId;
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          phone: phone || undefined,
        });
        customerId = customer.id;
        
        // Save to database
        await supabase
          .from("User")
          .update({ stripeCustomerId: customer.id })
          .eq("id", user.id);
      }
      
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: "nok",
              product_data: {
                name: serviceType?.name || "Coaching",
                description: `Coaching-time ${serviceType?.duration || 50} min`,
              },
              unit_amount: booking.amount * 100, // Convert from kroner to øre
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          setup_future_usage: 'off_session', // Save payment method for future use
          metadata: {
            bookingId: booking.id,
            userId: user.id,
          },
        },
        success_url: `${baseUrl}/booking/${booking.id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/booking/${booking.id}/cancel`,
        metadata: {
          bookingId: booking.id,
          userId: user.id,
        },
      });

      redirectUrl = checkoutSession.url!;
    } else {
      redirectUrl = `/booking/${booking.id}/confirmation`;
    }

    // Sync to Google Calendar if instructor has it connected
    if (booking.Instructor?.userId) {
      syncBookingToCalendar(booking.Instructor.userId, {
        id: booking.id,
        serviceName: booking.ServiceType?.name || "",
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        instructorName: booking.Instructor?.User?.name || "",
        location: booking.location || undefined,
      }).then(async (eventId) => {
        // Lagre Google Calendar eventId pa bookingen
        const serviceSupabase = createClient(supabaseUrl, supabaseKey);
        await serviceSupabase
          .from("Booking")
          .update({ googleCalendarEventId: eventId })
          .eq("id", booking.id);
      }).catch((err) => {
        logger.error("Google Calendar sync failed:", err);
      });
    }

    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      redirectUrl,
    });

  } catch (error) {
    if (error instanceof ConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    
    logger.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Noe gikk galt. Vennligst prøv igjen." },
      { status: 500 }
    );
  }
}
