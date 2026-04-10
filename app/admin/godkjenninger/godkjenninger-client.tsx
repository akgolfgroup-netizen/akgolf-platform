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
} from "lucide-react";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";
import {
  approveBooking,
  rejectBooking,
  approveActivity,
  rejectActivity,
} from "./actions";

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

export function GodkjenningerClient({ pendingItems }: GodkjenningerClientProps) {
  const { toggle } = useMCSidebar();
  const [items, setItems] = useState<PendingItem[]>(pendingItems);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string, type: string) => {
    setProcessingId(id);
    const result =
      type === "activity" ? await approveActivity(id) : await approveBooking(id);
    if (result.success) {
      setItems((prev: PendingItem[]) =>
        prev.filter((item: PendingItem) => item.id !== id),
      );
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string, type: string) => {
    setProcessingId(id);
    const result =
      type === "activity" ? await rejectActivity(id) : await rejectBooking(id);
    if (result.success) {
      setItems((prev: PendingItem[]) =>
        prev.filter((item: PendingItem) => item.id !== id),
      );
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
          <AdminEmptyState
            icon={<CheckCircle className="h-6 w-6" />}
            title="Alt er godkjent"
            description="Du har ingen ventende godkjenninger"
          />
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
        {items.map((item: PendingItem) => (
          <AdminCard key={item.id}>
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                  <AdminBadge
                    variant={item.type === "activity" ? "info" : "warning"}
                  >
                    {item.type === "activity" ? "Aktivitet" : "Booking"}
                  </AdminBadge>
                  <span className="text-xs text-[var(--color-muted)]">
                    {format(new Date(item.createdAt), "d. MMM 'kl.' HH:mm", {
                      locale: nb,
                    })}
                  </span>
                </div>

                {/* Main Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={
                      item.type === "activity"
                        ? "h-10 w-10 rounded-full flex items-center justify-center bg-[var(--color-primary)]/10"
                        : "h-10 w-10 rounded-full flex items-center justify-center bg-[var(--color-grey-100)]"
                    }
                  >
                    {item.type === "activity" ? (
                      <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
                    ) : (
                      <User className="h-5 w-5 text-[var(--color-muted)]" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">
                      {item.type === "activity"
                        ? item.serviceName
                        : item.studentName}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {item.type === "activity"
                        ? `Opprettet av ${item.studentName}`
                        : item.studentEmail}
                    </p>
                  </div>
                </div>

                {/* Conflict Note */}
                {item.type === "activity" && item.conflictNote && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[var(--color-warning)]/10 text-[var(--color-warning)] text-sm">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    {item.conflictNote}
                  </div>
                )}

                {/* Details Grid */}
                <div
                  className={
                    item.type === "activity"
                      ? "grid gap-4 text-sm grid-cols-2"
                      : "grid gap-4 text-sm grid-cols-3"
                  }
                >
                  {item.type === "activity" ? (
                    <>
                      <div>
                        <p className="text-[var(--color-muted)] mb-1 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          Fasilitet
                        </p>
                        <p className="text-[var(--color-text)]">
                          {item.facilityName ?? "Ukjent"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--color-muted)] mb-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Tidspunkt
                        </p>
                        <p className="text-[var(--color-text)]">
                          {format(
                            new Date(item.requestedTime),
                            "d. MMM 'kl.' HH:mm",
                            { locale: nb },
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <p className="text-[var(--color-muted)] mb-1">Tjeneste</p>
                        <p className="text-[var(--color-text)]">
                          {item.serviceName}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--color-muted)] mb-1 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Ønsket tid
                        </p>
                        <p className="text-[var(--color-text)]">
                          {format(
                            new Date(item.requestedTime),
                            "d. MMM 'kl.' HH:mm",
                            { locale: nb },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[var(--color-muted)] mb-1 flex items-center gap-1">
                          <CreditCard className="h-3.5 w-3.5" />
                          Pris
                        </p>
                        <p className="text-[var(--color-text)]">
                          {item.price.toLocaleString("nb-NO")} kr
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col gap-2">
                <AdminButton
                  variant="primary"
                  onClick={() => handleApprove(item.id, item.type)}
                  loading={processingId === item.id}
                  icon={<Check className="h-4 w-4" />}
                >
                  Godkjenn
                </AdminButton>
                <AdminButton
                  variant="secondary"
                  onClick={() => handleReject(item.id, item.type)}
                  disabled={processingId === item.id}
                  icon={<X className="h-4 w-4" />}
                >
                  Avvis
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>
    </>
  );
}
