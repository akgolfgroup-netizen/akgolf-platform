import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/portal/prisma";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artikler om golftrening, teknikk, mental trening og spillerutvikling fra AK Golf Academy.",
  openGraph: {
    title: "Blog — AK Golf Group",
    description:
      "Artikler om golftrening, teknikk, mental trening og spillerutvikling.",
  },
};

async function getPublishedArticles() {
  try {
    return await prisma.contentItem.findMany({
      where: {
        type: "ARTICLE",
        status: "PUBLISHED",
        slug: { not: null },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        imageUrl: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <WebsiteNav />
      <main id="main-content" className="min-h-screen bg-snow pt-[52px]">
        {/* Hero */}
        <section className="bg-midnight-navy py-20 md:py-28">
          <div className="w-container">
            <p className="w-meta text-soft-gold mb-3">Innsikt</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-white tracking-tight">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-ink-30">
              Artikler om golftrening, teknikk, mental styrke og spillerutvikling
              fra teamet hos AK Golf Academy.
            </p>
          </div>
        </section>

        {/* Artikler */}
        <section className="w-container py-16 md:py-24">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-ink-40 text-lg">
                Ingen artikler publisert enna. Kom tilbake snart!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group block rounded-2xl bg-white border border-light-gray overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-soft-gold/30 hover:-translate-y-0.5"
                >
                  {/* Bilde-placeholder */}
                  {article.imageUrl ? (
                    <div className="aspect-[16/9] bg-ink-10 overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gradient-to-br from-midnight-navy to-navy-light flex items-center justify-center">
                      <span className="font-display text-4xl font-bold text-white/10">
                        AK
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {article.publishedAt && (
                      <time
                        dateTime={article.publishedAt.toISOString()}
                        className="text-xs font-medium text-soft-gold uppercase tracking-wider"
                      >
                        {formatDate(article.publishedAt)}
                      </time>
                    )}
                    <h2 className="mt-2 font-display text-lg font-semibold text-ink-90 leading-snug group-hover:text-midnight-navy transition-colors">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-ink-50 leading-relaxed line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-soft-gold group-hover:text-gold-dark transition-colors">
                      Les artikkel
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <WebsiteFooter />
    </>
  );
}
