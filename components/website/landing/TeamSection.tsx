"use client";

import Image from "next/image";
import { SectionLabel } from "../SectionLabel";
import { RevealOnScroll } from "../RevealOnScroll";
import { TEAM } from "@/lib/website-constants";

export function TeamSection() {
  return (
    <section className="w-section bg-surface">
      <div className="w-container">
        <RevealOnScroll>
          <SectionLabel>Trenerne</SectionLabel>
        </RevealOnScroll>
        <RevealOnScroll>
          <h2 className="w-heading-lg mt-4 mb-4">
            Menneskene bak metodikken
          </h2>
          <p className="text-grey-500 leading-relaxed max-w-2xl mb-12">
            Tett oppfolging krever trenere som kjenner deg. Derfor er teamet
            bevisst lite.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEAM.map((member, i) => (
            <RevealOnScroll key={member.name} delay={i * 0.1}>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-px transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  {member.image ? (
                    <>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary">
                      <span className="text-5xl font-bold text-white">
                        {member.name.split(" ").map(n => n[0]).join("").slice(0, 3)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 md:p-10">
                  <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-muted mb-2">
                    {member.division}
                  </p>
                  <h3 className="text-xl font-bold text-black tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted mb-4">
                    {member.role}
                  </p>
                  <p className="text-sm text-text leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
