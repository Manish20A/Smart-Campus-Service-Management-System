"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { dataStore } from "@/lib/data/store";
import { Service } from "@/types";
import {
  Search,
  Clock,
  ArrowRight,
  HelpCircle,
  FileText,
  Award,
  Cpu,
  Wrench,
  Wifi,
  Zap,
  Droplets,
  CreditCard,
  HeartPulse,
  BookOpen,
  Home,
  KeyRound,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ServicesCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [faqService, setFaqService] = useState<Service | null>(null);

  const services = useMemo(() => dataStore.getServices(), []);

  const categoryTabs = [
    { id: "All", label: "All Services" },
    { id: "Academic", label: "Academic" },
    { id: "Facilities", label: "Housing & Repairs" },
    { id: "IT & Lab", label: "Labs & Computing" },
    { id: "Student Life", label: "Campus Access" },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchCat =
        selectedCategory === "All" || srv.category === selectedCategory;
      const matchSearch =
        search === "" ||
        srv.name.toLowerCase().includes(search.toLowerCase()) ||
        srv.description.toLowerCase().includes(search.toLowerCase()) ||
        srv.departmentName.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [services, selectedCategory, search]);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case "FileText":
        return <FileText className="h-4 w-4 text-[var(--accent)]" />;
      case "Award":
        return <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "Cpu":
        return <Cpu className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
      case "Wrench":
        return <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "Wifi":
        return <Wifi className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case "Zap":
        return <Zap className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
      case "Droplets":
        return <Droplets className="h-4 w-4 text-sky-600 dark:text-sky-400" />;
      case "CreditCard":
        return <CreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case "HeartPulse":
        return <HeartPulse className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "BookOpen":
        return <BookOpen className="h-4 w-4 text-violet-600 dark:text-violet-400" />;
      case "Home":
        return <Home className="h-4 w-4 text-amber-700 dark:text-amber-300" />;
      case "KeyRound":
        return <KeyRound className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <FileText className="h-4 w-4 text-[var(--accent)]" />;
    }
  };

  const formatTurnaround = (hours: number) => {
    if (hours <= 12) return `~${hours}h turnaround`;
    if (hours <= 24) return `~1 business day`;
    if (hours <= 48) return `~2 business days`;
    const days = Math.round(hours / 24);
    return `~${days} business days`;
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Calm Header */}
        <div className="pt-2 pb-1">
          <h1 className="text-2xl font-serif font-semibold tracking-tight text-[var(--foreground)]">
            Service Catalog
          </h1>
          <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
            Select any campus service below to submit an intake request.
          </p>
        </div>

        {/* Clean Filter Line */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {categoryTabs.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "All"
                  ? services.length
                  : services.filter((s) => s.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs rounded-[6px] font-medium transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[var(--surface-hover)] text-[var(--foreground)] font-semibold"
                      : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-[6px] border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Services Grid (Calm, clean cards) */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-8 w-8 rounded-[6px] bg-[var(--surface-hover)] flex items-center justify-center shrink-0">
                      {getServiceIcon(srv.icon)}
                    </div>
                    <span className="text-[11px] font-mono text-[var(--foreground-muted)] flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[var(--accent)]" />
                      {formatTurnaround(srv.slaHours)}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-semibold text-[var(--foreground)]">
                      {srv.name}
                    </h3>
                    <p className="text-[11px] text-[var(--accent)] font-medium mt-0.5">
                      {srv.departmentName}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-2">
                  {srv.faq && srv.faq.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setFaqService(srv)}
                      className="text-xs text-[var(--foreground-muted)] hover:text-[var(--accent)] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      FAQ
                    </button>
                  ) : (
                    <span className="text-[11px] text-[var(--foreground-subtle)]">
                      Instant Submission
                    </span>
                  )}

                  <Link href={`/services/${srv.id}/apply`}>
                    <Button size="sm" variant="primary" className="text-xs gap-1.5 h-7">
                      Apply
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[10px] bg-[var(--surface)] p-6">
            <p className="text-sm font-medium text-[var(--foreground)]">No matching services found</p>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Try searching for &quot;transcript&quot;, &quot;wifi&quot;, &quot;repair&quot;, or &quot;leave&quot;.
            </p>
          </div>
        )}

        {/* Guidance Modal */}
        {faqService && (
          <Modal
            isOpen={!!faqService}
            onClose={() => setFaqService(null)}
            title={`${faqService.name}`}
            description={`Guidelines from ${faqService.departmentName}`}
          >
            <div className="space-y-4 my-2">
              <div className="p-3 rounded-[6px] bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] leading-relaxed">
                {faqService.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  Frequently Asked Questions
                </h4>
                {faqService.faq?.map((faq, i) => (
                  <div key={i} className="border border-[var(--border)] rounded-[8px] p-3 space-y-1">
                    <p className="text-xs font-medium text-[var(--foreground)]">
                      Q: {faq.question}
                    </p>
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-[var(--border-subtle)]">
                <Button variant="outline" size="sm" onClick={() => setFaqService(null)}>
                  Close
                </Button>
                <Link href={`/services/${faqService.id}/apply`}>
                  <Button variant="primary" size="sm">
                    Apply for Service &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </DashboardLayout>
  );
}
