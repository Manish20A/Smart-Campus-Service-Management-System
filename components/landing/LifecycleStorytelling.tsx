"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FileText,
  UserCheck,
  Zap,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";

interface StepData {
  index: string;
  stage: string;
  title: string;
  copy: string;
  mockStatus: string;
  mockBadgeColor: string;
  mockSpecialist: string;
  mockProgressPercent: number;
}

const STEPS: StepData[] = [
  {
    index: "01",
    stage: "Intake",
    title: "1. Request Submission & Dynamic Schema",
    copy: "The student picks an official workflow, fills custom validation fields, and receives an atomic CD-2026-xxxxx ticket with a guaranteed SLA deadline.",
    mockStatus: "PENDING",
    mockBadgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
    mockSpecialist: "Routing to intake queue...",
    mockProgressPercent: 15,
  },
  {
    index: "02",
    stage: "Assigned",
    title: "2. Intelligent Load-Balanced Dispatch",
    copy: "CampusDesk's auto-assignment engine evaluates active department loads and routes the ticket to the least-burdened specialist in seconds.",
    mockStatus: "ASSIGNED",
    mockBadgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
    mockSpecialist: "Prof. Elena Rostova (CSE)",
    mockProgressPercent: 40,
  },
  {
    index: "03",
    stage: "In Progress",
    title: "3. Transparent Processing & Internal Notes",
    copy: "Specialists record audit milestones and internal notes. Students receive milestone notifications and can post clarifying comments in real-time.",
    mockStatus: "IN PROGRESS",
    mockBadgeColor: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300",
    mockSpecialist: "Prof. Elena Rostova (CSE)",
    mockProgressPercent: 75,
  },
  {
    index: "04",
    stage: "Completed",
    title: "4. Verified Fulfillment & Feedback",
    copy: "Resolution confirmed, timestamped in the immutable audit trail, and delivered to the student with a 1-click satisfaction rating prompt.",
    mockStatus: "COMPLETED",
    mockBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
    mockSpecialist: "Fulfillment Confirmed",
    mockProgressPercent: 100,
  },
];

export function LifecycleStorytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: triggerRef.current,
      start: "top top",
      end: "+=2200",
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const step = Math.min(
          Math.floor(self.progress * STEPS.length),
          STEPS.length - 1
        );
        setActiveStep(step);
      },
    });

    return () => trigger.kill();
  }, []);

  const current = STEPS[activeStep];

  return (
    <section id="lifecycle" ref={triggerRef} className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            The Request Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
            From submission to resolution, scrubbed cleanly.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Scroll to follow how a ticket traverses intake, auto-dispatch, active fulfillment, and verified closure.
          </p>
        </div>

        {/* 2-Column Pinned Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[460px]">
          {/* Left Column: Stage Progression & Copy (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center gap-2">
              {STEPS.map((step, idx) => (
                <button
                  key={step.index}
                  onClick={() => setActiveStep(idx)}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeStep
                      ? "bg-[var(--accent)] h-2"
                      : idx < activeStep
                      ? "bg-[var(--sage)]"
                      : "bg-[var(--border)]"
                  }`}
                  aria-label={`Jump to stage ${step.stage}`}
                />
              ))}
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs font-semibold text-[var(--accent)]">
                PHASE {current.index} &bull; {current.stage.toUpperCase()}
              </span>
              <h3 className="text-2xl font-serif font-semibold text-[var(--foreground)] tracking-tight">
                {current.title}
              </h3>
              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {current.copy}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-xs text-[var(--foreground-subtle)] font-mono">
              <ShieldCheck className="h-4 w-4 text-[var(--sage)]" />
              <span>Immutable audit trail recorded at every step</span>
            </div>
          </div>

          {/* Right Column: Dynamic Mock Ticket Card (7 cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-lg transition-all duration-300 transform">
              <Card className="shadow-lg border-[var(--border)] bg-[var(--surface-elevated)] overflow-hidden">
                {/* Mock Card Header */}
                <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--surface-hover)]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-xs font-bold">
                      C
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[var(--accent)]">
                        CD-2026-00042
                      </span>
                      <span className="text-[11px] text-[var(--foreground-muted)] block">
                        Official Academic Transcript
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono uppercase font-semibold border ${current.mockBadgeColor}`}
                  >
                    {current.mockStatus}
                  </span>
                </div>

                {/* Mock Card Body */}
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-[var(--border-subtle)]">
                    <div>
                      <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block font-mono">
                        Requester
                      </span>
                      <span className="font-medium text-[var(--foreground)] mt-0.5 block">
                        Aria Chen (CS-2023-0491)
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[var(--foreground-subtle)] uppercase block font-mono">
                        Target SLA
                      </span>
                      <span className="font-medium text-[var(--foreground)] mt-0.5 block">
                        48 Hours (On Track)
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Milestone Simulation */}
                  <div className="p-3.5 rounded-[8px] bg-[var(--surface-hover)]/50 border border-[var(--border)] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--foreground-muted)]">Specialist:</span>
                      <span className="font-medium text-[var(--foreground)]">{current.mockSpecialist}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--foreground-muted)]">Progress:</span>
                      <span className="font-mono font-semibold text-[var(--accent)]">
                        {current.mockProgressPercent}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--accent)] h-full transition-all duration-500 ease-out"
                        style={{ width: `${current.mockProgressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Dynamic simulated comment */}
                  <div className="text-xs p-3 rounded-[6px] border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--foreground-muted)] italic">
                    {activeStep === 0 && 'System: "Ticket CD-2026-00042 registered into intake catalog."'}
                    {activeStep === 1 && 'System: "Load balancer evaluated CSE queues. Assigned to Prof. Elena Rostova."'}
                    {activeStep === 2 && 'Elena Rostova: "Verifying degree credits and registry seal stamps."'}
                    {activeStep === 3 && 'Aria Chen: "Received certified sealed PDF and hard copy. Rating: 5/5 stars."'}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
