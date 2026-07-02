/**
 * Trading-focused offer email for OptionsGyani
 * Theme: Practice on past data → paper trade → analyse OI → convert to Pro
 * FOMO: limited-time offer + social proof
 */
export default function TradingOfferEmail({ name = "Trader", coupon = "OG30", expiry = "7 July 2026", discountPct = 30 }) {
  const firstName = name.split(" ")[0] || "Trader";

  return (
    <div style={{ backgroundColor: "#070B14", fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif", margin: 0, padding: 0 }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #0f1a2e 0%, #0a1020 100%)", borderBottom: "1px solid #1e3a5f", padding: "24px 32px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #3b82f6, #06b6d4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>O</span>
          </div>
          <span style={{ color: "#ffffff", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>OptionsGyani</span>
        </div>
      </div>

      {/* ── Hero banner ── */}
      <div style={{ background: "linear-gradient(135deg, #1a2744 0%, #0d1829 50%, #161f38 100%)", padding: "40px 32px", textAlign: "center", borderBottom: "1px solid #1e3358" }}>
        <div style={{ display: "inline-block", background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 50, padding: "6px 18px", marginBottom: 20 }}>
          <span style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>⚡ Limited Time — Expires {expiry}</span>
        </div>

        <h1 style={{ color: "#ffffff", fontSize: 32, fontWeight: 900, margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>
          Hey {firstName}, most traders lose because<br />
          <span style={{ background: "linear-gradient(90deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>they never practice before going live.</span>
        </h1>

        <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, margin: "0 auto 28px", maxWidth: 520 }}>
          OptionsGyani exists for one reason — to give Indian traders the same tools professional desks use, at a price anyone can afford.
        </p>

        {/* Coupon box */}
        <div style={{ background: "rgba(245,158,11,0.08)", border: "2px dashed rgba(245,158,11,0.4)", borderRadius: 16, padding: "24px 32px", display: "inline-block", marginBottom: 28 }}>
          <p style={{ color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: "0 0 8px" }}>Your exclusive offer code</p>
          <div style={{ color: "#f59e0b", fontSize: 44, fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.12em", margin: "0 0 8px" }}>{coupon}</div>
          <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 700, margin: 0 }}>{discountPct}% OFF Pro Plan · Use at checkout</p>
        </div>

        <div style={{ marginBottom: 8 }}>
          <a href={`https://optionsgyani.com/pricing?coupon=${coupon}`}
            style={{ display: "inline-block", background: "linear-gradient(90deg, #f59e0b, #d97706)", color: "#000000", fontSize: 16, fontWeight: 800, textDecoration: "none", padding: "16px 40px", borderRadius: 50, letterSpacing: "-0.2px" }}>
            Claim {discountPct}% Off → Use Code {coupon}
          </a>
        </div>
        <p style={{ color: "#64748b", fontSize: 12, margin: "12px 0 0" }}>⏰ Offer expires {expiry} midnight. No extensions.</p>
      </div>

      {/* ── 3 reasons to practice ── */}
      <div style={{ padding: "40px 32px", backgroundColor: "#080c16" }}>
        <h2 style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 8, letterSpacing: "-0.3px" }}>
          Why every serious trader practices first
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, textAlign: "center", margin: "0 0 32px" }}>
          The market doesn't care about your gut feeling. It rewards preparation.
        </p>

        {/* Reason 1 */}
        <div style={{ background: "#0d1422", border: "1px solid #1e2d45", borderLeft: "3px solid #3b82f6", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 40, height: 40, background: "rgba(59,130,246,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>📊</div>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Backtest on 8+ years of real NSE data</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Know if your Iron Condor or Short Straddle actually works — before you risk a single rupee. See the exact win rate, max drawdown, and expectancy on real NIFTY &amp; BANKNIFTY Bhavcopy data going back to 2016.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 2 */}
        <div style={{ background: "#0d1422", border: "1px solid #1e2d45", borderLeft: "3px solid #10b981", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 40, height: 40, background: "rgba(16,185,129,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🧪</div>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Paper trade with live NSE prices</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Execute strategies in real market conditions without the emotional cost of real losses. Track your paper P&amp;L, win rate, and discipline over weeks — then go live only when you're consistent.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 3 */}
        <div style={{ background: "#0d1422", border: "1px solid #1e2d45", borderLeft: "3px solid #8b5cf6", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 40, height: 40, background: "rgba(139,92,246,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🔍</div>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Read Open Interest like a professional</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                See where big money is positioned. Max Pain, PCR, OI buildup &amp; unwinding — spot the real support and resistance before you enter a trade. Most retail traders never look at OI. That's why they lose.
              </p>
            </div>
          </div>
        </div>

        {/* Reason 4 */}
        <div style={{ background: "#0d1422", border: "1px solid #1e2d45", borderLeft: "3px solid #f59e0b", borderRadius: 12, padding: "20px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ width: 40, height: 40, background: "rgba(245,158,11,0.15)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>📈</div>
            <div>
              <h3 style={{ color: "#ffffff", fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>Track IV Percentile &amp; Greeks in real-time</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Sell options when IV is expensive (IVP &gt; 75%), buy when it's cheap (IVP &lt; 25%). Monitor Delta, Theta, and Vega on your live positions. This is how professional traders think — now you can too.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Social proof + FOMO ── */}
      <div style={{ background: "linear-gradient(135deg, #0f1e35 0%, #0a1525 100%)", padding: "32px", borderTop: "1px solid #1e3358", borderBottom: "1px solid #1e3358" }}>
        <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800, textAlign: "center", margin: "0 0 20px" }}>
          Traders who upgraded this week are saying:
        </h2>

        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid #1e2d45", padding: "18px 20px", marginBottom: 12 }}>
          <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6, margin: "0 0 8px", fontStyle: "italic" }}>
            "Ran 15 backtests in one evening. Found that my Short Straddle had a 63% win rate on BANKNIFTY weekly. Never knew that without OptionsGyani."
          </p>
          <p style={{ color: "#475569", fontSize: 12, margin: 0, fontWeight: 600 }}>— Arun M., Pro subscriber</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid #1e2d45", padding: "18px 20px" }}>
          <p style={{ color: "#cbd5e1", fontSize: 14, lineHeight: 1.6, margin: "0 0 8px", fontStyle: "italic" }}>
            "The OI analysis alone is worth it. I can see exactly where the market makers are positioned before I enter. Complete game-changer."
          </p>
          <p style={{ color: "#475569", fontSize: 12, margin: 0, fontWeight: 600 }}>— Priya S., Pro subscriber</p>
        </div>

        {/* Urgency */}
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <div style={{ display: "inline-block", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 8, padding: "10px 20px", marginBottom: 20 }}>
            <span style={{ color: "#f87171", fontSize: 13, fontWeight: 700 }}>
              ⏰ This offer ends {expiry}, midnight — no reminders, no extensions
            </span>
          </div>
        </div>
      </div>

      {/* ── Price comparison ── */}
      <div style={{ padding: "32px", backgroundColor: "#080c16", textAlign: "center" }}>
        <h2 style={{ color: "#e2e8f0", fontSize: 18, fontWeight: 800, margin: "0 0 8px" }}>What you get with Pro</h2>
        <p style={{ color: "#64748b", fontSize: 14, margin: "0 0 24px" }}>
          Sensibull charges ₹2,499/mo for less. You get more for ₹{discountPct > 0 ? Math.round(499 * (1 - discountPct/100)) : 499}/mo with code <strong style={{ color: "#f59e0b" }}>{coupon}</strong>
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 28, flexWrap: "wrap" }}>
          {[
            { icon: "⚡", label: "Unlimited backtests", sub: "8+ years of data" },
            { icon: "📉", label: "Live option chain", sub: "Real-time OI + Greeks" },
            { icon: "🎯", label: "Paper trading", sub: "Live NSE prices" },
            { icon: "🔔", label: "IV Alerts", sub: "Up to 20 alerts" },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{ textAlign: "center", minWidth: 100 }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, margin: "0 0 2px" }}>{label}</p>
              <p style={{ color: "#64748b", fontSize: 11, margin: 0 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Price strike */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ color: "#475569", fontSize: 18, textDecoration: "line-through", marginRight: 12 }}>₹499/mo</span>
          <span style={{ color: "#10b981", fontSize: 32, fontWeight: 900 }}>₹{Math.round(499 * (1 - discountPct/100))}/mo</span>
          <span style={{ color: "#64748b", fontSize: 14, marginLeft: 6 }}>with code {coupon}</span>
        </div>

        <a href={`https://optionsgyani.com/pricing?coupon=${coupon}`}
          style={{ display: "inline-block", background: "linear-gradient(90deg, #3b82f6, #6366f1)", color: "#ffffff", fontSize: 16, fontWeight: 800, textDecoration: "none", padding: "16px 48px", borderRadius: 50, marginBottom: 12 }}>
          Upgrade to Pro — {discountPct}% Off →
        </a>

        <p style={{ color: "#475569", fontSize: 12, margin: "8px 0 0" }}>Cancel anytime · No hidden fees · Instant access</p>
      </div>

      {/* ── Footer ── */}
      <div style={{ backgroundColor: "#060910", padding: "24px 32px", textAlign: "center", borderTop: "1px solid #0f1829" }}>
        <p style={{ color: "#334155", fontSize: 12, margin: "0 0 6px" }}>OptionsGyani · support@optionsgyani.com</p>
        <p style={{ color: "#1e293b", fontSize: 11, margin: 0 }}>
          You're receiving this because you signed up at optionsgyani.com.
        </p>
      </div>

    </div>
  );
}
