"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flag, User, Calendar, Receipt, UserCircle, AlertCircle, Check, CreditCard, ArrowRight, Shield, CalendarCheck } from "@/components/shared/icons";
import { BookingProgress } from "../components/BookingProgress";
import { BookingNavSidebar } from "../components/BookingNavSidebar";
import { createClient } from "@/lib/supabase/client";

interface ServiceType {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  allowVipps?: boolean;
}

interface Instructor {
  id: string;
  User: {
    name: string | null;
    image: string | null;
  };
}

export default function BookingReviewConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceTypeId = searchParams.get("serviceTypeId");
  const instructorId = searchParams.get("instructorId");
  const startTimeParam = searchParams.get("startTime");

  const [service, setService] = useState<ServiceType | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [handicap, setHandicap] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE">("STRIPE");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Auto-fill user info from profile if logged in (optional)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        // Pre-fill user data if logged in, but don't require login
        setName(user.user_metadata?.name || "");
        setEmail(user.email || "");
        setPhone(user.user_metadata?.phone || "");
      }
    });
  }, []);

  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    if (!serviceTypeId || !instructorId || !startTimeParam) {
      router.push("/booking/select-service");
      return;
    }

    const parsedDate = new Date(startTimeParam);
    if (isNaN(parsedDate.getTime())) {
      setError("Ugyldig tidspunkt");
      setLoading(false);
      return;
    }
    setStartTime(parsedDate);

    fetch("/api/portal/public/service-types")
      .then((res) => res.json())
      .then((data) => {
        const foundService = data.find((s: ServiceType) => s.id === serviceTypeId);
        if (foundService) {
          setService(foundService);
        } else {
          setError("Tjeneste ikke funnet");
        }

        const foundInstructor = data.flatMap((s: any) => s.Instructor).find((i: Instructor) => i.id === instructorId);
        if (foundInstructor) {
          setInstructor(foundInstructor);
        } else {
          setError("Instruktør ikke funnet");
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Kunne ikke laste data");
        setLoading(false);
      });
  }, [serviceTypeId, instructorId, startTimeParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setBookingError("Du må godta vilkårene");
      return;
    }

    if (!name || !email) {
      setBookingError("Navn og e-post er påkrevd");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId,
          instructorId,
          startTime: startTime?.toISOString(),
          paymentMethod,
          email,
          name,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.error || "Kunne ikke opprette booking");
        setSubmitting(false);
        return;
      }

      if (data.redirectUrl) {
        // External Stripe Checkout URL
        window.location.href = data.redirectUrl;
      } else if (data.bookingId) {
        router.push(`/booking/${data.bookingId}/confirmation`);
      }
    } catch {
      setBookingError("En feil oppstod. Prøv igjen.");
      setSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center lg:ml-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154212]"></div>
      </div>
    );
  }

  if (error || !service || !instructor || !startTime) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center lg:ml-64">
        <div className="text-center">
          <p className="text-[#ba1a1a] mb-4">{error || "Manglende informasjon"}</p>
          <Link href="/booking/select-service" className="px-6 py-3 bg-[#154212] text-white rounded-lg inline-block">
            Start på nytt
          </Link>
        </div>
      </div>
    );
  }

  const endTime = new Date(startTime.getTime() + (service.duration || 20) * 60000);
  const priceFormatted = service.price === 0 
    ? "Gratis" 
    : service.name.includes("Performance") 
      ? `${service.price.toLocaleString("nb-NO")} kr/mnd`
      : `${service.price.toLocaleString("nb-NO")} kr`;

  return (
    <>
      {/* Progress Bar - Desktop only */}
      <div className="hidden lg:block">
        <BookingProgress 
          currentStep={3} 
          serviceTypeId={serviceTypeId || undefined}
          instructorId={instructorId || undefined}
          startTime={startTime?.toISOString() || undefined}
        />
      </div>

      {/* Navigation Sidebar */}
      <BookingNavSidebar 
        currentStep={3}
        serviceTypeId={serviceTypeId || undefined}
        instructorId={instructorId || undefined}
        startTime={startTime?.toISOString() || undefined}
        serviceName={service?.name}
        servicePrice={service?.price}
        isPriceMonthly={service?.name?.includes("Performance")}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-[#fdf9f0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          {/* Mobile Title */}
          <div className="lg:hidden mb-6">
            <span className="font-mono text-[#154212] text-[10px] uppercase tracking-widest block mb-1">Steg 3 av 3</span>
            <h3 className="text-2xl font-bold text-[#154212] tracking-tight">Oppsummering</h3>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <span className="font-mono text-[#154212] text-[10px] uppercase tracking-widest block mb-2">Siste sjekk</span>
            <h3 className="text-4xl lg:text-5xl font-bold text-[#154212] tracking-tight leading-tight">
              Gjennomgå din <span className="text-[#b8d300]">booking</span>.
            </h3>
          </div>

          {bookingError && (
            <div className="mb-6 lg:mb-8 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#ba1a1a]" />
              <p className="text-[#ba1a1a] text-sm">{bookingError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Booking Summary */}
                <section className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-[0_4px_16px_rgba(45,90,39,0.04)] overflow-hidden relative border border-[#f1eee5]">
                  <div className="flex justify-between items-start mb-6 lg:mb-10">
                    <div className="min-w-0">
                      <h4 className="text-xl lg:text-2xl font-bold text-[#154212] mb-1 truncate">{service.name}</h4>
                      <p className="text-[#42493e] flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{instructor.User.name}</span>
                      </p>
                    </div>
                    <div className="bg-[#154212]/5 px-3 lg:px-4 py-2 rounded-full border border-[#154212]/10 flex-shrink-0 ml-2">
                      <span className="font-mono text-[10px] lg:text-xs font-medium text-[#154212] uppercase">
                        {service.name.includes("Performance") ? "Månedlig" : "Engang"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-4 lg:space-y-6">
                      <div>
                        <label className="font-mono text-[10px] uppercase text-[#154212]/40 tracking-widest block mb-1">Dato & Tid</label>
                        <p className="text-base lg:text-lg font-semibold text-[#154212]">{formatDate(startTime)}</p>
                        <p className="text-[#42493e] text-sm">{formatTime(startTime)} — {formatTime(endTime)} ({service.duration || 20} Min)</p>
                      </div>
                      <div>
                        <label className="font-mono text-[10px] uppercase text-[#154212]/40 tracking-widest block mb-1">Lokasjon</label>
                        <p className="text-base lg:text-lg font-semibold text-[#154212]">Gamle Fredrikstad GK</p>
                        <p className="text-[#42493e] text-sm">Driving range / TrackMan</p>
                      </div>
                    </div>
                    <div className="space-y-4 lg:space-y-6">
                      <div className="bg-[#f7f3ea] rounded-2xl p-4">
                        <label className="font-mono text-[10px] uppercase text-[#154212]/40 tracking-widest block mb-2">Inkludert</label>
                        <ul className="text-sm text-[#42493e] space-y-1">
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f000]" />TrackMan analyse</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f000]" />Teknisk veiledning</li>
                          <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#d2f000]" />Oppdatert treningsplan</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* User Info Form */}
                <section className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-8 border border-[#f1eee5]">
                  <div className="mb-4 lg:mb-6">
                    <h4 className="text-base lg:text-lg font-bold text-[#154212] uppercase tracking-tight">Dine opplysninger</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">Navn *</label>
                      <input 
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16] text-sm"
                        placeholder="Ola Nordmann"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">E-post *</label>
                      <input 
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16] text-sm"
                        placeholder="ola@epost.no"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">Telefon</label>
                      <input 
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16] text-sm"
                        placeholder="+47 000 00 000"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">Handicap</label>
                      <input 
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16] text-sm"
                        placeholder="f.eks. 12.5"
                        type="text"
                        value={handicap}
                        onChange={(e) => setHandicap(e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {/* Payment Method & Terms */}
                <section className="bg-white rounded-2xl lg:rounded-3xl p-5 lg:p-8 border border-[#f1eee5]">
                  <div className="mb-4 lg:mb-6">
                    <h4 className="text-base lg:text-lg font-bold text-[#154212] uppercase tracking-tight">Betalingsmåte</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div 
                      onClick={() => setPaymentMethod("STRIPE")}
                      className={`border-2 ${paymentMethod === "STRIPE" ? 'border-[#d2f000] bg-[#d2f000]/5' : 'border-[#f1eee5]'} rounded-2xl p-4 lg:p-5 flex items-center gap-4 cursor-pointer relative transition-all`}
                    >
                      <CreditCard className="w-5 h-5 lg:w-6 lg:h-6 text-[#154212]" />
                      <div className="flex-1">
                        <p className="font-bold text-[#154212] text-sm">Kortbetaling</p>
                        <p className="text-xs text-[#154212]/60">Visa/Mastercard</p>
                      </div>
                      {paymentMethod === "STRIPE" && (
                        <div className="w-5 h-5 bg-[#154212] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 lg:mt-8 flex items-start gap-3">
                    <input 
                      className="mt-1 rounded border-[#f1eee5] text-[#154212] focus:ring-[#154212] h-4 w-4"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      id="terms"
                    />
                    <label htmlFor="terms" className="text-xs text-[#42493e] leading-relaxed">
                      Jeg godtar <a className="underline font-medium text-[#154212]" href="#">vilkårene</a> og bekrefter at jeg har lest <a className="underline font-medium text-[#154212]" href="#">kanselleringspolicyen</a>. Sessioner må kanselleres minst 24 timer i forveien.
                    </label>
                  </div>
                </section>
              </div>

              {/* Right Column - Sticky Summary */}
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-32 space-y-4 lg:space-y-6">
                  {/* Price Summary Card */}
                  <div className="bg-[#154212] text-white rounded-2xl lg:rounded-3xl p-5 lg:p-8 shadow-xl">
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-6 lg:mb-8">Prisoversikt</h4>
                    <div className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70 truncate mr-2">{service.name}</span>
                        <span className="font-mono flex-shrink-0">{priceFormatted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/70">Påmelding</span>
                        <span className="font-mono">0,00 kr</span>
                      </div>
                    </div>
                    <div className="h-px bg-white/10 w-full mb-4 lg:mb-6"></div>
                    <div className="flex justify-between items-end mb-6 lg:mb-10">
                      <div>
                        <p className="text-xs text-white/40 uppercase font-mono mb-1">Total</p>
                        <p className="text-3xl lg:text-4xl font-bold tracking-tighter text-[#d2f000]">
                          {service.price === 0 ? "Gratis" : `${service.price.toLocaleString("nb-NO")} kr`}
                        </p>
                      </div>
                      {service.name.includes("Performance") && <span className="text-xs text-white/40">per mnd</span>}
                    </div>
                    <button 
                      type="submit"
                      disabled={submitting || !acceptedTerms}
                      onClick={(e) => {
                        if (!acceptedTerms) {
                          e.preventDefault();
                          setBookingError("Du må godta vilkårene før du kan fortsette");
                          document.getElementById('terms')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="w-full bg-[#d2f000] text-[#154212] py-4 lg:py-5 rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#d2f000]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#154212]"></div>
                          <span>Behandler...</span>
                        </>
                      ) : (
                        <>
                          Bekreft og betal <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    <div className="bg-[#f7f3ea] rounded-2xl p-3 lg:p-4 flex flex-col items-center text-center">
                      <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-[#154212] mb-1 lg:mb-2" />
                      <p className="font-bold text-[10px] uppercase tracking-wide text-[#154212]">Sikker betaling</p>
                      <p className="text-[10px] text-[#42493e]/70">SSL kryptering</p>
                    </div>
                    <div className="bg-[#f7f3ea] rounded-2xl p-3 lg:p-4 flex flex-col items-center text-center">
                      <CalendarCheck className="w-5 h-5 lg:w-6 lg:h-6 text-[#154212] mb-1 lg:mb-2" />
                      <p className="font-bold text-[10px] uppercase tracking-wide text-[#154212]">Avbestilling</p>
                      <p className="text-[10px] text-[#42493e]/70">Opptil 24t før</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
