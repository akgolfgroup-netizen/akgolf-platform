import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { TEAM } from "@/lib/website-constants";

export function TeamSection() {
  return (
    <section id="team" className="w-section-lg bg-surface-warm">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <SectionLabel>Dine trenere</SectionLabel>
            <h2 className="w-heading-lg mt-4">
              Møt teamet.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {TEAM.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="w-full max-w-sm mb-6">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ink-10">
                    {i === 0 ? (
                      <Image
                        src="/images/branding/ak-golf-academy-anders.jpg"
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-ink-05">
                        <span className="font-display text-6xl font-semibold text-ink-30">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="w-heading-md mb-1">{member.name}</h3>
                <p className="text-xs font-mono text-gold-text uppercase tracking-wider mb-1">
                  {member.role}
                </p>
                <p className="text-sm text-ink-40 mb-4">{member.division}</p>

                <p className="text-ink-50 leading-relaxed max-w-md mb-6">
                  {member.bio}
                </p>

                <div className="flex items-center gap-4 text-sm">
                  <Link
                    href={`mailto:${member.contact.email}`}
                    className="text-ink-50 hover:text-ink-80 transition-colors"
                  >
                    {member.contact.email}
                  </Link>
                  <span className="text-ink-20">|</span>
                  <Link
                    href={`tel:${member.contact.phone.replace(/\s/g, "")}`}
                    className="text-ink-50 hover:text-ink-80 transition-colors"
                  >
                    {member.contact.phone}
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
