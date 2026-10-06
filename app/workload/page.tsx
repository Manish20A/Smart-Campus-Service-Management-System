"use client";

import React, { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function WorkloadDashboardPage() {
  const stats = useMemo(() => dataStore.getStats(), []);
  const departments = useMemo(() => dataStore.getDepartments(), []);
  const staffUsers = useMemo(
    () => dataStore.getUsers().filter((u) => u.role === "staff"),
    []
  );
  const requests = useMemo(() => dataStore.getRequests(), []);

  // Compute staff leaderboard (assigned vs completed)
  const staffLeaderboard = useMemo(() => {
    return staffUsers.map((st) => {
      const assigned = requests.filter((r) => r.assignedToId === st.uid).length;
      const completed = requests.filter(
        (r) => r.assignedToId === st.uid && r.status === "completed"
      ).length;
      const inProgress = requests.filter(
        (r) => r.assignedToId === st.uid && r.status === "in_progress"
      ).length;

      return {
        id: st.uid,
        name: st.displayName,
        department: st.departmentName || "General",
        assigned,
        completed,
        inProgress,
        efficiencyRate: assigned > 0 ? Math.round((completed / assigned) * 100) : 100,
      };
    }).sort((a, b) => b.completed - a.completed);
  }, [staffUsers, requests]);

  // Chart data for workload distribution
  const chartData = useMemo(() => {
    return stats.departmentWorkload.map((dept) => ({
      name: dept.code,
      fullName: dept.name,
      Open: dept.openCount,
      Resolved: dept.completedCount,
    }));
  }, [stats]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Capacity & Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
            Department Workload & SLA Matrix
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1 max-w-2xl">
            Real-time capacity tracking across academic and administrative departments, staff load ratios, and resolution velocity.
          </p>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
                Active Departments
              </span>
              <div className="text-2xl font-serif font-bold text-[var(--foreground)] mt-1">
                {departments.length}
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                Operational campus units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
                Average Staff Load
              </span>
              <div className="text-2xl font-serif font-bold text-[var(--foreground)] mt-1">
                2.8
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                Open tickets per specialist
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--sage)]">
                SLA Compliance Rate
              </span>
              <div className="text-2xl font-serif font-bold text-[var(--sage)] mt-1">
                {stats.slaCompliance}%
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                Within expected target hours
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)]">
                Avg Resolution Time
              </span>
              <div className="text-2xl font-serif font-bold text-[var(--accent)] mt-1">
                {stats.avgResolutionHours}h
              </div>
              <p className="text-[11px] text-[var(--foreground-muted)] mt-1">
                From intake to completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Workload Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.departmentWorkload.map((dept) => (
            <Card key={dept.id} hoverEffect className="space-y-3">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground-subtle)]">
                    {dept.code}
                  </span>
                  <Badge variant="subtle" size="sm">
                    {dept.staffCount} Specialists
                  </Badge>
                </div>
                <CardTitle className="mt-2 text-base">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded bg-[var(--surface-hover)]/40 border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">
                      Open Backlog
                    </span>
                    <span className="font-mono text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                      {dept.openCount}
                    </span>
                  </div>
                  <div className="p-2.5 rounded bg-[var(--surface-hover)]/40 border border-[var(--border)]">
                    <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">
                      Avg Load / Staff
                    </span>
                    <span className="font-mono text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                      {dept.avgLoadPerStaff}
                    </span>
                  </div>
                </div>

                <div className="text-xs pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[var(--foreground-muted)]">
                    <span>Oldest Open Ticket:</span>
                    <span className="font-mono text-[var(--foreground)] font-medium">
                      {dept.oldestUnresolvedTicketId || "None"}
                    </span>
                  </div>
                  {dept.oldestUnresolvedDays > 0 && (
                    <div className="flex items-center justify-between text-[var(--foreground-muted)]">
                      <span>Age:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">
                        {dept.oldestUnresolvedDays} day(s)
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts and Leaderboard 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workload Stacked Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Department Status Distribution</CardTitle>
              <CardDescription>
                Comparison of active open queues versus fulfilled requests per unit.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="name" stroke="var(--foreground-muted)" fontSize={11} />
                  <YAxis stroke="var(--foreground-muted)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="Open" fill="#C24A1E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Resolved" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Specialist Performance Leaderboard */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Specialist Leaderboard
                </CardTitle>
                <span className="text-xs text-[var(--foreground-muted)]">
                  Resolution Metrics
                </span>
              </div>
              <CardDescription>
                Weekly fulfillment records and caseload balancing per team member.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-[var(--border-subtle)]">
                {staffLeaderboard.map((member, i) => (
                  <div
                    key={member.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[var(--foreground-subtle)] w-4 text-center">
                        #{i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{member.name}</p>
                        <p className="text-[11px] text-[var(--foreground-muted)]">
                          {member.department}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--sage)] font-semibold font-mono">
                          {member.completed} resolved
                        </span>
                        <span className="text-[var(--foreground-subtle)]">&bull;</span>
                        <span className="text-[var(--foreground-muted)] font-mono">
                          {member.inProgress} active
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--foreground-subtle)]">
                        {member.efficiencyRate}% closure rate
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
