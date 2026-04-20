import Link from "next/link";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-on-surface flex flex-col items-center justify-center px-6 text-surface">
      <h1 className="text-2xl font-bold mt-8 mb-4">Siden finnes ikke</h1>
      <p className="text-surface/60 text-center max-w-md mb-8">
        Beklager, vi fant ikke siden du leter etter.
      </p>
      <Link href="/" className="bg-secondary-fixed text-on-surface px-6 py-3 rounded-full font-semibold">
        Tilbake til forsiden
      </Link>
    </div>
  );
}
