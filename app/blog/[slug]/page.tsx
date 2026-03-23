import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { WebsiteNav } from "@/components/website/WebsiteNav";
import { WebsiteFooter } from "@/components/website/WebsiteFooter";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getArticle(slug: string) {
  try {
    return await prisma.contentItem.findFirst({
      where: {
        slug,
        type: "ARTICLE",
        status: "PUBLISHED",
      },
    });
  } catch {
    return null;
  }
}

async function getRelatedArticles(currentId: string) {
  try {
    return await prisma.contentItem.findMany({
      where: {
        type: "ARTICLE",
        status: "PUBLISHED",
        slug: { not: null },
        id: { not: currentId },
      },
      select: {
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return { title: "Artikkel ikke funnet" };
  }

  return {
    title: article.title,
    description: article.excerpt ?? article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? article.title,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      ...(article.imageUrl && { images: [{ url: article.imageUrl }] }),
    },
  };
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) notFound();

  const related = await getRelatedArticles(article.id);

  return (
    <>
      <WebsiteNav />
      <main id="main-content" className="min-h-screen bg-snow pt-[52px]">
        {/* Hero */}
        <section className="bg-midnight-navy py-16 md:py-24">
          <div className="w-container max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-ink-30 hover:text-white transition-colors mb-6"
            >
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Tilbake til blog
            </Link>
            {article.publishedAt && (
              <time
                dateTime={article.publishedAt.toISOString()}
                className="block text-xs font-medium text-soft-gold uppercase tracking-wider mb-3"
              >
                {formatDate(article.publishedAt)}
              </time>
            )}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-lg text-ink-50 leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Artikkelinnhold */}
        <article className="w-container max-w-3xl py-12 md:py-20">
          {article.bodyHtml ? (
            <div
              className="prose-ak"
              dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
            />
          ) : (
            <div className="prose-ak whitespace-pre-wrap">
              {article.body}
            </div>
          )}

          {/* Forfatter-signatur */}
          <div className="mt-16 border-t border-light-gray pt-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-midnight-navy text-white font-display font-bold text-sm">
                AK
              </div>
              <div>
                <p className="font-display font-semibold text-ink-90">
                  AK Golf Academy
                </p>
                <p className="text-sm text-ink-50">
                  Premium golfutvikling for ambisiose spillere
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Relaterte artikler */}
        {related.length > 0 && (
          <section className="bg-white border-t border-light-gray">
            <div className="w-container max-w-3xl py-16">
              <h2 className="font-display text-xl font-semibold text-ink-90 mb-8">
                Flere artikler
              </h2>
              <div className="space-y-6">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group block rounded-xl border border-light-gray p-5 transition-all duration-300 hover:border-soft-gold/30 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display font-semibold text-ink-80 group-hover:text-midnight-navy transition-colors">
                          {r.title}
                        </h3>
                        {r.excerpt && (
                          <p className="mt-1 text-sm text-ink-50 line-clamp-2">
                            {r.excerpt}
                          </p>
                        )}
                      </div>
                      {r.publishedAt && (
                        <time className="shrink-0 text-xs text-ink-50">
                          {formatDate(r.publishedAt)}
                        </time>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.excerpt ?? article.title,
              datePublished: article.publishedAt?.toISOString(),
              ...(article.imageUrl && { image: article.imageUrl }),
              author: {
                "@type": "Organization",
                name: "AK Golf Academy",
                url: "https://akgolf.no",
              },
              publisher: {
                "@type": "Organization",
                name: "AK Golf Group",
                url: "https://akgolf.no",
              },
            }),
          }}
        />
      </main>
      <WebsiteFooter />
    </>
  );
}
