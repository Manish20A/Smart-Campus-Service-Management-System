import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[var(--border)] rounded-[10px] bg-[var(--surface)]/50",
        className
      )}
    >
      <div className="h-10 w-10 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] mb-3.5">
        {icon || <FolderOpen className="h-5 w-5" strokeWidth={1.5} />}
      </div>
      <h3 className="text-sm font-medium text-[var(--foreground)] tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-[var(--foreground-muted)] max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
