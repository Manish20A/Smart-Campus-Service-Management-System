"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, Clock, CheckCircle2, Star, ShieldCheck } from "lucide-react";

export function LiveStatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setCounter1(96);
      setCounter2(18.5);
      setCounter3(4.8);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // SVG stroke animation: draw the chart line on enter
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        });
      }

      // Count-up numbers
      const obj = { c1: 0, c2: 0, c3: 0 };
      gsap.to(obj, {
        c1: 96,
        c2: 18.5,
        c3: 4.8,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        onUpdate: () => {
          setCounter1(Math.round(obj.c1));
          setCounter2(Math.round(obj.c2 * 10) / 10);
          setCounter3(Math.round(obj.c3 * 10) / 10);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="metrics" ref={containerRef} className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center space-y-3">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
          Live Operational Velocity
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
          Real numbers. Real turnaround accountability.
        </h2>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
          Every campus transaction is benchmarked against service commitments and audited live.
        </p>
      </div>

      {/* Grid of Animated Counter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3 bg-[var(--surface)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              SLA Compliance
            </span>
            <CheckCircle2 className="h-4 w-4 text-[var(--sage)]" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--sage)]">
            {counter1}%
          </div>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Requests fulfilled within target SLA windows without breaching department commitments.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-[var(--surface)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              Mean Resolution Velocity
            </span>
            <Clock className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--accent)]">
            {counter2}h
          </div>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Average fulfillment duration across all campus desks, from application intake to closure.
          </p>
        </Card>

        <Card className="p-6 space-y-3 bg-[var(--surface)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--foreground-subtle)]">
              Student Approval Score
            </span>
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-[var(--foreground)]">
            {counter3} <span className="text-lg font-normal text-[var(--foreground-muted)]">/ 5.0</span>
          </div>
          <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
            Verified post-completion feedback rating averaged across student applicants.
          </p>
        </Card>
      </div>

      {/* Self-Drawing Animated SVG Curve Chart */}
      <Card className="p-6 sm:p-8 bg-[var(--surface-elevated)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              30-Day Campus Resolution Trajectory
            </h3>
            <p className="text-xs text-[var(--foreground-muted)]">
              Live stroke drawing representing daily ticket fulfillment momentum.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--sage)] font-semibold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            +18.4% velocity growth
          </span>
        </div>

        <div className="w-full h-44 sm:h-52 relative pt-4">
          <svg
            viewBox="0 0 800 200"
            className="w-full h-full overflow-visible"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Background grid lines */}
            <line x1="0" y1="50" x2="800" y2="50" stroke="var(--border-subtle)" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="800" y2="100" stroke="var(--border-subtle)" strokeDasharray="4 4" />
            <line x1="0" y1="150" x2="800" y2="150" stroke="var(--border-subtle)" strokeDasharray="4 4" />

            {/* Self-drawing curved trajectory line */}
            <path
              ref={pathRef}
              d="M 0 160 Q 120 140, 200 110 T 400 90 T 600 50 T 800 25"
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Accent points along the path */}
            <circle cx="200" cy="110" r="4.5" fill="var(--surface-elevated)" stroke="var(--accent)" strokeWidth="2.5" />
            <circle cx="400" cy="90" r="4.5" fill="var(--surface-elevated)" stroke="var(--accent)" strokeWidth="2.5" />
            <circle cx="600" cy="50" r="4.5" fill="var(--surface-elevated)" stroke="var(--accent)" strokeWidth="2.5" />
            <circle cx="800" cy="25" r="5" fill="var(--accent)" />
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-[var(--foreground-subtle)] pt-1">
          <span>Week 1 (Exam Cycle)</span>
          <span>Week 2 (Intake Peak)</span>
          <span>Week 3 (Triage Acceleration)</span>
          <span>Today (Stable Velocity)</span>
        </div>
      </Card>
    </section>
  );
}
