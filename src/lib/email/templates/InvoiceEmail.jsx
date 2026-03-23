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
  logoCell: {
    verticalAlign: "middle",
    width: "50%",
  },
  invoiceMetaCell: {
    verticalAlign: "middle",
    textAlign: "right",
    width: "50%",
  },
  brandName: {
    display: "inline-block",
    verticalAlign: "middle",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 0 10px",
  },
  invoiceLabel: {
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 4px",
    textAlign: "right",
  },
  invoiceId: {
    color: "#06b6d4",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 0 4px",
    textAlign: "right",
  },
  invoiceDate: {
    color: "#94a3b8",
    fontSize: "12px",
    margin: 0,
    textAlign: "right",
  },
  titleSection: {
    padding: "32px 32px 20px",
    textAlign: "center",
  },
  receiptIcon: {
    fontSize: "36px",
    margin: "0 0 12px",
    display: "block",
  },
  pageTitle: {
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  pageSubtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },
  greetingSection: {
    padding: "0 32px 20px",
  },
  greetingText: {
    color: "#cbd5e1",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.6",
  },
  lineItemCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    overflow: "hidden",
    margin: "0 32px 20px",
  },
  lineItemHeader: {
    backgroundColor: "#1e293b",
    padding: "12px 20px",
    borderBottom: "1px solid #334155",
  },
  lineItemHeaderText: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  lineItemRow: {
    padding: "16px 20px",
    borderBottom: "1px solid #1e293b",
  },
  lineItemDescCell: {
    width: "70%",
    verticalAlign: "middle",
  },
  lineItemAmountCell: {
    width: "30%",
    textAlign: "right",
    verticalAlign: "middle",
  },
  lineItemName: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 2px",
  },
  lineItemSub: {
    color: "#64748b",
    fontSize: "12px",
    margin: 0,
  },
  lineItemAmount: {
    color: "#10b981",
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
  totalRow: {
    padding: "16px 20px",
    backgroundColor: "#0a1628",
  },
  totalLabelCell: {
    width: "70%",
    verticalAlign: "middle",
  },
  totalAmountCell: {
    width: "30%",
    textAlign: "right",
    verticalAlign: "middle",
  },
  totalLabel: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    margin: 0,
  },
  totalAmount: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
  },
  gstNote: {
    color: "#64748b",
    fontSize: "11px",
    fontStyle: "italic",
    textAlign: "center",
    margin: "8px 32px 20px",
  },
  paymentDetailsCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    padding: "20px 24px",
    margin: "0 32px 24px",
  },
  paymentTitle: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 14px",
  },
  paymentRow: {
    marginBottom: "12px",
  },
  paymentLabel: {
    color: "#64748b",
    fontSize: "12px",
    margin: "0 0 2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  paymentValue: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "500",
    margin: 0,
  },
  paymentDivider: {
    borderTop: "1px solid #334155",
    margin: "12px 0",
  },
  statusBadge: {
    display: "inline-block",
    backgroundColor: "#064e3b",
    border: "1px solid #10b981",
    borderRadius: "20px",
    padding: "3px 12px",
    margin: "8px 0 0",
  },
  statusBadgeText: {
    color: "#10b981",
    fontSize: "12px",
    fontWeight: "bold",
    margin: 0,
  },
  ctaSection: {
    padding: "4px 32px 36px",
    textAlign: "center",
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
};

export function InvoiceEmail({
  name,
  email,
  invoiceId,
  plan,
  amount,
  paymentId,
  paymentDate,
  expiryDate,
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your OptionsGyani payment receipt — Invoice #{invoiceId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Row>
              <Column style={styles.logoCell}>
                <Img
                  src="https://optionsgyani.com/logo.png"
                  width="40"
                  height="40"
                  alt="OptionsGyani Logo"
                  style={{ display: "inline-block", verticalAlign: "middle" }}
                />
                <Text style={styles.brandName}>OptionsGyani</Text>
              </Column>
              <Column style={styles.invoiceMetaCell}>
                <Text style={styles.invoiceLabel}>Invoice</Text>
                <Text style={styles.invoiceId}>#{invoiceId || "INV-000000"}</Text>
                <Text style={styles.invoiceDate}>{paymentDate || "—"}</Text>
              </Column>
            </Row>
          </Section>

          {/* Title */}
          <Section style={styles.titleSection}>
            <Text style={styles.receiptIcon}>🧾</Text>
            <Text style={styles.pageTitle}>Payment Confirmed</Text>
            <Text style={styles.pageSubtitle}>Thank you for your purchase</Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.greetingSection}>
            <Text style={styles.greetingText}>
              Hi <strong style={{ color: "#ffffff" }}>{name || "there"}</strong>, your payment has
              been successfully processed. Your subscription is now active. A copy of this
              receipt has been sent to{" "}
              <strong style={{ color: "#06b6d4" }}>{email}</strong>.
            </Text>
          </Section>

          {/* Line Item */}
          <Section style={styles.lineItemCard}>
            <Section style={styles.lineItemHeader}>
              <Text style={styles.lineItemHeaderText}>Order Summary</Text>
            </Section>
            <Section style={styles.lineItemRow}>
              <Row>
                <Column style={styles.lineItemDescCell}>
                  <Text style={styles.lineItemName}>{plan || "Pro Plan"}</Text>
                  <Text style={styles.lineItemSub}>OptionsGyani Subscription</Text>
                </Column>
                <Column style={styles.lineItemAmountCell}>
                  <Text style={styles.lineItemAmount}>₹{amount || "—"}</Text>
                </Column>
              </Row>
            </Section>
            <Section style={styles.totalRow}>
              <Row>
                <Column style={styles.totalLabelCell}>
                  <Text style={styles.totalLabel}>Total Paid</Text>
                </Column>
                <Column style={styles.totalAmountCell}>
                  <Text style={styles.totalAmount}>₹{amount || "—"}</Text>
                </Column>
              </Row>
            </Section>
          </Section>

          {/* GST Note */}
          <Text style={styles.gstNote}>
            Prices inclusive of applicable taxes (GST)
          </Text>

          {/* Payment Details */}
          <Section style={styles.paymentDetailsCard}>
            <Text style={styles.paymentTitle}>Payment Details</Text>

            <Section style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment ID</Text>
              <Text style={styles.paymentValue}>{paymentId || "—"}</Text>
            </Section>

            <Hr style={styles.paymentDivider} />

            <Section style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment Date</Text>
              <Text style={styles.paymentValue}>{paymentDate || "—"}</Text>
            </Section>

            <Hr style={styles.paymentDivider} />

            <Section style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subscription Valid Until</Text>
              <Text style={styles.paymentValue}>{expiryDate || "—"}</Text>
            </Section>

            <Hr style={styles.paymentDivider} />

            <Section style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Status</Text>
              <span style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>✓ PAID</Text>
              </span>
            </Section>
          </Section>

          {/* Download CTA */}
          <Section style={styles.ctaSection}>
            <Button
              href="https://optionsgyani.com/profile"
              style={styles.ctaButton}
            >
              Download Receipt →
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Questions? Contact{" "}
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

export default InvoiceEmail;
