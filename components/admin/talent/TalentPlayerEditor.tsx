"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { X, Save, Loader2 } from "lucide-react";
import {
  updateTalentPlayer,
  type TalentPlayerDetail,
  type TalentPlayerUpdate,
} from "@/app/admin/(authed)/talent/actions";

const REGIONS = ["OST", "VEST", "MIDT", "NORD", "SOR"] as const;
const GENDERS = ["MALE", "FEMALE"] as const;
const BY_SOURCES = ["SCRAPED", "ESTIMATED", "MANUAL"] as const;

export function TalentPlayerEditor({
  player,
  onClose,
  onSaved,
}: {
  player: TalentPlayerDetail;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TalentPlayerUpdate>({
    firstName: player.firstName,
    lastName: player.lastName,
    club: player.club,
    birthYear: player.birthYear,
    birthYearSource: player.birthYearSource,
    gender: player.gender,
    region: player.region,
    ngfId: player.ngfId,
    wagrId: player.wagrId,
    collegeId: player.collegeId,
    coach: player.coach,
    photoUrl: player.photoUrl,
    notes: player.notes,
  });

  function update<K extends keyof TalentPlayerUpdate>(key: K, value: TalentPlayerUpdate[K]) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      try {
        await updateTalentPlayer(player.id, form);
        onSaved();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Kunne ikke lagre");
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl shadow-2xl">
        <header className="flex items-center justify-between border-b border-line p-6">
          <div>
            <h2 className="text-xl font-semibold text-ink">
              {player.firstName} {player.lastName}
            </h2>
            <p className="text-sm text-ink-muted">
              {player.resultCount} resultater · NGF: {player.ngfId ?? "—"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ink-muted hover:bg-surface-soft"
            aria-label="Lukk"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-6 p-6">
          {error && (
            <div className="rounded-lg bg-danger-soft p-3 text-sm text-danger">{error}</div>
          )}

          <Section title="Identitet">
            <Field label="Fornavn">
              <input
                className={inputCls}
                value={form.firstName ?? ""}
                onChange={(e) => update("firstName", e.target.value)}
              />
            </Field>
            <Field label="Etternavn">
              <input
                className={inputCls}
                value={form.lastName ?? ""}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </Field>
            <Field label="Klubb">
              <input
                className={inputCls}
                value={form.club ?? ""}
                onChange={(e) => update("club", e.target.value || null)}
              />
            </Field>
            <Field label="Region">
              <select
                className={inputCls}
                value={form.region ?? ""}
                onChange={(e) =>
                  update("region", (e.target.value || null) as TalentPlayerUpdate["region"])
                }
              >
                <option value="">— Ikke satt —</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Demografi">
            <Field label="Kjønn">
              <select
                className={inputCls}
                value={form.gender ?? ""}
                onChange={(e) =>
                  update("gender", (e.target.value || null) as TalentPlayerUpdate["gender"])
                }
              >
                <option value="">— Ikke satt —</option>
                {GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g === "MALE" ? "Mann" : "Kvinne"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fødselsår">
              <input
                type="number"
                className={inputCls}
                value={form.birthYear ?? ""}
                onChange={(e) =>
                  update("birthYear", e.target.value ? parseInt(e.target.value, 10) : null)
                }
              />
            </Field>
            <Field label="Kilde for fødselsår">
              <select
                className={inputCls}
                value={form.birthYearSource}
                onChange={(e) =>
                  update("birthYearSource", e.target.value as TalentPlayerUpdate["birthYearSource"])
                }
              >
                {BY_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s === "MANUAL" ? "Manuell" : s === "ESTIMATED" ? "Estimert" : "Hentet"}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Eksterne ID-er">
            <Field label="NGF-ID">
              <input
                className={inputCls}
                value={form.ngfId ?? ""}
                onChange={(e) => update("ngfId", e.target.value || null)}
              />
            </Field>
            <Field label="WAGR-ID">
              <input
                type="number"
                className={inputCls}
                value={form.wagrId ?? ""}
                onChange={(e) =>
                  update("wagrId", e.target.value ? parseInt(e.target.value, 10) : null)
                }
              />
            </Field>
            <Field label="College / universitet">
              <input
                className={inputCls}
                value={form.collegeId ?? ""}
                onChange={(e) => update("collegeId", e.target.value || null)}
              />
            </Field>
          </Section>

          <Section title="Coaching">
            <Field label="Coach">
              <input
                className={inputCls}
                value={form.coach ?? ""}
                onChange={(e) => update("coach", e.target.value || null)}
              />
            </Field>
            <Field label="Foto-URL">
              <input
                className={inputCls}
                value={form.photoUrl ?? ""}
                onChange={(e) => update("photoUrl", e.target.value || null)}
                placeholder="https://..."
              />
            </Field>
            <Field label="Notater (kun intern)" full>
              <textarea
                className={inputCls + " min-h-[100px]"}
                value={form.notes ?? ""}
                onChange={(e) => update("notes", e.target.value || null)}
              />
            </Field>
          </Section>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-line p-6">
          <Button variant="ghost" onClick={onClose} disabled={pending}>
            Avbryt
          </Button>
          <Button onClick={handleSave} disabled={pending}>
            {pending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Lagre
          </Button>
        </footer>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-ink-muted">{title}</h3>
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 ${full ? "col-span-2" : ""}`}>
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      {children}
    </label>
  );
}
