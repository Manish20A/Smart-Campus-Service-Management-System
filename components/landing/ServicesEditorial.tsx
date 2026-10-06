"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EditorialServiceItem {
  number: string;
  category: string;
  name: string;
  description: string;
  sla: string;
  slaDetail: string;
  department: string;
  id: string;
}

const EDITORIAL_SERVICES: EditorialServiceItem[] = [
  {
    number: "01",
    category: "Academic Records",
    name: "Official Grade Sheet / Transcript",
    description: "Official stamped copy of your marks and grades. Needed for graduate school, jobs, or visa applications.",
    sla: "48h SLA",
    slaDetail: "Registrar Verification",
    department: "Office of the Registrar",
    id: "srv-official-transcript",
  },
  {
    number: "02",
    category: "Advanced Computing",
    name: "AI & Supercomputer Access",
    description: "Book time on the college's powerful AI computers (NVIDIA GPUs) for machine learning, heavy coding, or research projects.",
    sla: "24h SLA",
    slaDetail: "Faculty Co-sign Required",
    department: "Department of Computer Science",
    id: "srv-gpu-cluster",
  },
  {
    number: "03",
    category: "Engineering Hardware",
    name: "Borrow Lab Gear & Testing Tools",
    description: "Borrow hardware kits, circuit boards, testing meters (oscilloscopes), and sensors for your coursework or engineering projects.",
    sla: "24h SLA",
    slaDetail: "Hardware Lab Inventory",
    department: "Department of Computer Science",
    id: "srv-lab-equipment",
  },
  {
    number: "04",
    category: "Campus Estate",
    name: "Room Electrical, Fan & AC Repair",
    description: "Report broken lights, ceiling fans, power plugs, air conditioning, or sudden electricity outages in your hostel room.",
    sla: "8h SLA",
    slaDetail: "Rapid Response Dispatch",
    department: "Campus Facilities & Estate",
    id: "srv-hvac-maintenance",
  },
  {
    number: "05",
    category: "Campus Infrastructure",
    name: "Campus Wi-Fi & Internet Help",
    description: "Connect a new laptop, phone, or smart device to the campus Wi-Fi network, or report slow internet and weak Wi-Fi signal.",
    sla: "12h SLA",
    slaDetail: "Direct IT Provisioning",
    department: "Department of Computer Science",
    id: "srv-wifi-network",
  },
  {
    number: "06",
    category: "Student Welfare",
    name: "Sick Leave Attendance Excuse",
    description: "Submit a doctor's sick note so missed classes and labs are officially excused from your mandatory attendance record.",
    sla: "36h SLA",
    slaDetail: "Health Center Verification",
    department: "Office of Student Affairs",
    id: "srv-medical-leave",
  },
  {
    number: "07",
    category: "Residential Living",
    name: "Change Hostel Room",
    description: "Request to move to a different hostel room for health reasons, quiet study requirements, or accessibility needs.",
    sla: "72h SLA",
    slaDetail: "Warden Review Committee",
    department: "Hostel & Residential Life",
    id: "srv-hostel-room-change",
  },
  {
    number: "08",
    category: "Scholarly Research",
    name: "Request Books & Research Papers",
    description: "Ask the college library to obtain paid research articles, rare books, or papers from partner university libraries.",
    sla: "72h SLA",
    slaDetail: "Global Inter-Loan Network",
    department: "University Central Library",
    id: "srv-inter-library-loan",
  },
];

export function ServicesEditorial() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
        <div className="space-y-2 max-w-2xl">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Service Catalog & Workflows
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
            Every campus workflow. Crafted with deliberate clarity.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)]">
            Explore official service pathways with published turnaround commitments, custom requirements, and instant tracking.
          </p>
        </div>

        <Link href="/services">
          <Button variant="outline" size="md" className="gap-2 shrink-0">
            View Complete Catalog (15 Services)
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Editorial Numbered List */}
      <div className="divide-y divide-[var(--border)]">
        {EDITORIAL_SERVICES.map((srv, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <Link
              key={srv.number}
              href={`/services/${srv.id}/apply`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group block py-6 sm:py-8 transition-colors duration-200 hover:bg-[var(--surface-hover)]/40 px-3 sm:px-6 -mx-3 sm:-mx-6 rounded-[8px]"
            >
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-4 sm:gap-8">
                  <span className="font-mono text-sm sm:text-base font-semibold text-[var(--accent)] group-hover:scale-105 transition-transform shrink-0">
                    {srv.number}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase text-[var(--foreground-subtle)] tracking-wider block">
                      {srv.category} &bull; {srv.department}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-serif font-medium text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                      {srv.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 md:pl-8">
                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[var(--foreground)] block">
                      {srv.sla}
                    </span>
                    <span className="text-[11px] text-[var(--foreground-muted)] block">
                      {srv.slaDetail}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--foreground-muted)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Expandable description on hover/active */}
              <div
                className={`mt-3 pl-8 sm:pl-12 text-xs sm:text-sm text-[var(--foreground-muted)] max-w-3xl leading-relaxed transition-all duration-200 ${
                  isHovered ? "opacity-100" : "opacity-80"
                }`}
              >
                {srv.description}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
