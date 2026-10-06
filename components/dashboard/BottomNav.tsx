"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { FileText, Compass, Search, Layers, Building2, Bell } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  const studentLinks = [
    { label: "Requests", href: "/student/requests", icon: FileText },
    { label: "Catalog", href: "/services", icon: Compass },
    { label: "Track", href: "/track", icon: Search },
    { label: "Alerts", href: "/notifications", icon: Bell },
  ];

  const staffLinks = [
    { label: "Queue", href: "/staff/requests", icon: Layers },
    { label: "Workload", href: "/workload", icon: Building2 },
    { label: "Catalog", href: "/services", icon: Compass },
    { label: "Alerts", href: "/notifications", icon: Bell },
  ];

  const adminLinks = [
    { label: "Requests", href: "/admin/requests", icon: Layers },
    { label: "Workload", href: "/workload", icon: Building2 },
    { label: "Analytics", href: "/admin/analytics", icon: Compass },
    { label: "Alerts", href: "/notifications", icon: Bell },
  ];

  let links = studentLinks;
  if (role === "admin") links = adminLinks;
  else if (role === "staff") links = staffLinks;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--surface-elevated)]/95 backdrop-blur-md px-3 py-1 flex items-center justify-around shadow-lg">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center py-1.5 px-3 rounded-[6px] text-[10px] font-medium transition-colors",
              isActive
                ? "text-[var(--accent)] font-semibold"
                : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
            )}
          >
            <Icon className="h-4 w-4 mb-0.5 stroke-[1.75]" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
