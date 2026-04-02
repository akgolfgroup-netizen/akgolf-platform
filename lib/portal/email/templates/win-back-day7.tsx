import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Preview,
  Button,
} from "@react-email/components";

interface WinBackDay7Props {
  name: string;
  totalSessions: number;
  bestStreak: number;
}

export function WinBackDay7Email({ name, totalSessions, bestStreak }: WinBackDay7Props) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Din streak venter pa deg!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Din treningsreise venter</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Det er en uke siden du logget trening. Vi vet at livet kan komme i
            veien, men vi er her for a hjelpe deg tilbake pa sporet.
          </Text>

          <Section style={statsBox}>
            <Text style={statsTitle}>Din historie sa langt:</Text>
            <Text style={statLine}>
              <strong>{totalSessions}</strong> treningsokter logget
            </Text>
            {bestStreak > 0 && (
              <Text style={statLine}>
                <strong>{bestStreak}</strong> dager var din beste streak
              </Text>
            )}
          </Section>

          <Text style={text}>
            Tenk pa alt du har investert i golfspillet ditt. En liten okt i dag
            kan starte en ny streak!
          </Text>

          <Section style={tipBox}>
            <Text style={tipTitle}>Tips for a komme i gang igjen:</Text>
            <Text style={tipText}>
              Start med en kort okt (15-20 min) for a bygge momentum. Bruk
              &quot;Gjenta siste&quot; for a logge raskt.
            </Text>
          </Section>

          <Button style={button} href="https://akgolf.no/portal/dagbok">
            Start en ny streak
          </Button>

          <Hr style={hr} />

          <Text style={footer}>
            AK Golf Academy — Gamle Fredrikstad Golfklubb
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#f6f6f6",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "#1D1D1F",
  fontSize: "24px",
  fontWeight: "700" as const,
  margin: "0 0 24px",
};

const greeting = {
  color: "#333",
  fontSize: "16px",
  margin: "0 0 8px",
};

const text = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const statsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const statsTitle = {
  color: "#1D1D1F",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const statLine = {
  color: "#555",
  fontSize: "14px",
  margin: "0 0 4px",
};

const tipBox = {
  backgroundColor: "#EFF6FF",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const tipTitle = {
  color: "#1E40AF",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const tipText = {
  color: "#1E40AF",
  fontSize: "14px",
  margin: "0",
};

const button = {
  backgroundColor: "#1D1D1F",
  borderRadius: "980px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "24px 0 0",
};
