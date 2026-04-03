"use client";

import Link from "next/link";
import Image from "next/image";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { SectionLabel } from "@/components/website/SectionLabel";
import { RevealOnScroll } from "@/components/website/RevealOnScroll";
import { ApplicationForm } from "@/components/website/ApplicationForm";
import { RelatedPages } from "@/components/website/RelatedPages";
import { BackToTop } from "@/components/website/BackToTop";
import { PageTransition } from "@/components/website/PageTransition";
import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

const PRODUCTS = [
  {
    id: "qr-trening",
    title: "QR-treningsskilt",
    description: "Digitale treningsskilt med QR-koder som gir spillerne tilgang til øvelser og videoer direkte på rangen.",
    status: "Kommer",
  },
  {
    id: "sportsplan",
    title: "Sportsplan for klubber",
    description: "Helhetlige sportsplaner tilpasset klubbens størrelse, ambisjoner og ressurser.",
    status: "Kommer",
  },
];

export default function UtviklingPage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-grey-900)] focus:text-white focus:rounded-lg"
      >
        Hopp til hovedinnhold
      </a>
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
                { "@type": "ListItem", position: 2, name: "Utvikling", item: "https://akgolf.no/utvikling" },
              ],
            }),
          }}
        />
        <PageTransition>
          {/* Hero */}
          <section className="relative min-h-[70svh] flex items-center pt-[48px] overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/academy/AK-Golf-Academy-42.jpg"
                alt="Coach og elev gjennomgår data på laptop"
                fill
                className="object-cover object-[center_40%]"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
            </div>

            <div className="w-container relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [...EASE_ENTRANCE] }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 rounded-full bg-black" />
                  <SectionLabel>Utvikling</SectionLabel>
                </div>
              </motion.div>

              <motion.h1
                className="w-heading-xl max-w-3xl mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15, ease: [...EASE_ENTRANCE] }}
              >
                Teknologi for golfklubber.
              </motion.h1>

              <motion.p
                className="text-lg text-grey-500 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [...EASE_ENTRANCE] }}
              >
                Digitale verktøy og rådgiving for klubber som vil ligge i forkant.
              </motion.p>

              <motion.div
                className="mt-12 w-16 h-px bg-gradient-to-r from-grey-300 to-transparent"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [...EASE_ENTRANCE] }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </section>

          {/* Products */}
          <section className="py-28 md:py-40 bg-grey-100">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-16">
                  <SectionLabel>Produkter</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">Dette jobber vi med.</h2>
                  <p className="text-grey-500 max-w-xl mx-auto">
                    Ta kontakt hvis du vil vite mer eller være tidlig ute.
                  </p>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {PRODUCTS.map((product, index) => (
                  <RevealOnScroll key={product.id} delay={index * 0.1}>
                    <div className="bg-white rounded-2xl p-8 border border-grey-200 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-grey-100 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-black" />
                        </div>
                        <span className="px-3 py-1 rounded-full bg-grey-100 text-xs font-medium text-grey-600">
                          {product.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">{product.title}</h3>
                      <p className="text-grey-500 text-sm leading-relaxed flex-1">
                        {product.description}
                      </p>
                      <div className="mt-6 pt-6 border-t border-grey-200">
                        <Link
                          href="#apply"
                          className="text-sm font-medium text-black hover:text-grey-600 transition-colors"
                        >
                          Kontakt oss for mer info &rarr;
                        </Link>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section id="apply" className="py-28 md:py-40 bg-white">
            <div className="w-container">
              <RevealOnScroll>
                <div className="text-center mb-12">
                  <SectionLabel>Ta kontakt</SectionLabel>
                  <h2 className="w-heading-lg mt-4 mb-4">Interessert?</h2>
                  <p className="text-grey-500 max-w-lg mx-auto">
                    Fyll ut skjemaet, så tar vi kontakt for en uforpliktende samtale.
                  </p>
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={0.2}>
                <ApplicationForm />
              </RevealOnScroll>
            </div>
          </section>

          {/* Related Pages */}
          <RelatedPages exclude="utvikling" />
        </PageTransition>
      </main>

      <BackToTop />
      <WebsiteFooter />
    </>
  );
}
