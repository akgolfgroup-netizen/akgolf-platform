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

  return newUser;
}

export async function POST(req: NextRequest) {
  try {
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
        status: "PENDING",
        paymentMethod,
        paymentStatus: paymentMethod === "STRIPE" ? "PENDING" : "PAID",
        amount: serviceType?.price || 0,
        vatAmount: 0,
        // TODO: Enable after migration: guestEmail, guestName, guestPhone
      })
      .select(`
        *,
        ServiceType:serviceTypeId(*),
        Instructor:instructorId(
          userId,
          User:userId(name)
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
      await syncBookingToCalendar(booking.Instructor.userId, {
        id: booking.id,
        serviceName: booking.ServiceType?.name || "",
        startTime: new Date(booking.startTime),
        endTime: new Date(booking.endTime),
        instructorName: booking.Instructor?.User?.name || "",
        location: booking.location || undefined,
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
