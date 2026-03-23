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

export function LoginNotificationEmail({ name, email, loginTime, ipAddress, device }) {
  const fontStack = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";
  const mono = "'SF Mono', 'Fira Code', monospace";

  return (
    <Html lang="en">
      <Head />
      <Preview>New sign-in detected on your OptionsGyani account — verify it was you</Preview>
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
            </Row>
          </Section>

          {/* Hero — orange-tinted security */}
          <Section
            style={{
              background:
                "linear-gradient(135deg, #060d1a 0%, #0c1929 50%, #060d1a 100%)",
              backgroundColor: "rgba(251,146,60,0.03)",
              padding: "44px 40px 36px",
              textAlign: "center",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Text
              style={{
                fontSize: "36px",
                margin: "0 0 16px",
                display: "block",
                lineHeight: "1",
              }}
            >
              &#9919;
            </Text>
            <Text
              style={{
                color: "#f4f4f5",
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
                margin: "0 0 12px",
                fontFamily: fontStack,
              }}
            >
              New sign-in detected
            </Text>
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              Someone just signed into your OptionsGyani account.
            </Text>
          </Section>

          {/* Details Table */}
          <Section style={{ padding: "0 40px" }}>
            {/* Time row */}
            <Row
              style={{
                padding: "16px 0",
                borderBottom: "1px solid #1c1c1e",
              }}
            >
              <Column style={{ width: "40%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Time
                </Text>
              </Column>
              <Column style={{ width: "60%", verticalAlign: "middle", textAlign: "right" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "14px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {loginTime || "—"}
                </Text>
              </Column>
            </Row>

            {/* Device row */}
            <Row
              style={{
                padding: "16px 0",
                borderBottom: "1px solid #1c1c1e",
              }}
            >
              <Column style={{ width: "40%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  Device
                </Text>
              </Column>
              <Column style={{ width: "60%", verticalAlign: "middle", textAlign: "right" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "14px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  {device || "—"}
                </Text>
              </Column>
            </Row>

            {/* IP row */}
            <Row style={{ padding: "16px 0" }}>
              <Column style={{ width: "40%", verticalAlign: "middle" }}>
                <Text
                  style={{
                    color: "#52525b",
                    fontSize: "13px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: fontStack,
                  }}
                >
                  IP Address
                </Text>
              </Column>
              <Column style={{ width: "60%", verticalAlign: "middle", textAlign: "right" }}>
                <Text
                  style={{
                    color: "#f4f4f5",
                    fontSize: "14px",
                    fontWeight: "500",
                    margin: "0",
                    fontFamily: mono,
                  }}
                >
                  {ipAddress || "—"}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Security Message */}
          <Section
            style={{
              padding: "28px 40px",
              borderTop: "1px solid #1c1c1e",
              borderBottom: "1px solid #1c1c1e",
            }}
          >
            <Text
              style={{
                color: "#a1a1aa",
                fontSize: "15px",
                lineHeight: "1.7",
                margin: "0",
                fontFamily: fontStack,
              }}
            >
              If this was you, no action is needed. If you don't recognize this sign-in,
              secure your account immediately — your credentials may be compromised.
            </Text>
          </Section>

          {/* Two Buttons */}
          <Section style={{ padding: "32px 40px 40px" }}>
            <Row>
              <Column style={{ width: "48%", verticalAlign: "middle" }}>
                <Button
                  href="https://optionsgyani.com"
                  style={{
                    backgroundColor: "transparent",
                    color: "#f4f4f5",
                    borderRadius: "8px",
                    padding: "13px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.01em",
                    textDecoration: "none",
                    display: "inline-block",
                    border: "1px solid #1c1c1e",
                    fontFamily: fontStack,
                    width: "100%",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  It was me &#10003;
                </Button>
              </Column>
              <Column style={{ width: "4%", verticalAlign: "middle" }} />
              <Column style={{ width: "48%", verticalAlign: "middle" }}>
                <Button
                  href="https://optionsgyani.com/profile"
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "13px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    letterSpacing: "0.01em",
                    textDecoration: "none",
                    display: "inline-block",
                    fontFamily: fontStack,
                    width: "100%",
                    textAlign: "center",
                    boxSizing: "border-box",
                  }}
                >
                  Secure My Account
                </Button>
              </Column>
            </Row>
          </Section>

          {/* Footer */}
          <Hr style={{ border: "none", borderTop: "1px solid #1c1c1e", margin: "0" }} />
          <Section style={{ padding: "24px 40px", textAlign: "center" }}>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0 0 6px",
                lineHeight: "1.6",
                fontFamily: fontStack,
              }}
            >
              Automated security notification for{" "}
              <span style={{ color: "#a1a1aa" }}>{email || "your account"}</span>
            </Text>
            <Text
              style={{
                color: "#52525b",
                fontSize: "13px",
                margin: "0 0 6px",
                fontFamily: fontStack,
              }}
            >
              You cannot unsubscribe from security alerts.{" "}
              <Link
                href="https://optionsgyani.com/profile"
                style={{ color: "#22d3ee", textDecoration: "none" }}
              >
                Manage preferences
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

export default LoginNotificationEmail;
