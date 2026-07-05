import {
  Html, Head, Body, Container, Section, Row, Column,
  Img, Text, Button, Link, Hr, Preview,
} from "@react-email/components";

export function Day3Email({ name }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const displayName = name || "trader";

  const steps = [
    { n: "1", title: "Pick a strategy", body: "Iron Condor, Short Straddle, Bull Call Spread — start with what sounds familiar." },
    { n: "2", title: "Set your expiry & strikes", body: "The backtest engine handles the math. Just pick your parameters and hit Run." },
    { n: "3", title: "Read your edge", body: "See win rate, avg P&L, max drawdown across 8+ years of real NSE data." },
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>Your free backtests are waiting, {displayName} — takes 60 seconds</Preview>
      <Body style={{ backgroundColor: "#09090b", margin: "0", padding: "32px 0", fontFamily: fontStack }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#0f0f0f", borderRadius: "16px", border: "1px solid #1c1c1e", overflow: "hidden" }}>

          {/* Logo */}
          <Section style={{ padding: "20px 40px", borderBottom: "1px solid #1c1c1e" }}>
            <Img src="https://www.optionsgyani.com/logo.png" width="32" height="32" alt="OptionsGyani" style={{ display: "inline-block", verticalAlign: "middle" }} />
            <Text style={{ display: "inline-block", verticalAlign: "middle", color: "#f4f4f5", fontSize: "16px", fontWeight: "600", margin: "0 0 0 10px", fontFamily: fontStack }}>
              OptionsGyani
            </Text>
          </Section>

          {/* Hero */}
          <Section style={{ background: "linear-gradient(135deg, #060d1a 0%, #0c1929 50%, #060d1a 100%)", padding: "48px 40px 36px", borderBottom: "1px solid #1c1c1e" }}>
            <Text style={{ color: "#6366f1", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 14px", fontFamily: fontStack }}>
              Day 3 — Activation
            </Text>
            <Text style={{ color: "#f4f4f5", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1.25", margin: "0 0 14px", fontFamily: fontStack }}>
              Hey {displayName}, run your first backtest before the week ends.
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
              You have 5 free backtests every day. Most traders use all 5 within 10 minutes of trying it the first time.
            </Text>
          </Section>

          {/* Steps */}
          <Section style={{ padding: "36px 40px 8px" }}>
            <Text style={{ color: "#f4f4f5", fontSize: "15px", fontWeight: "600", margin: "0 0 20px", fontFamily: fontStack }}>
              It's 3 steps:
            </Text>
            {steps.map((s) => (
              <Row key={s.n} style={{ marginBottom: "18px" }}>
                <Column style={{ width: "32px", verticalAlign: "top", paddingTop: "1px" }}>
                  <Text style={{ width: "24px", height: "24px", backgroundColor: "#1e1b4b", color: "#818cf8", fontSize: "12px", fontWeight: "700", borderRadius: "6px", textAlign: "center", lineHeight: "24px", margin: "0", fontFamily: fontStack }}>
                    {s.n}
                  </Text>
                </Column>
                <Column style={{ verticalAlign: "top", paddingLeft: "12px" }}>
                  <Text style={{ color: "#f4f4f5", fontSize: "14px", fontWeight: "600", margin: "0 0 4px", fontFamily: fontStack }}>{s.title}</Text>
                  <Text style={{ color: "#71717a", fontSize: "13px", lineHeight: "1.6", margin: "0", fontFamily: fontStack }}>{s.body}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Stat proof */}
          <Section style={{ padding: "8px 40px 32px" }}>
            <Section style={{ backgroundColor: "#0d1117", border: "1px solid #21262d", borderRadius: "10px", padding: "20px 24px" }}>
              <Row>
                {[
                  { value: "8+ yrs", label: "Real NSE data" },
                  { value: "57%+", label: "Avg straddle win rate" },
                  { value: "60s", label: "Time per backtest" },
                ].map((stat) => (
                  <Column key={stat.label} style={{ textAlign: "center", width: "33%" }}>
                    <Text style={{ color: "#818cf8", fontSize: "22px", fontWeight: "700", margin: "0 0 4px", fontFamily: fontStack }}>{stat.value}</Text>
                    <Text style={{ color: "#52525b", fontSize: "11px", margin: "0", fontFamily: fontStack }}>{stat.label}</Text>
                  </Column>
                ))}
              </Row>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "0 40px 40px", textAlign: "center" }}>
            <Button href="https://www.optionsgyani.com/backtest" style={{ backgroundColor: "#6366f1", color: "#ffffff", borderRadius: "8px", padding: "14px 32px", fontSize: "14px", fontWeight: "600", textDecoration: "none", display: "inline-block", fontFamily: fontStack }}>
              Run My First Backtest →
            </Button>
            <Text style={{ color: "#52525b", fontSize: "12px", margin: "14px 0 0", fontFamily: fontStack }}>
              Free · No card · 5 backtests/day forever
            </Text>
          </Section>

          <Hr style={{ border: "none", borderTop: "1px solid #1c1c1e", margin: "0" }} />
          <Section style={{ padding: "20px 40px", textAlign: "center" }}>
            <Text style={{ color: "#3f3f46", fontSize: "12px", margin: "0 0 4px", fontFamily: fontStack }}>
              © 2026 OptionsGyani · Educational use only · Not SEBI registered
            </Text>
            <Link href="https://www.optionsgyani.com/profile" style={{ color: "#3f3f46", fontSize: "12px", textDecoration: "underline", fontFamily: fontStack }}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default Day3Email;
