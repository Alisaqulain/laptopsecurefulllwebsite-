import { cn } from "@/lib/utils";

export function ErpPanel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4 shadow-sm md:p-5", className)}>{children}</div>
  );
}
