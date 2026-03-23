import {
  Html, Head, Body, Container, Section,
  Text, Button, Link, Hr, Preview,
} from "@react-email/components";

/**
 * AlertEmail
 * Sent when a user's IV alert condition is met.
 *
 * Props:
 *   userName     — string  (e.g. "Arjun")
 *   symbol       — string  ("NIFTY" | "BANKNIFTY" | "FINNIFTY")
 *   metric       — string  ("ivp" | "ivr" | "iv")
 *   condition    — string  ("above" | "below")
 *   threshold    — number  (e.g. 75)
 *   currentValue — number  (the live value that triggered the alert)
 *   alertId      — string  (for deep-link to /alerts)
 */
export default function AlertEmail({
  userName     = "Trader",
  symbol       = "NIFTY",
  metric       = "ivp",
  condition    = "above",
  threshold    = 75,
  currentValue = 78,
  alertId      = "",
}) {
  const font = "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif";

  // ── Display helpers ──────────────────────────────────────────────────────────
  const METRIC_LABELS = {
    ivp: "IV Percentile (IVP)",
    ivr: "IV Rank (IVR)",
    iv:  "Current IV%",
  };
  const metricLabel = METRIC_LABELS[metric] || metric.toUpperCase();
  const conditionLabel = condition === "above" ? "crossed above" : "dropped below";

  // Colour: green for "above" (IV is rich → sell premium), blue for "below"
  const accentColor  = condition === "above" ? "#10b981" : "#6366f1";
  const badgeBg      = condition === "above" ? "#052e16" : "#1e1b4b";
  const badgeBorder  = condition === "above" ? "#10b981" : "#6366f1";

  // Symbol badge colors
  const SYMBOL_COLORS = {
    NIFTY:     { bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
    BANKNIFTY: { bg: "#2d1b69", border: "#8b5cf6", text: "#c4b5fd" },
    FINNIFTY:  { bg: "#064e3b", border: "#10b981", text: "#6ee7b7" },
  };
  const sym = SYMBOL_COLORS[symbol] || SYMBOL_COLORS.NIFTY;

  // Action hint based on alert type
  const getActionHint = () => {
    if (metric === "ivp" && condition === "above" && threshold >= 70) {
      return "IV is historically elevated — this is typically a good time to sell premium (Short Straddle, Iron Condor).";
    }
    if (metric === "ivp" && condition === "below" && threshold <= 30) {
      return "IV is historically cheap — consider buying premium (Long Straddle, Long Strangle) or wait for IV to expand.";
    }
    if (metric === "ivr" && condition === "above" && threshold >= 70) {
      return "IV Rank is high relative to its 52-week range — premium selling conditions may be favourable.";
    }
    return `${symbol} ${metricLabel} has ${conditionLabel} your alert threshold of ${threshold}.`;
  };

  return (
    <Html lang="en">
      <Head />
      <Preview>{symbol} {metricLabel} alert triggered — {metricLabel} is now {currentValue}</Preview>
      <Body style={{ backgroundColor: "#09090b", margin: "0", padding: "32px 0", fontFamily: font }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "0 16px" }}>

          {/* ── Header ── */}
          <Section style={{ textAlign: "center", paddingBottom: "32px" }}>
            <Text style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", margin: "0 0 4px" }}>
              OptionsGyani
            </Text>
            <Text style={{ fontSize: "12px", color: "#6b7280", margin: "0" }}>
              Options Analytics for Indian Traders
            </Text>
          </Section>

          {/* ── Alert card ── */}
          <Section style={{ backgroundColor: "#111827", borderRadius: "16px", padding: "32px", border: "1px solid #1f2937", marginBottom: "20px" }}>

            {/* Bell icon + title */}
            <Text style={{ fontSize: "28px", margin: "0 0 8px", textAlign: "center" }}>🔔</Text>
            <Text style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", textAlign: "center", margin: "0 0 6px" }}>
              Alert Triggered
            </Text>
            <Text style={{ fontSize: "14px", color: "#9ca3af", textAlign: "center", margin: "0 0 28px" }}>
              Hi {userName}, your IV alert for <strong style={{ color: "#ffffff" }}>{symbol}</strong> has fired.
            </Text>

            {/* ── Stats row ── */}
            <Section style={{ backgroundColor: "#0f172a", borderRadius: "12px", padding: "20px", marginBottom: "20px", border: "1px solid #1e293b" }}>
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    {/* Symbol */}
                    <td style={{ textAlign: "center", padding: "0 8px" }}>
                      <div style={{ display: "inline-block", backgroundColor: sym.bg, border: `1px solid ${sym.border}`, borderRadius: "8px", padding: "6px 12px" }}>
                        <Text style={{ fontSize: "13px", fontWeight: "700", color: sym.text, margin: "0" }}>{symbol}</Text>
                      </div>
                      <Text style={{ fontSize: "10px", color: "#6b7280", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Index</Text>
                    </td>
                    {/* Metric */}
                    <td style={{ textAlign: "center", padding: "0 8px" }}>
                      <Text style={{ fontSize: "22px", fontWeight: "800", color: accentColor, margin: "0" }}>{currentValue}</Text>
                      <Text style={{ fontSize: "10px", color: "#6b7280", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{metricLabel}</Text>
                    </td>
                    {/* Threshold */}
                    <td style={{ textAlign: "center", padding: "0 8px" }}>
                      <Text style={{ fontSize: "22px", fontWeight: "800", color: "#e5e7eb", margin: "0" }}>{threshold}</Text>
                      <Text style={{ fontSize: "10px", color: "#6b7280", margin: "4px 0 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Your threshold</Text>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* ── Condition badge ── */}
            <Section style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-block", backgroundColor: badgeBg, border: `1px solid ${badgeBorder}`, borderRadius: "999px", padding: "6px 16px" }}>
                <Text style={{ fontSize: "13px", fontWeight: "600", color: accentColor, margin: "0" }}>
                  {metricLabel} {conditionLabel} {threshold}
                </Text>
              </div>
            </Section>

            {/* ── Action hint ── */}
            <Section style={{ backgroundColor: "#1c2a1c", border: "1px solid #166534", borderRadius: "10px", padding: "14px 16px", marginBottom: "24px" }}>
              <Text style={{ fontSize: "13px", color: "#86efac", margin: "0", lineHeight: "1.6" }}>
                💡 {getActionHint()}
              </Text>
            </Section>

            {/* ── CTA ── */}
            <Button
              href={`https://optionsgyani.com/chain?symbol=${symbol}`}
              style={{
                display: "block", textAlign: "center", backgroundColor: accentColor,
                color: "#ffffff", padding: "14px 24px", borderRadius: "10px",
                fontWeight: "700", fontSize: "14px", textDecoration: "none", marginBottom: "12px",
              }}
            >
              View Live {symbol} Option Chain →
            </Button>
            <Button
              href="https://optionsgyani.com/backtest"
              style={{
                display: "block", textAlign: "center", backgroundColor: "transparent",
                color: "#9ca3af", padding: "10px 24px", borderRadius: "10px",
                fontWeight: "600", fontSize: "13px", textDecoration: "none",
                border: "1px solid #374151",
              }}
            >
              Run a Backtest
            </Button>
          </Section>

          {/* ── Alert management ── */}
          <Section style={{ backgroundColor: "#111827", borderRadius: "12px", padding: "16px 20px", border: "1px solid #1f2937", marginBottom: "20px", textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 6px" }}>
              Manage your alerts at any time
            </Text>
            <Link href="https://optionsgyani.com/alerts" style={{ fontSize: "13px", color: "#6366f1", fontWeight: "600" }}>
              optionsgyani.com/alerts →
            </Link>
          </Section>

          <Hr style={{ borderColor: "#1f2937", margin: "0 0 20px" }} />

          {/* ── Footer ── */}
          <Section style={{ textAlign: "center" }}>
            <Text style={{ fontSize: "12px", color: "#4b5563", margin: "0 0 6px" }}>
              OptionsGyani · Not SEBI registered · For educational &amp; analytical use only
            </Text>
            <Text style={{ fontSize: "11px", color: "#374151", margin: "0" }}>
              You received this because you set up an IV alert.{" "}
              <Link href="https://optionsgyani.com/alerts" style={{ color: "#6b7280" }}>Manage alerts</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}
