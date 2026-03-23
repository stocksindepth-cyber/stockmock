import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Button,
  Link,
  Hr,
  Preview,
} from "@react-email/components";

export function WelcomePremiumEmail({ name, email, plan, expiryDate, features }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  const featureList =
    features && features.length > 0
      ? features
      : [
          "Unlimited backtesting on 8+ years of NSE data",
          "Advanced Greeks: Delta, Gamma, Theta, Vega",
          "Live Option Chain with real-time IV percentile",
          "Strategy Builder with full P&L simulation",
          "IVP/IVR sentiment dashboard",
          "Priority support with 24hr response SLA",
          "Early access to all upcoming features",
        ];

  return (
    <Html lang="en">
      <Head />
      <Preview>
        You're now Pro, {name || "trader"} — a different level of options analysis awaits
      </Preview>
      <Body
        style={{
          backgroundColor: "#09090b",
          margin: "0",
          padding: "32px 0",
          fontFamily: fontStack,
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#0f0f0f",
            borderRadius: "16px",
            border: "1px solid #1c1c1e",
            overflow: "hidden",
          }}
        >
          {/* Logo Bar */}
          <Section
            style={{
              padding: "20px 40px",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Row>
              <Column style={{ verticalAlign: "middle" }}>
                <Img
                  src="https://optionsgyani.com/logo.png"
                  width="36"
                  height="36"
                  alt="OptionsGyani"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
                <Text
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    color: "#f4f4f5",
                    fontSize: "17px",
                    fontWeight: "600",
                    margin: "0 0 0 10px",
                    fontFamily: fontStack,
                  }}
                >
                  OptionsGyani
                </Text>
              </Column>
              <Column style={{ verticalAlign: "middle", textAlign: "right" }}>
                <Text
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.35)",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    color: "#f59e0b",
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  PRO
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero — amber premium gradient */}
          <Section
            style={{
              background: "linear-gradient(135deg, #0f0a00 0%, #1a1000 50%, #0f0a00 100%)",
              borderTop: "3px solid #f59e0b",
              padding: "48px 40px 40px",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Text
              style={{
                color: "#f4f4f5",
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
                margin: "0 0 14px",
                fontFamily: fontStack,
              }}
            >
              You're now Pro, {name || "trader"}.
            </Text>
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              Welcome to a different level of options analysis. Everything is unlocked.
            </Text>
          </Section>

          {/* Plan Card */}
          <Section style={{ padding: "32px 40px 0" }}>
            <Section
              style={{
                backgroundColor: "rgba(245,158,11,0.04)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <Row>
                <Column style={{ width: "50%", verticalAlign: "middle" }}>
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 6px",
                      fontFamily: fontStack,
                    }}
                  >
                    Active Plan
                  </Text>
                  <Text
                    style={{
                      color: "#f59e0b",
                      fontSize: "18px",
                      fontWeight: "700",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {plan || "Pro Plan"}
                  </Text>
                </Column>
                <Column style={{ width: "50%", verticalAlign: "middle", textAlign: "right" }}>
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 6px",
                      fontFamily: fontStack,
                    }}
                  >
                    Valid Until
                  </Text>
                  <Text
                    style={{
                      color: "#f4f4f5",
                      fontSize: "15px",
                      fontWeight: "600",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {expiryDate || "—"}
                  </Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* Features List */}
          <Section style={{ padding: "32px 40px 0" }}>
            <Text
              style={{
                color: "#52525b",
                fontSize: "11px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 20px",
                fontFamily: fontStack,
              }}
            >
              Everything included
            </Text>
            {featureList.map((feature, index) => (
              <Row key={index} style={{ marginBottom: "14px" }}>
                <Column
                  style={{
                    width: "28px",
                    verticalAlign: "top",
                    paddingTop: "1px",
                  }}
                >
                  <Text
                    style={{
                      color: "#f59e0b",
                      fontSize: "15px",
                      fontWeight: "700",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    &#10003;
                  </Text>
                </Column>
                <Column style={{ verticalAlign: "top" }}>
                  <Text
                    style={{
                      color: "#a1a1aa",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {feature}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* CTA */}
          <Section
            style={{
              padding: "32px 40px",
              textAlign: "center",
              borderTop: "1px solid #1c1c1e",
              marginTop: "32px",
            }}
          >
            <Button
              href="https://optionsgyani.com/backtest"
              style={{
                backgroundColor: "#f59e0b",
                color: "#000000",
                borderRadius: "8px",
                padding: "13px 28px",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "0.01em",
                textDecoration: "none",
                display: "inline-block",
                fontFamily: fontStack,
              }}
            >
              Explore Your Pro Features &rarr;
            </Button>
          </Section>

          {/* Motivational line */}
          <Section
            style={{
              padding: "0 40px 36px",
              textAlign: "center",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Text
              style={{
                color: "#52525b",
                fontSize: "14px",
                fontStyle: "italic",
                lineHeight: "1.6",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              "The best traders don't guess — they backtest. You now have the tools."
            </Text>
          </Section>

          {/* Footer */}
          <Section style={{ padding: "24px 40px", textAlign: "center" }}>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0 0 6px",
                lineHeight: "1.6",
                fontFamily: fontStack,
              }}
            >
              Need help?{" "}
              <Link
                href="mailto:support@optionsgyani.com"
                style={{ color: "#22d3ee", textDecoration: "none" }}
              >
                support@optionsgyani.com
              </Link>
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              &copy; 2026 OptionsGyani &middot; Not SEBI registered &middot; Educational use only
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomePremiumEmail;
