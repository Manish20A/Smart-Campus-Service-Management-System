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
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn, formatTimeAgo } from "@/lib/utils";
import { isFirebaseConfigured } from "@/lib/firebase/client";

export function TopBar() {
  const { user, role, switchDemoRole } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [announcement, setAnnouncement] = useState<CampusAnnouncement | null>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [allAnnouncements, setAllAnnouncements] = useState<CampusAnnouncement[]>([]);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annLevel, setAnnLevel] = useState<"info" | "warning" | "alert">("info");

  const canManageAnnouncements = role === "admin" || role === "staff";

  useEffect(() => {
    if (user?.uid) {
      setNotifications(dataStore.getNotifications(user.uid));
    }

    const refreshAnnouncements = () => {
      const anns = dataStore.getAnnouncements();
      setAllAnnouncements(anns);
      if (anns.length > 0) {
        setAnnouncement(anns[0]);
      } else {
        setAnnouncement(null);
      }
    };

    refreshAnnouncements();

    if (typeof window !== "undefined") {
      window.addEventListener("campusdesk_announcement_updated", refreshAnnouncements);
      return () => {
        window.removeEventListener("campusdesk_announcement_updated", refreshAnnouncements);
      };
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
          {/* Announcements Trigger (Accessible to all roles) */}
          <button
            type="button"
            onClick={() => {
              setAllAnnouncements(dataStore.getAnnouncements());
              setShowAnnounceModal(true);
            }}
            title="Campus Announcements & Notices"
            className="h-8 inline-flex items-center gap-1.5 px-2.5 rounded-[6px] text-xs font-medium border border-[var(--border)] bg-[var(--surface-elevated)] hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition-colors cursor-pointer relative shrink-0"
          >
            <Megaphone className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span className="hidden md:inline">Announcements</span>
            {allAnnouncements.length > 0 && (
              <span className="h-4 min-w-[16px] px-1 rounded-full bg-[var(--accent)] text-white text-[10px] font-mono flex items-center justify-center font-bold">
                {allAnnouncements.length}
              </span>
            )}
          </button>

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

      {/* Campus-Wide Announcement Banner */}
      {announcement && !announcementDismissed && (
        <div
          className={cn(
            "w-full border-t transition-colors",
            announcement.level === "alert"
              ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300"
              : announcement.level === "warning"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-800 dark:text-amber-300"
              : "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-800 dark:text-blue-300"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-xs flex items-center justify-between gap-3 w-full">
            <div className="flex items-center gap-2.5 overflow-hidden min-w-0 flex-1">
              <span className="p-1 rounded-full bg-current/10 shrink-0">
                <Megaphone className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
              </span>
              <div className="flex items-center gap-2 min-w-0 overflow-hidden flex-1">
                <span className="font-semibold shrink-0 text-[var(--foreground)]">{announcement.title}:</span>
                <span className="truncate min-w-0">{announcement.content}</span>
                {announcement.createdBy && (
                  <span className="text-[10px] opacity-75 shrink-0 hidden md:inline">— {announcement.createdBy}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setAllAnnouncements(dataStore.getAnnouncements());
                  setShowAnnounceModal(true);
                }}
                title="View all announcements"
                className="text-[11px] font-medium px-2 py-0.5 rounded border border-current/20 hover:bg-current/10 transition-colors cursor-pointer"
              >
                All Notices ({allAnnouncements.length})
              </button>
              {canManageAnnouncements && (
                <button
                  type="button"
                  onClick={() => {
                    dataStore.deleteAnnouncement(announcement.id);
                    const rem = dataStore.getAnnouncements();
                    setAnnouncement(rem[0] || null);
                    setAllAnnouncements(rem);
                  }}
                  title="Remove announcement"
                  className="text-[11px] font-medium text-red-600 hover:text-red-700 hover:underline transition-colors cursor-pointer px-1 py-0.5"
                >
                  Delete
                </button>
              )}
              <button
                type="button"
                onClick={() => setAnnouncementDismissed(true)}
                title="Dismiss banner"
                className="p-1 rounded hover:bg-current/10 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campus Announcement Modal */}
      {showAnnounceModal && (
        <Modal
          isOpen={showAnnounceModal}
          onClose={() => setShowAnnounceModal(false)}
          title="Campus Announcements & Notices"
          description="Official campus-wide updates, system maintenance warnings, and student bulletins."
          maxWidth="lg"
        >
          <div className="space-y-4 my-2">
            {/* Publisher Form (Always accessible for easy testing & broadcasting) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!annTitle.trim() || !annContent.trim()) return;
                const creator = user || {
                  displayName:
                    role === "admin"
                      ? "Dr. Arthur Vance (Campus Admin)"
                      : role === "staff"
                      ? "Prof. Elena Rostova (Staff)"
                      : "Campus Administration",
                  role: role || "admin",
                };
                const created = dataStore.createAnnouncement(
                  annTitle.trim(),
                  annContent.trim(),
                  annLevel,
                  creator
                );
                setAnnouncement(created);
                setAnnouncementDismissed(false);
                setAllAnnouncements(dataStore.getAnnouncements());
                setAnnTitle("");
                setAnnContent("");
                setShowAnnounceModal(false);
              }}
              className="space-y-3 p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)]/60"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <Megaphone className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Broadcast New Campus Notice
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-[var(--accent)] bg-[var(--accent-subtle)] px-2 py-0.5 rounded font-semibold">
                    {role === "admin" ? "Admin Mode" : role === "staff" ? "Staff Mode" : "Student / Demo"}
                  </span>
                  {role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => switchDemoRole("admin")}
                      className="text-[10px] text-[var(--foreground-muted)] hover:text-[var(--accent)] underline cursor-pointer"
                    >
                      (Switch to Admin)
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--foreground)]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Campus Wi-Fi Maintenance Tonight"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full h-8 px-3 text-xs rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--foreground)]">Message Content</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide full details of the notice for students and staff..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--foreground)]">Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["info", "warning", "alert"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setAnnLevel(lvl)}
                      className={cn(
                        "py-1.5 text-xs rounded-[6px] border font-medium capitalize transition-colors cursor-pointer",
                        annLevel === lvl
                          ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
                          : "border-[var(--border)] text-[var(--foreground-muted)] hover:bg-[var(--surface-hover)]"
                      )}
                    >
                      {lvl === "info" ? "Normal Info" : lvl === "warning" ? "Caution" : "Urgent Alert"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAnnounceModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Publish Announcement
                </Button>
              </div>
            </form>

            {/* Active Announcements List */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                  Active Campus Notices ({allAnnouncements.length})
                </h4>
              </div>

              {allAnnouncements.length === 0 ? (
                <div className="p-4 text-center text-xs text-[var(--foreground-muted)] border border-dashed border-[var(--border)] rounded-[6px]">
                  No active announcements currently posted.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {allAnnouncements.map((a) => (
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
                      <div className="flex items-start justify-between gap-2">
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
                        {canManageAnnouncements && (
                          <button
                            type="button"
                            onClick={() => {
                              dataStore.deleteAnnouncement(a.id);
                              const rem = dataStore.getAnnouncements();
                              setAllAnnouncements(rem);
                              setAnnouncement(rem[0] || null);
                            }}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            title="Delete announcement"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">{a.content}</p>
                      <div className="flex items-center justify-between text-[10px] text-[var(--foreground-subtle)] font-mono pt-1">
                        <span>Posted by: {a.createdBy || "Campus Administration"}</span>
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
