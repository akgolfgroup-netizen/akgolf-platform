"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/treningsplan/dashboard";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (authError) {
      setError("Kunne ikke sende innloggingslenke. Sjekk e-postadressen.");
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-success"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <h1 className="w-heading-md mb-4">Sjekk e-posten din</h1>
        <p className="text-ink-50 mb-2">
          Vi har sendt en innloggingslenke til
        </p>
        <p className="font-semibold text-ink-90 mb-8">{email}</p>
        <p className="text-sm text-ink-50">
          Klikk lenken i e-posten for a logge inn. Sjekk spam-mappen om du ikke
          finner den.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="w-heading-md mb-3">Logg inn</h1>
        <p className="text-ink-50">
          Logg inn for a se din treningsplan og folge utviklingen din.
        </p>
      </div>

      <form onSubmit={handleLogin} className="w-card p-8">
        <label htmlFor="email" className="w-label mb-1 block">
          E-post
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          required
          className="w-input w-full mb-6"
          autoFocus
        />

        {error && (
          <p className="text-error text-sm mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !email.includes("@")}
          className="w-btn w-btn-gold w-full"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Sender...
            </span>
          ) : (
            "Send innloggingslenke"
          )}
        </button>

        <p className="text-xs text-ink-50 text-center mt-4">
          Vi sender en sikker lenke til e-postadressen din. Ingen passord
          trengs.
        </p>
      </form>

      <div className="text-center mt-6">
        <Link
          href="/treningsplan"
          className="text-sm text-ink-50 hover:text-gold transition-colors"
        >
          Tilbake til treningsplan
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <WebsiteNav />
      <main className="min-h-screen flex items-center justify-center pt-20 pb-16">
        <div className="w-container">
          <Suspense
            fallback={
              <div className="text-center">
                <p className="text-ink-50">Laster...</p>
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <WebsiteFooter />
    </>
  );
}
