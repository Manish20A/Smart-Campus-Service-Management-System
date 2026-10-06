"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, ArrowRight, Megaphone, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { dataStore } from "@/lib/data/store";
import { CampusAnnouncement } from "@/types";
import { cn, formatTimeAgo } from "@/lib/utils";

export function LandingNav() {
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setAnnouncements(dataStore.getAnnouncements());
    };
    refresh();
    if (typeof window !== "undefined") {
      window.addEventListener("campusdesk_announcement_updated", refresh);
      return () => {
        window.removeEventListener("campusdesk_announcement_updated", refresh);
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const latestAnnouncement = announcements[0] || null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-xs"
          : "bg-[var(--surface)]/60 backdrop-blur-xs border-b border-[var(--border-subtle)]"
      )}
    >
      {/* Top Banner if Active Announcement */}
      {latestAnnouncement && !bannerDismissed && (
        <div
          className={cn(
            "w-full text-xs border-b transition-colors",
            latestAnnouncement.level === "alert"
              ? "bg-red-50 dark:bg-red-950/70 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300"
              : latestAnnouncement.level === "warning"
              ? "bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300"
              : "bg-blue-50 dark:bg-blue-950/70 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-hidden min-w-0 flex-1">
              <span className="p-1 rounded-full bg-current/10 shrink-0">
                <Megaphone className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
              </span>
              <div className="flex items-center gap-2 min-w-0 overflow-hidden flex-1">
                <span className="font-semibold shrink-0">{latestAnnouncement.title}:</span>
                <span className="truncate min-w-0">{latestAnnouncement.content}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowAnnounceModal(true)}
                className="text-[11px] font-medium px-2 py-0.5 rounded border border-current/20 hover:bg-current/10 transition-colors cursor-pointer"
              >
                All Notices ({announcements.length})
              </button>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                title="Dismiss banner"
                className="p-1 rounded hover:bg-current/10 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
            C
          </div>
          <div>
            <span className="font-serif text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              CampusDesk
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[var(--foreground-muted)]">
          <a href="#services" className="hover:text-[var(--foreground)] transition-colors">
            Services
          </a>
          <a href="#lifecycle" className="hover:text-[var(--foreground)] transition-colors">
            Lifecycle
          </a>
          <a href="#roles" className="hover:text-[var(--foreground)] transition-colors">
            Built for Three
          </a>
          <a href="#metrics" className="hover:text-[var(--foreground)] transition-colors">
            Live Metrics
          </a>
          <Link href="/track" className="hover:text-[var(--foreground)] transition-colors">
            Track a Ticket
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Announcements Trigger Button */}
          <button
            type="button"
            onClick={() => setShowAnnounceModal(true)}
            title="Campus Announcements & Notices"
            className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-[6px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors cursor-pointer shrink-0"
          >
            <Megaphone className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="hidden lg:inline">Announcements</span>
            {announcements.length > 0 && (
              <span className="h-4 min-w-[16px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {announcements.length}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <div className="flex items-center border border-[var(--border)] rounded-[6px] p-0.5 bg-[var(--surface-elevated)]">
            <button
              onClick={() => setTheme("light")}
              title="Light theme"
              className={cn(
                "p-1.5 rounded-[4px] transition-colors cursor-pointer",
                theme === "light"
                  ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              title="Dark theme"
              className={cn(
                "p-1.5 rounded-[4px] transition-colors cursor-pointer",
                theme === "dark"
                  ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
              Sign In
            </Button>
          </Link>

          <Link href="/services">
            <Button variant="primary" size="sm" className="text-xs gap-1.5">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Landing Announcements Modal */}
      {showAnnounceModal && (
        <Modal
          isOpen={showAnnounceModal}
          onClose={() => setShowAnnounceModal(false)}
          title="Campus Announcements & Notices"
          description="Official campus broadcasts, system maintenance schedules, and administrative bulletins."
          maxWidth="lg"
        >
          <div className="space-y-4 my-2">
            <div className="flex items-center justify-between p-3 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] text-xs">
              <span className="text-[var(--foreground-muted)]">
                Want to broadcast an announcement or submit a request?
              </span>
              <Link href="/services">
                <Button variant="primary" size="sm" className="text-xs">
                  Go to Campus Portal &rarr;
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Active Notices ({announcements.length})
              </h4>
              {announcements.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--foreground-muted)] border border-dashed border-[var(--border)] rounded-[6px]">
                  No active announcements currently posted.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "p-3 rounded-[6px] border transition-colors space-y-1.5",
                        a.level === "alert"
                          ? "border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20"
                          : a.level === "warning"
                          ? "border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20"
                          : "border-[var(--border)] bg-[var(--surface)]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded font-semibold",
                            a.level === "alert"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : a.level === "warning"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          )}
                        >
                          {a.level}
                        </span>
                        <h5 className="text-xs font-semibold text-[var(--foreground)]">{a.title}</h5>
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{a.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-[var(--foreground-subtle)] font-mono pt-1">
                        <span>Issued by: {a.createdBy || "Campus Administration"}</span>
                        <span>{formatTimeAgo(a.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
}
