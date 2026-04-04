"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ActivityForm, type ActivityFormData, ConflictApprovalDialog } from "@/components/portal/admin/facility";
import { createActivity } from "../actions";

interface ConflictingItem {
  type: "booking" | "activity";
  id: string;
  title: string;
  startTime: Date | string;
  endTime: Date | string;
}

export default function NyAktivitetPage() {
  const router = useRouter();
  const [facilities, setFacilities] = useState<Array<{ id: string; name: string; slug: string; Location?: { id: string; name: string } }>>([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [conflicts, setConflicts] = useState<ConflictingItem[]>([]);
  const [pendingData, setPendingData] = useState<ActivityFormData | null>(null);

  // Fetch facilities on mount
  useState(() => {
    fetch("/api/portal/facilities")
      .then((res) => res.json())
      .then((data) => {
        setFacilities(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  });

  const handleSubmit = async (data: ActivityFormData) => {
    const result = await createActivity(data);

    if (result.hasConflict && result.conflicts && result.conflicts.length > 0) {
      // Hvis det er konflikter og bruker ikke er admin, vis dialog
      setConflicts(result.conflicts as ConflictingItem[]);
      setPendingData(data);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/portal/admin/fasiliteter");
    }, 1500);
  };

  const handleConflictConfirm = async () => {
    if (!pendingData) return;

    // Aktiviteten er allerede opprettet med PENDING status
    // Bruker trenger ikke gjøre noe mer
    setConflicts([]);
    setPendingData(null);
    setSuccess(true);
    setTimeout(() => {
      router.push("/portal/admin/fasiliteter");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-[var(--color-grey-300)] border-t-[var(--color-grey-900)] rounded-full" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-[var(--color-success)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-grey-900)]">
          Aktivitet opprettet!
        </h2>
        <p className="text-[var(--color-grey-500)] mt-2">
          {conflicts.length > 0
            ? "Aktiviteten er sendt til godkjenning."
            : "Aktiviteten er lagt til i kalenderen."}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/portal/admin/fasiliteter"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til fasiliteter
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Opprett ny aktivitet
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Legg til en turnering, kurs, eller annen aktivitet i kalenderen
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
        <ActivityForm
          facilities={facilities}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/portal/admin/fasiliteter")}
        />
      </div>

      {/* Conflict dialog */}
      <ConflictApprovalDialog
        isOpen={conflicts.length > 0}
        activityTitle={pendingData?.title ?? ""}
        conflicts={conflicts}
        onConfirm={handleConflictConfirm}
        onCancel={() => {
          setConflicts([]);
          setPendingData(null);
        }}
      />
    </div>
  );
}
