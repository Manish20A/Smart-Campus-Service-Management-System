"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.25;
    const y = (clientY - (top + height / 2)) * 0.25;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
      <div className="space-y-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
          Begin Today
        </span>
        <h2 className="text-4xl sm:text-6xl font-serif font-medium tracking-tight text-[var(--foreground)] leading-[1.1]">
          A campus desk that feels like a quiet sanctuary,{" "}
          <span className="italic text-[var(--accent)]">not a bureaucratic maze.</span>
        </h2>
        <p className="text-xs sm:text-base text-[var(--foreground-muted)] max-w-xl mx-auto leading-relaxed">
          Join thousands of students and faculty experiencing accountable, transparent, and dignified service fulfillment.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {/* Magnetic button */}
        <Link
          ref={buttonRef}
          href="/services"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: position.x === 0 ? "transform 0.4s ease-out" : "transform 0.1s ease-out",
          }}
          className="inline-flex items-center justify-center h-12 px-7 rounded-[8px] bg-[var(--accent)] text-white font-medium text-sm hover:bg-[var(--accent-hover)] shadow-md transition-colors gap-2 cursor-pointer"
        >
          Explore Service Catalog
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link href="/auth/login">
          <Button variant="outline" size="lg" className="h-12 text-sm px-6">
            Sign In with Campus ID
          </Button>
        </Link>
      </div>

      <div className="pt-8 flex flex-wrap justify-center gap-6 text-xs text-[var(--foreground-subtle)] font-mono">
        <span>&bull; Zero Installation Required</span>
        <span>&bull; Real-Time Milestone Notifications</span>
        <span>&bull; Guaranteed SLAs</span>
      </div>
    </section>
  );
}
