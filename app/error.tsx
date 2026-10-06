"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RotateCcw, ArrowLeft, AlertCircle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("CampusDesk Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
          <AlertCircle className="h-6 w-6" />
        </div>

        <span className="font-mono text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-semibold">
          Execution Interrupted
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
          An Unexpected Exception Occurred
        </h1>

        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
          The application encountered an error while processing this transaction. Our client error boundary captured this event safely.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="primary" size="md" onClick={() => reset()} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
