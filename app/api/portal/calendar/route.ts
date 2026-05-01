import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { getCalendarEvents, syncUserCalendar } from "@/lib/portal/calendar/aggregator";

export async function GET(req: NextRequest) {
  const user = await requirePortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const sync = searchParams.get("sync") === "true";

  const fromDate = fromParam ? new Date(fromParam) : new Date();
  const toDate = toParam ? new Date(toParam) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  if (sync) {
    await syncUserCalendar(user.id, { fromDate, toDate });
  }

  const events = await getCalendarEvents(user.id, { fromDate, toDate });
  return NextResponse.json({ events });
}
