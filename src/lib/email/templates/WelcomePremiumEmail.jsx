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

const styles = {
  body: {
    backgroundColor: "#0f172a",
    margin: 0,
    padding: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#0f172a",
    padding: "24px 32px",
    borderBottom: "1px solid #334155",
  },
  logoRow: {
    verticalAlign: "middle",
  },
  brandName: {
    display: "inline-block",
    verticalAlign: "middle",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 0 10px",
  },
  premiumBadge: {
    backgroundColor: "#451a03",
    border: "1px solid #f59e0b",
    borderRadius: "6px",
    padding: "3px 10px",
    display: "inline-block",
    margin: "0 0 0 12px",
    verticalAlign: "middle",
  },
  premiumBadgeText: {
    color: "#f59e0b",
    fontSize: "11px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "0.5px",
  },
  heroBanner: {
    background: "linear-gradient(135deg, #1c1400 0%, #292100 50%, #1e293b 100%)",
    borderBottom: "2px solid #f59e0b",
    padding: "40px 32px 32px",
    textAlign: "center",
  },
  crownIcon: {
    fontSize: "48px",
    margin: "0 0 16px",
    display: "block",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 10px",
    lineHeight: "1.3",
  },
  heroHighlight: {
    color: "#f59e0b",
  },
  heroSubtitle: {
    color: "#d97706",
    fontSize: "15px",
    margin: "0 0 8px",
    lineHeight: "1.5",
  },
  greetingSection: {
    padding: "28px 32px 20px",
  },
  greetingText: {
    color: "#cbd5e1",
    fontSize: "15px",
    margin: "0 0 20px",
    lineHeight: "1.6",
  },
  planCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #f59e0b",
    padding: "24px",
    margin: "0 32px 24px",
    position: "relative",
  },
  planCardTitle: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 16px",
  },
  planRow: {
    marginBottom: "14px",
  },
  planLabel: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  planValue: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
  },
  planValueAccent: {
    color: "#f59e0b",
    fontSize: "15px",
    fontWeight: "600",
    margin: 0,
  },
  planDivider: {
    borderTop: "1px solid #334155",
    margin: "14px 0",
  },
  featuresSection: {
    padding: "0 32px 28px",
  },
  featuresSectionTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "bold",
    margin: "0 0 16px",
  },
  featureItem: {
    padding: "10px 0",
    borderBottom: "1px solid #1e3a2e",
  },
  featureCheck: {
    color: "#10b981",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    marginRight: "10px",
    verticalAlign: "middle",
  },
  featureText: {
    color: "#cbd5e1",
    fontSize: "14px",
    display: "inline-block",
    verticalAlign: "middle",
    margin: 0,
  },
  investmentSection: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    padding: "20px 24px",
    margin: "0 32px 28px",
    textAlign: "center",
  },
  investmentText: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 6px",
    lineHeight: "1.6",
    fontStyle: "italic",
  },
  investmentHighlight: {
    color: "#10b981",
    fontWeight: "bold",
    fontStyle: "normal",
  },
  ctaSection: {
    padding: "4px 32px 36px",
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#f59e0b",
    color: "#0f172a",
    borderRadius: "8px",
    padding: "14px 36px",
    fontSize: "15px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
  },
  divider: {
    borderColor: "#334155",
    margin: "0",
  },
  footer: {
    padding: "24px 32px",
    textAlign: "center",
    backgroundColor: "#0f172a",
  },
  footerText: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 6px",
    lineHeight: "1.5",
  },
  footerLink: {
    color: "#06b6d4",
    textDecoration: "none",
  },
};

export function WelcomePremiumEmail({
  name,
  email,
  plan,
  expiryDate,
  features,
}) {
  const featureList = features && features.length > 0
    ? features
    : [
        "Unlimited backtesting runs on 8+ years NSE data",
        "Advanced Greeks analysis (Delta, Gamma, Theta, Vega)",
        "Live Option Chain with real-time IV percentile",
        "Strategy Builder with P&L simulator",
        "Priority email support",
        "Early access to new features",
      ];

  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to OptionsGyani Pro — your premium trading edge is unlocked!</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Row>
              <Column style={styles.logoRow}>
                <Img
                  src="https://optionsgyani.com/logo.png"
                  width="40"
                  height="40"
                  alt="OptionsGyani Logo"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
                <Text style={styles.brandName}>OptionsGyani</Text>
                <span style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </span>
              </Column>
            </Row>
          </Section>

          {/* Hero Banner */}
          <Section style={styles.heroBanner}>
            <Text style={styles.crownIcon}>👑</Text>
            <Text style={styles.heroTitle}>
              Welcome to{" "}
              <span style={styles.heroHighlight}>OptionsGyani Pro</span>{" "}
              🎉
            </Text>
            <Text style={styles.heroSubtitle}>
              You've unlocked the full power of professional options analytics.
              <br />
              Let's make every trade count.
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.greetingSection}>
            <Text style={styles.greetingText}>
              Hi <strong style={{ color: "#f59e0b" }}>{name || "there"}</strong>, your Pro subscription
              is now active on <strong style={{ color: "#94a3b8" }}>{email}</strong>. You now have
              access to every premium feature OptionsGyani has to offer.
            </Text>
          </Section>

          {/* Plan Details Card */}
          <Section style={styles.planCard}>
            <Text style={styles.planCardTitle}>Your Plan Details</Text>

            <Section style={styles.planRow}>
              <Text style={styles.planLabel}>Plan</Text>
              <Text style={styles.planValueAccent}>{plan || "Pro Plan"}</Text>
            </Section>

            <Hr style={styles.planDivider} />

            <Section style={styles.planRow}>
              <Text style={styles.planLabel}>Account</Text>
              <Text style={styles.planValue}>{email}</Text>
            </Section>

            <Hr style={styles.planDivider} />

            <Section style={styles.planRow}>
              <Text style={styles.planLabel}>Valid Until</Text>
              <Text style={styles.planValue}>{expiryDate || "—"}</Text>
            </Section>
          </Section>

          {/* Unlocked Features */}
          <Section style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>Your unlocked features</Text>
            {featureList.map((feature, index) => (
              <Section key={index} style={styles.featureItem}>
                <Text style={{ margin: 0 }}>
                  <span style={styles.featureCheck}>✓</span>
                  <span style={styles.featureText}>{feature}</span>
                </Text>
              </Section>
            ))}
          </Section>

          {/* Investment ROI Note */}
          <Section style={styles.investmentSection}>
            <Text style={styles.investmentText}>
              Your investment in Pro — now let it earn back{" "}
              <span style={styles.investmentHighlight}>10x</span> in smarter trades.
              <br />
              One well-timed backtest pays for years of subscription.
            </Text>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Button
              href="https://optionsgyani.com/backtest"
              style={styles.ctaButton}
            >
              Explore Your Pro Features →
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Need help?{" "}
              <Link href="mailto:support@optionsgyani.com" style={styles.footerLink}>
                support@optionsgyani.com
              </Link>
            </Text>
            <Text style={styles.footerText}>
              © 2026 OptionsGyani Analytics · Not SEBI registered · Educational use only
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default WelcomePremiumEmail;
