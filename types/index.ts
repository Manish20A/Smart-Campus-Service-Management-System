export type UserRole = "student" | "staff" | "admin";

export type RequestStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "rejected"
  | "cancelled"
  | "reopened";

export type RequestPriority = "low" | "normal" | "high" | "urgent";

export interface UserEmailNotifications {
  onRequestCreated: boolean;
  onStatusChanged: boolean;
  onCommentAdded: boolean;
  onEscalated: boolean;
  onCompleted: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  departmentId?: string;
  departmentName?: string;
  rollNumber?: string;
  year?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  emailNotifications: UserEmailNotifications;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headId?: string;
  headName?: string;
  headEmail?: string;
  autoAssignRule: "round_robin" | "least_loaded" | "manual";
  activeStaffCount: number;
  openRequestsCount: number;
  createdAt: string;
}

export type ServiceFieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "url";

export interface ServiceFieldSchema {
  id: string;
  label: string;
  type: ServiceFieldType;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
  defaultValue?: string | number;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  name: string;
  code: string;
  description: string;
  departmentId: string;
  departmentName: string;
  category: "Academic" | "Facilities" | "Hostel & Living" | "IT & Lab" | "Administrative";
  defaultPriority: RequestPriority;
  slaHours: number;
  requiredFields: ServiceFieldSchema[];
  icon: string;
  isActive: boolean;
  autoAssignEnabled: boolean;
  faq?: ServiceFaq[];
  createdAt: string;
}

export interface RequestFeedback {
  score: number; // 1 to 5
  comment?: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  ticketId: string; // e.g. CD-2026-00042
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  departmentId: string;
  departmentName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentRollNumber?: string;
  assignedToId?: string;
  assignedToName?: string;
  assignedToEmail?: string;
  status: RequestStatus;
  priority: RequestPriority;
  description: string;
  customData: Record<string, any>;
  attachmentUrl?: string;
  estimatedCompletionAt: string; // ISO date string
  isOverdue: boolean;
  escalated: boolean;
  escalatedAt?: string;
  rating?: RequestFeedback;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export type TimelineEventType =
  | "created"
  | "assigned"
  | "status_changed"
  | "priority_changed"
  | "reassigned"
  | "escalated"
  | "cancelled"
  | "reopened"
  | "completed"
  | "rejected"
  | "feedback_submitted";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | "system";
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface RequestComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isInternal: boolean; // internal staff note vs student-visible
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  link: string;
  read: boolean;
  type: "status" | "assigned" | "comment" | "escalation" | "system";
  createdAt: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  content: string;
  level: "info" | "warning" | "alert";
  active: boolean;
  createdAt: string;
  createdBy: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: "request" | "service" | "department" | "user" | "setting";
  entityId: string;
  details: string;
  createdAt: string;
}

export interface SystemSettings {
  id: "general";
  escalationThresholdHours: number;
  urgentSlaMultiplier: number; // e.g. 0.5
  autoAssignEnabled: boolean;
  defaultEmailSender: string;
  updatedAt: string;
}
