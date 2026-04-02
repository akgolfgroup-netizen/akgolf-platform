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

interface WelcomeDay1Props {
  name: string;
  hasLoggedSession: boolean;
  hasSetGoals: boolean;
}

export function WelcomeDay1Email({ name, hasLoggedSession, hasSetGoals }: WelcomeDay1Props) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>3 ting du kan gjore i dag</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>3 ting du kan gjore i dag</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Her er tre enkle handlinger som vil hjelpe deg fa mest ut av
            portalen:
          </Text>

          <Section style={taskBox}>
            <div style={taskItem}>
              <span style={hasSetGoals ? checkDone : checkPending}>
                {hasSetGoals ? "✓" : "1"}
              </span>
              <div>
                <Text style={taskTitle}>Sett dine mal</Text>
                <Text style={taskDesc}>
                  Handicap-mal, treningsfrekvens og fokusomrader
                </Text>
              </div>
            </div>

            <div style={taskItem}>
              <span style={hasLoggedSession ? checkDone : checkPending}>
                {hasLoggedSession ? "✓" : "2"}
              </span>
              <div>
                <Text style={taskTitle}>Logg din forste okt</Text>
                <Text style={taskDesc}>
                  Bare 2 minutter — bygg din forste streak
                </Text>
              </div>
            </div>

            <div style={taskItem}>
              <span style={checkPending}>3</span>
              <div>
                <Text style={taskTitle}>Utforsk statistikk</Text>
                <Text style={taskDesc}>
                  Se hvordan Strokes Gained-analyse fungerer
                </Text>
              </div>
            </div>
          </Section>

          <Button style={button} href="https://akgolf.no/portal/dagbok">
            Logg din forste okt
          </Button>

          <Section style={tipBox}>
            <Text style={tipTitle}>Tips:</Text>
            <Text style={tipText}>
              Visste du at spillere som logger trening regelmessig forbedrer
              handicap 2x raskere? Start med bare 15 minutter i dag.
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

const taskBox = {
  margin: "24px 0",
};

const taskItem = {
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "16px",
};

const checkPending = {
  width: "24px",
  height: "24px",
  borderRadius: "50%",
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  fontSize: "12px",
  fontWeight: "600" as const,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const checkDone = {
  ...checkPending,
  backgroundColor: "#dcfce7",
  color: "#16a34a",
};

const taskTitle = {
  color: "#1D1D1F",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 2px",
};

const taskDesc = {
  color: "#6b7280",
  fontSize: "13px",
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
  margin: "0 0 24px",
};

const tipBox = {
  backgroundColor: "#FEF3C7",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const tipTitle = {
  color: "#92400E",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const tipText = {
  color: "#92400E",
  fontSize: "13px",
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
