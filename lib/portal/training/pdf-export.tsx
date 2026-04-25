/**
 * PDF-eksport av treningsplan.
 *
 * Genererer en A4-PDF med plan-tittel, mål, ukentlige fokus og økt-oversikt.
 * Brukes av `app/api/portal/training/export-pdf/[planId]/route.ts`.
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const colors = {
  primary: "#154212",
  accent: "#d2f000",
  surface: "#fdf9f0",
  onSurface: "#1c1c16",
  variant: "#42493e",
  outline: "#c2c9bb",
  surfaceContainer: "#f1eee5",
} as const;

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    color: colors.onSurface,
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: colors.surface,
  },
  coverHeader: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 12,
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: colors.variant,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    fontSize: 9,
    color: colors.variant,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  goalsBox: {
    backgroundColor: colors.surfaceContainer,
    padding: 10,
    borderRadius: 4,
    fontSize: 9,
    lineHeight: 1.5,
  },
  feedbackBox: {
    backgroundColor: "#e9efde",
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: 10,
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 16,
  },
  weekHeader: {
    backgroundColor: colors.primary,
    color: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 6,
  },
  weekFocus: {
    fontSize: 8,
    color: colors.surface,
    marginTop: 2,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayCard: {
    width: "31%",
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 4,
    padding: 6,
    minHeight: 60,
  },
  dayLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.primary,
    marginBottom: 2,
    textTransform: "uppercase",
  },
  sessionTitle: {
    fontSize: 9,
    fontWeight: 700,
    marginTop: 4,
  },
  sessionMeta: {
    fontSize: 7,
    color: colors.variant,
    marginTop: 1,
  },
  restDay: {
    fontSize: 7,
    color: colors.variant,
    fontStyle: "italic",
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 7,
    color: colors.variant,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.outline,
    paddingTop: 8,
  },
});

const DAY_NAMES = ["", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];
const SHORT_DAYS = ["", "Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export interface PdfPlanData {
  title: string;
  description: string | null;
  goals: string | null;
  studentName: string;
  periodType: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
  aiGenerated: boolean;
  coachFeedback: string | null;
  coachFeedbackAt: string | null;
  weeks: Array<{
    weekNumber: number;
    weekStart: string;
    focus: string | null;
    volumeLabel: string | null;
    restDays: number[];
    sessions: Array<{
      dayOfWeek: number;
      title: string;
      durationMinutes: number | null;
      focusArea: string | null;
    }>;
  }>;
  generatedAt: string;
}

function PlanDocument({ data }: { data: PdfPlanData }) {
  const totalSessions = data.weeks.reduce((sum, w) => sum + w.sessions.length, 0);
  const totalMinutes = data.weeks.reduce(
    (sum, w) =>
      sum + w.sessions.reduce((s, sess) => s + (sess.durationMinutes ?? 0), 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.coverHeader}>
          <Text style={styles.eyebrow}>AK Golf — Treningsplan</Text>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.metaRow}>
            <Text>Spiller: {data.studentName}</Text>
            <Text>·</Text>
            <Text>
              {data.startDate} til {data.endDate}
            </Text>
            <Text>·</Text>
            <Text>{data.periodType}</Text>
            {data.aiGenerated && (
              <>
                <Text>·</Text>
                <Text>AI-generert</Text>
              </>
            )}
          </View>
        </View>

        {data.coachFeedback && (
          <View style={styles.feedbackBox}>
            <Text style={{ fontWeight: 700, marginBottom: 3 }}>
              Coach-kommentar
              {data.coachFeedbackAt
                ? ` · ${data.coachFeedbackAt.slice(0, 10)}`
                : ""}
            </Text>
            <Text>{data.coachFeedback}</Text>
          </View>
        )}

        {data.goals && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mål</Text>
            <View style={styles.goalsBox}>
              <Text>{data.goals}</Text>
            </View>
          </View>
        )}

        {data.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beskrivelse</Text>
            <Text style={{ fontSize: 9 }}>{data.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sammendrag</Text>
          <View style={{ flexDirection: "row", gap: 16, fontSize: 9 }}>
            <Text>{data.weeks.length} uker</Text>
            <Text>{totalSessions} økter</Text>
            <Text>{Math.round(totalMinutes / 60)} timer planlagt</Text>
          </View>
        </View>

        {data.weeks.map((week) => (
          <View key={week.weekNumber} wrap={false}>
            <View style={styles.weekHeader}>
              <Text>
                Uke {week.weekNumber} · {week.weekStart}
              </Text>
              {week.focus && <Text style={styles.weekFocus}>{week.focus}</Text>}
            </View>
            <View style={styles.daysGrid}>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const sessions = week.sessions.filter((s) => s.dayOfWeek === day);
                const isRest = week.restDays.includes(day);
                return (
                  <View key={day} style={styles.dayCard}>
                    <Text style={styles.dayLabel}>{SHORT_DAYS[day]}</Text>
                    {isRest && <Text style={styles.restDay}>Hviledag</Text>}
                    {!isRest && sessions.length === 0 && (
                      <Text style={styles.restDay}>—</Text>
                    )}
                    {sessions.map((s, i) => (
                      <View key={i}>
                        <Text style={styles.sessionTitle}>{s.title}</Text>
                        <Text style={styles.sessionMeta}>
                          {s.durationMinutes ?? 60} min
                          {s.focusArea ? ` · ${s.focusArea}` : ""}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text>AK Golf · {data.studentName}</Text>
          <Text>Generert {data.generatedAt.slice(0, 10)}</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Side ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

export async function renderPlanPdf(data: PdfPlanData): Promise<Buffer> {
  const buffer = await renderToBuffer(<PlanDocument data={data} />);
  return buffer;
}

export { DAY_NAMES };
