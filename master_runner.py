#!/usr/bin/env python3
"""
master_runner.py - Autonomous Outreach Orchestrator
Connects to Supabase, counts emailed leads, and runs scrape_leads.py + agent_sender.js
in a loop until exactly 200 leads have been emailed.
"""

import os
import sys
import time
import asyncio
import subprocess
import logging
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

try:
    import asyncpg
except ImportError:
    print("ERROR: asyncpg not installed. Run: pip install asyncpg python-dotenv")
    sys.exit(1)

# ─── Configuration ──────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL_POOLED") or os.getenv("DATABASE_URL")
TARGET_LEADS = 200
SLEEP_SECONDS = 60

# ─── Logging ────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("master_runner")

# ─── Database Operations ────────────────────────────────────────────────
async def count_valid_emailed_leads(dsn: str) -> int:
    """Count leads with valid email and status 'Emailed'."""
    pool = await asyncpg.create_pool(
        dsn,
        min_size=1,
        max_size=2,
        command_timeout=30,
        statement_cache_size=0,
    )
    try:
        async with pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT COUNT(DISTINCT l.id) FROM leads l
                JOIN email_logs el ON el.lead_id = l.id
                WHERE el.status = 'sent'
                  AND l.email IS NOT NULL
                  AND l.email != ''
                  AND l.email != 'no email'
                  AND l.email_status IN ('verified', 'risky')
            """)
            return row[0] if row else 0
    finally:
        await pool.close()

# ─── Runner Functions ───────────────────────────────────────────────────
def run_scrape_leads() -> int:
    """Run scrape_leads.py and return exit code."""
    logger.info("Running scrape_leads.py...")
    result = subprocess.run(
        [sys.executable, "scrape_leads.py"],
        capture_output=True,
        text=True,
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    if result.stdout:
        for line in result.stdout.strip().split('\n'):
            logger.info(f"[scrape_leads] {line}")
    if result.stderr:
        for line in result.stderr.strip().split('\n'):
            logger.error(f"[scrape_leads] {line}")
    return result.returncode

def run_agent_sender() -> int:
    """Run agent_sender.js and return exit code."""
    logger.info("Running agent_sender.js...")
    result = subprocess.run(
        ["node", "agent_sender.js"],
        capture_output=True,
        text=True,
        cwd=os.path.dirname(os.path.abspath(__file__))
    )
    if result.stdout:
        for line in result.stdout.strip().split('\n'):
            logger.info(f"[agent_sender] {line}")
    if result.stderr:
        for line in result.stderr.strip().split('\n'):
            logger.error(f"[agent_sender] {line}")
    return result.returncode

# ─── Main Loop ──────────────────────────────────────────────────────────
async def main():
    if not DATABASE_URL:
        logger.error("DATABASE_URL not set in environment")
        sys.exit(1)

    logger.info("=" * 60)
    logger.info("MASTER RUNNER STARTED - Autonomous Outreach System")
    logger.info(f"Target: {TARGET_LEADS} valid leads, all emailed")
    logger.info("=" * 60)

    cycle = 0

    while True:
        cycle += 1
        logger.info(f"\n--- Cycle {cycle} ---")

        # Count current emailed leads
        emailed_count = await count_valid_emailed_leads(DATABASE_URL)
        logger.info(f"Current valid emailed leads: {emailed_count}/{TARGET_LEADS}")

        if emailed_count >= TARGET_LEADS:
            logger.info("🎉 TARGET REACHED: 200 Emails Sent!")
            break

        # Step 1: Run scraper to find more valid leads
        logger.info("Running scrape_leads.py to find new valid leads...")
        scrape_exit = run_scrape_leads()
        if scrape_exit != 0:
            logger.warning(f"scrape_leads.py exited with code {scrape_exit}")

        # Step 2: Run sender to email new leads
        logger.info("Running agent_sender.js to email new leads...")
        sender_exit = run_agent_sender()
        if sender_exit != 0:
            logger.warning(f"agent_sender.js exited with code {sender_exit}")

        # Step 3: Wait 60 seconds before next cycle
        logger.info(f"Sleeping for {SLEEP_SECONDS} seconds...")
        time.sleep(SLEEP_SECONDS)

    logger.info("=" * 60)
    logger.info("MASTER RUNNER COMPLETE")
    logger.info("=" * 60)

if __name__ == "__main__":
    asyncio.run(main())