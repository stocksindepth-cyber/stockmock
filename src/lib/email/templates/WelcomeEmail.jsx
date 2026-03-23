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

export function WelcomeEmail({ name, email }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to OptionsGyani — India's most powerful options analytics platform</Preview>
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
                    backgroundColor: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.3)",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    color: "#22c55e",
                    fontSize: "11px",
                    fontWeight: "600",
                    letterSpacing: "0.05em",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  FREE ACCOUNT
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section
            style={{
              background: "linear-gradient(135deg, #060d1a 0%, #0c1929 50%, #060d1a 100%)",
              padding: "48px 40px 40px",
              borderBottom: "2px solid #22d3ee",
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
              Welcome, {name || "trader"}.
            </Text>
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "15px",
                fontWeight: "400",
                lineHeight: "1.7",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              India's most powerful options analytics platform. Built for serious traders.
            </Text>
          </Section>

          {/* Feature Rows */}
          <Section style={{ padding: "0 40px" }}>
            {/* Row 01 */}
            <Row
              style={{
                padding: "28px 0",
                borderBottom: "1px solid #1c1c1e",
              }}
            >
              <Column
                style={{
                  width: "48px",
                  verticalAlign: "top",
                  paddingTop: "2px",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    color: "#22d3ee",
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    margin: "0",
                    display: "inline-block",
                  }}
                >
                  01
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "16px" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "15px",
                    fontWeight: "600",
                    margin: "0 0 6px",
                    fontFamily: fontStack,
                  }}
                >
                  Backtest Any Strategy
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
                  Test your options setups against 8+ years of NSE historical data. Know your edge before risking capital.
                </Text>
              </Column>
            </Row>

            {/* Row 02 */}
            <Row
              style={{
                padding: "28px 0",
                borderBottom: "1px solid #1c1c1e",
              }}
            >
              <Column
                style={{
                  width: "48px",
                  verticalAlign: "top",
                  paddingTop: "2px",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    color: "#22d3ee",
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    margin: "0",
                    display: "inline-block",
                  }}
                >
                  02
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "16px" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "15px",
                    fontWeight: "600",
                    margin: "0 0 6px",
                    fontFamily: fontStack,
                  }}
                >
                  Live Option Chain
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
                  Real-time IV, Greeks, OI and PCR data for NIFTY and BANKNIFTY. See the market the way professional desks do.
                </Text>
              </Column>
            </Row>

            {/* Row 03 */}
            <Row style={{ padding: "28px 0" }}>
              <Column
                style={{
                  width: "48px",
                  verticalAlign: "top",
                  paddingTop: "2px",
                }}
              >
                <Text
                  style={{
                    backgroundColor: "rgba(34,211,238,0.08)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    color: "#22d3ee",
                    fontSize: "11px",
                    fontWeight: "700",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                    margin: "0",
                    display: "inline-block",
                  }}
                >
                  03
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "16px" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "15px",
                    fontWeight: "600",
                    margin: "0 0 6px",
                    fontFamily: fontStack,
                  }}
                >
                  Trade Simulator
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
                  Replay past market sessions tick by tick. Practice execution and refine your system — zero risk, full fidelity.
                </Text>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section
            style={{
              padding: "32px 40px 40px",
              textAlign: "center",
              borderTop: "1px solid #1c1c1e",
            }}
          >
            <Button
              href="https://optionsgyani.com/backtest"
              style={{
                backgroundColor: "#22d3ee",
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
              Open Backtesting Engine &rarr;
            </Button>
          </Section>

          {/* Footer */}
          <Hr style={{ border: "none", borderTop: "1px solid #1c1c1e", margin: "0" }} />
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
              Questions?{" "}
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

export default WelcomeEmail;
