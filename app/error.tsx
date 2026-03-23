"use client";

import Link from "next/link";
import { AKLogo } from "@/components/website/AKLogo";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-ink-100 flex flex-col items-center justify-center px-6">
      <AKLogo variant="gold" size={40} />
      <h1 className="w-heading-lg text-white mt-8 mb-4">Noe gikk galt</h1>
      <p className="text-ink-50 text-center max-w-md mb-8">
        Beklager, det oppstod en uventet feil. Prøv å laste siden på nytt, eller gå tilbake til forsiden.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="w-btn w-btn-ghost text-ink-30 border-ink-60">
          Prøv igjen
        </button>
        <Link href="/" className="w-btn w-btn-primary">
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
