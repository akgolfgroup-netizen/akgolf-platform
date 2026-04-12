import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { Calendar, Mail, User } from "lucide-react";

export default function AcademyBookingPage() {
  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-[var(--color-surface)]" id="main-content">
        <PageTransition>
          {/* Hero */}
          <section className="bg-white py-20 border-b border-[var(--color-grey-200)]">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-surface)] text-[var(--color-grey-900)] text-sm font-medium mb-4 border border-[var(--color-grey-200)]">
                    AK Golf Academy
                  </span>
                  <h1 className="text-4xl md:text-5xl font-semibold text-[var(--color-grey-900)] mb-4">
                    Book din coaching-time
                  </h1>
                  <p className="text-[var(--color-muted)] max-w-lg mx-auto">
                    Velg tjeneste, trener og tidspunkt. Ingen konto nodvendig —
                    hvis du har booket for, kobles timen automatisk til din profil.
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </section>

          {/* Booking wizard */}
          <section>
            <BookingWizard />
          </section>

          {/* Info */}
          <section className="py-12 bg-white border-t border-[var(--color-grey-200)]">
            <div className="w-container max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <InfoCard
                  icon={<Mail className="w-6 h-6 text-[var(--color-primary)]" />}
                  title="Bekreftelse pa e-post"
                  description="Du mottar umiddelbar bekreftelse pa bookingen"
                />
                <InfoCard
                  icon={<User className="w-6 h-6 text-[var(--color-primary)]" />}
                  title="Din profil"
                  description="Ved forste booking opprettes en profil automatisk"
                />
                <InfoCard
                  icon={<Calendar className="w-6 h-6 text-[var(--color-primary)]" />}
                  title="Enkel endring"
                  description="Endre eller avbestill enkelt via e-postlenken"
                />
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

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-[var(--color-grey-50)]">
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-[var(--color-grey-900)]">{title}</h3>
      <p className="text-sm text-[var(--color-muted)]">{description}</p>
    </div>
  );
}
