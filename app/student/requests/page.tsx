"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { ServiceRequest, RequestStatus } from "@/types";
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusMeta, getPriorityMeta, formatDate } from "@/lib/utils";

export default function StudentRequestsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"all" | "active" | "completed" | "overdue">("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "due">("newest");

  const myRequests = useMemo(() => {
    if (!user?.uid) return [];
    return dataStore.getRequests({ studentId: user.uid });
  }, [user]);

  const filteredRequests = useMemo(() => {
    let list = [...myRequests];

    if (tab === "active") {
      list = list.filter((r) => ["pending", "assigned", "in_progress", "reopened"].includes(r.status));
    } else if (tab === "completed") {
      list = list.filter((r) => r.status === "completed");
    } else if (tab === "overdue") {
      list = list.filter((r) => r.isOverdue);
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

    if (sortOrder === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOrder === "oldest") {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortOrder === "due") {
      list.sort((a, b) => new Date(a.estimatedCompletionAt).getTime() - new Date(b.estimatedCompletionAt).getTime());
    }

    return list;
  }, [myRequests, tab, search, sortOrder]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
              My Service Requests
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Track resolution milestones, communicate with staff specialists, and submit feedback.
            </p>
          </div>

          <Link href="/services">
            <Button variant="primary" size="md" className="gap-2">
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[var(--surface-hover)] border border-[var(--border)] rounded-[8px]">
            <button
              onClick={() => setTab("all")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "all"
                  ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              All ({myRequests.length})
            </button>
            <button
              onClick={() => setTab("active")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "active"
                  ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setTab("completed")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "completed"
                  ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setTab("overdue")}
              className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                tab === "overdue"
                  ? "bg-[var(--surface-elevated)] text-red-600 dark:text-red-400 shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              Overdue
            </button>
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by ticket ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-64 text-xs"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="h-9 px-2.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--foreground)] cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="due">Due date</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        {filteredRequests.length > 0 ? (
          <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 text-[var(--foreground-subtle)] font-medium uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Target Resolution</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--foreground)]">
                  {filteredRequests.map((req) => {
                    const statusMeta = getStatusMeta(req.status);
                    const priorityMeta = getPriorityMeta(req.priority);

                    return (
                      <tr
                        key={req.id}
                        className="hover:bg-[var(--surface-hover)]/50 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-[var(--accent)]">
                          <Link href={`/requests/${req.id}`} className="hover:underline">
                            {req.ticketId}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 font-medium max-w-[220px] truncate">
                          <Link href={`/requests/${req.id}`} className="hover:text-[var(--accent)]">
                            {req.serviceName}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-[var(--foreground-muted)]">
                          {req.departmentName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`} />
                            {statusMeta.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${priorityMeta.badgeClass}`}
                          >
                            {priorityMeta.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--foreground-muted)]">
                          {formatDate(req.estimatedCompletionAt)}
                          {req.isOverdue && (
                            <span className="ml-1.5 text-red-600 dark:text-red-400 font-semibold font-sans">
                              (Overdue)
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link href={`/requests/${req.id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs px-2 gap-1">
                              View
                              <ArrowRight className="h-3 w-3" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No service requests found"
            description={
              tab === "all"
                ? "You have not submitted any service requests yet. Browse the catalog to begin."
                : `No requests matching the "${tab}" filter.`
            }
            action={
              <Link href="/services">
                <Button variant="primary" size="sm">
                  Browse Service Catalog
                </Button>
              </Link>
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
}
