"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold text-on-surface mb-4">Noe gikk galt</h1>
      <p className="text-on-surface-variant text-center max-w-md mb-8">
        Beklager, det oppstod en uventet feil. Prøv å laste siden på nytt, eller gå tilbake til forsiden.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 border border-outline-variant text-on-surface rounded-full font-semibold hover:bg-surface-container transition-colors"
        >
          Prøv igjen
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-on-surface text-surface rounded-full font-semibold hover:bg-on-surface-variant transition-colors"
        >
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
