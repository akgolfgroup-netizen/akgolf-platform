import { Users } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div
      className="rounded-2xl p-10 text-center"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="mx-auto mb-4 grid place-items-center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "rgba(209,248,67,0.15)",
          color: "#D1F843",
        }}
      >
        <Users className="w-7 h-7" />
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 4,
        }}
      >
        Ingen sammenligning klar
      </p>
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.6)",
          maxWidth: 360,
          margin: "0 auto",
          lineHeight: 1.55,
        }}
      >
        {message}
      </p>
    </div>
  );
}
