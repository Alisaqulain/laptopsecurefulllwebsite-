import { ErpPanel } from "@/components/erp/ErpPanel";

export function ErpComingSoon({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <ErpPanel>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        This module is scaffolded for production wiring (API + tables). {children}
      </p>
    </ErpPanel>
  );
}
