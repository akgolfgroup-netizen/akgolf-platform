"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  CreditCard,
  CalendarClock,
  XCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { BookingStatusBadge } from "@/components/portal/booking/booking-status-badge";
import type { BookingStatusVariant } from "@/components/portal/booking/booking-types";
import { cancelBooking } from "../actions";

interface BookingDetail {
  id: string;
  serviceName: string;
  serviceCategory: string;
  serviceColor?: string;
  instructorName: string;
  instructorTitle?: string;
  instructorImage?: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  amount: number;
  studentNotes?: string;
  cancelReason?: string;
  cancelledAt?: string;
}

type Badge = { label: string; variant: BookingStatusVariant };

const STATUS_MAP: Record<string, Badge> = {
  CONFIRMED: { label: "Bekreftet", variant: "success" },
  PENDING: { label: "Venter", variant: "warning" },
  CANCELLED: { label: "Avlyst", variant: "cancelled" },
  NO_SHOW: { label: "Ikke mott", variant: "cancelled" },
  COMPLETED: { label: "Fullfort", variant: "success" },
};

const PAYMENT_MAP: Record<string, Badge> = {
  PAID: { label: "Betalt", variant: "success" },
  PENDING: { label: "Venter betaling", variant: "warning" },
  REFUNDED: { label: "Refundert", variant: "cancelled" },
  PARTIALLY_REFUNDED: { label: "Delvis refundert", variant: "warning" },
  FAILED: { label: "Feilet", variant: "cancelled" },
};

const METHOD_LABELS: Record<string, string> = {
  STRIPE: "Kort", VIPPS: "Vipps", INVOICE: "Faktura", NONE: "Abonnement",
};

function isActive(status: string) {
  return status === "CONFIRMED" || status === "PENDING";
}

// ── Komponent ─────────────────────────────────────────

export function BookingDetailClient({ booking }: { booking: BookingDetail }) {
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelResult, setCancelResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const start = new Date(booking.startTime);
  const statusBadge = STATUS_MAP[booking.status] ?? { label: booking.status, variant: "warning" as const };
  const paymentBadge = PAYMENT_MAP[booking.paymentStatus] ?? { label: booking.paymentStatus, variant: "warning" as const };

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelBooking(booking.id);
      if (result.success) {
        setCancelResult(result.policyReason);
        setShowCancelConfirm(false);
        router.refresh();
      } else {
        setCancelResult(result.error ?? "Kunne ikke kansellere");
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Tilbake-lenke */}
      <Link
        href="/portal/bookinger"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-portal-muted hover:text-portal-text transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Tilbake til bookinger
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-portal-text">
            {booking.serviceName}
          </h1>
          <p className="text-sm text-portal-muted mt-1 tabular-nums">
            {format(start, "EEEE d. MMMM yyyy", { locale: nb })}
          </p>
        </div>
        <BookingStatusBadge
          label={statusBadge.label}
          variant={statusBadge.variant}
        />
      </div>

      {/* Detaljer */}
      <PremiumCard>
        <div className="grid gap-5">
          {/* Tidspunkt */}
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Dato"
            value={format(start, "EEEE d. MMMM yyyy", { locale: nb })}
            tabular
          />
          <DetailRow
            icon={<Clock className="w-4 h-4" />}
            label="Tidspunkt"
            value={`${format(start, "HH:mm")}–${format(new Date(booking.endTime), "HH:mm")} (${booking.duration} min)`}
            tabular
          />

          {/* Instruktor */}
          <DetailRow
            icon={<UserIcon className="w-4 h-4" />}
            label="Instruktor"
            value={
              booking.instructorTitle
                ? `${booking.instructorName} · ${booking.instructorTitle}`
                : booking.instructorName
            }
          />

          {/* Sted */}
          {booking.location && (
            <DetailRow
              icon={<MapPin className="w-4 h-4" />}
              label="Sted"
              value={booking.location}
            />
          )}

          {/* Betaling */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-portal-hover flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-portal-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-portal-muted uppercase tracking-[0.08em]">
                Betaling
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[14px] text-portal-text tabular-nums">
                  {booking.amount > 0
                    ? `kr ${booking.amount.toLocaleString("nb-NO")}`
                    : "Inkludert i abonnement"}
                </span>
                <span className="text-[11px] text-portal-muted">
                  ({METHOD_LABELS[booking.paymentMethod] ?? booking.paymentMethod})
                </span>
                <BookingStatusBadge
                  label={paymentBadge.label}
                  variant={paymentBadge.variant}
                />
              </div>
            </div>
          </div>

          {/* Notater */}
          {booking.studentNotes && (
            <DetailRow
              icon={<FileText className="w-4 h-4" />}
              label="Dine notater"
              value={booking.studentNotes}
            />
          )}

          {/* Kanselleringsgrunn */}
          {booking.cancelReason && (
            <DetailRow
              icon={<XCircle className="w-4 h-4" />}
              label="Avbestillingsgrunn"
              value={booking.cancelReason}
            />
          )}
        </div>
      </PremiumCard>

      {/* Resultatmelding */}
      {cancelResult && (
        <PremiumCard>
          <p className="text-sm text-portal-text">{cancelResult}</p>
        </PremiumCard>
      )}

      {/* Handlinger */}
      {isActive(booking.status) && (
        <div className="flex items-center gap-3">
          {isActive(booking.status) && (
            <Link
              href={`/portal/bookinger/${booking.id}/endre`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-primary text-white text-[12px] font-bold hover:opacity-90 transition-opacity"
            >
              <CalendarClock className="w-4 h-4" />
              Endre tidspunkt
            </Link>
          )}

          {!showCancelConfirm && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] border border-portal-border text-portal-secondary text-[12px] font-bold hover:bg-portal-hover transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Avbestill
            </button>
          )}
        </div>
      )}

      {/* Bekreft kansellering */}
      {showCancelConfirm && (
        <PremiumCard>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-portal-hover flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-portal-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-portal-text mb-1">
                Bekreft avbestilling
              </p>
              <p className="text-[12px] text-portal-muted mb-4">
                Er du sikker pa at du vil avbestille denne timen? Avbestillingsreglene gjelder.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="px-4 py-2 rounded-[20px] bg-primary-alt text-white text-[12px] font-bold hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                >
                  {isPending ? "Avbestiller..." : "Ja, avbestill"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isPending}
                  className="px-4 py-2 rounded-[20px] border border-portal-border text-portal-secondary text-[12px] font-bold hover:bg-portal-hover transition-colors cursor-pointer"
                >
                  Angre
                </button>
              </div>
            </div>
          </div>
        </PremiumCard>
      )}
    </div>
  );
}

// ── Underkomponent ────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  tabular,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tabular?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-portal-hover flex items-center justify-center shrink-0">
        <span className="text-portal-secondary">{icon}</span>
      </div>
      <div>
        <p className="text-[11px] text-portal-muted uppercase tracking-[0.08em]">
          {label}
        </p>
        <p className={`text-[14px] text-portal-text mt-0.5${tabular ? " tabular-nums" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
