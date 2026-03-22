import { whatAreOptionsContent } from "./content/what-are-options";
import { callVsPutContent } from "./content/call-vs-put";
import { moneynessContent } from "./content/moneyness";
import { optionsPricingContent } from "./content/options-pricing";
import { thetaDecayContent } from "./content/theta-decay";
import { vegaVolatilityContent } from "./content/vega-volatility";
import { indiaVixContent } from "./content/india-vix";
import { deltaGammaContent } from "./content/delta-gamma";
import { ironCondorContent } from "./content/iron-condor";
import { ironButterflyContent } from "./content/iron-butterfly";
import { shortStrangleContent } from "./content/short-strangle";
import { batmanSpreadContent } from "./content/batman-spread";
import { bullCallSpreadContent } from "./content/bull-call-spread";
import { bearPutSpreadContent } from "./content/bear-put-spread";
import { ratioSpreadsContent } from "./content/ratio-spreads";
import { positionSizingContent } from "./content/position-sizing";
import { stopLossesOptionsContent } from "./content/stop-losses-options";
import { backtestingGuideContent } from "./content/backtesting-guide";
import { MODULES_STRATEGIES_RISK } from "./guideModules2";
import { MODULES_BASICS_GREEKS } from "./guideModules1";

// We extract out the ones we have completely overwritten with Varsity-level 2500+ word content.
// For the others, we fall back to the thick content from the previous iterations until they also get their Varsity-level rewrites.

const { "what-are-options": _, "call-vs-put": __, "moneyness": ___m, "options-pricing": ____op, ...remainingBasics } = MODULES_BASICS_GREEKS;
const { "delta-gamma": ___, "theta-decay": _____td, "vega-volatility": ______v, "india-vix": _______iv, ...remainingGreeks } = remainingBasics;
const { "iron-condor": ____, "short-strangle": ________ss, "iron-butterfly": ________ib, "batman-spread": ________bs, "bull-call-spread": _______bcs, "bear-put-spread": _______bps, "ratio-spreads": ________rs, "position-sizing": ____ps, "stop-losses-options": _______slo, "backtesting-guide": _______btg, ...remainingStategies } = MODULES_STRATEGIES_RISK;

export const GUIDE_CONTENT = {
  // --- VARSITY LEVEL MASTERCLASSES ---
  "what-are-options": whatAreOptionsContent,
  "call-vs-put": callVsPutContent,
  "moneyness": moneynessContent,
  "options-pricing": optionsPricingContent,
  "theta-decay": thetaDecayContent,
  "vega-volatility": vegaVolatilityContent,
  "india-vix": indiaVixContent,
  "delta-gamma": deltaGammaContent,
  "iron-condor": ironCondorContent,
  "iron-butterfly": ironButterflyContent,
  "short-strangle": shortStrangleContent,
  "batman-spread": batmanSpreadContent,
  "bull-call-spread": bullCallSpreadContent,
  "bear-put-spread": bearPutSpreadContent,
  "ratio-spreads": ratioSpreadsContent,
  "position-sizing": positionSizingContent,
  "stop-losses-options": stopLossesOptionsContent,
  "backtesting-guide": backtestingGuideContent,
  
  // --- THICK CONTENT BACKUPS ---
  ...remainingGreeks,
  ...remainingStategies
};
