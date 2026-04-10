import Link from "next/link";
import { XCircle } from "lucide-react";

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center border border-primary/10">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-error" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Booking avbrutt</h1>
        <p className="text-text text-sm mb-8">
          Betalingen ble ikke fullført. Bookingen din er ikke bekreftet.
          Du kan prøve igjen eller gå tilbake til forsiden.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/booking"
            className="flex-1 bg-primary text-white py-3 px-6 rounded-xl font-medium text-sm text-center hover:opacity-90 transition"
          >
            Prøv igjen
          </Link>
          <Link
            href="/"
            className="flex-1 bg-surface text-primary py-3 px-6 rounded-xl font-medium text-sm text-center border border-primary/10 hover:bg-grey-100 transition"
          >
            Gå til forsiden
          </Link>
        </div>
      </div>
    </div>
  );
}
