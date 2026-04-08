import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
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

  const supabase = await createServerSupabase();
  
  let query = supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      endTime,
      status,
      paymentStatus,
      amount,
      ServiceType (
        name,
        duration
      ),
      Instructor (
        User (
          name,
          image
        )
      )
    `)
    .eq("studentId", user.id)
    .order("startTime", { ascending: false });

  if (statusParams.length > 0) {
    query = query.in("status", statusParams);
  }

  const { data: bookings, error } = await query;

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente bookinger" }, { status: 500 });
  }

  return NextResponse.json({ bookings: bookings || [] });
}
