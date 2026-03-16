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

interface WelcomeNewUserProps {
  name: string;
  email: string;
  tempPassword: string;
  serviceName: string;
  instructorName: string;
  date: string;
  time: string;
  duration: number;
  price: string;
  location: string;
}

export function WelcomeNewUserEmail({
  name,
  email,
  tempPassword,
  serviceName,
  instructorName,
  date,
  time,
  duration,
  price,
  location,
}: WelcomeNewUserProps) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>
        Velkommen til AK Golf — din konto er opprettet
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Velkommen til AK Golf!</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Vi har opprettet en spillerkonto til deg i forbindelse med din
            booking. Med denne kontoen kan du se bookinger, treningsplaner og
            coaching-notater.
          </Text>

          <Section style={credentialsBox}>
            <Heading as="h3" style={subHeading}>
              Dine innloggingsdetaljer
            </Heading>
            <Text style={detailRow}>
              <strong>E-post:</strong> {email}
            </Text>
            <Text style={detailRow}>
              <strong>Midlertidig passord:</strong> {tempPassword}
            </Text>
            <Text style={smallText}>
              Vi anbefaler at du bytter passord etter første innlogging.
            </Text>
          </Section>

          <Button style={button} href="https://akgolf.no/portal">
            Logg inn på spillerportalen
          </Button>

          <Hr style={hr} />

          <Heading as="h3" style={subHeading}>
            Din booking
          </Heading>
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
            <Text style={detailRow}>
              <strong>Betalt:</strong> {price}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Har du sporsmal? Svar pa denne e-posten eller kontakt oss pa{" "}
            <a href="mailto:post@akgolf.no" style={link}>
              post@akgolf.no
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

const subHeading = {
  color: "#0F2942",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
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
  margin: "8px 0 0",
};

const credentialsBox = {
  backgroundColor: "#0F2942",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
  color: "#ffffff",
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

const link = {
  color: "#B8975C",
  textDecoration: "underline",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "24px 0 0",
};
