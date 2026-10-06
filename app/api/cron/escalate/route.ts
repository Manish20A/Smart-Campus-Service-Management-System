import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const url = new URL(request.url);
  const secretParam = url.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;

  const providedSecret =
    authHeader?.replace("Bearer ", "") || secretParam;

  if (cronSecret && providedSecret !== cronSecret) {
    return NextResponse.json(
      { error: "Unauthorized cron execution" },
      { status: 401 }
    );
  }

  const escalatedCount = dataStore.checkAndRunEscalations();

  return NextResponse.json({
    success: true,
    escalatedCount,
    timestamp: new Date().toISOString(),
    message: `SLA Sentinel executed: ${escalatedCount} ticket(s) escalated.`,
  });
}
