import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-4 max-w-md">
        <span className="font-mono text-sm uppercase tracking-wider text-[var(--accent)] font-semibold">
          Error 404 &bull; Missing Record
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
          Page Not Located
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
          The campus destination or ticket document you requested does not exist, has been archived, or was moved to another department.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/services">
            <Button variant="outline" size="md" className="gap-2">
              <Compass className="h-4 w-4" />
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
