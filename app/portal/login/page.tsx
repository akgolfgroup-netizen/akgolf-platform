"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <div className="w-full max-w-sm text-center">
          <img
            src="/portal/ak-logo.svg"
            alt="AK Golf"
            className="inline-block w-12 h-12 rounded-2xl mb-4"
          />
          <h1 className="text-xl font-bold text-[var(--color-snow)] tracking-tight mb-2">
            Sjekk e-posten din
          </h1>
          <p className="text-sm text-[var(--color-snow-dim)]/60">
            Vi har sendt en innloggingslenke til <strong>{email}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      {/* Atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(184,151,92,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/portal/ak-logo.svg"
            alt="AK Golf"
            className="inline-block w-12 h-12 rounded-2xl mb-4"
          />
          <h1 className="text-xl font-bold text-[var(--color-snow)] tracking-tight">
            Golf Academy
          </h1>
          <p className="text-xs text-[var(--color-snow-dim)]/40 mt-1 uppercase tracking-widest font-medium">
            Portal
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            background: "rgba(10,25,41,0.8)",
            border: "1px solid rgba(15,41,80,0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Top accent */}
          <div
            className="absolute top-0 left-8 right-8 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(184,151,92,0.4), transparent)" }}
          />

          <p className="text-xs text-[var(--color-snow-dim)]/40 font-semibold uppercase tracking-widest mb-5">
            Logg inn
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-wider mb-1.5">
                E-postadresse
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="navn@akgolf.no"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-[var(--color-snow)] placeholder:text-[var(--color-snow-dim)]/20 text-sm outline-none transition-all"
                style={{
                  background: "rgba(10,25,41,0.8)",
                  border: "1px solid rgba(15,41,80,0.8)",
                }}
                onFocus={e => (e.currentTarget.style.border = "1px solid rgba(184,151,92,0.5)")}
                onBlur={e => (e.currentTarget.style.border = "1px solid rgba(15,41,80,0.8)")}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400/80">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #c9a96e 0%, #B8975C 100%)",
                color: "var(--color-bg-deep)",
              }}
            >
              {loading ? "Sender lenke..." : "Send innloggingslenke"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
