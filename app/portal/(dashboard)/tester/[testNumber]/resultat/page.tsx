import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, FlaskConical, XCircle } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import {
  getAchievedCategory,
  type TestComparison,
} from "@/lib/portal/tests/category-requirements";

export const metadata: Metadata = {
  title: "Test-resultat | PlayerHQ",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ testNumber: string }>;
}

export default async function TestResultatPage({ params }: PageProps) {
  const user = await requirePortalUser();
  const { testNumber } = await params;
  const num = parseInt(testNumber, 10);
  if (Number.isNaN(num)) notFound();

  const [test, latestResult, history] = await Promise.all([
    prisma.testDefinition.findUnique({ where: { testNumber: num } }),
    prisma.testResult.findFirst({
      where: { userId: user.id, testNumber: num },
      orderBy: { createdAt: "desc" },
    }),
    prisma.testResult.findMany({
      where: { userId: user.id, testNumber: num },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        value: true,
        passed: true,
        createdAt: true,
      },
    }),
  ]);

  if (!test) notFound();

  // A-K-kategori oppnådd på denne testen
  const achievedCat = getAchievedCategory(
    num,
    latestResult?.value ?? 0,
    (test.comparison ?? "higher_is_better") as TestComparison
  );

  const isTeamNorway = num >= 21;
  const isPEITest = num >= 29 && num <= 31;

  if (!latestResult) {
    return (
      <div className="min-h-screen p-10" style={{ background: "#F4F6F4" }}>
        <div className="max-w-[640px] mx-auto p-6 rounded-xl bg-white border">
          <h1 className="text-xl font-bold">Ingen resultat lagret</h1>
          <Link
            href={`/portal/tester/${num}`}
            className="mt-3 inline-block text-sm font-semibold"
            style={{ color: "var(--color-primary, #005840)" }}
          >
            Utfor testen →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 lg:p-10"
      style={{ background: "var(--color-surface, #F4F6F4)" }}
    >
      <div className="max-w-[640px] mx-auto space-y-6">
        <Link
          href="/portal/tester"
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: "var(--color-primary, #005840)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til tester
        </Link>

        <header
          className="rounded-2xl p-8 bg-white border text-center"
          style={{ borderColor: "var(--color-line, #E4EAE6)" }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--color-primary, #005840)",
            }}
          >
            / Test #{test.testNumber} · Resultat
            {isTeamNorway && (
              <span
                className="ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{
                  background: "#D1F843",
                  color: "#0A1F18",
                  fontSize: "9px",
                  letterSpacing: "0.05em",
                }}
              >
                <FlaskConical className="h-3 w-3" />
                Team Norway
              </span>
            )}
          </div>
          <h1
            className="mt-3 text-[20px] font-semibold"
            style={{ color: "var(--color-ink-muted, #5C6B62)" }}
          >
            {test.name}
          </h1>

          {achievedCat && (
            <p className="mt-2 text-sm" style={{ color: "var(--color-ink-subtle, #8A958E)" }}>
              Du presterer som en{" "}
              <strong style={{ color: "var(--color-primary, #005840)" }}>
                {achievedCat}-spiller
              </strong>{" "}
              på denne testen
            </p>
          )}

          {isPEITest && (
            <div
              className="mt-3 rounded-lg px-3 py-2 text-xs"
              style={{
                background: "var(--color-surface-soft, #EDF1EE)",
                color: "var(--color-ink-muted, #5C6B62)",
              }}
            >
              <strong>PEI-forklaring:</strong> Proximity Error Index = restavstand ÷
              target-avstand. Lavere er bedre. PEI 0.15 betyr at ballen i snitt
              havnet 15% av target-avstanden fra hullet.
            </div>
          )}
          <div
            className="mt-6 text-[64px] font-bold leading-none"
            style={{
              color: latestResult.passed ? "#2A7D5A" : "#0A1F18",
              fontFamily: "'JetBrains Mono', monospace",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {latestResult.value.toFixed(1)}
            <span
              className="text-[24px] font-medium"
              style={{ color: "var(--color-ink-muted, #5C6B62)" }}
            >
              {" "}
              {test.unit}
            </span>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: latestResult.passed ? "#E0EFE7" : "#F4DAD5",
              color: latestResult.passed ? "#2A7D5A" : "#B84233",
            }}
          >
            {latestResult.passed ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Bestatt
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Ikke bestått
              </>
            )}
          </div>

          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={`/portal/tester/${num}`}
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold border"
              style={{
                borderColor: "var(--color-line, #E4EAE6)",
                color: "var(--color-ink, #0A1F18)",
              }}
            >
              Test igjen
            </Link>
            <Link
              href="/portal/tester"
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: "var(--color-primary, #005840)" }}
            >
              Til oversikt
            </Link>
          </div>
        </header>

        {history.length > 1 ? (
          <section
            className="rounded-2xl p-6 bg-white border"
            style={{ borderColor: "var(--color-line, #E4EAE6)" }}
          >
            <h2
              className="text-sm font-bold mb-4"
              style={{ color: "var(--color-ink, #0A1F18)" }}
            >
              Historikk · siste 10
            </h2>
            <div className="space-y-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                  style={{ borderColor: "var(--color-line-soft, #EDF1EE)" }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "12px",
                      color: "var(--color-ink-muted, #5C6B62)",
                    }}
                  >
                    {new Date(h.createdAt).toLocaleDateString("nb-NO")}
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className="font-mono font-semibold tabular-nums"
                      style={{ color: "var(--color-ink, #0A1F18)" }}
                    >
                      {h.value.toFixed(1)} {test.unit}
                    </span>
                    {h.passed ? (
                      <CheckCircle className="w-4 h-4" style={{ color: "#2A7D5A" }} />
                    ) : (
                      <XCircle className="w-4 h-4" style={{ color: "#B84233" }} />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
