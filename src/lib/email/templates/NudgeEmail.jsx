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
  heroBanner: {
    background: "linear-gradient(135deg, #0f172a 0%, #1a1040 100%)",
    padding: "36px 32px 28px",
    textAlign: "center",
    borderBottom: "1px solid #334155",
  },
  waveIcon: {
    fontSize: "44px",
    margin: "0 0 14px",
    display: "block",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "bold",
    margin: "0 0 10px",
    lineHeight: "1.3",
  },
  heroHighlight: {
    color: "#06b6d4",
  },
  heroSubtitle: {
    color: "#94a3b8",
    fontSize: "15px",
    margin: 0,
    lineHeight: "1.5",
  },
  greetingSection: {
    padding: "28px 32px 20px",
  },
  greetingText: {
    color: "#cbd5e1",
    fontSize: "15px",
    margin: "0 0 16px",
    lineHeight: "1.6",
  },
  missedStatBanner: {
    backgroundColor: "#1e1040",
    border: "1px solid #7c3aed",
    borderRadius: "10px",
    padding: "20px 24px",
    margin: "0 32px 24px",
    textAlign: "center",
  },
  missedStatLabel: {
    color: "#a78bfa",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 10px",
  },
  missedStatValue: {
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 0 6px",
    lineHeight: "1.1",
  },
  missedStatDesc: {
    color: "#c4b5fd",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.5",
  },
  whileAwaySection: {
    padding: "0 32px 24px",
  },
  whileAwayTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "bold",
    margin: "0 0 16px",
  },
  eventItem: {
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    padding: "14px 16px",
    marginBottom: "10px",
    border: "1px solid #334155",
    borderLeft: "3px solid #06b6d4",
  },
  eventDate: {
    color: "#64748b",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 4px",
  },
  eventText: {
    color: "#cbd5e1",
    fontSize: "13px",
    margin: 0,
    lineHeight: "1.5",
  },
  eventHighlight: {
    color: "#10b981",
    fontWeight: "bold",
  },
  missedOpportunitySection: {
    margin: "0 32px 28px",
  },
  missedOpportunityTitle: {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "bold",
    margin: "0 0 12px",
  },
  opportunityCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    overflow: "hidden",
  },
  opportunityCardHeader: {
    backgroundColor: "#162032",
    padding: "12px 20px",
    borderBottom: "1px solid #334155",
  },
  opportunityCardHeaderText: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: 0,
  },
  opportunityCardBody: {
    padding: "20px",
  },
  opportunityStrategy: {
    color: "#f59e0b",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 10px",
  },
  opportunityDetail: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0 0 6px",
    lineHeight: "1.5",
  },
  pnlRow: {
    marginTop: "14px",
    padding: "12px 16px",
    backgroundColor: "#064e3b",
    borderRadius: "8px",
    border: "1px solid #10b981",
    textAlign: "center",
  },
  pnlLabel: {
    color: "#6ee7b7",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 4px",
  },
  pnlValue: {
    color: "#10b981",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 2px",
  },
  pnlDisclaimer: {
    color: "#6ee7b7",
    fontSize: "10px",
    margin: 0,
    fontStyle: "italic",
  },
  ctaSection: {
    padding: "4px 32px 36px",
    textAlign: "center",
  },
  ctaSubtext: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 16px",
    lineHeight: "1.5",
  },
  ctaButton: {
    backgroundColor: "#06b6d4",
    color: "#ffffff",
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
  unsubscribeText: {
    color: "#475569",
    fontSize: "11px",
    margin: "8px 0 0",
  },
};

export function NudgeEmail({
  name,
  daysSinceLogin,
  recentMarketMove,
  missedOpportunity,
}) {
  const days = daysSinceLogin || 7;
  const marketMove = recentMarketMove || {
    index: "NIFTY",
    change: "2.4%",
    direction: "up",
    description: "NIFTY surged 2.4% this week on FII inflows and positive global cues",
  };

  const opportunity = missedOpportunity || {
    strategy: "Bull Call Spread — NIFTY",
    description: "22000 CE Buy + 22200 CE Sell at weekly expiry",
    entry: "Entry: ₹45 debit",
    exit: "Exit: ₹118 credit",
    hypotheticalPnl: "+₹3,650",
    perLot: "per lot",
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>
        {name ? `${name}, ` : ""}you missed something while you were away — NIFTY moved and a big opportunity came &amp; went
      </Preview>
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
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={styles.heroBanner}>
            <Text style={styles.waveIcon}>👋</Text>
            <Text style={styles.heroTitle}>
              You missed something,{" "}
              <span style={styles.heroHighlight}>{name || "trader"}</span>
            </Text>
            <Text style={styles.heroSubtitle}>
              It's been{" "}
              <strong style={{ color: "#ffffff" }}>{days} day{days !== 1 ? "s" : ""}</strong>{" "}
              since your last visit. The market didn't wait.
            </Text>
          </Section>

          {/* Greeting */}
          <Section style={styles.greetingSection}>
            <Text style={styles.greetingText}>
              We get it — life gets busy. But while you were away, some interesting things happened
              in the NSE options market. Here's a quick recap of what you missed and what it could
              have meant for your portfolio.
            </Text>
          </Section>

          {/* Missed Stat */}
          <Section style={styles.missedStatBanner}>
            <Text style={styles.missedStatLabel}>
              {marketMove.index || "NIFTY"} this week
            </Text>
            <Text style={styles.missedStatValue}>
              {marketMove.direction === "up" ? "▲" : "▼"} {marketMove.change || "—"}
            </Text>
            <Text style={styles.missedStatDesc}>
              {marketMove.description || `${marketMove.index} moved ${marketMove.change} while you were away`}
            </Text>
          </Section>

          {/* What Happened While You Were Away */}
          <Section style={styles.whileAwaySection}>
            <Text style={styles.whileAwayTitle}>Here's what happened while you were away</Text>

            <Section style={styles.eventItem}>
              <Text style={styles.eventDate}>Market movement</Text>
              <Text style={styles.eventText}>
                {marketMove.description ||
                  `${marketMove.index} moved ${marketMove.change} over the past week`}
              </Text>
            </Section>

            <Section style={styles.eventItem}>
              <Text style={styles.eventDate}>Options activity</Text>
              <Text style={styles.eventText}>
                IV spiked mid-week creating a{" "}
                <span style={styles.eventHighlight}>premium selling opportunity</span>{" "}
                that closed out profitably by Thursday expiry.
              </Text>
            </Section>

            <Section style={styles.eventItem}>
              <Text style={styles.eventDate}>Top strategy</Text>
              <Text style={styles.eventText}>
                Directional spreads outperformed naked options as the market moved
                in a controlled range with{" "}
                <span style={styles.eventHighlight}>clear trend continuation</span>.
              </Text>
            </Section>
          </Section>

          {/* Missed Opportunity Card */}
          <Section style={styles.missedOpportunitySection}>
            <Text style={styles.missedOpportunityTitle}>Missed opportunity this week</Text>
            <Section style={styles.opportunityCard}>
              <Section style={styles.opportunityCardHeader}>
                <Text style={styles.opportunityCardHeaderText}>
                  Hypothetical Trade Scenario
                </Text>
              </Section>
              <Section style={styles.opportunityCardBody}>
                <Text style={styles.opportunityStrategy}>
                  {opportunity.strategy || "Strategy"}
                </Text>
                {opportunity.description && (
                  <Text style={styles.opportunityDetail}>{opportunity.description}</Text>
                )}
                {opportunity.entry && (
                  <Text style={styles.opportunityDetail}>{opportunity.entry}</Text>
                )}
                {opportunity.exit && (
                  <Text style={styles.opportunityDetail}>{opportunity.exit}</Text>
                )}

                <Section style={styles.pnlRow}>
                  <Text style={styles.pnlLabel}>Hypothetical P&amp;L</Text>
                  <Text style={styles.pnlValue}>
                    {opportunity.hypotheticalPnl || "+₹—"}{" "}
                    <span style={{ fontSize: "14px" }}>
                      {opportunity.perLot || "per lot"}
                    </span>
                  </Text>
                  <Text style={styles.pnlDisclaimer}>
                    * Illustrative only. Past performance ≠ future results.
                  </Text>
                </Section>
              </Section>
            </Section>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Text style={styles.ctaSubtext}>
              Ready to catch the next move? Backtest this strategy yourself and
              see exactly how it performs across different market conditions.
            </Text>
            <Button
              href="https://optionsgyani.com/backtest"
              style={styles.ctaButton}
            >
              See What You Missed →
            </Button>
          </Section>

          <Hr style={styles.divider} />

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © 2026 OptionsGyani Analytics · Not SEBI registered · Educational use only
            </Text>
            <Text style={styles.unsubscribeText}>
              <Link href="https://optionsgyani.com/profile" style={styles.footerLink}>
                Unsubscribe from these emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default NudgeEmail;
