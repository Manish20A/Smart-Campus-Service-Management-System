import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "subtle" | "sage" | "amber" | "terracotta";
  dotColor?: string;
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  dotColor,
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center gap-1.5 rounded-full font-medium tracking-tight border transition-colors";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] leading-tight",
    md: "px-2.5 py-1 text-xs leading-normal",
  };

  const variants = {
    default:
      "bg-[var(--surface-hover)] text-[var(--foreground)] border-[var(--border)]",
    outline:
      "bg-transparent text-[var(--foreground-muted)] border-[var(--border)]",
    subtle:
      "bg-[var(--surface-elevated)] text-[var(--foreground-muted)] border-[var(--border-subtle)]",
    sage:
      "bg-[var(--sage-subtle)] text-[var(--sage-text)] border-[var(--sage-border)]",
    amber:
      "bg-[var(--amber-subtle)] text-[var(--amber-text)] border-[var(--amber-border)]",
    terracotta:
      "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent)]/30",
  };

  return (
    <span
      className={cn(baseStyles, sizeStyles[size], variants[variant], className)}
      {...props}
    >
      {dotColor && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColor)}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
