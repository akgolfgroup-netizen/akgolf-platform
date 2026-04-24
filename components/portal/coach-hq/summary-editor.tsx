"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export interface SummaryDraft {
  id: string;
  sessionDate: string;
  rawTranscript: string | null;
  aiSummary: string | null;
  aiKeyPoints: string[];
  aiFocusAreas: string[];
  aiActionItems: string[];
  publishedToStudent: boolean;
  publishedAt: string | null;
  aiGeneratedAt: string | null;
  audioUrl: string | null;
}

interface SummaryEditorProps {
  draft: SummaryDraft;
  studentName: string;
}

export function SummaryEditor({ draft, studentName }: SummaryEditorProps) {
  const router = useRouter();
  const [summary, setSummary] = useState(draft.aiSummary ?? "");
  const [keyPoints, setKeyPoints] = useState<string[]>(draft.aiKeyPoints);
  const [focusAreas, setFocusAreas] = useState<string[]>(draft.aiFocusAreas);
  const [actionItems, setActionItems] = useState<string[]>(draft.aiActionItems);
  const [showTranscript, setShowTranscript] = useState(false);
  const [saving, setSaving] = useState<"save" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function saveDraft(publish: boolean) {
    setError(null);
    setSaving(publish ? "publish" : "save");
    try {
      const resp = await fetch(`/api/portal/admin/coaching-session/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          aiSummary: summary,
          aiKeyPoints: keyPoints.filter((k) => k.trim().length > 0),
          aiFocusAreas: focusAreas.filter((f) => f.trim().length > 0),
          aiActionItems: actionItems.filter((a) => a.trim().length > 0),
          publish,
        }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Ukjent feil" }));
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke lagre");
    } finally {
      setSaving(null);
    }
  }

  const isPublished = draft.publishedToStudent;

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
        <div className="flex items-center gap-3">
          {isPublished ? (
            <>
              <Icon name="check_circle" size={18} className="text-primary" filled />
              <div>
                <div className="text-sm font-semibold text-on-surface">Publisert til {studentName}</div>
                <div className="text-xs text-on-surface-variant">
                  {draft.publishedAt ? new Date(draft.publishedAt).toLocaleString("no-NO") : ""}
                </div>
              </div>
            </>
          ) : (
            <>
              <Icon name="drafts" size={18} className="text-on-surface-variant" />
              <div>
                <div className="text-sm font-semibold text-on-surface">Utkast — ikke publisert</div>
                <div className="text-xs text-on-surface-variant">
                  Kun synlig for deg. Publiser når innholdet er godkjent.
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => saveDraft(false)}
            isLoading={saving === "save"}
            disabled={saving !== null}
          >
            Lagre utkast
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => saveDraft(true)}
            isLoading={saving === "publish"}
            disabled={saving !== null}
          >
            {isPublished ? "Oppdater publisering" : "Publiser til elev"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Prose summary */}
      <FieldBlock label="Sammendrag" help="Prosa-oppsummering synlig for eleven">
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-3 text-sm text-on-surface focus:border-primary focus:outline-none"
          placeholder="Kort prosa-oppsummering..."
        />
      </FieldBlock>

      {/* Key points */}
      <FieldBlock label="Nøkkelpunkter" help="3-5 konkrete observasjoner fra økten">
        <BulletList values={keyPoints} onChange={setKeyPoints} placeholder="Hva ble observert..." />
      </FieldBlock>

      {/* Focus areas */}
      <FieldBlock label="Fokusområder" help="Kategorier som skal jobbes videre med">
        <BulletList values={focusAreas} onChange={setFocusAreas} placeholder="Fokusområde..." short />
      </FieldBlock>

      {/* Action items */}
      <FieldBlock label="Handlingspunkter" help="Konkrete oppgaver eleven skal jobbe med">
        <BulletList values={actionItems} onChange={setActionItems} placeholder="Oppgave..." />
      </FieldBlock>

      {/* Raw transcript (collapsible) */}
      {draft.rawTranscript && (
        <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low">
          <button
            onClick={() => setShowTranscript((s) => !s)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-container transition-colors rounded-xl"
          >
            <div className="flex items-center gap-3">
              <Icon name="description" size={18} className="text-on-surface-variant" />
              <div>
                <div className="text-sm font-semibold text-on-surface">Full transkripsjon</div>
                <div className="text-xs text-on-surface-variant">
                  {draft.rawTranscript.length} tegn — kun synlig for coach
                </div>
              </div>
            </div>
            <Icon name={showTranscript ? "expand_less" : "expand_more"} size={20} />
          </button>
          {showTranscript && (
            <div className="px-4 pb-4">
              <pre className="whitespace-pre-wrap text-sm text-on-surface-variant font-mono leading-relaxed max-h-96 overflow-y-auto rounded-lg bg-surface-container p-3">
                {draft.rawTranscript}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FieldBlock({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant">
          {label}
        </div>
        {help && <div className="text-xs text-on-surface-variant/70 mt-0.5">{help}</div>}
      </div>
      {children}
    </div>
  );
}

function BulletList({
  values,
  onChange,
  placeholder,
  short = false,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  short?: boolean;
}) {
  const list = values.length === 0 ? [""] : values;
  function update(idx: number, val: string) {
    const next = [...list];
    next[idx] = val;
    onChange(next);
  }
  function remove(idx: number) {
    onChange(list.filter((_, i) => i !== idx));
  }
  function add() {
    onChange([...list, ""]);
  }
  return (
    <div className="space-y-2">
      {list.map((val, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <div className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          {short ? (
            <input
              value={val}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          ) : (
            <textarea
              value={val}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={placeholder}
              rows={2}
              className="flex-1 rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none resize-none"
            />
          )}
          <button
            onClick={() => remove(idx)}
            className="mt-2 p-1 text-on-surface-variant hover:text-error"
            aria-label="Fjern"
            type="button"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-container"
      >
        <Icon name="add" size={14} />
        Legg til
      </button>
    </div>
  );
}
