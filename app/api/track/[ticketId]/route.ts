import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 40 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }
  if (entry.count >= 40) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many tracking lookups. Please wait a minute." },
      { status: 429 }
    );
  }

  const { ticketId: rawTicketId } = await context.params;
  const decoded = decodeURIComponent(rawTicketId || "").trim();

  if (!decoded || decoded.length < 1) {
    return NextResponse.json({ error: "Please enter a valid ticket identifier." }, { status: 400 });
  }

  // Normalize inputs e.g. "1" -> "CD-2026-00001", "42" -> "CD-2026-00042", "CD-42" -> "CD-2026-00042"
  let searchKey = decoded.toUpperCase();
  if (/^\d+$/.test(searchKey)) {
    searchKey = `CD-2026-${searchKey.padStart(5, "0")}`;
  } else if (/^CD-(\d+)$/i.test(searchKey)) {
    const digits = searchKey.replace(/^CD-/i, "");
    searchKey = `CD-2026-${digits.padStart(5, "0")}`;
  } else if (/^CD-2026-(\d+)$/i.test(searchKey)) {
    const digits = searchKey.replace(/^CD-2026-/i, "");
    searchKey = `CD-2026-${digits.padStart(5, "0")}`;
  }

  let req = dataStore.getRequestById(searchKey);
  if (!req) {
    // Case-insensitive fallback
    req = dataStore.getRequests().find(
      (r) =>
        r.ticketId.toUpperCase() === searchKey ||
        r.ticketId.toUpperCase() === decoded.toUpperCase() ||
        r.id.toLowerCase() === decoded.toLowerCase()
    );
  }

  if (!req) {
    return NextResponse.json(
      {
        error: `No service request matching "${decoded}" was found. Try clicking one of the demo ticket buttons below.`,
      },
      { status: 404 }
    );
  }

  const events = dataStore.getEvents(req.id);

  // Whitelisted, sanitized public payload
  const publicPayload = {
    ticketId: req.ticketId,
    serviceName: req.serviceName,
    serviceCategory: req.serviceCategory,
    departmentName: req.departmentName,
    status: req.status,
    priority: req.priority,
    estimatedCompletionAt: req.estimatedCompletionAt,
    createdAt: req.createdAt,
    completedAt: req.completedAt,
    isOverdue: req.isOverdue,
    escalated: req.escalated,
    timeline: events.map((ev) => ({
      id: ev.id,
      type: ev.type,
      title: ev.title,
      description: ev.description,
      actorRole: ev.actorRole,
      createdAt: ev.createdAt,
    })),
  };

  return NextResponse.json({ request: publicPayload });
}
