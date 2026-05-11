"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  enabled: boolean;
};

function demoApiUrl(path: string) {
  if (typeof window === "undefined") return path;
  const base = window.location.origin;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

const postJson: RequestInit = {
  method: "POST",
  credentials: "include",
  cache: "no-store",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: "{}",
};

function networkToastMessage(err: unknown): string {
  if (err instanceof TypeError) {
    return "Could not reach the server. Confirm `npm run dev` is running, you are on the same host/port as this page, and MongoDB is up (check .env MONGODB_URI).";
  }
  if (err instanceof Error) return err.message;
  return "Request failed.";
}

function reloadAfterToast() {
  /** Full reload avoids `router.refresh()` RSC fetch failures in dev (shows as TypeError: Failed to fetch). */
  window.setTimeout(() => window.location.reload(), 450);
}

export function ErpDemoDataToolbar({ enabled }: Props) {
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  if (!enabled) return null;

  async function seed() {
    setSeeding(true);
    try {
      const res = await fetch(demoApiUrl("/api/erp/demo/seed"), postJson);
      const json = (await res.json().catch(() => null)) as { data?: { message?: string }; error?: { message?: string } };
      if (!res.ok) {
        toast.error(json?.error?.message || "Could not seed demo data");
        return;
      }
      toast.success(json?.data?.message ?? "Demo data created.");
      reloadAfterToast();
    } catch (e) {
      toast.error(networkToastMessage(e));
    } finally {
      setSeeding(false);
    }
  }

  async function clear() {
    setClearing(true);
    try {
      const res = await fetch(demoApiUrl("/api/erp/demo/clear"), postJson);
      const json = (await res.json().catch(() => null)) as { data?: { message?: string }; error?: { message?: string } };
      if (!res.ok) {
        toast.error(json?.error?.message || "Could not clear demo data");
        return;
      }
      toast.success(json?.data?.message ?? "Demo data cleared.");
      setConfirmClear(false);
      reloadAfterToast();
    } catch (e) {
      toast.error(networkToastMessage(e));
    } finally {
      setClearing(false);
    }
  }

  return (
    <>
      {confirmClear ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="demo-clear-title"
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <h2 id="demo-clear-title" className="text-base font-semibold text-foreground">
              Clear demo data
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to clear demo data? Demo categories, suppliers, purchases, sales, and demo product stock
              will be removed. Admin accounts and settings stay as they are.
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmClear(false)} disabled={clearing}>
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  void clear().catch((e) => toast.error(networkToastMessage(e)));
                }}
                disabled={clearing}
              >
                {clearing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Clearing…
                  </>
                ) : (
                  "Clear Demo Data"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <Button
        type="button"
        size="sm"
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={seeding || clearing}
        onClick={() => {
          void seed().catch((e) => toast.error(networkToastMessage(e)));
        }}
      >
        {seeding ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seeding…
          </>
        ) : (
          "Seed Demo Data"
        )}
      </Button>
      <Button type="button" size="sm" variant="destructive" disabled={seeding || clearing} onClick={() => setConfirmClear(true)}>
        Clear Demo Data
      </Button>
    </>
  );
}
