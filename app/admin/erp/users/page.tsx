"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleKey } from "@/lib/auth/roles";

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

export default function UsersPage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
        <p className="text-sm text-muted-foreground">Create staff accounts, assign roles, and activate/deactivate.</p>
      </div>

      {error ? <div className="text-sm text-destructive">{error}</div> : null}

      <Card className="glass p-4">
        <div className="text-sm font-medium">Create user</div>
        <form onSubmit={form.handleSubmit(create)} className="mt-4 grid gap-3 md:grid-cols-5">
          <Input placeholder="Name" {...form.register("name")} />
          <Input placeholder="Email" type="email" {...form.register("email")} />
          <Input placeholder="Phone" {...form.register("phone")} />
          <Input placeholder="Password" type="password" {...form.register("password")} />
          <select
            className="h-10 rounded-md border border-white/10 bg-white/5 px-3 text-sm"
            {...form.register("role")}
          >
            <option value={RoleKey.SUPER_ADMIN}>SUPER_ADMIN</option>
            <option value={RoleKey.WEBSITE_ADMIN}>WEBSITE_ADMIN</option>
            <option value={RoleKey.SALES_ADMIN}>SALES_ADMIN</option>
          </select>
          <div className="md:col-span-5">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Create user
            </Button>
          </div>
        </form>
      </Card>

      <Card className="glass p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">All users</div>
          <Button variant="secondary" size="sm" onClick={load} disabled={loading}>
            Refresh
          </Button>
        </div>

        {loading ? <div className="mt-3 text-sm text-muted-foreground">Loading…</div> : null}

        {!loading ? (
          <div className="mt-4 space-y-6">
            {[RoleKey.SUPER_ADMIN, RoleKey.WEBSITE_ADMIN, RoleKey.SALES_ADMIN].map((r) => (
              <div key={r}>
                <div className="text-xs font-semibold tracking-widest text-muted-foreground">{r}</div>
                <div className="mt-2 divide-y divide-white/5 rounded-xl border border-white/10 bg-white/5">
                  {(byRole.get(r) ?? []).map((u) => (
                    <div key={u._id} className="flex flex-col gap-2 p-3 md:flex-row md:items-center md:justify-between">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{u.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {u.email} {u.phone ? `· ${u.phone}` : ""} · {u.isActive === false ? "disabled" : "active"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => toggleActive(u)}>
                          {u.isActive === false ? "Activate" : "Deactivate"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => remove(u)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(byRole.get(r) ?? []).length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground">No users.</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </Card>
    </div>
  );
}

