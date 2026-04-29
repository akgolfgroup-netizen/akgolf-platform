"use client";

import { useState } from "react";
import { ContactSidebar } from "./contact-sidebar";
import { ContactFormCard, type FormStatus } from "./contact-form-card";
import { TOPICS } from "./contact-topic-grid";

interface FormState {
  status: FormStatus;
  message?: string;
}

export function ContactFormSection() {
  const [topic, setTopic] = useState<string>("medlem");
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: "submitting" });

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: `${data.get("firstName") ?? ""} ${data.get("lastName") ?? ""}`.trim(),
      email: data.get("email") ?? "",
      phone: data.get("phone") ?? "",
      program: data.get("location") ?? "",
      handicap: "",
      message: `Tema: ${
        TOPICS.find((t) => t.id === topic)?.label ?? topic
      }\n\n${data.get("message") ?? ""}`,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState({
          status: "success",
          message: "Takk for meldingen — vi tar kontakt samme dag.",
        });
        form.reset();
        setTopic("medlem");
      } else {
        const json = await res.json().catch(() => ({}));
        setState({
          status: "error",
          message:
            json.error ?? "Noe gikk galt. Prøv igjen eller send oss en e-post.",
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
    <section id="kontakt-skjema" className="px-10 pb-[90px] pt-[60px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid grid-cols-1 items-start gap-[60px] lg:grid-cols-[1.5fr_1fr]">
          <ContactFormCard
            topic={topic}
            setTopic={setTopic}
            onSubmit={handleSubmit}
            status={state.status}
            message={state.message}
          />
          <ContactSidebar />
        </div>
      </div>
    </section>
  );
}
