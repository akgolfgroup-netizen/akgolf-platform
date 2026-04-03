// app/booking/[category]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/portal/prisma";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";
import { ServiceCard } from "../../components/ServiceCard";
import { getCategoryBySlug, isRecommended, type BookingCategory } from "@/lib/booking-config";
import { ServiceCategory } from "@prisma/client";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Ikke funnet | AK Golf" };
  }

  return {
    title: `${category.name} | Book coaching | AK Golf`,
    description: `Book ${category.name.toLowerCase()} coaching hos AK Golf.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Fetch services for this category
  const services = await prisma.serviceType.findMany({
    where: {
      isActive: true,
      isPublic: true,
      category: { in: category.serviceCategories as ServiceCategory[] },
    },
    orderBy: { sortOrder: "asc" },
  });

  // Sort: recommended first
  const sortedServices = [...services].sort((a, b) => {
    const aRec = isRecommended(a.name, slug as BookingCategory);
    const bRec = isRecommended(b.name, slug as BookingCategory);
    if (aRec && !bRec) return -1;
    if (!aRec && bRec) return 1;
    return 0;
  });

  const recommendedService = sortedServices.find((s) =>
    isRecommended(s.name, slug as BookingCategory)
  );
  const otherServices = sortedServices.filter((s) =>
    !isRecommended(s.name, slug as BookingCategory)
  );

  return (
    <>
      <WebsiteNav />

      <main className="min-h-screen bg-white" id="main-content">
        {/* Header */}
        <section className="pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="w-container">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 text-sm text-grey-500 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Tilbake til kategorier
            </Link>

            <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
              {category.name}
            </h1>
            <p className="text-lg text-grey-500">{category.description}</p>
          </div>
        </section>

        {/* Services */}
        <section className="pb-16 md:pb-24">
          <div className="w-container">
            {/* Recommended */}
            {recommendedService && (
              <div className="mb-8">
                <ServiceCard
                  service={recommendedService}
                  isRecommended={true}
                  index={0}
                />
              </div>
            )}

            {/* Other services */}
            {otherServices.length > 0 && (
              <>
                <h3 className="text-sm font-medium text-grey-500 uppercase tracking-wider mb-4">
                  Andre alternativer
                </h3>
                <div className="space-y-3">
                  {otherServices.map((service, index) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isRecommended={false}
                      index={index + 1}
                    />
                  ))}
                </div>
              </>
            )}

            {services.length === 0 && (
              <div className="text-center py-16 bg-grey-100 rounded-[20px]">
                <p className="text-grey-500">
                  Ingen tjenester tilgjengelig i denne kategorien.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <WebsiteFooter />
    </>
  );
}
