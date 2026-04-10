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

interface WelcomeDay3Props {
  name: string;
  sessionCount: number;
}

export function WelcomeDay3Email({ name, sessionCount }: WelcomeDay3Props) {
  const hasActivity = sessionCount > 0;

  return (
    <Html lang="nb">
      <Head />
      <Preview>
        {hasActivity
          ? "Bra jobba! Her er neste steg"
          : "Har du sporsmal? Vi er her for a hjelpe"}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>
            {hasActivity ? "Bra jobba!" : "Trenger du hjelp?"}
          </Heading>
          <Text style={greeting}>Hei {name},</Text>

          {hasActivity ? (
            <>
              <Text style={text}>
                Du har allerede logget {sessionCount}{" "}
                {sessionCount === 1 ? "okt" : "okter"} — fantastisk start!
              </Text>
              <Text style={text}>
                Neste steg er a booke en time med en av vare trenere. De kan
                hjelpe deg sette opp en personlig treningsplan basert pa dataene
                dine.
              </Text>
            </>
          ) : (
            <>
              <Text style={text}>
                Vi la merke til at du ikke har logget noen okter enna. Det er
                helt greit — mange starter sakte.
              </Text>
              <Text style={text}>
                Har du sporsmal om hvordan portalen fungerer, eller trenger du
                hjelp til a komme i gang?
              </Text>
            </>
          )}

          <Section style={ctaBox}>
            {hasActivity ? (
              <>
                <Text style={ctaTitle}>Book en intro-time</Text>
                <Text style={ctaText}>
                  Fa personlig veiledning og en treningsplan tilpasset deg.
                </Text>
                <Button style={button} href="https://akgolf.no/portal/bookinger/ny">
                  Book time
                </Button>
              </>
            ) : (
              <>
                <Text style={ctaTitle}>Trenger du en rask intro?</Text>
                <Text style={ctaText}>
                  Book en gratis 15-minutters intro hvor vi viser deg rundt i
                  portalen.
                </Text>
                <Button style={button} href="https://akgolf.no/portal/bookinger/ny">
                  Book gratis intro
                </Button>
              </>
            )}
          </Section>

          <Section style={helpBox}>
            <Text style={helpTitle}>Ofte stilte sporsmal:</Text>
            <Text style={helpItem}>
              <strong>Hvor ofte bor jeg logge?</strong>
              <br />
              Vi anbefaler a logge hver treningsokt, men selv 1-2 ganger i uken
              gir god innsikt.
            </Text>
            <Text style={helpItem}>
              <strong>Hva er Strokes Gained?</strong>
              <br />
              En metode for a male hvor du taper/tjener slag sammenlignet med
              andre spillere.
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            Svar direkte pa denne e-posten hvis du har sporsmal.
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

const ctaBox = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const ctaTitle = {
  color: "#0A1F18",
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
  backgroundColor: "#0A1F18",
  borderRadius: "980px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600" as const,
  padding: "12px 24px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
};

const helpBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "8px",
  padding: "16px",
  margin: "16px 0",
};

const helpTitle = {
  color: "#0A1F18",
  fontSize: "14px",
  fontWeight: "600" as const,
  margin: "0 0 12px",
};

const helpItem = {
  color: "#555",
  fontSize: "13px",
  margin: "0 0 12px",
  lineHeight: "1.5",
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
