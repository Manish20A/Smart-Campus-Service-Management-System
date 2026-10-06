"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { dataStore } from "@/lib/data/store";
import { ServiceRequest } from "@/types";
import {
  Search,
  FileText,
  Compass,
  Building2,
  BarChart3,
  Sun,
  Moon,
  Laptop,
  Plus,
  ArrowRight,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const router = useRouter();
  const { role, switchDemoRole } = useAuth();
  const { setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [matchingRequests, setMatchingRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const q = query.trim().toLowerCase();
      const results = dataStore.getRequests().filter(
        (r) =>
          r.ticketId.toLowerCase().includes(q) ||
          r.serviceName.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q)
      );
      setMatchingRequests(results.slice(0, 5));
    } else {
      setMatchingRequests([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (path: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(path);
  };

  const navActions = [
    { label: "Submit New Request", icon: Plus, action: () => navigateTo("/services") },
    { label: "My Requests", icon: FileText, action: () => navigateTo("/student/requests") },
    { label: "Public Ticket Tracker", icon: Search, action: () => navigateTo("/track") },
    { label: "Team Workload Dashboard", icon: Building2, action: () => navigateTo("/workload") },
    { label: "System Analytics", icon: BarChart3, action: () => navigateTo("/admin/analytics") },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-[12px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-2xl text-[var(--foreground)] overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[var(--border)]">
          <Search className="h-4 w-4 text-[var(--foreground-muted)] mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search tickets, actions, or switch themes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-3">
          {/* Matching Tickets */}
          {matchingRequests.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
                Matching Tickets
              </div>
              <div className="space-y-1">
                {matchingRequests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => navigateTo(`/requests/${req.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-[6px] hover:bg-[var(--surface-hover)] text-xs text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-[11px] text-[var(--accent)] font-semibold shrink-0">
                        {req.ticketId}
                      </span>
                      <span className="truncate text-[var(--foreground)]">
                        {req.serviceName}
                      </span>
                      <span className="text-[10px] text-[var(--foreground-muted)] truncate hidden sm:inline">
                        — {req.studentName}
                      </span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[var(--foreground-subtle)] group-hover:text-[var(--foreground)] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div>
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              Navigation
            </div>
            <div className="space-y-0.5">
              {navActions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-2 rounded-[6px] hover:bg-[var(--surface-hover)] text-xs text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-3.5 w-3.5 text-[var(--foreground-muted)] group-hover:text-[var(--foreground)]" />
                      <span>{item.label}</span>
                    </div>
                    <kbd className="font-mono text-[10px] text-[var(--foreground-subtle)]">↵</kbd>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              Appearance
            </div>
            <div className="grid grid-cols-3 gap-1.5 px-2">
              <button
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <Sun className="h-3 w-3 text-[var(--accent)]" />
                Light
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <Moon className="h-3 w-3 text-[var(--accent)]" />
                Dark
              </button>
              <button
                onClick={() => {
                  setTheme("system");
                  setIsOpen(false);
                }}
                className="flex items-center justify-center gap-2 py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                <Laptop className="h-3 w-3 text-[var(--accent)]" />
                System
              </button>
            </div>
          </div>

          {/* Role Switching */}
          <div>
            <div className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              Role Switcher (Active: {role})
            </div>
            <div className="grid grid-cols-3 gap-1.5 px-2">
              <button
                onClick={() => {
                  switchDemoRole("student");
                  setIsOpen(false);
                }}
                className="py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                Student
              </button>
              <button
                onClick={() => {
                  switchDemoRole("staff");
                  setIsOpen(false);
                }}
                className="py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                Staff (CSE)
              </button>
              <button
                onClick={() => {
                  switchDemoRole("admin");
                  setIsOpen(false);
                }}
                className="py-1.5 rounded-[6px] border border-[var(--border)] text-xs hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              >
                Administrator
              </button>
            </div>
          </div>
        </div>

        <div className="p-2.5 border-t border-[var(--border)] bg-[var(--surface-hover)]/40 flex items-center justify-between text-[11px] text-[var(--foreground-subtle)]">
          <span>Tip: Press <kbd className="font-mono bg-[var(--surface-elevated)] border border-[var(--border)] px-1 rounded">?</kbd> for table shortcut keys</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
