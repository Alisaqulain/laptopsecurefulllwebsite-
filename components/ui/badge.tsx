import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-electric-500/15 text-electric-300 border border-electric-500/30",
        accent:
          "bg-neon-500/15 text-neon-300 border border-neon-500/30",
        success:
          "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        warning:
          "bg-amber-500/15 text-amber-300 border border-amber-500/30",
        destructive:
          "bg-rose-500/15 text-rose-300 border border-rose-500/30",
        outline: "border border-border text-foreground/70",
        glow: "bg-gradient-to-r from-electric-500/20 to-neon-500/20 text-white border border-electric-500/40 shadow-glow-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
