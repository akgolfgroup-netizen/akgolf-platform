"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import {
  createTemplate,
  updateTemplate,
  toggleTemplateActive,
  deleteTemplate,
} from "./actions";

interface TemplateRow {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  periodType: string;
  weekPattern: Array<{
    dayOfWeek: number;
    title: string;
    durationMinutes: number;
    focusArea: string;
    description?: string;
  }>;
  weeklyFocusTemplate: string;
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
  sessionCount: number;
}

type DraftSession = TemplateRow["weekPattern"][number];

interface DraftTemplate {
  title: string;
  description: string;
  iconName: string;
  badge: string;
  periodType: "PREPARATION" | "COMPETITION" | "RECOVERY" | "OFF_SEASON";
  weeklyFocusTemplate: string;
  weekPattern: DraftSession[];
  isPublic: boolean;
  isActive: boolean;
  sortOrder: number;
}

function emptyDraft(): DraftTemplate {
  return {
    title: "",
    description: "",
    iconName: "fitness_center",
    badge: "",
    periodType: "PREPARATION",
    weeklyFocusTemplate: "",
    weekPattern: [
      {
        dayOfWeek: 1,
        title: "Ny økt",
        durationMinutes: 60,
        focusArea: "JERN",
      },
    ],
    isPublic: true,
    isActive: true,
    sortOrder: 0,
  };
}

const DAY_NAMES = ["", "Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function TemplatesClient({
  initialTemplates,
}: {
  initialTemplates: TemplateRow[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<DraftTemplate>(emptyDraft());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const startNew = () => {
    setDraft(emptyDraft());
    setEditingId("new");
    setError(null);
  };

  const startEdit = (t: TemplateRow) => {
    setDraft({
      title: t.title,
      description: t.description,
      iconName: t.iconName,
      badge: t.badge ?? "",
      periodType: t.periodType as DraftTemplate["periodType"],
      weeklyFocusTemplate: t.weeklyFocusTemplate,
      weekPattern: t.weekPattern,
      isPublic: t.isPublic,
      isActive: t.isActive,
      sortOrder: t.sortOrder,
    });
    setEditingId(t.id);
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setError(null);
  };

  const save = () => {
    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          ...draft,
          badge: draft.badge.trim() || undefined,
        };
        if (editingId === "new") {
          await createTemplate(payload);
        } else if (editingId) {
          await updateTemplate(editingId, payload);
        }
        setEditingId(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lagring feilet");
      }
    });
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      try {
        await toggleTemplateActive(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Toggle feilet");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Slett mal permanent?")) return;
    startTransition(async () => {
      try {
        await deleteTemplate(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sletting feilet");
      }
    });
  };

  const updateSession = (idx: number, patch: Partial<DraftSession>) => {
    setDraft((d) => ({
      ...d,
      weekPattern: d.weekPattern.map((s, i) =>
        i === idx ? { ...s, ...patch } : s
      ),
    }));
  };

  const addSession = () => {
    setDraft((d) => ({
      ...d,
      weekPattern: [
        ...d.weekPattern,
        {
          dayOfWeek: 1,
          title: "Ny økt",
          durationMinutes: 60,
          focusArea: "JERN",
        },
      ],
    }));
  };

  const removeSession = (idx: number) => {
    setDraft((d) => ({
      ...d,
      weekPattern: d.weekPattern.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Treningsplan-maler</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Administrer maler som spillerne kan velge fra wizardene.
          </p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-primary hover:bg-primary-container"
        >
          <Icon name="add" size={14} />
          Ny mal
        </button>
      </header>

      {error && (
        <div className="rounded-lg bg-error-container px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container/50">
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Tittel
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Periode
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Økter
              </th>
              <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Status
              </th>
              <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                Handlinger
              </th>
            </tr>
          </thead>
          <tbody>
            {initialTemplates.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-on-surface-variant"
                >
                  Ingen maler ennå. Klikk «Ny mal» for å opprette den første.
                </td>
              </tr>
            )}
            {initialTemplates.map((t) => (
              <tr
                key={t.id}
                className="border-b border-outline-variant/20 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-on-surface">{t.title}</div>
                  {t.badge && (
                    <span className="mt-1 inline-block rounded-full bg-secondary-fixed px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-primary">
                      {t.badge}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{t.periodType}</td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {t.sessionCount} økter/uke
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono text-[10px] uppercase tracking-widest ${
                      t.isActive ? "text-success" : "text-on-surface-variant"
                    }`}
                  >
                    {t.isActive ? "AKTIV" : "INAKTIV"}
                  </span>
                  {!t.isPublic && (
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-warning">
                      PRIVAT
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => startEdit(t)}
                      className="rounded-md border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => handleToggle(t.id)}
                      disabled={isPending}
                      className="rounded-md border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface disabled:opacity-50"
                    >
                      {t.isActive ? "Deaktiver" : "Aktiver"}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={isPending}
                      className="rounded-md border border-error px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-error hover:bg-error-container disabled:opacity-50"
                    >
                      Slett
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) cancel();
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">
                {editingId === "new" ? "Ny mal" : "Rediger mal"}
              </h2>
              <button
                onClick={cancel}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container"
              >
                <Icon name="close" size={18} className="text-on-surface-variant" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Tittel
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Beskrivelse
                </label>
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Ikon (Material Symbol)
                  </label>
                  <input
                    type="text"
                    value={draft.iconName}
                    onChange={(e) =>
                      setDraft({ ...draft, iconName: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Badge (valgfri)
                  </label>
                  <input
                    type="text"
                    value={draft.badge}
                    onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
                    placeholder="POPULÆR / ANBEFALT FOR NYE"
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Periode
                  </label>
                  <select
                    value={draft.periodType}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        periodType: e.target.value as DraftTemplate["periodType"],
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                  >
                    <option value="PREPARATION">PREPARATION</option>
                    <option value="COMPETITION">COMPETITION</option>
                    <option value="RECOVERY">RECOVERY</option>
                    <option value="OFF_SEASON">OFF_SEASON</option>
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Sortering
                  </label>
                  <input
                    type="number"
                    value={draft.sortOrder}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        sortOrder: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Ukentlig fokus-tekst (bruk {`{n}`} for ukenummer)
                </label>
                <input
                  type="text"
                  value={draft.weeklyFocusTemplate}
                  onChange={(e) =>
                    setDraft({ ...draft, weeklyFocusTemplate: e.target.value })
                  }
                  placeholder="Putting + dosering — uke {n}"
                  className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(e) =>
                      setDraft({ ...draft, isActive: e.target.checked })
                    }
                  />
                  Aktiv
                </label>
                <label className="flex items-center gap-2 text-sm text-on-surface">
                  <input
                    type="checkbox"
                    checked={draft.isPublic}
                    onChange={(e) =>
                      setDraft({ ...draft, isPublic: e.target.checked })
                    }
                  />
                  Offentlig (synlig for alle spillere)
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Ukesmønster ({draft.weekPattern.length} økter)
                  </label>
                  <button
                    type="button"
                    onClick={addSession}
                    className="flex items-center gap-1 rounded-md border border-outline-variant px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-surface"
                  >
                    <Icon name="add" size={12} />
                    Legg til økt
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {draft.weekPattern.map((s, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface p-2"
                    >
                      <select
                        value={s.dayOfWeek}
                        onChange={(e) =>
                          updateSession(idx, { dayOfWeek: parseInt(e.target.value, 10) })
                        }
                        className="col-span-2 rounded border border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs"
                      >
                        {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                          <option key={d} value={d}>
                            {DAY_NAMES[d]}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={s.title}
                        onChange={(e) => updateSession(idx, { title: e.target.value })}
                        placeholder="Tittel"
                        className="col-span-4 rounded border border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs"
                      />
                      <input
                        type="number"
                        value={s.durationMinutes}
                        onChange={(e) =>
                          updateSession(idx, {
                            durationMinutes: parseInt(e.target.value, 10) || 0,
                          })
                        }
                        placeholder="Min"
                        className="col-span-2 rounded border border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs"
                      />
                      <input
                        type="text"
                        value={s.focusArea}
                        onChange={(e) =>
                          updateSession(idx, { focusArea: e.target.value })
                        }
                        placeholder="Fokus"
                        className="col-span-3 rounded border border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => removeSession(idx)}
                        className="col-span-1 rounded text-error hover:bg-error-container"
                      >
                        <Icon name="delete" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={cancel}
                  className="rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container"
                >
                  Avbryt
                </button>
                <button
                  onClick={save}
                  disabled={isPending || !draft.title.trim()}
                  className="rounded-lg bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-on-primary hover:bg-primary-container disabled:opacity-50"
                >
                  {isPending ? "Lagrer…" : "Lagre"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
