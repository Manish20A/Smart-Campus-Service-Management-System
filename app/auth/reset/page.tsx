"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function PasswordResetPage() {
  const { resetPassword } = useAuth();
  const { success, error: toastError } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setIsSent(true);
      success("Password recovery link sent.");
    } catch (err: any) {
      toastError(err.message || "Failed to send reset link.");
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
          Password Recovery
        </h2>
        <p className="text-xs text-[var(--foreground-muted)] mt-1">
          Enter your university email address to receive secure reset instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card>
          <CardContent className="p-6">
            {isSent ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-[var(--sage)] mx-auto" />
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  Reset Email Dispatched
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  We have forwarded password reset instructions to <strong>{email}</strong>.
                  Check your institutional mailbox.
                </p>
                <div className="pt-2">
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered University Email"
                  type="email"
                  placeholder="name@campusdesk.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full mt-2"
                >
                  Send Recovery Link
                </Button>

                <div className="text-center pt-2">
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center gap-1 text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
