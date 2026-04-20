"use client";

import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/portal/patterns/glass-panel";
import { MonoLabel } from "@/components/portal/patterns/mono-label";
import { NightSurface } from "@/components/portal/patterns/night-surface";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldError(null);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
      if (result.field) setFieldError(result.field);
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
              Vi har sendt en bekreftelseslenke til din e-postadresse.
              Klikk lenken for å aktivere kontoen din.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-[#F2F5F1]/70 hover:text-[#F2F5F1] text-sm font-medium transition-colors"
            >
              Gå til innlogging →
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
            <h1 className="text-2xl font-bold text-[#F2F5F1]">Opprett konto</h1>
            <p className="text-[#F2F5F1]/60 mt-1">Bli med i AK Golf Academy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <MonoLabel
                as="label"
                size="xs"
                uppercase
                className="block text-[#F2F5F1]/60 mb-1.5"
              >
                Navn
              </MonoLabel>
              <div className="relative">
                <Icon name="person" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                <input
                  name="name"
                  type="text"
                  placeholder="Ditt navn"
                  required
                  minLength={2}
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all ${
                    fieldError === "name" ? "border-error" : "border-white/[0.10]"
                  }`}
                />
              </div>
            </div>

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
                  className={`w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all ${
                    fieldError === "email" ? "border-error" : "border-white/[0.10]"
                  }`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <MonoLabel
                as="label"
                size="xs"
                uppercase
                className="block text-[#F2F5F1]/60 mb-1.5"
              >
                Telefon <span className="text-[#F2F5F1]/40 font-normal normal-case">(valgfritt)</span>
              </MonoLabel>
              <div className="relative">
                <Icon name="smartphone" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+47 000 00 000"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border border-white/[0.10] rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <MonoLabel
                as="label"
                size="xs"
                uppercase
                className="block text-[#F2F5F1]/60 mb-1.5"
              >
                Passord
              </MonoLabel>
              <div className="relative">
                <Icon name="lock" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F2F5F1]/40" />
                <input
                  name="password"
                  type="password"
                  placeholder="Minst 8 tegn"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-3 bg-[#F2F5F1]/5 border rounded-xl text-[#F2F5F1] placeholder:text-[#F2F5F1]/30 focus:outline-none focus:ring-2 focus:ring-secondary-fixed/40 transition-all ${
                    fieldError === "password" ? "border-error" : "border-white/[0.10]"
                  }`}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                required
                className={`mt-1 h-4 w-4 rounded border bg-transparent text-secondary-fixed focus:ring-secondary-fixed/40 ${
                  fieldError === "acceptTerms" ? "border-error" : "border-white/[0.20]"
                }`}
              />
              <label htmlFor="acceptTerms" className="text-sm text-[#F2F5F1]/60 leading-relaxed">
                Jeg aksepterer{" "}
                <a href="/vilkår" className="text-[#F2F5F1] hover:text-secondary-fixed font-medium transition-colors">
                  vilkårene
                </a>{" "}
                og{" "}
                <a href="/personvern" className="text-[#F2F5F1] hover:text-secondary-fixed font-medium transition-colors">
                  personvernerklæringen
                </a>
                .
              </label>
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
              {loading ? "Oppretter konto..." : "Opprett konto"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-white/[0.08] text-center">
            <p className="text-sm text-[#F2F5F1]/50">
              Har du allerede konto?{" "}
              <a href="/auth/login" className="text-[#F2F5F1] hover:text-secondary-fixed font-medium transition-colors">
                Logg inn
              </a>
            </p>
          </div>
        </GlassPanel>
      </motion.div>
    </NightSurface>
  );
}
