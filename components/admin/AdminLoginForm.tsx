"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleKey } from "@/lib/auth/roles";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof Schema>;

export function AdminLoginForm() {
  const params = useSearchParams();
  const nextUrl = useMemo(() => params.get("next") || "", [params]);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await res.json().catch(() => null)) as any;
    if (!res.ok) {
      setServerError(data?.error?.message || "Login failed");
      return;
    }

    const role = data?.data?.user?.role as string | undefined;
    const byRole =
      role === RoleKey.SUPER_ADMIN
        ? "/erp/dashboard"
        : role === RoleKey.WEBSITE_ADMIN
          ? "/website-admin/dashboard"
          : role === RoleKey.SALES_ADMIN
            ? "/sales/dashboard"
            : "/admin";

    // Hard navigation is the most reliable way to ensure the httpOnly cookie is used immediately.
    window.location.assign(nextUrl || byRole);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" placeholder="admin@laptopsecure.com" {...form.register("email")} />
        {form.formState.errors.email?.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input type="password" placeholder="••••••••" {...form.register("password")} />
        {form.formState.errors.password?.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
        ) : null}
      </div>

      {serverError ? <div className="text-sm text-destructive">{serverError}</div> : null}

      <Button type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  );
}

