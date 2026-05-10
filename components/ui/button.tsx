import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-electric-500 to-electric-600 text-white shadow-glow-blue hover:shadow-[0_0_30px_rgba(0,120,255,0.7)] hover:scale-[1.02] active:scale-[0.98] btn-shine",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-electric-500/40 bg-transparent text-electric-400 hover:bg-electric-500/10 hover:border-electric-400 hover:text-electric-300 hover:shadow-glow-soft",
        ghost:
          "text-foreground hover:bg-white/5 hover:text-electric-400",
        accent:
          "bg-gradient-to-r from-neon-500 to-neon-600 text-white shadow-glow-orange hover:shadow-[0_0_30px_rgba(255,107,0,0.7)] hover:scale-[1.02] active:scale-[0.98] btn-shine",
        link:
          "text-electric-400 underline-offset-4 hover:underline hover:text-electric-300",
        whatsapp:
          "bg-[#25D366] hover:bg-[#1ebe5b] text-white shadow-[0_0_25px_rgba(37,211,102,0.45)] btn-shine",
        glass:
          "glass text-foreground hover:bg-white/10 hover:border-electric-500/40 hover:shadow-glow-soft",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-8 py-3 text-base",
        xl: "h-14 px-10 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
