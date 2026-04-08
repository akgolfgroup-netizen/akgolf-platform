import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { id } = await params;
  const data = await req.json();
  const supabase = await createServerSupabase();

  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.startDate !== undefined) updateData.startDate = new Date(data.startDate).toISOString();
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? new Date(data.endDate).toISOString() : null;
  if (data.level !== undefined) updateData.level = data.level;
  if (data.course !== undefined) updateData.course = data.course;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.externalUrl !== undefined) updateData.externalUrl = data.externalUrl;
  updateData.updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("Tournament")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke oppdatere turnering" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("Tournament")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke slette turnering" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
