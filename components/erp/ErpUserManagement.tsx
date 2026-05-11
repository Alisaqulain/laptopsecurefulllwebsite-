"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleKey } from "@/lib/auth/roles";
import { ErpPanel } from "@/components/erp/ErpPanel";

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: string;
  isActive?: boolean;
  createdAt?: string;
};

const CreateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(10),
  phone: z.string().optional(),
  role: z.enum([RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN]),
});

type CreateValues = z.infer<typeof CreateSchema>;

export function ErpUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<CreateValues>({
    resolver: zodResolver(CreateSchema),
    defaultValues: { name: "", email: "", password: "", phone: "", role: RoleKey.SALES_ADMIN },
  });

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/users", { cache: "no-store" });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setError(json?.error?.message || "Failed to load users");
      setUsers([]);
      setLoading(false);
      return;
    }
    setUsers(json.data.users ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  const byRole = useMemo(() => {
    const map = new Map<string, User[]>();
    for (const u of users) map.set(u.role, [...(map.get(u.role) ?? []), u]);
    return map;
  }, [users]);

  async function create(values: CreateValues) {
    setError(null);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setError(json?.error?.message || "Failed to create user");
      return;
    }
    form.reset({ name: "", email: "", password: "", phone: "", role: RoleKey.SALES_ADMIN });
    await load();
  }

  async function toggleActive(u: User) {
    const res = await fetch(`/api/users/${u._id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: !(u.isActive ?? true) }),
    });
    if (res.ok) await load();
  }

  async function remove(u: User) {
    const okRemove = window.confirm(`Delete user ${u.email}?`);
    if (!okRemove) return;
    const res = await fetch(`/api/users/${u._id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{error}</div> : null}

      <ErpPanel>
        <div className="text-sm font-semibold text-foreground">Create user</div>
        <form onSubmit={form.handleSubmit(create)} className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
          <Input placeholder="Name" className="h-9" {...form.register("name")} />
          <Input placeholder="Email" type="email" className="h-9" {...form.register("email")} />
          <Input placeholder="Phone" className="h-9" {...form.register("phone")} />
          <Input placeholder="Password" type="password" className="h-9" {...form.register("password")} />
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            {...form.register("role")}
          >
            <option value={RoleKey.SUPER_ADMIN}>SUPER_ADMIN</option>
            <option value={RoleKey.WEBSITE_ADMIN}>WEBSITE_ADMIN</option>
            <option value={RoleKey.SALES_ADMIN}>SALES_ADMIN</option>
          </select>
          <Button type="submit" className="h-9" disabled={form.formState.isSubmitting}>
            Create
          </Button>
        </form>
      </ErpPanel>

      <ErpPanel>
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-foreground">Directory</div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? <div className="mt-3 text-sm text-muted-foreground">Loading…</div> : null}

        {!loading ? (
          <div className="mt-4 space-y-5">
            {[RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN].map((r) => (
              <div key={r}>
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r}</div>
                <div className="mt-2 overflow-hidden rounded-md border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/80 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Name</th>
                        <th className="px-3 py-2 font-medium">Email</th>
                        <th className="px-3 py-2 font-medium">Status</th>
                        <th className="px-3 py-2 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(byRole.get(r) ?? []).length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-3 py-4 text-center text-muted-foreground">
                            No users.
                          </td>
                        </tr>
                      ) : (
                        (byRole.get(r) ?? []).map((u) => (
                          <tr key={u._id} className="border-t border-border">
                            <td className="px-3 py-2 font-medium">{u.name}</td>
                            <td className="px-3 py-2 text-muted-foreground">{u.email}</td>
                            <td className="px-3 py-2 text-xs">{u.isActive === false ? "Disabled" : "Active"}</td>
                            <td className="px-3 py-2 text-right">
                              <div className="inline-flex gap-1">
                                <Button type="button" variant="outline" size="sm" onClick={() => toggleActive(u)}>
                                  {u.isActive === false ? "Activate" : "Deactivate"}
                                </Button>
                                <Button type="button" variant="destructive" size="sm" onClick={() => remove(u)}>
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </ErpPanel>
    </div>
  );
}
