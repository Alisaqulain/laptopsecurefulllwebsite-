import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors backdrop-blur-sm",
          "focus:outline-none focus:border-electric-500/60 focus:bg-secondary/60 focus:shadow-[0_0_0_3px_rgba(0,120,255,0.18)]",
          "disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
