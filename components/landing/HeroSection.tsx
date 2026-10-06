"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight, Search, Sparkles, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Line-by-line / word reveal
      tl.from(".hero-line", {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
      })
        .from(
          subheadRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          {
            y: 16,
            opacity: 0,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          statsRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.4"
        );

      // Soft parallax on decorative architectural shapes
      gsap.to(".decor-shape", {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden"
    >
      {/* Layered Architectural Geometric Background Shapes (Parallax) */}
      <div
        ref={decorRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Soft terracotta arch */}
        <div className="decor-shape absolute -top-12 -right-16 w-96 h-96 rounded-full bg-[var(--accent)]/5 blur-2xl" />
        {/* Subtle sage arc */}
        <div className="decor-shape absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-[var(--sage)]/4 blur-2xl" />
        {/* Hairline architectural blueprint grid lines */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] border border-[var(--border-subtle)] rounded-[40px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Small Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--foreground-muted)] shadow-2xs">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span>CampusDesk Operating System</span>
          <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">&bull; v1.0</span>
        </div>

        {/* Oversized Headline with Masked Stagger */}
        <div ref={headlineRef} className="space-y-1 sm:space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-medium tracking-tight text-[var(--foreground)] leading-[1.08]">
            <span className="block hero-line">Quiet, accountable</span>
            <span className="block hero-line italic text-[var(--accent)]">
              campus services.
            </span>
          </h1>
        </div>

        {/* Subtitle with Real Human Microcopy */}
        <p
          ref={subheadRef}
          className="text-base sm:text-xl text-[var(--foreground-muted)] max-w-2xl mx-auto leading-relaxed font-sans font-normal"
        >
          No lost paperwork, no opaque approval loops, and no guesswork.
          An intentionally calm service desk built for students, faculty, and university leadership.
        </p>

        {/* Call to Actions */}
        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link href="/services">
            <Button size="lg" variant="primary" className="w-full sm:w-auto text-sm px-6 gap-2">
              Get started with a request
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/track">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm px-5 gap-2">
              <Search className="h-4 w-4 text-[var(--foreground-muted)]" />
              Track existing ticket
            </Button>
          </Link>
        </div>

        {/* Counting Number Stat Strip */}
        <div
          ref={statsRef}
          className="pt-12 sm:pt-16 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-t border-[var(--border-subtle)]"
        >
          <div className="p-3 text-center space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              15+
            </span>
            <p className="text-xs text-[var(--foreground-muted)]">Official Workflows</p>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--sage)]">
              96%
            </span>
            <p className="text-xs text-[var(--foreground-muted)]">SLA Adherence</p>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--accent)]">
              18.5h
            </span>
            <p className="text-xs text-[var(--foreground-muted)]">Mean Resolution</p>
          </div>
          <div className="p-3 text-center space-y-1">
            <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              4.8 / 5
            </span>
            <p className="text-xs text-[var(--foreground-muted)]">Student Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
}
