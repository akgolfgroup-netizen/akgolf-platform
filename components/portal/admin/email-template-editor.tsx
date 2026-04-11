"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Save,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Variable,
  X,
} from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  initialTemplates: EmailTemplate[];
}

const emptyTemplate: Omit<EmailTemplate, "id" | "createdAt" | "updatedAt"> = {
  name: "",
  subject: "",
  htmlContent: "",
  variables: [],
};

export function EmailTemplateEditor({ initialTemplates }: Props) {
  const router = useRouter();
  const templates = initialTemplates;
  const [selected, setSelected] = useState<EmailTemplate | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [draft, setDraft] = useState(emptyTemplate);
  const [showPreview, setShowPreview] = useState(false);
  const [newVariable, setNewVariable] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function handleSelect(template: EmailTemplate) {
    setSelected(template);
    setIsNew(false);
    setDraft({
      name: template.name,
      subject: template.subject,
      htmlContent: template.htmlContent,
      variables: [...template.variables],
    });
    setShowPreview(false);
    setMessage(null);
  }

  function handleNew() {
    setSelected(null);
    setIsNew(true);
    setDraft({ ...emptyTemplate, variables: [] });
    setShowPreview(false);
    setMessage(null);
  }

  function addVariable() {
    const trimmed = newVariable.trim();
    if (trimmed && !draft.variables.includes(trimmed)) {
      setDraft((d) => ({ ...d, variables: [...d.variables, trimmed] }));
      setNewVariable("");
    }
  }

  function removeVariable(v: string) {
    setDraft((d) => ({
      ...d,
      variables: d.variables.filter((x) => x !== v),
    }));
  }

  function getPreviewHtml(): string {
    let html = draft.htmlContent;
    for (const v of draft.variables) {
      html = html.replaceAll(
        `{{${v}}}`,
        `<span style="background:var(--color-black);color:white;padding:1px 6px;border-radius:4px;font-size:12px;">${v}</span>`
      );
    }
    return html;
  }

  async function handleSave() {
    if (!draft.name || !draft.subject) {
      setMessage({ type: "error", text: "Navn og emne er obligatorisk" });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const url = "/api/portal/admin/email-templates";

      if (isNew) {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Feil ved opprettelse");
        }
      } else if (selected) {
        const res = await fetch(`${url}/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Feil ved lagring");
        }
      }

      setMessage({ type: "success", text: "Mal lagret" });
      router.refresh();
    } catch (e) {
      setMessage({
        type: "error",
        text: e instanceof Error ? e.message : "Feil ved lagring",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    if (!confirm(`Er du sikker på at du vil slette malen "${selected.name}"?`))
      return;

    setDeleting(true);
    try {
      const res = await fetch(
        `/api/portal/admin/email-templates/${selected.id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Feil ved sletting");

      setSelected(null);
      setIsNew(false);
      setDraft({ ...emptyTemplate, variables: [] });
      setMessage({ type: "success", text: "Mal slettet" });
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Kunne ikke slette malen" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
      {/* Template list */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--color-surface-warm)",
          border: "1px solid var(--color-grey-200)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-semibold text-[var(--color-grey-400)] uppercase tracking-widest">
            Maler
          </p>
          <button
            onClick={handleNew}
            className="p-1.5 rounded-lg transition-colors hover:bg-white"
            title="Ny mal"
          >
            <Plus className="w-4 h-4 text-[var(--color-grey-900)]" />
          </button>
        </div>
        <ul className="space-y-1">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => handleSelect(t)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200"
                style={
                  selected?.id === t.id
                    ? {
                        background:
                          "linear-gradient(135deg, var(--color-grey-900), var(--color-grey-500))",
                        color: "white",
                      }
                    : { color: "var(--color-grey-500)" }
                }
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{t.name}</span>
                </div>
              </button>
            </li>
          ))}
          {templates.length === 0 && (
            <p className="text-xs text-[var(--color-grey-400)] px-3 py-2">
              Ingen maler opprettet enda
            </p>
          )}
        </ul>
      </div>

      {/* Editor */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--color-surface-warm)",
          border: "1px solid var(--color-grey-200)",
        }}
      >
        {!selected && !isNew ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-10 h-10 text-[var(--color-grey-400)] mb-3" />
            <p className="text-sm text-[var(--color-grey-500)]">
              Velg en mal fra listen eller opprett en ny
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-[var(--color-grey-400)] uppercase tracking-widest">
                {isNew ? "Ny mal" : "Rediger mal"}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white text-[var(--color-grey-500)]"
                >
                  {showPreview ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  {showPreview ? "Skjul forhåndsvisning" : "Forhåndsvisning"}
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-900)] mb-1">
                Malnavn
              </label>
              <input
                type="text"
                value={draft.name}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                placeholder="f.eks. bookingbekreftelse"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] transition-[box-shadow] duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/50"
                style={{ border: "1px solid var(--color-grey-200)" }}
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-900)] mb-1">
                Emne
              </label>
              <input
                type="text"
                value={draft.subject}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, subject: e.target.value }))
                }
                placeholder="Bookingbekreftelse - {{serviceName}}"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] transition-[box-shadow] duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/50"
                style={{ border: "1px solid var(--color-grey-200)" }}
              />
            </div>

            {/* Variables */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-900)] mb-1">
                <Variable className="w-3.5 h-3.5 inline mr-1" />
                Variabler
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {draft.variables.map((v) => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-[var(--color-grey-900)]/10 text-[var(--color-grey-900)]"
                  >
                    {"{{"}
                    {v}
                    {"}}"}
                    <button
                      onClick={() => removeVariable(v)}
                      className="hover:text-[var(--color-error)] transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addVariable()}
                  placeholder="Legg til variabel..."
                  className="flex-1 px-4 py-2 rounded-xl text-sm bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] transition-[box-shadow] duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/50"
                  style={{ border: "1px solid var(--color-grey-200)" }}
                />
                <button
                  onClick={addVariable}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-grey-900), var(--color-grey-500))",
                  }}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* HTML Content */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-grey-900)] mb-1">
                HTML-innhold
              </label>
              <textarea
                value={draft.htmlContent}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, htmlContent: e.target.value }))
                }
                placeholder="<h1>Hei {{playerName}}</h1><p>Din booking er bekreftet.</p>"
                rows={12}
                className="w-full px-4 py-3 rounded-xl text-sm font-mono bg-white text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] transition-[box-shadow] duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/50 resize-y"
                style={{ border: "1px solid var(--color-grey-200)" }}
              />
            </div>

            {/* Preview */}
            {showPreview && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-grey-900)] mb-1">
                  Forhåndsvisning
                </label>
                <div
                  className="rounded-xl bg-white p-4 text-sm"
                  style={{ border: "1px solid var(--color-grey-200)" }}
                >
                  <div className="border-b border-[var(--color-grey-200)] pb-2 mb-3">
                    <p className="text-xs text-[var(--color-grey-400)]">
                      Emne:{" "}
                      <span className="text-[var(--color-grey-900)] font-medium">
                        {draft.subject}
                      </span>
                    </p>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                    className="prose prose-sm max-w-none"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity duration-200 disabled:opacity-50"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-grey-900), var(--color-grey-500))",
                }}
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Lagrer..." : "Lagre"}
              </button>

              {selected && !isNew && (
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-error)] transition-[background-color,opacity] duration-200 hover:bg-[var(--color-error)]/5 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {deleting ? "Sletter..." : "Slett"}
                </button>
              )}
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "success"
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-error)]"
                }`}
              >
                {message.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
