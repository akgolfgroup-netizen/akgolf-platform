import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface ImportCompetition {
  golfboxId: number;
  name: string;
  startDate: string;
  endDate?: string | null;
  venue?: string;
  level: string;
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { competitions } = (await req.json()) as {
    competitions: ImportCompetition[];
  };

  if (!competitions?.length) {
    return NextResponse.json({ error: "Ingen turneringer valgt" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  let created = 0;
  let updated = 0;

  for (const comp of competitions) {
    const { data: existing } = await supabase
      .from("Tournament")
      .select("id")
      .eq("golfboxId", comp.golfboxId)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("Tournament")
        .update({
          name: comp.name,
          startDate: new Date(comp.startDate).toISOString(),
          endDate: comp.endDate ? new Date(comp.endDate).toISOString() : null,
          location: comp.venue || null,
          level: comp.level,
          updatedAt: new Date().toISOString(),
        })
        .eq("golfboxId", comp.golfboxId);

      if (!error) updated++;
    } else {
      const { error } = await supabase
        .from("Tournament")
        .insert({
          id: nanoid(),
          golfboxId: comp.golfboxId,
          name: comp.name,
          startDate: new Date(comp.startDate).toISOString(),
          endDate: comp.endDate ? new Date(comp.endDate).toISOString() : null,
          location: comp.venue || null,
          level: comp.level,
          createdById: user.id,
          updatedAt: new Date().toISOString(),
        });

      if (!error) created++;
    }
  }

  return NextResponse.json({ created, updated, total: competitions.length });
}
