import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

type Props = {
  label: string;
  value: number;
  format?: "currency" | "number";
  sub?: string;
  className?: string;
};

export function StatCard({ label, value, format = "currency", sub, className }: Props) {
  const display =
    format === "currency" ? formatPrice(value) : new Intl.NumberFormat("en-IN").format(value);
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-semibold tabular-nums text-foreground">{display}</div>
      {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}
