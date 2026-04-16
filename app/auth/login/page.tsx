"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white border-black/10 text-center">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-accent-cta" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-grey-400 mb-4">
              Vi har sendt en innloggingslenke til{" "}
              <strong className="text-black">{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-black hover:underline text-sm font-medium"
            >
              ← Tilbake til innlogging
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white border-black/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-accent-cta" />
            </div>
            <h1 className="text-2xl font-bold text-black">AK Golf Academy</h1>
            <p className="text-grey-400">Logg inn på din konto</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg p-1 mb-6 bg-grey-50">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-white text-black shadow-sm"
                  : "bg-transparent text-grey-400"
              }`}
            >
              Passord
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "magic"
                  ? "bg-white text-black shadow-sm"
                  : "bg-transparent text-grey-400"
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
              <label className="block text-sm font-medium text-black mb-1">
                E-post
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-grey-50 border border-black/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta"
                />
              </div>
            </div>

            {/* Password (only in password mode) */}
            {mode === "password" && (
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Passord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={mode === "password"}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 bg-grey-50 border border-black/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-grey-400 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-bold py-3 rounded-xl"
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
                className="text-black hover:underline text-sm"
              >
                Glemt passord?
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-black/10 text-center">
            <p className="text-sm text-grey-400">
              Har du ikke konto?{" "}
              <a href="/auth/register" className="text-black hover:underline font-medium">
                Registrer deg
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
