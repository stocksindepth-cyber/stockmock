"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { generateStrategyLegs, getAllTemplates } from "@/lib/options/strategies";
import { strategyPayoff, netPremium } from "@/lib/options/payoff";
import { Wallet, TrendingUp, TrendingDown, Clock, Plus, Play, ShieldAlert, Target } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DhanReferralBanner from "@/components/DhanReferralBanner";

// Firebase imports
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

const INITIAL_CAPITAL = 1000000; // ₹10 Lakh

const INDICES = [
  { id: "NIFTY", name: "NIFTY 50", lotSize: 25, defaultSpot: 22500, step: 50 },
  { id: "BANKNIFTY", name: "BANK NIFTY", lotSize: 15, defaultSpot: 48000, step: 100 },
  { id: "FINNIFTY", name: "FIN NIFTY", lotSize: 25, defaultSpot: 21500, step: 50 },
  { id: "SENSEX", name: "BSE SENSEX", lotSize: 10, defaultSpot: 74000, step: 100 },
  { id: "MIDCPNIFTY", name: "MIDCAP NIFTY", lotSize: 50, defaultSpot: 10800, step: 25 },
];

const EXPIRIES = ["Current Week", "Next Week", "Current Month", "Next Month"];

function generateRandomPriceMove(spot, volatility = 0.15) {
  const dailyVol = volatility / Math.sqrt(252);
  const z = (Math.random() + Math.random() + Math.random() + Math.random() + Math.random() + Math.random() - 3) / 1.7; // rough normal
  return Math.round(spot * (1 + dailyVol * z));
}

export default function PaperTradePage() {
  return (
    <ProtectedRoute>
      <PaperTradeContent />
    </ProtectedRoute>
  );
}

function PaperTradeContent() {
  const { currentUser } = useAuth();
  const templates = getAllTemplates();
  
  // Profile State
  const [profile, setProfile] = useState({ capital: INITIAL_CAPITAL, realizedPnL: 0 });
  const [trades, setTrades] = useState([]);
  
  // Form State
  const [selectedIndex, setSelectedIndex] = useState(INDICES[0].id);
  const [selectedExpiry, setSelectedExpiry] = useState(EXPIRIES[0]);
  const [selectedStrategy, setSelectedStrategy] = useState("iron-condor");
  const [spotPrice, setSpotPrice] = useState(INDICES[0].defaultSpot);
  const [lotsMulti, setLotsMulti] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Derived Index Meta
  const currentIndexMeta = useMemo(() => INDICES.find(i => i.id === selectedIndex) || INDICES[0], [selectedIndex]);

  useEffect(() => setMounted(true), []);

  // Update spot price format when index changes
  useEffect(() => {
    setSpotPrice(currentIndexMeta.defaultSpot);
  }, [currentIndexMeta]);

  // Firebase Listeners
  useEffect(() => {
    if (!currentUser) return;

    const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
    const unsubscribeProfile = onSnapshot(profileRef, async (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        // Initialize profile
        const initialProfile = { capital: INITIAL_CAPITAL, realizedPnL: 0 };
        await setDoc(profileRef, initialProfile);
        setProfile(initialProfile);
      }
    });

    const tradesRef = collection(db, "users", currentUser.uid, "paperTrades");
    const q = query(tradesRef, orderBy("createdAt", "desc"));
    const unsubscribeTrades = onSnapshot(q, (snapshot) => {
      const allTrades = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTrades(allTrades);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeTrades();
    };
  }, [currentUser]);

  const openPositions = useMemo(() => trades.filter(t => t.status === "OPEN"), [trades]);
  const closedTrades = useMemo(() => trades.filter(t => t.status === "CLOSED"), [trades]);

  const handleOpenPosition = async () => {
    if (!currentUser) return;
    
    // Nearest strike step based on index
    const step = currentIndexMeta.step;
    const atm = Math.round(spotPrice / step) * step;
    
    // Generate legs & forcefully override the lotSize
    const rawLegs = generateStrategyLegs(selectedStrategy, atm);
    const configuredLegs = rawLegs.map(leg => ({
      ...leg,
      lotSize: currentIndexMeta.lotSize,
      lots: leg.lots * lotsMulti
    }));

    const template = templates.find((t) => t.key === selectedStrategy);
    const premium = netPremium(configuredLegs);
    
    // Simplified SEBI Margin requirement
    const margin = Math.abs(premium) + (50000 * lotsMulti); 

    if (profile.capital < margin) {
      alert("Insufficient free capital to meet margin for this position.");
      return;
    }

    try {
      // 1. Add Open Position to Firestore
      const tradesRef = collection(db, "users", currentUser.uid, "paperTrades");
      await addDoc(tradesRef, {
        strategy: template?.name || selectedStrategy,
        index: currentIndexMeta.name,
        expiry: selectedExpiry,
        legs: configuredLegs,
        entrySpot: spotPrice,
        entryTime: new Date().toLocaleString(),
        premium,
        margin,
        status: "OPEN",
        createdAt: serverTimestamp()
      });

      // 2. Adjust capital format
      const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
      await updateDoc(profileRef, {
        capital: profile.capital + premium
      });
      
    } catch (e) {
      console.error("Failed to open position", e);
      alert("Error opening position. Please try again.");
    }
  };

  const handleClosePosition = async (posId) => {
    if (!currentUser) return;
    const pos = trades.find((p) => p.id === posId);
    if (!pos || pos.status !== "OPEN") return;

    // Simulate exit price based on entry spot
    const exitSpot = generateRandomPriceMove(pos.entrySpot);
    const pnl = strategyPayoff(exitSpot, pos.legs);

    try {
      const posRef = doc(db, "users", currentUser.uid, "paperTrades", posId);
      await updateDoc(posRef, {
        status: "CLOSED",
        exitSpot,
        exitTime: new Date().toLocaleString(),
        pnl,
        closedAt: serverTimestamp()
      });

      const finalCapitalDelta = pnl - pos.premium;

      const profileRef = doc(db, "users", currentUser.uid, "paperTradeProfile", "data");
      await updateDoc(profileRef, {
        capital: profile.capital + finalCapitalDelta,
        realizedPnL: profile.realizedPnL + pnl
      });
    } catch (e) {
      console.error("Failed to close position", e);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wide uppercase mb-3">
              <ShieldAlert className="w-4 h-4" /> Live Sync Active
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Paper Trading</h1>
            <p className="text-slate-400 font-medium">
              Validate Indian options strategies globally with real-time persistent tracking.
            </p>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-blue-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] group-hover:bg-blue-500/10 transition-all" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Wallet className="w-5 h-5 text-blue-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Free Capital</p>
            </div>
            <p className="text-3xl font-black text-white relative z-10 font-mono tracking-tight">₹{profile.capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-all" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Realized P&L</p>
            </div>
            <p className={`text-3xl font-black relative z-10 font-mono tracking-tight ${profile.realizedPnL >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {profile.realizedPnL >= 0 ? "+" : "-"}₹{Math.abs(profile.realizedPnL).toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] group-hover:bg-amber-500/10 transition-all" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Clock className="w-5 h-5 text-amber-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Open Positions</p>
            </div>
            <p className="text-3xl font-black text-white relative z-10 font-mono tracking-tight">{openPositions.length}</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-all" />
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <Target className="w-5 h-5 text-indigo-400" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Trades</p>
            </div>
            <p className="text-3xl font-black text-white relative z-10 font-mono tracking-tight">{closedTrades.length}</p>
          </div>
        </div>

        {/* New Position Engine */}
        <div className="glass-card rounded-3xl p-6 md:p-8 mb-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
          
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
            Indian Markets Execution Engine
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 relative z-10 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex justify-between">
                <span>Underlying</span>
                <span className="text-blue-400">Lot: {currentIndexMeta.lotSize}</span>
              </label>
              <select
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="w-full bg-[#0B0F19] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {INDICES.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            
            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Expiry Cycle</label>
              <select
                value={selectedExpiry}
                onChange={(e) => setSelectedExpiry(e.target.value)}
                className="w-full bg-[#0B0F19] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {EXPIRIES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Spot Base</label>
              <input
                type="number"
                value={spotPrice}
                onChange={(e) => setSpotPrice(Number(e.target.value))}
                className="w-full bg-[#0B0F19] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all tabular-nums"
                step={currentIndexMeta.step}
              />
            </div>
            
            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5 flex justify-between">
                <span>Lots</span>
                <span className="text-emerald-400">Qty: {lotsMulti * currentIndexMeta.lotSize}</span>
              </label>
              <input
                type="number"
                min="1"
                value={lotsMulti}
                onChange={(e) => setLotsMulti(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#0B0F19] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all tabular-nums"
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Algorithm Base</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full bg-[#0B0F19] border border-white/10 text-white px-4 py-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {templates.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
              </select>
            </div>

            <div className="col-span-2 lg:col-span-5 mt-4">
              <button
                onClick={handleOpenPosition}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-500/25 border border-blue-400/20"
              >
                <Plus className="w-5 h-5" /> Fire Order to Sandbox
              </button>
            </div>
          </div>
        </div>

        {/* Open Positions Board */}
        {openPositions.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Live Sandbox Positions</h3>
            <div className="grid gap-4">
              {openPositions.map((pos) => (
                <div key={pos.id} className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-500/20 hover:border-blue-500/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {pos.index}
                      </span>
                      <span className="px-2.5 py-1 bg-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                        {pos.expiry}
                      </span>
                      <h4 className="text-xl font-bold text-white">{pos.strategy}</h4>
                    </div>
                    
                    <p className="text-slate-400 font-medium mb-1">
                      Spot Executed: <strong className="text-slate-200">₹{pos.entrySpot.toLocaleString()}</strong> 
                      <span className="mx-2">•</span> 
                      {pos.legs.length} Active Legs
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="text-slate-500">{pos.entryTime}</span>
                      <span className={pos.premium >= 0 ? "text-emerald-400" : "text-rose-400"}>
                        {pos.premium >= 0 ? "Credit " : "Debit "}
                        ₹{Math.abs(pos.premium).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="shrink-0">
                    <button
                      onClick={() => handleClosePosition(pos.id)}
                      className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-900/20"
                    >
                      <Play className="w-4 h-4 rotate-90" /> Square Off
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Closed Trades Ledger */}
        {closedTrades.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Realized Ledger</h3>
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0B0F19] border-b border-white/10">
                    <tr>
                      <th className="py-4 px-6 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Asset & Strategy</th>
                      <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Entry Baseline</th>
                      <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Exit Settlement</th>
                      <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Realized P&L</th>
                      <th className="py-4 px-6 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {closedTrades.map((t) => (
                      <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="text-white font-bold">{t.index}</span>
                            <span className="text-xs text-slate-400 font-medium">{t.strategy}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-slate-300 tabular-nums">₹{t.entrySpot.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-medium text-slate-300 tabular-nums">₹{t.exitSpot.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${t.pnl >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                            {t.pnl >= 0 ? "+" : ""}₹{t.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-500 text-xs font-medium">{t.exitTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-5xl mx-auto">
          <DhanReferralBanner variant="card" context="paper-trade" />
        </div>
      </main>
    </div>
  );
}
