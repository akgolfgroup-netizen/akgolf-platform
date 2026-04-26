"use client";

/**
 * PlanCreatorModal — wizard for å lage ny treningsplan.
 *
 * Steg 1: Velg modus (Manuell / Anbefaling / Standard)
 *         - Hvis Standard: vis valg av mal-kort
 * Steg 2: Velg tidsperspektiv (1/4/8/12 uker) + bekreft
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ChoiceboxGroup } from "@/components/ui/choicebox";
import { SegmentedButtonGroup } from "@/components/ui/segmented-button-group";
import {
  STANDARD_TEMPLATES,
  DURATION_OPTIONS,
  type TemplateId,
} from "@/lib/portal/training/standard-templates";
import {
  createPlanFromChoice,
  type PlanCreationMode,
} from "@/app/portal/(dashboard)/treningsplan/actions";

type Step = "mode" | "template" | "duration";

interface Props {
  open: boolean;
  onClose: () => void;
}

const MODE_OPTIONS: Array<{
  value: PlanCreationMode;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}> = [
  {
    value: "RECOMMENDED",
    title: "Anbefalt for meg",
    description:
      "Vi lager en plan basert på din spillerprofil, handicap og fokusområder.",
    iconName: "auto_awesome",
    badge: "AI",
  },
  {
    value: "TEMPLATE",
    title: "Velg en standardplan",
    description:
      "Forhåndsdefinerte planer for putting, kort spill, allround og konkurranseprep.",
    iconName: "menu_book",
  },
  {
    value: "MANUAL",
    title: "Bygg selv",
    description:
      "Start med en tom kalender og legg inn økter manuelt etter eget ønske.",
    iconName: "edit_calendar",
  },
];

export function PlanCreatorModal({ open, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<PlanCreationMode>("RECOMMENDED");
  const [templateId, setTemplateId] = useState<TemplateId>("allround");
  const [duration, setDuration] = useState<string>("4");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setStep("mode");
    setMode("RECOMMENDED");
    setTemplateId("allround");
    setDuration("4");
    setError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleNext = () => {
    setError(null);
    if (step === "mode") {
      if (mode === "TEMPLATE") setStep("template");
      else setStep("duration");
    } else if (step === "template") {
      setStep("duration");
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === "duration") {
      if (mode === "TEMPLATE") setStep("template");
      else setStep("mode");
    } else if (step === "template") {
      setStep("mode");
    }
  };

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      try {
        const result = await createPlanFromChoice({
          mode,
          durationWeeks: Number(duration) as 1 | 4 | 8 | 12,
          templateId: mode === "TEMPLATE" ? templateId : undefined,
        });
        if (result.success) {
          handleClose();
          router.refresh();
        } else {
          setError("Kunne ikke opprette plan. Prøv igjen.");
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Ukjent feil");
      }
    });
  };

  const stepTitle = {
    mode: "Hvordan vil du lage planen?",
    template: "Velg en standardplan",
    duration: "Hvor lang skal planen være?",
  }[step];

  const stepNumber = step === "mode" ? 1 : step === "template" ? 2 : mode === "TEMPLATE" ? 3 : 2;
  const totalSteps = mode === "TEMPLATE" ? 3 : 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-creator-title"
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl bg-surface shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant px-8 py-6">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Steg {stepNumber} av {totalSteps}
            </span>
            <h2
              id="plan-creator-title"
              className="font-headline text-2xl font-bold tracking-tight text-on-surface"
            >
              {stepTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
            aria-label="Lukk"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {step === "mode" && (
            <ChoiceboxGroup
              type="radio"
              value={mode}
              onChange={(v) => setMode(v as PlanCreationMode)}
            >
              {MODE_OPTIONS.map((opt) => (
                <ChoiceboxGroup.Item
                  key={opt.value}
                  value={opt.value}
                  title={opt.title}
                  description={opt.description}
                  iconName={opt.iconName}
                  badge={opt.badge}
                />
              ))}
            </ChoiceboxGroup>
          )}

          {step === "template" && (
            <ChoiceboxGroup
              type="radio"
              value={templateId}
              onChange={(v) => setTemplateId(v as TemplateId)}
            >
              {STANDARD_TEMPLATES.map((t) => (
                <ChoiceboxGroup.Item
                  key={t.id}
                  value={t.id}
                  title={t.title}
                  description={`${t.description} (${t.weekPattern.length} økter/uke)`}
                  iconName={t.iconName}
                  badge={t.badge}
                />
              ))}
            </ChoiceboxGroup>
          )}

          {step === "duration" && (
            <div className="flex flex-col items-center gap-8 py-4">
              <div className="flex justify-center">
                <SegmentedButtonGroup
                  options={DURATION_OPTIONS}
                  selected={duration}
                  onChange={setDuration}
                  size="lg"
                />
              </div>
              <div className="rounded-2xl bg-surface-container-low p-6 text-center">
                <p className="font-body text-sm text-on-surface-variant">
                  Du oppretter en{" "}
                  <span className="font-semibold text-on-surface">
                    {duration === "1" ? "1 uke" : `${duration} ukers`}
                  </span>{" "}
                  plan{" "}
                  {mode === "TEMPLATE" && (
                    <>
                      basert på{" "}
                      <span className="font-semibold text-on-surface">
                        {STANDARD_TEMPLATES.find((t) => t.id === templateId)?.title}
                      </span>
                    </>
                  )}
                  {mode === "RECOMMENDED" && (
                    <>generert av AI basert på din profil</>
                  )}
                  {mode === "MANUAL" && <>med tom kalender</>}.
                </p>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-error-container/30 p-3 text-sm text-error">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-outline-variant bg-surface-container-low px-8 py-4">
          {step !== "mode" ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-body text-sm font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
            >
              <Icon name="arrow_back" size={16} />
              Tilbake
            </button>
          ) : (
            <span />
          )}

          {step === "duration" ? (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-on-primary shadow-card transition-all hover:bg-primary-container hover:shadow-card-hover disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Icon name="progress_activity" size={18} className="animate-spin" />
                  {mode === "RECOMMENDED" ? "Genererer din personlige plan…" : "Oppretter…"}
                </>
              ) : (
                <>
                  {mode === "RECOMMENDED" ? "Generer plan med AI" : "Opprett plan"}
                  <Icon name="arrow_forward" size={18} />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-semibold text-on-primary shadow-card transition-all hover:bg-primary-container hover:shadow-card-hover"
            >
              Neste
              <Icon name="arrow_forward" size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
