"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Service, RequestPriority, ServiceRequest } from "@/types";
import {
  Clock,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

export default function ApplyServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const { id: serviceId } = use(params);

  const [service, setService] = useState<Service | null>(null);
  const [duplicateReq, setDuplicateReq] = useState<ServiceRequest | null>(null);
  const [priority, setPriority] = useState<RequestPriority>("normal");
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<ServiceRequest | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    const srv = dataStore.getServiceById(serviceId);
    if (srv) {
      setService(srv);
      setPriority(srv.defaultPriority);

      // Initialize form fields
      const initial: Record<string, any> = {};
      srv.requiredFields.forEach((f) => {
        initial[f.id] = f.defaultValue || "";
      });
      setFormData(initial);

      // Check for duplicate open request
      if (user?.uid) {
        const openDup = dataStore.getOpenDuplicateRequest(user.uid, srv.id);
        if (openDup) {
          setDuplicateReq(openDup);
        }
      }
    }
  }, [serviceId, user]);

  if (!service) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <p className="text-sm text-[var(--foreground)]">Loading service details...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate dynamic SLA based on selected priority
  const slaMultiplier = priority === "urgent" ? 0.5 : priority === "high" ? 0.75 : 1.0;
  const effectiveSlaHours = Math.max(1, Math.round(service.slaHours * slaMultiplier));
  const estimatedDate = new Date(Date.now() + effectiveSlaHours * 60 * 60 * 1000);

  const handleFieldChange = (fieldId: string, val: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toastError("Please log in to submit a request.");
      return;
    }

    // Validate required fields
    for (const field of service.requiredFields) {
      if (field.required && (!formData[field.id] || String(formData[field.id]).trim() === "")) {
        toastError(`Please complete required field: "${field.label}"`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const created = await dataStore.createRequest({
        serviceId: service.id,
        student: user,
        priority,
        description: description.trim() || `Application for ${service.name}`,
        customData: formData,
        attachmentUrl: attachmentUrl.trim() || undefined,
      });

      // Dispatch async email notification
      fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: user.email,
          recipientName: user.displayName,
          eventType: "request_created",
          ticketId: created.ticketId,
          serviceName: service.name,
          priority: created.priority,
          requestId: created.id,
        }),
      }).catch((err) => console.log("Email dispatch notification handled:", err));

      setSubmittedRequest(created);
      success("Service request submitted successfully!");
    } catch (err: any) {
      toastError(err.message || "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (submittedRequest) {
      navigator.clipboard.writeText(submittedRequest.ticketId);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Service Catalog
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              {service.code}
            </span>
            <span className="text-[11px] text-[var(--foreground-subtle)]">&bull;</span>
            <span className="text-[11px] text-[var(--foreground-muted)] font-medium">
              {service.departmentName}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
            {service.name}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1.5 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Duplicate Request Warning Banner */}
        {duplicateReq && (
          <div className="rounded-[8px] border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 p-4 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                Notice: You currently have an active ticket for this service.
              </p>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Ticket <strong className="font-mono">{duplicateReq.ticketId}</strong> is currently {duplicateReq.status.replace("_", " ").toUpperCase()}. You may submit a duplicate if this is a distinct instance.
              </p>
              <Link
                href={`/requests/${duplicateReq.id}`}
                className="inline-block mt-1 text-[var(--accent)] hover:underline font-medium"
              >
                View Existing Ticket &rarr;
              </Link>
            </div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intake Specifications</CardTitle>
              <CardDescription>
                Provide the mandatory verification details required by {service.departmentName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dynamic Fields */}
              {service.requiredFields.map((field) => {
                if (field.type === "select") {
                  return (
                    <Select
                      key={field.id}
                      label={field.label}
                      required={field.required}
                      hint={field.helpText}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    >
                      <option value="">Select option...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </Select>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <Textarea
                      key={field.id}
                      label={field.label}
                      required={field.required}
                      placeholder={field.placeholder}
                      hint={field.helpText}
                      value={formData[field.id] || ""}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      rows={3}
                    />
                  );
                }

                return (
                  <Input
                    key={field.id}
                    label={field.label}
                    type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    hint={field.helpText}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  />
                );
              })}

              {/* Priority Selector with Live SLA Computation */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="block text-xs font-medium text-[var(--foreground)]">
                  Urgency & Priority Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["low", "normal", "high", "urgent"] as RequestPriority[]).map((p) => {
                    const isSelected = priority === p;
                    const mult = p === "urgent" ? 0.5 : p === "high" ? 0.75 : 1.0;
                    const hrs = Math.max(1, Math.round(service.slaHours * mult));

                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`p-3 rounded-[8px] border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-[var(--accent)] bg-[var(--accent-subtle)]/40 ring-1 ring-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--foreground-subtle)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold capitalize text-[var(--foreground)]">
                            {p}
                          </span>
                          {p === "urgent" && (
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[var(--accent)] text-white">
                              -50% SLA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[var(--foreground-muted)] mt-1 font-mono">
                          ~{hrs}h turnaround
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Turnaround Summary */}
              <div className="rounded-[8px] bg-[var(--surface-hover)] p-3 flex items-center justify-between text-xs border border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--accent)]" />
                  <span className="text-[var(--foreground)]">
                    Estimated Resolution:
                  </span>
                </div>
                <div className="font-mono font-medium text-[var(--foreground)] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[var(--foreground-muted)]" />
                  {formatDate(estimatedDate)} ({effectiveSlaHours} hours)
                </div>
              </div>

              {/* Optional Description / Applicant Note */}
              <Textarea
                label="Additional Context / Remarks (Optional)"
                placeholder="Include any relevant scheduling or reference constraints..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />

              {/* URL Attachment Link */}
              <Input
                label="Supporting Document / Cloud URL (Optional)"
                type="url"
                placeholder="https://drive.google.com/file/d/... or link to project doc"
                hint="Use shareable cloud links (Google Drive, OneDrive, GitHub, etc.)"
                value={attachmentUrl}
                onChange={(e) => setAttachmentUrl(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Link href="/services">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
            >
              Submit Service Request
            </Button>
          </div>
        </form>

        {/* Confirmation Screen / Modal */}
        {submittedRequest && (
          <Modal
            isOpen={!!submittedRequest}
            onClose={() => router.push(`/requests/${submittedRequest.id}`)}
            maxWidth="md"
          >
            <div className="text-center py-4 space-y-4">
              <div className="h-12 w-12 rounded-full bg-[var(--sage-subtle)] text-[var(--sage)] mx-auto flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-lg font-serif font-semibold text-[var(--foreground)]">
                  Request Confirmed & Registered
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-sm mx-auto">
                  Your application has been assigned an immutable ticket identifier and routed to the intake queue.
                </p>
              </div>

              {/* Ticket ID Box */}
              <div className="p-4 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] max-w-xs mx-auto space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
                  Unique Ticket ID
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-xl font-bold tracking-tight text-[var(--accent)]">
                    {submittedRequest.ticketId}
                  </span>
                  <button
                    onClick={copyTicketId}
                    className="p-1 rounded text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
                    title="Copy Ticket ID"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                {hasCopied && (
                  <p className="text-[10px] text-[var(--sage)] font-medium">Copied to clipboard!</p>
                )}
              </div>

              <div className="text-xs text-[var(--foreground-muted)] space-y-1">
                <p>
                  Target SLA: <strong>{formatDate(submittedRequest.estimatedCompletionAt)}</strong>
                </p>
                <p>
                  Department: <strong>{submittedRequest.departmentName}</strong>
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => router.push("/student/requests")}
                >
                  My Requests List
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => router.push(`/requests/${submittedRequest.id}`)}
                >
                  View Live Tracking &rarr;
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
