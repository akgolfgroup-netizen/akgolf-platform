import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowLeftToLine } from "lucide-react";
import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getInputRange } from "@/lib/portal/tests/validation";
import { getInputLabel } from "@/lib/portal/tests/calculate";
import { submitTestResult } from "./actions";

export const metadata: Metadata = {
  title: "Utfor test | PlayerHQ",
};

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ testNumber: string }>;
  searchParams: Promise<{ fromPlan?: string }>;
}

export default async function UtforTestPage({ params, searchParams }: PageProps) {
  await requirePortalUser();
  const { testNumber } = await params;
  const { fromPlan } = await searchParams;
  const num = parseInt(testNumber, 10);
  if (Number.isNaN(num)) notFound();

  const test = await prisma.testDefinition.findUnique({
    where: { testNumber: num },
  });
  if (!test) notFound();

  const range = getInputRange(num);
  const inputCount = test.inputCount;

  return (
    <div
      className="min-h-screen p-6 lg:p-10"
      style={{ background: "var(--color-surface, #F4F6F4)" }}
    >
      <div className="max-w-[640px] mx-auto space-y-6">
        {fromPlan ? (
          <Link
            href="/portal/treningsplan"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-primary, #005840)" }}
          >
            <ArrowLeftToLine className="w-4 h-4" />
            Tilbake til treningsplan
          </Link>
        ) : (
          <Link
            href="/portal/tester"
            className="inline-flex items-center gap-2 text-sm font-semibold"
            style={{ color: "var(--color-primary, #005840)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til tester
          </Link>
        )}

        <header
          className="rounded-2xl p-6 bg-white border"
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
            / Test #{test.testNumber} · {test.category}
          </div>
          <h1
            className="mt-2 text-[28px] font-bold tracking-tight"
            style={{ color: "var(--color-ink, #0A1F18)" }}
          >
            {test.name}
          </h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-ink-muted, #5C6B62)" }}
          >
            Enhet: <strong>{test.unit}</strong> · {inputCount}{" "}
            input{inputCount === 1 ? "" : "s"}
          </p>
          {range.hint ? (
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-ink-subtle, #8A958E)" }}
            >
              {range.hint}
            </p>
          ) : null}
        </header>

        <form
          action={async (formData: FormData) => {
            "use server";
            const rawInputs: number[] = [];
            for (let i = 0; i < inputCount; i++) {
              const val = formData.get(`input-${i}`);
              const num = typeof val === "string" ? parseFloat(val) : NaN;
              if (Number.isNaN(num)) return;
              rawInputs.push(num);
            }
            const redirectTo = fromPlan ? "/portal/treningsplan" : undefined;
            await submitTestResult(test.testNumber, rawInputs, redirectTo);
          }}
          className="rounded-2xl p-6 bg-white border space-y-4"
          style={{ borderColor: "var(--color-line, #E4EAE6)" }}
        >
          {Array.from({ length: inputCount }).map((_, i) => (
            <div key={i}>
              <label
                htmlFor={`input-${i}`}
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "var(--color-ink, #0A1F18)" }}
              >
                {getInputLabel(test.testNumber, i)} ({test.unit})
              </label>
              <input
                id={`input-${i}`}
                name={`input-${i}`}
                type="number"
                step={range.step ?? 0.1}
                min={range.min}
                max={range.max}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  borderColor: "var(--color-line, #E4EAE6)",
                  background: "white",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white"
            style={{ background: "var(--color-primary, #005840)" }}
          >
            Lagre resultat
          </button>
        </form>
      </div>
    </div>
  );
}
