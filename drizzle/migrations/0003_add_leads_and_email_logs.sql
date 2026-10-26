-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(120),
    last_name VARCHAR(120),
    company VARCHAR(160),
    title VARCHAR(120),
    phone VARCHAR(64),
    linkedin_url VARCHAR(500),
    status VARCHAR(32) NOT NULL DEFAULT 'New',
    email_status VARCHAR(32) NOT NULL DEFAULT 'verified',
    source VARCHAR(64),
    source_url VARCHAR(500),
    personalization_notes TEXT,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for leads
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_company_idx ON leads(company);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads(created_at);

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    campaign_id INTEGER,
    step INTEGER NOT NULL DEFAULT 1,
    kind VARCHAR(32) NOT NULL DEFAULT 'sequence',
    to_email VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    provider VARCHAR(32),
    message_id VARCHAR(255),
    error TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for email_logs
CREATE INDEX IF NOT EXISTS email_logs_lead_idx ON email_logs(lead_id);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON email_logs(status);
CREATE INDEX IF NOT EXISTS email_logs_created_idx ON email_logs(created_at);

-- Enable Realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;

-- Enable Realtime for email_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE email_logs;