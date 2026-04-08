import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * GET /api/coaching/services-2026
 *
 * Henter coaching-tjenester for 2026 på Gamle Fredrikstad Golfklubb
 * Inkluderer instruktører, pakker og tilgjengelighet
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createServerSupabase();

    // Hent instruktører (Anders og Markus) med brukerinfo
    const { data: instructors, error: instructorsError } = await supabase
      .from("Instructor")
      .select(
        `
        id,
        title,
        bio,
        specialization,
        User (name, email, phone, image),
        InstructorAvailability (dayOfWeek, startTime, endTime),
        ServiceType (id, name, description, category, duration, price, maxStudents, minNoticeHours, maxAdvanceDays, sortOrder)
      `
      )
      .in("User.name", ["Anders Kristiansen", "Markus"]);

    if (instructorsError) throw instructorsError;

    // Hent coaching-pakker
    const { data: packages, error: packagesError } = await supabase
      .from("CoachingPackage")
      .select("*")
      .eq("isActive", true)
      .order("sortOrder", { ascending: true });

    if (packagesError) throw packagesError;

    // Hent GFGK lokasjon
    const { data: location, error: locationError } = await supabase
      .from("Location")
      .select("*")
      .ilike("name", "%Gamle Fredrikstad%")
      .single();

    if (locationError && locationError.code !== "PGRST116") throw locationError;

    // Hent kommende bookinger for 2026
    const instructorIds = instructors?.map((i) => i.id) || [];
    const { data: bookings2026, error: bookingsError } = await supabase
      .from("Booking")
      .select(
        `
        id,
        startTime,
        status,
        Instructor (User (name)),
        ServiceType (name)
      `
      )
      .gte("startTime", "2026-01-01")
      .lte("startTime", "2026-12-31")
      .in("instructorId", instructorIds)
      .in("status", ["CONFIRMED", "PENDING"])
      .order("startTime", { ascending: true })
      .limit(100);

    if (bookingsError) throw bookingsError;

    // Hent alle ServiceTypes (tjenester) for GFGK
    const { data: serviceTypes, error: serviceTypesError } = await supabase
      .from("ServiceType")
      .select("*")
      .eq("isActive", true)
      .eq("isPublic", true)
      .order("sortOrder", { ascending: true });

    if (serviceTypesError) throw serviceTypesError;

    // Kategoriser tjenester
    const categories = {
      onboarding: serviceTypes?.filter((s) => ["Start", "Foundation Test"].includes(s.name)) || [],
      subscription: serviceTypes?.filter((s) => ["Performance Pro", "Performance"].includes(s.name)) || [],
      portal: serviceTypes?.filter((s) => s.name === "Spillerportal") || [],
      flex: serviceTypes?.filter((s) => s.name.startsWith("Flex") || s.name === "Markus 20 min") || [],
      playing: serviceTypes?.filter((s) => s.name.startsWith("On-Course")) || [],
      // NOTE: Gruppe- og juniortjenester midlertidig deaktivert
      // group: serviceTypes.filter(s => [...]),
      // junior: serviceTypes.filter(s => s.name.startsWith("Junior")),
    };

    // Formater response
    const response = {
      season: "2026",
      location: {
        name: "Gamle Fredrikstad Golfklubb",
        shortName: "GFGK",
        address: location?.address || "Fredrikstad",
      },
      instructors: instructors?.map((instructor) => ({
        id: instructor.id,
        name: (instructor.User as unknown as { name: string })?.name,
        email: (instructor.User as unknown as { email: string })?.email,
        phone: (instructor.User as unknown as { phone: string })?.phone,
        title: instructor.title,
        bio: instructor.bio,
        specialization: instructor.specialization,
        image: (instructor.User as unknown as { image: string })?.image,
        availability: (instructor.InstructorAvailability as unknown as Array<{ dayOfWeek: number; startTime: string; endTime: string }>)?.map(
          (avail) => ({
            dayOfWeek: avail.dayOfWeek,
            startTime: avail.startTime,
            endTime: avail.endTime,
          })
        ) || [],
      })) || [],
      services: {
        total: serviceTypes?.length || 0,
        byCategory: categories,
        all: serviceTypes?.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          duration: s.duration,
          price: s.price,
          maxStudents: s.maxStudents,
          minNoticeHours: s.minNoticeHours,
          maxAdvanceDays: s.maxAdvanceDays,
        })) || [],
      },
      packages: packages?.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        slug: pkg.slug,
        priceNok: pkg.priceNok,
        sessionsPerMonth: pkg.sessionsPerMonth,
        sessionDurationMin: pkg.sessionDurationMin,
        bookingWindowDays: pkg.bookingWindowDays,
        maxBookingsPerWeek: pkg.maxBookingsPerWeek,
        description: pkg.description,
        features: pkg.features,
      })) || [],
      upcomingSessions: bookings2026?.map((booking) => ({
        id: booking.id,
        date: booking.startTime,
        instructor: (booking.Instructor as unknown as { User: { name: string } })?.User?.name,
        serviceType: (booking.ServiceType as unknown as { name: string })?.name,
        status: booking.status,
      })) || [],
      summary: {
        totalInstructors: instructors?.length || 0,
        totalServices: serviceTypes?.length || 0,
        totalPackages: packages?.length || 0,
        upcomingSessionsCount: bookings2026?.length || 0,
        categories: {
          onboarding: categories.onboarding.length,
          subscription: categories.subscription.length,
          portal: categories.portal.length,
          flex: categories.flex.length,
          playing: categories.playing.length,
          // group: 0, // Midlertidig deaktivert
          // junior: 0, // Midlertidig deaktivert
        },
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching coaching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaching services" },
      { status: 500 }
    );
  }
}
