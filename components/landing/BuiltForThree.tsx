"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, GraduationCap, Briefcase, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface RolePersona {
  id: string;
  role: string;
  audience: string;
  icon: any;
  headline: string;
  narrative: string;
  points: string[];
  ctaLabel: string;
  ctaHref: string;
}

const PERSONAS: RolePersona[] = [
  {
    id: "student",
    role: "The Student",
    audience: "Undergraduate & Graduate Scholars",
    icon: GraduationCap,
    headline: "Unambiguous resolution without walking across campus.",
    narrative:
      "No more running between administrative offices or wondering if an email got lost in someone's inbox. CampusDesk gives students guaranteed SLAs, clean dynamic intake forms, duplicate warnings, and instant notifications at every stage.",
    points: [
      "Dynamic forms requesting only necessary credentials for each specific service.",
      "Clear estimated completion date computed live from department load.",
      "Direct communication thread with the assigned specialist.",
      "One-click post-resolution rating to hold services accountable.",
    ],
    ctaLabel: "Open Student Portal",
    ctaHref: "/student/requests",
  },
  {
    id: "faculty",
    role: "The Faculty & Specialist",
    audience: "Department Members & Technical Staff",
    icon: Briefcase,
    headline: "Balanced caseloads, internal notes, and zero lost emails.",
    narrative:
      "Department specialists receive requests cleanly routed by an intelligent workload balancer. Staff can maintain internal private deliberations away from student eyes, batch transition workflows with keyboard shortcuts, and deliver verified fulfillment.",
    points: [
      "Auto-assignment balances active ticket queues across department colleagues.",
      "Confidential internal notes visible only to faculty and administrators.",
      "High-speed keyboard navigation (j/k to navigate, a to assign, s for status).",
      "Saved filter views for immediate focus on urgent and overdue items.",
    ],
    ctaLabel: "Open Specialist Desk",
    ctaHref: "/staff/requests",
  },
  {
    id: "admin",
    role: "The Dean & Leadership",
    audience: "Deans, Department Heads & Central Registrar",
    icon: ShieldAlert,
    headline: "Holistic campus visibility, auto-escalations, and verifiable audits.",
    narrative:
      "University leaders gain continuous transparency into capacity bottlenecks across all campus departments. Automated sentinels flag SLA breaches, promote priorities to urgent, and trigger alerts to ensure institutional excellence.",
    points: [
      "Real-time department workload matrix and capacity distribution.",
      "Automated Vercel Cron SLA sentinel flagging overdue tickets.",
      "Comprehensive satisfaction index metrics and resolution velocity trends.",
      "Role-based access governance and immutable cryptographic audit trails.",
    ],
    ctaLabel: "Open Administrative Suite",
    ctaHref: "/admin/requests",
  },
];

export function BuiltForThree() {
  const [selectedRole, setSelectedRole] = useState(0);

  const active = PERSONAS[selectedRole];
  const Icon = active.icon;

  return (
    <section id="roles" className="py-24 bg-[var(--surface)] border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Sticky Title & Persona Switcher (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Designed For Three People
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-semibold tracking-tight text-[var(--foreground)] leading-tight">
              One unified platform. Three tailored experiences.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
              University service management fails when software treats all users identically.
              CampusDesk is hand-tuned for the distinct realities of campus life.
            </p>

            {/* Persona Switcher Buttons */}
            <div className="space-y-2 pt-2">
              {PERSONAS.map((persona, index) => {
                const PIcon = persona.icon;
                const isSelected = selectedRole === index;
                return (
                  <button
                    key={persona.id}
                    onClick={() => setSelectedRole(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-[8px] border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[var(--surface-elevated)] border-[var(--accent)] shadow-xs"
                        : "bg-transparent border-[var(--border)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-[6px] ${
                          isSelected
                            ? "bg-[var(--accent-subtle)] text-[var(--accent)]"
                            : "bg-[var(--surface-hover)] text-[var(--foreground-muted)]"
                        }`}
                      >
                        <PIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[var(--foreground)] block">
                          {persona.role}
                        </span>
                        <span className="text-[11px] text-[var(--foreground-muted)]">
                          {persona.audience}
                        </span>
                      </div>
                    </div>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Narrative Panel (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-8 sm:p-10 space-y-6 bg-[var(--surface-elevated)] border-[var(--border)] shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] font-semibold">
                  {active.role} Perspective
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[var(--foreground)] leading-snug">
                {active.headline}
              </h3>

              <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
                {active.narrative}
              </p>

              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                {active.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-[var(--foreground)]">
                    <div className="h-5 w-5 rounded-full bg-[var(--sage-subtle)] text-[var(--sage)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link href={active.ctaHref}>
                  <Button variant="primary" size="md" className="gap-2 text-xs">
                    {active.ctaLabel}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
