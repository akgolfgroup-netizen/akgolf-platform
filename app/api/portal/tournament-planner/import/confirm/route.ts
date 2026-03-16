import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { isStaff } from "@/lib/portal/rbac";

interface ImportCompetition {
  golfboxId: number;
  name: string;
  startDate: string;
  endDate?: string | null;
  venue?: string;
  level: string;
}

export async function POST(req: NextRequest) {
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

  let created = 0;
  let updated = 0;

  for (const comp of competitions) {
    const existing = await prisma.tournament.findUnique({
      where: { golfboxId: comp.golfboxId },
    });

    if (existing) {
      await prisma.tournament.update({
        where: { golfboxId: comp.golfboxId },
        data: {
          name: comp.name,
          startDate: new Date(comp.startDate),
          endDate: comp.endDate ? new Date(comp.endDate) : null,
          location: comp.venue || undefined,
          level: comp.level,
        },
      });
      updated++;
    } else {
      await prisma.tournament.create({
        data: {
          golfboxId: comp.golfboxId,
          name: comp.name,
          startDate: new Date(comp.startDate),
          endDate: comp.endDate ? new Date(comp.endDate) : null,
          location: comp.venue || undefined,
          level: comp.level,
          createdById: user.id,
        },
      });
      created++;
    }
  }

  return NextResponse.json({ created, updated, total: competitions.length });
}
