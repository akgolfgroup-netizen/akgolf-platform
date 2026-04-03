import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { rescheduleBooking } from "@/lib/portal/booking/reschedule";
import { z } from "zod";
import { validateRequest } from "@/lib/api/validation";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

const rescheduleSchema = z.object({
  bookingId: z.string().min(1, "bookingId er påkrevd"),
  newStartTime: z.string().min(1, "newStartTime er påkrevd"),
});

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const validation = await validateRequest(req, rescheduleSchema);
  if (!validation.success) return validation.response;
  const { bookingId, newStartTime } = validation.data;

  const result = await rescheduleBooking(
    bookingId,
    new Date(newStartTime),
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
