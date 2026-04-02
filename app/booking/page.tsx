import { prisma } from "@/lib/portal/prisma";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import Link from "next/link";
import {
  User,
  Users,
  GraduationCap,
  Monitor,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book coaching | AK Golf",
  description:
    "Velg type coaching og book tid med en av våre erfarne golfcoacher.",
};

const CATEGORY_CONFIG: Record<
  string,
  { icon: typeof User; label: string }
> = {
  INDIVIDUAL: { icon: User, label: "Individuell" },
  GROUP: { icon: Users, label: "Gruppe" },
  VTG_COURSE: { icon: GraduationCap, label: "Kurs" },
  SIMULATOR: { icon: Monitor, label: "Simulator" },
  PLAYING_LESSON: { icon: MapPin, label: "Banecoaching" },
};

export default async function BookingPage() {
  const [services, instructors] = await Promise.all([
    prisma.serviceType.findMany({
      where: { isActive: true, isPublic: true },
      orderBy: { sortOrder: "asc" },
      include: {
        Instructor: {
          where: { User: { isNot: undefined } },
          select: {
            id: true,
            User: { select: { name: true } },
          },
        },
      },
    }),
    prisma.instructor.findMany({
      where: {
        User: { isNot: undefined },
      },
      include: {
        User: { select: { name: true, image: true } },
      },
    }),
  ]);

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

            <h1 className="w-heading-xl max-w-3xl mb-6">
              Book coaching.
            </h1>

            <p className="text-lg text-grey-500 max-w-2xl leading-relaxed">
              Velg type coaching og book tid med en av våre trenere.
            </p>

            <div className="mt-12 w-16 h-px bg-gradient-to-r from-black/50 to-transparent" />
          </div>
        </section>

        {/* Services */}
        <section className="py-16 md:py-24 bg-grey-100">
          <div className="w-container">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-2">
              Våre tjenester
            </h2>
            <p className="text-grey-500 mb-10">
              Velg tjenesten som passer dine behov
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              {services.map((service) => {
                const config =
                  CATEGORY_CONFIG[service.category] ?? CATEGORY_CONFIG.INDIVIDUAL;
                const Icon = config.icon;
                const instructorCount = service.Instructor.length;

                return (
                  <Link
                    key={service.id}
                    href={`/booking/new?serviceTypeId=${service.id}`}
                    className="group relative flex flex-col justify-between bg-white rounded-[20px] p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border border-[#E8E8ED]"
                  >
                    {/* Top section */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-[#F5F5F7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1D1D1F] transition-colors">
                          <Icon
                            size={22}
                            className="text-[#1D1D1F]/60 group-hover:text-white transition-colors"
                          />
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wider text-[#1D1D1F]/40">
                          {config.label}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-[#1D1D1F] mb-1.5">
                        {service.name}
                      </h3>

                      {service.description && (
                        <p className="text-sm text-[#1D1D1F]/60 line-clamp-2 mb-4">
                          {service.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom section */}
                    <div>
                      <div className="flex items-center gap-4 text-xs text-[#1D1D1F]/50 mb-5">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {service.duration} min
                        </span>
                        {instructorCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Users size={14} />
                            {instructorCount}{" "}
                            {instructorCount === 1 ? "trener" : "trenere"}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#1D1D1F]">
                          {service.price.toLocaleString("nb-NO")} kr
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[980px] bg-[#1D1D1F] text-white text-sm font-medium group-hover:bg-[#1D1D1F]/80 transition-colors">
                          Velg
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover:translate-x-0.5"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {services.length === 0 && (
              <div className="text-center py-16 bg-white rounded-[20px] border border-[#E8E8ED]">
                <p className="text-[#1D1D1F]/60 text-lg">
                  Ingen tjenester tilgjengelig akkurat nå.
                </p>
                <p className="text-[#1D1D1F]/40 text-sm mt-2">
                  Ta kontakt med oss for å booke manuelt.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Instructors */}
        {instructors.length > 0 && (
          <section className="px-6 pb-16 md:pb-24">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-2">
                Våre trenere
              </h2>
              <p className="text-[#1D1D1F]/60 mb-10">
                Erfarne golfcoacher klare til å hjelpe deg
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className="bg-white rounded-[20px] p-6 border border-[#E8E8ED]"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[#F5F5F7]">
                        {instructor.User.image ? (
                          <img
                            src={instructor.User.image}
                            alt={instructor.User.name || "Trener"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-[#1D1D1F]/40">
                            {(instructor.User.name?.[0] || "T").toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="min-w-0">
                        <h3 className="font-semibold text-[#1D1D1F]">
                          {instructor.User.name || "Trener"}
                        </h3>
                        {instructor.title && (
                          <p className="text-sm text-[#1D1D1F]/60">
                            {instructor.title}
                          </p>
                        )}
                      </div>
                    </div>

                    {instructor.bio && (
                      <p className="text-sm text-[#1D1D1F]/60 mt-4 line-clamp-3">
                        {instructor.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <WebsiteFooter />
    </>
  );
}
