"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Hourglass,
  Loader2,
  ChevronLeft,
  FileText,
  RefreshCw,
  MessageSquare,
  ExternalLink,
  Printer,
  Share2,
} from "lucide-react";
import type { BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

interface BookingData {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  serviceName: string;
  serviceDescription: string | null | undefined;
  duration: number;
  instructorName: string;
  instructorTitle: string | null | undefined;
  locationName: string | null | undefined;
  locationAddress: string | null | undefined;
  date: string;
  timeRange: string;
  price: string | null;
  amount: number;
  studentNotes: string | null | undefined;
  adminNotes: string | null | undefined;
  cancelReason: string | null | undefined;
  createdAt: string;
  cancelledAt: string | null | undefined;
}

interface BookingStatusViewProps {
  booking: BookingData;
  isAuthenticated: boolean;
  isOwner: boolean;
}

const statusConfig: Record<BookingStatus, {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  PENDING: {
    label: "Venter på bekreftelse",
    description: "Booking er registrert og venter på betaling eller godkjenning",
    icon: <Hourglass className="w-5 h-5" />,
    color: "text-[var(--color-warning-text)]",
    bgColor: "bg-[var(--color-warning-light)]",
    borderColor: "border-[var(--color-warning)]/20",
  },
  CONFIRMED: {
    label: "Bekreftet",
    description: "Din booking er bekreftet og klar",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-[var(--color-success-text)]",
    bgColor: "bg-[var(--color-success-light)]",
    borderColor: "border-[var(--color-success)]/20",
  },
  CANCELLED: {
    label: "Avbestilt",
    description: "Booking har blitt avbestilt",
    icon: <XCircle className="w-5 h-5" />,
    color: "text-[var(--color-error-text)]",
    bgColor: "bg-[var(--color-error-light)]",
    borderColor: "border-[var(--color-error)]/20",
  },
  NO_SHOW: {
    label: "Ikke møtt",
    description: "Du møtte ikke opp til timen",
    icon: <AlertCircle className="w-5 h-5" />,
    color: "text-[var(--color-grey-600)]",
    bgColor: "bg-[var(--color-grey-100)]",
    borderColor: "border-[var(--color-grey-300)]",
  },
  COMPLETED: {
    label: "Gjennomført",
    description: "Timen er fullført",
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: "text-[var(--color-brand)]",
    bgColor: "bg-[var(--color-brand-light)]",
    borderColor: "border-[var(--color-brand)]/20",
  },
};

const paymentStatusConfig: Record<PaymentStatus, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  PENDING: {
    label: "Venter betaling",
    color: "text-[var(--color-warning-text)]",
    bgColor: "bg-[var(--color-warning-light)]",
  },
  PAID: {
    label: "Betalt",
    color: "text-[var(--color-success-text)]",
    bgColor: "bg-[var(--color-success-light)]",
  },
  FAILED: {
    label: "Betaling feilet",
    color: "text-[var(--color-error-text)]",
    bgColor: "bg-[var(--color-error-light)]",
  },
  REFUNDED: {
    label: "Refundert",
    color: "text-[var(--color-info-text)]",
    bgColor: "bg-[var(--color-info-light)]",
  },
  PARTIALLY_REFUNDED: {
    label: "Delvis refundert",
    color: "text-[var(--color-info-text)]",
    bgColor: "bg-[var(--color-info-light)]",
  },
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  NONE: "Ingen",
  STRIPE: "Kort (Stripe)",
  VIPPS: "Vipps",
  INVOICE: "Faktura",
};

export function BookingStatusView({ booking, isAuthenticated, isOwner }: BookingStatusViewProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const status = statusConfig[booking.status];
  const paymentStatus = paymentStatusConfig[booking.paymentStatus];

  const canCancel = booking.status === "CONFIRMED" || booking.status === "PENDING";
  const canReschedule = booking.status === "CONFIRMED";
  const isPast = new Date(booking.date + " " + booking.timeRange.split(" - ")[0]) < new Date();

  async function handleCancel() {
    setIsCancelling(true);
    setCancelError(null);

    try {
      const res = await fetch("/api/portal/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCancelError(data.error ?? "Kunne ikke avbestille");
        return;
      }

      router.refresh();
    } catch {
      setCancelError("Nettverksfeil. Prøv igjen.");
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: `Booking hos AK Golf - ${booking.serviceName}`,
        text: `${booking.date} ${booking.timeRange}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  // Timeline steps
  interface TimelineStep {
    label: string;
    date: string | null;
    completed: boolean;
    icon: React.ReactNode;
    isNoShow?: boolean;
    isCancelled?: boolean;
  }

  const timelineSteps: TimelineStep[] = [
    {
      label: "Booking registrert",
      date: booking.createdAt,
      completed: true,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      label: booking.amount === 0 ? "Gratis booking" : "Betaling mottatt",
      date: booking.paymentStatus === "PAID" ? booking.createdAt : null,
      completed: booking.paymentStatus === "PAID" || booking.amount === 0,
      icon: <CreditCard className="w-4 h-4" />,
    },
    {
      label: "Booking bekreftet",
      date: booking.status !== "PENDING" ? booking.createdAt : null,
      completed: booking.status === "CONFIRMED" || booking.status === "COMPLETED" || booking.status === "NO_SHOW",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      label: "Timen gjennomført",
      date: booking.status === "COMPLETED" || booking.status === "NO_SHOW" ? booking.date : null,
      completed: booking.status === "COMPLETED",
      icon: booking.status === "NO_SHOW" ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />,
      isNoShow: booking.status === "NO_SHOW",
    },
  ];

  if (booking.status === "CANCELLED") {
    timelineSteps[2] = {
      label: "Booking avbestilt",
      date: booking.cancelledAt ?? null,
      completed: true,
      icon: <XCircle className="w-4 h-4" />,
      isCancelled: true,
    };
    timelineSteps.pop();
  }

  return (
    <div className="min-h-screen bg-[var(--color-grey-100)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--color-grey-200)]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={isAuthenticated ? "/portal/bookinger" : "/booking"}
              className="inline-flex items-center gap-2 text-sm text-[var(--color-grey-600)] hover:text-[var(--color-black)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {isAuthenticated ? "Tilbake til bookinger" : "Tilbake til booking"}
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-[var(--color-grey-600)] hover:text-[var(--color-black)] hover:bg-[var(--color-grey-100)] rounded-full transition-all"
                title="Del"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-[var(--color-grey-600)] hover:text-[var(--color-black)] hover:bg-[var(--color-grey-100)] rounded-full transition-all"
                title="Skriv ut"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-6 mb-6 border ${status.bgColor} ${status.borderColor}`}
        >
          <div className="flex items-start gap-4">
            <div className={`${status.color} mt-0.5`}>{status.icon}</div>
            <div className="flex-1">
              <h1 className={`text-lg font-semibold ${status.color}`}>
                {status.label}
              </h1>
              <p className="text-[var(--color-grey-600)] mt-1">
                {status.description}
              </p>
              {booking.cancelReason && (
                <p className="text-sm text-[var(--color-grey-600)] mt-2 italic">
                  Årsak: {booking.cancelReason}
                </p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatus.bgColor} ${paymentStatus.color}`}>
              {paymentStatus.label}
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Booking Details Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden"
            >
              <div className="p-6 border-b border-[var(--color-grey-200)]">
                <h2 className="text-lg font-semibold text-[var(--color-black)]">
                  {booking.serviceName}
                </h2>
                {booking.serviceDescription && (
                  <p className="text-[var(--color-grey-600)] text-sm mt-1">
                    {booking.serviceDescription}
                  </p>
                )}
              </div>

              <div className="p-6 space-y-4">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[var(--color-grey-600)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-black)]">{booking.date}</p>
                    <p className="text-[var(--color-grey-600)] text-sm">{booking.timeRange}</p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--color-grey-600)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-black)]">{booking.duration} minutter</p>
                    <p className="text-[var(--color-grey-600)] text-sm">Varighet</p>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[var(--color-grey-600)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-black)]">{booking.instructorName}</p>
                    <p className="text-[var(--color-grey-600)] text-sm">
                      {booking.instructorTitle ?? "Instruktør"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                {booking.locationName && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[var(--color-grey-600)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-black)]">{booking.locationName}</p>
                      {booking.locationAddress && (
                        <p className="text-[var(--color-grey-600)] text-sm">{booking.locationAddress}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Price */}
                {booking.price && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-[var(--color-grey-600)]" />
                    </div>
                    <div>
                      <p className="font-medium text-[var(--color-black)]">{booking.price}</p>
                      <p className="text-[var(--color-grey-600)] text-sm">
                        {paymentMethodLabel[booking.paymentMethod]}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notes */}
            {(booking.studentNotes || booking.adminNotes) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-[var(--color-grey-600)]" />
                  <h3 className="font-semibold text-[var(--color-black)]">Notater</h3>
                </div>
                {booking.studentNotes && (
                  <div className="mb-4">
                    <p className="text-xs text-[var(--color-grey-600)] uppercase tracking-wide mb-1">Dine notater</p>
                    <p className="text-[var(--color-black)]">{booking.studentNotes}</p>
                  </div>
                )}
                {booking.adminNotes && (
                  <div>
                    <p className="text-xs text-[var(--color-grey-600)] uppercase tracking-wide mb-1">Fra instruktør</p>
                    <p className="text-[var(--color-black)]">{booking.adminNotes}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            {(canCancel || canReschedule) && !isPast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6"
              >
                <h3 className="font-semibold text-[var(--color-black)] mb-4">Handlinger</h3>
                <div className="flex flex-wrap gap-3">
                  {canReschedule && (
                    <Link
                      href={`/portal/bookinger/${booking.id}/endre`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-grey-800)] transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Endre tid
                    </Link>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      disabled={isCancelling}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-error)] text-[var(--color-error)] rounded-full text-sm font-medium hover:bg-[var(--color-error-light)] transition-colors disabled:opacity-50"
                    >
                      {isCancelling ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      Avbestill
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6 h-fit"
          >
            <h3 className="font-semibold text-[var(--color-black)] mb-6">Tidslinje</h3>
            <div className="space-y-0">
              {timelineSteps.map((step, index) => (
                <div key={step.label} className="relative">
                  {/* Connector line */}
                  {index < timelineSteps.length - 1 && (
                    <div
                      className={`absolute left-[19px] top-10 w-0.5 h-8 ${
                        step.completed ? "bg-[var(--color-success)]" : "bg-[var(--color-grey-200)]"
                      }`}
                    />
                  )}
                  <div className="flex gap-4 pb-8 last:pb-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? step.isNoShow
                            ? "bg-[var(--color-error-light)] text-[var(--color-error)]"
                            : step.isCancelled
                              ? "bg-[var(--color-error-light)] text-[var(--color-error)]"
                              : "bg-[var(--color-success)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-400)]"
                      }`}
                    >
                      {step.completed && !step.isNoShow && !step.isCancelled ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-medium ${
                          step.completed ? "text-[var(--color-black)]" : "text-[var(--color-grey-500)]"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-[var(--color-grey-600)] mt-0.5">{step.date}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[var(--color-grey-600)] text-sm">
            Trenger du hjelp?{" "}
            <Link
              href="/kontakt"
              className="text-[var(--color-brand)] hover:underline inline-flex items-center gap-1"
            >
              Kontakt oss
              <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
        </motion.div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-warning-light)] flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-[var(--color-warning)]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-black)]">Bekreft avbestilling</h3>
                <p className="text-[var(--color-grey-600)] text-sm mt-1">
                  Er du sikker på at du vil avbestille denne timen?
                </p>
              </div>
            </div>

            {cancelError && (
              <div className="bg-[var(--color-error-light)] text-[var(--color-error)] p-3 rounded-lg text-sm mb-4">
                {cancelError}
              </div>
            )}

            <div className="bg-[var(--color-grey-100)] rounded-xl p-4 mb-6 text-sm">
              <p className="font-medium text-[var(--color-black)] mb-2">Avbestillingsregler:</p>
              <ul className="space-y-1 text-[var(--color-grey-600)]">
                <li>• Mer enn 24 timer før: Full refusjon</li>
                <li>• 2-24 timer før: 50% refusjon</li>
                <li>• Mindre enn 2 timer før: Ingen refusjon</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--color-grey-700)] bg-[var(--color-grey-100)] rounded-full hover:bg-[var(--color-grey-200)] transition-colors"
                disabled={isCancelling}
              >
                Avbryt
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-error)] rounded-full hover:bg-[var(--color-error)]/85 transition-colors flex items-center justify-center gap-2"
              >
                {isCancelling && <Loader2 className="w-4 h-4 animate-spin" />}
                {isCancelling ? "Avbestiller..." : "Bekreft avbestilling"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
