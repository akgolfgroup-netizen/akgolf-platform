/**
 * Booking API for AK Golf Academy tjenester
 * 
 * Abonnement (Stripe subscription):
 * - Performance Pro: 2 000 kr/mnd, 4×20 min, Anders
 * - Performance: 1 600 kr/mnd, 2×20 min, Anders
 * - Spillerportal: 299 kr/mnd, kun portaltilgang (ingen coaching)
 * 
 * Drop-in/Flex (Pay-per-session):
 * - Flex 50: 1 500 kr, 50 min, Anders
 * - Flex 50 Duo: 1 700 kr, 50 min, Anders
 * - Flex 90: 2 500 kr, 90 min, Anders
 * - Flex 90 Duo: 2 800 kr, 90 min, Anders
 * - Flex 20: 300 kr, 20 min, Markus
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { notifyNewBooking, notifyBookingConfirmed } from "@/lib/portal/notifications/triggers";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("type");
    const instructorId = searchParams.get("instructor");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Returner tilgjengelige tjenester
    if (!serviceType) {
      const { data: services, error } = await supabase
        .from("ServiceType")
        .select(`
          *,
          Instructor (
            id,
            title,
            User (
              name
            )
          )
        `)
        .eq("isActive", true)
        .in("category", ["INDIVIDUAL", "GROUP", "DIGITAL"]);

      if (error) {
        throw error;
      }

      // Grupper tjenester
      const grouped = {
        abonnement: (services || []).filter((s: { name: string }) => 
          s.name.includes("Performance") && !s.name.includes("Drop-in")
        ),
        portalOnly: (services || []).filter((s: { category: string }) => s.category === "DIGITAL"),
        dropIn: (services || []).filter((s: { name: string }) => 
          s.name.includes("Flex") || s.name.includes("Markus")
        ),
      };

      return NextResponse.json({
        success: true,
        services: grouped,
      });
    }

    // Returner tilgjengelige tidspunkter for en tjeneste
    const { data: service, error: serviceError } = await supabase
      .from("ServiceType")
      .select(`
        *,
        Instructor (*)
      `)
      .eq("name", serviceType)
      .eq("isActive", true)
      .single();

    if (serviceError || !service) {
      return NextResponse.json(
        { success: false, error: "Tjeneste ikke funnet" },
        { status: 404 }
      );
    }

    // Hent tilgjengelighet
    const targetInstructorId = instructorId || service.Instructor?.[0]?.id;
    
    if (!targetInstructorId) {
      return NextResponse.json(
        { success: false, error: "Ingen instruktør tilgjengelig" },
        { status: 404 }
      );
    }

    const { data: availability, error: availError } = await supabase
      .from("InstructorAvailability")
      .select("*")
      .eq("instructorId", targetInstructorId);

    if (availError) {
      throw availError;
    }

    // Hent eksisterende bookings for perioden
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const { data: existingBookings, error: bookingError } = await supabase
      .from("Booking")
      .select("startTime, endTime")
      .eq("instructorId", targetInstructorId)
      .gte("startTime", fromDate.toISOString())
      .lte("startTime", toDate.toISOString())
      .in("status", ["PENDING", "CONFIRMED"]);

    if (bookingError) {
      throw bookingError;
    }

    return NextResponse.json({
      success: true,
      service: {
        name: service.name,
        duration: service.duration,
        price: service.price,
        minNoticeHours: service.minNoticeHours,
      },
      availability,
      existingBookings: (existingBookings || []).map((b: { startTime: string; endTime: string }) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    });

  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { success: false, error: "Serverfeil" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getPortalUser();
    
    if (!user?.email) {
      return NextResponse.json(
        { success: false, error: "Ikke autentisert" },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabase();

    const body = await request.json();
    const {
      serviceTypeName,
      startTime,
      notes,
      participants,
      isDuo = false,
    } = body;

    // Hent full brukerdata
    const { data: dbUser, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("email", user.email)
      .single();

    if (userError || !dbUser) {
      return NextResponse.json(
        { success: false, error: "Bruker ikke funnet" },
        { status: 404 }
      );
    }

    // Finn tjeneste
    const { data: serviceType, error: serviceError } = await supabase
      .from("ServiceType")
      .select(`
        *,
        Instructor (*)
      `)
      .eq("name", serviceTypeName)
      .eq("isActive", true)
      .single();

    if (serviceError || !serviceType) {
      return NextResponse.json(
        { success: false, error: "Tjeneste ikke funnet" },
        { status: 404 }
      );
    }

    // Sjekk om dette er abonnement eller drop-in
    const isSubscription = serviceTypeName.includes("Performance");
    const isMarkusService = serviceTypeName.includes("Markus");

    // Velg instruktør
    let instructorId: string;
    if (isMarkusService) {
      // Markus-tjeneste -> finn Markus
      const { data: markus, error: markusError } = await supabase
        .from("Instructor")
        .select("id, User!inner(name)")
        .ilike("User.name", "%Markus%")
        .limit(1)
        .single();

      if (markusError || !markus) {
        return NextResponse.json(
          { success: false, error: "Markus er ikke tilgjengelig" },
          { status: 404 }
        );
      }
      instructorId = markus.id;
    } else {
      // Alle andre -> Anders
      const { data: anders, error: andersError } = await supabase
        .from("Instructor")
        .select("id, User!inner(name)")
        .ilike("User.name", "%Anders%")
        .limit(1)
        .single();

      if (andersError || !anders) {
        return NextResponse.json(
          { success: false, error: "Anders er ikke tilgjengelig" },
          { status: 404 }
        );
      }
      instructorId = anders.id;
    }

    // Sjekk minNoticeHours
    const bookingTime = new Date(startTime);
    const now = new Date();
    const hoursUntilBooking = (bookingTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilBooking < serviceType.minNoticeHours) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Booking må gjøres minst ${serviceType.minNoticeHours} timer i forveien` 
        },
        { status: 400 }
      );
    }

    // Sjekk om tidspunktet er ledig
    const endTime = new Date(bookingTime.getTime() + serviceType.duration * 60000);

    const { data: conflictingBooking, error: conflictError } = await supabase
      .from("Booking")
      .select("id")
      .eq("instructorId", instructorId)
      .or(`and(startTime.lte.${bookingTime.toISOString()},endTime.gt.${bookingTime.toISOString()}),and(startTime.lt.${endTime.toISOString()},endTime.gte.${endTime.toISOString()})`)
      .in("status", ["PENDING", "CONFIRMED"])
      .limit(1)
      .single();

    if (conflictError && conflictError.code !== "PGRST116") {
      throw conflictError;
    }

    if (conflictingBooking) {
      return NextResponse.json(
        { success: false, error: "Tidspunktet er opptatt" },
        { status: 409 }
      );
    }

    // For abonnement: sjekk om bruker har aktivt abonnement
    if (isSubscription) {
      const { data: activeSubscription, error: subError } = await supabase
        .from("AppSubscription")
        .select(`
          *,
          AppBundle!inner(name)
        `)
        .eq("userId", dbUser.id)
        .eq("status", "ACTIVE")
        .eq("AppBundle.name", serviceTypeName)
        .single();

      if (subError || !activeSubscription) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Aktivt abonnement kreves",
            requiresSubscription: true,
          },
          { status: 403 }
        );
      }

      // Sjekk sesjonskvote
      // TODO: Implementer sesjonskvote-sjekk basert på månedlig bruk
    }

    // Opprett booking
    const nowIso = new Date().toISOString();
    const { data: booking, error: createError } = await supabase
      .from("Booking")
      .insert({
        id: nanoid(),
        studentId: dbUser.id,
        instructorId,
        serviceTypeId: serviceType.id,
        startTime: bookingTime.toISOString(),
        endTime: endTime.toISOString(),
        status: isSubscription ? "CONFIRMED" : "PENDING", // Drop-in trenger betaling
        studentNotes: notes || null,
        updatedAt: nowIso,
      })
      .select(`
        *,
        User (name, email),
        ServiceType (name, duration),
        Instructor (User (name))
      `)
      .single();

    if (createError) {
      throw createError;
    }

    // Send notifikasjoner (ikke-blokkerende)
    if (isSubscription) {
      // Bekreft til student
      notifyBookingConfirmed(booking).catch(console.error);
    }
    // Varsle instruktør
    notifyNewBooking(booking).catch(console.error);

    // For drop-in: opprett betaling
    let paymentUrl: string | undefined;
    if (!isSubscription) {
      // TODO: Integrer med Stripe for betaling
      paymentUrl = "/betaling?booking=" + booking.id;
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        service: serviceType.name,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
      },
      paymentUrl,
      message: isSubscription 
        ? "Booking bekreftet!" 
        : "Vennligst fullfør betaling for å bekrefte bookingen.",
    });

  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { success: false, error: "Kunne ikke opprette booking" },
      { status: 500 }
    );
  }
}
