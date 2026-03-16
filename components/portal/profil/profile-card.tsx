"use client";

import { useState } from "react";
import { updateProfile } from "@/app/portal/(dashboard)/profil/actions";
import { AvatarUpload } from "./avatar-upload";
import { Mail, Phone, Shield } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface ProfileUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  role: string;
  instructorProfile?: {
    specialization?: string | null;
    title?: string | null;
    bio?: string | null;
  } | null;
}

const roleLabelMap: Record<string, string> = {
  ADMIN: "Administrator",
  INSTRUCTOR: "Instruktør",
  STUDENT: "Spiller",
};

export function ProfileCard({ user }: { user: ProfileUser }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateProfile({ name, phone });
    setSaving(false);
    setEditing(false);
  }

  return (
    <div className="bg-[var(--color-muted)] border border-[var(--color-border)] rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Avatar */}
        <AvatarUpload currentImage={user.image} name={user.name} />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-4">
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-bold bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-[var(--color-snow)] outline-none focus:border-[var(--color-gold)] w-full max-w-xs"
              />
            ) : (
              <h2 className="text-xl font-bold text-[var(--color-snow)]">
                {user.name ?? "—"}
              </h2>
            )}
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20 whitespace-nowrap">
              {roleLabelMap[user.role] ?? user.role}
            </span>
          </div>

          {user.instructorProfile?.title && (
            <p className="text-sm text-[var(--color-gold-muted)] mb-3">
              {user.instructorProfile.title}
              {user.instructorProfile.specialization && (
                <span className="ml-2 text-[var(--color-gold-muted)]/70">
                  · {user.instructorProfile.specialization}
                </span>
              )}
            </p>
          )}

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-sm text-[var(--color-gold-muted)]">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span>{user.email ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--color-gold-muted)]">
              <Phone className="w-4 h-4 flex-shrink-0" />
              {editing ? (
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+47 xxx xx xxx"
                  className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1 text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
                />
              ) : (
                <span>{user.phone ?? "Ikke registrert"}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-[var(--color-gold)] text-[var(--color-bg-deep)] text-sm font-medium hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
                >
                  {saving ? "Lagrer..." : "Lagre"}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-snow)] text-sm hover:bg-[var(--color-border)] transition-colors"
                >
                  Avbryt
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-snow)] text-sm hover:bg-[var(--color-border)] transition-colors"
              >
                Rediger profil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
