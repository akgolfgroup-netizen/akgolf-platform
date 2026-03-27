import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect, notFound } from "next/navigation";
import { getStudentProfile } from "../actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, BookOpen, ExternalLink, Target, TrendingDown, MessageCircle } from "lucide-react";
import { PlayerProgressionChart } from "@/components/portal/admin/player-progression-chart";
import { PlayerGoalsSection } from "@/components/portal/admin/player-goals-section";
import { EditableCoachingNotes } from "@/components/portal/admin/editable-coaching-notes";
import { CommunicationLog } from "@/components/portal/admin/communication-log";
import { getCommunicationLogs } from "./communication-actions";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Bekreftet",
  PENDING: "Venter",
  COMPLETED: "Fullfort",
  NO_SHOW: "Ikke mott",
  CANCELLED: "Avbestilt",
};

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-gray-100 text-gray-600",
  NO_SHOW: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default async function StudentProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const student = await getStudentProfile(id);
  if (!student) notFound();

  const communicationLogs = await getCommunicationLogs(id);

  const totalSpent = student.Booking
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/elever"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#0A1929]">
            {student.name ?? "Ukjent"}
          </h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            {student.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {student.email}
              </span>
            )}
            {student.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {student.phone}
              </span>
            )}
          </div>
        </div>
        {student.notionPageId && (
          <a
            href={`https://notion.so/${student.notionPageId.replace(/-/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Notion-profil
          </a>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Bookinger"
          value={String(student.Booking.length)}
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          label="Coaching-økter"
          value={String(student.CoachingSession.length)}
          icon={<BookOpen className="w-4 h-4" />}
        />
        <StatCard
          label="Totalt betalt"
          value={`kr ${totalSpent.toLocaleString("nb-NO")}`}
        />
        <StatCard
          label="Kunde siden"
          value={format(new Date(student.createdAt), "MMM yyyy", { locale: nb })}
        />
      </div>

      {/* Handicap Progression */}
      {student.HandicapEntry && student.HandicapEntry.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#0A1929] mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-[#B07D4F]" />
            Handicap-utvikling
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <PlayerProgressionChart
              handicapEntries={student.HandicapEntry}
              coachingSessions={student.CoachingSession}
            />
          </div>
        </div>
      )}

      {/* Player Goals */}
      {student.Goal && student.Goal.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#0A1929] mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#B07D4F]" />
            Spillerens mål
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <PlayerGoalsSection goals={student.Goal} />
          </div>
        </div>
      )}

      {/* Booking history */}
      <div>
        <h2 className="text-lg font-semibold text-[#0A1929] mb-3">
          Bookinghistorikk
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {student.Booking.length === 0 ? (
            <p className="text-sm text-gray-400 p-6 text-center">
              Ingen bookinger
            </p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Dato</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Tjeneste</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Instruktor</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-gray-500 uppercase">Belop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {student.Booking.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {format(new Date(b.startTime), "d. MMM yyyy HH:mm", { locale: nb })}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{b.ServiceType.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {b.Instructor.User.name ?? "—"}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status] ?? "bg-gray-100"}`}>
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-right">
                      kr {b.amount.toLocaleString("nb-NO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Coaching sessions */}
      <div>
        <h2 className="text-lg font-semibold text-[#0A1929] mb-3">
          Coaching-økter
        </h2>
        <div className="space-y-3">
          {student.CoachingSession.length === 0 ? (
            <p className="text-sm text-gray-400 bg-white rounded-xl border border-gray-200 p-6 text-center">
              Ingen coaching-økter registrert
            </p>
          ) : (
            student.CoachingSession.map((cs) => (
              <EditableCoachingNotes key={cs.id} session={cs} />
            ))
          )}
        </div>
      </div>

      {/* Communication log */}
      <div>
        <h2 className="text-lg font-semibold text-[#0A1929] mb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#B07D4F]" />
          Kommunikasjonslogg
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <CommunicationLog
            studentId={id}
            initialLogs={communicationLogs}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-400 mb-1">
        {icon}
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <p className="text-lg font-semibold text-[#0A1929]">{value}</p>
    </div>
  );
}
