"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate, formatPrice } from "@/lib/utils";

type Supplier = {
  _id: string;
  name: string;
  phone?: string;
  address?: string;
  gstNumber?: string;
  notes?: string;
  status?: string;
};

type PurchaseRow = { _id: string; invoiceNumber: string; date: string; totals?: { finalTotal?: number } };

export function ErpSimpleSuppliers() {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Supplier | null>(null);
  const [purchases, setPurchases] = useState<PurchaseRow[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Supplier | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/suppliers", { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    setRows(res.ok ? json?.data?.suppliers ?? [] : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function loadDetail(s: Supplier) {
    setSelected(s);
    setDetailLoading(true);
    const res = await fetch(`/api/suppliers/${s._id}`, { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    setPurchases(res.ok ? json?.data?.purchases ?? [] : []);
    setDetailLoading(false);
  }

  async function addSupplier() {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        gstNumber: gstNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      }),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Failed");
      return;
    }
    toast.success("Supplier added");
    setName("");
    setPhone("");
    setAddress("");
    setGstNumber("");
    setNotes("");
    void load();
  }

  async function saveEdit() {
    if (!editId || !editForm) return;
    const res = await fetch(`/api/suppliers/${editId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address,
        gstNumber: editForm.gstNumber,
        notes: editForm.notes,
        status: editForm.status,
      }),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Update failed");
      return;
    }
    toast.success("Saved");
    setEditId(null);
    setEditForm(null);
    void load();
    if (selected?._id === editId) void loadDetail(selected);
  }

  async function remove(id: string) {
    if (!confirm("Delete this supplier?")) return;
    const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Delete failed");
      return;
    }
    toast.success("Deleted");
    if (selected?._id === id) {
      setSelected(null);
      setPurchases([]);
    }
    void load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <ErpPanel>
          <h2 className="text-sm font-semibold">Add supplier</h2>
          <div className="mt-3 grid gap-3">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Name *</div>
              <Input className="h-9" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Phone</div>
                <Input className="h-9" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">GST number</div>
                <Input className="h-9" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Address</div>
              <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Notes</div>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button type="button" className="w-fit" onClick={addSupplier}>
              Save supplier
            </Button>
          </div>
        </ErpPanel>

        <ErpPanel>
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Suppliers</h2>
            <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>
          <div className="mt-3 overflow-x-auto rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      Loading…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                      No suppliers yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((s) => (
                    <tr
                      key={s._id}
                      className={`cursor-pointer border-t border-border ${selected?._id === s._id ? "bg-muted/50" : ""}`}
                      onClick={() => void loadDetail(s)}
                    >
                      <td className="px-3 py-2 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{s.phone ?? "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mr-2 h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditId(s._id);
                            setEditForm({ ...s });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            void remove(s._id);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </ErpPanel>
      </div>

      <div className="space-y-4">
        {editId && editForm ? (
          <ErpPanel>
            <h2 className="text-sm font-semibold">Edit supplier</h2>
            <div className="mt-3 grid gap-3">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Name</div>
                <Input className="h-9" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">Phone</div>
                  <Input className="h-9" value={editForm.phone ?? ""} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">GST</div>
                  <Input
                    className="h-9"
                    value={editForm.gstNumber ?? ""}
                    onChange={(e) => setEditForm({ ...editForm, gstNumber: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Address</div>
                <Textarea rows={2} value={editForm.address ?? ""} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Notes</div>
                <Textarea rows={2} value={editForm.notes ?? ""} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Status</div>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                  value={editForm.status ?? "active"}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" onClick={saveEdit}>
                  Save
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => { setEditId(null); setEditForm(null); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </ErpPanel>
        ) : null}

        <ErpPanel>
          <h2 className="text-sm font-semibold">Purchase history</h2>
          <p className="mt-1 text-xs text-muted-foreground">Select a supplier from the list.</p>
          {!selected ? (
            <p className="mt-4 text-sm text-muted-foreground">No supplier selected.</p>
          ) : detailLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-md border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Date</th>
                    <th className="px-3 py-2 font-medium">Invoice</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                        No purchases for this supplier.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((p) => (
                      <tr key={p._id} className="border-t border-border">
                        <td className="px-3 py-2 text-muted-foreground">{formatDate(p.date)}</td>
                        <td className="px-3 py-2 font-mono text-xs">{p.invoiceNumber?.trim() ? p.invoiceNumber : "—"}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{formatPrice(p.totals?.finalTotal ?? 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </ErpPanel>
      </div>
    </div>
  );
}
