"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErpPanel } from "@/components/erp/ErpPanel";

type Settings = {
  company?: {
    name?: string;
    logoUrl?: string | null;
    address?: string | null;
    gstNumber?: string | null;
    phone?: string | null;
    email?: string | null;
  };
  invoice?: { terms?: string[]; signatureLabel?: string; prefix?: string };
};

export function ErpSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<Settings>({});

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as any;
      if (res.ok) setData(json?.data?.settings ?? {});
      setLoading(false);
    })();
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ company: data.company, invoice: data.invoice }),
    });
    const json = (await res.json().catch(() => null)) as any;
    setSaving(false);
    if (!res.ok) {
      toast.error(json?.error?.message || "Save failed");
      return;
    }
    toast.success("Settings saved");
    setData(json?.data?.settings ?? data);
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const c = data.company ?? {};

  return (
    <ErpPanel>
      <h2 className="text-sm font-semibold">Company</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Business name</div>
          <Input className="h-9" value={c.name ?? ""} onChange={(e) => setData({ ...data, company: { ...c, name: e.target.value } })} />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">GST number</div>
          <Input className="h-9" value={c.gstNumber ?? ""} onChange={(e) => setData({ ...data, company: { ...c, gstNumber: e.target.value } })} />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Phone</div>
          <Input className="h-9" value={c.phone ?? ""} onChange={(e) => setData({ ...data, company: { ...c, phone: e.target.value } })} />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Email</div>
          <Input className="h-9" value={c.email ?? ""} onChange={(e) => setData({ ...data, company: { ...c, email: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <div className="mb-1 text-xs text-muted-foreground">Address</div>
          <Textarea rows={3} value={c.address ?? ""} onChange={(e) => setData({ ...data, company: { ...c, address: e.target.value } })} />
        </div>
        <div className="md:col-span-2">
          <div className="mb-1 text-xs text-muted-foreground">Logo URL (optional)</div>
          <Input className="h-9" value={c.logoUrl ?? ""} onChange={(e) => setData({ ...data, company: { ...c, logoUrl: e.target.value } })} />
        </div>
      </div>

      <h2 className="mt-8 text-sm font-semibold">Invoice</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Number prefix</div>
          <Input
            className="h-9"
            value={data.invoice?.prefix ?? "LS"}
            onChange={(e) => setData({ ...data, invoice: { ...data.invoice, prefix: e.target.value } })}
          />
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Signature label</div>
          <Input
            className="h-9"
            value={data.invoice?.signatureLabel ?? ""}
            onChange={(e) => setData({ ...data, invoice: { ...data.invoice, signatureLabel: e.target.value } })}
          />
        </div>
        <div className="md:col-span-2">
          <div className="mb-1 text-xs text-muted-foreground">Terms (one per line)</div>
          <Textarea
            rows={4}
            value={(data.invoice?.terms ?? []).join("\n")}
            onChange={(e) =>
              setData({
                ...data,
                invoice: {
                  ...data.invoice,
                  terms: e.target.value
                    .split("\n")
                    .map((t) => t.trim())
                    .filter(Boolean),
                },
              })
            }
          />
        </div>
      </div>

      <div className="mt-6">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </div>
    </ErpPanel>
  );
}
