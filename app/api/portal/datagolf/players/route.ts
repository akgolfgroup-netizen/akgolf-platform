import { getPortalUser } from "@/lib/portal/auth";
import { NextResponse } from "next/server";
import { fetchPlayerSkillDecomp } from "@/lib/portal/datagolf/client";

export const revalidate = 3600;

export async function GET() {
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const raw = await fetchPlayerSkillDecomp("pga");

    const players = raw
      .filter((p) => p.sg_total !== null)
      .map((p) => ({
        id: p.dg_id,
        name: p.player_name,
        sg: {
          sgTotal: p.sg_total,
          sgOffTheTee: p.sg_ott,
          sgApproach: p.sg_app,
          sgAroundTheGreen: p.sg_atg,
          sgPutting: p.sg_putt,
        },
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ players });
  } catch (err) {
    console.error("DataGolf API error:", err);
    return NextResponse.json({ error: "Kunne ikke hente spillerdata" }, { status: 500 });
  }
}
