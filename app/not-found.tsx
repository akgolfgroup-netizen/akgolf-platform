import Link from "next/link";
import { AKLogo } from "@/components/website/AKLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-100 flex flex-col items-center justify-center px-6">
      <AKLogo variant="gold" size={40} />
      <h1 className="w-heading-lg text-white mt-8 mb-4">Siden finnes ikke</h1>
      <p className="text-ink-50 text-center max-w-md mb-8">
        Beklager, vi fant ikke siden du leter etter. Den kan ha blitt flyttet eller fjernet.
      </p>
      <Link href="/" className="w-btn w-btn-primary">
        Tilbake til forsiden
      </Link>
    </div>
  );
}
