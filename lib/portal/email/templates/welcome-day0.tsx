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
  Img,
} from "@react-email/components";

interface WelcomeDay0Props {
  name: string;
}

export function WelcomeDay0Email({ name }: WelcomeDay0Props) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>Velkommen til AK Golf Academy!</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Velkommen til AK Golf Academy</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Sa flott at du har blitt med! Du har tatt forste steg mot a bli en
            bedre golfspiller.
          </Text>

          <Section style={ctaBox}>
            <Text style={ctaTitle}>Kom i gang pa 3 minutter:</Text>
            <Text style={ctaText}>
              Fullfør profilen din for å få personlige anbefalinger og
              treningsplaner tilpasset dine mål.
            </Text>
            <Button style={button} href="https://akgolf.no/portal/profil">
              Fullfør profilen
            </Button>
          </Section>

          <Section style={tipsBox}>
            <Text style={tipsTitle}>Hva du kan gjore i portalen:</Text>
            <Text style={tipItem}>
              <strong>Treningsdagbok</strong> — Logg okter og bygg streak
            </Text>
            <Text style={tipItem}>
              <strong>Statistikk</strong> — Se Strokes Gained-analyse
            </Text>
            <Text style={tipItem}>
              <strong>AI-analyse</strong> — Fa personlige tips fra AI-coach
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Har du sporsmal? Svar pa denne e-posten eller book en intro-time.
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

const ctaBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const ctaTitle = {
  color: "#1D1D1F",
  fontSize: "16px",
  fontWeight: "600" as const,
  margin: "0 0 8px",
};

const ctaText = {
  color: "#555",
  fontSize: "14px",
  margin: "0 0 16px",
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
};

const tipsBox = {
  backgroundColor: "#EFF6FF",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const tipsTitle = {
  color: "#1E40AF",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const tipItem = {
  color: "#1E40AF",
  fontSize: "13px",
  margin: "0 0 8px",
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "24px 0",
};

const footer = {
  color: "#999",
  fontSize: "12px",
  margin: "8px 0 0",
};
