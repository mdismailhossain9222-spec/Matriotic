#!/usr/bin/env python3
"""
Custom Lead Scraper - Finds businesses with valid emails and inserts into Supabase.
Skips any business without a valid email address.
"""

import os
import asyncio
import asyncpg
import httpx
import random
import re
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# ─── Configuration ──────────────────────────────────────────────────────
DATABASE_URL = os.getenv("DATABASE_URL_POOLED") or os.getenv("DATABASE_URL")
TARGET_LEADS = 200

# Search configuration
SEARCH_QUERIES = [
    'site:linkedin.com/in "VP Marketing" "SaaS"',
    'site:linkedin.com/in "Head of Growth" "SaaS"',
    'site:linkedin.com/in "CMO" "SaaS"',
    'site:linkedin.com/in "Director of Marketing" "SaaS"',
    'site:linkedin.com/in "VP Product" "SaaS"',
    'site:linkedin.com/in "Head of Digital" "SaaS"',
    'site:linkedin.com/in "Founder" "SaaS"',
    'site:linkedin.com/in "CEO" "SaaS"',
]

USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
]

EMAIL_REGEX = re.compile(r'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
EMAIL_FINDER_REGEX = re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}')

# ─── Logging ────────────────────────────────────────────────────────────
import logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("scrape_leads")

# ─── Supabase Database ─────────────────────────────────────────────────
class SupabaseDB:
    def __init__(self, dsn: str):
        self.dsn = dsn
        self.pool = None

    async def connect(self):
        self.pool = await asyncpg.create_pool(
            self.dsn,
            min_size=2,
            max_size=10,
            command_timeout=30,
            statement_cache_size=0,
        )
        logger.info("Connected to Supabase")

    async def close(self):
        if self.pool:
            await self.pool.close()
            logger.info("Closed Supabase connection")

    async def count_valid_emailed_leads(self) -> int:
        """Count leads with valid email and status 'Emailed'."""
        async with self.pool.acquire() as conn:
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

    async def count_valid_new_leads(self) -> int:
        """Count new leads with valid email ready to email."""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("""
                SELECT COUNT(*) FROM leads
                WHERE status = 'New'
                  AND email IS NOT NULL
                  AND email != ''
                  AND email != 'no email'
                  AND email_status IN ('verified', 'risky')
            """)
            return row[0] if row else 0

    async def lead_exists(self, email: str) -> bool:
        """Check if lead with this email already exists."""
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("SELECT id FROM leads WHERE email = $1", email.lower())
            return row is not None

    async def insert_lead(self, lead: dict) -> int | None:
        """Insert a lead if email is valid. Returns lead ID or None if skipped."""
        email = (lead.get("email") or "").strip().lower()
        if not email or email == "no email":
            return None
        if not EMAIL_REGEX.match(email):
            return None

        # Check if already exists
        if await self.lead_exists(email):
            return None

        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("""
                INSERT INTO leads (
                    email, first_name, last_name, company, title, phone, linkedin_url,
                    status, email_status, source, source_url, personalization_notes, score
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id
            """,
                email,
                lead.get("first_name", "") or "",
                lead.get("last_name", "") or "",
                lead.get("company", "") or "",
                lead.get("title", "") or "",
                lead.get("phone", "") or "",
                lead.get("linkedin_url", "") or "",
                "New",
                lead.get("email_status", "verified") or "verified",
                lead.get("source", "scraper") or "scraper",
                lead.get("source_url", "") or "",
                lead.get("personalization_notes", "") or "",
                lead.get("score", 0) or 0,
            )
            return row["id"] if row else None

    async def update_lead_status(self, lead_id: int, status: str):
        async with self.pool.acquire() as conn:
            await conn.execute("""
                UPDATE leads SET status = $1, updated_at = NOW() WHERE id = $2
            """, status, lead_id)

    async def insert_email_log(self, log: dict) -> int:
        async with self.pool.acquire() as conn:
            row = await conn.fetchrow("""
                INSERT INTO email_logs (
                    lead_id, campaign_id, step, kind, to_email, subject, body,
                    status, provider, message_id, error, sent_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id
            """,
                log.get("lead_id"),
                log.get("campaign_id"),
                log.get("step", 1),
                log.get("kind", "sequence"),
                log["to_email"],
                log["subject"],
                log["body"],
                log.get("status", "pending"),
                log.get("provider"),
                log.get("message_id"),
                log.get("error"),
                log.get("sent_at"),
            )
            return row["id"] if row else 0


# ─── Email Finder ──────────────────────────────────────────────────────
async def find_email_on_page(url: str, first_name: str, last_name: str, domain: str) -> str | None:
    """Try to find email on a company page."""
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            headers = {"User-Agent": random.choice(USER_AGENTS)}
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return None

            # Look for email patterns
            emails = EMAIL_FINDER_REGEX.findall(resp.text)
            for email in emails:
                email = email.lower()
                if domain in email:
                    # Check if it matches the person's name pattern
                    local = email.split("@")[0]
                    fn = first_name.lower()
                    ln = last_name.lower()
                    if fn in local or ln in local or (fn[0] in local and ln[0] in local):
                        return email
    except Exception as e:
        logger.debug(f"Error finding email on {url}: {e}")
    return None


async def verify_email_smtp(email: str) -> bool | None:
    """Basic SMTP verification (best effort)."""
    try:
        import aiosmtplib
        import dns.resolver

        domain = email.split("@")[1]
        answers = await asyncio.get_event_loop().run_in_executor(
            None, lambda: dns.resolver.resolve(domain, "MX")
        )
        mx_host = str(sorted(answers, key=lambda x: x.preference)[0].exchange).rstrip(".")

        smtp = aiosmtplib.SMTP(hostname=mx_host, port=25, timeout=10)
        await smtp.connect()
        await smtp.ehlo()
        await smtp.mail("verify@example.com")
        code, _ = await smtp.rcpt(email)
        await smtp.quit()
        return code == 250
    except Exception:
        return None


async def generate_email_from_pattern(first_name: str, last_name: str, domain: str) -> list[str]:
    """Generate likely email patterns."""
    fn = first_name.lower().replace(".", "").replace("-", "")
    ln = last_name.lower().replace(".", "").replace("-", "")
    fi = fn[0] if fn else ""
    li = ln[0] if ln else ""

    patterns = [
        f"{fn}.{ln}@{domain}",
        f"{fn}{ln}@{domain}",
        f"{fi}{ln}@{domain}",
        f"{fn}@{domain}",
        f"{fi}.{ln}@{domain}",
        f"{fn}_{ln}@{domain}",
        f"{ln}@{domain}",
        f"{ln}.{fn}@{domain}",
        f"{fn}-{ln}@{domain}",
        f"{ln}{fi}@{domain}",
    ]
    return [e for e in patterns if EMAIL_REGEX.match(e)]


async def find_best_email(first_name: str, last_name: str, domain: str, linkedin_url: str = "") -> tuple[str, str] | None:
    """Find the best email for a person. Returns (email, status) or None."""
    if not first_name or not last_name or not domain:
        return None

    # Try to find on LinkedIn profile page
    if linkedin_url:
        email = await find_email_on_page(linkedin_url, first_name, last_name, domain)
        if email:
            verified = await verify_email_smtp(email)
            status = "verified" if verified else "risky"
            return (email, status)

    # Try company website
    company_urls = [f"https://{domain}", f"https://www.{domain}"]
    for url in company_urls:
        email = await find_email_on_page(url, first_name, last_name, domain)
        if email:
            verified = await verify_email_smtp(email)
            status = "verified" if verified else "risky"
            return (email, status)

    # Generate from common patterns and verify
    candidates = await generate_email_from_pattern(first_name, last_name, domain)
    for candidate in candidates[:5]:  # Try top 5
        verified = await verify_email_smtp(candidate)
        if verified:
            return (candidate, "verified")
        elif verified is False:
            continue
        else:
            # Can't verify, return as risky
            return (candidate, "risky")

    return None


# ─── Search Functions ──────────────────────────────────────────────────
async def search_duckduckgo(query: str) -> list[tuple[str, str]]:
    """Search via DuckDuckGo HTML."""
    url = f"https://html.duckduckgo.com/html/?q={httpx.QueryParams({'q': query})}"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            headers = {"User-Agent": random.choice(USER_AGENTS)}
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []
    except Exception:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    results = []
    for result in soup.select(".result"):
        link = result.select_one(".result__a")
        snippet_el = result.select_one(".result__snippet")
        if not (link and link.get("href")):
            continue
        href = link.get("href")
        if "uddg=" in href:
            try:
                from urllib.parse import parse_qs, urlparse
                params = parse_qs(urlparse(href).query)
                real = params.get("uddg", [])
                if real:
                    href = real[0]
            except Exception:
                pass
        snippet = snippet_el.get_text().strip() if snippet_el else ""
        if href.startswith("http"):
            results.append((href, snippet))
    return results[:10]


async def search_bing(query: str) -> list[tuple[str, str]]:
    """Search via Bing HTML."""
    url = f"https://www.bing.com/search?q={httpx.QueryParams({'q': query})}&count=20"
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            headers = {"User-Agent": random.choice(USER_AGENTS)}
            resp = await client.get(url, headers=headers)
            if resp.status_code != 200:
                return []
    except Exception:
        return []

    soup = BeautifulSoup(resp.text, "html.parser")
    results = []
    for item in soup.select("li.b_algo"):
        link = item.select_one("h2 a")
        snippet_el = item.select_one(".b_caption p")
        if not (link and link.get("href")):
            continue
        href = link.get("href")
        snippet = snippet_el.get_text().strip() if snippet_el else ""
        if href.startswith("http"):
            results.append((href, snippet))
    return results[:10]


async def parse_linkedin_profile(url: str, snippet: str) -> dict | None:
    """Parse LinkedIn profile URL and snippet to extract name."""
    # From snippet
    if snippet:
        match = re.match(r"^\s*([A-Z][a-z]+)\s+([A-Z][a-z'\-]+)", snippet.strip())
        if match:
            return {"first_name": match.group(1), "last_name": match.group(2), "linkedin_url": url}

    # From URL slug
    match = re.search(r"/in/([\w][\w-]+)", url)
    if match:
        slug = match.group(1)
        slug = re.sub(r"-[0-9a-f]{4,}$", "", slug)
        slug = re.sub(r"-\d+$", "", slug)
        parts = [p for p in slug.split("-") if p]
        parts = [p for p in parts if not p.isdigit()]
        if len(parts) >= 2:
            return {
                "first_name": parts[0].title(),
                "last_name": " ".join(p.title() for p in parts[1:]),
                "linkedin_url": url
            }
    return None


async def guess_domain_from_company(company_name: str) -> str | None:
    """Guess company domain from name."""
    if not company_name:
        return None
    name = company_name.lower().strip()
    for suffix in [" inc", " llc", " ltd", " corp", " co", " group", " incorporated", " limited", " company"]:
        if name.endswith(suffix):
            name = name[: -len(suffix)]
    name = re.sub(r"[^a-z0-9]", "", name)
    if not name:
        return None

    for tld in [".com", ".io", ".co"]:
        domain = f"{name}{tld}"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.head(f"https://{domain}", follow_redirects=True)
                if resp.status_code < 400:
                    return domain
        except Exception:
            continue
    return ""


# ─── Main Scraper Logic ────────────────────────────────────────────────
async def run_scraper_cycle(db: SupabaseDB) -> int:
    """Run one scraper cycle to find and save new leads."""
    logger.info("Starting scraper cycle...")
    leads_added = 0

    # Check current count
    emailed_count = await db.count_valid_emailed_leads()
    if emailed_count >= TARGET_LEADS:
        logger.info(f"Target reached: {emailed_count}/{TARGET_LEADS}")
        return 0

    needed = TARGET_LEADS - emailed_count
    logger.info(f"Need {needed} more emailed leads")

    for query in SEARCH_QUERIES:
        if leads_added >= needed:
            break

        logger.info(f"Searching: {query}")

        # Try DuckDuckGo first
        results = await search_duckduckgo(query)
        if not results:
            results = await search_bing(query)

        for url, snippet in results:
            if leads_added >= needed:
                break

            if "/in/" not in url:
                continue

            parsed = await parse_linkedin_profile(url, snippet)
            if not parsed:
                continue

            first_name = parsed["first_name"]
            last_name = parsed["last_name"]
            linkedin_url = parsed["linkedin_url"]

            # Extract company from snippet or guess
            company = ""
            title = ""
            if snippet:
                # Try to extract company from snippet
                for pattern in [r" at ([A-Z][A-Za-z0-9\s&\.]+)", r" - ([A-Z][A-Za-z0-9\s&\.]+)"]:
                    match = re.search(pattern, snippet)
                    if match:
                        company = match.group(1).strip()
                        break

            if not company:
                continue

            domain = await guess_domain_from_company(company)
            if not domain:
                continue

            # Find email
            email_result = await find_best_email(first_name, last_name, domain, linkedin_url)
            if not email_result:
                logger.debug(f"No valid email found for {first_name} {last_name} at {domain}")
                continue

            email, email_status = email_result

            # Insert lead
            lead_data = {
                "email": email,
                "first_name": first_name,
                "last_name": last_name,
                "company": company,
                "title": title or "Marketing Leader",
                "phone": "",
                "linkedin_url": linkedin_url,
                "email_status": email_status,
                "source": "linkedin_search",
                "source_url": linkedin_url,
                "personalization_notes": f"Found via LinkedIn search for {title}",
                "score": 80,
            }

            lead_id = await db.insert_lead(lead_data)
            if lead_id:
                leads_added += 1
                logger.info(f"Added lead: {email} at {company} ({email_status})")

    logger.info(f"Scraper cycle complete. Added {leads_added} new leads.")
    return leads_added


# ─── Main Entry Point ──────────────────────────────────────────────────
async def main():
    if not DATABASE_URL:
        logger.error("DATABASE_URL not set in environment")
        return 1

    db = SupabaseDB(DATABASE_URL)
    await db.connect()

    try:
        await run_scraper_cycle(db)
    finally:
        await db.close()

    return 0


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)