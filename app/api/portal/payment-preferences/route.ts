import { NextRequest, NextResponse } from "next/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    const supabase = await createServerSupabase();

    const { data: preference } = await supabase
      .from("CustomerPaymentPreference")
      .select("*")
      .eq("userId", user.id)
      .single();

    return NextResponse.json(preference);
  } catch {
    return NextResponse.json({ error: "Ikke autentisert" }, { status: 401 });
  }
}

export async function PUT(request: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(request)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    const body = await request.json();

    const {
      customerType,
      preferredMethod,
      companyName,
      orgNumber,
      invoiceEmail,
      invoiceAddress,
    } = body;

    // Validate enums
    if (customerType && !["PRIVATE", "BUSINESS"].includes(customerType)) {
      return NextResponse.json(
        { error: "Ugyldig kundetype" },
        { status: 400 }
      );
    }

    if (
      preferredMethod &&
      !["STRIPE", "VIPPS", "INVOICE", "NONE"].includes(preferredMethod)
    ) {
      return NextResponse.json(
        { error: "Ugyldig betalingsmetode" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    // Check if preference exists
    const { data: existingPreference } = await supabase
      .from("CustomerPaymentPreference")
      .select("id")
      .eq("userId", user.id)
      .single();

    let result;
    if (existingPreference) {
      // Update existing
      const { data, error } = await supabase
        .from("CustomerPaymentPreference")
        .update({
          customerType: customerType ?? undefined,
          preferredMethod: preferredMethod ?? undefined,
          companyName: companyName ?? null,
          orgNumber: orgNumber ?? null,
          invoiceEmail: invoiceEmail ?? null,
          invoiceAddress: invoiceAddress ?? null,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", user.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from("CustomerPaymentPreference")
        .insert({
          id: nanoid(),
          userId: user.id,
          customerType: customerType ?? "PRIVATE",
          preferredMethod: preferredMethod ?? "NONE",
          companyName: companyName ?? null,
          orgNumber: orgNumber ?? null,
          invoiceEmail: invoiceEmail ?? null,
          invoiceAddress: invoiceAddress ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Kunne ikke lagre betalingsinnstillinger" },
      { status: 500 }
    );
  }
}
