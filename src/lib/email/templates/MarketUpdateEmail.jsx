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

function getChangeStyle(change) {
  const val = parseFloat(String(change || "0").replace(/[%,]/g, ""));
  return val >= 0 ? "#22c55e" : "#ef4444";
}

function formatChange(change) {
  if (change === undefined || change === null || change === "") return "—";
  // If already formatted string like "-0.3%" or "+0.8%", display as-is with arrow
  const str = String(change).trim();
  const val = parseFloat(str.replace(/[%,+]/g, ""));
  if (isNaN(val)) return str; // pass through whatever was given
  const prefix = val >= 0 ? "▲" : "▼";
  const abs = Math.abs(val);
  // If original already had 1 decimal place, keep it; else show 2
  const decimals = str.includes(".") ? str.split(".")[1].replace("%","").length : 2;
  return `${prefix} ${abs.toFixed(Math.min(decimals, 2))}%`;
}

// Safely format a spot price string that may already contain commas (e.g. "22,512")
function formatSpot(spot) {
  if (!spot && spot !== 0) return "—";
  const clean = String(spot).replace(/,/g, "");
  const num = Number(clean);
  return isNaN(num) ? String(spot) : num.toLocaleString("en-IN");
}

function getIVPColor(ivp) {
  const val = parseFloat(String(ivp || "50"));
  if (val >= 75) return "#ef4444";
  if (val <= 25) return "#22c55e";
  return "#f59e0b";
}

function getIVPLabel(ivp) {
  const val = parseFloat(String(ivp || "50"));
  if (val >= 75) return "HIGH — elevated premium";
  if (val <= 25) return "LOW — cheap options";
  return "NEUTRAL — normal range";
}

export function MarketUpdateEmail({
  subject,
  niftySpot,
  niftyChange,
  bankNiftySpot,
  bankNiftyChange,
  ivpNifty,
  straddlePremium,
  aiInsight,
  topTrade,
  date,
}) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const mono = "'SF Mono', 'Fira Code', monospace";
  const niftyUp = parseFloat(String(niftyChange || "0").replace("%", "")) >= 0;
  const bankNiftyUp = parseFloat(String(bankNiftyChange || "0").replace("%", "")) >= 0;

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {subject || `Market Brief — ${date || "Today"} | NIFTY ${niftySpot || ""}`}
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
                    color: "#52525b",
                    fontSize: "12px",
                    margin: "0",
                    fontFamily: fontStack,
                    backgroundColor: "#161618",
                    border: "1px solid #1c1c1e",
                    borderRadius: "20px",
                    padding: "3px 12px",
                    display: "inline-block",
                  }}
                >
                  {date || "Today"}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section
            style={{
              padding: "36px 40px 28px",
              borderBottom: "2px solid #22d3ee",
            }}
          >
            <Text
              style={{
                color: "#f4f4f5",
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                margin: "0 0 8px",
                fontFamily: fontStack,
              }}
            >
              Market Brief
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "14px",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              {date || "Daily Summary"}
            </Text>
          </Section>

          {/* Market Stats — 2 columns */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Row>
              {/* NIFTY */}
              <Column style={{ width: "48%", verticalAlign: "top", paddingRight: "8px" }}>
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
                      margin: "0 0 10px",
                      fontFamily: fontStack,
                    }}
                  >
                    NIFTY 50
                  </Text>
                  <Text
                    style={{
                      color: "#f4f4f5",
                      fontSize: "26px",
                      fontWeight: "700",
                      margin: "0 0 8px",
                      lineHeight: "1.1",
                      letterSpacing: "-0.5px",
                      fontFamily: fontStack,
                    }}
                  >
                    {formatSpot(niftySpot)}
                  </Text>
                  <Text
                    style={{
                      backgroundColor: niftyUp
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(239,68,68,0.1)",
                      border: `1px solid ${niftyUp ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                      borderRadius: "6px",
                      padding: "3px 10px",
                      color: getChangeStyle(niftyChange),
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "inline-block",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {formatChange(niftyChange)}
                  </Text>
                </Section>
              </Column>

              {/* BANKNIFTY */}
              <Column style={{ width: "48%", verticalAlign: "top", paddingLeft: "8px" }}>
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
                      margin: "0 0 10px",
                      fontFamily: fontStack,
                    }}
                  >
                    BANKNIFTY
                  </Text>
                  <Text
                    style={{
                      color: "#f4f4f5",
                      fontSize: "26px",
                      fontWeight: "700",
                      margin: "0 0 8px",
                      lineHeight: "1.1",
                      letterSpacing: "-0.5px",
                      fontFamily: fontStack,
                    }}
                  >
                    {formatSpot(bankNiftySpot)}
                  </Text>
                  <Text
                    style={{
                      backgroundColor: bankNiftyUp
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(239,68,68,0.1)",
                      border: `1px solid ${bankNiftyUp ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                      borderRadius: "6px",
                      padding: "3px 10px",
                      color: getChangeStyle(bankNiftyChange),
                      fontSize: "13px",
                      fontWeight: "600",
                      display: "inline-block",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {formatChange(bankNiftyChange)}
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* IV Sentiment row */}
          <Section style={{ padding: "16px 40px 0" }}>
            <Row>
              {/* IV Percentile */}
              <Column style={{ width: "48%", verticalAlign: "top", paddingRight: "8px" }}>
                <Section
                  style={{
                    backgroundColor: "#161618",
                    border: "1px solid #1c1c1e",
                    borderRadius: "10px",
                    padding: "16px 20px",
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
                    IV Percentile
                  </Text>
                  <Text
                    style={{
                      color: getIVPColor(ivpNifty),
                      fontSize: "24px",
                      fontWeight: "700",
                      margin: "0 0 4px",
                      fontFamily: fontStack,
                    }}
                  >
                    {ivpNifty !== undefined ? `${ivpNifty}%` : "—"}
                  </Text>
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    {getIVPLabel(ivpNifty)}
                  </Text>
                </Section>
              </Column>

              {/* ATM Straddle */}
              <Column style={{ width: "48%", verticalAlign: "top", paddingLeft: "8px" }}>
                <Section
                  style={{
                    backgroundColor: "#161618",
                    border: "1px solid #1c1c1e",
                    borderRadius: "10px",
                    padding: "16px 20px",
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
                    ATM Straddle
                  </Text>
                  <Text
                    style={{
                      color: "#f59e0b",
                      fontSize: "24px",
                      fontWeight: "700",
                      margin: "0 0 4px",
                      fontFamily: fontStack,
                    }}
                  >
                    &#8377;{straddlePremium !== undefined ? straddlePremium : "—"}
                  </Text>
                  <Text
                    style={{
                      color: "#52525b",
                      fontSize: "11px",
                      margin: "0",
                      fontFamily: fontStack,
                    }}
                  >
                    Weekly expiry premium
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* AI Insight */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Section
              style={{
                backgroundColor: "rgba(34,211,238,0.04)",
                borderLeft: "3px solid #22d3ee",
                borderRadius: "0 10px 10px 0",
                padding: "20px 24px",
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
                AI Insight
              </Text>
              <Text
                style={{
                  color: "#f4f4f5",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  margin: "0",
                  fontFamily: fontStack,
                }}
              >
                {aiInsight || "No AI insight available for today. Check the live chain for current market conditions."}
              </Text>
            </Section>
          </Section>

          {/* Strategy of the Day */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Text
              style={{
                color: "#52525b",
                fontSize: "10px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                margin: "0 0 14px",
                fontFamily: fontStack,
              }}
            >
              Strategy of the Day
            </Text>
            <Section
              style={{
                borderLeft: "3px solid #f59e0b",
                backgroundColor: "rgba(245,158,11,0.04)",
                borderRadius: "0 10px 10px 0",
                padding: "20px 24px",
              }}
            >
              <Text
                style={{
                  color: "#a1a1aa",
                  fontSize: "15px",
                  lineHeight: "1.7",
                  margin: "0",
                  fontFamily: fontStack,
                }}
              >
                {topTrade
                  ? typeof topTrade === "string"
                    ? topTrade
                    : topTrade.strategy
                    ? `${topTrade.strategy}${topTrade.description ? " — " + topTrade.description : ""}${topTrade.strikes ? " | Strikes: " + topTrade.strikes : ""}`
                    : "No strategy available today."
                  : "No featured strategy today. Open the live chain to explore current setups."}
              </Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "32px 40px", textAlign: "center" }}>
            <Button
              href="https://optionsgyani.com/chain"
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
              Open Live Chain &rarr;
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
                Unsubscribe from market updates
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default MarketUpdateEmail;
