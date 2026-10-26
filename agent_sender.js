/**
 * agent_sender.js - Gmail OAuth Email Sender
 * Sends emails to 'New' leads with valid emails using Gmail OAuth
 * Updates lead status to 'Emailed' and logs to email_logs table
 */

require('dotenv').config();
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ─── Configuration ──────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_SENDER_EMAIL = process.env.GMAIL_SENDER_EMAIL;

const TARGET_LEADS = 200;
const BATCH_SIZE = 20; // Send up to 20 emails per run

// ─── Supabase Client ────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── Gmail OAuth Setup ──────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
  refresh_token: GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

// ─── Email Signature ────────────────────────────────────────────────────
const OUTREACH_PHONE = process.env.OUTREACH_PHONE_NUMBER || '+88 01715 318771';
const EMAIL_SIGNATURE = `
<br>
<br>
Very Respectfully,<br>
Ismail Hossain,<br>
Co-Founder & Head of Development<br>
<br>
<img src="https://matriotic.com/logo.png" alt="Matriotic Studios" style="max-width: 150px; height: auto;"><br>
<br>
${OUTREACH_PHONE}<br>
<a href="https://matriotic.com" target="_blank">matriotic.com</a>
`;

// ─── Email Templates ────────────────────────────────────────────────────
const EMAIL_TEMPLATES = [
  {
    subject: "Quick question about {{company}}'s website",
    body: `Hi {{first_name}},

I came across {{company}} and noticed you're leading {{title}} efforts. Most SaaS companies we talk to are spending significantly on ads but their website isn't converting that traffic into pipeline.

We're Matriotic Studios — we build high-converting websites for SaaS and B2B tech companies that actually turn visitors into revenue. No templates, custom-built for your specific conversion goals.

Would you be open to a brief conversation about what a conversion-focused rebuild could look like for {{company}}?

${EMAIL_SIGNATURE}`
  },
  {
    subject: "Website conversion for {{company}}",
    body: `Hi {{first_name}},

I've been following {{company}}'s growth and I imagine conversion optimization is top of mind for you as {{title}}.

We help SaaS companies like {{company}} build websites that don't just look good — they convert. Our clients typically see 30-50% increases in demo requests and trial signups after launch.

Curious if you've ever considered a full rebuild vs. ongoing CRO? Happy to share a quick case study relevant to your space.

${EMAIL_SIGNATURE}`
  },
  {
    subject: "SaaS website that converts — {{company}}",
    body: `Hi {{first_name}},

Quick note — I work with {{title}} leaders at SaaS companies who are frustrated that their website doesn't match the quality of their product.

Matriotic Studios builds custom, conversion-focused websites for companies like {{company}}. We're not a template shop — every project is strategy-first, custom development, and we stay on as a growth partner.

If you're ever evaluating your web presence, I'd love to show you what's possible.

${EMAIL_SIGNATURE}`
  }
];

// ─── Utility Functions ──────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pickTemplate() {
  return EMAIL_TEMPLATES[Math.floor(Math.random() * EMAIL_TEMPLATES.length)];
}

function renderTemplate(template, lead) {
  const subject = template.subject
    .replace('{{first_name}}', lead.first_name || 'there')
    .replace('{{company}}', lead.company || 'your company')
    .replace('{{title}}', lead.title || 'your role');

  const body = template.body
    .replace(/{{first_name}}/g, lead.first_name || 'there')
    .replace(/{{company}}/g, lead.company || 'your company')
    .replace(/{{title}}/g, lead.title || 'your role');

  return { subject, body };
}

function createMimeMessage(to, subject, body) {
  const message = [
    `To: ${to}`,
    `From: ${GMAIL_SENDER_EMAIL}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    body
  ].join('\n');

  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ─── Database Operations ────────────────────────────────────────────────
async function getNewLeadsWithValidEmail(limit = BATCH_SIZE) {
  const { data, error } = await supabase
    .from('leads')
    .select('id, email, first_name, last_name, company, title, phone, linkedin_url')
    .eq('status', 'New')
    .not('email', 'is', null)
    .neq('email', '')
    .neq('email', 'no email')
    .in('email_status', ['verified', 'risky'])
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

async function updateLeadStatus(leadId, status) {
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId);

  if (error) throw error;
}

async function insertEmailLog(log) {
  const { data, error } = await supabase
    .from('email_logs')
    .insert([{
      lead_id: log.lead_id,
      campaign_id: log.campaign_id || 'outreach-campaign-1',
      step: log.step || 1,
      kind: log.kind || 'sequence',
      to_email: log.to_email,
      subject: log.subject,
      body: log.body,
      status: log.status,
      provider: log.provider || 'gmail',
      message_id: log.message_id || null,
      error: log.error || null,
      sent_at: log.sent_at || new Date().toISOString()
    }])
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

async function countEmailedLeads() {
  const { count, error } = await supabase
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'Emailed')
    .not('email', 'is', null)
    .neq('email', '')
    .neq('email', 'no email')
    .in('email_status', ['verified', 'risky']);

  if (error) throw error;
  return count || 0;
}

async function sendEmailWithRetry(to, subject, body, maxRetries = 3) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const raw = createMimeMessage(to, subject, body);

      const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw }
      });

      return { success: true, messageId: response.data.id };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`[agent_sender] Attempt ${attempt + 1}/${maxRetries} failed for ${to}, retrying in ${delay}ms...`);
        await sleep(delay);
      } else {
        console.error(`[agent_sender] All ${maxRetries} attempts failed for ${to}:`, error.message);
      }
    }
  }
  return { success: false, error: lastError };
}

// ─── Main Sender Logic ──────────────────────────────────────────────────
async function runSenderCycle() {
  console.log('[agent_sender] Starting sender cycle...');

  const emailedCount = await countEmailedLeads();
  console.log(`[agent_sender] Currently emailed: ${emailedCount}/${TARGET_LEADS}`);

  if (emailedCount >= TARGET_LEADS) {
    console.log('[agent_sender] Target reached, no emails to send');
    return 0;
  }

  const leads = await getNewLeadsWithValidEmail(BATCH_SIZE);
  console.log(`[agent_sender] Found ${leads.length} new leads with valid emails to email`);

  if (leads.length === 0) {
    console.log('[agent_sender] No new leads to email');
    return 0;
  }

  let sentCount = 0;

  for (const lead of leads) {
    try {
      const template = pickTemplate();
      const { subject, body } = renderTemplate(template, lead);

      console.log(`[agent_sender] Sending to ${lead.email} (${lead.company})...`);

      const result = await sendEmailWithRetry(lead.email, subject, body);

      if (result.success) {
        // Update lead status
        await updateLeadStatus(lead.id, 'Emailed');

        // Log email
        await insertEmailLog({
          lead_id: lead.id,
          to_email: lead.email,
          subject,
          body,
          status: 'sent',
          message_id: result.messageId
        });

        sentCount++;
        console.log(`[agent_sender] ✓ Sent to ${lead.email} (message ID: ${result.messageId})`);
      } else {
        // Log failed email after all retries
        await insertEmailLog({
          lead_id: lead.id,
          to_email: lead.email,
          subject,
          body: result.error?.message || 'Unknown error',
          status: 'failed',
          error: result.error?.message || 'Unknown error'
        });
        console.error(`[agent_sender] ✗ Failed to send to ${lead.email} after ${maxRetries} retries`);
      }

      // Rate limiting - small delay between emails
      await sleep(2000);

    } catch (error) {
      console.error(`[agent_sender] ✗ Unexpected error for ${lead.email}:`, error.message);

      // Log failed email
      await insertEmailLog({
        lead_id: lead.id,
        to_email: lead.email,
        subject: 'FAILED',
        body: error.message,
        status: 'failed',
        error: error.message
      });
    }
  }

  console.log(`[agent_sender] Cycle complete. Sent ${sentCount} emails.`);
  return sentCount;
}

// ─── Main Entry Point ───────────────────────────────────────────────────
async function main() {
  // Validate environment
  const required = [
    'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
    'GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN', 'GMAIL_SENDER_EMAIL'
  ];

  for (const key of required) {
    if (!process.env[key]) {
      console.error(`[agent_sender] Missing required env var: ${key}`);
      process.exit(1);
    }
  }

  try {
    await runSenderCycle();
  } catch (error) {
    console.error('[agent_sender] Fatal error:', error);
    process.exit(1);
  }
}

main();