"use client";



import { Icon } from "@/components/ui/icon";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { ABO_VS_FLEX } from "@/lib/website-constants";

export function ComparisonSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>{ABO_VS_FLEX.eyebrow}</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            {ABO_VS_FLEX.heading}
          </h2>
          <p className="text-on-surface-variant/80 leading-relaxed max-w-2xl mb-12">
            {ABO_VS_FLEX.description}
          </p>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="bg-surface-container-lowest rounded-2xl shadow-card overflow-hidden max-w-2xl">
            {/* Header */}
            <div className="grid grid-cols-3 gap-0 border-b border-outline-variant/20">
              <div className="p-5" />
              <div className="p-5 text-center">
                <p className="text-sm font-bold text-on-surface">Abonnement</p>
              </div>
              <div className="p-5 text-center">
                <p className="text-sm font-bold text-on-surface-variant">Flex</p>
              </div>
            </div>

            {/* Rows */}
            {ABO_VS_FLEX.rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-3 gap-0 ${
                  i < ABO_VS_FLEX.rows.length - 1
                    ? "border-b border-outline-variant/20"
                    : ""
                }`}
              >
                <div className="p-4 px-5">
                  <p className="text-sm text-text">{row.feature}</p>
                </div>
                <div className="p-4 flex justify-center">
                  {row.abo ? (
                    <Icon name="check" className="w-4 h-4 text-primary" />
                  ) : (
                    <Icon name="close" className="w-4 h-4 text-on-surface-variant/60" />
                  )}
                </div>
                <div className="p-4 flex justify-center">
                  {row.flex ? (
                    <Icon name="check" className="w-4 h-4 text-primary" />
                  ) : (
                    <Icon name="close" className="w-4 h-4 text-on-surface-variant/60" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
