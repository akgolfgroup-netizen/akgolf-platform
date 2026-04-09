"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback, useEffect } from "react";
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
      <div className="min-h-screen bg-[#f7f3ea] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white border-[#154212]/10 text-center">
            <div className="w-16 h-16 bg-[#154212] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#d2f000]" />
            </div>
            <h1 className="text-2xl font-bold text-[#154212] mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-[#666666] mb-4">
              Vi har sendt en innloggingslenke til{" "}
              <strong className="text-[#154212]">{email}</strong>
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-[#154212] hover:underline text-sm font-medium"
            >
              ← Tilbake til innlogging
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ea] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white border-[#154212]/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#154212] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#d2f000]" />
            </div>
            <h1 className="text-2xl font-bold text-[#154212]">AK Golf Academy</h1>
            <p className="text-[#666666]">Logg inn på din konto</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-lg p-1 mb-6 bg-[#f7f3ea]">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "password"
                  ? "bg-white text-[#154212] shadow-sm"
                  : "bg-transparent text-[#666666]"
              }`}
            >
              Passord
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer ${
                mode === "magic"
                  ? "bg-white text-[#154212] shadow-sm"
                  : "bg-transparent text-[#666666]"
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
              <label className="block text-sm font-medium text-[#154212] mb-1">
                E-post
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#f7f3ea] border border-[#154212]/10 rounded-xl text-[#154212] focus:outline-none focus:ring-2 focus:ring-[#d2f000]"
                />
              </div>
            </div>

            {/* Password (only in password mode) */}
            {mode === "password" && (
              <div>
                <label className="block text-sm font-medium text-[#154212] mb-1">
                  Passord
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required={mode === "password"}
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-3 bg-[#f7f3ea] border border-[#154212]/10 rounded-xl text-[#154212] focus:outline-none focus:ring-2 focus:ring-[#d2f000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#154212]"
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
              className="w-full bg-[#154212] hover:bg-[#0f3d0a] text-white font-bold py-3 rounded-xl"
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
              <button
                type="button"
                onClick={() => setMode("magic")}
                className="text-[#154212] hover:underline text-sm"
              >
                Glemt passord? Bruk magic link
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-[#154212]/10 text-center">
            <p className="text-sm text-[#666666]">
              Eller gå til{" "}
              <a href="/portal/login" className="text-[#154212] hover:underline font-medium">
                Spillerportal login
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
