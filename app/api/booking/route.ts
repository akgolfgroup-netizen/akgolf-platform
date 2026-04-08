/**
 * Booking API for AK Golf Academy tjenester
 * 
 * Abonnement (Stripe subscription):
 * - Performance Pro: 2 000 kr/mnd, 4×20 min, Anders
 * - Performance: 1 600 kr/mnd, 2×20 min, Anders
 * - Spillerportal: 299 kr/mnd, kun portaltilgang (ingen coaching)
 * 
 * Drop-in/Flex (Pay-per-session):
 * - Flex 50 Solo: 1 500 kr, 50 min, Anders
 * - Flex 50 Duo: 1 700 kr, 50 min, Anders
 * - Flex 90 Solo: 2 500 kr, 90 min, Anders
 * - Flex 90 Duo: 2 800 kr, 90 min, Anders
 * - Markus 20 min: 300 kr, 20 min, Markus
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { notifyNewBooking, notifyBookingConfirmed } from "@/lib/portal/notifications/triggers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get("type");
    const instructorId = searchParams.get("instructor");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Returner tilgjengelige tjenester
    if (!serviceType) {
      const services = await prisma.serviceType.findMany({
        where: {
          isActive: true,
          category: {
            in: ["INDIVIDUAL", "GROUP", "DIGITAL"],
          },
        },
        include: {
          Instructor: {
            select: {
              id: true,
              title: true,
              User: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      // Grupper tjenester
      const grouped = {
        abonnement: services.filter(s => 
          s.name.includes("Performance") && !s.name.includes("Drop-in")
        ),
        portalOnly: services.filter(s => s.category === "DIGITAL"),
        dropIn: services.filter(s => 
          s.name.includes("Flex") || s.name.includes("Markus")
        ),
      };

      return NextResponse.json({
        success: true,
        services: grouped,
      });
    }

    // Returner tilgjengelige tidspunkter for en tjeneste
    const service = await prisma.serviceType.findFirst({
      where: {
        name: serviceType,
        isActive: true,
      },
      include: {
        Instructor: true,
      },
    });

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Tjeneste ikke funnet" },
        { status: 404 }
      );
    }

    // Hent tilgjengelighet
    const targetInstructorId = instructorId || service.Instructor[0]?.id;
    
    if (!targetInstructorId) {
      return NextResponse.json(
        { success: false, error: "Ingen instruktør tilgjengelig" },
        { status: 404 }
      );
    }

    const availability = await prisma.instructorAvailability.findMany({
      where: {
        instructorId: targetInstructorId,
      },
    });

    // Hent eksisterende bookings for perioden
    const fromDate = from ? new Date(from) : new Date();
    const toDate = to ? new Date(to) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const existingBookings = await prisma.booking.findMany({
      where: {
        instructorId: targetInstructorId,
        startTime: {
          gte: fromDate,
          lte: toDate,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    return NextResponse.json({
      success: true,
      service: {
        name: service.name,
        duration: service.duration,
        price: service.price,
        minNoticeHours: service.minNoticeHours,
      },
      availability,
      existingBookings: existingBookings.map(b => ({
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

    const body = await request.json();
    const {
      serviceTypeName,
      startTime,
      notes,
      participants,
      isDuo = false,
    } = body;

    // Hent full brukerdata
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "Bruker ikke funnet" },
        { status: 404 }
      );
    }

    // Finn tjeneste
    const serviceType = await prisma.serviceType.findFirst({
      where: {
        name: serviceTypeName,
        isActive: true,
      },
      include: {
        Instructor: true,
      },
    });

    if (!serviceType) {
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
      const markus = await prisma.instructor.findFirst({
        where: {
          User: {
            name: {
              contains: "Markus",
              mode: "insensitive",
            },
          },
        },
      });
      if (!markus) {
        return NextResponse.json(
          { success: false, error: "Markus er ikke tilgjengelig" },
          { status: 404 }
        );
      }
      instructorId = markus.id;
    } else {
      // Alle andre -> Anders
      const anders = await prisma.instructor.findFirst({
        where: {
          User: {
            name: {
              contains: "Anders",
              mode: "insensitive",
            },
          },
        },
      });
      if (!anders) {
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

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        instructorId,
        OR: [
          {
            startTime: { lte: bookingTime },
            endTime: { gt: bookingTime },
          },
          {
            startTime: { lt: endTime },
            endTime: { gte: endTime },
          },
        ],
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        { success: false, error: "Tidspunktet er opptatt" },
        { status: 409 }
      );
    }

    // For abonnement: sjekk om bruker har aktivt abonnement
    if (isSubscription) {
      const activeSubscription = await prisma.appSubscription.findFirst({
        where: {
          userId: dbUser.id,
          status: "ACTIVE",
          AppBundle: {
            name: serviceTypeName,
          },
        },
      });

      if (!activeSubscription) {
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
    const booking = await prisma.booking.create({
      data: {
        id: nanoid(),
        studentId: dbUser.id,
        instructorId,
        serviceTypeId: serviceType.id,
        startTime: bookingTime,
        endTime,
        status: isSubscription ? "CONFIRMED" : "PENDING", // Drop-in trenger betaling
        studentNotes: notes || null,
        updatedAt: new Date(),
      },
      include: {
        User: { select: { name: true, email: true } },
        ServiceType: { select: { name: true, duration: true } },
        Instructor: { select: { User: { select: { name: true } } } },
      },
    });

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
