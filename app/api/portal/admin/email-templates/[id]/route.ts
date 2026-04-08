import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
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

    const supabase = await createServerSupabase();
    const { data: template, error } = await supabase
      .from("EmailTemplate")
      .update({
        name,
        subject,
        htmlContent: htmlContent ?? "",
        variables: variables ?? [],
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Kunne ikke oppdatere mal" }, { status: 500 });
    }

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
    const supabase = await createServerSupabase();
    
    const { error } = await supabase
      .from("EmailTemplate")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: "Kunne ikke slette mal" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke slette mal" },
      { status: 500 }
    );
  }
}
