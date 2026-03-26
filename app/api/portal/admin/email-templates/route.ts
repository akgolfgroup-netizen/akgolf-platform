import { NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

export async function POST(request: Request) {
  try {
    const user = await requirePortalUser();
    if (!isAdmin(user.role)) {
      return NextResponse.json({ error: "Ingen tilgang" }, { status: 403 });
    }

    const body = await request.json();
    const { name, subject, htmlContent, variables } = body;

    if (!name || !subject) {
      return NextResponse.json(
        { error: "Navn og emne er obligatorisk" },
        { status: 400 }
      );
    }

    const { nanoid } = await import("nanoid");
    const template = await prisma.emailTemplate.create({
      data: {
        id: nanoid(),
        name,
        subject,
        htmlContent: htmlContent ?? "",
        variables: variables ?? [],
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(template);
  } catch (e) {
    const message =
      e instanceof Error && e.message.includes("Unique")
        ? "En mal med dette navnet finnes allerede"
        : "Kunne ikke opprette mal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
