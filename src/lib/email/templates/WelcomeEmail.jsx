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
  logoImg: {
    display: "inline-block",
    verticalAlign: "middle",
  },
  brandName: {
    display: "inline-block",
    verticalAlign: "middle",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "10px",
    margin: "0 0 0 10px",
  },
  heroSection: {
    padding: "40px 32px 32px",
    textAlign: "center",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0 0 12px",
    lineHeight: "1.3",
  },
  heroSubtitle: {
    color: "#06b6d4",
    fontSize: "16px",
    margin: "0 0 32px",
    lineHeight: "1.5",
  },
  greetingText: {
    color: "#cbd5e1",
    fontSize: "16px",
    margin: "0 0 32px",
    lineHeight: "1.6",
    textAlign: "left",
  },
  featuresSectionTitle: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "bold",
    margin: "0 0 20px",
    textAlign: "left",
  },
  featuresSection: {
    padding: "0 32px 32px",
  },
  featureCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "12px",
    border: "1px solid #334155",
  },
  featureEmoji: {
    fontSize: "24px",
    margin: "0 0 8px",
    display: "block",
  },
  featureTitle: {
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "bold",
    margin: "0 0 6px",
  },
  featureDesc: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: 0,
    lineHeight: "1.5",
  },
  ctaSection: {
    padding: "8px 32px 40px",
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#06b6d4",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 32px",
    fontSize: "15px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
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

const features = [
  {
    emoji: "📊",
    title: "Backtest Strategies",
    description: "Test your options strategies against 8+ years of NSE historical data. Know before you trade.",
  },
  {
    emoji: "🔗",
    title: "Live Option Chain",
    description: "Real-time IV, Greeks, OI and PCR data for NIFTY and BANKNIFTY. See the market as pros do.",
  },
  {
    emoji: "🎮",
    title: "Trade Simulator",
    description: "Replay past market sessions and practice your strategies risk-free before going live.",
  },
];

export function WelcomeEmail({ name, email }) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to OptionsGyani — your edge in the options market starts here</Preview>
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
                  style={styles.logoImg}
                />
                <Text style={styles.brandName}>OptionsGyani</Text>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={styles.heroSection}>
            <Text style={styles.heroTitle}>Welcome to OptionsGyani</Text>
            <Text style={styles.heroSubtitle}>Your edge in the options market starts here</Text>
            <Text style={styles.greetingText}>
              Hi {name || "there"}, great to have you on board! Your account ({email}) is ready.
              OptionsGyani gives you professional-grade tools to backtest, analyze, and simulate
              NSE options strategies — all in one place.
            </Text>
          </Section>

          {/* Features */}
          <Section style={styles.featuresSection}>
            <Text style={styles.featuresSectionTitle}>What you can do today</Text>
            {features.map((feature) => (
              <Section key={feature.title} style={styles.featureCard}>
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </Section>
            ))}
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Button
              href="https://optionsgyani.com/backtest"
              style={styles.ctaButton}
            >
              Start Your First Backtest →
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions? Reach us at{" "}
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

export default WelcomeEmail;
