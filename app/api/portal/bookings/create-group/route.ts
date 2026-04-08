import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { invalidateSlotsCache, invalidateBookingsCache } from "@/lib/portal/booking/cache";
import { broadcastUpdate } from "@/app/api/portal/bookings/live/route";
import { logger } from "@/lib/logger";
import { notifyNewBooking, notifyBookingConfirmed } from "@/lib/portal/notifications/triggers";

interface Participant {
  name: string;
  email: string;
  phone?: string;
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json(
        { error: "Ikke innlogget" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      serviceTypeId,
      instructorId,
      startTime,
      participants,
      paymentMethod = "STRIPE",
    } = body as {
      serviceTypeId: string;
      instructorId: string;
      startTime: string;
      participants: Participant[];
      paymentMethod?: "STRIPE" | "VIPPS";
    };

    if (!serviceTypeId || !instructorId || !startTime) {
      return NextResponse.json(
        { error: "Mangler obligatoriske felter" },
        { status: 400 }
      );
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: "Minst én deltaker er påkrevd" },
        { status: 400 }
      );
    }

    // Validate participant data
    for (const p of participants) {
      if (!p.name || !p.email) {
        return NextResponse.json(
          { error: "Alle deltakere må ha navn og e-post" },
          { status: 400 }
        );
      }
    }

    const supabase = await createServerSupabase();

    // Fetch service type
    const { data: serviceType, error: serviceError } = await supabase
      .from("ServiceType")
      .select("duration, price, vatRate, maxStudents")
      .eq("id", serviceTypeId)
      .single();

    if (serviceError || !serviceType) {
      return NextResponse.json(
        { error: "Tjeneste ikke funnet" },
        { status: 404 }
      );
    }

    if (serviceType.maxStudents <= 1) {
      return NextResponse.json(
        { error: "Denne tjenesten støtter ikke gruppebooking" },
        { status: 400 }
      );
    }

    if (participants.length > serviceType.maxStudents) {
      return NextResponse.json(
        { error: `Maks ${serviceType.maxStudents} deltakere for denne tjenesten` },
        { status: 400 }
      );
    }

    // Check remaining capacity
    const start = new Date(startTime);
    const end = addMinutes(start, serviceType.duration);
    const vatAmount = Math.round((serviceType.price * serviceType.vatRate) / 100);

    // Sjekk for eksisterende bookinger med overlappende tid
    const { count: existingBookingsCount, error: countError } = await supabase
      .from("Booking")
      .select("*", { count: "exact", head: true })
      .eq("instructorId", instructorId)
      .eq("serviceTypeId", serviceTypeId)
      .eq("startTime", start.toISOString())
      .in("status", ["PENDING", "CONFIRMED"]);

    if (countError) {
      throw countError;
    }

    const remainingSpots = serviceType.maxStudents - (existingBookingsCount || 0);
    if (remainingSpots < 1) {
      return NextResponse.json(
        { error: "Ingen ledige plasser for dette tidspunktet" },
        { status: 409 }
      );
    }

    // Sjekk for blokkerte tider
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
      return NextResponse.json(
        { error: "Tidspunktet er ikke lenger tilgjengelig" },
        { status: 409 }
      );
    }

    // Create booking
    const now = new Date().toISOString();
    const bookingId = nanoid();

    const { data: booking, error: createError } = await supabase
      .from("Booking")
      .insert({
        id: bookingId,
        studentId: user.id,
        instructorId,
        serviceTypeId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: "CONFIRMED",
        paymentMethod: paymentMethod === "VIPPS" ? "VIPPS" : "STRIPE",
        paymentStatus: "PENDING",
        amount: serviceType.price,
        vatAmount,
        isGroupBooking: true,
        updatedAt: now,
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Create group participants
    const participantsData = participants.map((p: Participant) => ({
      id: nanoid(),
      bookingId,
      name: p.name,
      email: p.email,
      phone: p.phone ?? null,
    }));

    const { error: participantsError } = await supabase
      .from("GroupParticipant")
      .insert(participantsData);

    if (participantsError) {
      // Rollback booking if participants creation fails
      await supabase.from("Booking").delete().eq("id", bookingId);
      throw participantsError;
    }

    // Invalider cache og broadcast oppdatering
    const dateStr = start.toISOString().split("T")[0];
    
    await Promise.all([
      invalidateSlotsCache(instructorId, dateStr),
      invalidateBookingsCache(instructorId),
      broadcastUpdate(instructorId, dateStr, "BOOKING_CREATED", {
        bookingId: booking.id,
        startTime: start.toISOString(),
      }),
    ]);

    // Send notifikasjoner
    const { data: fullBooking, error: fullBookingError } = await supabase
      .from("Booking")
      .select(`
        *,
        User (
          name,
          email
        ),
        ServiceType (
          name,
          duration
        ),
        Instructor (
          User (
            name
          )
        ),
        Location (
          name
        )
      `)
      .eq("id", bookingId)
      .single();

    if (fullBooking && !fullBookingError) {
      notifyBookingConfirmed(fullBooking).catch(console.error);
      notifyNewBooking(fullBooking).catch(console.error);
    }

    logger.info(`[create-group] Created group booking ${booking.id} for instructor ${instructorId}`);

    return NextResponse.json({
      bookingId: booking.id,
      message: "Gruppebooking opprettet",
    });
  } catch (error) {
    logger.error("[create-group] Error:", error);
    return NextResponse.json(
      { error: "Noe gikk galt. Prøv igjen." },
      { status: 500 }
    );
  }
}
