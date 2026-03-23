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
  liveBadge: {
    backgroundColor: "#064e3b",
    border: "1px solid #10b981",
    borderRadius: "6px",
    padding: "3px 10px",
    display: "inline-block",
    margin: "0 0 0 12px",
    verticalAlign: "middle",
  },
  liveBadgeText: {
    color: "#10b981",
    fontSize: "11px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "0.5px",
  },
  heroBanner: {
    backgroundColor: "#0f172a",
    padding: "28px 32px 20px",
    borderBottom: "1px solid #1e3a2e",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 4px",
  },
  heroDate: {
    color: "#64748b",
    fontSize: "13px",
    margin: 0,
  },
  statCardsSection: {
    padding: "24px 32px 16px",
  },
  statCardsTitle: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 14px",
  },
  statCardsRow: {
    width: "100%",
  },
  statCardLeft: {
    width: "48%",
    verticalAlign: "top",
    paddingRight: "8px",
  },
  statCardRight: {
    width: "48%",
    verticalAlign: "top",
    paddingLeft: "8px",
  },
  statCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    padding: "16px",
  },
  statCardIndex: {
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 8px",
  },
  statCardValue: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "bold",
    margin: "0 0 4px",
    lineHeight: "1.2",
  },
  statChangeGreen: {
    color: "#10b981",
    fontSize: "13px",
    fontWeight: "bold",
    margin: 0,
  },
  statChangeRed: {
    color: "#ef4444",
    fontSize: "13px",
    fontWeight: "bold",
    margin: 0,
  },
  ivSection: {
    padding: "0 32px 24px",
  },
  ivRow: {
    width: "100%",
  },
  ivCellLeft: {
    width: "48%",
    verticalAlign: "top",
    paddingRight: "8px",
  },
  ivCellRight: {
    width: "48%",
    verticalAlign: "top",
    paddingLeft: "8px",
  },
  ivCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    padding: "16px",
  },
  ivLabel: {
    color: "#64748b",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 6px",
  },
  ivValue: {
    color: "#06b6d4",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 2px",
  },
  ivSubtext: {
    color: "#94a3b8",
    fontSize: "11px",
    margin: 0,
  },
  straddleValue: {
    color: "#f59e0b",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0 0 2px",
  },
  aiInsightSection: {
    margin: "0 32px 24px",
  },
  aiInsightCard: {
    backgroundColor: "#0d1f3c",
    borderLeft: "4px solid #06b6d4",
    borderRadius: "0 10px 10px 0",
    padding: "20px 24px",
  },
  aiInsightLabel: {
    color: "#06b6d4",
    fontSize: "11px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
    margin: "0 0 10px",
  },
  aiInsightText: {
    color: "#cbd5e1",
    fontSize: "14px",
    margin: 0,
    lineHeight: "1.7",
    fontStyle: "italic",
  },
  topTradeSection: {
    margin: "0 32px 28px",
  },
  topTradeSectionTitle: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 12px",
  },
  topTradeCard: {
    backgroundColor: "#0f172a",
    borderRadius: "10px",
    border: "1px solid #334155",
    padding: "20px 24px",
  },
  topTradeStrategy: {
    color: "#f59e0b",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "0 0 8px",
  },
  topTradeDetail: {
    color: "#94a3b8",
    fontSize: "13px",
    margin: "0 0 6px",
    lineHeight: "1.5",
  },
  topTradeHighlight: {
    color: "#10b981",
    fontWeight: "bold",
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

function getChangeStyle(change) {
  if (change === undefined || change === null) return styles.statChangeGreen;
  const val = parseFloat(String(change).replace("%", ""));
  return val >= 0 ? styles.statChangeGreen : styles.statChangeRed;
}

function formatChange(change) {
  if (change === undefined || change === null) return "—";
  const str = String(change);
  const val = parseFloat(str.replace("%", ""));
  const prefix = val >= 0 ? "▲" : "▼";
  const absStr = Math.abs(val).toFixed(2);
  return `${prefix} ${absStr}%`;
}

export function MarketUpdateEmail({
  subject,
  niftySpot,
  niftyChange,
  bankNiftySpot,
  bankNiftyChange,
  ivpNifty,
  straddlePremium,
  aiInsight,
  topTrade,
  date,
}) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{subject || `📈 Market Brief — ${date || "Today"} | NIFTY ${niftySpot || ""}`}</Preview>
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
                <span style={styles.liveBadge}>
                  <Text style={styles.liveBadgeText}>MARKET BRIEF</Text>
                </span>
              </Column>
            </Row>
          </Section>

          {/* Hero */}
          <Section style={styles.heroBanner}>
            <Text style={styles.heroTitle}>📈 Market Brief</Text>
            <Text style={styles.heroDate}>{date || "Today's Summary"}</Text>
          </Section>

          {/* NIFTY + BANKNIFTY Stat Cards */}
          <Section style={styles.statCardsSection}>
            <Text style={styles.statCardsTitle}>Index Snapshot</Text>
            <Row style={styles.statCardsRow}>
              <Column style={styles.statCardLeft}>
                <Section style={styles.statCard}>
                  <Text style={styles.statCardIndex}>NIFTY 50</Text>
                  <Text style={styles.statCardValue}>
                    {niftySpot ? Number(niftySpot).toLocaleString("en-IN") : "—"}
                  </Text>
                  <Text style={getChangeStyle(niftyChange)}>
                    {formatChange(niftyChange)}
                  </Text>
                </Section>
              </Column>
              <Column style={styles.statCardRight}>
                <Section style={styles.statCard}>
                  <Text style={styles.statCardIndex}>BANKNIFTY</Text>
                  <Text style={styles.statCardValue}>
                    {bankNiftySpot ? Number(bankNiftySpot).toLocaleString("en-IN") : "—"}
                  </Text>
                  <Text style={getChangeStyle(bankNiftyChange)}>
                    {formatChange(bankNiftyChange)}
                  </Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* IVP + Straddle */}
          <Section style={styles.ivSection}>
            <Row style={styles.ivRow}>
              <Column style={styles.ivCellLeft}>
                <Section style={styles.ivCard}>
                  <Text style={styles.ivLabel}>IV Percentile (IVP)</Text>
                  <Text style={styles.ivValue}>{ivpNifty !== undefined ? `${ivpNifty}%` : "—"}</Text>
                  <Text style={styles.ivSubtext}>NIFTY current IVP</Text>
                </Section>
              </Column>
              <Column style={styles.ivCellRight}>
                <Section style={styles.ivCard}>
                  <Text style={styles.ivLabel}>ATM Straddle Premium</Text>
                  <Text style={styles.straddleValue}>
                    ₹{straddlePremium !== undefined ? straddlePremium : "—"}
                  </Text>
                  <Text style={styles.ivSubtext}>Weekly expiry</Text>
                </Section>
              </Column>
            </Row>
          </Section>

          {/* AI Insight */}
          <Section style={styles.aiInsightSection}>
            <Section style={styles.aiInsightCard}>
              <Text style={styles.aiInsightLabel}>🤖 AI Insight</Text>
              <Text style={styles.aiInsightText}>
                {aiInsight || "No AI insight available for today."}
              </Text>
            </Section>
          </Section>

          {/* Top Trade of the Day */}
          <Section style={styles.topTradeSection}>
            <Text style={styles.topTradeSectionTitle}>Top Strategy of the Day</Text>
            <Section style={styles.topTradeCard}>
              {topTrade ? (
                <>
                  <Text style={styles.topTradeStrategy}>
                    {topTrade.strategy || "Strategy TBD"}
                  </Text>
                  {topTrade.description && (
                    <Text style={styles.topTradeDetail}>{topTrade.description}</Text>
                  )}
                  {topTrade.strikes && (
                    <Text style={styles.topTradeDetail}>
                      Strikes: <strong style={{ color: "#cbd5e1" }}>{topTrade.strikes}</strong>
                    </Text>
                  )}
                  {topTrade.maxProfit && (
                    <Text style={styles.topTradeDetail}>
                      Max Profit:{" "}
                      <span style={styles.topTradeHighlight}>{topTrade.maxProfit}</span>
                    </Text>
                  )}
                  {topTrade.maxLoss && (
                    <Text style={styles.topTradeDetail}>
                      Max Loss:{" "}
                      <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                        {topTrade.maxLoss}
                      </span>
                    </Text>
                  )}
                </>
              ) : (
                <Text style={styles.topTradeDetail}>
                  No featured strategy for today. Check the live chain for opportunities.
                </Text>
              )}
            </Section>
          </Section>

          {/* CTA */}
          <Section style={styles.ctaSection}>
            <Button
              href="https://optionsgyani.com/chain"
              style={styles.ctaButton}
            >
              Open Live Chain →
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
                Unsubscribe from market updates
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default MarketUpdateEmail;
