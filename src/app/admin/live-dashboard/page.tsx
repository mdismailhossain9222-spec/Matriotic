"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { TrendingUp, Mail, Users, AlertCircle, RefreshCw, Zap } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function LiveDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    validLeads: 0,
    newLeads: 0,
    emailedLeads: 0,
    sentEmails: 0,
    failedEmails: 0,
    pendingEmails: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Initialize Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Fetch initial data
  const fetchData = async () => {
    try {
      // Total leads
      const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

      // Valid leads (with email)
      const { count: validLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .not("email", "is", null)
        .neq("email", "")
        .neq("email", "no email")
        .in("email_status", ["verified", "risky"]);

      // New leads
      const { count: newLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "New")
        .not("email", "is", null)
        .neq("email", "")
        .neq("email", "no email")
        .in("email_status", ["verified", "risky"]);

      // Emailed leads (have sent email logs)
      const { data: emailedLeadsData } = await supabase
        .from("email_logs")
        .select("lead_id")
        .eq("status", "sent");
      const emailedLeads = new Set(emailedLeadsData?.map(e => e.lead_id) || []).size;

      // Email stats
      const { count: sentEmails } = await supabase
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "sent");

      const { count: failedEmails } = await supabase
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "failed");

      const { count: pendingEmails } = await supabase
        .from("email_logs")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Recent leads
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      // Recent emails
      const { data: emails } = await supabase
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      setStats({
        totalLeads: totalLeads || 0,
        validLeads: validLeads || 0,
        newLeads: newLeads || 0,
        emailedLeads,
        sentEmails: sentEmails || 0,
        failedEmails: failedEmails || 0,
        pendingEmails: pendingEmails || 0,
      });
      setRecentLeads(leads || []);
      setRecentEmails(emails || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const leadsChannel = supabase
      .channel("leads-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        (payload) => {
          console.log("Leads change:", payload);
          fetchData();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CHANNEL_ERROR") {
          setIsConnected(false);
        }
      });

    const emailsChannel = supabase
      .channel("emails-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "email_logs" },
        (payload) => {
          console.log("Emails change:", payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(emailsChannel);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "Queued": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "Contacted": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Replied": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "OptedOut": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "Meeting": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "Closed": return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default: return "text-white/60 bg-white/5 border-white/10";
    }
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "text-green-400 bg-green-500/10 border-green-500/20";
      case "failed": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "pending": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "cancelled": return "text-gray-400 bg-gray-500/10 border-gray-500/20";
      default: return "text-white/60 bg-white/5 border-white/10";
    }
  };

  return (
    <div className="min-h-svh pt-32 pb-24 md:pt-40 bg-ink">
      <div className="u-container space-y-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/[0.07] pb-8 md:flex-row md:items-end">
          <div>
            <p className="u-eyebrow">Live Outreach Dashboard</p>
            <h1 className="u-display mt-4 text-[clamp(2rem,4vw,3rem)] text-white">
              Autonomous Outreach System
            </h1>
            <p className="mt-2 text-sm text-mist">
              Real-time updates via Supabase Realtime • Target: 200 valid leads, all emailed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-[0.14em] ${
              isConnected
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-emerald-400" : "bg-rose-400"}`} />
              {isConnected ? "LIVE" : "DISCONNECTED"}
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-mist">Progress to Goal</span>
            <span className="font-medium text-gold">
              {stats.validLeads} / 200 valid leads • {stats.emailedLeads} / 200 emailed
            </span>
          </div>
          <div className="h-3 bg-white/[0.07] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (stats.validLeads / 200) * 100)}%`,
              }}
            />
          </div>
          <div className="h-3 bg-white/[0.07] rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (stats.emailedLeads / 200) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            value={stats.totalLeads}
            label="Total Leads"
            subtitle="All records in database"
            color="text-cyan-400"
          />
          <StatCard
            icon={Zap}
            value={stats.validLeads}
            label="Valid Leads"
            subtitle={`Target: 200 • ${Math.round((stats.validLeads / 200) * 100)}%`}
            color="text-gold"
          />
          <StatCard
            icon={Mail}
            value={stats.newLeads}
            label="Ready to Email"
            subtitle="Status: New + valid email"
            color="text-blue-400"
          />
          <StatCard
            icon={TrendingUp}
            value={stats.emailedLeads}
            label="Leads Emailed"
            subtitle={`Target: 200 • ${Math.round((stats.emailedLeads / 200) * 100)}%`}
            color="text-emerald-400"
          />
        </div>

        {/* Email Stats */}
        <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-3">
          <StatCard
            icon={Mail}
            value={stats.sentEmails}
            label="Emails Sent"
            subtitle="Successfully delivered"
            color="text-emerald-400"
          />
          <StatCard
            icon={AlertCircle}
            value={stats.failedEmails}
            label="Emails Failed"
            subtitle="Check error logs"
            color="text-rose-400"
          />
          <StatCard
            icon={Zap}
            value={stats.pendingEmails}
            label="Pending Queue"
            subtitle="Waiting to send"
            color="text-yellow-400"
          />
        </div>

        {/* Recent Leads Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
              Recent Leads (Live)
            </h2>
            <span className="text-xs text-mist">Updated: {lastUpdate ? formatTime(lastUpdate) : "—"}</span>
          </div>
          <div className="overflow-x-auto rounded-sm border border-white/[0.09] bg-ink/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.07] text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                <tr>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Company</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Email Status</th>
                  <th className="p-3.5">Score</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-mist">
                      No leads yet. Master runner will populate this.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono text-white/70 truncate max-w-xs">{lead.email}</td>
                      <td className="p-3.5 text-white/70">
                        {lead.first_name || "—"} {lead.last_name || ""}
                      </td>
                      <td className="p-3.5 text-mist truncate max-w-xs">{lead.company || "—"}</td>
                      <td className="p-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] border ${
                          lead.email_status === "verified" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" :
                          lead.email_status === "risky" ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" :
                          lead.email_status === "guess" ? "text-blue-400 bg-blue-500/10 border-blue-500/20" :
                          "text-red-400 bg-red-500/10 border-red-500/20"
                        }`}>
                          {lead.email_status}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-white/50">{lead.score}</td>
                      <td className="p-3.5 text-mist">{lead.source || "—"}</td>
                      <td className="p-3.5 text-mist">
                        {new Date(lead.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Emails Table */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
            Recent Email Activity (Live)
          </h2>
          <div className="overflow-x-auto rounded-sm border border-white/[0.09] bg-ink/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/[0.07] text-[0.625rem] uppercase tracking-[0.18em] text-mist">
                <tr>
                  <th className="p-3.5">To</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Step</th>
                  <th className="p-3.5">Kind</th>
                  <th className="p-3.5">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-white/80">
                {recentEmails.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-mist">
                      No email activity yet.
                    </td>
                  </tr>
                ) : (
                  recentEmails.map((email) => (
                    <tr key={email.id} className="hover:bg-white/[0.02]">
                      <td className="p-3.5 font-mono text-white/70">{email.to_email}</td>
                      <td className="p-3.5 text-white/70 truncate max-w-md">{email.subject}</td>
                      <td className="p-3.5">
                        <span className={`rounded-full px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] border ${getEmailStatusColor(email.status)}`}>
                          {email.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-mist">{email.provider || "—"}</td>
                      <td className="p-3.5 font-mono text-white/50">#{email.step}</td>
                      <td className="p-3.5 text-mist">{email.kind}</td>
                      <td className="p-3.5 text-mist">
                        {email.sent_at
                          ? new Date(email.sent_at).toLocaleString()
                          : new Date(email.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-sm border border-white/[0.07] bg-gradient-to-r from-ink to-obsidian p-8 md:p-10">
          <div>
            <h3 className="u-display text-xl text-white">Master Runner Status</h3>
            <p className="mt-2 text-sm text-mist">
              {stats.validLeads >= 200 && stats.emailedLeads >= 200
                ? "🎉 Goal reached! All 200 leads found and emailed."
                : `Running autonomously in background. Checking every 2 minutes.`}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-mist">
            <span>Phone: +88 01715 318771</span>
            <span>•</span>
            <span>Signature: Ismail Hossain</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  subtitle,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  label: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-obsidian p-7">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-sm bg-white/[0.05] ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="u-display mt-4 text-4xl text-white">{value.toLocaleString()}</p>
      <p className="mt-1 text-[0.625rem] uppercase tracking-[0.18em] text-mist">{label}</p>
      <p className="mt-1 text-[0.5625rem] text-mist/70">{subtitle}</p>
    </div>
  );
}