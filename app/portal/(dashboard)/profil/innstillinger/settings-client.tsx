"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { updateProfile } from "../actions";
import { AvatarUpload } from "@/components/portal/profil/avatar-upload";
import Link from "next/link";

interface SettingsClientProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    image: string | null;
  };
}

export function SettingsClient({ profile }: SettingsClientProps) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await updateProfile({ name, phone });
      setMessage({ type: "success", text: "Profilen er oppdatert." });
      router.refresh();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Noe gikk galt.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  const hasChanges = name !== profile.name || phone !== profile.phone;

  return (
    <div className="mx-auto w-full max-w-[680px] space-y-6 pb-12">
      {/* Tilbake-lenke */}
      <Link
        href="/portal/profil"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-portal-secondary)] transition-colors hover:text-[var(--color-portal-text)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til profil
      </Link>

      <h1 className="text-xl font-bold text-[var(--color-portal-text)]">
        Kontoinnstillinger
      </h1>

      {/* Profilbilde */}
      <PremiumCard delay={0}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)] mb-4">
          Profilbilde
        </p>
        <div className="flex items-center gap-4">
          <AvatarUpload currentImage={profile.image} name={profile.name} />
          <p className="text-xs text-[var(--color-portal-secondary)]">
            Klikk eller dra et bilde for a endre profilbildet ditt.
            Maks 5 MB. JPG, PNG eller WebP.
          </p>
        </div>
      </PremiumCard>

      {/* Redigeringsskjema */}
      <PremiumCard delay={0.1}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)] mb-4">
          Personlig informasjon
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Navn */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-[var(--color-portal-text)]"
            >
              Navn
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-portal-border)] bg-[var(--color-portal-card)] px-4 py-3 text-sm text-[var(--color-portal-text)] outline-none transition-colors focus:border-primary placeholder:text-[var(--color-portal-muted)]"
              placeholder="Fullt navn"
            />
          </div>

          {/* E-post (skrivebeskyttet) */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-[var(--color-portal-text)]"
            >
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="w-full rounded-xl border border-[var(--color-portal-border)] bg-[var(--color-portal-hover)] px-4 py-3 text-sm text-[var(--color-portal-muted)] outline-none cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-[var(--color-portal-muted)]">
              E-postadressen kan ikke endres.
            </p>
          </div>

          {/* Telefon */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-[var(--color-portal-text)]"
            >
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-portal-border)] bg-[var(--color-portal-card)] px-4 py-3 text-sm text-[var(--color-portal-text)] outline-none transition-colors focus:border-primary placeholder:text-[var(--color-portal-muted)]"
              placeholder="Telefonnummer"
            />
          </div>

          {/* Melding */}
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-[var(--color-success-light)] text-[var(--color-success-text)]"
                  : "bg-[var(--color-error-light)] text-[var(--color-error-text)]"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Lagre-knapp */}
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="w-full rounded-[20px] bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary-alt disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Lagrer ..." : "Lagre endringer"}
          </button>
        </form>
      </PremiumCard>
    </div>
  );
}
