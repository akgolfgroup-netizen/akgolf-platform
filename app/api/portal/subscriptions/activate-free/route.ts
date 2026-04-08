import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

const ActivateFreeSchema = z.object({
  moduleSlug: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`subscription:${getClientIp(req)}`, RATE_LIMITS.SUBSCRIPTIONS);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ActivateFreeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Ugyldig input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { moduleSlug } = parsed.data;

  const supabase = await createServerSupabase();

  // Verify module exists and is free
  const { data: mod, error: modError } = await supabase
    .from("AppModule")
    .select("id, isActive, monthlyPriceNok")
    .eq("slug", moduleSlug)
    .single();

  if (modError || !mod || !mod.isActive) {
    return NextResponse.json({ error: "Modul ikke funnet" }, { status: 404 });
  }

  if (mod.monthlyPriceNok !== 0) {
    return NextResponse.json(
      { error: "Denne modulen er ikke gratis" },
      { status: 400 }
    );
  }

  // Check if user already has this module
  const { data: existingSub } = await supabase
    .from("AppSubscription")
    .select("id")
    .eq("userId", user.id)
    .eq("moduleId", mod.id)
    .limit(1)
    .single();

  if (existingSub) {
    return NextResponse.json(
      { error: "Du har allerede denne modulen" },
      { status: 400 }
    );
  }

  // Create subscription for free module
  const { error: insertError } = await supabase
    .from("AppSubscription")
    .insert({
      id: nanoid(),
      userId: user.id,
      moduleId: mod.id,
      status: "ACTIVE",
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date("2099-12-31").toISOString(), // Essentially forever for free modules
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

  if (insertError) {
    return NextResponse.json(
      { error: "Kunne ikke aktivere modulen" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
