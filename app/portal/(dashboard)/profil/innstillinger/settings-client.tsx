"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { updateProfile } from "../actions";
import { AvatarUpload } from "@/components/portal/profil/avatar-upload";
import { MonoLabel } from "@/components/portal/patterns";
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
        className="inline-flex items-center gap-1.5 text-sm font-medium text-on-surface-variant transition-colors hover:text-on-surface"
      >
        <Icon name="arrow_back" className="h-4 w-4" />
        Tilbake til profil
      </Link>

      <h1 className="text-xl font-bold text-on-surface">
        Kontoinnstillinger
      </h1>

      {/* Profilbilde */}
      <PremiumCard delay={0}>
        <MonoLabel size="xs" uppercase className="mb-4 block text-on-surface-variant">
          Profilbilde
        </MonoLabel>
        <div className="flex items-center gap-4">
          <AvatarUpload currentImage={profile.image} name={profile.name} />
          <p className="text-xs text-on-surface-variant">
            Klikk eller dra et bilde for a endre profilbildet ditt.
            Maks 5 MB. JPG, PNG eller WebP.
          </p>
        </div>
      </PremiumCard>

      {/* Redigeringsskjema */}
      <PremiumCard delay={0.1}>
        <MonoLabel size="xs" uppercase className="mb-4 block text-on-surface-variant">
          Personlig informasjon
        </MonoLabel>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Navn */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant/80"
            >
              Navn
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-black placeholder:text-on-surface-variant"
              placeholder="Fullt navn"
            />
          </div>

          {/* E-post (skrivebeskyttet) */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant/80"
            >
              E-post
            </label>
            <input
              id="email"
              type="email"
              value={profile.email}
              readOnly
              className="w-full rounded-xl border border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface-variant outline-none cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-on-surface-variant">
              E-postadressen kan ikke endres.
            </p>
          </div>

          {/* Telefon */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant/80"
            >
              Telefon
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-colors focus:border-black placeholder:text-on-surface-variant"
              placeholder="Telefonnummer"
            />
          </div>

          {/* Melding */}
          {message && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "bg-success-light text-success"
                  : "bg-error-light text-error"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Lagre-knapp */}
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="w-full rounded-full bg-secondary-fixed px-6 py-3 text-sm font-semibold text-on-surface transition-all duration-300 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Lagrer ..." : "Lagre endringer"}
          </button>
        </form>
      </PremiumCard>
    </div>
  );
}
