"use client";

import Link from "next/link";
import { Check, Mail, Calendar, Clock, CreditCard, User, LogIn } from "lucide-react";

// Apple Light Theme 2026
const THEME = {
  bg: "#F5F5F7",
  bgElevated: "#FFFFFF",
  primary: "#1D1D1F",
  text: "#1D1D1F",
  textMuted: "#86868B",
  border: "#E8E8ED",
  shadow: "0 4px 20px rgba(0,0,0,0.04)",
};

interface Props {
  serviceName: string;
  instructorName: string;
  formattedDate: string;
  duration: number;
  priceNOK: string;
  paymentMethod: string;
  studentEmail: string;
  bookingId: string;
}

export function PublicConfirmationView({
  serviceName,
  instructorName,
  formattedDate,
  duration,
  priceNOK,
  paymentMethod,
  studentEmail,
  bookingId,
}: Props) {
  return (
    <div className="min-h-screen py-12 px-4" style={{ background: THEME.bg }}>
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div 
          className="rounded-3xl p-10 mb-8 text-center border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
            boxShadow: THEME.shadow,
          }}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: THEME.primary }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 
            className="text-3xl font-semibold mb-3"
            style={{ color: THEME.text }}
          >
            Booking bekreftet!
          </h1>
          <p style={{ color: THEME.textMuted }}>
            Takk for din booking. Du vil motta en bekreftelse på e-post.
          </p>
        </div>

        {/* Booking Details */}
        <div 
          className="rounded-3xl p-8 mb-8 border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
            boxShadow: THEME.shadow,
          }}
        >
          <h2 
            className="text-xl font-semibold mb-6 pb-4 border-b"
            style={{ color: THEME.text, borderColor: THEME.border }}
          >
            Bookingdetaljer
          </h2>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: THEME.bg }}
              >
                <Calendar className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: THEME.textMuted }}>Dato og tid</p>
                <p className="font-medium" style={{ color: THEME.text }}>{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: THEME.bg }}
              >
                <User className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: THEME.textMuted }}>Instruktør</p>
                <p className="font-medium" style={{ color: THEME.text }}>{instructorName}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: THEME.bg }}
              >
                <Clock className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: THEME.textMuted }}>Varighet</p>
                <p className="font-medium" style={{ color: THEME.text }}>{duration} minutter</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: THEME.bg }}
              >
                <CreditCard className="w-6 h-6" style={{ color: THEME.primary }} />
              </div>
              <div>
                <p className="text-sm" style={{ color: THEME.textMuted }}>Pris</p>
                <p className="font-medium" style={{ color: THEME.text }}>{priceNOK}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div 
          className="rounded-2xl p-6 mb-8 border"
          style={{
            background: THEME.bg,
            borderColor: THEME.border,
          }}
        >
          <div className="flex items-start gap-4">
            <Mail className="w-6 h-6 shrink-0 mt-0.5" style={{ color: THEME.primary }} />
            <div>
              <h3 className="font-semibold mb-1" style={{ color: THEME.text }}>
                Bekreftelse sendt
              </h3>
              <p className="text-sm" style={{ color: THEME.textMuted }}>
                En detaljert bekreftelse er sendt til <strong>{studentEmail}</strong>. 
                Sjekk innboksen din (og spam-mappen) for mer informasjon om timen.
              </p>
            </div>
          </div>
        </div>

        {/* Login CTA */}
        <div 
          className="rounded-2xl p-6 border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
          }}
        >
          <div className="flex items-start gap-4">
            <LogIn className="w-6 h-6 shrink-0 mt-0.5" style={{ color: THEME.primary }} />
            <div className="flex-1">
              <h3 className="font-semibold mb-1" style={{ color: THEME.text }}>
                Din spillerportal
              </h3>
              <p className="text-sm mb-4" style={{ color: THEME.textMuted }}>
                Ved første booking opprettes en konto automatisk. Hvis du er ny kunde, 
                vil du motta innloggingsinformasjon på e-post.
              </p>
              <Link
                href="/portal/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                style={{
                  background: THEME.primary,
                  color: "#FFFFFF",
                }}
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
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: THEME.textMuted }}
          >
            ← Tilbake til Academy
          </Link>
        </div>
      </div>
    </div>
  );
}
