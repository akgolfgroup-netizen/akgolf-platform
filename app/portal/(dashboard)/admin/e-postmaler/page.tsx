"use client";

import { useState } from "react";
import {
  Mail,
  Plus,
  Edit3,
  Trash2,
  Copy,
  Eye,
  Check,
  X,
  Variable,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

// Mock templates
const mockTemplates = [
  {
    id: "1",
    name: "Velkomst e-post",
    subject: "Velkommen til AK Golf Academy!",
    category: "Onboarding",
    variables: ["{firstName}", "{coachName}"],
    lastEdited: "2 dager siden",
  },
  {
    id: "2",
    name: "Booking bekreftelse",
    subject: "Din booking er bekreftet",
    category: "Booking",
    variables: ["{firstName}", "{date}", "{time}", "{service}"],
    lastEdited: "1 uke siden",
  },
  {
    id: "3",
    name: "Påminnelse",
    subject: "Påminnelse: Time i morgen",
    category: "Booking",
    variables: ["{firstName}", "{date}", "{time}", "{location}"],
    lastEdited: "3 dager siden",
  },
  {
    id: "4",
    name: "Oppfølging",
    subject: "Hvordan går det med treningen?",
    category: "Oppfølging",
    variables: ["{firstName}", "{lastSessionDate}"],
    lastEdited: "5 dager siden",
  },
];

const categories = ["Alle", "Onboarding", "Booking", "Oppfølging", "Markedsføring"];

export default function EPostmalerPage() {
  const { toggle } = useMCSidebar();
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredTemplates = selectedCategory === "Alle"
    ? mockTemplates
    : mockTemplates.filter(t => t.category === selectedCategory);

  const template = mockTemplates.find(t => t.id === selectedTemplate);

  return (
    <>
      <MCTopbar
        title="E-postmaler"
        subtitle="Opprett og rediger e-postmaler med dynamiske variabler"
        onMenuClick={toggle}
      />

      <div className="p-5">
        <div className="hg-card overflow-hidden" style={{ minHeight: "calc(100vh - 180px)" }}>
          <div className="flex h-full">
            {/* Sidebar - Template List */}
            <div className={cn(
              "w-full lg:w-80 border-r border-[var(--hg-border)] flex flex-col",
              selectedTemplate && "hidden lg:flex"
            )}>
              {/* Header */}
              <div className="p-4 border-b border-[var(--hg-border)]">
                <button className="hg-btn hg-btn-primary w-full">
                  <Plus className="w-4 h-4" />
                  Ny mal
                </button>
              </div>

              {/* Categories */}
              <div className="p-3 border-b border-[var(--hg-border)]">
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                        selectedCategory === cat
                          ? "bg-[var(--hg-primary)] text-[var(--hg-bg)]"
                          : "bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)]"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Templates */}
              <div className="flex-1 overflow-y-auto">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={cn(
                      "w-full p-4 text-left hover:bg-[var(--hg-surface-raised)] transition-colors border-b border-[var(--hg-border-subtle)]",
                      selectedTemplate === t.id && "bg-[var(--hg-surface-raised)]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--hg-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-[var(--hg-primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[var(--hg-text)] truncate">
                          {t.name}
                        </h4>
                        <p className="text-xs text-[var(--hg-text-muted)] truncate">
                          {t.subject}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--hg-surface)] text-[var(--hg-text-muted)]">
                            {t.category}
                          </span>
                          <span className="text-[10px] text-[var(--hg-text-muted)]">
                            {t.lastEdited}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content - Editor */}
            <div className={cn(
              "flex-1 flex flex-col",
              !selectedTemplate && "hidden lg:flex"
            )}>
              {template ? (
                <>
                  {/* Editor Header */}
                  <div className="p-4 border-b border-[var(--hg-border)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedTemplate(null)}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--hg-surface-raised)]"
                      >
                        <X className="w-5 h-5 text-[var(--hg-text)]" />
                      </button>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--hg-text)]">
                          {template.name}
                        </h3>
                        <p className="text-xs text-[var(--hg-text-muted)]">
                          Sist redigert {template.lastEdited}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="hg-btn hg-btn-secondary text-sm">
                        <Eye className="w-4 h-4" />
                        Forhåndsvis
                      </button>
                      <button className="hg-btn hg-btn-primary text-sm">
                        <Save className="w-4 h-4" />
                        Lagre
                      </button>
                    </div>
                  </div>

                  {/* Editor Form */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Template Name */}
                  <div>
                      <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                        Mal-navn
                      </label>
                      <input
                        type="text"
                        defaultValue={template.name}
                        className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                        Emne
                      </label>
                      <input
                        type="text"
                        defaultValue={template.subject}
                        className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-4 py-2.5 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none"
                      />
                    </div>

                    {/* Variables */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--hg-text)] mb-2 flex items-center gap-2">
                        <Variable className="w-4 h-4" />
                        Tilgjengelige variabler
                      </label>
                      <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[var(--hg-surface-raised)]">
                        {template.variables.map((v) => (
                          <button
                            key={v}
                            className="text-xs px-2 py-1 rounded bg-[var(--hg-surface)] text-[var(--hg-primary)] hover:bg-[var(--hg-primary)] hover:text-[var(--hg-bg)] transition-colors"
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Body */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--hg-text)] mb-2">
                        E-postinnhold
                      </label>
                      <textarea
                        defaultValue={`Hei {firstName},

Takk for at du valgte AK Golf Academy!

Vi gleder oss til å jobbe med deg.

Med vennlig hilsen,
{coachName}`}
                        rows={12}
                        className="w-full bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-4 py-3 text-[var(--hg-text)] focus:border-[var(--hg-primary)] outline-none resize-none font-mono text-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--hg-surface-raised)] flex items-center justify-center mb-4">
                    <Mail className="w-8 h-8 text-[var(--hg-text-muted)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--hg-text)] mb-2">
                    Velg en mal
                  </h3>
                  <p className="text-sm text-[var(--hg-text-muted)] max-w-xs">
                    Klikk på en mal i listen for å redigere, eller opprett en ny
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
