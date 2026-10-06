"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: (options: {
    title?: string;
    message: string;
    type?: ToastType;
    duration?: number;
  }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      message,
      type = "info",
      duration = 4000,
    }: {
      title?: string;
      message: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, title, message, type, duration };
      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => {
      toast({ message, title, type: "success" });
    },
    [toast]
  );

  const error = useCallback(
    (message: string, title?: string) => {
      toast({ message, title, type: "error" });
    },
    [toast]
  );

  const info = useCallback(
    (message: string, title?: string) => {
      toast({ message, title, type: "info" });
    },
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const typeIcons = {
            success: (
              <CheckCircle2 className="h-4 w-4 text-[var(--sage)] shrink-0" />
            ),
            error: (
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
            ),
            warning: (
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            ),
            info: (
              <Info className="h-4 w-4 text-[var(--accent)] shrink-0" />
            ),
          };

          return (
            <div
              key={t.id}
              className={cn(
                "pointer-events-auto flex items-start gap-3 p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] shadow-lg text-[var(--foreground)] text-xs animate-in slide-in-from-bottom-2 fade-in-0 duration-200"
              )}
            >
              <div className="pt-0.5">{typeIcons[t.type || "info"]}</div>
              <div className="flex-1 space-y-0.5">
                {t.title && (
                  <p className="font-medium tracking-tight text-[var(--foreground)]">
                    {t.title}
                  </p>
                )}
                <p className="text-[var(--foreground-muted)] leading-relaxed">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] p-0.5 rounded cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
