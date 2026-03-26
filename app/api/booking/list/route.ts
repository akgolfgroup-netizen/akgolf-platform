import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "NO_SHOW", "COMPLETED"];

export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const statusParams = req.nextUrl.searchParams.getAll("status");
  for (const s of statusParams) {
    if (!VALID_STATUSES.includes(s)) {
      return NextResponse.json(
        { error: `Ugyldig status: ${s}` },
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
      serviceType: {
        select: { name: true, duration: true },
      },
      instructor: {
        select: {
          user: {
            select: { name: true, image: true },
          },
        },
      },
    },
    orderBy: { startTime: "desc" },
  });

  return NextResponse.json({ bookings });
}
