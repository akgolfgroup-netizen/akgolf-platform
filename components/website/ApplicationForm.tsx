"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ApplicationForm({ defaultProgram }: { defaultProgram?: string } = {}) {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      handicap: formData.get("handicap") as string,
      program: formData.get("program") as string,
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
    <div className="w-card max-w-xl mx-auto">
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
            <p className="text-sm text-ink-50">Vi tar kontakt innen 48 timer for å avtale et uforpliktende møte.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="w-label flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Navn *
                </label>
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
                <label htmlFor="email" className="w-label flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  E-post *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-input"
                  placeholder="din@epost.no"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="w-label flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Telefon
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-input"
                  placeholder="+47"
                />
              </div>
              <div>
                <label htmlFor="handicap" className="w-label flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  Nåværende handicap
                </label>
                <input
                  type="text"
                  id="handicap"
                  name="handicap"
                  className="w-input"
                  placeholder="F.eks. 18"
                />
              </div>
            </div>

            <div>
              <label htmlFor="program" className="w-label flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                Program
              </label>
              <select id="program" name="program" className="w-select" defaultValue={defaultProgram ?? ""}>
                <option value="">Velg program</option>
                <optgroup label="Academy">
                  <option value="academy-grunn">Grunnpakke</option>
                  <option value="academy-utvikling">Utviklingspakke</option>
                  <option value="academy-elite">Elite</option>
                </optgroup>
                <optgroup label="Junior Academy">
                  <option value="junior-13-15">Junior 13–15 år</option>
                  <option value="junior-16-17">Junior 16–17 år</option>
                  <option value="junior-18-19">Junior 18–19 år</option>
                </optgroup>
                <optgroup label="Utvikling">
                  <option value="klubb">Klubbtrening & Rådgiving</option>
                  <option value="software">Software & Verktøy</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="w-label flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Melding
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                className="w-input resize-none"
                placeholder="Fortell oss om dine mål og ambisjoner..."
              />
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
