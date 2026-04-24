import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

/**
 * GET /api/portal/admin/test-register?studentId=<id>
 * Returnerer alle TestDefinition + siste TestResult per test for en elev.
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user || !isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke autorisert" }, { status: 403 });
  }

  const studentId = req.nextUrl.searchParams.get("studentId");
  if (!studentId) {
    return NextResponse.json({ error: "studentId er påkrevd" }, { status: 400 });
  }

  const [tests, results] = await Promise.all([
    prisma.testDefinition.findMany({ orderBy: { testNumber: "asc" } }),
    prisma.testResult.findMany({
      where: { userId: studentId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Latest result per test + history
  const latestByTest = new Map<number, (typeof results)[number]>();
  const historyByTest = new Map<number, typeof results>();

  for (const r of results) {
    if (!latestByTest.has(r.testNumber)) latestByTest.set(r.testNumber, r);
    if (!historyByTest.has(r.testNumber)) historyByTest.set(r.testNumber, []);
    historyByTest.get(r.testNumber)!.push(r);
  }

  const now = new Date();
  const RETEST_INTERVAL_DAYS = 56; // 8 weeks

  const rows = tests.map((t) => {
    const latest = latestByTest.get(t.testNumber) ?? null;
    const history = historyByTest.get(t.testNumber) ?? [];
    const daysSince = latest
      ? Math.floor((now.getTime() - latest.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      : null;
    const retestDue = daysSince === null ? false : daysSince >= RETEST_INTERVAL_DAYS;
    return {
      testNumber: t.testNumber,
      name: t.name,
      category: t.category,
      unit: t.unit,
      formula: t.formula,
      comparison: t.comparison,
      latest: latest
        ? {
            value: latest.value,
            passed: latest.passed,
            categoryReq: latest.categoryReq,
            createdAt: latest.createdAt.toISOString(),
          }
        : null,
      daysSince,
      retestDue,
      historyCount: history.length,
    };
  });

  return NextResponse.json({ tests: rows });
}
