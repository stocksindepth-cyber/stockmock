import {
  Html, Head, Body, Container, Section, Row, Column,
  Img, Text, Button, Link, Hr, Preview,
} from "@react-email/components";

// Renewal reminder sent ~3 days before a monthly/annual plan lapses.
// Honest, low-pressure: remind them what they'd lose, one-click re-subscribe.
export function RenewalEmail({ name, plan, expiryDate, daysLeft }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const displayName = name || "trader";
  const planLabel = (plan || "pro").charAt(0).toUpperCase() + (plan || "pro").slice(1);
  const daysText = daysLeft === 1 ? "tomorrow" : daysLeft > 0 ? `in ${daysLeft} days` : "today";

  const keeps = [
    { icon: "∞", label: "Unlimited backtests", sub: "No 3/day cap" },
    { icon: "📊", label: "8+ years of NSE data", sub: "2016 → today" },
    { icon: "🔔", label: "IV alerts + OI analysis", sub: "Stay ahead of the move" },
    { icon: "📈", label: "Full trade logs + export", sub: "Every trade, no lock" },
  ];

  return (
    <Html lang="en">
      <Head />
      <Preview>{displayName}, your OptionsGyani {planLabel} renews {daysText}</Preview>
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
          <Section style={{ background: "linear-gradient(135deg, #001a12 0%, #00120d 50%, #000c08 100%)", padding: "48px 40px 36px", borderBottom: "1px solid #1c1c1e" }}>
            <Text style={{ color: "#34d399", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 14px", fontFamily: fontStack }}>
              Your {planLabel} plan renews {daysText}
            </Text>
            <Text style={{ color: "#f4f4f5", fontSize: "28px", fontWeight: "700", letterSpacing: "-0.5px", lineHeight: "1.25", margin: "0 0 14px", fontFamily: fontStack }}>
              {displayName}, keep your edge — don't drop back to 3 backtests a day.
            </Text>
            <Text style={{ color: "#a1a1aa", fontSize: "15px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
              Your {planLabel} access ends on {expiryDate}. Renew in one tap and nothing changes — same unlimited backtesting, same 8+ years of data.
            </Text>
          </Section>

          {/* What you keep */}
          <Section style={{ padding: "36px 40px 8px" }}>
            <Text style={{ color: "#f4f4f5", fontSize: "15px", fontWeight: "600", margin: "0 0 20px", fontFamily: fontStack }}>
              What you keep as {planLabel}:
            </Text>
            {keeps.map((f) => (
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

          {/* CTA */}
          <Section style={{ padding: "24px 40px 40px", textAlign: "center" }}>
            <Button href="https://www.optionsgyani.com/pricing" style={{ backgroundColor: "#10b981", color: "#000000", borderRadius: "8px", padding: "14px 36px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-block", fontFamily: fontStack }}>
              Renew {planLabel} →
            </Button>
            <Text style={{ color: "#52525b", fontSize: "12px", margin: "14px 0 0", fontFamily: fontStack }}>
              Secure checkout via Razorpay · Cancel anytime · Questions? support@optionsgyani.com
            </Text>
          </Section>

          <Hr style={{ border: "none", borderTop: "1px solid #1c1c1e", margin: "0" }} />
          <Section style={{ padding: "20px 40px", textAlign: "center" }}>
            <Text style={{ color: "#3f3f46", fontSize: "12px", margin: "0 0 4px", fontFamily: fontStack }}>
              © 2026 OptionsGyani · Educational use only · Not SEBI registered
            </Text>
            <Link href="https://www.optionsgyani.com/profile" style={{ color: "#3f3f46", fontSize: "12px", textDecoration: "underline", fontFamily: fontStack }}>
              Manage subscription
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default RenewalEmail;
