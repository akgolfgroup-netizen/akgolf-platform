"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";
import { ShimmerButton } from "@/components/portal/ui/shimmer-button";
import { Spotlight } from "@/components/portal/ui/spotlight";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  // Memoize supabase client to avoid recreating on each render
  const getSupabase = useCallback(() => createSupabaseBrowser(), []);

  async function handlePasswordLogin(e: React.FormEvent) {
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
      // Refresh server components to pick up new auth cookies, then navigate
      router.refresh();
      router.push("/portal");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/portal`,
      },
    });

    setLoading(false);

    if (authError) {
      setError("Kunne ikke sende innloggingslenke. Prov igjen.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--portal-bg)]">
        <div className="w-full max-w-sm mx-auto text-center">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 bg-[var(--portal-surface-sunken)] border border-[var(--portal-card-border)]">
            <Mail className="w-5 h-5 text-[var(--portal-text-muted)]" />
          </div>
          <h1 className="text-xl font-semibold mb-2 text-[var(--portal-text-primary)]">
            Sjekk e-posten din
          </h1>
          <p className="text-sm text-[var(--portal-text-secondary)]">
            Vi har sendt en innloggingslenke til{" "}
            <strong className="text-[var(--portal-text-primary)]">{email}</strong>
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm font-medium cursor-pointer bg-transparent border-none text-[var(--portal-text-primary)] hover:text-[var(--portal-accent)]"
          >
            &larr; Tilbake til innlogging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--portal-bg)] relative overflow-hidden">
      <Spotlight fill="rgba(176, 125, 79, 0.06)" className="-top-40 left-0 md:-top-20 md:left-60" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AKLogo variant="academy" size={48} />
          </div>
          <h1 className="text-xl font-semibold text-[var(--portal-text-primary)]">
            Spillerportal
          </h1>
          <p className="text-sm mt-1 text-[var(--portal-text-muted)]">
            Logg inn for å fortsette
          </p>
        </div>

        {/* Card */}
        <div className="portal-card rounded-xl p-6">
          {/* Mode Toggle */}
          <div className="flex rounded-lg p-1 mb-5 bg-[var(--portal-surface-sunken)]">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-[background-color,color,border-color] cursor-pointer ${
                mode === "password"
                  ? "bg-[var(--portal-card-bg-solid)] text-[var(--portal-text-primary)] border border-[var(--portal-card-border)]"
                  : "bg-transparent text-[var(--portal-text-muted)] border border-transparent"
              }`}
            >
              Passord
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-[background-color,color,border-color] cursor-pointer ${
                mode === "magic"
                  ? "bg-[var(--portal-card-bg-solid)] text-[var(--portal-text-primary)] border border-[var(--portal-card-border)]"
                  : "bg-transparent text-[var(--portal-text-muted)] border border-transparent"
              }`}
            >
              Magic Link
            </button>
          </div>

          <form
            onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-[var(--portal-text-primary)]">
                E-postadresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-text-muted)]" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  className="portal-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Password (only in password mode) */}
            {mode === "password" && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5 text-[var(--portal-text-primary)]">
                  Passord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--portal-text-muted)]" aria-hidden="true" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="portal-input w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none text-[var(--portal-text-muted)] hover:text-[var(--portal-text-primary)]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-xs text-[var(--color-error)]" role="alert" aria-live="assertive">
                {error}
              </p>
            )}

            <ShimmerButton
              type="submit"
              disabled={loading}
              className="w-full"
              background="var(--portal-accent)"
              shimmerColor="rgba(255, 255, 255, 0.3)"
              borderRadius="8px"
            >
              {loading
                ? mode === "password"
                  ? "Logger inn..."
                  : "Sender lenke..."
                : mode === "password"
                  ? "Logg inn"
                  : "Send innloggingslenke"}
            </ShimmerButton>
          </form>

          {/* Forgot password link */}
          {mode === "password" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode("magic")}
                className="text-sm cursor-pointer bg-transparent border-none text-[var(--portal-text-muted)] hover:text-[var(--portal-text-primary)]"
              >
                Glemt passord? Bruk magic link
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-[var(--portal-text-muted)]">
          Har du ikke tilgang?{" "}
          <a
            href="/academy"
            className="font-medium text-[var(--portal-accent)]"
          >
            Sok om plass
          </a>
        </p>
      </div>
    </div>
  );
}
