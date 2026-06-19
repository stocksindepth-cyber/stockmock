// ─── Data-driven Options Strategy Pages ─────────────────────────────────────────
// Each entry renders a full SEO landing page via src/app/strategies/[slug]/page.js.
// Add an entry here → you get a new crawlable, internally-linked strategy page.
//
// Existing hand-authored pages (iron-condor-nifty, short-straddle-banknifty,
// bull-call-spread-nifty, bear-put-spread-nifty, iron-butterfly-banknifty,
// calendar-spread-nifty, short-strangle-finnifty, nifty-weekly-expiry-guide)
// live as static routes and take precedence — do NOT duplicate those slugs here.
// ─────────────────────────────────────────────────────────────────────────────

// Index facts reused across prose so copy stays accurate and index-specific.
export const INDEX_META = {
  NIFTY: {
    label: "NIFTY",
    step: 50,
    lot: 75,
    expiry: "Thursday (weekly)",
    vix: "12–16",
    note: "India's flagship index — the deepest options liquidity and the tightest bid-ask spreads on the NSE.",
  },
  BANKNIFTY: {
    label: "BANKNIFTY",
    step: 100,
    lot: 30,
    expiry: "last Thursday (monthly)",
    vix: "15–20",
    note: "Higher volatility and larger point swings than NIFTY — premiums are richer, but so is the risk per lot.",
  },
  FINNIFTY: {
    label: "FINNIFTY",
    step: 50,
    lot: 65,
    expiry: "last Thursday (monthly)",
    vix: "13–18",
    note: "The financial-services index — behaves between NIFTY and BANKNIFTY, with banks and NBFCs driving the moves.",
  },
};

// Themes hold COMPLETE class strings (not interpolated) so Tailwind's JIT keeps them.
export const THEMES = {
  emerald: {
    glow: "#10b981",
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    accent: "text-emerald-400",
    statGlow: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
    edgeBox: "border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10",
    icon: "text-emerald-400",
    button: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/50",
    link: "hover:text-emerald-400",
  },
  amber: {
    glow: "#f59e0b",
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    accent: "text-amber-400",
    statGlow: "bg-amber-500/5 group-hover:bg-amber-500/10",
    edgeBox: "border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10",
    icon: "text-amber-400",
    button: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/50",
    link: "hover:text-amber-400",
  },
  indigo: {
    glow: "#6366f1",
    badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400",
    accent: "text-indigo-400",
    statGlow: "bg-indigo-500/5 group-hover:bg-indigo-500/10",
    edgeBox: "border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10",
    icon: "text-indigo-400",
    button: "from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-indigo-900/50",
    link: "hover:text-indigo-400",
  },
  fuchsia: {
    glow: "#d946ef",
    badge: "bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400",
    accent: "text-fuchsia-400",
    statGlow: "bg-fuchsia-500/5 group-hover:bg-fuchsia-500/10",
    edgeBox: "border-fuchsia-500/10 bg-fuchsia-500/5 hover:bg-fuchsia-500/10",
    icon: "text-fuchsia-400",
    button: "from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 shadow-fuchsia-900/50",
    link: "hover:text-fuchsia-400",
  },
  purple: {
    glow: "#a855f7",
    badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    accent: "text-purple-400",
    statGlow: "bg-purple-500/5 group-hover:bg-purple-500/10",
    edgeBox: "border-purple-500/10 bg-purple-500/5 hover:bg-purple-500/10",
    icon: "text-purple-400",
    button: "from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/50",
    link: "hover:text-purple-400",
  },
  rose: {
    glow: "#f43f5e",
    badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    accent: "text-rose-400",
    statGlow: "bg-rose-500/5 group-hover:bg-rose-500/10",
    edgeBox: "border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10",
    icon: "text-rose-400",
    button: "from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-900/50",
    link: "hover:text-rose-400",
  },
  teal: {
    glow: "#14b8a6",
    badge: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    accent: "text-teal-400",
    statGlow: "bg-teal-500/5 group-hover:bg-teal-500/10",
    edgeBox: "border-teal-500/10 bg-teal-500/5 hover:bg-teal-500/10",
    icon: "text-teal-400",
    button: "from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-900/50",
    link: "hover:text-teal-400",
  },
};

// payoff: one of "tent" (range-bound credit), "ramp-up" (bullish), "ramp-down"
// (bearish), "valley" (long volatility). Drives the generic payoff SVG.

export const STRATEGIES = {
  // ── Iron Condor (Neutral, defined risk) ──────────────────────────────────
  "iron-condor-banknifty": {
    name: "Iron Condor on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Neutral",
    theme: "emerald",
    payoff: "tent",
    badge: "Non-Directional · Defined Risk · Theta Positive",
    tagline:
      "Sell a call spread and a put spread around BANKNIFTY and pocket the premium while the index churns inside a range — with your maximum loss capped on day one.",
    keywords:
      "iron condor banknifty, banknifty iron condor strategy, banknifty range strategy, defined risk options banknifty, banknifty monthly expiry strategy",
    intro: [
      "The Iron Condor is the workhorse of non-directional options trading, and on BANKNIFTY it earns its keep. You simultaneously sell an out-of-the-money (OTM) call spread above the market and an OTM put spread below it. As long as BANKNIFTY expires between your two short strikes, every leg decays in your favour and you keep the net credit.",
      "BANKNIFTY moves harder than NIFTY — daily ranges of 1.5–2% are routine — so a condor here needs wider wings than its NIFTY cousin. The upside is that those bigger moves mean fatter premiums: the same delta-neutral structure collects more credit on BANKNIFTY than on NIFTY for a comparable probability of profit.",
      "Because every short option is protected by a long option further out, your risk is defined before you enter. You know your worst case to the rupee, which is exactly why the Iron Condor is the first 'real' strategy most disciplined Indian options sellers graduate to.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "66–70%", note: "Across range-bound monthly cycles" },
      { label: "Credit Collected", value: "₹180–260", note: "Per share, ~1 SD wings" },
      { label: "Max Risk / Lot", value: "Capped", note: "Spread width minus credit" },
      { label: "Best Regime", value: "Low VIX", note: "Falling or flat volatility" },
      { label: "Theta", value: "Positive", note: "Time decay works for you daily" },
      { label: "Margin / Lot", value: "₹45k–60k", note: "Lower than naked selling" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY monthly options (100-point strikes)" },
      { label: "Short Strikes", value: "~1 standard deviation OTM on both sides" },
      { label: "Long Strikes", value: "200–300 points beyond each short (the wings)" },
      { label: "Entry Window", value: "8–12 trading days to expiry, when IV is elevated" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Adjustment Trigger", value: "Short strike delta crosses ~0.30" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "ATM − ~1 SD", note: "Short put — collects premium" },
      { action: "BUY", type: "PE", strike: "below short put", note: "Long put wing — caps downside" },
      { action: "SELL", type: "CE", strike: "ATM + ~1 SD", note: "Short call — collects premium" },
      { action: "BUY", type: "CE", strike: "above short call", note: "Long call wing — caps upside" },
    ],
    edges: [
      {
        title: "You sell BANKNIFTY's fear premium",
        body: "BANKNIFTY implied volatility almost always prints above the volatility the index actually delivers. The Iron Condor is a structured way to harvest that gap repeatedly, with both wings turning the trade into a defined-risk bet rather than an open-ended one.",
      },
      {
        title: "Width controls everything",
        body: "On BANKNIFTY the distance between short and long strikes is your single biggest lever. Wider wings = more credit but more capital at risk; narrower wings = cheaper but a worse risk:reward. Backtest a few widths on the same expiry to find your comfort zone before risking real margin.",
      },
      {
        title: "Defined risk survives gap days",
        body: "Bank stocks gap on RBI policy, results, and global cues. A naked strangle can blow up on such a gap; the long wings of a condor turn a potential disaster into a known, pre-budgeted maximum loss.",
      },
    ],
    whenToUse: [
      "BANKNIFTY is consolidating in a clear range with no major bank results or RBI policy inside your holding window.",
      "India VIX is elevated and you expect it to cool — you sell rich premium and let IV contraction help you.",
      "You want defined risk and can't babysit the screen all day.",
    ],
    risks: [
      "A trending breakout through a short strike is the main enemy — manage at the short-delta trigger, don't hope.",
      "Both spreads can't lose at once, but a violent one-sided move toward max loss on a wing still hurts.",
      "Event gaps (results, RBI) can jump straight past your short strike overnight — avoid holding through known events.",
    ],
    faq: [
      {
        q: "Why use an Iron Condor on BANKNIFTY instead of a Short Strangle?",
        a: "Both are non-directional, but the Iron Condor buys protective wings, which caps your maximum loss and dramatically lowers margin. On a high-beta index like BANKNIFTY that can gap on bank results or RBI policy, that defined risk is worth the slightly lower credit.",
      },
      {
        q: "How wide should the wings be on a BANKNIFTY Iron Condor?",
        a: "A common starting point is 200–300 points between the short and long strike on each side. Wider wings collect more credit but risk more capital. The right width depends on the current premium and your risk appetite — backtest a few widths on OptionsGyani before committing.",
      },
      {
        q: "When should I exit a BANKNIFTY Iron Condor?",
        a: "Most systematic traders book profit at ~50% of the credit received rather than holding to expiry, and adjust or exit when a short strike's delta crosses roughly 0.30. This keeps the win rate high and avoids gamma risk in the final two days.",
      },
    ],
  },

  "iron-condor-finnifty": {
    name: "Iron Condor on FINNIFTY",
    index: "FINNIFTY",
    category: "Neutral",
    theme: "emerald",
    payoff: "tent",
    badge: "Non-Directional · Defined Risk · Theta Positive",
    tagline:
      "Run the classic range-bound credit structure on FINNIFTY — a calmer cousin of BANKNIFTY that often sits politely inside its expected move.",
    keywords:
      "iron condor finnifty, finnifty range strategy, finnifty options strategy, finnifty expiry strategy, defined risk finnifty",
    intro: [
      "FINNIFTY tracks the financial-services slice of the market — a basket dominated by HDFC Bank, ICICI, and other heavyweights. It tends to be a touch less explosive than BANKNIFTY, which makes it a friendly home for the Iron Condor: a defined-risk, non-directional structure that profits when the index finishes inside a range.",
      "You sell an OTM call spread and an OTM put spread, collect a net credit, and let theta do the work. Because FINNIFTY's expected moves are often more contained, a condor's short strikes can sit reasonably close to the money while still keeping a comfortable buffer.",
      "As with every condor, your maximum loss is fixed by the spread width minus the credit — you can size the trade and sleep at night, which is the whole point of building wings into the position.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "67–71%", note: "Range-bound monthly cycles" },
      { label: "Credit Collected", value: "₹90–150", note: "Per share, ~1 SD wings" },
      { label: "Max Risk / Lot", value: "Capped", note: "Spread width minus credit" },
      { label: "Best Regime", value: "Low / falling VIX", note: "Calm financials tape" },
      { label: "Theta", value: "Positive", note: "Decay accrues daily" },
      { label: "Margin / Lot", value: "₹40k–55k", note: "Defined-risk efficiency" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Short Strikes", value: "~1 standard deviation OTM both sides" },
      { label: "Long Strikes", value: "100–200 points beyond each short" },
      { label: "Entry Window", value: "8–12 days to expiry with healthy IV" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Adjustment Trigger", value: "Short strike delta near ~0.30" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "ATM − ~1 SD", note: "Short put" },
      { action: "BUY", type: "PE", strike: "below short put", note: "Put wing — caps downside" },
      { action: "SELL", type: "CE", strike: "ATM + ~1 SD", note: "Short call" },
      { action: "BUY", type: "CE", strike: "above short call", note: "Call wing — caps upside" },
    ],
    edges: [
      {
        title: "Calmer tape, cleaner ranges",
        body: "FINNIFTY's heavyweight constituents move more sedately than the pure-bank BANKNIFTY basket on most days, so ranges hold more reliably — exactly the environment a condor wants.",
      },
      {
        title: "50-point strikes = fine-grained control",
        body: "With 50-point strike spacing you can place short strikes and wings precisely around your expected move, dialing in the credit-to-risk ratio more finely than the 100-point BANKNIFTY grid allows.",
      },
      {
        title: "Defined risk through results season",
        body: "Financials report in clusters. The protective wings mean a surprise HDFC or ICICI result can't turn a quiet condor into an open-ended loss — your downside is budgeted in advance.",
      },
    ],
    whenToUse: [
      "FINNIFTY is range-bound and no major banking results land inside your holding window.",
      "You want a calmer, defined-risk premium-selling trade with finer strike control than BANKNIFTY.",
      "IV is elevated and you expect it to ease into expiry.",
    ],
    risks: [
      "A strong directional run in financials can push the index through a short strike — respect the delta trigger.",
      "Liquidity is thinner than NIFTY/BANKNIFTY; use limit orders and check the spread before entering each leg.",
      "Clustered bank results can gap the index — avoid holding through them.",
    ],
    faq: [
      {
        q: "Is FINNIFTY liquid enough for an Iron Condor?",
        a: "FINNIFTY options are liquid around the at-the-money strikes and the monthly expiry, which is what a condor uses. Liquidity thins out in deep OTM strikes, so keep your wings within a sensible range and always use limit orders.",
      },
      {
        q: "How is a FINNIFTY condor different from a BANKNIFTY condor?",
        a: "FINNIFTY typically has smaller expected moves and 50-point strikes (versus 100 on BANKNIFTY), so you get finer control over strike placement and often a tighter, calmer range — at the cost of somewhat smaller premiums.",
      },
      {
        q: "What's the ideal expiry to trade a FINNIFTY Iron Condor?",
        a: "The monthly expiry (last Thursday) carries the most reliable liquidity. Enter with 8–12 days left so theta is meaningful but gamma risk is still manageable.",
      },
    ],
  },

  // ── Short Straddle on NIFTY (Neutral, undefined risk) ─────────────────────
  "short-straddle-nifty": {
    name: "Short Straddle on NIFTY",
    index: "NIFTY",
    category: "Neutral",
    theme: "amber",
    payoff: "tent",
    badge: "Maximum Theta · Undefined Risk · Active Management",
    tagline:
      "Sell the ATM call and put together on NIFTY to collect the richest possible time decay — the purest expression of 'the market goes nowhere'.",
    keywords:
      "short straddle nifty, nifty straddle strategy, nifty weekly straddle, theta decay nifty, nifty expiry day strategy",
    intro: [
      "A Short Straddle is the most concentrated premium-selling trade there is: you sell the at-the-money call and the at-the-money put on the same NIFTY strike and expiry. You collect both premiums up front, and you win as long as NIFTY stays close to that strike into expiry.",
      "On NIFTY's weekly expiry, the straddle is a theta machine. The combined ATM premium decays fastest in the final days, so traders often deploy it Monday-for-Thursday or even as an expiry-day intraday trade, capturing the steepest part of the decay curve.",
      "The trade-off is real: a Short Straddle has undefined risk on both sides. A sharp NIFTY move can produce large losses quickly, which is why position sizing, a hard stop, and active delta management are non-negotiable. This is a strategy for traders who manage, not set-and-forget.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "60–65%", note: "When NIFTY stays range-bound" },
      { label: "Credit Collected", value: "₹250–360", note: "ATM call + put, weekly" },
      { label: "Max Risk", value: "Undefined", note: "Use a hard stop — always" },
      { label: "Best Regime", value: "Flat / chop", note: "Low realised volatility" },
      { label: "Theta", value: "Very high", note: "Peak decay near expiry" },
      { label: "Hold Time", value: "Intraday–3 days", note: "Often Mon→Thu" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly options (50-point strikes)" },
      { label: "Strikes", value: "Sell the ATM call AND ATM put (same strike)" },
      { label: "Entry Window", value: "Monday for Thursday expiry, or expiry-day intraday" },
      { label: "Profit Target", value: "25–40% of the combined credit" },
      { label: "Stop Loss", value: "Hard stop at ~1.5–2× the credit (mandatory)" },
      { label: "Delta Hedge", value: "Adjust with futures/options past ±0.25 net delta" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "ATM", note: "Short ATM call" },
      { action: "SELL", type: "PE", strike: "ATM", note: "Short ATM put — same strike" },
    ],
    edges: [
      {
        title: "Maximum theta per rupee of margin",
        body: "No other neutral structure decays faster than an ATM straddle. If your view is genuinely 'NIFTY goes nowhere this week', the straddle extracts the most premium for that view of any trade you can put on.",
      },
      {
        title: "NIFTY's liquidity makes management cheap",
        body: "Because NIFTY weeklies are the most liquid options in India, you can roll, hedge, or exit with razor-thin slippage. That matters enormously for an undefined-risk trade where fast, clean adjustments are the difference between a small loss and a big one.",
      },
      {
        title: "The IV-vs-realised gap is your edge",
        body: "Week after week, NIFTY's implied volatility tends to overstate the move that actually happens. The straddle monetises that overstatement — but only if you survive the weeks it doesn't, which is what stops and sizing are for.",
      },
    ],
    whenToUse: [
      "You expect a quiet, range-bound week with no NIFTY-moving events (budget, Fed, big data).",
      "India VIX is high and you expect it to fall — you sell expensive premium into a volatility crush.",
      "You can actively monitor and adjust delta intraday.",
    ],
    risks: [
      "Undefined risk on both sides — a trending day can produce outsized losses fast.",
      "Gamma risk explodes in the final two sessions; many traders avoid carrying a naked straddle into the last day unhedged.",
      "Never deploy without a pre-defined hard stop and conservative position size.",
    ],
    faq: [
      {
        q: "Is a Short Straddle on NIFTY profitable?",
        a: "Historically, selling NIFTY ATM straddles has been profitable across most quiet weeks because implied volatility tends to exceed realised volatility. The catch is that a handful of trending weeks can erase many winners, so disciplined stops and position sizing decide whether you actually keep the edge.",
      },
      {
        q: "When is the best time to enter a NIFTY Short Straddle?",
        a: "Two popular windows: Monday morning for the Thursday weekly expiry (to capture the bulk of theta), and an intraday expiry-day straddle for the very steepest decay. Avoid entering right before a known market-moving event.",
      },
      {
        q: "How do I manage risk on an undefined-risk straddle?",
        a: "Always set a hard stop (commonly 1.5–2× the credit), size small relative to capital, and hedge delta with futures or far options when the position skews directional. If you want capped risk instead, convert it to an Iron Butterfly by buying protective wings.",
      },
    ],
  },

  // ── Short Strangle on NIFTY (Neutral, undefined risk) ─────────────────────
  "short-strangle-nifty": {
    name: "Short Strangle on NIFTY",
    index: "NIFTY",
    category: "Neutral",
    theme: "fuchsia",
    payoff: "tent",
    badge: "Wider Breakevens · High Win Rate · Undefined Risk",
    tagline:
      "Sell an OTM call and an OTM put on NIFTY for a higher-probability, wider-range version of the straddle.",
    keywords:
      "short strangle nifty, nifty strangle strategy, otm premium selling nifty, nifty weekly strangle, high probability options nifty",
    intro: [
      "The Short Strangle is the straddle's more forgiving sibling. Instead of selling at the money, you sell an out-of-the-money call above the market and an out-of-the-money put below it. That gap between the strikes gives NIFTY room to wander while you still keep the full credit.",
      "Strangles trade win rate for premium: you collect less than a straddle, but your breakevens are wider, so you're profitable across a much larger range of outcomes. For NIFTY's typically contained weekly moves, that wider tent is often the better fit.",
      "It is still an undefined-risk, premium-selling trade — a violent move beyond a short strike can hurt. The discipline is identical to the straddle: size sensibly, set a stop, and manage delta when one side comes under pressure.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "70–75%", note: "Wider breakevens lift win rate" },
      { label: "Credit Collected", value: "₹120–200", note: "OTM call + put, weekly" },
      { label: "Max Risk", value: "Undefined", note: "Hard stop required" },
      { label: "Best Regime", value: "Range / mild trend", note: "Contained moves" },
      { label: "Theta", value: "High", note: "Decay across the range" },
      { label: "Hold Time", value: "1–3 days", note: "Often Mon/Tue → Thu" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly options (50-point strikes)" },
      { label: "Short Strikes", value: "Sell ~0.15–0.20 delta call and put" },
      { label: "Entry Window", value: "Early in the weekly cycle with elevated IV" },
      { label: "Profit Target", value: "50% of the combined credit" },
      { label: "Stop Loss", value: "~2× credit or short-strike delta breach" },
      { label: "Adjustment", value: "Roll the tested side out/away to re-center" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "~0.15–0.20 delta OTM", note: "Short OTM put" },
      { action: "SELL", type: "CE", strike: "~0.15–0.20 delta OTM", note: "Short OTM call" },
    ],
    edges: [
      {
        title: "Higher probability of profit",
        body: "By selling OTM rather than ATM, the strangle's breakevens sit further from the spot. NIFTY can drift, chop, and still leave you a winner — the wider the tent, the more weeks you collect.",
      },
      {
        title: "Easier to adjust than a straddle",
        body: "When one side is tested, you can roll the untested side closer to collect more credit, or roll the tested side away. The OTM starting point gives you more room to maneuver before the position turns truly directional.",
      },
      {
        title: "Delta-selectable risk",
        body: "Choosing your short-strike delta (0.10 vs 0.20) directly sets your win rate and credit. Lower delta = higher win rate, smaller credit; this single dial lets you tune the trade to the week's volatility.",
      },
    ],
    whenToUse: [
      "You expect NIFTY to stay broadly range-bound but want more cushion than a straddle gives.",
      "IV is rich and you want a high-probability theta trade with room for error.",
      "You can monitor positions and roll the tested side when needed.",
    ],
    risks: [
      "Undefined risk beyond the short strikes — a strong trend or gap can run through a wing.",
      "Smaller credit than a straddle means a single large loss can wipe several winners.",
      "Always trade with a stop and conservative sizing; convert to an Iron Condor for defined risk.",
    ],
    faq: [
      {
        q: "Short Strangle vs Short Straddle on NIFTY — which is better?",
        a: "A strangle has wider breakevens and a higher win rate but collects less premium; a straddle collects maximum premium but needs NIFTY to pin near the strike. For most range-bound NIFTY weeks the strangle's extra cushion is the more comfortable trade.",
      },
      {
        q: "Which deltas should I sell for a NIFTY Short Strangle?",
        a: "Selling around 0.15–0.20 delta on each side is a common balance of win rate and credit. Lower deltas (0.10) raise the win rate but shrink the premium; backtest both on OptionsGyani to see the trade-off on real NIFTY data.",
      },
      {
        q: "How do I defend a tested NIFTY strangle?",
        a: "Roll the untested side toward the money to collect more credit and re-center, or roll the tested side further out. If the move is decisive, respect your stop rather than averaging into a losing direction.",
      },
    ],
  },

  // ── Short Strangle on BANKNIFTY ───────────────────────────────────────────
  "short-strangle-banknifty": {
    name: "Short Strangle on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Neutral",
    theme: "fuchsia",
    payoff: "tent",
    badge: "Fat Premiums · Wide Range · Undefined Risk",
    tagline:
      "Harvest BANKNIFTY's rich option premiums with an OTM call and put — the highest-credit neutral trade on the most volatile index.",
    keywords:
      "short strangle banknifty, banknifty strangle strategy, banknifty premium selling, banknifty otm selling, banknifty monthly strangle",
    intro: [
      "BANKNIFTY is where premium sellers go for the biggest credits. Its elevated implied volatility means an OTM strangle collects substantially more than the same structure on NIFTY — the Short Strangle is the most direct way to monetise that.",
      "You sell an OTM call and an OTM put, keeping the full credit as long as BANKNIFTY expires between the strikes. The wide gap between the short strikes is essential here: BANKNIFTY's 1.5–2% daily ranges demand more breathing room than NIFTY does.",
      "The flip side of fat premiums is fat risk. BANKNIFTY can move 1,000+ points on RBI policy or bank results, and a naked strangle has no wings. This is an undefined-risk trade that lives or dies by sizing, stops, and active management.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "68–73%", note: "Wide OTM breakevens" },
      { label: "Credit Collected", value: "₹350–550", note: "OTM call + put" },
      { label: "Max Risk", value: "Undefined", note: "Hard stop mandatory" },
      { label: "Best Regime", value: "Range / falling IV", note: "Post-event calm" },
      { label: "Theta", value: "High", note: "Rich decay to harvest" },
      { label: "Margin / Lot", value: "₹1.2L–1.6L", note: "Naked selling margin" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY monthly options (100-point strikes)" },
      { label: "Short Strikes", value: "~0.12–0.18 delta call and put" },
      { label: "Entry Window", value: "Post-event, elevated IV, 8–15 days out" },
      { label: "Profit Target", value: "50% of the combined credit" },
      { label: "Stop Loss", value: "~2× credit or short-strike delta breach" },
      { label: "Adjustment", value: "Roll tested side; cut size into events" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "~0.12–0.18 delta OTM", note: "Short OTM put" },
      { action: "SELL", type: "CE", strike: "~0.12–0.18 delta OTM", note: "Short OTM call" },
    ],
    edges: [
      {
        title: "The richest neutral credit on the NSE",
        body: "BANKNIFTY's higher IV means its OTM options are simply worth more. For the same probability of profit, you collect a noticeably bigger credit than on NIFTY — the core reason aggressive premium sellers gravitate here.",
      },
      {
        title: "Volatility crush after events",
        body: "BANKNIFTY IV spikes into RBI policy and bank results, then collapses afterward. Selling a strangle into that elevated IV and holding through the crush stacks theta and vega in your favour at once.",
      },
      {
        title: "Wide strikes absorb the chop",
        body: "Placing short strikes far OTM lets BANKNIFTY do its usual intraday thrashing without threatening the position — only a sustained directional run actually puts a strike in danger.",
      },
    ],
    whenToUse: [
      "Implied volatility is elevated (often right after an event) and you expect it to deflate.",
      "BANKNIFTY is consolidating with no RBI policy or major bank results in your window.",
      "You have the margin and the discipline to manage an undefined-risk position.",
    ],
    risks: [
      "Largest tail risk of the neutral family — BANKNIFTY can gap 1,000+ points on policy or results.",
      "Naked selling ties up large margin; a max-loss event can be severe without wings.",
      "Mandatory: hard stop, small size, and no holding through known events. Use an Iron Condor for defined risk.",
    ],
    faq: [
      {
        q: "Why sell strangles on BANKNIFTY instead of NIFTY?",
        a: "BANKNIFTY's higher implied volatility means richer premiums — the same delta strangle collects more credit. The trade-off is bigger tail risk, so most traders cap size and keep strikes well OTM, or switch to a defined-risk Iron Condor.",
      },
      {
        q: "How far OTM should BANKNIFTY strangle strikes be?",
        a: "Selling around 0.12–0.18 delta on each side keeps breakevens wide enough to absorb BANKNIFTY's larger swings. Because the index moves hard, err toward further-OTM strikes than you would on NIFTY.",
      },
      {
        q: "Should I hold a BANKNIFTY strangle through bank results?",
        a: "Generally no. Clustered bank results and RBI policy can gap the index straight through a short strike. Either exit before the event or convert to a defined-risk structure with protective wings.",
      },
    ],
  },

  // ── Bull Call Spread on BANKNIFTY (Bullish, defined risk) ─────────────────
  "bull-call-spread-banknifty": {
    name: "Bull Call Spread on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Bullish",
    theme: "indigo",
    payoff: "ramp-up",
    badge: "Directional Bullish · Defined Risk · Low Cost",
    tagline:
      "Express a bullish BANKNIFTY view at a fraction of the cost of a naked call, with your risk capped at the net debit.",
    keywords:
      "bull call spread banknifty, banknifty bullish strategy, banknifty debit spread, defined risk bullish banknifty, banknifty call spread",
    intro: [
      "When you're bullish on BANKNIFTY but don't want to pay full price for a naked call — or bleed theta waiting for the move — the Bull Call Spread is the answer. You buy a call near the money and sell a higher call against it, financing part of the cost.",
      "The sold call caps your upside, but it also slashes your cost and your breakeven. On a high-priced index like BANKNIFTY, where naked calls are expensive and decay fast, that financing makes a directional bet far more efficient.",
      "Your maximum loss is the net debit, fixed on entry. That defined risk is what makes the bull call spread the disciplined way to play a BANKNIFTY breakout, an oversold bounce, or a pre-results drift higher.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "52–56%", note: "Directional trades win less often" },
      { label: "Avg Trade ROI", value: "12–18%", note: "On net debit deployed" },
      { label: "Max Risk", value: "Net Debit", note: "Capped on entry" },
      { label: "Best Regime", value: "Breakout / bounce", note: "Moderately bullish" },
      { label: "Theta Drag", value: "Reduced", note: "Short call offsets decay" },
      { label: "Capital / Lot", value: "₹6k–12k", note: "Net debit per lot" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY weekly/monthly options (100-pt strikes)" },
      { label: "Buy Leg", value: "ATM or slightly ITM call" },
      { label: "Sell Leg", value: "300–500 points OTM call" },
      { label: "Entry Window", value: "At support reclaim or pre-bullish-event" },
      { label: "Profit Target", value: "70–80% of the spread width" },
      { label: "Stop Loss", value: "Exit on support break / thesis invalidation" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "ATM / slightly ITM", note: "Long call — the engine" },
      { action: "SELL", type: "CE", strike: "300–500 pts OTM", note: "Short call — finances the trade" },
    ],
    edges: [
      {
        title: "Theta drag, neutralised",
        body: "A naked BANKNIFTY call bleeds heavily if the move stalls. In a spread, the short call decays in your favour at nearly the rate the long call decays against you, so a few flat days barely dent the position.",
      },
      {
        title: "Cheaper entry, lower breakeven",
        body: "The credit from the short call cuts your net cost, which pulls your breakeven closer to spot. You need a smaller move to turn profitable than a naked call would require.",
      },
      {
        title: "Defined risk on a violent index",
        body: "BANKNIFTY can reverse hard. With a spread, your worst case is the net debit — no margin calls, no open-ended downside if the bullish thesis fails.",
      },
    ],
    whenToUse: [
      "You're moderately bullish on BANKNIFTY — expecting a move toward a target, not a moonshot.",
      "Implied volatility is high and you want to avoid overpaying for a naked call.",
      "You want a capped-risk, capital-efficient way to play a breakout or bounce.",
    ],
    risks: [
      "Capped upside — if BANKNIFTY rockets far past your short strike, you leave gains on the table.",
      "Still a directional bet: a drop below support takes the position toward max loss.",
      "Choose strikes around a realistic target; too-narrow a spread limits reward, too-wide raises cost.",
    ],
    faq: [
      {
        q: "Why trade a Bull Call Spread instead of buying a BANKNIFTY call?",
        a: "A naked call is expensive and bleeds theta if the move is slow. The spread sells a higher call to finance the purchase, cutting cost, lowering the breakeven, and reducing time decay — at the price of a capped upside.",
      },
      {
        q: "How wide should the BANKNIFTY bull call spread be?",
        a: "Set the short strike near your realistic price target — often 300–500 points above the long strike. Wider spreads cost more but pay more if the target is hit; narrower spreads are cheaper with a smaller maximum profit.",
      },
      {
        q: "What's the maximum loss on a bull call spread?",
        a: "It's strictly the net debit you paid to enter, no matter how far BANKNIFTY falls. That defined risk is the main reason traders prefer spreads over naked options for directional bets.",
      },
    ],
  },

  // ── Iron Butterfly on NIFTY (Neutral, defined risk) ───────────────────────
  "iron-butterfly-nifty": {
    name: "Iron Butterfly on NIFTY",
    index: "NIFTY",
    category: "Neutral",
    theme: "purple",
    payoff: "tent",
    badge: "Pinpoint Neutral · Defined Risk · High Credit",
    tagline:
      "A capped-risk Short Straddle — sell the ATM call and put, then buy wings, to bet on a NIFTY pin with your downside budgeted.",
    keywords:
      "iron butterfly nifty, nifty iron fly, defined risk straddle nifty, nifty expiry pinning strategy, nifty neutral options",
    intro: [
      "The Iron Butterfly is what you get when you take a Short Straddle and bolt protective wings onto it. You sell the ATM call and ATM put (the body), then buy a further OTM call and put (the wings). The result is a high-credit, defined-risk bet that NIFTY finishes near your strike.",
      "Because the body is at the money, the credit is large — close to a straddle's — but the wings cap your maximum loss, slashing margin and removing the open-ended tail. It's a favourite for NIFTY expiry days, when the index often 'pins' near a round strike.",
      "The payoff is a sharp tent: maximum profit if NIFTY expires exactly at the body strike, tapering to a fixed maximum loss past the wings. It rewards precision about where NIFTY will land.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "55–60%", note: "Needs a tight pin" },
      { label: "Credit Collected", value: "₹180–260", note: "ATM body, weekly" },
      { label: "Max Risk / Lot", value: "Capped", note: "Wing width minus credit" },
      { label: "Best Regime", value: "Expiry pin / high IV", note: "Low realised move" },
      { label: "Theta", value: "Very high", note: "ATM body decays fast" },
      { label: "Margin / Lot", value: "₹30k–45k", note: "Far below a naked straddle" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly options (50-point strikes)" },
      { label: "Body", value: "Sell ATM call AND ATM put (same strike)" },
      { label: "Wings", value: "Buy a call and put 150–250 points OTM" },
      { label: "Entry Window", value: "High IV, or expiry-day pinning setups" },
      { label: "Profit Target", value: "25–40% of the net credit" },
      { label: "Adjustment", value: "Re-center if NIFTY drifts off the body strike" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "ATM", note: "Short ATM put — body" },
      { action: "SELL", type: "CE", strike: "ATM", note: "Short ATM call — body" },
      { action: "BUY", type: "PE", strike: "150–250 pts OTM", note: "Put wing — caps downside" },
      { action: "BUY", type: "CE", strike: "150–250 pts OTM", note: "Call wing — caps upside" },
    ],
    edges: [
      {
        title: "Straddle credit, capped risk",
        body: "The ATM body collects almost as much premium as a naked straddle, but the wings convert undefined risk into a fixed, known maximum loss — and cut the margin dramatically.",
      },
      {
        title: "Built for the expiry pin",
        body: "NIFTY frequently gravitates to a high-OI round strike on expiry day. The Iron Butterfly's peak payoff sits right at that strike, making it a natural expression of a pinning thesis.",
      },
      {
        title: "High theta, controlled gamma",
        body: "The ATM body throws off intense time decay, while the long wings tame the gamma blow-up that makes a naked straddle so dangerous in the final hours.",
      },
    ],
    whenToUse: [
      "You expect NIFTY to finish very close to a specific strike (classic expiry-day pinning).",
      "IV is high and you want maximum credit but refuse open-ended risk.",
      "You want a defined-risk alternative to a Short Straddle.",
    ],
    risks: [
      "Narrow profit zone — NIFTY must stay near the body strike; a decisive move toward a wing means max loss.",
      "Lower win rate than a strangle/condor because the body is at the money.",
      "Re-centering after a drift costs credit; don't chase a runaway move.",
    ],
    faq: [
      {
        q: "Iron Butterfly vs Iron Condor on NIFTY — what's the difference?",
        a: "Both are defined-risk neutral trades. The Iron Butterfly sells at-the-money options (higher credit, narrower profit zone, needs a tight pin), while the Iron Condor sells OTM options (lower credit, wider profit zone, higher win rate). Pick the butterfly when you expect a pin, the condor when you expect a range.",
      },
      {
        q: "Is the Iron Butterfly good for NIFTY expiry day?",
        a: "Yes — it's one of the most popular expiry-day structures because NIFTY often pins near a high-open-interest round strike, which is exactly where the butterfly's peak payoff sits. The defined risk also keeps expiry-day gamma under control.",
      },
      {
        q: "How wide should the wings be?",
        a: "Wings 150–250 points from the body are common on NIFTY. Wider wings raise the credit and the maximum loss; narrower wings reduce both. Backtest a few widths to match your risk tolerance.",
      },
    ],
  },

  // ── Bull Put Spread on NIFTY (Bullish, credit, defined risk) ──────────────
  "bull-put-spread-nifty": {
    name: "Bull Put Spread on NIFTY",
    index: "NIFTY",
    category: "Bullish",
    theme: "emerald",
    payoff: "ramp-up",
    badge: "Bullish Credit · Defined Risk · Theta Positive",
    tagline:
      "Get paid to be bullish on NIFTY — sell a put spread below the market and keep the credit as long as NIFTY holds support.",
    keywords:
      "bull put spread nifty, nifty credit spread, bullish credit spread india, nifty put selling defined risk, sell put spread nifty",
    intro: [
      "The Bull Put Spread is the credit-spread way to be bullish. You sell an OTM put and buy a further OTM put for protection, collecting a net credit. As long as NIFTY stays above your short put, both options expire worthless and you keep the premium.",
      "Unlike a Bull Call Spread (which you pay for), this is a credit trade — theta works for you every day, and you profit even if NIFTY simply goes nowhere or drifts up. You don't need a big move; you just need NIFTY to not fall through your short strike.",
      "Risk is defined by the spread width minus the credit, so the worst case is known on entry. It's a clean, capital-efficient way to express 'I think support holds' on NIFTY.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "65–72%", note: "Profits flat, up, or mildly down" },
      { label: "Credit Collected", value: "30–40%", note: "Of spread width" },
      { label: "Max Risk / Lot", value: "Capped", note: "Width minus credit" },
      { label: "Best Regime", value: "Bullish / range", note: "Above support" },
      { label: "Theta", value: "Positive", note: "Decay favours you" },
      { label: "Margin / Lot", value: "₹15k–25k", note: "Defined-risk margin" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly/monthly options (50-pt strikes)" },
      { label: "Sell Leg", value: "OTM put below a key support (~0.25–0.30 delta)" },
      { label: "Buy Leg", value: "100–200 points below the short put" },
      { label: "Entry Window", value: "Support reclaim, elevated IV, mild bullishness" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Stop Loss", value: "Exit if support breaks / short put goes ITM" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "OTM below support", note: "Short put — collects credit" },
      { action: "BUY", type: "PE", strike: "further OTM", note: "Long put — caps downside" },
    ],
    edges: [
      {
        title: "Three ways to win",
        body: "You profit if NIFTY rises, stays flat, or even falls slightly — as long as it holds above your short put. That's a far wider winning zone than a directional debit trade, which needs an actual up-move.",
      },
      {
        title: "Theta is on your side",
        body: "Because it's a credit spread, time decay accrues in your favour every day. A naked-long bullish bet fights theta; this one is paid by it.",
      },
      {
        title: "Sell into fear, anchor to support",
        body: "Placing the short put just below a well-tested NIFTY support means the market's own structure backs your trade — and elevated IV after a dip inflates the credit you collect.",
      },
    ],
    whenToUse: [
      "You're mildly bullish or neutral-to-bullish and expect a NIFTY support level to hold.",
      "IV is elevated (often after a pullback), fattening the credit.",
      "You want a defined-risk, theta-positive way to be long without paying upfront.",
    ],
    risks: [
      "A break below support pushes the short put ITM and the trade toward max loss — honor your stop.",
      "Reward is capped at the credit; a big rally doesn't pay more than a small one.",
      "Avoid holding through events that could gap NIFTY below your short strike.",
    ],
    faq: [
      {
        q: "Bull Put Spread vs Bull Call Spread on NIFTY — which should I use?",
        a: "Both are bullish, defined-risk trades. The Bull Put Spread is a credit trade that profits from time decay and wins if NIFTY rises, stays flat, or dips slightly — ideal when you expect support to hold. The Bull Call Spread is a debit trade that needs an actual up-move but pays more on a strong rally. Use the put spread for 'support holds', the call spread for 'breakout coming'.",
      },
      {
        q: "How do I pick strikes for a NIFTY Bull Put Spread?",
        a: "Sell the short put just below a meaningful support level (often around 0.25–0.30 delta) and buy protection 100–200 points lower. Anchoring the short strike to real support raises the odds NIFTY stays above it.",
      },
      {
        q: "Is a Bull Put Spread safe for beginners?",
        a: "It's one of the more beginner-friendly income trades because the maximum loss is fixed and known on entry. Still, it carries directional risk — a sharp drop below support causes the max loss — so use stops and modest size.",
      },
    ],
  },

  // ── Bear Call Spread on NIFTY (Bearish, credit, defined risk) ─────────────
  "bear-call-spread-nifty": {
    name: "Bear Call Spread on NIFTY",
    index: "NIFTY",
    category: "Bearish",
    theme: "rose",
    payoff: "ramp-down",
    badge: "Bearish Credit · Defined Risk · Theta Positive",
    tagline:
      "Get paid to be bearish on NIFTY — sell a call spread above resistance and keep the credit while NIFTY stays capped.",
    keywords:
      "bear call spread nifty, nifty bearish credit spread, sell call spread nifty, defined risk bearish nifty, nifty resistance strategy",
    intro: [
      "The Bear Call Spread is the mirror image of the Bull Put Spread, for when you're bearish or capped on NIFTY. You sell an OTM call and buy a further OTM call for protection, collecting a net credit. As long as NIFTY stays below your short call, you keep the premium.",
      "It's a credit trade, so theta works for you and you win even if NIFTY just stalls or drifts down — no crash required. You're simply betting that a resistance level holds and the upside is limited for now.",
      "Maximum risk is the spread width minus the credit, fixed on entry. It's the disciplined, defined-risk way to fade an overextended NIFTY or to express 'the rally is tired' without shorting futures.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "65–72%", note: "Profits flat, down, or mildly up" },
      { label: "Credit Collected", value: "30–40%", note: "Of spread width" },
      { label: "Max Risk / Lot", value: "Capped", note: "Width minus credit" },
      { label: "Best Regime", value: "Bearish / range", note: "Below resistance" },
      { label: "Theta", value: "Positive", note: "Decay favours you" },
      { label: "Margin / Lot", value: "₹15k–25k", note: "Defined-risk margin" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly/monthly options (50-pt strikes)" },
      { label: "Sell Leg", value: "OTM call above resistance (~0.25–0.30 delta)" },
      { label: "Buy Leg", value: "100–200 points above the short call" },
      { label: "Entry Window", value: "Resistance rejection, overbought, elevated IV" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Stop Loss", value: "Exit if resistance breaks / short call goes ITM" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "OTM above resistance", note: "Short call — collects credit" },
      { action: "BUY", type: "CE", strike: "further OTM", note: "Long call — caps upside risk" },
    ],
    edges: [
      {
        title: "Win without a crash",
        body: "You profit if NIFTY falls, stays flat, or even ticks up slightly — as long as it stays below your short call. You don't need to call a top precisely, just identify a ceiling that holds.",
      },
      {
        title: "Defined-risk bearishness",
        body: "Shorting NIFTY futures has open-ended risk if you're wrong. The Bear Call Spread caps the damage at the spread width minus credit, so a squeeze higher can't blow up the account.",
      },
      {
        title: "Theta-paid fade",
        body: "As a credit spread it earns time decay daily. Fading an overbought NIFTY into a resistance level lets the market structure and theta work together for you.",
      },
    ],
    whenToUse: [
      "You're mildly bearish or neutral and expect a NIFTY resistance level to cap the upside.",
      "NIFTY looks overbought / has rejected resistance, and IV is elevated.",
      "You want defined-risk downside exposure without shorting futures.",
    ],
    risks: [
      "A breakout above resistance pushes the short call ITM toward max loss — respect the stop.",
      "Reward is capped at the credit regardless of how far NIFTY falls.",
      "Squeezes and gap-ups are the main threat; avoid holding through bullish catalysts.",
    ],
    faq: [
      {
        q: "What is a Bear Call Spread and how does it make money on NIFTY?",
        a: "You sell an OTM NIFTY call and buy a further OTM call for protection, collecting a net credit. You keep the credit as long as NIFTY expires below your short call — so you profit if it falls, stays flat, or rises only slightly. Time decay works in your favour throughout.",
      },
      {
        q: "Bear Call Spread vs buying a put on NIFTY?",
        a: "A long put needs NIFTY to actually fall and bleeds theta while you wait. The Bear Call Spread is a credit trade that also wins if NIFTY merely stalls below resistance, with time decay helping you — though its profit is capped at the credit.",
      },
      {
        q: "Where should I place the short call?",
        a: "Just above a meaningful resistance level, commonly around 0.25–0.30 delta, with protection 100–200 points higher. Anchoring to real resistance raises the probability NIFTY stays below your short strike.",
      },
    ],
  },

  // ── Long Straddle on BANKNIFTY (Volatility, long premium) ─────────────────
  "long-straddle-banknifty": {
    name: "Long Straddle on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Volatility",
    theme: "teal",
    payoff: "valley",
    badge: "Long Volatility · Defined Risk · Event Plays",
    tagline:
      "Buy the ATM call and put on BANKNIFTY to profit from a big move in either direction — the cleanest way to be long volatility before an event.",
    keywords:
      "long straddle banknifty, banknifty event strategy, long volatility banknifty, banknifty results strategy, buy straddle banknifty",
    intro: [
      "Sometimes you know BANKNIFTY is about to move violently — RBI policy, a budget, big bank results — you just don't know which way. The Long Straddle is built for exactly that: you buy the ATM call and the ATM put together, profiting from a large move in either direction.",
      "BANKNIFTY's high beta makes it a natural straddle candidate. When it breaks, it breaks hard, and a long straddle captures that thrust on whichever side it comes. Your maximum loss is limited to the combined premium paid — defined risk, unlimited upside on a big swing.",
      "The enemy is time and falling volatility: if BANKNIFTY sits still, both options decay. So the long straddle is an event tool, not a hold-and-wait trade — you want the catalyst to hit before theta eats the premium.",
    ],
    stats: [
      { label: "Profit Driver", value: "Big move", note: "Either direction" },
      { label: "Premium Paid", value: "₹600–900", note: "ATM call + put" },
      { label: "Max Risk", value: "Premium Paid", note: "Defined, limited" },
      { label: "Best Regime", value: "Pre-event / low IV", note: "Before a vol spike" },
      { label: "Theta", value: "Negative", note: "Decay works against you" },
      { label: "Hold Time", value: "Hours–2 days", note: "Around the catalyst" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY weekly/monthly options (100-pt strikes)" },
      { label: "Strikes", value: "Buy the ATM call AND ATM put (same strike)" },
      { label: "Entry Window", value: "Before a known catalyst, while IV is still low" },
      { label: "Profit Target", value: "Exit into the volatility spike / on the move" },
      { label: "Stop Loss", value: "Time stop — exit if the catalyst passes flat" },
      { label: "Key Risk", value: "IV crush after the event — act fast" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "ATM", note: "Long ATM call" },
      { action: "BUY", type: "PE", strike: "ATM", note: "Long ATM put — same strike" },
    ],
    edges: [
      {
        title: "Direction-agnostic on the most explosive index",
        body: "You don't have to guess up or down — only that BANKNIFTY moves big. Given its history of 1,000-point swings on policy and results, the index supplies the kind of thrust a straddle needs more readily than NIFTY.",
      },
      {
        title: "Defined risk, asymmetric payoff",
        body: "Your downside is strictly the premium paid, while a large move can multiply that several times over. The payoff is a valley: lose a little if it's quiet, win a lot if it erupts.",
      },
      {
        title: "Buy volatility before it's priced",
        body: "Enter while IV is still subdued — before the market fully prices the event — so you pay less premium and benefit from the IV expansion as the catalyst approaches.",
      },
    ],
    whenToUse: [
      "A known BANKNIFTY catalyst is imminent (RBI policy, budget, major bank results) and you expect a large move.",
      "Implied volatility is still relatively low, so you buy the move before it's fully priced in.",
      "You can act quickly to capture the move before post-event IV crush.",
    ],
    risks: [
      "Theta and IV crush are brutal — if BANKNIFTY stays flat or the event passes quietly, both legs decay fast.",
      "You can be right that 'it'll move' and still lose if the move is too small to cover both premiums.",
      "Use a time stop; don't let a dead straddle bleed to zero hoping for a delayed move.",
    ],
    faq: [
      {
        q: "When does a Long Straddle on BANKNIFTY make money?",
        a: "When BANKNIFTY makes a move large enough — in either direction — to exceed the combined premium you paid. It's ideal ahead of high-impact events like RBI policy or bank results, where a big swing is likely but the direction is unknown.",
      },
      {
        q: "What's the biggest risk of a long straddle?",
        a: "Time decay and implied-volatility crush. If the expected move doesn't happen, or happens but is too small, both options lose value — and IV often collapses right after the event, hurting the position even on a modest move. Treat it as a short-duration event trade with a time stop.",
      },
      {
        q: "Long Straddle vs Long Strangle on BANKNIFTY?",
        a: "A straddle buys ATM options (more expensive, profits on a smaller move); a strangle buys OTM options (cheaper, needs a bigger move). Use the straddle when you expect a large move and want it to pay sooner; use the strangle to lower cost when you expect an extreme move.",
      },
    ],
  },

  // ── Short Straddle on FINNIFTY (Neutral, undefined risk) ──────────────────
  "short-straddle-finnifty": {
    name: "Short Straddle on FINNIFTY",
    index: "FINNIFTY",
    category: "Neutral",
    theme: "amber",
    payoff: "tent",
    badge: "Maximum Theta · Undefined Risk · Active Management",
    tagline:
      "Sell the ATM call and put on FINNIFTY to harvest the steepest time decay on the financial-services index — a measured cousin of the BANKNIFTY straddle.",
    keywords:
      "short straddle finnifty, finnifty straddle strategy, finnifty theta decay, finnifty expiry strategy, finnifty atm selling",
    intro: [
      "A Short Straddle on FINNIFTY sells the at-the-money call and put on the same strike and expiry, collecting both premiums up front. You win when FINNIFTY pins near that strike into expiry — the cleanest expression of 'the financial sector goes nowhere'.",
      "FINNIFTY tends to move less violently than the pure-bank BANKNIFTY basket, which makes its straddle a touch more forgiving: the index pins near round strikes reasonably often, and the calmer tape means fewer of those gap days that punish naked sellers.",
      "It remains an undefined-risk trade. The premiums are smaller than BANKNIFTY's, so a single trending session can still erase several quiet weeks. Position sizing, a hard stop, and active delta management are mandatory — this is a manage-it trade, not a fire-and-forget one.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "60–65%", note: "When FINNIFTY pins" },
      { label: "Credit Collected", value: "₹180–260", note: "ATM call + put" },
      { label: "Max Risk", value: "Undefined", note: "Hard stop required" },
      { label: "Best Regime", value: "Flat / chop", note: "Low realised move" },
      { label: "Theta", value: "Very high", note: "Peak decay near expiry" },
      { label: "Margin / Lot", value: "₹90k–1.1L", note: "Naked selling margin" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Strikes", value: "Sell the ATM call AND ATM put (same strike)" },
      { label: "Entry Window", value: "Early in the cycle or expiry-week, elevated IV" },
      { label: "Profit Target", value: "25–40% of the combined credit" },
      { label: "Stop Loss", value: "Hard stop at ~1.5–2× the credit (mandatory)" },
      { label: "Delta Hedge", value: "Adjust past ±0.25 net delta" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "ATM", note: "Short ATM call" },
      { action: "SELL", type: "PE", strike: "ATM", note: "Short ATM put — same strike" },
    ],
    edges: [
      {
        title: "Maximum theta on a calmer index",
        body: "The ATM straddle extracts the most premium of any neutral trade for a 'goes nowhere' view — and FINNIFTY's gentler tape means the dreaded trending day that breaks a straddle shows up less often than on BANKNIFTY.",
      },
      {
        title: "50-point strikes pin cleanly",
        body: "With 50-point spacing, FINNIFTY frequently settles right on or beside a round strike at expiry — exactly the pin a straddle seller wants for maximum payoff.",
      },
      {
        title: "IV-over-realised edge",
        body: "Like its index peers, FINNIFTY implied volatility usually overstates the move that actually arrives. The straddle monetises that gap — provided you survive the weeks it doesn't, which is what stops and sizing are for.",
      },
    ],
    whenToUse: [
      "You expect a quiet, range-bound FINNIFTY cycle with no major banking results in the window.",
      "IV is elevated and you expect a volatility crush into expiry.",
      "You can actively monitor and hedge delta intraday.",
    ],
    risks: [
      "Undefined risk on both sides — a trending financials session can produce outsized losses.",
      "Thinner liquidity than NIFTY/BANKNIFTY; use limit orders and mind the spread on adjustments.",
      "Gamma risk spikes in the final two sessions — convert to an Iron Butterfly if you want capped risk.",
    ],
    faq: [
      {
        q: "Is a Short Straddle better on FINNIFTY or BANKNIFTY?",
        a: "BANKNIFTY offers fatter premiums but bigger tail risk and more gap days; FINNIFTY is calmer with smaller credits. If you want the richest decay and can manage the risk, BANKNIFTY pays more — if you prefer a steadier tape, FINNIFTY's straddle is more forgiving.",
      },
      {
        q: "When should I exit a FINNIFTY Short Straddle?",
        a: "Most systematic sellers book at 25–40% of the credit rather than holding to expiry, and respect a hard stop near 1.5–2× the credit. Avoid carrying a naked straddle unhedged into the final session because of gamma risk.",
      },
      {
        q: "How liquid is the FINNIFTY straddle?",
        a: "The at-the-money strikes on the monthly expiry carry the bulk of FINNIFTY's liquidity, which is what a straddle uses. Always trade with limit orders, especially when adjusting, since spreads widen away from the money.",
      },
    ],
  },

  // ── Iron Butterfly on FINNIFTY (Neutral, defined risk) ────────────────────
  "iron-butterfly-finnifty": {
    name: "Iron Butterfly on FINNIFTY",
    index: "FINNIFTY",
    category: "Neutral",
    theme: "purple",
    payoff: "tent",
    badge: "Pinpoint Neutral · Defined Risk · High Credit",
    tagline:
      "Sell the ATM straddle on FINNIFTY and buy protective wings — a capped-risk bet that the financial-services index pins near your strike.",
    keywords:
      "iron butterfly finnifty, finnifty iron fly, defined risk straddle finnifty, finnifty pinning strategy, finnifty neutral options",
    intro: [
      "The Iron Butterfly takes a FINNIFTY Short Straddle and bolts on protective wings. You sell the ATM call and put (the body) and buy a further OTM call and put (the wings), turning an undefined-risk straddle into a high-credit, defined-risk bet that FINNIFTY finishes near your strike.",
      "Because FINNIFTY pins near round strikes fairly often and uses 50-point spacing, the butterfly's sharp peak payoff lines up neatly with where the index tends to settle — and the wings keep your maximum loss budgeted in advance.",
      "You collect close to a straddle's credit while capping the downside and slashing margin. The trade-off is a narrow profit zone: FINNIFTY must stay near the body strike, or a decisive move toward a wing produces your fixed maximum loss.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "55–60%", note: "Needs a tight pin" },
      { label: "Credit Collected", value: "₹130–190", note: "ATM body" },
      { label: "Max Risk / Lot", value: "Capped", note: "Wing width minus credit" },
      { label: "Best Regime", value: "Pin / high IV", note: "Low realised move" },
      { label: "Theta", value: "Very high", note: "ATM body decays fast" },
      { label: "Margin / Lot", value: "₹28k–40k", note: "Far below naked straddle" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Body", value: "Sell ATM call AND ATM put (same strike)" },
      { label: "Wings", value: "Buy a call and put 100–200 points OTM" },
      { label: "Entry Window", value: "High IV or expiry-week pinning setups" },
      { label: "Profit Target", value: "25–40% of the net credit" },
      { label: "Adjustment", value: "Re-center if FINNIFTY drifts off the body" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "ATM", note: "Short ATM put — body" },
      { action: "SELL", type: "CE", strike: "ATM", note: "Short ATM call — body" },
      { action: "BUY", type: "PE", strike: "100–200 pts OTM", note: "Put wing — caps downside" },
      { action: "BUY", type: "CE", strike: "100–200 pts OTM", note: "Call wing — caps upside" },
    ],
    edges: [
      {
        title: "Straddle credit, capped risk",
        body: "The ATM body collects nearly as much as a naked straddle, but the wings convert open-ended risk into a fixed maximum loss and cut margin sharply — ideal on a calmer index where the pin is plausible.",
      },
      {
        title: "Fine strike control",
        body: "FINNIFTY's 50-point grid lets you place the body and wings precisely around the expected settlement, tuning the credit-to-risk ratio more finely than a 100-point index allows.",
      },
      {
        title: "Controlled gamma",
        body: "The long wings tame the gamma blow-up that makes a naked straddle dangerous near expiry — you keep the high theta of an ATM body without the open-ended tail.",
      },
    ],
    whenToUse: [
      "You expect FINNIFTY to settle very close to a specific strike (a classic pin).",
      "IV is high and you want maximum credit but refuse open-ended risk.",
      "You want a defined-risk alternative to a FINNIFTY Short Straddle.",
    ],
    risks: [
      "Narrow profit zone — a decisive move toward a wing means the fixed maximum loss.",
      "Lower win rate than a condor because the body sits at the money.",
      "Re-centering after a drift costs credit; don't chase a runaway move.",
    ],
    faq: [
      {
        q: "Iron Butterfly vs Iron Condor on FINNIFTY?",
        a: "The butterfly sells at-the-money options for a higher credit but a narrow profit zone (needs a pin); the condor sells OTM options for a lower credit but a wider profit zone and higher win rate. Choose the butterfly when you expect FINNIFTY to pin, the condor when you expect a range.",
      },
      {
        q: "How wide should the wings be on a FINNIFTY Iron Butterfly?",
        a: "Wings 100–200 points from the body are typical given FINNIFTY's 50-point strikes. Wider wings raise both the credit and the maximum loss; backtest a couple of widths to match your risk tolerance.",
      },
      {
        q: "Is the FINNIFTY Iron Butterfly good for expiry day?",
        a: "Yes — like NIFTY, FINNIFTY often gravitates to a high-open-interest round strike near expiry, which is where the butterfly's peak payoff sits, and the defined risk keeps expiry-day gamma under control.",
      },
    ],
  },

  // ── Long Straddle on NIFTY (Volatility) ───────────────────────────────────
  "long-straddle-nifty": {
    name: "Long Straddle on NIFTY",
    index: "NIFTY",
    category: "Volatility",
    theme: "teal",
    payoff: "valley",
    badge: "Long Volatility · Defined Risk · Event Plays",
    tagline:
      "Buy the ATM call and put on NIFTY to profit from a big move in either direction — the textbook way to be long volatility into an event.",
    keywords:
      "long straddle nifty, nifty event strategy, long volatility nifty, nifty budget strategy, buy straddle nifty",
    intro: [
      "When you're confident NIFTY is about to move sharply but unsure of the direction — a budget, an RBI decision, a Fed meeting, election results — the Long Straddle is the clean expression of that view. You buy the ATM call and the ATM put together and profit from a large move either way.",
      "Your maximum loss is limited to the combined premium paid, while the upside on a big swing is open-ended. NIFTY's deep liquidity means you can buy and exit a straddle with minimal slippage, which matters when you're racing the post-event volatility crush.",
      "The enemy is time and falling IV. If NIFTY sits still, both legs decay; and IV often collapses right after the catalyst, hurting even a modestly correct call. Treat the long straddle as a short-duration event tool with a time stop, not a position to hold and hope.",
    ],
    stats: [
      { label: "Profit Driver", value: "Big move", note: "Either direction" },
      { label: "Premium Paid", value: "₹250–360", note: "ATM call + put, weekly" },
      { label: "Max Risk", value: "Premium Paid", note: "Defined, limited" },
      { label: "Best Regime", value: "Pre-event / low IV", note: "Before a vol spike" },
      { label: "Theta", value: "Negative", note: "Decay works against you" },
      { label: "Hold Time", value: "Hours–2 days", note: "Around the catalyst" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly/monthly options (50-point strikes)" },
      { label: "Strikes", value: "Buy the ATM call AND ATM put (same strike)" },
      { label: "Entry Window", value: "Before a known catalyst, while IV is still low" },
      { label: "Profit Target", value: "Exit into the volatility spike / on the move" },
      { label: "Stop Loss", value: "Time stop — exit if the catalyst passes flat" },
      { label: "Key Risk", value: "IV crush after the event — act fast" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "ATM", note: "Long ATM call" },
      { action: "BUY", type: "PE", strike: "ATM", note: "Long ATM put — same strike" },
    ],
    edges: [
      {
        title: "Direction-agnostic event exposure",
        body: "You only need to be right that NIFTY moves big, not which way. Around binary catalysts — budgets, policy, results-heavy days — that's often a far easier call than guessing the direction.",
      },
      {
        title: "Defined risk, asymmetric payoff",
        body: "Downside is capped at the premium paid; a large move can multiply it. The payoff is a valley — lose a little if it's quiet, win a lot if NIFTY erupts.",
      },
      {
        title: "Buy the move before it's priced",
        body: "Enter while IV is still subdued, before the market fully prices the event. You pay less and benefit from IV expansion as the catalyst nears — then exit into the spike rather than holding through the crush.",
      },
    ],
    whenToUse: [
      "A known NIFTY catalyst is imminent (budget, RBI/Fed, major data) and you expect a large move.",
      "Implied volatility is still relatively low, so you buy the move before it's fully priced.",
      "You can act quickly to capture the move before the post-event IV crush.",
    ],
    risks: [
      "Theta and IV crush are brutal — a quiet event decays both legs fast.",
      "You can be right that 'it'll move' and still lose if the move is too small to cover both premiums.",
      "Use a time stop; don't let a dead straddle bleed toward zero.",
    ],
    faq: [
      {
        q: "When is a Long Straddle on NIFTY worth it?",
        a: "Ahead of high-impact, binary events — the Union Budget, RBI or Fed decisions, big data prints — where a large move is likely but the direction is genuinely uncertain. It profits if NIFTY moves enough in either direction to exceed the combined premium.",
      },
      {
        q: "Why do long straddles often lose even when NIFTY moves?",
        a: "Because of implied-volatility crush. IV gets bid up before an event and collapses right after; if the actual move is smaller than the move that was priced in, both legs lose value despite NIFTY moving. Entering while IV is low and exiting into the spike is key.",
      },
      {
        q: "Long Straddle vs Long Strangle on NIFTY?",
        a: "The straddle buys ATM options — more expensive but profits on a smaller move. The strangle buys cheaper OTM options but needs a bigger move. Use the straddle when you expect a large move and want it to pay sooner.",
      },
    ],
  },

  // ── Long Strangle on NIFTY (Volatility) ───────────────────────────────────
  "long-strangle-nifty": {
    name: "Long Strangle on NIFTY",
    index: "NIFTY",
    category: "Volatility",
    theme: "teal",
    payoff: "valley",
    badge: "Long Volatility · Lower Cost · Big-Move Bet",
    tagline:
      "Buy an OTM call and an OTM put on NIFTY for a cheaper, big-move bet — long volatility when you expect an outsized swing.",
    keywords:
      "long strangle nifty, nifty long strangle, cheap volatility play nifty, nifty otm straddle, buy strangle nifty",
    intro: [
      "The Long Strangle is the budget version of the Long Straddle. Instead of buying at-the-money options, you buy an out-of-the-money call and an out-of-the-money put. The lower premium means a cheaper entry — but NIFTY has to move further before the position pays.",
      "It's a long-volatility, defined-risk trade: maximum loss is the combined premium, while a big move in either direction can multiply it. The OTM strikes make it ideal when you expect an outsized swing, not just a modest one.",
      "As with any long-premium trade, time decay and IV crush are the enemies. The strangle's cheaper cost cushions the bleed somewhat, but it still wants the move to arrive quickly. Treat it as a short-duration, big-event or breakout tool with a time stop.",
    ],
    stats: [
      { label: "Profit Driver", value: "Large move", note: "Either direction" },
      { label: "Premium Paid", value: "₹120–200", note: "OTM call + put, weekly" },
      { label: "Max Risk", value: "Premium Paid", note: "Defined, limited" },
      { label: "Best Regime", value: "Pre-breakout / low IV", note: "Big move expected" },
      { label: "Theta", value: "Negative", note: "Decay works against you" },
      { label: "Hold Time", value: "Hours–2 days", note: "Around the move" },
    ],
    setup: [
      { label: "Underlying", value: "NIFTY weekly/monthly options (50-point strikes)" },
      { label: "Strikes", value: "Buy a ~0.20–0.30 delta OTM call and put" },
      { label: "Entry Window", value: "Coiled range / pre-event, while IV is low" },
      { label: "Profit Target", value: "Exit into the move / volatility spike" },
      { label: "Stop Loss", value: "Time stop if the breakout doesn't come" },
      { label: "Key Risk", value: "Needs a larger move than a straddle to pay" },
    ],
    legs: [
      { action: "BUY", type: "PE", strike: "~0.20–0.30 delta OTM", note: "Long OTM put" },
      { action: "BUY", type: "CE", strike: "~0.20–0.30 delta OTM", note: "Long OTM call" },
    ],
    edges: [
      {
        title: "Cheaper long-volatility exposure",
        body: "Buying OTM rather than ATM lowers the premium meaningfully, so a strangle costs less to put on than a straddle — useful when you expect a large move and want to risk less capital per bet.",
      },
      {
        title: "Defined risk, leveraged to big swings",
        body: "Your downside is capped at the premium, while an outsized NIFTY move can return several times the cost. The further-OTM strikes mean the payoff really opens up on the kind of breakout that a straddle would already be deep in profit on.",
      },
      {
        title: "Great for coiled ranges",
        body: "When NIFTY tightens into a narrow range before a breakout, a cheap strangle is a clean way to position for the eventual expansion without betting on the direction.",
      },
    ],
    whenToUse: [
      "You expect an unusually large NIFTY move (breakout or big event) and want a lower-cost long-vol bet.",
      "IV is still low, so you buy the move before it's priced in.",
      "NIFTY is coiled in a tight range and a volatility expansion looks imminent.",
    ],
    risks: [
      "Needs a bigger move than a straddle — a moderate move can still leave it a loser.",
      "Theta and IV crush erode the premium if the breakout is slow to arrive.",
      "Use a time stop; OTM options can decay to near-zero fast if NIFTY stalls.",
    ],
    faq: [
      {
        q: "Long Strangle vs Long Straddle on NIFTY — which should I buy?",
        a: "The strangle is cheaper (OTM strikes) but needs a bigger move to profit; the straddle costs more (ATM strikes) but pays on a smaller move. Use the strangle when you expect an outsized swing and want lower cost, the straddle when you want the move to pay sooner.",
      },
      {
        q: "Which deltas should I buy for a NIFTY Long Strangle?",
        a: "Buying around 0.20–0.30 delta on each side balances cost against the move needed. Closer-to-money strikes cost more but pay on a smaller move; further OTM is cheaper but needs a larger breakout.",
      },
      {
        q: "How do I avoid IV crush on a long strangle?",
        a: "Enter while implied volatility is still low — before the market prices the event — and exit into the volatility spike rather than holding through it. A time stop prevents a stalled breakout from bleeding the premium to zero.",
      },
    ],
  },

  // ── Bull Put Spread on BANKNIFTY (Bullish credit) ─────────────────────────
  "bull-put-spread-banknifty": {
    name: "Bull Put Spread on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Bullish",
    theme: "emerald",
    payoff: "ramp-up",
    badge: "Bullish Credit · Defined Risk · Theta Positive",
    tagline:
      "Get paid to be bullish on BANKNIFTY — sell a put spread below support and keep the fat credit while the index holds up.",
    keywords:
      "bull put spread banknifty, banknifty credit spread, bullish credit spread banknifty, banknifty put selling defined risk, sell put spread banknifty",
    intro: [
      "The Bull Put Spread is the credit way to be bullish on BANKNIFTY. You sell an OTM put and buy a further OTM put for protection, collecting a net credit. As long as BANKNIFTY stays above your short put, both options expire worthless and you keep the premium.",
      "BANKNIFTY's higher implied volatility makes its put spreads especially attractive — you collect a fatter credit for the same probability of profit than you would on NIFTY. Theta works for you daily, and you profit even if the index just holds flat or drifts up.",
      "Risk is defined by the spread width minus the credit, fixed on entry. Anchored to a real BANKNIFTY support level, it's a capital-efficient, defined-risk way to say 'the banks hold here' without paying upfront for a directional bet.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "65–72%", note: "Profits flat, up, or mildly down" },
      { label: "Credit Collected", value: "30–40%", note: "Of spread width" },
      { label: "Max Risk / Lot", value: "Capped", note: "Width minus credit" },
      { label: "Best Regime", value: "Bullish / range", note: "Above support" },
      { label: "Theta", value: "Positive", note: "Decay favours you" },
      { label: "Margin / Lot", value: "₹25k–40k", note: "Defined-risk margin" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY weekly/monthly options (100-pt strikes)" },
      { label: "Sell Leg", value: "OTM put below key support (~0.25–0.30 delta)" },
      { label: "Buy Leg", value: "200–400 points below the short put" },
      { label: "Entry Window", value: "Support reclaim, elevated IV, mild bullishness" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Stop Loss", value: "Exit if support breaks / short put goes ITM" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "OTM below support", note: "Short put — collects credit" },
      { action: "BUY", type: "PE", strike: "further OTM", note: "Long put — caps downside" },
    ],
    edges: [
      {
        title: "Fatter credit than NIFTY",
        body: "BANKNIFTY's elevated IV means its OTM puts are worth more, so the same-probability put spread collects a bigger credit than on NIFTY — more income for the defined risk you take.",
      },
      {
        title: "Three ways to win",
        body: "You profit whether BANKNIFTY rises, stays flat, or even dips slightly — as long as it holds above the short put. That's a far wider winning zone than a debit trade, which needs an actual up-move.",
      },
      {
        title: "Sell into post-dip fear",
        body: "After a pullback, BANKNIFTY IV spikes and puts inflate. Selling the spread just below a tested support level lets you collect that richer premium with the market's own structure backing the trade.",
      },
    ],
    whenToUse: [
      "You're mildly bullish or neutral-to-bullish and expect a BANKNIFTY support to hold.",
      "IV is elevated (often after a dip), fattening the credit.",
      "You want a defined-risk, theta-positive way to be long without paying upfront.",
    ],
    risks: [
      "A break below support pushes the short put ITM toward max loss — honor the stop.",
      "Reward is capped at the credit; a strong rally doesn't pay more.",
      "Avoid holding through bank results or RBI policy that could gap BANKNIFTY below the short strike.",
    ],
    faq: [
      {
        q: "Why is a Bull Put Spread attractive on BANKNIFTY?",
        a: "BANKNIFTY's higher implied volatility inflates put premiums, so the credit you collect for a given probability of profit is larger than on NIFTY. With protective wings the risk is still capped, making it an efficient bullish income trade.",
      },
      {
        q: "How wide should a BANKNIFTY Bull Put Spread be?",
        a: "Often 200–400 points between the short and long put, with the short strike just below a meaningful support. Wider spreads collect more credit but risk more capital; narrower spreads are cheaper with a smaller maximum loss.",
      },
      {
        q: "What's the max loss on a Bull Put Spread?",
        a: "It's the spread width minus the net credit, fixed on entry no matter how far BANKNIFTY falls. That defined, known risk is the main reason traders prefer credit spreads over naked put selling.",
      },
    ],
  },

  // ── Bear Call Spread on BANKNIFTY (Bearish credit) ────────────────────────
  "bear-call-spread-banknifty": {
    name: "Bear Call Spread on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Bearish",
    theme: "rose",
    payoff: "ramp-down",
    badge: "Bearish Credit · Defined Risk · Theta Positive",
    tagline:
      "Get paid to fade BANKNIFTY — sell a call spread above resistance and keep the rich credit while the index stays capped.",
    keywords:
      "bear call spread banknifty, banknifty bearish credit spread, sell call spread banknifty, defined risk bearish banknifty, banknifty resistance strategy",
    intro: [
      "The Bear Call Spread is how you fade BANKNIFTY with defined risk. You sell an OTM call and buy a further OTM call for protection, collecting a net credit. As long as BANKNIFTY stays below your short call, you keep the premium.",
      "BANKNIFTY's high IV makes the credit especially juicy, and as a credit trade theta works for you — you win even if the index just stalls or drifts down below resistance. No crash required, just a ceiling that holds.",
      "Shorting BANKNIFTY futures has open-ended risk if you're wrong; the Bear Call Spread caps the damage at the spread width minus credit. It's the disciplined way to fade an overextended rally or express 'the banks are tired here'.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "65–72%", note: "Profits flat, down, or mildly up" },
      { label: "Credit Collected", value: "30–40%", note: "Of spread width" },
      { label: "Max Risk / Lot", value: "Capped", note: "Width minus credit" },
      { label: "Best Regime", value: "Bearish / range", note: "Below resistance" },
      { label: "Theta", value: "Positive", note: "Decay favours you" },
      { label: "Margin / Lot", value: "₹25k–40k", note: "Defined-risk margin" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY weekly/monthly options (100-pt strikes)" },
      { label: "Sell Leg", value: "OTM call above resistance (~0.25–0.30 delta)" },
      { label: "Buy Leg", value: "200–400 points above the short call" },
      { label: "Entry Window", value: "Resistance rejection, overbought, elevated IV" },
      { label: "Profit Target", value: "50% of the credit received" },
      { label: "Stop Loss", value: "Exit if resistance breaks / short call goes ITM" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "OTM above resistance", note: "Short call — collects credit" },
      { action: "BUY", type: "CE", strike: "further OTM", note: "Long call — caps upside risk" },
    ],
    edges: [
      {
        title: "Richest bearish credit on the NSE",
        body: "BANKNIFTY's elevated IV inflates call premiums, so a bear call spread collects a bigger credit than the same structure on NIFTY — more income for the defined risk.",
      },
      {
        title: "Win without a crash",
        body: "You profit if BANKNIFTY falls, stays flat, or even ticks up slightly, as long as it holds below the short call. You don't have to call a top precisely — just identify a ceiling.",
      },
      {
        title: "Capped-risk way to be bearish",
        body: "Shorting BANKNIFTY futures can blow up on a squeeze. The spread caps the loss at width minus credit, so a sharp rally can't run away with the account.",
      },
    ],
    whenToUse: [
      "You're mildly bearish or neutral and expect a BANKNIFTY resistance to cap the upside.",
      "BANKNIFTY looks overbought / has rejected resistance, with elevated IV.",
      "You want defined-risk downside exposure without shorting futures.",
    ],
    risks: [
      "A breakout above resistance pushes the short call ITM toward max loss — respect the stop.",
      "Reward is capped at the credit regardless of how far BANKNIFTY falls.",
      "Squeezes and result-day gap-ups are the main threat; avoid holding through bullish catalysts.",
    ],
    faq: [
      {
        q: "How does a Bear Call Spread make money on BANKNIFTY?",
        a: "You sell an OTM BANKNIFTY call and buy a further OTM call for protection, collecting a net credit. You keep it as long as BANKNIFTY expires below the short call — so you profit if it falls, stays flat, or rises only slightly, with theta helping you throughout.",
      },
      {
        q: "Why trade it on BANKNIFTY instead of NIFTY?",
        a: "BANKNIFTY's higher implied volatility means a richer credit for the same probability of profit. The trade-off is bigger gap risk on bank results and RBI policy, so size carefully and avoid holding through those events.",
      },
      {
        q: "Where should the short call go?",
        a: "Just above a meaningful resistance level, commonly around 0.25–0.30 delta, with protection 200–400 points higher. Anchoring to real resistance raises the odds BANKNIFTY stays below your short strike.",
      },
    ],
  },

  // ── Bull Call Spread on FINNIFTY (Bullish, debit) ─────────────────────────
  "bull-call-spread-finnifty": {
    name: "Bull Call Spread on FINNIFTY",
    index: "FINNIFTY",
    category: "Bullish",
    theme: "indigo",
    payoff: "ramp-up",
    badge: "Directional Bullish · Defined Risk · Low Cost",
    tagline:
      "Play a bullish FINNIFTY view cheaply — buy a call and sell a higher call to finance it, with risk capped at the net debit.",
    keywords:
      "bull call spread finnifty, finnifty bullish strategy, finnifty debit spread, defined risk bullish finnifty, finnifty call spread",
    intro: [
      "When you're bullish on FINNIFTY but don't want to overpay for a naked call or bleed theta waiting, the Bull Call Spread is the efficient choice. You buy a call near the money and sell a higher call against it, financing part of the cost.",
      "The sold call caps your upside but slashes your cost and pulls your breakeven closer to spot. On FINNIFTY, where the financial-services heavyweights tend to grind rather than gap, that lower breakeven makes a directional bet meaningfully more achievable.",
      "Your maximum loss is the net debit, fixed on entry. It's the disciplined way to play a FINNIFTY breakout, an oversold bounce in financials, or a pre-results drift higher — defined risk, no margin calls.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "52–56%", note: "Directional trades win less often" },
      { label: "Avg Trade ROI", value: "12–18%", note: "On net debit deployed" },
      { label: "Max Risk", value: "Net Debit", note: "Capped on entry" },
      { label: "Best Regime", value: "Breakout / bounce", note: "Moderately bullish" },
      { label: "Theta Drag", value: "Reduced", note: "Short call offsets decay" },
      { label: "Capital / Lot", value: "₹4k–9k", note: "Net debit per lot" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Buy Leg", value: "ATM or slightly ITM call" },
      { label: "Sell Leg", value: "150–250 points OTM call" },
      { label: "Entry Window", value: "At support reclaim or pre-bullish-event" },
      { label: "Profit Target", value: "70–80% of the spread width" },
      { label: "Stop Loss", value: "Exit on support break / thesis invalidation" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "ATM / slightly ITM", note: "Long call — the engine" },
      { action: "SELL", type: "CE", strike: "150–250 pts OTM", note: "Short call — finances the trade" },
    ],
    edges: [
      {
        title: "Theta drag, neutralised",
        body: "A naked FINNIFTY call bleeds if the move stalls. In a spread, the short call decays in your favour at nearly the rate the long call decays against you, so a few flat days barely dent the position.",
      },
      {
        title: "Lower breakeven on a grinding index",
        body: "FINNIFTY tends to trend in grinds rather than gaps. The credit from the short call lowers your breakeven, so you need a smaller, more realistic move to turn profitable than a naked call would require.",
      },
      {
        title: "Defined risk, fine strike control",
        body: "FINNIFTY's 50-point grid lets you place the short strike right at a realistic target, dialing in the reward — while the worst case stays fixed at the net debit.",
      },
    ],
    whenToUse: [
      "You're moderately bullish on FINNIFTY — expecting a move toward a target, not a moonshot.",
      "IV is high and you want to avoid overpaying for a naked call.",
      "You want a capped-risk, capital-efficient way to play a breakout or bounce in financials.",
    ],
    risks: [
      "Capped upside — a big rally past the short strike leaves gains on the table.",
      "Still a directional bet: a drop below support takes the position toward max loss.",
      "Thinner FINNIFTY liquidity — use limit orders and check spreads before entering each leg.",
    ],
    faq: [
      {
        q: "Why a Bull Call Spread instead of a naked FINNIFTY call?",
        a: "A naked call is costlier and bleeds theta if the move is slow. The spread sells a higher call to finance the purchase, cutting cost, lowering the breakeven, and reducing time decay — at the cost of a capped upside.",
      },
      {
        q: "How wide should a FINNIFTY Bull Call Spread be?",
        a: "Set the short strike near your realistic target, often 150–250 points above the long strike given FINNIFTY's 50-point grid. Wider spreads cost and pay more; narrower ones are cheaper with smaller maximum profit.",
      },
      {
        q: "Is FINNIFTY liquid enough for a debit spread?",
        a: "Around the at-the-money strikes on the monthly expiry, yes. Liquidity thins in deep OTM strikes, so keep the spread within a sensible range and use limit orders on both legs.",
      },
    ],
  },

  // ── Calendar Spread on BANKNIFTY (Volatility / time decay) ────────────────
  "calendar-spread-banknifty": {
    name: "Calendar Spread on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Volatility",
    theme: "teal",
    payoff: "tent",
    badge: "Time-Decay Edge · Long Vega · Defined Risk",
    tagline:
      "Sell a near-term BANKNIFTY option and buy a longer-dated one at the same strike — profit from faster front-month decay and a volatility pop.",
    keywords:
      "calendar spread banknifty, banknifty time spread, banknifty horizontal spread, long vega banknifty, banknifty theta strategy",
    intro: [
      "A Calendar Spread (or time spread) sells a near-term BANKNIFTY option and buys a longer-dated option at the same strike. You profit from the fact that the near-term option decays faster than the one you own — and from any expansion in implied volatility, since the long leg is more vega-sensitive.",
      "It's a nuanced, defined-risk structure best placed at the money or just OTM. The position likes BANKNIFTY pinning near the strike into the near-term expiry, plus a stable-to-rising IV environment that lifts the value of your longer-dated long leg.",
      "Maximum loss is the net debit paid. The calendar is a favourite for low-IV regimes where you expect a volatility pop, or as a calmer way to express a 'BANKNIFTY stays near here for now' view without the open-ended risk of naked selling.",
    ],
    stats: [
      { label: "Typical Win Rate", value: "60–66%", note: "When BANKNIFTY pins near strike" },
      { label: "Net Debit", value: "₹150–280", note: "Long leg minus short leg" },
      { label: "Max Risk", value: "Net Debit", note: "Defined, limited" },
      { label: "Best Regime", value: "Low / rising IV", note: "Stable-to-up vega" },
      { label: "Vega", value: "Positive", note: "Long leg gains on IV pops" },
      { label: "Hold Time", value: "Into near-expiry", note: "Front-month decay" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY options, two expiries, same strike" },
      { label: "Sell Leg", value: "Near-term ATM (or slightly OTM) option" },
      { label: "Buy Leg", value: "Next-expiry option at the SAME strike" },
      { label: "Entry Window", value: "Low IV, BANKNIFTY consolidating near strike" },
      { label: "Profit Target", value: "Exit near front-month expiry / on IV pop" },
      { label: "Key Risk", value: "A big directional move away from the strike" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "near-term ATM", note: "Short front-month — fast decay" },
      { action: "BUY", type: "CE", strike: "next-expiry, same strike", note: "Long back-month — holds value" },
    ],
    edges: [
      {
        title: "Front-month decays fastest",
        body: "Theta accelerates as expiry nears, so the near-term option you sold loses value faster than the longer-dated one you own. As long as BANKNIFTY stays near the strike, that decay differential is your profit.",
      },
      {
        title: "Long vega for the IV pop",
        body: "The back-month leg is more sensitive to implied volatility. In a low-IV regime, a volatility expansion lifts your long leg more than your short leg — a second engine of profit beyond pure time decay.",
      },
      {
        title: "Defined risk on a violent index",
        body: "Naked selling on BANKNIFTY carries open-ended risk. The calendar's maximum loss is simply the net debit, making it a far calmer way to express a 'stays near here, vol may rise' view.",
      },
    ],
    whenToUse: [
      "BANKNIFTY is consolidating near a strike and you expect it to stay there into the near-term expiry.",
      "Implied volatility is low and you expect a volatility expansion.",
      "You want a defined-risk, long-vega alternative to naked premium selling.",
    ],
    risks: [
      "A large directional move away from the strike is the main enemy — the spread loses value on both sides.",
      "Falling IV hurts the long leg; calendars dislike a volatility collapse.",
      "Requires more nuanced management than a vertical spread — model the payoff before entering.",
    ],
    faq: [
      {
        q: "How does a BANKNIFTY Calendar Spread make money?",
        a: "Two ways: the near-term option you sold decays faster than the longer-dated option you bought (a positive time-decay differential), and the longer-dated leg gains value if implied volatility expands. It works best when BANKNIFTY pins near the strike into the near-term expiry.",
      },
      {
        q: "When is the best time to put on a calendar spread?",
        a: "In low-IV regimes when you expect volatility to rise and BANKNIFTY to stay near a strike for now. You want the front-month theta to work and the back-month vega to benefit from a volatility pop.",
      },
      {
        q: "What's the biggest risk of a calendar spread?",
        a: "A large directional move away from the strike, which erodes the spread on either side, and a collapse in implied volatility, which hurts the long back-month leg. Maximum loss is capped at the net debit you paid.",
      },
    ],
  },
};

// Helper for routes/sitemap/hub.
export const STRATEGY_SLUGS = Object.keys(STRATEGIES);
export const getStrategy = (slug) => STRATEGIES[slug] || null;
