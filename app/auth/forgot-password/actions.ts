"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "@/lib/portal/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const forgotSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
});

export type ForgotPasswordResult =
  | { success: true }
  | { success: false; error: string };

export async function sendPasswordReset(
  formData: FormData,
  request?: Request
): Promise<ForgotPasswordResult> {
  try {
    // Rate limit
    const ip = request ? getClientIp(request) : "unknown";
    const rateLimit = checkRateLimit(`forgot-password:${ip}`, {
      limit: 5,
      windowSeconds: 60 * 5,
    });
    if (!rateLimit.allowed) {
      return { success: false, error: "For mange forsøk. Prøv igjen senere." };
    }

    const raw = { email: formData.get("email") as string };
    const parsed = forgotSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: "Ugyldig e-postadresse" };
    }

    const { email } = parsed.data;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Use admin reset to trigger email with custom redirect
    const { error } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no"}/auth/set-password`,
      },
    });

    if (error) {
      console.error("Generate link error:", error);
      // Return generic success to avoid email enumeration
      return { success: true };
    }

    return { success: true };
  } catch (err) {
    console.error("Forgot password error:", err);
    // Return generic success to avoid email enumeration
    return { success: true };
  }
}
