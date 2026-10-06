"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { ServiceRequest, RequestStatus } from "@/types";
import {
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Building2,
  Compass,
  LayoutGrid,
  List,
  Sparkles,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusMeta, getPriorityMeta, formatDate, formatTimeAgo } from "@/lib/utils";

export default function StudentRequestsPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

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

  const popularShortcuts = [
    { name: "Academic Transcript", id: "srv-official-transcript", dept: "Registrar", time: "48h SLA" },
    { name: "Lab Equipment Pass", id: "srv-lab-equipment", dept: "CSE Dept", time: "24h SLA" },
    { name: "Room Maintenance", id: "srv-room-repair", dept: "Facilities", time: "24h SLA" },
    { name: "Wi-Fi & IT Clearance", id: "srv-wifi-mac", dept: "IT Support", time: "12h SLA" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] text-xs font-medium mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                Student Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--foreground)] tracking-tight">
                Welcome back, {user?.displayName?.split(" ")[0] || "Student"}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                You have <span className="font-semibold text-[var(--foreground)]">{activeCount} active requests</span> in progress and <span className="font-semibold text-[var(--foreground)]">{completedCount} resolved</span> tickets.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link href="/services">
                <Button variant="primary" size="md" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Request
                </Button>
              </Link>
              <Link href="/track">
                <Button variant="outline" size="md" className="text-xs">
                  Public Tracker
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-5 pt-5 border-t border-[var(--border-subtle)]">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)] block mb-2.5">
              Popular Services:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {popularShortcuts.map((sc) => (
                <Link
                  key={sc.id}
                  href={`/services/${sc.id}/apply`}
                  className="p-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all group flex flex-col justify-between"
                >
                  <span className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] truncate">
                    {sc.name}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-[var(--foreground-subtle)] mt-1.5">
                    <span>{sc.dept}</span>
                    <span className="font-mono">{sc.time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Requests Management Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                Active ({activeCount})
              </button>
              <button
                onClick={() => setTab("completed")}
                className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer ${
                  tab === "completed"
                    ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>

            {/* Controls: Search + View Mode */}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full sm:w-56 text-xs"
              />

              {/* View Switcher */}
              <div className="flex items-center p-0.5 border border-[var(--border)] rounded-[6px] bg-[var(--surface-elevated)] shrink-0">
                <button
                  type="button"
                  title="Card View"
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  title="Table View"
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-[4px] transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* List of Requests */}
          {filteredRequests.length > 0 ? (
            viewMode === "cards" ? (
              /* Friendly Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRequests.map((req) => {
                  const statusMeta = getStatusMeta(req.status);
                  const priorityMeta = getPriorityMeta(req.priority);

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                    >
                      {/* Card Header */}
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-medium text-[var(--accent)] bg-[var(--surface-elevated)] px-2 py-0.5 rounded border border-[var(--border)]">
                            {req.ticketId}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`} />
                            {statusMeta.label}
                          </span>
                        </div>

                        <h3 className="font-serif text-base font-semibold text-[var(--foreground)] mt-1">
                          {req.serviceName}
                        </h3>
                        <p className="text-xs text-[var(--foreground-muted)] flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3 shrink-0" />
                          {req.departmentName}
                        </p>

                        {req.description && (
                          <p className="text-xs text-[var(--foreground-subtle)] mt-2 line-clamp-2 bg-[var(--surface-hover)]/40 p-2 rounded-[6px]">
                            {req.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                        <div className="text-[11px] text-[var(--foreground-muted)] flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Submitted {formatTimeAgo(req.createdAt)}</span>
                        </div>

                        <Link href={`/requests/${req.id}`}>
                          <Button size="sm" variant="outline" className="text-xs h-7 gap-1">
                            View Status &rarr;
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Table View */
              <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 text-[var(--foreground-subtle)] font-medium uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Ticket</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Expected Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--foreground)]">
                      {filteredRequests.map((req) => {
                        const statusMeta = getStatusMeta(req.status);
                        return (
                          <tr key={req.id} className="hover:bg-[var(--surface-hover)]/50 transition-colors">
                            <td className="py-3 px-4 font-mono font-medium text-[var(--accent)]">
                              <Link href={`/requests/${req.id}`} className="hover:underline">
                                {req.ticketId}
                              </Link>
                            </td>
                            <td className="py-3 px-4 font-medium">
                              <Link href={`/requests/${req.id}`} className="hover:text-[var(--accent)]">
                                {req.serviceName}
                              </Link>
                            </td>
                            <td className="py-3 px-4 text-[var(--foreground-muted)]">{req.departmentName}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`} />
                                {statusMeta.label}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[var(--foreground-muted)] font-mono text-[11px]">
                              {formatDate(req.estimatedCompletionAt)}
                            </td>
                            <td className="py-3 px-4 text-right">
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
            )
          ) : (
            <EmptyState
              title="No service requests found"
              description={
                tab === "all"
                  ? "You have not submitted any service requests yet. Pick a service above or browse our catalog."
                  : `No requests currently in "${tab}".`
              }
              action={
                <Link href="/services">
                  <Button variant="primary" size="sm">
                    Browse All Services
                  </Button>
                </Link>
              }
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
