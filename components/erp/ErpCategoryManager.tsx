"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate } from "@/lib/utils";
import { slugify } from "@/lib/inventory/productMatch";
import { RoleKey } from "@/lib/auth/roles";
import type { CategoryFieldDef } from "@/lib/inventory/categoryFieldTypes";
import { CategoryFieldBuilderDialog } from "@/components/erp/CategoryFieldBuilderDialog";
import { AddCategoryWizardDialog } from "@/components/erp/AddCategoryWizardDialog";

type Cat = {
  _id: string;
  name: string;
  slug: string;
  status: string;
  fieldDefinitions?: CategoryFieldDef[];
  createdAt?: string;
};

export function ErpCategoryManager({ role }: { role: string }) {
  const isSuper = role === RoleKey.SUPER_ADMIN;
  const showAll = isSuper;
  const [rows, setRows] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [fieldEditor, setFieldEditor] = useState<Cat | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    await fetch("/api/categories/seed-defaults", { method: "POST" }).catch(() => null);
    const url = showAll ? "/api/categories?all=1" : "/api/categories";
    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    setRows(res.ok ? json?.data?.categories ?? [] : []);
    setLoading(false);
  }, [showAll]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = rows.filter((c) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.slug.toLowerCase().includes(s);
  });

  async function seedDefaults() {
    if (!isSuper && role !== RoleKey.WEBSITE_ADMIN) return;
    setSeeding(true);
    const res = await fetch("/api/categories/seed-defaults", { method: "POST" });
    const json = (await res.json().catch(() => null)) as any;
    setSeeding(false);
    if (!res.ok) {
      toast.error(json?.error?.message || "Seed failed");
      return;
    }
    toast.success(`Defaults: ${json?.data?.created ?? 0} created, ${json?.data?.updatedSchemas ?? 0} schemas filled.`);
    void load();
  }

  async function saveEdit() {
    if (!editing) return;
    const res = await fetch(`/api/categories/${editing._id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: editing.name.trim(),
        slug: editing.slug.trim() || slugify(editing.name),
        status: editing.status,
      }),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Update failed");
      return;
    }
    toast.success("Saved");
    setEditing(null);
    void load();
  }

  async function remove(id: string) {
    if (!isSuper) return;
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Delete failed");
      return;
    }
    toast.success("Deleted");
    void load();
  }

  return (
    <div className="space-y-4">
      <AddCategoryWizardDialog open={wizardOpen} onClose={() => setWizardOpen(false)} onCreated={() => void load()} />

      <CategoryFieldBuilderDialog
        category={fieldEditor}
        open={!!fieldEditor}
        onClose={() => setFieldEditor(null)}
        onSaved={() => void load()}
      />

      <ErpPanel>
        <h2 className="text-sm font-semibold">{editing ? "Edit category" : "Categories"}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {editing
            ? "Update name, slug, or status. For field schema changes, use Configure fields on the row below."
            : "Categories drive purchase forms and product attributes. Add a category in one step (basics + fields), or use Configure fields on an existing row to adjust the schema — no code changes."}
        </p>
        {editing ? (
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Name</div>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="h-9" />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Slug</div>
              <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="h-9" />
            </div>
            <div>
              <div className="mb-1 text-xs text-muted-foreground">Status</div>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={editing.status}
                onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button type="button" onClick={() => setWizardOpen(true)}>
              Add category
            </Button>
          </div>
        )}
      </ErpPanel>

      <ErpPanel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">All categories</h2>
          <div className="flex flex-wrap items-center gap-2">
            {isSuper || role === RoleKey.WEBSITE_ADMIN ? (
              <Button type="button" variant="secondary" size="sm" onClick={() => void seedDefaults()} disabled={seeding}>
                {seeding ? "Seeding…" : "Seed Laptop / PC / Accessories / Parts"}
              </Button>
            ) : null}
            <div className="flex max-w-xs flex-1 gap-2">
              <Input className="h-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
              <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Slug</th>
                <th className="px-3 py-2 font-medium">Fields</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
                    No categories.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{c.slug}</td>
                    <td className="px-3 py-2 tabular-nums">{c.fieldDefinitions?.length ?? 0}</td>
                    <td className="px-3 py-2">{c.status}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.createdAt ? formatDate(c.createdAt) : "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button type="button" variant="outline" size="sm" className="mr-1 h-8" onClick={() => setEditing(c)}>
                        Edit
                      </Button>
                      <Button type="button" variant="secondary" size="sm" className="mr-1 h-8" onClick={() => setFieldEditor(c)}>
                        Configure fields
                      </Button>
                      {isSuper ? (
                        <Button type="button" variant="destructive" size="sm" className="h-8" onClick={() => remove(c._id)}>
                          Delete
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ErpPanel>
    </div>
  );
}
