"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Plus,
  Eye,
  X,
  Variable,
  Save,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminBadge,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { createTemplate, updateTemplate, deleteTemplate } from "./actions";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string | null;
  variables: string[] | null;
  createdAt: string;
  updatedAt: string;
}

interface EPostmalerClientProps {
  templates: EmailTemplate[];
}

const categories = [
  "Alle",
  "Onboarding",
  "Booking",
  "Oppfølging",
  "Markedsføring",
];

function getCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("velkom") || lower.includes("onboarding"))
    return "Onboarding";
  if (
    lower.includes("booking") ||
    lower.includes("bekreft") ||
    lower.includes("påminn")
  )
    return "Booking";
  if (lower.includes("oppfølg")) return "Oppfølging";
  if (
    lower.includes("marked") ||
    lower.includes("kampanje") ||
    lower.includes("nyhetsbrev")
  )
    return "Markedsføring";
  return "Alle";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "I dag";
  if (diffDays === 1) return "I går";
  if (diffDays < 7) return `${diffDays} dager siden`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} uker siden`;
  return date.toLocaleDateString("nb-NO");
}

export function EPostmalerClient({ templates }: EPostmalerClientProps) {
  const { toggle } = useMCSidebar();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );

  // Form state for the editor
  const [editName, setEditName] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editHtmlContent, setEditHtmlContent] = useState("");
  const [editVariables, setEditVariables] = useState<string[]>([]);

  const filteredTemplates =
    selectedCategory === "Alle"
      ? templates
      : templates.filter((t) => getCategory(t.name) === selectedCategory);

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  function selectTemplate(template: EmailTemplate) {
    setSelectedTemplateId(template.id);
    setEditName(template.name);
    setEditSubject(template.subject);
    setEditHtmlContent(template.htmlContent || "");
    setEditVariables(template.variables || []);
  }

  function handleNewTemplate() {
    startTransition(async () => {
      const newTemplate = await createTemplate({
        name: "Ny e-postmal",
        subject: "Emnefelt",
        htmlContent: "",
        variables: [],
      });
      if (newTemplate) {
        router.refresh();
        setSelectedTemplateId(newTemplate.id);
        setEditName(newTemplate.name);
        setEditSubject(newTemplate.subject);
        setEditHtmlContent(newTemplate.htmlContent || "");
        setEditVariables(newTemplate.variables || []);
      }
    });
  }

  function handleSave() {
    if (!selectedTemplateId) return;
    startTransition(async () => {
      await updateTemplate(selectedTemplateId, {
        name: editName,
        subject: editSubject,
        htmlContent: editHtmlContent,
        variables: editVariables,
      });
      router.refresh();
    });
  }

  function handleDelete() {
    if (!selectedTemplateId) return;
    const confirmed = window.confirm(
      "Er du sikker på at du vil slette denne malen?",
    );
    if (!confirmed) return;
    startTransition(async () => {
      await deleteTemplate(selectedTemplateId);
      setSelectedTemplateId(null);
      router.refresh();
    });
  }

  return (
    <>
      <MCTopbar
        title="E-postmaler"
        subtitle="Opprett og rediger e-postmaler med dynamiske variabler"
        onMenuClick={toggle}
      />

      <div className="p-6">
        <AdminCard
          className="p-0 overflow-hidden"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex h-full">
            {/* Sidebar - Template List */}
            <div
              className={cn(
                "w-full lg:w-80 border-r border-[var(--color-grey-200)] flex flex-col",
                selectedTemplateId && "hidden lg:flex",
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--color-grey-200)]">
                <AdminButton
                  variant="primary"
                  className="w-full"
                  onClick={handleNewTemplate}
                  disabled={isPending}
                  loading={isPending}
                  icon={!isPending ? <Plus className="w-4 h-4" /> : undefined}
                >
                  Ny mal
                </AdminButton>
              </div>

              {/* Categories */}
              <div className="p-3 border-b border-[var(--color-grey-200)]">
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                        selectedCategory === cat
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-muted)] hover:text-[var(--color-text)]",
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div className="flex-1 overflow-y-auto">
                {filteredTemplates.length === 0 ? (
                  <div className="p-6 text-center text-sm text-[var(--color-muted)]">
                    Ingen maler funnet
                  </div>
                ) : (
                  filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => selectTemplate(t)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-[var(--color-grey-100)] transition-colors border-b border-[var(--color-grey-100)]",
                        selectedTemplateId === t.id &&
                          "bg-[var(--color-grey-100)]",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[var(--color-text)] truncate">
                            {t.name}
                          </h4>
                          <p className="text-xs text-[var(--color-muted)] truncate">
                            {t.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <AdminBadge variant="muted">
                              {getCategory(t.name)}
                            </AdminBadge>
                            <span className="text-[10px] text-[var(--color-muted)]">
                              {formatDate(t.updatedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Main Content - Editor */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                !selectedTemplateId && "hidden lg:flex",
              )}
            >
              {selectedTemplate ? (
                <>
                  {/* Editor Header */}
                  <div className="p-4 border-b border-[var(--color-grey-200)] flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTemplateId(null)}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-grey-100)]"
                        aria-label="Lukk"
                      >
                        <X className="w-5 h-5 text-[var(--color-text)]" />
                      </button>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text)]">
                          {editName}
                        </h3>
                        <p className="text-xs text-[var(--color-muted)]">
                          Sist redigert {formatDate(selectedTemplate.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AdminButton
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isPending}
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Slett
                      </AdminButton>
                      <AdminButton
                        variant="secondary"
                        icon={<Eye className="w-4 h-4" />}
                      >
                        Forhåndsvis
                      </AdminButton>
                      <AdminButton
                        variant="primary"
                        onClick={handleSave}
                        disabled={isPending}
                        loading={isPending}
                        icon={
                          !isPending ? <Save className="w-4 h-4" /> : undefined
                        }
                      >
                        Lagre
                      </AdminButton>
                    </div>
                  </div>

                  {/* Editor Form */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Template Name */}
                    <AdminInput
                      label="Mal-navn"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />

                    {/* Subject */}
                    <AdminInput
                      label="Emne"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                    />

                    {/* Variables */}
                    <div>
                      <div className="admin-label flex items-center gap-2 mb-1.5">
                        <Variable className="w-4 h-4" />
                        Tilgjengelige variabler
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[var(--color-grey-100)]">
                        {editVariables.length > 0 ? (
                          editVariables.map((v) => (
                            <button
                              key={v}
                              onClick={() => {
                                setEditHtmlContent((prev) => prev + v);
                              }}
                              className="text-xs px-2 py-1 rounded bg-white border border-[var(--color-grey-200)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                              {v}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-[var(--color-muted)]">
                            Ingen variabler definert
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Body */}
                    <AdminTextarea
                      label="E-postinnhold"
                      value={editHtmlContent}
                      onChange={(e) => setEditHtmlContent(e.target.value)}
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <AdminEmptyState
                    icon={<Mail className="w-6 h-6" />}
                    title="Velg en mal"
                    description="Klikk på en mal i listen for å redigere, eller opprett en ny"
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
