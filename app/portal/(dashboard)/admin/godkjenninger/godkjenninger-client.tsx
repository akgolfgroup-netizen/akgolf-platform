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
import { cn } from "@/lib/utils";
import { approveBooking, rejectBooking, approveActivity, rejectActivity } from "./actions";

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
      <div className="text-center py-16">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-[#34C759] opacity-50" />
        <h2 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">
          Alt er godkjent!
        </h2>
        <p className="text-[var(--color-grey-500)]">
          Du har ingen ventende godkjenninger
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-[var(--color-grey-200)] rounded-xl p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  item.type === "activity"
                    ? "bg-[#007AFF]/10 text-[#007AFF]"
                    : "bg-[#FF9500]/10 text-[#FF9500]"
                )}>
                  {item.type === "activity" ? "Aktivitet" : "Booking"}
                </span>
                <span className="text-xs text-[var(--color-grey-500)]">
                  {format(new Date(item.createdAt), "d. MMM 'kl.' HH:mm", {
                    locale: nb,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  item.type === "activity" ? "bg-[#007AFF]/10" : "bg-[var(--color-grey-100)]"
                )}>
                  {item.type === "activity" ? (
                    <MapPin className="h-5 w-5 text-[#007AFF]" />
                  ) : (
                    <User className="h-5 w-5 text-[var(--color-grey-500)]" />
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-grey-900)]">
                    {item.type === "activity" ? item.serviceName : item.studentName}
                  </p>
                  <p className="text-sm text-[var(--color-grey-500)]">
                    {item.type === "activity"
                      ? `Opprettet av ${item.studentName}`
                      : item.studentEmail}
                  </p>
                </div>
              </div>

              {/* Conflict note for activities */}
              {item.type === "activity" && item.conflictNote && (
                <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[#FF9500]/10 text-[#FF9500] text-sm">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {item.conflictNote}
                </div>
              )}

              <div className={cn(
                "grid gap-4 text-sm",
                item.type === "activity" ? "grid-cols-2" : "grid-cols-3"
              )}>
                {item.type === "activity" ? (
                  <>
                    <div>
                      <p className="text-[var(--color-grey-500)] mb-1 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        Fasilitet
                      </p>
                      <p className="text-[var(--color-grey-900)]">
                        {item.facilityName ?? "Ukjent"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--color-grey-500)] mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Tidspunkt
                      </p>
                      <p className="text-[var(--color-grey-900)]">
                        {format(new Date(item.requestedTime), "d. MMM 'kl.' HH:mm", {
                          locale: nb,
                        })}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-[var(--color-grey-500)] mb-1">Tjeneste</p>
                      <p className="text-[var(--color-grey-900)]">{item.serviceName}</p>
                    </div>
                    <div>
                      <p className="text-[var(--color-grey-500)] mb-1 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Onsket tid
                      </p>
                      <p className="text-[var(--color-grey-900)]">
                        {format(new Date(item.requestedTime), "d. MMM 'kl.' HH:mm", {
                          locale: nb,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--color-grey-500)] mb-1 flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" />
                        Pris
                      </p>
                      <p className="text-[var(--color-grey-900)]">
                        kr {item.price.toLocaleString("nb-NO")}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleApprove(item.id, item.type)}
                disabled={processingId === item.id}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                  "bg-[var(--color-black)] hover:opacity-80 text-white",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
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
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm",
                  "bg-[var(--color-grey-100)] hover:bg-[#FF3B30]/10 text-[var(--color-grey-500)] hover:text-[#FF3B30]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <X className="h-4 w-4" />
                Avvis
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
