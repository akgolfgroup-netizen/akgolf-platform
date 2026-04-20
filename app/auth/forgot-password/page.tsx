"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-surface-container-lowest border-black/10 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="check"Circle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface mb-2">
              Sjekk e-posten din
            </h1>
            <p className="text-on-surface-variant mb-4">
              Hvis e-postadressen finnes i systemet vårt, har vi sendt en
              lenke for å tilbakestille passordet.
            </p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-on-surface hover:underline text-sm font-medium"
            >
              ← Tilbake til innlogging
            </button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-surface-container-lowest border-black/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-on-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="bolt" className="w-8 h-8 text-secondary-fixed" />
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Glemt passord</h1>
            <p className="text-on-surface-variant">
              Skriv inn e-postadressen din, så sender vi en reset-lenke.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-1">
                E-post
              </label>
              <div className="relative">
                <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  name="email"
                  type="email"
                  placeholder="navn@eksempel.no"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-black/10 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-accent-cta"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-on-surface hover:bg-on-surface/90 text-surface font-bold py-3 rounded-xl"
            >
              {loading ? "Sender..." : "Send reset-lenke"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-black/10 text-center">
            <p className="text-sm text-on-surface-variant">
              <a href="/auth/login" className="text-on-surface hover:underline font-medium">
                ← Tilbake til innlogging
              </a>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
