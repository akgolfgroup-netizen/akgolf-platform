"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentPendingPollerProps {
  bookingId: string;
}

type PollStatus = "polling" | "confirmed" | "failed" | "timeout";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 30;

export function PaymentPendingPoller({ bookingId }: PaymentPendingPollerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<PollStatus>("polling");
  const attemptsRef = useRef(0);

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/booking/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      if (data.status === "CONFIRMED") {
        setStatus("confirmed");
        setTimeout(() => router.refresh(), 1000);
        return true;
      }

      if (data.status === "FAILED") {
        setStatus("failed");
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }, [bookingId, router]);

  useEffect(() => {
    if (status !== "polling") return;

    const timer = setInterval(async () => {
      attemptsRef.current += 1;
      if (attemptsRef.current >= MAX_ATTEMPTS) {
        setStatus("timeout");
        clearInterval(timer);
      }

      const done = await checkStatus();
      if (done) clearInterval(timer);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [checkStatus, status]);

  // Initial sjekk utenfor hoved-effect for å unngå sync setState-warning
  useEffect(() => {
    if (status !== "polling") return;

    let cancelled = false;
    const id = window.setTimeout(() => {
      void checkStatus().then((done) => {
        if (done && !cancelled) {
          // timeren i hoved-effect håndterer opprydding ved neste render
        }
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [checkStatus, status]);

  if (status === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-success/10">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">Betaling mottatt</h2>
          <p className="text-muted">Laster bekreftelsen din...</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-error/10">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">Betalingen feilet</h2>
          <p className="text-muted mb-6">Vi kunne ikke bekrefte betalingen din. Vennligst prov igjen eller kontakt oss.</p>
          <Link href="/booking" className="inline-flex items-center justify-center px-6 py-3 rounded-[20px] text-sm font-semibold bg-primary text-white">
            Prov igjen
          </Link>
        </div>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-warning/10">
            <CheckCircle2 className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">Betalingen behandles</h2>
          <p className="text-muted mb-6">Betalingen din er registrert, men bekreftelsen tar litt lenger enn vanlig. Du vil motta en bekreftelse pa e-post.</p>
          <Link href="/portal/bookinger" className="inline-flex items-center justify-center px-6 py-3 rounded-[20px] text-sm font-semibold bg-primary text-white">
            Se mine bookinger
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-primary">Bekrefter betaling</h2>
        <p className="text-muted">Vi verifiserer betalingen din. Dette tar vanligvis noen sekunder...</p>
      </div>
    </div>
  );
}
