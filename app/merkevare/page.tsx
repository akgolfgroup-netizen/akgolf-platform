"use client";

import { useState, useRef, useCallback, type FormEvent, type DragEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SubPageHero } from "@/components/website/SubPageHero";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll, StaggerContainer, StaggerItem } from "@/components/website/RevealOnScroll";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import {
  MERKEVARE_FEATURES,
  MERKEVARE_PACKAGES,
  MERKEVARE_SOCIAL_PROOF,
} from "@/lib/website-constants";

type FormStatus = "idle" | "submitting" | "error";

export default function MerkevarePage() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    if (selectedFile) {
      data.set("logo", selectedFile);
    }

    try {
      const res = await fetch("/api/merkevare", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        router.push("/merkevare/takk");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <WebsiteNav />

      <main id="main-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Hjem", item: "https://akgolf.no" },
                { "@type": "ListItem", position: 2, name: "Merkevare", item: "https://akgolf.no/merkevare" },
              ],
            }),
          }}
        />
        <PageTransition>
        {/* ─── Hero ─── */}
        <SubPageHero
          eyebrow="AK Golf Utvikling"
          heading="Få din golfklubbs merkevare analysert gratis."
          description="Last opp logoen din, så leverer vi en komplett merkevare-analyse med farger, typografi og logo-regler — innen 24 timer."
          accent="software"
        />

        {/* ─── Social Proof Strip ─── */}
        <section className="bg-surface-cream border-y border-ink-10">
          <div className="w-container py-8">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {MERKEVARE_SOCIAL_PROOF.map((stat) => (
                <StaggerItem key={stat.label}>
                  <span className="font-mono text-2xl md:text-3xl font-medium text-ink-90">{stat.value}</span>
                  <p className="text-xs text-ink-40 mt-1">{stat.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── Form + Benefits Section ─── */}
        <section id="skjema" className="w-section-lg bg-surface-warm">
          <div className="w-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left: Benefits */}
              <RevealOnScroll>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    <SectionLabel>Gratis analyse</SectionLabel>
                  </div>
                  <h2 className="w-heading-lg mb-6">
                    Alt starter med<br />
                    <span className="text-ink-40">logoen din.</span>
                  </h2>
                  <p className="text-ink-50 leading-relaxed mb-8">
                    Vi analyserer fargene, typografien og strukturen i logoen din — og leverer en profesjonell merkevare-analyse som viser hvordan klubben kan styrke sin visuelle identitet.
                  </p>

                  <div className="space-y-4">
                    {[
                      { title: "Fargeanalyse", desc: "Pantone, CMYK, HEX — med WCAG-kontrastsjekk" },
                      { title: "Logo-regler", desc: "Plassering, minstestørrelse og frisoner" },
                      { title: "Typografi", desc: "Fonter som passer klubbens profil" },
                      { title: "Designsystem", desc: "CSS tokens og Tailwind-config for digital bruk" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center mt-0.5 shrink-0">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gold">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-80">{item.title}</p>
                          <p className="text-xs text-ink-40">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              {/* Right: Form */}
              <RevealOnScroll delay={0.2}>
                <div className="w-card">
                  <h3 className="w-heading-sm mb-1">Last opp klubbens logo</h3>
                  <p className="text-sm text-ink-40 mb-6">Fyll ut skjemaet under, så sender vi analysen til deg.</p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="klubbnavn" className="w-label flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        Klubbnavn *
                      </label>
                      <input
                        type="text"
                        id="klubbnavn"
                        name="klubbnavn"
                        required
                        className="w-input"
                        placeholder="F.eks. Fredrikstad Golfklubb"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="kontaktperson" className="w-label flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          Kontaktperson *
                        </label>
                        <input
                          type="text"
                          id="kontaktperson"
                          name="kontaktperson"
                          required
                          className="w-input"
                          placeholder="Fullt navn"
                        />
                      </div>
                      <div>
                        <label htmlFor="epost" className="w-label flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          E-post *
                        </label>
                        <input
                          type="email"
                          id="epost"
                          name="epost"
                          required
                          className="w-input"
                          placeholder="epost@klubb.no"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="telefon" className="w-label flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          Telefon
                        </label>
                        <input
                          type="tel"
                          id="telefon"
                          name="telefon"
                          className="w-input"
                          placeholder="+47"
                        />
                      </div>
                      <div>
                        <label htmlFor="nettside" className="w-label flex items-center gap-1.5">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                          Nettside
                        </label>
                        <input
                          type="url"
                          id="nettside"
                          name="nettside"
                          className="w-input"
                          placeholder="https://klubb.no"
                        />
                      </div>
                    </div>

                    {/* File upload — drag & drop */}
                    <div>
                      <label className="w-label flex items-center gap-1.5 mb-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Logo (SVG, PNG eller PDF) *
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 ${
                          dragActive
                            ? "border-gold bg-gold/5"
                            : selectedFile
                              ? "border-success/40 bg-success/5"
                              : "border-ink-20 hover:border-ink-30"
                        }`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          name="logo"
                          accept=".svg,.png,.pdf,.ai,.eps"
                          className="hidden"
                          onChange={handleFileChange}
                        />

                        <AnimatePresence mode="wait">
                          {selectedFile ? (
                            <motion.div
                              key="file"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center justify-center gap-2"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span className="text-sm text-ink-70">{selectedFile.name}</span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                className="text-ink-40 hover:text-ink-60 ml-1"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="empty"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ink-30 mx-auto mb-2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                              </svg>
                              <p className="text-sm text-ink-50">
                                Dra og slipp logoen hit, eller <span className="text-gold font-medium">velg fil</span>
                              </p>
                              <p className="text-xs text-ink-30 mt-1">SVG, PNG, PDF, AI eller EPS</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-red-600"
                      >
                        Noe gikk galt. Prøv igjen eller send e-post til post@akgolf.no.
                      </motion.p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "submitting" || !selectedFile}
                      className="w-btn w-btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sender...
                        </span>
                      ) : "Send inn — helt gratis"}
                    </button>

                    <p className="text-xs text-ink-30 text-center">
                      Vi deler aldri informasjonen din med tredjepart.
                    </p>
                  </form>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ─── What You Get — 3 Cards ─── */}
        <section className="w-section bg-surface-cream">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Hva du får</SectionLabel>
                <h2 className="w-heading-lg mt-4">Tre nivåer av merkevare-pakker.</h2>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {MERKEVARE_PACKAGES.map((pkg) => (
                <StaggerItem key={pkg.name}>
                  <div className={`w-card h-full flex flex-col ${pkg.highlighted ? "border-gold/30 ring-1 ring-gold/10 relative" : ""}`}>
                    {pkg.highlighted && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink-100 text-xs font-semibold px-3 py-1 rounded-full">
                        Mest populaer
                      </span>
                    )}
                    <div className="mb-4">
                      <h3 className="font-display text-lg font-semibold text-ink-90">{pkg.name}</h3>
                      <p className="font-mono text-2xl font-medium text-ink-90 mt-1">{pkg.price}</p>
                    </div>
                    <p className="text-sm text-ink-50 mb-6 leading-relaxed">{pkg.description}</p>
                    <ul className="space-y-2 mt-auto">
                      {pkg.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-ink-60">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold mt-0.5 shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <RevealOnScroll>
              <p className="text-center text-sm text-ink-40 mt-8">
                Alle pakker inkluderer en gratis forhåndsvisning av de tre første seksjonene.
              </p>
            </RevealOnScroll>
          </div>
        </section>

        {/* ─── Features Grid ─── */}
        <section className="w-section-lg">
          <div className="w-container">
            <RevealOnScroll>
              <div className="text-center mb-12">
                <SectionLabel>Innholdet</SectionLabel>
                <h2 className="w-heading-lg mt-4">Alt en golfklubb trenger for konsistent merkevare.</h2>
              </div>
            </RevealOnScroll>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MERKEVARE_FEATURES.map((feature) => (
                <StaggerItem key={feature.title}>
                  <div className="w-card h-full">
                    <div className="w-8 h-8 rounded-lg bg-ink-90 flex items-center justify-center mb-4">
                      <span className="font-mono text-xs text-gold">{feature.icon}</span>
                    </div>
                    <h4 className="font-display text-base font-semibold text-ink-90 mb-2">{feature.title}</h4>
                    <p className="text-sm text-ink-50 leading-relaxed">{feature.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="bg-ink-100 w-section relative overflow-hidden w-section-dark">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none w-animate-glow-pulse"
            style={{ background: "radial-gradient(circle, rgba(184, 151, 92, 0.08) 0%, transparent 70%)" }}
          />

          <div className="w-container relative">
            <RevealOnScroll>
              <div className="max-w-2xl mx-auto text-center rounded-2xl p-10 md:p-16 bg-ink-90/50 backdrop-blur-sm border border-white/[0.06]">
                <SectionLabel>Klar for a starte?</SectionLabel>
                <h2 className="w-heading-lg text-white mt-4 mb-4">Last opp logoen — vi gjor resten.</h2>
                <p className="text-ink-40 leading-relaxed mb-8">
                  Helt gratis analyse av klubbens merkevare. Ingen forpliktelser, ingen skjulte kostnader.
                </p>
                <a href="#skjema" className="w-btn w-btn-gold">
                  Start gratis analyse
                </a>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
