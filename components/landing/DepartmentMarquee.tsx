"use client";

import React from "react";

const DEPARTMENTS_LIST = [
  "Office of the Registrar",
  "Department of Computer Science & Eng.",
  "Campus Facilities & Estate",
  "Hostel & Residential Life",
  "University Central Library",
  "Dean of Student Affairs",
  "Electrical & Robotics Lab",
  "Graduate Admissions Bureau",
  "Campus Health & Wellness Center",
  "University Athletics & Recreation",
];

export function DepartmentMarquee() {
  return (
    <div className="py-8 bg-[var(--surface-hover)]/40 border-y border-[var(--border)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--foreground-subtle)]">
          Integrated Campus Departments & Bureaus
        </span>
      </div>

      <div className="relative w-full flex overflow-x-hidden group">
        <div className="flex animate-marquee whitespace-nowrap gap-8 text-xs font-mono font-medium text-[var(--foreground-muted)] group-hover:[animation-play-state:paused]">
          {DEPARTMENTS_LIST.concat(DEPARTMENTS_LIST).map((dept, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-3 py-1.5 rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {dept}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
