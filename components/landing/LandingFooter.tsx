"use client";

import React from "react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-[var(--foreground-muted)] text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-6 w-6 rounded-[5px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-xs font-bold">
              C
            </div>
            <span className="font-serif text-base font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              CampusDesk
            </span>
          </Link>
          <span className="hidden sm:inline text-[var(--border)]">|</span>
          <p className="text-[11px] text-[var(--foreground-subtle)]">
            &copy; 2026 CampusDesk. Handcrafted for modern collegiate institutions.
          </p>
        </div>

        {/* Center: System Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-[11px]">
          <span className="h-2 w-2 rounded-full bg-[var(--sage)] animate-pulse" />
          <span className="text-[var(--foreground)] font-medium">All Campus Desks Operational</span>
          <span className="font-mono text-[var(--foreground-subtle)]">&bull; 99.98% uptime</span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-5 text-[11px]">
          <Link href="/services" className="hover:text-[var(--foreground)] transition-colors">
            Services
          </Link>
          <Link href="/track" className="hover:text-[var(--foreground)] transition-colors">
            Public Tracker
          </Link>
          <Link href="/auth/login" className="hover:text-[var(--foreground)] transition-colors">
            Portal Access
          </Link>
          <Link href="/admin/requests" className="hover:text-[var(--foreground)] transition-colors">
            Admin Suite
          </Link>
        </div>
      </div>
    </footer>
  );
}
