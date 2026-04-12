import { useState } from "react";

const colors = {
  navy: "#0F2950",
  navyDark: "#0A1929",
  navyLight: "#10456A",
  gold: "#B8975C",
  goldLight: "#D4C4A8",
  goldDark: "#8B7243",
  goldMuted: "#E8D4B0",
  goldText: "#6B5530",
  ink05: "#FAFBFC",
  ink10: "#F0F2F5",
  ink20: "#E2E6EB",
  ink30: "#C8CDD4",
  ink40: "#9BA5B2",
  ink50: "#6B7B8D",
  ink60: "#4F5D6B",
  ink70: "#3A4A5A",
  ink80: "#222F3D",
  ink90: "#02060D",
  ink100: "#0A1929",
  success: "#22C55E",
  successLight: "#DCFCE7",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  info: "#3B82F6",
  infoLight: "#DBEAFE",
  junior: "#3B82F6",
  software: "#8B5CF6",
  utvikling: "#22C55E",
};

// ─── Icons (inline SVG components) ───
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Students: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Chart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  TrendDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Clock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Eye: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  FileText: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Target: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Export: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
};

// ─── Sparkline mini chart ───
function Sparkline({ data, color, width = 80, height = 28 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Donut Chart ───
function DonutChart({ value, total, color, size = 120, label }) {
  const pct = value / total;
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={colors.ink10} strokeWidth="10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ marginTop: -size/2 - 12, position: "relative" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.02em" }}>
          {Math.round(pct * 100)}%
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, color: colors.ink40, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Area Chart (SVG) ───
function AreaChart({ data, color, width = 440, height = 180, labels }) {
  const max = Math.max(...data) * 1.15;
  const min = 0;
  const range = max - min || 1;
  const padL = 40, padR = 10, padT = 10, padB = 30;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = data.map((v, i) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - ((v - min) / range) * chartH;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length-1].x},${padT + chartH} L${points[0].x},${padT + chartH} Z`;

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(pct => {
    const y = padT + chartH - pct * chartH;
    const val = Math.round(min + pct * range);
    return { y, val };
  });

  return (
    <svg width={width} height={height} style={{ display: "block", width: "100%" }} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padL} y1={g.y} x2={width - padR} y2={g.y} stroke={colors.ink10} strokeWidth="1" />
          <text x={padL - 8} y={g.y + 3} textAnchor="end" fontSize="9" fill={colors.ink40} fontFamily="Inter, system-ui, sans-serif">{g.val}</text>
        </g>
      ))}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="white" stroke={color} strokeWidth="2" />
      ))}
      {labels && labels.map((l, i) => {
        const x = padL + (i / (labels.length - 1)) * chartW;
        return <text key={i} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill={colors.ink40} fontFamily="Inter, system-ui, sans-serif">{l}</text>;
      })}
    </svg>
  );
}

// ─── Bar Chart ───
function BarChart({ data, labels, color, width = 280, height = 160 }) {
  const max = Math.max(...data) * 1.15;
  const padL = 30, padB = 28, padT = 8, padR = 8;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const barW = Math.min(24, (chartW / data.length) * 0.6);
  const gap = chartW / data.length;

  return (
    <svg width={width} height={height} style={{ display: "block", width: "100%" }} viewBox={`0 0 ${width} ${height}`}>
      {[0, 0.5, 1].map((pct, i) => {
        const y = padT + chartH - pct * chartH;
        return <line key={i} x1={padL} y1={y} x2={width - padR} y2={y} stroke={colors.ink10} strokeWidth="1" />;
      })}
      {data.map((v, i) => {
        const barH = (v / max) * chartH;
        const x = padL + i * gap + (gap - barW) / 2;
        const y = padT + chartH - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={barW/4} fill={color} opacity={0.85 + (i / data.length) * 0.15} />
            {labels && (
              <text x={x + barW/2} y={height - 8} textAnchor="middle" fontSize="9" fill={colors.ink40} fontFamily="Inter, system-ui, sans-serif">{labels[i]}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── KPI Card ───
function KPICard({ title, value, trend, trendValue, sparkData, icon: IconComp }) {
  const isUp = trend === "up";
  return (
    <div style={{
      background: "white",
      border: `1px solid ${colors.ink10}`,
      borderRadius: 12,
      padding: "20px 20px 16px",
      flex: 1,
      minWidth: 0,
      transition: "border-color 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = colors.ink20; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.04)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = colors.ink10; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: colors.ink05, display: "flex", alignItems: "center", justifyContent: "center", color: colors.ink50 }}>
            <IconComp />
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: colors.ink50, letterSpacing: "0.04em", textTransform: "uppercase" }}>{title}</span>
        </div>
        {sparkData && <Sparkline data={sparkData} color={isUp ? colors.success : colors.ink30} width={56} height={22} />}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 28, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {isUp ? <Icons.TrendUp /> : <Icons.TrendDown />}
          <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? colors.success : colors.error }}>{trendValue}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const map = {
    "Aktiv": { bg: colors.successLight, color: "#166534", dot: colors.success },
    "Kommende": { bg: colors.infoLight, color: "#1E40AF", dot: colors.info },
    "Fullført": { bg: colors.ink10, color: colors.ink60, dot: colors.ink40 },
    "Kritisk": { bg: colors.errorLight, color: "#991B1B", dot: colors.error },
    "Advarsel": { bg: colors.warningLight, color: "#92400E", dot: colors.warning },
  };
  const s = map[status] || map["Aktiv"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 999,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ─── Booking / Availability View ───
function BookingView() {
  const coaches = [
    { id: "anders", name: "Anders Kristiansen", role: "Head Coach", initials: "AK", color: colors.navy, specialties: ["Elite", "Utviklingspakke", "Mental trening"] },
    { id: "markus", name: "Markus R. Pedersen", role: "Junior Coach", initials: "MP", color: colors.junior, specialties: ["Junior 13–15", "Junior 16–17", "Gruppetrening"] },
  ];

  const [selectedCoach, setSelectedCoach] = useState("anders");
  const [weekOffset, setWeekOffset] = useState(0);

  // Generate week days from today + offset
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const dayNames = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const monthNames = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 07:00 – 18:00

  // Mock availability/bookings per coach
  const bookingsData = {
    anders: {
      0: [ // Monday
        { start: 8, duration: 1, type: "booked", student: "Kari Haugen", program: "Elite" },
        { start: 9, duration: 1.5, type: "booked", student: "Thomas Rasmussen", program: "Elite" },
        { start: 11, duration: 1, type: "booked", student: "Maria Lindberg", program: "Utviklingspakke" },
        { start: 13, duration: 1, type: "available", label: "Ledig" },
        { start: 14, duration: 1, type: "available", label: "Ledig" },
        { start: 15, duration: 1, type: "booked", student: "Erik Solberg", program: "Grunnpakke" },
      ],
      1: [ // Tuesday
        { start: 8, duration: 2, type: "booked", student: "Kari Haugen", program: "Elite" },
        { start: 10, duration: 1, type: "available", label: "Ledig" },
        { start: 13, duration: 1, type: "booked", student: "Sofie Andersen", program: "Junior 16–17" },
        { start: 14, duration: 1, type: "available", label: "Ledig" },
        { start: 15, duration: 2, type: "blocked", label: "Intern" },
      ],
      2: [ // Wednesday
        { start: 9, duration: 1, type: "booked", student: "Maria Lindberg", program: "Utviklingspakke" },
        { start: 10, duration: 1, type: "booked", student: "Thomas Rasmussen", program: "Elite" },
        { start: 11, duration: 1, type: "available", label: "Ledig" },
        { start: 13, duration: 1, type: "available", label: "Ledig" },
        { start: 14, duration: 1, type: "available", label: "Ledig" },
      ],
      3: [ // Thursday
        { start: 8, duration: 1, type: "booked", student: "Erik Solberg", program: "Grunnpakke" },
        { start: 9, duration: 2, type: "booked", student: "Kari Haugen", program: "Elite" },
        { start: 13, duration: 1, type: "available", label: "Ledig" },
        { start: 14, duration: 1.5, type: "booked", student: "Thomas Rasmussen", program: "Elite" },
        { start: 16, duration: 1, type: "blocked", label: "Møte NGF" },
      ],
      4: [ // Friday
        { start: 8, duration: 1, type: "booked", student: "Maria Lindberg", program: "Utviklingspakke" },
        { start: 9, duration: 1, type: "available", label: "Ledig" },
        { start: 10, duration: 2, type: "booked", student: "Sofie Andersen", program: "Junior 16–17" },
      ],
      5: [], // Saturday
      6: [], // Sunday
    },
    markus: {
      0: [
        { start: 14, duration: 2, type: "booked", student: "Junior Gruppe A", program: "Junior 13–15" },
        { start: 16, duration: 2, type: "booked", student: "Junior Gruppe B", program: "Junior 16–17" },
      ],
      1: [
        { start: 9, duration: 1, type: "available", label: "Ledig" },
        { start: 10, duration: 1, type: "available", label: "Ledig" },
        { start: 14, duration: 2, type: "booked", student: "Junior Gruppe A", program: "Junior 13–15" },
      ],
      2: [
        { start: 14, duration: 2, type: "booked", student: "Junior Gruppe B", program: "Junior 16–17" },
        { start: 16, duration: 1.5, type: "booked", student: "Sofie Andersen", program: "Junior 16–17" },
      ],
      3: [
        { start: 10, duration: 1, type: "available", label: "Ledig" },
        { start: 14, duration: 2, type: "booked", student: "Junior Gruppe A", program: "Junior 13–15" },
        { start: 16, duration: 2, type: "booked", student: "Junior Gruppe B", program: "Junior 16–17" },
      ],
      4: [
        { start: 9, duration: 3, type: "booked", student: "Banespill alle grupper", program: "Junior 13–15" },
      ],
      5: [
        { start: 9, duration: 4, type: "booked", student: "Turnering / intensiv", program: "Junior 16–17" },
      ],
      6: [],
    },
  };

  const bookings = bookingsData[selectedCoach] || {};
  const coach = coaches.find(c => c.id === selectedCoach);

  const typeStyles = {
    booked: { bg: `${colors.navy}0D`, border: `${colors.navy}25`, color: colors.navy, dot: colors.navy },
    available: { bg: `${colors.success}0D`, border: `${colors.success}30`, color: "#166534", dot: colors.success },
    blocked: { bg: `${colors.ink40}0D`, border: `${colors.ink30}`, color: colors.ink60, dot: colors.ink40 },
  };

  // Summary stats
  const allSlots = Object.values(bookings).flat();
  const bookedHours = allSlots.filter(s => s.type === "booked").reduce((sum, s) => sum + s.duration, 0);
  const availableHours = allSlots.filter(s => s.type === "available").reduce((sum, s) => sum + s.duration, 0);
  const totalSlots = allSlots.length;
  const utilPct = totalSlots > 0 ? Math.round((allSlots.filter(s => s.type === "booked").length / totalSlots) * 100) : 0;

  // Upcoming bookings for sidebar
  const upcomingBookings = [];
  weekDays.forEach((day, di) => {
    (bookings[di] || []).filter(s => s.type === "booked").forEach(s => {
      upcomingBookings.push({ ...s, day: dayNames[di], date: `${day.getDate()}. ${monthNames[day.getMonth()]}` });
    });
  });

  return (
    <>
      {/* Page title */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.02em", margin: 0 }}>
            Booking & Tilgjengelighet
          </h1>
          <p style={{ fontSize: 13, color: colors.ink40, margin: "4px 0 0" }}>
            Velg trener og administrer tilgjengelighet og bookinger
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
            background: colors.gold, color: "white", fontSize: 12.5, fontWeight: 600,
          }}>
            <span style={{ fontSize: 14 }}>+</span> Sett tilgjengelighet
          </button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 14px", borderRadius: 8, border: `1px solid ${colors.ink20}`, cursor: "pointer",
            background: "white", color: colors.ink60, fontSize: 12.5, fontWeight: 500,
          }}>
            <Icons.Export /> Eksporter uke
          </button>
        </div>
      </div>

      {/* Coach selector + stats row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        {/* Coach cards */}
        {coaches.map(c => {
          const active = selectedCoach === c.id;
          return (
            <button key={c.id} onClick={() => setSelectedCoach(c.id)} style={{
              flex: 1, display: "flex", alignItems: "center", gap: 14,
              padding: "16px 20px", borderRadius: 12, border: `2px solid ${active ? c.color : colors.ink10}`,
              background: active ? `${c.color}06` : "white", cursor: "pointer",
              transition: "all 0.2s ease", textAlign: "left",
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = colors.ink20; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = colors.ink10; e.currentTarget.style.boxShadow = "none"; }}}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${c.color}, ${c.color}CC)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 15, fontWeight: 700, flexShrink: 0,
              }}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink90 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: colors.ink40, marginBottom: 6 }}>{c.role}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {c.specialties.map(s => (
                    <span key={s} style={{
                      fontSize: 9.5, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
                      background: `${c.color}0D`, color: c.color,
                    }}>{s}</span>
                  ))}
                </div>
              </div>
              {active && (
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              )}
            </button>
          );
        })}

        {/* Quick stats */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 8, minWidth: 160,
        }}>
          {[
            { label: "Booket", value: `${bookedHours}t`, color: colors.navy, bg: `${colors.navy}08` },
            { label: "Ledig", value: `${availableHours}t`, color: colors.success, bg: colors.successLight },
            { label: "Utnyttelse", value: `${utilPct}%`, color: colors.gold, bg: `${colors.gold}12` },
          ].map(s => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 14px", borderRadius: 10, background: s.bg, flex: 1,
            }}>
              <span style={{ fontSize: 11, fontWeight: 500, color: colors.ink50, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar + upcoming sidebar */}
      <div style={{ display: "flex", gap: 14 }}>
        {/* Weekly calendar */}
        <div style={{
          flex: 1, background: "white", border: `1px solid ${colors.ink10}`,
          borderRadius: 12, overflow: "hidden",
        }}>
          {/* Calendar header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderBottom: `1px solid ${colors.ink10}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={() => setWeekOffset(w => w - 1)} style={{
                width: 30, height: 30, borderRadius: 8, border: `1px solid ${colors.ink20}`,
                background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: colors.ink50, fontSize: 16,
              }}>‹</button>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink90 }}>
                {weekDays[0].getDate()}. – {weekDays[6].getDate()}. {monthNames[weekDays[6].getMonth()]} {weekDays[6].getFullYear()}
              </span>
              <button onClick={() => setWeekOffset(w => w + 1)} style={{
                width: 30, height: 30, borderRadius: 8, border: `1px solid ${colors.ink20}`,
                background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: colors.ink50, fontSize: 16,
              }}>›</button>
              {weekOffset !== 0 && (
                <button onClick={() => setWeekOffset(0)} style={{
                  padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: colors.ink05, color: colors.ink50, fontSize: 11, fontWeight: 500,
                }}>I dag</button>
              )}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Booket", color: colors.navy },
                { label: "Ledig", color: colors.success },
                { label: "Blokkert", color: colors.ink40 },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 3, background: `${l.color}20`, border: `1.5px solid ${l.color}40` }} />
                  <span style={{ fontSize: 10, color: colors.ink40 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar grid */}
          <div style={{ display: "flex", overflow: "hidden" }}>
            {/* Time column */}
            <div style={{ width: 52, flexShrink: 0, borderRight: `1px solid ${colors.ink10}` }}>
              <div style={{ height: 44 }} /> {/* header spacer */}
              {hours.map(h => (
                <div key={h} style={{
                  height: 56, display: "flex", alignItems: "flex-start", justifyContent: "flex-end",
                  padding: "0 8px", transform: "translateY(-7px)",
                }}>
                  <span style={{ fontSize: 10, color: colors.ink40, fontVariantNumeric: "tabular-nums" }}>
                    {String(h).padStart(2, "0")}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map((day, di) => {
              const isToday = day.toDateString() === today.toDateString();
              const isWeekend = di >= 5;
              const dayBookings = bookings[di] || [];
              return (
                <div key={di} style={{
                  flex: 1, borderRight: di < 6 ? `1px solid ${colors.ink05}` : "none",
                  background: isWeekend ? colors.ink05 + "80" : "transparent",
                  position: "relative",
                }}>
                  {/* Day header */}
                  <div style={{
                    height: 44, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    borderBottom: `1px solid ${colors.ink10}`,
                    background: isToday ? `${colors.gold}08` : "transparent",
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 500, color: isToday ? colors.gold : colors.ink40, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {dayNames[di]}
                    </span>
                    <span style={{
                      fontSize: 14, fontWeight: isToday ? 700 : 500,
                      color: isToday ? colors.gold : colors.ink70,
                      ...(isToday ? { background: colors.gold, color: "white", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 } : {}),
                    }}>
                      {day.getDate()}
                    </span>
                  </div>

                  {/* Hour grid lines */}
                  <div style={{ position: "relative" }}>
                    {hours.map(h => (
                      <div key={h} style={{
                        height: 56, borderBottom: `1px solid ${colors.ink05}`,
                      }} />
                    ))}

                    {/* Booking blocks */}
                    {dayBookings.map((slot, si) => {
                      const topPx = (slot.start - 7) * 56 + 2;
                      const heightPx = slot.duration * 56 - 4;
                      const st = typeStyles[slot.type];
                      return (
                        <div key={si} style={{
                          position: "absolute", top: topPx, left: 3, right: 3,
                          height: heightPx, borderRadius: 6,
                          background: st.bg, border: `1px solid ${st.border}`,
                          padding: "4px 6px", overflow: "hidden", cursor: "pointer",
                          transition: "transform 0.1s, box-shadow 0.1s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
                        >
                          <div style={{ fontSize: 10, fontWeight: 600, color: st.color, lineHeight: 1.3 }}>
                            {slot.type === "booked" ? slot.student : slot.label}
                          </div>
                          {heightPx > 36 && (
                            <div style={{ fontSize: 9, color: `${st.color}99`, marginTop: 1 }}>
                              {`${String(slot.start).padStart(2,"0")}:00 – ${String(slot.start + slot.duration).padStart(2,"0")}:${slot.duration % 1 ? "30" : "00"}`}
                            </div>
                          )}
                          {heightPx > 52 && slot.type === "booked" && slot.program && (
                            <div style={{
                              fontSize: 8.5, fontWeight: 500, marginTop: 3,
                              padding: "1px 5px", borderRadius: 3, display: "inline-block",
                              background: `${st.color}12`, color: st.color,
                            }}>{slot.program}</div>
                          )}
                        </div>
                      );
                    })}

                    {/* "Now" line */}
                    {isToday && (() => {
                      const now = new Date();
                      const hr = now.getHours() + now.getMinutes() / 60;
                      if (hr >= 7 && hr <= 19) {
                        const top = (hr - 7) * 56;
                        return (
                          <div style={{
                            position: "absolute", top, left: 0, right: 0, height: 2,
                            background: colors.error, zIndex: 2, borderRadius: 1,
                          }}>
                            <div style={{
                              position: "absolute", left: -3, top: -3, width: 8, height: 8,
                              borderRadius: "50%", background: colors.error,
                            }} />
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right sidebar: upcoming + set availability */}
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
          {/* Coach info card */}
          <div style={{
            background: "white", border: `1px solid ${colors.ink10}`,
            borderRadius: 12, padding: 18,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `linear-gradient(135deg, ${coach.color}, ${coach.color}CC)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 14, fontWeight: 700,
              }}>{coach.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.ink90 }}>{coach.name}</div>
                <div style={{ fontSize: 11, color: colors.ink40 }}>{coach.role}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: colors.ink40, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Sett standard tilgjengelighet
            </div>
            {["Man–Fre: 08:00 – 17:00", "Lør: Etter avtale", "Søn: Stengt"].map(t => (
              <div key={t} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 0", fontSize: 12, color: colors.ink60,
              }}>
                <Icons.Clock />
                {t}
              </div>
            ))}
            <button style={{
              width: "100%", marginTop: 12, padding: "9px 0", borderRadius: 8,
              border: `1px solid ${colors.ink20}`, background: "white", cursor: "pointer",
              fontSize: 12, fontWeight: 500, color: colors.ink70,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = colors.gold; e.currentTarget.style.color = colors.gold; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = colors.ink20; e.currentTarget.style.color = colors.ink70; }}
            >
              Endre timer
            </button>
          </div>

          {/* Upcoming bookings */}
          <div style={{
            background: "white", border: `1px solid ${colors.ink10}`,
            borderRadius: 12, overflow: "hidden", flex: 1,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 18px", borderBottom: `1px solid ${colors.ink10}`,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.ink90 }}>Kommende økter</span>
              <span style={{
                fontSize: 10, fontWeight: 600, background: colors.ink05, color: colors.ink50,
                borderRadius: 999, padding: "2px 8px",
              }}>{upcomingBookings.length}</span>
            </div>
            <div style={{ padding: "6px 10px 10px", maxHeight: 380, overflowY: "auto" }}>
              {upcomingBookings.slice(0, 8).map((b, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 8px",
                  borderBottom: i < Math.min(upcomingBookings.length, 8) - 1 ? `1px solid ${colors.ink05}` : "none",
                  borderRadius: 6, cursor: "pointer", transition: "background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = colors.ink05}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: `${colors.navy}08`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: colors.navy, lineHeight: 1 }}>
                      {`${String(b.start).padStart(2, "0")}`}
                    </span>
                    <span style={{ fontSize: 8, color: colors.ink40 }}>:00</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: colors.ink80, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {b.student}
                    </div>
                    <div style={{ fontSize: 10, color: colors.ink40 }}>
                      {b.day} {b.date} · {b.duration}t
                    </div>
                  </div>
                  <span style={{
                    fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
                    background: `${colors.navy}0D`, color: colors.navy, flexShrink: 0, whiteSpace: "nowrap",
                  }}>{b.program}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{
            background: "white", border: `1px solid ${colors.ink10}`,
            borderRadius: 12, padding: 16,
          }}>
            {[
              { label: "Blokkér tid", icon: "x" },
              { label: "Legg til ledig slot", icon: "+" },
              { label: "Kopier forrige uke", icon: "=" },
            ].map(a => (
              <button key={a.label} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%",
                padding: "8px 10px", borderRadius: 8, border: `1px solid ${colors.ink10}`,
                background: "white", cursor: "pointer", marginBottom: 5,
                fontSize: 12, fontWeight: 500, color: colors.ink70,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = colors.ink20; e.currentTarget.style.background = colors.ink05; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = colors.ink10; e.currentTarget.style.background = "white"; }}
              >
                <span style={{ fontSize: 12, width: 18, textAlign: "center" }}>{a.icon}</span>
                {a.label}
                <span style={{ marginLeft: "auto", color: colors.ink30 }}><Icons.ChevronRight /></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Dashboard ───
export default function AKGolfDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  const navItems = [
    { label: "Dashboard", icon: Icons.Dashboard },
    { label: "Booking", icon: Icons.Calendar },
    { label: "Elever", icon: Icons.Students },
    { label: "Rapporter", icon: Icons.Chart },
    { label: "IUP-planer", icon: Icons.FileText },
  ];

  const kpis = [
    { title: "Aktive elever", value: "142", trend: "up", trendValue: "+8.2%", sparkData: [98, 105, 112, 118, 125, 130, 136, 142], icon: Icons.Students },
    { title: "Økter denne mnd", value: "284", trend: "up", trendValue: "+12.4%", sparkData: [180, 195, 210, 230, 245, 260, 270, 284], icon: Icons.Calendar },
    { title: "Gj.snitt HCP-red.", value: "3.2", trend: "up", trendValue: "+0.4", sparkData: [2.1, 2.4, 2.6, 2.8, 2.9, 3.0, 3.1, 3.2], icon: Icons.Target },
    { title: "Månedlig omsetning", value: "487k", trend: "up", trendValue: "+5.1%", sparkData: [380, 395, 420, 435, 448, 460, 472, 487], icon: Icons.Chart },
  ];

  const students = [
    { name: "Thomas Rasmussen", program: "Elite", hcp: "4.2", change: "-2.1", status: "Aktiv", sessions: 12, lastSession: "I dag" },
    { name: "Maria Lindberg", program: "Utviklingspakke", hcp: "11.4", change: "-3.8", status: "Aktiv", sessions: 8, lastSession: "I går" },
    { name: "Erik Solberg", program: "Grunnpakke", hcp: "18.7", change: "-1.2", status: "Aktiv", sessions: 4, lastSession: "3 dager" },
    { name: "Sofie Andersen", program: "Junior 16–17", hcp: "8.9", change: "-4.5", status: "Aktiv", sessions: 10, lastSession: "I dag" },
    { name: "Jonas Bakken", program: "Junior 13–15", hcp: "22.1", change: "-2.3", status: "Kommende", sessions: 0, lastSession: "—" },
    { name: "Kari Haugen", program: "Elite", hcp: "2.8", change: "-0.6", status: "Aktiv", sessions: 14, lastSession: "I dag" },
  ];

  const alerts = [
    { type: "warning", title: "IUP utløper snart", desc: "3 elever har IUP som utløper innen 14 dager.", time: "2t siden" },
    { type: "error", title: "Manglende oppfølging", desc: "Thomas R. har ikke hatt økt på 21 dager.", time: "5t siden" },
    { type: "info", title: "Ny påmelding", desc: "Jonas Bakken — Junior 13–15 starter 1. april.", time: "I dag" },
    { type: "success", title: "Milepæl nådd", desc: "Sofie Andersen nådde HCP < 9.0 (mål: Q1).", time: "I går" },
  ];

  const alertStyles = {
    warning: { border: colors.warning, bg: colors.warningLight, icon: <Icons.AlertTriangle />, color: "#92400E" },
    error: { border: colors.error, bg: colors.errorLight, icon: <Icons.AlertTriangle />, color: "#991B1B" },
    info: { border: colors.info, bg: colors.infoLight, icon: <Icons.Clock />, color: "#1E40AF" },
    success: { border: colors.success, bg: colors.successLight, icon: <Icons.Check />, color: "#166534" },
  };

  const programColors = {
    "Elite": colors.gold,
    "Utviklingspakke": colors.navy,
    "Grunnpakke": colors.ink50,
    "Junior 16–17": colors.junior,
    "Junior 13–15": colors.junior,
    "Junior 18–19": colors.junior,
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, system-ui, -apple-system, sans-serif", background: colors.ink05, color: colors.ink80, overflow: "hidden" }}>

      {/* ─── Sidebar ─── */}
      <aside style={{
        width: 240, background: "white", borderRight: `1px solid ${colors.ink10}`,
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10, background: colors.navy,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
              <path d="M25 85L50 15L62 50L75 15" stroke={colors.gold} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.01em" }}>AK Golf Group</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: colors.ink40, letterSpacing: "0.04em" }}>Admin Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }}>
          <div style={{ fontSize: 9, fontWeight: 600, color: colors.ink40, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
            Oversikt
          </div>
          {navItems.map(item => {
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: active ? `${colors.navy}08` : "transparent",
                  color: active ? colors.navy : colors.ink50,
                  fontSize: 13, fontWeight: active ? 600 : 450,
                  transition: "all 0.15s ease",
                  marginBottom: 2,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = colors.ink05; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <item.icon />
                {item.label}
                {item.label === "Elever" && (
                  <span style={{
                    marginLeft: "auto", fontSize: 10, fontWeight: 600,
                    background: colors.navy, color: "white", borderRadius: 999,
                    padding: "1px 7px", lineHeight: "16px",
                  }}>142</span>
                )}
              </button>
            );
          })}

          <div style={{ height: 1, background: colors.ink10, margin: "16px 8px" }} />

          <div style={{ fontSize: 9, fontWeight: 600, color: colors.ink40, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: 8 }}>
            Divisjoner
          </div>
          {[
            { label: "Academy", color: colors.navy },
            { label: "Junior Academy", color: colors.junior },
            { label: "Software", color: colors.software },
            { label: "Klubbrådgiving", color: colors.utvikling },
          ].map(d => (
            <button key={d.label} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              background: "transparent", color: colors.ink50, fontSize: 12.5, fontWeight: 450,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = colors.ink05}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
              {d.label}
            </button>
          ))}
        </nav>

        {/* Bottom user */}
        <div style={{ padding: "16px 16px", borderTop: `1px solid ${colors.ink10}` }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "8px 8px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.background = colors.ink05}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 12, fontWeight: 700,
            }}>AK</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.ink80 }}>Anders K.</div>
              <div style={{ fontSize: 10, color: colors.ink40 }}>Head Coach</div>
            </div>
            <div style={{ marginLeft: "auto", color: colors.ink30 }}><Icons.Settings /></div>
          </button>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Header */}
        <header style={{
          height: 56, background: "white", borderBottom: `1px solid ${colors.ink10}`,
          display: "flex", alignItems: "center", padding: "0 28px", flexShrink: 0, gap: 16,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: colors.ink05, borderRadius: 8, padding: "7px 14px", flex: 1, maxWidth: 380,
          }}>
            <span style={{ color: colors.ink30 }}><Icons.Search /></span>
            <span style={{ fontSize: 13, color: colors.ink40 }}>Søk elever, programmer, rapporter...</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              background: colors.gold, color: "white", fontSize: 12.5, fontWeight: 600,
            }}>
              <span style={{ fontSize: 14 }}>+</span> Ny elev
            </button>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 8, border: `1px solid ${colors.ink20}`, cursor: "pointer",
              background: "white", color: colors.ink60, fontSize: 12.5, fontWeight: 500,
            }}>
              <Icons.Export /> Eksporter
            </button>
            <div style={{ width: 1, height: 24, background: colors.ink10, margin: "0 4px" }} />
            <button style={{
              position: "relative", width: 36, height: 36, borderRadius: 8, border: "none",
              background: "transparent", cursor: "pointer", color: colors.ink50,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icons.Bell />
              <span style={{
                position: "absolute", top: 6, right: 6, width: 7, height: 7,
                borderRadius: "50%", background: colors.error, border: "2px solid white",
              }} />
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: `linear-gradient(135deg, ${colors.navy}, ${colors.navyLight})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>AK</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: activeNav === "Booking" ? 0 : "24px 28px 40px" }}>

          {activeNav === "Booking" ? (
            <BookingView />
          ) : (
          <>
          {/* Page title */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.02em", margin: 0 }}>
                Dashboard
              </h1>
              <p style={{ fontSize: 13, color: colors.ink40, margin: "4px 0 0" }}>
                Sanntidsoversikt over elever, økter og resultater
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {["7D", "30D", "90D", "12M"].map((p, i) => (
                <button key={p} style={{
                  padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                  background: i === 1 ? colors.navy : "transparent",
                  color: i === 1 ? "white" : colors.ink50,
                  fontSize: 11.5, fontWeight: 600, transition: "all 0.15s",
                }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Row */}
          <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
            {kpis.map(kpi => <KPICard key={kpi.title} {...kpi} />)}
          </div>

          {/* Charts Row */}
          <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
            {/* Revenue chart */}
            <div style={{
              flex: 2, background: "white", border: `1px solid ${colors.ink10}`,
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: colors.ink40, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
                    Omsetningsutvikling
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: colors.ink90, letterSpacing: "-0.02em" }}>
                    kr 487 000 <span style={{ fontSize: 12, fontWeight: 500, color: colors.success }}>+5.1%</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {[
                    { label: "Omsetning", color: colors.gold },
                    { label: "Mål", color: colors.ink20 },
                  ].map(l => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 8, height: 3, borderRadius: 2, background: l.color }} />
                      <span style={{ fontSize: 10, color: colors.ink40 }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <AreaChart
                data={[280, 310, 340, 365, 385, 410, 435, 448, 460, 472, 480, 487]}
                color={colors.gold}
                labels={["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]}
              />
            </div>

            {/* Retention donut + program bars */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Retention */}
              <div style={{
                background: "white", border: `1px solid ${colors.ink10}`,
                borderRadius: 12, padding: 20, flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: colors.ink40, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, alignSelf: "flex-start" }}>
                  Elevretensjon
                </div>
                <DonutChart value={92} total={100} color={colors.gold} size={110} label="beholdt" />
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink90 }}>131</div>
                    <div style={{ fontSize: 9, color: colors.ink40, textTransform: "uppercase", letterSpacing: "0.06em" }}>Beholdt</div>
                  </div>
                  <div style={{ width: 1, background: colors.ink10 }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink90 }}>11</div>
                    <div style={{ fontSize: 9, color: colors.ink40, textTransform: "uppercase", letterSpacing: "0.06em" }}>Avsluttet</div>
                  </div>
                </div>
              </div>

              {/* Program distribution */}
              <div style={{
                background: "white", border: `1px solid ${colors.ink10}`,
                borderRadius: 12, padding: 20, flex: 1,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: colors.ink40, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  Per program
                </div>
                <BarChart
                  data={[38, 52, 28, 24]}
                  labels={["Elite", "Utv.", "Grunn", "Junior"]}
                  color={colors.navy}
                  height={130}
                />
              </div>
            </div>
          </div>

          {/* Bottom row: Table + Alerts */}
          <div style={{ display: "flex", gap: 14 }}>
            {/* Student table */}
            <div style={{
              flex: 2, background: "white", border: `1px solid ${colors.ink10}`,
              borderRadius: 12, overflow: "hidden",
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "16px 20px", borderBottom: `1px solid ${colors.ink10}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors.ink90 }}>Elevoversikt</span>
                  <span style={{ fontSize: 10, fontWeight: 600, background: colors.ink05, color: colors.ink50, borderRadius: 999, padding: "2px 8px" }}>
                    {students.length} elever
                  </span>
                </div>
                <button style={{
                  fontSize: 12, fontWeight: 500, color: colors.navy, background: "transparent",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
                }}>
                  Se alle <Icons.ChevronRight />
                </button>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${colors.ink10}` }}>
                    {["Elev", "Program", "HCP", "Endring", "Økter", "Sist aktiv", "Status", ""].map(h => (
                      <th key={h} style={{
                        padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 600,
                        color: colors.ink40, letterSpacing: "0.06em", textTransform: "uppercase",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, i) => (
                    <tr key={s.name} style={{
                      borderBottom: i < students.length - 1 ? `1px solid ${colors.ink05}` : "none",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.ink05}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: `${programColors[s.program] || colors.ink40}12`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 700, color: programColors[s.program] || colors.ink60,
                          }}>
                            {s.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 550, color: colors.ink80 }}>{s.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 6,
                          background: `${programColors[s.program] || colors.ink40}10`,
                          color: programColors[s.program] || colors.ink60,
                        }}>
                          {s.program}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: colors.ink80 }}>{s.hcp}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: colors.success }}>{s.change}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: colors.ink60 }}>{s.sessions}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: colors.ink40 }}>{s.lastSession}</td>
                      <td style={{ padding: "12px 16px" }}><StatusBadge status={s.status} /></td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{
                          background: "transparent", border: "none", cursor: "pointer",
                          color: colors.ink30, display: "flex", alignItems: "center",
                        }}>
                          <Icons.Eye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Alerts sidebar */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Alerts */}
              <div style={{
                background: "white", border: `1px solid ${colors.ink10}`,
                borderRadius: 12, overflow: "hidden", flex: 1,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 18px", borderBottom: `1px solid ${colors.ink10}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.ink90 }}>Varsler</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, background: colors.error, color: "white",
                      borderRadius: 999, padding: "1px 6px", lineHeight: "16px",
                    }}>4</span>
                  </div>
                  <span style={{ fontSize: 11, color: colors.navy, fontWeight: 500, cursor: "pointer" }}>Se alle</span>
                </div>

                <div style={{ padding: "6px 12px 12px" }}>
                  {alerts.map((a, i) => {
                    const s = alertStyles[a.type];
                    return (
                      <div key={i} style={{
                        display: "flex", gap: 10, padding: "12px 8px",
                        borderBottom: i < alerts.length - 1 ? `1px solid ${colors.ink05}` : "none",
                        borderRadius: 8, cursor: "pointer", transition: "background 0.1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = colors.ink05}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                          background: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                          color: s.color,
                        }}>
                          {s.icon}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: colors.ink80, marginBottom: 2 }}>{a.title}</div>
                          <div style={{ fontSize: 11.5, color: colors.ink50, lineHeight: 1.4 }}>{a.desc}</div>
                          <div style={{ fontSize: 10, color: colors.ink40, marginTop: 4 }}>{a.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div style={{
                background: "white", border: `1px solid ${colors.ink10}`,
                borderRadius: 12, padding: 18,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: colors.ink40, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
                  Hurtighandlinger
                </div>
                {[
                  { label: "Opprett IUP-plan", color: colors.gold },
                  { label: "Registrer økt", color: colors.navy },
                  { label: "Send rapport", color: colors.ink60 },
                ].map(a => (
                  <button key={a.label} style={{
                    display: "flex", alignItems: "center", gap: 8, width: "100%",
                    padding: "9px 12px", borderRadius: 8, border: `1px solid ${colors.ink10}`,
                    background: "white", cursor: "pointer", marginBottom: 6,
                    fontSize: 12.5, fontWeight: 500, color: colors.ink70,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = colors.ink20; e.currentTarget.style.background = colors.ink05; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = colors.ink10; e.currentTarget.style.background = "white"; }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: a.color }} />
                    {a.label}
                    <span style={{ marginLeft: "auto", color: colors.ink30 }}><Icons.ChevronRight /></span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          </>
          )}
        </main>
      </div>
    </div>
  );
}
