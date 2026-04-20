"use client";

import { Icon } from "@/components/ui/icon";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/portal/patterns/glass-panel";
import { MonoLabel } from "@/components/portal/patterns/mono-label";
import { NightSurface } from "@/components/portal/patterns/night-surface";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

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
        setError("Feil e-post eller passord. Prøv igjen.");
      } else {
        setError("Kunne ikke logge inn. Prøv igjen.");
      }
    } else {
      router.refresh();
      router.push(redirectTo);
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
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirectTo}`,
      },
    });

    setLoading(false);

    if (authError) {
      setError("Kunne ikke sende innloggingslenke. Prøv igjen.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassPanel variant="dark" padding="lg" className="text-center">
            <div className="w-16 h-16 bg-secondary-fixed/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="mail" size={32} className="text-secondary-fixed" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F5F1] mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-[#F2F5F1]/60 mb-4">
              Vi har sendt en innloggingslenke til{" "}
              <strong className="text-[#F2F5F1]">{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-[#F2F5F1]/70 hover:text-[#F2F5F1] text-sm font-medium transition-colors"
            >
              ← Tilbake til innlogging
            </button>
          </GlassPanel>
        </motion.div>
      </NightSurface>
    );
  }

  return (
    <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassPanel variant="dark" padding="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary-fixed/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="bolt" size={32} className="text-secondary-fixed" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F5F1]">AK Golf Academy</h1>
            <p className="text-[#F2F5F1]/60 mt-1">Logg inn på din konto</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl p-1 mb-6 bg-[#F2F5F1]/5 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-[#F2F5F1]/10 text-[#F2F5F1] shadow-sm"
                  : "bg-transparent text-[#F2F5F1]/50 hover:text-[#F2F5F1]/70"
              }`}
            >
              Passord
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                mode === "magic"
                  ? "bg-[#F2F5F1]/10 text-[#F2F5F1] shadow-sm"
                  : "bg-transparent text-[#F2F5F1]/50 hover:text-[#F2F5F1]/70"
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
              <MonoLabel
                as="label"
                size="xs"
                uppercase
                className="block text-[#F2F5F1]/60 mb-1.5"
              >
                E-post
              </MonoLabel>
              <div className="relative">
                <Icon name="mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border border-white/[0.10] rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all"
                />
              </div>
            </div>

            {/* Password (only in password mode) */}
            {mode === "password" && (
              <div>
                <MonoLabel
                  as="label"
                  size="xs"
                  uppercase
                  className="block text-[#F2F5F1]/60 mb-1.5"
                >
                  Passord
                </MonoLabel>
                <div className="relative">
                  <Icon name="lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={mode === "password"}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 bg-[#F2F5F1]/5 border border-white/[0.10] rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40 hover:text-[#F2F5F1]/70 transition-colors"
                  >
                    {showPassword ? (
                      <Icon name="visibility_off" size={16} />
                    ) : (
                      <Icon name="visibility" size={16} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-error-container" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-secondary-fixed font-bold py-3 rounded-xl transition-all"
            >
              {loading
                ? mode === "password"
                  ? "Logger inn..."
                  : "Sender lenke..."
                : mode === "password"
                  ? "Logg inn"
                  : "Send innloggingslenke"}
            </Button>
          </form>

          {/* Forgot password link */}
          {mode === "password" && (
            <div className="mt-4 text-center">
              <a
                href="/auth/forgot-password"
                className="text-[#F2F5F1]/60 hover:text-[#F2F5F1] text-sm transition-colors"
              >
                Glemt passord?
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-sm text-[#F2F5F1]/50">
              Har du ikke konto?{" "}
              <a href="/auth/register" className="text-[#F2F5F1] hover:text-secondary-fixed font-medium transition-colors">
                Registrer deg
              </a>
            </p>
          </div>
        </GlassPanel>
      </motion.div>
    </NightSurface>
  );
}
