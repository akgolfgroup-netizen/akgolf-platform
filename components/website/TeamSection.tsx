import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "./RevealOnScroll";
import { SectionLabel } from "./SectionLabel";
import { TEAM } from "@/lib/website-constants";

const TEAM_IMAGES: Record<string, string> = {
  "Anders Kristiansen": "/images/team/anders-kristiansen.jpg",
};

export function TeamSection() {
  return (
    <section id="team" className="py-28 md:py-40 bg-white">
      <div className="w-container">
        <RevealOnScroll>
          <div className="text-center mb-20">
            <SectionLabel>Dine trenere</SectionLabel>
            <h2 className="w-heading-lg mt-5">Møt teamet.</h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 max-w-4xl mx-auto">
          {TEAM.map((member, i) => {
            const imageSrc = TEAM_IMAGES[member.name];

            return (
              <RevealOnScroll key={member.name} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-full max-w-xs mb-8">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ink-05">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-display text-6xl font-semibold text-ink-20">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-ink-90 mb-1">{member.name}</h3>
                  <p className="text-xs font-mono text-gold-text uppercase tracking-wider mb-3">
                    {member.role}
                  </p>

                  <p className="text-ink-50 leading-relaxed max-w-sm mb-6">
                    {member.bio}
                  </p>

                  <Link
                    href={`mailto:${member.contact.email}`}
                    className="text-sm text-ink-40 hover:text-ink-70 transition-colors"
                  >
                    {member.contact.email}
                  </Link>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
