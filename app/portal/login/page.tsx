"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Brain,
  TrendingUp,
} from "lucide-react";

function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

const EASE: number[] = [0.4, 0, 0.2, 1];
const EASE_OUT: number[] = [0.16, 1, 0.3, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const shakeVariant = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4, ease: EASE },
  },
  rest: { x: 0 },
};

type Mode = "password" | "magic";

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
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ background: "var(--color-surface, #F4F6F4)" }}
    >
      {/* VENSTRE — Hero (skjult pa mobil) */}
      <motion.aside
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: "var(--color-sidebar, #0F1F18)" }}
        aria-hidden="true"
      >
        {/* Hero-bilde */}
        <Image
          src="/images/hero/academy.jpg"
          alt=""
          fill
          priority
          sizes="50vw"
          quality={75}
          className="object-cover opacity-40"
        />

        {/* Gradient-overlay (mork bunn → klar topp) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,31,24,0.55) 0%, rgba(15,31,24,0.75) 60%, rgba(15,31,24,0.95) 100%)",
          }}
        />

        {/* Subtil dot-grid */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Accent-glow */}
        <div
          className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent, #D1F843) 0%, transparent 70%)",
          }}
        />

        {/* Accent-stripe nede */}
        <div
          className="absolute left-0 right-0 bottom-0 h-1"
          style={{ background: "var(--color-accent, #D1F843)" }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Logo + badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
            className="flex items-center justify-between"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl text-[18px] font-extrabold tracking-tight"
              style={{
                background: "var(--color-accent, #D1F843)",
                color: "#0A1F18",
              }}
            >
              AK
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm"
              style={{
                background: "rgba(209,248,67,0.10)",
                border: "1px solid rgba(209,248,67,0.32)",
              }}
            >
              <Sparkles
                className="w-3 h-3"
                style={{ color: "var(--color-accent, #D1F843)" }}
              />
              <span
                className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-accent, #D1F843)" }}
              >
                PlayerHQ
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
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] mb-5"
              style={{ color: "var(--color-accent, #D1F843)" }}
            >
              / Premium golfcoaching
            </motion.p>
            <motion.h1
              variants={fadeInUp}
              className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight mb-5 text-white"
              style={{ fontFamily: "var(--font-inter-tight), Inter, sans-serif" }}
            >
              Spillerutvikling
              <br />
              med <em className="italic font-bold" style={{ color: "var(--color-accent, #D1F843)", fontStyle: "italic" }}>system.</em>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-[15px] leading-relaxed text-white/70 max-w-md"
            >
              Logg inn for å se treningsplanen din, booke økter og følge
              utviklingen din med skreddersydd coaching fra AK Golf.
            </motion.p>

            <motion.ul
              variants={fadeInUp}
              className="mt-9 space-y-3 text-[14px] text-white/80"
            >
              {[
                { icon: Brain, label: "Personlig treningsplan generert av AI" },
                { icon: TrendingUp, label: "Strokes Gained-statistikk i sanntid" },
                { icon: Trophy, label: "Direkte kontakt med din trener" },
              ].map(({ icon: ItemIcon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "rgba(209,248,67,0.12)" }}
                  >
                    <ItemIcon
                      className="w-3.5 h-3.5"
                      style={{ color: "var(--color-accent, #D1F843)" }}
                    />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40"
          >
            © {new Date().getFullYear()} AK Golf Group · Org 925 884 102
          </motion.div>
        </div>
      </motion.aside>

      {/* HOYRE — Form */}
      <section className="flex-1 flex items-center justify-center px-5 py-12 lg:px-12 lg:py-16 relative">
        {/* Subtil bakgrunns-glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 10%, var(--color-primary-soft, #E8F0EC) 0%, transparent 60%)",
          }}
          aria-hidden="true"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[440px] relative z-10"
        >
          {/* Mini-logo — kun mobil */}
          <motion.div
            variants={fadeInUp}
            className="flex lg:hidden justify-center mb-8"
          >
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl text-[18px] font-extrabold tracking-tight"
              style={{
                background: "var(--color-primary, #005840)",
                color: "var(--color-accent, #D1F843)",
              }}
            >
              AK
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
              >
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: "var(--color-card, #FFFFFF)",
                    border: "1px solid var(--color-line, #E4EAE6)",
                    boxShadow:
                      "0 1px 2px rgba(15,31,24,0.04), 0 14px 32px rgba(15,31,24,0.08)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1,
                      ease: EASE_OUT,
                    }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: "var(--color-primary-soft, #E8F0EC)" }}
                  >
                    <Mail
                      className="w-7 h-7"
                      style={{ color: "var(--color-primary, #005840)" }}
                    />
                  </motion.div>
                  <h1
                    className="text-2xl font-bold mb-2 tracking-tight"
                    style={{
                      color: "var(--color-ink, #0A1F18)",
                      fontFamily: "var(--font-inter-tight), Inter, sans-serif",
                    }}
                  >
                    Sjekk e-posten din
                  </h1>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                  >
                    Vi har sendt en innloggingslenke til
                    <br />
                    <strong style={{ color: "var(--color-ink, #0A1F18)" }}>
                      {email}
                    </strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-7 text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-none transition-colors"
                    style={{ color: "var(--color-primary, #005840)" }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Tilbake til innlogging
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
              >
                <motion.div variants={fadeInUp} className="mb-8">
                  <p
                    className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] mb-3"
                    style={{ color: "var(--color-primary, #005840)" }}
                  >
                    / Logg inn
                  </p>
                  <h1
                    className="text-3xl font-bold tracking-tight mb-2"
                    style={{
                      color: "var(--color-ink, #0A1F18)",
                      fontFamily: "var(--font-inter-tight), Inter, sans-serif",
                    }}
                  >
                    Velkommen tilbake
                  </h1>
                  <p
                    className="text-[15px]"
                    style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                  >
                    Logg inn på PlayerHQ for å fortsette.
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <div
                    className="rounded-2xl p-6 sm:p-7"
                    style={{
                      background: "var(--color-card, #FFFFFF)",
                      border: "1px solid var(--color-line, #E4EAE6)",
                      boxShadow:
                        "0 1px 2px rgba(15,31,24,0.04), 0 14px 32px rgba(15,31,24,0.08)",
                    }}
                  >
                    {/* Mode-toggle */}
                    <div
                      className="relative flex p-1 mb-6 rounded-xl"
                      style={{
                        background: "var(--color-surface-soft, #EDF1EE)",
                      }}
                    >
                      {(["password", "magic"] as const).map((m) => {
                        const isActive = mode === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className="relative flex-1 py-2.5 px-3 text-sm font-semibold rounded-lg z-10 cursor-pointer bg-transparent border-none transition-colors"
                          >
                            {isActive && (
                              <motion.span
                                layoutId="login-tab-indicator"
                                className="absolute inset-0 rounded-lg"
                                style={{
                                  background: "var(--color-card, #FFFFFF)",
                                  boxShadow:
                                    "0 1px 2px rgba(15,31,24,0.06), 0 4px 12px rgba(15,31,24,0.06)",
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 32,
                                }}
                              />
                            )}
                            <span
                              className="relative z-10 transition-colors"
                              style={{
                                color: isActive
                                  ? "var(--color-primary, #005840)"
                                  : "var(--color-ink-muted, #5C6B62)",
                              }}
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
                          className="block text-[13px] font-semibold mb-2"
                          style={{ color: "var(--color-ink, #0A1F18)" }}
                        >
                          E-postadresse
                        </label>
                        <div className="relative group">
                          <Mail
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-[var(--color-primary)]"
                            style={{ color: "var(--color-ink-subtle, #8A958E)" }}
                            aria-hidden="true"
                          />
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="navn@eksempel.no"
                            required
                            autoComplete="email"
                            spellCheck={false}
                            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none transition-[border-color,box-shadow]"
                            style={{
                              background: "var(--color-surface-soft, #EDF1EE)",
                              border: "1px solid var(--color-line, #E4EAE6)",
                              color: "var(--color-ink, #0A1F18)",
                            }}
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
                              className="block text-[13px] font-semibold mb-2"
                              style={{ color: "var(--color-ink, #0A1F18)" }}
                            >
                              Passord
                            </label>
                            <div className="relative group">
                              <Lock
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
                                style={{ color: "var(--color-ink-subtle, #8A958E)" }}
                                aria-hidden="true"
                              />
                              <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required={mode === "password"}
                                autoComplete="current-password"
                                className="w-full pl-10 pr-11 py-3 text-sm rounded-xl focus:outline-none transition-[border-color,box-shadow]"
                                style={{
                                  background: "var(--color-surface-soft, #EDF1EE)",
                                  border: "1px solid var(--color-line, #E4EAE6)",
                                  color: "var(--color-ink, #0A1F18)",
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={
                                  showPassword
                                    ? "Skjul passord"
                                    : "Vis passord"
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 cursor-pointer bg-transparent border-none transition-colors"
                                style={{ color: "var(--color-ink-subtle, #8A958E)" }}
                              >
                                {showPassword ? (
                                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                                ) : (
                                  <Eye className="w-4 h-4" aria-hidden="true" />
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
                            className="text-xs font-semibold flex items-center gap-1.5"
                            style={{ color: "var(--color-danger, #B84233)" }}
                            role="alert"
                            aria-live="assertive"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: "var(--color-danger, #B84233)",
                              }}
                            />
                            {error}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl text-sm font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-all group relative overflow-hidden cursor-pointer border-none mt-2"
                        style={{
                          background: "var(--color-primary, #005840)",
                          color: "#FFFFFF",
                        }}
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
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                          )}
                        </span>
                      </button>
                    </motion.form>

                    {/* Glemt passord */}
                    {mode === "password" && (
                      <div className="mt-5 text-center">
                        <button
                          type="button"
                          onClick={() => setMode("magic")}
                          className="text-[13px] cursor-pointer bg-transparent border-none transition-colors font-medium"
                          style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                        >
                          Glemt passord? Bruk magic link
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Footer */}
                <motion.p
                  variants={fadeInUp}
                  className="text-center text-sm mt-8"
                  style={{ color: "var(--color-ink-muted, #5C6B62)" }}
                >
                  Har du ikke tilgang?{" "}
                  <a
                    href="/academy"
                    className="font-bold transition-colors"
                    style={{ color: "var(--color-primary, #005840)" }}
                  >
                    Søk om plass
                  </a>
                </motion.p>

                {/* Tilbake til hovedside */}
                <motion.p
                  variants={fadeInUp}
                  className="text-center text-xs mt-3"
                >
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 transition-colors"
                    style={{ color: "var(--color-ink-subtle, #8A958E)" }}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Til hovedside
                  </Link>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
