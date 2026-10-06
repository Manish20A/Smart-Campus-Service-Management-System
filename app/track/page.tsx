"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getStatusMeta, getPriorityMeta, formatDate, formatDateTime } from "@/lib/utils";

interface TrackedRequest {
  ticketId: string;
  serviceName: string;
  serviceCategory: string;
  departmentName: string;
  status: any;
  priority: any;
  estimatedCompletionAt: string;
  createdAt: string;
  completedAt?: string;
  isOverdue: boolean;
  escalated: boolean;
  timeline: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    actorRole: string;
    createdAt: string;
  }>;
}

export default function PublicTrackPage() {
  return (
    <DashboardLayout>
      <React.Suspense
        fallback={
          <div className="p-12 text-center text-xs text-[var(--foreground-muted)]">
            Loading ticket tracking gateway...
          </div>
        }
      >
        <PublicTrackContent />
      </React.Suspense>
    </DashboardLayout>
  );
}

function PublicTrackContent() {
  const searchParams = useSearchParams();
  const initialTicket = searchParams.get("id") || "";

  const [ticketInput, setTicketInput] = useState(initialTicket);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackedRequest | null>(null);

  const demoTickets = [
    { id: "CD-2026-00001", label: "CD-2026-00001", status: "In Progress", color: "text-[var(--accent)]" },
    { id: "CD-2026-00014", label: "CD-2026-00014", status: "Assigned", color: "text-blue-600 dark:text-blue-400" },
    { id: "CD-2026-00032", label: "CD-2026-00032", status: "Completed", color: "text-emerald-600 dark:text-emerald-400" },
    { id: "CD-2026-00023", label: "CD-2026-00023", status: "Overdue", color: "text-red-600 dark:text-red-400" },
  ];

  const fetchTicket = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      // 1. Normalize ID format (e.g. "43" -> "CD-2026-00043")
      let normalized = id.trim().toUpperCase();
      if (/^\d+$/.test(normalized)) {
        normalized = `CD-2026-${normalized.padStart(5, "0")}`;
      } else if (/^CD-(\d+)$/i.test(normalized)) {
        const digits = normalized.replace(/^CD-/i, "");
        normalized = `CD-2026-${digits.padStart(5, "0")}`;
      } else if (/^CD-2026-(\d+)$/i.test(normalized)) {
        const digits = normalized.replace(/^CD-2026-/i, "");
        normalized = `CD-2026-${digits.padStart(5, "0")}`;
      }

      // 2. Check client-side dataStore first (contains all requests created in this browser session!)
      const clientReq =
        dataStore.getRequestById(normalized) ||
        dataStore.getRequestById(id.trim()) ||
        dataStore.getRequests().find(
          (r) =>
            r.ticketId.toUpperCase() === normalized ||
            r.ticketId.toUpperCase() === id.trim().toUpperCase() ||
            r.id.toLowerCase() === id.trim().toLowerCase()
        );

      if (clientReq) {
        const events = dataStore.getEvents(clientReq.id);
        setResult({
          ticketId: clientReq.ticketId,
          serviceName: clientReq.serviceName,
          serviceCategory: clientReq.serviceCategory,
          departmentName: clientReq.departmentName,
          status: clientReq.status,
          priority: clientReq.priority,
          estimatedCompletionAt: clientReq.estimatedCompletionAt,
          createdAt: clientReq.createdAt,
          completedAt: clientReq.completedAt,
          isOverdue: clientReq.isOverdue,
          escalated: clientReq.escalated,
          timeline: events.map((ev) => ({
            id: ev.id,
            type: ev.type,
            title: ev.title,
            description: ev.description,
            actorRole: ev.actorRole,
            createdAt: ev.createdAt,
          })),
        });
        return;
      }

      // 3. Fallback to server tracking API route
      const res = await fetch(`/api/track/${encodeURIComponent(normalized)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ticket not found");
      }
      setResult(data.request);
    } catch (err: any) {
      setError(err.message || "Unable to look up ticket.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicket) {
      fetchTicket(initialTicket);
    }
  }, [initialTicket]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicket(ticketInput);
  };

  const handleSelectDemo = (ticketId: string) => {
    setTicketInput(ticketId);
    fetchTicket(ticketId);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 sm:p-8 shadow-xs text-center space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold inline-block">
          Universal Status Lookup
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
          Track a Service Request
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-md mx-auto leading-relaxed">
          Enter any ticket identifier to check milestone progression, department assignment, and SLA turnaround.
        </p>

        {/* Search Input Form */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-md mx-auto pt-2"
        >
          <Input
            type="text"
            placeholder="e.g. CD-2026-00001"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            className="h-11 font-mono text-center tracking-wide uppercase text-sm"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="h-11 px-5 shrink-0"
          >
            <Search className="h-4 w-4 mr-1.5" />
            Track
          </Button>
        </form>

        {/* 1-Click Demo Ticket Chips */}
        <div className="pt-2">
          <span className="text-[11px] text-[var(--foreground-subtle)] block mb-1.5 font-medium">
            Or test with one of these sample tickets:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {demoTickets.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleSelectDemo(d.id)}
                className="px-2.5 py-1 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-xs font-mono transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <span className="font-semibold">{d.label}</span>
                <span className={`text-[10px] font-sans ${d.color}`}>({d.status})</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-[8px] bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-600 dark:text-red-400 mt-3 max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Results View */}
      {result && (
        <div className="space-y-6 animate-in fade-in-0 duration-200">
          <Card className="overflow-hidden border border-[var(--border)] shadow-xs">
            <div className="p-6 border-b border-[var(--border-subtle)] bg-[var(--surface-hover)]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-[var(--accent)]">
                    {result.ticketId}
                  </span>
                  <span className="text-xs text-[var(--foreground-subtle)]">&bull;</span>
                  <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {result.departmentName}
                  </span>
                </div>
                <h2 className="text-lg font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1.5">
                  {result.serviceName}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <ProgressRing
                  startDate={result.createdAt}
                  targetDate={result.estimatedCompletionAt}
                  completed={result.status === "completed"}
                  size={52}
                  strokeWidth={4}
                />
                <div className="space-y-1">
                  {(() => {
                    const sm = getStatusMeta(result.status);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${sm.badgeClass}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${sm.dotColor}`} />
                        {sm.label}
                      </span>
                    );
                  })()}
                  <div className="text-[11px] font-mono text-[var(--foreground-muted)]">
                    Target: {formatDate(result.estimatedCompletionAt)}
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Meta details strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[8px] bg-[var(--surface-hover)]/40 border border-[var(--border)] text-xs">
                <div>
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wider block">
                    Submitted
                  </span>
                  <span className="font-mono text-[var(--foreground)] mt-0.5 block">
                    {formatDate(result.createdAt)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wider block">
                    Priority Level
                  </span>
                  <span className="capitalize text-[var(--foreground)] mt-0.5 block font-medium">
                    {result.priority}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wider block">
                    Resolution Status
                  </span>
                  <span className="text-[var(--foreground)] mt-0.5 block">
                    {result.status === "completed"
                      ? "Fulfilled"
                      : result.isOverdue
                      ? "Overdue / Escalated"
                      : "On Schedule"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase tracking-wider block">
                    Privacy Shield
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
                    <ShieldCheck className="h-3 w-3" />
                    Sanitized View
                  </span>
                </div>
              </div>

              {/* Animated Progression Timeline */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-subtle)] mb-4">
                  Milestones & Progression Timeline
                </h3>

                <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--border)]">
                  {result.timeline.map((ev, i) => (
                    <div key={ev.id || i} className="relative group">
                      <div className="absolute -left-6 top-1 h-4 w-4 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[var(--foreground)]">
                            {ev.title}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                            {formatDateTime(ev.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                          {ev.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
