"use client";

import { Send } from "lucide-react";
import { ContactTopicGrid } from "./contact-topic-grid";

export type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormCardProps {
  topic: string;
  setTopic: (id: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: FormStatus;
  message?: string;
}

export function ContactFormCard({
  topic,
  setTopic,
  onSubmit,
  status,
  message,
}: FormCardProps) {
  return (
    <div
      className="rounded-[28px] border-[1.5px] bg-white px-12 pb-9 pt-11"
      style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
    >
      <h2
        className="mb-2 text-[32px] font-extrabold tracking-[-0.025em]"
        style={{
          color: "var(--akgolf-ink, #0A1F18)",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        Skriv til{" "}
        <em
          className="font-medium not-italic"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontStyle: "italic",
            color: "var(--akgolf-primary, #005840)",
          }}
        >
          oss.
        </em>
      </h2>
      <p
        className="mb-8 text-[14px] leading-[1.55]"
        style={{ color: "var(--akgolf-muted, #5C6B62)" }}
      >
        Velg hva det gjelder, så ruter vi til riktig person. Alle felter merket *
        må fylles ut.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col">
        <Field label="Hva gjelder det? *">
          <ContactTopicGrid selected={topic} onSelect={setTopic} />
        </Field>

        <div className="grid gap-[18px] md:grid-cols-2">
          <Field label="Fornavn *">
            <Input name="firstName" required placeholder="Anders" />
          </Field>
          <Field label="Etternavn *">
            <Input name="lastName" required placeholder="Kristiansen" />
          </Field>
        </div>

        <div className="grid gap-[18px] md:grid-cols-2">
          <Field label="E-post *">
            <Input name="email" type="email" required placeholder="navn@eksempel.no" />
          </Field>
          <Field label="Telefon">
            <Input name="phone" type="tel" placeholder="+47 ..." />
          </Field>
        </div>

        <Field label="Foretrukket lokasjon">
          <select
            name="location"
            className="rounded-[14px] border-[1.5px] px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[var(--akgolf-primary,#005840)] focus:bg-white"
            style={{
              background: "var(--akgolf-surface, #F4F6F4)",
              borderColor: "var(--akgolf-line-light, #E4EAE6)",
              color: "var(--akgolf-ink, #0A1F18)",
            }}
            defaultValue="Gamle Fredrikstad GK"
          >
            <option>Gamle Fredrikstad GK</option>
            <option>Spiller ingen rolle</option>
          </select>
        </Field>

        <Field label="Melding *">
          <textarea
            name="message"
            required
            placeholder="Fortell oss kort hva du vil — så følger vi opp samme dag."
            className="resize-y rounded-[14px] border-[1.5px] px-4 py-3.5 text-[15px] leading-[1.6] outline-none transition-colors focus:border-[var(--akgolf-primary,#005840)] focus:bg-white"
            style={{
              background: "var(--akgolf-surface, #F4F6F4)",
              borderColor: "var(--akgolf-line-light, #E4EAE6)",
              color: "var(--akgolf-ink, #0A1F18)",
              minHeight: "140px",
            }}
          />
        </Field>

        <label
          className="mb-[22px] flex items-start gap-2.5 text-[13px] font-medium leading-[1.55]"
          style={{ color: "var(--akgolf-text, #324D45)" }}
        >
          <input
            type="checkbox"
            name="newsletter"
            className="mt-[3px] h-4 w-4"
            style={{ accentColor: "var(--akgolf-primary, #005840)" }}
          />
          <span>
            Send meg gjerne nyhetsbrev hver måned med tips og tilbud. Du kan
            melde deg av når som helst.
          </span>
        </label>

        <SubmitRow status={status} />

        {status === "success" ? (
          <StatusBox tone="success" message={message ?? ""} />
        ) : null}
        {status === "error" ? (
          <StatusBox tone="error" message={message ?? ""} />
        ) : null}
      </form>
    </div>
  );
}

function SubmitRow({ status }: { status: FormStatus }) {
  return (
    <div
      className="flex flex-col gap-4 border-t pt-7 md:flex-row md:items-center md:justify-between"
      style={{ borderColor: "var(--akgolf-line-light, #E4EAE6)" }}
    >
      <p
        className="m-0 max-w-[50ch] text-[12px] leading-[1.55]"
        style={{ color: "var(--akgolf-muted, #5C6B62)" }}
      >
        Vi behandler personopplysninger i tråd med{" "}
        <a
          href="/personvern"
          className="underline"
          style={{ color: "var(--akgolf-primary, #005840)" }}
        >
          personvernerklæringen
        </a>
        .
      </p>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)] disabled:cursor-not-allowed disabled:opacity-50"
        style={{
          background: "var(--akgolf-accent, #D1F843)",
          color: "#0A1F18",
        }}
      >
        {status === "submitting" ? "Sender..." : "Send melding"}
        <Send className="h-4 w-4" strokeWidth={2.4} />
      </button>
    </div>
  );
}

function StatusBox({
  tone,
  message,
}: {
  tone: "success" | "error";
  message: string;
}) {
  const isSuccess = tone === "success";
  return (
    <div
      className="mt-6 rounded-xl border p-4 text-sm"
      style={{
        borderColor: isSuccess
          ? "rgba(42,125,90,0.30)"
          : "rgba(184,66,51,0.30)",
        background: isSuccess
          ? "rgba(42,125,90,0.06)"
          : "rgba(184,66,51,0.06)",
        color: isSuccess
          ? "var(--akgolf-success, #2A7D5A)"
          : "var(--akgolf-danger, #B84233)",
      }}
    >
      {message}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mb-[22px] flex flex-col gap-2">
      <span
        className="text-[13px] font-semibold"
        style={{ color: "var(--akgolf-ink, #0A1F18)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      className="rounded-[14px] border-[1.5px] px-4 py-3.5 text-[15px] outline-none transition-colors focus:border-[var(--akgolf-primary,#005840)] focus:bg-white"
      style={{
        background: "var(--akgolf-surface, #F4F6F4)",
        borderColor: "var(--akgolf-line-light, #E4EAE6)",
        color: "var(--akgolf-ink, #0A1F18)",
      }}
    />
  );
}
