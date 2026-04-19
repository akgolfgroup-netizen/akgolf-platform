import "server-only";
import { cookies } from "next/headers";
import { createServerSupabase } from "@/lib/supabase/server";

const COOKIE_NAME = "ak_sensitive_confirmed_at";
const MAX_AGE_SECONDS = 15 * 60; // 15 minutter

/**
 * Sensitive action guard. Krever at brukeren har bekreftet identiteten sin
 * innen siste 15 minutter. Brukes for USERS_ASSIGN_CAPABILITIES,
 * USERS_ASSIGN_ROLE, USERS_DEACTIVATE, SCOUTING_VIEW_JUNIORS-tildeling,
 * FINANCE_REFUND, SYSTEM_SETTINGS og SYSTEM_RUN_CRON.
 *
 * MVP-implementasjon: sjekker en HTTP-only cookie som settes av
 * confirmSensitiveAuth(). Senere bør dette utvides til Supabase MFA/AAL2.
 */
export class SensitiveAuthRequiredError extends Error {
  constructor() {
    super(
      "Kritisk handling. Bekreft identiteten din på nytt for å fortsette."
    );
    this.name = "SensitiveAuthRequiredError";
  }
}

export async function hasRecentSensitiveAuth(): Promise<boolean> {
  const store = await cookies();
  const cookie = store.get(COOKIE_NAME);
  if (!cookie) return false;
  const ts = parseInt(cookie.value, 10);
  if (Number.isNaN(ts)) return false;
  const ageSec = (Date.now() - ts) / 1000;
  return ageSec < MAX_AGE_SECONDS;
}

export async function requireSensitiveAuth(): Promise<void> {
  if (!(await hasRecentSensitiveAuth())) {
    throw new SensitiveAuthRequiredError();
  }
}

/**
 * Bekreft passordet til innlogget bruker. Hvis OK, sett cookien som
 * gir tilgang til sensitive actions i 15 min.
 */
export async function confirmSensitiveAuth(password: string): Promise<void> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new SensitiveAuthRequiredError();
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (error) {
    throw new Error("Feil passord. Prøv igjen.");
  }

  const store = await cookies();
  store.set(COOKIE_NAME, Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearSensitiveAuth(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
