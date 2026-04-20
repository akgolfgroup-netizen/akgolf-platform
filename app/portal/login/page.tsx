"use client";


import { Icon } from "@/components/ui/icon";
import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { AKLogo } from "@/components/website/AKLogo";
import {
  EASE,
  EASE_OUT_EXPO,
  fadeInUp,
  staggerContainer,
  scaleIn,
} from "@/components/portal/premium";
import { Card } from "@/components/ui/card";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

type Mode = "password" | "magic";

const shakeVariant = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4, ease: EASE },
  },
  rest: { x: 0 },
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState<Mode>("password");
  const [errorKey, setErrorKey] = useState(0);

  const getSupabase = useCallback(() => createSupabaseBrowser(), []);

  function triggerError(message: string) {
    setError(message);
    setErrorKey((k) => k + 1);
  }

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
        triggerError("Feil e-post eller passord. Prøv igjen.");
      } else {
        triggerError("Kunne ikke logge inn. Prøv igjen.");
      }
    } else {
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
      triggerError("Kunne ikke sende innloggingslenke. Prøv igjen.");
    } else {
      setSent(true);
    }
  }

  return (
    <main
      id="main-content"
      className="min-h-screen w-full flex flex-col lg:flex-row bg-[var(--color-background-beige)]"
    >
      {/* VENSTRE — Hero (skjult pa mobil) */}
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden text-surface"
        aria-hidden="true"
      >
        {/* Bakgrunn: hero-bilde */}
        <Image
          src="/images/hero/academy.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />

        {/* Bakgrunn: gradient-overlay for lesbarhet */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 88, 64, 0.92) 0%, rgba(0, 89, 76, 0.85) 50%, rgba(0, 88, 64, 0.92) 100%)",
          }}
        />

        {/* Bakgrunn: radial dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Bakgrunn: store radial glow */}
        <div
          className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-cta) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 w-[520px] h-[520px] rounded-full blur-3xl opacity-15"
          style={{
            background:
              "radial-gradient(circle, #ffffff 0%, transparent 70%)",
          }}
        />

        {/* Accent-stripe nede */}
        <div
          className="absolute left-0 right-0 bottom-0 h-1"
          style={{ background: "var(--color-accent-cta)" }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo + badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="flex items-center justify-between"
          >
            <AKLogo variant="white" size={56} />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm bg-surface-container-lowest/5">
              <Icon name="auto_awesome" className="w-3.5 h-3.5 text-[var(--color-accent-cta)]" />
              <span className="text-[11px] font-medium tracking-wide uppercase text-surface/90">
                Spillerportal
              </span>
            </div>
          </motion.div>

          {/* Hero-tekst */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-lg"
          >
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium tracking-[0.18em] uppercase text-[var(--color-accent-cta)] mb-6"
            >
              Sort. Hvit. En grønn.
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight mb-6 text-surface"
            >
              Premium
              <br />
              golfcoaching.
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg leading-relaxed text-surface/70 max-w-md"
            >
              Logg inn for å se treningsplanen din, booke økter og følge
              utviklingen din med skreddersydd coaching fra AK Golf.
            </motion.p>

            <motion.ul
              variants={fadeInUp}
              className="mt-10 space-y-3 text-[15px] text-surface/80"
            >
              {[
                "Personlig treningsplan generert av AI",
                "Strokes Gained-statistikk i sanntid",
                "Direkte kontakt med din trener",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Icon name="check"Circle2 className="w-4 h-4 text-[var(--color-accent-cta)] flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Footer i hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
            className="text-xs text-surface/50 tracking-wide"
          >
            &copy; {new Date().getFullYear()} AK Golf Group
          </motion.div>
        </div>
      </motion.aside>

      {/* HOYRE — Form */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 lg:px-12 lg:py-16 relative">
        {/* Subtil bakgrunn pa form-siden */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 15%, var(--color-primary-soft) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Mini-logo — vises kun pa mobil */}
          <motion.div
            variants={fadeInUp}
            className="flex lg:hidden justify-center mb-8"
          >
            <AKLogo variant="black" size={44} />
          </motion.div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                variants={scaleIn}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              >
                <Card
                  padding="lg"
                  className="text-center shadow-[0_24px_60px_-30px_rgba(0,88,64,0.25)]"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-[var(--color-primary-soft)]"
                  >
                    <Icon name="mail" className="w-7 h-7 text-[var(--color-primary)]" />
                  </motion.div>
                  <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">
                    Sjekk e-posten din
                  </h1>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                    Vi har sendt en innloggingslenke til
                    <br />
                    <strong className="text-[var(--color-text)]">{email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-8 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-alt)] transition-colors inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-none"
                  >
                    <Icon name="arrow_forward" className="w-3.5 h-3.5 rotate-180" />
                    Tilbake til innlogging
                  </button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
              >
                <motion.div variants={fadeInUp} className="mb-8">
                  <h1 className="text-3xl font-semibold text-[var(--color-grey-900)] tracking-tight mb-2">
                    Velkommen tilbake
                  </h1>
                  <p className="text-[15px] text-[var(--color-muted)]">
                    Logg inn på spillerportalen for å fortsette.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <Card
                    padding="lg"
                    className="shadow-[0_24px_60px_-30px_rgba(0,88,64,0.20)]"
                  >
                    {/* Mode-toggle — pill med layoutId */}
                    <div className="relative flex p-1 mb-6 rounded-xl bg-[var(--color-primary-soft)]">
                      {(["password", "magic"] as const).map((m) => {
                        const isActive = mode === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className="relative flex-1 py-2.5 px-3 text-sm font-medium rounded-lg z-10 cursor-pointer bg-transparent border-none transition-colors"
                          >
                            {isActive && (
                              <motion.span
                                layoutId="login-tab-indicator"
                                className="absolute inset-0 bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_-4px_rgba(0,88,64,0.15)]"
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 32,
                                }}
                              />
                            )}
                            <span
                              className={`relative z-10 transition-colors ${
                                isActive
                                  ? "text-[var(--color-primary)]"
                                  : "text-[var(--color-muted)]"
                              }`}
                            >
                              {m === "password" ? "Passord" : "Magic Link"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <motion.form
                      key={errorKey}
                      variants={shakeVariant}
                      animate={error ? "shake" : "rest"}
                      onSubmit={
                        mode === "password"
                          ? handlePasswordLogin
                          : handleMagicLink
                      }
                      className="space-y-4"
                    >
                      {/* E-post */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-[13px] font-medium mb-2 text-[var(--color-text)]"
                        >
                          E-postadresse
                        </label>
                        <div className="relative group">
                          <Icon name="mail"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] transition-colors group-focus-within:text-[var(--color-primary)]"
                            aria-hidden="true" />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="navn@eksempel.no"
                            required
                            autoComplete="email"
                            spellCheck={false}
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-surface-container-lowest border border-black/10 text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-[border-color,box-shadow]"
                          />
                        </div>
                      </div>

                      {/* Passord */}
                      <AnimatePresence initial={false}>
                        {mode === "password" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            style={{ overflow: "hidden" }}
                          >
                            <label
                              htmlFor="password"
                              className="block text-[13px] font-medium mb-2 text-[var(--color-text)]"
                            >
                              Passord
                            </label>
                            <div className="relative group">
                              <Icon name="lock"
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)] transition-colors group-focus-within:text-[var(--color-primary)]"
                                aria-hidden="true" />
                              <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required={mode === "password"}
                                autoComplete="current-password"
                                className="w-full pl-10 pr-11 py-3 text-sm rounded-xl bg-surface-container-lowest border border-black/10 text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-[border-color,box-shadow]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                  showPassword ? "Skjul passord" : "Vis passord"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer bg-transparent border-none text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                              >
                                {showPassword ? (
                                  <Icon name="visibility"Off className="w-4 h-4" aria-hidden="true" />
                                ) : (
                                  <Icon name="visibility" className="w-4 h-4" aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Error */}
                      <AnimatePresence>
                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs font-medium text-[var(--color-error)] flex items-center gap-1.5"
                            role="alert"
                            aria-live="assertive"
                          >
                            <span className="w-1 h-1 rounded-full bg-[var(--color-error)]" />
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-surface text-sm font-semibold hover:bg-[var(--color-primary-alt)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors group relative overflow-hidden cursor-pointer border-none mt-1"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {loading
                            ? mode === "password"
                              ? "Logger inn..."
                              : "Sender lenke..."
                            : mode === "password"
                              ? "Logg inn"
                              : "Send innloggingslenke"}
                          {!loading && (
                            <Icon name="arrow_forward" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                      </button>
                    </motion.form>

                    {/* Glemt passord */}
                    {mode === "password" && (
                      <div className="mt-5 text-center">
                        <button
                          type="button"
                          onClick={() => setMode("magic")}
                          className="text-[13px] cursor-pointer bg-transparent border-none text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                        >
                          Glemt passord? Bruk magic link
                        </button>
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Footer */}
                <motion.p
                  variants={fadeInUp}
                  className="text-center text-sm mt-8 text-[var(--color-muted)]"
                >
                  Har du ikke tilgang?{" "}
                  <a
                    href="/academy"
                    className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-alt)] transition-colors"
                  >
                    Søk om plass
                  </a>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
