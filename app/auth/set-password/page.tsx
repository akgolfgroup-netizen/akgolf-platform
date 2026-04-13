"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AKLogo } from "@/components/website/AKLogo";
import { Card } from "@/components/ui";
import {
  EASE,
  EASE_OUT_EXPO,
  fadeInUp,
  staggerContainer,
  scaleIn,
} from "@/components/portal/premium";

type PageState = "loading" | "form" | "success" | "error";

function getSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen w-full flex items-center justify-center bg-background-beige">
          <Loader2
            size={28}
            className="animate-spin text-primary"
          />
        </main>
      }
    >
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

      const {
        data: { session },
      } = await getSupabase().auth.getSession();
      if (session) {
        setState("form");
      } else {
        const {
          data: { subscription },
        } = getSupabase().auth.onAuthStateChange((event) => {
          if (event === "SIGNED_IN" || event === "PASSWORD_RECOVERY") {
            setState("form");
            subscription.unsubscribe();
          }
        });

        setTimeout(() => {
          setState((prev) => {
            if (prev === "loading") {
              setError(
                "Kunne ikke verifisere invitasjonen. Prøv å klikke lenken i e-posten på nytt.",
              );
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
    <main
      id="main-content"
      className="min-h-screen w-full flex flex-col lg:flex-row bg-background-beige"
    >
      {/* VENSTRE — Hero */}
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-alt) 100%)",
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-cta) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 h-1"
          style={{ background: "var(--color-accent-cta)" }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex items-center justify-between"
          >
            <AKLogo variant="white" size={56} />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm bg-white/5">
              <Sparkles className="w-3.5 h-3.5 text-accent-cta" />
              <span className="text-[11px] font-medium tracking-wide uppercase text-white/90">
                Ny konto
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-lg"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium tracking-[0.18em] uppercase text-accent-cta mb-6"
            >
              Velkommen ombord
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight mb-6"
            >
              Ett steg
              <br />
              igjen.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed text-white/70 max-w-md"
            >
              Velg et passord for kontoen din, så tar vi deg rett inn i
              spillerportalen og treningsplanen din.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="text-xs text-white/50 tracking-wide"
          >
            &copy; {new Date().getFullYear()} AK Golf Group
          </motion.div>
        </div>
      </motion.aside>

      {/* HØYRE — Form */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 lg:px-12 lg:py-16 relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, var(--color-primary-soft) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />

        <div className="w-full max-w-[440px] relative z-10">
          <div className="flex lg:hidden justify-center mb-8">
            <AKLogo variant="black" size={44} />
          </div>

          <AnimatePresence mode="wait">
            {state === "loading" && (
              <motion.div
                key="loading"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card padding="lg" className="text-center">
                  <Loader2
                    size={28}
                    className="animate-spin text-primary mx-auto mb-4"
                  />
                  <p className="text-sm text-muted">
                    Verifiserer invitasjon...
                  </p>
                </Card>
              </motion.div>
            )}

            {state === "error" && (
              <motion.div
                key="error"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card
                  padding="lg"
                  className="text-center shadow-[0_24px_60px_-30px_rgba(184,66,51,0.25)]"
                >
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-error/10">
                    <AlertTriangle className="w-7 h-7 text-error" />
                  </div>
                  <h1 className="text-2xl font-semibold text-text mb-2">
                    Noe gikk galt
                  </h1>
                  <p className="text-sm text-muted mb-8 leading-relaxed">
                    {error}
                  </p>
                  <a
                    href="mailto:post@akgolf.no"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-alt transition-colors"
                  >
                    Kontakt oss for hjelp
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Card>
              </motion.div>
            )}

            {state === "form" && (
              <motion.div
                key="form"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 10 }}
              >
                <motion.div variants={fadeInUp} className="mb-8">
                  <h1 className="text-3xl font-semibold text-text tracking-tight mb-2">
                    Velg passord
                  </h1>
                  <p className="text-[15px] text-muted">
                    Sett et passord for å logge inn på spillerportalen.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card
                    padding="lg"
                    className="shadow-[0_24px_60px_-30px_rgba(0,88,64,0.20)]"
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-[13px] font-medium mb-2 text-text"
                        >
                          Passord
                        </label>
                        <div className="relative group">
                          <Lock
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-colors group-focus-within:text-primary"
                            aria-hidden="true"
                          />
                          <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            autoComplete="new-password"
                            placeholder="Minst 8 tegn"
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white border border-black/10 text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="confirm"
                          className="block text-[13px] font-medium mb-2 text-text"
                        >
                          Bekreft passord
                        </label>
                        <div className="relative group">
                          <Lock
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-colors group-focus-within:text-primary"
                            aria-hidden="true"
                          />
                          <input
                            id="confirm"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            placeholder="Gjenta passordet"
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-white border border-black/10 text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-[border-color,box-shadow]"
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-xs font-medium text-error flex items-center gap-1.5"
                          role="alert"
                          aria-live="assertive"
                        >
                          <span className="w-1 h-1 rounded-full bg-error" />
                          {error}
                        </motion.p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-alt disabled:opacity-60 disabled:cursor-not-allowed transition-colors group relative overflow-hidden cursor-pointer border-none mt-1"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {submitting
                            ? "Lagrer..."
                            : "Sett passord og logg inn"}
                          {!submitting && (
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                      </button>
                    </form>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {state === "success" && (
              <motion.div
                key="success"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
              >
                <Card
                  padding="lg"
                  className="text-center shadow-[0_24px_60px_-30px_rgba(42,125,90,0.25)]"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-success/10"
                  >
                    <CheckCircle2 className="w-7 h-7 text-success" />
                  </motion.div>
                  <h1 className="text-2xl font-semibold text-text mb-2">
                    Passord satt
                  </h1>
                  <p className="text-sm text-muted">
                    Du blir nå sendt til spillerportalen...
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
