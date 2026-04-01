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

interface MonthlyResetNotificationProps {
  studentName: string;
  packageName: string;
  sessionsUsed: number;
  sessionsTotal: number;
  unusedSessions: number;
  newPeriodStart: string;
  newPeriodEnd: string;
}

export function MonthlyResetNotificationEmail({
  studentName,
  packageName,
  sessionsUsed,
  sessionsTotal,
  unusedSessions,
  newPeriodStart,
  newPeriodEnd,
}: MonthlyResetNotificationProps) {
  const unusedLabel = unusedSessions === 1 ? "okt" : "okter";

  return (
    <Html lang="nb">
      <Head />
      <Preview>
        {`Ny periode startet — ${String(unusedSessions)} ubrukte ${unusedLabel} forrige periode`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Ny treningsperiode</Heading>
          <Text style={greeting}>Hei {studentName},</Text>
          <Text style={text}>
            Din forrige periode for <strong>{packageName}</strong> er avsluttet.
            Her er oppsummeringen:
          </Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Okter brukt:</strong> {String(sessionsUsed)} av{" "}
              {String(sessionsTotal)}
            </Text>
            <Text style={detailRow}>
              <strong>Ubrukte okter:</strong> {String(unusedSessions)}
            </Text>
            <Text style={detailRow}>
              <strong>Ny periode:</strong> {newPeriodStart} — {newPeriodEnd}
            </Text>
          </Section>

          {unusedSessions > 0 && (
            <Text style={warningText}>
              Du hadde {String(unusedSessions)} ubrukte {unusedLabel} forrige
              periode. Ubrukte okter overfores ikke til neste periode. Book
              gjerne tidlig for a sikre deg plass!
            </Text>
          )}

          <Button style={button} href="https://akgolf.no/portal/bookinger">
            Book din neste okt
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
  color: "#1D1D1F",
  fontSize: "16px",
  margin: "0 0 8px",
};

const text = {
  color: "#555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const warningText = {
  color: "#1D1D1F",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
  backgroundColor: "#F5F5F7",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #E8E8ED",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "6px",
  padding: "16px",
  margin: "0 0 16px",
};

const detailRow = {
  color: "#1D1D1F",
  fontSize: "14px",
  margin: "0 0 6px",
  lineHeight: "1.5",
};

const button = {
  backgroundColor: "#1D1D1F",
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
