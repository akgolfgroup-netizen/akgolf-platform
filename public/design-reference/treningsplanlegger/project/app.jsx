/* Main App — Treningsplanlegger Dashboard */

const TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "useColors": true,
  "density": "comfortable",
  "sidePanelOpen": true,
  "view": "uke",
  "state": "rich"
}/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAKS);
  const [view, setView] = React.useState(tweaks.view || "uke");
  const [sidePanelOpen, setSidePanelOpen] = React.useState(tweaks.sidePanelOpen);
  const [dropTarget, setDropTarget] = React.useState(null);
  const [periode, setPeriode] = React.useState("uke");

  React.useEffect(() => { setView(tweaks.view); }, [tweaks.view]);
  React.useEffect(() => { setSidePanelOpen(tweaks.sidePanelOpen); }, [tweaks.sidePanelOpen]);

  const theme = tweaks.theme;
  const T = useTheme(theme);
  const useColors = tweaks.useColors;
  const density = tweaks.density;
  const isEmpty = tweaks.state === "empty";

  return (
    <div data-screen-label="Treningsplanlegger Dashboard" style={{
      minHeight: "100vh", background: T.bg, color: T.text, ...akFont,
      display: "flex", flexDirection: "column",
    }}>
      <TopBar theme={theme} setTheme={(t) => setTweaks({ theme: t })}
        density={density} setDensity={(d) => setTweaks({ density: d })}
        sidePanelOpen={sidePanelOpen}
        setSidePanelOpen={(v) => { setSidePanelOpen(v); setTweaks({ sidePanelOpen: v }); }} />

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <LeftRail theme={theme} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
          <PageHeader theme={theme}
            view={view} setView={(v) => { setView(v); setTweaks({ view: v }); }}
            periode={periode} setPeriode={setPeriode} />

          <div style={{ padding: "0 24px 24px", flex: 1, overflowY: "auto" }}>
            {isEmpty ? (
              <EmptyState theme={theme} />
            ) : (
              <>
                <KpiRow theme={theme} />

                {view === "uke" && (
                  <WeekView theme={theme} density={density} useColors={useColors}
                    dropTarget={dropTarget} setDropTarget={setDropTarget} />
                )}
                {view === "dag" && (
                  <DayView theme={theme} useColors={useColors} />
                )}
                {view === "pyramide" && (
                  <PyramidView theme={theme} useColors={useColors} />
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 16 }}>
                  <CoachPanel theme={theme} />
                  <MaalPanel theme={theme} />
                  <LoggPanel theme={theme} useColors={useColors} />
                </div>
              </>
            )}
          </div>
        </div>

        <SidePanel theme={theme} useColors={useColors} open={sidePanelOpen}
          onClose={() => { setSidePanelOpen(false); setTweaks({ sidePanelOpen: false }); }} />
      </div>

      <TweaksPanel title="Tweaks" defaultPosition={{ right: 20, bottom: 20 }}>
        <TweakSection title="Tema">
          <TweakRadio
            label="Mørk / lys" value={tweaks.theme}
            options={[{ value: "dark", label: "Mørk" }, { value: "light", label: "Lys" }]}
            onChange={(v) => setTweaks({ theme: v })} />
          <TweakToggle label="Pyramide-farger" checked={tweaks.useColors}
            onChange={(v) => setTweaks({ useColors: v })} />
        </TweakSection>
        <TweakSection title="Layout">
          <TweakRadio
            label="Visning" value={tweaks.view}
            options={[
              { value: "uke", label: "Uke" },
              { value: "dag", label: "Dag" },
              { value: "pyramide", label: "Pyramide" },
            ]}
            onChange={(v) => setTweaks({ view: v })} />
          <TweakRadio
            label="Tetthet" value={tweaks.density}
            options={[
              { value: "compact", label: "Kompakt" },
              { value: "comfortable", label: "Komfortabel" },
            ]}
            onChange={(v) => setTweaks({ density: v })} />
          <TweakToggle label="Sidemeny synlig" checked={tweaks.sidePanelOpen}
            onChange={(v) => setTweaks({ sidePanelOpen: v })} />
        </TweakSection>
        <TweakSection title="Tilstand">
          <TweakRadio
            label="Data" value={tweaks.state}
            options={[
              { value: "rich", label: "Magnus' uke" },
              { value: "empty", label: "Tom / onboarding" },
            ]}
            onChange={(v) => setTweaks({ state: v })} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
