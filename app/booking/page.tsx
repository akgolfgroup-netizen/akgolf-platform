import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import { CATEGORIES } from "@/lib/booking-config";
import { CategoryCard } from "./components/CategoryCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book coaching | AK Golf",
  description: "Velg type coaching og book tid med en av våre erfarne golfcoacher.",
};

export default function BookingPage() {
  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="w-container relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-black" />
              <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-grey-400 font-medium">
                Booking
              </span>
            </div>

            <h1 className="w-heading-xl max-w-3xl mb-6">Book coaching.</h1>

            <p className="text-lg text-grey-500 max-w-2xl leading-relaxed">
              Velg type coaching og book tid med en av våre trenere.
            </p>

            <div className="mt-12 w-16 h-px bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 md:py-24 bg-grey-100">
          <div className="w-container">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Hva passer for deg?
            </h2>
            <p className="text-grey-500 mb-10">Velg en kategori for å se tilgjengelige tjenester</p>

            <div className="grid gap-5 sm:grid-cols-2">
              {CATEGORIES.map((category, index) => (
                <CategoryCard key={category.slug} category={category} index={index} />
              ))}
            </div>

            {/* Help button */}
            <div className="mt-10 text-center">
              <Link
                href="/booking/veileder"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-grey-300 text-grey-600 hover:border-black hover:text-black transition-colors"
              >
                <HelpCircle size={18} />
                <span>Usikker? Hjelp meg velge</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
