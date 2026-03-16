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
} from "@react-email/components";

interface BookingCancelledProps {
  studentName: string;
  serviceName: string;
  instructorName: string;
  date: string;
  time: string;
  refundInfo: string; // e.g. "Full refusjon (kr 995)" or "Ingen refusjon"
  policyReason: string;
}

export function BookingCancelledEmail({
  studentName,
  serviceName,
  instructorName,
  date,
  time,
  refundInfo,
  policyReason,
}: BookingCancelledProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Avbestillingsbekreftelse — {serviceName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Booking avbestilt</Heading>
          <Text style={greeting}>Hei {studentName},</Text>
          <Text style={text}>
            Din booking er avbestilt. Her er detaljene:
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

          <Section style={refundBox}>
            <Text style={detailRow}>
              <strong>Refusjon:</strong> {refundInfo}
            </Text>
            <Text style={smallText}>{policyReason}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Onsker du a booke en ny time? Besok{" "}
            <a href="https://akgolf.no" style={link}>
              akgolf.no
            </a>
            .
          </Text>

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

const smallText = {
  color: "#888",
  fontSize: "12px",
  lineHeight: "1.4",
  margin: "4px 0 0",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
};

const refundBox = {
  backgroundColor: "#fef3c7",
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const link = {
  color: "#B8975C",
  textDecoration: "underline",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "24px 0 0",
};
