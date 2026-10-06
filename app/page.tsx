import React from "react";
import { SmoothScrollWrapper } from "@/components/landing/SmoothScrollWrapper";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { DepartmentMarquee } from "@/components/landing/DepartmentMarquee";
import { LifecycleStorytelling } from "@/components/landing/LifecycleStorytelling";
import { ServicesEditorial } from "@/components/landing/ServicesEditorial";
import { BuiltForThree } from "@/components/landing/BuiltForThree";
import { LiveStatsSection } from "@/components/landing/LiveStatsSection";
import { FinalCta } from "@/components/landing/FinalCta";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <SmoothScrollWrapper>
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[var(--accent-subtle)] selection:text-[var(--accent)]">
        {/* Subtle noise texture overlay for analog paper warmth */}
        <div className="noise-overlay pointer-events-none fixed inset-0 z-30" />

        {/* Sticky Minimal Navbar */}
        <LandingNav />

        {/* Hero Section */}
        <HeroSection />

        {/* Marquee Strip of Departments */}
        <DepartmentMarquee />

        {/* Pinned Storytelling Section (Lifecycle) */}
        <LifecycleStorytelling />

        {/* Editorial Services Showcase */}
        <ServicesEditorial />

        {/* Built for Three People (Student / Faculty / Admin) */}
        <BuiltForThree />

        {/* Live-Feel Metrics & SVG Animated Trajectory */}
        <LiveStatsSection />

        {/* Final CTA with Magnetic Button */}
        <FinalCta />

        {/* Minimal Footer */}
        <LandingFooter />
      </div>
    </SmoothScrollWrapper>
  );
}
