import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components";

interface AbandonedCheckoutEmailProps {
  name: string;
  planName: string;
  checkoutUrl: string;
}

export function AbandonedCheckoutEmail({
  name = "Golfspiller",
  planName = "Pro",
  checkoutUrl = "https://akgolf.no/portal/apper",
}: AbandonedCheckoutEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Fullfor oppgraderingen din til {planName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>AK Golf Academy</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hei {name},</Text>

            <Text style={paragraph}>
              Vi la merke til at du startet a oppgradere til {planName}, men
              ikke fullforte bestillingen.
            </Text>

            <Text style={paragraph}>
              Med {planName} far du tilgang til:
            </Text>

            <Section style={featureList}>
              <Text style={featureItem}>AI-drevet treningsanalyse</Text>
              <Text style={featureItem}>Personlig treningsplan</Text>
              <Text style={featureItem}>Strokes Gained-statistikk</Text>
              <Text style={featureItem}>Ubegrenset logging</Text>
            </Section>

            <Text style={paragraph}>
              <strong>Start med 14 dagers gratis proveperiode</strong> — ingen
              betaling for du er fornoyd.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={checkoutUrl}>
                Fullfor oppgraderingen
              </Button>
            </Section>

            <Text style={smallText}>
              Har du sporsmal? Svar pa denne e-posten, sa hjelper vi deg.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              AK Golf Academy
              <br />
              Fredrikstad, Norge
            </Text>
            <Text style={footerLink}>
              Du mottar denne e-posten fordi du startet en oppgradering pa
              akgolf.no
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f5f5f5",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const header = {
  textAlign: "center" as const,
  marginBottom: "32px",
};

const logo = {
  fontSize: "24px",
  fontWeight: "700",
  color: "black",
  margin: "0",
};

const content = {
  backgroundColor: "white",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid #d1d5db",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "black",
  margin: "0 0 16px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "black",
  margin: "0 0 16px 0",
};

const featureList = {
  backgroundColor: "#f5f5f5",
  borderRadius: "12px",
  padding: "16px 20px",
  margin: "16px 0",
};

const featureItem = {
  fontSize: "14px",
  color: "black",
  margin: "8px 0",
  paddingLeft: "20px",
  position: "relative" as const,
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "black",
  color: "white",
  fontSize: "15px",
  fontWeight: "600",
  padding: "14px 28px",
  borderRadius: "980px",
  textDecoration: "none",
};

const smallText = {
  fontSize: "13px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "16px 0 0 0",
};

const hr = {
  borderColor: "#d1d5db",
  margin: "32px 0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0 0 8px 0",
};

const footerLink = {
  fontSize: "12px",
  color: "#A5B2AD",
  margin: "0",
};

export default AbandonedCheckoutEmail;
