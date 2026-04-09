import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, subDays } from "date-fns";
import { nb } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    const user = await requirePortalUser();
    
    if (!isStaff(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const yesterdayStart = startOfDay(subDays(now, 1));
    const yesterdayEnd = endOfDay(subDays(now, 1));

    // Dagens bookinger
    const todayBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: {
          in: ["CONFIRMED", "PENDING", "COMPLETED"],
        },
      },
      include: {
        ServiceType: true,
        Instructor: {
          include: {
            User: true,
          },
        },
        User: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    // Gårsdagens bookinger (for trend)
    const yesterdayBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: yesterdayStart,
          lte: yesterdayEnd,
        },
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
      },
    });

    // Denne ukens bookinger
    const weekBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: weekStart,
          lte: weekEnd,
        },
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
      },
      include: {
        ServiceType: true,
      },
    });

    // Forrige ukes bookinger (for trend)
    const lastWeekStart = subDays(weekStart, 7);
    const lastWeekEnd = subDays(weekEnd, 7);
    const lastWeekBookings = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
        status: {
          in: ["CONFIRMED", "COMPLETED"],
        },
      },
    });

    // Aktive sesjoner (bookinger pågår nå)
    const activeSessions = todayBookings.filter(
      (b) => b.startTime <= now && b.endTime >= now && b.status === "CONFIRMED"
    ).length;

    // Dagens inntekt
    const todayRevenue = todayBookings
      .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.amount || 0), 0);

    const yesterdayRevenue = yesterdayBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    // Ukens inntekt
    const weekRevenue = weekBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const lastWeekRevenue = lastWeekBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    // Nye elever denne uken
    const newStudentsThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
        role: "STUDENT",
      },
    });

    const newStudentsLastWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastWeekStart,
          lte: lastWeekEnd,
        },
        role: "STUDENT",
      },
    });

    // Avbestillinger i dag
    const todayCancellations = await prisma.booking.count({
      where: {
        cancelledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
        status: "CANCELLED",
      },
    });

    // Bookings som trenger godkjenning
    const pendingApprovals = await prisma.booking.count({
      where: {
        status: "PENDING",
        createdAt: {
          gte: subDays(now, 7),
        },
      },
    });

    // Varsler
    const alerts: Array<{
      type: "warning" | "info" | "success";
      message: string;
      time: string;
    }> = [];

    // Sjekk for bookinger som trenger godkjenning
    if (pendingApprovals > 0) {
      alerts.push({
        type: "warning",
        message: `${pendingApprovals} booking${pendingApprovals > 1 ? "er" : ""} venter på godkjenning`,
        time: "Nå",
      });
    }

    // Sjekk for kommende bookinger uten betaling
    const unpaidBookings = await prisma.booking.count({
      where: {
        startTime: {
          gte: todayStart,
          lte: subDays(todayEnd, -3), // Next 3 days
        },
        paymentStatus: "PENDING",
        status: "CONFIRMED",
      },
    });

    if (unpaidBookings > 0) {
      alerts.push({
        type: "info",
        message: `${unpaidBookings} ubetalt booking i neste 3 dager`,
        time: "Nå",
      });
    }

    // Sjekk for avbestillinger
    if (todayCancellations > 0) {
      alerts.push({
        type: "warning",
        message: `${todayCancellations} avbestilling${todayCancellations > 1 ? "er" : ""} i dag`,
        time: "I dag",
      });
    }

    // Suksessmelding hvis god inntekt
    if (todayRevenue > yesterdayRevenue * 1.2) {
      alerts.push({
        type: "success",
        message: `Dagens inntekt er ${Math.round((todayRevenue / yesterdayRevenue - 1) * 100)}% høyere enn i går!`,
        time: "I dag",
      });
    }

    // Formater dagens timeplan
    const todaysSchedule = todayBookings.map((booking) => ({
      id: booking.id,
      studentName: booking.User?.name || "Ukjent elev",
      service: booking.ServiceType?.name || "Ukjent tjeneste",
      time: format(booking.startTime, "HH:mm"),
      instructor: booking.Instructor?.User?.name || "Ukjent instruktør",
      status: booking.status.toLowerCase(),
    }));

    // Beregn trends
    const bookingTrend = yesterdayBookings.length > 0 
      ? todayBookings.filter(b => b.status !== "CANCELLED").length - yesterdayBookings.length 
      : 0;
    
    const revenueTrend = yesterdayRevenue > 0 
      ? Math.round((todayRevenue / yesterdayRevenue - 1) * 100) 
      : 0;
    
    const studentTrend = newStudentsLastWeek > 0 
      ? newStudentsThisWeek - newStudentsLastWeek 
      : newStudentsThisWeek;

    return NextResponse.json({
      today: {
        totalBookings: todayBookings.filter(b => b.status !== "CANCELLED").length,
        activeSessions,
        revenue: todayRevenue,
        cancellations: todayCancellations,
      },
      week: {
        totalBookings: weekBookings.length,
        revenue: weekRevenue,
        newStudents: newStudentsThisWeek,
        retention: lastWeekBookings.length > 0 
          ? Math.round((weekBookings.length / lastWeekBookings.length) * 100) 
          : 100,
      },
      trends: {
        bookings: bookingTrend,
        revenue: revenueTrend,
        students: studentTrend,
      },
      alerts,
      todaysSchedule,
    });
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
