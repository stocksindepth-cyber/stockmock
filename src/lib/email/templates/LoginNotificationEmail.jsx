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
  securityBadge: {
    backgroundColor: "#1e3a5f",
    border: "1px solid #1d4ed8",
    borderRadius: "8px",
    padding: "4px 12px",
    display: "inline-block",
    margin: "0 0 0 12px",
    verticalAlign: "middle",
  },
  securityBadgeText: {
    color: "#60a5fa",
    fontSize: "11px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "0.5px",
  },
  heroSection: {
    padding: "36px 32px 24px",
  },
  shieldIcon: {
    fontSize: "40px",
    margin: "0 0 16px",
    display: "block",
    textAlign: "center",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 10px",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#94a3b8",
    fontSize: "15px",
    margin: "0 0 24px",
    textAlign: "center",
    lineHeight: "1.5",
  },
  greetingText: {
    color: "#cbd5e1",
    fontSize: "15px",
    margin: "0 0 24px",
    lineHeight: "1.6",
  },
  detailsCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    padding: "24px",
    margin: "0 32px 24px",
    border: "1px solid #334155",
  },
  detailsTitle: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 16px",
  },
  detailRow: {
    marginBottom: "14px",
  },
  detailLabel: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailValue: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    margin: 0,
  },
  dividerLine: {
    borderTop: "1px solid #334155",
    margin: "16px 0",
  },
  alertSection: {
    backgroundColor: "#1c1917",
    border: "1px solid #ea580c",
    borderRadius: "10px",
    padding: "20px 24px",
    margin: "0 32px 28px",
  },
  alertTitle: {
    color: "#f97316",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  alertText: {
    color: "#cbd5e1",
    fontSize: "13px",
    margin: "0 0 16px",
    lineHeight: "1.5",
  },
  secureButton: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "10px 24px",
    fontSize: "13px",
    fontWeight: "bold",
    textDecoration: "none",
    display: "inline-block",
  },
  ctaSection: {
    padding: "4px 32px 36px",
    textAlign: "center",
  },
  ctaText: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0 0 16px",
  },
  ctaButton: {
    backgroundColor: "#06b6d4",
    color: "#ffffff",
    borderRadius: "8px",
    padding: "12px 32px",
    fontSize: "14px",
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
  unsubscribeText: {
    color: "#475569",
    fontSize: "11px",
    margin: "8px 0 0",
  },
};

export function LoginNotificationEmail({
  name,
  email,
  loginTime,
  ipAddress,
  device,
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New sign-in detected on your OptionsGyani account — verify it's you</Preview>
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
                <span style={styles.securityBadge}>
                  <Text style={styles.securityBadgeText}>SECURITY ALERT</Text>
                </span>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={styles.heroSection}>
            <Text style={styles.shieldIcon}>🔐</Text>
            <Text style={styles.heroTitle}>New Sign-in to Your Account</Text>
            <Text style={styles.heroSubtitle}>
              We detected a new sign-in to your OptionsGyani account.
              <br />
              If this was you, no action is needed.
            </Text>
            <Text style={styles.greetingText}>
              Hi {name || "there"}, your account <strong style={{ color: "#06b6d4" }}>{email}</strong> was
              just accessed. Here are the details of this sign-in:
            </Text>
          </Section>

          {/* Details Card */}
          <Section style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Sign-in Details</Text>

            <Section style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date &amp; Time</Text>
              <Text style={styles.detailValue}>{loginTime || "—"}</Text>
            </Section>

            <Hr style={styles.dividerLine} />

            <Section style={styles.detailRow}>
              <Text style={styles.detailLabel}>Device / Browser</Text>
              <Text style={styles.detailValue}>{device || "—"}</Text>
            </Section>

            <Hr style={styles.dividerLine} />

            <Section style={styles.detailRow}>
              <Text style={styles.detailLabel}>IP Address</Text>
              <Text style={styles.detailValue}>{ipAddress || "—"}</Text>
            </Section>
          </Section>

          {/* Alert Box */}
          <Section style={styles.alertSection}>
            <Text style={styles.alertTitle}>⚠️ Not you? Act now.</Text>
            <Text style={styles.alertText}>
              If you did not sign in, your account may be compromised. Secure your account
              immediately by changing your password and enabling two-factor authentication.
            </Text>
            <Button
              href="https://optionsgyani.com/profile"
              style={styles.secureButton}
            >
              Secure My Account →
            </Button>
          </Section>

          {/* Reassurance CTA */}
          <Section style={styles.ctaSection}>
            <Text style={styles.ctaText}>
              This was you? Great — head back and keep trading smarter.
            </Text>
            <Button
              href="https://optionsgyani.com"
              style={styles.ctaButton}
            >
              Go to Dashboard
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              This is an automated security notification for{" "}
              <strong style={{ color: "#94a3b8" }}>{email}</strong>
            </Text>
            <Text style={styles.footerText}>
              © 2026 OptionsGyani Analytics · Not SEBI registered · Educational use only
            </Text>
            <Text style={styles.unsubscribeText}>
              You cannot unsubscribe from security notifications.{" "}
              <Link href="https://optionsgyani.com/profile" style={styles.footerLink}>
                Manage account preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default LoginNotificationEmail;
