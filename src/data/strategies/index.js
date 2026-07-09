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
    expiry: "Tuesday (weekly)",
    vix: "12–16",
    note: "India's flagship index — the deepest options liquidity and the tightest bid-ask spreads on the NSE.",
  },
  BANKNIFTY: {
    label: "BANKNIFTY",
    step: 100,
    lot: 30,
    expiry: "last Tuesday (monthly)",
    vix: "15–20",
    note: "Higher volatility and larger point swings than NIFTY — premiums are richer, but so is the risk per lot.",
  },
  FINNIFTY: {
    label: "FINNIFTY",
    step: 50,
    lot: 65,
    expiry: "last Tuesday (monthly)",
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
        a: "The monthly expiry (last Tuesday) carries the most reliable liquidity. Enter with 8–12 days left so theta is meaningful but gamma risk is still manageable.",
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
      "On NIFTY's weekly expiry, the straddle is a theta machine. The combined ATM premium decays fastest in the final days, so traders often deploy it Monday-for-Tuesday or even as an expiry-day intraday trade, capturing the steepest part of the decay curve.",
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
      { label: "Entry Window", value: "Monday for Tuesday expiry, or expiry-day intraday" },
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
        a: "Two popular windows: Monday morning for the Tuesday weekly expiry (to capture the bulk of theta), and an intraday expiry-day straddle for the very steepest decay. Avoid entering right before a known market-moving event.",
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

  // ── Bear Put Spread (Bearish, defined risk) ──────────────────────────────
  "bear-put-spread-banknifty": {
    name: "Bear Put Spread on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Bearish",
    theme: "rose",
    payoff: "ramp-down",
    badge: "Bearish · Defined Risk · Debit Strategy",
    tagline:
      "Buy an ATM put and sell a lower OTM put on BANKNIFTY — pay a small debit, cap your downside exposure, and profit cleanly when the index falls.",
    keywords:
      "bear put spread banknifty, banknifty bear spread, put debit spread banknifty, bearish options banknifty, defined risk bearish banknifty",
    intro: [
      "The Bear Put Spread is the cleanest directional bearish structure you can build on BANKNIFTY. You buy a put near the current market price (absorbing the intrinsic value) and simultaneously sell a lower-strike put further out of the money, partially financing your buy. The result is a net debit — your maximum possible loss — against a capped but concrete maximum profit when BANKNIFTY falls to your short put.",
      "Unlike a naked long put, the short leg offsets a meaningful slice of your premium outlay. On a high-beta index like BANKNIFTY — where implied volatility is routinely elevated — that premium offset matters: buying an unhedged put on BANKNIFTY is expensive, while a bear put spread keeps your cost-to-win ratio sane even after factoring in the direction bet.",
      "Backtests on NSE monthly and weekly BANKNIFTY data show win rates of 48–52% for directional plays — honest odds for a purely bearish thesis. The edge comes not from frequency but from payoff asymmetry: when the index falls sharply, your profit approaches the full spread width minus the debit, while your loss on wrong trades is bounded by what you paid upfront.",
    ],
    stats: [
      { label: "Win Rate", value: "48–52%", note: "Directional; depends on entry timing" },
      { label: "Typical Debit", value: "₹100–160", note: "Per share (100-point spread, BANKNIFTY)" },
      { label: "Max Profit", value: "Spread − Debit", note: "e.g. ₹340 on a ₹500 spread − ₹160 debit" },
      { label: "Max Loss", value: "Net Debit Only", note: "Bounded on entry — no margin call" },
      { label: "Best IV Regime", value: "Low IVP", note: "Buy premium cheap, below IVP 40%" },
      { label: "Margin Required", value: "Net Debit", note: "No additional SPAN margin needed" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY monthly or weekly options (100-point strikes)" },
      { label: "Long Put Strike", value: "ATM or 1 strike ITM (closer to current price)" },
      { label: "Short Put Strike", value: "100–300 points below long put (OTM)" },
      { label: "Entry Condition", value: "Bearish trend confirmed; IVP below 40% for cheap premium" },
      { label: "Profit Target", value: "Exit at 60–70% of max profit or when short put delta < 0.10" },
      { label: "Stop Loss", value: "Exit if debit doubles (i.e., spread loses 100% of cost)" },
    ],
    legs: [
      { action: "BUY", type: "PE", strike: "ATM or 1 ITM", note: "Long put — the core bearish leg" },
      { action: "SELL", type: "PE", strike: "100–300 pts below ATM", note: "Short put — premium offset, caps profit" },
    ],
    edges: [
      {
        title: "Defined risk lets you size correctly",
        body: "Because your maximum loss is precisely the net debit paid, position sizing is straightforward. You can enter a bear put spread with a fixed-rupee risk budget, unlike a naked put which has margin calls and delta surprises. This makes it the preferred bearish vehicle for disciplined traders who manage drawdown strictly.",
      },
      {
        title: "Lower cost than a naked put on BANKNIFTY",
        body: "BANKNIFTY implied volatility runs high — a single ATM put at 10 DTE can cost ₹250–350 per share. The short put leg offsets ₹100–160 of that, cutting your cost basis substantially. You give up gains below the short strike, but for a typical 5–7% directional move that zone rarely matters.",
      },
      {
        title: "Profits from both delta and IV compression of the short leg",
        body: "As BANKNIFTY falls toward your short put, the spread's intrinsic value increases while the short OTM put's time value erodes — a double benefit. If IV spikes on the bearish move (which often happens as markets fall), your long put gains more vega value than the short, adding an extra tailwind.",
      },
    ],
    whenToUse: [
      "BANKNIFTY has broken a key support level on high volume and macro sentiment is negative (weak global cues, RBI hawkishness, banking sector stress).",
      "India VIX is below 15 — puts are cheap enough that buying makes sense rather than selling premium.",
      "You want a directional bearish bet with a predefined maximum loss before you enter — no open-ended risk.",
    ],
    risks: [
      "If BANKNIFTY reverses and rallies, you lose the entire net debit — accept this loss quickly rather than hoping for a turnaround.",
      "Time decay works against the long put; a slow sideways drift erodes value even if direction is eventually right.",
      "The short put caps your profit: if BANKNIFTY crashes far below your short strike, you leave significant gains on the table versus holding a naked put.",
    ],
    faq: [
      {
        q: "What is the ideal strike gap for a BANKNIFTY Bear Put Spread?",
        a: "Most traders use a 100–200 point spread for weekly expiries and 200–300 points for monthly. Wider spreads have a better absolute profit potential but cost more upfront. Match the spread width to the expected magnitude of the BANKNIFTY move — a 200-point target move warrants a 200-point spread.",
      },
      {
        q: "When should I exit a Bear Put Spread before expiry?",
        a: "Exit when you've captured 60–70% of the maximum profit — the remaining upside diminishes sharply as the short put goes deeper ITM. Also exit if the trade goes against you and the debit has doubled, locking in a managed loss before time decay compounds the damage.",
      },
      {
        q: "Can I convert a Bear Put Spread into an Iron Condor?",
        a: "Yes — if you later turn neutral, you can add a short call spread above the market to convert the bear put spread into an Iron Condor, collecting additional credit to offset some of the original debit. This is a common adjustment when a bearish thesis softens but you still see a range-bound environment ahead.",
      },
    ],
  },

  "bear-put-spread-finnifty": {
    name: "Bear Put Spread on FINNIFTY",
    index: "FINNIFTY",
    category: "Bearish",
    theme: "rose",
    payoff: "ramp-down",
    badge: "Bearish · Defined Risk · Debit Strategy",
    tagline:
      "Structure a limited-risk bearish trade on FINNIFTY by buying an ATM put and selling a lower OTM put — profit when financials fall, with your loss capped at entry.",
    keywords:
      "bear put spread finnifty, finnifty bear spread, put debit spread finnifty, bearish options finnifty, defined risk bearish finnifty",
    intro: [
      "FINNIFTY — the NSE's financial-services index — sits between NIFTY and BANKNIFTY in volatility character. Its constituents include private banks, NBFCs, and insurance companies, meaning it reacts sharply to RBI decisions, credit events, and quarterly bank results while remaining slightly less volatile than BANKNIFTY itself. A Bear Put Spread on FINNIFTY lets you take a clean bearish view on the financials sector with a known, capped cost.",
      "The structure works identically to a standard bear put spread: buy a put near the current FINNIFTY level and sell a lower-strike put to partially fund the purchase. The 50-point strike increments on FINNIFTY give precise strike selection — you can tailor the spread to match your specific price target without overshooting. Net debits typically run ₹60–120 per share, lower than BANKNIFTY due to the index's smaller price level and tighter volatility range.",
      "Probability-wise, a directional bearish trade on any index carries a win rate around 48–52% over a large sample — the advantage is asymmetry. When FINNIFTY falls, the spread earns multiples of the debit. When it doesn't, the loss is bounded. Used selectively around key financial-sector catalysts, the bear put spread is a precise, disciplined tool for a sector-specific bearish thesis.",
    ],
    stats: [
      { label: "Win Rate", value: "48–52%", note: "Directional; timing dependent" },
      { label: "Typical Debit", value: "₹60–120", note: "Per share (50-point spread, FINNIFTY)" },
      { label: "Max Profit", value: "Spread − Debit", note: "e.g. ₹130 on a ₹250 spread − ₹120 debit" },
      { label: "Max Loss", value: "Net Debit Only", note: "Predefined — no margin call risk" },
      { label: "Best IV Regime", value: "Low IVP", note: "Enter below IVP 35–40% for cheap premium" },
      { label: "Margin Required", value: "Net Debit", note: "No SPAN margin — pure debit trade" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strike increments)" },
      { label: "Long Put Strike", value: "ATM or 50 points ITM" },
      { label: "Short Put Strike", value: "100–250 points below the long put" },
      { label: "Entry Condition", value: "Bearish financial sector outlook; IVP below 40%" },
      { label: "Profit Target", value: "60% of max profit, or short put delta < 0.10" },
      { label: "Stop Loss", value: "Exit if position value falls 80% from purchase price" },
    ],
    legs: [
      { action: "BUY", type: "PE", strike: "ATM or 1 ITM (50 pts)", note: "Long put — bearish core leg" },
      { action: "SELL", type: "PE", strike: "100–250 pts below ATM", note: "Short put — offsets premium cost" },
    ],
    edges: [
      {
        title: "Precision in a sector-driven index",
        body: "FINNIFTY moves on identifiable catalysts — RBI meetings, NBFC asset-quality data, and major private bank earnings. This makes a directional put spread more targetable than on a diversified index: you can time entry around a known catalyst and size your spread width to match the expected downside.",
      },
      {
        title: "Lower debit than BANKNIFTY equivalent",
        body: "FINNIFTY's smaller absolute level and tighter volatility mean ATM put premiums are lower than BANKNIFTY. A comparable percentage-move spread costs ₹60–120 versus ₹100–160 on BANKNIFTY, letting you participate in a bearish financials thesis with less capital at risk per lot.",
      },
      {
        title: "Clean hedging vehicle for bank stock portfolios",
        body: "Investors holding portfolios heavy in banking and NBFC stocks can use a FINNIFTY bear put spread as a low-cost portfolio hedge without touching individual stock options. The index correlation is high enough to offset a meaningful portion of portfolio drawdown during financial-sector selloffs.",
      },
    ],
    whenToUse: [
      "FINNIFTY has broken below a key support zone and bank sector breadth is deteriorating — multiple large-cap banks are underperforming the broader market.",
      "An RBI policy meeting, quarterly banking results season, or a significant NBFC credit event is approaching that you expect to weigh on financial stocks.",
      "India VIX is subdued (below 15), making put buying cost-effective relative to potential returns.",
    ],
    risks: [
      "A rebound in financial stocks on positive RBI commentary or better-than-expected bank results erases the debit — accept the bounded loss quickly.",
      "Theta decay works against the long put leg as time passes without a bearish move; avoid holding into the last 3 days if the trade hasn't worked.",
      "The short put caps profit: FINNIFTY crashing far below the short strike caps your gains — acceptable for most directional traders but worth modeling before entry.",
    ],
    faq: [
      {
        q: "How does a FINNIFTY Bear Put Spread differ from a BANKNIFTY Bear Put Spread?",
        a: "The mechanics are identical, but FINNIFTY's 50-point strike increments allow finer strike selection compared to BANKNIFTY's 100-point steps. FINNIFTY also has lower absolute premium levels and slightly lower volatility, making bear put spreads cheaper in rupee terms — useful when you want a smaller capital outlay per lot.",
      },
      {
        q: "What is a realistic profit target for this spread?",
        a: "Target 60–70% of the maximum possible profit. On a ₹250 spread costing ₹100 debit, the maximum profit is ₹150 — aim to exit at ₹90–105 gain. Trying to squeeze the last 30% means sitting through final-week gamma risk when the trade can reverse quickly.",
      },
      {
        q: "Should I use weekly or monthly FINNIFTY options?",
        a: "FINNIFTY currently has monthly expiries only (no weekly series as of 2025), so monthly options are your default. Align your trade to the upcoming monthly expiry and allow 7–15 days for the bearish thesis to play out. Avoid entering within 5 days of expiry where theta decay accelerates sharply against the long leg.",
      },
    ],
  },

  // ── Long Strangle (Volatility, event-driven) ─────────────────────────────
  "long-strangle-banknifty": {
    name: "Long Strangle on BANKNIFTY",
    index: "BANKNIFTY",
    category: "Volatility",
    theme: "fuchsia",
    payoff: "valley",
    badge: "Volatility · Long Premium · Event Strategy",
    tagline:
      "Buy an OTM call and an OTM put on BANKNIFTY simultaneously — profit from any sharp move in either direction, making this the go-to structure for events and high-uncertainty periods.",
    keywords:
      "long strangle banknifty, banknifty event strategy, buy volatility banknifty, banknifty strangle before rbi, banknifty pre-budget options strategy",
    intro: [
      "A Long Strangle positions you to profit when BANKNIFTY makes a large move — in either direction. You buy an OTM call above the current price and an OTM put below it, paying a combined debit upfront. If BANKNIFTY subsequently surges or crashes by more than the total premium paid, one leg moves into the money and you profit. If the index just drifts sideways, both legs decay and you lose the debit.",
      "BANKNIFTY is uniquely suited for the long strangle. It moves 1.5–2% on ordinary days and 3–5% on event days — RBI policy announcements, Union Budgets, surprise global cues, and bank earnings. The strategy is most potent when entered with India VIX low (IVP below 25%), meaning you're buying cheap options just before a catalyst that historically spikes implied volatility and propels the index sharply.",
      "The combined premium outlay on BANKNIFTY typically runs ₹200–350 per share for OTM strikes 1–2% away from spot. To break even, the index needs to move at least as far as the sum of the two premiums. Directional traders who've been burned by wrong-way bets increasingly use the strangle to profit from volatility without choosing a direction — letting the event decide the market's path.",
    ],
    stats: [
      { label: "Break-even Move", value: "> 2× Debit", note: "Index must move more than total premium paid" },
      { label: "Combined Premium", value: "₹200–350", note: "Per share; OTM strikes ~1.5% from spot" },
      { label: "Best IVP Entry", value: "Below 25%", note: "Buy cheap before volatility spike" },
      { label: "Ideal Catalyst", value: "RBI / Budget", note: "Known dates for vol expansion events" },
      { label: "Max Loss", value: "Net Debit", note: "Both legs expire worthless if BANKNIFTY pins" },
      { label: "Margin Required", value: "Net Debit", note: "No SPAN margin — long-only structure" },
    ],
    setup: [
      { label: "Underlying", value: "BANKNIFTY weekly or monthly options (100-point strikes)" },
      { label: "Long Call Strike", value: "1.5–2% above current BANKNIFTY (OTM CE)" },
      { label: "Long Put Strike", value: "1.5–2% below current BANKNIFTY (OTM PE)" },
      { label: "Entry Timing", value: "2–5 days before a known catalyst; IVP below 25–30%" },
      { label: "Profit Target", value: "100% of debit paid (double your money), then trail" },
      { label: "Stop Loss", value: "Exit if combined value drops 40–50% on the first day" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "~1.5–2% OTM above spot", note: "Long call — profits on upside move" },
      { action: "BUY", type: "PE", strike: "~1.5–2% OTM below spot", note: "Long put — profits on downside move" },
    ],
    edges: [
      {
        title: "Direction-agnostic profit from large moves",
        body: "Every directional trade carries the cost of being wrong about which way the index moves. The long strangle eliminates that burden: you simply need BANKNIFTY to move enough. On RBI policy days, BANKNIFTY has historically moved an average of 300–500 points within the session — enough to make even slightly expensive strangles profitable.",
      },
      {
        title: "Vega boost on the event day",
        body: "When you buy options before a catalyst, you benefit from two potential gains: the delta move if the index travels in one direction, plus vega expansion if implied volatility spikes into the event. Even if BANKNIFTY moves modestly, a sharp IV spike can temporarily lift the strangle's value before the move fully plays out.",
      },
      {
        title: "Defined and manageable risk",
        body: "Unlike selling strangles where losses are theoretically unlimited, a long strangle limits your total loss to the combined debit paid. This makes position sizing straightforward and removes the risk of catastrophic loss — you can participate in event volatility without existential risk to your account.",
      },
    ],
    whenToUse: [
      "A scheduled high-impact event — RBI monetary policy, Union Budget, US Fed decision, or major bank quarterly results — falls within your option's expiry and you expect a large BANKNIFTY move but are uncertain of direction.",
      "India VIX is below 14 and IVP is below 25%, meaning options are historically cheap relative to realized volatility — an attractive entry for long premium strategies.",
      "BANKNIFTY has been consolidating in a tight range for multiple sessions and coiling energy — a breakout is likely but the direction is unclear.",
    ],
    risks: [
      "The 'volatility crush' trap: if IV spikes into an event and then collapses sharply after (even with a move), the post-event IV collapse can erode gains from the directional move — avoid holding through expiry if you entered far before the catalyst.",
      "Time decay is a constant headwind: every day that passes without a sufficient move reduces both legs' value. The strangle is a time-sensitive trade — don't enter too early.",
      "If BANKNIFTY pins near the current level through expiry, both legs expire worthless and you lose 100% of the premium paid.",
    ],
    faq: [
      {
        q: "How far OTM should I place the strikes on a BANKNIFTY Long Strangle?",
        a: "A common approach is 1.5–2% away from spot on each side — roughly 650–900 points on BANKNIFTY at current levels. Closer strikes cost more but need less movement; farther strikes are cheaper but require a bigger event-day move. Start with the 1.5% guideline and adjust based on the magnitude of the expected catalyst.",
      },
      {
        q: "What is the 'volatility crush' and how do I avoid it?",
        a: "Volatility crush is the rapid drop in implied volatility that occurs immediately after a scheduled event (RBI policy, Budget), even if the market makes a large move. To mitigate it, consider exiting the profitable leg just as the move peaks on event day rather than holding into the post-event session when IV deflates sharply.",
      },
      {
        q: "Is a Long Strangle better than a Long Straddle on BANKNIFTY?",
        a: "A long straddle uses ATM strikes on both sides — more expensive but profits from smaller moves. A strangle uses OTM strikes — cheaper but needs a larger move to profit. On BANKNIFTY, where event-day moves are large, a strangle is often preferable because the lower cost improves the risk/reward ratio even if the break-even distance is wider.",
      },
    ],
  },

  "long-strangle-finnifty": {
    name: "Long Strangle on FINNIFTY",
    index: "FINNIFTY",
    category: "Volatility",
    theme: "fuchsia",
    payoff: "valley",
    badge: "Volatility · Long Premium · Event Strategy",
    tagline:
      "Buy OTM calls and puts on FINNIFTY simultaneously before a financial-sector catalyst — position for a large move in either direction with a precisely defined debit as your only risk.",
    keywords:
      "long strangle finnifty, finnifty event strategy, buy volatility finnifty, finnifty rbi options strategy, finnifty long premium",
    intro: [
      "The Long Strangle on FINNIFTY follows the same logic as its BANKNIFTY counterpart but targets the financial-services index, where sector-specific catalysts create sharp moves with unpredictable direction. FINNIFTY contains private banks, PSU banks, NBFCs, insurance companies, and housing finance firms — a mix that reacts explosively to RBI rate decisions, credit-cycle data, NPA disclosures, and international banking stress events.",
      "You buy an OTM call above FINNIFTY and an OTM put below it for a combined net debit. The trade profits when FINNIFTY moves enough — up or down — to overcome the total premium paid. FINNIFTY's 50-point strike increments allow fine-tuned strike placement, and its lower absolute premium level versus BANKNIFTY means combined strangle costs are typically ₹120–220 per share for strikes placed 1.5–2% from spot.",
      "The key edge of a FINNIFTY strangle is the concentration of catalysts. Because FINNIFTY is narrow and sector-specific, a single major event — an unexpected rate cut, a large NBFC default, or a government recapitalization announcement — can move it 4–6% in a session. That concentrated catalyst risk is exactly what a long strangle harvests.",
    ],
    stats: [
      { label: "Break-even Move", value: "> 2× Debit", note: "Total premium must be exceeded by index move" },
      { label: "Combined Premium", value: "₹120–220", note: "Per share; OTM strikes ~1.5% from spot" },
      { label: "Best IVP Entry", value: "Below 30%", note: "Enter when options are relatively cheap" },
      { label: "Ideal Catalyst", value: "RBI Policy / Bank Results", note: "Sector-specific high-impact events" },
      { label: "Max Loss", value: "Net Debit", note: "Both legs expire worthless if FINNIFTY pins" },
      { label: "Margin Required", value: "Net Debit", note: "Long-only structure — no SPAN margin" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strike increments)" },
      { label: "Long Call Strike", value: "1.5–2% above current FINNIFTY (OTM CE)" },
      { label: "Long Put Strike", value: "1.5–2% below current FINNIFTY (OTM PE)" },
      { label: "Entry Timing", value: "3–5 days before a catalyst; IVP below 30%" },
      { label: "Profit Target", value: "75–100% of debit paid; exit the profitable leg on event day" },
      { label: "Stop Loss", value: "Exit if combined value falls 45% within the first 2 days" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "~1.5–2% OTM above spot", note: "Long call — profits on financials rally" },
      { action: "BUY", type: "PE", strike: "~1.5–2% OTM below spot", note: "Long put — profits on financials selloff" },
    ],
    edges: [
      {
        title: "Sector catalysts are denser and sharper on FINNIFTY",
        body: "While NIFTY moves on broad economic signals, FINNIFTY reacts to a narrower set of events — and those events tend to produce larger sector-specific moves. An unexpected RBI rate hold with hawkish commentary can drop FINNIFTY 3% while NIFTY moves only 1%. This concentrated reaction is what makes event strangles particularly effective on financial indices.",
      },
      {
        title: "Lower cost than a BANKNIFTY strangle",
        body: "FINNIFTY options are cheaper in absolute terms than BANKNIFTY options because the index level and lot-weighted premium are both lower. A comparable 1.5%-OTM strangle on FINNIFTY costs ₹120–220 versus ₹200–350 on BANKNIFTY — a meaningful difference when the underlying event may not produce a BANKNIFTY-magnitude move.",
      },
      {
        title: "Full sector exposure with single-instrument efficiency",
        body: "Buying a FINNIFTY strangle gives you volatility exposure across the entire financial sector simultaneously, without having to stagger individual stock option positions across multiple scrips. The single-instrument approach is cleaner to manage, less prone to stock-specific idiosyncratic risk, and simpler to track.",
      },
    ],
    whenToUse: [
      "An RBI monetary policy committee (MPC) meeting, quarterly results from a major private bank or NBFC, or a government banking-sector policy announcement is scheduled within the option's expiry window.",
      "FINNIFTY's IVP is below 30% — premium is cheap enough that buying long strangles offers a favourable risk/reward relative to the historical event-day move size.",
      "FINNIFTY has been range-bound for 5–8 sessions with low realized volatility, suggesting a coiled spring that may unwind sharply on the next sector catalyst.",
    ],
    risks: [
      "IV crush post-event: even if FINNIFTY moves on event day, a rapid post-event collapse in implied volatility can reduce the strangle's value faster than the directional gain accrues — exit promptly on event day.",
      "Theta decay is relentless: a strangle with 10 days to expiry loses significant value each day without a move, making this an unsuitable 'set and forget' trade.",
      "Tight FINNIFTY liquidity: compared to NIFTY and BANKNIFTY, FINNIFTY options have wider bid-ask spreads — always use limit orders placed at the mid-price and allow extra slippage in your break-even calculation.",
    ],
    faq: [
      {
        q: "Why use FINNIFTY for a long strangle instead of BANKNIFTY?",
        a: "If your view is specifically about financial-sector volatility — such as an RBI decision that will hit banks and NBFCs differently than the broader index — FINNIFTY gives you cleaner, more concentrated sector exposure at a lower absolute cost per lot. Use BANKNIFTY when you want higher absolute premiums and deeper liquidity.",
      },
      {
        q: "How many days before the event should I enter the strangle?",
        a: "2–5 days before the event is the sweet spot. Entering too early means paying more theta decay before the catalyst. Entering on the event day itself means paying a large IV premium that collapses immediately after the announcement. Three trading days before the event is a practical balance for most FINNIFTY catalysts.",
      },
      {
        q: "What if only one leg is profitable on event day — should I hold the other?",
        a: "Typically, close the whole structure on event day or the morning after. The profitable leg should be exited while IV is still elevated and the move is fresh. The losing OTM leg retains very little value and continuing to hold it exposes you to further theta decay for negligible potential recovery.",
      },
    ],
  },

  // ── Calendar Spread (Neutral, time decay) ────────────────────────────────
  "calendar-spread-finnifty": {
    name: "Calendar Spread on FINNIFTY",
    index: "FINNIFTY",
    category: "Neutral",
    theme: "indigo",
    payoff: "tent",
    badge: "Neutral · Theta Positive · Time Spread",
    tagline:
      "Sell a near-month FINNIFTY ATM option and buy the same strike in the far month — harvest the faster theta decay of the front leg while the back leg holds its value.",
    keywords:
      "calendar spread finnifty, diagonal spread finnifty, time spread finnifty, horizontal spread finnifty, theta spread finnifty",
    intro: [
      "A Calendar Spread — also called a time spread or horizontal spread — exploits the fact that near-dated options lose time value faster than longer-dated options at the same strike. On FINNIFTY, you sell the front-month ATM call (or put) and simultaneously buy the same strike in the next month, paying a small net debit. As the front month decays rapidly into expiry, the spread's value increases — as long as FINNIFTY stays near your strike.",
      "FINNIFTY's monthly-only expiry cycle (no weekly series as of 2025) makes the front-month vs. next-month calendar the standard implementation. The key driver of profitability is the theta differential: the short front-month option decays at an accelerating rate in its final 2–3 weeks, while the long back-month option retains most of its time value. This differential theta collection is the trade's primary income source.",
      "FINNIFTY's intermediate volatility character — sitting between NIFTY and BANKNIFTY — gives the calendar spread a reliable risk/reward setup. The strategy works best when the index is range-bound and implied volatility is expected to stay steady or rise slightly, as the back-month long option benefits from any IV expansion while the front-month short is already time-decaying.",
    ],
    stats: [
      { label: "Net Debit", value: "₹80–140", note: "Per share (front vs. back month at same ATM strike)" },
      { label: "Max Profit Zone", value: "ATM ± 2%", note: "FINNIFTY must pin near the strike at front expiry" },
      { label: "Max Loss", value: "Net Debit", note: "If FINNIFTY moves far from the strike" },
      { label: "Best Regime", value: "Low IV, Range-bound", note: "Avoid around major banking catalysts" },
      { label: "Theta Profile", value: "Positive (net)", note: "Front month decays faster than back month" },
      { label: "Vega Profile", value: "Positive (net)", note: "IV expansion lifts the back-month long" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strike increments)" },
      { label: "Short Leg", value: "Sell near-month ATM call (or put)" },
      { label: "Long Leg", value: "Buy next-month ATM call (or put) — same strike" },
      { label: "Entry Condition", value: "FINNIFTY range-bound; no major event in front-month window; IVP moderate" },
      { label: "Profit Target", value: "Exit at 40–50% of max theoretical profit, or before front-month expiry week" },
      { label: "Adjustment", value: "Roll strike to ATM if FINNIFTY drifts more than 2% from your strike" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "ATM (front month)", note: "Short near-month call — theta income" },
      { action: "BUY", type: "CE", strike: "ATM (next month, same strike)", note: "Long back-month call — value anchor" },
    ],
    edges: [
      {
        title: "Theta differential is the core income engine",
        body: "Options lose time value at a rate proportional to 1/√T — meaning near-dated options decay exponentially faster as expiry approaches. By being short the front month and long the back month at the same strike, you collect the difference in decay rates. On FINNIFTY, this differential is typically ₹80–140 per share over a 3–4 week holding period.",
      },
      {
        title: "Double benefit when IV rises",
        body: "If implied volatility expands after you enter, both legs increase in value — but the back-month long option gains more (it has higher vega). This makes the calendar spread a genuinely positive-vega trade: unlike a simple short straddle, you actually want IV to tick up. This is a rare edge in a predominantly theta-selling environment.",
      },
      {
        title: "Lower margin than directional or naked positions",
        body: "The net debit structure means your maximum loss is the premium paid — there is no naked option exposure. Margin requirements are minimal compared to short straddles or iron condors, making this an efficient use of capital when you have a neutral view on FINNIFTY for the month ahead.",
      },
    ],
    whenToUse: [
      "FINNIFTY is in a confirmed trading range and no major RBI events, banking-sector results, or budget announcements fall within the front-month expiry window.",
      "The implied volatility term structure is in contango (front month IV is lower than back month), suggesting the market does not expect an imminent shock — front-month theta will work cleanly.",
      "You want a market-neutral, positively-convex theta trade that benefits from sideways price action without the open-ended risk of an uncapped naked straddle.",
    ],
    risks: [
      "A sharp FINNIFTY move away from the strike in either direction collapses the calendar's tent-shaped payoff quickly — the trade loses on both vanna and delta if the index trends away.",
      "Front-month IV collapse (without price movement) can cause the short leg to decay less than modelled, slowing profit accrual — check the IV term structure before entry.",
      "Liquidity risk: FINNIFTY back-month options have wider spreads than front month — factor in extra slippage when buying the far-month leg and when closing the entire spread.",
    ],
    faq: [
      {
        q: "Should I use calls or puts for a FINNIFTY Calendar Spread?",
        a: "Either works mechanically, but many traders use calls when FINNIFTY is slightly below the strike (so the short call is slightly OTM and benefits from an extra theta pickup) and puts when the index is slightly above. A double calendar — one call spread plus one put spread at the same or nearby strikes — broadens the profitable zone but doubles the debit.",
      },
      {
        q: "When should I close the front-month leg?",
        a: "Exit the entire spread 3–5 days before the front-month expiry, before gamma risk spikes and the short leg becomes dangerously sensitive to small price moves. Alternatively, let the front-month leg expire and hold the back-month leg if FINNIFTY has moved to a new ATM — this converts the trade into a long single option.",
      },
      {
        q: "How does FINNIFTY's monthly-only cycle affect the calendar spread?",
        a: "The lack of weekly FINNIFTY options means you must use consecutive monthly expiries, creating a 25–35 day gap between legs. This is a wider time spread than a NIFTY weekly calendar, which means more capital is at risk (higher debit) but also a more extended theta collection window. Plan for a 20–25 day maximum holding period.",
      },
    ],
  },

  // ── Bull Put Spread (Bullish/Neutral, credit) ────────────────────────────
  "bull-put-spread-finnifty": {
    name: "Bull Put Spread on FINNIFTY",
    index: "FINNIFTY",
    category: "Bullish",
    theme: "amber",
    payoff: "tent",
    badge: "Bullish · Credit Received · Defined Risk",
    tagline:
      "Sell a put at a higher strike and buy a put at a lower strike on FINNIFTY — collect an upfront credit and keep it entirely if FINNIFTY stays above your short put at expiry.",
    keywords:
      "bull put spread finnifty, credit spread finnifty, cash secured put finnifty, finnifty put credit spread, neutral bullish finnifty strategy",
    intro: [
      "The Bull Put Spread is a credit strategy — you receive premium on day one and aim to keep it. You sell a put at a higher strike (closer to or at the current FINNIFTY level) and buy a put at a lower strike as protection, netting a credit. As long as FINNIFTY stays above your short put at expiry, both legs expire worthless and you retain 100% of the credit. Your protection leg limits your loss if the index falls sharply.",
      "This is one of the most popular income strategies for FINNIFTY because it marries a bullish or neutral market view with a probabilistic edge. By placing the short put below the current market — in the 15–25 delta zone — you collect credit while giving FINNIFTY room to fall modestly without triggering a loss. The wing (long put below) caps your loss and reduces margin requirements versus selling a naked put.",
      "The financial-services sector in India has historically displayed a mild bullish long-term trend punctuated by sharp event-driven corrections. The bull put spread suits this profile: collect regular credit income in trending-to-flat periods, and let the long put wing limit damage when a financial-sector shock delivers an outsized downswing. Over 2021–2024 NSE data, 15-delta FINNIFTY put spreads achieved a 65–70% expiry-worthless rate on monthly cycles.",
    ],
    stats: [
      { label: "Win Rate", value: "65–70%", note: "15-delta short put, monthly FINNIFTY cycle" },
      { label: "Credit Received", value: "₹60–110", note: "Per share (50-point spread width)" },
      { label: "Max Loss", value: "Spread − Credit", note: "e.g. ₹190 loss on ₹250 spread − ₹60 credit" },
      { label: "Best Regime", value: "Bullish / Sideways", note: "FINNIFTY trending up or flat" },
      { label: "Theta", value: "Positive", note: "Credit decays toward zero as expiry nears" },
      { label: "Margin / Lot", value: "₹15k–25k", note: "Lower than naked put selling" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Short Put Strike", value: "15–20 delta OTM put (below current FINNIFTY)" },
      { label: "Long Put Strike", value: "100–250 points below short put (wing)" },
      { label: "Entry Condition", value: "Bullish or sideways view; no major financial catalyst in the window" },
      { label: "Profit Target", value: "Close at 50% of credit received (reduce gamma risk)" },
      { label: "Adjustment Trigger", value: "Short put delta crosses 0.35 — roll down or close" },
    ],
    legs: [
      { action: "SELL", type: "PE", strike: "15–20 delta OTM (below spot)", note: "Short put — premium income" },
      { action: "BUY", type: "PE", strike: "100–250 pts below short put", note: "Long put wing — caps max loss" },
    ],
    edges: [
      {
        title: "Time decay is your daily ally",
        body: "As a net credit structure, every day that passes without FINNIFTY breaching your short put increases your profit. Theta works continuously — the short put's time value erodes while the further OTM long put loses value more slowly, widening the spread's P&L in your favour as expiry approaches.",
      },
      {
        title: "High probability of profit with defined risk",
        body: "Placing the short put at the 15-delta level means the market implies approximately an 85% chance of FINNIFTY staying above it at expiry. You can't control which 15% of cycles are losers, but the long wing ensures that even in a losing cycle, your maximum loss is bounded and pre-known — not a surprise margin call.",
      },
      {
        title: "Works as a recurring income overlay on a bullish FINNIFTY view",
        body: "Investors already long FINNIFTY ETFs or financials-heavy mutual funds can add a bull put spread to generate extra monthly income on top of portfolio appreciation. The spread's premium buffers against small FINNIFTY dips while the portfolio gains from rallies — a natural complement to a long-financials core position.",
      },
    ],
    whenToUse: [
      "FINNIFTY is in an uptrend or trading sideways above a well-defined support zone, with no major RBI or banking-sector catalysts due before expiry.",
      "India VIX is moderate-to-elevated (15–20), making put premiums rich enough to collect a meaningful credit for a spread placed 3–5% below the current index level.",
      "You want a recurring monthly income strategy on the financial sector without the unlimited risk of selling a naked put.",
    ],
    risks: [
      "A sharp FINNIFTY selloff — triggered by an unexpected RBI decision or a bank crisis — can breach the short put quickly; always manage at the 0.35-delta trigger rather than waiting for assignment.",
      "Collecting small credits means a single losing cycle can erase several months of gains if not managed — never skip the stop-loss discipline on a credit spread.",
      "Assignment risk on the short put if FINNIFTY drops through it near expiry — close well before the final session to avoid any assignment complications on monthly expiry day.",
    ],
    faq: [
      {
        q: "What is the difference between a Bull Put Spread and a naked put on FINNIFTY?",
        a: "A naked put has unlimited risk below the strike and requires significantly higher margin. A bull put spread adds a protective long put that caps the maximum loss at the spread width minus the credit received, while also reducing margin requirements by 50–70%. You give up some premium by buying the wing, but gain defined risk and capital efficiency.",
      },
      {
        q: "At what credit level does this spread become attractive on FINNIFTY?",
        a: "Aim for a credit-to-spread-width ratio of at least 25% — for example, collecting ₹65 on a ₹250-wide spread. Below 20%, the risk/reward deteriorates: you're risking ₹185 to make ₹65 and the math only works if your win rate stays well above 70%. When premium is thin, widen the spread or wait for higher IV.",
      },
      {
        q: "How does the bull put spread behave when FINNIFTY approaches the short put?",
        a: "As FINNIFTY falls toward the short put, the spread's value increases toward its maximum loss (spread width minus original credit). At the short-put delta of 0.35, the conventional adjustment is to close the spread, take a partial loss, and reassess. Waiting longer increases gamma risk and the probability of a maximum-loss outcome.",
      },
    ],
  },

  // ── Bear Call Spread (Bearish, credit) ───────────────────────────────────
  "bear-call-spread-finnifty": {
    name: "Bear Call Spread on FINNIFTY",
    index: "FINNIFTY",
    category: "Bearish",
    theme: "rose",
    payoff: "ramp-down",
    badge: "Bearish · Credit Received · Defined Risk",
    tagline:
      "Sell a lower-strike call and buy a higher-strike call on FINNIFTY — pocket a credit upfront and keep it entirely when FINNIFTY stays below your short call at expiry.",
    keywords:
      "bear call spread finnifty, credit call spread finnifty, call credit spread finnifty, bearish credit strategy finnifty, finnifty short call spread",
    intro: [
      "The Bear Call Spread is the credit-side bearish structure: you sell a call at a strike closer to the current FINNIFTY level and buy a higher-strike call to cap your risk, receiving a net credit upfront. If FINNIFTY stays below your short call at expiry — or falls — you keep the entire credit as profit. The long call wing above ensures your loss is bounded if FINNIFTY unexpectedly surges.",
      "This strategy pairs exceptionally well with FINNIFTY because financial stocks have well-defined resistance zones that often hold through multiple monthly cycles. Selling a call spread at or just above a resistance level is a recurring setup — you collect credit from time decay while the level holds, and the long wing protects you if the resistance breaks with force.",
      "Unlike a debit-based bear put spread, the bear call spread generates immediate income. The trade-off is probability: you want FINNIFTY to stay below your short call, which is easier to achieve with an OTM placement but gives a lower credit. At-the-money or just-OTM placements collect more but require more precise market timing. Most professional traders use the 15–25 delta short call as the baseline.",
    ],
    stats: [
      { label: "Win Rate", value: "65–70%", note: "15-delta short call, monthly FINNIFTY cycle" },
      { label: "Credit Received", value: "₹60–110", note: "Per share (50-point spread width)" },
      { label: "Max Loss", value: "Spread − Credit", note: "e.g. ₹190 on a ₹250 spread − ₹60 credit" },
      { label: "Best Regime", value: "Bearish / Sideways", note: "FINNIFTY trending down or at resistance" },
      { label: "Theta", value: "Positive", note: "Short call decays toward zero as expiry approaches" },
      { label: "Margin / Lot", value: "₹15k–25k", note: "Lower than naked call selling" },
    ],
    setup: [
      { label: "Underlying", value: "FINNIFTY monthly options (50-point strikes)" },
      { label: "Short Call Strike", value: "15–25 delta OTM call (above current FINNIFTY)" },
      { label: "Long Call Strike", value: "100–250 points above short call (wing)" },
      { label: "Entry Condition", value: "FINNIFTY at or near resistance; bearish or neutral view; IV moderate-to-high" },
      { label: "Profit Target", value: "Close at 50% of credit received to reduce risk" },
      { label: "Adjustment Trigger", value: "Short call delta crosses 0.35 — roll up or close position" },
    ],
    legs: [
      { action: "SELL", type: "CE", strike: "15–25 delta OTM (above spot)", note: "Short call — premium income" },
      { action: "BUY", type: "CE", strike: "100–250 pts above short call", note: "Long call wing — caps max loss" },
    ],
    edges: [
      {
        title: "Collect credit at proven resistance levels",
        body: "FINNIFTY's sector concentration means resistance zones form clearly and hold well. Selling a call spread just above a well-tested resistance — confirmed by multiple failed breakout attempts — stacks a structural edge on top of the probabilistic one. Time decay erodes the short call while the resistance holds.",
      },
      {
        title: "Theta decay without directional commitment",
        body: "You don't need FINNIFTY to fall dramatically — you just need it not to rally above your short strike. Sideways-to-bearish is sufficient for full profit. This makes the bear call spread a useful tool in range-bound markets where selling puts is uncomfortable but calls above resistance are attractively priced.",
      },
      {
        title: "Predefined loss with no margin call risk",
        body: "The long call wing above your short call converts what would be an unlimited-risk naked call into a bounded-loss structure. You know exactly how much you can lose before you enter, enabling precise position sizing and systematic risk management — critical for trading financial-sector options where gap risk from banking events is non-trivial.",
      },
    ],
    whenToUse: [
      "FINNIFTY is testing a resistance level and showing signs of reversal — multiple failed closes above the level with bearish candle patterns on the daily chart.",
      "The India VIX is elevated (15–20+), making call premiums rich enough to collect a meaningful credit even with a wing reducing the net take.",
      "You have a near-term bearish or neutral view on the financial sector (RBI has been hawkish, credit growth slowing) but want a bounded-risk expression rather than a naked directional trade.",
    ],
    risks: [
      "A breakout rally above the short call — triggered by surprise positive news like an unexpected rate cut or strong banking results — can push the spread toward maximum loss quickly; manage at the 0.35-delta trigger.",
      "Momentum markets where FINNIFTY trends strongly upward make call spreads at resistance dangerous — trend confirmation is more important than resistance levels in trending regimes.",
      "Near-expiry gamma: in the final 3–5 days, a small FINNIFTY move can dramatically change the spread's value — close early to avoid expiry-week gamma risk on the short leg.",
    ],
    faq: [
      {
        q: "Is a Bear Call Spread better than a Bear Put Spread on FINNIFTY?",
        a: "They express the same bearish view but differ in structure. A bear call spread is a credit strategy — you receive premium and time is your friend. A bear put spread is a debit strategy — you pay premium and need a move to profit. In range-bound or mildly bearish markets, the call spread's credit advantage is superior. In sharp-move scenarios, the put spread's unlimited downside capture potential (relative to debit) can be more profitable.",
      },
      {
        q: "What credit-to-spread ratio should I target for a FINNIFTY Bear Call Spread?",
        a: "Aim for at least 25% — e.g., collecting ₹65 on a ₹250-wide spread. Below 20%, the risk/reward requires a very high win rate to be profitable over a series of trades. When IV is high enough to collect 30–35% of the spread width, the trade becomes particularly attractive.",
      },
      {
        q: "Can I use this spread inside an Iron Condor?",
        a: "Yes — a Bear Call Spread is always one half of an Iron Condor. If you're already in a Bull Put Spread on FINNIFTY and want to add the bearish call side to create a full non-directional structure, you simply add the Bear Call Spread above the market. Just ensure your combined credit and margin requirements fit your account size and risk limits.",
      },
    ],
  },

  // ── Covered Call (Income on long position) ───────────────────────────────
  "covered-call-nifty": {
    name: "Covered Call on NIFTY",
    index: "NIFTY",
    category: "Bullish",
    theme: "amber",
    payoff: "tent",
    badge: "Bullish · Income Strategy · Theta Positive",
    tagline:
      "Hold a long NIFTY position (ETF or futures) and sell an OTM call against it — generate monthly income on an existing holding while retaining upside up to the sold strike.",
    keywords:
      "covered call nifty, nifty etf covered call, sell call against nifty position, nifty income strategy, niftybees covered call, long nifty short call",
    intro: [
      "The Covered Call is the most widely used income-generation strategy for investors who already hold a long NIFTY position. You own NIFTY exposure — through Niftybees ETF units, a long NIFTY futures contract, or a basket of NIFTY constituents — and sell an out-of-the-money call option against that position. The call premium flows to you upfront as income. If NIFTY stays below the sold strike at expiry, the call expires worthless and you repeat the process next month.",
      "In the Indian context, the cleanest implementation is Niftybees units (the NSE-listed NIFTY 50 ETF) paired with short NIFTY weekly or monthly CE options. The ETF provides the 'covered' equity leg; the short call generates income. The strategy is also executed by futures traders who are long NF futures and sell the same-expiry OTM CE — the futures provide physical delivery equivalence, making the call 'covered' in margin terms.",
      "Historically, a covered call writer on NIFTY captures 60–80% of the index's upside in bull markets (capped at the sold strike) while generating 1–2% monthly income from premiums in sideways markets. The trade-off is that if NIFTY rallies sharply past the sold strike, your gains are capped at the strike price — you participate in the rally only up to the call's exercise point. The strategy suits investors with a mildly bullish to neutral outlook who prioritise income over unlimited upside.",
    ],
    stats: [
      { label: "Monthly Income", value: "0.5–1.5%", note: "Of position value; OTM call premium at 15–25 delta" },
      { label: "Upside Cap", value: "Short Strike", note: "Profits capped at the sold call's strike" },
      { label: "Downside", value: "Unprotected", note: "Long NIFTY position losses offset by premium only" },
      { label: "Best Regime", value: "Sideways–Mildly Bullish", note: "Full premium retained; position appreciates modestly" },
      { label: "Theta", value: "Positive", note: "Short call decays in your favour daily" },
      { label: "Break-even Improvement", value: "By premium received", note: "Effectively lowers your long NIFTY cost basis" },
    ],
    setup: [
      { label: "Long Leg", value: "Niftybees ETF or long NIFTY futures (1 lot = 75 units)" },
      { label: "Short Call Strike", value: "1–3% OTM from current NIFTY (15–25 delta zone)" },
      { label: "Expiry", value: "Nearest weekly or monthly NIFTY option" },
      { label: "Entry Condition", value: "Neutral-to-mildly bullish view; IV elevated enough to collect meaningful premium" },
      { label: "Profit Target", value: "Sell call, collect premium, hold to expiry or 50% premium decay" },
      { label: "Roll / Adjustment", value: "If NIFTY approaches short strike, roll the call up-and-out to next expiry" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "NIFTY ETF / Futures (existing long position)", note: "The 'covered' long leg — held in portfolio" },
      { action: "SELL", type: "CE", strike: "1–3% OTM above current NIFTY", note: "Short call — generates monthly income premium" },
    ],
    edges: [
      {
        title: "Lowers your effective cost basis month after month",
        body: "Every premium you collect from the short call reduces your effective entry price in the long NIFTY position. If you bought Niftybees at ₹250 and collect ₹2 per unit monthly for 12 months, your effective cost falls to ₹226 — a meaningful 9.6% cost reduction over a year, compounding alongside any NIFTY appreciation.",
      },
      {
        title: "India's sideways market phases are long and regular",
        body: "NIFTY has historically spent 40–50% of its time in flat-to-mildly-trending phases where directional traders lose money but premium sellers thrive. Covered call writers systematically harvest those sideways months through option income while remaining positioned for the next trending phase up to the sold call's strike.",
      },
      {
        title: "No additional margin required",
        body: "Because the short call is covered by the existing long ETF or futures position, NSE margin rules treat it as a covered position with significantly reduced margin requirements compared to a naked short call. For ETF-based covered calls, the call is collateralised by the ETF shares — no SPAN margin is levied on top.",
      },
    ],
    whenToUse: [
      "You already hold a long NIFTY position (Niftybees, index mutual fund, or NIFTY futures) and want to generate monthly income on it without reducing the position.",
      "NIFTY has been in a sideways or slowly rising market for several weeks and you don't expect a sharp near-term rally — the sold call is unlikely to be exercised.",
      "Implied volatility is elevated (IV rank above 40%) and call premiums are rich — selling expensive calls improves the income yield and provides a better cushion against small drawdowns.",
    ],
    risks: [
      "Capped upside: if NIFTY rallies sharply, your gains on the long position stop at the short call's strike — you will regret selling the call on days of strong rallies.",
      "Downside is NOT protected: the premium collected provides only a small buffer against NIFTY falling; a 5–8% correction still produces a significant loss on the long position that premium alone cannot offset.",
      "Early assignment risk (primarily on futures leg): if the short call goes deep in the money near expiry, there is a theoretical assignment risk on American-style contracts — on NSE's European-exercise index options, assignment is only at expiry.",
    ],
    faq: [
      {
        q: "Can I implement a covered call using only Niftybees ETF without futures?",
        a: "Yes — Niftybees (or any NIFTY 50 ETF) can serve as the covered equity leg. You hold the ETF units in your demat account and sell NIFTY CE options against an equivalent notional exposure. The ETF provides physical backing, reducing margin requirements. However, the ETF tracks the cash index while options are settled against the futures-derived closing price — verify the notional match carefully.",
      },
      {
        q: "What happens if NIFTY rallies above my short call at expiry?",
        a: "Your long position gains up to the strike level, and the short call is exercised at expiry — you deliver the gains (settled in cash on NSE index options). Your net profit is the strike gain plus the premium received, but you miss any rally above the strike. You can then re-establish the position by selling the next month's call at a new, higher strike.",
      },
      {
        q: "How often should I write covered calls on NIFTY?",
        a: "Monthly is the most common frequency — one call sold per expiry cycle, collecting premium while managing the long position. Some active traders write weekly calls on NIFTY for higher frequency income but with commensurately higher transaction costs and management overhead. Start monthly to understand the mechanics before moving to weekly cadence.",
      },
    ],
  },

  // ── Diagonal Spread (Neutral/Bullish, PMCC) ───────────────────────────────
  "diagonal-spread-nifty": {
    name: "Diagonal Spread on NIFTY",
    index: "NIFTY",
    category: "Neutral",
    theme: "teal",
    payoff: "tent",
    badge: "Neutral · Bullish Lean · Poor Man's Covered Call",
    tagline:
      "Buy a longer-dated ITM NIFTY call and sell a shorter-dated OTM call against it — a capital-efficient alternative to the covered call, powered by time decay differential.",
    keywords:
      "diagonal spread nifty, pmcc nifty, poor mans covered call nifty, diagonal options strategy nse, nifty calendar with different strikes, nifty diagonal call spread",
    intro: [
      "The Diagonal Spread — often called a Poor Man's Covered Call (PMCC) — replicates the income-generating mechanics of a covered call at a fraction of the capital required to hold the underlying. Instead of owning NIFTY ETF units or a futures position, you buy a deep ITM or ATM call with a longer expiration (2–3 months out) to act as a proxy for the long position, then sell a shorter-dated OTM call against it each month to collect premium.",
      "The long deep ITM call has a delta close to 1 — it moves almost one-for-one with NIFTY — while costing far less than the equivalent ETF position. You then sell a near-month OTM call against this long position, exactly as a covered call writer would, collecting monthly premium. The difference is time: the short call expires in weeks while the long call has months of life remaining, creating the theta differential that drives the trade's income engine.",
      "On NIFTY, a diagonal spread is particularly capital-efficient because NIFTY's deep liquidity allows entry and exit at tight spreads even in longer-dated contracts. A long ITM call 2 months out might cost ₹400–600 per share (versus ₹1,800+ to buy equivalent NIFTY futures exposure), and selling a 1-month OTM call for ₹80–120 per share gives you a recurring income yield of 15–25% on the long call's cost each month. Over 3–4 months of short call rolls, you can recover most of your initial debit.",
    ],
    stats: [
      { label: "Monthly Income", value: "15–25%", note: "Of long call cost; from short near-month OTM call" },
      { label: "Long Call Cost", value: "₹400–600", note: "Per share; 2–3 month ITM call on NIFTY" },
      { label: "Short Call Premium", value: "₹80–120", note: "Per share; 1-month OTM call at 20–30 delta" },
      { label: "Capital Required", value: "~30% of ETF", note: "Versus buying equivalent NIFTY exposure via ETF" },
      { label: "Best Regime", value: "Mildly Bullish / Sideways", note: "Long call appreciates; short call decays" },
      { label: "Break-even", value: "Long call cost minus accumulated short call credits", note: "Recoverable over 3–4 monthly rolls" },
    ],
    setup: [
      { label: "Long Leg", value: "Buy NIFTY CE: 2–3 months to expiry, ITM (delta 0.70–0.85)" },
      { label: "Short Leg", value: "Sell NIFTY CE: 1 month to expiry, OTM (delta 0.20–0.30)" },
      { label: "Strike Relationship", value: "Short call strike must be above long call strike (avoids inverted spread)" },
      { label: "Entry Condition", value: "Mildly bullish to neutral on NIFTY; IV moderate (not spiking)" },
      { label: "Roll Process", value: "When short call expires or reaches 50% profit, sell next month's OTM call" },
      { label: "Exit", value: "Close entire spread if NIFTY breaches long call strike on the downside significantly" },
    ],
    legs: [
      { action: "BUY", type: "CE", strike: "ITM (delta 0.70–0.85), 2–3 months expiry", note: "Long ITM call — synthetic long NIFTY position" },
      { action: "SELL", type: "CE", strike: "OTM (delta 0.20–0.30), front month expiry", note: "Short OTM call — monthly income generator" },
    ],
    edges: [
      {
        title: "Leverage without futures margin risk",
        body: "A long deep ITM NIFTY call at ₹500/share gives delta-1 exposure to NIFTY at a fraction of the cost of futures (which require ₹90,000–110,000 in SPAN margin per lot). You get nearly identical upside participation up to the short call strike but with a defined, pre-paid cost — no overnight margin calls, no mark-to-market risk on the long leg beyond the premium paid.",
      },
      {
        title: "Monthly income through short call rolls",
        body: "The short near-month OTM call is what generates recurring income. Each time it expires or decays to 50% of its value, you sell the next month's call at the then-current OTM level. Over time, accumulated short call credits reduce your net cost in the long ITM call, progressively improving the trade's risk/reward with each roll cycle.",
      },
      {
        title: "Benefits from NIFTY's mean-reverting tendencies",
        body: "NIFTY has a historical tendency to chop sideways in 2–4 month bands before the next trending phase. The diagonal spread is designed precisely for this environment: the long ITM call captures any eventual rally, while the monthly short call rolls extract income during the choppy sideways periods. It's a strategy that converts sideways time into cumulative premium collected.",
      },
    ],
    whenToUse: [
      "You are mildly bullish on NIFTY over the next 2–3 months but don't want to deploy full ETF or futures capital — the diagonal lets you participate with a defined debit and monthly income rolls.",
      "NIFTY is in a sideways or slowly rising phase and you expect this to continue for 1–2 more months before a potential breakout — short call income accrues while you wait.",
      "IV on near-term options is elevated relative to longer-dated options (steep forward skew), making the short near-month call attractively priced relative to the long back-month call you're buying.",
    ],
    risks: [
      "If NIFTY falls sharply, the long ITM call loses value (though delta-hedged by the short call partially) — deep moves threaten the long leg's intrinsic value and can produce a significant loss despite the short call income collected.",
      "Short call assignment risk: if NIFTY surges past the short call's strike, the short leg moves deeply ITM — close or roll it promptly as the short call's loss can exceed the short call premium received, eroding the long call's gains.",
      "Time decay risk on the long leg: the 2–3 month ITM call has significant time value that decays — if NIFTY stays flat for the entire holding period and IV falls, the long call loses value faster than the accumulated short call credits compensate.",
    ],
    faq: [
      {
        q: "What makes a Diagonal Spread different from a Calendar Spread on NIFTY?",
        a: "A calendar spread uses the same strike for both legs — different expiries, same strike. A diagonal spread uses different strikes AND different expiries — the long leg is typically ITM and farther out, while the short leg is OTM and near-term. The diagonal has a directional component (slightly bullish) because the long ITM call has intrinsic value, whereas a calendar is purely strike-neutral.",
      },
      {
        q: "How do I choose the strike for the long ITM call?",
        a: "Target a delta of 0.70–0.85 for the long call — deep enough in the money to have high delta (so it moves like NIFTY) but not so deep that you overpay for intrinsic value with no time benefit. At a 0.75 delta, a ₹100 NIFTY move translates into approximately ₹75 gain on the long call — near-equivalent exposure to the ETF for a fraction of the cost.",
      },
      {
        q: "What is the maximum loss on a Diagonal Spread?",
        a: "The maximum theoretical loss is the net debit paid for the entire spread — the cost of the long ITM call minus the credit from the first short call. In practice, you would exit well before a total-loss scenario by closing the long call when NIFTY moves significantly against you. Define a stop-loss at 50% of the net debit and honour it regardless of conviction.",
      },
    ],
  },
};

// Helper for routes/sitemap/hub.
export const STRATEGY_SLUGS = Object.keys(STRATEGIES);
export const getStrategy = (slug) => STRATEGIES[slug] || null;
