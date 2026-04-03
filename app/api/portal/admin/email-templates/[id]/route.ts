import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!isAdmin(user.role)) {
      return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, subject, htmlContent, variables } = body;

    if (!name || !subject) {
      return NextResponse.json(
        { error: "Navn og emne er obligatorisk" },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name,
        subject,
        htmlContent: htmlContent ?? "",
        variables: variables ?? [],
      },
    });

    return NextResponse.json(template);
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke oppdatere mal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!isAdmin(user.role)) {
      return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    }

    const { id } = await params;
    await prisma.emailTemplate.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke slette mal" },
      { status: 500 }
    );
  }
}
