"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "subtle";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-[6px] border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variants = {
      primary:
        "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] focus-visible:outline-[var(--accent)] shadow-xs",
      secondary:
        "bg-[var(--surface-elevated)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-hover)] focus-visible:outline-[var(--foreground-muted)] shadow-xs",
      outline:
        "bg-transparent text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--foreground-subtle)]",
      ghost:
        "bg-transparent text-[var(--foreground)] border-transparent hover:bg-[var(--surface-hover)]",
      danger:
        "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus-visible:outline-red-600 shadow-xs",
      subtle:
        "bg-[var(--accent-subtle)] text-[var(--accent)] border-transparent hover:bg-[var(--accent)]/15 focus-visible:outline-[var(--accent)]",
    };

    const sizes = {
      sm: "h-8 px-2.5 text-xs gap-1.5",
      md: "h-9.5 px-3.5 text-sm gap-2",
      lg: "h-11 px-5 text-base gap-2.5",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
