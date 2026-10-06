"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";

export function KeyboardShortcutOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If typing in input or textarea, ignore
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const shortcuts = [
    { key: "j / ↓", desc: "Move selection down in requests table" },
    { key: "k / ↑", desc: "Move selection up in requests table" },
    { key: "Enter", desc: "Open selected request detail view" },
    { key: "a", desc: "Trigger quick assignment modal for selected ticket" },
    { key: "s", desc: "Trigger quick status transition modal" },
    { key: "⌘K / Ctrl+K", desc: "Open global command palette & search" },
    { key: "?", desc: "Toggle this keyboard shortcuts cheatsheet" },
    { key: "Esc", desc: "Dismiss modals or close dropdown panels" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Keyboard Shortcuts"
      description="Quick single-key navigation designed for rapid triage in high-volume queues."
      maxWidth="md"
    >
      <div className="space-y-2 mt-2">
        {shortcuts.map((sc, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-1.5 px-2 rounded-[6px] hover:bg-[var(--surface-hover)] text-xs"
          >
            <span className="text-[var(--foreground)]">{sc.desc}</span>
            <kbd className="font-mono text-[11px] bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded shadow-xs text-[var(--accent)] font-semibold">
              {sc.key}
            </kbd>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--foreground-muted)] text-right">
        Press <kbd className="font-mono bg-[var(--surface)] border border-[var(--border)] px-1 rounded">Esc</kbd> to return
      </div>
    </Modal>
  );
}
