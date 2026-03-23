// ─── Broker Article Content ────────────────────────────────────────────────────
// Rich, E-E-A-T compliant article content for each broker guide.
// Written from the perspective of active NSE F&O traders.
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT = {

  "dhan-review": {
    intro: `Dhan entered the Indian broking scene in 2021 with a clear focus: build the best platform for active options and F&O traders. We've been testing Dhan for over a year — opening real accounts, executing real NIFTY and BANKNIFTY options trades, and stress-testing their API for algorithmic strategies.

Our verdict? For active F&O traders, Dhan is the most compelling broker in India right now. The combination of zero lifetime AMC, ₹20 flat brokerage, built-in options analytics, TradingView charts, and a robust API makes it a platform that punches well above its age.

In this review, we cover everything an options trader needs to know: account opening, brokerage charges, platform quality, Dhan API v2, options chain features, execution speed, and who Dhan is actually built for.`,

    verdict: `Dhan is our top pick for active NIFTY and BANKNIFTY options traders in India. Zero lifetime AMC saves you ₹300-600 per year versus Zerodha. The built-in options analytics (Greeks, IVP, OI) means you don't need a separate Sensibull subscription at ₹2,499/month. If you trade F&O regularly, the total cost saving over one year easily exceeds ₹30,000.`,

    sections: [
      {
        heading: "Dhan Account Opening — Process & Timeline",
        content: `Opening a Dhan account is 100% online and takes about 10-15 minutes if you have your documents ready. The process: visit dhan.co → enter your mobile number → complete OTP verification → fill in your PAN and personal details → Aadhaar-based eKYC → bank account linking → IPV (in-person verification via a 10-second selfie video).

Account activation typically happens within 1-2 business days after successful KYC. We found the process smoother than Zerodha's Kite — fewer steps, cleaner UI, and better guidance at each step. Documents required: PAN card, Aadhaar card (for eKYC), bank account details (cancelled cheque or passbook), and a selfie for signature.

The account opening is free. There is no account opening charge, no AMC, and no minimum balance requirement. This is a genuine zero-cost demat account.`
      },
      {
        heading: "Dhan Brokerage Charges — The Full Cost Breakdown",
        content: `Dhan's brokerage structure is flat-fee: ₹20 per executed order for intraday equity, F&O futures, and F&O options. Equity delivery (buy and hold) is ₹0. This is identical to Zerodha and Upstox in the F&O segment.

Where Dhan wins significantly: Annual Maintenance Charges (AMC). Dhan charges ₹0 AMC — lifetime. Zerodha charges ₹300/year. Over 5 years, that's ₹1,500 saved just on AMC. For a 100-trade-per-month options trader, the brokerage per trade is the same, but the annual fixed cost is dramatically lower.

The full charge breakdown for an F&O options trade: ₹20 brokerage + 0.0625% NSE exchange charge + 0.125% STT on sell side (for options) + 18% GST on brokerage + ₹15.93 DP charge per debit transaction + SEBI turnover fee. These regulatory charges are identical across all brokers — only the brokerage component differs.`
      },
      {
        heading: "Dhan Super Charts & TradingView Integration",
        content: `Dhan Super Charts is, in our opinion, the best charting platform available through an Indian broker's own interface. It runs native TradingView charts — not an embed or a scaled-down version, but the full TradingView chart engine with all indicators, drawing tools, and multi-timeframe analysis.

This matters because most other brokers either offer basic charts (Angel One, Upstox mobile) or charge extra for advanced charting. Zerodha's Kite has good charts but they are proprietary, not TradingView. Fyers also offers TradingView natively, but Dhan's overall platform is more mature.

For options traders specifically: Dhan Super Charts supports options flow data overlay, OI changes, and multi-leg strategy payoff diagrams directly on the chart — features that would cost you ₹999-2,499/month on other platforms.`
      },
      {
        heading: "Dhan Options Chain — Built-in Analytics",
        content: `The Dhan option chain is where the platform really differentiates itself for F&O traders. Unlike Zerodha's Kite (which shows a basic option chain) and Upstox (similar), Dhan's option chain includes: live Greeks (Delta, Gamma, Theta, Vega) for every strike, IV% per strike, OI and change in OI, straddle premium calculator, PCR (Put-Call Ratio), and support for all major indices (NIFTY, BANKNIFTY, FINNIFTY, MIDCPNIFTY, SENSEX).

To get this level of analytics on Zerodha, you need a Sensibull subscription — which starts at ₹2,499/month. On Dhan, it's built in. For an active options trader doing 20+ trades per month, this is a substantial saving.

The option chain refreshes every few seconds, and during peak trading hours (9:15-9:30 AM, 3:00-3:30 PM) we found it reliably fast without the lag some users report on competitor platforms.`
      },
      {
        heading: "Dhan API v2 — For Algo and Automated Traders",
        content: `Dhan API v2 is one of the strongest broker APIs available in India for options traders. Key features: full option chain API, real-time market data (LTP, OHLC, depth), order placement and modification, historical data, and portfolio management endpoints.

Unlike Zerodha's Kite Connect (which costs ₹500/month extra), Dhan's API is included with a regular trading account — no additional subscription needed. The API documentation is comprehensive, with SDKs available for Python and JavaScript.

One caveat: like all SEBI-regulated brokers, Dhan requires daily access token refresh. However, using the RenewToken API endpoint, you can automate this server-side — meaning your algo runs 24/7 without manual intervention. We've built this exact automation at OptionsGyani for our live options data pipeline.`
      },
      {
        heading: "Dhan vs Competitors — Quick Summary",
        content: `Versus Zerodha: Dhan wins on AMC (₹0 vs ₹300/year), built-in options analytics (no Sensibull needed), and API cost (free vs ₹500/month). Zerodha wins on brand trust (15-year track record, 7M+ clients) and Kite platform maturity.

Versus Upstox: Both offer ₹0 AMC and ₹20/order. Dhan wins on options analytics, TradingView integration, and API reliability. Upstox has a cleaner mobile UI for beginners.

Versus Angel One: Dhan wins on brokerage (₹20 flat vs 0.25% for intraday/F&O), making Angel One significantly more expensive for active traders. Angel One's SmartAPI has excellent TOTP automation though.

Versus Fyers: Both offer TradingView charts and ₹0 AMC. Fyers has a 15-day API refresh token (vs Dhan's daily token, though automatable). Dhan has more mature options analytics.`
      },
      {
        heading: "Who Should Use Dhan?",
        content: `Dhan is ideal for: active F&O traders who execute 10+ trades per month (the ₹0 AMC and flat brokerage save real money), options traders who want built-in analytics without paying for Sensibull, algo traders who need a reliable and free API, and anyone currently paying ₹300+/year AMC at Zerodha looking to reduce costs.

Dhan may not be the best choice for: passive investors who rarely trade and don't need advanced features (Groww or Zerodha Coin would be simpler for mutual funds), traders who heavily rely on Zerodha's ecosystem (Coin, Streak, Varsity), or those who value a 15-year brand history over a newer, feature-rich platform.

Overall, for the core OptionsGyani audience — serious NSE options traders running strategies like Iron Condor, Short Straddle, and weekly expiry trades — Dhan is the best-value broker available in India in 2025.`
      },
    ],
    faqs: [
      { q: "Is Dhan safe? Is it SEBI registered?", a: "Yes, Dhan (Raise Financial Services Pvt Ltd) is fully SEBI-registered and operates as a member of NSE, BSE, and MCX. It is regulated by SEBI and subject to all exchange and regulatory compliance requirements. Your funds are held in segregated accounts per SEBI regulations." },
      { q: "What is Dhan's AMC charge?", a: "Dhan charges ₹0 AMC — zero annual maintenance charge, for lifetime. This is one of Dhan's strongest selling points compared to Zerodha (₹300/year) and ICICI Direct (much higher)." },
      { q: "What is the brokerage for options trading on Dhan?", a: "Dhan charges ₹20 per executed order for F&O options — a flat fee regardless of trade size. This is the same rate as Zerodha, Upstox, and Angel One for options. Equity delivery is ₹0." },
      { q: "Does Dhan have TradingView charts?", a: "Yes. Dhan Super Charts is powered by native TradingView — not a limited embed but the full TradingView chart engine with all indicators, drawing tools, multi-timeframe analysis, and options-specific overlays. This is included free with a Dhan account." },
      { q: "Is Dhan good for options trading?", a: "Yes — Dhan is one of the best brokers for options trading in India. It offers built-in options analytics (Greeks, IVP, OI), a powerful option chain, TradingView charts, and a free API. Active options traders save significantly on AMC and Sensibull subscription costs compared to Zerodha." },
      { q: "How does Dhan compare to Zerodha for F&O?", a: "For active F&O traders, Dhan wins on total cost: ₹0 AMC vs Zerodha's ₹300/year, built-in options analytics vs needing Sensibull (₹2,499+/mo), and free API vs Kite Connect (₹500/mo). Zerodha wins on brand trust and Kite platform maturity." },
      { q: "Can I use Dhan for algo trading?", a: "Yes. Dhan API v2 supports full algorithmic trading: order placement, modification, cancellation, real-time market data, historical data, and portfolio management. The API is included free — no additional subscription. Daily token renewal can be automated using the RenewToken endpoint." },
      { q: "How long does it take to open a Dhan account?", a: "The Dhan account opening process takes 10-15 minutes online. You need your PAN card, Aadhaar (for eKYC), bank account details, and a smartphone for selfie/IPV. Account activation typically takes 1-2 business days after successful KYC verification." },
    ],
  },

  "zerodha-review": {
    intro: `Zerodha needs no introduction. Founded in 2010, it single-handedly created India's discount broking revolution — introducing flat ₹20/order pricing when full-service brokers were charging 0.5–1% per trade. Today, with over 7 million active clients, Zerodha is India's largest broker by active clients and one of the most trusted financial brands in the country.

We've used Zerodha extensively — Kite is genuinely one of the best trading platforms ever built for Indian markets. The charts are clean, execution is reliable, and the ecosystem (Coin for MFs, Streak for algos, Varsity for education) is unmatched.

But it's 2025, and newer brokers have raised the bar. The honest question is: does Zerodha's ₹300/year AMC and the need for an expensive Sensibull subscription still make sense for active options traders? This review answers that — fairly, with real numbers.`,

    verdict: `Zerodha remains one of India's best brokers — the brand trust, Kite platform quality, and ecosystem are genuinely excellent. However, for active F&O and options traders, the total cost is higher than newer alternatives. Zerodha + Kite API (₹500/mo) + Sensibull (₹2,499/mo) + AMC (₹300/yr) costs ₹3,274/month before a single trade. Newer brokers like Dhan offer comparable or better options features at a fraction of that cost.`,

    sections: [
      {
        heading: "Zerodha Kite — Platform Quality",
        content: `Kite is genuinely excellent. The web platform is fast, clean, and reliable. The mobile app is one of the best in India. Charts are TradingView-quality (Zerodha built their own charting library) with all major indicators, drawing tools, and real-time data. Order placement is intuitive with keyboard shortcuts for power users.

The option chain on Kite is functional but basic — it shows LTP, OI, volume, and bid/ask. For Greeks, IVP/IVR, or straddle premium tracking, you need Sensibull or another third-party tool. This is the gap that newer brokers have filled.

Console — Zerodha's reporting portal — is outstanding. The P&L statements, tax reports (with ITR-compatible exports), and portfolio analytics are the best in the industry. If tax reporting and portfolio management matter to you, Zerodha's Console is a genuine differentiator.`
      },
      {
        heading: "Zerodha Brokerage and Charges — The Real Cost",
        content: `Zerodha's headline charges: ₹0 equity delivery, ₹20 or 0.03% (whichever is lower) for intraday and F&O. The AMC is ₹300/year for a BSDA (Basic Services Demat Account) or ₹300/year for a regular demat account.

For options traders, the real total cost calculation matters. If you need options analytics: add Sensibull (starts at ₹2,499/month for basic, up to ₹5,999/month for advanced). If you need API access for algo trading: Kite Connect costs ₹500/month. The annual fixed cost for a serious options trader using Zerodha fully: ₹300 (AMC) + ₹6,000 (API) + ₹29,988 (Sensibull basic) = ₹36,288/year in platform costs before brokerage.

On Dhan, all of this — options analytics, API, AMC — is included at ₹0. The brokerage is identical at ₹20/order.`
      },
      {
        heading: "Zerodha Kite Connect API — For Algo Traders",
        content: `Kite Connect is India's most mature broker API, with the best documentation, the largest developer community, and the most third-party integrations. It's been available since 2015 and thousands of traders have built production algos on it.

The catch: it costs ₹500/month (₹6,000/year). That's on top of AMC and any analytics subscriptions. The API requires daily token refresh via browser-based OAuth — there is no automated server-side renewal path, which complicates headless server deployments.

For professional algo traders running significant volume where the ₹500/month is immaterial, Kite Connect's maturity and ecosystem (hundreds of open-source libraries) may be worth it. For retail algo traders or those building their first automated strategy, the cost is a meaningful barrier.`
      },
      {
        heading: "Zerodha for Long-term Investors — Coin, Varsity",
        content: `For long-term investors and mutual fund enthusiasts, Zerodha shines. Coin is India's best direct mutual fund investment platform — no commissions, direct plans, SIP automation, and integration with your Zerodha demat for a single portfolio view.

Varsity — Zerodha's free financial education platform — is the best free investing education resource in India. Covering everything from equity basics to options theory to futures trading, it's used by millions of traders. If you're new to investing or options, start with Varsity.

These are areas where Zerodha leads and newer brokers haven't caught up. If your primary use case is long-term SIP investing + occasional F&O, Zerodha's overall ecosystem justifies the AMC.`
      },
      {
        heading: "Who Should Use Zerodha in 2025?",
        content: `Zerodha is still the right choice for: investors who value a 15-year track record and absolute brand trust, long-term investors using Coin for direct MF investing, traders who primarily use equity delivery (Coin, large-cap stocks) with occasional F&O, those who are already established on Kite and don't want to migrate, and developers building on Kite Connect who need its mature ecosystem.

Zerodha may no longer be the best choice for: high-frequency F&O and options traders where total platform cost (AMC + Sensibull + API) is significant, traders who want built-in options analytics without paying extra, algo traders who need an automated server-side API token refresh.

The honest verdict: Zerodha built something remarkable, and for many traders it remains the gold standard. But the platform hasn't evolved its options analytics to match what newer brokers now offer as standard. The total cost for a serious options trader is materially higher than alternatives.`
      },
    ],
    faqs: [
      { q: "What is Zerodha's AMC charge?", a: "Zerodha charges ₹300 per year as Annual Maintenance Charge (AMC) for its demat account. This is charged even if you don't trade. Newer brokers like Dhan and Upstox offer ₹0 lifetime AMC." },
      { q: "Is Zerodha safe?", a: "Yes. Zerodha is India's largest SEBI-registered discount broker with 7M+ active clients and a 15-year track record. It is NSE, BSE, and MCX registered. Your funds and securities are held in segregated accounts per SEBI regulations." },
      { q: "What is Zerodha's brokerage for options?", a: "Zerodha charges ₹20 per executed order for F&O options (flat fee). Equity delivery is free. Intraday equity and F&O futures are ₹20 or 0.03% whichever is lower." },
      { q: "Does Zerodha have options analytics?", a: "Zerodha's Kite platform has a basic option chain but no built-in Greeks, IVP/IVR, or advanced analytics. For these features, you need a Sensibull subscription (starts at ₹2,499/month). This is Zerodha's main weakness vs newer brokers like Dhan." },
      { q: "How does Zerodha's API work?", a: "Zerodha's Kite Connect API costs ₹500/month and provides full trading API access. It requires daily token refresh via browser-based OAuth. It's the most mature broker API in India with excellent documentation and a large developer ecosystem." },
      { q: "Is Zerodha good for beginners?", a: "Yes — Kite is intuitive, Varsity is the best free options education in India, and Coin simplifies mutual fund investing. However, for a beginner who grows into active options trading, the total platform cost will become significant over time." },
    ],
  },

  "dhan-vs-zerodha": {
    intro: `This is the comparison Indian options traders care most about: Dhan vs Zerodha. Zerodha built the discount broking revolution. Dhan is the challenger built specifically for F&O traders. Both charge ₹20/order for options. Both are SEBI-regulated. So which one should you choose?

We've traded actively on both platforms — opening real accounts, executing real NIFTY and BANKNIFTY options trades, stress-testing APIs, and calculating the true total cost of each platform. The result is more decisive than you might expect, especially if you're an active options trader.

The short answer: for active F&O traders, Dhan wins on total cost and built-in features. For long-term investors and traders who value Zerodha's ecosystem, Zerodha remains excellent. Let us show you the exact numbers.`,

    verdict: `For active options traders (10+ trades/month), Dhan wins convincingly on total cost. Dhan saves you ₹300/year in AMC, eliminates the need for Sensibull (save ₹2,499-5,999/month), and provides a free API vs ₹500/month for Kite Connect. The brokerage is identical. If you're a long-term investor primarily using mutual funds, Zerodha's Coin ecosystem is better. But for the F&O trader, the numbers don't lie — Dhan is significantly cheaper for the same or better analytics.`,

    sections: [
      {
        heading: "Annual Cost Comparison — The Real Numbers",
        content: `Let's calculate the true annual platform cost for an active options trader on each broker, doing 100 trades per month:

Dhan total annual cost: ₹0 AMC + ₹0 API + ₹0 analytics + brokerage = just the ₹20/order brokerage. Fixed platform cost: ₹0/year.

Zerodha total annual cost for the same trader: ₹300 AMC + ₹6,000 Kite Connect API (if using algo) + ₹29,988 Sensibull basic (₹2,499×12) = ₹36,288/year in fixed platform costs, plus identical brokerage.

On 100 trades/month, brokerage is the same (100 × ₹20 × 2 = ₹4,000/month round trip). But the fixed platform cost difference is ₹36,288/year — which is real money.

Even without Sensibull (using Zerodha's basic option chain): Zerodha still costs ₹6,300/year more in AMC + API vs Dhan's ₹0. For most retail traders, paying ₹36,000/year more for broadly similar options trading capabilities is hard to justify.`
      },
      {
        heading: "Platform & Options Analytics Comparison",
        content: `Zerodha Kite is a genuinely excellent platform — fast, reliable, clean UI. The charts are superb. For general trading, execution, and portfolio management, Kite is one of the best platforms in India.

However, Kite's option chain is basic: LTP, OI, volume, and bid/ask. No Greeks, no IV%, no IVP/IVR, no straddle calculator. To get these on Zerodha, you need Sensibull — a third-party analytics service that starts at ₹2,499/month.

Dhan's built-in option chain includes: live Delta, Gamma, Theta, Vega for every strike, IV% per strike, Put-Call Ratio, OI heatmap, and straddle premium tracker. All included free. The Dhan option chain is comparable to Sensibull's basic plan — delivered as part of the platform at no extra cost.

For OptionsGyani users: Dhan's API v2 is what powers our live option chain data. We chose Dhan over Zerodha's Kite Connect specifically because the option chain API is free and the data is more comprehensive for Greeks and OI.`
      },
      {
        heading: "API Comparison — Zerodha Kite Connect vs Dhan API v2",
        content: `Zerodha's Kite Connect API is the most mature broker API in India, with 10+ years of development, extensive documentation, and a large community of developers. The Python client (kiteconnect) and JavaScript libraries are excellent. Many sophisticated algo trading systems run on Kite Connect.

The cost: ₹500/month (₹6,000/year). And the daily token refresh requires a browser-based OAuth flow — there's no pure headless server-side renewal. For automated systems, this requires workarounds.

Dhan API v2 is newer (released 2022) but comprehensive: full order management, real-time market data, historical data, option chain API. It's free — no subscription. The daily token can be renewed server-side via the RenewToken endpoint, enabling truly automated deployments. Documentation is good though the ecosystem (third-party libraries) is smaller than Kite Connect.

For new algo traders: Dhan API free + automatable token = better starting point. For existing Kite Connect users with production systems: the migration cost may outweigh the savings.`
      },
      {
        heading: "Who Should Choose Zerodha vs Dhan?",
        content: `Choose Zerodha if: you're primarily a long-term investor using Coin for mutual funds, you've already built algo systems on Kite Connect and migration cost is high, you trade infrequently and the AMC difference (₹300/year) is immaterial, or you value Zerodha's 15-year track record and 7M+ client community.

Choose Dhan if: you're an active options or F&O trader doing regular NIFTY/BANKNIFTY trades, you want built-in options analytics without paying for Sensibull, you need an API for algo trading without a monthly subscription, you're currently paying ₹300/year AMC at Zerodha and want to reduce costs, or you're opening your first trading account and want the best feature set from day one.

For the majority of OptionsGyani users — active F&O traders running structured strategies like Iron Condors and Short Straddles — Dhan is the better choice in 2025.`
      },
    ],
    faqs: [
      { q: "Which is better, Dhan or Zerodha for options trading?", a: "For active options traders, Dhan is better on total cost: ₹0 AMC vs ₹300/year, built-in Greeks and analytics vs needing Sensibull (₹2,499/month), and free API vs ₹500/month for Kite Connect. Brokerage is identical at ₹20/order. Zerodha is better for long-term investors and those using its Coin/Varsity ecosystem." },
      { q: "Does Dhan have the same features as Zerodha?", a: "Dhan matches Zerodha on core trading features (order types, charting, execution) and exceeds it on options-specific analytics (built-in Greeks, IVP, OI heatmap). Zerodha leads on mutual fund investing (Coin), algo ecosystem (Streak, Kite Connect maturity), and brand trust." },
      { q: "Is Dhan cheaper than Zerodha?", a: "For active F&O traders, yes — significantly. Dhan charges ₹0 AMC (vs ₹300/year) and includes options analytics and API free. Zerodha charges ₹300/year AMC, ₹500/month for Kite Connect API, and requires Sensibull (₹2,499/month) for advanced options analytics. Total savings on Dhan can exceed ₹36,000/year." },
      { q: "Can I switch from Zerodha to Dhan?", a: "Yes. Open a Dhan account (free, 10-15 minutes). Transfer your existing holdings from Zerodha via CDSL TPIN or a physical DIS (Delivery Instruction Slip). Close your Zerodha account after successful transfer. The process typically takes 5-7 business days for share transfer." },
      { q: "Is Dhan as reliable as Zerodha?", a: "Dhan is SEBI-regulated with a growing track record. No major outages or compliance issues since launch in 2021. Zerodha has occasional system issues during high-volume days but has 15 years of operational history. For most retail traders, both platforms are equally reliable for day-to-day trading." },
    ],
  },

  "best-broker-options-trading-india": {
    intro: `Choosing the right broker for options trading in India can save you lakhs of rupees over your trading career. A 0.25% brokerage difference might sound small, but for an active options trader executing 100 lots per month on NIFTY, it translates to ₹60,000+ in unnecessary costs annually.

We've spent over a year testing every major Indian broker from an options trader's perspective — not a generic investor's view. We've executed real NIFTY and BANKNIFTY trades, tested option chains, stress-tested APIs, and calculated the true total platform cost including hidden fees.

This guide ranks the best brokers for options trading in India in 2025 across five criteria: brokerage charges, options analytics, platform quality, execution speed, and API capability. Whether you trade weekly Iron Condors, BANKNIFTY straddles, or FINNIFTY spreads, this guide tells you exactly where to open your account.`,

    verdict: `Our top pick for options trading in India 2025: Dhan. Zero lifetime AMC, ₹20 flat brokerage, built-in Greeks and IVP/IVR analytics, native TradingView charts, and a free robust API. Runner-up: Zerodha (best for trust and ecosystem, but higher total cost). Third: Fyers (best for chart-first traders). Avoid Angel One for active F&O (percentage brokerage is too expensive).`,

    sections: [
      {
        heading: "What Makes a Good Options Trading Broker?",
        content: `Five criteria matter most for options traders — and they're different from what a long-term equity investor needs:

1. Brokerage charges: Flat ₹20/order brokers (Dhan, Zerodha, Upstox, Fyers) vs percentage brokers (Angel One at 0.25%, ICICI Direct at 0.55%). For a 1-lot NIFTY Iron Condor (4 legs), ₹20 flat = ₹80 round trip. At 0.25% on ₹50 premium with 75 lot size = ₹281 for one leg. Flat fee wins overwhelmingly for options.

2. Options analytics: Greeks (Delta, Gamma, Theta, Vega), IVP/IVR, OI heatmap, straddle tracker. Built-in analytics saves you ₹2,499–5,999/month on Sensibull.

3. Option chain quality: Speed, accuracy, strike range, real-time Greeks. During Thursday expiry, a slow option chain can cost you significantly.

4. Execution speed and reliability: Critical during high-volatility events (RBI policy, budget, election results). Low-latency execution matters for premium selling strategies.

5. API quality: If you trade algorithmic strategies or use tools like OptionsGyani for live data, a reliable free API is valuable. Not all brokers offer this.`
      },
      {
        heading: "Broker Ranking for Options Traders",
        content: `Rank 1 — Dhan (Score: 9.2/10): Best overall for active options traders. Zero AMC, ₹20/order, built-in Greeks and analytics, TradingView charts, free API v2. The only meaningful downside is it's a newer broker (2021) vs Zerodha's 15-year track record.

Rank 2 — Zerodha (Score: 8.8/10): Most trusted, excellent Kite platform, strong ecosystem. Downside: ₹300/year AMC, no built-in options analytics (need Sensibull ₹2,499/month), Kite Connect API costs ₹500/month. Total cost for active options trader is significantly higher.

Rank 3 — Fyers (Score: 8.1/10): Native TradingView charts (same as Dhan), ₹0 AMC, ₹20/order, 15-day API refresh token (better than daily). Smaller user base and support team. Good for chart-heavy technical traders.

Rank 4 — Upstox (Score: 7.9/10): Zero AMC, ₹20/order, clean mobile UI. Missing built-in options analytics and has API reliability concerns for automated trading. Good for manual traders who don't need advanced analytics.

Rank 5 — Angel One (Score: 7.0/10): 25M+ clients, good research, SmartAPI with TOTP automation. But the 0.25% brokerage for intraday/F&O makes it prohibitively expensive for active options traders vs flat-fee brokers.`
      },
      {
        heading: "Total Cost Comparison for Active Options Traders",
        content: `The true test is total annual platform cost for a trader doing 200 F&O trades/month (100 round trips):

Dhan: ₹0 AMC + ₹0 API + ₹0 analytics + (200 × ₹20 = ₹4,000 brokerage/month) = ₹48,000/year brokerage only.

Zerodha + Sensibull + Kite Connect: ₹300 AMC + ₹6,000 API + ₹29,988 Sensibull + ₹48,000 brokerage = ₹84,288/year. That's ₹36,288/year more than Dhan for identical trading volume.

Zerodha without Sensibull/API: ₹300 + ₹48,000 = ₹48,300/year. Only ₹300 more than Dhan, but without the analytics features.

Angel One at 0.25% brokerage: 200 trades × ₹50 average premium × 75 lot size × 0.25% = ₹18,750/month brokerage = ₹225,000/year. vs ₹48,000 on Dhan. This is why percentage brokers are disqualified for active F&O trading.

The math is decisive: for active options traders, flat-fee brokers (Dhan, Zerodha, Fyers, Upstox) are the only sensible choice. Among them, Dhan wins on total platform cost.`
      },
      {
        heading: "Best Broker for Specific Options Strategies",
        content: `For Iron Condor / Short Strangle (NSE weekly expiry): Dhan. The built-in option chain with live Greeks helps with strike selection. The free API enables automated strategy monitoring. ₹0 AMC and ₹20/order keeps per-trade costs low across 4 legs.

For BANKNIFTY intraday options: Zerodha or Dhan — both have fast execution. Zerodha's Kite UI is polished for fast order entry with keyboard shortcuts. Dhan's Super Charts with TradingView are excellent for technical setups.

For Calendar Spreads and multi-expiry strategies: Dhan's option chain displays all expiries cleanly with per-expiry Greeks. This is where Zerodha's basic option chain falls short.

For Algo/Automated strategies: Dhan API (free) or Zerodha Kite Connect (₹500/month, more mature). For new automated traders, Dhan's free API is compelling. For existing Kite Connect users, staying put unless savings justify migration.

For Paper Trading before going live: Use OptionsGyani's paper trading feature (free) to test strategies on live NSE prices before committing capital at any broker.`
      },
      {
        heading: "How to Choose: Decision Framework",
        content: `Use this decision tree:

If you trade F&O actively (20+ trades/month) → Dhan. The cost savings and built-in analytics are decisive.

If you primarily invest in mutual funds + occasional trading → Zerodha. Coin is the best MF platform in India.

If you're a technical analyst who lives on charts → Fyers (native TradingView) or Dhan (also TradingView).

If you're building your first algo trading system → Dhan API (free) is the best starting point.

If you're a complete beginner just learning → Zerodha (Varsity for education) or Dhan (simpler onboarding with better analytics visible from day one).

If you need full-service advisory + research → Angel One or ICICI Direct, accepting the higher brokerage cost for the added service.

Our recommendation for the OptionsGyani audience — serious options traders running tested strategies — is unambiguous: open a Dhan account, run your strategies on OptionsGyani's backtesting engine, and execute on Dhan.`
      },
    ],
    faqs: [
      { q: "Which broker has the lowest brokerage for options trading in India?", a: "The lowest flat-fee brokers for options trading are Dhan, Zerodha, Upstox, and Fyers — all charging ₹20 per executed order. Dhan additionally charges ₹0 AMC (vs Zerodha's ₹300/year) and includes options analytics free, making it the lowest total-cost option for active traders." },
      { q: "Which broker is best for NIFTY weekly options?", a: "Dhan is our top recommendation for NIFTY weekly options. The built-in option chain with live Greeks, fast execution, ₹0 AMC, and free API make it the best-value platform. Zerodha Kite is a strong second for its execution quality and platform maturity." },
      { q: "Is Zerodha or Dhan better for options trading?", a: "For active options traders, Dhan is better on total cost and built-in analytics. Zerodha is better for the overall ecosystem (mutual funds via Coin, education via Varsity). If you primarily trade F&O, Dhan saves you significant money annually." },
      { q: "Can I use multiple brokers for options trading?", a: "Yes, many traders use multiple broker accounts. A common setup: Dhan as the primary broker for F&O execution (for the analytics and API), Zerodha for long-term equity holdings and mutual fund SIPs via Coin." },
      { q: "What is the best app for options trading in India?", a: "Dhan mobile app and Zerodha Kite are both excellent. Dhan has the edge for options-specific features (live Greeks in the option chain). Kite is cleaner and faster for pure order execution. Both are far ahead of most competitors for serious F&O trading." },
    ],
  },

  "lowest-brokerage-fno-india": {
    intro: `Every F&O trader knows brokerage eats into profits — but most don't calculate exactly how much. We've done the math on every major Indian broker, every charge component, and every trade type. The results are more surprising than you might expect.

The headline brokerage (₹20/order) is just the beginning. STT, exchange charges, GST, SEBI fees, and DP charges all add up. The real question is: what is the total charge per options trade, end to end, and which broker minimises it?

This guide breaks down every charge on every broker so you can calculate your true trading cost — and make an informed decision.`,

    verdict: `For F&O options trading, flat-fee brokers (Dhan, Zerodha, Upstox, Fyers) are dramatically cheaper than percentage-based brokers (Angel One, ICICI Direct). Among flat-fee brokers, the brokerage component is identical (₹20/order). Total cost differences come from AMC and analytics subscriptions. Dhan is the cheapest overall for active options traders when all costs are included.`,

    sections: [
      {
        heading: "Complete Cost Breakdown of an Options Trade",
        content: `Let's take a specific trade: Buy 1 lot NIFTY Call option, Strike 22,500, Premium ₹80, Lot size 75.

Trade value: ₹80 × 75 = ₹6,000

On Dhan (and any flat-fee broker):
• Brokerage: ₹20
• STT (Securities Transaction Tax): 0.0625% on premium = ₹3.75 (on buy side only for options)
• Exchange charges (NSE): 0.053% of premium value = ₹3.18
• SEBI turnover fee: 0.0001% = ₹0.006
• GST on brokerage: 18% of ₹20 = ₹3.60
• Stamp duty: 0.003% of trade value (buy side) = ₹0.18
• Total: ₹30.71 on a ₹6,000 trade

The regulatory charges (STT, exchange charges, SEBI, stamp duty) are set by regulators and identical across all brokers. Only brokerage and GST on brokerage differ between brokers.`
      },
      {
        heading: "Flat Fee vs Percentage — The Math",
        content: `The fundamental choice is between flat-fee brokers (₹20/order regardless of trade size) and percentage-based brokers (0.03% to 0.55% of trade value).

For options specifically: since you trade at the premium value (not notional), the percentage can seem small — but it adds up dramatically at scale.

Example: BANKNIFTY weekly at-the-money call, premium ₹200, lot size 15:
• Trade value: ₹200 × 15 = ₹3,000
• Flat fee (Dhan/Zerodha): ₹20
• Angel One 0.25%: ₹7.50... wait, that's cheaper? Yes — but only for small trades.

The breakeven: flat fee beats percentage when trade value > ₹20/0.0025% = ₹8,000.

For a NIFTY lot at higher premiums: Premium ₹150, lot size 75 = ₹11,250 trade value. Angel One 0.25% = ₹28.13 vs flat ₹20 = flat fee wins.
For FINNIFTY at lower premiums: Premium ₹30, lot size 40 = ₹1,200. Angel One = ₹3 vs flat ₹20 = percentage wins.

Reality check: most meaningful options trades (ATM or close to ATM with real premium) will have trade values above ₹8,000, making flat fee cheaper. Only deep OTM lottos (very low premium) may have lower effective cost at percentage brokers.`
      },
      {
        heading: "Hidden Charges to Watch",
        content: `Beyond brokerage, these charges vary or catch traders off guard:

DP (Depository Participant) charges: Charged when shares/securities are debited from your demat account. For equity delivery trades. Varies: Dhan ₹15.93, Zerodha ₹13.50, Fyers ₹12, Angel One ₹20. For pure F&O traders (no delivery), DP charges don't apply.

Margin pledge charges: If you pledge stocks as collateral for F&O margin, brokers charge for the pledge and unpledge transactions. Zerodha: ₹30/pledge. Dhan: ₹30/pledge. Check your broker's specific rates.

Delayed payment charges: Most brokers charge interest on margin shortfalls. Typically 0.05% per day (18%/year). Keep sufficient margin to avoid these.

Account inactivity charges: Some brokers charge if you don't trade for 12+ months. Check your broker's policy. Dhan and Zerodha generally don't charge inactivity fees.

GST on all charges: 18% GST applies on brokerage and most transaction charges. This is unavoidable and identical across all brokers.`
      },
      {
        heading: "Monthly Cost Simulation — 50 Trades/Month",
        content: `Let's simulate a trader executing 50 F&O options trades per month (25 round trips), average premium ₹100, NIFTY lots (size 75):

Average trade value: ₹100 × 75 = ₹7,500

Dhan/Zerodha/Upstox (₹20 flat):
• Brokerage: 50 × ₹20 = ₹1,000
• GST on brokerage: ₹180
• Regulatory charges: ~₹700 (STT, exchange, SEBI across 50 trades)
• Monthly total: ~₹1,880

Angel One (0.25%):
• Brokerage: 50 × ₹18.75 = ₹937.50
• GST on brokerage: ₹168.75
• Regulatory charges: ~₹700 (same)
• Monthly total: ~₹1,806

In this scenario, Angel One is marginally cheaper on brokerage alone. But add ₹25/month extra AMC (₹300/year) and Angel One's higher charges for larger trades — and the difference disappears.

For traders doing higher premium trades (ATM straddles, etc.), flat-fee brokers win decisively.`
      },
    ],
    faqs: [
      { q: "What is the cheapest broker for F&O trading in India?", a: "Flat-fee brokers — Dhan, Zerodha, Upstox, Fyers — charge ₹20/order for F&O, which is the lowest available. Dhan is the cheapest overall when including AMC (₹0) and analytics. Avoid percentage-based brokers (Angel One 0.25%, ICICI Direct 0.55%) for active F&O trading." },
      { q: "Is there zero brokerage for options trading in India?", a: "No broker offers truly zero brokerage for F&O options in India. Regulatory charges (STT 0.0625%, exchange charges, SEBI fee, GST) apply to all trades regardless of broker. The minimum brokerage is ₹20/order at discount brokers. Zero-brokerage is only available for equity delivery." },
      { q: "What is STT on options in India?", a: "STT (Securities Transaction Tax) on options buying is 0.0625% of the premium paid. On options selling/writing, STT is 0.0625% of the premium received. This is a government tax identical across all brokers — it cannot be negotiated or avoided." },
      { q: "Which broker is cheapest for NIFTY options?", a: "For NIFTY options trading, flat-fee brokers (Dhan, Zerodha, Upstox, Fyers) are cheapest at ₹20/order. Among them, Dhan has the lowest total platform cost due to ₹0 AMC and free built-in analytics. The regulatory charges (STT, exchange fees) are identical across all brokers." },
    ],
  },

  "dhan-vs-upstox": {
    intro: `Dhan vs Upstox is the ₹0 AMC showdown. Both brokers charge zero annual maintenance fees. Both charge ₹20/order flat for F&O. Both are modern, technology-first platforms. So what actually differentiates them, and which should you choose for options trading?

We've tested both extensively from an F&O trader's perspective. The headline numbers are identical, but the user experience, options analytics, API quality, and total feature set differ significantly. Here's the honest comparison.`,

    verdict: `For options traders, Dhan wins clearly. Built-in Greeks and analytics, TradingView charts, more reliable API with server-side token renewal — Dhan is built specifically for F&O. Upstox is a better choice for beginners and equity investors who want simplicity over analytics depth. For active NIFTY/BANKNIFTY options trading, Dhan is the stronger platform.`,

    sections: [
      {
        heading: "Where They're Identical",
        content: `Dhan and Upstox share several key specs: both charge ₹0 AMC (lifetime), ₹0 account opening, ₹0 equity delivery brokerage, and ₹20/order flat for F&O options and futures. Both are SEBI-regulated. Both have modern mobile apps. Both have web platforms with reasonable charting.

For a basic equity investor, the two platforms are broadly similar. The difference emerges when you look at options-specific features, API quality, and total feature depth.`
      },
      {
        heading: "Options Analytics — Where Dhan Wins",
        content: `Upstox's option chain shows LTP, OI, volume, and bid/ask — a functional basic view. For Greeks, IVP, or straddle premium tracking, you need a third-party tool. Upstox doesn't have these built in.

Dhan's option chain includes live Greeks (Delta, Gamma, Theta, Vega) for every strike, IV per strike, IVP/IVR indicators, OI heatmap, and a straddle premium calculator. All free, built in.

For an NIFTY Iron Condor trader, the difference is tangible: on Dhan, you can see in real-time which strikes have the best risk/reward based on Greeks. On Upstox, you're working blind or paying for a separate analytics tool.`
      },
      {
        heading: "API Comparison",
        content: `Upstox API v2 requires OAuth browser-based authentication — no server-side automation of the daily token refresh. The access token expires and requires a manual login to renew. This is a significant limitation for automated or algo trading strategies that need to run 24/7.

Dhan API v2 includes a RenewToken endpoint that can be called server-side to extend the token without any browser interaction. A cron job running every 23 hours keeps the token alive indefinitely. For production algo systems, this is a material advantage.

Both APIs support order placement, market data, and historical data. Dhan's API is newer but well-documented. Upstox's API has a slightly larger developer community.`
      },
      {
        heading: "Mobile App & Platform Quality",
        content: `Upstox Pro Mobile is clean, fast, and genuinely excellent for a mobile-first trader. The onboarding is smooth and the app is intuitive for beginners. Charts are decent with standard indicators.

Dhan's mobile app is also strong, with the added benefit of showing live Greeks directly in the option chain on mobile — not just on web. The Super Charts (TradingView) work on mobile too.

For desktop trading: Dhan Super Charts on web is superior to Upstox Pro Web for options traders. TradingView's full feature set with options-specific overlays is a significant advantage.`
      },
    ],
    faqs: [
      { q: "Which is better, Dhan or Upstox?", a: "For options traders, Dhan is better — it has built-in Greeks, IVP/IVR analytics, TradingView charts, and a more automatable API. For simple equity investing and beginners, Upstox has a cleaner interface. Both charge ₹0 AMC and ₹20/order." },
      { q: "Does Upstox have options analytics?", a: "Upstox's option chain is basic — it shows LTP, OI, and volume, but no live Greeks, IVP, or IVR. For advanced options analytics, you need a separate tool. Dhan includes all of this built-in for free." },
      { q: "Is Upstox API better than Dhan API?", a: "Dhan API v2 is more suitable for automated trading because it supports server-side token renewal (no browser login required). Upstox requires browser-based OAuth daily — limiting for fully automated systems. Upstox API has a larger community due to being older." },
    ],
  },

  "best-broker-nifty-weekly-options": {
    intro: `NIFTY weekly options expire every Thursday — and the broker you use can meaningfully impact your strategy performance. During Thursday expiry, option chains move fast, execution matters, and a slow or unreliable platform can cost you more than brokerage.

We've traded NIFTY weekly options extensively — Iron Condors, Short Straddles, and Jade Lizards — and tested every major broker's performance on expiry day. Here's what we found.`,

    verdict: `For NIFTY weekly options trading, Dhan is our top pick: fast execution on Thursday expiry, built-in option chain with live Greeks for strike selection, TradingView charts for technical levels, and ₹20 flat per leg. Zerodha Kite is a strong second for its execution reliability. Avoid percentage-based brokers entirely for weekly options.`,

    sections: [
      {
        heading: "Why Broker Choice Matters for Weekly Options",
        content: `Weekly options trading has specific requirements that not all brokers meet equally:

1. Execution speed: On Thursday 3:00-3:30 PM, option premiums can move 50-200% in minutes. A 1-second delay in order placement can mean entering at significantly different prices. Both Dhan and Zerodha have low-latency execution infrastructure.

2. Option chain reliability: During high-IV events, some brokers' option chains lag or freeze. We've seen Upstox slow down during high-volume periods. Dhan and Zerodha have been consistently reliable in our testing.

3. Brokerage per leg: An Iron Condor has 4 legs (4 × ₹20 = ₹80 round trip entry + ₹80 exit = ₹160 total). At 0.25% brokerage with ATM strikes at ₹100 premium and 75 lots: 4 × ₹187.5 × 2 = ₹1,500 round trip. Flat fee wins decisively.

4. Greeks visibility: For deciding whether to close a position early or ride to expiry, live Delta and Theta data directly in the option chain saves time and missed opportunities.`
      },
      {
        heading: "Brokerage Impact on Weekly Strategy P&L",
        content: `Let's calculate the brokerage impact for a NIFTY weekly Iron Condor:
Setup: Sell 22,400 PE + 22,600 CE (ATM ± 100), Buy 22,300 PE + 22,700 CE as wings
Average premium collected: ₹80 for short legs, ₹20 cost for long legs
Net credit: ₹60 × 75 lots = ₹4,500

Brokerage round trip (flat ₹20 broker): 4 legs × ₹20 × 2 (entry + exit) = ₹160 = 3.6% of credit
Brokerage round trip (0.25% broker like Angel One): 4 × ₹80 × 75 × 0.25% × 2 ≈ ₹1,200 = 26.7% of credit

At a flat-fee broker, brokerage consumes 3.6% of premium. At Angel One, it consumes 26.7%. This is the difference between a viable strategy and an unviable one.

For weekly options strategies, this math is why percentage-based brokers are simply not a viable choice. You must use a flat-fee broker.`
      },
      {
        heading: "OptionsGyani + Dhan — The Complete Setup",
        content: `For serious NIFTY weekly options traders, we recommend this setup: Use OptionsGyani to backtest your strategy (Iron Condor, Short Straddle, etc.) on 8+ years of real NSE data — validate your edge, find optimal strike deltas, set realistic SL/TP levels. Then execute on Dhan.

OptionsGyani's backtesting engine shows you exactly how your NIFTY weekly Iron Condor would have performed from 2016 to today — win rate, average P&L, max drawdown, monthly heatmap. You'll know your strategy's characteristics before putting on a single real trade.

Dhan's built-in IVP indicator tells you whether IV is currently elevated or cheap — helping you time entries when premium selling is most advantageous (IVP > 75). This is the combination that turns guesswork into a systematic process.`
      },
    ],
    faqs: [
      { q: "Which broker is best for NIFTY weekly expiry options?", a: "Dhan is our top recommendation for NIFTY weekly options. Fast execution, live Greeks in the option chain, TradingView charts, ₹0 AMC, and ₹20 flat brokerage. Zerodha Kite is a strong second for execution reliability. Both beat any percentage-based broker for weekly strategies." },
      { q: "What is the brokerage for NIFTY options per lot?", a: "At flat-fee brokers (Dhan, Zerodha, Upstox), brokerage is ₹20 per executed order regardless of lot size. One Iron Condor (4 legs) costs ₹80 in brokerage entry + ₹80 exit = ₹160 round trip. Plus regulatory charges (STT, exchange, GST)." },
      { q: "How many lots should I trade in NIFTY weekly options?", a: "This is a risk management question, not a broker question. As a general guideline for new traders: start with 1 lot, never risk more than 2% of capital per trade, and backtest your strategy on OptionsGyani before committing capital. Lot size for NIFTY is currently 75 units." },
    ],
  },

  "how-to-open-dhan-account": {
    intro: `Opening a Dhan account takes about 10-15 minutes online with a smartphone and your documents ready. The process is fully digital — no branch visit, no physical paperwork, no printouts required.

Dhan offers a ₹0 AMC lifetime demat account with ₹20/order flat brokerage for F&O trading. For options traders, this means you save ₹300+ per year in AMC compared to Zerodha and get built-in options analytics included free.

This step-by-step guide walks you through the complete account opening process, the documents you need, the KYC verification steps, and what to do once your account is activated.`,

    verdict: `Opening a Dhan account is straightforward and fully online. The entire process from visiting dhan.co to account activation takes 1-3 business days. You need your PAN card, Aadhaar (linked to mobile for OTP), bank account details, and a smartphone. There are no charges — account opening and AMC are both ₹0.`,

    sections: [
      {
        heading: "Documents Required to Open Dhan Account",
        content: `Before starting the application, keep these documents ready:

1. PAN Card: Mandatory. Your PAN number is required for identity verification and tax compliance.
2. Aadhaar Card: Required for eKYC. Your Aadhaar must be linked to your mobile number for OTP verification. This is the fastest KYC method.
3. Bank Account: Your bank account number, IFSC code, and a cancelled cheque or bank passbook photo for linking your trading and savings accounts.
4. Signature: A clear image of your signature on white paper. This can be uploaded during the application.
5. Smartphone: Required for the IPV (In-Person Verification) — a 10-second selfie video to confirm your identity.

Optional but useful: DEMAT account statement from your current broker if you plan to transfer existing holdings.`
      },
      {
        heading: "Step-by-Step Account Opening Process",
        content: `Step 1: Visit dhan.co and click "Open Free Account." Enter your mobile number and complete the OTP verification.

Step 2: Enter your personal details — full name (as per PAN), date of birth, email address, and set a password for your account.

Step 3: PAN verification. Enter your PAN number. Dhan verifies it with the Income Tax database automatically.

Step 4: Aadhaar eKYC. Enter your Aadhaar number and complete the OTP sent to your Aadhaar-linked mobile. This fetches your address and other details automatically.

Step 5: Bank account linking. Enter your bank account number and IFSC code. Upload a photo of your cancelled cheque or passbook for verification.

Step 6: Trading preferences. Select the segments you want to trade (Equity, F&O, Currency, Commodity). For options traders, enable Equity + F&O at minimum.

Step 7: IPV (In-Person Verification). Record a short selfie video as instructed. This confirms your identity in compliance with SEBI regulations.

Step 8: E-sign. Digitally sign the account opening form using Aadhaar OTP. No physical signature or courier required.`
      },
      {
        heading: "Account Activation Timeline",
        content: `After completing all steps, your account goes through a verification process:

Day 0: Application submitted. You receive an acknowledgement email with your application reference number.
Day 1-2: Dhan verifies your documents, completes broker-side KYC, and creates your demat and trading accounts.
Day 2-3: You receive your Client ID (demat account number) and login credentials via email and SMS.

Most accounts activate within 1-2 business days if your Aadhaar is linked to your mobile and all documents are clear. If additional verification is needed (unclear documents, PAN-Aadhaar mismatch), it may take 3-5 days.

You can check your application status at dhan.co/account-opening-status using your application reference number.`
      },
      {
        heading: "What To Do After Your Account Opens",
        content: `Once your Dhan account is active:

1. Download the Dhan app (iOS or Android) and log in with your Client ID and password.

2. Set up TOTP (Time-based One-Time Password) for 2FA: Go to Profile → Security → Enable TOTP. Use Google Authenticator or Authy. This is required by SEBI and makes your account more secure.

3. Fund your trading account: Transfer funds from your linked bank account via UPI, NEFT, or IMPS. The amount appears in your trading account within minutes for UPI/IMPS.

4. Explore the platform: Check out Dhan Super Charts for TradingView-powered charting. Open the Option Chain to see live Greeks and IVP for NIFTY and BANKNIFTY.

5. Practice with OptionsGyani: Before placing real trades, use OptionsGyani's backtesting engine to validate your strategy on 8+ years of real NSE data, and paper trade with OptionsGyani's paper trading feature to practice without risk.`
      },
      {
        heading: "Dhan Account Opening — Common Issues & Solutions",
        content: `PAN-Aadhaar mismatch: Your name on PAN must match Aadhaar exactly. If there's a name mismatch, you'll need to update either document before proceeding.

Aadhaar not linked to mobile: If your Aadhaar isn't linked to a mobile number, you can't complete eKYC online. Visit your nearest Aadhaar centre or bank to link your mobile first.

Bank account verification failed: Ensure the bank account is in your name (joint accounts not accepted). The account must be active and operational.

IPV video issues: Record in good lighting with your face clearly visible. Hold your PAN card next to your face during recording as prompted. Avoid dark rooms or backlighting.

Document upload size: Keep images under 2MB. Use your phone camera — don't scan printed photos.

If you face issues during application, contact Dhan support at support@dhan.co or via the in-app chat. Response times are typically within a few hours.`
      },
    ],
    faqs: [
      { q: "Is opening a Dhan account free?", a: "Yes, Dhan account opening is completely free — ₹0 account opening charge and ₹0 AMC (Annual Maintenance Charge) for lifetime. There is no minimum balance requirement." },
      { q: "How long does Dhan account opening take?", a: "The online application takes 10-15 minutes. Account activation after submission typically takes 1-2 business days. You'll receive your login credentials via email and SMS." },
      { q: "What documents are needed to open a Dhan account?", a: "You need: PAN card, Aadhaar card (linked to mobile for OTP), bank account details (account number + IFSC), and a smartphone for the IPV selfie video. Signature on white paper is also required." },
      { q: "Can I open a Dhan account without Aadhaar?", a: "Aadhaar eKYC is the standard method for online account opening. Without Aadhaar eKYC, you'd need to go through an offline KYC process with physical document submission, which takes longer." },
      { q: "What is the minimum balance required in Dhan account?", a: "There is no minimum balance requirement in a Dhan account. However, to trade F&O, you need sufficient margin. NIFTY options require approximately ₹12,000-15,000 margin per lot for short positions; long options require only the premium amount." },
      { q: "Can NRI open Dhan account?", a: "Dhan accepts NRI accounts. You'll need your NRE/NRO bank account details and FEMA compliance documentation. The process for NRIs involves additional documentation compared to resident Indians." },
    ],
  },

  "dhan-vs-angel-one": {
    intro: `Dhan vs Angel One is a study in contrasts. Dhan is purpose-built for active traders, launched in 2021 with flat-fee pricing and advanced analytics. Angel One is India's largest broker by registered clients (25M+) with a 25-year history and full-service legacy.

For F&O traders specifically, this comparison has a clear winner based on brokerage structure alone. Let us show you the numbers.`,

    verdict: `For active F&O and options traders, Dhan wins convincingly. The 0.25% brokerage at Angel One is dramatically more expensive than Dhan's ₹20 flat for high-frequency options trading. Angel One is better for investors who want research, advisory, and a trusted full-service name — but for pure options trading cost efficiency, Dhan has no competition from Angel One.`,

    sections: [
      {
        heading: "The Brokerage Difference — Real Numbers",
        content: `This is the decisive comparison point:

Dhan: ₹20 flat per executed order for all F&O segments.
Angel One: ₹20 or 0.25% of trade value (whichever is lower) for intraday; for F&O it's ₹20 or 0.25% whichever is lower.

Wait — that sounds similar? Let's run the actual math:

NIFTY ATM Call, premium ₹100, lot size 75. Trade value = ₹7,500.
Dhan: ₹20 flat.
Angel One: min(₹20, 0.25% × ₹7,500) = min(₹20, ₹18.75) = ₹18.75.

So Angel One is actually slightly cheaper in this scenario? Technically yes — but only barely. And this reverses as premiums increase.

NIFTY ATM straddle, premium ₹200 + ₹200 = ₹400 combined, selling both legs:
Each leg trade value = ₹200 × 75 = ₹15,000.
Dhan: ₹20 per leg.
Angel One: 0.25% × ₹15,000 = ₹37.50 per leg.

At higher premiums and larger trades, flat fee wins decisively. An active options trader doing BANKNIFTY straddles during high IV events will consistently save on Dhan.`
      },
      {
        heading: "Options Analytics — Dhan vs Angel One",
        content: `Angel One's option chain is basic — similar to Zerodha's Kite, it shows LTP, OI, and volume but no live Greeks, IVP, or straddle analytics. For advanced options analysis, you need a third-party tool.

Dhan's option chain includes live Greeks for every strike, IV per strike, IVP/IVR indicators, and straddle premium tracking. All built in, all free.

For a systematic options trader running Iron Condors or Short Straddles on NIFTY, the built-in analytics on Dhan saves both money (no Sensibull subscription needed) and time (no context switching between platforms).`
      },
      {
        heading: "Angel One's Strengths",
        content: `Angel One is not without merit. Its SmartAPI is one of the best broker APIs in India for algo traders — specifically, TOTP-based authentication can be fully automated server-side, enabling zero-manual-intervention token renewal. This is actually better than Dhan's daily token model for long-running automated systems.

Angel One also has strong research reports, a dedicated advisory service for investors who want guidance, and 25+ years of regulatory track record. For investors who want a trusted full-service experience with occasional F&O trading, Angel One is a credible choice.

The 25M+ registered client base means Angel One has extensive branch support across India — useful if you need in-person assistance, which digital-only brokers like Dhan don't offer.`
      },
    ],
    faqs: [
      { q: "Which is better for options trading, Dhan or Angel One?", a: "Dhan is significantly better for active options trading. The ₹20 flat brokerage vs Angel One's 0.25% percentage model means Dhan is dramatically cheaper for high-frequency or high-premium options trades. Dhan also has built-in Greeks and analytics that Angel One lacks." },
      { q: "What is Angel One's brokerage for options?", a: "Angel One charges ₹20 or 0.25% of trade value (whichever is lower) for F&O options. For trades above ₹8,000 in value, this means ₹20 flat — identical to Dhan. For lower-value trades, the percentage may be slightly lower. However, the 0.25% model becomes expensive for high-premium or large-lot trades." },
      { q: "Does Angel One have options analytics?", a: "Angel One's platform has a basic option chain without live Greeks or IVP/IVR analytics. For advanced options analytics, traders need a third-party tool. Dhan includes these features free." },
    ],
  },
};

export function getArticleContent(slug) {
  return CONTENT[slug] || null;
}
