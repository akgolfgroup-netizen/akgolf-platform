import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { randomUUID } from "crypto";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { stripe } from "@/lib/portal/stripe";
import { validateBooking } from "@/lib/portal/booking/validation";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { syncBookingToCalendar } from "@/lib/portal/calendar/google-calendar";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { checkUserQuota, consumeSession } from "@/lib/portal/booking/subscription-quota";
import { sendBookingConfirmation } from "@/lib/portal/email/send-booking-email";
import { sendBookingConfirmationSms } from "@/lib/portal/sms/send-booking-sms";

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
interface BookingUser {
  id: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
  isLoggedIn: boolean;
}

async function getOrCreateUser(
  email: string,
  name?: string,
  phone?: string
): Promise<BookingUser | null> {
  // First check if user is logged in
  const loggedInUser = await getPortalUser();
  if (loggedInUser?.id) {
    return {
      id: loggedInUser.id,
      email: loggedInUser.email,
      name: loggedInUser.name,
      stripeCustomerId: loggedInUser.stripeCustomerId,
      isLoggedIn: true,
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
    return { ...existingUser, isLoggedIn: false };
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
      role: "USER",
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

  return { ...newUser, isLoggedIn: false };
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const rateLimit = checkRateLimit(
      `booking-create:${getClientIp(req)}`,
      RATE_LIMITS.BOOKING_CREATE
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "For mange forespørsler. Vent litt og prøv igjen." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      serviceTypeId,
      instructorId,
      startTime,
      paymentMethod = "STRIPE",
      email,
      name,
      phone
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

    const supabase = await createServerSupabase();

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

    const end = new Date(start.getTime() + (serviceType?.duration || 50) * 60000);

    // Atomisk booking-opprettelse — sjekk + insert i én transaksjon
    const bookingId = randomUUID();
    const serviceSupabase = createClient(supabaseUrl, supabaseKey);

    const { data: rpcResult, error: rpcError } = await serviceSupabase.rpc(
      "create_booking_atomic",
      {
        p_id: bookingId,
        p_student_id: user.id,
        p_instructor_id: instructorId,
        p_service_type_id: serviceTypeId,
        p_start_time: start.toISOString(),
        p_end_time: end.toISOString(),
        p_payment_method: paymentMethod,
        p_payment_status: paymentMethod === "STRIPE" ? "PENDING" : "PAID",
        p_amount: serviceType?.price || 0,
        p_vat_amount: 0,
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    const atomicResult = rpcResult as {
      success: boolean;
      error?: string;
      message?: string;
      bookingId?: string;
    };

    if (!atomicResult.success) {
      throw new ConflictError(
        atomicResult.message || "Tidspunktet er ikke tilgjengelig"
      );
    }

    // Hent den opprettede bookingen med relasjoner (inkl. instruktør e-post/telefon for varsling)
    const { data: booking, error: fetchError } = await supabase
      .from("Booking")
      .select(`
        *,
        ServiceType:serviceTypeId(*),
        Instructor:instructorId(
          userId,
          User:userId(name, email, phone)
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      throw new Error("Booking opprettet, men kunne ikke hentes");
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

    // --- 3-TIER PAYMENT LOGIC ---
    // 1. Subscription user → book within quota, no payment
    // 2. Logged-in non-subscription → confirm now, charge after session
    // 3. Guest → pay now via Stripe Checkout

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://book.akgolf.no";
    const instructorUser = booking.Instructor?.User as { name: string | null; email: string | null; phone: string | null } | null;
    let redirectUrl: string;
    let paymentFlow: "subscription" | "deferred" | "stripe_checkout" = "stripe_checkout";

    // Helper: send confirmation email + SMS (non-blocking)
    const sendConfirmations = () => {
      sendBookingConfirmation({
        bookingId: booking.id,
        studentName: user.name ?? name ?? "Kunde",
        studentEmail: user.email ?? email,
        instructorName: instructorUser?.name ?? "Instruktor",
        instructorEmail: instructorUser?.email ?? "",
        serviceName: booking.ServiceType?.name ?? "Coaching",
        startTime: start,
        duration: serviceType?.duration ?? 50,
        amount: booking.amount,
        vatAmount: booking.vatAmount ?? 0,
        location: "Gamle Fredrikstad Golfklubb",
      }).catch((err: unknown) => logger.error("Email failed:", err));

      if (instructorUser?.phone) {
        sendBookingConfirmationSms({
          instructorPhone: instructorUser.phone,
          instructorName: instructorUser.name ?? "Instruktor",
          studentName: user.name ?? name ?? "Kunde",
          serviceName: booking.ServiceType?.name ?? "Coaching",
          startTime: start,
          duration: serviceType?.duration ?? 50,
        }).catch((err: unknown) => logger.error("SMS failed:", err));
      }
    };

    if (user.isLoggedIn) {
      // Check subscription quota
      const quotaResult = await checkUserQuota(user.id);

      if (quotaResult.hasQuota && booking.amount >= 0) {
        // --- TIER 1: SUBSCRIPTION USER ---
        paymentFlow = "subscription";

        // Consume a session from quota
        const consumed = await consumeSession(user.id);
        if (!consumed) {
          // Quota race condition — fall through to deferred payment
          logger.warn(`[Booking] Quota consume failed for user ${user.id}, falling back to deferred`);
        } else {
          // Update booking to CONFIRMED + PAID
          await serviceSupabase
            .from("Booking")
            .update({
              status: "CONFIRMED",
              paymentMethod: "NONE",
              paymentStatus: "PAID",
              updatedAt: new Date().toISOString(),
            })
            .eq("id", bookingId);

          sendConfirmations();

          redirectUrl = `${baseUrl}/booking/${booking.id}/confirmation`;

          // Sync to Google Calendar
          if (booking.Instructor?.userId) {
            syncBookingToCalendar(booking.Instructor.userId, {
              id: booking.id,
              serviceName: booking.ServiceType?.name || "",
              startTime: new Date(booking.startTime),
              endTime: new Date(booking.endTime),
              instructorName: instructorUser?.name || "",
              location: booking.location || undefined,
            }).catch((err) => logger.error("Google Calendar sync failed:", err));
          }

          return NextResponse.json({
            bookingId: booking.id,
            status: "CONFIRMED",
            paymentFlow,
            redirectUrl,
          });
        }
      }

      // --- TIER 2: LOGGED-IN, NO SUBSCRIPTION (or quota failed) ---
      // Confirm booking immediately, payment deferred (charged after session)
      paymentFlow = "deferred";

      // Ensure user has Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          phone: phone || undefined,
        });
        customerId = customer.id;
        await serviceSupabase
          .from("User")
          .update({ stripeCustomerId: customer.id, updatedAt: new Date().toISOString() })
          .eq("id", user.id);
      }

      // Check if user has a saved payment method
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
        limit: 1,
      });

      if (paymentMethods.data.length === 0) {
        // No saved card — create SetupIntent for card setup, then confirm
        const setupIntent = await stripe.setupIntents.create({
          customer: customerId,
          usage: "off_session",
          metadata: {
            bookingId: booking.id,
            userId: user.id,
          },
        });

        // Update booking to PENDING_CARD_SETUP
        await serviceSupabase
          .from("Booking")
          .update({
            status: "CONFIRMED",
            paymentStatus: "PENDING",
            stripePaymentId: setupIntent.id,
            updatedAt: new Date().toISOString(),
          })
          .eq("id", bookingId);

        // Create a Stripe Checkout in setup mode to collect card
        const checkoutSession = await stripe.checkout.sessions.create({
          mode: "setup",
          customer: customerId,
          success_url: `${baseUrl}/booking/${booking.id}/confirmation?setup=complete`,
          cancel_url: `${baseUrl}/booking/${booking.id}/cancel`,
          metadata: {
            bookingId: booking.id,
            userId: user.id,
          },
        });

        sendConfirmations();

        redirectUrl = checkoutSession.url!;

        // Sync to Google Calendar
        if (booking.Instructor?.userId) {
          syncBookingToCalendar(booking.Instructor.userId, {
            id: booking.id,
            serviceName: booking.ServiceType?.name || "",
            startTime: new Date(booking.startTime),
            endTime: new Date(booking.endTime),
            instructorName: instructorUser?.name || "",
            location: booking.location || undefined,
          }).catch((err) => logger.error("Google Calendar sync failed:", err));
        }

        return NextResponse.json({
          bookingId: booking.id,
          status: "CONFIRMED",
          paymentFlow,
          redirectUrl,
        });
      }

      // Has saved card — confirm immediately, charge after session
      await serviceSupabase
        .from("Booking")
        .update({
          status: "CONFIRMED",
          paymentStatus: "PENDING",
          updatedAt: new Date().toISOString(),
        })
        .eq("id", bookingId);

      sendConfirmations();
      redirectUrl = `${baseUrl}/booking/${booking.id}/confirmation`;

      // Sync to Google Calendar
      if (booking.Instructor?.userId) {
        syncBookingToCalendar(booking.Instructor.userId, {
          id: booking.id,
          serviceName: booking.ServiceType?.name || "",
          startTime: new Date(booking.startTime),
          endTime: new Date(booking.endTime),
          instructorName: instructorUser?.name || "",
          location: booking.location || undefined,
        }).catch((err) => logger.error("Google Calendar sync failed:", err));
      }

      return NextResponse.json({
        bookingId: booking.id,
        status: "CONFIRMED",
        paymentFlow,
        redirectUrl,
      });
    }

    // --- TIER 3: GUEST — Pay now via Stripe Checkout ---
    paymentFlow = "stripe_checkout";

    // Write guest fields on booking
    if (email) {
      await serviceSupabase
        .from("Booking")
        .update({
          guestEmail: email.toLowerCase().trim(),
          guestName: name || null,
          guestPhone: phone || null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", bookingId);
    }

    // Get or create Stripe customer
    let customerId: string | undefined;
    if (user.stripeCustomerId) {
      customerId = user.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        phone: phone || undefined,
      });
      customerId = customer.id;
      await serviceSupabase
        .from("User")
        .update({ stripeCustomerId: customer.id, updatedAt: new Date().toISOString() })
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
            unit_amount: booking.amount * 100, // Kroner til ore
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      success_url: `${baseUrl}/booking/${booking.id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/${booking.id}/cancel`,
      metadata: {
        bookingId: booking.id,
        userId: user.id,
      },
    });

    // Save Stripe reference on booking
    const stripeRef = (checkoutSession.payment_intent as string) || checkoutSession.id;
    await serviceSupabase
      .from("Booking")
      .update({
        stripePaymentId: stripeRef,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", bookingId);

    redirectUrl = checkoutSession.url!;

    // Sync to Google Calendar (guest confirmation email sent by confirm-payment webhook)
    if (booking.Instructor?.userId) {
      syncBookingToCalendar(booking.Instructor.userId, {
        id: booking.id,
        serviceName: booking.ServiceType?.name || "",
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        instructorName: instructorUser?.name || "",
        location: booking.location || undefined,
      }).catch((err) => logger.error("Google Calendar sync failed:", err));
    }

    return NextResponse.json({
      bookingId: booking.id,
      status: booking.status,
      paymentFlow,
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
