"use client";

import React, { useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Star,
  Layers,
} from "lucide-react";

export default function AnalyticsPage() {
  const stats = useMemo(() => dataStore.getStats(), []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Institutional Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
            Service Desk Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1 max-w-2xl">
            Longitudinal resolution volumes, SLA compliance distribution, and student satisfaction indices.
          </p>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
                Total Intake
              </span>
              <div className="text-xl font-bold font-serif text-[var(--foreground)]">
                {stats.total}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">All recorded requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600">
                Pending Intake
              </span>
              <div className="text-xl font-bold font-serif text-amber-600">
                {stats.pending}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">Awaiting triage</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-orange-600">
                In Progress
              </span>
              <div className="text-xl font-bold font-serif text-orange-600">
                {stats.inProgress}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">Active processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--sage)]">
                Fulfilled
              </span>
              <div className="text-xl font-bold font-serif text-[var(--sage)]">
                {stats.completed}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">Successfully closed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-red-600">
                Breached SLA
              </span>
              <div className="text-xl font-bold font-serif text-red-600">
                {stats.overdue}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">Flagged overdue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--accent)]">
                Satisfaction
              </span>
              <div className="text-xl font-bold font-serif text-[var(--accent)] flex items-center gap-1">
                <Star className="h-4 w-4 fill-[var(--accent)]" />
                {stats.avgRating}
              </div>
              <p className="text-[10px] text-[var(--foreground-muted)]">Average out of 5.0</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Intake Trajectory (Area Chart) */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Request Volume (Last 14 Days)</CardTitle>
              <CardDescription>
                Intake trajectory across examination and regular lecture schedules.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.requestsPerDay} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                  <XAxis dataKey="date" stroke="var(--foreground-muted)" fontSize={11} />
                  <YAxis stroke="var(--foreground-muted)" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRequests)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Volume by Service (Bar Chart) */}
          <Card>
            <CardHeader>
              <CardTitle>Top Services by Demand</CardTitle>
              <CardDescription>
                Distribution across highest-volume student service workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.requestsByService}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                  <XAxis type="number" stroke="var(--foreground-muted)" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="var(--foreground-muted)"
                    fontSize={10}
                    width={110}
                    tickFormatter={(val) => (val.length > 15 ? val.slice(0, 15) + "..." : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar dataKey="count" fill="#3A5A78" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Distribution & SLA Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Breakdown</CardTitle>
              <CardDescription>Status share across open & completed cycles.</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex flex-col items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusDistribution}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {stats.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface-elevated)",
                      borderColor: "var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--foreground)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 text-[11px] pt-2">
                {stats.statusDistribution.map((st) => (
                  <div key={st.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: st.fill }} />
                    <span className="text-[var(--foreground-muted)]">{st.name}: {st.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>SLA Compliance & Efficiency Summary</CardTitle>
              <CardDescription>
                Audited turnaround speed versus published service commitments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[var(--foreground)]">Overall SLA Health</span>
                  <span className="font-mono font-bold text-[var(--sage)]">{stats.slaCompliance}%</span>
                </div>
                <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--sage)] h-full transition-all duration-500"
                    style={{ width: `${stats.slaCompliance}%` }}
                  />
                </div>
                <p className="text-[11px] text-[var(--foreground-muted)]">
                  {stats.slaCompliance >= 90
                    ? "Exceptional: Over 90% of requests are resolved prior to SLA target deadline."
                    : "Warning: Backlog is triggering auto-escalation thresholds."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">
                    Mean Turnaround
                  </span>
                  <span className="text-lg font-mono font-bold text-[var(--foreground)] mt-1 block">
                    {stats.avgResolutionHours} Hours
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">Across 12 service catalog lines</span>
                </div>

                <div className="p-3 rounded border border-[var(--border)]">
                  <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block">
                    Auto-Escalation Rate
                  </span>
                  <span className="text-lg font-mono font-bold text-red-600 dark:text-red-400 mt-1 block">
                    {Math.round((stats.overdue / (stats.total || 1)) * 100)}%
                  </span>
                  <span className="text-[11px] text-[var(--foreground-muted)]">Tickets requiring priority elevation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
