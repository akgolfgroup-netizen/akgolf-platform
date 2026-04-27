"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, X, Save, Loader2 } from "lucide-react";
import {
  ITEM_TYPE_LABELS,
  STATUS_LABELS,
  SOURCE_LABELS,
  PLAYER_LEVELS,
} from "@/lib/portal/library/types";
import { TRENINGSOMRADER, PYRAMIDE } from "@/lib/portal/training/ak-taxonomy";
import type { LibraryItem } from "@prisma/client";

type ItemWithRelations = LibraryItem & {
  ApprovedBy: { id: string; name: string | null; email: string | null } | null;
  RejectedBy: { id: string; name: string | null; email: string | null } | null;
  CreatedBy: { id: string; name: string | null; email: string | null } | null;
};

interface Props {
  item: ItemWithRelations;
  canApprove: boolean;
}

export function LibraryDetail({ item, canApprove }: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState(item);
  const [saving, setSaving] = useState(false);
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof LibraryItem>(key: K, value: LibraryItem[K]) => {
    setDraft(d => ({ ...d, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/library/${item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          summary: draft.summary,
          pyramid: draft.pyramid,
          area: draft.area,
          subArea: draft.subArea,
          lPhase: draft.lPhase,
          playerLevels: draft.playerLevels,
          difficulty: draft.difficulty,
          minDurationMinutes: draft.minDurationMinutes,
          maxDurationMinutes: draft.maxDurationMinutes,
          equipment: draft.equipment,
          setup: draft.setup,
          execution: draft.execution,
          scoring: draft.scoring,
          variations: draft.variations,
          coachingCues: draft.coachingCues,
          tags: draft.tags,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Kunne ikke lagre");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
    } finally {
      setSaving(false);
    }
  };

  const approve = async () => {
    setActing("approve");
    setError(null);
    try {
      const res = await fetch(`/api/admin/library/${item.id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Kunne ikke godkjenne");
      router.push("/admin/library?status=APPROVED");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
      setActing(null);
    }
  };

  const reject = async () => {
    const reason = window.prompt("Hvorfor avvise? (valgfritt)") ?? "";
    setActing("reject");
    setError(null);
    try {
      const res = await fetch(`/api/admin/library/${item.id}/reject`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Kunne ikke avvise");
      router.push("/admin/library?status=REJECTED");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ukjent feil");
      setActing(null);
    }
  };

  const toggleLevel = (lvl: string) => {
    const next = draft.playerLevels.includes(lvl)
      ? draft.playerLevels.filter(l => l !== lvl)
      : [...draft.playerLevels, lvl];
    update("playerLevels", next);
  };

  return (
    <div className="space-y-6 p-6">
      <Link
        href="/admin/library"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-primary)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Tilbake til biblioteket
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[var(--color-primary-soft)] px-2 py-0.5 text-xs font-medium text-[var(--color-primary)]">
              {ITEM_TYPE_LABELS[item.type]}
            </span>
            <span className="rounded-md bg-[var(--color-surface-soft)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]">
              {STATUS_LABELS[item.status]}
            </span>
            <span className="rounded-md bg-[var(--color-surface-soft)] px-2 py-0.5 text-xs text-[var(--color-ink-muted)]">
              {SOURCE_LABELS[item.source]}
            </span>
          </div>
          <h1 className="mt-2 font-[family-name:var(--font-inter-tight)] text-2xl font-bold text-[var(--color-ink)]">
            {draft.title}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {item.status === "DRAFT" && canApprove ? (
            <>
              <button
                onClick={reject}
                disabled={!!acting}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-line)] px-3 py-2 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5"
              >
                <X className="h-4 w-4" />
                Avvis
              </button>
              <button
                onClick={approve}
                disabled={!!acting}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-success)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-success)]/90"
              >
                {acting === "approve" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Godkjenn
              </button>
            </>
          ) : null}
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Lagre endringer
          </button>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 p-3 text-sm text-[var(--color-danger)]">
          {error}
        </div>
      ) : null}

      {item.status === "REJECTED" && item.rejectionReason ? (
        <div className="rounded-lg bg-[var(--color-danger)]/5 p-3 text-sm text-[var(--color-ink)]">
          <strong>Avvist:</strong> {item.rejectionReason}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Field label="Tittel">
            <input
              value={draft.title}
              onChange={e => update("title", e.target.value)}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            />
          </Field>
          <Field label="Sammendrag">
            <textarea
              value={draft.summary}
              onChange={e => update("summary", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            />
          </Field>
          <Field label="Oppsett (markdown)">
            <textarea
              value={draft.setup ?? ""}
              onChange={e => update("setup", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
          </Field>
          <Field label="Gjennomføring (markdown)">
            <textarea
              value={draft.execution ?? ""}
              onChange={e => update("execution", e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
          </Field>
          <Field label="Scoring (markdown)">
            <textarea
              value={draft.scoring ?? ""}
              onChange={e => update("scoring", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
          </Field>
          <Field label="Varianter (markdown)">
            <textarea
              value={draft.variations ?? ""}
              onChange={e => update("variations", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
          </Field>
          <Field label="Coaching cues (markdown)">
            <textarea
              value={draft.coachingCues ?? ""}
              onChange={e => update("coachingCues", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
          </Field>
        </div>

        <aside className="space-y-4">
          <Field label="Pyramide">
            <select
              value={draft.pyramid}
              onChange={e => update("pyramid", e.target.value)}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            >
              {PYRAMIDE.map(p => (
                <option key={p.code} value={p.code}>
                  {p.code} — {p.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Treningsområde">
            <select
              value={draft.area}
              onChange={e => update("area", e.target.value)}
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            >
              {TRENINGSOMRADER.map(a => (
                <option key={a.code} value={a.code}>
                  {a.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Spillerkategorier">
            <div className="flex flex-wrap gap-1.5">
              {PLAYER_LEVELS.map(lvl => {
                const active = draft.playerLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => toggleLevel(lvl)}
                    className={`rounded-md px-2 py-1 font-mono text-xs ${
                      active
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-surface-soft)] text-[var(--color-ink-muted)]"
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Vansk.">
              <input
                type="number"
                min={1}
                max={5}
                value={draft.difficulty}
                onChange={e => update("difficulty", Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
              />
            </Field>
            <Field label="Min minutter">
              <input
                type="number"
                value={draft.minDurationMinutes}
                onChange={e =>
                  update("minDurationMinutes", Number(e.target.value))
                }
                className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
              />
            </Field>
            <Field label="Maks minutter">
              <input
                type="number"
                value={draft.maxDurationMinutes}
                onChange={e =>
                  update("maxDurationMinutes", Number(e.target.value))
                }
                className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
              />
            </Field>
            <Field label="Bruk">
              <div className="rounded-lg bg-[var(--color-surface-soft)] px-3 py-2 font-mono text-sm">
                {item.usageCount}
              </div>
            </Field>
          </div>
          <Field label="Utstyr (komma-separert)">
            <input
              value={draft.equipment.join(", ")}
              onChange={e =>
                update(
                  "equipment",
                  e.target.value
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            />
          </Field>
          <Field label="Tagger (komma-separert)">
            <input
              value={draft.tags.join(", ")}
              onChange={e =>
                update(
                  "tags",
                  e.target.value
                    .split(",")
                    .map(s => s.trim())
                    .filter(Boolean)
                )
              }
              className="w-full rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
            />
          </Field>
          <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-surface-soft)] p-3 text-xs text-[var(--color-ink-muted)]">
            <div>Generert av: {item.generatedBy ?? "—"}</div>
            <div>
              Opprettet: {new Date(item.createdAt).toLocaleString("nb-NO")}
            </div>
            {item.ApprovedBy ? (
              <div>
                Godkjent av:{" "}
                {item.ApprovedBy.name ?? item.ApprovedBy.email ?? "—"}
              </div>
            ) : null}
          </div>
        </aside>
      </div>
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
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--color-ink-muted)]">{label}</span>
      {children}
    </label>
  );
}
