"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";

type PageState = "loading" | "form" | "success" | "error";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-[var(--color-grey-900)]" />
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
}

function SetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<PageState>("loading");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get("code");

      if (code) {
        const { error } = await getSupabase().auth.exchangeCodeForSession(code);
        if (error) {
          setState("error");
          setError("Lenken er ugyldig eller utløpt. Be om en ny invitasjon.");
          return;
        }
      }

      const { data: { session } } = await getSupabase().auth.getSession();
      if (session) {
        setState("form");
      } else {
        const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
          (event) => {
            if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
              setState("form");
              subscription.unsubscribe();
            }
          }
        );

        setTimeout(() => {
          setState((prev) => {
            if (prev === "loading") {
              setError("Kunne ikke verifisere invitasjonen. Prøv å klikke lenken i e-posten på nytt.");
              return "error";
            }
            return prev;
          });
        }, 5000);
      }
    }

    exchangeCode();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Passordet må være minst 8 tegn.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passordene er ikke like.");
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await getSupabase().auth.updateUser({
      password,
    });

    if (updateError) {
      setError("Kunne ikke sette passord. Prøv igjen.");
      setSubmitting(false);
      return;
    }

    setState("success");
    setTimeout(() => router.push("/portal"), 2000);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16" id="main-content">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <AKLogo variant="black" size={48} />
        </div>

        {state === "loading" && (
          <div className="text-center py-20">
            <Loader2 size={24} className="animate-spin text-[var(--color-grey-900)] mx-auto mb-4" />
            <p className="text-[var(--color-grey-400)]">Verifiserer invitasjon...</p>
          </div>
        )}

        {state === "error" && (
          <div className="bg-[var(--color-grey-100)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">Noe gikk galt</h1>
            <p className="text-[var(--color-grey-400)] mb-6">{error}</p>
            <a
              href="mailto:post@akgolf.no"
              className="text-sm text-[var(--color-grey-900)] hover:text-[var(--color-grey-400)] transition-colors"
            >
              Kontakt oss for hjelp
            </a>
          </div>
        )}

        {state === "form" && (
          <div className="bg-[var(--color-grey-100)] rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-[var(--color-grey-900)]/5 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[var(--color-grey-900)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-[var(--color-grey-900)] mb-2">Velg passord</h1>
              <p className="text-[var(--color-grey-400)]">
                Sett et passord for å logge inn på spillerportalen.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--color-grey-900)] mb-2">
                  Passord
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-white border border-[var(--color-grey-200)] rounded-xl text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
                  placeholder="Minst 8 tegn"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-[var(--color-grey-900)] mb-2">
                  Bekreft passord
                </label>
                <input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-white border border-[var(--color-grey-200)] rounded-xl text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)] transition-[border-color,box-shadow]"
                  placeholder="Gjenta passordet"
                />
              </div>

              {error && (
                <p className="text-sm text-[var(--color-error)]" role="alert" aria-live="assertive">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[var(--color-grey-900)] text-white font-medium py-3 px-6 rounded-full hover:bg-[var(--color-grey-900)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-[background-color,opacity]"
              >
                {submitting ? "Lagrer..." : "Sett passord og logg inn"}
              </button>
            </form>
          </div>
        )}

        {state === "success" && (
          <div className="bg-[var(--color-grey-100)] rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">Passord satt!</h1>
            <p className="text-[var(--color-grey-400)]">
              Du blir nå sendt til spillerportalen...
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
