"use client";

import { useEffect, useState, useTransition } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui";
import {
  AdminInput,
  useToast,
} from "@/components/portal/mission-control/ui";
import {
  listTemplatesForGroupPlan,
  createGroupPlanFromTemplate,
  type TemplateOption,
} from "@/app/admin/(authed)/grupper/plan-actions";

interface GroupPlanPanelProps {
  groupId: string;
  hasActivePlan: boolean;
  onPlanCreated: () => void;
}

const WEEK_OPTIONS = [1, 4, 8, 12] as const;

function nextMondayIso(): string {
  const d = new Date();
  const day = d.getDay(); // 0=søn, 1=man
  const offset = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function GroupPlanPanel({
  groupId,
  hasActivePlan,
  onPlanCreated,
}: GroupPlanPanelProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);

  // Form-state
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [weeks, setWeeks] = useState<number>(4);
  const [startDate, setStartDate] = useState<string>(nextMondayIso());
  const [customTitle, setCustomTitle] = useState("");

  useEffect(() => {
    listTemplatesForGroupPlan().then(setTemplates).catch(() => {});
  }, []);

  function handleCreate() {
    if (!selectedTemplate) {
      toast({ variant: "error", title: "Velg en mal" });
      return;
    }

    startTransition(async () => {
      try {
        await createGroupPlanFromTemplate({
          groupId,
          templateId: selectedTemplate,
          weeks,
          startDate,
          title: customTitle.trim() || undefined,
        });
        toast({
          variant: "success",
          title: hasActivePlan ? "Plan erstattet" : "Plan opprettet",
          description:
            "Bruk \"Synkroniser til medlemmer\"-fanen for å distribuere planen.",
        });
        setShowForm(false);
        setSelectedTemplate("");
        setCustomTitle("");
        onPlanCreated();
      } catch (err) {
        toast({
          variant: "error",
          title: "Kunne ikke opprette plan",
          description: err instanceof Error ? err.message : "Ukjent feil",
        });
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-on-surface">
          Gruppeplan
        </h3>
        <Button
          variant="accent"
          onClick={() => setShowForm((v) => !v)}
          disabled={isPending}
        >
          <Icon name={showForm ? "close" : "add"} className="w-4 h-4" />
          {showForm
            ? "Avbryt"
            : hasActivePlan
              ? "Erstatt plan"
              : "Lag plan fra mal"}
        </Button>
      </div>

      {!hasActivePlan && !showForm ? (
        <p className="text-sm text-on-surface-variant">
          Gruppen har ingen aktiv plan. Velg en mal for å lage en — planen kan
          deretter distribueres til alle medlemmene.
        </p>
      ) : null}

      {showForm ? (
        <div className="rounded-lg border border-outline-variant/30 p-4 space-y-4 bg-surface">
          {hasActivePlan ? (
            <div className="alert warn" style={{ fontSize: 13, padding: 8, background: "#F6ECD9", borderRadius: 6, color: "#C48A32" }}>
              Erstatter eksisterende plan. Den gamle deaktiveres, men slettes
              ikke.
            </div>
          ) : null}

          <div>
            <label className="text-xs text-on-surface-variant block mb-2">
              Mal
            </label>
            <div className="space-y-2">
              {templates.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTemplate === t.id
                      ? "border-on-surface bg-surface-container"
                      : "border-outline-variant/30 hover:bg-surface-container/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="template"
                    value={t.id}
                    checked={selectedTemplate === t.id}
                    onChange={() => setSelectedTemplate(t.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-sm text-on-surface">
                        {t.title}
                      </strong>
                      {t.badge ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-on-surface text-surface">
                          {t.badge}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      {t.description}
                    </p>
                    <p className="text-xs text-on-surface-variant/70 mt-1">
                      {t.weeksAvailable} økter per uke · kilde: {t.source === "db" ? "DB" : "fallback"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-on-surface-variant block mb-1">
                Antall uker
              </label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface"
              >
                {WEEK_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w} uke{w === 1 ? "" : "r"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="plan-start"
                className="text-xs text-on-surface-variant block mb-1"
              >
                Startdato (mandag)
              </label>
              <AdminInput
                id="plan-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="plan-title"
              className="text-xs text-on-surface-variant block mb-1"
            >
              Egen tittel (valgfritt)
            </label>
            <AdminInput
              id="plan-title"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="La stå tomt for å bruke malens tittel"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowForm(false)}
              disabled={isPending}
            >
              Avbryt
            </Button>
            <Button
              variant="accent"
              onClick={handleCreate}
              isLoading={isPending}
              disabled={!selectedTemplate}
            >
              {hasActivePlan ? "Erstatt plan" : "Opprett plan"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
