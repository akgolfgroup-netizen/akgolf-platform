"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export interface PlanConversationMessage {
  text: string;
  at: string | null;
  authorName?: string | null;
}

export interface PlanConversationCardProps {
  /** Coach-feedback (read-only her — settes fra admin/treningsplan) */
  coachFeedback?: PlanConversationMessage | null;
  /** Spiller-kommentar (redigerbar når `canEdit` er true) */
  playerComment?: PlanConversationMessage | null;
  /** Sett `true` når innlogget bruker er plan-eier */
  canEdit: boolean;
  /** Server action som lagrer/sletter spiller-kommentaren */
  onSavePlayerComment?: (
    text: string | null
  ) => Promise<{ success: boolean; error?: string }>;
}

const MAX_CHARS = 2000;

export function PlanConversationCard({
  coachFeedback,
  playerComment,
  canEdit,
  onSavePlayerComment,
}: PlanConversationCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(playerComment?.text ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const hasCoach = coachFeedback?.text;
  const hasPlayer = playerComment?.text;

  if (!hasCoach && !hasPlayer && !canEdit) return null;

  const handleSave = (clear = false) => {
    if (!onSavePlayerComment) return;
    setError(null);
    const next = clear ? null : draft.trim() || null;
    startTransition(async () => {
      const res = await onSavePlayerComment(next);
      if (res.success) {
        setEditing(false);
        if (clear) setDraft("");
      } else {
        setError(res.error ?? "Kunne ikke lagre kommentar");
      }
    });
  };

  return (
    <section
      aria-label="Samtale om treningsplanen"
      className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-4"
    >
      <header className="mb-3 flex items-center gap-2">
        <Icon name="forum" size={18} className="text-primary" />
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-primary">
          Samtale
        </h2>
      </header>

      <div className="space-y-3">
        {hasCoach && (
          <ConversationMessage
            tone="coach"
            iconName="sports"
            authorLabel={coachFeedback?.authorName ?? "Coach"}
            text={coachFeedback!.text}
            at={coachFeedback!.at}
          />
        )}

        {hasPlayer && !editing && (
          <ConversationMessage
            tone="player"
            iconName="person"
            authorLabel={playerComment?.authorName ?? "Du"}
            text={playerComment!.text}
            at={playerComment!.at}
            actions={
              canEdit && (
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(playerComment!.text);
                      setEditing(true);
                    }}
                    className="font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:text-primary"
                  >
                    Rediger
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(true)}
                    disabled={pending}
                    className="font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:text-error disabled:opacity-50"
                  >
                    Slett
                  </button>
                </div>
              )
            }
          />
        )}

        {canEdit && (editing || !hasPlayer) && (
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3">
            <label
              htmlFor="player-comment"
              className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant"
            >
              <Icon name="edit_note" size={14} />
              {hasPlayer ? "Rediger kommentar" : "Skriv en kommentar til coachen"}
            </label>
            <textarea
              id="player-comment"
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Hvordan går treningen? Tilbakemelding til coachen…"
              rows={3}
              maxLength={MAX_CHARS}
              className="w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-on-surface-variant">
                {draft.length}/{MAX_CHARS}
              </span>
              <div className="flex gap-2">
                {editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setDraft(playerComment?.text ?? "");
                      setError(null);
                    }}
                    className="rounded-lg px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-surface-variant hover:bg-surface-container-high"
                  >
                    Avbryt
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={pending || !draft.trim()}
                  className="rounded-lg bg-primary px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-on-primary hover:bg-primary/90 disabled:opacity-50"
                >
                  {pending ? "Lagrer…" : hasPlayer ? "Oppdater" : "Send"}
                </button>
              </div>
            </div>
            {error && (
              <p className="mt-2 text-[11px] text-error" role="alert">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface ConversationMessageProps {
  tone: "coach" | "player";
  iconName: string;
  authorLabel: string;
  text: string;
  at: string | null;
  actions?: React.ReactNode;
}

function ConversationMessage({
  tone,
  iconName,
  authorLabel,
  text,
  at,
  actions,
}: ConversationMessageProps) {
  const isCoach = tone === "coach";
  return (
    <article
      className={cn(
        "rounded-xl border p-3",
        isCoach
          ? "border-primary/30 bg-primary/5"
          : "border-secondary-fixed/40 bg-secondary-fixed/10"
      )}
    >
      <header className="flex items-center gap-2">
        <Icon
          name={iconName}
          size={16}
          className={isCoach ? "text-primary" : "text-on-surface"}
        />
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            isCoach ? "text-primary" : "text-on-surface"
          )}
        >
          {authorLabel}
        </span>
        {at && (
          <span className="ml-auto font-mono text-[10px] text-on-surface-variant">
            {format(new Date(at), "d. MMM yyyy", { locale: nb })}
          </span>
        )}
      </header>
      <p className="mt-1.5 whitespace-pre-wrap text-sm text-on-surface">
        {text}
      </p>
      {actions}
    </article>
  );
}
