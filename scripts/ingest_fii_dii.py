#!/usr/bin/env python3
"""
Ingest NSE FII/DII cash-market trading activity → BigQuery.

NSE publishes the provisional FII/FPI and DII buy/sell/net figures (₹ crore) for
the latest trading day at:
    https://www.nseindia.com/api/fiidiiTradeReact

This endpoint only returns the most recent day, so we append it each run. Rows
are idempotent per (trade_date, category) — re-running the same day is a no-op.

Auth / env (same as ingest_bhavcopy.py):
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json   (preferred, set by CI)
    BIGQUERY_CREDENTIALS_JSON='{...}'                 (fallback)

Table: optionsindepth.optionsgyani.fii_dii_activity
"""
import os
import sys
import json
import time
import random
import logging
from datetime import datetime, date

import requests
from google.cloud import bigquery

logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)-8s %(message)s",
                    datefmt="%Y-%m-%d %H:%M:%S")
log = logging.getLogger("fii_dii")

PROJECT_ID = "optionsindepth"
DATASET_ID = "optionsgyani"
TABLE_ID = f"{PROJECT_ID}.{DATASET_ID}.fii_dii_activity"

FIIDII_URL = "https://www.nseindia.com/api/fiidiiTradeReact"

NSE_USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
]
NSE_HEADERS = {
    "Accept": "application/json,text/plain,*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://www.nseindia.com/reports/fii-dii",
    "Connection": "keep-alive",
}


def get_bq_client():
    creds_file = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")
    if creds_file and os.path.exists(creds_file):
        return bigquery.Client(project=PROJECT_ID)
    creds_json = os.environ.get("BIGQUERY_CREDENTIALS_JSON", "")
    if creds_json:
        from google.oauth2 import service_account
        info = json.loads(creds_json)
        if "private_key" in info:
            info["private_key"] = info["private_key"].replace("\\n", "\n")
        creds = service_account.Credentials.from_service_account_info(
            info, scopes=["https://www.googleapis.com/auth/bigquery"])
        return bigquery.Client(project=PROJECT_ID, credentials=creds)
    return bigquery.Client(project=PROJECT_ID)


def ensure_table(client):
    schema = [
        bigquery.SchemaField("trade_date", "DATE", mode="REQUIRED"),
        bigquery.SchemaField("category", "STRING", mode="REQUIRED"),   # FII/FPI | DII
        bigquery.SchemaField("segment", "STRING"),                     # cash
        bigquery.SchemaField("buy_value", "FLOAT"),                    # ₹ crore
        bigquery.SchemaField("sell_value", "FLOAT"),
        bigquery.SchemaField("net_value", "FLOAT"),
        bigquery.SchemaField("ingested_at", "TIMESTAMP"),
    ]
    try:
        client.get_table(TABLE_ID)
    except Exception:
        t = bigquery.Table(TABLE_ID, schema=schema)
        t.time_partitioning = bigquery.TimePartitioning(field="trade_date")
        t.clustering_fields = ["category"]
        client.create_table(t)
        log.info(f"Created table {TABLE_ID}")


def make_session():
    s = requests.Session()
    ua = random.choice(NSE_USER_AGENTS)
    for wu in ("https://www.nseindia.com/", "https://www.nseindia.com/reports/fii-dii"):
        try:
            s.get(wu, headers={**NSE_HEADERS, "User-Agent": ua}, timeout=15)
            time.sleep(0.6)
        except Exception:
            pass
    s.headers.update({**NSE_HEADERS, "User-Agent": ua})
    log.info(f"NSE session warmed — cookies: {list(s.cookies.keys())}")
    return s


def fetch_fii_dii(session):
    for attempt in range(4):
        try:
            r = session.get(FIIDII_URL, timeout=30)
            if r.status_code == 200:
                return r.json()
            log.warning(f"HTTP {r.status_code} on attempt {attempt+1}")
        except Exception as e:
            log.warning(f"fetch error attempt {attempt+1}: {e}")
        time.sleep(2 * (attempt + 1))
    raise RuntimeError("Could not fetch FII/DII data from NSE after retries")


def to_float(v):
    try:
        return float(str(v).replace(",", "").strip())
    except (ValueError, TypeError):
        return None


def parse_rows(payload):
    rows = []
    for item in payload:
        d = item.get("date")
        try:
            trade_date = datetime.strptime(d, "%d-%b-%Y").date()
        except (ValueError, TypeError):
            log.warning(f"skipping row with bad date: {d}")
            continue
        rows.append({
            "trade_date": trade_date.isoformat(),
            "category": item.get("category", "").strip(),
            "segment": "cash",
            "buy_value": to_float(item.get("buyValue")),
            "sell_value": to_float(item.get("sellValue")),
            "net_value": to_float(item.get("netValue")),
            "ingested_at": datetime.utcnow().isoformat() + "Z",
        })
    return rows


def upsert(client, rows):
    if not rows:
        log.warning("No rows to write.")
        return 0
    dates = sorted({r["trade_date"] for r in rows})
    # Idempotent: delete same (trade_date, category) then insert via a load job.
    date_list = ", ".join(f"'{d}'" for d in dates)
    try:
        client.query(
            f"DELETE FROM `{TABLE_ID}` WHERE trade_date IN ({date_list})"
        ).result()
    except Exception as e:
        # Table brand new / streaming buffer — safe to continue to load.
        log.info(f"pre-delete skipped: {e}")

    job = client.load_table_from_json(
        rows, TABLE_ID,
        job_config=bigquery.LoadJobConfig(write_disposition="WRITE_APPEND"),
    )
    job.result()
    if job.errors:
        log.error(f"load errors: {job.errors[:3]}")
        return 0
    return len(rows)


def main():
    client = get_bq_client()
    ensure_table(client)
    session = make_session()
    payload = fetch_fii_dii(session)
    rows = parse_rows(payload)
    for r in rows:
        log.info(f"  {r['trade_date']}  {r['category']:8s}  buy={r['buy_value']}  sell={r['sell_value']}  net={r['net_value']}")
    n = upsert(client, rows)
    log.info(f"✅ Wrote {n} FII/DII rows to {TABLE_ID}")
    if n == 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
