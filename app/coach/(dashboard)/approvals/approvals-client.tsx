"use client";

import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Calendar,
  Check,
  X,
  Clock,
  User,
  CreditCard,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { approveBooking, rejectBooking } from "./actions";

interface PendingItem {
  id: string;
  type: "booking" | "plan";
  studentName: string;
  studentEmail: string;
  serviceName: string;
  price: number;
  requestedTime: Date;
  createdAt: Date;
}

interface ApprovalsClientProps {
  pendingItems: PendingItem[];
}

export function ApprovalsClient({ pendingItems }: ApprovalsClientProps) {
  const [items, setItems] = useState(pendingItems);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    const result = await approveBooking(id);
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    const result = await rejectBooking(id);
    if (result.success) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
    setProcessingId(null);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500 opacity-50" />
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
          className="bg-white border border-[var(--color-grey-200)] rounded-xl p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded-full text-xs font-medium">
                  Venter
                </span>
                <span className="text-xs text-[var(--color-grey-500)]">
                  {format(new Date(item.createdAt), "d. MMM 'kl.' HH:mm", {
                    locale: nb,
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[var(--color-grey-100)] flex items-center justify-center">
                  <User className="h-5 w-5 text-[var(--color-grey-500)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-grey-900)]">{item.studentName}</p>
                  <p className="text-sm text-[var(--color-grey-500)]">
                    {item.studentEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
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
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleApprove(item.id)}
                disabled={processingId === item.id}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  "bg-green-500 hover:bg-green-600 text-white",
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
                onClick={() => handleReject(item.id)}
                disabled={processingId === item.id}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
                  "bg-[var(--color-grey-100)] hover:bg-red-500/20 text-[var(--color-grey-400)] hover:text-red-500",
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
