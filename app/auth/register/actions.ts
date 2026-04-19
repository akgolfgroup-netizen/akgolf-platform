"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIp } from "@/lib/portal/rate-limit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const registerSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  password: z.string().min(8, "Passordet må være minst 8 tegn"),
  name: z.string().min(2, "Navn må være minst 2 tegn"),
  phone: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Du må akseptere vilkårene",
  }),
});

export type RegisterResult =
  | { success: true }
  | { success: false; error: string; field?: string };

export async function registerUser(
  formData: FormData,
  request?: Request
): Promise<RegisterResult> {
  try {
    // Rate limit
    const ip = request ? getClientIp(request) : "unknown";
    const rateLimit = checkRateLimit(`register:${ip}`, {
      limit: 5,
      windowSeconds: 60 * 5,
    });
    if (!rateLimit.allowed) {
      return { success: false, error: "For mange forsøk. Prøv igjen senere." };
    }

    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
      acceptTerms: formData.get("acceptTerms") === "on",
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { success: false, error: first.message, field: first.path[0] as string };
    }

    const { email, password, name, phone } = parsed.data;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { name, phone },
    });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return { success: false, error: "Denne e-postadressen er allerede registrert." };
      }
      return { success: false, error: "Kunne ikke opprette konto. Prøv igjen." };
    }

    const userId = authData.user?.id;
    if (!userId) {
      return { success: false, error: "Kunne ikke opprette konto. Prøv igjen." };
    }

    // Create User record in database
    const { error: dbError } = await supabase.from("User").insert({
      id: userId,
      email,
      name,
      phone: phone || null,
      supabaseId: userId,
      role: "STUDENT",
      subscriptionTier: "FREE",
    });

    if (dbError) {
      console.error("Failed to create User record:", dbError);
      // Don't fail the registration if DB insert fails; we can reconcile later
    }

    // Send confirmation email via Supabase (signUp with email redirect)
    // Since we used admin.createUser, we need to trigger the confirmation email manually
    // by sending a magic link or using resend. Simpler: use supabase.auth.signUp with same creds
    // to trigger the confirmation email.
    const publicSupabase = createClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error: signUpError } = await publicSupabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "https://akgolf.no"}/auth/callback`,
        data: { name, phone },
      },
    });

    if (signUpError) {
      // User already exists (created above), so this may fail. That's OK for email confirmation.
      console.error("SignUp error (expected if user exists):", signUpError);
    }

    return { success: true };
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, error: "Noe gikk galt. Prøv igjen." };
  }
}
