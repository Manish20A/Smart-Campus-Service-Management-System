"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import {
  ServiceRequest,
  TimelineEvent,
  RequestComment,
  RequestStatus,
  RequestPriority,
  UserProfile,
} from "@/types";
import {
  ArrowLeft,
  Clock,
  Printer,
  MessageSquare,
  Lock,
  Send,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  UserCheck,
  Star,
  FileText,
  Calendar,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  getStatusMeta,
  getPriorityMeta,
  formatDate,
  formatDateTime,
  formatTimeAgo,
} from "@/lib/utils";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user, role } = useAuth();
  const { success, error: toastError } = useToast();

  const { id: requestId } = use(params);

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [comments, setComments] = useState<RequestComment[]>([]);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Modals state
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<RequestStatus>("in_progress");
  const [statusNote, setStatusNote] = useState("");

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [targetStaffId, setTargetStaffId] = useState("");

  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [targetPriority, setTargetPriority] = useState<RequestPriority>("normal");

  const [reopenModalOpen, setReopenModalOpen] = useState(false);
  const [reopenReason, setReopenReason] = useState("");

  // Feedback rating state
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const refreshData = () => {
    const req = dataStore.getRequestById(requestId);
    if (req) {
      setRequest({ ...req });
      setEvents(dataStore.getEvents(req.id));
      setComments(dataStore.getComments(req.id, (role as any) || "student"));
    }
  };

  useEffect(() => {
    refreshData();
  }, [requestId, role]);

  if (!request) {
    return (
      <DashboardLayout>
        <div className="py-16 text-center space-y-3">
          <p className="text-sm text-[var(--foreground)]">Loading request record...</p>
          <Link href="/student/requests">
            <Button variant="outline" size="sm">
              &larr; Return to Requests
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const statusMeta = getStatusMeta(request.status);
  const priorityMeta = getPriorityMeta(request.priority);
  const isStaffOrAdmin = role === "staff" || role === "admin";
  const isOwner = user?.uid === request.studentId;

  // Handlers
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setIsPostingComment(true);
    try {
      dataStore.addComment(
        request.id,
        commentText.trim(),
        isInternalComment,
        user
      );
      setCommentText("");
      refreshData();
      success("Comment added.");
    } catch (err: any) {
      toastError(err.message || "Failed to post comment.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleUpdateStatus = () => {
    if (!user) return;
    try {
      dataStore.updateStatus(request.id, targetStatus, statusNote.trim(), user);
      setStatusModalOpen(false);
      setStatusNote("");
      refreshData();
      success(`Status transitioned to ${targetStatus.replace("_", " ").toUpperCase()}`);
    } catch (err: any) {
      toastError(err.message || "Status update failed.");
    }
  };

  const handleAssign = () => {
    if (!user || !targetStaffId) return;
    try {
      dataStore.assignRequest(request.id, targetStaffId, user);
      setAssignModalOpen(false);
      refreshData();
      success("Ticket assigned successfully.");
    } catch (err: any) {
      toastError(err.message || "Assignment failed.");
    }
  };

  const handleChangePriority = () => {
    if (!user) return;
    try {
      dataStore.changePriority(request.id, targetPriority, user);
      setPriorityModalOpen(false);
      refreshData();
      success("Priority updated.");
    } catch (err: any) {
      toastError(err.message || "Priority update failed.");
    }
  };

  const handleCancelRequest = () => {
    if (!user) return;
    if (confirm("Are you sure you want to cancel this pending request?")) {
      try {
        dataStore.updateStatus(request.id, "cancelled", "Cancelled by applicant.", user);
        refreshData();
        success("Request cancelled.");
      } catch (err: any) {
        toastError(err.message || "Cancellation failed.");
      }
    }
  };

  const handleReopenRequest = () => {
    if (!user || !reopenReason.trim()) return;
    try {
      dataStore.updateStatus(request.id, "reopened", reopenReason.trim(), user);
      setReopenModalOpen(false);
      setReopenReason("");
      refreshData();
      success("Request reopened.");
    } catch (err: any) {
      toastError(err.message || "Reopen failed.");
    }
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingFeedback(true);
    try {
      dataStore.submitFeedback(
        request.id,
        feedbackRating,
        feedbackComment.trim() || undefined,
        user
      );
      refreshData();
      success("Thank you for your feedback!");
    } catch (err: any) {
      toastError(err.message || "Feedback submission failed.");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Staff options for assignment
  const departmentStaff = dataStore
    .getUsers()
    .filter((u) => u.role === "staff" || u.role === "admin");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Navigation & Print Header */}
        <div className="flex items-center justify-between no-print">
          <Link
            href={isStaffOrAdmin ? `/${role}/requests` : "/student/requests"}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Requests Queue
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Receipt
          </Button>
        </div>

        {/* Printable Receipt Banner (Only shows when printing) */}
        <div className="hidden print-only mb-6 border-b pb-4">
          <h1 className="text-xl font-bold">CampusDesk Official Service Receipt</h1>
          <p className="text-xs text-zinc-600">
            Generated on {new Date().toLocaleDateString()} &bull; University Central Services
          </p>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: Summary, Custom Fields, Timeline, Comments (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Header Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[var(--accent)]">
                        {request.ticketId}
                      </span>
                      <span className="text-xs text-[var(--foreground-subtle)]">&bull;</span>
                      <span className="text-xs text-[var(--foreground-muted)] font-medium">
                        {request.departmentName}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
                      {request.serviceName}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusMeta.badgeClass}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${statusMeta.dotColor}`} />
                      {statusMeta.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityMeta.badgeClass}`}
                    >
                      {priorityMeta.label}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] mb-1">
                    Application Note / Scope
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                    {request.description}
                  </p>
                </div>

                {/* Custom Form Specifications */}
                {request.customData && Object.keys(request.customData).length > 0 && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)]">
                      Submitted Intake Parameters
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(request.customData).map(([k, v]) => (
                        <div
                          key={k}
                          className="p-2.5 rounded-[6px] bg-[var(--surface-hover)]/40 border border-[var(--border)]"
                        >
                          <span className="text-[10px] font-mono text-[var(--foreground-subtle)] uppercase block">
                            {k.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="font-medium text-[var(--foreground)] mt-0.5 block truncate">
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cloud Attachment Link */}
                {request.attachmentUrl && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs p-3 rounded-[6px] bg-[var(--surface-hover)]/50 border border-[var(--border)]">
                    <div className="flex items-center gap-2 text-[var(--foreground)]">
                      <FileText className="h-4 w-4 text-[var(--accent)]" />
                      <span>Attached Supporting Document</span>
                    </div>
                    <a
                      href={request.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-medium"
                    >
                      Open Link
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline Section */}
            <Card>
              <CardHeader>
                <CardTitle>Lifecycle & Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--border)]">
                  {events.map((ev) => (
                    <div key={ev.id} className="relative group">
                      <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-center shadow-2xs">
                        <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--foreground)]">
                            {ev.title}
                          </span>
                          <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                            {formatDateTime(ev.createdAt)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--foreground-muted)]">
                            {ev.actorName} ({ev.actorRole})
                          </span>
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                          {ev.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Thread Section */}
            <Card className="no-print">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[var(--accent)]" />
                    Communications Thread
                  </CardTitle>
                  <span className="text-xs text-[var(--foreground-muted)]">
                    {comments.length} message(s)
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comments List */}
                <div className="space-y-3">
                  {comments.length === 0 ? (
                    <div className="text-center py-6 text-xs text-[var(--foreground-muted)]">
                      No communications recorded on this ticket yet.
                    </div>
                  ) : (
                    comments.map((cm) => (
                      <div
                        key={cm.id}
                        className={`p-3.5 rounded-[8px] border text-xs space-y-1 ${
                          cm.isInternal
                            ? "bg-[var(--amber-subtle)]/30 border-[var(--amber-border)]"
                            : "bg-[var(--surface-elevated)] border-[var(--border)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--foreground)]">
                              {cm.authorName}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-1 rounded bg-[var(--surface-hover)] text-[var(--foreground-muted)]">
                              {cm.authorRole}
                            </span>
                            {cm.isInternal && (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                                <Lock className="h-2.5 w-2.5" />
                                Internal Note
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                            {formatTimeAgo(cm.createdAt)}
                          </span>
                        </div>
                        <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap">
                          {cm.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Comment Form */}
                <form
                  onSubmit={handlePostComment}
                  className="space-y-3 pt-3 border-t border-[var(--border-subtle)]"
                >
                  <Textarea
                    placeholder="Type an update or question..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                  />

                  <div className="flex items-center justify-between">
                    {isStaffOrAdmin ? (
                      <label className="flex items-center gap-2 text-xs text-[var(--foreground-muted)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isInternalComment}
                          onChange={(e) => setIsInternalComment(e.target.checked)}
                          className="rounded border-[var(--border)] text-[var(--accent)]"
                        />
                        <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                          <Lock className="h-3 w-3" />
                          Internal staff note (hidden from student)
                        </span>
                      </label>
                    ) : (
                      <span className="text-[11px] text-[var(--foreground-muted)]">
                        Your message will be visible to department specialists.
                      </span>
                    )}

                    <Button
                      type="submit"
                      size="sm"
                      variant="primary"
                      isLoading={isPostingComment}
                      disabled={!commentText.trim()}
                      className="gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Metadata Panel, SLA Countdown, Rating, Actions */}
          <div className="space-y-6">
            {/* SLA & Time Horizon Card */}
            <Card>
              <CardHeader>
                <CardTitle>Resolution Horizon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <ProgressRing
                    startDate={request.createdAt}
                    targetDate={request.estimatedCompletionAt}
                    completed={request.status === "completed"}
                    size={68}
                    strokeWidth={5}
                  />
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[var(--foreground)] block">
                      {request.status === "completed"
                        ? "Fulfilled On Schedule"
                        : request.isOverdue
                        ? "Breached SLA Deadline"
                        : "Processing Active"}
                    </span>
                    <div className="text-[11px] font-mono text-[var(--foreground-muted)]">
                      Target: {formatDate(request.estimatedCompletionAt)}
                    </div>
                    {request.escalated && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-red-600 dark:text-red-400 font-semibold font-mono uppercase">
                        <AlertTriangle className="h-3 w-3" />
                        Auto-Escalated (Urgent)
                      </span>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-[var(--border-subtle)] text-xs pt-2">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[var(--foreground-muted)]">Submitted Date</span>
                    <span className="font-mono text-[var(--foreground)]">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>
                  {request.completedAt && (
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-[var(--foreground-muted)]">Completed Date</span>
                      <span className="font-mono text-[var(--foreground)]">
                        {formatDate(request.completedAt)}
                      </span>
                    </div>
                  )}
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-[var(--foreground-muted)]">Applicant</span>
                    <span className="font-medium text-[var(--foreground)] truncate max-w-[150px]">
                      {request.studentName}
                    </span>
                  </div>
                  {request.studentRollNumber && (
                    <div className="py-2 flex items-center justify-between">
                      <span className="text-[var(--foreground-muted)]">Student ID</span>
                      <span className="font-mono text-[var(--foreground)]">
                        {request.studentRollNumber}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Assignee Card */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Specialist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {request.assignedToName ? (
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center font-serif text-sm font-semibold shrink-0">
                      {request.assignedToName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--foreground)] truncate">
                        {request.assignedToName}
                      </p>
                      <p className="text-[11px] text-[var(--foreground-muted)] truncate">
                        {request.assignedToEmail}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-mono px-1.5 py-0.2 rounded border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground-subtle)]">
                        {request.departmentName}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-[var(--foreground-muted)]">
                    Unassigned. Waiting for departmental intake allocation.
                  </div>
                )}

                {isStaffOrAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs mt-2"
                    onClick={() => setAssignModalOpen(true)}
                  >
                    <UserCheck className="h-3.5 w-3.5 mr-1.5" />
                    {request.assignedToId ? "Reassign Specialist" : "Assign Specialist"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Post-Completion Satisfaction Rating Card */}
            {request.status === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle>Satisfaction Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {request.rating ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < request.rating!.score
                                ? "text-amber-500 fill-amber-500"
                                : "text-[var(--border)]"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold ml-1.5">
                          {request.rating.score}/5 Stars
                        </span>
                      </div>
                      {request.rating.comment && (
                        <p className="text-xs italic text-[var(--foreground-muted)] bg-[var(--surface-hover)] p-2 rounded">
                          &ldquo;{request.rating.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  ) : isOwner ? (
                    <form onSubmit={handleSubmitRating} className="space-y-3">
                      <p className="text-xs text-[var(--foreground-muted)]">
                        How satisfied are you with this fulfillment?
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            type="button"
                            key={num}
                            onClick={() => setFeedbackRating(num)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                num <= feedbackRating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-[var(--border)] hover:text-amber-400"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <Textarea
                        placeholder="Leave a short review or comment (optional)..."
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        rows={2}
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="primary"
                        isLoading={isSubmittingFeedback}
                        className="w-full text-xs"
                      >
                        Submit Satisfaction Review
                      </Button>
                    </form>
                  ) : (
                    <div className="text-xs text-[var(--foreground-muted)]">
                      Awaiting applicant satisfaction submission.
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions Panel */}
            <Card className="no-print">
              <CardHeader>
                <CardTitle>Management Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Staff/Admin status transitions */}
                {isStaffOrAdmin && (
                  <Button
                    size="sm"
                    variant="primary"
                    className="w-full text-xs justify-start"
                    onClick={() => setStatusModalOpen(true)}
                  >
                    Transition Workflow Status &rarr;
                  </Button>
                )}

                {isStaffOrAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs justify-start"
                    onClick={() => setPriorityModalOpen(true)}
                  >
                    Adjust Urgency / Priority
                  </Button>
                )}

                {/* Student actions */}
                {isOwner && request.status === "pending" && (
                  <Button
                    size="sm"
                    variant="danger"
                    className="w-full text-xs justify-start"
                    onClick={handleCancelRequest}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                    Cancel Service Request
                  </Button>
                )}

                {isOwner && request.status === "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs justify-start"
                    onClick={() => setReopenModalOpen(true)}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reopen Request (Within 7 Days)
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modal: Transition Status */}
        <Modal
          isOpen={statusModalOpen}
          onClose={() => setStatusModalOpen(false)}
          title={`Transition Status — ${request.ticketId}`}
          description="Update the stage progression and record mandatory timeline justification."
        >
          <div className="space-y-4 my-2">
            <Select
              label="New Pipeline Status"
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as any)}
            >
              <option value="pending">Pending (Return to Intake)</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed (Resolution Fulfilled)</option>
              <option value="rejected">Declined / Rejected</option>
            </Select>

            <Textarea
              label="Transition Notes / Explanation"
              placeholder="Provide reason for this status change..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              rows={3}
              required
            />

            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
              <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleUpdateStatus}>
                Confirm Transition
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Assign Specialist */}
        <Modal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          title={`Assign Specialist — ${request.ticketId}`}
          description="Route this ticket to an active department member."
        >
          <div className="space-y-4 my-2">
            <Select
              label="Select Specialist"
              value={targetStaffId}
              onChange={(e) => setTargetStaffId(e.target.value)}
            >
              <option value="">Choose staff member...</option>
              {departmentStaff.map((st) => (
                <option key={st.uid} value={st.uid}>
                  {st.displayName} — {st.departmentName || st.role}
                </option>
              ))}
            </Select>

            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
              <Button variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAssign}
                disabled={!targetStaffId}
              >
                Assign
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Change Priority */}
        <Modal
          isOpen={priorityModalOpen}
          onClose={() => setPriorityModalOpen(false)}
          title={`Adjust Priority — ${request.ticketId}`}
          description="Change SLA urgency level for this ticket."
        >
          <div className="space-y-4 my-2">
            <Select
              label="Priority Level"
              value={targetPriority}
              onChange={(e) => setTargetPriority(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>

            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
              <Button variant="outline" size="sm" onClick={() => setPriorityModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleChangePriority}>
                Save Priority
              </Button>
            </div>
          </div>
        </Modal>

        {/* Modal: Reopen Ticket */}
        <Modal
          isOpen={reopenModalOpen}
          onClose={() => setReopenModalOpen(false)}
          title={`Reopen Ticket — ${request.ticketId}`}
          description="If your completed service requires follow-up, specify the reason."
        >
          <div className="space-y-4 my-2">
            <Textarea
              label="Reason for Reopening"
              placeholder="Explain why further attention is required..."
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              rows={3}
              required
            />

            <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
              <Button variant="outline" size="sm" onClick={() => setReopenModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReopenRequest}
                disabled={!reopenReason.trim()}
              >
                Reopen Ticket
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
