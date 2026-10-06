import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dataStore } from "@/lib/data/store";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter: max 30 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.expiresAt < now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 60000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count += 1;
  return true;
}

const paramsSchema = z.object({
  ticketId: z.string().min(3).max(30),
});

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
  const parsed = paramsSchema.safeParse({ ticketId: rawTicketId });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ticket identifier" }, { status: 400 });
  }

  const req = dataStore.getRequestById(parsed.data.ticketId);
  if (!req) {
    return NextResponse.json(
      { error: "No service request matching this identifier was found." },
      { status: 404 }
    );
  }

  const events = dataStore.getEvents(req.id);

  // Whitelisted, sanitized public payload (no student roll number, phone, email, or internal staff notes)
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
