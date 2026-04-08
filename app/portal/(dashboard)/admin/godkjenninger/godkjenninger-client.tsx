"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Check,
  X,
  User,
  CreditCard,
  Loader2,
  CheckCircle,
  MapPin,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

interface PendingItem {
  id: string;
  type: "booking" | "plan" | "activity";
  studentName: string;
  studentEmail: string;
  serviceName: string;
  price: number;
  requestedTime: Date;
  createdAt: Date;
  facilityName?: string;
  activityType?: string;
  conflictNote?: string | null;
}

interface GodkjenningerClientProps {
  pendingItems: PendingItem[];
}

// Mock actions
async function approveBooking(id: string) {
  await new Promise(r => setTimeout(r, 500));
  return { success: true };
}

async function rejectBooking(id: string) {
  await new Promise(r => setTimeout(r, 500));
  return { success: true };
}

async function approveActivity(id: string) {
  await new Promise(r => setTimeout(r, 500));
  return { success: true };
}

async function rejectActivity(id: string) {
  await new Promise(r => setTimeout(r, 500));
  return { success: true };
}

export function GodkjenningerClient({ pendingItems }: GodkjenningerClientProps) {
  const { toggle } = useMCSidebar();
  const [items, setItems] = useState(pendingItems);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string, type: string) => {
    setProcessingId(id);
    const result = type === "activity"
      ? await approveActivity(id)
      : await approveBooking(id);
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string, type: string) => {
    setProcessingId(id);
    const result = type === "activity"
      ? await rejectActivity(id)
      : await rejectBooking(id);
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    setProcessingId(null);
  };

  if (items.length === 0) {
    return (
      <>
        <MCTopbar
          title="Godkjenninger"
          subtitle="Ingen ventende godkjenninger"
          onMenuClick={toggle}
        />
        <div className="p-5">
          <div className="hg-card py-20 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-[var(--hg-success)] opacity-50" />
            <h2 className="text-xl font-semibold text-[var(--hg-text)] mb-2">
              Alt er godkjent!
            </h2>
            <p className="text-[var(--hg-text-muted)]">
              Du har ingen ventende godkjenninger
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MCTopbar
        title="Godkjenninger"
        subtitle={`${items.length} ventende godkjenning${items.length === 1 ? "" : "er"}`}
        onMenuClick={toggle}
      />

      <div className="p-5 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="hg-card p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    item.type === "activity"
                      ? "text-[var(--hg-primary)] bg-[var(--hg-primary)]/10"
                      : "text-[var(--hg-warning)] bg-[var(--hg-warning)]/10"
                  )}>
                    {item.type === "activity" ? "Aktivitet" : "Booking"}
                  </span>
                  <span className="text-xs text-[var(--hg-text-muted)]">
                    {format(new Date(item.createdAt), "d. MMM 'kl.' HH:mm", { locale: nb })}
                  </span>
                </div>

                {/* Main Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center",
                    item.type === "activity" 
                      ? "bg-[var(--hg-primary)]/10" 
                      : "bg-[var(--hg-surface-raised)]"
                  )}>
                    {item.type === "activity" ? (
                      <MapPin className="h-5 w-5 text-[var(--hg-primary)]" />
                    ) : (
                      <User className="h-5 w-5 text-[var(--hg-text-muted)]" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--hg-text)]">
                      {item.type === "activity" ? item.serviceName : item.studentName}
                    </p>
                    <p className="text-sm text-[var(--hg-text-muted)]">
                      {item.type === "activity"
                        ? `Opprettet av ${item.studentName}`
                        : item.studentEmail}
                    </p>
                  </div>
                </div>

                {/* Conflict Note */}
                {item.type === "activity" && item.conflictNote && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--hg-warning)]/10 text-[var(--hg-warning)] text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {item.conflictNote}
                  </div>
                )}

                {/* Details Grid */}
                <div className={cn(
                  "grid gap-4 text-sm",
                  item.type === "activity" ? "grid-cols-2" : "grid-cols-3"
                )}>
                  {item.type === "activity" ? (
                    <>
                      <div>
                        <p className="text-[var(--hg-text-muted)] mb-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Fasilitet
                        </p>
                        <p className="text-[var(--hg-text)]">{item.facilityName ?? "Ukjent"}</p>
                      </div>
                      <div>
                        <p className="text-[var(--hg-text-muted)] mb-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Tidspunkt
                        </p>
                        <p className="text-[var(--hg-text)]">
                          {format(new Date(item.requestedTime), "d. MMM 'kl.' HH:mm", { locale: nb })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-[var(--hg-text-muted)] mb-1">Tjeneste</p>
                        <p className="text-[var(--hg-text)]">{item.serviceName}</p>
                      </div>
                      <div>
                        <p className="text-[var(--hg-text-muted)] mb-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Ønsket tid
                        </p>
                        <p className="text-[var(--hg-text)]">
                          {format(new Date(item.requestedTime), "d. MMM 'kl.' HH:mm", { locale: nb })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--hg-text-muted)] mb-1 flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" />
                          Pris
                        </p>
                        <p className="text-[var(--hg-text)]">
                          {item.price.toLocaleString("nb-NO")} kr
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <button
                  onClick={() => handleApprove(item.id, item.type)}
                  disabled={processingId === item.id}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm bg-[var(--hg-primary)] text-[var(--hg-bg)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Godkjenn
                </button>
                <button
                  onClick={() => handleReject(item.id, item.type)}
                  disabled={processingId === item.id}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:bg-[var(--hg-error)]/10 hover:text-[var(--hg-error)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                  Avvis
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
