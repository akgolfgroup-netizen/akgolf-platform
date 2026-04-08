"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, GolfIcon, Rocket, Star, Timer } from "@/components/shared/icons";

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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "Performance Pro": Star,
  "Performance": Star,
  "Start": Rocket,
  "Start (Onboarding)": Rocket,
  "Flex 50": Clock,
  "Flex 90": Timer,
  "On-Course 9": GolfIcon,
  "On-Course Par 3": GolfIcon,
};

function getServiceFeatures(service: ServiceType): string[] {
  const baseFeatures = [`${service.duration} minutter`];
  
  if (service.name.includes("Performance")) {
    const sessions = service.name.includes("Pro") ? "4 sesjoner" : "2 sesjoner";
    return [sessions + " per måned", "TrackMan analyse", service.name.includes("Pro") ? "14 dagers booking" : "7 dagers booking", "Full spillerportal"];
  }
  if (service.name.includes("Start")) {
    return ["3 sesjoner", "TrackMan analyse", "Personlig plan", "30 dager portal"];
  }
  if (service.name.includes("Flex")) {
    return [`${service.duration} minutter`, "Ingen binding", "Book 48t i forveien", "Coaching-notater"];
  }
  if (service.name.includes("On-Course")) {
    return ["Banecoaching", "DECADE-strategi", "Course management"];
  }
  return baseFeatures;
}

export default function BookingSelectServicePage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/portal/public/service-types")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => {
            const order = ["Performance Pro", "Performance", "Start", "Flex 50", "Flex 90", "On-Course"];
            const aIndex = order.findIndex(o => a.name.includes(o));
            const bIndex = order.findIndex(o => b.name.includes(o));
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            return 0;
          });
          setServices(sorted);
          if (sorted.length > 0) {
            setSelectedId(sorted[0].id);
          }
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

  const handleContinue = () => {
    if (selectedId) {
      // Gå direkte til date-time med default coach (første tilgjengelige)
      router.push(`/booking/date-time?serviceTypeId=${selectedId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#154212]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fdf9f0] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ba1a1a] mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#154212] text-white rounded-lg"
          >
            Prøv igjen
          </button>
        </div>
      </div>
    );
  }

  const mainServices = services.filter(s => !s.name.includes("Flex") && !s.name.includes("On-Course"));
  const flexServices = services.filter(s => s.name.includes("Flex"));
  const onCourseServices = services.filter(s => s.name.includes("On-Course"));

  return (
    <>
      <nav className="bg-[#fdf9f0] sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-8 py-6 max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-bold text-[#154212] tracking-tighter uppercase">AK Golf Academy</Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/landing/pricing" className="font-semibold uppercase tracking-wider text-xs text-[#154212]/60 hover:text-[#154212] transition-colors">Priser</Link>
            <Link href="/booking/select-service" className="font-semibold uppercase tracking-wider text-xs text-[#154212] border-b-2 border-[#d2f000] pb-1">Book nå</Link>
          </div>
        </div>
        <div className="bg-[#f7f3ea] h-px w-full"></div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 pt-12 pb-24">
        <header className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#154212]/60 mb-2 block">Steg 01 / 03</span>
            <h1 className="text-5xl font-bold text-[#154212] tracking-tight leading-[1.1]">Velg din <span className="italic text-[#154212]/80">pakke</span></h1>
            <p className="mt-4 text-[#42493e] text-lg leading-relaxed">Alle pakker inkluderer full tilgang til AK Golf spillerportalen.</p>
          </div>
          <div className="flex items-center gap-4 bg-[#f7f3ea] p-2 rounded-full px-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-[#154212] text-[#d2f000] flex items-center justify-center font-mono text-sm font-bold">1</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#154212]">Pakke</span>
            </div>
            <div className="w-8 h-px bg-[#c2c9bb]/30"></div>
            <div className="flex items-center gap-2 opacity-30">
              <span className="w-8 h-8 rounded-full bg-[#e6e2d9] flex items-center justify-center font-mono text-sm">2</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Tid</span>
            </div>
            <div className="w-8 h-px bg-[#c2c9bb]/30"></div>
            <div className="flex items-center gap-2 opacity-30">
              <span className="w-8 h-8 rounded-full bg-[#e6e2d9] flex items-center justify-center font-mono text-sm">3</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Betal</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mainServices.map((service) => {
            const isSelected = selectedId === service.id;
            const features = getServiceFeatures(service);
            const IconComponent = iconMap[service.name] || Star;
            const priceFormatted = service.price === 0 ? "Gratis" : 
              service.name.includes("Performance") ? `${service.price.toLocaleString("nb-NO")} kr/mnd` :
              `${service.price.toLocaleString("nb-NO")} kr`;
            
            return (
              <div 
                key={service.id} 
                onClick={() => setSelectedId(service.id)}
                className={`group relative bg-white rounded-xl p-8 transition-all duration-300 flex flex-col cursor-pointer ${isSelected ? 'ring-2 ring-[#d2f000] shadow-[0_4px_16px_rgba(45,90,39,0.06)]' : 'hover:scale-[1.02] shadow-[0_4px_16px_rgba(45,90,39,0.04)]'}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${isSelected ? 'bg-[#154212]' : 'bg-[#f7f3ea]'}`}>
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-[#d2f000]' : 'text-[#154212]'}`} />
                  </div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-2xl text-[#154212]">{service.name}</h3>
                    <span className="font-mono text-lg font-bold text-[#154212]">{priceFormatted}</span>
                  </div>
                  <p className="text-[#42493e] text-sm leading-relaxed mb-6">{service.description || "Coaching med AK Golf Academy"}</p>
                  <div className="space-y-2 mb-8">
                    {features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded-full bg-[#d2f000] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-[#154212]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-[#42493e]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setSelectedId(service.id); }}
                  className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all mt-auto ${isSelected ? 'bg-[#d2f000] text-[#154212]' : 'bg-[#f7f3ea] text-[#154212] hover:bg-[#d2f000]'}`}
                >
                  {isSelected ? 'Valgt' : 'Velg'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Flex og On-Course */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {flexServices.slice(0, 1).map((service) => (
            <div key={service.id} className="bg-[#f7f3ea] rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Timer className="w-8 h-8 text-[#154212]" />
                <h3 className="font-bold text-xl text-[#154212]">{service.name}</h3>
              </div>
              <p className="text-[#42493e] text-sm mb-4">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-mono text-lg font-bold text-[#154212]">{service.price.toLocaleString("nb-NO")} kr</span>
                <button 
                  onClick={() => router.push(`/booking/date-time?serviceTypeId=${service.id}`)}
                  className="px-6 py-3 bg-[#154212] text-white rounded-lg font-bold uppercase text-xs tracking-wider hover:opacity-90 transition-all"
                >
                  Velg
                </button>
              </div>
            </div>
          ))}
          
          <div className="bg-[#154212] rounded-xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <GolfIcon className="w-8 h-8 text-[#d2f000]" />
              <h3 className="font-bold text-xl">Banecoaching</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">On-Course 9 hull med Anders (3 000 kr) eller Par 3 med Markus (500 kr). DECADE-strategi i praksis.</p>
            <button 
              onClick={() => {
                const onCourse = onCourseServices[0];
                if (onCourse) router.push(`/booking/date-time?serviceTypeId=${onCourse.id}`);
              }}
              className="w-full py-3 bg-[#d2f000] text-[#154212] rounded-lg font-bold uppercase text-xs tracking-wider hover:opacity-90 transition-all"
            >
              Se banecoaching
            </button>
          </div>
        </div>

        {/* Fortsett-knapp */}
        {selectedId && (
          <div className="mt-12 flex justify-end">
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-[#154212] text-white rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 hover:scale-[1.02] transition-transform"
            >
              Fortsett til tid
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Info om Drop-in */}
        <div className="mt-16 bg-[#f7f3ea] rounded-xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-[#154212] font-bold text-lg mb-2">Viktig om Drop-in (Flex)</h4>
            <p className="text-[#42493e] text-sm">Flex gir deg coaching uten forpliktelser. Men du får kun coaching-notater — ikke spillerportalen. Ingen treningsplan mellom sesjonene, ingen statistikk, ingen progresjon.</p>
          </div>
          <div className="shrink-0">
            <span className="bg-[#ba1a1a]/10 text-[#ba1a1a] px-4 py-2 rounded-full text-xs font-bold uppercase">Ingen portal inkludert</span>
          </div>
        </div>
      </main>
    </>
  );
}
