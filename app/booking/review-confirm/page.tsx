"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flag, User, Calendar, Receipt, UserCircle, AlertCircle, Check, CreditCard, Smartphone, ArrowRight, Shield, CalendarCheck } from "@/components/shared/icons";

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
  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "VIPPS">("STRIPE");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setBookingError(data.error || "Kunne ikke opprette booking");
        setSubmitting(false);
        return;
      }

      if (data.clientSecret && data.bookingId) {
        router.push(`/booking/${data.bookingId}/pay?clientSecret=${encodeURIComponent(data.clientSecret)}`);
      } else {
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
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154212]"></div>
      </div>
    );
  }

  if (error || !service || !instructor || !startTime) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
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
      <aside className="h-screen w-64 fixed left-0 top-0 bg-[#154212] flex flex-col h-full py-8 shadow-[4px_0_16px_rgba(45,90,39,0.06)] z-40">
        <div className="px-6 mb-12">
          <h1 className="text-white font-black text-2xl tracking-tighter">AK Golf Academy</h1>
          <p className="font-medium uppercase text-[10px] text-white/50 tracking-widest mt-1">Fredrikstad & Miklagard</p>
        </div>
        <nav className="flex-1 space-y-2">
          <Link 
            href={`/booking/select-service?serviceTypeId=${serviceTypeId}`}
            className="text-white/70 py-3 px-6 font-medium uppercase text-xs hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <Flag className="w-5 h-5" /><span>Pakke</span>
          </Link>

          <Link 
            href={`/booking/date-time?serviceTypeId=${serviceTypeId}`}
            className="text-white/70 py-3 px-6 font-medium uppercase text-xs hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <Calendar className="w-5 h-5" /><span>Tid</span>
          </Link>
          <div className="bg-[#d2f000] text-[#154212] rounded-r-full mr-4 py-3 px-6 font-medium uppercase text-xs flex items-center gap-3">
            <Check className="w-5 h-5" /><span>Bekreft</span>
          </div>
        </nav>
        <div className="px-6 mt-auto">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">System Status</p>
            <p className="text-xs text-[#d2f000] font-medium">Klar for bekreftelse</p>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        <header className="sticky top-0 z-30 bg-[#fdf9f0] border-b border-[#f7f3ea]">
          <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#154212]/60">STEG 04/04</span>
              <h2 className="font-semibold uppercase tracking-wider text-[#154212]">Oppsummering & Betaling</h2>
            </div>
            <div className="flex items-center gap-6">
              <UserCircle className="w-6 h-6 text-[#154212] cursor-pointer" />
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-12">
            <span className="font-mono text-[#154212] text-[10px] uppercase tracking-widest block mb-2">Siste sjekk</span>
            <h3 className="text-5xl font-bold text-[#154212] tracking-tight leading-tight">
              Gjennomgå din <span className="text-[#b8d300]">booking</span>.
            </h3>
          </div>

          {bookingError && (
            <div className="mb-8 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-[#ba1a1a]" />
              <p className="text-[#ba1a1a]">{bookingError}</p>
            </div>
          )}

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-7 space-y-8">
              <section className="bg-white rounded-3xl p-8 shadow-[0_4px_16px_rgba(45,90,39,0.04)] overflow-hidden relative border border-[#f1eee5]">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h4 className="text-2xl font-bold text-[#154212] mb-1">{service.name}</h4>
                    <p className="text-[#42493e] flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {instructor.User.name}
                    </p>
                  </div>
                  <div className="bg-[#154212]/5 px-4 py-2 rounded-full border border-[#154212]/10">
                    <span className="font-mono text-xs font-medium text-[#154212] uppercase">
                      {service.name.includes("Performance") ? "Månedlig" : "Engang"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#154212]/40 tracking-widest block mb-1">Dato & Tid</label>
                      <p className="text-lg font-semibold text-[#154212]">{formatDate(startTime)}</p>
                      <p className="text-[#42493e]">{formatTime(startTime)} — {formatTime(endTime)} ({service.duration || 20} Min)</p>
                    </div>
                    <div>
                      <label className="font-mono text-[10px] uppercase text-[#154212]/40 tracking-widest block mb-1">Lokasjon</label>
                      <p className="text-lg font-semibold text-[#154212]">Gamle Fredrikstad GK</p>
                      <p className="text-[#42493e]">Driving range / TrackMan</p>
                    </div>
                  </div>
                  <div className="space-y-6">
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

              <section className="bg-white rounded-3xl p-8 border border-[#f1eee5]">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-[#154212] uppercase tracking-tight">Dine opplysninger</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">Navn *</label>
                    <input 
                      className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16]"
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
                      className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16]"
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
                      className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16]"
                      placeholder="+47 000 00 000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase text-[#72796e] block mb-1">Handicap</label>
                    <input 
                      className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#1c1c16]"
                      placeholder="f.eks. 12.5"
                      type="text"
                      value={handicap}
                      onChange={(e) => setHandicap(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl p-8 border border-[#f1eee5]">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-[#154212] uppercase tracking-tight">Betalingsmåte</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod("STRIPE")}
                    className={`border-2 ${paymentMethod === "STRIPE" ? 'border-[#d2f000] bg-[#d2f000]/5' : 'border-[#f1eee5]'} rounded-2xl p-5 flex items-center gap-4 cursor-pointer relative transition-all`}
                  >
                    <CreditCard className="w-6 h-6 text-[#154212]" />
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
                  <div 
                    onClick={() => service.allowVipps && setPaymentMethod("VIPPS")}
                    className={`border-2 ${paymentMethod === "VIPPS" ? 'border-[#d2f000] bg-[#d2f000]/5' : 'border-[#f1eee5]'} ${!service.allowVipps ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#f7f3ea]'} rounded-2xl p-5 flex items-center gap-4 transition-all`}
                  >
                    <Smartphone className="w-6 h-6 text-[#42493e]" />
                    <div className="flex-1">
                      <p className="font-bold text-[#42493e] text-sm">Vipps</p>
                      <p className="text-xs text-[#42493e]/60">{service.allowVipps ? "Mobilbetaling" : "Ikke tilgjengelig"}</p>
                    </div>
                    {paymentMethod === "VIPPS" && (
                      <div className="w-5 h-5 bg-[#154212] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex items-start gap-3">
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

            <div className="col-span-12 lg:col-span-5">
              <div className="sticky top-32 space-y-6">
                <div className="bg-[#154212] text-white rounded-3xl p-8 shadow-xl">
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 mb-8">Prisoversikt</h4>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{service.name}</span>
                      <span className="font-mono">{priceFormatted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Påmelding</span>
                      <span className="font-mono">0,00 kr</span>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 w-full mb-6"></div>
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <p className="text-xs text-white/40 uppercase font-mono mb-1">Total</p>
                      <p className="text-4xl font-bold tracking-tighter text-[#d2f000]">
                        {service.price === 0 ? "Gratis" : `${service.price.toLocaleString("nb-NO")},00 kr`}
                      </p>
                    </div>
                    {service.name.includes("Performance") && <span className="text-xs text-white/40">per mnd</span>}
                  </div>
                  <button 
                    type="submit"
                    disabled={submitting || !acceptedTerms}
                    className="w-full bg-[#d2f000] text-[#154212] py-5 rounded-2xl font-bold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#d2f000]/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <p className="mt-4 text-xs text-center text-white/40">Coaching-tjenester er MVA-fritatt</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f7f3ea] rounded-2xl p-4 flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-[#154212] mb-2" />
                    <p className="font-bold text-[10px] uppercase tracking-wide text-[#154212]">Sikker betaling</p>
                    <p className="text-[10px] text-[#42493e]/70">SSL kryptering</p>
                  </div>
                  <div className="bg-[#f7f3ea] rounded-2xl p-4 flex flex-col items-center text-center">
                    <CalendarCheck className="w-6 h-6 text-[#154212] mb-2" />
                    <p className="font-bold text-[10px] uppercase tracking-wide text-[#154212]">Avbestilling</p>
                    <p className="text-[10px] text-[#42493e]/70">Opptil 24t før</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
