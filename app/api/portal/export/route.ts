import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { roundStatsToCsv } from "@/lib/portal/export/csv-stats";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const supabase = await createServerSupabase();

  if (type === "round-stats") {
    const { data: stats, error } = await supabase
      .from("RoundStats")
      .select("*")
      .eq("userId", user.id)
      .order("date", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Kunne ikke hente statistikk" }, { status: 500 });
    }

    const csv = roundStatsToCsv(stats || []);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rundestatistikk-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Ugyldig eksporttype. Bruk ?type=round-stats" },
    { status: 400 }
  );
}
