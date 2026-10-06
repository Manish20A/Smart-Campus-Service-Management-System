import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RequestPriority, RequestStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatTimeAgo(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return formatDate(date);
}

export function getStatusMeta(status: RequestStatus) {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        description: "Awaiting department intake",
        dotColor: "bg-amber-600 dark:bg-amber-400",
        badgeClass: "bg-[var(--amber-subtle)] text-[var(--amber-text)] border-[var(--amber-border)]",
      };
    case "assigned":
      return {
        label: "Assigned",
        description: "Assigned to staff specialist",
        dotColor: "bg-blue-600 dark:bg-blue-400",
        badgeClass: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60",
      };
    case "in_progress":
      return {
        label: "In Progress",
        description: "Being actively processed",
        dotColor: "bg-orange-600 dark:bg-orange-400",
        badgeClass: "bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/60",
      };
    case "completed":
      return {
        label: "Completed",
        description: "Resolution fulfilled and verified",
        dotColor: "bg-[var(--sage)]",
        badgeClass: "bg-[var(--sage-subtle)] text-[var(--sage-text)] border-[var(--sage-border)]",
      };
    case "rejected":
      return {
        label: "Declined",
        description: "Cannot be fulfilled",
        dotColor: "bg-red-600 dark:bg-red-400",
        badgeClass: "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/60",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        description: "Withdrawn by student",
        dotColor: "bg-zinc-500 dark:bg-zinc-400",
        badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
      };
    case "reopened":
      return {
        label: "Reopened",
        description: "Follow-up requested by student",
        dotColor: "bg-purple-600 dark:bg-purple-400",
        badgeClass: "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60",
      };
  }
}

export function getPriorityMeta(priority: RequestPriority) {
  switch (priority) {
    case "low":
      return {
        label: "Low",
        dotColor: "bg-zinc-400",
        badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
      };
    case "normal":
      return {
        label: "Normal",
        dotColor: "bg-blue-500",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/40",
      };
    case "high":
      return {
        label: "High",
        dotColor: "bg-amber-600",
        badgeClass: "bg-[var(--amber-subtle)] text-[var(--amber-text)] border-[var(--amber-border)]",
      };
    case "urgent":
      return {
        label: "Urgent",
        dotColor: "bg-[var(--accent)]",
        badgeClass: "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-muted)]/30 font-medium",
      };
  }
}
