"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RequestsTableManager } from "@/components/dashboard/RequestsTableManager";
import { useAuth } from "@/context/AuthContext";

export default function StaffRequestsPage() {
  const { user } = useAuth();
  const deptName = user?.departmentName || "Department Queue";

  return (
    <DashboardLayout>
      <RequestsTableManager
        title={`${deptName} Queue`}
        subtitle="Operational intake and active requests assigned to your department specialists."
        departmentScopeOnly={true}
      />
    </DashboardLayout>
  );
}
