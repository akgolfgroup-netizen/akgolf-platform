import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { isStaff } from "@/lib/portal/rbac";
import {
  parseGolfBoxUrl,
  fetchGolfBoxSchedule,
  golfBoxCompetitionToTournament,
  GOLFBOX_CATEGORIES,
} from "@/modules/tournament-planner/golfbox";

export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL mangler" }, { status: 400 });
  }

  const parsed = parseGolfBoxUrl(url);
  if (!parsed) {
    return NextResponse.json(
      { error: "Ugyldig GolfBox-URL. Forventet format: norskgolf.no/terminlister#/customer/{id}/schedule/{year}/{scheduleId}" },
      { status: 400 }
    );
  }

  const competitions = await fetchGolfBoxSchedule(
    parsed.customerId,
    parsed.year,
    parsed.scheduleId
  );

  const categoryName =
    GOLFBOX_CATEGORIES[parsed.scheduleId] ?? `Kategori ${parsed.scheduleId}`;

  return NextResponse.json({
    competitions: competitions.map((c) => ({
      ...golfBoxCompetitionToTournament(c),
      startDate: golfBoxCompetitionToTournament(c).startDate.toISOString(),
      endDate: golfBoxCompetitionToTournament(c).endDate?.toISOString() ?? null,
      category: c.Category?.Name,
    })),
    categoryName,
    year: parsed.year,
  });
}
