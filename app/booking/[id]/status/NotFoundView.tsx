"use client";


import { Icon } from "@/components/ui/icon";
import Link from "next/link";


export function NotFoundView() {
  return (
    <div className="min-h-screen bg-[var(--color-grey-100)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mx-auto mb-6">
            <Icon name="search" className="w-8 h-8 text-[var(--color-grey-500)]" />
          </div>
          
          <h1 className="text-xl font-semibold text-[var(--color-black)] mb-2">
            Booking ikke funnet
          </h1>
          
          <p className="text-[var(--color-grey-600)] mb-6">
            Vi kunne ikke finne bookingen du leter etter. Den kan ha blitt slettet, 
            eller lenken kan være feil.
          </p>

          <div className="bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Icon name="error" className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm text-[var(--color-warning-text)]">
                  <strong>Tips:</strong> Hvis du nettopp gjennomførte en booking, 
                  kan det ta noen minutter før den vises her. Sjekk e-posten din 
                  for bekreftelse.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-black)] text-white rounded-full text-sm font-medium hover:bg-[var(--color-grey-800)] transition-colors"
            >
              Gå til booking
            </Link>
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[var(--color-grey-200)] text-[var(--color-grey-700)] rounded-full text-sm font-medium hover:bg-[var(--color-grey-100)] transition-colors"
            >
              Logg inn på portalen
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--color-grey-600)] mt-6">
          Trenger du hjelp?{" "}
          <Link href="/kontakt" className="text-[var(--color-brand)] hover:underline">
            Kontakt oss
          </Link>
        </p>
      </div>
    </div>
  );
}
