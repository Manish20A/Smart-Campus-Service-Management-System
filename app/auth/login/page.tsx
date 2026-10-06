"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid university email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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
      success("Welcome back to CampusDesk.");
      router.push("/student/requests");
    } catch (err: any) {
      toastError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: "student" | "staff" | "admin") => {
    switchDemoRole(role);
    success(`Logged in as Demo ${role.toUpperCase()}`);
    if (role === "admin") router.push("/admin/requests");
    else if (role === "staff") router.push("/staff/requests");
    else router.push("/student/requests");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="h-9 w-9 rounded-[8px] bg-[var(--accent)] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
            C
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            CampusDesk
          </span>
        </Link>
        <h2 className="text-xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
          Sign In to Your Campus Portal
        </h2>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Use your registered university email or pick a quick demo profile below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 space-y-6">
        {/* Quick Demo Access Box */}
        <div className="p-4 rounded-[10px] border border-[var(--border)] bg-[var(--surface-hover)]/40 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)]">
            <Sparkles className="h-3.5 w-3.5" />
            Instant One-Click Review Login
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin("student")}
              className="py-2 px-1 text-center rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[11px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              Student
              <span className="block text-[9px] text-[var(--foreground-subtle)] font-normal">Aria Chen</span>
            </button>
            <button
              onClick={() => handleQuickLogin("staff")}
              className="py-2 px-1 text-center rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[11px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              Faculty Staff
              <span className="block text-[9px] text-[var(--foreground-subtle)] font-normal">Prof. Elena</span>
            </button>
            <button
              onClick={() => handleQuickLogin("admin")}
              className="py-2 px-1 text-center rounded-[6px] border border-[var(--border)] bg-[var(--surface-elevated)] text-[11px] font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors cursor-pointer"
            >
              Administrator
              <span className="block text-[9px] text-[var(--foreground-subtle)] font-normal">Dean Vance</span>
            </button>
          </div>
        </div>

        {/* Regular Sign In Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="University Email Address"
                type="email"
                placeholder="name@campusdesk.edu"
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
                <div className="flex justify-end pt-1">
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

        <p className="text-center text-xs text-[var(--foreground-muted)]">
          Don&apos;t have an account yet?{" "}
          <Link href="/auth/register" className="text-[var(--accent)] font-semibold hover:underline">
            Register as a Student
          </Link>
        </p>
      </div>
    </div>
  );
}
