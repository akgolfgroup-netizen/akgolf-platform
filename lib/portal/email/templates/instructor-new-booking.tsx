import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Preview,
} from "@react-email/components";

interface InstructorNewBookingProps {
  instructorName: string;
  studentName: string;
  studentEmail: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
}

export function InstructorNewBookingEmail({
  instructorName,
  studentName,
  studentEmail,
  serviceName,
  date,
  time,
  duration,
}: InstructorNewBookingProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Ny booking: {studentName} — {serviceName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Ny booking</Heading>
          <Text style={text}>Hei {instructorName},</Text>
          <Text style={text}>Du har fått en ny booking:</Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Elev:</strong> {studentName} ({studentEmail})
            </Text>
            <Text style={detailRow}>
              <strong>Tjeneste:</strong> {serviceName}
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
          </Section>

          <Text style={text}>
            Se alle bookinger i{" "}
            <a href="https://akgolf.no/portal/admin/kalender" style={link}>
              admin-kalenderen
            </a>
            .
          </Text>

          <Text style={footer}>AK Golf Academy</Text>
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

const link = {
  color: "#B8975C",
  textDecoration: "underline",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "24px 0 0",
};
