import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/coaching/services-2026
 * 
 * Henter coaching-tjenester for 2026 på Gamle Fredrikstad Golfklubb
 * Inkluderer instruktører, pakker og tilgjengelighet
 */
export async function GET(request: NextRequest) {
  try {
    // Hent instruktører (Anders og Markus)
    const instructors = await prisma.instructor.findMany({
      where: {
        User: {
          name: {
            in: ["Anders Kristiansen", "Markus"],
          },
        },
      },
      include: {
        User: {
          select: {
            name: true,
            email: true,
            phone: true,
            image: true,
          },
        },
        InstructorAvailability: true,
        ServiceType: true,
      },
    });

    // Hent coaching-pakker
    const packages = await prisma.coachingPackage.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Hent GFGK lokasjon
    const location = await prisma.location.findFirst({
      where: {
        name: {
          contains: "Gamle Fredrikstad",
          mode: "insensitive",
        },
      },
    });

    // Hent kommende bookinger for 2026
    const bookings2026 = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: new Date("2026-01-01"),
          lte: new Date("2026-12-31"),
        },
        instructorId: {
          in: instructors.map((i) => i.id),
        },
        status: {
          in: ["CONFIRMED", "PENDING"],
        },
      },
      include: {
        Instructor: {
          include: {
            User: {
              select: {
                name: true,
              },
            },
          },
        },
        ServiceType: true,
      },
      orderBy: {
        startTime: "asc",
      },
      take: 100,
    });

    // Hent alle ServiceTypes (tjenester) for GFGK
    const serviceTypes = await prisma.serviceType.findMany({
      where: {
        isActive: true,
        isPublic: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Kategoriser tjenester
    const categories = {
      onboarding: serviceTypes.filter(s => ["Start", "Foundation Test"].includes(s.name)),
      subscription: serviceTypes.filter(s => ["Performance Pro", "Performance"].includes(s.name)),
      portal: serviceTypes.filter(s => s.name === "Spillerportal"),
      flex: serviceTypes.filter(s => s.name.startsWith("Flex") || s.name === "Markus 20 min"),
      playing: serviceTypes.filter(s => s.name.startsWith("On-Course")),
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
      instructors: instructors.map((instructor) => ({
        id: instructor.id,
        name: instructor.User.name,
        email: instructor.User.email,
        phone: instructor.User.phone,
        title: instructor.title,
        bio: instructor.bio,
        specialization: instructor.specialization,
        image: instructor.User.image,
        availability: instructor.InstructorAvailability.map((avail) => ({
          dayOfWeek: avail.dayOfWeek,
          startTime: avail.startTime,
          endTime: avail.endTime,
        })),
      })),
      services: {
        total: serviceTypes.length,
        byCategory: categories,
        all: serviceTypes.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          category: s.category,
          duration: s.duration,
          price: s.price,
          maxStudents: s.maxStudents,
          minNoticeHours: s.minNoticeHours,
          maxAdvanceDays: s.maxAdvanceDays,
        })),
      },
      packages: packages.map((pkg) => ({
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
      })),
      upcomingSessions: bookings2026.map((booking) => ({
        id: booking.id,
        date: booking.startTime,
        instructor: booking.Instructor?.User?.name,
        serviceType: booking.ServiceType?.name,
        status: booking.status,
      })),
      summary: {
        totalInstructors: instructors.length,
        totalServices: serviceTypes.length,
        totalPackages: packages.length,
        upcomingSessionsCount: bookings2026.length,
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
