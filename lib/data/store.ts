import {
  Department,
  Service,
  ServiceRequest,
  TimelineEvent,
  RequestComment,
  NotificationItem,
  CampusAnnouncement,
  AuditLogEntry,
  UserProfile,
  RequestStatus,
  RequestPriority,
} from "@/types";
import {
  SEED_DEPARTMENTS,
  SEED_SERVICES,
  SEED_USERS,
  SEED_ANNOUNCEMENTS,
  generateSeedRequests,
} from "./seedData";
import { generateNextTicketId } from "@/lib/firebase/counter";
import { db, isFirebaseConfigured } from "@/lib/firebase/client";

class CampusDataStore {
  private departments: Department[] = [];
  private services: Service[] = [];
  private users: UserProfile[] = [];
  private requests: ServiceRequest[] = [];
  private events: Record<string, TimelineEvent[]> = {};
  private comments: Record<string, RequestComment[]> = {};
  private notifications: NotificationItem[] = [];
  private announcements: CampusAnnouncement[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    if (typeof window !== "undefined") {
      const storedReqs = localStorage.getItem("campusdesk_requests");
      if (storedReqs) {
        try {
          this.requests = JSON.parse(storedReqs);
          this.departments = JSON.parse(localStorage.getItem("campusdesk_departments") || "[]");
          this.services = JSON.parse(localStorage.getItem("campusdesk_services") || "[]");
          this.users = JSON.parse(localStorage.getItem("campusdesk_users") || "[]");
          this.events = JSON.parse(localStorage.getItem("campusdesk_events") || "{}");
          this.comments = JSON.parse(localStorage.getItem("campusdesk_comments") || "{}");
          this.notifications = JSON.parse(localStorage.getItem("campusdesk_notifications") || "[]");
          this.announcements = JSON.parse(localStorage.getItem("campusdesk_announcements") || "[]");
          this.auditLogs = JSON.parse(localStorage.getItem("campusdesk_audit") || "[]");
          this.initialized = true;
          return;
        } catch (e) {
          console.warn("Error parsing stored data, reseeding:", e);
        }
      }
    }

    // Default Seed Initialization
    const seed = generateSeedRequests();
    this.departments = [...SEED_DEPARTMENTS];
    this.services = [...SEED_SERVICES];
    this.users = [...SEED_USERS];
    this.requests = seed.requests;
    this.events = seed.eventsMap;
    this.comments = seed.commentsMap;
    this.announcements = [...SEED_ANNOUNCEMENTS];
    this.notifications = [
      {
        id: "notif-1",
        userId: "user-student",
        title: "Ticket Update",
        message: "Your request CD-2026-00023 has been escalated for high priority resolution.",
        link: "/requests/req-23",
        read: false,
        type: "escalation",
        createdAt: "2026-10-06T08:30:00Z",
      },
      {
        id: "notif-2",
        userId: "user-student",
        title: "Completed Request",
        message: "Your official transcript (CD-2026-00032) is ready for pickup at the Registrar.",
        link: "/requests/req-32",
        read: true,
        type: "status",
        createdAt: "2026-10-05T14:15:00Z",
      },
      {
        id: "notif-3",
        userId: "user-staff-cse",
        title: "New Ticket Assigned",
        message: "Ticket CD-2026-00014 assigned to you by auto-assignment engine.",
        link: "/requests/req-14",
        read: false,
        type: "assigned",
        createdAt: "2026-10-06T09:00:00Z",
      },
    ];

    this.auditLogs = [
      {
        id: "audit-1",
        actorId: "user-admin",
        actorName: "Dr. Arthur Vance",
        actorRole: "admin",
        action: "UPDATE_SYSTEM_SETTINGS",
        entityType: "setting",
        entityId: "general",
        details: "Updated SLA threshold to 48 hours for standard certificates.",
        createdAt: "2026-10-01T08:00:00Z",
      },
      {
        id: "audit-2",
        actorId: "user-staff-cse",
        actorName: "Prof. Elena Rostova",
        actorRole: "staff",
        action: "STATUS_TRANSITION",
        entityType: "request",
        entityId: "req-20",
        details: "Transitioned request CD-2026-00020 from Assigned to In Progress.",
        createdAt: "2026-10-03T11:20:00Z",
      },
    ];

    this.save();
    this.initialized = true;
  }

  private save() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("campusdesk_requests", JSON.stringify(this.requests));
      localStorage.setItem("campusdesk_departments", JSON.stringify(this.departments));
      localStorage.setItem("campusdesk_services", JSON.stringify(this.services));
      localStorage.setItem("campusdesk_users", JSON.stringify(this.users));
      localStorage.setItem("campusdesk_events", JSON.stringify(this.events));
      localStorage.setItem("campusdesk_comments", JSON.stringify(this.comments));
      localStorage.setItem("campusdesk_notifications", JSON.stringify(this.notifications));
      localStorage.setItem("campusdesk_announcements", JSON.stringify(this.announcements));
      localStorage.setItem("campusdesk_audit", JSON.stringify(this.auditLogs));
    } catch (e) {
      console.warn("Failed to persist data store:", e);
    }
  }

  // Departments & Services
  public getDepartments(): Department[] {
    this.init();
    return this.departments;
  }

  public getDepartmentById(id: string): Department | undefined {
    this.init();
    return this.departments.find((d) => d.id === id);
  }

  public getServices(): Service[] {
    this.init();
    return this.services;
  }

  public getServiceById(id: string): Service | undefined {
    this.init();
    return this.services.find((s) => s.id === id);
  }

  public getUsers(): UserProfile[] {
    this.init();
    return this.users;
  }

  public getUserById(id: string): UserProfile | undefined {
    this.init();
    return this.users.find((u) => u.uid === id);
  }

  public createUser(user: UserProfile): void {
    this.init();
    const idx = this.users.findIndex((u) => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      this.users[idx] = user;
    } else {
      this.users.push(user);
    }
    this.save();
  }

  public updateUser(uid: string, updates: Partial<UserProfile>): UserProfile | undefined {
    this.init();
    const user = this.users.find((u) => u.uid === uid);
    if (!user) return undefined;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.save();
    return user;
  }

  // Requests
  public getRequests(filters?: {
    studentId?: string;
    departmentId?: string;
    assignedToId?: string;
    status?: RequestStatus | "all";
    priority?: RequestPriority | "all";
    isOverdue?: boolean;
    search?: string;
  }): ServiceRequest[] {
    this.init();
    this.checkAndRunEscalations();

    let list = [...this.requests];

    if (filters?.studentId) {
      list = list.filter((r) => r.studentId === filters.studentId);
    }
    if (filters?.departmentId) {
      list = list.filter((r) => r.departmentId === filters.departmentId);
    }
    if (filters?.assignedToId) {
      list = list.filter((r) => r.assignedToId === filters.assignedToId);
    }
    if (filters?.status && filters.status !== "all") {
      list = list.filter((r) => r.status === filters.status);
    }
    if (filters?.priority && filters.priority !== "all") {
      list = list.filter((r) => r.priority === filters.priority);
    }
    if (filters?.isOverdue) {
      list = list.filter((r) => r.isOverdue);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.ticketId.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getRequestById(id: string): ServiceRequest | undefined {
    this.init();
    this.checkAndRunEscalations();
    return this.requests.find((r) => r.id === id || r.ticketId.toLowerCase() === id.toLowerCase());
  }

  public getOpenDuplicateRequest(studentId: string, serviceId: string): ServiceRequest | undefined {
    this.init();
    return this.requests.find(
      (r) =>
        r.studentId === studentId &&
        r.serviceId === serviceId &&
        !["completed", "rejected", "cancelled"].includes(r.status)
    );
  }

  // Create Request
  public async createRequest(data: {
    serviceId: string;
    student: UserProfile;
    priority: RequestPriority;
    description: string;
    customData: Record<string, any>;
    attachmentUrl?: string;
  }): Promise<ServiceRequest> {
    this.init();
    const service = this.getServiceById(data.serviceId);
    if (!service) throw new Error("Service not found");

    const ticketId = await generateNextTicketId();
    const id = `req-${Date.now()}`;
    const createdAt = new Date().toISOString();

    // SLA hours calculation: Urgent cuts time by 50%, High cuts by 25%
    const priorityMultiplier =
      data.priority === "urgent" ? 0.5 : data.priority === "high" ? 0.75 : 1.0;
    const effectiveHours = Math.max(1, Math.round(service.slaHours * priorityMultiplier));
    const estimatedCompletionAt = new Date(
      Date.now() + effectiveHours * 60 * 60 * 1000
    ).toISOString();

    // Auto-assignment logic:
    // If auto-assignment enabled for service, pick staff member from department with least active open requests
    let assignedToId: string | undefined;
    let assignedToName: string | undefined;
    let assignedToEmail: string | undefined;

    if (service.autoAssignEnabled) {
      const deptStaff = this.users.filter(
        (u) => u.role === "staff" && u.departmentId === service.departmentId && u.isActive
      );

      if (deptStaff.length > 0) {
        // Calculate load for each staff member
        const loadCounts: Record<string, number> = {};
        deptStaff.forEach((s) => {
          loadCounts[s.uid] = this.requests.filter(
            (r) =>
              r.assignedToId === s.uid &&
              ["assigned", "in_progress"].includes(r.status)
          ).length;
        });

        // Pick staff with minimal load
        const picked = [...deptStaff].sort(
          (a, b) => (loadCounts[a.uid] || 0) - (loadCounts[b.uid] || 0)
        )[0];

        assignedToId = picked.uid;
        assignedToName = picked.displayName;
        assignedToEmail = picked.email;
      }
    }

    const newRequest: ServiceRequest = {
      id,
      ticketId,
      serviceId: service.id,
      serviceName: service.name,
      serviceCategory: service.category,
      departmentId: service.departmentId,
      departmentName: service.departmentName,
      studentId: data.student.uid,
      studentName: data.student.displayName,
      studentEmail: data.student.email,
      studentRollNumber: data.student.rollNumber,
      assignedToId,
      assignedToName,
      assignedToEmail,
      status: assignedToId ? "assigned" : "pending",
      priority: data.priority,
      description: data.description,
      customData: data.customData,
      attachmentUrl: data.attachmentUrl,
      estimatedCompletionAt,
      isOverdue: false,
      escalated: false,
      createdAt,
      updatedAt: createdAt,
    };

    this.requests.unshift(newRequest);

    // Initial timeline event
    const events: TimelineEvent[] = [
      {
        id: `ev-${id}-1`,
        type: "created",
        title: "Request Submitted",
        description: `Submitted by ${data.student.displayName} (${data.priority.toUpperCase()} priority). Estimated completion within ${effectiveHours} hours.`,
        actorId: data.student.uid,
        actorName: data.student.displayName,
        actorRole: "student",
        createdAt,
      },
    ];

    if (assignedToId) {
      events.push({
        id: `ev-${id}-2`,
        type: "assigned",
        title: "Auto-Assigned",
        description: `Intelligently routed to ${assignedToName} (${service.departmentName}) based on workload balancing.`,
        actorId: "system",
        actorName: "Auto-Assignment Engine",
        actorRole: "system",
        createdAt,
      });

      // Notification for staff
      this.notifications.unshift({
        id: `notif-${Date.now()}-staff`,
        userId: assignedToId,
        title: "New Request Assigned",
        message: `Ticket ${ticketId} (${service.name}) assigned to you.`,
        link: `/requests/${id}`,
        read: false,
        type: "assigned",
        createdAt,
      });
    }

    this.events[id] = events;
    this.comments[id] = [];

    // Notification for student
    this.notifications.unshift({
      id: `notif-${Date.now()}-std`,
      userId: data.student.uid,
      title: "Request Received",
      message: `Your request ${ticketId} has been successfully registered.`,
      link: `/requests/${id}`,
      read: false,
      type: "status",
      createdAt,
    });

    this.addAuditLog(
      data.student,
      "CREATE_REQUEST",
      "request",
      id,
      `Submitted ticket ${ticketId} for ${service.name}`
    );

    this.save();

    // Async sync to Cloud Firestore if active
    if (isFirebaseConfigured && db) {
      const activeDb = db;
      import("firebase/firestore").then(({ doc, setDoc }) => {
        setDoc(doc(activeDb, "requests", id), newRequest).catch((e) =>
          console.warn("Firestore sync request warning:", e)
        );
        setDoc(doc(activeDb, "events", id), { items: events }).catch((e) =>
          console.warn("Firestore sync events warning:", e)
        );
      }).catch((e) => console.warn("Firestore dynamic import warning:", e));
    }

    return newRequest;
  }

  // Update Status
  public updateStatus(
    requestId: string,
    newStatus: RequestStatus,
    note: string,
    actor: UserProfile
  ): ServiceRequest {
    this.init();
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");

    // Enforce valid transitions
    const validTransitions: Record<RequestStatus, RequestStatus[]> = {
      pending: ["assigned", "in_progress", "rejected", "cancelled"],
      assigned: ["in_progress", "rejected", "cancelled"],
      in_progress: ["completed", "rejected"],
      completed: ["reopened"],
      rejected: ["reopened"],
      cancelled: [],
      reopened: ["in_progress", "assigned", "completed"],
    };

    if (actor.role === "student") {
      if (req.status === "pending" && newStatus === "cancelled") {
        // allowed
      } else if (req.status === "completed" && newStatus === "reopened") {
        // allowed within 7 days
        const completedTime = new Date(req.completedAt || req.updatedAt).getTime();
        const daysSinceCompleted = (Date.now() - completedTime) / (1000 * 60 * 60 * 24);
        if (daysSinceCompleted > 7) {
          throw new Error("Requests can only be reopened within 7 days of completion.");
        }
      } else {
        throw new Error("Students can only cancel pending requests or reopen completed requests.");
      }
    } else {
      const allowed = validTransitions[req.status] || [];
      if (!allowed.includes(newStatus) && actor.role !== "admin") {
        throw new Error(`Cannot transition from ${req.status} to ${newStatus}`);
      }
    }

    const previousStatus = req.status;
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();

    if (newStatus === "completed") {
      req.completedAt = req.updatedAt;
      req.isOverdue = false;
    }

    // Add Timeline Event
    const eventTitles: Record<RequestStatus, string> = {
      pending: "Returned to Intake",
      assigned: "Assigned",
      in_progress: "Processing Commenced",
      completed: "Fulfillment Completed",
      rejected: "Request Declined",
      cancelled: "Request Cancelled",
      reopened: "Request Reopened",
    };

    const newEvent: TimelineEvent = {
      id: `ev-${requestId}-${Date.now()}`,
      type: newStatus === "completed" ? "completed" : newStatus === "cancelled" ? "cancelled" : newStatus === "reopened" ? "reopened" : "status_changed",
      title: eventTitles[newStatus],
      description: note || `Status transitioned from ${previousStatus} to ${newStatus} by ${actor.displayName}`,
      actorId: actor.uid,
      actorName: actor.displayName,
      actorRole: actor.role,
      createdAt: req.updatedAt,
    };

    if (!this.events[requestId]) this.events[requestId] = [];
    this.events[requestId].push(newEvent);

    // Notify student
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: req.studentId,
      title: `Status: ${req.ticketId}`,
      message: `Your request status changed to ${newStatus.replace("_", " ").toUpperCase()}.${note ? ` Note: ${note}` : ""}`,
      link: `/requests/${req.id}`,
      read: false,
      type: "status",
      createdAt: req.updatedAt,
    });

    this.addAuditLog(
      actor,
      "STATUS_CHANGE",
      "request",
      req.id,
      `Changed status of ${req.ticketId} from ${previousStatus} to ${newStatus}`
    );

    this.save();
    return req;
  }

  // Assign request
  public assignRequest(
    requestId: string,
    staffId: string,
    actor: UserProfile
  ): ServiceRequest {
    this.init();
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");

    const staff = this.getUserById(staffId);
    if (!staff) throw new Error("Staff member not found");

    req.assignedToId = staff.uid;
    req.assignedToName = staff.displayName;
    req.assignedToEmail = staff.email;
    if (req.status === "pending") {
      req.status = "assigned";
    }
    req.updatedAt = new Date().toISOString();

    const newEvent: TimelineEvent = {
      id: `ev-${requestId}-${Date.now()}`,
      type: "assigned",
      title: "Assigned to Specialist",
      description: `Assigned to ${staff.displayName} (${staff.departmentName || req.departmentName}) by ${actor.displayName}`,
      actorId: actor.uid,
      actorName: actor.displayName,
      actorRole: actor.role,
      createdAt: req.updatedAt,
    };

    if (!this.events[requestId]) this.events[requestId] = [];
    this.events[requestId].push(newEvent);

    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: staff.uid,
      title: "Request Assigned",
      message: `You have been assigned to ${req.ticketId} (${req.serviceName}).`,
      link: `/requests/${req.id}`,
      read: false,
      type: "assigned",
      createdAt: req.updatedAt,
    });

    this.save();
    return req;
  }

  // Change priority
  public changePriority(
    requestId: string,
    priority: RequestPriority,
    actor: UserProfile
  ): ServiceRequest {
    this.init();
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");

    const oldP = req.priority;
    req.priority = priority;
    req.updatedAt = new Date().toISOString();

    const newEvent: TimelineEvent = {
      id: `ev-${requestId}-${Date.now()}`,
      type: "priority_changed",
      title: "Priority Level Adjusted",
      description: `Priority updated from ${oldP.toUpperCase()} to ${priority.toUpperCase()} by ${actor.displayName}`,
      actorId: actor.uid,
      actorName: actor.displayName,
      actorRole: actor.role,
      createdAt: req.updatedAt,
    };

    if (!this.events[requestId]) this.events[requestId] = [];
    this.events[requestId].push(newEvent);

    this.save();
    return req;
  }

  // Comments
  public addComment(
    requestId: string,
    content: string,
    isInternal: boolean,
    author: UserProfile
  ): RequestComment {
    this.init();
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");

    if (author.role === "student" && isInternal) {
      throw new Error("Students cannot post internal staff notes");
    }

    const comment: RequestComment = {
      id: `cm-${Date.now()}`,
      authorId: author.uid,
      authorName: author.displayName,
      authorRole: author.role,
      isInternal,
      content,
      createdAt: new Date().toISOString(),
    };

    if (!this.comments[requestId]) this.comments[requestId] = [];
    this.comments[requestId].push(comment);

    // Notify recipient if public comment
    if (!isInternal) {
      const recipientId = author.role === "student" ? req.assignedToId : req.studentId;
      if (recipientId) {
        this.notifications.unshift({
          id: `notif-${Date.now()}`,
          userId: recipientId,
          title: `New Comment on ${req.ticketId}`,
          message: `${author.displayName}: "${content.substring(0, 80)}${content.length > 80 ? "..." : ""}"`,
          link: `/requests/${req.id}`,
          read: false,
          type: "comment",
          createdAt: comment.createdAt,
        });
      }
    }

    this.save();
    return comment;
  }

  public getComments(requestId: string, viewerRole: "student" | "staff" | "admin"): RequestComment[] {
    this.init();
    const list = this.comments[requestId] || [];
    if (viewerRole === "student") {
      return list.filter((c) => !c.isInternal);
    }
    return list;
  }

  public getEvents(requestId: string): TimelineEvent[] {
    this.init();
    return (this.events[requestId] || []).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }

  // Submit Feedback
  public submitFeedback(
    requestId: string,
    score: number,
    comment: string | undefined,
    student: UserProfile
  ): ServiceRequest {
    this.init();
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) throw new Error("Request not found");
    if (req.studentId !== student.uid) throw new Error("Only the requester can submit feedback");
    if (req.status !== "completed") throw new Error("Feedback can only be provided for completed requests");

    const feedbackTime = new Date().toISOString();
    req.rating = {
      score,
      comment,
      createdAt: feedbackTime,
    };
    req.updatedAt = feedbackTime;

    const newEvent: TimelineEvent = {
      id: `ev-${requestId}-rating`,
      type: "feedback_submitted",
      title: "Student Satisfaction Rating",
      description: `Student awarded ${score}/5 stars.${comment ? ` Review: "${comment}"` : ""}`,
      actorId: student.uid,
      actorName: student.displayName,
      actorRole: "student",
      createdAt: feedbackTime,
    };

    if (!this.events[requestId]) this.events[requestId] = [];
    this.events[requestId].push(newEvent);

    this.save();
    return req;
  }

  // Notifications
  public getNotifications(userId: string): NotificationItem[] {
    this.init();
    return this.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationRead(id: string): void {
    this.init();
    const n = this.notifications.find((item) => item.id === id);
    if (n) {
      n.read = true;
      this.save();
    }
  }

  public markAllNotificationsRead(userId: string): void {
    this.init();
    this.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    this.save();
  }

  // Announcements
  public getAnnouncements(): CampusAnnouncement[] {
    this.init();
    return this.announcements.filter((a) => a.active);
  }

  public createAnnouncement(
    title: string,
    content: string,
    level: "info" | "warning" | "alert",
    creator: UserProfile
  ): CampusAnnouncement {
    this.init();
    const ann: CampusAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      level,
      active: true,
      createdAt: new Date().toISOString(),
      createdBy: creator.displayName,
    };
    this.announcements.unshift(ann);
    this.save();
    return ann;
  }

  public deleteAnnouncement(id: string): void {
    this.init();
    this.announcements = this.announcements.filter((a) => a.id !== id);
    this.save();
  }

  // Audit Logs
  public getAuditLogs(): AuditLogEntry[] {
    this.init();
    return this.auditLogs.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private addAuditLog(
    actor: UserProfile,
    action: string,
    entityType: AuditLogEntry["entityType"],
    entityId: string,
    details: string
  ) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      actorId: actor.uid,
      actorName: actor.displayName,
      actorRole: actor.role,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    });
  }

  // SLA Escalation sentinel
  public checkAndRunEscalations(): number {
    const now = Date.now();
    let escalatedCount = 0;

    this.requests.forEach((req) => {
      if (["pending", "assigned", "in_progress"].includes(req.status)) {
        const deadline = new Date(req.estimatedCompletionAt).getTime();
        if (now > deadline && !req.isOverdue) {
          req.isOverdue = true;

          // If SLA breached and not yet escalated, bump priority to urgent
          if (!req.escalated) {
            req.escalated = true;
            req.priority = "urgent";
            req.escalatedAt = new Date().toISOString();
            escalatedCount++;

            if (!this.events[req.id]) this.events[req.id] = [];
            this.events[req.id].push({
              id: `ev-${req.id}-esc-${now}`,
              type: "escalated",
              title: "Auto-Escalation: SLA Exceeded",
              description: "Target resolution timeframe elapsed. Auto-promoted priority to URGENT and triggered administrative alert.",
              actorId: "system",
              actorName: "SLA Sentinel Engine",
              actorRole: "system",
              createdAt: req.escalatedAt,
            });

            // Notify department head/admin
            this.notifications.unshift({
              id: `notif-esc-${req.id}-${now}`,
              userId: "user-admin",
              title: "Overdue Ticket Escalated",
              message: `${req.ticketId} (${req.serviceName}) has breached SLA and was escalated to Urgent.`,
              link: `/requests/${req.id}`,
              read: false,
              type: "escalation",
              createdAt: req.escalatedAt,
            });
          }
        }
      }
    });

    if (escalatedCount > 0) {
      this.save();
    }
    return escalatedCount;
  }

  // Analytics & Stats
  public getStats() {
    this.init();
    this.checkAndRunEscalations();

    const total = this.requests.length;
    const pending = this.requests.filter((r) => r.status === "pending").length;
    const assigned = this.requests.filter((r) => r.status === "assigned").length;
    const inProgress = this.requests.filter((r) => r.status === "in_progress").length;
    const completed = this.requests.filter((r) => r.status === "completed").length;
    const rejected = this.requests.filter((r) => r.status === "rejected").length;
    const overdue = this.requests.filter((r) => r.isOverdue).length;

    // SLA compliance %
    const resolved = this.requests.filter((r) => r.status === "completed");
    const onTimeResolved = resolved.filter((r) => {
      if (!r.completedAt) return true;
      return new Date(r.completedAt).getTime() <= new Date(r.estimatedCompletionAt).getTime();
    });
    const slaCompliance = resolved.length > 0
      ? Math.round((onTimeResolved.length / resolved.length) * 100)
      : 96;

    // Average resolution time in hours
    let totalResolutionHours = 0;
    resolved.forEach((r) => {
      if (r.completedAt) {
        const diffMs = new Date(r.completedAt).getTime() - new Date(r.createdAt).getTime();
        totalResolutionHours += diffMs / (1000 * 60 * 60);
      }
    });
    const avgResolutionHours = resolved.length > 0
      ? Math.round((totalResolutionHours / resolved.length) * 10) / 10
      : 18.5;

    // Average satisfaction rating
    const rated = this.requests.filter((r) => r.rating?.score);
    const avgRating = rated.length > 0
      ? Math.round(
          (rated.reduce((acc, r) => acc + (r.rating?.score || 0), 0) / rated.length) * 10
        ) / 10
      : 4.8;

    // Requests per day (last 14 days)
    const dailyMap: Record<string, number> = {};
    const now = Date.now();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dailyMap[key] = 0;
    }

    this.requests.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (dailyMap[key] !== undefined) {
        dailyMap[key] += 1;
      }
    });

    const requestsPerDay = Object.keys(dailyMap).map((date) => ({
      date,
      count: dailyMap[date],
    }));

    // Requests by service
    const serviceMap: Record<string, number> = {};
    this.requests.forEach((r) => {
      serviceMap[r.serviceName] = (serviceMap[r.serviceName] || 0) + 1;
    });
    const requestsByService = Object.entries(serviceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Requests by status
    const statusDistribution = [
      { name: "Pending", count: pending, fill: "#D97706" },
      { name: "Assigned", count: assigned, fill: "#2563EB" },
      { name: "In Progress", count: inProgress, fill: "#EA580C" },
      { name: "Completed", count: completed, fill: "#2D6A4F" },
      { name: "Declined", count: rejected, fill: "#DC2626" },
    ];

    // Department Workload
    const departmentWorkload = this.departments.map((dept) => {
      const deptReqs = this.requests.filter((r) => r.departmentId === dept.id);
      const deptOpen = deptReqs.filter((r) =>
        ["pending", "assigned", "in_progress"].includes(r.status)
      );
      const deptCompleted = deptReqs.filter((r) => r.status === "completed");
      const oldestUnresolved = deptOpen.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )[0];

      return {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        openCount: deptOpen.length,
        totalCount: deptReqs.length,
        staffCount: dept.activeStaffCount,
        avgLoadPerStaff: Math.round((deptOpen.length / (dept.activeStaffCount || 1)) * 10) / 10,
        oldestUnresolvedTicketId: oldestUnresolved ? oldestUnresolved.ticketId : null,
        oldestUnresolvedDays: oldestUnresolved
          ? Math.round((Date.now() - new Date(oldestUnresolved.createdAt).getTime()) / (1000 * 60 * 60 * 24))
          : 0,
        completedCount: deptCompleted.length,
      };
    });

    return {
      total,
      pending,
      assigned,
      inProgress,
      completed,
      rejected,
      overdue,
      slaCompliance,
      avgResolutionHours,
      avgRating,
      requestsPerDay,
      requestsByService,
      statusDistribution,
      departmentWorkload,
    };
  }
}

export const dataStore = new CampusDataStore();
