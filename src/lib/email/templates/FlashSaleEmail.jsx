import {
  Html, Head, Body, Container, Section, Row, Column,
  Img, Text, Button, Link, Hr, Preview,
} from "@react-email/components";

// Formerly a coupon flash-sale email. OptionsGyani no longer sells paid plans —
// this template now announces the free-for-life Pro unlock via the Dhan referral.
export function FlashSaleEmail({ name }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const displayName = name || "trader";

  return (
    <Html lang="en">
      <Head />
      <Preview>Pro is now free for life — no coupon, no payment, ever</Preview>
      <Body style={{ backgroundColor: "#09090b", margin: "0", padding: "32px 0", fontFamily: fontStack }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#0f0f0f", borderRadius: "16px", border: "1px solid #1c1c1e", overflow: "hidden" }}>

          {/* Logo bar */}
          <Section style={{ padding: "18px 40px", borderBottom: "1px solid #1c1c1e" }}>
            <Img src="https://www.optionsgyani.com/logo.png" width="28" height="28" alt="OptionsGyani" style={{ display: "inline-block", verticalAlign: "middle" }} />
            <Text style={{ display: "inline-block", verticalAlign: "middle", color: "#f4f4f5", fontSize: "15px", fontWeight: "600", margin: "0 0 0 9px", fontFamily: fontStack }}>OptionsGyani</Text>
          </Section>

          {/* Hero */}
          <Section style={{ background: "linear-gradient(135deg, #1a0f00 0%, #2d1900 50%, #1a0f00 100%)", padding: "48px 40px 40px", borderBottom: "1px solid #2d1c00" }}>
            <Text style={{ color: "#f59e0b", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 16px", fontFamily: fontStack }}>
              Big change — nothing is for sale anymore
            </Text>
            <Text style={{ color: "#f4f4f5", fontSize: "32px", fontWeight: "800", letterSpacing: "-0.5px", lineHeight: "1.2", margin: "0 0 16px", fontFamily: fontStack }}>
              {displayName}, Pro is now free. For life.
            </Text>
            <Text style={{ color: "#a16207", fontSize: "15px", lineHeight: "1.7", margin: "0", fontFamily: fontStack }}>
              I&apos;ve removed all paid plans from OptionsGyani. No coupons, no subscriptions, no checkout.
              Pro unlocks free when you open a Dhan account through my referral link — that referral
              commission is what keeps the platform running.
            </Text>
          </Section>

          {/* How it works */}
          <Section style={{ padding: "36px 40px 0" }}>
            <Section style={{ backgroundColor: "#161618", border: "2px dashed #f59e0b", borderRadius: "14px", padding: "28px", textAlign: "center" }}>
              <Text style={{ color: "#78716c", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 10px", fontFamily: fontStack }}>
                How to unlock Pro free
              </Text>
              <Text style={{ color: "#f59e0b", fontSize: "20px", fontWeight: "800", margin: "0 0 10px", fontFamily: fontStack }}>
                Open a free Dhan account → share your first-trade snapshot → Pro forever
              </Text>
              <Text style={{ color: "#a16207", fontSize: "13px", margin: "0", fontFamily: fontStack }}>
                ₹0 AMC lifetime · ₹20/order · the broker I personally trade with
              </Text>
            </Section>
          </Section>

          {/* What you unlock */}
          <Section style={{ padding: "28px 40px 0" }}>
            <Text style={{ color: "#f4f4f5", fontSize: "14px", fontWeight: "600", margin: "0 0 14px", fontFamily: fontStack }}>What unlocks with Pro:</Text>
            {[
              ["∞", "Unlimited backtests", "No daily cap — ever"],
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

          {/* Honesty note */}
          <Section style={{ padding: "24px 40px 0" }}>
            <Section style={{ backgroundColor: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "10px", padding: "16px 20px" }}>
              <Text style={{ color: "#818cf8", fontSize: "13px", margin: "0", lineHeight: "1.6", fontFamily: fontStack }}>
                <strong style={{ color: "#a5b4fc" }}>Full transparency:</strong> the Dhan link is a referral link and
                I earn a commission when you open an account. That commission funds the free tools — that&apos;s the
                entire business model. You never have to open an account to keep using the free tier.
              </Text>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "28px 40px 40px", textAlign: "center" }}>
            <Button
              href="https://www.optionsgyani.com/unlock"
              style={{ backgroundColor: "#f59e0b", color: "#000000", borderRadius: "10px", padding: "16px 40px", fontSize: "15px", fontWeight: "800", textDecoration: "none", display: "inline-block", letterSpacing: "0.01em", fontFamily: fontStack }}
            >
              Unlock Pro Free →
            </Button>
            <Text style={{ color: "#52525b", fontSize: "11px", margin: "12px 0 0", fontFamily: fontStack }}>
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

export default FlashSaleEmail;
