"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { WebNav } from "./web-nav";
import { WebFooter } from "./web-footer";
import { TEAM, FORMSPREE_ENDPOINT } from "@/lib/website-constants";

interface FormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export function ContactPageClient() {
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setState({
        status: "error",
        message: "Kontaktskjema er ikke konfigurert. Send oss en e-post i stedet.",
      });
      return;
    }
    setState({ status: "submitting" });

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setState({
          status: "success",
          message: "Takk! Vi tar kontakt så snart vi kan.",
        });
        form.reset();
      } else {
        setState({
          status: "error",
          message: "Noe gikk galt. Prøv igjen eller send oss en e-post.",
        });
      }
    } catch {
      setState({
        status: "error",
        message: "Noe gikk galt. Prøv igjen eller send oss en e-post.",
      });
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--akgolf-surface, #ECF0EF)",
        color: "var(--akgolf-text, #324D45)",
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      <WebNav />

      {/* HERO */}
      <section
        className="px-10 pb-12 pt-[140px] text-center"
        style={{ background: "var(--akgolf-surface, #ECF0EF)" }}
      >
        <div className="mx-auto max-w-[960px]">
          <div
            className="mb-3.5 inline-block text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-jetbrains-mono), monospace",
              color: "var(--akgolf-primary, #005840)",
            }}
          >
            KONTAKT OSS
          </div>
          <h1
            className="mx-auto mb-5 max-w-[18ch] text-[clamp(48px,6.5vw,84px)] font-extrabold leading-[0.98] tracking-[-0.038em] text-[var(--akgolf-ink,#0A1F18)] text-balance"
            style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
          >
            La oss{" "}
            <em
              className="font-medium not-italic"
              style={{
                fontFamily: "var(--font-fraunces), Georgia, serif",
                fontStyle: "italic",
                color: "var(--akgolf-primary, #005840)",
              }}
            >
              snakkes
            </em>
            .
          </h1>
          <p className="mx-auto max-w-[56ch] text-[19px] leading-[1.55] text-[var(--akgolf-text,#324D45)]">
            Send oss en melding eller ring direkte. Vi svarer normalt innen
            24 timer på hverdager.
          </p>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="px-10 py-[80px]">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.5fr_1fr]">
          {/* FORM */}
          <div
            className="rounded-[24px] border bg-white p-10"
            style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
          >
            <h2
              className="mb-2 text-[28px] font-extrabold tracking-[-0.025em] text-[var(--akgolf-ink,#0A1F18)]"
              style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
            >
              Send oss en melding
            </h2>
            <p className="mb-8 text-[14px] text-[var(--akgolf-text,#324D45)]">
              Fortell hva du tenker, så finner vi rett vei sammen.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Navn" name="name" required />
                <Field label="E-post" name="email" type="email" required />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Telefon (valgfritt)" name="phone" type="tel" />
                <Field label="Handicap (valgfritt)" name="handicap" />
              </div>
              <FieldArea label="Meldingen din" name="message" required />

              <div className="flex items-center justify-between gap-4 pt-3">
                <p className="text-[12px] text-[var(--akgolf-muted,#A5B2AD)]">
                  Vi behandler dine opplysninger iht.{" "}
                  <a
                    href="/personvern"
                    className="underline hover:text-[var(--akgolf-primary,#005840)]"
                  >
                    personvernerklæringen
                  </a>
                  .
                </p>
                <button
                  type="submit"
                  disabled={state.status === "submitting"}
                  className="inline-flex items-center gap-2.5 rounded-full bg-[var(--akgolf-ink,#0A1F18)] px-6 py-3.5 text-[14px] font-bold text-white transition-all hover:-translate-y-px hover:bg-[#112e22] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {state.status === "submitting" ? "Sender..." : "Send melding"}
                  <Send className="h-4 w-4" strokeWidth={2.4} />
                </button>
              </div>

              {state.status === "success" ? (
                <div className="rounded-xl border border-[var(--akgolf-success,#2A7D5A)]/30 bg-[var(--akgolf-success,#2A7D5A)]/5 p-4 text-sm text-[var(--akgolf-success,#2A7D5A)]">
                  {state.message}
                </div>
              ) : null}
              {state.status === "error" ? (
                <div className="rounded-xl border border-[var(--akgolf-danger,#B84233)]/30 bg-[var(--akgolf-danger,#B84233)]/5 p-4 text-sm text-[var(--akgolf-danger,#B84233)]">
                  {state.message}
                </div>
              ) : null}
            </form>
          </div>

          {/* INFO */}
          <aside className="flex flex-col gap-6">
            {TEAM.map((coach) => (
              <div
                key={coach.name}
                className="rounded-[20px] border bg-white p-6"
                style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    color: "var(--akgolf-primary, #005840)",
                  }}
                >
                  {coach.role}
                </div>
                <div
                  className="mt-1 text-[18px] font-bold text-[var(--akgolf-ink,#0A1F18)]"
                  style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
                >
                  {coach.name}
                </div>
                <div className="mt-4 flex flex-col gap-2 text-[14px] text-[var(--akgolf-text,#324D45)]">
                  <a
                    href={`mailto:${coach.contact.email}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[var(--akgolf-primary,#005840)]"
                  >
                    <Mail className="h-4 w-4" />
                    {coach.contact.email}
                  </a>
                  <a
                    href={`tel:${coach.contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 transition-colors hover:text-[var(--akgolf-primary,#005840)]"
                  >
                    <Phone className="h-4 w-4" />
                    {coach.contact.phone}
                  </a>
                </div>
              </div>
            ))}

            <div
              className="rounded-[20px] border bg-white p-6"
              style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
            >
              <div
                className="text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  color: "var(--akgolf-primary, #005840)",
                }}
              >
                BESØK OSS
              </div>
              <div
                className="mt-1 text-[18px] font-bold text-[var(--akgolf-ink,#0A1F18)]"
                style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
              >
                AK Golf Studio
              </div>
              <div className="mt-3 flex items-start gap-2 text-[14px] text-[var(--akgolf-text,#324D45)]">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  Gamle Fredrikstad Golfklubb
                  <br />
                  Bossum
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <WebFooter />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[var(--akgolf-ink,#0A1F18)]">
        {label}
        {required ? <span className="text-[var(--akgolf-danger,#B84233)]"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        className="rounded-[10px] border bg-[var(--akgolf-surface,#ECF0EF)] px-4 py-3 text-[14px] text-[var(--akgolf-ink,#0A1F18)] outline-none transition-colors focus:border-[var(--akgolf-primary,#005840)]"
        style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
      />
    </label>
  );
}

function FieldArea({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-semibold text-[var(--akgolf-ink,#0A1F18)]">
        {label}
        {required ? <span className="text-[var(--akgolf-danger,#B84233)]"> *</span> : null}
      </span>
      <textarea
        name={name}
        required={required}
        rows={5}
        className="resize-y rounded-[10px] border bg-[var(--akgolf-surface,#ECF0EF)] px-4 py-3 text-[14px] text-[var(--akgolf-ink,#0A1F18)] outline-none transition-colors focus:border-[var(--akgolf-primary,#005840)]"
        style={{ borderColor: "var(--akgolf-line-light, #e0e8e5)" }}
      />
    </label>
  );
}
