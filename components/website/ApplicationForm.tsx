"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="w-card max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="w-heading-sm mb-2">Melding mottatt!</h3>
            <p className="text-sm text-ink-50">Vi tar kontakt innen 48 timer.</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className={`space-y-5 transition-opacity duration-200 ${status === "submitting" ? "opacity-60 pointer-events-none" : ""}`}>
              <div>
                <label htmlFor="name" className="w-label">Navn *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-input"
                  placeholder="Ditt fulle navn"
                />
              </div>

              <div>
                <label htmlFor="email" className="w-label">E-post *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-input"
                  placeholder="din@epost.no"
                />
              </div>

              <div>
                <label htmlFor="message" className="w-label">Melding</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-input resize-none"
                  placeholder="Fortell oss om dine mål og ambisjoner..."
                />
              </div>
            </div>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-error"
              >
                Noe gikk galt. Prøv igjen eller send e-post til post@akgolf.no.
              </motion.p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-btn w-btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sender...
                </span>
              ) : "Send melding"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
