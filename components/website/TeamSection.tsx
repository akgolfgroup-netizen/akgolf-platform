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
              Coaching på GFGK.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {TEAM.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 0.15}>
              <div className="flex flex-col items-center text-center">
                <div className="w-full max-w-sm mb-6">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ink-10">
                    <Image
                      src={i === 0 ? "/images/branding/ak-golf-academy-01.jpg" : "/images/branding/ak-golf-academy-04.jpg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
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

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="inline-flex items-center px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-xs font-medium text-gold-text"
                    >
                      {cert}
                    </span>
                  ))}
                </div>

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
