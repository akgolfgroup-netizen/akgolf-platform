/* Compose the full Spillerportal dashboard */

function App() {
  // Persist last-used theme + period across reloads for iterative design
  const [theme, setTheme] = React.useState(() => localStorage.getItem("ak.theme") || "light");
  const [period, setPeriod] = React.useState(() => localStorage.getItem("ak.period") || "Uke");
  React.useEffect(() => { localStorage.setItem("ak.theme", theme); }, [theme]);
  React.useEffect(() => { localStorage.setItem("ak.period", period); }, [period]);

  const T = useT(theme);
  const fg = theme === "light" ? C.lightText : C.white;

  return (
    <div data-screen-label="Spillerportal Dashboard" style={{
      minHeight: "100vh", background: T.bg, color: fg, overflow: "hidden", ...font,
    }}>
      <TopNav theme={theme} setTheme={setTheme} activeTab="Hjem" />

      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto" }}>
        <Sidebar theme={theme} />

        <div style={{ flex: 1, padding: "20px 24px 40px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-.01em", ...font }}>Hei, Magnus</h1>
            <UtilityRow theme={theme} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr 1fr 240px",
            gridTemplateRows: "auto auto",
            gap: 14,
          }}>
            <ActivitiesCard theme={theme} period={period} setPeriod={setPeriod} />
            <HandicapCard theme={theme} />
            <TrackmanCard theme={theme} />
            <HeroCard theme={theme} />
            <PuttingCard theme={theme} />
            <TrainingStatusCard theme={theme} />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr 1fr 240px",
            gap: 14, marginTop: 14,
          }}>
            <SleepScoreCard theme={theme} />
            <ScoreAnalysisCard theme={theme} />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
