import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { GeneratedPlan } from "@/lib/ai/plan-schema";

// Register Inter font
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiA.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2", fontWeight: 700 },
  ],
});

// AK Golf design tokens
const colors = {
  navy: "#0A1F18",
  navyDark: "#0A1F18",
  gold: "#0A1F18",
  goldLight: "#D5DFDB",
  goldMuted: "#D5DFDB",
  goldDark: "#5A6E66",
  ink90: "#02060D",
  ink70: "#3A4A5A",
  ink50: "#7A8C85",
  ink30: "#C8CDD4",
  ink10: "#F0F2F5",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9,
    color: colors.ink90,
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: colors.white,
  },
  // Cover page
  coverPage: {
    fontFamily: "Inter",
    backgroundColor: colors.navyDark,
    paddingHorizontal: 50,
    paddingVertical: 60,
    justifyContent: "space-between",
    minHeight: "100%",
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 14,
    color: colors.goldLight,
    fontWeight: 400,
  },
  coverMeta: {
    fontSize: 10,
    color: colors.ink30,
    marginTop: 4,
  },
  coverFooter: {
    fontSize: 8,
    color: colors.ink50,
  },
  // Section headers
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.navy,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: colors.gold,
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.ink90,
    marginBottom: 6,
    marginTop: 14,
  },
  // Content
  bodyText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: colors.ink70,
    marginBottom: 4,
  },
  label: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.ink50,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.ink90,
  },
  // Cards / boxes
  card: {
    backgroundColor: colors.ink10,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  goldCard: {
    backgroundColor: colors.goldMuted,
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  // Grid
  row: {
    flexDirection: "row" as const,
    gap: 8,
  },
  col2: {
    flex: 1,
  },
  col3: {
    flex: 1,
  },
  // Pyramid bar
  pyramidRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 4,
  },
  pyramidLabel: {
    width: 35,
    fontSize: 8,
    fontWeight: 600,
    color: colors.ink50,
  },
  pyramidBar: {
    height: 8,
    backgroundColor: colors.gold,
    borderRadius: 4,
  },
  pyramidValue: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.ink90,
    marginLeft: 6,
    width: 25,
  },
  // Day card
  dayCard: {
    backgroundColor: colors.ink10,
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  dayHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 4,
  },
  dayName: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.ink90,
  },
  dayDuration: {
    fontSize: 8,
    color: colors.ink50,
  },
  sessionType: {
    fontSize: 8,
    color: colors.gold,
    fontWeight: 600,
    marginBottom: 3,
  },
  blockArea: {
    fontSize: 7,
    fontWeight: 600,
    color: colors.navy,
  },
  blockFocus: {
    fontSize: 8,
    color: colors.ink70,
  },
  // Exercise
  exerciseName: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.ink90,
  },
  exerciseMeta: {
    fontSize: 7,
    color: colors.ink50,
  },
  exerciseStep: {
    fontSize: 8,
    color: colors.ink70,
    marginBottom: 1,
    paddingLeft: 8,
  },
  // Page number
  pageNumber: {
    position: "absolute" as const,
    bottom: 20,
    right: 40,
    fontSize: 8,
    color: colors.ink30,
  },
  brandFooter: {
    position: "absolute" as const,
    bottom: 20,
    left: 40,
    fontSize: 7,
    color: colors.ink30,
  },
  // Bullet
  bullet: {
    fontSize: 8,
    color: colors.ink70,
    marginBottom: 2,
    paddingLeft: 8,
  },
});

// ─── PDF Document Component ───

function TrainingPlanPDF({ plan }: { plan: GeneratedPlan }) {
  const { summary, monthlyPhases, weeklySchedule, exercises, testPlan, mentalTraining, progressionCriteria } = plan;

  return React.createElement(
    Document,
    { title: `Treningsplan - Kategori ${summary.playerCategory}`, author: "AK Golf Group" },

    // Cover page
    React.createElement(
      Page,
      { size: "A4", style: styles.coverPage },
      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.coverSubtitle }, "AK Golf Group"),
        React.createElement(Text, { style: { ...styles.coverTitle, marginTop: 60 } }, "AI Treningsplan"),
        React.createElement(Text, { style: styles.coverSubtitle }, `Kategori ${summary.playerCategory} — ${summary.categoryName}`),
        React.createElement(Text, { style: styles.coverMeta }, `${summary.totalWeeks} uker | ${summary.sessionsPerWeek} økter/uke | ${summary.minutesPerSession} min/økt`),
        React.createElement(Text, { style: { ...styles.coverMeta, marginTop: 20 } }, summary.mainFocus),
      ),
      React.createElement(
        View,
        null,
        React.createElement(Text, { style: styles.coverFooter }, `Generert ${new Date().toLocaleDateString("nb-NO")} | akgolf.no`),
        React.createElement(Text, { style: styles.coverFooter }, "Basert på AK-formelen — proprietær treningsmetodikk"),
      ),
    ),

    // Summary + Monthly Phases
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.sectionTitle }, "Oversikt"),

      // Pyramid
      React.createElement(Text, { style: styles.subsectionTitle }, "Pyramidefordeling"),
      ...(["FYS", "TEK", "SLAG", "SPILL", "TURN"] as const).map((level) =>
        React.createElement(
          View,
          { key: level, style: styles.pyramidRow },
          React.createElement(Text, { style: styles.pyramidLabel }, level),
          React.createElement(View, { style: { ...styles.pyramidBar, width: `${summary.pyramidDistribution[level] * 3}` } }),
          React.createElement(Text, { style: styles.pyramidValue }, `${summary.pyramidDistribution[level]}%`),
        ),
      ),

      React.createElement(Text, { style: { ...styles.bodyText, marginTop: 12 } }, `Estimert forbedring: ${summary.estimatedImprovement}`),

      // Monthly phases
      React.createElement(Text, { style: styles.sectionTitle }, "3-måneders plan"),
      ...monthlyPhases.map((phase) =>
        React.createElement(
          View,
          { key: phase.month, style: styles.card },
          React.createElement(Text, { style: styles.subsectionTitle }, `Måned ${phase.month}: ${phase.name} (${phase.phase})`),
          React.createElement(Text, { style: styles.label }, "Fokusområder"),
          ...phase.focus.map((f, i) => React.createElement(Text, { key: i, style: styles.bullet }, `• ${f}`)),
          React.createElement(Text, { style: { ...styles.label, marginTop: 4 } }, "Mål"),
          ...phase.goals.map((g, i) => React.createElement(Text, { key: i, style: styles.bullet }, `• ${g}`)),
        ),
      ),

      React.createElement(Text, { style: styles.brandFooter, render: () => "AK Golf Group | akgolf.no" }),
      React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber }) => `${pageNumber}` }),
    ),

    // Weekly schedules (one page per 2 weeks)
    ...chunkArray(weeklySchedule, 2).map((weekPair, chunkIdx) =>
      React.createElement(
        Page,
        { key: `week-${chunkIdx}`, size: "A4", style: styles.page },
        ...weekPair.map((week) => [
          React.createElement(Text, { key: `title-${week.weekNumber}`, style: styles.sectionTitle }, `Uke ${week.weekNumber}: ${week.theme}`),
          ...week.days.filter(d => !d.isRestDay).map((day) =>
            React.createElement(
              View,
              { key: `day-${week.weekNumber}-${day.dayNumber}`, style: styles.dayCard },
              React.createElement(
                View,
                { style: styles.dayHeader },
                React.createElement(Text, { style: styles.dayName }, day.dayName),
                React.createElement(Text, { style: styles.dayDuration }, `${day.duration} min`),
              ),
              React.createElement(Text, { style: styles.sessionType }, day.sessionType || ""),
              day.mainA && React.createElement(Text, { style: styles.blockArea }, `A: ${day.mainA.area} — ${day.mainA.focus}`),
              day.mainB && React.createElement(Text, { style: styles.blockArea }, `B: ${day.mainB.area} — ${day.mainB.focus}`),
              day.application && React.createElement(Text, { style: styles.blockFocus }, `Anvendelse: ${day.application}`),
            ),
          ),
        ]).flat(),
        React.createElement(Text, { style: styles.brandFooter, render: () => "AK Golf Group | akgolf.no" }),
        React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber }) => `${pageNumber}` }),
      ),
    ),

    // Exercises page
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.sectionTitle }, "Øvelsesbibliotek"),
      ...exercises.slice(0, 12).map((ex) =>
        React.createElement(
          View,
          { key: ex.name, style: styles.card },
          React.createElement(
            View,
            { style: styles.row },
            React.createElement(Text, { style: styles.exerciseName }, ex.name),
            React.createElement(Text, { style: styles.exerciseMeta }, `${ex.pyramidLevel} | ${ex.difficulty} | ${ex.duration} min`),
          ),
          ...ex.steps.map((step, i) => React.createElement(Text, { key: i, style: styles.exerciseStep }, `${i + 1}. ${step}`)),
          ex.tips.length > 0 && React.createElement(Text, { style: { ...styles.exerciseMeta, marginTop: 3 } }, `Tips: ${ex.tips.join(". ")}`),
        ),
      ),
      React.createElement(Text, { style: styles.brandFooter, render: () => "AK Golf Group | akgolf.no" }),
      React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber }) => `${pageNumber}` }),
    ),

    // Test plan + Mental + Progression
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.sectionTitle }, "Testplan"),
      ...testPlan.schedule.map((test) =>
        React.createElement(
          View,
          { key: test.label, style: styles.card },
          React.createElement(Text, { style: styles.exerciseName }, `${test.label} (Uke ${test.weekNumber})`),
          React.createElement(Text, { style: styles.bodyText }, test.purpose),
        ),
      ),

      React.createElement(Text, { style: styles.sectionTitle }, "Mental trening"),
      React.createElement(
        View,
        { style: styles.goldCard },
        React.createElement(Text, { style: styles.subsectionTitle }, "Fokusferdigheter"),
        ...mentalTraining.focusSkills.map((skill, i) => React.createElement(Text, { key: i, style: styles.bullet }, `• ${skill}`)),
        React.createElement(Text, { style: { ...styles.subsectionTitle, marginTop: 8 } }, "Pre-shot rutine"),
        React.createElement(Text, { style: styles.bodyText }, mentalTraining.preShotRoutine),
      ),

      React.createElement(Text, { style: styles.sectionTitle }, "Progresjon"),
      React.createElement(
        View,
        { style: styles.card },
        React.createElement(Text, { style: styles.value }, `${progressionCriteria.currentCategory} → ${progressionCriteria.nextCategory}`),
        React.createElement(Text, { style: styles.bodyText }, `Estimert: ${progressionCriteria.estimatedTimeline}`),
        React.createElement(Text, { style: { ...styles.label, marginTop: 6 } }, "Krav for opprykk"),
        ...progressionCriteria.requirements.map((req, i) => React.createElement(Text, { key: i, style: styles.bullet }, `• ${req}`)),
      ),

      React.createElement(Text, { style: styles.brandFooter, render: () => "AK Golf Group | akgolf.no" }),
      React.createElement(Text, { style: styles.pageNumber, render: ({ pageNumber }) => `${pageNumber}` }),
    ),
  );
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─── Public API ───

export async function generatePlanPDF(plan: GeneratedPlan): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc = React.createElement(TrainingPlanPDF, { plan }) as any;
  return renderToBuffer(doc);
}
