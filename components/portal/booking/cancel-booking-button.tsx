"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2, Check } from "lucide-react";

interface CancelBookingButtonProps {
  bookingId: string;
  startTime: Date;
  onCancel?: () => void;
}

export function CancelBookingButton({
  bookingId,
  startTime,
  onCancel,
}: CancelBookingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    message: string;
    refundPercent: number;
  } | null>(null);

  // Only show for future bookings
  const isFuture = new Date(startTime) > new Date();
  if (!isFuture) return null;

  async function handleCancel() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Kunne ikke avbestille");
        setLoading(false);
        return;
      }

      setResult({
        message: data.message,
        refundPercent: data.cancellation.refundPercent,
      });
      setTimeout(() => {
        setIsOpen(false);
        onCancel?.();
      }, 2000);
    } catch {
      setError("Nettverksfeil. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-[#D14343] hover:text-[#D14343] flex items-center gap-1.5 transition-colors"
      >
        <X size={16} />
        Avbestill
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {result ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-[#2D6A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-[#2D6A4F]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Avbestilt</h3>
                <p className="text-[var(--color-grey-600)] mb-2">{result.message}</p>
                {result.refundPercent > 0 && (
                  <p className="text-sm text-[#2D6A4F]">
                    {result.refundPercent}% refusjon behandlet
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="text-amber-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      Bekreft avbestilling
                    </h3>
                    <p className="text-[var(--color-grey-600)] text-sm">
                      Er du sikker på at du vil avbestille denne timen?
                      Avbestillingsregler gjelder.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-[#D14343]/5 text-[#D14343] p-3 rounded-lg text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="bg-[var(--color-grey-100)] rounded-lg p-4 mb-4 text-sm text-[var(--color-grey-600)]">
                  <p className="font-medium mb-2">Avbestillingsregler:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Mer enn 24 timer før: Full refusjon</li>
                    <li>• 2-24 timer før: 50% refusjon</li>
                    <li>• Mindre enn 2 timer før: Ingen refusjon</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-[var(--color-grey-700)] bg-[var(--color-grey-100)] rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
                    disabled={loading}
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#D14343] rounded-lg hover:bg-[#B33636] transition-colors flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Avbestiller..." : "Bekreft avbestilling"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
