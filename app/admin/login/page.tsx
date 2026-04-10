"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";
import { ShimmerButton } from "@/components/portal/ui/shimmer-button";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--color-grey-900)]">
      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AKLogo variant="academy" size={48} />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-[var(--color-accent-cta)]" />
            <h1 className="text-xl font-semibold text-white">
              Mission Control
            </h1>
          </div>
          <p className="text-sm mt-1 text-[var(--color-grey-400)]">
            Kun for staff — logg inn med e-post og passord
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--color-grey-800)] border border-[var(--color-grey-700)] rounded-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="admin-email"
                className="block text-sm font-medium mb-1.5 text-[var(--color-grey-200)]"
              >
                E-postadresse
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-500)]"
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm bg-[var(--color-grey-900)] border border-[var(--color-grey-700)] text-white placeholder-[var(--color-grey-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cta)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium mb-1.5 text-[var(--color-grey-200)]"
              >
                Passord
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-500)]"
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm bg-[var(--color-grey-900)] border border-[var(--color-grey-700)] text-white placeholder-[var(--color-grey-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cta)] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none text-[var(--color-grey-500)] hover:text-white"
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

            <ShimmerButton
              type="submit"
              disabled={loading}
              className="w-full"
              background="var(--color-accent-cta)"
              shimmerColor="rgba(255, 255, 255, 0.3)"
              borderRadius="8px"
            >
              {loading ? "Logger inn..." : "Logg inn"}
            </ShimmerButton>
          </form>
        </div>
      </div>
    </div>
  );
}
