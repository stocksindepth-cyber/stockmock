import {
  Html, Head, Body, Container, Section, Row, Column,
  Img, Text, Button, Link, Hr, Preview,
} from "@react-email/components";

export function Day14Email({ name }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const displayName = name || "trader";

  const proFeatures = [
    { icon: "∞", label: "Unlimited backtests", sub: "No daily cap — run as many as you need" },
    { icon: "💾", label: "Save strategies", sub: "Build a portfolio of tested setups" },
    { icon: "🔔", label: "IV Alerts", sub: "Get notified when IVP crosses your threshold" },
    { icon: "📊", label: "OI Analysis", sub: "See where big money is positioned" },
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>{displayName}, 14 days on the free plan — here's what you've been missing</Preview>
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
          <Section style={{ background: "linear-gradient(135deg, #0c0a00 0%, #1a1200 50%, #0c0a00 100%)", padding: "48px 40px 36px", borderBottom: "1px solid #1c1c1e" }}>
            <Text style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 14px", fontFamily: fontStack }}>
              14 days free · time to level up
            </Text>
            <Text style={{ color: "#f4f4f5", fontSize: "30px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1.25", margin: "0 0 14px", fontFamily: fontStack }}>
              You've spent 14 days testing strategies, {displayName}. You don't have to hit daily limits.
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
              Every time you hit the daily cap, a backtest you wanted to run didn't happen. Pro removes that cap — and it unlocks free, no payment ever.
            </Text>
          </Section>

          {/* Pro features */}
          <Section style={{ padding: "36px 40px 8px" }}>
            <Text style={{ color: "#f4f4f5", fontSize: "15px", fontWeight: "600", margin: "0 0 20px", fontFamily: fontStack }}>
              What Pro unlocks for you:
            </Text>
            {proFeatures.map((f) => (
              <Row key={f.label} style={{ marginBottom: "14px" }}>
                <Column style={{ width: "36px", verticalAlign: "top", paddingTop: "2px" }}>
                  <Text style={{ fontSize: "18px", margin: "0", fontFamily: fontStack }}>{f.icon}</Text>
                </Column>
                <Column style={{ verticalAlign: "top" }}>
                  <Text style={{ color: "#f4f4f5", fontSize: "14px", fontWeight: "600", margin: "0 0 2px", fontFamily: fontStack }}>{f.label}</Text>
                  <Text style={{ color: "#71717a", fontSize: "13px", margin: "0", fontFamily: fontStack }}>{f.sub}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Free unlock box */}
          <Section style={{ padding: "16px 40px 32px" }}>
            <Section style={{ backgroundColor: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "12px", padding: "24px" }}>
              <Text style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px", fontFamily: fontStack }}>
                Pro costs nothing — here&apos;s how
              </Text>
              <Text style={{ color: "#f4f4f5", fontSize: "20px", fontWeight: "700", margin: "0 0 8px", fontFamily: fontStack }}>
                Free for life via Dhan
              </Text>
              <Text style={{ color: "#a1a1aa", fontSize: "13px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
                There are no paid plans on OptionsGyani. Open a free Dhan account through my referral link
                (₹0 AMC, the broker I personally trade with), share your first-trade snapshot, and Pro unlocks
                permanently. The referral commission is what funds these free tools.
              </Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "0 40px 40px", textAlign: "center" }}>
            <Button href="https://www.optionsgyani.com/unlock" style={{ backgroundColor: "#f59e0b", color: "#000000", borderRadius: "8px", padding: "14px 36px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-block", fontFamily: fontStack }}>
              Unlock Pro Free →
            </Button>
            <Text style={{ color: "#52525b", fontSize: "12px", margin: "14px 0 0", fontFamily: fontStack }}>
              No payment ever · Referral link — commission funds the free tools
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

export default Day14Email;
