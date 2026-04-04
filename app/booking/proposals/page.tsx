"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const proposals = [
  {
    id: "a",
    title: "Minimal Nordic",
    description:
      "Ultra-rent med maksimal whitespace. Typografisk hierarki uten kort eller rammer. Inspirert av Aesop og Apple Store.",
    tags: ["Flat liste", "Typografi-drevet", "Ekstrem enkelhet"],
  },
  {
    id: "b",
    title: "Premium Bento",
    description:
      "Bento-grid med varierte kortstorrelser. Foundation Test som oversized feature-kort med atmosfarisk glow. Inspirert av Fitonist.",
    tags: ["Bento-grid", "Kort med dybde", "Visuell hierarki"],
  },
  {
    id: "c",
    title: "Single-scroll App",
    description:
      "Foeles som en native app. Horisontale swipeable kort, inline tidsvelger og sticky CTA-bar. Inspirert av iOS App Store og Uber.",
    tags: ["App-folelse", "Horisontal scroll", "Sticky CTA"],
  },
];

export default function ProposalsIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
          AK Golf — Booking Redesign
        </p>
        <h1 className="mt-3 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[var(--color-black)]">
          Tre forslag
        </h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-[var(--color-grey-500)]">
          Visuelt konsept for ny bookingside. Velg retning, kombiner elementer,
          eller juster videre.
        </p>
      </motion.div>

      <div className="mt-16 space-y-6">
        {proposals.map((proposal, i) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
          >
            <Link
              href={`/booking/proposals/${proposal.id}`}
              className="group block rounded-2xl border border-[var(--color-grey-200)] p-8 transition-all duration-300 hover:border-[var(--color-grey-300)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-grey-100)] text-sm font-semibold text-[var(--color-black)]">
                      {proposal.id.toUpperCase()}
                    </span>
                    <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-black)]">
                      {proposal.title}
                    </h2>
                  </div>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--color-grey-500)]">
                    {proposal.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {proposal.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[var(--color-grey-100)] px-3 py-1 text-[11px] font-medium text-[var(--color-grey-500)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="mt-1 h-5 w-5 text-[var(--color-grey-300)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-brand)]" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
