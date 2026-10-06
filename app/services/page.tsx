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
  CheckCircle2,
  Building2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ServicesCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [faqService, setFaqService] = useState<Service | null>(null);

  const services = useMemo(() => dataStore.getServices(), []);

  // Simplified human-friendly category groups
  const categoryTabs = [
    { id: "All", label: "All Services", icon: "🌟" },
    { id: "Academic", label: "Academic & Records", icon: "📜" },
    { id: "Facilities", label: "Hostel & Repairs", icon: "🏢" },
    { id: "IT & Lab", label: "Labs & Computing", icon: "🔬" },
    { id: "Student Life", label: "Student Life & Access", icon: "🎓" },
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
        return <FileText className="h-5 w-5 text-[var(--accent)]" />;
      case "Award":
        return <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case "Cpu":
        return <Cpu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />;
      case "Wrench":
        return <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case "Wifi":
        return <Wifi className="h-5 w-5 text-teal-600 dark:text-teal-400" />;
      case "Zap":
        return <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      case "Droplets":
        return <Droplets className="h-5 w-5 text-sky-600 dark:text-sky-400" />;
      case "CreditCard":
        return <CreditCard className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
      case "HeartPulse":
        return <HeartPulse className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />;
      case "Home":
        return <Home className="h-5 w-5 text-amber-700 dark:text-amber-300" />;
      case "KeyRound":
        return <KeyRound className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
      default:
        return <FileText className="h-5 w-5 text-[var(--accent)]" />;
    }
  };

  const formatTurnaround = (hours: number) => {
    if (hours <= 12) return `Ready in ~${hours} hours`;
    if (hours <= 24) return `Ready in ~1 business day`;
    if (hours <= 48) return `Ready in ~2 business days`;
    const days = Math.round(hours / 24);
    return `Ready in ~${days} days`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Simple Page Header */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] p-6 sm:p-8 shadow-xs">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
              Official University Services
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1.5">
              Service Catalog
            </h1>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-2 leading-relaxed">
              Find and submit official requests across campus departments. All requests include automated tracking and email notifications at each milestone.
            </p>
          </div>

          {/* Clean Search Input */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--foreground-subtle)]" />
              <input
                type="text"
                placeholder="Search services (e.g. transcript, wifi, AC repair, lab gear, leave)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] text-xs text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-[8px] border text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs"
                      : "bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--border)] hover:border-[var(--foreground-subtle)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-[var(--surface-hover)] text-[var(--foreground-subtle)]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)] hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Icon + Turnaround Time */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-9 w-9 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-center shrink-0">
                        {getServiceIcon(srv.icon)}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--foreground-muted)] bg-[var(--surface-elevated)] px-2.5 py-1 rounded-[6px] border border-[var(--border)]">
                        <Clock className="h-3 w-3 text-[var(--accent)]" />
                        {formatTurnaround(srv.slaHours)}
                      </span>
                    </div>

                    {/* Title & Department */}
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[var(--foreground)] leading-snug">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-[var(--accent)] font-medium flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {srv.departmentName}
                      </p>
                    </div>

                    {/* Plain English Description */}
                    <p className="text-xs text-[var(--foreground-muted)] leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>

                    {/* Requirements Preview */}
                    <div className="p-2.5 rounded-[6px] bg-[var(--surface-hover)]/40 border border-[var(--border-subtle)] text-[11px] text-[var(--foreground-subtle)]">
                      <span className="font-medium text-[var(--foreground)] block mb-0.5">
                        Required info:
                      </span>
                      {srv.requiredFields.map((f) => f.label).slice(0, 2).join(", ")}
                      {srv.requiredFields.length > 2 && ` + ${srv.requiredFields.length - 2} more`}
                    </div>
                  </div>

                  {/* Actions Bar */}
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
                        Standard Form
                      </span>
                    )}

                    <Link href={`/services/${srv.id}/apply`}>
                      <Button size="sm" variant="primary" className="text-xs gap-1.5 h-8">
                        Start Request
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[10px] bg-[var(--surface)] p-8">
              <p className="text-sm font-semibold text-[var(--foreground)]">No matching services found</p>
              <p className="text-xs text-[var(--foreground-muted)] mt-1.5 max-w-sm mx-auto">
                No services match your search for &quot;{search}&quot;. Try a different keyword or click &quot;All Services&quot;.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
                className="mt-4 text-xs"
              >
                Clear Search & Filters
              </Button>
            </div>
          )}
        </div>

        {/* Guidance FAQ Modal */}
        {faqService && (
          <Modal
            isOpen={!!faqService}
            onClose={() => setFaqService(null)}
            title={`${faqService.name}`}
            description={`Guidelines & Instructions from ${faqService.departmentName}`}
          >
            <div className="space-y-4 my-2">
              <div className="p-3.5 rounded-[8px] bg-[var(--surface-hover)] border border-[var(--border)] text-xs text-[var(--foreground-muted)] leading-relaxed">
                {faqService.description}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                  Frequently Asked Questions
                </h4>
                {faqService.faq?.map((faq, i) => (
                  <div key={i} className="border border-[var(--border)] rounded-[8px] p-3 space-y-1">
                    <p className="text-xs font-semibold text-[var(--foreground)]">
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
                    Proceed to Request &rarr;
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
