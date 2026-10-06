"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { Plus, ArrowRight, Search, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getStatusMeta, formatDate } from "@/lib/utils";

export default function StudentRequestsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  const myRequests = useMemo(() => {
    if (!user?.uid) return [];
    return dataStore.getRequests({ studentId: user.uid });
  }, [user]);

  const activeCount = useMemo(
    () => myRequests.filter((r) => ["pending", "assigned", "in_progress", "reopened"].includes(r.status)).length,
    [myRequests]
  );

  const completedCount = useMemo(
    () => myRequests.filter((r) => r.status === "completed").length,
    [myRequests]
  );

  const filteredRequests = useMemo(() => {
    let list = [...myRequests];

    if (tab === "active") {
      list = list.filter((r) => ["pending", "assigned", "in_progress", "reopened"].includes(r.status));
    } else if (tab === "completed") {
      list = list.filter((r) => r.status === "completed");
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.ticketId.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q) ||
          r.departmentName.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [myRequests, tab, search]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Simple, Calm Header */}
        <div className="flex items-center justify-between pt-2 pb-1">
          <div>
            <h1 className="text-2xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
              My Requests
            </h1>
            <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
              Track the progress and status of your campus submissions.
            </p>
          </div>

          <Link href="/services">
            <Button variant="primary" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Clean Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
          {/* Subtle text tabs */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "all"
                  ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All ({myRequests.length})
            </button>
            <button
              onClick={() => setTab("active")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "active"
                  ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              In Progress ({activeCount})
            </button>
            <button
              onClick={() => setTab("completed")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "completed"
                  ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Resolved ({completedCount})
            </button>
          </div>

          {/* Simple search input */}
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
            <input
              type="text"
              placeholder="Search by title or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Calm Request List (Clean rows, no nested card clutter) */}
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border)] rounded-[10px] bg-[var(--surface)] overflow-hidden">
            {filteredRequests.map((req) => {
              const statusMeta = getStatusMeta(req.status);

              return (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}`}
                  className="flex items-center justify-between p-4 hover:bg-[var(--surface-hover)]/40 transition-colors group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-medium text-[var(--accent)]">
                        {req.ticketId}
                      </span>
                      <span className="text-[11px] text-[var(--foreground-subtle)]">&bull;</span>
                      <span className="text-[11px] text-[var(--foreground-muted)] truncate">
                        {req.departmentName}
                      </span>
                    </div>

                    <h3 className="text-sm font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                      {req.serviceName}
                    </h3>

                    <div className="text-[11px] text-[var(--foreground-subtle)]">
                      Submitted {formatDate(req.createdAt)} &bull; Expected by {formatDate(req.estimatedCompletionAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`} />
                      {statusMeta.label}
                    </span>

                    <ArrowRight className="h-4 w-4 text-[var(--foreground-subtle)] group-hover:text-[var(--foreground)] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[10px] bg-[var(--surface)] p-6 space-y-3">
            <div className="h-10 w-10 rounded-full bg-[var(--surface-hover)] flex items-center justify-center mx-auto text-[var(--foreground-muted)]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">No requests found</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">
                {tab === "all"
                  ? "You haven't submitted any service requests yet."
                  : `No requests currently marked as "${tab}".`}
              </p>
            </div>
            <Link href="/services">
              <Button variant="primary" size="sm" className="mt-2 text-xs">
                Browse Services &rarr;
              </Button>
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
