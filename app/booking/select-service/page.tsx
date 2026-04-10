"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Star, Zap } from "lucide-react";
import { BookingNavSidebar } from "../components/BookingNavSidebar";
import { BookingProgress } from "../components/BookingProgress";

interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  price: number;
  color: string | null;
  minNoticeHours: number;
  maxAdvanceDays: number;
  allowStripe: boolean;
  allowVipps: boolean;
  Instructor: {
    id: string;
    title: string | null;
    User: {
      name: string | null;
      image: string | null;
    };
  }[];
}

function getServiceFeatures(service: ServiceType): string[] {
  if (service.name.includes("Performance Pro")) {
    return ["4 sesjoner per maned", "TrackMan analyse", "4 ukers bookingvindu", "Full spillerportal"];
  }
  if (service.name.includes("Performance")) {
    return ["2 sesjoner per maned", "TrackMan analyse", "4 ukers bookingvindu", "Full spillerportal"];
  }
  if (service.name.includes("Flex")) {
    return [`${service.duration} minutter`, "Ingen binding", "Book 3 uker i forveien", "Coaching-notater"];
  }
  return [`${service.duration} minutter`];
}

export default function BookingSelectServicePage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/public/service-types?exclude=Foundation,Start,Banecoaching")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => {
            const getPriority = (name: string) => {
              if (name.includes("Performance Pro")) return 1;
              if (name.includes("Performance")) return 2;
              if (name.includes("Flex 50")) return 3;
              if (name.includes("Flex 90")) return 4;
              return 5;
            };
            return getPriority(a.name) - getPriority(b.name);
          });
          setServices(sorted);
        } else {
          setError("Kunne ikke laste tjenester");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Kunne ikke laste tjenester");
        setLoading(false);
      });
  }, []);

  const handleSelect = (serviceId: string) => {
    router.push(`/booking/date-time?serviceTypeId=${serviceId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-64 bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-64 bg-white">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 text-white rounded-lg font-medium bg-primary">
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  const performanceServices = services.filter(s => s.name.includes("Performance"));
  const flexServices = services.filter(s => s.name.includes("Flex"));

  return (
    <>
      <div className="hidden lg:block">
        <BookingProgress currentStep={1} />
      </div>
      <BookingNavSidebar currentStep={1} />

      <main className="lg:ml-64 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          {/* Heading */}
          <div className="mb-10 lg:mb-14">
            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-primary mb-3">
              Velg din <span className="text-text">coaching</span>
            </h1>
            <p className="text-base lg:text-lg text-muted">
              Abonnement for løpende oppfølging, eller Flex for enkelt-timer
            </p>
          </div>

          {/* ── ABONNEMENT ── */}
          {performanceServices.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-2.5 mb-6">
                <Star className="w-5 h-5 text-accent-cta" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-primary">
                  Abonnement
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {performanceServices.map((service) => {
                  const features = getServiceFeatures(service);
                  const isPro = service.name.includes("Pro");

                  return (
                    <div
                      key={service.id}
                      onClick={() => handleSelect(service.id)}
                      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                        isPro
                          ? "bg-primary text-white shadow-2xl shadow-primary/25 hover:shadow-3xl hover:shadow-primary/30 hover:-translate-y-1"
                          : "bg-white text-text border border-grey-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5"
                      }`}
                    >
                      {isPro && (
                        <div className="absolute top-4 right-4 bg-accent-cta text-primary text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                          Mest populær
                        </div>
                      )}

                      <div className="p-7 pb-5">
                        {/* Icon + Price */}
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isPro ? "bg-white/10" : "bg-surface"
                          }`}>
                            {isPro
                              ? <Star className="w-6 h-6 text-accent-cta" />
                              : <Zap className="w-6 h-6 text-primary" />
                            }
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold tracking-tight ${isPro ? "text-white" : "text-primary"}`}>
                              {service.price.toLocaleString("nb-NO")} kr
                            </div>
                            <div className={`text-xs uppercase tracking-wider ${isPro ? "text-white/50" : "text-muted"}`}>
                              per måned
                            </div>
                          </div>
                        </div>

                        {/* Name */}
                        <h3 className={`text-xl font-bold mb-1 ${isPro ? "text-white" : "text-primary"}`}>
                          {service.name}
                        </h3>
                        <p className={`text-sm mb-5 ${isPro ? "text-white/60" : "text-muted"}`}>
                          {service.description || "Coaching med full spillerportal"}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2.5 mb-6">
                          {features.map((feature, i) => (
                            <li key={i} className={`flex items-center gap-2.5 text-sm ${isPro ? "text-white/80" : "text-text"}`}>
                              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPro ? "bg-accent-cta" : "bg-primary/30"}`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <div className={`px-7 pb-7`}>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleSelect(service.id); }}
                          className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group-hover:gap-3 ${
                            isPro
                              ? "bg-accent-cta text-primary hover:brightness-105"
                              : "bg-surface text-primary hover:bg-grey-200"
                          }`}
                        >
                          Velg
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── ENKELT-TIMER ── */}
          {flexServices.length > 0 && (
            <section className="mb-14">
              <div className="flex items-center gap-2.5 mb-6">
                <Clock className="w-5 h-5 text-muted" />
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted">
                  Enkelt-timer
                </h2>
              </div>

              <div className="space-y-3">
                {flexServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleSelect(service.id)}
                    className="group flex items-center justify-between bg-surface hover:bg-grey-100 rounded-xl px-5 py-4 cursor-pointer transition-all duration-200 border border-transparent hover:border-primary/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center font-bold text-primary text-sm border border-grey-200">
                        {service.duration}
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary text-sm">
                          {service.name.replace("Solo", "").replace("Duo", "").trim()}
                          {service.name.includes("Duo") && (
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary/5 text-primary/60 px-2 py-0.5 rounded-full">
                              2 pers
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-muted">
                          Fra {service.price.toLocaleString("nb-NO")} kr · Ingen binding · Book 3 uker i forveien
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t border-grey-200">
            <p className="text-xs text-muted">
              Har du spørsmål? Kontakt oss på{" "}
              <a href="mailto:post@akgolf.no" className="underline text-primary hover:text-primary/80">
                post@akgolf.no
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
