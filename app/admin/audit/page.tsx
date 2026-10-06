"use client";

import React, { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ShieldCheck, Search, Clock } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const logs = useMemo(() => dataStore.getAuditLogs(), []);

  const filteredLogs = useMemo(() => {
    if (!search.trim()) return logs;
    const q = search.toLowerCase();
    return logs.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        l.actorName.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q)
    );
  }, [logs, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Compliance & Governance
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
              Immutable System Audit Log
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Cryptographically verified audit entries for status progressions, security policy changes, and workflow reassignments.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search audit trail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="border border-[var(--border)] rounded-[10px] overflow-hidden bg-[var(--surface)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-hover)]/40 text-[var(--foreground-subtle)] font-medium uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity Ref</th>
                  <th className="py-3 px-4">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--foreground)]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--surface-hover)]/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--foreground-subtle)] whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[var(--accent)]">
                      {log.action}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-medium text-[var(--foreground)]">{log.actorName}</span>
                      <span className="text-[10px] text-[var(--foreground-subtle)] ml-1 uppercase font-mono">
                        ({log.actorRole})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--foreground-muted)]">
                      {log.entityType}:{log.entityId}
                    </td>
                    <td className="py-3.5 px-4 text-[var(--foreground-muted)] max-w-md">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
