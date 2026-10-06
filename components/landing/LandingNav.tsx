"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Laptop, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  const { theme, setTheme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)] shadow-xs"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded-[6px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-base font-bold shadow-xs">
            C
          </div>
          <div>
            <span className="font-serif text-xl font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
              CampusDesk
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-[var(--foreground-muted)]">
          <a href="#services" className="hover:text-[var(--foreground)] transition-colors">
            Services
          </a>
          <a href="#lifecycle" className="hover:text-[var(--foreground)] transition-colors">
            Lifecycle
          </a>
          <a href="#roles" className="hover:text-[var(--foreground)] transition-colors">
            Built for Three
          </a>
          <a href="#metrics" className="hover:text-[var(--foreground)] transition-colors">
            Live Metrics
          </a>
          <Link href="/track" className="hover:text-[var(--foreground)] transition-colors">
            Track a Ticket
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme switcher */}
          <div className="flex items-center border border-[var(--border)] rounded-[6px] p-0.5 bg-[var(--surface-elevated)]">
            <button
              onClick={() => setTheme("light")}
              title="Light theme"
              className={cn(
                "p-1.5 rounded-[4px] transition-colors cursor-pointer",
                theme === "light"
                  ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              title="Dark theme"
              className={cn(
                "p-1.5 rounded-[4px] transition-colors cursor-pointer",
                theme === "dark"
                  ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              )}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
              Sign In
            </Button>
          </Link>

          <Link href="/services">
            <Button variant="primary" size="sm" className="text-xs gap-1.5">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
