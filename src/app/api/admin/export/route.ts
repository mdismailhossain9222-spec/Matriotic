import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { inquiries, loginEvents, users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

/**
 * Escapes a cell for CSV:
 * 1. Defends against CSV formula injection (DDE/Excel macro execution) by
 *    prefixing dangerous leading characters (=, +, -, @, \t, \r) with a single quote.
 * 2. Escapes double quotes by doubling them ("" -> """").
 * 3. Wraps the field in double quotes if it contains a comma, quote, or newline.
 */
function sanitizeCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = String(val);

  // Formula injection defense: prefix dangerous triggers with a single quote.
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape existing double quotes.
  const escaped = str.replace(/"/g, '""');

  // Wrap in quotes if it contains separator, quote, or newline.
  if (/[",\n\r]/.test(escaped)) {
    return `"${escaped}"`;
  }
  return escaped;
}

function toCsvRow(cells: unknown[]): string {
  return cells.map(sanitizeCell).join(",");
}

export async function GET(req: Request) {
  // Gate: session must exist.
  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Gate: user must have role === 'admin' AND emailVerified.
  let adminRow: { role: string; emailVerified: Date | null } | undefined;
  try {
    const rows = await db
      .select({
        role: users.role,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(users.id, sessionUser.id))
      .limit(1);
    adminRow = rows[0];
  } catch (err) {
    console.error("[admin-export] auth lookup failed:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  if (!adminRow || adminRow.role !== "admin" || !adminRow.emailVerified) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  let filename = "export.csv";
  const rows: string[] = [];

  try {
    if (type === "users") {
      filename = `users-${new Date().toISOString().split("T")[0]}.csv`;
      rows.push(toCsvRow(["ID", "Email", "Name", "Company", "Role", "Email Verified", "Created At"]));
      const data = await db.select().from(users).orderBy(desc(users.id));
      for (const u of data) {
        rows.push(
          toCsvRow([
            u.id,
            u.email,
            u.name,
            u.company ?? "",
            u.role,
            u.emailVerified ? u.emailVerified.toISOString() : "",
            u.createdAt.toISOString(),
          ]),
        );
      }
    } else if (type === "logins") {
      filename = `logins-${new Date().toISOString().split("T")[0]}.csv`;
      rows.push(toCsvRow(["ID", "User ID", "Email", "Provider", "Success", "IP", "User Agent", "Created At"]));
      const data = await db.select().from(loginEvents).orderBy(desc(loginEvents.id));
      for (const l of data) {
        rows.push(
          toCsvRow([
            l.id,
            l.userId ?? "",
            l.email,
            l.provider,
            l.success ? "true" : "false",
            l.ip ?? "",
            l.userAgent ?? "",
            l.createdAt.toISOString(),
          ]),
        );
      }
    } else if (type === "inquiries") {
      filename = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
      rows.push(toCsvRow(["ID", "Name", "Email", "Company", "Budget", "Service", "Message", "Created At"]));
      const data = await db.select().from(inquiries).orderBy(desc(inquiries.id));
      for (const i of data) {
        rows.push(
          toCsvRow([
            i.id,
            i.name,
            i.email,
            i.company ?? "",
            i.budget,
            i.service,
            i.message,
            i.createdAt.toISOString(),
          ]),
        );
      }
    } else {
      return new NextResponse("Invalid export type. Use ?type=users|logins|inquiries", {
        status: 400,
      });
    }
  } catch (err) {
    console.error("[admin-export] query failed:", err);
    return new NextResponse("Export failed", { status: 500 });
  }

  const csv = rows.join("\r\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}