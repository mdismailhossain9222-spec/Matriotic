/**
 * Fire-and-forget email notification to the studio whenever a successful
 * login happens. Never throws, never blocks the login flow — a failed email
 * is logged and dropped.
 */
export async function notifyLogin(params: {
  email: string;
  name: string;
  provider: "google" | "email";
  ip: string | null;
  userAgent: string | null;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[notify-login] RESEND_API_KEY not set — skipping notification");
    return;
  }

  const { email, name, provider, ip, userAgent } = params;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["matrioticstudiollc@gmail.com"],
        subject: `[Matriotic] New login: ${email}`,
        html: `
          <h2>New Login</h2>
          <ul>
            <li><b>Email:</b> ${email}</li>
            <li><b>Name:</b> ${name}</li>
            <li><b>Provider:</b> ${provider}</li>
            <li><b>IP:</b> ${ip || "unknown"}</li>
            <li><b>User-Agent:</b> ${userAgent || "unknown"}</li>
            <li><b>Time:</b> ${new Date().toISOString()}</li>
          </ul>
        `.trim(),
      }),
    });

    // fetch() does not throw on HTTP error status — a 401/403/422 would
    // otherwise be silently swallowed.
    if (!res.ok) {
      const errText = await res.text();
      console.error("[notify-login] Resend API error", {
        status: res.status,
        statusText: res.statusText,
        body: errText.slice(0, 500),
      });
      return;
    }
  } catch (err) {
    // A notification must never break a login. Log and move on.
    console.error("[notify-login] failed:", err instanceof Error ? err.message : String(err));
  }
}