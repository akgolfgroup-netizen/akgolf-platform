"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import {
  AdminDialog,
  AdminInput,
  useToast,
} from "@/components/portal/mission-control/ui";
import {
  createServiceType,
  type ServiceTypeRow,
} from "@/app/admin/(authed)/tjenester/actions";
import type { ServiceCategory } from "@prisma/client";

interface NyTjenesteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (created: ServiceTypeRow) => void;
}

const CATEGORIES: Array<{ value: ServiceCategory; label: string }> = [
  { value: "INDIVIDUAL", label: "1:1" },
  { value: "GROUP", label: "Gruppe" },
  { value: "VTG_COURSE", label: "VTG-kurs" },
  { value: "PLAYING_LESSON", label: "Banecoaching" },
  { value: "SIMULATOR", label: "Simulator" },
  { value: "DIGITAL", label: "Digital" },
];

export function NyTjenesteDialog({
  open,
  onOpenChange,
  onCreated,
}: NyTjenesteDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  // Felter
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ServiceCategory>("INDIVIDUAL");
  const [duration, setDuration] = useState("50");
  const [priceKr, setPriceKr] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  function reset() {
    setName("");
    setDescription("");
    setCategory("INDIVIDUAL");
    setDuration("50");
    setPriceKr("");
    setIsRecurring(false);
    setIsPublic(true);
  }

  async function handleSubmit() {
    if (!name.trim()) {
      toast({ variant: "error", title: "Navn kreves" });
      return;
    }
    const dur = parseInt(duration, 10);
    if (!dur || dur <= 0) {
      toast({ variant: "error", title: "Varighet må være større enn 0" });
      return;
    }
    const price = parseFloat(priceKr.replace(",", ".")) || 0;
    if (price < 0) {
      toast({ variant: "error", title: "Pris kan ikke være negativ" });
      return;
    }

    setSaving(true);
    try {
      const result = await createServiceType({
        name: name.trim(),
        description: description.trim() || undefined,
        category,
        duration: dur,
        priceKr: price,
        isRecurring,
        recurringInterval: isRecurring ? "month" : undefined,
        isPublic,
      });

      toast({
        variant: "success",
        title: "Tjeneste opprettet",
        description: "Synkronisert til Stripe",
      });

      // Returnerer minimal mock-row til klient (server rendrer på neste navigasjon)
      onCreated({
        id: result.id,
        name: name.trim(),
        description: description.trim() || null,
        category,
        duration: dur,
        price: Math.round(price),
        isActive: true,
        isPublic,
        isRecurring,
        recurringInterval: isRecurring ? "month" : null,
        stripeProductId: null,
        stripePriceId: null,
        bufferAfter: 15,
        bufferBefore: 0,
        minNoticeHours: 24,
        maxAdvanceDays: 60,
        allowStripe: true,
        allowVipps: true,
        allowInvoice: false,
        sortOrder: 0,
        createdAt: new Date(),
      });

      onOpenChange(false);
      reset();
    } catch (err) {
      toast({
        variant: "error",
        title: "Kunne ikke opprette tjeneste",
        description: err instanceof Error ? err.message : "Ukjent feil",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminDialog
      open={open}
      onClose={() => onOpenChange(false)}
      title="Ny tjeneste"
      description="Opprettelsen lager også et Stripe Product + Price slik at booking-flyten kan trekke betaling automatisk."
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="ny-name"
            className="text-xs text-on-surface-variant block mb-1"
          >
            Navn
          </label>
          <AdminInput
            id="ny-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="F.eks. Performance, Flex 50, Banecoaching 18 hull"
          />
        </div>

        <div>
          <label
            htmlFor="ny-desc"
            className="text-xs text-on-surface-variant block mb-1"
          >
            Beskrivelse (valgfritt)
          </label>
          <AdminInput
            id="ny-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Vises på booking-siden"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-on-surface-variant block mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ServiceCategory)}
              className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-on-surface"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="ny-duration"
              className="text-xs text-on-surface-variant block mb-1"
            >
              Varighet (minutter)
            </label>
            <AdminInput
              id="ny-duration"
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="ny-price"
            className="text-xs text-on-surface-variant block mb-1"
          >
            Pris (kr)
          </label>
          <AdminInput
            id="ny-price"
            type="number"
            min={0}
            step={1}
            value={priceKr}
            onChange={(e) => setPriceKr(e.target.value)}
            placeholder="800"
          />
          <p className="text-xs text-on-surface-variant mt-1">
            {isRecurring
              ? "Trekkes hver måned via Stripe-abonnement"
              : "Engangsbetaling via Stripe Checkout"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
            />
            <span className="text-sm text-on-surface">
              Abonnement (recurring)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="text-sm text-on-surface">
              Synlig i booking-flow
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Avbryt
          </Button>
          <Button variant="accent" onClick={handleSubmit} isLoading={saving}>
            Opprett tjeneste
          </Button>
        </div>
      </div>
    </AdminDialog>
  );
}
