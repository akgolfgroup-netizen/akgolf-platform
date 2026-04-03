import { NextRequest, NextResponse } from "next/server";
import { addToWaitlist } from "@/lib/portal/booking/waitlist";
import { autoCreateUser } from "@/lib/portal/booking/auto-create-user";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  // Rate limiting to prevent spam
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`waitlist:${clientIp}`, RATE_LIMITS.CONTACT_FORM);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "For mange forespørsler. Prøv igjen senere." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: {
    bookingId?: string;
    email?: string;
    name?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { bookingId, email, name } = body;

  if (!bookingId || !email || !name) {
    return NextResponse.json(
      { error: "Mangler felt: bookingId, email, name" },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Ugyldig e-postadresse" },
      { status: 400 }
    );
  }

  try {
    // Get or create user
    const { userId } = await autoCreateUser(
      email.toLowerCase().trim(),
      name.trim()
    );

    const result = await addToWaitlist(bookingId, userId);

    if (!result.success) {
      return NextResponse.json(
        { error: "Du er allerede på ventelisten", position: result.position },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      position: result.position,
    });
  } catch {
    return NextResponse.json(
      { error: "Intern feil" },
      { status: 500 }
    );
  }
}
