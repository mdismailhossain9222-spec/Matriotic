import { healthCheck } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const ok = await healthCheck();
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
