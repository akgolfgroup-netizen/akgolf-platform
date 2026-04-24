"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import { AdminDialog, AdminInput } from "@/components/portal/coach-hq/ui";
import { Button } from "@/components/ui";
import { confirmSensitiveAction } from "../actions";

interface SensitiveAuthPromptProps {
  open: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export function SensitiveAuthPrompt({
  open,
  onClose,
  onConfirmed,
}: SensitiveAuthPromptProps) {
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await confirmSensitiveAction(password);
      setPassword("");
      onConfirmed();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bekreftelse feilet.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title="Bekreft identitet"
      description="Denne handlingen påvirker tilganger. Skriv inn passordet ditt for å fortsette. Bekreftelsen gjelder i 15 minutter."
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={submitting}
            disabled={password.length === 0}
          >
            Bekreft
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg bg-warning-light px-4 py-3">
          <Icon name="gpp_maybe" className="h-4 w-4 mt-0.5 text-warning-text" />
          <div className="text-xs text-warning-text">
            Kritisk handling. Alle tildelinger og tilbaketrekninger
            audit-logges med bruker-ID og tidspunkt.
          </div>
        </div>

        <AdminInput
          label="Passord"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && password.length > 0) handleSubmit();
          }}
        />

        {error && (
          <div className="rounded-lg bg-error-light px-4 py-2 text-xs text-error-text">
            {error}
          </div>
        )}
      </div>
    </AdminDialog>
  );
}
