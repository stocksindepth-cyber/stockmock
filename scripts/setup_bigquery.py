"""
BigQuery Schema Setup for OptionsGyani
======================================
Creates the dataset and tables needed for the backtest engine.

Usage:
    pip install google-cloud-bigquery
    python scripts/setup_bigquery.py

Requires:
    GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
    OR run inside Google Cloud (ADC)
"""

from google.cloud import bigquery

PROJECT_ID = "optionsindepth"   # Your Firebase/GCP project
DATASET_ID = "optionsgyani"
LOCATION   = "asia-south1"      # Mumbai — closest to NSE

client = bigquery.Client(project=PROJECT_ID)


def create_dataset():
    dataset_ref = bigquery.Dataset(f"{PROJECT_ID}.{DATASET_ID}")
    dataset_ref.location = LOCATION
    dataset_ref.description = (
        "OptionsGyani — NSE historical options and spot price data "
        "sourced from official NSE Bhavcopy archives. "
        "Powers the real-data backtesting engine."
    )

    try:
        dataset = client.create_dataset(dataset_ref, exists_ok=True)
        print(f"✅ Dataset created/verified: {dataset.dataset_id}")
    except Exception as e:
        print(f"❌ Failed to create dataset: {e}")
        raise


def create_options_eod_table():
    """
    options_eod: NSE F&O Bhavcopy data — one row per (trade_date, underlying, expiry, strike, option_type).
    Partitioned by trade_date for cost-efficient querying.
    Clustered by (underlying, option_type) for fast strategy-level scans.
    """
    schema = [
        bigquery.SchemaField("trade_date",   "DATE",    mode="REQUIRED",  description="NSE trading date"),
        bigquery.SchemaField("underlying",   "STRING",  mode="REQUIRED",  description="NIFTY / BANKNIFTY / FINNIFTY etc."),
        bigquery.SchemaField("expiry_date",  "DATE",    mode="REQUIRED",  description="Option expiry date"),
        bigquery.SchemaField("strike",       "FLOAT64", mode="REQUIRED",  description="Strike price"),
        bigquery.SchemaField("option_type",  "STRING",  mode="REQUIRED",  description="CE or PE"),
        bigquery.SchemaField("open",         "FLOAT64", mode="NULLABLE",  description="Open price"),
        bigquery.SchemaField("high",         "FLOAT64", mode="NULLABLE",  description="Day high"),
        bigquery.SchemaField("low",          "FLOAT64", mode="NULLABLE",  description="Day low"),
        bigquery.SchemaField("close",        "FLOAT64", mode="NULLABLE",  description="Close price"),
        bigquery.SchemaField("ltp",          "FLOAT64", mode="NULLABLE",  description="Last traded price"),
        bigquery.SchemaField("settle_pr",    "FLOAT64", mode="NULLABLE",  description="NSE official settlement price (used on expiry day)"),
        bigquery.SchemaField("volume",       "INT64",   mode="NULLABLE",  description="Number of contracts traded"),
        bigquery.SchemaField("oi",           "INT64",   mode="NULLABLE",  description="Open interest (end of day)"),
        bigquery.SchemaField("oi_change",    "INT64",   mode="NULLABLE",  description="Change in OI from previous day"),
        bigquery.SchemaField("iv",           "FLOAT64", mode="NULLABLE",  description="Implied volatility (computed via Black-Scholes)"),
        bigquery.SchemaField("lot_size",     "INT64",   mode="NULLABLE",  description="NSE lot size for this contract"),
        bigquery.SchemaField("ingested_at",  "TIMESTAMP", mode="NULLABLE", description="Row ingestion timestamp"),
    ]

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.options_eod"
    table = bigquery.Table(table_ref, schema=schema)

    # Partition by trade_date — cuts query cost dramatically
    table.time_partitioning = bigquery.TimePartitioning(
        type_=bigquery.TimePartitioningType.DAY,
        field="trade_date",
        require_partition_filter=False,
    )

    # Cluster by most-queried columns
    table.clustering_fields = ["underlying", "option_type", "expiry_date"]

    table.description = (
        "NSE F&O EOD options data sourced from official Bhavcopy archives. "
        "Covers Nifty, BankNifty, FinNifty and liquid stock options from 2016 onwards. "
        "IV computed via Black-Scholes using NSE spot index prices."
    )

    try:
        table = client.create_table(table, exists_ok=True)
        print(f"✅ Table created/verified: {table.table_id}")
    except Exception as e:
        print(f"❌ Failed to create options_eod: {e}")
        raise


def create_spot_prices_table():
    """
    spot_prices: NSE index/underlying EOD closing prices.
    One row per (trade_date, underlying).
    """
    schema = [
        bigquery.SchemaField("trade_date",  "DATE",    mode="REQUIRED", description="NSE trading date"),
        bigquery.SchemaField("underlying",  "STRING",  mode="REQUIRED", description="NIFTY / BANKNIFTY / FINNIFTY etc."),
        bigquery.SchemaField("open",        "FLOAT64", mode="NULLABLE", description="Index open"),
        bigquery.SchemaField("high",        "FLOAT64", mode="NULLABLE", description="Index high"),
        bigquery.SchemaField("low",         "FLOAT64", mode="NULLABLE", description="Index low"),
        bigquery.SchemaField("close",       "FLOAT64", mode="REQUIRED", description="Index close (used as spot for strike calculation)"),
        bigquery.SchemaField("volume",      "INT64",   mode="NULLABLE", description="Total traded volume"),
        bigquery.SchemaField("ingested_at", "TIMESTAMP", mode="NULLABLE", description="Row ingestion timestamp"),
    ]

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.spot_prices"
    table = bigquery.Table(table_ref, schema=schema)

    table.time_partitioning = bigquery.TimePartitioning(
        type_=bigquery.TimePartitioningType.DAY,
        field="trade_date",
    )
    table.clustering_fields = ["underlying"]
    table.description = "NSE index EOD spot prices — used for ATM strike selection in backtesting."

    try:
        table = client.create_table(table, exists_ok=True)
        print(f"✅ Table created/verified: {table.table_id}")
    except Exception as e:
        print(f"❌ Failed to create spot_prices: {e}")
        raise


def create_ingestion_log_table():
    """
    ingestion_log: Tracks which bhavcopy dates have been successfully ingested.
    Used by the incremental ingestion script to avoid re-downloading.
    """
    schema = [
        bigquery.SchemaField("trade_date",   "DATE",    mode="REQUIRED"),
        bigquery.SchemaField("status",       "STRING",  mode="REQUIRED",  description="success / failed / skipped"),
        bigquery.SchemaField("rows_options", "INT64",   mode="NULLABLE",  description="Rows inserted into options_eod"),
        bigquery.SchemaField("rows_spot",    "INT64",   mode="NULLABLE",  description="Rows inserted into spot_prices"),
        bigquery.SchemaField("error_msg",    "STRING",  mode="NULLABLE"),
        bigquery.SchemaField("ingested_at",  "TIMESTAMP", mode="REQUIRED"),
    ]

    table_ref = f"{PROJECT_ID}.{DATASET_ID}.ingestion_log"
    table = bigquery.Table(table_ref, schema=schema)
    table.description = "Tracks Bhavcopy ingestion runs. Used for incremental daily updates."

    try:
        client.create_table(table, exists_ok=True)
        print(f"✅ Table created/verified: ingestion_log")
    except Exception as e:
        print(f"❌ Failed to create ingestion_log: {e}")
        raise


def verify_setup():
    print("\n📊 Verifying BigQuery setup...")
    tables = list(client.list_tables(f"{PROJECT_ID}.{DATASET_ID}"))
    print(f"   Found {len(tables)} tables in {DATASET_ID}:")
    for t in tables:
        print(f"   - {t.table_id}")
    print("\n✅ Setup complete. Run scripts/ingest_bhavcopy.py to start loading data.")


if __name__ == "__main__":
    print(f"🚀 Setting up BigQuery for OptionsGyani")
    print(f"   Project: {PROJECT_ID}")
    print(f"   Dataset: {DATASET_ID}")
    print(f"   Location: {LOCATION}\n")

    create_dataset()
    create_options_eod_table()
    create_spot_prices_table()
    create_ingestion_log_table()
    verify_setup()
