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

export function NudgeEmail({ name, daysSinceLogin, recentMarketMove, missedOpportunity }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  const days = daysSinceLogin || 7;

  // recentMarketMove can be a plain string or a structured object — handle both
  const marketMove =
    typeof recentMarketMove === "string"
      ? { index: "NIFTY", change: "", direction: "neutral", description: recentMarketMove }
      : recentMarketMove || {
          index: "NIFTY",
          change: "2.4%",
          direction: "up",
          description: "NIFTY surged 2.4% on strong FII inflows and positive global cues.",
        };

  const isUp =
    marketMove.direction === "up" ||
    parseFloat(String(marketMove.change || "0").replace(/[%,+]/g, "")) > 0;

  const opportunity =
    typeof missedOpportunity === "string"
      ? missedOpportunity
      : missedOpportunity?.description ||
        "A Short Straddle on NIFTY weekly expiry would have captured significant premium as IV crushed post-event.";

  return (
    <Html lang="en">
      <Head />
      <Preview>
        The market moved while you were away, {name || "trader"} — here's a quick catch-up
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
            </Row>
          </Section>

          {/* Hero */}
          <Section
            style={{
              background: "linear-gradient(135deg, #060d1a 0%, #0c1929 50%, #060d1a 100%)",
              padding: "48px 40px 36px",
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
              The market moved while you were away, {name || "trader"}.
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
              Here's a quick catch-up on what you missed.
            </Text>
          </Section>

          {/* What Happened */}
          <Section style={{ padding: "32px 40px 0" }}>
            <Row>
              {/* Market Move Stat Box */}
              <Column style={{ width: "60%", verticalAlign: "top", paddingRight: "12px" }}>
                <Section
                  style={{
                    backgroundColor: "#161618",
                    border: "1px solid #1c1c1e",
                    borderRadius: "10px",
                    padding: "20px",
                  }}
                >
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 8px",
                      fontFamily: fontStack,
                    }}
                  >
                    {marketMove.index || "NIFTY"} — Recent Move
                  </Text>
                  <Text
                    style={{
                      color: isUp ? "#22c55e" : "#ef4444",
                      fontSize: "28px",
                      fontWeight: "700",
                      margin: "0 0 6px",
                      letterSpacing: "-0.5px",
                      fontFamily: fontStack,
                    }}
                  >
                    {isUp ? "▲" : "▼"} {marketMove.change || "—"}
                  </Text>
                  <Text
                    style={{
                      color: "#a1a1aa",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {marketMove.description || `${marketMove.index || "NIFTY"} moved recently`}
                  </Text>
                </Section>
              </Column>

              {/* Days Since Login */}
              <Column style={{ width: "40%", verticalAlign: "top", paddingLeft: "12px" }}>
                <Section
                  style={{
                    backgroundColor: "#161618",
                    border: "1px solid #1c1c1e",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      margin: "0 0 8px",
                      fontFamily: fontStack,
                    }}
                  >
                    Last Visit
                  </Text>
                  <Text
                    style={{
                      color: "#f4f4f5",
                      fontSize: "32px",
                      fontWeight: "700",
                      margin: "0 0 4px",
                      lineHeight: "1",
                      fontFamily: fontStack,
                    }}
                  >
                    {days}
                  </Text>
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "13px",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {days === 1 ? "day ago" : "days ago"}
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* Missed Opportunity */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Section
              style={{
                backgroundColor: "rgba(34,211,238,0.05)",
                border: "1px solid rgba(34,211,238,0.2)",
                borderRadius: "10px",
                padding: "24px",
              }}
            >
              <Text
                style={{
                  color: "#22d3ee",
                  fontSize: "10px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  margin: "0 0 12px",
                  fontFamily: fontStack,
                }}
              >
                Potential opportunity you may have missed
              </Text>
              <Text
                style={{
                  color: "#f4f4f5",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  margin: "0 0 16px",
                  fontFamily: fontStack,
                }}
              >
                {opportunity}
              </Text>
              <Text
                style={{
                  color: "#52525b",
                  fontSize: "12px",
                  margin: "0",
                  fontFamily: fontStack,
                }}
              >
                Past performance doesn't guarantee future results. For educational use only.
              </Text>
            </Section>
          </Section>

          {/* What's New Since Your Last Visit */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Text
              style={{
                color: "#f4f4f5",
                fontSize: "15px",
                fontWeight: "600",
                margin: "0 0 18px",
                fontFamily: fontStack,
              }}
            >
              What's new since your last visit
            </Text>

            <Row style={{ marginBottom: "14px" }}>
              <Column style={{ width: "20px", verticalAlign: "top", paddingTop: "2px" }}>
                <Text
                  style={{
                    color: "#22d3ee",
                    fontSize: "14px",
                    fontWeight: "700",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  &rarr;
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "10px" }}>
                <Text
                  style={{
                    color: "#a1a1aa",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Live IV data updated in real-time across all strikes
                </Text>
              </Column>
            </Row>

            <Row style={{ marginBottom: "14px" }}>
              <Column style={{ width: "20px", verticalAlign: "top", paddingTop: "2px" }}>
                <Text
                  style={{
                    color: "#22d3ee",
                    fontSize: "14px",
                    fontWeight: "700",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  &rarr;
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "10px" }}>
                <Text
                  style={{
                    color: "#a1a1aa",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  New A/B strategy comparison mode — test two setups side by side
                </Text>
              </Column>
            </Row>

            <Row>
              <Column style={{ width: "20px", verticalAlign: "top", paddingTop: "2px" }}>
                <Text
                  style={{
                    color: "#22d3ee",
                    fontSize: "14px",
                    fontWeight: "700",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  &rarr;
                </Text>
              </Column>
              <Column style={{ verticalAlign: "top", paddingLeft: "10px" }}>
                <Text
                  style={{
                    color: "#a1a1aa",
                    fontSize: "15px",
                    lineHeight: "1.6",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  IVP/IVR indicator now visible directly on the option chain page
                </Text>
              </Column>
            </Row>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "32px 40px", textAlign: "center", marginTop: "8px" }}>
            <Button
              href="https://optionsgyani.com"
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
              Pick Up Where You Left Off &rarr;
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
                fontFamily: fontStack,
              }}
            >
              &copy; 2026 OptionsGyani &middot; Not SEBI registered &middot; Educational use only
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              <Link
                href="https://optionsgyani.com/profile"
                style={{ color: "#52525b", textDecoration: "underline" }}
              >
                Unsubscribe from these emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default NudgeEmail;
