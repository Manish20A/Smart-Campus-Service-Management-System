"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { dataStore } from "@/lib/data/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const registerSchema = z.object({
  displayName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rollNumber: z.string().min(3, "Student roll number is required (e.g. CS-2024-001)"),
  departmentId: z.string().min(1, "Please select your academic department"),
  year: z.string().min(1, "Please select your academic year"),
  phone: z.string().min(7, "Valid phone contact is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerAuth } = useAuth();
  const { success, error: toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const departments = useMemo(() => dataStore.getDepartments(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerAuth({
        email: data.email,
        pass: data.password,
        displayName: data.displayName,
        rollNumber: data.rollNumber,
        departmentId: data.departmentId,
        year: data.year,
        phone: data.phone,
      });
      success("Student registration complete. Welcome!");
      router.push("/student/requests");
    } catch (err: any) {
      toastError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
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
          Register Student Account
        </h2>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Join the campus service portal to submit and monitor academic & campus requests.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Legal Name"
                placeholder="Aria Chen"
                error={errors.displayName?.message}
                {...register("displayName")}
              />

              <Input
                label="University Email"
                type="email"
                placeholder="a.chen@campusdesk.edu"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Roll / Student ID"
                  placeholder="CS-2024-0491"
                  error={errors.rollNumber?.message}
                  {...register("rollNumber")}
                />

                <Input
                  label="Phone Number"
                  placeholder="+1 (555) 019-2831"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>

              <Select
                label="Academic Department"
                error={errors.departmentId?.message}
                {...register("departmentId")}
              >
                <option value="">Select your department...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.code})
                  </option>
                ))}
              </Select>

              <Select
                label="Academic Standing / Year"
                error={errors.year?.message}
                {...register("year")}
              >
                <option value="">Select year...</option>
                <option value="1st Year (Freshman)">1st Year (Freshman)</option>
                <option value="2nd Year (Sophomore)">2nd Year (Sophomore)</option>
                <option value="3rd Year (Junior)">3rd Year (Junior)</option>
                <option value="4th Year (Senior)">4th Year (Senior)</option>
                <option value="Postgraduate / PhD">Postgraduate / PhD</option>
              </Select>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Create Account &rarr;
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-[var(--foreground-muted)] mt-6">
          Already registered?{" "}
          <Link href="/auth/login" className="text-[var(--accent)] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
