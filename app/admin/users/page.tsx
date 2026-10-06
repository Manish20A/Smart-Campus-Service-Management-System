"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { UserProfile, UserRole } from "@/types";
import {
  Users,
  Search,
  Shield,
  Building2,
  CheckCircle,
  XCircle,
  Edit2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function UserManagementPage() {
  const { user: currentAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<UserProfile[]>(() => dataStore.getUsers());
  const departments = useMemo(() => dataStore.getDepartments(), []);

  // Edit user modal
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>("student");
  const [newDeptId, setNewDeptId] = useState<string>("");
  const [newIsActive, setNewIsActive] = useState<boolean>(true);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const q = search.toLowerCase();
      const matchSearch =
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.rollNumber && u.rollNumber.toLowerCase().includes(q));
      return matchRole && matchSearch;
    });
  }, [users, roleFilter, search]);

  const openEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setNewRole(u.role);
    setNewDeptId(u.departmentId || "");
    setNewIsActive(u.isActive);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    try {
      const dept = departments.find((d) => d.id === newDeptId);
      editingUser.role = newRole;
      editingUser.departmentId = newDeptId || undefined;
      editingUser.departmentName = dept ? dept.name : undefined;
      editingUser.isActive = newIsActive;
      editingUser.updatedAt = new Date().toISOString();

      setUsers([...dataStore.getUsers()]);
      setEditingUser(null);
      success(`Updated account settings for ${editingUser.displayName}`);
    } catch (err: any) {
      toastError(err.message || "Failed to update user.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Access Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
              User Directory & Roles
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Assign staff department portfolios, manage institutional permissions, and audit access credentials.
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search by name, email, or roll number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-72 text-xs"
            />
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 text-xs w-36"
            >
              <option value="all">All Roles</option>
              <option value="student">Student</option>
              <option value="staff">Staff Specialist</option>
              <option value="admin">Administrator</option>
            </Select>
          </div>

          <div className="text-xs text-[var(--foreground-muted)] font-mono">
            Showing {filteredUsers.length} of {users.length} registered accounts
          </div>
        </div>

        {/* Users Table */}
        <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 text-[var(--foreground-subtle)] font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department / Roll</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--foreground)]">
                {filteredUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-[var(--surface-hover)]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center font-serif text-xs font-semibold shrink-0">
                          {u.displayName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--foreground)]">{u.displayName}</p>
                          <p className="text-[11px] text-[var(--foreground-muted)] font-mono">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono uppercase font-semibold border ${
                          u.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"
                            : u.role === "staff"
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
                            : "bg-[var(--surface-hover)] text-[var(--foreground-muted)] border-[var(--border)]"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--foreground-muted)]">
                      {u.departmentName || u.rollNumber || "General"}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[var(--sage)] font-medium">
                          <CheckCircle className="h-3.5 w-3.5" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                          <XCircle className="h-3.5 w-3.5" />
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--foreground-subtle)]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(u)}
                        className="h-7 text-xs px-2.5 gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit User Modal */}
        {editingUser && (
          <Modal
            isOpen={!!editingUser}
            onClose={() => setEditingUser(null)}
            title={`Edit Account: ${editingUser.displayName}`}
            description="Modify system authorization level and department assignments."
          >
            <div className="space-y-4 my-2">
              <Select
                label="Role Clearance"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
              >
                <option value="student">Student</option>
                <option value="staff">Staff / Faculty Specialist</option>
                <option value="admin">Administrator</option>
              </Select>

              {newRole === "staff" && (
                <Select
                  label="Assigned Department"
                  value={newDeptId}
                  onChange={(e) => setNewDeptId(e.target.value)}
                >
                  <option value="">Select department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </Select>
              )}

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-[var(--foreground)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsActive}
                    onChange={(e) => setNewIsActive(e.target.checked)}
                    className="rounded border-[var(--border)] text-[var(--accent)]"
                  />
                  <span>Account Active (Uncheck to deactivate access)</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
                <Button variant="outline" size="sm" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveUser}>
                  Save Permissions
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
