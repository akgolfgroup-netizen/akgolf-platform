"use client";

/**
 * DataConsentDialog — overlay med portal-consent-flyt.
 * Bruker design-system tokens, shadow-card-hover-deep.
 */

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { MonoLabel } from "@/components/portal/patterns";
import { recordDataConsent } from "../actions";

interface DataConsentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DataConsentDialog({ open, onClose }: DataConsentDialogProps) {
  const [tests, setTests] = useState(true);
  const [training, setTraining] = useState(true);
  const [level, setLevel] = useState(true);
  const [coachSharing, setCoachSharing] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await recordDataConsent({ tests, training, level, coachSharing });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-success-light text-success-text shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <MonoLabel size="xs" uppercase className="text-primary block">
              GDPR
            </MonoLabel>
            <h2 className="text-lg font-semibold text-grey-900 mt-1">
              Samtykke til datainnsamling
            </h2>
            <p className="mt-1 text-sm text-grey-500">
              For å gi deg bedre coaching samler vi inn og analyserer data fra
              treningen din. Du kan trekke samtykket når som helst.
            </p>
          </div>
        </div>

        <div className="space-y-1 py-4 border-y border-grey-100">
          <ConsentRow
            checked={tests}
            onChange={setTests}
            label="Testresultater"
            description="Resultater fra TrackMan og manuelle tester."
          />
          <ConsentRow
            checked={training}
            onChange={setTraining}
            label="Treningslogg og aktivitet"
            description="Øktene du registrerer og treningsplanfølging."
          />
          <ConsentRow
            checked={level}
            onChange={setLevel}
            label="Beregnet spillernivå"
            description="A–K-kategori, USI, gap-analyse og prognose."
          />
          <ConsentRow
            checked={coachSharing}
            onChange={setCoachSharing}
            label="Deling med min coach"
            description="Tilknyttet coach ser kartleggingen din for å gi tilpasset opplegg."
          />
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-error-light px-3 py-2 text-xs text-error-text">
            {error}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between gap-3">
          <a
            href="/personvern"
            target="_blank"
            className="text-xs text-primary hover:underline"
          >
            Les personvernerklæring
          </a>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Senere
            </Button>
            <Button onClick={handleSubmit} isLoading={submitting}>
              Godkjenn
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentRow({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3 py-2.5 cursor-pointer hover:bg-grey-50 rounded-lg px-2 -mx-2 transition-colors">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-primary"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div>
        <div className="text-sm font-medium text-grey-900">{label}</div>
        <div className="text-xs text-grey-500 mt-0.5">{description}</div>
      </div>
    </label>
  );
}
