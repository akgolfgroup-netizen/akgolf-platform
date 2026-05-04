"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import {
  AdminDialog,
  AdminInput,
  useToast,
} from "@/components/portal/mission-control/ui";
import {
  createStudent,
  type CreateStudentResult,
} from "./create-actions";

interface NyEleveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (result: CreateStudentResult) => void;
}

export function NyEleveDialog({
  open,
  onOpenChange,
  onCreated,
}: NyEleveDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function reset() {
    setName("");
    setPhone("");
    setEmail("");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setSaving(true);
    try {
      const result = await createStudent({
        name,
        phone,
        email: email.trim() || undefined,
      });

      if (!result.isNewUser) {
        toast({
          variant: "warning",
          title: "Spilleren finnes fra før",
          description: "Denne e-postadressen er allerede registrert.",
        });
      } else if (result.tempPassword) {
        toast({
          variant: "success",
          title: "Spiller opprettet",
          description: `Midlertidig passord: ${result.tempPassword}`,
        });
      } else {
        toast({
          variant: "success",
          title: "Spiller opprettet",
          description: "Mangler e-post — innlogging må settes opp manuelt senere.",
        });
      }

      onCreated(result);
      onOpenChange(false);
      reset();
    } catch (err) {
      const message =
        err instanceof Error
          ? // Zod-feil kommer som JSON-streng — plukk første message hvis mulig
            tryExtractZodMessage(err.message) ?? err.message
          : "Ukjent feil";
      toast({
        variant: "error",
        title: "Kunne ikke opprette spiller",
        description: message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={() => {
        if (!saving) onOpenChange(false);
      }}
      title="Ny spiller"
      description="Oppretter User med rolle STUDENT. Hvis e-post er satt, genereres et midlertidig passord."
      size="md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <AdminInput
          label="Navn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Fullt navn"
          required
          autoFocus
        />

        <AdminInput
          label="Telefon"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="12345678 eller +4712345678"
          helper="8 siffer (norsk) — +47 legges til automatisk."
          required
        />

        <AdminInput
          label="E-post (valgfritt)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="navn@example.no"
          helper="Trengs for innlogging og bekreftelses-e-post."
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            type="button"
          >
            Avbryt
          </Button>
          <Button variant="accent" type="submit" isLoading={saving}>
            Opprett spiller
          </Button>
        </div>
      </form>
    </AdminDialog>
  );
}

function tryExtractZodMessage(raw: string): string | null {
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed[0]?.message) {
      return String(parsed[0].message);
    }
  } catch {
    // ikke JSON — returner null så caller bruker raw
  }
  return null;
}
