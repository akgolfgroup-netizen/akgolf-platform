"use client";

// Root error boundary — inline styles required (CSS may not be loaded).
// Colors mirror design tokens: ink-100, ink-05, ink-50, gold.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="nb">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F5F7",
          color: "#1D1D1F",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "1.5rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
          Noe gikk galt
        </h1>
        <p style={{ color: "#6B7B8D", maxWidth: "28rem", marginBottom: "2rem" }}>
          Beklager, det oppstod en kritisk feil. Prøv å laste siden på nytt.
        </p>
        <button
          onClick={reset}
          style={{
            background: "#1D1D1F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "9999px",
            padding: "0.875rem 2rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.9375rem",
          }}
        >
          Last siden på nytt
        </button>
      </body>
    </html>
  );
}
