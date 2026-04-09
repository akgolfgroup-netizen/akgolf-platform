"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Mail, Calendar, ArrowRight, MapPin, Check } from "@/components/shared/icons";

export default function LandingContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "E-post",
      value: "post@akgolf.no",
      href: "mailto:post@akgolf.no",
    },
    {
      icon: Mail,
      title: "Support",
      value: "support@akgolf.no",
      href: "mailto:support@akgolf.no",
    },
    {
      icon: Calendar,
      title: "Booking",
      value: "bestilling@akgolf.no",
      href: "mailto:bestilling@akgolf.no",
    },
  ];

  const locations = [
    {
      name: "Gamle Fredrikstad Golfklubb",
      address: "Kongleveien 142, 1615 Fredrikstad",
      features: ["Driving range", "18 hull", "Korthullsbane", "TrackMan 4i"],
    },
    {
      name: "Miklagard Golfklubb",
      address: "Svingen 120, 2114 Disenå",
      features: ["18 hull", "Banecoaching", "Øvingsområde"],
    },
  ];

  return (
    <>
      <Navbar variant="light" />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-[#154212] overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="mb-6 font-mono text-xs uppercase tracking-widest text-[#d2f000] flex items-center gap-4">
                <div className="h-px w-12 bg-[#d2f000]/40"></div>
                Kontakt
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
                Ta kontakt
              </h1>
              <p className="text-xl text-white/70 leading-relaxed">
                Har du spørsmål om våre pakker, ønsker du en gratis konsultasjon, 
                eller trenger du support? Vi er her for å hjelpe.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-[1440px] mx-auto -mt-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="bg-white rounded-2xl p-8 border border-[#154212]/5 shadow-lg hover:-translate-y-1 transition-transform group"
              >
                <div className="w-12 h-12 bg-[#f7f3ea] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d2f000] transition-colors">
                  <item.icon className="w-6 h-6 text-[#154212]" />
                </div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#154212]/60 mb-2">
                  {item.title}
                </h3>
                <p className="text-lg font-semibold text-[#154212]">{item.value}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Locations */}
        <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="text-center mb-12">
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-[#154212]/20"></div>
              Lokasjoner
              <div className="h-px w-12 bg-[#154212]/20"></div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#154212] tracking-tight">
              Hvor du finner oss
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {locations.map((location) => (
              <div
                key={location.name}
                className="bg-white rounded-[32px] overflow-hidden border border-[#154212]/5 shadow-lg"
              >
                <div className="aspect-[16/9] bg-[#f7f3ea]">
                  <img
                    src={`/images/academy/AK-Golf-Academy-${location.name.includes("Fredrikstad") ? "5" : "20"}.jpg`}
                    alt={location.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#154212] mb-2">
                    {location.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#42493e] mb-4">
                    <MapPin className="w-4 h-4 text-[#d2f000]" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {location.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-[10px] font-bold uppercase tracking-wider text-[#154212]/60 border border-[#154212]/10 px-2 py-1 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 lg:py-24 bg-[#f7f3ea]">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <div className="mb-4 font-mono text-xs uppercase tracking-widest text-[#154212]/60 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-[#154212]/20"></div>
                  Send melding
                  <div className="h-px w-12 bg-[#154212]/20"></div>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#154212] tracking-tight">
                  Skriv til oss
                </h2>
              </div>

              {submitted ? (
                <div className="bg-white rounded-[32px] p-12 text-center border border-[#154212]/5">
                  <div className="w-16 h-16 bg-[#d2f000] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-[#154212]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#154212] mb-4">
                    Melding sendt!
                  </h3>
                  <p className="text-[#42493e] mb-6">
                    Takk for din henvendelse. Vi svarer vanligvis innen 24 timer.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#154212] font-semibold hover:text-[#d2f000] transition-colors"
                  >
                    Send ny melding
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white rounded-[32px] p-8 lg:p-12 border border-[#154212]/5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-[#154212]/60 mb-2">
                        Navn *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#154212] focus:ring-2 focus:ring-[#d2f000] focus:outline-none"
                        placeholder="Ditt navn"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-[#154212]/60 mb-2">
                        E-post *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#154212] focus:ring-2 focus:ring-[#d2f000] focus:outline-none"
                        placeholder="din@epost.no"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-[#154212]/60 mb-2">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#154212] focus:ring-2 focus:ring-[#d2f000] focus:outline-none"
                        placeholder="+47 000 00 000"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] uppercase tracking-widest text-[#154212]/60 mb-2">
                        Emne *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#154212] focus:ring-2 focus:ring-[#d2f000] focus:outline-none"
                      >
                        <option value="">Velg emne</option>
                        <option value="booking">Spørsmål om booking</option>
                        <option value="packages">Pakker og priser</option>
                        <option value="support">Support</option>
                        <option value="other">Annet</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block font-mono text-[10px] uppercase tracking-widest text-[#154212]/60 mb-2">
                      Melding *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full bg-[#f7f3ea] border-none rounded-xl px-4 py-3 text-[#154212] focus:ring-2 focus:ring-[#d2f000] focus:outline-none resize-none"
                      placeholder="Skriv din melding her..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#d2f000] text-[#154212] font-bold uppercase tracking-widest text-sm rounded-xl hover:shadow-[0_0_20px_rgba(210,240,0,0.4)] transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Send melding
                    <Mail className="w-4 h-4" />
                  </button>

                  <p className="mt-4 text-xs text-[#42493e] text-center">
                    Ved å sende dette skjemaet godtar du vår{" "}
                    <Link
                      href="/personvern"
                      className="text-[#154212] underline hover:text-[#d2f000]"
                    >
                      personvernerklæring
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Quick CTA */}
        <section className="py-16 lg:py-24 px-6 lg:px-8 max-w-[1440px] mx-auto">
          <div className="bg-[#154212] rounded-[32px] p-8 lg:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-6">
              Vil du komme i gang med en gang?
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8">
              Book en coaching-sesjon direkte i vår bookingsystem. Ingen ventetid, 
              ingen telefonkø — bare velg tid som passer deg.
            </p>
            <Link
              href="/booking-temp"
              className="inline-flex items-center gap-2 bg-[#d2f000] text-[#154212] px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:scale-105 transition-transform"
            >
              Book nå
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer variant="light" />
    </>
  );
}
