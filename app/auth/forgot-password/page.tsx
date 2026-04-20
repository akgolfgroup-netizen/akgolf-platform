"use client";

import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/portal/patterns/glass-panel";
import { MonoLabel } from "@/components/portal/patterns/mono-label";
import { NightSurface } from "@/components/portal/patterns/night-surface";
import { sendPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await sendPasswordReset(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassPanel variant="dark" padding="lg" className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="check_circle" size={32} className="text-success" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F5F1] mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-[#F2F5F1]/60 mb-4">
              Hvis e-postadressen finnes i systemet vårt, har vi sendt en
              lenke for å tilbakestille passordet.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-[#F2F5F1]/70 hover:text-[#F2F5F1] text-sm font-medium transition-colors"
            >
              ← Tilbake til innlogging
            </button>
          </GlassPanel>
        </motion.div>
      </NightSurface>
    );
  }

  return (
    <NightSurface variant="ambient" className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <GlassPanel variant="dark" padding="lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary-fixed/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="bolt" size={32} className="text-secondary-fixed" />
            </div>
            <h1 className="text-2xl font-bold text-[#F2F5F1]">Glemt passord</h1>
            <p className="text-[#F2F5F1]/60 mt-1">
              Skriv inn e-postadressen din, så sender vi en reset-lenke.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <MonoLabel
                as="label"
                size="xs"
                uppercase
                className="block text-[#F2F5F1]/60 mb-1.5"
              >
                E-post
              </MonoLabel>
              <div className="relative">
                <Icon name="mail" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                <input
                  name="email"
                  type="email"
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border border-white/[0.10] rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-error-container" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-fixed hover:bg-secondary-fixed/90 text-on-secondary-fixed font-bold py-3 rounded-xl transition-all"
            >
              {loading ? "Sender..." : "Send reset-lenke"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-sm text-[#F2F5F1]/50">
              <a href="/auth/login" className="text-[#F2F5F1] hover:text-secondary-fixed font-medium transition-colors">
                ← Tilbake til innlogging
              </a>
            </p>
          </div>
        </GlassPanel>
      </motion.div>
    </NightSurface>
  );
}
