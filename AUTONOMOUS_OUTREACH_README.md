# Autonomous Outreach System - Matriotic Studios

A fully autonomous, self-running outreach system that scrapes 200 valid email leads and sends emails to them, with a live-updating dashboard.

## 🎯 System Overview

This system consists of:

1. **Harvey** - Autonomous AI sales agent (in `harvey/`) that:
   - Scouts for leads via web search, company websites, LinkedIn, job boards
   - Finds and verifies email addresses
   - Scores prospects against ICP
   - Sends personalized email sequences

2. **Master Runner** (`master_runner.py`) - Background orchestration script that:
   - Checks Supabase for current lead count
   - Runs Harvey's Scout if < 200 valid leads
   - Sends emails to new leads via Harvey's Sender
   - Loops every 2 minutes until 200 leads found AND all emailed

3. **Live Dashboard** (`/admin/live-dashboard`) - Real-time Next.js page with:
   - Supabase Realtime subscriptions on `leads` and `email_logs` tables
   - Live stats: valid leads, emailed leads, emails sent/failed/pending
   - Recent leads table with status, email verification status, score
   - Recent email activity table with delivery status
   - Updates instantly without browser refresh

## 📋 Prerequisites

- Python 3.11+
- Node.js 20+ (for Next.js dashboard)
- Supabase project with database
- Gmail/Workspace account for sending (with OAuth credentials)
- Email verification API key (Reoon, ZeroBounce, or Hunter)

## 🚀 Quick Start

### 1. Configure Environment

```bash
# Copy example env files and fill in your values
cp harvey/.env.example harvey/.env
# Edit harvey/.env with your API keys:
# - GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET
# - REOON_API_KEY (or ZEROBOUNCE_API_KEY)
# - HUNTER_API_KEY (optional)
# - SERPER_API_KEY (optional, for better search)
```

### 2. Set up Supabase Realtime

In your Supabase Dashboard:
1. Go to **Database → Replication**
2. Enable replication for `leads` and `email_logs` tables
3. Copy your Project URL and Anon Key to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### 3. Run Database Migration

```bash
# Apply the leads and email_logs tables
npx drizzle-kit migrate
# Or run the SQL directly:
# drizzle/migrations/0003_add_leads_and_email_logs.sql
```

### 4. Start the Next.js Dashboard

```bash
npm run dev
# Open http://localhost:3000/admin/live-dashboard
```

### 5. Start the Master Runner (Background)

**Option A: PowerShell (Windows)**
```powershell
.\run_master_runner.ps1
```

**Option B: Batch (Windows)**
```cmd
run_master_runner.bat
```

**Option C: Python launcher (cross-platform)**
```bash
python start_master_runner.py
# This runs it detached in the background
# Logs: master_runner.log
# To stop: python stop_master_runner.py
```

## 🔧 How It Works

### Master Runner Loop (every 2 minutes)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. COUNT: Check Supabase for valid leads (email_status       │
│    = verified/risky, not null/empty/"no email")              │
│ 2. COUNT: Check how many leads have been emailed (have       │
│    sent email_logs)                                          │
│ 3. STOP CONDITION: If valid >= 200 AND emailed >= 200 → DONE │
│ 4. SCOUT: If valid < 200, run Harvey Scout to find more      │
│ 5. EMAIL: If new leads exist, stage & send via Harvey Sender │
│ 6. SLEEP: Wait 2 minutes, repeat                             │
└─────────────────────────────────────────────────────────────┘
```

### Lead Validation Rules

A lead is **valid** only if:
- ✅ `email` is not NULL
- ✅ `email` is not empty string
- ✅ `email` is not "no email"
- ✅ `email_status` is "verified" or "risky" (never "guess" or "invalid")

### Email Sequence (3-step)

1. **Immediate**: Introduction + value prop + soft CTA
2. **Day 3**: Follow-up with specific ideas
3. **Day 7**: Final note, ask for referral if not right person

All emails include:
- Phone: `+88 01715 318771`
- Signature: `Ismail Hossain\nMatriotic Studios`

## 📊 Dashboard Features

The live dashboard at `/admin/live-dashboard` shows:

| Metric | Description |
|--------|-------------|
| **Total Leads** | All records in database |
| **Valid Leads** | Leads with verified/risky emails (target: 200) |
| **Ready to Email** | Status="New" + valid email |
| **Leads Emailed** | Leads with at least one sent email (target: 200) |
| **Emails Sent** | Successfully delivered emails |
| **Emails Failed** | Failed deliveries (check error) |
| **Pending Queue** | Emails waiting to send |

Tables update in real-time via Supabase Realtime - no refresh needed!

## 🛑 Stopping the System

```bash
# If using python launcher
python stop_master_runner.py

# Or manually find and kill the process
# Windows: Task Manager → python.exe
# Unix: pkill -f master_runner.py
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `master_runner.py` | Main orchestration loop |
| `start_master_runner.py` | Background launcher |
| `stop_master_runner.py` | Stop background process |
| `run_master_runner.ps1` | PowerShell runner (foreground) |
| `run_master_runner.bat` | Batch runner (foreground) |
| `harvey/harvey.yaml` | Harvey configuration (ICP, persona, etc.) |
| `harvey/.env` | Harvey API keys |
| `src/app/admin/live-dashboard/page.tsx` | Live dashboard UI |
| `drizzle/migrations/0003_add_leads_and_email_logs.sql` | DB migration |

## ⚙️ Configuration

### Harvey Config (`harvey/harvey.yaml`)

Key settings for autonomous operation:
```yaml
channels:
  email:
    enabled: true
    provider: "gmail"
    max_daily_sends: 50
    require_approval: false  # CRITICAL: autopilot mode
    send_to_risky: false
```

### ICP (Ideal Customer Profile)

Edit `harvey/harvey.yaml` → `icp` section to match your targets:
- Industries
- Company size
- Job titles
- Geography
- Hiring signals (strongest intent indicator)

## 🔍 Troubleshooting

### "No valid leads found"
- Check Scout is running: `harvey status` in harvey venv
- Verify search APIs: SERPER_API_KEY, DATAFORSEO credentials
- Check Harvey logs for errors

### "Emails not sending"
- Verify Gmail OAuth: `harvey gmail auth` then `harvey gmail test`
- Check `require_approval: false` in harvey.yaml
- Check daily send limit not exceeded

### "Dashboard not updating"
- Verify Supabase Realtime enabled for `leads` and `email_logs`
- Check browser console for connection errors
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY` are correct

### "Database connection failed"
- Check `DATABASE_URL` in harvey/.env matches Next.js app
- Ensure Supabase pooler allows connections
- Verify SSL mode (Supabase requires `rejectUnauthorized: false`)

## 📈 Monitoring

- **Log file**: `master_runner.log` (when using background launcher)
- **Harvey dashboard**: `harvey dashboard` (localhost:5555)
- **Next.js admin**: `/admin/live-dashboard` (real-time)
- **Supabase dashboard**: Table editor for `leads` and `email_logs`

## 🎉 Success Criteria

The system stops automatically when:
- ✅ 200 leads with verified/risky emails exist in Supabase
- ✅ All 200 leads have at least one email sent (logged in `email_logs`)

You'll see in the dashboard:
- "🎉 Goal reached! All 200 leads found and emailed."
- Progress bars at 100%
- Master Runner logs "GOAL REACHED" and exits

---

**Built for Matriotic Studios** — High-converting websites that grow revenue.