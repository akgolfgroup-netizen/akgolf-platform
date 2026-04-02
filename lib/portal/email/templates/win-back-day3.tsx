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

interface WinBackDay3Props {
  name: string;
  lastActiveDate: string;
  streak: number;
}

export function WinBackDay3Email({ name, lastActiveDate, streak }: WinBackDay3Props) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Vi savner deg i treningsdagboken!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Vi savner deg!</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Det er noen dager siden vi sa deg i treningsdagboken. Din siste okt
            var {lastActiveDate}.
          </Text>

          {streak > 0 && (
            <Section style={streakBox}>
              <Text style={streakText}>
                Din streak pa {streak} {streak === 1 ? "dag" : "dager"} venter pa deg!
              </Text>
              <Text style={streakSubtext}>
                Ikke la innsatsen ga til spille — logg en okt i dag for a
                fortsette.
              </Text>
            </Section>
          )}

          <Text style={text}>
            Husk: Regelmessig trening er nokkel til forbedring. Selv 15 minutter
            teller!
          </Text>

          <Button style={button} href="https://akgolf.no/portal/dagbok">
            Logg din neste okt
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

const streakBox = {
  backgroundColor: "#FEF3C7",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
  textAlign: "center" as const,
};

const streakText = {
  color: "#92400E",
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const streakSubtext = {
  color: "#92400E",
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
