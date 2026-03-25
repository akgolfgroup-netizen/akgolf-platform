"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
        setError("Feil e-post eller passord. Prøv igjen.");
      } else {
        setError("Kunne ikke logge inn. Prøv igjen.");
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
      setError("Kunne ikke sende innloggingslenke. Prøv igjen.");
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-content px-4"
        style={{ background: "#f5f5f5", fontFamily: "'Inter', sans-serif" }}
      >
        <div className="w-full max-w-sm mx-auto text-center">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{ background: "#f5f5f5", border: "1px solid #e5e5e5" }}
          >
            <Mail className="w-5 h-5" style={{ color: "#737373" }} />
          </div>
          <h1
            className="text-xl font-semibold mb-2"
            style={{ color: "#171717" }}
          >
            Sjekk e-posten din
          </h1>
          <p className="text-sm" style={{ color: "#525252" }}>
            Vi har sendt en innloggingslenke til{" "}
            <strong style={{ color: "#171717" }}>{email}</strong>
          </p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-sm font-medium cursor-pointer"
            style={{ color: "#171717", background: "none", border: "none" }}
          >
            ← Tilbake til innlogging
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#f5f5f5", fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{ background: "#171717" }}
          >
            <span className="text-lg font-bold text-white">AK</span>
          </div>
          <h1
            className="text-xl font-semibold"
            style={{ color: "#171717" }}
          >
            Spillerportal
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "#737373" }}
          >
            Logg inn for å fortsette
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "#fff",
            border: "1px solid #e5e5e5",
          }}
        >
          {/* Mode Toggle */}
          <div
            className="flex rounded-lg p-1 mb-5"
            style={{ background: "#f5f5f5" }}
          >
            <button
              type="button"
              onClick={() => setMode("password")}
              className="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer"
              style={{
                background: mode === "password" ? "#fff" : "transparent",
                color: mode === "password" ? "#171717" : "#737373",
                border: mode === "password" ? "1px solid #e5e5e5" : "1px solid transparent",
              }}
            >
              Passord
            </button>
            <button
              type="button"
              onClick={() => setMode("magic")}
              className="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all cursor-pointer"
              style={{
                background: mode === "magic" ? "#fff" : "transparent",
                color: mode === "magic" ? "#171717" : "#737373",
                border: mode === "magic" ? "1px solid #e5e5e5" : "1px solid transparent",
              }}
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
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#171717" }}
              >
                E-postadresse
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "#737373" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e5e5",
                    color: "#171717",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#171717";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(23, 23, 23, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e5e5e5";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password (only in password mode) */}
            {mode === "password" && (
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "#171717" }}
                >
                  Passord
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: "#737373" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{
                      background: "#fff",
                      border: "1px solid #e5e5e5",
                      color: "#171717",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#171717";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(23, 23, 23, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e5e5e5";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ color: "#737373", background: "none", border: "none" }}
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
              <p className="text-xs" style={{ color: "#dc2626" }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-sm transition-all cursor-pointer disabled:cursor-not-allowed"
              style={{
                background: loading ? "#a3a3a3" : "#171717",
                color: "#fff",
                border: "1px solid",
                borderColor: loading ? "#a3a3a3" : "#171717",
              }}
            >
              {loading
                ? mode === "password"
                  ? "Logger inn..."
                  : "Sender lenke..."
                : mode === "password"
                  ? "Logg inn"
                  : "Send innloggingslenke"}
            </button>
          </form>

          {/* Forgot password link */}
          {mode === "password" && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setMode("magic")}
                className="text-sm cursor-pointer"
                style={{ color: "#737373", background: "none", border: "none" }}
              >
                Glemt passord? Bruk magic link
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: "#737373" }}
        >
          Har du ikke tilgang?{" "}
          <a
            href="/academy"
            className="font-medium"
            style={{ color: "#171717" }}
          >
            Søk om plass
          </a>
        </p>
      </div>
    </div>
  );
}
