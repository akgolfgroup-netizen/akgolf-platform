import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;

/**
 * Supabase-klient med service_role-nøkkel.
 * Brukes kun i server-side cron-jobber og admin-operasjoner.
 * Omgår RLS — bruk med forsiktighet.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "[supabase-admin] Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }

  return _supabaseAdmin;
}
