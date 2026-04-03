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
      <h1 className="text-2xl font-bold text-[var(--color-grey-900)] mb-4">Noe gikk galt</h1>
      <p className="text-[var(--color-grey-500)] text-center max-w-md mb-8">
        Beklager, det oppstod en uventet feil. Prøv å laste siden på nytt, eller gå tilbake til forsiden.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 border border-[var(--color-grey-200)] text-[var(--color-grey-900)] rounded-full font-semibold hover:bg-[var(--color-grey-100)] transition-colors"
        >
          Prøv igjen
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-[var(--color-black)] text-white rounded-full font-semibold hover:bg-[var(--color-grey-800)] transition-colors"
        >
          Til forsiden
        </Link>
      </div>
    </div>
  );
}
