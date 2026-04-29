"use client";

import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui";
import {
  AdminInput,
  useToast,
} from "@/components/portal/mission-control/ui";
import {
  listGroupSessions,
  createGroupSession,
  deleteGroupSession,
  type GroupSessionRow,
} from "@/app/admin/(authed)/grupper/session-actions";

interface GroupSessionsPanelProps {
  groupId: string;
}

const RECURRENCE_PRESETS: Array<{
  label: string;
  rule: string;
  hint: string;
}> = [
  { label: "Hver mandag", rule: "FREQ=WEEKLY;BYDAY=MO", hint: "Ukentlig" },
  { label: "Hver tirsdag", rule: "FREQ=WEEKLY;BYDAY=TU", hint: "Ukentlig" },
  { label: "Hver onsdag", rule: "FREQ=WEEKLY;BYDAY=WE", hint: "Ukentlig" },
  { label: "Hver torsdag", rule: "FREQ=WEEKLY;BYDAY=TH", hint: "Ukentlig" },
  { label: "Hver fredag", rule: "FREQ=WEEKLY;BYDAY=FR", hint: "Ukentlig" },
  { label: "Hver lørdag", rule: "FREQ=WEEKLY;BYDAY=SA", hint: "Ukentlig" },
  {
    label: "Annenhver onsdag",
    rule: "FREQ=WEEKLY;BYDAY=WE;INTERVAL=2",
    hint: "Hver 2. uke",
  },
  {
    label: "Første mandag i måneden",
    rule: "FREQ=MONTHLY;BYDAY=1MO",
    hint: "Månedlig",
  },
  { label: "Engang (ikke gjentakende)", rule: "", hint: "Singleton" },
];

function formatDateTime(d: Date): string {
  return d.toLocaleString("nb-NO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function describeRRule(rule: string | null, until: Date | null): string {
  if (!rule) return "Engang";
  const preset = RECURRENCE_PRESETS.find((p) => p.rule === rule);
  const base = preset ? preset.label : rule;
  if (until) {
    return `${base}, til ${until.toLocaleDateString("nb-NO")}`;
  }
  return base;
}

export function GroupSessionsPanel({ groupId }: GroupSessionsPanelProps) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<GroupSessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  // Skjema-state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("18:30");
  const [recurrenceRule, setRecurrenceRule] = useState(RECURRENCE_PRESETS[0].rule);
  const [recurrenceUntil, setRecurrenceUntil] = useState("");

  async function reload() {
    setLoading(true);
    try {
      const data = await listGroupSessions(groupId);
      setSessions(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [groupId]); // eslint-disable-line react-hooks/exhaustive-deps

  function resetForm() {
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("17:00");
    setEndTime("18:30");
    setRecurrenceRule(RECURRENCE_PRESETS[0].rule);
    setRecurrenceUntil("");
  }

  function handleCreate() {
    if (!title.trim()) {
      toast({ variant: "error", title: "Tittel kreves" });
      return;
    }
    if (!startDate) {
      toast({ variant: "error", title: "Startdato kreves" });
      return;
    }

    const startISO = new Date(`${startDate}T${startTime}:00`).toISOString();
    const endISO = new Date(`${startDate}T${endTime}:00`).toISOString();

    startTransition(async () => {
      try {
        await createGroupSession({
          groupId,
          title,
          description: description || undefined,
          startTime: startISO,
          endTime: endISO,
          recurrenceRule: recurrenceRule || undefined,
          recurrenceUntil: recurrenceUntil
            ? new Date(`${recurrenceUntil}T23:59:59`).toISOString()
            : undefined,
        });
        toast({ variant: "success", title: "Økt opprettet" });
        setShowForm(false);
        resetForm();
        await reload();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke opprette",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  function handleDelete(sessionId: string) {
    if (!confirm("Slette økten? Dette sletter alle planlagte forekomster.")) return;
    startTransition(async () => {
      try {
        await deleteGroupSession(sessionId);
        toast({ variant: "success", title: "Økt slettet" });
        await reload();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke slette",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-on-surface">
          Faste økter
        </h3>
        <Button
          variant="accent"
          onClick={() => setShowForm((v) => !v)}
          disabled={isPending}
        >
          <Icon name={showForm ? "close" : "add"} className="w-4 h-4" />
          {showForm ? "Avbryt" : "Ny økt"}
        </Button>
      </div>

      {showForm ? (
        <div className="rounded-lg border border-outline-variant/30 p-4 space-y-3 bg-surface">
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">
              Tittel
            </label>
            <AdminInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="F.eks. Tirsdagstrening"
            />
          </div>
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">
              Beskrivelse (valgfritt)
            </label>
            <AdminInput
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Vises i kalender"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Første dato
              </label>
              <AdminInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Start
              </label>
              <AdminInput
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Slutt
              </label>
              <AdminInput
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">
              Gjentakelse
            </label>
            <select
              value={recurrenceRule}
              onChange={(e) => setRecurrenceRule(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface"
            >
              {RECURRENCE_PRESETS.map((p) => (
                <option key={p.label} value={p.rule}>
                  {p.label} ({p.hint})
                </option>
              ))}
            </select>
          </div>
          {recurrenceRule ? (
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Slutter (valgfritt)
              </label>
              <AdminInput
                type="date"
                value={recurrenceUntil}
                onChange={(e) => setRecurrenceUntil(e.target.value)}
              />
              <p className="text-xs text-on-surface-variant/70 mt-1">
                La stå tomt for å fortsette uten sluttdato
              </p>
            </div>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
            >
              Avbryt
            </Button>
            <Button variant="accent" onClick={handleCreate} isLoading={isPending}>
              Opprett økt
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-on-surface-variant">Laster...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Ingen økter satt opp ennå. Klikk &quot;Ny økt&quot; for å legge til.
        </p>
      ) : (
        <ul className="space-y-2">
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-outline-variant/30 p-3"
            >
              <div className="flex-1">
                <div className="font-semibold text-on-surface">{s.title}</div>
                {s.description ? (
                  <div className="text-sm text-on-surface-variant">
                    {s.description}
                  </div>
                ) : null}
                <div className="text-xs text-on-surface-variant mt-1">
                  {formatDateTime(new Date(s.startTime))} ·{" "}
                  {describeRRule(s.recurrenceRule, s.recurrenceUntil ? new Date(s.recurrenceUntil) : null)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(s.id)}
                disabled={isPending}
                className="p-1.5 rounded hover:bg-error-light text-on-surface-variant hover:text-error"
                aria-label="Slett økt"
                title="Slett økt"
              >
                <Icon name="delete" className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
