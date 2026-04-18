import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

const ALLOWED_LEVELS = ["nasjonal", "regional", "lokal", "internasjonal"] as const;
type TournamentLevel = (typeof ALLOWED_LEVELS)[number];

function isValidLevel(v: unknown): v is TournamentLevel {
  return typeof v === "string" && (ALLOWED_LEVELS as readonly string[]).includes(v);
}

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  // Autentisert spiller ELLER staff
  const user = await getPortalUser();
  if (!user) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const userIsStaff = isStaff(user.role);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const {
    name,
    startDate,
    endDate,
    level,
    location,
    externalUrl,
    notes,
    isPrivate,
  } = body as Record<string, unknown>;

  // Validering
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 200) {
    return NextResponse.json({ error: "Ugyldig navn" }, { status: 400 });
  }

  if (typeof startDate !== "string" || Number.isNaN(Date.parse(startDate))) {
    return NextResponse.json({ error: "Ugyldig startdato" }, { status: 400 });
  }

  if (!isValidLevel(level)) {
    return NextResponse.json({ error: "Ugyldig level" }, { status: 400 });
  }

  if (endDate && (typeof endDate !== "string" || Number.isNaN(Date.parse(endDate)))) {
    return NextResponse.json({ error: "Ugyldig sluttdato" }, { status: 400 });
  }

  // Spiller-opprettede turneringer er private by default; staff kan sette public
  const finalIsPrivate = userIsStaff ? Boolean(isPrivate ?? false) : true;

  // Rate-limit: maks 20 manuelle opprettelser per bruker per 24t
  if (!userIsStaff) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await prisma.tournament.count({
      where: { createdById: user.id, createdAt: { gte: since } },
    });
    if (count >= 20) {
      return NextResponse.json(
        { error: "Maks 20 egne turneringer per døgn" },
        { status: 429 },
      );
    }
  }

  try {
    const tournament = await prisma.tournament.create({
      data: {
        id: nanoid(),
        name: name.trim(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate as string) : null,
        level,
        location: typeof location === "string" && location.trim() ? location.trim() : null,
        externalUrl:
          typeof externalUrl === "string" && externalUrl.trim() ? externalUrl.trim() : null,
        source: "manual",
        sourceId: nanoid(),
        series: typeof notes === "string" && notes.trim() ? notes.trim() : null,
        createdById: user.id,
        isPrivate: finalIsPrivate,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        level: true,
        isPrivate: true,
      },
    });

    return NextResponse.json({ ok: true, tournament });
  } catch (err) {
    logger.error("[tournament/create] Failed", err);
    return NextResponse.json({ error: "Kunne ikke opprette turnering" }, { status: 500 });
  }
}
