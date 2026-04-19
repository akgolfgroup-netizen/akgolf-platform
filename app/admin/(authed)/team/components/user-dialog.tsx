"use client";

import { useEffect, useMemo, useState } from "react";
import { UserRole, type Capability } from "@prisma/client";
import {
  AdminDialog,
  AdminInput,
  AdminSelect,
} from "@/components/portal/mission-control/ui";
import { Button } from "@/components/ui";
import { CAPABILITY_PRESETS } from "@/lib/portal/capabilities";
import { CapabilityChecklist } from "./capability-checklist";

export type UserDialogMode = "create" | "edit";

export interface UserDialogValues {
  email: string;
  name: string;
  role: UserRole;
  presetId: string | "custom";
  capabilities: Capability[];
}

interface UserDialogProps {
  mode: UserDialogMode;
  open: boolean;
  onClose: () => void;
  initialValues?: Partial<UserDialogValues>;
  onSubmit: (values: UserDialogValues) => Promise<void> | void;
  submitLabel?: string;
  canAssignRole?: boolean;
  canAssignCapabilities?: boolean;
}

export function UserDialog({
  mode,
  open,
  onClose,
  initialValues,
  onSubmit,
  submitLabel,
  canAssignRole = true,
  canAssignCapabilities = true,
}: UserDialogProps) {
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [role, setRole] = useState<UserRole>(
    initialValues?.role ?? UserRole.INSTRUCTOR
  );
  const [presetId, setPresetId] = useState<string>(
    initialValues?.presetId ?? "custom"
  );
  const [capabilities, setCapabilities] = useState<Capability[]>(
    initialValues?.capabilities ?? []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail(initialValues?.email ?? "");
      setName(initialValues?.name ?? "");
      setRole(initialValues?.role ?? UserRole.INSTRUCTOR);
      setPresetId(initialValues?.presetId ?? "custom");
      setCapabilities(initialValues?.capabilities ?? []);
      setError(null);
    }
  }, [open, initialValues]);

  const presetOptions = useMemo(
    () => [
      { value: "custom", label: "Egendefinert" },
      ...CAPABILITY_PRESETS.map((p) => ({ value: p.id, label: p.label })),
    ],
    []
  );

  function handlePresetChange(next: string) {
    setPresetId(next);
    if (next !== "custom") {
      const preset = CAPABILITY_PRESETS.find((p) => p.id === next);
      if (preset) setCapabilities([...preset.capabilities]);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ email, name, role, presetId, capabilities });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt.");
    } finally {
      setSubmitting(false);
    }
  }

  const title = mode === "create" ? "Inviter ny bruker" : "Rediger bruker";
  const defaultSubmitLabel =
    mode === "create" ? "Send invitasjon" : "Lagre endringer";

  return (
    <AdminDialog
      open={open}
      onClose={onClose}
      title={title}
      description="Sett rolle, velg preset-mal og juster hvilke funksjoner brukeren har tilgang til."
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSubmit} isLoading={submitting}>
            {submitLabel ?? defaultSubmitLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {mode === "create" && (
          <div className="grid gap-3 md:grid-cols-2">
            <AdminInput
              label="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="navn@akgolf.no"
            />
            <AdminInput
              label="Navn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fullt navn"
            />
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <AdminSelect
            label="Primærrolle"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={!canAssignRole}
          >
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.INSTRUCTOR}>Trener</option>
            <option value={UserRole.INVITED}>Begrenset (INVITED)</option>
          </AdminSelect>
          <AdminSelect
            label="Preset-mal"
            value={presetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            disabled={!canAssignCapabilities}
          >
            {presetOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </AdminSelect>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-3">
            Kapabiliteter ({capabilities.length} valgt)
          </h3>
          <CapabilityChecklist
            value={capabilities}
            onChange={(next) => {
              setCapabilities(next);
              setPresetId("custom");
            }}
            disabled={!canAssignCapabilities}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-error-light px-4 py-3 text-sm text-error-text">
            {error}
          </div>
        )}
      </div>
    </AdminDialog>
  );
}
