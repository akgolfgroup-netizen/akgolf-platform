"use client";

import { useEffect, useId } from "react";
import { X, Calendar, Clock, MapPin, User, AlertTriangle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { ACTIVITY_TYPE_COLORS } from "./facility-legend";

export interface CalendarEvent {
  id: string;
  type: "booking" | "activity";
  title: string;
  description?: string | null;
  facilityId: string;
  facilityName: string;
  startTime: string;
  endTime: string;
  color: string;
  status: string;
  createdBy?: string | null;
  activityType?: string;
}

interface Props {
  event: CalendarEvent | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ActivityDetailSheet({ event, onClose, onApprove, onDelete }: Props) {
  const labelId = useId();

  useEffect(() => {
    if (!event) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const isPending = event.status === "PENDING";
  const typeInfo = event.activityType
    ? ACTIVITY_TYPE_COLORS[event.activityType]
    : null;

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
            role="presentation"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto overscroll-contain"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[var(--color-grey-200)] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <h2 id={labelId} className="text-lg font-semibold text-[var(--color-grey-900)]">
                  {event.type === "activity" ? "Aktivitet" : "Booking"}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Lukk panel"
                className="p-2 rounded-lg text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)] hover:bg-[var(--color-grey-100)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status badge */}
              {isPending && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF9500]/10 text-[#FF9500]">
                  <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">Venter på godkjenning</span>
                </div>
              )}

              {/* Title */}
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-grey-900)]">
                  {event.title}
                </h3>
                {typeInfo && (
                  <span
                    className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: typeInfo.color }}
                  >
                    {typeInfo.label}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[var(--color-grey-400)] mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-medium text-[var(--color-grey-900)]">
                      {format(startDate, "EEEE d. MMMM yyyy", { locale: nb })}
                    </p>
                    <p className="text-sm text-[var(--color-grey-500)]">
                      {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[var(--color-grey-400)] mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[var(--color-grey-700)]">
                      {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} minutter
                    </p>
                  </div>
                </div>

                {/* Facility */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-grey-400)] mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-[var(--color-grey-700)]">{event.facilityName}</p>
                  </div>
                </div>

                {/* Created by */}
                {event.createdBy && (
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[var(--color-grey-400)] mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-[var(--color-grey-500)]">Opprettet av</p>
                      <p className="text-[var(--color-grey-700)]">{event.createdBy}</p>
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="pt-4 border-t border-[var(--color-grey-200)]">
                    <p className="text-sm text-[var(--color-grey-500)] mb-1">Beskrivelse</p>
                    <p className="text-[var(--color-grey-700)]">{event.description}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              {event.type === "activity" && (
                <div className="pt-6 border-t border-[var(--color-grey-200)] space-y-3">
                  {isPending && onApprove && (
                    <button
                      onClick={() => onApprove(event.id)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#34C759] text-white font-medium hover:bg-[#2DB84E] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Godkjenn aktivitet
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(event.id)}
                      className="w-full px-4 py-3 rounded-xl border border-[#FF3B30] text-[#FF3B30] font-medium hover:bg-[#FF3B30]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Kanseller aktivitet
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
