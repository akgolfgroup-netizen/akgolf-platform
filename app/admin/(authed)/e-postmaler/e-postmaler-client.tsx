"use client";


import { Icon } from "@/components/ui/icon";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Variable } from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminInput,
  AdminTextarea,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
        {/* Main Card */}
        <div
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex h-full">
            {/* Sidebar - Template List */}
            <div
              className={cn(
                "w-full lg:w-80 border-r border-outline-variant/30 flex flex-col",
                selectedTemplateId && "hidden lg:flex",
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-outline-variant/30">
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleNewTemplate}
                  disabled={isPending}
                  isLoading={isPending}
                >
                  {!isPending && <Icon name="add" className="w-4 h-4 mr-2" />}
                  Ny mal
                </Button>
              </div>

              {/* Categories */}
              <div className="p-3 border-b border-outline-variant/30">
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-full transition-colors",
                        selectedCategory === cat
                          ? "bg-on-surface text-surface"
                          : "bg-surface text-text hover:text-on-surface hover:bg-surface-variant",
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
                  <div className="p-6 text-center text-sm text-on-surface-variant">
                    Ingen maler funnet
                  </div>
                ) : (
                  filteredTemplates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => selectTemplate(t)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-surface transition-colors border-b border-outline-variant/30",
                        selectedTemplateId === t.id && "bg-surface",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                          <Icon name="mail" className="w-5 h-5 text-text" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-on-surface truncate">
                            {t.name}
                          </h4>
                          <p className="text-xs text-on-surface-variant truncate">
                            {t.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="muted">
                              {getCategory(t.name)}
                            </Badge>
                            <span className="text-[10px] text-on-surface-variant">
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
                  <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTemplateId(null)}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface"
                        aria-label="Lukk"
                      >
                        <Icon name="close" className="w-5 h-5 text-text" />
                      </button>
                      <div>
                        <h3 className="text-base font-semibold text-on-surface">
                          {editName}
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          Sist redigert {formatDate(selectedTemplate.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isPending}
                      >
                        <Icon name="delete" className="w-4 h-4 mr-2" />
                        Slett
                      </Button>
                      <Button variant="secondary">
                        <Icon name="visibility" className="w-4 h-4 mr-2" />
                        Forhåndsvis
                      </Button>
                      <Button
                        variant="accent"
                        onClick={handleSave}
                        disabled={isPending}
                        isLoading={isPending}
                      >
                        {!isPending && <Icon name="save" className="w-4 h-4 mr-2" />}
                        Lagre
                      </Button>
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
                      <div className="text-sm font-medium text-text flex items-center gap-2 mb-1.5">
                        <Variable className="w-4 h-4" />
                        Tilgjengelige variabler
                      </div>
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-surface">
                        {editVariables.length > 0 ? (
                          editVariables.map((v) => (
                            <button
                              key={v}
                              onClick={() => {
                                setEditHtmlContent((prev) => prev + v);
                              }}
                              className="text-xs px-2 py-1 rounded bg-surface-container-lowest border border-outline-variant/30 text-text hover:bg-on-surface hover:text-surface hover:border-black transition-colors"
                            >
                              {v}
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-on-surface-variant">
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
                    icon={<Icon name="mail" className="w-6 h-6" />}
                    title="Velg en mal"
                    description="Klikk på en mal i listen for å redigere, eller opprett en ny"
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
