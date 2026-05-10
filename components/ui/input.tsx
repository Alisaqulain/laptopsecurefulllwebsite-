import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-secondary/40 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors backdrop-blur-sm",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus:outline-none focus:border-electric-500/60 focus:bg-secondary/60 focus:shadow-[0_0_0_3px_rgba(0,120,255,0.18)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
