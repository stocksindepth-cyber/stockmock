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
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const mono = "'SF Mono', 'Fira Code', monospace";

  return (
    <Html lang="en">
      <Head />
      <Preview>Payment confirmed — ₹{amount} receipt for {plan || "OptionsGyani Pro"}</Preview>
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
                    fontFamily: mono,
                  }}
                >
                  #{invoiceId || "INV-000000"}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Status Hero */}
          <Section
            style={{
              padding: "44px 40px 36px",
              textAlign: "center",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            {/* Green checkmark circle */}
            <Section
              style={{
                width: "56px",
                height: "56px",
                backgroundColor: "rgba(34,197,94,0.1)",
                border: "2px solid rgba(34,197,94,0.4)",
                borderRadius: "50%",
                margin: "0 auto 20px",
                lineHeight: "52px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "#22c55e",
                  fontSize: "24px",
                  fontWeight: "700",
                  margin: "0",
                  lineHeight: "52px",
                  fontFamily: fontStack,
                }}
              >
                &#10003;
              </Text>
            </Section>
            <Text
              style={{
                color: "#f4f4f5",
                fontSize: "22px",
                fontWeight: "600",
                margin: "0 0 8px",
                fontFamily: fontStack,
              }}
            >
              Payment Confirmed
            </Text>
            <Text
              style={{
                color: "#22c55e",
                fontSize: "28px",
                fontWeight: "700",
                margin: "0 0 8px",
                letterSpacing: "-0.5px",
                fontFamily: fontStack,
              }}
            >
              &#8377;{amount || "—"} &middot; {plan || "Pro Plan"}
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              {paymentDate || "—"}
            </Text>
          </Section>

          {/* Receipt Table */}
          <Section style={{ padding: "0 40px" }}>
            {/* Header row */}
            <Row
              style={{
                backgroundColor: "#161618",
                borderBottom: "1px solid #1c1c1e",
              }}
            >
              <Column
                style={{
                  padding: "12px 0",
                  width: "50%",
                }}
              >
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Description
                </Text>
              </Column>
              <Column
                style={{
                  padding: "12px 0",
                  width: "50%",
                  textAlign: "right",
                }}
              >
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Details
                </Text>
              </Column>
            </Row>

            {/* Invoice to */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "top" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Invoice To
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "top", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0 0 2px",
                    fontFamily: fontStack,
                  }}
                >
                  {name || "—"}
                </Text>
                <Text
                  style={{
                    color: "#a1a1aa",
                    fontSize: "12px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {email || "—"}
                </Text>
              </Column>
            </Row>

            {/* Invoice # */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Invoice #
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: mono,
                  }}
                >
                  {invoiceId || "—"}
                </Text>
              </Column>
            </Row>

            {/* Payment Date */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Payment Date
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {paymentDate || "—"}
                </Text>
              </Column>
            </Row>

            {/* Payment Method */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Payment Method
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Razorpay
                </Text>
              </Column>
            </Row>

            {/* Subscription */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Subscription
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {plan || "Pro Plan"}
                </Text>
              </Column>
            </Row>

            {/* Valid Until */}
            <Row style={{ borderBottom: "1px solid #1c1c1e" }}>
              <Column style={{ padding: "14px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Valid Until
                </Text>
              </Column>
              <Column
                style={{ padding: "14px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {expiryDate || "—"}
                </Text>
              </Column>
            </Row>

            {/* Total Row — highlighted */}
            <Row
              style={{
                backgroundColor: "rgba(34,211,238,0.05)",
                borderTop: "1px solid rgba(34,211,238,0.15)",
              }}
            >
              <Column style={{ padding: "16px 0", width: "50%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "14px",
                    fontWeight: "700",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Total Paid
                </Text>
              </Column>
              <Column
                style={{ padding: "16px 0", width: "50%", verticalAlign: "middle", textAlign: "right" }}
              >
                <Text
                  style={{
                    color: "#22d3ee",
                    fontSize: "18px",
                    fontWeight: "700",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  &#8377;{amount || "—"}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Payment ID */}
          <Section style={{ padding: "24px 40px", borderTop: "1px solid #1c1c1e" }}>
            <Text
              style={{
                color: "#52525b",
                fontSize: "12px",
                margin: "0 0 4px",
                fontFamily: fontStack,
              }}
            >
              Payment Reference
            </Text>
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "13px",
                margin: "0",
                fontFamily: mono,
              }}
            >
              {paymentId || "—"}
            </Text>
          </Section>

          {/* Note */}
          <Section
            style={{
              padding: "0 40px 24px",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              Prices include all applicable taxes. For a GST invoice, contact{" "}
              <Link
                href="mailto:support@optionsgyani.com"
                style={{ color: "#22d3ee", textDecoration: "none" }}
              >
                support@optionsgyani.com
              </Link>
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ padding: "32px 40px", textAlign: "center" }}>
            <Button
              href="https://optionsgyani.com/profile"
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
              View Account &amp; Subscription &rarr;
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
              Questions?{" "}
              <Link
                href="mailto:support@optionsgyani.com"
                style={{ color: "#22d3ee", textDecoration: "none" }}
              >
                support@optionsgyani.com
              </Link>
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              &copy; 2026 OptionsGyani &middot; Not SEBI registered &middot; Educational use only
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvoiceEmail;
