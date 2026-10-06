"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  startDate: string;
  targetDate: string;
  completed?: boolean;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  startDate,
  targetDate,
  completed = false,
  size = 64,
  strokeWidth = 5,
  className,
}: ProgressRingProps) {
  const [percent, setPercent] = useState(0);
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    if (completed) {
      setPercent(100);
      setIsOverdue(false);
      return;
    }

    const calc = () => {
      const start = new Date(startDate).getTime();
      const end = new Date(targetDate).getTime();
      const now = Date.now();

      if (now >= end) {
        setPercent(100);
        setIsOverdue(true);
        return;
      }

      const total = end - start;
      const elapsed = now - start;
      const pct = Math.min(Math.max((elapsed / (total || 1)) * 100, 5), 98);
      setPercent(pct);
      setIsOverdue(false);
    };

    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [startDate, targetDate, completed]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let strokeColor = "stroke-[var(--accent)]";
  if (completed) strokeColor = "stroke-[var(--sage)]";
  else if (isOverdue) strokeColor = "stroke-red-600 dark:stroke-red-400";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[var(--border)]"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn(strokeColor, "transition-all duration-500 ease-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="absolute font-mono text-[11px] font-medium text-[var(--foreground)]">
        {completed ? "100%" : isOverdue ? "SLA!" : `${Math.round(percent)}%`}
      </span>
    </div>
  );
}
