/**
 * Script for å generere portal mockup screenshots
 * Kjør: npx tsx scripts/generate-portal-mockups.ts
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const VIEWPORT = { width: 390, height: 844 }; // iPhone 14 Pro
const OUTPUT_DIR = join(process.cwd(), "public/images/portal-preview");

// Apple Light 2026 design tokens
const COLORS = {
  bg: "#F5F5F7",
  white: "#FFFFFF",
  black: "#1D1D1F",
  grey200: "#E8E8ED",
  grey400: "#86868B",
  grey500: "#6E6E73",
  success: "#34C759",
};

function generateDashboardHTML(): string {
  return `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${VIEWPORT.width}, height=${VIEWPORT.height}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.black};
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      overflow: hidden;
    }
    .container { padding: 60px 20px 20px; }
    .header { margin-bottom: 24px; }
    .greeting { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%;
      background: ${COLORS.grey200}; display: inline-flex;
      align-items: center; justify-content: center;
      font-weight: 600; font-size: 18px; color: ${COLORS.grey500};
      float: right; margin-top: -40px;
    }
    .stats-row {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 10px; margin-bottom: 20px;
    }
    .stat-card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 16px;
      padding: 14px 12px;
      text-align: center;
    }
    .stat-value { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
    .stat-label { font-size: 10px; color: ${COLORS.grey500}; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-trend { font-size: 11px; color: ${COLORS.success}; margin-top: 4px; }
    .card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 12px; font-weight: 600; color: ${COLORS.grey500};
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
    }
    .next-session { display: flex; align-items: center; gap: 14px; }
    .session-icon {
      width: 48px; height: 48px; border-radius: 14px;
      background: ${COLORS.black}; display: flex;
      align-items: center; justify-content: center;
    }
    .session-icon svg { width: 24px; height: 24px; stroke: white; fill: none; stroke-width: 2; }
    .session-info h3 { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
    .session-info p { font-size: 14px; color: ${COLORS.grey500}; }
    .insight-box {
      background: ${COLORS.bg};
      border-radius: 14px;
      padding: 16px;
    }
    .insight-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
    .insight-text { font-size: 14px; color: ${COLORS.grey500}; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="greeting">Hei, Martin!</h1>
      <div class="avatar">M</div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">12.4</div>
        <div class="stat-label">HCP</div>
        <div class="stat-trend">-0.8</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">6</div>
        <div class="stat-label">Okter</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">14</div>
        <div class="stat-label">Runder</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">84</div>
        <div class="stat-label">Snitt</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Neste okt</div>
      <div class="next-session">
        <div class="session-icon">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="session-info">
          <h3>Performance Coaching</h3>
          <p>Tirsdag 8. april kl. 14:00</p>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Coach-anbefaling</div>
      <div class="insight-box">
        <div class="insight-title">Fokuser pa naerspill denne uken</div>
        <div class="insight-text">Dine siste 5 runder viser at du taper flest slag rundt green. Prioriter chipping og pitching for a senke scoren.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateTrainingPlanHTML(): string {
  return `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${VIEWPORT.width}, height=${VIEWPORT.height}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.black};
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      overflow: hidden;
    }
    .container { padding: 60px 20px 20px; }
    .header { margin-bottom: 20px; }
    .title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .subtitle { font-size: 15px; color: ${COLORS.grey500}; margin-top: 4px; }
    .week-grid {
      display: grid; grid-template-columns: repeat(7, 1fr);
      gap: 8px; margin-bottom: 24px;
    }
    .day {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 12px;
      padding: 10px 6px;
      text-align: center;
    }
    .day.active { background: ${COLORS.black}; border-color: ${COLORS.black}; }
    .day.active .day-name, .day.active .day-num { color: white; }
    .day.has-workout::after {
      content: ''; display: block; width: 6px; height: 6px;
      background: ${COLORS.success}; border-radius: 50%;
      margin: 6px auto 0;
    }
    .day.active.has-workout::after { background: white; }
    .day-name { font-size: 10px; color: ${COLORS.grey500}; margin-bottom: 4px; }
    .day-num { font-size: 16px; font-weight: 600; }
    .card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 12px; font-weight: 600; color: ${COLORS.grey500};
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;
    }
    .exercise-list { list-style: none; }
    .exercise-item {
      display: flex; align-items: center; gap: 14px;
      padding: 12px 0;
      border-bottom: 1px solid ${COLORS.grey200};
    }
    .exercise-item:last-child { border-bottom: none; padding-bottom: 0; }
    .exercise-icon {
      width: 40px; height: 40px; border-radius: 12px;
      background: ${COLORS.bg}; display: flex;
      align-items: center; justify-content: center;
      font-size: 18px;
    }
    .exercise-info h4 { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
    .exercise-info p { font-size: 13px; color: ${COLORS.grey500}; }
    .exercise-duration {
      margin-left: auto; font-size: 13px; color: ${COLORS.grey400};
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Treningsplan</h1>
      <p class="subtitle">Uke 15 - Naerspill-fokus</p>
    </div>

    <div class="week-grid">
      <div class="day has-workout"><div class="day-name">Ma</div><div class="day-num">7</div></div>
      <div class="day active has-workout"><div class="day-name">Ti</div><div class="day-num">8</div></div>
      <div class="day"><div class="day-name">On</div><div class="day-num">9</div></div>
      <div class="day has-workout"><div class="day-name">To</div><div class="day-num">10</div></div>
      <div class="day"><div class="day-name">Fr</div><div class="day-num">11</div></div>
      <div class="day has-workout"><div class="day-name">Lo</div><div class="day-num">12</div></div>
      <div class="day"><div class="day-name">So</div><div class="day-num">13</div></div>
    </div>

    <div class="card">
      <div class="card-title">Dagens okt</div>
      <ul class="exercise-list">
        <li class="exercise-item">
          <div class="exercise-icon">🎯</div>
          <div class="exercise-info">
            <h4>Pitch 20-40 meter</h4>
            <p>Variert avstand, 30 baller</p>
          </div>
          <span class="exercise-duration">20 min</span>
        </li>
        <li class="exercise-item">
          <div class="exercise-icon">⛳</div>
          <div class="exercise-info">
            <h4>Chip rundt green</h4>
            <p>3 posisjoner, opp-og-ned</p>
          </div>
          <span class="exercise-duration">25 min</span>
        </li>
        <li class="exercise-item">
          <div class="exercise-icon">🏌️</div>
          <div class="exercise-info">
            <h4>Putting drill</h4>
            <p>Gate drill + avstandskontroll</p>
          </div>
          <span class="exercise-duration">15 min</span>
        </li>
      </ul>
    </div>
  </div>
</body>
</html>`;
}

function generateStatisticsHTML(): string {
  return `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${VIEWPORT.width}, height=${VIEWPORT.height}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.black};
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      overflow: hidden;
    }
    .container { padding: 60px 20px 20px; }
    .header { margin-bottom: 24px; }
    .title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .stats-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 12px; margin-bottom: 24px;
    }
    .stat-card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 16px;
      padding: 16px;
    }
    .stat-label { font-size: 12px; color: ${COLORS.grey500}; margin-bottom: 6px; }
    .stat-value { font-size: 28px; font-weight: 700; }
    .stat-subtext { font-size: 12px; color: ${COLORS.success}; margin-top: 4px; }
    .stat-subtext.neutral { color: ${COLORS.grey400}; }
    .card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 20px;
      padding: 20px;
    }
    .card-title {
      font-size: 12px; font-weight: 600; color: ${COLORS.grey500};
      text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px;
    }
    .sg-item {
      display: flex; align-items: center; gap: 12px;
      margin-bottom: 16px;
    }
    .sg-item:last-child { margin-bottom: 0; }
    .sg-label { width: 100px; font-size: 14px; font-weight: 500; }
    .sg-bar-container {
      flex: 1; height: 8px; background: ${COLORS.grey200};
      border-radius: 4px; overflow: hidden;
    }
    .sg-bar {
      height: 100%; border-radius: 4px;
      background: ${COLORS.black};
    }
    .sg-bar.negative { background: #FF3B30; }
    .sg-bar.positive { background: ${COLORS.success}; }
    .sg-value { width: 50px; text-align: right; font-size: 14px; font-weight: 600; }
    .sg-value.positive { color: ${COLORS.success}; }
    .sg-value.negative { color: #FF3B30; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Statistikk</h1>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Gjennomsnitt</div>
        <div class="stat-value">84.2</div>
        <div class="stat-subtext">-2.1 siste 30d</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Runder</div>
        <div class="stat-value">14</div>
        <div class="stat-subtext class="neutral">Siste 30 dager</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Beste runde</div>
        <div class="stat-value">79</div>
        <div class="stat-subtext">GFGK 23. mars</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Treningstimer</div>
        <div class="stat-value">18</div>
        <div class="stat-subtext class="neutral">Siste 30 dager</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Strokes Gained</div>
      <div class="sg-item">
        <span class="sg-label">Tee</span>
        <div class="sg-bar-container"><div class="sg-bar positive" style="width: 70%"></div></div>
        <span class="sg-value positive">+1.2</span>
      </div>
      <div class="sg-item">
        <span class="sg-label">Approach</span>
        <div class="sg-bar-container"><div class="sg-bar positive" style="width: 45%"></div></div>
        <span class="sg-value positive">+0.4</span>
      </div>
      <div class="sg-item">
        <span class="sg-label">Short Game</span>
        <div class="sg-bar-container"><div class="sg-bar negative" style="width: 60%"></div></div>
        <span class="sg-value negative">-1.8</span>
      </div>
      <div class="sg-item">
        <span class="sg-label">Putting</span>
        <div class="sg-bar-container"><div class="sg-bar negative" style="width: 30%"></div></div>
        <span class="sg-value negative">-0.6</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateCoachingHistoryHTML(): string {
  return `
<!DOCTYPE html>
<html lang="no">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=${VIEWPORT.width}, height=${VIEWPORT.height}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
      background: ${COLORS.bg};
      color: ${COLORS.black};
      width: ${VIEWPORT.width}px;
      height: ${VIEWPORT.height}px;
      overflow: hidden;
    }
    .container { padding: 60px 20px 20px; }
    .header { margin-bottom: 24px; }
    .title { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
    .session-card {
      background: ${COLORS.white};
      border: 1px solid ${COLORS.grey200};
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .session-header {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 12px;
    }
    .session-date { font-size: 13px; color: ${COLORS.grey500}; }
    .session-type {
      font-size: 11px; font-weight: 600; color: ${COLORS.grey500};
      background: ${COLORS.bg}; padding: 4px 10px; border-radius: 100px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .session-title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
    .session-summary { font-size: 14px; color: ${COLORS.grey500}; line-height: 1.5; }
    .ai-card {
      background: ${COLORS.black};
      border-radius: 20px;
      padding: 20px;
      color: white;
    }
    .ai-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7);
      margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .ai-badge svg { width: 14px; height: 14px; }
    .ai-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
    .ai-text { font-size: 14px; color: rgba(255,255,255,0.8); line-height: 1.5; }
    .tags { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
    .tag {
      font-size: 12px; color: ${COLORS.grey500}; background: ${COLORS.bg};
      padding: 6px 12px; border-radius: 100px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">Coachinghistorikk</h1>
    </div>

    <div class="session-card">
      <div class="session-header">
        <span class="session-date">1. april 2026</span>
        <span class="session-type">Performance</span>
      </div>
      <h3 class="session-title">Naerspill og bunkerslag</h3>
      <p class="session-summary">Jobbet med bunkerteknikk - apnere klubbhode og mykere hender. Pitch-kontroll 30-50m viste god progresjon.</p>
      <div class="tags">
        <span class="tag">Bunker</span>
        <span class="tag">Pitch</span>
        <span class="tag">TrackMan</span>
      </div>
    </div>

    <div class="session-card">
      <div class="session-header">
        <span class="session-date">25. mars 2026</span>
        <span class="session-type">Performance</span>
      </div>
      <h3 class="session-title">Driveranalyse</h3>
      <p class="session-summary">TrackMan-data viste for hoy spinn. Justerte balltref og vinkel - fikk ned spinn fra 3200 til 2400.</p>
    </div>

    <div class="ai-card">
      <div class="ai-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 6v6l4 2"/></svg>
        AI-oppsummering
      </div>
      <h3 class="ai-title">Trend siste 3 okter</h3>
      <p class="ai-text">Naerspillet har vaert hovedfokus. Bunkerspillet er forbedret. Anbefaler a fortsette med pitch-ovelser for a stabilisere avstandskontrollen.</p>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log("Genererer portal mockups...");

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const mockups = [
    { name: "dashboard", html: generateDashboardHTML() },
    { name: "treningsplan", html: generateTrainingPlanHTML() },
    { name: "statistikk", html: generateStatisticsHTML() },
    { name: "coaching-historikk", html: generateCoachingHistoryHTML() },
  ];

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // Retina
  });

  for (const mockup of mockups) {
    const page = await context.newPage();
    await page.setContent(mockup.html);
    await page.waitForTimeout(100); // Let fonts load

    const outputPath = join(OUTPUT_DIR, `${mockup.name}.png`);
    await page.screenshot({ path: outputPath, type: "png" });
    console.log(`  ✓ ${mockup.name}.png`);

    await page.close();
  }

  await browser.close();
  console.log("\nFerdig! Mockups lagret i public/images/portal-preview/");
}

main().catch(console.error);
