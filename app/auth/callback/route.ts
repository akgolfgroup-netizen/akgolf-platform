import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect =
    requestUrl.searchParams.get("redirect") || "/portal";

  if (code) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    // Link existing plans to this user by matching email
    if (!error && data.user?.email) {
      const service = createServiceClient();
      await service
        .from("plans")
        .update({ user_id: data.user.id })
        .eq("email", data.user.email)
        .is("user_id", null);
    }
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}
