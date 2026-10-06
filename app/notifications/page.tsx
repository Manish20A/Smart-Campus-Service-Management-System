"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { useAuth } from "@/context/AuthContext";
import { NotificationItem } from "@/types";
import {
  Bell,
  Check,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatTimeAgo, formatDateTime } from "@/lib/utils";

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refreshNotifs = () => {
    if (user?.uid) {
      setNotifications([...dataStore.getNotifications(user.uid)]);
    }
  };

  useEffect(() => {
    refreshNotifs();
  }, [user]);

  const handleMarkAllRead = () => {
    if (user?.uid) {
      dataStore.markAllNotificationsRead(user.uid);
      refreshNotifs();
    }
  };

  const handleNotificationClick = (id: string) => {
    dataStore.markNotificationRead(id);
    refreshNotifs();
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Inbox
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
              Notifications & Alerts
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Real-time progression milestones, comments, assignment updates, and SLA notifications.
            </p>
          </div>

          {notifications.some((n) => !n.read) && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              className="text-xs gap-1.5"
            >
              <Check className="h-3.5 w-3.5" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <Card
                key={n.id}
                className={`transition-colors ${
                  !n.read ? "bg-[var(--accent-subtle)]/20 border-[var(--accent)]/30" : ""
                }`}
              >
                <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[var(--accent)] shrink-0" />
                      )}
                      <h3 className="text-xs sm:text-sm font-semibold tracking-tight text-[var(--foreground)]">
                        {n.title}
                      </h3>
                      <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                        &bull; {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      {n.message}
                    </p>

                    <div className="pt-1 text-[11px] font-mono text-[var(--foreground-subtle)]">
                      {formatDateTime(n.createdAt)}
                    </div>
                  </div>

                  <Link href={n.link} onClick={() => handleNotificationClick(n.id)}>
                    <Button size="sm" variant="outline" className="h-8 text-xs px-2.5 gap-1 shrink-0">
                      View
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bell className="h-5 w-5" />}
            title="All caught up"
            description="You do not have any unread notifications or alerts at this time."
          />
        )}
      </div>
    </DashboardLayout>
  );
}
