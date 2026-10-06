"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  GraduationCap,
  Briefcase,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid university email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, switchDemoRole } = useAuth();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "student@campusdesk.edu",
      password: "password123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      success("Welcome to CampusDesk.");
      if (data.email.includes("admin")) {
        router.push("/admin/requests");
      } else if (data.email.includes("staff")) {
        router.push("/staff/requests");
      } else {
        router.push("/student/requests");
      }
    } catch (err: any) {
      toastError(err?.message || "Failed to sign in. Please try one of the demo buttons above.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: "student" | "staff" | "admin") => {
    switchDemoRole(role);
    success(`Signed in as ${role === "student" ? "Student (Aria Chen)" : role === "staff" ? "Faculty Staff (Prof. Elena)" : "Administrator (Dr. Vance)"}`);
    if (role === "admin") router.push("/admin/requests");
    else if (role === "staff") router.push("/staff/requests");
    else router.push("/student/requests");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="h-10 w-10 rounded-[8px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm">
            C
          </div>
          <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            CampusDesk
          </span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-serif font-semibold text-[var(--foreground)]">
          Sign In to Your Campus Portal
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1.5 max-w-md mx-auto">
          Explore as a student, faculty specialist, or administrator with instant 1-click access below.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl space-y-6">
        {/* Instant 1-Click Role Profiles */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
              <Sparkles className="h-3.5 w-3.5" />
              1-Click Instant Demo Portals
            </span>
            <span className="text-[11px] text-[var(--foreground-subtle)]">No password needed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Student Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin("student")}
              className="text-left p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-8 w-8 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-2.5">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div className="font-serif text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  Student Portal
                </div>
                <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5">
                  Aria Chen • Junior
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-2 line-clamp-2">
                  Track tickets, submit requests & view timelines.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-medium text-[var(--accent)]">
                Enter Portal
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Staff Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin("staff")}
              className="text-left p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="font-serif text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  Faculty Staff
                </div>
                <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5">
                  Prof. Elena Rostova
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-2 line-clamp-2">
                  Review queue, assign specialists & resolve tickets.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-medium text-[var(--accent)]">
                Enter Queue
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => handleQuickLogin("admin")}
              className="text-left p-3.5 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] hover:border-[var(--accent)] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-8 w-8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2.5">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div className="font-serif text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                  Administrator
                </div>
                <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5">
                  Dr. Arthur Vance
                </p>
                <p className="text-[10px] text-[var(--foreground-muted)] mt-2 line-clamp-2">
                  Workload analytics, SLAs, catalog & governance.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-medium text-[var(--accent)]">
                Enter Admin
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Regular Sign-In Box */}
        <Card className="border border-[var(--border)]">
          <CardContent className="p-6">
            <div className="text-xs font-medium uppercase tracking-wider text-[var(--foreground-subtle)] mb-4">
              Or Sign In With Email
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="University Email"
                type="email"
                placeholder="student@campusdesk.edu"
                error={errors.email?.message}
                {...register("email")}
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[var(--foreground-subtle)]">
                    Demo hint: any password works
                  </span>
                  <Link
                    href="/auth/reset"
                    className="text-[11px] text-[var(--accent)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Sign In &rarr;
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Link */}
        <p className="text-center text-xs text-[var(--foreground-muted)]">
          Need a new student profile?{" "}
          <Link href="/auth/register" className="text-[var(--accent)] font-semibold hover:underline">
            Register your student account
          </Link>
        </p>
      </div>
    </div>
  );
}
