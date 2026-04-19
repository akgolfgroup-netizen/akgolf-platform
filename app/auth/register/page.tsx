"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="min-h-screen bg-grey-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white border-black/10 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="check"Circle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-grey-400 mb-4">
              Vi har sendt en bekreftelseslenke til din e-postadresse.
              Klikk lenken for å aktivere kontoen din.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-black hover:underline text-sm font-medium"
            >
              Gå til innlogging →
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white border-black/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="bolt" className="w-8 h-8 text-accent-cta" />
            </div>
            <h1 className="text-2xl font-bold text-black">Opprett konto</h1>
            <p className="text-grey-400">Bli med i AK Golf Academy</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Navn
              </label>
              <div className="relative">
                <Icon name="person" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Ditt navn"
                  required
                  minLength={2}
                  autoComplete="name"
                  className={`w-full pl-10 pr-4 py-3 bg-grey-50 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta ${
                    fieldError === "name" ? "border-red-500" : "border-black/10"
                  }`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                E-post
              </label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 bg-grey-50 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta ${
                    fieldError === "email" ? "border-red-500" : "border-black/10"
                  }`}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Telefon <span className="text-grey-400 font-normal">(valgfritt)</span>
              </label>
              <div className="relative">
                <Icon name="smartphone" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="+47 000 00 000"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 bg-grey-50 border border-black/10 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Passord
              </label>
              <div className="relative">
                <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey-400" />
                <input
                  name="password"
                  type="password"
                  placeholder="Minst 8 tegn"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-4 py-3 bg-grey-50 border rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-accent-cta ${
                    fieldError === "password" ? "border-red-500" : "border-black/10"
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
                className={`mt-1 h-4 w-4 rounded border-grey-300 text-primary focus:ring-accent-cta ${
                  fieldError === "acceptTerms" ? "border-red-500" : ""
                }`}
              />
              <label htmlFor="acceptTerms" className="text-sm text-grey-500 leading-relaxed">
                Jeg aksepterer{" "}
                <a href="/vilkår" className="text-black hover:underline font-medium">
                  vilkårene
                </a>{" "}
                og{" "}
                <a href="/personvern" className="text-black hover:underline font-medium">
                  personvernerklæringen
                </a>
                .
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white font-bold py-3 rounded-xl"
            >
              {loading ? "Oppretter konto..." : "Opprett konto"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-black/10 text-center">
            <p className="text-sm text-grey-400">
              Har du allerede konto?{" "}
              <a href="/auth/login" className="text-black hover:underline font-medium">
                Logg inn
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
