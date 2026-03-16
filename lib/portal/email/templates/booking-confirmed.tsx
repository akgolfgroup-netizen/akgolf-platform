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

interface BookingConfirmedProps {
  studentName: string;
  serviceName: string;
  instructorName: string;
  date: string; // formatted, e.g. "torsdag 14. mars 2026"
  time: string; // e.g. "10:00"
  duration: number; // minutes
  price: string; // formatted, e.g. "kr 995"
  vatAmount: string; // formatted, e.g. "kr 0" or "kr 199"
  location: string;
}

export function BookingConfirmedEmail({
  studentName,
  serviceName,
  instructorName,
  date,
  time,
  duration,
  price,
  vatAmount,
  location,
}: BookingConfirmedProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Bookingbekreftelse — {serviceName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Booking bekreftet</Heading>
          <Text style={greeting}>Hei {studentName},</Text>
          <Text style={text}>
            Din booking hos AK Golf er bekreftet. Her er detaljene:
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

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Betalt:</strong> {price}
            </Text>
            <Text style={detailRow}>
              <strong>Herav MVA:</strong> {vatAmount}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Trenger du å endre eller avbestille? Logg inn på{" "}
            <a href="https://akgolf.no/portal/bookinger" style={link}>
              spillerportalen
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
