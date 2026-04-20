"use client";

import { RevealOnScroll } from "../RevealOnScroll";
import { TESTIMONIALS } from "@/lib/website-constants";

export function TestimonialSection() {
  const testimonial = TESTIMONIALS[0];
  if (!testimonial) return null;

  return (
    <section className="w-section">
      <div className="w-container">
        <RevealOnScroll>
          <div className="max-w-3xl mx-auto text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-on-surface leading-relaxed tracking-tight mb-8">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <p className="text-sm text-muted">
              {testimonial.name}, {testimonial.role}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
