"use client";

import { useState } from "react";
import { User, Clock, XCircle, CalendarClock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AdminStatCard, AdminDialog, AdminDrawer,
} from "@/components/portal/mission-control/ui";
import { adminCancelBooking, adminRescheduleBooking, type AdminBooking } from "./actions";

// ── Types ──────────────────────────────────────────────────

type StatusKey = "CONFIRMED" | "PENDING" | "CANCELLED";

const STATUS_CONFIG: Record<StatusKey, { label: string; icon: typeof CheckCircle; variant: "success" | "warning" | "error" }> = {
  CONFIRMED: { label: "Bekreftet", icon: CheckCircle, variant: "success" },
  PENDING: { label: "Venter", icon: AlertCircle, variant: "warning" },
  CANCELLED: { label: "Avbestilt", icon: XCircle, variant: "error" },
};

function isStatusKey(s: string): s is StatusKey {
  return s === "CONFIRMED" || s === "PENDING" || s === "CANCELLED";
}

// ── Props ──────────────────────────────────────────────────

interface BookingDetailDrawerProps {
  booking: AdminBooking | null;
  onClose: () => void;
  onMutated: () => void;
}

// ── Component ──────────────────────────────────────────────

export function BookingDetailDrawer({ booking, onClose, onMutated }: BookingDetailDrawerProps) {
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleSlots, setRescheduleSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleClose() {
    setShowCancel(false);
    setShowReschedule(false);
    setError(null);
    setRescheduleDate("");
    setRescheduleTime("");
    setRescheduleSlots([]);
    onClose();
  }

  async function handleCancel() {
    if (!booking) return;
    setCancelling(true);
    try {
      await adminCancelBooking(booking.id, "Avbestilt av admin", true);
      onMutated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noe gikk galt");
    } finally {
      setCancelling(false);
      setShowCancel(false);
    }
  }

  async function handleFetchSlots(date: string) {
    if (!booking) return;
    setRescheduleDate(date);
    setRescheduleTime("");
    setLoadingSlots(true);
    try {
      const params = new URLSearchParams({ date });
      const res = await fetch(`/api/portal/public/slots?${params}`);
      const data = await res.json();
      setRescheduleSlots(Array.isArray(data) ? data : []);
    } catch {
      setRescheduleSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleReschedule() {
    if (!booking || !rescheduleTime) return;
    setRescheduling(true);
    setError(null);
    try {
      await adminRescheduleBooking(booking.id, rescheduleTime);
      onMutated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke ombestille");
    } finally {
      setRescheduling(false);
    }
  }

  const isActive = booking && booking.status !== "CANCELLED";
  const statusKey = booking && isStatusKey(booking.status) ? booking.status : "PENDING";
  const statusCfg = STATUS_CONFIG[statusKey];
  const StatusIcon = statusCfg.icon;

  return (
    <>
      <AdminDrawer
        open={booking !== null}
        onClose={handleClose}
        title={booking?.ServiceType?.name ?? "Booking"}
        description={booking ? format(new Date(booking.startTime), "EEEE d. MMMM 'kl.' HH:mm", { locale: nb }) : undefined}
        width="lg"
        footer={
          isActive ? (
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={handleClose}>Lukk</Button>
              <Button variant="secondary" onClick={() => setShowReschedule(!showReschedule)}>
                <CalendarClock className="w-4 h-4" />
                Endre tid
              </Button>
              <Button variant="accent" onClick={() => setShowCancel(true)}>
                <XCircle className="w-4 h-4" />
                Avbestill
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={handleClose}>Lukk</Button>
          )
        }
      >
        {booking && (
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 text-error text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant={statusCfg.variant}><StatusIcon className="w-3 h-3" />{statusCfg.label}</Badge>
              {booking.paymentStatus === "PAID" && <Badge variant="success">Betalt</Badge>}
              {booking.paymentStatus === "REFUNDED" && <Badge variant="muted">Refundert</Badge>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <AdminStatCard label="Varighet" value={`${booking.ServiceType?.duration ?? 0} min`} />
              <AdminStatCard label="Pris" value={`${(booking.amount ?? 0).toLocaleString("nb-NO")} kr`} />
            </div>

            <Card>
              <h4 className="admin-section-title mb-2">Elev</h4>
              <div className="space-y-1 text-sm text-black">
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-grey-400" />{booking.User?.name ?? "Ukjent"}</div>
                {booking.User?.email && <div className="text-grey-400 ml-6">{booking.User.email}</div>}
                {booking.User?.phone && <div className="text-grey-400 ml-6">{booking.User.phone}</div>}
              </div>
            </Card>

            <Card>
              <h4 className="admin-section-title mb-2">Instruktør</h4>
              <div className="flex items-center gap-2 text-sm text-black">
                <Clock className="w-4 h-4 text-grey-400" />
                {booking.Instructor?.User?.name ?? "Ukjent"}
              </div>
            </Card>

            {booking.playerNotes && (
              <Card>
                <h4 className="admin-section-title mb-2">Spillernotater</h4>
                <p className="text-sm text-black italic">{booking.playerNotes}</p>
              </Card>
            )}

            {booking.adminNotes && (
              <Card>
                <h4 className="admin-section-title mb-2">Admin-notater</h4>
                <p className="text-sm text-black">{booking.adminNotes}</p>
              </Card>
            )}

            {booking.cancelReason && (
              <Card>
                <h4 className="admin-section-title mb-2">Avbestillingsgrunn</h4>
                <p className="text-sm text-error">{booking.cancelReason}</p>
              </Card>
            )}

            {/* Reschedule panel */}
            {showReschedule && isActive && (
              <Card>
                <h4 className="admin-section-title mb-3">Endre tidspunkt</h4>
                <div className="space-y-3">
                  <div>
                    <label className="admin-label mb-1 block">Velg ny dato</label>
                    <input
                      type="date"
                      value={rescheduleDate}
                      onChange={(e) => handleFetchSlots(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                      className="admin-input w-full"
                    />
                  </div>

                  {loadingSlots && (
                    <div className="flex items-center gap-2 text-xs text-grey-400">
                      <Loader2 className="w-4 h-4 animate-spin" />Henter ledige tider...
                    </div>
                  )}

                  {rescheduleDate && !loadingSlots && rescheduleSlots.length === 0 && (
                    <p className="text-xs text-grey-400">Ingen ledige tider denne dagen.</p>
                  )}

                  {rescheduleSlots.length > 0 && (
                    <div>
                      <label className="admin-label mb-1 block">Velg tid</label>
                      <div className="grid grid-cols-4 gap-2">
                        {rescheduleSlots.map((slot) => {
                          const time = format(new Date(slot), "HH:mm");
                          const isSelected = rescheduleTime === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setRescheduleTime(slot)}
                              className={`py-2 text-sm font-medium rounded-lg border transition-colors ${
                                isSelected
                                  ? "bg-black text-white border-black"
                                  : "bg-white text-black border-grey-200 hover:border-grey-300"
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {rescheduleTime && (
                    <Button variant="accent" isLoading={rescheduling} onClick={handleReschedule} className="w-full">
                      Bekreft ny tid: {format(new Date(rescheduleTime), "d. MMM 'kl.' HH:mm", { locale: nb })}
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}
      </AdminDrawer>

      {/* Cancel confirmation dialog */}
      <AdminDialog
        open={showCancel}
        onClose={() => setShowCancel(false)}
        title="Avbestille booking?"
        description="Dette kan ikke angres. Refund prosesseres automatisk hvis betaling er gjort."
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCancel(false)}>Avbryt</Button>
            <Button variant="accent" isLoading={cancelling} onClick={handleCancel}>Ja, avbestill</Button>
          </>
        }
      />
    </>
  );
}
