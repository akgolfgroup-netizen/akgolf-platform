"use client";

import Link from "next/link";
import { Check, Mail, Calendar, Clock, CreditCard, User, LogIn } from "lucide-react";
import { BookingUpsellCard } from "@/components/portal/booking/upsell-card";

interface Props {
  instructorName: string;
  formattedDate: string;
  duration: number;
  priceNOK: string;
  studentEmail: string;
  bookingPrice: number;
}

export function PublicConfirmationView({
  instructorName,
  formattedDate,
  duration,
  priceNOK,
  studentEmail,
  bookingPrice,
}: Props) {
  return (
    <div className="min-h-screen py-12 px-4 bg-surface">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="rounded-3xl p-10 mb-8 text-center border bg-white border-grey-200 shadow-card">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-semibold mb-3 text-primary">
            Booking bekreftet!
          </h1>
          <p className="text-muted">
            Takk for din booking. Du vil motta en bekreftelse på e-post.
          </p>
        </div>

        {/* Booking Details */}
        <div className="rounded-3xl p-8 mb-8 border bg-white border-grey-200 shadow-card">
          <h2 className="text-xl font-semibold mb-6 pb-4 border-b text-primary border-grey-200">
            Bookingdetaljer
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Dato og tid</p>
                <p className="font-medium text-primary">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Instruktør</p>
                <p className="font-medium text-primary">{instructorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Varighet</p>
                <p className="font-medium text-primary">{duration} minutter</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted">Pris</p>
                <p className="font-medium text-primary">{priceNOK}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="rounded-2xl p-6 mb-6 border bg-surface border-grey-200">
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 shrink-0 mt-0.5 text-primary" />
            <div>
              <h3 className="font-semibold mb-1 text-primary">
                Bekreftelse sendt
              </h3>
              <p className="text-sm text-muted">
                En detaljert bekreftelse er sendt til <strong>{studentEmail}</strong>.
                Sjekk innboksen din (og spam-mappen) for mer informasjon om timen.
              </p>
            </div>
          </div>
        </div>

        {/* Upsell Card */}
        <div className="mb-8">
          <BookingUpsellCard
            userName={null}
            bookingPrice={bookingPrice}
            isLoggedIn={false}
          />
        </div>

        {/* Login CTA */}
        <div className="rounded-2xl p-6 border bg-white border-grey-200">
          <div className="flex items-start gap-4">
            <LogIn className="w-6 h-6 shrink-0 mt-0.5 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1 text-primary">
                Din spillerportal
              </h3>
              <p className="text-sm mb-4 text-muted">
                Ved første booking opprettes en konto automatisk. Hvis du er ny kunde,
                vil du motta innloggingsinformasjon på e-post.
              </p>
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-opacity duration-300 bg-primary text-white"
              >
                <LogIn className="w-4 h-4" />
                Logg inn på portalen
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Academy */}
        <div className="mt-8 text-center">
          <Link
            href="/academy"
            className="text-sm transition-colors hover:opacity-70 text-muted"
          >
            ← Tilbake til Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
