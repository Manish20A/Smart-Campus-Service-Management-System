"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RequestsTableManager } from "@/components/dashboard/RequestsTableManager";

export default function AdminRequestsPage() {
  return (
    <DashboardLayout>
      <RequestsTableManager
        title="Campus Service Desk Central"
        subtitle="Full administrative control over institutional queues, triages, SLA compliance, and dispatch."
        departmentScopeOnly={false}
      />
    </DashboardLayout>
  );
}
