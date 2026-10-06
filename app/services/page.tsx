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
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Card, CardContent } from "@/components/ui/Card";

export default function ServicesCatalogPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [faqService, setFaqService] = useState<Service | null>(null);

  const services = useMemo(() => dataStore.getServices(), []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(services.map((s) => s.category)));
    return ["All", ...cats];
  }, [services]);

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
        return <Award className="h-5 w-5 text-amber-600" />;
      case "Cpu":
        return <Cpu className="h-5 w-5 text-indigo-600" />;
      case "Wrench":
        return <Wrench className="h-5 w-5 text-blue-600" />;
      case "Wifi":
        return <Wifi className="h-5 w-5 text-teal-600" />;
      case "Zap":
        return <Zap className="h-5 w-5 text-orange-600" />;
      case "Droplets":
        return <Droplets className="h-5 w-5 text-sky-600" />;
      case "CreditCard":
        return <CreditCard className="h-5 w-5 text-rose-600" />;
      case "HeartPulse":
        return <HeartPulse className="h-5 w-5 text-emerald-600" />;
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-violet-600" />;
      case "Home":
        return <Home className="h-5 w-5 text-amber-700" />;
      case "KeyRound":
        return <KeyRound className="h-5 w-5 text-purple-600" />;
      default:
        return <FileText className="h-5 w-5 text-[var(--accent)]" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="border-b border-[var(--border-subtle)] pb-5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent)] font-semibold">
            Service Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[var(--foreground)] mt-1">
            Campus Service Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1 max-w-2xl leading-relaxed">
            Browse official university service workflows. Select a service to inspect requirements, estimated turnaround SLAs, or submit an intake application.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] font-medium shadow-xs"
                    : "bg-[var(--surface-elevated)] text-[var(--foreground-muted)] border-[var(--border)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search services or departments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((srv) => (
            <Card key={srv.id} hoverEffect className="flex flex-col justify-between">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="h-10 w-10 rounded-[8px] border border-[var(--border)] bg-[var(--surface-elevated)] flex items-center justify-center shrink-0 shadow-xs">
                    {getServiceIcon(srv.icon)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="subtle" size="sm">
                      <Clock className="h-3 w-3 text-[var(--accent)] mr-1" />
                      {srv.slaHours}h SLA
                    </Badge>
                    <span className="text-[10px] font-mono text-[var(--foreground-subtle)]">
                      {srv.code}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)]">
                    {srv.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[var(--accent)] mt-0.5">
                    {srv.departmentName}
                  </p>
                  <p className="text-xs text-[var(--foreground-muted)] mt-2 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </CardContent>

              <div className="px-5 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-hover)]/30 rounded-b-[10px] flex items-center justify-between gap-2">
                {srv.faq && srv.faq.length > 0 ? (
                  <button
                    onClick={() => setFaqService(srv)}
                    className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="h-3.5 w-3.5 text-[var(--foreground-subtle)]" />
                    FAQ & Guidelines
                  </button>
                ) : (
                  <span className="text-[11px] text-[var(--foreground-subtle)]">
                    Direct submission
                  </span>
                )}

                <Link href={`/services/${srv.id}/apply`}>
                  <Button size="sm" variant="primary" className="text-xs gap-1.5">
                    Apply
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-16 border border-dashed border-[var(--border)] rounded-[10px]">
            <p className="text-sm text-[var(--foreground)] font-medium">No matching services found</p>
            <p className="text-xs text-[var(--foreground-muted)] mt-1">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        )}

        {/* Service FAQ Modal */}
        {faqService && (
          <Modal
            isOpen={!!faqService}
            onClose={() => setFaqService(null)}
            title={`${faqService.name} — Guidance & FAQ`}
            description={`Guidelines provided by ${faqService.departmentName}`}
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
                    Proceed to Application &rarr;
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
