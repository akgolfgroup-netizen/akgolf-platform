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
  Row,
  Column,
} from "@react-email/components";

interface WeeklySummaryProps {
  name: string;
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  currentStreak: number;
  totalMinutes: number;
  topFocusArea: string | null;
}

export function WeeklySummaryEmail({
  name,
  sessionsThisWeek,
  sessionsLastWeek,
  currentStreak,
  totalMinutes,
  topFocusArea,
}: WeeklySummaryProps) {
  const sessionDiff = sessionsThisWeek - sessionsLastWeek;
  const sessionTrend =
    sessionDiff > 0 ? `+${sessionDiff}` : sessionDiff < 0 ? String(sessionDiff) : "0";
  const trendColor = sessionDiff >= 0 ? "#16a34a" : "#dc2626";

  return (
    <Html lang="nb">
      <Head />
      <Preview>Din ukentlige treningsoversikt fra AK Golf</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Ukens treningsoversikt</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Her er en oppsummering av treningsaktiviteten din denne uken.
          </Text>

          {/* Stats Grid */}
          <Section style={statsContainer}>
            <Row>
              <Column style={statBox}>
                <Text style={statValue}>{sessionsThisWeek}</Text>
                <Text style={statLabel}>okter denne uken</Text>
                <Text style={{ ...statTrend, color: trendColor }}>
                  {sessionTrend} fra forrige uke
                </Text>
              </Column>
              <Column style={statBox}>
                <Text style={statValue}>{currentStreak}</Text>
                <Text style={statLabel}>
                  {currentStreak === 1 ? "dag" : "dager"} streak
                </Text>
                {currentStreak >= 7 && (
                  <Text style={{ ...statTrend, color: "#16a34a" }}>
                    Imponerende!
                  </Text>
                )}
              </Column>
            </Row>
            <Row>
              <Column style={statBox}>
                <Text style={statValue}>{Math.round(totalMinutes / 60)}t</Text>
                <Text style={statLabel}>total treningstid</Text>
              </Column>
              <Column style={statBox}>
                <Text style={statValue}>{topFocusArea || "-"}</Text>
                <Text style={statLabel}>mest trent omrade</Text>
              </Column>
            </Row>
          </Section>

          {sessionsThisWeek === 0 ? (
            <Section style={ctaBox}>
              <Text style={ctaText}>
                Du har ikke logget noen okter denne uken. Kom i gang igjen for a
                holde momentum!
              </Text>
              <Button style={button} href="https://akgolf.no/portal/dagbok">
                Logg din neste okt
              </Button>
            </Section>
          ) : (
            <Button style={button} href="https://akgolf.no/portal/dagbok">
              Se full oversikt i portalen
            </Button>
          )}

          <Hr style={hr} />

          <Text style={text}>
            Tips: Regelmessig trening er nokkel til forbedring. Prov a sette et
            mal om minst 3 okter per uke!
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
  backgroundColor: "#f5f5f5",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
};

const container = {
  backgroundColor: "white",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const heading = {
  color: "black",
  fontSize: "24px",
  fontWeight: "700" as const,
  margin: "0 0 24px",
};

const greeting = {
  color: "#333333",
  fontSize: "16px",
  margin: "0 0 8px",
};

const text = {
  color: "#555555",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const statsContainer = {
  margin: "24px 0",
};

const statBox = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "16px",
  textAlign: "center" as const,
  margin: "4px",
};

const statValue = {
  color: "black",
  fontSize: "28px",
  fontWeight: "700" as const,
  margin: "0",
  lineHeight: "1.2",
};

const statLabel = {
  color: "#6B7280",
  fontSize: "12px",
  margin: "4px 0 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const statTrend = {
  fontSize: "11px",
  margin: "4px 0 0",
  fontWeight: "500" as const,
};

const ctaBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const ctaText = {
  color: "#92400e",
  fontSize: "14px",
  margin: "0 0 12px",
};

const button = {
  backgroundColor: "black",
  borderRadius: "980px",
  color: "white",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  margin: "0 0 16px",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "24px 0",
};

const footer = {
  color: "#999999",
  fontSize: "12px",
  margin: "24px 0 0",
};
