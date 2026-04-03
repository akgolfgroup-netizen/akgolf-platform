import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"];

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const statusParams = req.nextUrl.searchParams.getAll("status");
  for (const s of statusParams) {
    if (!VALID_STATUSES.includes(s)) {
      // Escape user input to prevent XSS in error messages
      const safeStatus = s.replace(/[<>&"']/g, "");
      return NextResponse.json(
        { error: `Ugyldig status: ${safeStatus}` },
        { status: 400 }
      );
    }
  }

  const bookings = await prisma.booking.findMany({
    where: {
      studentId: user.id,
      ...(statusParams.length > 0 && {
        status: { in: statusParams as never[] },
      }),
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      paymentStatus: true,
      amount: true,
      ServiceType: {
        select: { name: true, duration: true },
      },
      Instructor: {
        select: {
          User: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ bookings });
}
