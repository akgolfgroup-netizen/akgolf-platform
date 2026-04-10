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

interface WinBackDay14Props {
  name: string;
  discountCode: string;
  discountPercent: number;
}

export function WinBackDay14Email({
  name,
  discountCode,
  discountPercent,
}: WinBackDay14Props) {
  return (
    <Html lang="nb">
      <Head />
      <Preview>{`${discountPercent}% rabatt pa Pro — kun for deg!`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>En spesiell gave til deg</Heading>
          <Text style={greeting}>Hei {name},</Text>
          <Text style={text}>
            Det er to uker siden du logget trening, og vi onsker a hjelpe deg
            tilbake. Derfor gir vi deg en eksklusiv rabatt pa Pro-abonnementet.
          </Text>

          <Section style={offerBox}>
            <Text style={offerTitle}>{discountPercent}% rabatt pa Pro</Text>
            <Text style={offerCode}>Bruk koden: {discountCode}</Text>
            <Text style={offerDetails}>
              Gyldig i 7 dager. Gjelder forste maneds betaling.
            </Text>
          </Section>

          <Section style={benefitsBox}>
            <Text style={benefitsTitle}>Med Pro far du:</Text>
            <Text style={benefitLine}>Ubegrenset logging av treningsokter</Text>
            <Text style={benefitLine}>Full AI-analyse av spillet ditt</Text>
            <Text style={benefitLine}>Personlig AI-treningsplan</Text>
            <Text style={benefitLine}>Alle SLAG-kategorier</Text>
            <Text style={benefitLine}>Eksport til PDF/CSV</Text>
          </Section>

          <Button style={button} href={`https://akgolf.no/portal/oppgrader?code=${discountCode}`}>
            Aktiver rabatten
          </Button>

          <Text style={text}>
            Har du sporsmal? Svar pa denne e-posten — vi hjelper deg gjerne.
          </Text>

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
  color: "#0A1F18",
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

const offerBox = {
  background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const offerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700" as const,
  margin: "0 0 12px",
};

const offerCode = {
  backgroundColor: "rgba(255,255,255,0.2)",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600" as const,
  padding: "8px 16px",
  margin: "0 0 8px",
  display: "inline-block",
};

const offerDetails = {
  color: "rgba(255,255,255,0.8)",
  fontSize: "12px",
  margin: "8px 0 0",
};

const benefitsBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const benefitsTitle = {
  color: "#0A1F18",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const benefitLine = {
  color: "#555",
  fontSize: "14px",
  margin: "0 0 4px",
  paddingLeft: "16px",
  position: "relative" as const,
};

const button = {
  backgroundColor: "#16a34a",
  borderRadius: "980px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "14px 28px",
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
