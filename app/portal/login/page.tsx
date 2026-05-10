"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const inputFocus = {
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#005840";
    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,88,64,0.08)";
  },
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#E5E3DD";
    e.currentTarget.style.boxShadow = "none";
  },
};

const inputStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E5E3DD",
  borderRadius: 10,
  color: "#0A1F18",
};

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  borderRadius: 20,
  border: "1px solid #E5E3DD",
  boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
};

const heading = "var(--font-inter-tight), Inter, sans-serif";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const getSupabase = useCallback(() => createSupabaseBrowser(), []);

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setLoading(false);
      setError(
        authError.message.includes("Invalid login credentials")
          ? "Feil e-post eller passord. Prov igjen."
          : "Kunne ikke logge inn. Prov igjen.",
      );
    } else {
      router.refresh();
      router.push("/portal");
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=/portal` },
    });
    if (authError) {
      setLoading(false);
      setError("Kunne ikke logge inn med Google. Prov igjen.");
    }
  }

  async function handleForgotPassword() {
    if (!email) { setError("Skriv inn e-postadressen din forst."); return; }
    setLoading(true);
    setError("");
    const supabase = getSupabase();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/portal` },
    });
    setLoading(false);
    if (authError) setError("Kunne ikke sende tilbakestillingslenke.");
    else setSent(true);
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5" style={{ background: "#FAFAF7" }}>
        <div className="w-full max-w-[420px] text-center p-8" style={cardStyle}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "#E8F0EC" }}>
            <Mail className="w-6 h-6" style={{ color: "#005840" }} strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2" style={{ color: "#0A1F18", fontFamily: heading }}>
            Sjekk e-posten din
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "#5E5C57" }}>
            Vi har sendt en innloggingslenke til<br />
            <strong style={{ color: "#0A1F18" }}>{email}</strong>
          </p>
          <button
            type="button" onClick={() => setSent(false)}
            className="mt-6 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
            style={{ color: "#005840" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            Tilbake til innlogging
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-5 py-12" style={{ background: "#FAFAF7" }}>
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-8">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-xl text-[18px] font-extrabold tracking-tight"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >AK</div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-bold tracking-tight mb-1.5" style={{ color: "#0A1F18", fontFamily: heading, fontSize: 24 }}>
            Logg inn pa AK Golf
          </h1>
          <p style={{ color: "#5E5C57", fontSize: 14 }}>Velkommen tilbake</p>
        </div>

        <div className="p-6 sm:p-7" style={cardStyle}>
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium mb-2" style={{ color: "#0A1F18" }}>E-post</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9C9990" }} strokeWidth={1.75} aria-hidden="true" />
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="navn@eksempel.no" required autoComplete="email" spellCheck={false}
                  className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none transition-[border-color,box-shadow]"
                  style={inputStyle} {...inputFocus} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-medium mb-2" style={{ color: "#0A1F18" }}>Passord</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#9C9990" }} strokeWidth={1.75} aria-hidden="true" />
                <input id="password" type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="--------" required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 text-sm focus:outline-none transition-[border-color,box-shadow]"
                  style={inputStyle} {...inputFocus} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Skjul passord" : "Vis passord"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer bg-transparent border-none"
                  style={{ color: "#9C9990" }}>
                  {showPassword
                    ? <EyeOff className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                    : <Eye className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: "#005840" }} />
                <span className="text-[13px]" style={{ color: "#5E5C57" }}>Husk meg</span>
              </label>
              <button type="button" onClick={handleForgotPassword}
                className="text-[13px] font-medium cursor-pointer bg-transparent border-none"
                style={{ color: "#005840" }}>
                Glemt passord?
              </button>
            </div>

            {error && (
              <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "#A32D2D" }} role="alert" aria-live="assertive">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#A32D2D" }} />
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer border-none"
              style={{ background: "#005840", color: "#FFFFFF", borderRadius: 12 }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.75} />Logger inn...
                  </span>
                : "Logg inn"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "#E5E3DD" }} />
            <span className="text-xs" style={{ color: "#9C9990" }}>eller</span>
            <div className="flex-1 h-px" style={{ background: "#E5E3DD" }} />
          </div>

          <button type="button" onClick={handleGoogleLogin} disabled={loading}
            className="w-full py-3 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2.5"
            style={{ background: "#FFFFFF", color: "#0A1F18", borderRadius: 12, border: "1px solid #E5E3DD" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Fortsett med Google
          </button>
        </div>

        <p className="text-center text-sm mt-7" style={{ color: "#5E5C57" }}>
          Har du ikke konto?{" "}
          <Link href="/kontakt" className="font-semibold" style={{ color: "#005840" }}>Kontakt oss</Link>
        </p>
        <p className="text-center text-xs mt-3">
          <Link href="/" className="inline-flex items-center gap-1" style={{ color: "#9C9990" }}>
            <ArrowLeft className="w-3 h-3" strokeWidth={1.75} />Til hovedside
          </Link>
        </p>
      </div>
    </main>
  );
}
