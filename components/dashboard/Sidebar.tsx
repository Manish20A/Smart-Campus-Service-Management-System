"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Compass,
  FileText,
  Search,
  Users,
  BarChart3,
  Layers,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  UserCheck,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user, role, switchDemoRole } = useAuth();

  const studentLinks = [
    { label: "My Requests", href: "/student/requests", icon: FileText },
    { label: "Service Catalog", href: "/services", icon: Compass },
    { label: "Track a Ticket", href: "/track", icon: Search },
  ];

  const staffLinks = [
    { label: "Department Queue", href: "/staff/requests", icon: Layers },
    { label: "Team Workload", href: "/workload", icon: Building2 },
    { label: "Service Catalog", href: "/services", icon: Compass },
    { label: "Track a Ticket", href: "/track", icon: Search },
  ];

  const adminLinks = [
    { label: "All Requests", href: "/admin/requests", icon: Layers },
    { label: "Workload & SLA", href: "/workload", icon: Building2 },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Service Catalog", href: "/services", icon: Compass },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Audit Logs", href: "/admin/audit", icon: ShieldCheck },
  ];

  let links = studentLinks;
  if (role === "admin") links = adminLinks;
  else if (role === "staff") links = staffLinks;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--border-subtle)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-sm font-bold shadow-xs">
            C
          </div>
          <div>
            <span className="font-serif text-lg font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              CampusDesk
            </span>
          </div>
        </Link>
        <span className="text-[10px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--foreground-muted)] bg-[var(--surface-elevated)]">
          v1.0
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--foreground-subtle)]">
          {role === "admin" ? "Administration" : role === "staff" ? "Specialist Desk" : "Student Portal"}
        </div>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[6px] text-xs font-medium transition-colors",
                isActive
                  ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold shadow-xs"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              )}
            >
              <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Demo Switcher & Active User */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-hover)]/30 space-y-3">
        <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[8px] p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              Role Switcher
            </span>
            <span className="text-[10px] uppercase font-mono text-[var(--accent)] font-semibold">
              {role}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => switchDemoRole("student")}
              className={cn(
                "text-[10px] py-1 rounded border transition-colors cursor-pointer",
                role === "student"
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] font-medium"
                  : "bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
              )}
            >
              Student
            </button>
            <button
              onClick={() => switchDemoRole("staff")}
              className={cn(
                "text-[10px] py-1 rounded border transition-colors cursor-pointer",
                role === "staff"
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] font-medium"
                  : "bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
              )}
            >
              Staff
            </button>
            <button
              onClick={() => switchDemoRole("admin")}
              className={cn(
                "text-[10px] py-1 rounded border transition-colors cursor-pointer",
                role === "admin"
                  ? "bg-[var(--accent)] text-white border-[var(--accent)] font-medium"
                  : "bg-transparent text-[var(--foreground-muted)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
              )}
            >
              Admin
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="h-8 w-8 rounded-full bg-[var(--border)] text-[var(--foreground)] font-serif flex items-center justify-center text-xs font-semibold shrink-0">
            {user?.displayName ? user.displayName[0] : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--foreground)] truncate">
              {user?.displayName || "Signed In"}
            </p>
            <p className="text-[10px] text-[var(--foreground-muted)] truncate">
              {user?.email || "user@campusdesk.edu"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
