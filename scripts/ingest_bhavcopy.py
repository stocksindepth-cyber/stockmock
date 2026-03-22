"""
NSE Bhavcopy → BigQuery Ingestion Pipeline
============================================
Downloads NSE F&O Bhavcopy and index spot data, computes IV via Black-Scholes,
and uploads everything to BigQuery for the OptionsGyani backtesting engine.

Usage:
    pip install google-cloud-bigquery requests pandas numpy scipy python-dateutil

    # Full historical load (2016 to today) — run once, takes ~2-4 hours
    python scripts/ingest_bhavcopy.py --start 2016-01-01

    # Incremental update (yesterday only — ideal for daily cron)
    python scripts/ingest_bhavcopy.py --incremental

    # Specific date range
    python scripts/ingest_bhavcopy.py --start 2023-01-01 --end 2023-12-31

    # Dry run (download + parse but do NOT write to BigQuery)
    python scripts/ingest_bhavcopy.py --start 2024-01-01 --dry-run

Environment:
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
    OR
    BIGQUERY_CREDENTIALS_JSON='{"type":"service_account",...}'
"""

from __future__ import annotations

import argparse
import io
import json
import logging
import math
import os
import time
import zipfile
from datetime import date, datetime, timedelta

import numpy as np
import pandas as pd
import requests
from google.cloud import bigquery
from scipy.optimize import brentq

# ─── Configuration ────────────────────────────────────────────────────────────

PROJECT_ID = "optionsindepth"
DATASET_ID = "optionsgyani"

# NSE Bhavcopy URL patterns
# Pre-July 5 2024:
URL_OLD = "https://nsearchives.nseindia.com/content/historical/DERIVATIVES/{year}/{mon}/fo{dd}{MON}{yyyy}bhav.csv.zip"
# Post-July 8 2024 (new UDiFF format):
URL_NEW = "https://nsearchives.nseindia.com/content/fo/BhavCopy_NSE_FO_0_0_0_{ddmmyyyy}_F_0000.csv.zip"

# NSE Headers (required to avoid 403)
NSE_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.nseindia.com",
    "Connection": "keep-alive",
}

# Index symbols in Bhavcopy → our canonical names
UNDERLYING_MAP = {
    "NIFTY": "NIFTY",
    "BANKNIFTY": "BANKNIFTY",
    "FINNIFTY": "FINNIFTY",
    "MIDCPNIFTY": "MIDCPNIFTY",
    "SENSEX": "SENSEX",
    "BANKEX": "BANKEX",
}

# Current NSE lot sizes (approximation — precise lot sizes change periodically)
LOT_SIZES = {
    "NIFTY": 75,
    "BANKNIFTY": 30,
    "FINNIFTY": 65,
    "MIDCPNIFTY": 120,
    "SENSEX": 20,
    "BANKEX": 15,
}

# Risk-free rate (India 91-day T-bill, approximate)
RISK_FREE_RATE = 0.07

# Delay between NSE requests (seconds) — respect rate limits
REQUEST_DELAY_S = 1.5

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)


# ─── BigQuery Client ──────────────────────────────────────────────────────────

def get_bq_client():
    creds_json = os.environ.get("BIGQUERY_CREDENTIALS_JSON")
    if creds_json:
        from google.oauth2 import service_account
        creds = service_account.Credentials.from_service_account_info(
            json.loads(creds_json),
            scopes=["https://www.googleapis.com/auth/bigquery"],
        )
        return bigquery.Client(project=PROJECT_ID, credentials=creds)
    return bigquery.Client(project=PROJECT_ID)


# ─── Black-Scholes IV Computation ─────────────────────────────────────────────

def bs_price(S, K, T, r, sigma, opt_type):
    """Black-Scholes European option price."""
    if T <= 0 or sigma <= 0 or S <= 0 or K <= 0:
        return max(S - K, 0) if opt_type == "CE" else max(K - S, 0)
    d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)

    from scipy.stats import norm
    if opt_type == "CE":
        return S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
    else:
        return K * math.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)


def compute_iv(market_price, S, K, T, r, opt_type):
    """Compute implied volatility via Brent's method."""
    if T <= 0 or market_price <= 0 or S <= 0 or K <= 0:
        return None

    intrinsic = max(S - K, 0) if opt_type == "CE" else max(K - S, 0)
    if market_price <= intrinsic * 0.99:
        return None  # Price below intrinsic — arbitrage / illiquid

    try:
        iv = brentq(
            lambda s: bs_price(S, K, T, r, s, opt_type) - market_price,
            a=0.001,
            b=20.0,
            xtol=0.0001,
            maxiter=200,
        )
        if 0.001 <= iv <= 20.0:
            return round(iv, 6)
    except (ValueError, RuntimeError):
        pass
    return None


def compute_iv_batch(df, spot_map):
    """
    Vectorised IV computation for a bhavcopy DataFrame.
    spot_map: { "NIFTY": 22500.0, ... }
    """
    ivs = []
    today_str = df["trade_date"].iloc[0] if "trade_date" in df.columns else None

    for _, row in df.iterrows():
        underlying = row.get("underlying")
        S = spot_map.get(underlying)
        K = float(row.get("strike", 0))
        ltp = float(row.get("ltp", 0) or 0)
        opt_type = row.get("option_type", "CE")

        expiry_date = row.get("expiry_date")
        trade_date = row.get("trade_date")

        if S and K and ltp > 0 and expiry_date and trade_date:
            try:
                exp = datetime.strptime(str(expiry_date), "%Y-%m-%d").date()
                trd = datetime.strptime(str(trade_date), "%Y-%m-%d").date()
                T = max((exp - trd).days, 0) / 365.0
                iv = compute_iv(ltp, S, K, T, RISK_FREE_RATE, opt_type)
            except Exception:
                iv = None
        else:
            iv = None

        ivs.append(iv)

    df = df.copy()
    df["iv"] = ivs
    return df


# ─── NSE Data Download ────────────────────────────────────────────────────────

CUTOVER_DATE = date(2024, 7, 8)  # NSE switched to new UDiFF format

def build_bhavcopy_url(d: date) -> str:
    if d >= CUTOVER_DATE:
        return URL_NEW.format(ddmmyyyy=d.strftime("%d%m%Y"))
    else:
        months3 = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                   "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
        mon_abbr = months3[d.month - 1]
        return URL_OLD.format(
            year=d.year,
            mon=mon_abbr,
            dd=d.strftime("%d"),
            MON=mon_abbr,
            yyyy=d.year,
        )


def download_bhavcopy(d: date, session: requests.Session) -> pd.DataFrame | None:
    url = build_bhavcopy_url(d)
    try:
        resp = session.get(url, headers=NSE_HEADERS, timeout=30)
        if resp.status_code == 404:
            return None  # Holiday / no trading
        resp.raise_for_status()

        with zipfile.ZipFile(io.BytesIO(resp.content)) as z:
            csv_name = z.namelist()[0]
            with z.open(csv_name) as f:
                df = pd.read_csv(f)

        return df

    except requests.exceptions.HTTPError as e:
        if e.response and e.response.status_code == 404:
            return None
        log.warning(f"HTTP error for {d}: {e}")
        return None
    except Exception as e:
        log.warning(f"Download failed for {d}: {e}")
        return None


def parse_old_format(df: pd.DataFrame, trade_date: date) -> pd.DataFrame:
    """
    Parse pre-July 2024 NSE F&O Bhavcopy.
    Columns: INSTRUMENT,SYMBOL,EXPIRY_DT,STRIKE_PR,OPTION_TYP,OPEN,HIGH,LOW,CLOSE,
             SETTLE_PR,CONTRACTS,VAL_INLAKH,OPEN_INT,CHG_IN_OI,TIMESTAMP
    """
    # Keep only index options (OPTIDX instrument type)
    df = df[df["INSTRUMENT"].isin(["OPTIDX", "OPTSTK"])].copy()

    # Rename columns
    df = df.rename(columns={
        "SYMBOL":     "underlying",
        "EXPIRY_DT":  "expiry_date_raw",
        "STRIKE_PR":  "strike",
        "OPTION_TYP": "option_type",
        "OPEN":       "open",
        "HIGH":       "high",
        "LOW":        "low",
        "CLOSE":      "close",
        "SETTLE_PR":  "settle_pr",
        "CONTRACTS":  "volume",
        "OPEN_INT":   "oi",
        "CHG_IN_OI":  "oi_change",
    })

    df["trade_date"] = trade_date.strftime("%Y-%m-%d")
    df["ltp"] = df["close"]  # Bhavcopy close ≈ LTP for EOD

    # Parse expiry date: "28-DEC-2023" format
    df["expiry_date"] = pd.to_datetime(df["expiry_date_raw"], format="%d-%b-%Y", errors="coerce").dt.strftime("%Y-%m-%d")

    # Normalise option type: "CE"/"PE" only
    df["option_type"] = df["option_type"].str.strip().str.upper()
    df = df[df["option_type"].isin(["CE", "PE"])]

    # Filter to known underlyings
    df = df[df["underlying"].isin(UNDERLYING_MAP.keys())].copy()
    df["underlying"] = df["underlying"].map(UNDERLYING_MAP)

    return df


def parse_new_format(df: pd.DataFrame, trade_date: date) -> pd.DataFrame:
    """
    Parse post-July 2024 UDiFF format Bhavcopy.
    Columns may vary; adapt as needed.
    """
    # Normalise column names to uppercase
    df.columns = [c.strip().upper() for c in df.columns]

    # Keep index options
    instrument_col = next((c for c in df.columns if "INSTRUMENT" in c or "INSTTYPE" in c), None)
    if instrument_col:
        df = df[df[instrument_col].isin(["OPTIDX", "OPTSTK"])].copy()

    # Try to find columns (UDiFF schema may differ slightly)
    col_map = {}
    for col in df.columns:
        u = col.upper()
        if "SYMBOL" in u:            col_map[col] = "underlying"
        elif "EXPIRY" in u:          col_map[col] = "expiry_date_raw"
        elif "STRIKE" in u:          col_map[col] = "strike"
        elif "OPTIONTYPE" in u or ("OPTION" in u and "TYPE" in u): col_map[col] = "option_type"
        elif u == "OPEN":            col_map[col] = "open"
        elif u == "HIGH":            col_map[col] = "high"
        elif u == "LOW":             col_map[col] = "low"
        elif u == "CLOSE":           col_map[col] = "close"
        elif "SETTLE" in u:          col_map[col] = "settle_pr"
        elif "CONTRACT" in u or "VOLUME" in u: col_map[col] = "volume"
        elif "OPENINT" in u or "OI" in u and "CHG" not in u: col_map[col] = "oi"
        elif "CHG" in u and "OI" in u: col_map[col] = "oi_change"

    df = df.rename(columns=col_map)
    df["trade_date"] = trade_date.strftime("%Y-%m-%d")
    df["ltp"] = df.get("close", 0)

    if "expiry_date_raw" in df.columns:
        df["expiry_date"] = pd.to_datetime(df["expiry_date_raw"], errors="coerce").dt.strftime("%Y-%m-%d")

    if "option_type" in df.columns:
        df["option_type"] = df["option_type"].str.strip().str.upper()
        df = df[df["option_type"].isin(["CE", "PE"])]

    if "underlying" in df.columns:
        df = df[df["underlying"].isin(UNDERLYING_MAP.keys())].copy()
        df["underlying"] = df["underlying"].map(UNDERLYING_MAP)

    return df


def clean_options_df(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalise numeric types and add lot_size column.
    """
    numeric_cols = ["open", "high", "low", "close", "ltp", "settle_pr", "strike"]
    int_cols = ["volume", "oi", "oi_change"]

    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    for col in int_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0).astype("Int64")

    df["lot_size"] = df["underlying"].map(LOT_SIZES).fillna(0).astype("Int64")

    # Drop rows with no usable price data
    df = df.dropna(subset=["trade_date", "expiry_date", "strike", "option_type", "underlying"])
    df = df[df["expiry_date"].notna() & (df["expiry_date"] != "NaT")]

    # Remove clearly invalid prices
    if "ltp" in df.columns:
        df = df[(df["ltp"] >= 0) | df["ltp"].isna()]

    return df


# ─── NSE Index Spot Prices ────────────────────────────────────────────────────

# NSE publishes index data via API. We use multiple sources for resilience.
NSE_INDEX_API = "https://www.nseindia.com/api/historical/indicesHistory"

NSE_INDEX_NAMES = {
    "NIFTY":       "NIFTY 50",
    "BANKNIFTY":   "NIFTY BANK",
    "FINNIFTY":    "NIFTY FIN SERVICE",
    "MIDCPNIFTY":  "NIFTY MIDCAP SELECT",
    "SENSEX":      "S&P BSE SENSEX",
}

def fetch_spot_from_bhavcopy(options_df: pd.DataFrame) -> dict:
    """
    Derive approximate spot prices from ATM straddle in Bhavcopy.
    Uses the strike with highest combined CE+PE OI as a proxy for spot.
    This is a fallback — prefer real index data when available.
    """
    spot_map = {}
    for underlying in options_df["underlying"].unique():
        sub = options_df[options_df["underlying"] == underlying]
        # Near-dated expiry only
        if sub.empty:
            continue
        near_exp = sub["expiry_date"].min()
        sub = sub[sub["expiry_date"] == near_exp]

        # Pivot OI by strike
        oi_by_strike = sub.groupby("strike")["oi"].sum()
        if not oi_by_strike.empty:
            atm_strike = oi_by_strike.idxmax()
            spot_map[underlying] = float(atm_strike)

    return spot_map


# ─── BigQuery Upload ──────────────────────────────────────────────────────────

OPTIONS_FINAL_COLS = [
    "trade_date", "underlying", "expiry_date", "strike", "option_type",
    "open", "high", "low", "close", "ltp", "settle_pr",
    "volume", "oi", "oi_change", "iv", "lot_size", "ingested_at",
]

SPOT_FINAL_COLS = [
    "trade_date", "underlying", "close", "ingested_at",
]


_DATE_COLS = {"trade_date", "expiry_date"}
_TS_COLS = {"ingested_at"}


def _load_df_to_bq(client: bigquery.Client, df: pd.DataFrame, table_ref: str) -> list:
    """Load a DataFrame to BigQuery using a batch load job, with exponential-backoff retry on quota errors."""
    import time
    from google.api_core.exceptions import Forbidden, ResourceExhausted

    df = df.copy()
    # Convert string date columns to datetime.date so pyarrow maps them to BQ DATE
    for col in _DATE_COLS:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce").dt.date
    # Convert ISO timestamp strings to tz-aware datetime for BQ TIMESTAMP
    for col in _TS_COLS:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce", utc=True)

    max_attempts = 6
    for attempt in range(max_attempts):
        try:
            job_config = bigquery.LoadJobConfig(write_disposition="WRITE_APPEND")
            job = client.load_table_from_dataframe(df, table_ref, job_config=job_config)
            job.result()  # Wait for completion
            if job.errors:
                return job.errors
            return []
        except (Forbidden, ResourceExhausted) as e:
            wait = 2 ** attempt * 30  # 30s, 60s, 120s, 240s, 480s
            if attempt < max_attempts - 1:
                log.warning(f"  Quota error on attempt {attempt + 1}/{max_attempts}, retrying in {wait}s: {e}")
                time.sleep(wait)
            else:
                log.error(f"  Quota error after {max_attempts} attempts: {e}")
                raise


def upload_options(client: bigquery.Client, df: pd.DataFrame, dry_run=False) -> int:
    if df.empty:
        return 0

    df = df.copy()
    df["ingested_at"] = datetime.utcnow().isoformat()

    # Keep only final columns that exist
    cols = [c for c in OPTIONS_FINAL_COLS if c in df.columns]
    df = df[cols]

    if dry_run:
        log.info(f"  [DRY RUN] Would upload {len(df)} rows to options_eod")
        return len(df)

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.options_eod"
    errors = _load_df_to_bq(client, df, table_ref)
    if errors:
        log.error(f"  BigQuery insert errors: {errors[:3]}")
    return len(df)


def upload_spot(client: bigquery.Client, spot_map: dict, trade_date: date, dry_run=False) -> int:
    if not spot_map:
        return 0

    rows = [
        {
            "trade_date": trade_date.strftime("%Y-%m-%d"),
            "underlying": k,
            "close": float(v),
            "ingested_at": datetime.utcnow().isoformat(),
        }
        for k, v in spot_map.items()
    ]

    if dry_run:
        log.info(f"  [DRY RUN] Would upload {len(rows)} spot rows")
        return len(rows)

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.spot_prices"
    spot_df = pd.DataFrame(rows)
    errors = _load_df_to_bq(client, spot_df, table_ref)
    if errors:
        log.error(f"  BigQuery spot insert errors: {errors[:3]}")
    return len(rows)


def log_ingestion(client: bigquery.Client, trade_date: date, status: str,
                  rows_options=0, rows_spot=0, error_msg=None):
    """Write a single log row via streaming insert — avoids load-job quota (1,000/table/day)."""
    row = {
        "trade_date": trade_date.strftime("%Y-%m-%d"),
        "status": status,
        "rows_options": rows_options,
        "rows_spot": rows_spot,
        "error_msg": error_msg or "",
        "ingested_at": datetime.utcnow().isoformat() + "Z",
    }
    table_ref = f"{PROJECT_ID}.{DATASET_ID}.ingestion_log"
    errors = client.insert_rows_json(table_ref, [row])
    if errors:
        log.warning(f"  Log streaming insert errors: {errors}")


def get_already_ingested_dates(client: bigquery.Client) -> set:
    try:
        rows = client.query(
            f"SELECT trade_date FROM `{PROJECT_ID}.{DATASET_ID}.ingestion_log` WHERE status='success'"
        ).result()
        return {str(r.trade_date) for r in rows}
    except Exception:
        return set()


# ─── Main Ingestion Loop ──────────────────────────────────────────────────────

def process_date(d: date, session: requests.Session, bq_client: bigquery.Client,
                 dry_run=False, skip_check=False) -> dict:
    """Process a single trading date. Returns status dict."""

    date_str = d.strftime("%Y-%m-%d")
    log.info(f"Processing {date_str}...")

    # Download Bhavcopy
    raw_df = download_bhavcopy(d, session)
    time.sleep(REQUEST_DELAY_S)  # Respect NSE rate limits

    if raw_df is None:
        log.info(f"  No data for {date_str} (holiday or weekend)")
        return {"date": date_str, "status": "skipped", "reason": "no_file"}

    # Parse
    try:
        if d >= CUTOVER_DATE:
            parsed = parse_new_format(raw_df, d)
        else:
            parsed = parse_old_format(raw_df, d)
    except Exception as e:
        log.error(f"  Parse error for {date_str}: {e}")
        return {"date": date_str, "status": "failed", "error": str(e)}

    if parsed.empty:
        log.warning(f"  No index options found in bhavcopy for {date_str}")
        return {"date": date_str, "status": "skipped", "reason": "no_index_options"}

    # Clean
    cleaned = clean_options_df(parsed)

    # Derive spot prices from Bhavcopy (high-OI ATM proxy)
    spot_map = fetch_spot_from_bhavcopy(cleaned)

    # Compute IV
    cleaned = compute_iv_batch(cleaned, spot_map)

    # Upload
    rows_options = upload_options(bq_client, cleaned, dry_run=dry_run)
    rows_spot = upload_spot(bq_client, spot_map, d, dry_run=dry_run)

    if not dry_run:
        log_ingestion(bq_client, d, "success", rows_options, rows_spot)

    log.info(f"  ✅ {date_str}: {rows_options} option rows, {rows_spot} spot rows, IV computed")
    return {"date": date_str, "status": "success", "rows_options": rows_options, "rows_spot": rows_spot}


def run_ingestion(start: date, end: date, dry_run=False, incremental=False):
    log.info("=" * 60)
    log.info(f"  OptionsGyani — NSE Bhavcopy Ingestion Pipeline")
    log.info(f"  Range: {start} → {end}")
    log.info(f"  Dry run: {dry_run}")
    log.info("=" * 60)

    session = requests.Session()
    # Warm up the NSE session (required to set cookies)
    try:
        session.get("https://www.nseindia.com", headers=NSE_HEADERS, timeout=10)
        time.sleep(1)
    except Exception:
        pass

    bq_client = None if dry_run else get_bq_client()

    # Get already-ingested dates to skip
    already_done = set()
    if incremental and bq_client:
        already_done = get_already_ingested_dates(bq_client)
        log.info(f"  Skipping {len(already_done)} already-ingested dates")

    total_days = (end - start).days + 1
    processed = 0
    skipped = 0
    failed = 0

    current = start
    while current <= end:
        # Skip weekends
        if current.weekday() >= 5:
            current += timedelta(days=1)
            continue

        date_str = current.strftime("%Y-%m-%d")

        if date_str in already_done:
            log.debug(f"  Skipping {date_str} (already ingested)")
            current += timedelta(days=1)
            skipped += 1
            continue

        result = process_date(current, session, bq_client, dry_run=dry_run)

        if result["status"] == "success":
            processed += 1
        elif result["status"] == "failed":
            failed += 1
            if not dry_run and bq_client:
                log_ingestion(bq_client, current, "failed", error_msg=result.get("error"))
        else:
            skipped += 1

        current += timedelta(days=1)

    log.info("\n" + "=" * 60)
    log.info(f"  ✅ Ingestion complete")
    log.info(f"  Processed: {processed} | Skipped: {skipped} | Failed: {failed}")
    log.info("=" * 60)


# ─── Entry Point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="NSE Bhavcopy → BigQuery ingestion pipeline")
    parser.add_argument("--start", type=str, default=None, help="Start date YYYY-MM-DD (default: 2016-01-01)")
    parser.add_argument("--end",   type=str, default=None, help="End date YYYY-MM-DD (default: today)")
    parser.add_argument("--incremental", action="store_true", help="Skip dates already in ingestion_log")
    parser.add_argument("--dry-run",     action="store_true", help="Parse and log but do not write to BigQuery")
    args = parser.parse_args()

    # Defaults
    if args.incremental and not args.start:
        # Incremental: only process yesterday
        start_date = date.today() - timedelta(days=1)
    elif args.start:
        start_date = datetime.strptime(args.start, "%Y-%m-%d").date()
    else:
        start_date = date(2016, 1, 1)

    end_date = datetime.strptime(args.end, "%Y-%m-%d").date() if args.end else date.today()

    run_ingestion(start_date, end_date, dry_run=args.dry_run, incremental=args.incremental)
