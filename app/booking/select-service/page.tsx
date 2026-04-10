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
    return ["4 sesjoner per måned", "TrackMan analyse", "14 dagers booking", "Full spillerportal"];
  }
  if (service.name.includes("Performance")) {
    return ["2 sesjoner per måned", "TrackMan analyse", "7 dagers booking", "Full spillerportal"];
  }
  if (service.name.includes("Flex")) {
    return [`${service.duration} minutter`, "Ingen binding", "Book 48t i forveien", "Coaching-notater"];
  }
  return [`${service.duration} minutter`];
}

function getIcon(name: string) {
  if (name.includes("Performance Pro")) return Star;
  if (name.includes("Performance")) return Zap;
  return Clock;
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
          // Sorter: Performance først, så Flex
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
      <div className="min-h-screen flex items-center justify-center lg:ml-64 bg-surface">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center lg:ml-64 bg-surface">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 text-white rounded-lg font-medium bg-primary"
          >
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
      {/* Progress Bar - Desktop only */}
      <div className="hidden lg:block">
        <BookingProgress currentStep={1} />
      </div>

      {/* Navigation Sidebar */}
      <BookingNavSidebar currentStep={1} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Mobile Title */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2 text-text">
              Velg din <span className="text-primary">coaching</span>
            </h1>
            <p className="text-sm text-muted">
              Abonnement eller enkelt-timer
            </p>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-text">
              Velg din <span className="text-primary">coaching</span>
            </h1>
            <p className="text-base text-muted">
              Abonnement for løpende oppfølging, eller Flex for enkelt-timer
            </p>
          </div>

          {/* Performance-seksjon */}
          {performanceServices.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Abonnement
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {performanceServices.map((service) => {
                  const features = getServiceFeatures(service);
                  const Icon = getIcon(service.name);
                  const isPro = service.name.includes("Pro");

                  return (
                    <div
                      key={service.id}
                      className={`group relative rounded-2xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer bg-white border ${isPro ? "border-accent-cta ring-2 ring-accent-cta" : "border-primary/10"}`}
                      onClick={() => handleSelect(service.id)}
                    >
                      {isPro && (
                        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold bg-accent-cta text-primary">
                          Mest populær
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPro ? "bg-primary" : "bg-surface"}`}>
                          <Icon className={`w-5 h-5 ${isPro ? "text-accent-cta" : "text-primary"}`} />
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-semibold text-primary">
                            {service.price.toLocaleString("nb-NO")}
                          </span>
                          <span className="text-sm text-muted"> kr/mnd</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-text">
                        {service.name}
                      </h3>

                      <p className="text-sm mb-4 leading-relaxed text-muted">
                        {service.description || "Coaching med full spillerportal og progresjonssporing"}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-text">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent-cta" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        className={`w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group-hover:gap-3 ${isPro ? "bg-primary text-white" : "bg-surface text-primary"}`}
                        onClick={(e) => { e.stopPropagation(); handleSelect(service.id); }}
                      >
                        Velg
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flex-seksjon */}
          {flexServices.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Flex — Enkelt-timer
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flexServices.map((service) => {
                  const features = getServiceFeatures(service);

                  return (
                    <div
                      key={service.id}
                      className="group rounded-2xl p-6 transition-all duration-200 hover:shadow-md cursor-pointer bg-surface border border-transparent"
                      onClick={() => handleSelect(service.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-semibold text-primary">
                            {service.price.toLocaleString("nb-NO")}
                          </span>
                          <span className="text-sm text-muted"> kr</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-text">
                        {service.name}
                      </h3>

                      <p className="text-sm mb-4 leading-relaxed text-muted">
                        {service.description || "Coaching uten forpliktelser"}
                      </p>

                      <ul className="space-y-2 mb-6">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-text">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary opacity-40" />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        className="w-full py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group-hover:gap-3 bg-white text-primary border border-primary/20"
                        onClick={(e) => { e.stopPropagation(); handleSelect(service.id); }}
                      >
                        Velg
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info */}
          <div className="rounded-xl p-6 text-center bg-surface">
            <p className="text-sm text-muted">
              Har du spørsmål? Kontakt oss på{" "}
              <a href="mailto:post@akgolf.no" className="underline text-primary">
                post@akgolf.no
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
