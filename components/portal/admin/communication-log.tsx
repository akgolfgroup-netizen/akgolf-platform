"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Mail,
  MessageSquare,
  FileText,
  Phone,
  Plus,
  X,
  ChevronDown,
} from "lucide-react";
import { CommunicationType } from "@prisma/client";
import { addCommunicationLog } from "@/app/admin/elever/[id]/communication-actions";

// ----------------------------------------------------------------
// Typer
// ----------------------------------------------------------------

interface CommunicationEntry {
  id: string;
  type: CommunicationType;
  subject: string | null;
  content: string | null;
  sentAt: Date;
  Instructor: {
    User: {
      name: string | null;
    };
  } | null;
}

interface CommunicationLogProps {
  studentId: string;
  initialLogs: CommunicationEntry[];
}

// ----------------------------------------------------------------
// Hjelpefunksjoner
// ----------------------------------------------------------------

const TYPE_CONFIG: Record<
  CommunicationType,
  {
    label: string;
    icon: React.ReactNode;
    bg: string;
    text: string;
    border: string;
  }
> = {
  EMAIL: {
    label: "E-post",
    icon: <Mail className="w-3.5 h-3.5" />,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  SMS: {
    label: "SMS",
    icon: <MessageSquare className="w-3.5 h-3.5" />,
    bg: "bg-[var(--color-brand)]/5",
    text: "text-[var(--color-brand)]",
    border: "border-[var(--color-brand)]/20",
  },
  NOTE: {
    label: "Notat",
    icon: <FileText className="w-3.5 h-3.5" />,
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  CALL: {
    label: "Samtale",
    icon: <Phone className="w-3.5 h-3.5" />,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
};

const TYPE_OPTIONS: { value: CommunicationType; label: string }[] = [
  { value: "EMAIL", label: "E-post" },
  { value: "SMS", label: "SMS" },
  { value: "NOTE", label: "Notat" },
  { value: "CALL", label: "Samtale" },
];

// ----------------------------------------------------------------
// Skjema for ny loggoppforing
// ----------------------------------------------------------------

function NyLoggForm({
  studentId,
  onSuccess,
  onCancel,
}: {
  studentId: string;
  onSuccess: (entry: CommunicationEntry) => void;
  onCancel: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<CommunicationType>("NOTE");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [feil, setFeil] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeil(null);

    startTransition(async () => {
      const result = await addCommunicationLog(
        studentId,
        type,
        subject || null,
        content
      );

      if (!result.success) {
        setFeil(result.error ?? "Ukjent feil");
        return;
      }

      // Legg til lokal entry optimistisk (uten instruktornavn — siden oppdateres ved revalidate)
      onSuccess({
        id: crypto.randomUUID(),
        type,
        subject: subject || null,
        content,
        sentAt: new Date(),
        Instructor: { User: { name: "Deg" } },
      });

      setSubject("");
      setContent("");
      setType("NOTE");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-grey-900)]">Ny loggoppforing</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-[var(--color-grey-400)] hover:text-[var(--color-grey-700)] transition-colors"
          aria-label="Lukk skjema"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Type-velger */}
      <div className="relative">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as CommunicationType)}
          className="w-full appearance-none pl-3 pr-8 py-2 text-sm border border-[var(--color-grey-200)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)]"
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-grey-400)]" />
      </div>

      {/* Emne (valgfritt) */}
      <input
        type="text"
        placeholder="Emne (valgfritt)"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-[var(--color-grey-200)] rounded-lg bg-white placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)]"
      />

      {/* Innhold */}
      <textarea
        required
        placeholder="Skriv innhold..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 text-sm border border-[var(--color-grey-200)] rounded-lg bg-white placeholder:text-[var(--color-grey-400)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-900)]/20 focus:border-[var(--color-grey-900)]"
      />

      {feil && (
        <p className="text-xs text-[var(--color-error)]">{feil}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-grey-900)] rounded-lg hover:bg-[var(--color-grey-900)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Lagrer..." : "Lagre"}
        </button>
      </div>
    </form>
  );
}

// ----------------------------------------------------------------
// Hovdkomponent
// ----------------------------------------------------------------

export function CommunicationLog({
  studentId,
  initialLogs,
}: CommunicationLogProps) {
  const [logs, setLogs] = useState<CommunicationEntry[]>(initialLogs);
  const [visSkjema, setVisSkjema] = useState(false);

  function handleNyLogg(entry: CommunicationEntry) {
    setLogs((prev) => [entry, ...prev]);
    setVisSkjema(false);
  }

  return (
    <div className="space-y-4">
      {/* Header med knapp */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-grey-500)]">
          {logs.length === 0
            ? "Ingen loggoppforinger enda"
            : `${logs.length} oppforing${logs.length !== 1 ? "er" : ""}`}
        </p>
        {!visSkjema && (
          <button
            onClick={() => setVisSkjema(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-grey-900)] border border-[var(--color-grey-300)] rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Ny oppforing
          </button>
        )}
      </div>

      {/* Ny logg-skjema */}
      {visSkjema && (
        <NyLoggForm
          studentId={studentId}
          onSuccess={handleNyLogg}
          onCancel={() => setVisSkjema(false)}
        />
      )}

      {/* Liste */}
      {logs.length === 0 && !visSkjema ? (
        <div className="text-center py-8">
          <p className="text-sm text-[var(--color-grey-400)]">
            Ingen kommunikasjon registrert for denne eleven enda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const config = TYPE_CONFIG[log.type];
            return (
              <div
                key={log.id}
                className="bg-white rounded-xl border border-[var(--color-grey-200)] p-4"
              >
                <div className="flex items-start gap-3">
                  {/* Type-ikon */}
                  <div
                    className={`mt-0.5 flex items-center justify-center w-7 h-7 rounded-full border ${config.bg} ${config.border} flex-shrink-0`}
                  >
                    <span className={config.text}>{config.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Rad 1: type-merke + dato + instruktor */}
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                      >
                        {config.label}
                      </span>
                      <span className="text-xs text-[var(--color-grey-400)]">
                        {format(new Date(log.sentAt), "d. MMM yyyy HH:mm", {
                          locale: nb,
                        })}
                      </span>
                      {log.Instructor?.User?.name && (
                        <span className="text-xs text-[var(--color-grey-400)]">
                          av {log.Instructor.User.name}
                        </span>
                      )}
                    </div>

                    {/* Emne */}
                    {log.subject && (
                      <p className="text-sm font-medium text-[var(--color-grey-900)] mb-1">
                        {log.subject}
                      </p>
                    )}

                    {/* Innhold */}
                    {log.content && (
                      <p className="text-sm text-[var(--color-grey-600)] whitespace-pre-wrap">
                        {log.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
