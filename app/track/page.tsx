"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
    <React.Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-8 text-xs text-[var(--foreground-muted)]">Loading ticket tracking gateway...</div>}>
      <PublicTrackContent />
    </React.Suspense>
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
      const res = await fetch(`/api/track/${encodeURIComponent(id.trim())}`);
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col">
      {/* Top Simple Nav */}
      <header className="h-16 border-b border-[var(--border)] px-6 flex items-center justify-between bg-[var(--surface)]/80 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
            C
          </div>
          <span className="font-serif text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
            CampusDesk
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/services">
            <Button variant="outline" size="sm">
              Services Catalog
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Track Section */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Public Registry Lookup
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
            Track Service Request
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] max-w-md mx-auto leading-relaxed">
            Enter your ticket ID to check real-time progression and milestones.
          </p>

          {/* Search Form */}
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

          {/* Instant 1-Click Demo Ticket Chips */}
          <div className="pt-2">
            <span className="text-[11px] text-[var(--foreground-subtle)] block mb-1.5 font-medium">
              Click any demo ticket to test instant tracking:
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

        {/* Results Card */}
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
                      Resolution
                    </span>
                    <span className="text-[var(--foreground)] mt-0.5 block">
                      {result.status === "completed" ? "Fulfilled" : result.isOverdue ? "Overdue / Escalated" : "On Schedule"}
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

                {/* Animated Vertical Timeline */}
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

            <div className="p-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[var(--foreground-muted)]">
              <span>Are you the applicant? Sign in to view private comments and download receipts.</span>
              <Link href="/auth/login">
                <Button size="sm" variant="outline" className="text-xs shrink-0">
                  Sign In to Full Portal &rarr;
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-6 px-6 text-center text-xs text-[var(--foreground-muted)]">
        CampusDesk Smart Service Management System &bull; Public Verification Gateway
      </footer>
    </div>
  );
}
