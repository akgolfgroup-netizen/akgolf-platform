"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { FORMSPREE_ENDPOINT } from "@/lib/website-constants";

type Status = "idle" | "submitting" | "success" | "error";

export function NewsletterSignup() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!FORMSPREE_ENDPOINT) {
      setStatus("error");
      return;
    }
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: data,
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

  if (status === "success") {
    return (
      <p className="text-sm text-success font-medium">
        Takk for påmeldingen! Du hører fra oss snart.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        spellCheck={false}
        placeholder="din@epost.no…"
        className="w-input flex-1 bg-white border-grey-200 text-black placeholder:text-grey-400 focus:border-black"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-btn w-btn-primary whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sender...
          </span>
        ) : "Meld meg på"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500 sm:absolute sm:mt-12" role="alert" aria-live="assertive">
          Noe gikk galt. Prøv igjen.
        </p>
      )}
    </form>
  );
}
