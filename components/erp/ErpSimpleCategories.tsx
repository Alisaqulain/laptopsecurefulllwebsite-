"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErpPanel } from "@/components/erp/ErpPanel";
import { formatDate } from "@/lib/utils";
import { slugify } from "@/lib/inventory/productMatch";
import { RoleKey } from "@/lib/auth/roles";

type Cat = { _id: string; name: string; slug: string; status: string; createdAt?: string };

export function ErpSimpleCategories({ role }: { role: string }) {
  const isSuper = role === RoleKey.SUPER_ADMIN;
  const showAll = isSuper;
  const [rows, setRows] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editing, setEditing] = useState<Cat | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
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

  async function createCategory() {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    const s = slug.trim() || slugify(name);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug: s, status: "active" }),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      toast.error(json?.error?.message || "Create failed");
      return;
    }
    toast.success("Category added");
    setName("");
    setSlug("");
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
      <ErpPanel>
        <h2 className="text-sm font-semibold">{editing ? "Edit category" : "Add category"}</h2>
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
            <div className="md:col-span-3 flex gap-2">
              <Button type="button" size="sm" onClick={saveEdit}>
                Save
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <div className="mb-1 text-xs text-muted-foreground">Category name *</div>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9" placeholder="e.g. Dell Laptop" />
            </div>
            <div className="flex-1">
              <div className="mb-1 text-xs text-muted-foreground">Slug (optional)</div>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="h-9" placeholder="Auto from name" />
            </div>
            <Button type="button" className="h-9" onClick={createCategory}>
              Add
            </Button>
          </div>
        )}
      </ErpPanel>

      <ErpPanel>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold">All categories</h2>
          <div className="flex max-w-xs flex-1 gap-2">
            <Input className="h-9" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="button" variant="outline" size="sm" onClick={load} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-md border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Name</th>
                <th className="px-3 py-2 font-medium">Slug</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Created</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                    No categories.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c._id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{c.slug}</td>
                    <td className="px-3 py-2">{c.status}</td>
                    <td className="px-3 py-2 text-muted-foreground">{c.createdAt ? formatDate(c.createdAt) : "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <Button type="button" variant="outline" size="sm" className="mr-2 h-8" onClick={() => setEditing(c)}>
                        Edit
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
