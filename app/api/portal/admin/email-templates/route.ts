import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

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
    const supabase = await createServerSupabase();
    
    const { data: template, error } = await supabase
      .from("EmailTemplate")
      .insert({
        id: nanoid(),
        name,
        subject,
        htmlContent: htmlContent ?? "",
        variables: variables ?? [],
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      const message = error.message.includes("duplicate")
        ? "En mal med dette navnet finnes allerede"
        : "Kunne ikke opprette mal";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json(template);
  } catch (e) {
    const message =
      e instanceof Error && e.message.includes("Unique")
        ? "En mal med dette navnet finnes allerede"
        : "Kunne ikke opprette mal";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
