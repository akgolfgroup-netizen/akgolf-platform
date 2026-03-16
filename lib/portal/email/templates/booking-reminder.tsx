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

interface BookingReminderProps {
  studentName: string;
  serviceName: string;
  instructorName: string;
  date: string;
  time: string;
  duration: number;
  location: string;
}

export function BookingReminderEmail({
  studentName,
  serviceName,
  instructorName,
  date,
  time,
  duration,
  location,
}: BookingReminderProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Paminnelse: {serviceName} i morgen kl. {time}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Paminnelse om din booking</Heading>
          <Text style={greeting}>Hei {studentName},</Text>
          <Text style={text}>
            Dette er en paminnelse om din kommende okt hos AK Golf:
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
            <Text style={detailRow}>
              <strong>Varighet:</strong> {duration} min
            </Text>
            <Text style={detailRow}>
              <strong>Sted:</strong> {location}
            </Text>
          </Section>

          <Button style={button} href="https://akgolf.no/portal/bookinger">
            Se bookingdetaljer
          </Button>

          <Hr style={hr} />

          <Text style={smallText}>
            Trenger du a endre eller avbestille? Gjor dette via spillerportalen
            minst 24 timer for okten for full refusjon.
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
  lineHeight: "1.5",
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
  backgroundColor: "#B8975C",
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "24px 0 0",
};
