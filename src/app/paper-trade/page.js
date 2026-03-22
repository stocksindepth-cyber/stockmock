"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Wallet, TrendingUp, TrendingDown, Clock, Plus, X, RefreshCw,
  Activity, BarChart2, CheckCircle2, AlertTriangle, ChevronDown,
  Target, Zap, ArrowUpRight, ArrowDownRight, BookOpen, RotateCcw,
  IndianRupee, Layers, ShieldCheck,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PayoffChart from "@/components/PayoffChart";
import GreeksPanel from "@/components/GreeksPanel";
import AppModal from "@/components/AppModal";
import TradeMetricsBar from "@/components/TradeMetricsBar";
import { useAuth } from "@/context/AuthContext";
import {
  db,
} from "@/lib/firebase/config";
import {
  doc, getDoc, setDoc, updateDoc, collection, addDoc,
  query, orderBy, serverTimestamp, writeBatch, getDocs,
} from "firebase/firestore";
import { getAllTemplates, generateStrategyLegs } from "@/lib/options/strategies";
import { generatePayoffData, calculatePOP } from "@/lib/options/payoff";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_CAPITAL = 1_000_000; // ₹10 lakh

const INDICES = [
  { id: "NIFTY",      name: "NIFTY 50",     lotSize: 75,  step: 50,  color: "blue"   },
  { id: "BANKNIFTY",  name: "BANK NIFTY",   lotSize: 30,  step: 100, color: "violet" },
  { id: "FINNIFTY",   name: "FIN NIFTY",    lotSize: 65,  step: 50,  color: "emerald"},
  { id: "MIDCPNIFTY", name: "MIDCAP NIFTY", lotSize: 120, step: 25,  color: "amber"  },
  { id: "SENSEX",     name: "SENSEX",       lotSize: 20,  step: 100, color: "rose"   },
];

const COLOR_MAP = {
  blue:    { bg: "bg-blue-500/15",    border: "border-blue-500/30",    text: "text-blue-400"    },
  violet:  { bg: "bg-violet-500/15",  border: "border-violet-500/30",  text: "text-violet-400"  },
  emerald: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
  amber:   { bg: "bg-amber-500/15",   border: "border-amber-500/30",   text: "text-amber-400"   },
  rose:    { bg: "bg-rose-500/15",    border: "border-rose-500/30",    text: "text-rose-400"    },
};

const SENTIMENT_EMOJI = {
  "Bullish":                    "📈",
  "Bearish":                    "📉",
  "Moderately Bullish":         "↗️",
  "Moderately Bearish":         "↘️",
  "Volatile (Direction uncertain)": "⚡",
  "Volatile":                   "⚡",
  "Neutral / Low Volatility":   "🎯",
  "Neutral / Range-bound":      "〰️",
  "Neutral / Decreasing Volatility": "📐",
  "Neutral / Pinning":          "📌",
  "Mildly Bullish":             "↗️",
};

// ─── IST helpers ──────────────────────────────────────────────────────────────

function nowIST() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
}

function isMarketOpen() {
  const ist = nowIST();
  const day  = ist.getDay(); // 0=Sun 6=Sat
  if (day === 0 || day === 6) return false;
  const mins = ist.getHours() * 60 + ist.getMinutes();
  return mins >= 9 * 60 + 15 && mins <= 15 * 60 + 30;
}

function fmtIST(date) {
  if (!date) return "—";
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function fmtINR(n, digits = 0) {
  return `₹${Math.abs(n ?? 0).toLocaleString("en-IN", { maximumFractionDigits: digits })}`;
}

function sign(n) { return n >= 0 ? "+" : "−"; }

// ─── Payoff helpers ───────────────────────────────────────────────────────────

/** Days to expiry from an ISO date string (0 at expiry) */
function calcDTE(expiryStr) {
  if (!expiryStr) return 0;
  return Math.max(0, (new Date(expiryStr) - new Date()) / (1000 * 60 * 60 * 24));
}

/**
 * Map stored legs (entryPremium) → payoff-lib format (premium).
 * The payoff library expects `premium` field; stored positions use `entryPremium`.
 */
function toPayoffLegs(legs) {
  return (legs ?? []).map((l) => ({ ...l, premium: l.entryPremium ?? l.premium ?? 0 }));
}

/**
 * Compute payoff curve + key metrics for a set of priced legs.
 * Returns { data, maxProfit, maxLoss, breakevens, pop } or null on error.
 */
function computePayoff(legs, spotPrice, expiryStr) {
  if (!legs?.length || !spotPrice) return null;
  try {
    const dte    = calcDTE(expiryStr);
    const result = generatePayoffData(toPayoffLegs(legs), spotPrice, 10, 200, dte);
    const pop    = calculatePOP(result.data, spotPrice, dte);
    return { ...result, pop, dte };
  } catch { return null; }
}

// ─── Option-chain price lookup ────────────────────────────────────────────────

/** Extract LTP for a given strike and option type from a chain array */
function ltpFromChain(chain, strike, type) {
  const row = chain?.find((r) => r.strike === strike);
  if (!row) return null;
  return type === "CE" ? (row.ce?.ltp ?? null) : (row.pe?.ltp ?? null);
}

/**
 * Price the legs of a strategy using real chain data.
 * Returns { pricedLegs, netPremium, spotPrice } or null if chain unavailable.
 */
function priceLegs(rawLegs, chainData) {
  if (!chainData?.chain || !chainData.chain.length) return null;
  const pricedLegs = rawLegs.map((leg) => {
    const ltp = ltpFromChain(chainData.chain, leg.strike, leg.type);
    return { ...leg, entryPremium: ltp ?? leg.premium ?? 0, currentPremium: ltp ?? leg.premium ?? 0 };
  });
  const netPrem = pricedLegs.reduce((acc, l) => {
    const mult = l.action === "SELL" ? 1 : -1;
    return acc + mult * l.entryPremium * l.lots * l.lotSize;
  }, 0);
  return { pricedLegs, netPremium: Math.round(netPrem), spotPrice: chainData.spot };
}

/** Calculate unrealized P&L using fresh chain data */
function calcMTM(position, chainData) {
  if (!chainData?.chain || !position?.legs) return null;
  let mtm = 0;
  for (const leg of position.legs) {
    const currLTP = ltpFromChain(chainData.chain, leg.strike, leg.type);
    if (currLTP === null) return null;
    const mult = leg.action === "SELL" ? 1 : -1;
    // Profit = received at entry minus cost to close now
    mtm += mult * (leg.entryPremium - currLTP) * leg.lots * leg.lotSize;
  }
  return Math.round(mtm);
}

// ─── Page shell ───────────────────────────────────────────────────────────────

export default function PaperTradePage() {
  return (
    <ProtectedRoute>
      <PaperTradeContent />
    </ProtectedRoute>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

function PaperTradeContent() {
  const { currentUser } = useAuth();
  const templates = useMemo(() => getAllTemplates(), []);

  // ── Firestore state ───────────────────────────────────────────────────────
  const [profile, setProfile] = useState(null);
  const [trades,  setTrades]  = useState([]);

  // ── Form state ────────────────────────────────────────────────────────────
  const [selIndex,    setSelIndex]    = useState("NIFTY");
  const [selExpiry,   setSelExpiry]   = useState("");
  const [selStrategy, setSelStrategy] = useState("iron-condor");
  const [selLots,     setSelLots]     = useState(1);

  // ── Chain / pricing state ─────────────────────────────────────────────────
  const [expiries,     setExpiries]     = useState([]);
  const [expiriesErr,  setExpiriesErr]  = useState(false);
  const [previewChain, setPreviewChain] = useState(null); // for form preview
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewErr,   setPreviewErr]   = useState(null);

  // ── MTM state (open positions) ────────────────────────────────────────────
  const [mtmMap,     setMtmMap]     = useState({}); // posId → mtm value
  const [mtmUpdated, setMtmUpdated] = useState(null); // Date of last update
  const [mtmLoading, setMtmLoading] = useState(false);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [submitting,  setSubmitting]  = useState(false);
  const [closingId,   setClosingId]   = useState(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [istTime,     setIstTime]     = useState("");
  const [marketOpen,  setMarketOpen]  = useState(false);
  const [activeTab,   setActiveTab]   = useState("trade"); // trade | positions | history
  const [expandedPos, setExpandedPos] = useState(null);   // posId with chart expanded
  const [liveSpotMap, setLiveSpotMap] = useState({});     // posId → current spot price
  const [modal,       setModal]       = useState(null);   // AppModal state

  // ── Derived ───────────────────────────────────────────────────────────────
  const indexMeta     = useMemo(() => INDICES.find((i) => i.id === selIndex) ?? INDICES[0], [selIndex]);
  const openPositions = useMemo(() => trades.filter((t) => t.status === "OPEN"),   [trades]);
  const closedTrades  = useMemo(() => trades.filter((t) => t.status === "CLOSED"), [trades]);

  const winCount  = useMemo(() => closedTrades.filter((t) => (t.pnl ?? 0) >= 0).length, [closedTrades]);
  const lossCount = useMemo(() => closedTrades.filter((t) => (t.pnl ?? 0) < 0).length,  [closedTrades]);
  const winRate   = closedTrades.length ? Math.round((winCount / closedTrades.length) * 100) : null;
  const totalMTM  = useMemo(() => Object.values(mtmMap).reduce((s, v) => s + (v ?? 0), 0), [mtmMap]);

  const previewLegs = useMemo(() => {
    if (!previewChain) return null;
    const step = indexMeta.step;
    const atm  = Math.round((previewChain.spot ?? 24500) / step) * step;
    const raw  = generateStrategyLegs(selStrategy, atm).map((l) => ({
      ...l, lotSize: indexMeta.lotSize, lots: l.lots * selLots,
    }));
    return priceLegs(raw, previewChain);
  }, [previewChain, selStrategy, selLots, indexMeta]);

  // Payoff curve + metrics for the order preview panel
  const previewPayoff = useMemo(
    () => previewLegs?.pricedLegs
      ? computePayoff(previewLegs.pricedLegs, previewChain?.spot, selExpiry)
      : null,
    [previewLegs, previewChain, selExpiry]
  );

  // Payoff metrics for every open position (computed at entry values)
  const positionPayoffs = useMemo(() => {
    const map = {};
    for (const pos of openPositions) {
      map[pos.id] = computePayoff(pos.legs, pos.entrySpot, pos.expiry);
    }
    return map;
  }, [openPositions]);

  // ── IST clock ─────────────────────────────────────────────────────────────
  useEffect(() => {
    function tick() {
      const ist = nowIST();
      setIstTime(ist.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setMarketOpen(isMarketOpen());
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Firestore data loader (one-shot reads, no persistent listeners) ───────
  // Using getDoc/getDocs instead of onSnapshot avoids the Firestore
  // INTERNAL ASSERTION (ID: ca9 / ve:-1) caused by React StrictMode
  // rapidly subscribe → unsubscribe → subscribe on the same watch stream.
  const loadData = useCallback(async () => {
    if (!currentUser) return;
    const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      setProfile(profileSnap.data());
    } else {
      const init = { capital: INITIAL_CAPITAL, initialCapital: INITIAL_CAPITAL, realizedPnL: 0 };
      await setDoc(profileRef, init);
      setProfile(init);
    }
    const tradesRef = collection(db, "users", currentUser.uid, "paperTrades");
    const q = query(tradesRef, orderBy("createdAt", "desc"));
    const tradesSnap = await getDocs(q);
    setTrades(tradesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    loadData().catch((e) => { if (!cancelled) console.error("loadData failed", e); });
    return () => { cancelled = true; };
  }, [currentUser, loadData]);

  // ── Fetch expiry list when index changes ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setExpiries([]);
    setSelExpiry("");
    setPreviewChain(null);
    async function loadExpiries() {
      try {
        const res  = await fetch(`/api/expiries?symbol=${selIndex}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.expiries?.length) {
          setExpiries(data.expiries);
          setSelExpiry(data.expiries[0]);
          setExpiriesErr(false);
        } else {
          setExpiriesErr(true);
        }
      } catch {
        if (!cancelled) setExpiriesErr(true);
      }
    }
    loadExpiries().catch(() => {});
    return () => { cancelled = true; };
  }, [selIndex]);

  // ── Fetch chain preview when index + expiry changes ───────────────────────
  useEffect(() => {
    if (!selExpiry) return;
    let cancelled = false;
    setPreviewLoading(true);
    setPreviewErr(null);
    async function loadPreview() {
      try {
        const res  = await fetch(`/api/paper-trade/price?symbol=${selIndex}&expiry=${selExpiry}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.error) { setPreviewErr(data.error); setPreviewChain(null); }
        else             { setPreviewChain(data); }
      } catch {
        if (!cancelled) setPreviewErr("network_error");
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    }
    loadPreview().catch(() => {});
    return () => { cancelled = true; };
  }, [selIndex, selExpiry]);

  // ── Live MTM polling (every 60 s) for open positions ─────────────────────
  const refreshMTM = useCallback(async (positions) => {
    if (!positions.length) { setMtmMap({}); return; }
    setMtmLoading(true);
    const grouped = {};
    for (const pos of positions) {
      const key = `${pos.indexKey}_${pos.expiry}`;
      if (!grouped[key]) grouped[key] = { symbol: pos.indexKey, expiry: pos.expiry, positions: [] };
      grouped[key].positions.push(pos);
    }
    const newMtm = {};
    const newSpots = {};
    await Promise.allSettled(
      Object.values(grouped).map(async ({ symbol, expiry, positions: grpPos }) => {
        try {
          const res  = await fetch(`/api/paper-trade/price?symbol=${symbol}&expiry=${expiry}`);
          const data = await res.json();
          if (data.chain) {
            for (const pos of grpPos) {
              newMtm[pos.id]   = calcMTM(pos, data);
              if (data.spot) newSpots[pos.id] = data.spot;
            }
          }
        } catch { /* keep previous MTM for this group */ }
      })
    );
    setMtmMap((prev) => ({ ...prev, ...newMtm }));
    setLiveSpotMap((prev) => ({ ...prev, ...newSpots }));
    setMtmUpdated(new Date());
    setMtmLoading(false);
  }, []);

  // Trigger MTM on open positions change + interval
  useEffect(() => {
    if (!openPositions.length) { setMtmMap({}); return; }
    refreshMTM(openPositions);
    const id = setInterval(() => refreshMTM(openPositions), 60_000);
    return () => clearInterval(id);
  }, [openPositions, refreshMTM]);

  // ── Open a new position ───────────────────────────────────────────────────
  async function handleOpenPosition() {
    if (!currentUser || !previewLegs || submitting) return;
    if (!previewLegs.pricedLegs?.length) return;

    const { pricedLegs, netPremium: netPrem, spotPrice } = previewLegs;
    // Rough NSE margin: 15% of notional + net debit
    const notional  = spotPrice * indexMeta.lotSize * selLots;
    const margin    = Math.round(notional * 0.15 + Math.max(0, -netPrem));

    if (profile && (profile.capital - margin) < 0) {
      const shortfall = margin - profile.capital;
      setModal({
        type: "warning",
        title: "Insufficient Margin",
        message: `You need ${fmtINR(margin)} to place this trade, but your available capital is ${fmtINR(profile.capital)}. Try reducing the number of lots.`,
        details: [
          { label: "Required Margin",    value: fmtINR(margin),           highlight: "text-rose-400" },
          { label: "Available Capital",  value: fmtINR(profile.capital),  highlight: "text-white" },
          { label: "Shortfall",          value: fmtINR(shortfall),        highlight: "text-amber-400" },
        ],
        actions: [
          { label: "OK", onClick: () => setModal(null), variant: "primary" },
        ],
      });
      return;
    }

    setSubmitting(true);
    try {
      const template = templates.find((t) => t.key === selStrategy);
      const tradesRef = collection(db, "users", currentUser.uid, "paperTrades");
      await addDoc(tradesRef, {
        strategy:  template?.name || selStrategy,
        indexKey:  selIndex,
        indexName: indexMeta.name,
        expiry:    selExpiry,
        lots:      selLots,
        legs:      pricedLegs,
        entrySpot: spotPrice,
        entryPremium: netPrem,
        margin,
        status:    "OPEN",
        createdAt: serverTimestamp(),
      });

      const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
      await updateDoc(profileRef, {
        capital: (profile?.capital ?? INITIAL_CAPITAL) - margin + Math.max(0, netPrem),
      });

      await loadData();
      setActiveTab("positions");
    } catch (e) {
      console.error("Open position failed", e);
      setModal({
        type: "error",
        title: "Trade Failed",
        message: "Unable to place the paper trade. Please check your connection and try again.",
        actions: [{ label: "OK", onClick: () => setModal(null), variant: "primary" }],
      });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Square off a position ─────────────────────────────────────────────────
  async function handleClosePosition(posId) {
    if (!currentUser || closingId) return;
    const pos = trades.find((t) => t.id === posId && t.status === "OPEN");
    if (!pos) return;

    setClosingId(posId);
    try {
      // Fetch current prices
      const res  = await fetch(`/api/paper-trade/price?symbol=${pos.indexKey}&expiry=${pos.expiry}`);
      const data = await res.json();

      if (data.error || !data.chain) {
        const isDhanExpired = data.error === "auth_error";
        setModal({
          type: "warning",
          title: isDhanExpired ? "Dhan Token Expired" : "Live Prices Unavailable",
          message: isDhanExpired
            ? "Your Dhan API token has expired. Square-off requires real-time prices — update the token to continue."
            : "Could not fetch current option prices. Square-off requires live data to calculate your exact P&L.",
          actions: isDhanExpired
            ? [
                { label: "Cancel",        onClick: () => setModal(null), variant: "ghost" },
                { label: "Update Token →", onClick: () => { setModal(null); window.location.href = "/admin/dhan-token"; }, variant: "primary" },
              ]
            : [{ label: "OK", onClick: () => setModal(null), variant: "primary" }],
        });
        return;
      }

      // Build exit legs with current prices
      const exitLegs = pos.legs.map((leg) => ({
        ...leg,
        exitPremium: ltpFromChain(data.chain, leg.strike, leg.type) ?? leg.entryPremium,
      }));

      // P&L = Σ (entry - exit) * lots * lotSize for SELL  | (exit - entry) for BUY
      const pnl = Math.round(
        exitLegs.reduce((acc, l) => {
          const mult = l.action === "SELL" ? 1 : -1;
          return acc + mult * (l.entryPremium - l.exitPremium) * l.lots * l.lotSize;
        }, 0)
      );

      const exitSpot = data.spot ?? pos.entrySpot;

      const batch = writeBatch(db);

      const posRef = doc(db, "users", currentUser.uid, "paperTrades", posId);
      batch.update(posRef, {
        status:   "CLOSED",
        exitLegs,
        exitSpot,
        pnl,
        closedAt: serverTimestamp(),
      });

      const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
      batch.update(profileRef, {
        capital:     (profile?.capital ?? 0) + pos.margin + pnl - Math.max(0, pos.entryPremium),
        realizedPnL: (profile?.realizedPnL ?? 0) + pnl,
      });

      await batch.commit();
      await loadData();
    } catch (e) {
      console.error("Close position failed", e);
      setModal({
        type: "error",
        title: "Square-Off Failed",
        message: "Could not close the position. Please check your connection and try again.",
        actions: [{ label: "OK", onClick: () => setModal(null), variant: "primary" }],
      });
    } finally {
      setClosingId(null);
    }
  }

  // ── Reset account ─────────────────────────────────────────────────────────
  async function handleReset() {
    if (!currentUser) return;
    try {
      // Delete all trades
      const tradesRef = collection(db, "users", currentUser.uid, "paperTrades");
      const snap  = await getDocs(tradesRef);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));

      const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
      batch.set(profileRef, {
        capital: INITIAL_CAPITAL, initialCapital: INITIAL_CAPITAL, realizedPnL: 0,
      });
      await batch.commit();
      await loadData();
      setResetConfirm(false);
      setActiveTab("trade");
    } catch (e) {
      console.error("Reset failed", e);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const capPct = profile
    ? Math.round(((profile.capital - (profile.initialCapital ?? INITIAL_CAPITAL)) / (profile.initialCapital ?? INITIAL_CAPITAL)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#080C16]">
      <main className="pt-20 pb-20 px-4 md:px-6 max-w-7xl mx-auto">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 mt-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest ${
                marketOpen
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                  : "bg-slate-700/50 text-slate-400 border border-white/10"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                {marketOpen ? "Market Open" : "Market Closed"}
              </span>
              <span className="text-xs text-slate-500 font-mono">{istTime} IST</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Paper Trading</h1>
            <p className="text-sm text-slate-400 mt-0.5">Real option prices · All data saved to your account</p>
          </div>

          <div className="flex items-center gap-2">
            {openPositions.length > 0 && (
              <button
                onClick={() => refreshMTM(openPositions)}
                disabled={mtmLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${mtmLoading ? "animate-spin" : ""}`} />
                Refresh MTM
              </button>
            )}
            <button
              onClick={() => setResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 rounded-lg transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Account
            </button>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {/* Capital */}
          <div className="md:col-span-1 bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Wallet className="w-3 h-3" /> Available
            </p>
            <p className="text-xl font-black text-white tabular-nums">
              {profile ? fmtINR(profile.capital) : "—"}
            </p>
            {profile && (
              <p className={`text-xs font-semibold mt-0.5 ${capPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {sign(capPct)}{Math.abs(capPct)}% return
              </p>
            )}
          </div>

          {/* Realized P&L */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Realized P&amp;L
            </p>
            <p className={`text-xl font-black tabular-nums ${(profile?.realizedPnL ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {profile ? `${sign(profile.realizedPnL ?? 0)}${fmtINR(profile.realizedPnL ?? 0)}` : "—"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{closedTrades.length} trade{closedTrades.length !== 1 ? "s" : ""} closed</p>
          </div>

          {/* Unrealized MTM */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Activity className="w-3 h-3" /> Unrealized MTM
            </p>
            <p className={`text-xl font-black tabular-nums ${totalMTM >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {openPositions.length ? `${sign(totalMTM)}${fmtINR(totalMTM)}` : "—"}
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">
              {mtmUpdated ? `Updated ${mtmUpdated.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}` : "Awaiting data"}
            </p>
          </div>

          {/* Open / Win Rate */}
          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Open
            </p>
            <p className="text-xl font-black text-white">{openPositions.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">position{openPositions.length !== 1 ? "s" : ""}</p>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-xl p-4">
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" /> Win Rate
            </p>
            <p className={`text-xl font-black ${winRate !== null ? (winRate >= 50 ? "text-emerald-400" : "text-rose-400") : "text-slate-600"}`}>
              {winRate !== null ? `${winRate}%` : "—"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{winCount}W · {lossCount}L</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mb-5 bg-white/3 border border-white/8 rounded-xl p-1 w-fit">
          {[
            { id: "trade",     label: "New Trade",   icon: Plus        },
            { id: "positions", label: `Positions (${openPositions.length})`, icon: Activity },
            { id: "history",   label: "History",     icon: BookOpen    },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* ══════════════════ NEW TRADE TAB ══════════════════ */}
        {activeTab === "trade" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Left: form */}
            <div className="lg:col-span-2 space-y-5">

              {/* Market closed notice */}
              {!marketOpen && (
                <div className="flex items-start gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-amber-300 font-semibold">Market is closed (IST 9:15 – 15:30, Mon–Fri)</p>
                    <p className="text-amber-400/70 text-xs mt-0.5">Live option prices unavailable. You can still set up your strategy and execute when market opens.</p>
                  </div>
                </div>
              )}

              {/* Index selector */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Underlying</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {INDICES.map((idx) => {
                    const c = COLOR_MAP[idx.color];
                    const active = selIndex === idx.id;
                    return (
                      <button
                        key={idx.id}
                        onClick={() => setSelIndex(idx.id)}
                        className={`flex flex-col items-center py-3 px-2 rounded-xl border text-sm font-semibold transition-all ${
                          active ? `${c.bg} ${c.border} ${c.text}` : "bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span>{idx.name}</span>
                        <span className="text-[10px] font-normal opacity-60 mt-0.5">Lot {idx.lotSize}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expiry */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Expiry</p>
                {expiriesErr ? (
                  <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                    Could not fetch expiry dates from Dhan. Check your token at{" "}
                    <Link href="/admin/dhan-token" className="underline">Admin</Link>.
                  </p>
                ) : !expiries.length ? (
                  <div className="h-10 bg-white/5 animate-pulse rounded-xl" />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {expiries.map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setSelExpiry(exp)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                          selExpiry === exp
                            ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                            : "bg-white/3 border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Strategy selector */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Strategy</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setSelStrategy(t.key)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        selStrategy === t.key
                          ? "bg-blue-500/15 border-blue-500/40"
                          : "bg-white/3 border-white/8 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-base">{SENTIMENT_EMOJI[t.sentiment] || "📊"}</span>
                        <span className={`text-sm font-semibold ${selStrategy === t.key ? "text-blue-300" : "text-white"}`}>{t.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">{t.sentiment}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lots */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Lots <span className="normal-case text-slate-400 font-normal">(1 lot = {indexMeta.lotSize} qty)</span>
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelLots((l) => Math.max(1, l - 1))} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-lg">−</button>
                  <span className="text-2xl font-black text-white w-12 text-center tabular-nums">{selLots}</span>
                  <button onClick={() => setSelLots((l) => Math.min(50, l + 1))} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all text-lg">+</button>
                  <span className="text-sm text-slate-400">= {selLots * indexMeta.lotSize} units</span>
                </div>
              </div>
            </div>

            {/* Right: order preview + payoff */}
            <div className="lg:col-span-3 space-y-4">

              {/* ── Order preview card (sticky) ── */}
              <div className="bg-white/3 border border-white/10 rounded-2xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> Order Preview
                </p>

                {previewLoading ? (
                  <div className="space-y-2">
                    {[1,2,3,4].map((i) => <div key={i} className="h-8 bg-white/5 animate-pulse rounded-lg" />)}
                  </div>
                ) : previewErr ? (
                  <div className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    {previewErr === "auth_error"
                      ? <>Dhan token expired. <Link href="/admin/dhan-token" className="underline">Update here</Link>.</>
                      : "Live prices unavailable. Select index & expiry to preview."}
                  </div>
                ) : previewLegs ? (
                  <>
                    {/* Spot */}
                    <div className="flex justify-between text-sm mb-4 pb-3 border-b border-white/8">
                      <span className="text-slate-400">Spot (ATM ref)</span>
                      <span className="text-white font-bold tabular-nums">₹{previewLegs.spotPrice?.toLocaleString("en-IN")}</span>
                    </div>

                    {/* Legs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                      {previewLegs.pricedLegs.map((leg, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded font-bold ${leg.action === "SELL" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                              {leg.action}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${leg.type === "CE" ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"}`}>
                              {leg.type}
                            </span>
                            <span className="text-slate-300 font-mono font-semibold">{leg.strike}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-semibold tabular-nums">₹{leg.entryPremium?.toFixed(2)}</span>
                            <span className="text-slate-500 ml-1">× {leg.lots}L</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Net premium + Margin + Place button */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <div className={`flex-1 flex justify-between text-sm font-bold py-2.5 px-3 rounded-lg ${
                        previewLegs.netPremium >= 0
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        <span>{previewLegs.netPremium >= 0 ? "Net Credit" : "Net Debit"}</span>
                        <span className="tabular-nums">{fmtINR(previewLegs.netPremium)}</span>
                      </div>
                      <div className="flex-1 flex justify-between text-xs text-slate-400 bg-white/3 border border-white/10 rounded-lg px-3 py-2.5">
                        <span>Est. Margin</span>
                        <span className="text-white font-semibold tabular-nums">
                          {profile ? fmtINR(Math.round((previewLegs.spotPrice ?? 24500) * indexMeta.lotSize * selLots * 0.15 + Math.max(0, -previewLegs.netPremium))) : "—"}
                        </span>
                      </div>
                      <button
                        onClick={handleOpenPosition}
                        disabled={submitting || !previewLegs}
                        className="sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98] text-sm whitespace-nowrap"
                      >
                        {submitting
                          ? <><RefreshCw className="w-4 h-4 animate-spin" /> Placing…</>
                          : <><Plus className="w-4 h-4" /> Place Trade</>}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Select index &amp; expiry to see live pricing
                  </p>
                )}
              </div>

              {/* ── Trade metrics ── */}
              {previewPayoff && <TradeMetricsBar payoff={previewPayoff} />}

              {/* ── Payoff chart ── */}
              {previewPayoff?.data && (
                <PayoffChart
                  data={previewPayoff.data}
                  breakevens={previewPayoff.breakevens}
                  spotPrice={previewLegs?.spotPrice}
                />
              )}

              {/* ── Live Position Greeks ── */}
              {previewLegs?.pricedLegs?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" /> Live Position Greeks
                  </p>
                  <GreeksPanel legs={previewLegs.pricedLegs} spotPrice={previewLegs.spotPrice ?? 24500} />
                </div>
              )}

            </div>
          </div>
        )}

        {/* ══════════════════ POSITIONS TAB ══════════════════ */}
        {activeTab === "positions" && (
          <div>
            {!openPositions.length ? (
              <div className="text-center py-16 text-slate-500">
                <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold mb-1">No open positions</p>
                <p className="text-sm">Go to <button onClick={() => setActiveTab("trade")} className="text-blue-400 hover:underline">New Trade</button> to place your first paper trade.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {mtmUpdated && (
                  <p className="text-xs text-slate-600 text-right">
                    MTM updated at {mtmUpdated.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit" })} IST
                    {" · "}auto-refresh every 60s
                  </p>
                )}

                {openPositions.map((pos) => {
                  const mtm     = mtmMap[pos.id];
                  const c       = COLOR_MAP[INDICES.find((i) => i.id === pos.indexKey)?.color ?? "blue"];
                  const isSquaring = closingId === pos.id;

                  return (
                    <div key={pos.id} className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden hover:border-white/15 transition-colors">
                      {/* Position header */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-widest ${c.bg} ${c.border} border ${c.text}`}>
                            {pos.indexKey}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white/8 text-slate-300 border border-white/10">
                            {pos.expiry}
                          </span>
                          <h4 className="text-base font-bold text-white">{pos.strategy}</h4>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* MTM badge */}
                          {mtm !== null && mtm !== undefined ? (
                            <span className={`text-sm font-black tabular-nums px-3 py-1 rounded-lg ${
                              mtm >= 0
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/25"
                            }`}>
                              {sign(mtm)}{fmtINR(mtm)} MTM
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 animate-pulse">Fetching MTM…</span>
                          )}

                          <button
                            onClick={() => handleClosePosition(pos.id)}
                            disabled={!!closingId}
                            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/80 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-all active:scale-[0.97]"
                          >
                            {isSquaring ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                            {isSquaring ? "Closing…" : "Square Off"}
                          </button>
                        </div>
                      </div>

                      {/* Position details */}
                      <div className="px-5 py-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-[11px] text-slate-500 mb-0.5">Entry Spot</p>
                          <p className="font-semibold text-white tabular-nums">₹{pos.entrySpot?.toLocaleString("en-IN")}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 mb-0.5">Net {pos.entryPremium >= 0 ? "Credit" : "Debit"}</p>
                          <p className={`font-semibold tabular-nums ${pos.entryPremium >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {fmtINR(pos.entryPremium)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 mb-0.5">Margin Blocked</p>
                          <p className="font-semibold text-white tabular-nums">{fmtINR(pos.margin)}</p>
                        </div>
                        <div>
                          <p className="text-[11px] text-slate-500 mb-0.5">Entry Time</p>
                          <p className="font-semibold text-slate-300 text-xs">{fmtIST(pos.createdAt)}</p>
                        </div>
                      </div>

                      {/* Legs breakdown */}
                      <div className="px-5 pb-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {pos.legs?.map((leg, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2 text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${leg.action === "SELL" ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>{leg.action}</span>
                                <span className={`px-1.5 py-0.5 rounded font-bold ${leg.type === "CE" ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"}`}>{leg.type}</span>
                                <span className="text-slate-300 font-mono font-semibold">{leg.strike}</span>
                              </div>
                              <span className="text-slate-400 font-mono">
                                Entry ₹{leg.entryPremium?.toFixed(2)} · {leg.lots}L
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Trade metrics summary (always visible) */}
                      {positionPayoffs[pos.id] && (
                        <div className="px-5 pb-3">
                          <TradeMetricsBar payoff={positionPayoffs[pos.id]} compact />
                        </div>
                      )}

                      {/* Payoff chart toggle */}
                      <div className="px-5 pb-4">
                        <button
                          onClick={() => setExpandedPos(expandedPos === pos.id ? null : pos.id)}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          {expandedPos === pos.id ? "Hide Payoff Chart ▲" : "Show Payoff Chart ▼"}
                        </button>
                      </div>

                      {/* Expandable payoff chart + Greeks */}
                      {expandedPos === pos.id && positionPayoffs[pos.id] && (
                        <div className="border-t border-white/8 px-5 pt-4 pb-5 space-y-4">
                          <PayoffChart
                            data={positionPayoffs[pos.id].data}
                            breakevens={positionPayoffs[pos.id].breakevens}
                            spotPrice={pos.entrySpot}
                            liveSpot={liveSpotMap[pos.id] ?? undefined}
                          />
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <Zap className="w-3 h-3" /> Position Greeks
                            </p>
                            <GreeksPanel
                              legs={toPayoffLegs(pos.legs)}
                              spotPrice={liveSpotMap[pos.id] ?? pos.entrySpot ?? 24500}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ HISTORY TAB ══════════════════ */}
        {activeTab === "history" && (
          <div>
            {!closedTrades.length ? (
              <div className="text-center py-16 text-slate-500">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-base font-semibold">No closed trades yet</p>
              </div>
            ) : (
              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-white/3 border-b border-white/8">
                      <tr>
                        {["Strategy", "Index", "Expiry", "Entry Spot", "Exit Spot", "P&L", "Closed At"].map((h) => (
                          <th key={h} className="py-3 px-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {closedTrades.map((t) => (
                        <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-white">{t.strategy}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              COLOR_MAP[INDICES.find((i) => i.id === t.indexKey)?.color ?? "blue"].bg
                            } ${COLOR_MAP[INDICES.find((i) => i.id === t.indexKey)?.color ?? "blue"].text}`}>
                              {t.indexKey ?? t.index}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-xs font-mono">{t.expiry}</td>
                          <td className="py-3.5 px-4 text-slate-300 tabular-nums font-mono">₹{t.entrySpot?.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4 text-slate-300 tabular-nums font-mono">₹{t.exitSpot?.toLocaleString("en-IN")}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black tabular-nums ${
                              (t.pnl ?? 0) >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                            }`}>
                              {(t.pnl ?? 0) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {sign(t.pnl ?? 0)}{fmtINR(t.pnl ?? 0)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-xs">{fmtIST(t.closedAt)}</td>
                        </tr>
                      ))}
                    </tbody>

                    {/* Footer totals */}
                    <tfoot className="bg-white/3 border-t border-white/10">
                      <tr>
                        <td colSpan={5} className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Total Realized P&amp;L</td>
                        <td className="py-3 px-4">
                          <span className={`text-base font-black tabular-nums ${(profile?.realizedPnL ?? 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {sign(profile?.realizedPnL ?? 0)}{fmtINR(profile?.realizedPnL ?? 0)}
                          </span>
                        </td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════ APP MODAL ══════════════════ */}
        <AppModal modal={modal} onClose={() => setModal(null)} />

        {/* ══════════════════ RESET CONFIRM MODAL ══════════════════ */}
        {resetConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F1623] border border-white/15 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-rose-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Reset Paper Trading Account?</h3>
              <p className="text-sm text-slate-400 mb-6">
                This will permanently delete all your paper trades and reset your capital to <strong className="text-white">₹10,00,000</strong>. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
