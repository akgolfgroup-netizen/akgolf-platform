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

interface WaitlistAvailableProps {
  studentName: string;
  serviceName: string;
  instructorName: string;
  date: string;
  time: string;
  expiresAt: string;
}

export function WaitlistAvailableEmail({
  studentName,
  serviceName,
  instructorName,
  date,
  time,
  expiresAt,
}: WaitlistAvailableProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Plass ledig! {serviceName} — {date}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Plass ledig!</Heading>
          <Text style={greeting}>Hei {studentName},</Text>
          <Text style={text}>
            Gode nyheter! En plass har blitt ledig for okten du sto pa
            venteliste for:
          </Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Tjeneste:</strong> {serviceName}
            </Text>
            <Text style={detailRow}>
              <strong>Trener:</strong> {instructorName}
            </Text>
            <Text style={detailRow}>
              <strong>Dato:</strong> {date}
            </Text>
            <Text style={detailRow}>
              <strong>Tidspunkt:</strong> {time}
            </Text>
          </Section>

          <Button style={button} href="https://akgolf.no">
            Book plassen na
          </Button>

          <Section style={warningBox}>
            <Text style={warningText}>
              Denne plassen er reservert for deg til {expiresAt}. Etter det
              tilbys den til neste person pa ventelisten.
            </Text>
          </Section>

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
  color: "#0F2942",
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

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
};

const detailRow = {
  color: "#333",
  fontSize: "14px",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const button = {
  backgroundColor: "#22c55e",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "0 0 16px",
};

const warningBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "0 0 16px",
};

const warningText = {
  color: "#92400e",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0",
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
