"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--foreground)] tracking-tight"
          >
            {label}
            {props.required && <span className="text-[var(--accent)] ml-0.5">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-9.5 px-3 rounded-[6px] border text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] bg-[var(--surface-elevated)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed",
            error
              ? "border-red-500 focus-visible:outline-red-500"
              : "border-[var(--border)] hover:border-[var(--foreground-subtle)]",
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="text-[11px] text-[var(--foreground-muted)]">{hint}</p>
        )}
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
