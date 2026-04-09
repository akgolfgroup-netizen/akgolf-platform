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

class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getPortalUser();
    
    if (!user?.id) {
      return NextResponse.json(
        { error: "Du må være logget inn for å booke" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { serviceTypeId, instructorId, startTime, paymentMethod = "STRIPE" } = body;

    // Validate required fields
    if (!serviceTypeId || !instructorId || !startTime) {
      return NextResponse.json(
        { error: "Mangler påkrevde felter" },
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

    // Validate booking
    const validation = await validateBooking({
      serviceTypeId,
      instructorId,
      startTime: start,
      studentId: user.id,
    });

    if (!validation.valid) {
      const errorMessage = validation.errors?.map(e => e.message).join(", ") || "Ugyldig booking";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }

    const serviceType = validation.serviceType;
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
      
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "nok",
              product_data: {
                name: serviceType?.name || "Coaching",
                description: `Coaching-time ${serviceType?.duration || 50} min`,
              },
              unit_amount: booking.amount, // Already in øre
            },
            quantity: 1,
          },
        ],
        success_url: `${baseUrl}/booking/${booking.id}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/booking/${booking.id}/cancel`,
        customer_email: user.email,
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
