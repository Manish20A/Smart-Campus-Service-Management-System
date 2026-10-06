export type EmailEventType =
  | "request_created"
  | "assigned"
  | "status_changed"
  | "comment_added"
  | "escalated"
  | "completed";

export function getEmailHtml({
  eventType,
  ticketId,
  serviceName,
  recipientName,
  status,
  priority,
  note,
  actionUrl,
}: {
  eventType: EmailEventType;
  ticketId: string;
  serviceName: string;
  recipientName: string;
  status?: string;
  priority?: string;
  note?: string;
  actionUrl: string;
}): { subject: string; html: string } {
  let subject = `CampusDesk: Update on Ticket ${ticketId}`;
  let headline = "Status Notification";
  let bodyText = "Your service request has been updated.";

  switch (eventType) {
    case "request_created":
      subject = `Ticket Confirmed: ${ticketId} — ${serviceName}`;
      headline = "Request Received";
      bodyText = `Your request for <strong>${serviceName}</strong> has been registered in the system. Our staff will begin review shortly.`;
      break;
    case "assigned":
      subject = `Ticket Assigned: ${ticketId}`;
      headline = "Specialist Assigned";
      bodyText = `A department specialist has been assigned to ticket <strong>${ticketId}</strong> and is preparing your fulfillment.`;
      break;
    case "status_changed":
      subject = `Status Update: ${ticketId} is now ${status?.toUpperCase()}`;
      headline = "Status Changed";
      bodyText = `The status of ticket <strong>${ticketId}</strong> has progressed to <strong>${status?.replace("_", " ").toUpperCase()}</strong>.`;
      break;
    case "comment_added":
      subject = `New Message on Ticket ${ticketId}`;
      headline = "Communication Update";
      bodyText = `A new message was posted regarding ticket <strong>${ticketId}</strong>: <br/><blockquote style="margin: 12px 0; padding-left: 12px; border-left: 2px solid #C24A1E; color: #6B6358; font-style: italic;">"${note || "Please check your portal."}"</blockquote>`;
      break;
    case "escalated":
      subject = `URGENT: Ticket ${ticketId} SLA Escalation`;
      headline = "Priority Escalation";
      bodyText = `Ticket <strong>${ticketId}</strong> has breached its standard service level timeframe and has been automatically escalated to <strong>URGENT</strong>.`;
      break;
    case "completed":
      subject = `Resolved: ${ticketId} — Please Rate Your Experience`;
      headline = "Request Completed";
      bodyText = `Your service request <strong>${ticketId}</strong> has been successfully fulfilled. Please take 15 seconds to rate your satisfaction and help improve campus services.`;
      break;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #FAF7F2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F1B16; line-height: 1.5;">
  <div style="max-width: 560px; margin: 0 auto; background: #FFFDF9; border: 1px solid #E8E1D6; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
    
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #F0EAE1; padding-bottom: 20px; margin-bottom: 24px;">
      <div>
        <span style="font-family: Georgia, serif; font-size: 20px; font-weight: 600; letter-spacing: -0.5px; color: #1F1B16;">CampusDesk</span>
        <span style="font-size: 11px; margin-left: 8px; background-color: #FDF1EB; color: #C24A1E; padding: 2px 6px; border-radius: 4px; font-weight: 500;">Service Desk</span>
      </div>
      <span style="font-family: monospace; font-size: 12px; color: #6B6358;">${ticketId}</span>
    </div>

    <h2 style="font-size: 18px; font-weight: 600; margin: 0 0 12px 0; color: #1F1B16; letter-spacing: -0.3px;">${headline}</h2>
    
    <p style="font-size: 14px; color: #403A32; margin: 0 0 16px 0;">Hello ${recipientName},</p>
    
    <p style="font-size: 14px; color: #403A32; margin: 0 0 24px 0;">
      ${bodyText}
    </p>

    ${
      note && eventType !== "comment_added"
        ? `<div style="background-color: #F8F4ED; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; font-size: 13px; color: #403A32;">
            <strong>Staff Note:</strong> ${note}
          </div>`
        : ""
    }

    <div style="margin: 28px 0;">
      <a href="${actionUrl}" style="display: inline-block; background-color: #C24A1E; color: #FFFFFF; font-size: 13px; font-weight: 500; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
        View Ticket Details &rarr;
      </a>
    </div>

    <div style="border-top: 1px solid #F0EAE1; padding-top: 20px; margin-top: 32px; font-size: 11px; color: #8F877B;">
      CampusDesk Automated Notification System &bull; University Central Services<br/>
      You received this update based on your active notification preferences.
    </div>

  </div>
</body>
</html>
  `;

  return { subject, html };
}
