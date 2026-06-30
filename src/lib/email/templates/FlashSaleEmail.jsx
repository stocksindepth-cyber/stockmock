import {
  Html, Head, Body, Container, Section, Row, Column,
  Img, Text, Button, Link, Hr, Preview,
} from "@react-email/components";

export function FlashSaleEmail({ name }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const displayName = name || "trader";
  const expiryLabel = "7 July 2026, midnight";

  return (
    <Html lang="en">
      <Head />
      <Preview>⚡ 30% off OptionsGyani Pro — coupon OG30 · expires {expiryLabel}</Preview>
      <Body style={{ backgroundColor: "#09090b", margin: "0", padding: "32px 0", fontFamily: fontStack }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#0f0f0f", borderRadius: "16px", border: "1px solid #1c1c1e", overflow: "hidden" }}>

          {/* Logo bar */}
          <Section style={{ padding: "18px 40px", borderBottom: "1px solid #1c1c1e" }}>
            <Img src="https://optionsgyani.com/logo.png" width="28" height="28" alt="OptionsGyani" style={{ display: "inline-block", verticalAlign: "middle" }} />
            <Text style={{ display: "inline-block", verticalAlign: "middle", color: "#f4f4f5", fontSize: "15px", fontWeight: "600", margin: "0 0 0 9px", fontFamily: fontStack }}>OptionsGyani</Text>
          </Section>

          {/* FOMO hero — dark amber/gold */}
          <Section style={{ background: "linear-gradient(135deg, #1a0f00 0%, #2d1900 50%, #1a0f00 100%)", padding: "48px 40px 40px", borderBottom: "1px solid #2d1c00" }}>
            <Text style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 16px", fontFamily: fontStack }}>
              ⚡ 48-hour flash sale — ends {expiryLabel}
            </Text>
            <Text style={{ color: "#f4f4f5", fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: "1.2", margin: "0 0 16px", fontFamily: fontStack }}>
              {displayName}, here's 30% off Pro — just for you.
            </Text>
            <Text style={{ color: "#a16207", fontSize: "15px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
              You signed up. You explored. But you haven't gone Pro yet.
              We want to make it a no-brainer — so we're cutting the price by 30% for the next 48 hours.
            </Text>
          </Section>

          {/* Coupon code block — the hero element */}
          <Section style={{ padding: "36px 40px 0" }}>
            <Section style={{ backgroundColor: "#161618", border: "2px dashed #f59e0b", borderRadius: "14px", padding: "28px", textAlign: "center" }}>
              <Text style={{ color: "#78716c", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 10px", fontFamily: fontStack }}>
                Your exclusive coupon code
              </Text>
              <Text style={{ color: "#f59e0b", fontSize: "42px", fontWeight: "900", letterSpacing: "0.12em", margin: "0 0 10px", fontFamily: "'Courier New', monospace" }}>
                OG30
              </Text>
              <Text style={{ color: "#a16207", fontSize: "13px", margin: "0", fontFamily: fontStack }}>
                30% off Pro or Elite · applies at checkout
              </Text>
            </Section>
          </Section>

          {/* Price comparison */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Row>
              <Column style={{ width: "50%", paddingRight: "8px" }}>
                <Section style={{ backgroundColor: "#0d0d0d", border: "1px solid #1c1c1e", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
                  <Text style={{ color: "#52525b", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px", fontFamily: fontStack }}>Normal price</Text>
                  <Text style={{ color: "#52525b", fontSize: "28px", fontWeight: "700", textDecoration: "line-through", margin: "0", fontFamily: fontStack }}>₹499<Text style={{ fontSize: "13px", fontFamily: fontStack }}>/mo</Text></Text>
                </Section>
              </Column>
              <Column style={{ width: "50%", paddingLeft: "8px" }}>
                <Section style={{ backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "10px", padding: "18px", textAlign: "center" }}>
                  <Text style={{ color: "#f59e0b", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px", fontFamily: fontStack }}>With OG30</Text>
                  <Text style={{ color: "#fbbf24", fontSize: "28px", fontWeight: "800", margin: "0", fontFamily: fontStack }}>₹349<Text style={{ fontSize: "13px", fontFamily: fontStack }}>/mo</Text></Text>
                </Section>
              </Column>
            </Row>
            <Text style={{ color: "#52525b", fontSize: "11px", textAlign: "center", margin: "12px 0 0", fontFamily: fontStack }}>
              You save ₹150 every month · ₹1,800/year
            </Text>
          </Section>

          {/* What you unlock */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Text style={{ color: "#f4f4f5", fontSize: "14px", fontWeight: "600", margin: "0 0 14px", fontFamily: fontStack }}>What unlocks with Pro:</Text>
            {[
              ["∞", "Unlimited backtests", "No 5/day cap — ever"],
              ["📊", "8+ years of NSE data", "NIFTY, BANKNIFTY, FINNIFTY from 2016"],
              ["💾", "Save strategies", "Build a library of tested setups"],
              ["🔔", "20 IV alerts", "Email alerts when IVP crosses your level"],
            ].map(([icon, title, sub]) => (
              <Row key={title} style={{ marginBottom: "10px" }}>
                <Column style={{ width: "28px", verticalAlign: "top" }}>
                  <Text style={{ fontSize: "16px", margin: "0", fontFamily: fontStack }}>{icon}</Text>
                </Column>
                <Column style={{ verticalAlign: "top", paddingLeft: "8px" }}>
                  <Text style={{ color: "#f4f4f5", fontSize: "13px", fontWeight: "600", margin: "0 0 1px", fontFamily: fontStack }}>{title}</Text>
                  <Text style={{ color: "#52525b", fontSize: "12px", margin: "0", fontFamily: fontStack }}>{sub}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* FOMO social proof */}
          <Section style={{ padding: "24px 40px 0" }}>
            <Section style={{ backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px", padding: "16px 20px" }}>
              <Text style={{ color: "#818cf8", fontSize: "13px", margin: "0", lineHeight: "1.6", fontFamily: fontStack }}>
                <strong style={{ color: "#a5b4fc" }}>23 traders joined OptionsGyani this week</strong> — all without a single ad.
                Word is spreading. The traders who lock in Pro now get the edge before the price goes back up.
              </Text>
            </Section>
          </Section>

          {/* Urgency line */}
          <Section style={{ padding: "20px 40px 0", textAlign: "center" }}>
            <Text style={{ color: "#ef4444", fontSize: "13px", fontWeight: "700", margin: "0", fontFamily: fontStack }}>
              ⏰ This offer expires {expiryLabel}. No extensions.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "24px 40px 40px", textAlign: "center" }}>
            <Button
              href="https://optionsgyani.com/pricing"
              style={{ backgroundColor: "#f59e0b", color: "#000000", borderRadius: "10px", padding: "16px 40px", fontSize: "15px", fontWeight: "800", textDecoration: "none", display: "inline-block", letterSpacing: "0.01em", fontFamily: fontStack }}
            >
              Claim 30% Off → Use Code OG30
            </Button>
            <Text style={{ color: "#52525b", fontSize: "11px", margin: "12px 0 0", fontFamily: fontStack }}>
              Cancel anytime · Secure checkout via Razorpay · +18% GST at checkout
            </Text>
          </Section>

          <Hr style={{ border: "none", borderTop: "1px solid #1c1c1e", margin: "0" }} />
          <Section style={{ padding: "20px 40px", textAlign: "center" }}>
            <Text style={{ color: "#3f3f46", fontSize: "12px", margin: "0 0 4px", fontFamily: fontStack }}>
              © 2026 OptionsGyani · Educational use only · Not SEBI registered
            </Text>
            <Link href="https://optionsgyani.com/profile" style={{ color: "#3f3f46", fontSize: "12px", textDecoration: "underline", fontFamily: fontStack }}>
              Unsubscribe
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default FlashSaleEmail;
