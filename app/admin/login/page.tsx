"use client";


import { Icon } from "@/components/ui/icon";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { AKLogo } from "@/components/website/AKLogo";
import { Button } from "@/components/ui";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSupabase = useCallback(() => createSupabaseBrowser(), []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      if (authError.message.includes("Invalid login credentials")) {
        setError("Feil e-post eller passord. Prøv igjen.");
      } else {
        setError("Kunne ikke logge inn. Prøv igjen.");
      }
    } else {
      router.refresh();
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
      <div className="w-full max-w-sm">
        {/* Logo og tittel */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <AKLogo variant="academy" size={48} />
          </div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Icon name="shield"
              className="w-4 h-4 text-primary"
              aria-hidden="true" />
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">CoachHQ</h1>
          </div>
          <p className="text-sm text-muted">
            Kun for staff
          </p>
        </div>

        {/* Kort */}
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* E-post */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
              >
                E-postadresse
              </label>
              <div className="relative">
                <Icon name="mail"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  aria-hidden="true" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@akgolf.no"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  className="w-full px-3.5 py-2.5 pl-10 rounded-lg text-sm bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                />
              </div>
            </div>

            {/* Passord */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant"
              >
                Passord
              </label>
              <div className="relative">
                <Icon name="lock"
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
                  aria-hidden="true" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pl-10 pr-10 rounded-lg text-sm bg-surface-container-lowest border border-outline-variant/30 text-on-surface placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer bg-transparent border-none text-muted hover:text-text transition-colors"
                >
                  {showPassword ? (
                    <Icon name="visibility"Off className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Icon name="visibility" className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-xs text-error"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="accent"
              isLoading={loading}
              className="w-full justify-center"
            >
              {loading ? "Logger inn..." : "Logg inn"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Problemer med innlogging? Kontakt{" "}
          <a
            href="mailto:support@akgolf.no"
            className="text-primary hover:underline"
          >
            support@akgolf.no
          </a>
        </p>
      </div>
    </div>
  );
}
