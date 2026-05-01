/* 3D iPhone mockup that tilts based on scroll + cursor. */

function PhoneMockup({ screenKey = "dashboard", tiltEnabled = true, scrollTilt = 0, accent = "#D1F843" }) {
  const ref = React.useRef(null);
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!tiltEnabled) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      setMouse({
        x: (e.clientX - cx) / (r.width / 2),
        y: (e.clientY - cy) / (r.height / 2),
      });
    };
    const onLeave = () => setMouse({ x: 0, y: 0 });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [tiltEnabled]);

  // scrollTilt is a 0..1 value from the landing that we turn into rotation
  // default idle pose: slight lean away from viewer + to the right
  const baseY = -18;
  const baseX = 8;
  const rotY = tiltEnabled ? baseY + mouse.x * 8 - scrollTilt * 12 : baseY;
  const rotX = tiltEnabled ? baseX - mouse.y * 6 - scrollTilt * 8 : baseX;

  // pick the screen
  let Screen = DashboardScreen;
  if (screenKey === "trackman") Screen = TrackmanScreen;
  if (screenKey === "sleep")    Screen = SleepScreen;
  if (screenKey === "handicap") Screen = HandicapScreen;

  return (
    <div
      ref={ref}
      style={{
        perspective: 1800,
        perspectiveOrigin: "50% 50%",
        display: "inline-block",
        filter: `drop-shadow(0 60px 80px rgba(0,0,0,0.55)) drop-shadow(0 0 60px ${accent}22)`,
      }}
    >
      <div
        style={{
          width: 340,
          height: 700,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(-2deg)`,
          transition: "transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          willChange: "transform",
        }}
      >
        {/* edge / side (back-depth effect) */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 52,
          background: "linear-gradient(135deg, #2a2a2e 0%, #0c0c0e 40%, #2a2a2e 100%)",
          transform: "translateZ(-8px)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }} />

        {/* body */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 52,
          background: "linear-gradient(135deg, #3a3a3e 0%, #1a1a1c 25%, #0a0a0c 60%, #2d2d31 100%)",
          padding: 6,
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}>
          {/* inner screen */}
          <div style={{
            position: "absolute", inset: 6, borderRadius: 46,
            background: "#000",
            overflow: "hidden",
            boxShadow: "inset 0 0 0 2px #000",
          }}>
            {/* dynamic island */}
            <div style={{
              position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
              width: 110, height: 32, borderRadius: 20, background: "#000",
              zIndex: 10, border: "1px solid #0a0a0a",
            }} />

            {/* screen content */}
            <Screen />

            {/* glare */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(115deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 72%, rgba(255,255,255,0.06) 100%)`,
              mixBlendMode: "overlay",
            }} />
          </div>

          {/* side buttons */}
          <div style={{ position: "absolute", left: -2, top: 150, width: 3, height: 32, borderRadius: 2, background: "#1a1a1c" }} />
          <div style={{ position: "absolute", left: -2, top: 200, width: 3, height: 58, borderRadius: 2, background: "#1a1a1c" }} />
          <div style={{ position: "absolute", left: -2, top: 275, width: 3, height: 58, borderRadius: 2, background: "#1a1a1c" }} />
          <div style={{ position: "absolute", right: -2, top: 230, width: 3, height: 90, borderRadius: 2, background: "#1a1a1c" }} />
        </div>

        {/* highlight rim */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 52,
          pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 78%, rgba(255,255,255,0.1) 100%)",
          mixBlendMode: "screen",
        }} />
      </div>
    </div>
  );
}

Object.assign(window, { PhoneMockup });
