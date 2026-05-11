"use client";

import { useState } from "react";
import { PurchaseEntryForm } from "@/components/erp/PurchaseEntryForm";
import { PurchaseListTable } from "@/components/erp/PurchaseListTable";

export function PurchasePageBody() {
  const [refreshKey, setRefreshKey] = useState(0);
  return (
    <>
      <PurchaseEntryForm onSaved={() => setRefreshKey((k) => k + 1)} />
      <div className="mt-8">
        <PurchaseListTable refreshKey={refreshKey} />
      </div>
    </>
  );
}
