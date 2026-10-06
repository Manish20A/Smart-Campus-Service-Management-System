"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { ServiceRequest, RequestStatus, RequestPriority } from "@/types";
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  Square,
  ArrowRight,
  UserCheck,
  RefreshCw,
  AlertTriangle,
  Bookmark,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import { getStatusMeta, getPriorityMeta, formatDate } from "@/lib/utils";

interface RequestsTableManagerProps {
  title: string;
  subtitle: string;
  departmentScopeOnly?: boolean;
}

export function RequestsTableManager(props: RequestsTableManagerProps) {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-[var(--foreground-muted)]">Loading requests queue...</div>}>
      <RequestsTableContent {...props} />
    </React.Suspense>
  );
}

function RequestsTableContent({
  title,
  subtitle,
  departmentScopeOnly = false,
}: RequestsTableManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, role } = useAuth();
  const { success, error: toastError } = useToast();

  // URL state sync
  const initialStatus = searchParams.get("status") || "all";
  const initialPriority = searchParams.get("priority") || "all";
  const initialDept = searchParams.get("dept") || "all";
  const initialSearch = searchParams.get("q") || "";
  const initialOverdue = searchParams.get("overdue") === "true";

  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [priorityFilter, setPriorityFilter] = useState<string>(initialPriority);
  const [departmentFilter, setDepartmentFilter] = useState<string>(initialDept);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [overdueOnly, setOverdueOnly] = useState(initialOverdue);

  // Active saved view
  const [activeView, setActiveView] = useState<string>("all");

  // Selection & Keyboard navigation
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Bulk action modals
  const [bulkStatusModal, setBulkStatusModal] = useState(false);
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [bulkTargetStatus, setBulkTargetStatus] = useState<RequestStatus>("in_progress");
  const [bulkTargetStaffId, setBulkTargetStaffId] = useState("");
  const [bulkNote, setBulkNote] = useState("");

  const departments = useMemo(() => dataStore.getDepartments(), []);
  const staffMembers = useMemo(
    () => dataStore.getUsers().filter((u) => u.role === "staff" || u.role === "admin"),
    []
  );

  // Fetch requests based on scope
  const allRequests = useMemo(() => {
    if (departmentScopeOnly && user?.departmentId) {
      return dataStore.getRequests({ departmentId: user.departmentId });
    }
    return dataStore.getRequests();
  }, [departmentScopeOnly, user]);

  // Apply filters
  const filteredRequests = useMemo(() => {
    let list = [...allRequests];

    if (activeView === "urgent_overdue") {
      list = list.filter((r) => r.isOverdue || r.priority === "urgent");
    } else if (activeView === "unassigned") {
      list = list.filter((r) => !r.assignedToId && r.status === "pending");
    } else if (activeView === "in_progress") {
      list = list.filter((r) => r.status === "in_progress");
    } else if (activeView === "completed") {
      list = list.filter((r) => r.status === "completed");
    }

    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    if (priorityFilter !== "all") {
      list = list.filter((r) => r.priority === priorityFilter);
    }
    if (departmentFilter !== "all") {
      list = list.filter((r) => r.departmentId === departmentFilter);
    }
    if (overdueOnly) {
      list = list.filter((r) => r.isOverdue);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.ticketId.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          (r.assignedToName && r.assignedToName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [
    allRequests,
    activeView,
    statusFilter,
    priorityFilter,
    departmentFilter,
    overdueOnly,
    searchQuery,
  ]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredRequests.length - 1));
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filteredRequests[selectedIndex]) {
        e.preventDefault();
        router.push(`/requests/${filteredRequests[selectedIndex].id}`);
      } else if (e.key === "a" && filteredRequests[selectedIndex]) {
        e.preventDefault();
        setSelectedIds([filteredRequests[selectedIndex].id]);
        setBulkAssignModal(true);
      } else if (e.key === "s" && filteredRequests[selectedIndex]) {
        e.preventDefault();
        setSelectedIds([filteredRequests[selectedIndex].id]);
        setBulkStatusModal(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredRequests, selectedIndex, router]);

  // Bulk Actions
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRequests.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkStatusUpdate = () => {
    if (!user || selectedIds.length === 0) return;
    try {
      selectedIds.forEach((id) => {
        dataStore.updateStatus(id, bulkTargetStatus, bulkNote || "Bulk status update", user);
      });
      success(`Updated status for ${selectedIds.length} request(s).`);
      setBulkStatusModal(false);
      setSelectedIds([]);
      setBulkNote("");
    } catch (err: any) {
      toastError(err.message || "Bulk status update failed.");
    }
  };

  const handleBulkAssign = () => {
    if (!user || !bulkTargetStaffId || selectedIds.length === 0) return;
    try {
      selectedIds.forEach((id) => {
        dataStore.assignRequest(id, bulkTargetStaffId, user);
      });
      success(`Assigned ${selectedIds.length} request(s).`);
      setBulkAssignModal(false);
      setSelectedIds([]);
    } catch (err: any) {
      toastError(err.message || "Bulk assignment failed.");
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      "Ticket ID",
      "Service",
      "Department",
      "Student Name",
      "Student ID",
      "Status",
      "Priority",
      "Assigned To",
      "Overdue",
      "Created At",
      "Target SLA",
    ];

    const rows = filteredRequests.map((r) => [
      r.ticketId,
      `"${r.serviceName.replace(/"/g, '""')}"`,
      `"${r.departmentName}"`,
      `"${r.studentName}"`,
      r.studentRollNumber || "",
      r.status,
      r.priority,
      r.assignedToName || "Unassigned",
      r.isOverdue ? "Yes" : "No",
      r.createdAt,
      r.estimatedCompletionAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `campusdesk-export-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success("Exported request records to CSV.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Operational Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Saved View Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-[var(--border-subtle)]">
        {[
          { id: "all", label: `All Tickets (${allRequests.length})` },
          { id: "urgent_overdue", label: "My Urgent & Overdue" },
          { id: "unassigned", label: "Unassigned Intake" },
          { id: "in_progress", label: "In Progress" },
          { id: "completed", label: "Resolved" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveView(tab.id);
              setSelectedIndex(0);
            }}
            className={`px-3 py-1.5 text-xs rounded-t-[6px] font-medium transition-colors border-b-2 cursor-pointer ${
              activeView === tab.id
                ? "border-[var(--accent)] text-[var(--foreground)] font-semibold bg-[var(--surface-hover)]/30"
                : "border-transparent text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        <Input
          type="text"
          placeholder="Search ticket, title, student..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 text-xs"
        />

        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 text-xs"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Declined</option>
          <option value="reopened">Reopened</option>
        </Select>

        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-9 text-xs"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </Select>

        {!departmentScopeOnly && (
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-9 text-xs"
          >
            <option value="all">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        )}

        <label className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--foreground)] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={overdueOnly}
            onChange={(e) => setOverdueOnly(e.target.checked)}
            className="rounded border-[var(--border)] text-[var(--accent)]"
          />
          <span className="text-red-600 dark:text-red-400 font-medium">Overdue Only</span>
        </label>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--accent)]">
              {selectedIds.length} ticket(s) selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkAssignModal(true)}
              className="text-xs gap-1"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Assign Specialist
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setBulkStatusModal(true)}
              className="text-xs gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Update Status
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredRequests.length > 0 ? (
        <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 text-[var(--foreground-subtle)] font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-8">
                    <button
                      onClick={toggleSelectAll}
                      className="p-0.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
                    >
                      {selectedIds.length === filteredRequests.length ? (
                        <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Ticket ID</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Target SLA</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--foreground)]">
                {filteredRequests.map((req, idx) => {
                  const statusMeta = getStatusMeta(req.status);
                  const priorityMeta = getPriorityMeta(req.priority);
                  const isSelected = selectedIds.includes(req.id);
                  const isFocused = idx === selectedIndex;

                  return (
                    <tr
                      key={req.id}
                      onClick={() => setSelectedIndex(idx)}
                      className={`transition-colors cursor-pointer ${
                        isFocused
                          ? "bg-[var(--accent-subtle)]/20 ring-1 ring-inset ring-[var(--accent)]/40"
                          : "hover:bg-[var(--surface-hover)]/50"
                      } ${isSelected ? "bg-[var(--surface-hover)]" : ""}`}
                    >
                      <td className="py-3.5 px-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSelectRow(req.id)}
                          className="p-0.5 text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-[var(--accent)]" />
                          ) : (
                            <Square className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-medium text-[var(--accent)] whitespace-nowrap">
                        <Link href={`/requests/${req.id}`} className="hover:underline">
                          {req.ticketId}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium max-w-[200px] truncate">
                        <Link href={`/requests/${req.id}`} className="hover:text-[var(--accent)]">
                          {req.serviceName}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--foreground-muted)] whitespace-nowrap">
                        <div>{req.studentName}</div>
                        {req.studentRollNumber && (
                          <div className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                            {req.studentRollNumber}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusMeta.badgeClass}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotColor}`} />
                          {statusMeta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${priorityMeta.badgeClass}`}
                        >
                          {priorityMeta.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[var(--foreground-muted)] whitespace-nowrap">
                        {req.assignedToName ? (
                          <div className="flex items-center gap-1.5">
                            <div className="h-5 w-5 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center font-serif text-[10px] font-medium">
                              {req.assignedToName[0]}
                            </div>
                            <span className="truncate max-w-[120px]">{req.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-[var(--foreground-subtle)] italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                        <span
                          className={
                            req.isOverdue
                              ? "text-red-600 dark:text-red-400 font-semibold"
                              : "text-[var(--foreground-muted)]"
                          }
                        >
                          {formatDate(req.estimatedCompletionAt)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link href={`/requests/${req.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2 gap-1">
                            Inspect
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
          title="No requests matching current parameters"
          description="Adjust your filters or active view tab to surface matching tickets."
        />
      )}

      {/* Bulk Status Modal */}
      <Modal
        isOpen={bulkStatusModal}
        onClose={() => setBulkStatusModal(false)}
        title={`Update Status (${selectedIds.length} tickets)`}
        description="Batch transition pipeline stage for all selected service tickets."
      >
        <div className="space-y-4 my-2">
          <Select
            label="Target Status"
            value={bulkTargetStatus}
            onChange={(e) => setBulkTargetStatus(e.target.value as any)}
          >
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Declined</option>
          </Select>

          <Textarea
            label="Audit Log Explanation"
            placeholder="Reason for bulk progression..."
            value={bulkNote}
            onChange={(e) => setBulkNote(e.target.value)}
            rows={2}
          />

          <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
            <Button variant="outline" size="sm" onClick={() => setBulkStatusModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleBulkStatusUpdate}>
              Apply to {selectedIds.length} Tickets
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bulk Assign Modal */}
      <Modal
        isOpen={bulkAssignModal}
        onClose={() => setBulkAssignModal(false)}
        title={`Batch Assign Specialist (${selectedIds.length} tickets)`}
        description="Assign all selected tickets to a staff specialist."
      >
        <div className="space-y-4 my-2">
          <Select
            label="Staff Specialist"
            value={bulkTargetStaffId}
            onChange={(e) => setBulkTargetStaffId(e.target.value)}
          >
            <option value="">Select team member...</option>
            {staffMembers.map((st) => (
              <option key={st.uid} value={st.uid}>
                {st.displayName} ({st.departmentName || st.role})
              </option>
            ))}
          </Select>

          <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
            <Button variant="outline" size="sm" onClick={() => setBulkAssignModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBulkAssign}
              disabled={!bulkTargetStaffId}
            >
              Assign Selected
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
