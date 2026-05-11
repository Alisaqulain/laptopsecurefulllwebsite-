"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { PurchaseEntryForm } from "@/components/erp/PurchaseEntryForm";
import { PurchaseListTable } from "@/components/erp/PurchaseListTable";

type Supplier = {
  _id: string;
  name: string;
  phone?: string;
  gstNumber?: string;
  status?: string;
};

export function PurchasePageBody() {
  const [step, setStep] = useState<"suppliers" | "form">("suppliers");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [presetSupplierId, setPresetSupplierId] = useState<string | undefined>(undefined);
  const [formKey, setFormKey] = useState(0);
  /** Drives `PurchaseListTable` filter while on purchase entry — one list, no duplicate “this supplier” panel. */
  const [purchaseListSupplierId, setPurchaseListSupplierId] = useState("");

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/suppliers", { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    setSuppliers(res.ok ? json?.data?.suppliers ?? [] : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  useEffect(() => {
    if (step === "form") {
      setPurchaseListSupplierId(presetSupplierId ? String(presetSupplierId) : "");
    } else {
      setPurchaseListSupplierId("");
    }
  }, [step, presetSupplierId]);

  const onPurchaseSupplierChange = useCallback((id: string) => {
    setPurchaseListSupplierId(id);
  }, []);

  function openPurchaseEntry(supplierId?: string) {
    setPresetSupplierId(supplierId != null && supplierId !== "" ? String(supplierId) : undefined);
    setFormKey((k) => k + 1);
    setStep("form");
  }

  function backToSuppliers() {
    setStep("suppliers");
    setPresetSupplierId(undefined);
    void loadSuppliers();
  }

  if (step === "form") {
    return (
      <>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={backToSuppliers}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to suppliers
          </Button>
        </div>
        <PurchaseEntryForm
          key={`${formKey}-${presetSupplierId ?? ""}`}
          initialSupplierId={presetSupplierId ?? ""}
          onSupplierChange={onPurchaseSupplierChange}
          onSaved={() => {
            setRefreshKey((k) => k + 1);
            void loadSuppliers();
          }}
        />
        <div className="mt-8">
          <PurchaseListTable refreshKey={refreshKey} supplierId={purchaseListSupplierId || undefined} />
        </div>
      </>
    );
  }

  return (
    <>
      <ErpPanel>
        <div>
          <h2 className="text-sm font-semibold">Suppliers</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Review who you buy from. Use <strong>Purchase entry</strong> on a row to record stock inward for that supplier.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[360px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Supplier name</th>
                <th className="px-3 py-2 font-medium">Phone</th>
                <th className="px-3 py-2 font-medium">GST</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                    Loading suppliers…
                  </td>
                </tr>
              ) : suppliers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">
                    No suppliers yet. Add them under <strong>Suppliers</strong> in the sidebar.
                  </td>
                </tr>
              ) : (
                suppliers.map((s) => (
                  <tr key={s._id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{s.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{s.phone ?? "—"}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{s.gstNumber ?? "—"}</td>
                    <td className="px-3 py-2 capitalize">{s.status ?? "active"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button type="button" variant="outline" size="sm" className="h-8" onClick={() => openPurchaseEntry(String(s._id))}>
                        Purchase entry
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ErpPanel>

      <div className="mt-8">
        <PurchaseListTable refreshKey={refreshKey} />
      </div>
    </>
  );
}
