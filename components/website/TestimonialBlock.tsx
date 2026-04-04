"use client";

import Image from "next/image";
import { RevealOnScroll } from "./RevealOnScroll";
import { TESTIMONIAL } from "@/lib/website-constants";

export function TestimonialBlock() {
  return (
    <section className="py-28 md:py-40 bg-[#F5F5F7]">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-[#D2D2D7] mb-6">
                <path d="M0 32V19.2C0 6.4 8 0 18 0v8c-6 0-9.6 3.2-10 8h10v16H0zm22 0V19.2C22 6.4 30 0 40 0v8c-6 0-9.6 3.2-10 8h10v16H22z" fill="currentColor" />
              </svg>
              <blockquote className="font-display text-2xl md:text-3xl font-medium text-[#1D1D1F] leading-snug mb-6">
                {TESTIMONIAL.quote}
              </blockquote>
              <div>
                <p className="font-semibold text-[#1D1D1F]">{TESTIMONIAL.author}</p>
                <p className="text-sm text-[#6E6E73]">{TESTIMONIAL.detail}</p>
              </div>
            </div>
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[20px] overflow-hidden shrink-0 mx-auto md:mx-0">
              <Image
                src={TESTIMONIAL.image}
                alt={TESTIMONIAL.author}
                fill
                className="object-cover"
                sizes="224px"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
