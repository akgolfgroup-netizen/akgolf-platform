"use client";


import { useRouter } from "next/navigation";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { BookingWizard } from "@/components/booking";
import { Mail, User, Calendar } from "lucide-react";

export default function AcademyBookingPage() {
  const router = useRouter();

  function handleComplete(data: { bookingId: string; redirectUrl?: string; isNewUser?: boolean }) {
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }
    router.push(`/booking/${data.bookingId}/confirmation`);
    router.refresh();
  }

  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-surface" id="main-content">
        <PageTransition>
          {/* Hero */}
          <section className="bg-surface-container-lowest py-16 border-b border-outline-variant/30">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-surface text-on-surface text-sm font-medium mb-4 border border-outline-variant/30">
                    AK Golf Academy
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-on-surface mb-4 tracking-tight">
                    Book din coaching-time
                  </h1>
                  <p className="text-on-surface-variant max-w-lg mx-auto">
                    Velg tjeneste, trener og tidspunkt. Ingen konto nødvendig —
                    hvis du har booket før, kobles timen automatisk til din profil.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Booking Wizard */}
          <section className="py-10">
            <div className="w-container">
              <BookingWizard mode="public" onComplete={handleComplete} />
            </div>
          </section>

          {/* Info */}
          <section className="py-12 bg-surface-container-lowest border-t border-outline-variant/30">
            <div className="w-container max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <InfoItem
                  icon={Mail}
                  title="Bekreftelse på e-post"
                  text="Du mottar umiddelbar bekreftelse på bookingen" />
                <InfoItem
                  icon={User}
                  title="Din profil"
                  text="Ved første booking opprettes en profil automatisk" />
                <InfoItem
                  icon={Calendar}
                  title="Enkel endring"
                  text="Endre eller avbestill enkelt via e-postlenken" />
              </div>
            </div>
          </section>
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}

function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mx-auto mb-4">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant">{text}</p>
    </div>
  );
}
