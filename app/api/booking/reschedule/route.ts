import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { rescheduleBooking } from "@/lib/portal/booking/reschedule";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  let body: { bookingId?: string; newStartTime?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  if (!body.bookingId || !body.newStartTime) {
    return NextResponse.json(
      { error: "Mangler bookingId eller newStartTime" },
      { status: 400 }
    );
  }

  const newStart = new Date(body.newStartTime);
  if (isNaN(newStart.getTime())) {
    return NextResponse.json(
      { error: "Ugyldig tidspunkt" },
      { status: 400 }
    );
  }

  const result = await rescheduleBooking(
    body.bookingId,
    newStart,
    user.id
  );

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    newBookingId: result.newBookingId,
  });
}
