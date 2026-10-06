import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getEmailHtml, EmailEventType } from "@/lib/email/templates";

const emailPayloadSchema = z.object({
  to: z.string().email(),
  recipientName: z.string(),
  eventType: z.enum([
    "request_created",
    "assigned",
    "status_changed",
    "comment_added",
    "escalated",
    "completed",
  ]),
  ticketId: z.string(),
  serviceName: z.string(),
  status: z.string().optional(),
  priority: z.string().optional(),
  note: z.string().optional(),
  requestId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = emailPayloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid email payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      to,
      recipientName,
      eventType,
      ticketId,
      serviceName,
      status,
      priority,
      note,
      requestId,
    } = parsed.data;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const actionUrl = `${appUrl}/requests/${requestId}`;

    const { subject, html } = getEmailHtml({
      eventType: eventType as EmailEventType,
      ticketId,
      serviceName,
      recipientName,
      status,
      priority,
      note,
      actionUrl,
    });

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && !resendKey.startsWith("re_placeholder")) {
      const resend = new Resend(resendKey);
      const data = await resend.emails.send({
        from: "CampusDesk <notifications@resend.dev>",
        to: [to],
        subject,
        html,
      });
      return NextResponse.json({ success: true, data });
    } else {
      console.log(`[Email Simulation] To: ${to} | Subject: ${subject}`);
      return NextResponse.json({
        success: true,
        mocked: true,
        message: "Email logged (RESEND_API_KEY not configured)",
      });
    }
  } catch (error: any) {
    console.error("Email dispatch failed:", error);
    return NextResponse.json(
      { error: "Internal email dispatch error", message: error.message },
      { status: 500 }
    );
  }
}
