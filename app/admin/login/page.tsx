"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";
import { AdminButton } from "@/components/portal/mission-control/ui";

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
        setError("Feil e-post eller passord. Prov igjen.");
      } else {
        setError("Kunne ikke logge inn. Prov igjen.");
      }
    } else {
      router.refresh();
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[var(--color-surface)]">
      <div className="w-full max-w-sm">
        {/* Logo og tittel */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <AKLogo variant="academy" size={48} />
          </div>
          <div className="inline-flex items-center gap-2 mb-2">
            <Shield
              className="w-4 h-4 text-[var(--color-primary)]"
              aria-hidden="true"
            />
            <h1 className="admin-page-title text-2xl">Mission Control</h1>
          </div>
          <p className="text-sm text-[var(--color-muted)]">
            Kun for staff
          </p>
        </div>

        {/* Kort */}
        <div className="admin-card">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* E-post */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="admin-label block"
              >
                E-postadresse
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@akgolf.no"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  className="admin-input pl-10"
                />
              </div>
            </div>

            {/* Passord */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="admin-label block"
              >
                Passord
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="admin-input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 cursor-pointer bg-transparent border-none text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-xs text-[var(--color-error)]"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </p>
            )}

            <AdminButton
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center"
            >
              {loading ? "Logger inn..." : "Logg inn"}
            </AdminButton>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          Problemer med innlogging? Kontakt{" "}
          <a
            href="mailto:support@akgolf.no"
            className="text-[var(--color-primary)] hover:underline"
          >
            support@akgolf.no
          </a>
        </p>
      </div>
    </div>
  );
}
