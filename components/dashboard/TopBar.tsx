"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { dataStore } from "@/lib/data/store";
import { NotificationItem, CampusAnnouncement } from "@/types";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Laptop,
  Plus,
  X,
  Check,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn, formatTimeAgo } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export function TopBar() {
  const { user, role } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [announcement, setAnnouncement] = useState<CampusAnnouncement | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      setNotifications(dataStore.getNotifications(user.uid));
    }
    const anns = dataStore.getAnnouncements();
    if (anns.length > 0) {
      setAnnouncement(anns[0]);
    }
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    if (user?.uid) {
      dataStore.markAllNotificationsRead(user.uid);
      setNotifications(dataStore.getNotifications(user.uid));
    }
  };

  const handleNotificationClick = (id: string) => {
    dataStore.markNotificationRead(id);
    if (user?.uid) {
      setNotifications(dataStore.getNotifications(user.uid));
    }
    setShowNotifPanel(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Search / Command Palette shortcut trigger */}
        <div className="flex-1 max-w-sm">
          <button
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="w-full flex items-center justify-between h-8 px-3 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
              <span>Quick search or jump...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-[var(--surface-hover)] border border-[var(--border)] px-1.5 py-0.2 rounded text-[var(--foreground-muted)]">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Live Firebase Connected Badge */}
          <button
            type="button"
            onClick={async () => {
              const { testFirebaseConnection } = await import("@/lib/firebase/client");
              const res = await testFirebaseConnection();
              alert(res.message);
            }}
            title="Connected to Google Cloud Firestore (campusdesk-61dfa). Click to test connection."
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] text-[10px] font-mono border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Firebase: Live</span>
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
            <button
              onClick={() => setTheme("system")}
              title="System theme"
              className={cn(
                "p-1.5 rounded-[4px] transition-colors cursor-pointer",
                theme === "system"
                  ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Laptop className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Notification Bell & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              className="relative p-2 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--surface-elevated)]" />
              )}
            </button>

            {/* Notification Panel */}
            {showNotifPanel && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[10px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-xl z-50 text-[var(--foreground)] animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold tracking-tight">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] font-medium">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-[var(--accent)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3 w-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[var(--border-subtle)]">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[var(--foreground-muted)]">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.link}
                        onClick={() => handleNotificationClick(n.id)}
                        className={cn(
                          "block p-3.5 hover:bg-[var(--surface-hover)] transition-colors text-xs space-y-1",
                          !n.read && "bg-[var(--accent-subtle)]/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[var(--foreground)]">{n.title}</span>
                          <span className="text-[10px] text-[var(--foreground-subtle)] font-mono">
                            {formatTimeAgo(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </Link>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-[var(--border-subtle)] bg-[var(--surface-hover)]/40 rounded-b-[10px] text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setShowNotifPanel(false)}
                    className="text-[11px] text-[var(--foreground-muted)] hover:text-[var(--foreground)] font-medium"
                  >
                    View all notifications &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
