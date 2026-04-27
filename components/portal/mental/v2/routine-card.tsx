import { Eye, Brain, Zap, Hand, Play } from "lucide-react";

const STEPS = [
  { num: 1, icon: Eye, name: "Pust + se mål", dur: "3 sek" },
  { num: 2, icon: Brain, name: "Visualiser ballbanen", dur: "4 sek" },
  { num: 3, icon: Zap, name: "Trigger-ord", dur: "1 sek" },
  { num: 4, icon: Hand, name: "Practice-sving", dur: "3 sek" },
  { num: 5, icon: Play, name: "Step in & commit", dur: "3 sek" },
];

export function RoutineCard() {
  return (
    <section
      className="rounded-2xl mb-6"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "22px 24px",
      }}
    >
      <div className="flex justify-between items-start gap-4 mb-4.5">
        <div>
          <h4
            style={{
              margin: 0,
              marginBottom: 4,
              color: "#fff",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            Pre-shot routine ·{" "}
            <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>
              5 steg · 14 sek
            </span>
          </h4>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            En enkel rutine du kan øve på range og bruke under runde.
          </div>
        </div>
      </div>

      <div
        className="grid gap-2.5 relative"
        style={{ gridTemplateColumns: "repeat(5, 1fr)", marginTop: 16 }}
      >
        <div
          className="absolute"
          style={{
            top: 28,
            left: "8%",
            right: "8%",
            height: 2,
            background: "rgba(255,255,255,0.06)",
            zIndex: 0,
          }}
        />
        {STEPS.map(({ num, icon: Icon, name, dur }) => (
          <div
            key={num}
            className="rounded-xl flex flex-col items-center text-center relative"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              padding: "14px 14px 16px",
              zIndex: 1,
            }}
          >
            <div
              className="grid place-items-center mb-2.5"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#D1F843",
                color: "#0A1F18",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 14,
                fontWeight: 800,
                boxShadow: "0 0 0 4px #0F2E23",
              }}
            >
              {num}
            </div>
            <Icon
              className="w-5 h-5 mb-1.5"
              style={{ color: "rgba(255,255,255,0.85)" }}
            />
            <div
              style={{
                fontSize: 13,
                color: "#fff",
                fontWeight: 600,
                lineHeight: 1.3,
              }}
            >
              {name}
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {dur}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
