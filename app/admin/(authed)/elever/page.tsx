import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { StudentsListPanel } from "@/components/admin/coachhq-dark/arbeidsflate/students-list-panel";
import { KpiRow } from "@/components/admin/coachhq-dark/arbeidsflate/kpi-row";
import {
  getArbeidsflateKpis,
  getArbeidsflateStudentList,
  getArbeidsflateActiveSession,
} from "./arbeidsflate-actions";
import { getStudent360 } from "./[id]/v2/get-student-360";
import { Hero360 } from "@/components/portal/admin/student-360/Hero360";
import { KontaktinfoCard } from "@/components/portal/admin/student-360/KontaktinfoCard";
import { GolfCard } from "@/components/portal/admin/student-360/GolfCard";
import { CoachingCard } from "@/components/portal/admin/student-360/CoachingCard";
import { TrainingCard } from "@/components/portal/admin/student-360/TrainingCard";
import { MentalForecastCard } from "@/components/portal/admin/student-360/MentalForecastCard";
import { TestsCard } from "@/components/portal/admin/student-360/TestsCard";
import { EconomyCard } from "@/components/portal/admin/student-360/EconomyCard";
import { SignalsCard } from "@/components/portal/admin/student-360/SignalsCard";

export const metadata = {
  title: "Spillere | AK Golf CoachHQ",
};

export const dynamic = "force-dynamic";

interface StudentsPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function StudentsPage({ searchParams }: StudentsPageProps) {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const { id: selectedId } = await searchParams;

  // Tom-state fallbacks
  const safe = <T,>(p: Promise<T>, label: string, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error(`[arbeidsflate] ${label} failed:`, err);
      return fallback;
    });

  const [kpis, studentList, activeSession, selectedStudent] = await Promise.all([
    safe(getArbeidsflateKpis(), "kpis", {
      activeStudents: 0,
      activeStudentsTrend: 0,
      capacity: 60,
      weeklySessions: 0,
      weeklySessionsTrendPct: 0,
      weeklyHoursLabel: "",
      monthlyRevenueKr: 0,
      monthlyRevenueTrendPct: 0,
      monthlyRevenueGoalKr: 250000,
      npsScore: 0,
      npsTrend: 0,
      npsResponses: 0,
    }),
    safe(getArbeidsflateStudentList(), "studentList", {
      todayStudents: [],
      thisWeekStudents: [],
      followupStudents: [],
      totalActive: 0,
    }),
    safe(getArbeidsflateActiveSession(), "activeSession", null),
    selectedId ? safe(getStudent360(selectedId), "student360", null) : null,
  ]);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#102B1E", color: "#E6EAE8" }}
    >
      {/* Venstre panel — alltid synlig spillerliste */}
      <StudentsListPanel
        data={studentList}
        activeSession={activeSession}
        selectedStudentId={selectedId ?? null}
      />

      {/* Hovedfelt — KPI-rad pa toppen + spillerprofil eller velkomst */}
      <CoachHQDarkShell
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }}
        title="Spillere · arbeidsflate"
        meta={`${studentList.totalActive} aktive · klikk en spiller for full profil`}
      >
        <div className="space-y-6">
          <KpiRow kpis={kpis} />

          {selectedStudent ? (
            <SelectedStudentProfile data={selectedStudent} />
          ) : (
            <EmptyState totalActive={studentList.totalActive} />
          )}
        </div>
      </CoachHQDarkShell>
    </div>
  );
}

function SelectedStudentProfile({
  data,
}: {
  data: Awaited<ReturnType<typeof getStudent360>>;
}) {
  if (!data) return null;
  return (
    <div className="space-y-5">
      <Hero360
        identity={data.identity}
        golf={data.golf}
        coaching={data.coaching}
      />

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-5">
          <KontaktinfoCard identity={data.identity} />
        </div>
        <div className="col-span-12 lg:col-span-7">
          <GolfCard golf={data.golf} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6">
          <CoachingCard coaching={data.coaching} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <TrainingCard training={data.training} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-7">
          <MentalForecastCard mental={data.mental} forecast={data.forecast} />
        </div>
        <div className="col-span-12 lg:col-span-5">
          <TestsCard tests={data.tests} />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-6">
          <EconomyCard economy={data.economy} />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <SignalsCard signals={data.signals} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ totalActive }: { totalActive: number }) {
  return (
    <section
      className="rounded-2xl p-12 text-center"
      style={{
        background: "#0D2E23",
        border: "1px solid #1a4a3a",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#D1F843",
          fontWeight: 700,
          marginBottom: "12px",
        }}
      >
        / VELG EN SPILLER
      </div>
      <h2
        className="text-[28px] font-bold tracking-tight"
        style={{ color: "#FFFFFF" }}
      >
        Klikk en spiller i listen for å åpne 360°-profilen.
      </h2>
      <p
        className="mt-3 text-[14px] max-w-[55ch] mx-auto"
        style={{ color: "rgba(255,255,255,0.65)" }}
      >
        Du har {totalActive} aktive spillere. Listen til venstre er sortert
        etter dagens aktivitet — dagens økter øverst, deretter ukens kommende
        og spillere som trenger oppfølging nederst.
      </p>
    </section>
  );
}
